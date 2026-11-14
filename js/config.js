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

    // Airport Stand Allocation Simulator (Section 4)
    standSimulator: "https://marckpetersen.github.io/airport-stand-simulator/",

    // GitHub Codespaces overview (Section 5). Both apps run in a Codespace on a
    // private port, so there is no public app link. Change to the Codespace URL
    // of a specific repo if you prefer.
    codespaces: "https://github.com/codespaces",

    // TODO: public link to the Test Case Generator, only if you choose to share it (Section 8)
    testCaseGenerator: ""
  },

  // Portrait shown in the "Who is Øberg?" section (taken from your portfolio site).
  // Set to "" to hide it.
  portrait: "https://marckpetersen.github.io/who-is-oeberg/assets/images/marck.png",

  content: {
    // Text about Mind over Machine (Section 1), written from mindovermachine.dk
    // and mindovermachine.dk/about. Replace it with Lars's own words if he sends
    // some, and change introSource to e.g. "Lars, Mind over Machine".
    larsIntro: "Mind over Machine is a non-profit foundation for regenerative software development: software that creates long-term value for people and society. It works as a think tank, a laboratory and a community of practice, where practitioners, researchers, students and decision-makers test ideas and share what they learn. You don’t need to be a developer, and there’s no commitment: start by showing up. Tonight is exactly that: a curious practitioner sharing an experiment, so we can explore it together.",
    introSource: "About Mind over Machine · mindovermachine.dk"
  },


  // Backup demo screenshots (Section 5), shown in groups. Put the images in
  // assets/demo/ with these names (or change the names here). Missing images
  // show a placeholder box telling you which file to add.
  demoScreenshots: [
    { group: "Advanced · Øberg TestLab", file: "assets/demo/advanced-01-requirements.png", caption: "Requirements: paste and check" },
    { group: "Advanced · Øberg TestLab", file: "assets/demo/advanced-02-ai-analysis.png", caption: "AI analysis: test conditions, ambiguities, assumptions, risks" },
    { group: "Advanced · Øberg TestLab", file: "assets/demo/advanced-03-test-design.png", caption: "Test design: levels and techniques with rationale. Accept, change or reject" },
    { group: "Advanced · Øberg TestLab", file: "assets/demo/advanced-04-test-cases.png", caption: "Test cases with review status: approved, rejected, draft" },
    { group: "Simple · Øberg UAT Test Ideas", file: "assets/demo/simple-01-requirement.png", caption: "Enter one requirement (English or Danish)" },
    { group: "Simple · Øberg UAT Test Ideas", file: "assets/demo/simple-02-test-ideas.png", caption: "Generated UAT test ideas, with a clarification note" },
    { group: "GitHub Codespaces", file: "assets/demo/codespaces-01-running.png", caption: "The app running in a Codespace" }
  ]
};
