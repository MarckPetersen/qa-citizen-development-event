/* ==========================================================================
   Event page behaviour: scroll animations, typing terminal, counters,
   active-section navigation, speaker notes, presenter sync, ideas wall,
   configurable links. No dependencies.
   ========================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  var CFG = window.DECK_CONFIG || {};
  var CHANNEL_NAME = "qa-citizen-dev-deck";
  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var sections = $$("main > .section");
  var current = 0;

  /* ---------- Config: text, images & links ---------- */
  function getPath(obj, path) {
    return path.split(".").reduce(function (o, k) { return o == null ? undefined : o[k]; }, obj);
  }
  $$("[data-config-text]").forEach(function (el) {
    var v = getPath(CFG, el.getAttribute("data-config-text"));
    if (v && String(v).trim()) el.textContent = v;
    else if (el.hasAttribute("data-placeholder")) {
      el.textContent = el.getAttribute("data-placeholder");
      el.classList.add("is-placeholder");
    }
  });
  $$("[data-config-src]").forEach(function (img) {
    var v = getPath(CFG, img.getAttribute("data-config-src"));
    var holder = img.closest("figure") || img;
    function hide() { holder.hidden = true; var ab = holder.closest(".about"); if (ab) ab.classList.add("about--no-img"); }
    if (!v) { hide(); return; }
    img.onerror = hide;
    img.src = v;
  });
  $$("[data-link]").forEach(function (a) {
    var url = ((CFG.links || {})[a.getAttribute("data-link")] || "").trim();
    if (url) {
      a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer";
    } else if (a.hasAttribute("data-hide-if-empty")) {
      a.hidden = true;
    } else {
      a.removeAttribute("href");
      a.classList.add("is-disabled-link");
      a.setAttribute("role", "link");
      a.setAttribute("aria-disabled", "true");
      a.setAttribute("tabindex", "0");
      a.title = "Add this URL in js/config.js";
      a.addEventListener("click", function (e) { e.preventDefault(); });
    }
  });

  /* ---------- Backup demo screenshots + lightbox ---------- */
  var lightbox = $("#lightbox");
  function openLightbox(src, caption) {
    $("img", lightbox).src = src;
    $("img", lightbox).alt = caption || "";
    $(".lightbox__caption", lightbox).textContent = caption || "";
    lightbox.hidden = false;
    $(".lightbox__close", lightbox).focus();
  }
  function closeLightbox() { lightbox.hidden = true; }
  $(".lightbox__close", lightbox).addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLightbox(); });

  $$("[data-lightbox]").forEach(function (el) {
    el.addEventListener("click", function () { openLightbox(el.getAttribute("data-lightbox"), el.getAttribute("data-caption")); });
  });

  var shotGroups = $("#shotGroups");
  var groups = {}, order = [];
  (CFG.demoScreenshots || []).forEach(function (sh) {
    var g = sh.group || "Screenshots";
    if (!groups[g]) {
      var wrap = document.createElement("div");
      wrap.className = "shot-group";
      var h = document.createElement("h4");
      h.className = "shot-group__title";
      h.textContent = g;
      var grid = document.createElement("div");
      grid.className = "shots";
      grid.setAttribute("data-stagger", "");
      wrap.appendChild(h); wrap.appendChild(grid);
      shotGroups.appendChild(wrap);
      groups[g] = grid; order.push(g);
    }
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "shot";
    var img = new Image();
    img.alt = sh.caption || "";
    img.src = sh.file;
    var cap = document.createElement("span");
    cap.className = "shot__caption";
    cap.textContent = sh.caption || "";
    img.onerror = function () {
      btn.classList.add("shot--missing");
      btn.disabled = true;
      var ph = document.createElement("div");
      ph.className = "shot__placeholder";
      ph.textContent = "Screenshot placeholder: add " + sh.file;
      btn.replaceChild(ph, img);
    };
    btn.appendChild(img);
    btn.appendChild(cap);
    btn.addEventListener("click", function () { openLightbox(sh.file, (sh.group ? sh.group + " · " : "") + (sh.caption || "")); });
    groups[g].appendChild(btn);
  });

  /* ---------- Scroll-triggered animations ---------- */
  $$("[data-stagger]").forEach(function (group) {
    var step = group.getAttribute("data-stagger-step");
    if (step) group.style.setProperty("--step", step + "ms");
    Array.prototype.forEach.call(group.children, function (c, i) { c.style.setProperty("--i", i); });
  });

  function whenVisible(el, fn) {
    el.__onEnter = fn;
  }

  var revealTargets = $$("[data-reveal], [data-stagger], [data-count], #terminal");
  if (REDUCED || !("IntersectionObserver" in window)) {
    revealTargets.forEach(function (el) { el.classList.add("is-in"); if (el.__onEnter) el.__onEnter(); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        if (e.target.__onEnter) { var f = e.target.__onEnter; e.target.__onEnter = null; f(); }
        io.unobserve(e.target);
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
    // Set callbacks before observing
    setupCounters(); setupTerminal(); setupDiscussionFocus();
    revealTargets.forEach(function (el) { io.observe(el); });
  }

  /* Counters: count from data-count-from (default 0) to data-count */
  function setupCounters() {
    $$("[data-count]").forEach(function (el) {
      var to = parseFloat(el.getAttribute("data-count"));
      var from = parseFloat(el.getAttribute("data-count-from") || "0");
      el.textContent = Math.round(from).toLocaleString("en-US");
      whenVisible(el, function () {
        var start = null, dur = 1600 + Math.min(1200, Math.abs(to - from));
        function frame(t) {
          if (!start) start = t;
          var p = Math.min(1, (t - start) / dur);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(from + (to - from) * eased).toLocaleString("en-US");
          if (p < 1) requestAnimationFrame(frame);
        }
        setTimeout(function () { requestAnimationFrame(frame); }, 250);
      });
    });
  }

  /* Terminal: types the lines one by one */
  function setupTerminal() {
    var term = $("#terminal");
    if (!term) return;
    var box = term.closest(".terminal");
    var lines = $$(".t-line", term);
    var texts = lines.map(function (l) { return l.textContent; });
    box.classList.add("is-typing");
    whenVisible(term, function () {
      var cursor = document.createElement("span");
      cursor.className = "cursor";
      var li = 0;
      function nextLine() {
        if (li >= lines.length) { lines[lines.length - 1].appendChild(cursor); return; }
        var line = lines[li], full = texts[li], isCmd = line.getAttribute("data-type") === "cmd";
        line.textContent = "";
        line.classList.add("is-shown");
        if (!isCmd) { line.textContent = full; li++; setTimeout(nextLine, 170); return; }
        var ci = 0;
        line.appendChild(cursor);
        (function typeChar() {
          ci++;
          line.textContent = full.slice(0, ci);
          line.appendChild(cursor);
          if (ci < full.length) setTimeout(typeChar, 45 + Math.random() * 50);
          else { li++; setTimeout(nextLine, 380); }
        })();
      }
      setTimeout(nextLine, 500);
    });
  }

  /* Discussion questions: highlight each one in turn as they appear */
  function setupDiscussionFocus() {
    var list = $(".discussion");
    if (!list) return;
    whenVisible(list, function () {
      var items = $$("li", list);
      items.forEach(function (li, i) {
        setTimeout(function () {
          items.forEach(function (x) { x.classList.remove("is-focus"); });
          li.classList.add("is-focus");
        }, 400 + i * 900);
      });
    });
  }
  // Clicking a question highlights it (handy while discussing)
  $$(".discussion li").forEach(function (li) {
    li.addEventListener("click", function () {
      $$(".discussion li").forEach(function (x) { x.classList.toggle("is-focus", x === li); });
    });
  });
  if (REDUCED) {
    var term0 = $("#terminal"); if (term0) term0.closest(".terminal").classList.remove("is-typing");
  }

  /* ---------- Active section: nav, notes, presenter ---------- */
  var navLinks = $$(".nav__menu a");
  function setCurrent(i) {
    if (i === current && document.body.dataset.ready) return;
    current = i;
    document.body.dataset.ready = "1";
    var id = sections[i].id;
    navLinks.forEach(function (a) {
      var on = a.getAttribute("href") === "#" + id;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
    updateNotes();
    broadcast();
  }
  function detectCurrent() {
    var probe = window.innerHeight * 0.35;
    var idx = 0;
    sections.forEach(function (s, i) { if (s.getBoundingClientRect().top <= probe) idx = i; });
    setCurrent(idx);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    $("#scrollBar").style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
  }
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { detectCurrent(); ticking = false; });
  }, { passive: true });
  window.addEventListener("resize", detectCurrent);

  function goTo(i) {
    i = Math.max(0, Math.min(sections.length - 1, i));
    sections[i].scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "start" });
  }

  /* Mobile menu */
  var navToggle = $("#navToggle"), navMenu = $("#navMenu");
  navToggle.addEventListener("click", function () {
    var open = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  navLinks.forEach(function (a) { a.addEventListener("click", function () { navMenu.classList.remove("is-open"); navToggle.setAttribute("aria-expanded", "false"); }); });

  /* ---------- Speaker notes ---------- */
  var notesPanel = $("#notesPanel");
  function updateNotes() {
    if (notesPanel.hidden) return;
    $("#notesBody").innerHTML = window.renderNotes(sections[current].id);
    $("#notesTitle").textContent = sections[current].getAttribute("data-label");
  }
  function toggleNotes() { notesPanel.hidden = !notesPanel.hidden; updateNotes(); }
  $("#notesClose").addEventListener("click", toggleNotes);

  /* ---------- Fullscreen / blackout / help ---------- */
  function toggleFullscreen() {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(function () {});
    else if (document.exitFullscreen) document.exitFullscreen();
  }
  var blackout = $("#blackout");
  function toggleBlackout() { blackout.hidden = !blackout.hidden; }
  blackout.addEventListener("click", toggleBlackout);
  var help = $("#help");
  help.addEventListener("click", function (e) { if (e.target === help) help.hidden = true; });

  /* ---------- Presenter sync ---------- */
  var channel = null, presenterWin = null, seenSeq = {};
  function sectionList() {
    return sections.map(function (s) { return { id: s.id, label: s.getAttribute("data-label") }; });
  }
  function broadcast() {
    var msg = { type: "state", index: current, total: sections.length, id: sections[current].id, label: sections[current].getAttribute("data-label"), sections: sectionList() };
    if (channel) try { channel.postMessage(msg); } catch (e) {}
    if (presenterWin && !presenterWin.closed) try { presenterWin.postMessage(msg, "*"); } catch (e) {}
  }
  function onRemote(m) {
    if (!m || typeof m !== "object") return;
    if (m.seq) { if (seenSeq[m.seq]) return; seenSeq[m.seq] = true; }
    if (m.type === "cmd") {
      if (m.action === "next") goTo(current + 1);
      else if (m.action === "prev") goTo(current - 1);
      else if (m.action === "go" && typeof m.index === "number") goTo(m.index);
    } else if (m.type === "hello") broadcast();
    else if (m.type === "blackout") toggleBlackout();
  }
  if ("BroadcastChannel" in window) {
    try { channel = new BroadcastChannel(CHANNEL_NAME); channel.onmessage = function (e) { onRemote(e.data); }; } catch (e) { channel = null; }
  }
  window.addEventListener("message", function (e) {
    if (e.data && e.data.app === CHANNEL_NAME) {
      if (e.source && e.source !== window && !presenterWin) presenterWin = e.source;
      onRemote(e.data);
    }
  });
  function openPresenter() {
    presenterWin = window.open("presenter.html", "qa-deck-presenter", "width=1100,height=760");
  }

  /* ---------- Keyboard ---------- */
  function isTyping(t) { return t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)); }
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (isTyping(e.target)) { if (e.key === "Escape") e.target.blur(); return; }
    if (e.key === "Escape") {
      if (!lightbox.hidden) return closeLightbox();
      if (!help.hidden) { help.hidden = true; return; }
      if (!blackout.hidden) return toggleBlackout();
      if (!notesPanel.hidden) return toggleNotes();
      return;
    }
    if (/^[1-8]$/.test(e.key)) { goTo(parseInt(e.key, 10) - 1); return; }
    switch (e.key) {
      case "ArrowRight": e.preventDefault(); goTo(current + 1); break;
      case "ArrowLeft": e.preventDefault(); goTo(current - 1); break;
      case "f": case "F": toggleFullscreen(); break;
      case "n": case "N": toggleNotes(); break;
      case "p": case "P": openPresenter(); break;
      case "b": case "B": case ".": toggleBlackout(); break;
      case "?": help.hidden = !help.hidden; break;
    }
  });

  /* ---------- Copy requirements (for pasting into the Test Case Generator) ---------- */
  var copyBtn = $("#copyReqs");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var lines = ["Business rules – Airport Stand Allocation Simulator (system under test)", ""];
      $$(".req").forEach(function (r) {
        var id = $(".req__id", r).textContent.trim();
        var title = $("h4", r).textContent.trim();
        var body = $$("p", r).map(function (p) { return p.textContent.replace(/\s+/g, " ").trim(); }).join(" ");
        lines.push(id + " " + title + ". " + body);
        lines.push("");
      });
      var text = lines.join("\n").trim();
      var label = copyBtn.textContent;
      function done(ok) {
        copyBtn.textContent = ok ? "✓ Copied" : "Copy failed: select the text manually";
        copyBtn.classList.toggle("is-copied", ok);
        setTimeout(function () { copyBtn.textContent = label; copyBtn.classList.remove("is-copied"); }, 2500);
      }
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        var ok = false; try { ok = document.execCommand("copy"); } catch (e) {}
        ta.remove(); done(ok);
      }
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(function () { done(true); }, fallback);
      else fallback();
    });
  }

  /* ---------- Ideas wall (browser-only storage) ---------- */
  var IDEAS_KEY = "qa-citizen-dev-ideas";
  var TYPE_LABEL = { tool: "Tool idea", build: "Could build", judgment: "Needs judgment" };
  var ideas = [];
  try { ideas = JSON.parse(localStorage.getItem(IDEAS_KEY) || "[]") || []; } catch (e) { ideas = []; }
  function saveIdeas() {
    try { localStorage.setItem(IDEAS_KEY, JSON.stringify(ideas)); }
    catch (e) { $("#ideasHint").textContent = "Storage unavailable: ideas will be lost on reload. Download them before closing."; }
  }
  function renderIdeas() {
    var wall = $("#ideasWall");
    wall.innerHTML = "";
    ideas.forEach(function (idea, n) {
      var li = document.createElement("li");
      li.className = "idea";
      li.dataset.type = idea.type;
      var t = document.createElement("span"); t.className = "idea__type"; t.textContent = TYPE_LABEL[idea.type] || "";
      var txt = document.createElement("span"); txt.textContent = idea.text;
      var rm = document.createElement("button");
      rm.className = "idea__remove"; rm.type = "button"; rm.textContent = "✕";
      rm.setAttribute("aria-label", "Remove idea: " + idea.text);
      rm.addEventListener("click", function () { ideas.splice(n, 1); saveIdeas(); renderIdeas(); });
      li.appendChild(t); li.appendChild(txt); li.appendChild(rm);
      wall.appendChild(li);
    });
  }
  $("#ideasForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var input = $("#ideaInput"), text = input.value.trim();
    if (!text) return;
    ideas.push({ text: text, type: $("#ideaType").value });
    saveIdeas(); renderIdeas();
    input.value = ""; input.focus();
  });
  $("#ideasClear").addEventListener("click", function () {
    if (ideas.length && window.confirm("Remove all ideas from the wall?")) { ideas = []; saveIdeas(); renderIdeas(); }
  });
  $("#ideasExport").addEventListener("click", function () {
    var ev = CFG.event || {};
    var lines = ["Ideas – " + (ev.title || "") + " – " + (ev.date || ""), ""];
    ["tool", "build", "judgment"].forEach(function (type) {
      var list = ideas.filter(function (i) { return i.type === type; });
      if (!list.length) return;
      lines.push(TYPE_LABEL[type] + ":");
      list.forEach(function (i) { lines.push("  - " + i.text); });
      lines.push("");
    });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" }));
    a.download = "mind-over-machine-ideas.txt";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  });
  renderIdeas();

  /* ---------- Start ---------- */
  detectCurrent();
  window.addEventListener("load", function () { setTimeout(detectCurrent, 300); });
  window.Site = { goTo: goTo, sections: sections, current: function () { return current; } };
})();
