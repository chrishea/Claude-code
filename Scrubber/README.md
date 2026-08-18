# The Scrubber

Editorial analysis system for the *Cloudcroft Reader* and *Mountain Monthly*.

## Current

The system now ships as a Claude skill (`the-scrubber.skill`), built from the files below.
Four modes, picked by risk rather than by habit:

| Mode | For | Budget |
|---|---|---|
| Lite | Daily filings, briefs, calendar items | 2–5 min |
| Pro | Short editorials — craft and voice | 5–10 min |
| Ultra | Investigations, leads, legal exposure | 15 min → 2 hrs by length |
| Improve | Hand back a rewritten draft, not a critique | 3–8 min |

Lite can be delivered as an interactive redline — an HTML page where the editor
accepts or rejects each fix and exports the decisions for the desk.

## Source prompts (May 2026)

These are the originals the skill was built from. Still usable standalone —
copy a section into a conversation and paste the article underneath.

- `Scrubber-Prompts-ALL.md` — all four prompts in one file, plus the scoring
  system, decision thresholds, and the publications table. **Start here.**
- `Scrubber-Ultra` — inside Prompts-ALL. Weighted scoring, eight passes.
- `Scrubber-Pro.md` — craft read.
- `Scrubber-Lite.md` — copy pass.
- `Scrubber-Lite-Redline.md` — Lite plus the interactive accept/reject HTML spec.

## Related

- `NewsBoss.md` — internal newsroom memo format. Not a scrub. Note that memos
  use a *spaced* em dash; article copy closes it up. Don't carry one into the other.

## Historical

- `the-scrubber-updated.html` (Aug 2026) — a single-mode reference page.
  Superseded by the skill, which restored rules this version had dropped:
  NMED, the Oxford comma override, ordinals, the `non-` prefix, the
  village/Village distinction, and the six local traps.
- `article-improvement-tool_3.html`, `Prompter.html` (Mar 2026) — earlier tools.
- `scrubber-lite-redline.html` (May 2026) — a generated redline, kept as an example.
