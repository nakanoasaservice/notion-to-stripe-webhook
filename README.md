# Notion to Stripe Bot

A simple bot that forwards Notion database updates to Discord channels via webhooks. When changes are made to your Notion database, the bot automatically sends formatted messages to your specified Discord channels.

## Invitation Link

```text
https://discord.com/oauth2/authorize?client_id=1314524073170042962&permissions=2048&integration_type=0&scope=bot
```

## How to use

Set the following URL as the webhook URL of your Notion database.

```text
https://notion-to-discord-bot.yoshinani.workers.dev/{{Discord Channel ID}}?title={{Title (Optional)}}
```

## Development toolchain

Use Node.js 24 and the pnpm version pinned in `package.json`.
Run `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm test`, and `pnpm build`.
Vite+ provides formatting, linting, type checks and tests. Tests run locally
in the Cloudflare Workers runtime. The build task bundles with Wrangler in
dry-run mode; it does not deploy. Use `pnpm dev` for local development.

Update Vite+ and its bundled tools together with `vp migrate`, then update the
pinned `setup-vp` version in CI and refresh the pnpm lockfile. Run the project's
checks before committing toolchain updates.
