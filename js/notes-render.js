/* Shared helper: turns a SPEAKER_NOTES entry into HTML. Used by index.html and presenter.html. */
(function () {
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  var SECTIONS = [
    ["talk", "Talking points", ""],
    ["ask", "Ask the audience", ""],
    ["demo", "Demo reminders", "notes__demo"],
    ["humour", "Optional humour", "notes__humour"],
    ["transition", "Transition", ""]
  ];
  window.renderNotes = function (id) {
    var n = (window.SPEAKER_NOTES || {})[id];
    if (!n) return '<p class="notes"><em>No notes for this slide yet. Add them in js/notes.js under "' + esc(id) + '".</em></p>';
    var html = '<div class="notes">';
    SECTIONS.forEach(function (s) {
      var v = n[s[0]];
      if (!v || (Array.isArray(v) && !v.length)) return;
      var items = Array.isArray(v) ? v : [v];
      html += "<h4>" + s[1] + '</h4><ul class="' + s[2] + '">' +
        items.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul>";
    });
    return html + "</div>";
  };
})();
