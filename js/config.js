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

    // Your "Who is Øberg?" portfolio website
    portfolio: "https://marckpetersen.github.io/who-is-oeberg/",

    // Your GitHub profile
    github: "https://github.com/MarckPetersen",

    // Your LinkedIn profile (as linked from your portfolio)
    linkedin: "https://www.linkedin.com/in/marckpetersen/",

    // TODO: URL of the live Test Case Generator used in the demo (Section 5)
    liveDemo: "",

    // TODO: public link to the Test Case Generator, only if you choose to share it (Section 8)
    testCaseGenerator: ""
  },

  // Portrait shown in the "Who is Øberg?" section (taken from your portfolio site).
  // Set to "" to hide it.
  portrait: "https://marckpetersen.github.io/who-is-oeberg/assets/images/marck.png",

  content: {
    // TODO: input from Lars about Mind over Machine (Section 1).
    // Leave empty to show a visible placeholder.
    larsIntro: "",
    larsName: "Lars"
  },

  // Backup demo screenshots (Section 5). The first one is the real screenshot
  // from your portfolio site. Add more files to assets/demo/ and list them here.
  // Missing images show a placeholder box telling you which file to add.
  demoScreenshots: [
    { file: "https://marckpetersen.github.io/who-is-oeberg/assets/images/testcase-generator.png", caption: "AI-assisted Test Case Generator" },
    { file: "assets/demo/02-objectives.png",   caption: "Test objectives, level & criticality" },
    { file: "assets/demo/03-test-cases.png",   caption: "Generated test cases" },
    { file: "assets/demo/04-traceability.png", caption: "Traceability & human review" }
  ]
};
