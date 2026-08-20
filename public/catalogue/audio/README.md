# The page-turn cue

This directory is the seam. Drop the recording here as **`page-turn.wav`** and it
replaces the synthesised placeholder — nothing else in the codebase changes.
`src/lib/sound.ts` probes for this file once on the first user gesture and
silently keeps the placeholder if it is not present.

## What to record

A **real veneer sheet lifted off a stack, recorded at Woodlark.** Not a stock
"page flip" — anyone in this trade will hear the difference, and that difference
is most of the point.

- 150–350 ms, trimmed hard at both ends (no silence, no tail)
- mono, 48 kHz, 16-bit or 24-bit WAV
- peak around −6 dBFS
- as dry as possible: room reverb fights the ambience the book already has

Record several lifts — fast, slow, from the top of the stack and from halfway
down — and keep the driest, most neutral one. The book varies playback rate
slightly on every turn, so a single clean take never sounds repetitive.

If you supply mp3 or m4a instead, change `REAL_CUE_URL` at the top of
`src/lib/sound.ts` to match.
