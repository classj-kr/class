const CHANNEL = "classroom_attendance";

// PostgreSQL sends events after commit, including to other server instances.
const attendanceEventSchema = [
  `CREATE OR REPLACE FUNCTION classroom_notify_attendance() RETURNS trigger AS $$
   DECLARE row_data JSONB; event_data JSONB;
   BEGIN
     IF TG_OP = 'UPDATE' AND NEW IS NOT DISTINCT FROM OLD THEN RETURN NEW; END IF;
     IF TG_OP = 'DELETE' THEN row_data := to_jsonb(OLD); ELSE row_data := to_jsonb(NEW); END IF;
     event_data := jsonb_build_object(
       'id', gen_random_uuid()::TEXT,
       'schoolId', row_data->>'school_id',
       'grade', row_data->>'grade',
       'classNumber', row_data->>'class_number',
       'studentNumber', row_data->>'student_number',
       'kind', CASE WHEN TG_OP = 'INSERT' THEN 'arrival' ELSE 'changed' END,
       'noticeType', CASE WHEN TG_TABLE_NAME = 'classroom_absence_notices' THEN row_data->>'notice_type'
                          WHEN TG_TABLE_NAME = 'classroom_absence_notes' THEN '결석계' ELSE '체험학습 신청' END,
       'startDate', COALESCE(row_data->>'expected_date', row_data->>'start_date'),
       'endDate', COALESCE(row_data->>'expected_date', row_data->>'end_date')
     );
     PERFORM pg_notify('classroom_attendance', event_data::TEXT);
     IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
   END;
   $$ LANGUAGE plpgsql`,
  ...["classroom_absence_notices", "classroom_absence_notes", "classroom_experiential_apps"].flatMap(table => [
    "DROP TRIGGER IF EXISTS attendance_changed ON " + table,
    "CREATE TRIGGER attendance_changed AFTER INSERT OR UPDATE OR DELETE ON " + table +
      " FOR EACH ROW EXECUTE FUNCTION classroom_notify_attendance()"
  ])
];

function attendanceScope(value) {
  return [value.schoolId, value.grade, value.classNumber].map(String).join(":");
}

function createAttendanceEventHub(pool) {
  let client = null;
  let connecting = null;
  const subscribers = new Set();

  function disconnect(current) {
    if (client !== current) return;
    client = null;
    current.release(true);
    for (const subscriber of [...subscribers]) {
      subscribers.delete(subscriber);
      subscriber.onDisconnect();
    }
  }

  async function ensureListening() {
    if (connecting) return connecting;
    if (client) return;
    connecting = (async () => {
      const current = await pool.connect();
      client = current;
      current.on("error", () => disconnect(current));
      current.on("end", () => disconnect(current));
      current.on("notification", notification => {
        if (client !== current || notification.channel !== CHANNEL) return;
        let event;
        try { event = JSON.parse(notification.payload); } catch { return; }
        if (!event.id || !["arrival", "changed"].includes(event.kind)) return;
        const scope = attendanceScope(event);
        // Only matching classes receive events. No reasons, contacts or signatures.
        const payload = {
          id: event.id, kind: event.kind, studentNumber: event.studentNumber,
          noticeType: event.noticeType, startDate: event.startDate, endDate: event.endDate
        };
        for (const subscriber of subscribers) {
          if (subscriber.scope === scope) subscriber.onEvent(payload);
        }
      });
      try {
        await current.query("LISTEN " + CHANNEL);
        if (client !== current) throw new Error("Attendance listener disconnected");
      } catch (error) {
        disconnect(current);
        throw error;
      }
    })();
    try { await connecting; } finally { connecting = null; }
  }

  return {
    async subscribe(scope, onEvent, onDisconnect) {
      await ensureListening();
      const subscriber = { scope: attendanceScope(scope), onEvent, onDisconnect };
      subscribers.add(subscriber);
      return () => subscribers.delete(subscriber);
    },
    close() {
      if (client) disconnect(client);
    }
  };
}

module.exports = { attendanceEventSchema, createAttendanceEventHub };
