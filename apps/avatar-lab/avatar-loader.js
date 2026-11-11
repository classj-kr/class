"use strict";
// One decoder pool per page. No decoder download until a compressed model is requested.
window.createClassJAvatarLoader = (() => {
  let decoder;
  return function () {
    decoder ||= new THREE.DRACOLoader().setDecoderPath('/apps/avatar-lab/vendor/draco-1.4.1/').setWorkerLimit(2);
    return new THREE.GLTFLoader().setDRACOLoader(decoder);
  };
})();
