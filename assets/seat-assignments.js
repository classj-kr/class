// 자리 배치 규칙. 선생님 화면과, 학생에게 자리표를 내주는 서버가 같은 계산을 쓴다.
(function (root) {
  'use strict';
  // 고정 학생 → 직접 앉힌 학생 → 남·여 고정 자리 → 나머지 자리 차례로 앉힌다. 돌려주는 값: 자리 번호 → 학생.
  function assign({ students, seats, manualVacantSeats, studentLocks, manualAssignments, genderLocks, unassignedStudents }) {
    const assignedSeats = new Map();
    const assignedStudents = new Set();
    const assignStudent = (seatIndex, studentNumber) => {
      const student = students.find((candidate) => candidate.number === studentNumber);
      if (!student || assignedStudents.has(student) || unassignedStudents.has(student.number)) return;
      assignedSeats.set(seatIndex, student);
      assignedStudents.add(student);
    };
    for (const seatIndex of seats.filter((seat) => !manualVacantSeats.has(seat) && studentLocks.has(seat))) {
      assignStudent(seatIndex, studentLocks.get(seatIndex));
    }
    for (const seatIndex of seats.filter((seat) => !manualVacantSeats.has(seat) && !studentLocks.has(seat) && manualAssignments.has(seat))) {
      assignStudent(seatIndex, manualAssignments.get(seatIndex));
    }
    for (const gender of ['남', '여']) {
      const matchingStudents = students.filter((student) => student.gender === gender && !unassignedStudents.has(student.number));
      for (const seatIndex of seats.filter((seat) => !manualVacantSeats.has(seat) && !studentLocks.has(seat) && !manualAssignments.has(seat) && genderLocks.get(seat) === gender)) {
        const student = matchingStudents.find((candidate) => !assignedStudents.has(candidate));
        if (!student) continue;
        assignedSeats.set(seatIndex, student);
        assignedStudents.add(student);
      }
    }
    const remainingStudents = students.filter((student) => !assignedStudents.has(student) && !unassignedStudents.has(student.number));
    for (const seatIndex of seats.filter((seat) => !manualVacantSeats.has(seat) && !genderLocks.has(seat) && !studentLocks.has(seat) && !manualAssignments.has(seat))) {
      const student = remainingStudents.shift();
      if (student) assignedSeats.set(seatIndex, student);
    }
    return assignedSeats;
  }
  // 저장된 섞은 순서대로 명단을 늘어놓는다. 그 뒤에 들어온 학생은 맨 뒤로 간다.
  function order(students, studentOrder) {
    const list = Array.isArray(studentOrder) ? studentOrder.map(String) : [];
    const ranks = new Map(list.map((number, index) => [number, index]));
    return students.sort((a, b) => (ranks.get(a.number) ?? list.length) - (ranks.get(b.number) ?? list.length));
  }
  const api = { assign, order };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SeatAssignments = Object.freeze(api);
})(typeof window === 'object' ? window : globalThis);
