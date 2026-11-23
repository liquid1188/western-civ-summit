(function () {
  var t = document.querySelector(".nav-toggle"), n = document.getElementById("nav");
  if (t) {
    t.addEventListener("click", function () {
      var o = n.classList.toggle("open"); t.setAttribute("aria-expanded", o);
      document.body.style.overflow = o ? "hidden" : "";
    });
    n.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () {
      n.classList.remove("open"); t.setAttribute("aria-expanded", "false"); document.body.style.overflow = "";
    }); });
  }

  // Header turns solid after scrolling
  var hd = document.getElementById("siteHeader");
  var onScroll = function () { hd.classList.toggle("scrolled", window.scrollY > 40); };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // Reveal on scroll
  var els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add("in"); }); }

  // Countdown
  var cd = document.getElementById("countdown");
  if (cd && cd.dataset.start) {
    var target = new Date(cd.dataset.start).getTime();
    var tick = function () {
      var d = target - Date.now();
      if (isNaN(target) || d <= 0) { cd.hidden = true; return false; }
      cd.hidden = false;
      var v = { d: Math.floor(d / 864e5), h: Math.floor(d / 36e5) % 24, m: Math.floor(d / 6e4) % 60, s: Math.floor(d / 1e3) % 60 };
      cd.querySelectorAll("[data-u]").forEach(function (b) {
        var u = b.dataset.u, t = u === "d" ? String(v[u]) : String(v[u]).padStart(2, "0");
        if (b.textContent !== t) b.textContent = t;
      });
      return true;
    };
    if (tick()) setInterval(tick, 1000);
  }

  // View desktop version toggle (mobile)
  var KEY = "forceDesktop", vp = document.querySelector('meta[name="viewport"]'), btn = document.getElementById("desktopToggle");
  function apply(on) {
    vp.setAttribute("content", on ? "width=1200" : "width=device-width, initial-scale=1");
    if (btn) btn.textContent = on ? "View mobile version" : "View desktop version";
  }
  var on = false; try { on = localStorage.getItem(KEY) === "1"; } catch (e) {}
  apply(on);
  if (btn) { if (on) btn.style.display = "inline"; btn.addEventListener("click", function () {
    on = !on; try { localStorage.setItem(KEY, on ? "1" : "0"); } catch (e) {} apply(on); btn.style.display = "inline";
  }); }

  // Forms: submit to Web3Forms without leaving the page, then go to thank-you
  document.querySelectorAll("form.form").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!f.reportValidity()) return;
      var s = f.querySelector(".form-status"), b = f.querySelector("button[type=submit]");
      var r = f.querySelector("[data-redirect]");
      b.disabled = true; s.textContent = "Sending…";
      fetch(f.action, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(f) })
        .then(function (res) { return res.json(); })
        .then(function (d) {
          if (d.success) { var base = document.querySelector('link[rel=stylesheet][href*="assets/css"]').getAttribute("href").split("assets/")[0]; location.href = base + r.dataset.redirect.replace(/^\//, ""); }
          else { s.textContent = d.message || "Something went wrong. Please try again."; b.disabled = false; }
        })
        .catch(function () { s.textContent = "Network error. Please try again."; b.disabled = false; });
    });
  });
})();

(function () {
  // Conditional registrant sections
  var rt = document.getElementById("regType");
  if (rt) {
    var sync = function () {
      document.querySelectorAll(".cond").forEach(function (c) {
        var on = c.dataset.show === rt.value; c.hidden = !on;
        c.querySelectorAll("input,select,textarea").forEach(function (i) { i.disabled = !on; });
      });
    };
    rt.addEventListener("change", sync); sync();
  }
  // Additional guests
  var add = document.getElementById("addGuest"), box = document.getElementById("guests"), cnt = document.getElementById("guestCount");
  if (add) {
    var n = 0;
    var renumber = function () {
      var items = box.querySelectorAll(".guest");
      items.forEach(function (g, i) {
        g.querySelector(".guest-title").textContent = "Guest " + (i + 1);
        g.querySelectorAll("[data-f]").forEach(function (el) { el.name = "guest_" + (i + 1) + "_" + el.dataset.f; });
      });
      cnt.value = items.length;
    };
    add.addEventListener("click", function () {
      if (box.children.length >= 20) return;
      var d = document.createElement("div"); d.className = "guest";
      d.innerHTML = '<div class="guest-head"><span class="guest-title"></span><button type="button" class="guest-remove" aria-label="Remove guest">Remove</button></div>' +
        '<div class="row"><label>Full name<input data-f="name" required></label><label>Title or honorific <span class="opt">(optional)</span><input data-f="honorific"></label></div>' +
        '<div class="row"><label>Position and organization<input data-f="position"></label><label>Email<input type="email" data-f="email"></label></div>';
      d.querySelector(".guest-remove").addEventListener("click", function () { d.remove(); renumber(); });
      box.appendChild(d); renumber(); d.querySelector("input").focus();
    });
  }
})();

(function () {
  // Scroll progress line
  var bar = document.getElementById("progress");
  // Phone bar with the request button: appears after the first screen, hides near the footer
  var cta = document.getElementById("stickyCta"), foot = document.querySelector(".site-footer");
  if (cta) cta.hidden = false;
  var ticking = false;
  function update() {
    ticking = false;
    var doc = document.documentElement, max = doc.scrollHeight - window.innerHeight, y = window.scrollY;
    if (bar) bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
    if (cta) {
      var nearFoot = foot && foot.getBoundingClientRect().top < window.innerHeight - 40;
      cta.classList.toggle("show", y > window.innerHeight * 0.8 && !nearFoot);
    }
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener("resize", update); update();
})();

(function () {
  // Voices: quotations take turns, each for the same time. Tabs choose one.
  // The gold bar under the active tab fills as its time runs; it pauses under the pointer and off screen.
  var root = document.getElementById("voices"); if (!root) return;
  var vs = root.querySelectorAll(".voice"), tabs = root.querySelectorAll(".voices-tabs button");
  var i = 0, DUR = 8000, elapsed = 0, last = 0, visible = false, hover = false, chosen = false;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  vs.forEach(function (v, k) { if (v.classList.contains("on")) i = k; });
  function paint() { tabs.forEach(function (b, k) { b.style.setProperty("--p", k === i ? (chosen || reduce ? 1 : elapsed / DUR) : 0); }); }
  function show(n) {
    i = (n + vs.length) % vs.length; elapsed = 0;
    vs.forEach(function (v, k) { v.classList.toggle("on", k === i); });
    tabs.forEach(function (b, k) { b.setAttribute("aria-selected", k === i ? "true" : "false"); });
    paint();
  }
  function frame(t) {
    var running = visible && !hover && !chosen && !reduce && !document.hidden;
    if (running && last) {
      elapsed += Math.min(t - last, 100);
      if (elapsed >= DUR) show(i + 1); else paint();
    }
    last = t; requestAnimationFrame(frame);
  }
  tabs.forEach(function (b, k) { b.addEventListener("click", function () { chosen = true; show(k); }); });
  root.addEventListener("mouseenter", function () { hover = true; });
  root.addEventListener("mouseleave", function () { hover = false; });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: 0.5 }).observe(root);
  } else visible = true;
  paint(); requestAnimationFrame(frame);
})();
