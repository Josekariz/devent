<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Devent project. Here is a summary of every change made:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using the `instrumentation-client` pattern (correct for Next.js 15.3+). Configures a reverse proxy at `/ingest`, enables exception capture for error tracking, and enables debug mode in development.
- **`next.config.ts`** (updated): Added `rewrites()` to proxy PostHog requests through `/ingest/*` and `/ingest/static/*` and `/ingest/array/*`, reducing the chance of ad-blocker interference. Added `skipTrailingSlashRedirect: true` for PostHog API compatibility.
- **`components/ExplorerBtn.tsx`** (updated): Added `posthog.capture("explore_events_clicked")` inside the existing `onClick` handler.
- **`components/EventCard.tsx`** (updated): Added `"use client"` directive and `posthog.capture("event_card_clicked", { event_title, event_slug, event_location, event_date })` via a `handleClick` handler on the `<Link>` element.
- **`.env.local`** (new): Created with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables (covered by `.gitignore`).

## Tracked events

| Event name | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicks the "Explore Events" button to scroll to the events listing | `components/ExplorerBtn.tsx` |
| `event_card_clicked` | User clicks an event card to view its detail page. Properties: `event_title`, `event_slug`, `event_location`, `event_date` | `components/EventCard.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Create an analytics dashboard in your own PostHog project for the events above.
- Add a daily trend insight for `explore_events_clicked`.
- Add a daily trend insight for `event_card_clicked`.
- Add a breakdown insight for `event_card_clicked` grouped by `event_title`.
- Add a unique users insight for event engagement.
- Add a funnel from `explore_events_clicked` to `event_card_clicked`.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
