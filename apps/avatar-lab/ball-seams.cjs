"use strict";

// One closed seam, separating two congruent leather panels. The former pair
// of independent ovals incorrectly divided the ball into THREE pieces.
// x=a cos(t)+b cos(3t), y=a sin(t)-b sin(3t), z=2 sqrt(ab) sin(2t)
// lies exactly on the unit sphere when a+b=1. Rotate to the illustrated pose.
// References: R. Ferreol / A. Esculier, mathcurve.com/courbes3d/couture/;
// Rawlings ROMLB product photographs; Wilson NBA Official Game Ball photos.
module.exports = function ballSeams(THREE, a=.75, tilt=0) {
  const b=1-a, roll=-Math.PI/4;
  function point(t) {
    return new THREE.Vector3(a*Math.cos(t)+b*Math.cos(3*t),a*Math.sin(t)-b*Math.sin(3*t),2*Math.sqrt(a*b)*Math.sin(2*t))
      .applyAxisAngle(new THREE.Vector3(0,0,1),roll)
      .applyAxisAngle(new THREE.Vector3(1,0,0),tilt);
  }
  const curve = new THREE.CatmullRomCurve3(Array.from({length:512},(_,i)=>point(i/512*Math.PI*2)),true,'centripetal');
  return {point, curve};
};
