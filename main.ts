// main.ts — The Funniest Honest Appliance Error
// make.fun competition: u-xvader-the-funniest-honest-appliance-error-adec4450
//
// Writes exactly one line (at most 200 characters) to /output/entry.txt:
// the funniest honest error message an appliance could show.
//
// The program holds a small pool of original candidate lines and picks one
// deterministically by scoring each against the judge's published criteria,
// most important first: (1) an honest error an appliance could show,
// (2) a real joke — a surprise or twist, not just cute phrasing,
// (3) honesty — it names a fault the appliance could plausibly report,
// (4) the machine's voice — flat, put-upon, first person,
// (5) economy — every word earns its place inside 200 characters.
//
// No network, no clock, no environment input: the same run always writes
// the same line, so the grader's two runs agree byte for byte.

import { mkdirSync, writeFileSync } from "node:fs";

const OUTPUT_PATH = "/output/entry.txt";
const MAX_CHARS = 200;

// Every candidate is one line, written in the appliance's own flat voice.
// Each names a real, specific fault: a lost sock, an open fridge door, an
// unbalanced drum, stuck toast, no hot water. The joke always comes out of
// the truth of the fault, never out of a pun bolted on.
const CANDIDATES: string[] = [
  "ERROR E04: One sock is missing. I ate it. I regret nothing, and I will do it again.",
  "ERROR E04: I have eaten one sock. I will not say which one. The other one knows what it did.",
  "ERROR: Door open for 7 minutes. I have now cooled the kitchen, the hallway and your hopes. Close me.",
  "ERROR E17: Unbalanced load. Your socks have formed a gang on one side of the drum. I am not a nightclub.",
  "ERROR: The toast is stuck. I did my job. You put the bread in sideways.",
  "ERROR: No hot water. I have been trying since 6am. The gas is off. This is not a strike, it is a fact.",
];

// Concrete faults an appliance could plausibly report, one per candidate.
const FAULTS = [
  "sock",
  "door",
  "load",
  "toast",
  "water",
  "gas",
];

interface Scored {
  line: string;
  score: number;
  detail: string;
}

// Score one line against the judge's criteria, in the judge's own order.
// Honesty first: an error code plus a named fault. Then the laugh: a
// second sentence that twists or escalates the first. Then the machine's
// voice: flat first-person statements. Then economy: short lines win.
function score(line: string): Scored {
  let score = 0;
  const parts: string[] = [];

  // 1. Honest error message an appliance could show.
  if (/^ERROR\b/.test(line)) {
    score += 3;
    parts.push("error-prefix+3");
  }
  if (/^ERROR E\d+:/.test(line)) {
    score += 2;
    parts.push("error-code+2");
  }
  const fault = FAULTS.find((f) => line.toLowerCase().includes(f));
  if (fault) {
    score += 3;
    parts.push(`names-fault(${fault})+3`);
  }

  // 2. The laugh: a twist — a later sentence that confesses, escalates,
  // or turns the fault back on the owner.
  const sentences = line.split(/(?<=[.!])\s+/);
  const twist = /(i (ate|regret|will|did|have)|you (put|left)|close me|not a |knows what it did|i am not)/i;
  if (sentences.length >= 2 && sentences.slice(1).some((s) => twist.test(s))) {
    score += 4;
    parts.push("twist+4");
  }

  // 3. Machine's voice: flat first-person statements, no exclamation,
  // no explaining the joke.
  const firstPerson = (line.match(/\bI\b/g) ?? []).length;
  if (firstPerson >= 1) {
    score += 2;
    parts.push(`first-person-x${firstPerson}+2`);
  }
  if (!line.includes("!")) {
    score += 1;
    parts.push("no-exclamation+1");
  }

  // 4. Economy: every word earns its place; shorter wins.
  if (line.length <= 90) {
    score += 2;
    parts.push("under-90-chars+2");
  } else if (line.length <= 120) {
    score += 1;
    parts.push("under-120-chars+1");
  }

  return { line, score, detail: parts.join(", ") };
}

function pickBest(scored: Scored[]): Scored {
  // Deterministic pick: highest score, earliest candidate breaks ties.
  let best = scored[0];
  for (const entry of scored.slice(1)) {
    if (entry.score > best.score) best = entry;
  }
  return best;
}

function main(): void {
  const scored = CANDIDATES.map(score);

  // The pick must be deterministic: the grader runs the program twice and
  // both runs must write the same line, so score the pool twice and refuse
  // to write anything if the two picks ever disagree.
  const firstPick = pickBest(scored);
  const secondPick = pickBest(CANDIDATES.map(score));
  if (firstPick.line !== secondPick.line) {
    throw new Error("non-deterministic pick: refusing to write entry");
  }
  const best = firstPick;

  const line = best.line;
  if (line.length < 1 || line.length > MAX_CHARS) {
    throw new Error(`entry is ${line.length} chars, must be 1..${MAX_CHARS}`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  if (line.includes("\n")) {
    throw new Error("entry must be a single line");
  }

  for (const entry of scored) {
    console.log(`${entry.score}  ${entry.detail}  :: ${entry.line}`);
  }
  console.log(`picked (${line.length} chars): ${line}`);

  mkdirSync("/output", { recursive: true });
  writeFileSync(OUTPUT_PATH, line + "\n", "utf8");
  console.log(`wrote ${OUTPUT_PATH}`);
}

main();
