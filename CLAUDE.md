# Repo guide for coding agents

You are a coding agent helping a user set up or run this repo. **`README.md` is the single source of truth** — full setup instructions, prerequisite checks, install commands, env configuration, run commands, and troubleshooting all live there.

## When the user asks you to set up the repo

Read `README.md` end-to-end first, then work through it in this order:

1. **Verify** — run the commands under *Verify what's already installed* to detect what's present.
2. **Install** — for each missing prerequisite, run the matching command from *Install (per requirement)*. Use the OS-specific variant (macOS / Linux / Windows) the user is on.
3. **Create `.archon/.env`** — the file does **not** exist by default. Copy from `.env.example`.
4. **Configure TTS** — **ask the user** which TTS provider they have a key for (Cartesia or ElevenLabs). Do not guess. Cartesia is the recommended default (free tier works); ElevenLabs additionally unlocks SFX and music.
5. **Run** — invoke the workflow per the *Run* section only after every prerequisite check passes. Confirm with the user which input mode they want: an HN top story (`""` / `hn`), a specific article URL (`article <url>`), a product/brand pitch (`marketing <url>`), or a plain-English topic (`idea <prompt>`).

## When something fails at runtime

The *Troubleshooting* section in `README.md` covers the known failure modes (missing skill, `claude` not on PATH, ElevenLabs 402, silent-video cache bug, `import.meta.glob`, `.git/` clobber, prior-success skips, validate errors). Match the error to a heading there before improvising.

## Assistant choice

The user may be on Claude Code (recommended and tested), Codex, or Pi — Archon supports all three via `DEFAULT_AI_ASSISTANT` in `.archon/.env`. If the user isn't using Claude Code, swap the `claude` install command in step 2 for the equivalent assistant CLI; the rest of the flow is identical.

## Don'ts

- Don't invent install commands not in `README.md`.
- Don't skip the prerequisite verification step — installing unconditionally wastes time and may overwrite the user's config.
- Don't pick a TTS provider for the user. Ask.
- Don't scaffold the Remotion project manually — the workflow's `ensure-remotion-project` node does it on first run.
