// Explicit routes for one apparatus used in more than one 2022 course.
// Question numbers are stable authored IDs, not their position after filtering.
module.exports={
 'ride-acceleration':{
  defaultContext:'high-common',
  courseContexts:{
   'high-common':{
    subjects:['과학탐구실험2'],codes:['10과탐2-01-01','10과탐2-01-02'],grades:['고1'],
    defaultMotion:'circle',questionNumbers:[1,3,4,8],
    followupIds:['ride-acceleration@descending','ride-acceleration@mount-sign'],
    intro:'운동 모습과 가상 센서값을 비교하세요. 센서의 방향을 바꾸고, 원시값과 중력 보정값이 어떻게 다른지 확인해 보세요.'
   },
   'high-elective':{
    subjects:['역학과 에너지'],codes:['12역학01-01','12역학01-03'],grades:['고2','고3'],
    defaultMotion:'swing',questionNumbers:[2,5,6,7],
    followupIds:['ride-acceleration@double','ride-acceleration@swing-support'],
    intro:'그네·시소·미끄럼틀의 운동을 가상 센서로 측정하세요. 부착 위치·방향과 운동 조건을 바꾸고, 힘과 가속도의 관계로 그래프를 해석해 보세요.'
   }
  }
 }
};
