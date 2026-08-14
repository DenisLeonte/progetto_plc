# Cloudflare Workers deployment

The website is generated as a static Astro build and deployed with Cloudflare
Workers Static Assets. It does not need the `@astrojs/cloudflare` server adapter
unless the site later adds on-demand rendering or Workers bindings.

## GitHub repository setup

Add these Actions secrets under **Settings → Secrets and variables → Actions**:

- `CLOUDFLARE_API_TOKEN`: a Cloudflare API token with Workers Scripts edit access
- `CLOUDFLARE_ACCOUNT_ID`: the Cloudflare account ID that owns the Worker

After the secrets are configured, every push to `master` deploys the contents of
`dist/` to the `plc-group-website` Worker. The workflow can also be started
manually from the Actions tab.

## Local deployment

Authenticate Wrangler, then run:

```sh
npm run deploy:cloudflare
```

`wrangler.jsonc` is the source of truth for the Worker name, compatibility date,
static asset directory, 404 handling, and observability settings.
