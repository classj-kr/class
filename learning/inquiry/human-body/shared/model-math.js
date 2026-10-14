(function(root,factory){
    if(typeof module==='object'&&module.exports)module.exports=factory();
    else root.BodyModelMath=factory();
})(typeof window==='undefined'?globalThis:window,function(){
    'use strict';
    function sarcomere(length,unit){
        var x=Math.max(2,Math.min(2.8,Number(length)||2.4));
        var a=1.6,actin=1;
        return {length:x,a:a,actin:actin,h:Math.max(0,x-2*actin),iHalf:(x-a)/2,
            pixels:{z:x*unit,a:a*unit,actin:actin*unit,h:Math.max(0,x-2*actin)*unit,iHalf:(x-a)*unit/2}};
    }
    return {sarcomere:sarcomere};
});
