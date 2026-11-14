# What If QA Professionals Could Build Their Own Supporting Tools?

Interactive presentation website for the **Mind over Machine** event:

- **Date:** 18 November 2026, 16:30–19:00 CET
- **Venue:** Matrikel 1, Copenhagen, Denmark
- **Presenter:** Marck Øberg Petersen
- **Event page:** https://www.mindovermachine.dk/events/test-developer/

It replaces a PowerPoint deck: full-screen slides, keyboard navigation, speaker notes and a separate presenter view. It's plain HTML, CSS and JavaScript, with no build step, no backend and no external dependencies.

---

## Preview locally

The site runs straight from the folder, but the presenter view works best through a small local web server.

```bash
# from the project folder
python3 -m http.server 8000
```

Then open **http://localhost:8000** in Chrome, Edge or Firefox.

(If you don't have Python, double-clicking `index.html` also works. The presenter view still connects, because it is opened from the main window.)

## Presenting

| Key | Action |
|---|---|
| `→` `Space` `PgDn` | Next step / slide (presentation clickers work too) |
| `←` `PgUp` | Previous step / slide |
| `Home` / `End` | First / last slide |
| `Esc` or `A` | Agenda overview (`1`–`8` jumps to a section) |
| `F` | Fullscreen |
| `N` | Show speaker notes on this screen |
| `P` | Open the presenter view in a separate window |
| `B` | Blank the screen (press again to return) |
| `?` | Shortcut help |

**Tip:** in fullscreen, the browser uses `Esc` to leave fullscreen, so use `A` for the agenda.

### Recommended setup with a projector

1. Set your laptop display to **extend** (not mirror) onto the projector.
2. Open the presentation, press `P` to open the presenter view, and allow pop-ups if asked.
3. Drag the **main window** to the projector and press `F` for fullscreen.
4. Keep the **presenter view** on your laptop. It shows the current slide, the next slide, your notes, a timer and the clock. The arrow keys work in either window.

The on-screen controls hide automatically after 3 seconds without mouse movement.

### Live demo (Section 5)

"Open the live Test Case Generator" opens the app in a new tab. To return, close the tab or press `Alt`+`Tab`. The presentation stays where you left it. If the demo or the internet fails, click **Backup demo**.

### Ideas wall (Section 7)

Type audience ideas into the wall and press Enter. Ideas are stored only in that browser (localStorage). Nothing is sent anywhere. Click **Download ideas (.txt)** afterwards to keep them.

---

## Editing content

| What | Where |
|---|---|
| Links (portfolio, LinkedIn, live demo, …) | `js/config.js` → `links` |
| Lars's text about Mind over Machine | `js/config.js` → `content.larsIntro` |
| Event details | `js/config.js` → `event` |
| Backup demo screenshots | Add images to `assets/demo/` (names listed in `js/config.js`) |
| Speaker notes | `js/notes.js` (one entry per slide) |
| Slide text and order | `index.html` (each `<section class="slide">` is one slide) |
| Colours, fonts, sizes | `css/styles.css` (variables at the top) |

Empty links show as **"link coming soon"** and can't be clicked. Lars's placeholder shows as a dashed orange box until you fill it in.

Elements with `class="fragment"` are revealed one at a time with `→` / `Space`.

## Checks

```bash
node tools/check.mjs
```

This verifies that the scripts parse, that all 8 sections exist, that every slide has speaker notes, that links and config keys match, and that there are no API keys in the code. **Warnings** list what's still missing (empty links, placeholder text, missing screenshots), so you can use the output as your pre-event checklist.

## Project structure

```
index.html          The presentation (all slides)
presenter.html      Presenter view (notes, next slide, timer)
css/styles.css      Visual design
js/config.js        ← URLs and editable text
js/notes.js         ← Speaker notes
js/notes-render.js  Formats notes (shared)
js/deck.js          Navigation, fragments, agenda, presenter sync, ideas wall
assets/             Favicon and backup demo screenshots
tools/check.mjs     Quality checks (Node.js, no dependencies)
.nojekyll           Tells GitHub Pages to serve files as-is
```

---

## Deploy to GitHub Pages

1. Push the code to `main` in `MarckPetersen/qa-citizen-development-event`.
2. On GitHub, go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Source: Deploy from a branch**, branch **main**, folder **/ (root)**, then click **Save**.
4. After a minute or two, the site is live at
   **https://marckpetersen.github.io/qa-citizen-development-event/**

Every later push to `main` updates the site automatically.

> The repository is public, so everything in it, including the speaker notes, can be read by anyone. Don't put anything private or secret in these files.

## Before the event

- [ ] Fill in `links.portfolio`, `links.linkedin` and `links.liveDemo` in `js/config.js`
- [ ] Add Lars's text (`content.larsIntro`)
- [ ] Add the four backup screenshots to `assets/demo/`
- [ ] Decide whether to share the Test Case Generator (`links.testCaseGenerator`)
- [ ] Run `node tools/check.mjs`
- [ ] Rehearse on the venue projector: fullscreen, presenter view, clicker
