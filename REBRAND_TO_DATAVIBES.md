# Rebrand to Datavibes — vanity / front-end ONLY

**Scope:** Only change text and labels that **users see** (UI, metadata, share text, download filenames, alt text, emails). Do **not** change internal function names, model names, variable names, localStorage keys, schema keys, system prompts, or API config.

---

## 1. Logo: real URL (already done)

- **URL in use:** `https://pixiomedia.nyc3.digitaloceanspaces.com/uploads/1759034358692-scira.png`
- **Defined in:** [lib/constants.ts](lib/constants.ts) as `APP_LOGO_URL`
- **Used in:** [components/logos/scira-logo.tsx](components/logos/scira-logo.tsx)

No code changes needed for the logo URL.

---

## 2. Front-end only: change visible name to “Datavibes”

Everything below is **user-visible** (UI copy, metadata, share text, filenames, alt text). No internal identifiers.

### Sidebar and shell

| File | Line(s) | Current (visible) | Change to |
|------|---------|-------------------|-----------|
| [components/app-sidebar.tsx](components/app-sidebar.tsx) | 363 | `scira` (label next to logo) | `Datavibes` |
| [components/app-sidebar.tsx](components/app-sidebar.tsx) | 838 | `Scira Pro` / `Scira Free` | `Datavibes Pro` / `Datavibes Free` |
| [components/app-sidebar.tsx](components/app-sidebar.tsx) | 978 | `Scira Pro` / `Scira Free` | `Datavibes Pro` / `Datavibes Free` |

### Dialogs

| File | Line(s) | Current (visible) | Change to |
|------|---------|-------------------|-----------|
| [components/chat-dialogs.tsx](components/chat-dialogs.tsx) | 143 | `scira` (Pro dialog title) | `Datavibes` |
| [components/dialogs/share-dialog.tsx](components/dialogs/share-dialog.tsx) | 85 | `'ShareIcond Chat - Scira'` | `'Shared Chat - Datavibes'` (fix typo ShareIcond → Shared) |
| [components/keyboard-shortcuts-dialog.tsx](components/keyboard-shortcuts-dialog.tsx) | 183 | `...hotkeys in Scira` | `...hotkeys in Datavibes` |

### About, terms, privacy (page copy)

| File | Line(s) | Current (visible) | Change to |
|------|---------|-------------------|-----------|
| [app/(content)/about/page.tsx](app/(content)/about/page.tsx) | 65 | `scira` (header) | `Datavibes` |
| [app/(content)/about/page.tsx](app/(content)/about/page.tsx) | 90 | `Try Scira` | `Try Datavibes` |
| [app/(content)/about/page.tsx](app/(content)/about/page.tsx) | 227 | `What makes Scira different` | `What makes Datavibes different` |
| [app/(content)/about/page.tsx](app/(content)/about/page.tsx) | 311 | `alt="Scira badge"` | `alt="Datavibes badge"` |
| [app/(content)/about/page.tsx](app/(content)/about/page.tsx) | 689 | `Scira Lookout` | `Datavibes Lookout` |
| [app/(content)/about/page.tsx](app/(content)/about/page.tsx) | 725 | `What is Scira?` | `What is Datavibes?` |
| [app/(content)/about/page.tsx](app/(content)/about/page.tsx) | 727 | `Scira is an open-source...` | `Datavibes is an open-source...` |
| [app/(content)/about/page.tsx](app/(content)/about/page.tsx) | 760 | `What AI models does Scira use?` | `What AI models does Datavibes use?` |
| [app/(content)/about/page.tsx](app/(content)/about/page.tsx) | 762 | `Scira uses a range...` | `Datavibes uses a range...` |
| [app/(content)/about/page.tsx](app/(content)/about/page.tsx) | 768 | `How does Scira ensure...` | `How does Datavibes ensure...` |
| [app/(content)/about/page.tsx](app/(content)/about/page.tsx) | 770 | `Scira grounds outputs...` | `Datavibes grounds outputs...` |
| [app/(content)/about/page.tsx](app/(content)/about/page.tsx) | 782, 783 | `zaid@scira.ai` (contact link) | Your contact email |
| [app/(content)/about/page.tsx](app/(content)/about/page.tsx) | 806 | `© ... Scira` | `© ... Datavibes` |
| [app/(content)/terms/page.tsx](app/(content)/terms/page.tsx) | 233–234 | `zaid@scira.ai` | Your contact email |

### Voice page (UI labels only)

| File | Line(s) | Current (visible) | Change to |
|------|---------|-------------------|-----------|
| [app/voice/page.tsx](app/voice/page.tsx) | 397 | `"Scira"` (assistant label in chat) | `"Datavibes"` |
| [app/voice/page.tsx](app/voice/page.tsx) | 422 | `Scira` (label) | `Datavibes` |
| [app/voice/page.tsx](app/voice/page.tsx) | 476 | `Scira Voice` (heading) | `Datavibes Voice` |

### Other UI

| File | Line(s) | Current (visible) | Change to |
|------|---------|-------------------|-----------|
| [components/searches-page.tsx](components/searches-page.tsx) | 344 | `... with Scira` | `... with Datavibes` |
| [components/xql-pro-upgrade-screen.tsx](components/xql-pro-upgrade-screen.tsx) | 19 | `Scira` | `Datavibes` |
| [app/(content)/x-wrapped/[username]/page.tsx](app/(content)/x-wrapped/[username]/page.tsx) | 409 | `· Built with Scira` | `· Built with Datavibes` |

### Logo alt text (accessibility)

| File | Line(s) | Current (visible) | Change to |
|------|---------|-------------------|-----------|
| [components/logos/scira-logo.tsx](components/logos/scira-logo.tsx) | 18 | `alt="Scira Logo"` | `alt="Datavibes Logo"` |

### Metadata (titles, descriptions, share/social)

| File | Line(s) | Current (visible in shares/tab) | Change to |
|------|---------|---------------------------------|-----------|
| [app/(content)/x-wrapped/layout.tsx](app/(content)/x-wrapped/layout.tsx) | 6 | `...powered by Scira AI` | `...powered by Datavibes AI` |
| [app/(content)/x-wrapped/layout.tsx](app/(content)/x-wrapped/layout.tsx) | 11, 14, 25 | `https://scira.ai/...` | Your domain (e.g. `https://mydatavibes.com/...`) |
| [app/search/[id]/page.tsx](app/search/[id]/page.tsx) | 76, 79, 80, 94, 95 | `A search in scira.ai`, `siteName: 'scira.ai'`, `creator: '@sciraai'` | `A search on Datavibes`, `siteName: 'Datavibes AI'` or your domain, `creator: '@yourhandle'` |
| [components/message-parts/index.tsx](components/message-parts/index.tsx) | 492 | `title: 'Scira AI'` (share/copy) | `title: 'Datavibes AI'` |

### Download filenames (user sees these)

| File | Line(s) | Current (visible) | Change to |
|------|---------|-------------------|-----------|
| [components/message-parts/index.tsx](components/message-parts/index.tsx) | 513, 576 | `scira-export-...` (PDF/MD filename) | `datavibes-export-...` |
| [app/api/export/pdf/route.ts](app/api/export/pdf/route.ts) | 306 | Header fallback `'Scira AI'` (in PDF) | `'Datavibes AI'` |
| [app/api/export/pdf/route.ts](app/api/export/pdf/route.ts) | ~2003 | Default filename `scira-export.pdf` | `datavibes-export.pdf` |

### Emails / mailto (user sees these)

| File | Line(s) | Current (visible) | Change to |
|------|---------|-------------------|-----------|
| [components/student-domain-request-button.tsx](components/student-domain-request-button.tsx) | 64 | `zaid@scira.ai` in mailto | Your contact email |
| [components/emails/lookout-completed.tsx](components/emails/lookout-completed.tsx) | 114 | `scira.ai` (in email body) | Your domain or “Datavibes” |

---

## 3. Do NOT change (internal — not vanity)

- **Model names/IDs** — e.g. `scira-default`, `scira-grok-4` (provider config, localStorage).
- **Function / variable / component names** — e.g. `scira`, `SciraLogo`, `drawSciraLogo`, `scira-logo.tsx`.
- **LocalStorage keys** — e.g. `scira-draft-input`, `scira-selected-model`, `scira-search-provider`.
- **Schema / DB preference keys** — e.g. `scira-blur-personal-info`, `scira-custom-instructions-enabled`.
- **System prompts / LLM instructions** — e.g. in `app/actions.ts`, `app/api/lookout/route.ts`, `app/voice/page.tsx` (instructions string), `hooks/use-voice-client.ts`.
- **API headers / config** — e.g. `ai/providers.ts` (`HTTP-Referer`, `X-Title`), `lib/auth.ts` redirect URLs.

Only the **visible** strings in this doc are part of the vanity rebrand.

---

## 4. Theme: pink and purple accents

- Accents should be pink and purple, not orange/gold.
- Update [app/globals.css](app/globals.css) in both `:root` and `.dark`:
  - `--primary`
  - `--secondary`
  - `--ring`
  - `--chart-1`
  - `--chart-2`
  - `--primary-foreground`
  - `--secondary-foreground`
- Update [components/settings-dialog.tsx](components/settings-dialog.tsx) so the theme preview uses the same primary OKLCH values as the real theme.
- Leave semantic orange alone where it is intentional:
  - Reddit branding in `components/reddit-search.tsx`
  - warning/error states in `components/message.tsx`, `app/lookout/components/warning-card.tsx`, and `components/ui/progress-ring.tsx`
  - semantic chart/badge usage such as `components/weather-chart.tsx` and `components/interactive-stock-chart.tsx`
