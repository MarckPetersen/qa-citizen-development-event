/* ==========================================================================
   SPEAKER NOTES
   --------------------------------------------------------------------------
   One entry per section, keyed by the section's id in index.html.
   Each entry can have:
     talk       – key talking points
     ask        – questions for the audience
     humour     – optional humorous remarks
     demo       – live-demo reminders
     transition – how to move on to the next section
   Edit freely: plain text, one string per bullet.
   Notes are never shown to the audience unless you press N
   (or use the presenter view on your own screen).
   ========================================================================== */

window.SPEAKER_NOTES = {
  "welcome": {
    talk: [
      "Welcome everyone, and thanks for coming out on a dark November evening.",
      "Tonight is about curiosity, not a product pitch.",
      "Housekeeping: timings, coffee, toilets, Wi-Fi.",
      "Scroll down to the community part and hand over to Lars: what Mind over Machine is, why it exists, and how tonight fits in.",
      "Key points: non-profit foundation for regenerative software development; think tank, laboratory and community of practice; non-developers welcome, no commitment.",
      "Mention Office Hours and Tech Talks as ways to stay involved after tonight.",
      "If Lars sends his own words, replace content.larsIntro in js/config.js."
    ],
    humour: ["“If anything breaks tonight, it’s a live test. I’m a tester. I’ll log it.”"],
    transition: "“So who is the person who thought this would be a good idea? Let me introduce myself.”"
  },

  "oberg": {
    talk: [
      "Keep this short and personal: about one to two minutes.",
      "Started in quality and measurement technology (metrology). Measuring things properly is still how I think about testing.",
      "Since 1992 in QA and test management: test strategy, risk-based testing, quality engineering.",
      "Today: Test Management at Copenhagen Airport.",
      "Scroll to the numbers and let the counters run. Pause on the zero."
    ],
    ask: ["Quick show of hands: how many of you work in testing or QA? Anyone who has never written a line of code?"],
    humour: ["“My code coverage is excellent. Zero lines, zero defects. 100% pass rate.”"],
    transition: "“So why would someone like me start building software at all?”"
  },

  "why": {
    talk: [
      "AI: models that turn a description into a proposal.",
      "Vibe coding: describing what you want and letting AI write the code. The term is recent and a bit tongue-in-cheek.",
      "No-code: visual building tools, no programming.",
      "Citizen development: people outside IT building tools for their own work.",
      "QA professionals know where the pain points are: test design, traceability, reporting.",
      "Be explicit: this does not replace developers, testers or human judgment.",
      "End on the key question. Read it slowly, then pause."
    ],
    ask: ["Has anyone here tried any of these? What happened?", "Keep the key question in mind for the discussion later."],
    transition: "“I decided to find out the only way I know: by testing it.”"
  },

  "experiment": {
    talk: [
      "Built in my spare time, entirely through AI-assisted development.",
      "I described what I wanted. The AI wrote the code. I tested, gave feedback and decided.",
      "Not commercial, not finished, very much an ongoing experiment.",
      "The idea: turn requirements into structured test cases, using ISTQB terminology, test levels and objectives, product criticality and risk.",
      "Traceability back to requirements, and human review as a built-in step, not an afterthought.",
      "Experiment #2: the Airport Stand Allocation Simulator. Aircraft get the smallest suitable available stand by wingspan; if nothing fits, they wait in the ground waiting area.",
      "Why: it makes a production system visible for test and UAT. Its rules are the requirements that must be retested when the real system is upgraded.",
      "Optionally open the simulator (button or links.standSimulator) and let it run at 2× for 20–30 seconds while you talk."
    ],
    humour: ["“My role was product owner, tester, and occasionally frustrated customer.”", "Point at the scoreboard: “The only metric that went up.”"],
    transition: "“Enough talking. Let’s see it.”"
  },

  "demo": {
    talk: [
      "Let the six steps animate in, and briefly walk through them before opening the tool.",
      "Emphasise step 6: human review."
    ],
    demo: [
      "BEFORE THE EVENT: set links.liveDemo in js/config.js and check the URL works on the venue Wi-Fi.",
      "Have a prepared requirement ready to paste. Keep it small and realistic.",
      "Zoom the browser (Ctrl/Cmd +) so the back row can read it.",
      "Narrate what you’re doing and what you’re checking.",
      "Show at least one generated test case you would change or reject, and say why.",
      "To come back: close the tab or Alt+Tab. The page stays where you left it.",
      "If the live demo fails: scroll to the backup screenshots (click to enlarge). “This is why we test.”",
      "Use real screenshots only. Don’t mock up results."
    ],
    transition: "Back from the demo: “So… impressive? Let’s be testers about it.”"
  },

  "go-wrong": {
    talk: [
      "Deliver the headline deadpan. Let people laugh.",
      "The counters are deliberately made up to make the point: big numbers aren’t the same as quality.",
      "Point to the ‘?’: actual coverage is the number nobody can see on a dashboard.",
      "Go through the questions without answering them yourself. The goal is to stimulate thinking.",
      "AI can only work from the requirements it is given. Missing requirements stay missing.",
      "False confidence is the real risk: polished output looks trustworthy."
    ],
    ask: ["Which of these worries you the most?", "Has anyone seen AI-generated output that looked right but was wrong?"],
    humour: ["“Warning: traces of irony may occur. Side effects include false confidence.”"],
    transition: "“Now it’s your turn.”"
  },

  "explore": {
    talk: [
      "The three questions highlight one after another as they appear. Click a question to highlight it again while you discuss it.",
      "Give people a couple of minutes with their neighbour for each, or pick one question for the whole room.",
      "Type ideas from the room into the wall (or ask a volunteer to type), and pick a category for each.",
      "Ideas are stored only in this browser. Use ‘Download ideas’ at the end to keep them."
    ],
    ask: [
      "What supporting tool would make your QA or testing work easier?",
      "What could you build with AI and No-Code?",
      "Where would you still need professional judgment and quality controls?"
    ],
    humour: ["“No backend, no database, no GDPR headache. Just your browser.”"],
    transition: "“Let me try to sum up what we’ve talked about tonight.”"
  },

  "wrap-up": {
    talk: [
      "Domain knowledge still matters, perhaps more than ever.",
      "AI makes experimenting cheap. That’s the opportunity.",
      "But building software is not the same as building quality.",
      "Human judgment remains essential. And we learn faster together.",
      "Read the closing line yourself.",
      "Thank Lars, Mind over Machine and the venue (Matrikel 1). Point to the links.",
      "Only share the Test Case Generator link if you choose to (set links.testCaseGenerator)."
    ],
    ask: ["Any final questions? Who wants to try building something before next time?"],
    humour: ["“Bugs found in tonight’s presentation can be reported to me over coffee.”"]
  }
};
