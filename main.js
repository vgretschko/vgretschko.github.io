/* Vitali Gretschko — site interactions
   Theme · scrollspy · reveal · stats · blurbs from beyond · publications · palette */
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

  function refreshThemeColorMeta() {
    var meta = doc.querySelector('meta[name="theme-color"]:not([media])');
    if (!meta) {
      meta = doc.createElement("meta");
      meta.name = "theme-color";
      doc.head.appendChild(meta);
    }
    meta.content = getComputedStyle(root).getPropertyValue("--bg").trim() || "#f7f3ec";
  }

  function applyTheme(theme, persist) {
    root.setAttribute("data-theme", theme);
    if (persist) {
      try { localStorage.setItem("vg-theme", theme); } catch (e) { /* private mode */ }
    }
    refreshThemeColorMeta();
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      applyTheme(currentTheme() === "dark" ? "light" : "dark", true);
    });
  }

  /* ---------------- Skins (design switcher) ---------------- */
  var SKINS = [
    { id: "corten", label: "Corten — warm paper & rust" },
    { id: "blackboard", label: "Blackboard — chalk on slate" },
    { id: "swiss", label: "Swiss — modernist grid" },
    { id: "terminal", label: "Terminal — phosphor & mono" }
  ];
  var skinBtn = doc.getElementById("skin-btn");
  var skinMenu = doc.getElementById("skin-menu");

  function skinById(id) {
    for (var i = 0; i < SKINS.length; i++) if (SKINS[i].id === id) return SKINS[i];
    return SKINS[0];
  }

  function applySkin(id, persist) {
    var skin = skinById(id);
    root.setAttribute("data-skin", skin.id);
    if (persist) {
      try { localStorage.setItem("vg-skin", skin.id); } catch (e) { /* private mode */ }
    }
    if (skinMenu) {
      Array.prototype.forEach.call(skinMenu.querySelectorAll(".skin-opt"), function (b) {
        b.setAttribute("aria-checked", b.getAttribute("data-skin") === skin.id ? "true" : "false");
      });
    }
    refreshThemeColorMeta();
    return skin;
  }

  function closeSkinMenu() {
    if (skinMenu && !skinMenu.hidden) {
      skinMenu.hidden = true;
      if (skinBtn) skinBtn.setAttribute("aria-expanded", "false");
    }
  }

  if (skinBtn && skinMenu) {
    applySkin(root.getAttribute("data-skin"), false); // sync menu checkmarks with pre-paint choice

    skinBtn.addEventListener("click", function () {
      var open = skinMenu.hidden;
      skinMenu.hidden = !open;
      skinBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    skinMenu.addEventListener("click", function (ev) {
      var opt = ev.target.closest(".skin-opt");
      if (!opt) return;
      var skin = applySkin(opt.getAttribute("data-skin"), true);
      toast("Design: " + skin.label);
      closeSkinMenu();
    });

    doc.addEventListener("mousedown", function (ev) {
      if (!ev.target.closest(".skin-wrap")) closeSkinMenu();
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
  var pubGroups = Array.prototype.slice.call(doc.querySelectorAll("#pub-list .pub-group"));
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
    var shownByKind = {};
    pubs.forEach(function (el, i) {
      var kind = el.getAttribute("data-kind");
      var okKind = activeFilter === "all" || kind === activeFilter;
      var okText = terms.every(function (t) { return pubIndex[i].indexOf(t) !== -1; });
      var show = okKind && okText;
      // inline style, not just [hidden]: author CSS on .pub would override the
      // UA hidden rule, and stale cached stylesheets must not break filtering
      el.hidden = !show;
      el.style.display = show ? "" : "none";
      if (show) {
        shown++;
        shownByKind[kind] = true;
      }
    });
    pubGroups.forEach(function (h) {
      var show = !!shownByKind[h.getAttribute("data-group")];
      h.hidden = !show;
      h.style.display = show ? "" : "none";
    });
    if (countEl) countEl.textContent = shown + "/" + pubs.length;
    if (emptyEl) {
      emptyEl.hidden = shown !== 0;
      emptyEl.style.display = shown !== 0 ? "none" : "";
    }
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

  /* ---------------- Blurbs from beyond the grave ---------------- */
  var blurbNextFn = null;
  var blurbStage = doc.getElementById("blurb-stage");
  if (blurbStage) {
    var blurbs = Array.prototype.slice.call(blurbStage.querySelectorAll(".blurb"));
    var bPrev = doc.getElementById("blurb-prev");
    var bNext = doc.getElementById("blurb-next");
    var bCount = doc.getElementById("blurb-count");
    var blurbWrap = doc.getElementById("blurbs");
    var bIdx = Math.floor(Math.random() * blurbs.length);
    var bTimer = null;
    var BLURB_HOLD = 11000;

    var showBlurb = function (i) {
      bIdx = ((i % blurbs.length) + blurbs.length) % blurbs.length;
      blurbs.forEach(function (el, j) { el.classList.toggle("active", j === bIdx); });
      if (bCount) bCount.textContent = (bIdx + 1) + "/" + blurbs.length;
    };
    var stopBlurbs = function () { if (bTimer) { clearInterval(bTimer); bTimer = null; } };
    var startBlurbs = function () {
      if (reducedMotion || bTimer || doc.hidden) return;
      bTimer = setInterval(function () { showBlurb(bIdx + 1); }, BLURB_HOLD);
    };
    var stepBlurb = function (delta) {
      showBlurb(bIdx + delta);
      stopBlurbs();
      startBlurbs();
    };
    blurbNextFn = function () { stepBlurb(1); };

    if (bPrev) bPrev.addEventListener("click", function () { stepBlurb(-1); });
    if (bNext) bNext.addEventListener("click", function () { stepBlurb(1); });
    if (blurbWrap) {
      blurbWrap.addEventListener("mouseenter", stopBlurbs);
      blurbWrap.addEventListener("mouseleave", startBlurbs);
      blurbWrap.addEventListener("focusin", stopBlurbs);
      blurbWrap.addEventListener("focusout", startBlurbs);
    }
    doc.addEventListener("visibilitychange", function () {
      if (doc.hidden) stopBlurbs(); else startBlurbs();
    });

    showBlurb(bIdx);
    startBlurbs();

    // paper links: clear filters so the target is visible, then jump + flash
    blurbStage.addEventListener("click", function (ev) {
      var a = ev.target.closest(".blurb-paper");
      if (!a) return;
      var id = (a.getAttribute("href") || "").slice(1);
      var el = id && doc.getElementById(id);
      if (!el) return;
      ev.preventDefault();
      filterBtns.forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-filter") === "all"); });
      activeFilter = "all";
      if (searchInput) searchInput.value = "";
      applyPubFilter();
      jumpTo(el);
    });
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
    [["top", "Top — Vitali Gretschko"], ["selected", "Selected Publications"], ["about", "About"],
     ["research", "Research"], ["consulting", "Consulting & Policy"], ["teaching", "Teaching & Advising"],
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
      ["Next endorsement from beyond the grave", "fun", function () { if (blurbNextFn) blurbNextFn(); var b = doc.getElementById("blurbs"); if (b) b.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" }); }]
    ].forEach(function (c) {
      commands.push({ label: c[0], kind: c[1], run: c[2] });
    });
    // design switcher
    SKINS.forEach(function (s) {
      commands.push({
        label: "Design: " + s.label, kind: "design",
        run: function () { applySkin(s.id, true); toast("Design: " + s.label); }
      });
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
        closeSkinMenu();
      }
    });
  }

  /* ---------------- Footer year ---------------- */
  var yearEl = doc.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
