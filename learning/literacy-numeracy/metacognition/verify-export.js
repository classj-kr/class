// Verify exports with the same local server and browser harness as the quiz checks.
require("../../../tests/metacognition-browser.cjs").verify({ mode: "export" }).catch(error => {
  console.error(error);
  process.exitCode = 1;
});
