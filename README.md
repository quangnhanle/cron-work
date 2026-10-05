# news-bot

Personal curated quantum-computing research digest delivered to Telegram via GitHub Actions.

## What it does

1. Checks arXiv quant-ph daily, Quantum Computing Report three times/week, and three journals weekly
2. Filters for QEC, fault tolerance, logical qubits, quantum advantage, surface codes, and algorithms
3. Uses RSS title/abstract for arXiv and journals; extracts QCR articles before summarizing with Gemini Flash
4. Sends a timed digest to Telegram (header + one message per article)
5. Commits `state/seen.json` so articles are not resent

## Setup

1. Create a Telegram bot with BotFather and note the token
2. DM the bot, then get your chat id
3. Get a Gemini API key
4. In the GitHub repo settings, add secrets:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
   - `GEMINI_API_KEY`
5. Edit `config/sources.yaml` and `config/topics.yaml`

## Local run

```bash
cp .env.example .env
# fill real values, or keep DRY_RUN=1
export $(grep -v '^#' .env | xargs)
npm install
npm test
npm run digest
```

## Schedule

Workflow: `.github/workflows/digest.yml`

- 07:00 Asia/Ho_Chi_Minh; per-source weekdays live in `config/sources.yaml`
- Manual: Actions → Reading Digest → Run workflow

Manual runs set `RUN_ALL_SOURCES=true`, so they check every configured source regardless of weekday.

## Docs

- Design: `docs/superpowers/specs/2026-09-24-curated-news-digest-bot-design.md`
- Plan: `docs/superpowers/plans/2026-09-24-curated-news-digest-bot.md`
