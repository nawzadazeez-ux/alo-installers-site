# Alo Solar Energy Installers Portal

Cloudflare Pages project with Pages Functions, D1-backed installer accounts,
admin approval, secure sessions, and separate installer pricing.

Cloudflare Pages settings:

- Framework preset: None
- Build command: leave empty
- Build output directory: `/`
- D1 binding name: `DB`
- D1 database: `alo-installers-db`
- Secrets: `ADMIN_USERNAME`, `ADMIN_PASSWORD`

## Conversational Alo AI

The website chat calls `/api/ai/chat` (Cloudflare Pages Function). It offers Ask Alo,
Build My Solar System and Find My EV Charger in Sorani, Arabic and English.
The latest 24 successful messages are kept in this tab's sessionStorage; New chat
clears them. The WhatsApp button opens a customer-controlled draft, never sends it.

In Cloudflare Pages → Settings → Variables and Secrets, set `OPENAI_API_KEY` as a
**secret**, then redeploy. An API account with available credit is required.
Optionally set `OPENAI_MODEL` (default remains `gpt-5-mini`). Never put the key in
HTML or browser JavaScript. No live model call has been verified without a key.
Optional `AI_RATE_LIMITER` binding implements per-IP rate limits; otherwise configure
Cloudflare rate limiting for `/api/ai/chat` to control usage. The endpoint rejects
cross-origin browser calls, oversized payloads and malformed input, but origin
validation alone is not protection against scripted abuse.

Public product knowledge comes from `products.js` and `ev-products.html`. After
editing those listings, run `node scripts/build-ai-knowledge.cjs` and commit the
updated `ai-knowledge.js`. This is catalogue context, not PDF ingestion or live
admin inventory. The assistant never receives dealer prices and cannot access,
approve or change accounts. Product comparisons use listed specifications only.
Calculator values are passed as unverified selections; the assistant explains
those values but does not run a sizing engine. No stock, quote, visit booking or
admin conversation analytics is implemented by this change.

Validate with `node tests/ai-api.test.mjs` and
`node scripts/check-ai-frontend.cjs`. Real model quality and deployed Cloudflare
behavior must also be checked after configuration.
