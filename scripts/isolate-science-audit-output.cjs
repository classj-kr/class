const {edit,replace,apply}=require('./science-scope-patch.cjs');
edit('scripts/science-full-inspection.cjs',s=>replace(s,"const output=path.resolve(__dirname,'../docs/science-lab-audit-2026-09-20/full-inspection');", "const output=path.resolve(__dirname,'../docs/science-lab-audit-2026-09-20',process.argv.find(a=>a.startsWith('--output='))?.slice(9)||'full-inspection');"));
edit('scripts/science-inspection-contact-sheets.cjs',s=>replace(s,"const dir=path.resolve(__dirname,'../docs/science-lab-audit-2026-09-20/full-inspection');", "const dir=path.resolve(__dirname,'../docs/science-lab-audit-2026-09-20',process.argv.find(a=>a.startsWith('--output='))?.slice(9)||'full-inspection');"));
apply();
