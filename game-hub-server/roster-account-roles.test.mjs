import test from 'node:test';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const { assertAccountRoles } = createRequire(import.meta.url)('./roster-account-roles');
const source = readFileSync(new URL('./classroom-platform.js', import.meta.url), 'utf8');
async function withDb(run) {
  const db = new PGlite();
  try {
    await db.exec(`CREATE TABLE school_students(school_id int, student_email text, guardian1_email text, guardian2_email text, user_id int);
      CREATE TABLE classroom_students(student_email text, guardian1_email text, guardian2_email text, roster_active boolean, user_id int);
      CREATE TABLE classroom_teachers(school_id int, google_email text, user_id int);
      CREATE TABLE classroom_users(id int,email text);`);
    await run(db);
  } finally { await db.close(); }
}
test('teacher-parent combinations work in the same school and across schools, with multiple children', async () => {
  await withDb(async db => {
    await db.exec(`INSERT INTO classroom_teachers(school_id,google_email) VALUES (1,'adult@example.test');
      INSERT INTO school_students(school_id,student_email,guardian1_email,guardian2_email) VALUES (1,'child1@example.test','adult@example.test',NULL),
        (2,'child2@example.test','adult@example.test',NULL);`);
    await assertAccountRoles(db, ['adult@example.test','child1@example.test','child2@example.test']);
  });
});
test('a student cannot be a guardian or teacher in any school; case and whitespace do not bypass checks', async () => {
  await withDb(async db => {
    await db.exec(`INSERT INTO school_students(school_id,student_email,guardian1_email,guardian2_email) VALUES (1,'Student@Example.test',NULL,NULL),
      (2,'another@example.test',' student@example.test ',NULL);
      INSERT INTO classroom_teachers(school_id,google_email) VALUES (3,'teacher@example.test');
      INSERT INTO classroom_students(student_email,guardian1_email,guardian2_email,roster_active) VALUES ('teacher@example.test',NULL,NULL,TRUE);`);
    for (const email of [' STUDENT@example.test ', 'teacher@example.test']) {
      await assert.rejects(assertAccountRoles(db,[email]), {code:'ACCOUNT_ROLE_CONFLICT',status:409});
    }
    await db.exec(`DELETE FROM school_students WHERE school_id=2;
      UPDATE classroom_students SET roster_active=FALSE;`);
    await assertAccountRoles(db,['student@example.test','teacher@example.test']);
  });
});
test('configured staff accounts cannot also be students', async () => {
  await withDb(async db => {
    await db.exec(`INSERT INTO school_students(school_id,student_email,guardian1_email,guardian2_email) VALUES (1,'admin@example.test',NULL,NULL)`);
    await assert.rejects(assertAccountRoles(db,['admin@example.test'],new Set(['admin@example.test'])),{code:'ACCOUNT_ROLE_CONFLICT'});
  });
});
test('every roster writer validates within the same locked transaction before commit', () => {
  for (const path of ['/school/students','/school/teachers','/teacher/class','/admin/schools/:schoolId/master-email']) {
    const start=source.indexOf(`router.put("${path}"`), end=source.indexOf('\n  }));',start), body=source.slice(start,end);
    const begin=body.indexOf('await client.query("BEGIN")'), lock=body.indexOf('await client.query(ROSTER_ROLE_LOCK)'),
      validation=body.indexOf('await validateAccountRoles(client,'), commit=body.indexOf('await client.query("COMMIT")');
    assert.ok(begin>=0 && lock>begin && validation>lock && commit>validation,path);
    assert.ok(body.includes('await client.query("ROLLBACK")'));
  }
});
test('existing conflicting sessions fail before returning a user; valid teacher-parent sessions remain valid', async () => {
  const start=source.indexOf('  async function sessionUser('), end=source.indexOf('\n  }',start)+4;
  await withDb(async db => {
    await db.exec(`CREATE TABLE classroom_sessions(user_id int,token_hash text,expires_at timestamp);
      INSERT INTO classroom_users VALUES (1,'adult@example.test');
      INSERT INTO classroom_sessions VALUES (1,'token',NOW()+INTERVAL '1 day');
      INSERT INTO classroom_teachers(school_id,google_email) VALUES (1,'adult@example.test');
      INSERT INTO school_students(school_id,student_email,guardian1_email,guardian2_email) VALUES (2,'child@example.test','adult@example.test',NULL);`);
    const resolve=new Function('databaseReady','readCookie','SESSION_COOKIE','pool','hashSessionToken','validateAccountRoles',
      `${source.slice(start,end)};return sessionUser;`)(true,()=> 'token','test',db,x=>x,assertAccountRoles);
    assert.equal((await resolve({})).id,1);
    await db.exec(`INSERT INTO school_students(school_id,student_email) VALUES (3,'adult@example.test')`);
    await assert.rejects(resolve({}),{code:'ACCOUNT_ROLE_CONFLICT'});
  });
});


test('a linked Google user cannot bypass the rule with an outdated roster email', async () => {
  await withDb(async db => {
    await db.exec(`INSERT INTO classroom_users VALUES(1,'current@example.test');
      INSERT INTO school_students(school_id,student_email,user_id) VALUES(1,'old@example.test',1);
      INSERT INTO classroom_teachers(school_id,google_email) VALUES(2,'current@example.test');`);
    await assert.rejects(assertAccountRoles(db,['current@example.test']),{code:'ACCOUNT_ROLE_CONFLICT'});
  });
});
