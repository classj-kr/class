// Run the shared, cross-platform browser checks from this legacy entry point.
require("../../../tests/metacognition-browser.cjs").verify({ mode: "shuffle" }).catch(error => {
  console.error(error);
  process.exitCode = 1;
});
