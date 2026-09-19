import fs from "node:fs/promises";

const riverFile = new URL("../learning/inquiry/korea-map/data/major-rivers.geojson", import.meta.url);
const supplementalRivers = new Map([
  [2899525, "압록강"],
  [6970997, "두만강"],
  [3858130, "대동강"],
  [5454222, "청천강"],
  [5486141, "북한강"],
  [5488146, "임진강"]
]);
const riverSystems = new Map([
  ["한강", "한강 수계"], ["남한강", "한강 수계"], ["북한강", "한강 수계"], ["임진강", "한강 수계"],
  ["낙동강", "낙동강 수계"], ["금강", "금강 수계"], ["영산강", "영산강 수계"], ["섬진강", "섬진강 수계"],
  ["압록강", "압록강 수계"], ["두만강", "두만강 수계"], ["대동강", "대동강 수계"], ["청천강", "청천강 수계"]
]);
const lookupUrl = `https://nominatim.openstreetmap.org/lookup?osm_ids=${[...supplementalRivers.keys()].map((id) => `R${id}`).join(",")}&format=jsonv2&polygon_geojson=1`;

const response = await fetch(lookupUrl, {
  headers: { "User-Agent": "JoyclassKoreaGeography/1.0 (educational map)" }
});
if (!response.ok) throw new Error(`Nominatim lookup failed: HTTP ${response.status}`);

const lookupResults = await response.json();
const collection = JSON.parse(await fs.readFile(riverFile, "utf8"));
const retainedFeatures = collection.features.filter((feature) => ![...supplementalRivers.values()].includes(feature.properties?.name));
const fetchedFeatures = lookupResults.map((result) => ({
  type: "Feature",
  properties: {
    name: supplementalRivers.get(Number(result.osm_id)),
    source: "OpenStreetMap contributors via Nominatim",
    osmRelation: Number(result.osm_id)
  },
  geometry: result.geojson
}));

if (fetchedFeatures.length !== supplementalRivers.size || fetchedFeatures.some((feature) => !feature.properties.name || !/LineString$/.test(feature.geometry?.type || ""))) {
  throw new Error("Nominatim did not return every expected supplemental river relation.");
}

collection.features = [...retainedFeatures, ...fetchedFeatures].map((feature) => ({
  ...feature,
  properties: { ...feature.properties, system: riverSystems.get(feature.properties?.name) }
}));
await fs.writeFile(riverFile, `${JSON.stringify(collection)}\n`, "utf8");
console.log(`Updated ${riverFile.pathname} with ${collection.features.length} major rivers.`);
