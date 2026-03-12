import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const client = new Anthropic();

interface TestGenerationResult {
  filename: string;
  testCode: string;
  reasoning: string;
}

async function generateTestsFromSpec(specPath: string): Promise<void> {
//   const spec = fs.readFileSync(specPath, "utf-8");
  const spec = fs.readFileSync(path.resolve(specPath), "utf-8");
  const resolvedPath = path.resolve(specPath);
  console.log("Resolved path:", resolvedPath);
  console.log("File exists:", fs.existsSync(resolvedPath));
  const specName = path.basename(specPath, ".md");

  console.log(`\nReading spec: ${specPath}`);
  console.log("Sending to Claude for test generation...\n");
  console.log("Spec content length:", spec.length);

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    system: `You must respond with ONLY a valid JSON object. No preamble, no explanation, no markdown. Just the raw JSON.

    You are an expert QA engineer specializing in Playwright end-to-end tests using TypeScript.
    
When given a feature spec, you generate a complete, well-structured Playwright test file.

You must respond with a valid JSON object in exactly this shape:
{
  "filename": "the suggested filename for the test file",
  "testCode": "the complete Playwright TypeScript test code as a string",
  "reasoning": "a brief explanation of your testing strategy and what you chose to cover"
}

Rules:
- Use @playwright/test imports
- Use descriptive test names that map to acceptance criteria
- Include positive and negative test cases
- Do not wrap the JSON in markdown code blocks
- testCode should be a single string with \\n for newlines
- The target application is https://the-internet.herokuapp.com. All page.goto() calls must use relative paths (e.g. '/login'). Use selectors and credential values that match the real HTML of that site exactly.`,
    messages: [
      {
        role: "user",
        content: `Generate Playwright tests for the following feature spec:\n\n${spec}`,
      },
    ],
  });

  const firstBlock = message.content[0];
  const responseText =
    firstBlock?.type === "text" ? firstBlock.text : "";

  let result: TestGenerationResult;
  try {
    const cleaned = responseText.replace(/^```json\n?|^```\n?|```$/gm, "").trim();
    result = JSON.parse(cleaned);
  } catch {
    console.error("Failed to parse Claude response as JSON:");
    console.error(responseText);
    process.exit(1);
  }

  const outputPath = path.join("output", result.filename);
  fs.writeFileSync(outputPath, result.testCode);

  console.log("✅ Test file generated successfully!");
  console.log(`📄 Output: ${outputPath}`);
  console.log(`\n💭 Claude's reasoning:\n${result.reasoning}`);
}

const specPath = process.argv[2];
if (!specPath) {
  console.error("Usage: npx tsx src/generate.ts <path-to-spec>");
  process.exit(1);
}

generateTestsFromSpec(specPath).catch(console.error);