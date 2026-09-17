"use strict";

const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");

const source=fs.readFileSync(path.resolve(__dirname,"..","learning","games","baduk","baduk.js"),"utf8");
const context=vm.createContext({
  console,
  localStorage:{getItem:()=>""},
  window:{addEventListener:()=>{}},
  document:{getElementById:()=>null,querySelectorAll:()=>[]},
  module:{exports:{}},
  setTimeout,clearTimeout,setInterval,clearInterval
});
vm.runInContext(source,context,{filename:"baduk.js"});

const capture=vm.runInContext("tryMove([0,1,0,1,2,0,0,1,0],3,1,2,1,[])",context);
assert.ok(capture,"합법적인 포획 수여야 합니다.");
assert.equal(capture.captured,1,"둘러싼 백돌 한 개를 잡아야 합니다.");
assert.equal(capture.board[4],0,"잡힌 돌은 판에서 제거해야 합니다.");

const suicide=vm.runInContext("tryMove([0,2,0,2,0,2,0,2,0],3,1,1,1,[])",context);
assert.equal(suicide,null,"상대 돌을 잡지 못하는 착수금지점에는 둘 수 없어야 합니다.");

// 규칙 설명의 패 그림과 같은 모양: 흑이 따낸 직후 백은 곧바로 되따낼 수 없음
const koBefore=[0,0,0,0,0, 0,1,2,0,0, 1,2,0,2,0, 0,1,2,0,0, 0,0,0,0,0];
context.koBefore=koBefore;
const koTake=vm.runInContext("tryMove(koBefore,5,2,2,1,[boardKey(koBefore)])",context);
assert.ok(koTake,"활로가 없어도 상대 돌을 따내는 수는 둘 수 있어야 합니다.");
assert.equal(koTake.captured,1);
context.koHistory=[koBefore.join(""),koTake.board.join("")];
context.koAfter=koTake.board;
assert.equal(vm.runInContext("tryMove(koAfter,5,2,1,2,koHistory)",context),null,"패는 곧바로 되따낼 수 없어야 합니다.");

const score=vm.runInContext("areaScore([1,1,1,1,0,1,1,1,1],3,0)",context);
assert.equal(score.black,9,"흑돌과 흑이 완전히 둘러싼 빈 공간을 합산해야 합니다.");
assert.equal(score.white,0);

assert.equal(vm.runInContext("MODES.capture.size",context),7);
assert.equal(vm.runInContext("MODES.territory.maxMoves",context),40);
assert.equal(vm.runInContext("MODES.standard.size",context),9);
assert.equal(vm.runInContext("TURN_TIME_MS",context),30000);

console.log("baduk-unit: capture, suicide, area score, fixed modes and timer ok");
