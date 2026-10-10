import assert from "node:assert/strict";
import test from "node:test";
import http from "node:http";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";

test("parent arrival updates badges and sounds once; initial/reconnected snapshots, approvals and idle time stay quiet", { timeout: 30000 }, async () => {
  const html = await readFile(new URL("../apps/classtools/dashboard.html",import.meta.url),"utf8");
  const live = await readFile(new URL("../apps/classtools/dashboard-attendance-live.js",import.meta.url),"utf8");
  const css = html.match(/<style>([\s\S]*?)<\/style>/)[1];
  const widgetStart=html.indexOf('<section class="widget-card" id="widget-checklist"');
  const widget=html.slice(widgetStart,html.indexOf("</section>",widgetStart)+10);
  const logic=html.slice(html.indexOf("        let todayQuickAlerts"),html.indexOf("        // 5. Important schedules"));
  const before=`
    const checklistGrid=document.getElementById("checklistGrid"),missingBadge=document.getElementById("missingBadge");
    const missingStudents=new Set(); const rosterLoadMessage="";
    let dashboardStore=null;   // 준비물 표시는 계정 저장소에 남는데, 이 검사에선 로그인 전처럼 없는 것으로 둔다.
    const rosterStudents=Array.from({length:24},(_,i)=>({number:i+1,name:"학생"+(i+1)}));
    function isTodayBirthday(){return false;}
    function koreanWeatherClock(){return {date:"2026-09-26"};}
    function fetchRosterAndRenderChecklist(){
      activeRosterClass={id:11,grade:6,classNumber:2};
      fetchQuickAlertsForDashboard(); attendanceLive.selectClass(11);
    }
  `;
  const after=`
    window.changeTestClass = id => {
      activeRosterClass={id,grade:6,classNumber:id===12?3:2};
      fetchQuickAlertsForDashboard(); attendanceLive.selectClass(id);
    };
  `;
  const connections=new Map();
  let snapshots=0, alerts=[];
  const server=http.createServer((req,res)=>{
    const url=new URL(req.url,"http://test/");
    if(url.pathname==="/api/teacher/class-attendance/events"){
      res.writeHead(200,{"Content-Type":"text/event-stream","Cache-Control":"no-cache","Connection":"keep-alive"});
      const id=url.searchParams.get("classId");
      connections.set(id,res);
      res.write('retry: 200\nevent: ready\ndata: {}\n\n');
      res.on("close",()=>{if(connections.get(id)===res)connections.delete(id);});
    }else if(url.pathname==="/api/teacher/class-attendance"){
      snapshots++;
      res.setHeader("Content-Type","application/json");
      res.end(JSON.stringify({date:"2026-09-26",classId:Number(url.searchParams.get("classId")),alerts}));
    }else{
      res.setHeader("Content-Type","text/html; charset=utf-8");
      res.end("<style>"+css+"</style>"+widget+"<script>"+live+"</script><script>"+before+logic+after+"</script>");
    }
  });
  await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
  const browser=await chromium.launch({channel:"msedge",headless:true});
  const page=await browser.newPage({viewport:{width:480,height:700}});
  page.setDefaultTimeout(5000);
  const errors=[];page.on("pageerror",error=>errors.push(error.message));
  await page.addInitScript(()=>{
    window.soundStarts=0;window.audioContexts=[];
    const NativeAudio=window.AudioContext;
    window.AudioContext=class extends NativeAudio {
      constructor(...args){super(...args);window.audioContexts.push(this);}
      createOscillator(){
        const oscillator=super.createOscillator();
        const start=oscillator.start.bind(oscillator);
        oscillator.start=(...args)=>{window.soundStarts++;return start(...args);};
        return oscillator;
      }
    };
  });
  const send=(event,classId="11")=>connections.get(classId).write("event: attendance\ndata: "+JSON.stringify(event)+"\n\n");
  try{
    await page.clock.install({time:new Date("2026-09-26T02:00:00Z")});
    await page.goto("http://127.0.0.1:"+server.address().port);
    await page.waitForFunction(()=>document.querySelectorAll(".num-chip").length===24);
    await page.waitForFunction(()=>document.getElementById("attendanceConnectionStatus").hidden);
    assert.equal(await page.evaluate(()=>soundStarts),0);
    // An ordinary user interaction activates sound without playing a preview.
    await page.locator(".num-chip").first().click();
    await page.waitForFunction(()=>audioContexts[0]?.state==="running");
    assert.equal(await page.evaluate(()=>soundStarts),0);
    alerts=[{studentNumber:"2",noticeType:"지각",source:"학부모 출결 알림"}];
    const event={id:"arrival-1",kind:"arrival",studentNumber:"2",noticeType:"지각"};
    send(event);
    await page.waitForFunction(()=>document.getElementById("attendanceArrival").textContent.includes("학생2 · 지각"));
    await page.clock.fastForward(200);
    await page.waitForFunction(()=>document.querySelector(".attendance-tag")?.textContent==="지각");
    assert.equal(await page.evaluate(()=>soundStarts),2,"one short two-tone sound");
    send(event);
    await page.clock.fastForward(200);
    assert.equal(await page.evaluate(()=>soundStarts),2,"duplicate delivery must not repeat sound");
    send({...event,id:"approval-1",kind:"changed"});
    await page.clock.fastForward(200);
    assert.equal(await page.evaluate(()=>soundStarts),2,"approval updates are quiet");
    const requestsBeforeIdle=snapshots;
    await page.clock.fastForward(121000);
    assert.equal(snapshots,requestsBeforeIdle,"no minute-by-minute attendance polling");
    connections.get("11").end();
    await page.waitForFunction(()=>!document.getElementById("attendanceConnectionStatus").hidden);
    await page.waitForFunction(()=>document.getElementById("attendanceConnectionStatus").hidden);
    assert.equal(await page.evaluate(()=>soundStarts),2,"reconnect is quiet");
    await page.locator("#attendanceSound").click();
    assert.equal(await page.locator("#attendanceSound").getAttribute("aria-pressed"),"false");
    send({...event,id:"arrival-2",noticeType:"조퇴"});
    await page.waitForFunction(()=>document.getElementById("attendanceArrival").textContent.includes("조퇴"));
    assert.equal(await page.evaluate(()=>soundStarts),2,"mute suppresses sound but leaves the visual notice");
    await page.evaluate(()=>changeTestClass(12));
    await page.waitForFunction(()=>document.querySelectorAll(".num-chip").length===24);
    await page.waitForTimeout(100);
    assert.equal(connections.has("11"),false,"old class stream closes");
    await page.setViewportSize({width:390,height:700});
    assert.equal(await page.evaluate(()=>document.querySelector("#widget-checklist").scrollWidth<=document.querySelector("#widget-checklist").clientWidth),true);
    assert.deepEqual(errors,[]);
  }catch(error){
    console.log(errors, await page.evaluate(()=>({notice:document.getElementById("attendanceArrival").textContent,soundStarts,audio:audioContexts[0]?.state})), snapshots);
    throw error;
  }finally{
    await browser.close();
    server.closeAllConnections();
    await new Promise(resolve=>server.close(resolve));
  }
});
