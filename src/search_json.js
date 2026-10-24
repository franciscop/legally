// Find the licenses in the package.json
import clean from "./clean.js";

const flat = (all, lic) => [...all, ...(Array.isArray(lic) ? lic : [lic])];

// { license: 'BSD', licenses: ['CC0', { type: 'MIT' }] } => ['BSD', 'CC0', 'MIT']
export default (pack = {}) => [
  ...new Set(
    Object.keys(pack) // Unique items
      .filter((key) => /^licen(c|s)es?$/.test(key)) // British/alternative(s)
      .map((key) => pack[key]) // Only interested in the values here
      .reduce(flat, []) // Work only with a flat array
      .map((lic) => lic.type || lic) // Object to String { type: MIT } => MIT
      .join(" + ") // Convert to string to do some RegExp
      .replace(/\W+(AND|OR)\W+/gi, " + ") // Replace some common separators
      .split(" + ") // Return to an array of licenses
      .map(clean) // Clean up the licenses names
      .filter(Boolean) // Only those with some content left
      .sort(), // Sort by alphabetical name
  ),
];
