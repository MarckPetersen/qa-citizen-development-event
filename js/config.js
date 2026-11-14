/* ==========================================================================
   PRESENTATION CONFIGURATION
   --------------------------------------------------------------------------
   This is the one file you edit for links and small pieces of text.
   - Leave a URL as an empty string ""  → the button shows "Link coming soon"
     and is not clickable.
   - Paste a full URL (starting with https://) → the button becomes active.
   No secrets or API keys belong in this file: it is public on GitHub Pages.
   ========================================================================== */

window.DECK_CONFIG = {
  event: {
    title: "What If QA Professionals Could Build Their Own Supporting Tools?",
    subtitle: "Exploring AI, Vibe Coding, No-Code and Citizen Development in Quality Engineering",
    date: "18 November 2026",
    time: "16:30–19:00 CET",
    venue: "Matrikel 1, Copenhagen, Denmark",
    community: "Mind over Machine",
    presenter: "Marck Øberg Petersen"
  },

  links: {
    // Event page (provided in the brief)
    mindOverMachine: "https://www.mindovermachine.dk/events/test-developer/",

    // TODO: paste the URL of your "Who is Øberg?" portfolio website
    portfolio: "",

    // Your GitHub profile
    github: "https://github.com/MarckPetersen",

    // TODO: paste your LinkedIn profile URL
    linkedin: "",

    // TODO: URL of the live Test Case Generator used in the demo (Section 5)
    liveDemo: "",

    // TODO: public link to the Test Case Generator, only if you choose to share it (Section 8)
    testCaseGenerator: ""
  },

  content: {
    // TODO: input from Lars about Mind over Machine (Section 1).
    // Leave empty to show a visible placeholder.
    larsIntro: "",
    larsName: "Lars"
  },

  // Backup demo screenshots (Section 5). Put the image files in assets/demo/
  // using these names, or change the file names here. Missing images show a
  // placeholder box telling you which file to add.
  demoScreenshots: [
    { file: "assets/demo/01-requirements.png", caption: "1. Requirements / test basis" },
    { file: "assets/demo/02-objectives.png",   caption: "2. Test objectives, level & criticality" },
    { file: "assets/demo/03-test-cases.png",   caption: "3. Generated test cases" },
    { file: "assets/demo/04-traceability.png", caption: "4. Traceability & human review" }
  ]
};
