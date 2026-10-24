import normal from "./normalize.js";
import lics from "../licenses/index.js";

// Remove those parsers that are not matched for sure. This is to avoid
//   different versions of the same license that match the same regexp
const removeNegated = (text) => (lic) => !lic.negate || !lic.negate.test(text);

// Include only those licenses that match the regex
const hasRegex = (text) => (lic) => lic.regex && lic.regex.test(text);

// Include only those licenses that match the whole text
const hasText = (text) => (lic) => lic.text && text.includes(normal(lic.text));

// Find all the licenses in a piece of text
export default (text) => [
  ...new Set(
    [
      ...lics.filter(hasRegex(normal(text))),
      ...lics.filter(hasText(normal(text))),
    ]
      .filter(removeNegated(normal(text)))
      .map((lic) => lic.name),
  ),
];
