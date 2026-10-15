# Building AI Features That Feel Fun Without Feeling Broken

**TechBash 2026** | Courtney Yatteau, Developer Advocate at Esri

Small, interactive JavaScript examples that show how to make AI features playful **and** reliable. An AI response is only part of the product: the application still owns validation, the user's accepted work, request timing, review, and recovery.

📄 **[View the audience slides (PDF)](Slides.pdf)**  
🧭 **[Open the demo hub](index.html)** after starting the local server  
👩‍💻 **Presenter:** [Courtney Yatteau](https://github.com/cyatteau)

## What you'll explore

| Demo | File | Main idea | What keeps it dependable |
| --- | --- | --- | --- |
| **1. Tiny Adventure** | [`01-adventure.html`](01-adventure.html) | AI writes branching story scenes and action labels | Exactly three scenes; validated choices; accepted history and locally saved versions |
| **2. Activity Finder** | [`02-activity-finder.html`](02-activity-finder.html) | AI turns natural language into supported filters | JavaScript filters a fixed, fictional catalog; editable filters; sample map pins |
| **3. Text Remixer** | [`03-text-remixer.html`](03-text-remixer.html) | AI suggests a new tone for a draft | Separate suggestion and draft; explicit Apply and Undo |
| **4. Sketch & Caption** | [`05-sketch-caption.html`](05-sketch-caption.html) | AI interprets the actual canvas image | Human-editable description; kept drawing and approved caption |
| **5. Resilience Lab** | [`04-resilience-lab.html`](04-resilience-lab.html) | Simulated late answers, stopping and failure | Request ownership checks, bounded retries, preserved state, labeled fallback |

The resilience lab contains **three repeatable experiments** and intentionally makes **no AI calls**. The first four demos can make live OpenAI API requests, or demonstrate key interactions with clearly labeled prepared alternatives.

## Run locally

You'll need **Node.js 22 or newer** and a modern browser. No `npm install`, bundler, or framework setup is needed. The examples are standalone HTML with embedded CSS and JavaScript; the server uses built-in Node APIs.

1. Clone this repo or download its ZIP, then open a terminal in the folder that contains `server.mjs`.
2. To enable live AI, copy `.env.example` to `.env` and replace the placeholder with an **API key of your own**. Leave `.env` on your computer and out of Git.
3. Start the server:

   ```bash
   node server.mjs
   ```

4. Open **http://127.0.0.1:8787** in your browser. The hub links to all five pages.

On Windows, `Start-AI-Demos.cmd` provides a launch shortcut **after you've set up your `.env`**. If you don't have an API key, use `node server.mjs` instead to explore the demos and their prepared content.

### With no API key

The **Resilience Lab** works fully without one. Activity Finder still has manual filters and a fixed catalog, Text Remixer can load a prepared sample, Tiny Adventure has an authored baseline, and Sketch & Caption has a prepared example. Open each relevant page and press **Alt+P** to show the optional presenter/backup controls. These modes are labeled **prepared**, **authored**, or **simulated**, not passed off as live AI.

### Example `.env`

```dotenv
OPENAI_API_KEY=replace_with_your_own_key
OPENAI_MODEL=gpt-4.1-mini
PORT=8787
```

The server sends calls to the OpenAI Responses API using the selected model. **Your own OpenAI account may incur API usage charges.** You can create/manage API keys at [OpenAI's API key page](https://platform.openai.com/api-keys).

## Key architectural decisions

**Keep the key on the server.** The local Node server (`server.mjs`) holds the provider key, validates incoming inputs and model outputs, limits concurrent work, and serves `/api/scene`, `/api/search`, `/api/rewrite`, and `/api/sketch`. Browser pages send requests to the local server rather than directly to the provider. This is a small local teaching server, not a production-ready authentication or billing backend.

**Ask for structured responses, then validate again.** Tiny Adventure needs `title`, `text`, `choices`, and `ending`; Activity Finder needs supported filter values; Text Remixer needs a headline and body; Sketch & Caption needs a guess, description, and uncertainty. The app checks structure and its own rules before accepting a result. Valid JSON does not guarantee that content is factually or semantically correct.

**Keep user-approved work separate from a pending attempt.** The app retains story history, editable drafts, and drawings. It uses request versions and `AbortController` to prevent obsolete responses from overwriting newer work. Local cancellation does not guarantee remote compute or billing stopped.

**Provide truthful recovery.** Prepared content is visibly labeled, filters can be used manually, and a failed request doesn't erase existing work. The lab uses fixed timers and fixtures, so you can reproduce success, cancellation, and failure without relying on network conditions.

## The map is not generated by AI

Activity Finder uses **ArcGIS Maps SDK for JavaScript 5.1**, ArcGIS map components, and an OpenStreetMap basemap. Sample activity records, IDs, and coordinates are **hard-coded fictional teaching data**, not provider-generated place information. AI suggests filters; ordinary JavaScript matches the records, and the map renders their pre-defined points.

The map needs an internet connection for ArcGIS SDK resources and map tiles, but **does not require an ArcGIS API key in this sample** because it uses an OpenStreetMap layer. If the map does not load, the manual filters and activity cards still work. This sample does not support real-world proximity, live venue listings, hours, weather, or availability.

## TRUST: a practical checklist

**T** · **Tell** users what is happening: real response, waiting, prepared example, or error.  
**R** · **Retain** accepted work when another request begins.  
**U** · **Understand** request ownership so old answers cannot replace new ones.  
**S** · **Stop** and recover cleanly with honest retries and useful fallback paths.  
**T** · **Test** whether AI genuinely improves the task over a simpler interface.

## Files in this repo

```text
.
├── README.md
├── Slides.pdf
├── index.html
├── 01-adventure.html
├── 02-activity-finder.html
├── 03-text-remixer.html
├── 04-resilience-lab.html
├── 05-sketch-caption.html
├── server.mjs
├── start-AI-demos.mjs
├── Start-AI-Demos.cmd
├── .env.example
├── .gitignore
└── .nojekyll
```

## References

- [OpenAI Responses API](https://platform.openai.com/docs/api-reference/responses)
- [OpenAI Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs)
- [OpenAI image input and vision](https://platform.openai.com/docs/guides/images-vision)
- [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [MDN: ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions)
- [ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/latest/)
- [ArcGIS map components](https://developers.arcgis.com/javascript/latest/sample-code/intro-map-components/)
- [ArcGIS OpenStreetMapLayer](https://developers.arcgis.com/javascript/latest/references/core/layers/OpenStreetMapLayer/)

## Before making this a real product

Add proper authentication, per-user quotas, monitoring, content policies, privacy and retention handling, stronger error reporting, and tests for keyboard use, accessibility, and response quality. The examples prioritize clear browser behavior rather than production infrastructure.

---

**The takeaway:** Build the fun part. Own the dependable part.  
Courtney Yatteau | Developer Advocate, Esri | TechBash 2026
