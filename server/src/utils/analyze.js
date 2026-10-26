// Transparent demo rules, not a trained ML model and not an adulterant detector.
export function analyzeQuality(input) {
  const flags = [];
  const checks = [
    ["pH", Number(input.ph) < 6.4 || Number(input.ph) > 6.8],
    ["Temperature", Number(input.temperature) > 8],
    ["TDS", Number(input.tds) < 100 || Number(input.tds) > 800],
    ["Conductivity", Number(input.conductivity) < 2 || Number(input.conductivity) > 7],
    ["Density", Number(input.density) < 1.020 || Number(input.density) > 1.040],
    ["Colour value", Number(input.colourValue) < 0 || Number(input.colourValue) > 100]
  ];
  checks.forEach(([name, bad]) => { if (bad) flags.push(name); });
  // Larger flag count is a simple demonstration heuristic, not a validated food-safety standard.
  let status = "NORMAL";
  if (flags.length >= 3) status = "HIGH DEVIATION";
  else if (flags.length > 0) status = "QUALITY DEVIATION";
  const confidence = status === "NORMAL" ? 91 : status === "QUALITY DEVIATION" ? 82 : 88;
  return {
    status,
    confidence,
    deviatedParameters: flags,
    concern: flags.length ? "One or more readings are outside this prototype's demo ranges." : "No out-of-range readings detected by the demo rules.",
    recommendation: flags.length ? "Hold this batch for review and send a sample for certified laboratory verification." : "Continue routine monitoring and follow applicable milk handling standards.",
    label: "Prototype AI Prediction"
  };
}
