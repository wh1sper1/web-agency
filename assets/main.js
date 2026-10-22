// SwiftSite: site behavior
// EDIT: BUSINESS_EMAIL below must match your real email address.

(function () {
  var BUSINESS_EMAIL = "hello@swiftsite.com"; // <-- change to your real email
  var BUSINESS_NAME = "SwiftSite";            // <-- change if you rename

  // year in footer
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // mobile menu
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // reveal on scroll
  var revealEls = document.querySelectorAll(".reveal");
  function showVisible() {
    // safety net: reveal anything already in or above the viewport,
    // so content can never be stuck invisible (slow devices, odd browsers)
    var vh = window.innerHeight || document.documentElement.clientHeight;
    revealEls.forEach(function (el) {
      if (el.classList.contains("visible")) return;
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.95) el.classList.add("visible");
    });
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
    // fallback pass shortly after load in case observer frames are delayed
    setTimeout(showVisible, 900);
    window.addEventListener("load", showVisible);
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  // quote form -> opens the visitor's mail app with everything filled in
  var form = document.getElementById("quote-form");
  var note = document.getElementById("form-note");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = new FormData(form);
      var name = (f.get("name") || "").toString().trim();
      var business = (f.get("business") || "").toString().trim();
      var contact = (f.get("contact") || "").toString().trim();
      var need = (f.get("need") || "").toString().trim();

      var subject = "Quote request" + (business ? " for " + business : "") + " (" + name + ")";
      var body =
        "Name: " + name + "\n" +
        "Business: " + (business || "n/a") + "\n" +
        "Contact: " + contact + "\n\n" +
        "What they need:\n" + (need || "n/a") + "\n";

      window.location.href =
        "mailto:" + BUSINESS_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      if (note) {
        note.hidden = false;
        note.textContent =
          "Your email app should have opened with the details filled in, then just hit send. " +
          "If nothing opened, email us directly at " + BUSINESS_EMAIL + ".";
      }
    });
  }

  // brand name used in console easter egg (update if you rename)
  console.log(BUSINESS_NAME + ": site loaded");
})();
