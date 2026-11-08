"use strict";

// Small glTF 2.0 writer for the cat. Original WebP, meshes and animations
// are embedded in one interoperable GLB; no browser, Blender, or new package needed.
const fs = require("node:fs");
const path = require("node:path");
const THREE = require("../learning/arts/art-appreciation/museum/vendor/three.min.js");
const avatar = process.argv[2] || "cat";
const keys={cat:"animal-cat",ramen:"food-ramen",donut:"food-donut",banana:"fruit-banana",helicopter:"vehicle-helicopter",umbrella:"object-umbrella"};
const profiles=require("../apps/avatar-lab/collection-profiles.cjs");
const assetKey = keys[avatar]||avatar;
if (!profiles[assetKey]) throw new Error("Unknown avatar: "+avatar);
const { root, clips } = require('../apps/avatar-lab/avatar-factory.cjs').create(THREE,assetKey);
const gltf = { asset: { version: "2.0", generator: "ClassJ fixed avatar prototype" }, scene: 0, scenes: [{ nodes: [0] }], nodes: [], meshes: [], materials: [], accessors: [], bufferViews: [], buffers: [], animations: [] };
gltf.extensionsUsed = ["EXT_texture_webp", "KHR_materials_unlit"];
gltf.extensionsRequired = ["EXT_texture_webp"];
const chunks = [], nodeMap = new Map(), materialMap = new Map(), meshMap = new Map(), accessorMap = new Map();
let byteLength = 0;
function accessor(array, size, target) {
  if (accessorMap.has(array)) return accessorMap.get(array);
  const raw = Buffer.from(array.buffer, array.byteOffset, array.byteLength);
  const data = Buffer.alloc(Math.ceil(raw.length / 4) * 4); raw.copy(data);
  const view = { buffer: 0, byteOffset: byteLength, byteLength: raw.length };
  if (target) view.target = target;
  const bufferView = gltf.bufferViews.push(view) - 1; chunks.push(data); byteLength += data.length;
  const componentType = array instanceof Float32Array ? 5126 : array instanceof Uint32Array ? 5125 : 5123;
  const result = { bufferView, componentType, count: array.length / size, type: { 1: "SCALAR", 2: "VEC2", 3: "VEC3", 4: "VEC4" }[size] };
  result.min = Array(size).fill(Infinity); result.max = Array(size).fill(-Infinity);
  for (let i = 0; i < array.length; i++) { result.min[i % size] = Math.min(result.min[i % size], array[i]); result.max[i % size] = Math.max(result.max[i % size], array[i]); }
  const index = gltf.accessors.push(result) - 1; accessorMap.set(array, index); return index;
}
function material(m) {
  if (materialMap.has(m.uuid)) return materialMap.get(m.uuid);
  const record = { name: m.name, pbrMetallicRoughness: { baseColorFactor: [...m.color.toArray(), 1], metallicFactor: 0, roughnessFactor: m.roughness ?? 1 } };
  if(m.emissive&&(m.emissive.r||m.emissive.g||m.emissive.b))record.emissiveFactor=m.emissive.toArray();
  if(m.isMeshBasicMaterial)record.extensions={KHR_materials_unlit:{}};
  if (m.userData.originalTexture) {
    record.pbrMetallicRoughness.baseColorTexture = { index: 0 };
    record.extensions = { KHR_materials_unlit: {} };
    record.alphaMode = m.transparent ? "BLEND" : "MASK";
    if(!m.transparent)record.alphaCutoff = .4;
  }
  const index = gltf.materials.push(record) - 1;
  materialMap.set(m.uuid, index); return index;
}
function node(object) {
  const record = { name: object.name, translation: object.position.toArray(), rotation: object.quaternion.toArray(), scale: object.scale.toArray() };
  const index = gltf.nodes.push(record) - 1; nodeMap.set(object.name, index);
  if (object.isMesh) {
    const key = object.geometry.uuid + object.material.uuid;
    if (!meshMap.has(key)) {
      const g = object.geometry;
      const primitive = { attributes: { POSITION: accessor(g.attributes.position.array, 3, 34962), NORMAL: accessor(g.attributes.normal.array, 3, 34962) }, material: material(object.material) };
      if (g.attributes.uv) primitive.attributes.TEXCOORD_0 = accessor(g.attributes.uv.array, 2, 34962);
      if (g.attributes.color) primitive.attributes.COLOR_0 = accessor(g.attributes.color.array, g.attributes.color.itemSize, 34962);
      if (g.index) primitive.indices = accessor(g.index.array, 1, 34963);
      meshMap.set(key, gltf.meshes.push({ name: object.name, primitives: [primitive] }) - 1);
    }
    record.mesh = meshMap.get(key);
  }
  if (Object.keys(object.userData).length) record.extras = object.userData;
  if (object.children.length) record.children = object.children.map(node);
  return index;
}
node(root);
for (const clip of clips) {
  const animation = { name: clip.name, channels: [], samplers: [] };
  for (const track of clip.tracks) {
    const separator=track.name.lastIndexOf('.'),name=track.name.slice(0,separator),property=track.name.slice(separator+1);
    if(!nodeMap.has(name))throw new Error('Animation targets missing node: '+track.name);
    const sampler = animation.samplers.push({ input: accessor(track.times, 1), output: accessor(track.values, property === "quaternion" ? 4 : 3), interpolation: "LINEAR" }) - 1;
    animation.channels.push({ sampler, target: { node: nodeMap.get(name), path: property === "quaternion" ? "rotation" : property === "scale" ? "scale" : "translation" } });
  }
  gltf.animations.push(animation);
}
const image = fs.readFileSync(path.resolve(__dirname, `../apps/classtools/assets/avatars/${assetKey}.webp`));
const imageBuffer = Buffer.alloc(Math.ceil(image.length / 4) * 4); image.copy(imageBuffer);
const imageView = gltf.bufferViews.push({ buffer: 0, byteOffset: byteLength, byteLength: image.length }) - 1;
chunks.push(imageBuffer); byteLength += imageBuffer.length;
gltf.images = [{ name: `Original ${assetKey}.webp`, bufferView: imageView, mimeType: "image/webp" }];
gltf.samplers = [{ magFilter: 9729, minFilter: 9987, wrapS: 33071, wrapT: 33071 }];
gltf.textures = [{ sampler: 0, extensions: { EXT_texture_webp: { source: 0 } } }];
gltf.buffers.push({ byteLength });
const jsonRaw = Buffer.from(JSON.stringify(gltf)), json = Buffer.alloc(Math.ceil(jsonRaw.length / 4) * 4, 32); jsonRaw.copy(json);
const binary = Buffer.concat(chunks), header = Buffer.alloc(12), jsonHeader = Buffer.alloc(8), binaryHeader = Buffer.alloc(8);
header.writeUInt32LE(0x46546c67, 0); header.writeUInt32LE(2, 4); header.writeUInt32LE(28 + json.length + binary.length, 8);
jsonHeader.writeUInt32LE(json.length, 0); jsonHeader.writeUInt32LE(0x4e4f534a, 4);
binaryHeader.writeUInt32LE(binary.length, 0); binaryHeader.writeUInt32LE(0x004e4942, 4);
const destination = path.resolve(__dirname, `../apps/avatar-lab/models/${assetKey}.glb`);
fs.mkdirSync(path.dirname(destination), { recursive: true });
require('./replace-generated-file.cjs')(destination,Buffer.concat([header, jsonHeader, json, binaryHeader, binary]));
let triangles = 0;
root.traverse(o => { if (o.isMesh) triangles += (o.geometry.index?.count || o.geometry.attributes.position.count) / 3; });
console.log(JSON.stringify({ file: destination, bytes: fs.statSync(destination).size, nodes: gltf.nodes.length, triangles, animations: clips.map(c => c.name) }, null, 2));
