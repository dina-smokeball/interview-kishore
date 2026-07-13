# Knowledge Chat

A small internal "ask the documents" assistant for a law firm. A user picks one
or more **knowledge sources** (extracted documents), asks a question, and the
assistant answers using those sources.

Built with **Next.js (App Router)** and the **Vercel AI SDK v5**. The language
model and the vector store are **mocked**, so there are no API keys and no
network calls — everything runs locally and deterministically. The mock model
answers by listing the source titles it was actually given, so you can tell from
the reply whether the right context reached it.

## Run it

```bash
npm install
npm run dev
# open http://localhost:3000
```

You're signed in as **Anna**, who works on the **Apple** matter.

## What we'd like you to do

Use your normal tools and workflow, and talk us through your thinking as you go.

## Where things live

- `app/page.tsx` — the chat UI (sources selector + message list)
- `app/api/chat/route.ts` — the chat endpoint (embeds nothing fancy: builds the
  prompt and calls the model)
- `app/api/sources/route.ts` — lists the sources a user may pick from
- `lib/vector-store.ts` — the mock document store + lookups
- `lib/auth.ts` — the current user and their permitted matters
- `lib/prompt.ts` — system-prompt assembly
- `lib/mock-model.ts` — the deterministic mock LLM (you shouldn't need to touch this)
