// A temporary textured surface opens along the back meridian and unrolls.
// It illustrates the view change only; the interactive map remains MapLibre.
const TILE=new URL('./tiles/0/0/0.webp',import.meta.url).href;
let textureImage;
function imageReady(){return textureImage??=new Promise(resolve=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>resolve(null);image.src=TILE;});}
export async function createPeelSurface(map,targetZoom,center){
  const image=await imageReady();if(!image)return null;
  const canvas=document.createElement('canvas');canvas.className='peel-surface';canvas.setAttribute('aria-hidden','true');
  const gl=canvas.getContext('webgl',{alpha:true,antialias:true});if(!gl)return null;
  const vertex=`attribute vec2 uv; uniform float unfold; uniform float aspect; uniform float scale; uniform float longitude; uniform float latitude; varying vec2 tex; varying float light;
  void main(){
    float pi=3.14159265;
    float lam=(uv.x-.5)*2.*pi;
    float merc=(.5-uv.y)*2.*pi;
    float phi=2.*atan(exp(merc))-pi*.5;
    float k=max(.0001,1.-unfold);
    // Longitude curvature relaxes first; latitude flattens as the sheet opens.
    float band=mix(cos(phi),1.,smoothstep(0.,.9,unfold));
    vec3 p=vec3(band*sin(lam*k)/k,mix(sin(phi),merc,smoothstep(.15,1.,unfold)),cos(phi)*cos(lam*k)*k);
    float tilt=latitude*(1.-unfold);
    p.yz=mat2(cos(tilt),sin(tilt),-sin(tilt),cos(tilt))*p.yz;
    p.y-=log(tan(pi*.25+latitude*.5))*unfold;
    gl_Position=vec4(p.x*scale/aspect,p.y*scale,-p.z*.16,1.);
    tex=vec2(uv.x+longitude/(2.*pi),uv.y);
    light=mix(.63+.37*max(0.,cos(lam*k)*cos(phi)),1.,unfold);
  }`;
  const fragment=`precision mediump float;uniform sampler2D earth;varying vec2 tex;varying float light;void main(){gl_FragColor=vec4(texture2D(earth,vec2(fract(tex.x),tex.y)).rgb*light,1.);}`;
  const shaders=[];
  function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));shaders.push(s);return s;}
  let program,buffer,texture;
  try{
    program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('projection surface');
    const points=[];const nx=120,ny=72;
    for(let y=0;y<ny;y++)for(let x=0;x<nx;x++)for(const [dx,dy]of [[0,0],[1,0],[0,1],[1,0],[1,1],[0,1]])points.push((x+dx)/nx,(y+dy)/ny);
    gl.useProgram(program);buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(points),gl.STATIC_DRAW);
    const attribute=gl.getAttribLocation(program,'uv');gl.enableVertexAttribArray(attribute);gl.vertexAttribPointer(attribute,2,gl.FLOAT,false,0,0);
    texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.enable(gl.DEPTH_TEST);gl.clearColor(.043,.082,.133,1);
    map.getContainer().append(canvas);
    const uniforms=Object.fromEntries(['unfold','aspect','scale','longitude','latitude'].map(n=>[n,gl.getUniformLocation(program,n)]));
    return {
      draw(unfold,progress){
        const w=map.getCanvas().clientWidth,h=map.getCanvas().clientHeight,dpr=Math.min(1.5,devicePixelRatio||1);
        if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
        gl.viewport(0,0,canvas.width,canvas.height);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        const sphereRadius=Math.min(w,h)*.43,flatRadius=512*Math.pow(2,targetZoom)/(2*Math.PI);
        gl.uniform1f(uniforms.unfold,unfold);gl.uniform1f(uniforms.aspect,w/h);gl.uniform1f(uniforms.scale,2*(sphereRadius*(1-unfold)+flatRadius*unfold)*(1-.22*Math.sin(Math.PI*unfold))/h);
        gl.uniform1f(uniforms.longitude,center[0]*Math.PI/180);gl.uniform1f(uniforms.latitude,center[1]*Math.PI/180);
        gl.drawArrays(gl.TRIANGLES,0,points.length/2);
        canvas.style.opacity=String(Math.min(1,progress/.12,(1-progress)/.12));
      },
      destroy(){canvas.remove();gl.deleteBuffer(buffer);gl.deleteTexture(texture);gl.deleteProgram(program);shaders.forEach(s=>gl.deleteShader(s));gl.getExtension('WEBGL_lose_context')?.loseContext();},
    };
  }catch{canvas.remove();if(buffer)gl.deleteBuffer(buffer);if(texture)gl.deleteTexture(texture);if(program)gl.deleteProgram(program);shaders.forEach(s=>gl.deleteShader(s));return null;}
}
