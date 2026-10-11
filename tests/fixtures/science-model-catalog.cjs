// The archived model harness also exercises drafts deliberately removed from
// the student catalog. Keep that test inventory separate from product scope.
const catalog=require('../../learning/inquiry/science-lab/activity-catalog.js');
const registry=require('../../scripts/science-activity-tools.cjs');
const rows=Object.entries(registry).map(([id,spec])=>({
 ...catalog.find(row=>row.id===id),id,group:'Internal model tests',unit:id,
 text:spec.title,slugs:[],...spec,tool:spec.tool
}));
module.exports='window.scienceActivities='+JSON.stringify(rows)+';';
