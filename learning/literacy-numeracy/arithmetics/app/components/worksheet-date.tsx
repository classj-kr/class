"use client";

import { useEffect, useState } from "react";

// 학습지 머리의 날짜: 아이에게 빈칸에 쓰게 하지 않고 오늘 날짜를 찍는다.
// 쪽을 미리 만들어 둘 때(빌드) 그날이 박히지 않도록, 화면이 열린 뒤에 날짜를 채운다.
export function WorksheetDate() {
  const [label, setLabel] = useState("");
  useEffect(() => {
    const now = new Date();
    setLabel(`${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`);
  }, []);
  return <span className="worksheet-date">{label}</span>;
}
