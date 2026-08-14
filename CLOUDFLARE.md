# Cloudflare Workers deployment

The website is generated as a static Astro build and deployed with Cloudflare
Workers Static Assets. It does not need the `@astrojs/cloudflare` server adapter
unless the site later adds on-demand rendering or Workers bindings.

## GitHub repository setup

Add these Actions secrets under **Settings → Secrets and variables → Actions**:

- `CLOUDFLARE_API_TOKEN`: a Cloudflare API token with Workers Scripts edit access
- `CLOUDFLARE_ACCOUNT_ID`: the Cloudflare account ID that owns the Worker

After the secrets are configured:

- every pull request targeting `master` deploys an isolated Worker named
  `plc-group-pr-<PR number>`;
- the branch preview URL is shown in the workflow run summary;
- every push to `master` deploys `dist/` to the production
  `plc-group-website` Worker;
- the production workflow can also be started manually from the Actions tab.

Pull request previews use a separate Worker and do not change production
traffic. Pushing another commit to the pull request updates the same preview
Worker.

## Local deployment

Authenticate Wrangler, then run:

```sh
npm run deploy:cloudflare
```

`wrangler.jsonc` is the source of truth for the Worker name, compatibility date,
static asset directory, 404 handling, and observability settings.
