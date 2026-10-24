# Fomi workspaces — frontend assessment

Two independent Next.js routes share a small, honest mock API:

- `/reference` — Part A, a responsive recreation of the supplied light mockup.
- `/` — Part B, an original professional image workspace built around a **decision trail**.

**Live:** [Part B workspace](https://frame-studio-red.vercel.app) · [Part A mockup implementation](https://frame-studio-red.vercel.app/reference)  
**Source:** [GitHub repository](https://github.com/AbdulAhad2468/fomi-frontend-assessment)

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` for Part B and `http://localhost:3000/reference` for Part A. Run `npm run build` for a production check.

## Architecture

- `src/app/page.js` and `src/app/page.module.css`: original workspace and responsive styles.
- `src/app/reference/`: mockup recreation.
- `src/app/api/generate/route.js`: deterministic, delayed mock API that validates prompts and returns image or motion-study records.
- `src/lib/data.js`: curated sample media and starter project data.
- `public/assets/`: five self-contained sample images.

The API does not call an image or video model. Motion studies animate a still preview to demonstrate the interaction; no video file is rendered. This is intentional for a frontend assessment and is shown in the UI. Uploaded references are session-only UI input and are not sent to the mock API.

## Interaction notes

- `Ctrl/Cmd + Enter` creates an exploration from the Part B composer.
- Select a result to inspect its original prompt and settings; use it as the starting point for the next iteration.
- Add two outputs to compare them side by side.
- Save results locally, download image samples, and preview a motion study.
- Part A supports generation controls, history, expandable options, a detail view, saving, and downloads.

## Submission

The source is intentionally compact and has fewer than 20 tracked files. `node_modules` and `.next` are excluded from version control and should not be included in a submission archive.
