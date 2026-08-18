# NEWSBOSS
*Internal newsroom memo format — Cloudcroft Reader / Mountain Monthly*

A reusable template for leadership memos, coverage plans, status updates, and post-mortems. Voice is concise and professional, structured for fast reading by an editor-in-chief or publisher.

## When to use

- Coverage plans (30/60/90-day forward-looking)
- Story status updates
- Post-publication recaps
- Decision memos that need EIC or publisher sign-off
- Incident reports inside the newsroom

Do not use for FAQs, full company newsletters, or 3P updates — those have their own formats.

## Output

A Word document (`.docx`) on US Letter, 1-inch margins, Calibri throughout.

## Document structure

The memo always opens with a letterhead block, then a title, then metadata, then a horizontal rule. Body follows as labeled H2 sections.

1. **Letterhead**
   - Line 1: Publication name in tracked uppercase — `CLOUDCROFT READER` or `MOUNTAIN MONTHLY`
   - Line 2: `Internal Memo` (italic, gray)

2. **Title** — single line, sentence case, bold

3. **Metadata block** (one per line, bold label + value)
   - `TO:`
   - `FROM:`
   - `DATE:`
   - `RE:`

4. **Horizontal rule** — light gray, full width

5. **Body sections** — H2 in forest-green accent, prose or bulleted lists below

## Standard section set

Pick from this list — include only what's relevant.

- **Where it stands** — one paragraph, present tense, what's already established or published.
- **Open threads** — bulleted list with a short bold lead-in label per bullet (e.g., `Demolition timeline. ` followed by a sentence).
- **Reporting targets — next 30 days** — plain bullets, action verbs first.
- **Reporting targets — days 30–60** — same as above.
- **Cadence** — one or two sentences on update rhythm.
- **Risks and dependencies** — bullets, candid.
- **Asks** — bullets, each a single concrete request to the recipient.

## Voice rules

1. Concise / professional. No throat-clearing. No filler intros.
2. Active voice. Present or simple-past tense.
3. Lead with the most important sentence in each section.
4. Use names, dates, dollar amounts, and source titles — not vague references.
5. Bullets carry a short bold lead-in only when the item names a distinct thread or category; plain bullets otherwise.
6. Em dashes are spaced (` — `). Oxford comma is house style.

## Typography

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Body | Calibri | 11pt | Regular | #000000 |
| Letterhead (pub name) | Calibri | 10pt | Bold, tracked | #2D4739 (forest green) |
| Letterhead (`Internal Memo`) | Calibri | 10pt | Italic | #5A5A5A (gray) |
| Title | Calibri | 16pt | Bold | #000000 |
| Meta label | Calibri | 11pt | Bold | #5A5A5A |
| Meta value | Calibri | 11pt | Regular | #000000 |
| H2 section heading | Calibri | 13pt | Bold | #2D4739 |
| Bullet lead-in label | Calibri | 11pt | Bold | #000000 |
| Horizontal rule | — | — | 0.5pt single | #CCCCCC |

## Spacing

- Section heading: 14pt before, 6pt after
- Body paragraph: 8pt after, 1.25 line spacing
- Bullet item: 4pt after, 1.25 line spacing
- Rule under metadata block: 12pt after

## Filename convention

`{Story-or-Topic}-{Memo-Type}.docx`

Examples:
- `Sunspot-Coverage-Plan-Memo.docx`
- `Cloudys-Post-Pub-Recap.docx`
- `Council-FOIA-Status.docx`

## Working example

See `Sunspot-Coverage-Plan-Memo.docx` in this folder for a reference implementation that uses all sections.

## Notes for Claude

- Build with `docx-js` in Node. Use the build script for `Sunspot-Coverage-Plan-Memo.docx` as the canonical reference; copy and adapt the helpers (`p`, `bullet`, `bulletRich`, `h2`, `title`, `metaRow`, `rule`).
- Always validate the output with `scripts/office/validate.py` before delivering.
- The forest-green accent color (`#2D4739`) is shared with the Cloudcroft house palette; do not substitute another green.
