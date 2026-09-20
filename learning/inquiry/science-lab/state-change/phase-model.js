/* Separate samples at normal pressure. A phase-change fraction needs energy/history,
   not temperature alone; the learner chooses it on either constant-temperature plateau. */
(function (root) {
    'use strict';
    const MASS = 100, POWER = 100;
    const labels = {solid:'고체 (얼음)',liquid:'액체 (물)',gas:'기체 (수증기)','solid-liquid':'얼음과 물','liquid-gas':'물과 수증기'};
    const minutes = q => q / POWER / 60;
    const times = [0, minutes(MASS*2.1*10)];
    times.push(times[1]+minutes(MASS*334));
    times.push(times[2]+minutes(MASS*4.2*100));
    times.push(times[3]+minutes(MASS*2260));
    times.push(times[4]+minutes(MASS*2*10));
    function sample(temperature, progress = 50) {
        const temp = Math.max(-10,Math.min(110,Number(temperature)));
        const p = Math.max(0,Math.min(100,Number(progress))) / 100;
        let ice=0, liquid=0, vapour=0, time;
        if(temp<0){ice=1;time=minutes(MASS*2.1*(temp+10));}
        else if(temp===0){ice=1-p;liquid=p;time=times[1]+p*(times[2]-times[1]);}
        else if(temp<100){liquid=1;time=times[2]+minutes(MASS*4.2*temp);}
        else if(temp===100){liquid=1-p;vapour=p;time=times[3]+p*(times[4]-times[3]);}
        else {vapour=1;time=times[4]+minutes(MASS*2*(temp-100));}
        const state = ice===1?'solid':liquid===1?'liquid':vapour===1?'gas':ice>0?'solid-liquid':'liquid-gas';
        return {temperature:temp,progress:p*100,ice,liquid,vapour,time,state,verdict:state,label:labels[state],mass:MASS};
    }
    const api={sample,labels,times,MASS,POWER};
    if(typeof module!=='undefined')module.exports=api;
    if(root)root.SciencePhaseModel=api;
})(typeof window!=='undefined'?window:null);
