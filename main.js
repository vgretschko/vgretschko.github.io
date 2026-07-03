/* Vitali Gretschko — site interactions
   Theme · scrollspy · reveal · stats · auction sim · publications · palette */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Theme ---------------- */
  var themeBtn = doc.getElementById("theme-btn");

  function currentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function applyTheme(theme, persist) {
    root.setAttribute("data-theme", theme);
    if (persist) {
      try { localStorage.setItem("vg-theme", theme); } catch (e) { /* private mode */ }
    }
    var meta = doc.querySelector('meta[name="theme-color"]:not([media])');
    if (!meta) {
      meta = doc.createElement("meta");
      meta.name = "theme-color";
      doc.head.appendChild(meta);
    }
    meta.content = theme === "dark" ? "#171310" : "#f7f3ec";
    if (sim) sim.refreshColors();
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      applyTheme(currentTheme() === "dark" ? "light" : "dark", true);
    });
  }

  /* ---------------- Scroll progress ---------------- */
  var bar = doc.getElementById("scroll-bar");
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var max = doc.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------- Scrollspy ---------------- */
  var navLinks = Array.prototype.slice.call(doc.querySelectorAll(".site-nav a"));
  var spyMap = {};
  navLinks.forEach(function (a) {
    var id = (a.getAttribute("href") || "").slice(1);
    var sec = id && doc.getElementById(id);
    if (sec) spyMap[id] = a;
  });
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      navLinks.forEach(function (a) { a.classList.remove("active"); });
      var link = spyMap[en.target.id];
      if (link) link.classList.add("active");
    });
  }, { rootMargin: "-38% 0px -55% 0px" });
  Object.keys(spyMap).forEach(function (id) { spy.observe(doc.getElementById(id)); });

  /* ---------------- Reveal on scroll ---------------- */
  var revealEls = doc.querySelectorAll(".reveal");
  if (reducedMotion) {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  } else {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("visible");
          ro.unobserve(en.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { ro.observe(el); });
  }

  /* ---------------- Count-up stats ---------------- */
  var counters = doc.querySelectorAll(".stat-num[data-count]");
  var co = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      co.unobserve(en.target);
      var el = en.target;
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      if (reducedMotion) { el.textContent = target; return; }
      var t0 = null;
      var dur = 950;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  counters.forEach(function (el) { co.observe(el); });

  /* ---------------- Toast ---------------- */
  var toastEl = doc.getElementById("toast");
  var toastTimer = null;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2400);
  }

  /* ---------------- BibTeX ---------------- */
  var BIB = {
    stable: '@unpublished{gretschko_stable_contracts,\n  author = {Gretschko, Vitali and Wambach, Achim},\n  title  = {Stable Contracts under Renegotiation},\n  note   = {Revise \\& resubmit, Journal of Political Economy}\n}',
    te2024: '@article{gretschko2024worstcase,\n  author  = {Gretschko, Vitali and Mass, Helene},\n  title   = {Worst-Case Belief Equilibria in First-Price Auctions},\n  journal = {Theoretical Economics},\n  volume  = {19},\n  pages   = {61--93},\n  year    = {2024}\n}',
    jpube2022: '@article{fugger2022social,\n  author  = {Fugger, Nicolas and Gillen, Philippe and Gretschko, Vitali and Riehm, Tobias and Werner, Peter},\n  title   = {Social Norms, Sanctions, and Conditional Entry in Markets with Externalities: Evidence from an Artefactual Field Experiment},\n  journal = {Journal of Public Economics},\n  volume  = {212},\n  pages   = {104701},\n  year    = {2022}\n}',
    ms2022: '@article{gretschko2022multiperiod,\n  author  = {Gretschko, Vitali and Pollrich, Martin},\n  title   = {Multi-Period Procurement with Incomplete Contracts},\n  journal = {Management Science},\n  volume  = {68},\n  number  = {7},\n  pages   = {5146--5161},\n  year    = {2022}\n}',
    geb2022: '@article{fugger2022information,\n  author  = {Fugger, Nicolas and Gretschko, Vitali and Pollrich, Martin},\n  title   = {Information Design in Sequential Procurement},\n  journal = {Games and Economic Behavior},\n  volume  = {135},\n  pages   = {79--85},\n  year    = {2022}\n}',
    aej2020: '@article{fugger2020imitation,\n  author  = {Fugger, Nicolas and Gretschko, Vitali and Mass, Helene and Wambach, Achim},\n  title   = {Imitation Perfection---A Simple Rule to Prevent Discrimination in Procurement},\n  journal = {American Economic Journal: Microeconomics},\n  volume  = {12},\n  number  = {3},\n  pages   = {189--245},\n  year    = {2020}\n}',
    jite2019: '@article{gretschko2019refugee,\n  author  = {Gretschko, Vitali},\n  title   = {A Procurement Mechanism to Assign Refugee Quotas},\n  journal = {Journal of Institutional and Theoretical Economics},\n  volume  = {175},\n  number  = {1},\n  pages   = {53--57},\n  year    = {2019}\n}',
    tp2017: '@article{bichler2017bargaining,\n  author  = {Bichler, Martin and Gretschko, Vitali and Janssen, Maarten},\n  title   = {Bargaining in Spectrum Auctions: A Review of the German Auction in 2015},\n  journal = {Telecommunications Policy},\n  volume  = {41},\n  number  = {5--6},\n  year    = {2017}\n}',
    etb2017: '@article{gillen2017certification,\n  author  = {Gillen, Philippe and Gretschko, Vitali and Rasch, Alexander},\n  title   = {Pre-Auction or Post-Auction Certification?},\n  journal = {Economic Theory Bulletin},\n  volume  = {5},\n  pages   = {139--150},\n  year    = {2017}\n}',
    rand2016: '@article{gretschko2016procurement,\n  author  = {Gretschko, Vitali and Wambach, Achim},\n  title   = {Procurement under Public Scrutiny: Auctions versus Negotiations},\n  journal = {RAND Journal of Economics},\n  volume  = {47},\n  number  = {4},\n  pages   = {914--934},\n  year    = {2016}\n}',
    ee2015: '@article{gretschko2015excess,\n  author  = {Gretschko, Vitali and Rajko, Alexander},\n  title   = {Excess Information Acquisition in Auctions},\n  journal = {Experimental Economics},\n  volume  = {18},\n  number  = {3},\n  pages   = {335--355},\n  year    = {2015}\n}',
    et2014: '@article{gretschko2014information,\n  author  = {Gretschko, Vitali and Wambach, Achim},\n  title   = {Information Acquisition during a Descending Auction},\n  journal = {Economic Theory},\n  volume  = {55},\n  pages   = {731--751},\n  year    = {2014}\n}',
    jme2014: '@article{gretschko2014descending,\n  author  = {Gretschko, Vitali and Rasch, Alexander and Wambach, Achim},\n  title   = {On the Strictly Descending Multi-Unit Auction},\n  journal = {Journal of Mathematical Economics},\n  volume  = {50},\n  pages   = {79--85},\n  year    = {2014}\n}',
    covert2024: '@techreport{gretschko2024covert,\n  author      = {Gretschko, Vitali and Simon, Jasmina},\n  title       = {An Efficient Dynamic Mechanism with Covert Information Acquisition},\n  institution = {ZEW -- Leibniz Centre for European Economic Research},\n  type        = {ZEW Discussion Paper},\n  year        = {2024}\n}',
    avn: '@unpublished{fugger_auctions_negotiations,\n  author = {Fugger, Nicolas and Gillen, Philippe and Gretschko, Vitali and Kokott, Gian-Marco and Riehm, Tobias},\n  title  = {Auctions vs. Negotiations: The Role of Communication in an Experiment with Procurement Managers},\n  note   = {Working paper}\n}',
    coase: '@unpublished{gretschko_coase,\n  author = {Gretschko, Vitali and Wambach, Achim},\n  title  = {Common Values and the Coase Conjecture: Inefficiencies in Frictionless Contract Renegotiation},\n  note   = {Working paper}\n}',
    seqproc: '@unpublished{fugger_sequential,\n  author = {Fugger, Nicolas and Gretschko, Vitali and Pollrich, Martin},\n  title  = {Sequential Procurement with Limited Commitment},\n  note   = {Working paper}\n}',
    ccauction: '@incollection{gretschko2017bidding,\n  author    = {Gretschko, Vitali and Knapek, Stephan and Wambach, Achim},\n  title     = {Bidding Complexities in Combinatorial Clock Auctions},\n  booktitle = {Handbook of Spectrum Auction Design},\n  editor    = {Bichler, Martin and Goeree, Jacob K.},\n  publisher = {Cambridge University Press},\n  year      = {2017}\n}',
    sustproc: '@incollection{gretschko2017sustainable,\n  author    = {Gretschko, Vitali and Haas, F.},\n  title     = {Sustainable Procurement},\n  booktitle = {CSR and Business Models},\n  publisher = {Springer},\n  year      = {2017}\n}',
    wd2024: '@article{gretschko2024verhandlungsgebot,\n  author  = {Gretschko, Vitali and Ockenfels, Axel and Wambach, Achim},\n  title   = {Optimierung des Verhandlungsgebots auf dem Telekommunikationsmarkt},\n  journal = {Wirtschaftsdienst},\n  volume  = {104},\n  number  = {11},\n  pages   = {794--799},\n  year    = {2024}\n}',
    wd2023: '@article{gretschko2023gasspeicher,\n  author  = {Gretschko, Vitali and Ockenfels, Axel},\n  title   = {Empfehlungen f{\\"u}r das Marktdesign zur Bef{\\"u}llung der Gasspeicher},\n  journal = {Wirtschaftsdienst},\n  volume  = {103},\n  number  = {2},\n  pages   = {105--111},\n  year    = {2023}\n}'
  };

  function copyText(text, okMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast(okMsg); }, function () { fallbackCopy(text, okMsg); });
    } else {
      fallbackCopy(text, okMsg);
    }
  }
  function fallbackCopy(text, okMsg) {
    var ta = doc.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    doc.body.appendChild(ta);
    ta.select();
    try { doc.execCommand("copy"); toast(okMsg); } catch (e) { toast("Copy failed — sorry"); }
    doc.body.removeChild(ta);
  }

  doc.addEventListener("click", function (ev) {
    var btn = ev.target.closest(".bib-btn");
    if (!btn) return;
    var key = btn.getAttribute("data-bib");
    if (BIB[key]) copyText(BIB[key], "BibTeX copied to clipboard");
  });

  /* ---------------- Publications: filter + search ---------------- */
  var pubs = Array.prototype.slice.call(doc.querySelectorAll("#pub-list .pub"));
  var filterBtns = Array.prototype.slice.call(doc.querySelectorAll(".filter-btn"));
  var searchInput = doc.getElementById("pub-search");
  var countEl = doc.getElementById("pub-count");
  var emptyEl = doc.getElementById("pub-empty");
  var activeFilter = "all";

  var pubIndex = pubs.map(function (el) {
    return (el.textContent || "").toLowerCase().replace(/\s+/g, " ");
  });

  function applyPubFilter() {
    var q = (searchInput && searchInput.value || "").trim().toLowerCase();
    var terms = q.split(/\s+/).filter(Boolean);
    var shown = 0;
    pubs.forEach(function (el, i) {
      var okKind = activeFilter === "all" || el.getAttribute("data-kind") === activeFilter;
      var okText = terms.every(function (t) { return pubIndex[i].indexOf(t) !== -1; });
      var show = okKind && okText;
      el.hidden = !show;
      if (show) shown++;
    });
    if (countEl) countEl.textContent = shown + "/" + pubs.length;
    if (emptyEl) emptyEl.hidden = shown !== 0;
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      activeFilter = btn.getAttribute("data-filter") || "all";
      applyPubFilter();
    });
  });
  if (searchInput) searchInput.addEventListener("input", applyPubFilter);
  applyPubFilter();

  /* ---------------- Auction simulation ---------------- */
  var sim = null;
  var canvas = doc.getElementById("auction-canvas");
  var statusEl = doc.getElementById("sim-status");
  var replayBtn = doc.getElementById("sim-replay");

  if (canvas && canvas.getContext) {
    sim = (function () {
      var ctx = canvas.getContext("2d");
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var W = 0, H = 0;
      var colors = {};
      var bidders = [];
      var t = 0;              // auction clock, 0..1
      var speed = 0.0016;     // per frame-ish (scaled by dt)
      var phase = "run";      // run | settle | fade
      var settleAt = 0;
      var running = false;
      var visible = false;
      var lastTs = 0;
      var PAD_L = 46, PAD_R = 26, PAD_T = 30, PAD_B = 24;
      var PMAX = 100;

      function cssVar(name) {
        return getComputedStyle(root).getPropertyValue(name).trim();
      }

      function refreshColors() {
        colors = {
          line: cssVar("--line-strong"),
          faint: cssVar("--line"),
          ink: cssVar("--muted"),
          softInk: cssVar("--ink-soft"),
          accent: cssVar("--accent"),
          accentStrong: cssVar("--accent-strong"),
          amber: cssVar("--amber")
        };
        // repaint stills (reduced motion / paused) with the new palette
        if (bidders.length && (reducedMotion || !running)) draw(performance.now());
      }

      function resize() {
        var rect = canvas.getBoundingClientRect();
        W = Math.max(rect.width, 10);
        H = Math.max(rect.height, 10);
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      function newRound() {
        var n = W < 640 ? 5 : 7;
        bidders = [];
        for (var i = 0; i < n; i++) {
          bidders.push({ v: 22 + Math.random() * 72, exited: false, exitT: 0 });
        }
        // ensure a clear gap between top two values so the ending reads well
        bidders.sort(function (a, b) { return a.v - b.v; });
        var top = bidders[bidders.length - 1], second = bidders[bidders.length - 2];
        if (top.v - second.v < 6) top.v = Math.min(97, second.v + 6 + Math.random() * 4);
        t = 0;
        phase = "run";
        if (statusEl) statusEl.textContent = "Live: ascending clock auction — " + n + " bidders in, price rising";
      }

      function x(frac) { return PAD_L + frac * (W - PAD_L - PAD_R); }
      function y(price) { return H - PAD_B - (price / PMAX) * (H - PAD_T - PAD_B); }

      function secondHighest() { return bidders[bidders.length - 2].v; }
      function highest() { return bidders[bidders.length - 1].v; }

      function priceAt(frac) { return frac * PMAX; }

      function draw(now) {
        ctx.clearRect(0, 0, W, H);
        ctx.font = '10.5px ui-monospace, "SF Mono", Menlo, monospace';

        // gridlines + labels
        ctx.strokeStyle = colors.faint;
        ctx.fillStyle = colors.ink;
        ctx.lineWidth = 1;
        [25, 50, 75].forEach(function (p) {
          ctx.globalAlpha = 0.7;
          ctx.beginPath();
          ctx.moveTo(PAD_L, y(p));
          ctx.lineTo(W - PAD_R, y(p));
          ctx.stroke();
          ctx.globalAlpha = 1;
          ctx.fillText(String(p), 18, y(p) + 3.5);
        });

        var endP = secondHighest();
        var curP = Math.min(priceAt(t), phase === "run" ? PMAX : endP);

        // bidder value lines (revealed as faint dashes) + exit markers
        bidders.forEach(function (b) {
          var by = y(b.v);
          if (b.exited) {
            ctx.setLineDash([3, 5]);
            ctx.strokeStyle = colors.line;
            ctx.globalAlpha = 0.9;
            ctx.beginPath();
            ctx.moveTo(PAD_L, by);
            ctx.lineTo(x(b.exitT), by);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.globalAlpha = 1;
            // exit ring
            ctx.strokeStyle = colors.ink;
            ctx.beginPath();
            ctx.arc(x(b.exitT), by, 3.6, 0, Math.PI * 2);
            ctx.stroke();
          }
        });

        // price path
        var frac = phase === "run" ? t : endP / PMAX;
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x(0), y(0));
        ctx.lineTo(x(Math.min(frac, 1)), y(Math.min(curP, endP + (phase === "run" ? PMAX : 0))));
        ctx.stroke();

        // leading dot
        var lx = x(Math.min(frac, 1));
        var ly = y(phase === "run" ? curP : endP);
        ctx.fillStyle = colors.accentStrong;
        ctx.beginPath();
        ctx.arc(lx, ly, 4, 0, Math.PI * 2);
        ctx.fill();

        if (phase !== "run") {
          // clearing price line + pulse
          var age = (now - settleAt) / 1000;
          ctx.setLineDash([6, 6]);
          ctx.strokeStyle = colors.accentStrong;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(lx, ly);
          ctx.lineTo(W - PAD_R, ly);
          ctx.stroke();
          ctx.setLineDash([]);
          if (!reducedMotion) {
            var pr = 4 + (age % 1.4) * 10;
            ctx.globalAlpha = Math.max(0, 0.5 - (age % 1.4) * 0.36);
            ctx.strokeStyle = colors.accentStrong;
            ctx.beginPath();
            ctx.arc(lx, ly, pr, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
          ctx.fillStyle = colors.softInk;
          var label = "sold at " + endP.toFixed(1);
          ctx.fillText(label, Math.min(lx + 10, W - PAD_R - 70), ly - 8);
        }

        // axis
        ctx.strokeStyle = colors.line;
        ctx.beginPath();
        ctx.moveTo(PAD_L, PAD_T - 8);
        ctx.lineTo(PAD_L, H - PAD_B);
        ctx.lineTo(W - PAD_R, H - PAD_B);
        ctx.stroke();

        // caption bottom-left: active bidders
        var active = bidders.filter(function (b) { return !b.exited; }).length;
        ctx.fillStyle = colors.ink;
        if (W >= 640) ctx.fillText("price", 18, PAD_T - 12);
        ctx.fillText(phase === "run" ? active + " bidders active" : "1 winner · pays the price at which the last rival quit",
          PAD_L + 6, H - 8);
      }

      function tick(ts) {
        if (!running) return;
        var dt = lastTs ? Math.min(ts - lastTs, 50) : 16;
        lastTs = ts;

        if (phase === "run") {
          t += speed * dt * 0.08;
          var p = priceAt(t);
          bidders.forEach(function (b, i) {
            if (!b.exited && i < bidders.length - 1 && p >= b.v) {
              // everyone but the highest exits at their value
              if (b.v <= secondHighest()) {
                b.exited = true;
                b.exitT = t;
              }
            }
          });
          if (p >= secondHighest()) {
            phase = "settle";
            settleAt = ts;
            // the runner-up exits exactly at the clearing price
            var ru = bidders[bidders.length - 2];
            if (!ru.exited) { ru.exited = true; ru.exitT = t; }
            if (statusEl) statusEl.textContent =
              "Sold at " + secondHighest().toFixed(1) + " — truthful bidding is a dominant strategy here";
          }
        } else if (ts - settleAt > 3400) {
          newRound();
        }

        draw(ts);
        requestAnimationFrame(tick);
      }

      function start() {
        if (running || !visible) return;
        running = true;
        lastTs = 0;
        requestAnimationFrame(tick);
      }
      function stop() { running = false; }

      function staticFrame() {
        // reduced motion: show the finished auction as a still
        t = 1;
        phase = "settle";
        settleAt = performance.now();
        bidders.forEach(function (b, i) {
          if (i < bidders.length - 1) { b.exited = true; b.exitT = b.v / PMAX; }
        });
        if (statusEl) statusEl.textContent =
          "Ascending clock auction — sold at " + secondHighest().toFixed(1) + " (second-highest value)";
        draw(performance.now());
      }

      function restart() {
        newRound();
        if (reducedMotion) staticFrame();
      }

      // wiring
      refreshColors();
      resize();
      newRound();
      if (reducedMotion) staticFrame();

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          visible = en.isIntersecting;
          if (reducedMotion) return;
          if (visible) start(); else stop();
        });
      }, { threshold: 0.05 });
      io.observe(canvas);

      doc.addEventListener("visibilitychange", function () {
        if (reducedMotion) return;
        if (doc.hidden) stop(); else start();
      });

      var resizeTimer = null;
      window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          resize();
          if (reducedMotion) staticFrame();
        }, 120);
      });

      canvas.addEventListener("click", restart);
      if (replayBtn) replayBtn.addEventListener("click", restart);

      return { refreshColors: refreshColors, restart: restart };
    })();
  }

  /* ---------------- Command palette ---------------- */
  var paletteWrap = doc.getElementById("palette");
  var paletteInput = doc.getElementById("palette-input");
  var paletteList = doc.getElementById("palette-list");
  var paletteBtn = doc.getElementById("palette-btn");
  var selIndex = 0;
  var lastFocus = null;

  function jumpTo(el) {
    el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
    el.classList.remove("flash");
    void el.offsetWidth;
    el.classList.add("flash");
  }

  var commands = [];
  function buildCommands() {
    commands = [];
    // sections
    [["top", "Top — Vitali Gretschko"], ["about", "About"], ["research", "Research"],
     ["consulting", "Consulting & Policy"], ["teaching", "Teaching & Advising"],
     ["tools", "Interactive Tools"], ["media", "In the Media"], ["contact", "Contact"]
    ].forEach(function (s) {
      var el = doc.getElementById(s[0]);
      if (el) commands.push({
        label: s[1], kind: "section",
        run: function () { el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" }); }
      });
    });
    // papers
    pubs.forEach(function (el) {
      var titleEl = el.querySelector(".pub-title");
      if (!titleEl) return;
      commands.push({
        label: titleEl.textContent.trim(), kind: "paper",
        run: function () {
          // reset filters so the target is visible
          filterBtns.forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-filter") === "all"); });
          activeFilter = "all";
          if (searchInput) searchInput.value = "";
          applyPubFilter();
          jumpTo(el);
        }
      });
    });
    // links & actions
    [
      ["Download CV (PDF)", "file", function () { window.location.href = "Supporting%20Documents/CV.pdf"; }],
      ["Google Scholar profile", "link", function () { window.open("https://scholar.google.com/citations?user=HYlvMhkAAAAJ", "_blank", "noopener"); }],
      ["SSRN author page", "link", function () { window.open("https://papers.ssrn.com/sol3/cf_dev/AbsByAuth.cfm?per_id=1953711", "_blank", "noopener"); }],
      ["RePEc / IDEAS profile", "link", function () { window.open("https://ideas.repec.org/f/pgr766.html", "_blank", "noopener"); }],
      ["LinkedIn", "link", function () { window.open("https://www.linkedin.com/in/vitali-gretschko/", "_blank", "noopener"); }],
      ["GitHub — vgretschko", "link", function () { window.open("https://github.com/vgretschko", "_blank", "noopener"); }],
      ["University profile (Münster)", "link", function () { window.open("https://www.wiwi.uni-muenster.de/sumade/en/team/vitali-gretschko", "_blank", "noopener"); }],
      ["Play the Prisoner's Dilemma", "fun", function () { window.open("https://vgretschko.github.io/prisoners-dilemma-game/", "_blank", "noopener"); }],
      ["AI for economic research — resource hub", "link", function () { window.location.href = "ai-econ-research/"; }],
      ["Copy email address", "action", function () { copyText("vitali.gretschko@wiwi.uni-muenster.de", "Email address copied"); }],
      ["Toggle dark / light mode", "action", function () { applyTheme(currentTheme() === "dark" ? "light" : "dark", true); }],
      ["Replay the auction animation", "action", function () { if (sim) sim.restart(); doc.getElementById("top").scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" }); }]
    ].forEach(function (c) {
      commands.push({ label: c[0], kind: c[1], run: c[2] });
    });
  }

  function scoreCommand(cmd, q) {
    var l = cmd.label.toLowerCase();
    if (!q) return 1;
    if (l.indexOf(q) === 0) return 100;
    if (l.indexOf(q) !== -1) return 60;
    // all words present
    var words = q.split(/\s+/).filter(Boolean);
    if (words.length > 1 && words.every(function (w) { return l.indexOf(w) !== -1; })) return 40;
    // subsequence
    var i = 0;
    for (var j = 0; j < l.length && i < q.length; j++) if (l[j] === q[i]) i++;
    return i === q.length ? 12 : 0;
  }

  var filtered = [];
  function renderPalette() {
    var q = (paletteInput.value || "").trim().toLowerCase();
    filtered = commands
      .map(function (c) { return { c: c, s: scoreCommand(c, q) }; })
      .filter(function (r) { return r.s > 0; })
      .sort(function (a, b) { return b.s - a.s; })
      .slice(0, q ? 14 : 12)
      .map(function (r) { return r.c; });
    selIndex = Math.min(selIndex, Math.max(filtered.length - 1, 0));
    paletteList.innerHTML = "";
    if (!filtered.length) {
      var li = doc.createElement("li");
      li.className = "palette-empty";
      li.textContent = "No matches.";
      paletteList.appendChild(li);
      return;
    }
    filtered.forEach(function (c, i) {
      var li = doc.createElement("li");
      li.className = "palette-item" + (i === selIndex ? " sel" : "");
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", i === selIndex ? "true" : "false");
      var span = doc.createElement("span");
      span.textContent = c.label;
      var kind = doc.createElement("span");
      kind.className = "pi-kind";
      kind.textContent = c.kind;
      li.appendChild(span);
      li.appendChild(kind);
      li.addEventListener("click", function () { runCommand(c); });
      li.addEventListener("mousemove", function () {
        if (selIndex !== i) { selIndex = i; renderPalette(); }
      });
      paletteList.appendChild(li);
    });
    var selEl = paletteList.children[selIndex];
    if (selEl && selEl.scrollIntoView) selEl.scrollIntoView({ block: "nearest" });
  }

  function openPalette() {
    if (!paletteWrap) return;
    if (!commands.length) buildCommands();
    lastFocus = doc.activeElement;
    paletteWrap.hidden = false;
    paletteInput.value = "";
    selIndex = 0;
    renderPalette();
    paletteInput.focus();
  }
  function closePalette() {
    if (!paletteWrap || paletteWrap.hidden) return;
    paletteWrap.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function runCommand(c) {
    closePalette();
    setTimeout(function () { c.run(); }, 10);
  }

  if (paletteWrap) {
    if (paletteBtn) paletteBtn.addEventListener("click", openPalette);
    paletteWrap.addEventListener("mousedown", function (ev) {
      if (ev.target === paletteWrap) closePalette();
    });
    paletteInput.addEventListener("input", function () { selIndex = 0; renderPalette(); });
    paletteInput.addEventListener("keydown", function (ev) {
      if (ev.key === "ArrowDown") { ev.preventDefault(); selIndex = Math.min(selIndex + 1, filtered.length - 1); renderPalette(); }
      else if (ev.key === "ArrowUp") { ev.preventDefault(); selIndex = Math.max(selIndex - 1, 0); renderPalette(); }
      else if (ev.key === "Enter" && filtered[selIndex]) { ev.preventDefault(); runCommand(filtered[selIndex]); }
    });
    doc.addEventListener("keydown", function (ev) {
      if ((ev.metaKey || ev.ctrlKey) && (ev.key === "k" || ev.key === "K")) {
        ev.preventDefault();
        if (paletteWrap.hidden) openPalette(); else closePalette();
      } else if (ev.key === "Escape") {
        closePalette();
      }
    });
  }

  /* ---------------- Footer year ---------------- */
  var yearEl = doc.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
