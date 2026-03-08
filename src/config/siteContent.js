import { parse } from "yaml";
import rawYaml from "../../content.yaml?raw";

const REQUIRED_TOP_LEVEL_KEYS = [
  "title",
  "tagline",
  "authors",
  "body",
  "references",
  "footer"
];

function parseContentYaml(text) {
  let parsed;
  try {
    parsed = parse(text);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to parse content.yaml: ${message}`);
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Invalid content.yaml: expected a top-level object.");
  }

  for (const key of REQUIRED_TOP_LEVEL_KEYS) {
    if (!(key in parsed)) {
      throw new Error(`Invalid content.yaml: missing required key "${key}".`);
    }
  }

  return parsed;
}

const siteContent = parseContentYaml(rawYaml);

export default siteContent;
