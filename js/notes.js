/* ==========================================================================
   SPEAKER NOTES
   --------------------------------------------------------------------------
   One entry per slide, keyed by the slide's data-id in index.html.
   Each entry can have:
     talk       – key talking points
     ask        – questions for the audience
     humour     – optional humorous remarks
     demo       – live-demo reminders
     transition – how to move on to the next slide
   Edit freely: plain text, one string per bullet.
   Notes never appear on the audience screen unless you press N.
   ========================================================================== */

window.SPEAKER_NOTES = {
  "welcome": {
    talk: [
      "Welcome everyone, and thanks for coming out on a dark November evening.",
      "Tonight is about curiosity, not a product pitch.",
      "Housekeeping: timings, coffee, toilets, Wi-Fi."
    ],
    humour: ["“If anything breaks tonight, it’s a live test. I’m a tester. I’ll log it.”"],
    transition: "Hand over to Lars for a few words about Mind over Machine."
  },

  "community": {
    talk: [
      "Lars introduces Mind over Machine: what the community is, why it exists, and how tonight fits in.",
      "Mention the themes: technology, AI, human creativity, learning, collaboration.",
      "Remember to replace the placeholder text in js/config.js (content.larsIntro) once Lars has sent his input."
    ],
    transition: "“So who is the person who thought this would be a good idea? Let me introduce myself.”"
  },

  "who-is-oberg": {
    talk: [
      "Keep this short and personal: about one minute.",
      "Started in quality and measurement technology (metrology). Measuring things properly is still how I think about testing.",
      "Since 1992 in QA and test management: test strategy, risk-based testing, quality engineering.",
      "Today: Test Management at Copenhagen Airport."
    ],
    ask: ["Quick show of hands: how many of you work in testing or QA? Anyone who has never written a line of code?"],
    transition: "“And there’s one statistic I’m particularly proud of…”"
  },

  "zero-lines": {
    talk: [
      "Let the slide land. Pause.",
      "The point: I’m not a developer, and that’s exactly why this experiment is interesting."
    ],
    humour: ["“My code coverage is excellent. Zero lines, zero defects. 100% pass rate.”"],
    transition: "“So why would someone like me start building software at all?”"
  },

  "why": {
    talk: [
      "Reveal the four concepts one at a time (→ / Space).",
      "AI: models that turn a description into a proposal.",
      "Vibe coding: describing what you want and letting AI write the code. The term is recent and a bit tongue-in-cheek.",
      "No-code: visual building tools, no programming.",
      "Citizen development: people outside IT building tools for their own work."
    ],
    ask: ["Has anyone here tried any of these? What happened?"],
    transition: "“Why does this matter for people like us in QA?”"
  },

  "opportunity": {
    talk: [
      "AI-assisted development lowers the barrier to experimenting.",
      "QA professionals know where the pain points are: test design, traceability, reporting.",
      "Be explicit: this does not replace developers, testers or human judgment. It adds a new way to explore ideas."
    ],
    transition: "“Which leads to the question for tonight…”"
  },

  "key-question": {
    talk: [
      "Read the question out loud slowly, then pause.",
      "Domain knowledge tells us what is worth building and what ‘good’ looks like.",
      "AI helps with the how. But who checks the result?"
    ],
    ask: ["Ask them to keep this question in mind for the discussion later."],
    transition: "“I decided to find out the only way I know: by testing it.”"
  },

  "hobby": {
    talk: [
      "Built in my spare time, entirely through AI-assisted development.",
      "I described what I wanted. The AI wrote the code. I tested, gave feedback and decided.",
      "Not commercial, not finished, very much an ongoing experiment."
    ],
    humour: ["“My role was product owner, tester, and occasionally frustrated customer.”"],
    transition: "“So what is it actually trying to do?”"
  },

  "what-it-explores": {
    talk: [
      "The idea: turn requirements into structured test cases.",
      "Not just ‘generate tests’: it uses ISTQB terminology, test levels and objectives, product criticality and risk.",
      "Traceability back to requirements, and human review as a built-in step, not an afterthought."
    ],
    humour: ["Point at the scoreboard: “The only metric that went up.”"],
    transition: "“Enough talking. Let’s see it.”"
  },

  "demo": {
    talk: [
      "Walk through the six steps (reveal with → / Space) before opening the tool.",
      "Emphasise step 6: human review."
    ],
    demo: [
      "BEFORE THE EVENT: set links.liveDemo in js/config.js and check the URL works on the venue Wi-Fi.",
      "Have a prepared requirement ready to paste. Keep it small and realistic.",
      "Zoom the browser (Ctrl/Cmd +) so the back row can read it.",
      "Narrate what you’re doing and what you’re checking.",
      "Show at least one generated test case you would change or reject, and say why.",
      "To come back: close the tab or Alt+Tab. The presentation remembers where you were.",
      "If the live demo fails: click ‘Backup demo’ and stay calm. “This is why we test.”"
    ],
    transition: "Back from the demo: “So… impressive? Let’s be testers about it.”"
  },

  "demo-backup": {
    talk: [
      "Only use if the live demo or internet fails.",
      "Click a screenshot to enlarge it. Esc closes it."
    ],
    demo: [
      "Add your own real screenshots to assets/demo/ (file names are listed in js/config.js).",
      "Use real screenshots only. Don’t mock up results."
    ],
    humour: ["“Plan B: the most-tested feature of any live demo.”"],
    transition: "“Now, let me tell you about my amazing results…”"
  },

  "go-wrong": {
    talk: [
      "Deliver the headline deadpan. Let people laugh.",
      "Reveal the ‘dashboard’ with → / Space. The numbers are deliberately made up to make the point: big numbers aren’t the same as quality.",
      "Point to the ‘?’: actual coverage is the number nobody can see on a dashboard."
    ],
    humour: ["“Warning: traces of irony may occur. Side effects include false confidence.”"],
    transition: "“Let’s put on our tester hats.”"
  },

  "hard-questions": {
    talk: [
      "Reveal questions one by one. Don’t answer them yourself. The goal is to stimulate thinking.",
      "Number of test cases ≠ completeness. Coverage of what? Against which risks?",
      "AI can only work from the requirements it is given. Missing requirements stay missing.",
      "False confidence is the real risk: polished output looks trustworthy.",
      "Human judgment: risk, context, priorities, ‘is this even the right thing to test?’"
    ],
    ask: [
      "Which of these worries you the most?",
      "Has anyone seen AI-generated output that looked right but was wrong?"
    ],
    transition: "“Now it’s your turn.”"
  },

  "explore": {
    talk: [
      "Reveal the three questions one at a time.",
      "Give people a couple of minutes with their neighbour for each, or pick one question for the whole room.",
      "Collect a few answers out loud."
    ],
    ask: [
      "What supporting tool would make your QA or testing work easier?",
      "What could you build with AI and No-Code?",
      "Where would you still need professional judgment and quality controls?"
    ],
    transition: "“Let’s capture some of those ideas.”"
  },

  "ideas": {
    talk: [
      "Type ideas from the room into the wall (or ask a volunteer to type).",
      "Pick a category for each: tool idea, could build, needs judgment.",
      "Ideas are stored only in this browser. Use ‘Download ideas’ at the end to keep them.",
      "Arrow keys don’t move slides while you’re typing; click outside the input box first."
    ],
    humour: ["“No backend, no database, no GDPR headache. Just your browser.”"],
    transition: "“Let me try to sum up what we’ve talked about tonight.”"
  },

  "wrap-up": {
    talk: [
      "Reveal the five messages one at a time.",
      "Domain knowledge still matters, perhaps more than ever.",
      "AI makes experimenting cheap. That’s the opportunity.",
      "But building software is not the same as building quality.",
      "Human judgment remains essential. And we learn faster together."
    ],
    transition: "“And finally…”"
  },

  "thanks": {
    talk: [
      "Read the closing line yourself.",
      "Thank Lars, Mind over Machine and the venue (Matrikel 1).",
      "Point to the links. Invite people to connect and share ideas.",
      "Only share the Test Case Generator link if you choose to (set links.testCaseGenerator)."
    ],
    ask: ["Any final questions? Who wants to try building something before next time?"],
    humour: ["“Bugs found in tonight’s presentation can be reported to me over coffee.”"]
  }
};
