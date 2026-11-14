/* ==========================================================================
   Presentation engine: navigation, fragments, agenda, notes, presenter sync,
   ideas wall, configurable links. No dependencies.
   ========================================================================== */
(function () {
  "use strict";

  var CFG = window.DECK_CONFIG || {};
  var params = new URLSearchParams(location.search);
  var IS_PREVIEW = params.has("preview");          // used inside presenter iframes
  var SHOW_ALL_STEPS = params.get("steps") === "all";
  var CHANNEL_NAME = "qa-citizen-dev-deck";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var slides = $$(".slide");
  var state = { index: 0, step: 0 };
  var presenterWin = null;
  var seenSeq = {};
  var channel = null;

  if (IS_PREVIEW) document.body.classList.add("is-preview");

  /* ---------- Config: text & links ---------- */
  function getPath(obj, path) {
    return path.split(".").reduce(function (o, k) { return o == null ? undefined : o[k]; }, obj);
  }

  $$("[data-config-text]").forEach(function (el) {
    var v = getPath(CFG, el.getAttribute("data-config-text"));
    if (v && String(v).trim()) {
      el.textContent = v;
    } else if (el.hasAttribute("data-placeholder")) {
      el.textContent = el.getAttribute("data-placeholder");
      el.classList.add("is-placeholder");
    }
  });

  $$("[data-link]").forEach(function (a) {
    var url = ((CFG.links || {})[a.getAttribute("data-link")] || "").trim();
    if (url) {
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    } else if (a.hasAttribute("data-hide-if-empty")) {
      a.hidden = true;
    } else {
      a.removeAttribute("href");
      a.classList.add("is-disabled-link");
      a.setAttribute("role", "link");
      a.setAttribute("aria-disabled", "true");
      a.setAttribute("tabindex", "0");
      a.title = "Add this URL in js/config.js";
    }
  });

  /* ---------- Backup demo screenshots ---------- */
  var shotGrid = $("#shotGrid");
  if (shotGrid) {
    (CFG.demoScreenshots || []).forEach(function (s) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "shot";
      var img = new Image();
      img.alt = s.caption || "";
      img.loading = "lazy";
      img.src = s.file;
      var cap = document.createElement("span");
      cap.className = "shot__caption";
      cap.textContent = s.caption || "";
      img.onerror = function () {
        btn.classList.add("shot--missing");
        btn.disabled = true;
        var ph = document.createElement("div");
        ph.className = "shot__placeholder";
        ph.textContent = "Screenshot placeholder — add " + s.file;
        btn.replaceChild(ph, img);
      };
      btn.appendChild(img);
      btn.appendChild(cap);
      btn.addEventListener("click", function () { openLightbox(s.file, s.caption); });
      shotGrid.appendChild(btn);
    });
  }

  var lightbox = $("#lightbox");
  function openLightbox(src, caption) {
    if (!lightbox) return;
    $("img", lightbox).src = src;
    $("img", lightbox).alt = caption || "";
    $(".lightbox__caption", lightbox).textContent = caption || "";
    lightbox.hidden = false;
    $(".lightbox__close", lightbox).focus();
  }
  function closeLightbox() { if (lightbox) lightbox.hidden = true; }
  if (lightbox) {
    $(".lightbox__close", lightbox).addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLightbox(); });
  }

  /* ---------- Slides & fragments ---------- */
  function fragmentsOf(i) { return $$(".fragment", slides[i]); }
  function slideId(i) { return slides[i].getAttribute("data-id"); }
  function indexOfId(id) {
    for (var i = 0; i < slides.length; i++) if (slideId(i) === id) return i;
    return -1;
  }
  function sectionTitle(i) {
    var sec = slides[i].getAttribute("data-section");
    var first = $('.slide[data-section="' + sec + '"][data-section-title]');
    return sec + " · " + (first ? first.getAttribute("data-section-title") : "");
  }

  function render(fromRemote) {
    var i = state.index;
    var frags = fragmentsOf(i);
    if (SHOW_ALL_STEPS) state.step = frags.length;

    slides.forEach(function (s, n) {
      s.classList.toggle("is-active", n === i);
      s.classList.toggle("is-past", n < i);
      s.setAttribute("aria-hidden", n === i ? "false" : "true");
    });
    frags.forEach(function (f, n) {
      f.classList.toggle("is-visible", n < state.step);
      f.classList.toggle("is-current", n === state.step - 1);
    });

    $("#progressBar").style.width = ((i + (frags.length ? state.step / (frags.length + 1) : 0)) / Math.max(1, slides.length - 1) * 100) + "%";
    $("#counter").textContent = (i + 1) + " / " + slides.length;
    $("#sectionLabel").textContent = sectionTitle(i);
    $("#btnPrev").disabled = i === 0 && state.step === 0;
    $("#btnNext").disabled = i === slides.length - 1 && state.step >= frags.length;

    if (!IS_PREVIEW) {
      var hash = "#/" + slideId(i) + (state.step ? "/" + state.step : "");
      if (location.hash !== hash) history.replaceState(null, "", hash);
      document.title = slides[i].getAttribute("aria-label") + " · Mind over Machine";
      updateNotes();
      updateAgendaCurrent();
      if (!fromRemote) broadcast();
    }
  }

  function go(index, step) {
    index = Math.max(0, Math.min(slides.length - 1, index));
    var max = fragmentsOf(index).length;
    state.index = index;
    state.step = Math.max(0, Math.min(max, step == null ? 0 : step));
    render();
  }

  function next() {
    var frags = fragmentsOf(state.index);
    if (state.step < frags.length) { state.step++; render(); }
    else if (state.index < slides.length - 1) go(state.index + 1, 0);
  }
  function prev() {
    if (state.step > 0) { state.step--; render(); }
    else if (state.index > 0) go(state.index - 1, fragmentsOf(state.index - 1).length);
  }

  function readHash() {
    var m = location.hash.match(/^#\/([^/]+)(?:\/(\d+))?/);
    if (!m) return null;
    var i = indexOfId(decodeURIComponent(m[1]));
    return i < 0 ? null : { index: i, step: m[2] ? parseInt(m[2], 10) : 0 };
  }

  /* ---------- Agenda ---------- */
  var agenda = $("#agenda");
  var agendaList = $("#agendaList");
  var sectionStarts = [];
  $$(".slide[data-section-title]").forEach(function (s) {
    var idx = slides.indexOf(s);
    var num = s.getAttribute("data-section");
    sectionStarts.push(idx);
    var li = document.createElement("li");
    var b = document.createElement("button");
    b.type = "button";
    b.dataset.section = num;
    b.innerHTML = '<span class="agenda-list__num">' + num + "</span><span></span>";
    b.lastChild.textContent = s.getAttribute("data-section-title");
    b.addEventListener("click", function () { go(idx, 0); closeOverlay(agenda); });
    li.appendChild(b);
    agendaList.appendChild(li);
  });
  function updateAgendaCurrent() {
    var sec = slides[state.index].getAttribute("data-section");
    $$("button", agendaList).forEach(function (b) { b.classList.toggle("is-current", b.dataset.section === sec); });
  }

  /* ---------- Overlays ---------- */
  var lastFocus = null;
  function openOverlay(el) {
    $$(".overlay").forEach(function (o) { o.hidden = true; });
    lastFocus = document.activeElement;
    el.hidden = false;
    var f = $(".is-current", el) || $("button", el) || el;
    if (f.focus) f.focus();
  }
  function closeOverlay(el) {
    el.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function toggleOverlay(el) { el.hidden ? openOverlay(el) : closeOverlay(el); }
  $$(".overlay").forEach(function (o) {
    o.addEventListener("click", function (e) { if (e.target === o) closeOverlay(o); });
  });

  /* ---------- Notes ---------- */
  var notesPanel = $("#notesPanel");
  function updateNotes() {
    if (notesPanel.hidden) return;
    $("#notesBody").innerHTML = window.renderNotes ? window.renderNotes(slideId(state.index)) : "";
    $("#notesSlideTitle").textContent = slides[state.index].getAttribute("aria-label");
  }
  function toggleNotes() {
    notesPanel.hidden = !notesPanel.hidden;
    $("#btnNotes").setAttribute("aria-pressed", String(!notesPanel.hidden));
    updateNotes();
  }
  $("#notesClose").addEventListener("click", toggleNotes);

  /* ---------- Fullscreen / blackout ---------- */
  function toggleFullscreen() {
    var d = document;
    if (!d.fullscreenElement && d.documentElement.requestFullscreen) d.documentElement.requestFullscreen().catch(function () {});
    else if (d.exitFullscreen) d.exitFullscreen();
  }
  document.addEventListener("fullscreenchange", function () {
    $("#btnFullscreen").setAttribute("aria-pressed", String(!!document.fullscreenElement));
  });
  var blackout = $("#blackout");
  function toggleBlackout() { blackout.hidden = !blackout.hidden; }
  blackout.addEventListener("click", toggleBlackout);

  /* ---------- Presenter sync ---------- */
  function broadcast() {
    var i = state.index, fr = fragmentsOf(i).length;
    var nx = state.step < fr ? { index: i, step: state.step + 1 } : (i < slides.length - 1 ? { index: i + 1, step: 0 } : null);
    var msg = {
      type: "state", index: i, step: state.step, steps: fr, total: slides.length,
      id: slideId(i), label: slides[i].getAttribute("aria-label"), section: sectionTitle(i),
      next: nx ? { index: nx.index, step: nx.step, label: slides[nx.index].getAttribute("aria-label") } : null
    };
    if (channel) try { channel.postMessage(msg); } catch (e) {}
    if (presenterWin && !presenterWin.closed) try { presenterWin.postMessage(msg, "*"); } catch (e) {}
  }
  function onRemote(msg) {
    if (!msg || typeof msg !== "object") return;
    if (msg.seq) {
      if (seenSeq[msg.seq]) return;   // same command may arrive via two channels
      seenSeq[msg.seq] = true;
    }
    if (msg.type === "cmd") {
      if (msg.action === "next") next();
      else if (msg.action === "prev") prev();
      return;
    }
    if (msg.type === "go" && typeof msg.index === "number") {
      state.index = Math.max(0, Math.min(slides.length - 1, msg.index));
      state.step = Math.max(0, Math.min(fragmentsOf(state.index).length, msg.step || 0));
      render(true);
      broadcast();
    } else if (msg.type === "hello") {
      broadcast();
    } else if (msg.type === "blackout") {
      toggleBlackout();
    }
  }
  function openPresenter() {
    presenterWin = window.open("presenter.html" + location.hash, "qa-deck-presenter", "width=1280,height=800");
    if (!presenterWin) alertInline("Pop-up blocked: allow pop-ups for this site to open the presenter view.");
  }
  if (!IS_PREVIEW) {
    if ("BroadcastChannel" in window) {
      try {
        channel = new BroadcastChannel(CHANNEL_NAME);
        channel.onmessage = function (e) { onRemote(e.data); };
      } catch (e) { channel = null; }
    }
    window.addEventListener("message", function (e) {
      if ((e.source && e.source === presenterWin) || (e.data && e.data.app === CHANNEL_NAME)) {
        if (e.source && e.source !== window && !presenterWin) presenterWin = e.source;
        onRemote(e.data);
      }
    });
  } else {
    // In preview iframes the parent (presenter view) tells us which slide to show.
    window.addEventListener("message", function (e) {
      var m = e.data;
      if (m && m.type === "show" && typeof m.index === "number") {
        state.index = Math.max(0, Math.min(slides.length - 1, m.index));
        state.step = m.step === "all" ? fragmentsOf(state.index).length : (m.step || 0);
        render();
      }
    });
  }

  function alertInline(text) {
    var hint = document.createElement("div");
    hint.className = "notes-panel";
    hint.style.bottom = "auto"; hint.style.top = "1.5rem"; hint.style.padding = "1rem 1.3rem";
    hint.textContent = text;
    document.body.appendChild(hint);
    setTimeout(function () { hint.remove(); }, 4000);
  }

  /* ---------- Buttons ---------- */
  $("#btnPrev").addEventListener("click", prev);
  $("#btnNext").addEventListener("click", next);
  $("#btnAgenda").addEventListener("click", function () { toggleOverlay(agenda); });
  $("#btnHelp").addEventListener("click", function () { toggleOverlay($("#help")); });
  $("#btnNotes").addEventListener("click", toggleNotes);
  $("#btnPresenter").addEventListener("click", openPresenter);
  $("#btnFullscreen").addEventListener("click", toggleFullscreen);
  $$("[data-goto]").forEach(function (b) {
    b.addEventListener("click", function () { go(indexOfId(b.getAttribute("data-goto")), 0); });
  });
  $$(".is-disabled-link").forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); });
  });

  /* ---------- Keyboard ---------- */
  function isTyping(t) {
    return t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
  }
  document.addEventListener("keydown", function (e) {
    if (IS_PREVIEW) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var typing = isTyping(e.target);
    if (typing && e.key !== "Escape") return;

    var openOv = $$(".overlay").filter(function (o) { return !o.hidden; })[0];

    if (e.key === "Escape") {
      if (typing) { e.target.blur(); return; }
      if (lightbox && !lightbox.hidden) return closeLightbox();
      if (!blackout.hidden) return toggleBlackout();
      if (openOv) return closeOverlay(openOv);
      return openOverlay(agenda);
    }

    if (openOv === agenda && /^[1-8]$/.test(e.key)) {
      var b = $('button[data-section="' + e.key + '"]', agendaList);
      if (b) { e.preventDefault(); b.click(); }
      return;
    }

    // Let buttons/links handle Enter & Space themselves when focused (except chrome nav).
    var focusedControl = e.target && e.target.closest && e.target.closest("button, a, [role=link]");
    if (e.key === " " && focusedControl && !e.target.closest(".chrome")) return;

    switch (e.key) {
      case "ArrowRight": case "PageDown": case " ": case "ArrowDown":
        if (openOv) return;
        e.preventDefault(); next(); break;
      case "ArrowLeft": case "PageUp": case "ArrowUp":
        if (openOv) return;
        e.preventDefault(); prev(); break;
      case "Home": e.preventDefault(); go(0, 0); break;
      case "End": e.preventDefault(); go(slides.length - 1, 0); break;
      case "a": case "A": toggleOverlay(agenda); break;
      case "f": case "F": toggleFullscreen(); break;
      case "n": case "N": toggleNotes(); break;
      case "p": case "P": openPresenter(); break;
      case "b": case "B": case ".": toggleBlackout(); break;
      case "?": toggleOverlay($("#help")); break;
    }
  });

  /* ---------- Touch swipe ---------- */
  var touchX = null, touchY = null;
  document.addEventListener("touchstart", function (e) {
    if (isTyping(e.target)) return;
    touchX = e.touches[0].clientX; touchY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener("touchend", function (e) {
    if (touchX == null) return;
    var dx = e.changedTouches[0].clientX - touchX, dy = e.changedTouches[0].clientY - touchY;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx < 0 ? next : prev)();
    touchX = null;
  }, { passive: true });

  /* ---------- Hide controls when idle (projector friendly) ---------- */
  var idleTimer;
  function wake() {
    document.body.classList.remove("is-idle");
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
      if (!$(".chrome:hover") && !document.activeElement.closest(".chrome")) document.body.classList.add("is-idle");
    }, 3000);
  }
  if (!IS_PREVIEW) {
    document.addEventListener("mousemove", wake);
    document.addEventListener("keydown", function (e) { if (e.key === "Tab") wake(); });
  }

  /* ---------- Ideas wall (browser-only storage) ---------- */
  var IDEAS_KEY = "qa-citizen-dev-ideas";
  var TYPE_LABEL = { tool: "Tool idea", build: "Could build", judgment: "Needs judgment" };
  var ideas = [];
  try { ideas = JSON.parse(localStorage.getItem(IDEAS_KEY) || "[]") || []; } catch (e) { ideas = []; }
  function saveIdeas() {
    try { localStorage.setItem(IDEAS_KEY, JSON.stringify(ideas)); }
    catch (e) { var h = $("#ideasHint"); if (h) h.textContent = "Storage unavailable: ideas will be lost on reload. Download them before closing."; }
  }
  function renderIdeas() {
    var wall = $("#ideasWall");
    if (!wall) return;
    wall.innerHTML = "";
    ideas.forEach(function (idea, n) {
      var li = document.createElement("li");
      li.className = "idea";
      li.dataset.type = idea.type;
      var t = document.createElement("span");
      t.className = "idea__type";
      t.textContent = TYPE_LABEL[idea.type] || "";
      var txt = document.createElement("span");
      txt.textContent = idea.text;
      var rm = document.createElement("button");
      rm.className = "idea__remove";
      rm.type = "button";
      rm.setAttribute("aria-label", "Remove idea: " + idea.text);
      rm.textContent = "✕";
      rm.addEventListener("click", function () { ideas.splice(n, 1); saveIdeas(); renderIdeas(); });
      li.appendChild(t); li.appendChild(txt); li.appendChild(rm);
      wall.appendChild(li);
    });
  }
  var form = $("#ideasForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = $("#ideaInput");
      var text = input.value.trim();
      if (!text) return;
      ideas.push({ text: text, type: $("#ideaType").value });
      saveIdeas(); renderIdeas();
      input.value = "";
      input.focus();
    });
    $("#ideasClear").addEventListener("click", function () {
      if (!ideas.length) return;
      if (window.confirm("Remove all ideas from the wall?")) { ideas = []; saveIdeas(); renderIdeas(); }
    });
    $("#ideasExport").addEventListener("click", function () {
      var lines = ["Ideas – " + (CFG.event ? CFG.event.title : "") + " – " + (CFG.event ? CFG.event.date : ""), ""];
      ["tool", "build", "judgment"].forEach(function (type) {
        var list = ideas.filter(function (i) { return i.type === type; });
        if (!list.length) return;
        lines.push(TYPE_LABEL[type] + ":");
        list.forEach(function (i) { lines.push("  - " + i.text); });
        lines.push("");
      });
      var blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "mind-over-machine-ideas.txt";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    });
    renderIdeas();
  }

  /* ---------- Start ---------- */
  var start = readHash();
  if (start) go(start.index, start.step); else go(0, 0);
  window.addEventListener("hashchange", function () {
    var h = readHash();
    if (h && (h.index !== state.index || h.step !== state.step)) go(h.index, h.step);
  });

  // Small API for debugging/tests
  window.Deck = { go: go, next: next, prev: prev, state: state, slides: slides };
})();
