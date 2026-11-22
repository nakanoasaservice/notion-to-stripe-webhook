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

Update Vite+ and its bundled tools together with `vp migrate`, then refresh the
pnpm lockfile. CI resolves the Vite+ version from the project dependency or catalog
automatically. Run the project's checks before committing toolchain updates.

### Runtime versions

`package.json` is the source of truth for development Node.js (`devEngines.runtime`)
and pnpm (`packageManager`). The major versions in `.mise.toml` only bootstrap the
environment. Install the [global Vite+ CLI](https://viteplus.dev/guide/global-cli)
with environment management enabled, then use `vp install --frozen-lockfile`
and `vp run <script>` to run with the declared versions. `pnpm` commands also use
them when the Vite+ shims are active. The project-local CLI alone does not switch
Node.js versions.

CI reads the same manifest automatically; compatibility-test matrices explicitly
override Node.js. pnpm runtime management is disabled so it does not override
Vite+'s selection. Keep any consumer-facing `engines.node` support range separate
from the development pin.
