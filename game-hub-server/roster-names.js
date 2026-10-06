"use strict";

// 명단의 성명 칸을 비워 두고 구글 계정만 적은 사람. 첫 로그인 때 구글 계정의
// 이름을 받아 명단에 적는다. 그때까지는 자리표시 이름을 두고, 어디서 온
// 이름인지 name_source 열에 남긴다.
//   pending : 성명을 비워 두어 첫 로그인을 기다리는 줄
//   google  : 첫 로그인 때 구글 계정 이름으로 채운 줄(관리자가 확인하도록 표시)
//   NULL    : 관리자가 직접 적은 이름
const NAME_SOURCE_PENDING = "pending";
const NAME_SOURCE_GOOGLE = "google";

const NAME_MAX_LENGTH = 30;

function cleanNamePart(value) {
  return String(value || "")
    .normalize("NFC")
    .replace(/[\u0000-\u001f\u007f​-‍﻿]/g, "")
    .trim();
}

// 학생 줄의 자리표시 이름. 번호와 계정이 옆에 있으니 계정의 @ 앞부분이면
// 누구인지 알아볼 수 있고, 좁은 칸에도 들어간다.
function pendingStudentName(email) {
  const local = String(email || "").trim().toLowerCase().split("@")[0];
  return (local || "로그인대기").slice(0, NAME_MAX_LENGTH);
}

// 교직원 줄의 자리표시 이름. 학교 안에서 성명이 유일해야 하므로(UNIQUE) 계정
// 전체를 쓴다. 한 계정은 한 줄만 적을 수 있어 겹치지 않는다.
function pendingTeacherName(email) {
  const full = String(email || "").trim().toLowerCase();
  return (full || "로그인대기").slice(0, 254);
}

// 구글이 로그인 때 보내는 프로필에서 명단에 적을 이름을 고른다.
// 한국 계정은 성·이름을 따로 넣어 두면 name 이 "길동 홍"처럼 뒤집히거나
// 띄어쓰기가 섞여 오므로, 둘 다 한글이면 성+이름으로 직접 잇는다.
function googleRosterName(payload) {
  const family = cleanNamePart(payload?.family_name);
  const given = cleanNamePart(payload?.given_name);
  const full = cleanNamePart(payload?.name);
  const hangul = /^[가-힣]+$/;
  if (family && given && hangul.test(family) && hangul.test(given)) {
    return (family + given).slice(0, NAME_MAX_LENGTH);
  }
  const joined = full || [given, family].filter(Boolean).join(" ");
  if (!joined) return "";
  // 한글만 있는 이름의 띄어쓰기는 명단 규칙대로 지운다("홍 길동" → "홍길동").
  if (/^[가-힣\s]+$/.test(joined)) return joined.replace(/\s+/g, "").slice(0, NAME_MAX_LENGTH);
  return joined.replace(/\s+/g, " ").slice(0, NAME_MAX_LENGTH);
}

// 첫 로그인: 성명을 비워 둔(pending) 명단 줄에 구글 계정 이름을 적는다.
// 이미 채운 줄(google)이나 관리자가 적은 줄(NULL)은 건드리지 않는다.
// 교직원 성명은 학교 안에서 유일해야 해서, 같은 이름이 이미 있으면 자리표시를
// 그대로 두고 로그인은 막지 않는다(관리자가 명단에서 직접 적는다).
async function fillPendingNamesFromGoogle(pool, { email, payload, isStudent, isTeacher }) {
  const name = googleRosterName(payload);
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const filled = { student: 0, teacher: 0, name };
  if (!name || !normalizedEmail) return filled;

  if (isStudent) {
    for (const table of ["school_students", "classroom_students"]) {
      const result = await pool.query(
        `UPDATE ${table}
         SET roster_name = $1, name_source = $3, updated_at = NOW()
         WHERE LOWER(student_email) = $2 AND name_source = $4`,
        [name, normalizedEmail, NAME_SOURCE_GOOGLE, NAME_SOURCE_PENDING]
      );
      filled.student += Number(result.rowCount || 0);
    }
  }

  if (isTeacher) {
    try {
      const result = await pool.query(
        `UPDATE classroom_teachers
         SET teacher_name = $1, name_source = $3, updated_at = NOW()
         WHERE LOWER(google_email) = $2 AND name_source = $4`,
        [name, normalizedEmail, NAME_SOURCE_GOOGLE, NAME_SOURCE_PENDING]
      );
      filled.teacher += Number(result.rowCount || 0);
    } catch (error) {
      if (error?.code !== "23505") throw error;
    }
  }
  return filled;
}

module.exports = {
  NAME_SOURCE_PENDING,
  NAME_SOURCE_GOOGLE,
  pendingStudentName,
  pendingTeacherName,
  googleRosterName,
  fillPendingNamesFromGoogle
};
