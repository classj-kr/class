const {edit,replace,apply}=require('./science-scope-patch.cjs');
edit('scripts/audit-science-layout.cjs',s=>replace(s,"page.locator('.burn-stage,.sound-stage').first()","page.locator('svg.main-svg,svg.graph-svg,svg.scope-svg').first().locator('xpath=ancestor::section[1]')"));
apply();
