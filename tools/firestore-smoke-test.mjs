import { readFile } from "node:fs/promises";

const configPath = new URL("../public/firebase-config.js", import.meta.url);
const configSource = await readFile(configPath, "utf8");

function extractConfigValue(name) {
  const match = configSource.match(new RegExp(`${name}:\\s*["']([^"']+)["']`));
  if (!match) {
    throw new Error(`Missing ${name} in public/firebase-config.js`);
  }
  return match[1];
}

const apiKey = extractConfigValue("apiKey");
const projectId = extractConfigValue("projectId");
const documentPath = "wordcloud_words/codex_smoke_20260623";
const documentUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${documentPath}?key=${apiKey}`;
const testText = "Codex Firestore smoke test 2026-06-23 read write ok";
const expectWriteDenied = process.argv.includes("--expect-write-denied");
const readOnly = process.argv.includes("--read-only");

async function readSmokeDocument() {
  const readResponse = await fetch(documentUrl);

  if (!readResponse.ok) {
    throw new Error(`Firestore read failed: ${readResponse.status} ${await readResponse.text()}`);
  }

  const readData = await readResponse.json();
  const readText = readData?.fields?.text?.stringValue;
  const readTestRunId = readData?.fields?.testRunId?.stringValue;

  if (readText !== testText || readTestRunId !== "codex-smoke-20260623") {
    throw new Error("Firestore readback did not match the written test document");
  }

  return { readText, readTestRunId };
}

if (readOnly) {
  const { readText, readTestRunId } = await readSmokeDocument();
  console.log(JSON.stringify({
    ok: true,
    mode: "read-only",
    projectId,
    documentPath,
    readText,
    readTestRunId
  }, null, 2));
} else {

  const writeResponse = await fetch(documentUrl, {
    method: "PATCH",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      fields: {
        text: { stringValue: testText },
        testRunId: { stringValue: "codex-smoke-20260623" },
        source: { stringValue: "tools/firestore-smoke-test.mjs" },
        updatedAtClient: { stringValue: new Date().toISOString() }
      }
    })
  });

  if (expectWriteDenied && writeResponse.status === 403) {
    console.log(JSON.stringify({
      ok: true,
      mode: "expect-write-denied",
      projectId,
      documentPath,
      status: writeResponse.status
    }, null, 2));
  } else if (!writeResponse.ok) {
    throw new Error(`Firestore write failed: ${writeResponse.status} ${await writeResponse.text()}`);
  } else if (expectWriteDenied) {
    throw new Error("Firestore write unexpectedly succeeded");
  } else {
    const { readText, readTestRunId } = await readSmokeDocument();

    console.log(JSON.stringify({
      ok: true,
      mode: "write-read",
      projectId,
      documentPath,
      readText,
      readTestRunId
    }, null, 2));
  }
}
