# What If QA Professionals Could Build Their Own Supporting Tools?

Event page for the **Mind over Machine** evening:

- **Date:** 18 November 2026, 16:30–19:00 CET
- **Venue:** Matrikel 1, Copenhagen, Denmark
- **Presenter:** Marck Øberg Petersen
- **Event page:** https://www.mindovermachine.dk/events/test-developer/
- **Live site:** https://marckpetersen.github.io/qa-citizen-development-event/

This is one scrolling web page that replaces a PowerPoint deck, styled like [Who is Øberg?](https://marckpetersen.github.io/who-is-oeberg/). Everything is laid out in eight sections; you simply scroll down. Animations start automatically as each part comes into view: the terminal types itself, counters count, cards and questions slide in one after another. No clicking through steps.

Plain HTML, CSS and JavaScript: no build step, no backend, no external dependencies.

---

## Preview locally

```bash
# from the project folder
python3 -m http.server 8000
```

Then open **http://localhost:8000**. (Double-clicking `index.html` also works.)

## Presenting

Just scroll: mouse wheel, trackpad, `Space` / `PgDn`, or a presentation clicker. The menu at the top shows which section you're in, and clicking a menu item jumps there.

| Key | Action |
|---|---|
| `→` / `←` | Jump to the next / previous section |
| `1`–`8` | Jump to a section |
| `F` | Fullscreen |
| `N` | Show speaker notes for the current section (bottom-right corner) |
| `P` | Open the presenter view in a separate window |
| `B` | Blank the screen (press again to return) |
| `?` | Shortcut help |

### Recommended setup with a projector

1. Set your laptop display to **extend** (not mirror) onto the projector.
2. Open the page, then press `P` to open the presenter view (allow pop-ups if asked).
3. Drag the **main window** to the projector and press `F` for fullscreen.
4. Keep the **presenter view** on your laptop. It follows along as you scroll and shows the current section, your notes, a timer and the clock. Its buttons and arrow keys jump the main page between sections.

### Live demo (Section 5)

The demo uses two apps that run in GitHub Codespaces: **Øberg TestLab** (advanced) and **Øberg UAT Test Ideas** (simple). Start both Codespaces before the session. "Open GitHub Codespaces" opens your Codespaces in a new tab. To return, close the tab or press `Alt`+`Tab`; the page stays where you left it. If the demo or the internet fails, scroll to the backup screenshots and click one to enlarge it.

### Ideas wall (Section 7)

Type audience ideas and press Enter. They are stored only in that browser (localStorage) and are never sent anywhere. Click **Download ideas (.txt)** afterwards to keep them. Clicking one of the three discussion questions highlights it while you discuss it.

---

## Editing content

| What | Where |
|---|---|
| Links (portfolio, LinkedIn, Codespaces, …) | `js/config.js` → `links` |
| Lars's text about Mind over Machine | `js/config.js` → `content.larsIntro` |
| Portrait | `js/config.js` → `portrait` (currently from your portfolio site) |
| Event details | `js/config.js` → `event` |
| Backup demo screenshots | `js/config.js` → `demoScreenshots` (add images to `assets/demo/`) |
| Speaker notes | `js/notes.js` (one entry per section) |
| Page text and order | `index.html` (each `<section class="section">` is one section) |
| Colours, fonts, sizes | `css/styles.css` (variables at the top) |

Empty links show as **"link coming soon"** and can't be clicked. Lars's placeholder shows as a dashed orange box until you fill it in.

**Animations:** add `data-reveal` to an element to fade it in on scroll, or `data-stagger` to a container to bring in its children one after another (`data-stagger-step="300"` sets the delay in milliseconds). Visitors who have "reduce motion" turned on in their system settings see everything immediately, without animation.

## After changing a file

The links to the CSS and JS files end in `?v=…` (in `index.html` and `presenter.html`). When you change a file, change that version (for example to today's date) so browsers load the new copy instead of an old saved one. If you still see an old version, press **Ctrl + F5** (Mac: **Cmd + Shift + R**).

## Checks

```bash
node tools/check.mjs
```

This verifies that the scripts parse, that all 8 sections exist and appear in the menu, that every section has speaker notes, that links and config keys match, and that there are no API keys in the code. **Warnings** list what's still missing, so you can use the output as your pre-event checklist.

## Project structure

```
index.html          The event page (all 8 sections)
presenter.html      Presenter view (notes, timer, section list)
css/styles.css      Visual design and animations
js/config.js        ← URLs and editable text
js/notes.js         ← Speaker notes
js/notes-render.js  Formats notes (shared)
js/site.js          Scroll animations, menu, notes, presenter sync, ideas wall
assets/             Favicon and backup demo screenshots
tools/check.mjs     Quality checks (Node.js, no dependencies)
.nojekyll           Tells GitHub Pages to serve files as-is
```

---

## Deployment (GitHub Pages)

Pages is set to **Deploy from a branch → main → / (root)**. Every push to `main` updates the live site within a minute or two.

> The repository is public, so everything in it, including the speaker notes, can be read by anyone. Don't put anything private or secret in these files.

## Before the event

- [ ] Start the Codespaces for Øberg TestLab and Øberg UAT Test Ideas before the session
- [ ] Add Lars's text (`content.larsIntro`)
- [ ] Add backup screenshots to `assets/demo/` for the advanced and simple versions (file names in `js/config.js`)
- [ ] Decide whether to share the Test Case Generator (`links.testCaseGenerator`)
- [ ] Run `node tools/check.mjs`
- [ ] Rehearse on the venue projector: fullscreen, presenter view, clicker
