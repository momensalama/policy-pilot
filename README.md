# Policy Pilot

A full-stack web app that collects company information through an assessment wizard, then lets you chat with an AI to generate and edit company policies.

## Tech Stack

- Next.js 16, React 19, TypeScript
- PostgreSQL with Drizzle ORM
- Tailwind CSS v4, shadcn/ui, Framer Motion
- Groq AI (via Vercel AI SDK)
- Tiptap for the policy editor
- Docker for the database

## Getting Started

### Prerequisites

- Node.js 18+
- Docker
- A [Groq](https://console.groq.com) API key

### Setup

1. Clone the repo and install dependencies:

```bash
git clone https://github.com/momensalama/policy-pilot.git
cd policy-pilot
npm install
```

2. Copy the env file and add your Groq API key:

```bash
cp .env.example .env.local
```

Then open `.env.local` and replace `gsk_...` with your actual key. I used Groq because it has a free tier, but you can swap it with an OpenAI key if you prefer. The app uses the Vercel AI SDK so switching providers is straightforward.

3. Start the database:

```bash
docker compose up -d
```

4. Run migrations:

```bash
npm run db:generate
npm run db:migrate
```

5. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be taken to the assessment wizard.

## How It Works

1. **Assessment** - A step-by-step wizard collects your company name, email, location, shareholders, and primary activity. All data is saved to PostgreSQL.

2. **Chat** — Once the assessment is done, you land on a ChatGPT-style interface. The AI knows your company details and can answer questions or generate policies. You can also edit or delete your assessment from here.

3. **Policies** — Generated policies show up on the Policies page in a Tiptap editor where you can edit, format, and delete them. Changes auto-save.

## Scripts

| Command               | Description                 |
| --------------------- | --------------------------- |
| `npm run dev`         | Start dev server            |
| `npm run build`       | Production build            |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate`  | Run migrations              |
| `npm run db:studio`   | Open Drizzle Studio         |

## Live Demo

[policy-pilot.vercel.app](https://policy-pilot.vercel.app)

## Deployment

The app is deployed on Vercel with Neon for the database.

1. Create a free PostgreSQL database on [Neon](https://neon.tech)
2. Run migrations against it:
   ```bash
   DATABASE_URL="your-neon-connection-string" npm run db:migrate
   ```
3. Import the repo on [Vercel](https://vercel.com) and add these environment variables:
   - `DATABASE_URL` — your Neon connection string
   - `GROQ_API_KEY` — your Groq API key
4. Deploy
