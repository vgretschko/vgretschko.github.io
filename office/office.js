/* Chair Manager '94: the office view of vgretschko.github.io.
   Everything on screen is painted in code onto a 320x200 canvas (VGA mode 13h, more or less).
   No images, no fonts, no libraries, no network requests. */
(function () {
  "use strict";

  var doc = document;
  var W = 320, H = 200;
  var cv = doc.getElementById("scene");
  if (!cv || !cv.getContext) return;
  var g = cv.getContext("2d");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- tiny paint kit ---------- */
  var c = g; /* current target context */
  function R(x, y, w, h, col) { c.fillStyle = col; c.fillRect(x, y, w, h); }
  function P(x, y, col) { c.fillStyle = col; c.fillRect(x, y, 1, 1); }
  function box(x, y, w, h, col) { R(x, y, w, 1, col); R(x, y + h - 1, w, 1, col); R(x, y, 1, h, col); R(x + w - 1, y, 1, h, col); }
  function ln(x0, y0, x1, y1, col) {
    var dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, e = dx + dy;
    for (;;) {
      P(x0, y0, col);
      if (x0 === x1 && y0 === y1) break;
      var e2 = 2 * e;
      if (e2 >= dy) { e += dy; x0 += sx; }
      if (e2 <= dx) { e += dx; y0 += sy; }
    }
  }
  function disc(cx, cy, r, col) {
    for (var y = -r; y <= r; y++) for (var x = -r; x <= r; x++) if (x * x + y * y <= r * r + r * 0.6) P(cx + x, cy + y, col);
  }
  function inset(x, y, w, h, face, dark, light) {
    R(x, y, w, h, face); R(x, y, w, 1, dark); R(x, y, 1, h, dark); R(x, y + h - 1, w, 1, light); R(x + w - 1, y, 1, h, light);
  }
  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function canvas(w, h) { var k = doc.createElement("canvas"); k.width = w; k.height = h; return k; }

  /* 3x5 font for lettering inside the scene */
  var F3 = {
    A: ".#.#.#####.##.#", B: "##.#.###.#.###.", C: ".###..#..#...##", D: "##.#.##.##.###.", E: "####..##.#..###",
    F: "####..##.#..#..", G: ".###..#.##.#.##", H: "#.##.#####.##.#", I: "###.#..#..#.###", J: "..#..#..##.#.#.",
    K: "#.##.###.#.##.#", L: "#..#..#..#..###", M: "#.########.##.#", N: "##.#.##.##.##.#", O: ".#.#.##.##.#.#.",
    P: "##.#.###.#..#..", Q: ".#.#.##.####.##", R: "##.#.###.#.##.#", S: ".###...#...###.", T: "###.#..#..#..#.",
    U: "#.##.##.##.####", V: "#.##.##.##.#.#.", W: "#.##.########.#", X: "#.##.#.#.#.##.#", Y: "#.##.#.#..#..#.",
    Z: "###..#.#.#..###", "0": "####.##.##.####", "1": ".#.##..#..#.###", "2": "##...#.#.#..###", "3": "##...#.#...###.",
    "4": "#.##.####..#..#", "5": "####..##...###.", "6": ".###..####.####", "7": "###..#.#..#..#.", "8": "####.#####.####",
    "9": "####.####..###.", ".": "............#..", ":": "....#.....#....", ">": "#...#...#.#.#..", "\\": "#..#...#...#..#",
    "-": "......###......", "!": ".#..#..#.....#.", "?": "##...#.#.....#.", "'": ".#..#.........."
  };
  function txt3(x, y, s, col) {
    for (var i = 0; i < s.length; i++) {
      var gl = F3[s.charAt(i)];
      if (gl) for (var k = 0; k < 15; k++) if (gl.charAt(k) === "#") P(x + i * 4 + (k % 3), y + (k / 3 | 0), col);
    }
  }

  /* 5x7 font for the cross-stitch */
  var F5 = {
    A: ".###.#...##...#######...##...##...#", B: "####.#...##...#####.#...##...#####.", C: ".###.#...##....#....#....#...#.###.",
    D: "####.#...##...##...##...##...#####.", E: "######....#....####.#....#....#####", F: "######....#....####.#....#....#....",
    G: ".###.#...##....#.####...##...#.###.", H: "#...##...##...#######...##...##...#", I: ".###...#....#....#....#....#...###.",
    J: "..###...#....#....#....#.#..#..##..", K: "#...##..#.#.#..##...#.#..#..#.#...#", L: "#....#....#....#....#....#....#####",
    M: "#...###.###.#.##.#.##...##...##...#", N: "#...###..##.#.##..###...##...##...#", O: ".###.#...##...##...##...##...#.###.",
    P: "####.#...##...#####.#....#....#....", Q: ".###.#...##...##...##.#.##..#..##.#", R: "####.#...##...#####.#.#..#..#.#...#",
    S: ".#####....#.....###.....#....#####.", T: "#####..#....#....#....#....#....#..", U: "#...##...##...##...##...##...#.###.",
    V: "#...##...##...##...##...#.#.#...#..", W: "#...##...##...##.#.##.#.###.###...#", X: "#...##...#.#.#...#...#.#.#...##...#",
    Y: "#...##...#.#.#...#....#....#....#..", Z: "#####....#...#...#...#...#....#####",
    "0": ".###.#...##..###.#.###..##...#.###.", "1": "..#...##....#....#....#....#...###.", "2": ".###.#...#....#...#...#...#...#####",
    "3": "#####...#...#.....#.....##...#.###.", "4": "...#...##..#.#.#..#.#####...#....#.", "5": "######....####.....#....##...#.###.",
    "6": "..##..#...#....####.#...##...#.###.", "7": "#####....#...#...#...#....#....#...", "8": ".###.#...##...#.###.#...##...#.###.",
    "9": ".###.#...##...#.####....#...#..##..", ".": "..............................#....", ",": ".........................#....#....",
    "'": "..#....#...........................", "!": "..#....#....#....#....#.........#..", "?": ".###.#...#....#...#...#.........#..",
    "-": "...............###.................", ":": ".......#.....................#....."
  };

  /* ---------- palette ---------- */
  var INK = "#1b1410", GOLD = "#d9b23a", GOLD_D = "#b08a22", GOLD_L = "#f0d264", RED = "#b3261e", WHITE = "#f1eee6";
  var WOOD = "#8a5a36", WOOD_D = "#5e3b20", WOOD_DD = "#4a2c16", WOOD_L = "#b07a48";

  /* ---------- the ten dead referees ---------- */
  function face(bgc, clothes, skin, shade, o) {
    o = o || {};
    if (bgc) R(0, 0, 30, 38, bgc);
    R(8, 28, 14, 1, clothes); R(6, 29, 18, 1, clothes); R(4, 30, 22, 1, clothes); R(2, 31, 26, 2, clothes); R(0, 33, 30, 5, clothes);
    R(12, 24, 6, 5, shade);
    R(11, 9, 8, 1, skin); R(10, 10, 10, 1, skin); R(9, 11, 12, 11, skin); R(10, 22, 10, 1, skin); R(11, 23, 8, 1, skin); R(12, 24, 6, 1, skin);
    if (o.wide) { R(8, 12, 1, 9, skin); R(21, 12, 1, 9, skin); }
    if (o.dome) { R(12, 7, 6, 1, skin); R(11, 8, 8, 1, skin); P(13, 8, "#f6d9bd"); }
    R(8, 15, 1, 4, shade); R(21, 15, 1, 4, shade);
    R(20, 12, 1, 9, shade);
    R(11, 14, 3, 1, o.brow || INK); R(16, 14, 3, 1, o.brow || INK);
    P(12, 16, INK); P(17, 16, INK); P(11, 16, "#fff"); P(16, 16, "#fff");
    R(15, 17, 1, 3, shade); P(14, 19, shade);
    R(13, 21, 4, 1, o.mouth || "#9a4a3a");
  }
  var SKIN = "#e2b48c", SHADE = "#c4926a";
  var PORTRAITS = [
    { name: "Thomas Jefferson", paint: function () {
      face("#3b2a20", "#26324f", SKIN, SHADE, { brow: "#8a5a3a" });
      var h = "#b98a62", hs = "#8f6442";
      R(11, 6, 8, 1, h); R(10, 7, 10, 1, h); R(9, 8, 12, 2, h); R(9, 10, 2, 1, h); R(19, 10, 2, 1, h);
      R(7, 10, 2, 10, h); R(21, 10, 2, 10, h); R(7, 14, 1, 5, hs); R(22, 14, 1, 5, hs);
      R(11, 25, 8, 4, WHITE); R(12, 29, 6, 4, WHITE); R(14, 27, 2, 5, "#cfcabb");
      R(8, 28, 3, 7, "#1b2540"); R(19, 28, 3, 7, "#1b2540"); P(9, 33, GOLD); P(20, 33, GOLD);
    } },
    { name: "Napoleon Bonaparte", paint: function () {
      face("#40382e", "#1f2f6b", SKIN, SHADE, { brow: "#2a1c12" });
      var h = "#2a1c12", k = "#15151a";
      R(9, 10, 12, 1, h); R(9, 11, 2, 3, h); R(19, 11, 2, 2, h); R(12, 11, 3, 1, h);
      R(9, 2, 12, 1, k); R(6, 3, 18, 1, k); R(4, 4, 22, 1, k); R(3, 5, 24, 3, k); R(5, 8, 20, 1, k); R(8, 9, 14, 1, k);
      R(4, 7, 22, 1, GOLD_D); P(14, 4, "#fff"); P(15, 4, RED); P(16, 4, "#3a5ad0");
      R(12, 29, 6, 9, WHITE); R(9, 27, 3, 3, RED); R(18, 27, 3, 3, RED);
      P(13, 31, GOLD); P(16, 31, GOLD); P(13, 34, GOLD); P(16, 34, GOLD);
      R(1, 30, 6, 2, GOLD); R(23, 30, 6, 2, GOLD); R(1, 32, 6, 1, GOLD_D); R(23, 32, 6, 1, GOLD_D);
    } },
    { name: "Henry VIII", paint: function () {
      face("#2e3d2a", "#8c1c13", "#e8bc98", "#c99a76", { brow: "#9a5a1d", wide: true });
      var bd = "#b5651d", k = "#15151a", fur = "#d8c9a8";
      R(9, 19, 2, 3, bd); R(19, 19, 2, 3, bd); R(10, 22, 10, 2, bd); R(11, 24, 8, 2, bd); R(12, 20, 6, 1, bd);
      R(14, 21, 2, 1, "#7a2a1a");
      R(8, 10, 2, 3, "#9a5a1d"); R(20, 10, 2, 3, "#9a5a1d");
      R(9, 5, 13, 1, k); R(7, 6, 16, 1, k); R(6, 7, 18, 2, k); R(7, 9, 16, 1, k);
      for (var x = 8; x < 22; x += 3) P(x, 9, GOLD);
      R(22, 3, 3, 1, WHITE); R(23, 4, 3, 2, WHITE); P(24, 6, WHITE);
      R(4, 28, 7, 4, fur); R(19, 28, 7, 4, fur); R(1, 31, 6, 4, fur); R(23, 31, 6, 4, fur);
      P(5, 30, "#8a7a5a"); P(8, 29, "#8a7a5a"); P(22, 30, "#8a7a5a"); P(25, 33, "#8a7a5a"); P(3, 33, "#8a7a5a");
      R(14, 28, 2, 5, GOLD);
      for (x = 8; x < 22; x += 2) P(x, 34 + ((x >> 1) % 2), GOLD);
      R(14, 35, 2, 2, GOLD_L);
    } },
    { name: "Sun Tzu", paint: function () {
      face("#5a1f1a", "#2f3a2a", "#e0b07e", "#c08e5e", { brow: "#15151a" });
      var k = "#15151a";
      R(11, 7, 8, 1, k); R(10, 8, 10, 1, k); R(9, 9, 12, 2, k); R(9, 11, 1, 4, k); R(20, 11, 1, 4, k);
      R(13, 3, 4, 4, k); R(13, 6, 4, 1, RED); R(10, 4, 10, 1, GOLD);
      P(12, 20, k); P(11, 21, k); P(11, 22, k); P(10, 23, k); P(17, 20, k); P(18, 21, k); P(18, 22, k); P(19, 23, k);
      R(14, 23, 2, 5, k);
      R(13, 28, 4, 3, WHITE); ln(11, 28, 14, 34, GOLD); ln(18, 28, 15, 34, GOLD);
    } },
    { name: "Leonardo da Vinci", paint: function () {
      face("#4a4032", "#5b4636", SKIN, SHADE, { brow: "#d9d4c7", dome: true });
      var w = "#d9d4c7", s = "#b0aa9a";
      R(6, 11, 3, 17, w); R(21, 11, 3, 17, w); R(7, 9, 2, 2, w); R(21, 9, 2, 2, w); R(6, 14, 1, 12, s); R(23, 14, 1, 12, s);
      R(9, 19, 12, 4, w); R(10, 23, 10, 4, w); R(11, 27, 8, 3, w); R(12, 30, 6, 2, w); R(13, 32, 4, 1, w);
      R(13, 21, 4, 1, "#8a5a4a"); R(12, 20, 6, 1, w);
      R(12, 24, 1, 6, s); R(15, 23, 1, 8, s); R(18, 24, 1, 5, s);
    } },
    { name: "Antonio Salieri", paint: function () {
      face("#2f3a44", "#1e2a22", "#ecc4a4", "#cfa07e", { brow: "#6a6a6a" });
      var w = "#ececec", s = "#bdbdbd";
      R(11, 5, 8, 1, w); R(9, 6, 12, 1, w); R(8, 7, 14, 3, w); R(8, 10, 2, 2, w); R(20, 10, 2, 2, w);
      R(6, 11, 3, 9, w); R(21, 11, 3, 9, w);
      for (var y = 12; y < 20; y += 3) { R(6, y, 3, 1, s); R(21, y, 3, 1, s); }
      R(12, 8, 6, 1, s);
      R(12, 25, 6, 3, w); R(11, 28, 8, 3, w); R(12, 31, 6, 3, w); P(13, 27, s); P(16, 27, s); P(12, 30, s); P(15, 30, s); P(17, 30, s); P(14, 33, s);
    } },
    { name: "Michelangelo", paint: function () {
      face("#3d342b", "#1c1c1c", "#d9a87e", "#b9865e", { brow: "#2a211b" });
      var h = "#2a211b";
      R(10, 6, 10, 1, h); R(9, 7, 12, 3, h); R(8, 9, 2, 6, h); R(20, 9, 2, 6, h); P(9, 6, h); P(12, 5, h); P(16, 5, h); P(20, 6, h); P(7, 12, h); P(22, 12, h);
      R(9, 18, 2, 4, h); R(19, 18, 2, 4, h); R(10, 22, 10, 2, h); R(11, 24, 8, 2, h); R(11, 26, 3, 2, h); R(16, 26, 3, 2, h);
      R(12, 20, 6, 1, h); R(14, 21, 2, 1, "#7a3a2a");
      R(14, 18, 3, 1, "#b9865e");
      R(11, 28, 8, 1, "#d8d4c8");
    } },
    { name: "Heinrich Hertz", paint: function () {
      face("#39424a", "#2e2e33", SKIN, SHADE, { brow: "#2b1d14" });
      var h = "#2b1d14";
      R(11, 7, 8, 1, h); R(10, 8, 10, 1, h); R(9, 9, 12, 2, h); R(9, 11, 2, 3, h); R(20, 11, 1, 3, h);
      R(9, 18, 2, 4, h); R(19, 18, 2, 4, h); R(10, 21, 10, 3, h); R(11, 24, 8, 2, h); R(12, 26, 6, 1, h); R(12, 20, 6, 1, h);
      R(14, 21, 2, 1, "#7a3a2a");
      R(13, 27, 4, 5, WHITE); R(14, 28, 2, 8, "#15151a"); ln(11, 28, 13, 35, "#1c1c20"); ln(18, 28, 16, 35, "#1c1c20");
    } },
    { name: "Vincent van Gogh", paint: function () {
      var r = rng(1888), cols = ["#6fa3c9", "#e8c84a", "#1f3f66", "#8fc0df"];
      R(0, 0, 30, 38, "#2d5d8a");
      for (var i = 0; i < 70; i++) { var x = r() * 29 | 0, y = r() * 30 | 0; R(x, y, 2, 1, cols[r() * 4 | 0]); }
      face(null, "#3466a0", "#e6b98f", "#c9966c", { brow: "#c9601a" });
      var o = "#c9601a", st = "#e3b93a", sd = "#b98f22";
      R(9, 10, 2, 5, o); R(19, 10, 2, 5, o);
      R(11, 2, 8, 1, st); R(10, 3, 10, 5, st); R(10, 7, 10, 1, "#7a5a16"); R(4, 8, 22, 2, st); R(9, 10, 12, 1, sd); R(4, 9, 22, 1, sd);
      R(12, 4, 1, 3, sd); R(16, 3, 1, 3, sd);
      R(9, 18, 2, 4, o); R(19, 18, 2, 4, o); R(10, 21, 10, 3, o); R(11, 24, 8, 2, o); R(12, 20, 6, 1, o); R(14, 21, 2, 1, "#7a3a2a");
      R(21, 13, 2, 6, WHITE); P(22, 15, "#cfcabb");
      R(11, 27, 8, 2, "#274f7d"); P(14, 31, "#274f7d"); P(14, 34, "#274f7d");
    } },
    { name: "Socrates", paint: function () {
      face("#8c8a84", "#e9e4d8", "#dba987", "#bd8a68", { brow: "#e9e4d8", dome: true });
      var w = "#e9e4d8", s = "#bdb7a6";
      R(0, 0, 4, 38, "#a5a39c"); R(26, 0, 4, 33, "#a5a39c"); R(1, 0, 1, 38, "#7a7872"); R(27, 0, 1, 33, "#7a7872");
      R(0, 33, 30, 5, w);
      R(8, 12, 2, 7, w); R(20, 12, 2, 7, w);
      R(9, 18, 12, 4, w); R(9, 22, 12, 3, w); R(10, 25, 10, 2, w); R(12, 27, 6, 1, w); R(12, 20, 6, 1, w);
      R(13, 21, 4, 1, "#8a5a4a"); R(11, 23, 1, 3, s); R(14, 22, 1, 5, s); R(17, 23, 1, 3, s);
      P(14, 18, "#bd8a68"); P(16, 18, "#bd8a68");
      ln(4, 31, 13, 37, s); ln(10, 30, 22, 37, s); ln(20, 30, 27, 35, s);
    } }
  ];
  PORTRAITS.forEach(function (p) {
    p.cv = canvas(30, 38);
    c = p.cv.getContext("2d");
    p.paint();
  });

  /* ---------- static room ---------- */
  var bg = canvas(W, H);

  function paintRoom() {
    c = bg.getContext("2d");
    var r = rng(1994), x, y, i;

    /* wall + wallpaper */
    R(0, 0, W, 132, "#cdb98f");
    for (x = 0; x < W; x += 8) R(x, 4, 1, 96, x % 16 ? "#c7b287" : "#bfa97c");
    for (y = 10; y < 98; y += 12) for (x = 4 + ((y / 12 | 0) % 2) * 8; x < W; x += 16) { P(x, y, "#dccba6"); P(x, y + 1, "#b9a274"); }
    R(0, 0, W, 4, WOOD_D); R(0, 0, W, 1, "#7a5232"); R(0, 3, W, 1, "#3a2414");
    /* wainscot */
    R(0, 100, W, 32, WOOD); R(0, 100, W, 2, WOOD_L); R(0, 102, W, 1, WOOD_D);
    for (x = 2; x < W; x += 40) inset(x + 3, 106, 34, 20, "#7d5030", WOOD_D, "#a8733f");
    R(0, 128, W, 4, WOOD_DD); R(0, 128, W, 1, "#6a4226");
    /* carpet */
    R(0, 132, W, 68, "#2f6660");
    for (y = 132; y < 200; y++) for (x = y % 2; x < W; x += 2) if (r() < 0.45) P(x, y, "#2a5a56");
    for (i = 0; i < 160; i++) P(r() * W | 0, 134 + r() * 66 | 0, "#3a7770");
    R(0, 132, W, 2, "#22504c");

    /* door */
    R(4, 20, 42, 112, WOOD_DD); R(5, 21, 40, 111, "#6a4226");
    R(7, 23, 36, 109, "#a26b3c"); R(7, 23, 36, 1, "#c08a52"); R(7, 23, 1, 109, "#c08a52"); R(42, 23, 1, 109, "#7a4d28");
    inset(11, 28, 28, 24, "#94602f", "#6f4520", "#c08a52");
    inset(11, 70, 28, 54, "#94602f", "#6f4520", "#c08a52");
    R(12, 57, 27, 9, "#e9e2c8"); box(12, 57, 27, 9, "#6f5a2a"); txt3(14, 59, "ROOM 7", "#2a2018");
    R(36, 80, 2, 7, GOLD_D); R(37, 82, 4, 2, "#e6c14a"); P(39, 82, "#fff2a8");
    /* clock face */
    disc(25, 11, 7, INK); disc(25, 11, 6, "#f4f0e2");
    P(25, 6, INK); P(25, 16, INK); P(20, 11, INK); P(30, 11, INK);

    /* blackboard */
    R(52, 14, 72, 50, WOOD); box(52, 14, 72, 50, WOOD_DD); R(53, 15, 70, 1, WOOD_L);
    R(55, 17, 66, 44, "#1f4a3a");
    for (i = 0; i < 9; i++) { var sx = 56 + r() * 58 | 0, sy = 18 + r() * 38 | 0; for (var k = 0; k < 10; k++) P(sx + (r() * 7 | 0), sy + (r() * 4 | 0), "#285a48"); }
    var ch = "#e8efe6", cy = "#f2e27a", cd = "#8fb0a2";
    ln(72, 22, 62, 33, ch); ln(72, 22, 82, 33, ch); ln(62, 33, 58, 44, ch); ln(62, 33, 66, 44, ch); ln(82, 33, 78, 44, ch); ln(82, 33, 86, 44, ch);
    R(71, 21, 2, 2, cy); R(61, 32, 2, 2, ch); R(81, 32, 2, 2, ch);
    R(57, 44, 2, 2, ch); R(65, 44, 2, 2, ch); R(77, 44, 2, 2, cy); R(85, 44, 2, 2, ch);
    ln(64, 30, 80, 30, cd); /* information set */
    txt3(57, 53, "Q.E.D.", cy);
    ln(98, 23, 98, 55, ch); ln(98, 55, 119, 55, ch); P(97, 24, ch); P(99, 24, ch); P(118, 54, ch); P(118, 56, ch);
    ln(101, 28, 116, 50, cy); ln(101, 50, 116, 30, ch);
    for (y = 41; y < 55; y += 2) P(108, y, cd);
    for (x = 99; x < 108; x += 2) P(x, 39, cd);
    R(108, 39, 2, 2, "#ff8a70");
    R(52, 64, 72, 3, WOOD_L); R(52, 66, 72, 1, WOOD_D);
    R(60, 63, 4, 1, "#ffffff"); R(68, 63, 3, 1, cy); R(106, 61, 9, 3, "#3a2a20"); R(106, 61, 9, 1, "#d8c9a8");

    /* diplomas */
    function diploma(dx, dy) {
      R(dx, dy, 18, 22, "#2a1c12"); R(dx + 1, dy + 1, 16, 20, "#c9a23a"); R(dx + 2, dy + 2, 14, 18, "#f3ecd6");
      R(dx + 5, dy + 4, 8, 1, "#3a3226");
      for (var q = 0; q < 4; q++) R(dx + 4, dy + 7 + q * 2, 10, 1, "#a79f8a");
      R(dx + 4, dy + 16, 5, 1, "#3a3226"); R(dx + 11, dy + 15, 3, 3, RED); P(dx + 12, dy + 18, RED);
    }
    diploma(57, 71); diploma(79, 71);

    /* gilt frame for the referee of the day */
    R(132, 13, 40, 48, "#7a5a12"); R(133, 14, 38, 46, "#e2b93b"); R(134, 15, 36, 44, GOLD_D); R(135, 16, 34, 42, GOLD_L); R(136, 17, 32, 40, "#8a6a16");
    P(133, 14, "#fff2a8"); P(170, 14, "#fff2a8"); P(133, 59, GOLD_D); P(170, 59, GOLD_D);
    for (x = 138; x < 168; x += 4) { P(x, 15, "#fff2a8"); P(x, 58, "#7a5a12"); }
    for (y = 19; y < 56; y += 4) { P(134, y, "#fff2a8"); P(169, y, "#7a5a12"); }
    R(144, 63, 16, 4, GOLD); box(144, 63, 16, 4, "#7a5a12"); R(147, 65, 10, 1, "#7a5a12");

    /* embroidered towel on its rod */
    R(123, 69, 58, 2, "#6f4426"); R(123, 69, 58, 1, "#a8733f"); R(122, 68, 2, 4, WOOD_DD); R(180, 68, 2, 4, WOOD_DD);
    R(127, 70, 50, 28, "#efe6cf"); R(127, 70, 1, 28, "#d8ccb0"); R(176, 70, 1, 28, "#d8ccb0"); R(128, 70, 48, 1, "#fff8e6");
    for (x = 129; x <= 175; x += 2) { P(x, 72, RED); P(x, 96, RED); }
    for (y = 72; y <= 96; y += 2) { P(129, y, RED); P(175, y, RED); }
    txt3(133, 75, "DIE REGELN", "#1f3a7a"); txt3(133, 81, "MACHEN DEN", "#1f3a7a"); txt3(131, 87, "UNTERSCHIED", RED);
    for (x = 137; x < 168; x += 6) { P(x, 94, "#2f7a3a"); P(x + 1, 93, RED); P(x + 2, 94, "#2f7a3a"); }
    for (x = 127; x < 177; x += 2) R(x, 98, 1, 2, "#d8ccb0");

    /* window frame (the view is painted live) */
    R(184, 12, 64, 60, "#efe8d8"); box(184, 12, 64, 60, "#8a8068"); R(185, 13, 62, 1, "#ffffff");
    R(182, 72, 68, 3, "#f6f0e2"); R(182, 75, 68, 1, "#9a8f74");

    /* filing cabinet */
    R(192, 84, 28, 48, "#6f7d78"); box(192, 84, 28, 48, "#2e3a36"); R(193, 85, 26, 1, "#9aa8a2");
    for (i = 0; i < 3; i++) {
      y = 87 + i * 15;
      R(194, y, 24, 13, "#7f8e88"); box(194, y, 24, 13, "#4a5752"); R(195, y + 1, 22, 1, "#a9b6b0");
      R(201, y + 2, 10, 7, "#f3ecd6"); box(201, y + 2, 10, 7, "#4a5752");
      if (i === 0) txt3(203, y + 3, "CV", RED); else { R(203, y + 4, 6, 1, "#8a8576"); R(203, y + 6, 4, 1, "#8a8576"); }
      R(203, y + 10, 6, 2, "#2e3a36"); R(203, y + 10, 6, 1, "#c9d2ce");
    }
    /* cactus on the cabinet */
    R(201, 79, 9, 5, "#b5562b"); R(200, 78, 11, 2, "#cf6e3c"); R(202, 83, 7, 1, "#8a3e1c");
    R(203, 68, 5, 10, "#2f7a3a"); R(204, 67, 3, 1, "#2f7a3a"); R(204, 69, 1, 8, "#58a85e"); R(206, 70, 1, 7, "#1f5a2a");
    R(199, 72, 2, 4, "#2f7a3a"); R(200, 75, 3, 1, "#2f7a3a"); R(209, 70, 2, 4, "#2f7a3a"); R(208, 73, 2, 1, "#2f7a3a");
    P(205, 66, "#ff7aa8"); P(204, 66, "#ffb0c8"); P(199, 71, "#ff7aa8");

    /* bookshelf */
    R(260, 10, 58, 122, WOOD_D); R(262, 12, 54, 118, "#2e1c10"); R(260, 10, 58, 1, WOOD_L); R(260, 10, 1, 122, WOOD);
    var bookCols = ["#8c1c13", "#1f3a7a", "#2f6b3a", "#b08a22", "#5a2a6a", "#1c1c1c", "#c9c2a8", "#a8501e", "#2a5a6a", "#7a1f3a"];
    var comps = [[12, 31], [34, 53], [56, 75], [78, 97], [100, 119]];
    comps.forEach(function (cp, ci) {
      R(262, cp[1] + 1, 54, 2, WOOD); R(262, cp[1] + 1, 54, 1, WOOD_L);
      var bx = 263, hh = cp[1] - cp[0];
      while (bx < 313) {
        if (ci === 2 && bx > 290 && bx < 306) { bx = 306; continue; } /* the robot lives here */
        var bw = 2 + (r() * 3 | 0), bh = hh - 2 - (r() * 6 | 0), col = bookCols[r() * bookCols.length | 0];
        if (bx + bw > 315) break;
        if (r() < 0.08) { bx += 2; continue; }
        R(bx, cp[1] + 1 - bh, bw, bh, col); R(bx, cp[1] + 1 - bh, 1, bh, "rgba(255,255,255,0.22)"); R(bx + bw - 1, cp[1] + 1 - bh, 1, bh, "rgba(0,0,0,0.25)");
        if (bw >= 3) { R(bx + 1, cp[1] + 4 - bh, bw - 2, 1, "#e8d9a0"); R(bx + 1, cp[1] - 3, bw - 2, 1, "#e8d9a0"); }
        bx += bw;
      }
    });
    R(264, 124, 22, 2, "#c9c2a8"); R(264, 126, 24, 2, "#8c1c13"); R(264, 128, 20, 2, "#1f3a7a"); R(292, 125, 18, 2, "#2f6b3a"); R(292, 127, 20, 3, "#c9c2a8");
    /* robot */
    R(295, 61, 9, 7, "#b8c0c8"); box(295, 61, 9, 7, "#4a525a"); R(299, 58, 1, 3, "#4a525a"); P(299, 57, "#ff4a3a");
    R(297, 66, 5, 1, "#4a525a");
    R(296, 68, 7, 6, "#8a96a0"); box(296, 68, 7, 6, "#4a525a"); P(298, 70, "#ffe14a"); P(300, 70, "#3cff5a"); P(298, 72, "#ff4a3a");
    R(294, 69, 2, 4, "#b8c0c8"); R(303, 69, 2, 4, "#b8c0c8"); R(297, 74, 2, 2, "#4a525a"); R(300, 74, 2, 2, "#4a525a");

    /* waste bin */
    R(300, 180, 15, 17, "#55606a"); for (y = 181; y < 197; y += 2) for (x = 300 + (y / 2 | 0) % 2; x < 315; x += 2) P(x, y, "#3a444c");
    R(299, 179, 17, 2, "#8a96a0"); R(300, 196, 15, 1, "#2a3238");
    R(302, 175, 5, 4, "#f4f1e8"); P(303, 176, "#c9c4b4"); P(305, 177, "#c9c4b4"); R(308, 174, 6, 5, "#f4f1e8"); P(310, 175, "#c9c4b4"); P(312, 177, "#c9c4b4"); P(309, 177, "#c9c4b4");
    R(291, 194, 5, 4, "#f4f1e8"); P(292, 195, "#c9c4b4"); P(294, 196, "#c9c4b4");
    R(298, 197, 19, 2, "#22504c");

    /* desk */
    for (y = 138; y < 166; y++) {
      var t = (y - 138) / 27, x0 = Math.round(44 - 18 * t), x1 = Math.round(276 + 18 * t);
      R(x0, y, x1 - x0, 1, y < 140 ? "#b06a3a" : "#9a5229");
    }
    for (i = 0; i < 26; i++) { var gx = 50 + r() * 200 | 0, gy = 141 + r() * 23 | 0; R(gx, gy, 6 + r() * 16 | 0, 1, r() < 0.5 ? "#8c4a24" : "#a85c30"); }
    R(26, 166, 268, 3, "#c07a44"); R(26, 166, 268, 1, "#d99358"); R(26, 169, 268, 1, "#4a2210");
    R(28, 170, 264, 30, "#6f3418");
    inset(34, 174, 70, 24, "#64300f", "#3a1a08", "#8c4a24"); inset(110, 174, 100, 24, "#64300f", "#3a1a08", "#8c4a24"); inset(216, 174, 70, 24, "#64300f", "#3a1a08", "#8c4a24");
    R(66, 185, 6, 2, GOLD); R(248, 185, 6, 2, GOLD);
    R(113, 180, 94, 9, GOLD); box(113, 180, 94, 9, "#7a5a12"); R(114, 181, 92, 1, GOLD_L);
    txt3(117, 182, "PROF. DR. V. GRETSCHKO", "#3a2a08");

    /* briefcase */
    box(13, 169, 11, 7, "#2e1a0a"); box(14, 170, 9, 6, "#4a2c16");
    R(4, 174, 29, 20, "#6a3e1c"); box(4, 174, 29, 20, "#2e1a0a"); R(5, 175, 27, 1, "#9a6230"); R(5, 182, 27, 1, "#2e1a0a"); R(5, 183, 27, 1, "#8a5226");
    R(9, 180, 3, 4, "#e6c14a"); R(25, 180, 3, 4, "#e6c14a"); P(10, 182, "#7a5a12"); P(26, 182, "#7a5a12");
    R(5, 192, 27, 1, "#4a2a10");
    R(3, 194, 31, 2, "#22504c");

    /* banker's lamp */
    R(51, 150, 14, 2, GOLD_D); R(53, 149, 10, 1, "#e6c14a"); R(57, 133, 2, 16, GOLD);
    R(47, 126, 22, 7, "#1f7a4a"); R(48, 125, 20, 1, "#2a9a5e"); R(47, 132, 22, 1, "#0f5230"); R(50, 127, 8, 1, "#58c088");
    P(63, 133, GOLD_D); P(63, 134, GOLD_D); P(63, 135, GOLD_D); P(63, 136, "#fff2a8");

    /* computer */
    R(80, 100, 46, 37, "#d8d0b8"); box(80, 100, 46, 37, "#6a6452"); R(81, 101, 44, 1, "#f2ecd8"); R(81, 101, 1, 35, "#f2ecd8"); R(124, 101, 1, 35, "#a09880");
    R(84, 104, 38, 26, "#8a8470"); R(85, 105, 36, 24, "#0a1a0e");
    R(86, 132, 9, 2, "#a09880"); R(112, 132, 3, 2, "#a09880"); R(116, 132, 3, 2, "#a09880");
    R(95, 137, 16, 3, "#a09880"); R(88, 140, 30, 3, "#d8d0b8"); R(88, 143, 30, 1, "#6a6452"); R(88, 140, 30, 1, "#f2ecd8");
    for (y = 149; y < 157; y++) { var kt = (y - 149) / 7; R(Math.round(83 - 2 * kt), y, Math.round(42 + 4 * kt), 1, "#d8d0b8"); }
    R(81, 157, 46, 1, "#6a6452");
    for (y = 150; y < 156; y += 2) for (x = 85; x < 124; x += 2) P(x, y, "#a09880");
    R(96, 155, 16, 1, "#f2ecd8");
    R(131, 150, 6, 8, "#d8d0b8"); box(131, 150, 6, 8, "#6a6452"); R(133, 151, 1, 3, "#6a6452"); ln(133, 149, 127, 145, "#4a4638");

    /* in-tray: papers and a pen */
    R(141, 147, 29, 12, "#cfc8b2"); R(142, 145, 29, 12, "#e6dfca"); R(140, 143, 30, 13, "#fbf7ea"); R(140, 155, 30, 1, "#b5ae98"); R(169, 143, 1, 13, "#b5ae98");
    R(143, 145, 14, 1, "#3a3226");
    for (i = 0; i < 4; i++) R(143, 147 + i * 2, 13 - (i % 2) * 3, 1, "#8a8576");
    box(158, 146, 10, 6, RED); R(160, 148, 2, 2, RED); R(163, 148, 3, 1, RED); R(163, 150, 3, 1, RED);
    ln(148, 158, 166, 153, "#1f3a7a"); P(147, 158, "#c9c4b4"); P(167, 153, GOLD);

    /* coffee mug */
    R(173, 138, 7, 9, "#f4f1e8"); R(173, 138, 7, 1, "#ffffff"); R(174, 139, 5, 1, "#4a2c16"); R(173, 146, 7, 1, "#c9c4b4"); R(179, 139, 1, 7, "#d8d4c8");
    P(180, 140, "#d8d4c8"); R(181, 141, 1, 3, "#d8d4c8"); P(180, 144, "#d8d4c8");
    P(175, 142, RED); P(177, 142, RED); R(175, 143, 3, 1, RED); P(176, 144, RED);

    /* gavel on its block */
    R(199, 156, 13, 4, WOOD_D); R(199, 156, 13, 1, WOOD); R(199, 159, 13, 1, "#3a2414");
    R(186, 150, 17, 3, "#d9a066"); R(186, 152, 17, 1, "#8a5a36"); R(186, 150, 17, 1, "#f0c08a");
    R(202, 147, 7, 9, WOOD); R(202, 147, 7, 1, WOOD_L); R(208, 147, 1, 9, WOOD_D); R(202, 149, 7, 1, GOLD); R(202, 153, 7, 1, GOLD);

    /* newspaper */
    R(241, 155, 42, 10, "#bdb6a0"); R(240, 154, 42, 10, "#ece7d6"); R(240, 154, 42, 1, "#fbf8ee");
    R(242, 155, 22, 2, "#1c1c1c"); R(266, 155, 14, 4, "#8a8576"); P(268, 156, "#ece7d6"); P(272, 157, "#ece7d6");
    for (i = 0; i < 3; i++) { R(242, 158 + i * 2, 10, 1, "#77705e"); R(254, 158 + i * 2, 10, 1, "#77705e"); if (i) R(266, 158 + i * 2, 14, 1, "#77705e"); }
  }

  /* the phone is its own sprite so it can ring */
  var phoneCv = canvas(34, 24);
  function paintPhone() {
    c = phoneCv.getContext("2d");
    var ox = 2, oy = 3; /* body origin inside sprite */
    R(ox, oy + 4, 28, 13, "#3d3d48"); R(ox, oy + 4, 28, 1, "#6a6a78"); R(ox, oy + 16, 28, 1, "#1e1e26"); R(ox + 27, oy + 4, 1, 13, "#2a2a32");
    R(ox + 2, oy, 8, 16, "#2a2a32"); R(ox + 2, oy, 8, 5, "#1f1f27"); R(ox + 2, oy + 11, 8, 5, "#1f1f27"); R(ox + 3, oy + 1, 6, 1, "#55556a"); R(ox + 4, oy + 6, 1, 4, "#55556a");
    for (var rr = 0; rr < 4; rr++) for (var cc = 0; cc < 3; cc++) R(ox + 14 + cc * 4, oy + 6 + rr * 2.5 | 0, 2, 1, "#d8d8e2");
    P(ox + 25, oy + 5, "#ff3b30");
    for (var i = 0; i < 4; i++) { P(ox - 1 + (i % 2), oy + 12 + i * 2, "#1e1e26"); P(ox - 2 + (i % 2), oy + 13 + i * 2, "#1e1e26"); }
  }

  /* ---------- live bits ---------- */
  var tick = 0, portrait = 0, hover = null, night = false, ringing = 0, coffee = 5;
  var now = new Date();
  var raining = Math.random() < 0.7;
  var drops = [];
  for (var di = 0; di < 16; di++) drops.push([188 + Math.random() * 56, 16 + Math.random() * 52]);
  var STARS = [[191, 19], [197, 26], [204, 18], [211, 23], [219, 20], [233, 18], [239, 25], [236, 31], [194, 34], [208, 30]];

  function hourNow() { return now.getHours() + now.getMinutes() / 60; }
  function drawWindow() {
    var x = 188, y = 16, w = 56, h = 52, hr = hourNow(), i, yy, xx;
    var isNight = hr < 6 || hr >= 20.5, dusk = !isNight && (hr < 8 || hr >= 17.5);
    var top, bot, sil, sil2;
    if (isNight) { top = "#0b1030"; bot = "#1a2350"; sil = "#05060f"; sil2 = "#0e1228"; }
    else if (dusk) { top = "#5a4a8a"; bot = "#f0a060"; sil = "#2a1e2e"; sil2 = "#5a3a4a"; }
    else if (raining) { top = "#8fa3b3"; bot = "#b9c6cf"; sil = "#46515c"; sil2 = "#7a8894"; }
    else { top = "#6fb0e8"; bot = "#cfe6f6"; sil = "#4c5a66"; sil2 = "#8aa0b0"; }
    R(x, y, w, h, top); R(x, y + 26, w, 26, bot);
    for (yy = y + 20; yy < y + 26; yy++) for (xx = x + (yy % 2); xx < x + w; xx += 2) P(xx, yy, bot);
    if (isNight) { for (i = 0; i < STARS.length; i++) P(STARS[i][0], STARS[i][1], (tick + i * 7) % 40 < 3 ? "#6a78b0" : "#ffffff"); disc(236, 24, 3, "#f4f0c8"); disc(238, 23, 3, top); }
    else if (!raining && !dusk) { R(193, 22, 12, 3, "#ffffff"); R(196, 20, 7, 2, "#ffffff"); R(226, 27, 10, 2, "#ffffff"); R(229, 25, 5, 2, "#ffffff"); }
    else if (dusk) { disc(203, 44, 4, "#ffe08a"); }
    else { R(190, 19, 20, 3, "#7a8c9a"); R(214, 22, 26, 3, "#7a8c9a"); R(198, 17, 12, 2, "#7a8c9a"); }
    /* St. Lamberti and the cathedral towers, behind the gables */
    R(224, 36, 8, 26, sil2); R(225, 30, 6, 6, sil2); R(226, 24, 4, 6, sil2); R(227, 19, 2, 5, sil2); P(227, 17, sil2); P(227, 18, sil2);
    P(225, 35, "#e08a3a"); P(227, 35, "#e08a3a"); P(230, 35, "#e08a3a");
    R(197, 43, 5, 18, sil2); R(198, 40, 3, 3, sil2); P(199, 38, sil2); P(199, 39, sil2);
    R(205, 43, 5, 18, sil2); R(206, 40, 3, 3, sil2); P(207, 38, sil2); P(207, 39, sil2);
    for (i = 0; i < 7; i++) {
      var hx = 188 + i * 8, wt = 58 + (i % 2) * 2 - (i % 3 === 0 ? 2 : 0);
      R(hx, wt, 8, 68 - wt, sil); R(hx + 1, wt - 2, 6, 2, sil); R(hx + 2, wt - 4, 4, 2, sil); R(hx + 3, wt - 6, 2, 2, sil);
      if (isNight || dusk) { if (i % 2 === 0) P(hx + 2, wt + 3, "#ffd75a"); if (i % 3 === 1) P(hx + 5, wt + 5, "#ffd75a"); }
    }
    if (raining) for (i = 0; i < drops.length; i++) {
      var d = drops[i];
      if (!reduce) { d[1] += 4; d[0] -= 1; if (d[1] > y + h - 2 || d[0] < x) { d[0] = x + 2 + Math.random() * (w - 2); d[1] = y; } }
      P(d[0] | 0, d[1] | 0, "#e6eef5"); P((d[0] | 0), (d[1] | 0) + 1, "#e6eef5");
    }
    R(215, 16, 2, 52, "#efe8d8"); R(188, 41, 56, 2, "#efe8d8"); R(188, 16, 56, 1, "rgba(0,0,0,0.25)"); R(188, 16, 1, 52, "rgba(0,0,0,0.2)");
    R(190, 18, 1, 8, "rgba(255,255,255,0.35)"); R(192, 18, 1, 4, "rgba(255,255,255,0.35)");
  }
  function drawScreen() {
    var gr = "#3cff5a";
    R(85, 105, 36, 24, "#0a1a0e");
    txt3(87, 107, "C:\\>DIR", gr); txt3(87, 113, "PUBS.EXE", "#2ad048"); txt3(87, 119, "C:\\>", gr);
    if (reduce || tick % 8 < 5) R(103, 119, 3, 5, gr);
    for (var y = 106; y < 129; y += 2) R(85, y, 36, 1, "rgba(0,0,0,0.18)");
    P(119, 133, tick % 16 < 14 ? "#3cff5a" : "#1a7a2a");
  }
  function drawClock() {
    var m = now.getMinutes() / 60 * Math.PI * 2, hh = (now.getHours() % 12 + now.getMinutes() / 60) / 12 * Math.PI * 2;
    ln(25, 11, Math.round(25 + Math.sin(m) * 5), Math.round(11 - Math.cos(m) * 5), INK);
    ln(25, 11, Math.round(25 + Math.sin(hh) * 3), Math.round(11 - Math.cos(hh) * 3), RED);
    P(25, 11, INK);
  }
  function drawSteam() {
    if (coffee <= 0) return;
    var f = reduce ? 0 : (tick >> 2) % 4, s = "rgba(255,255,255,0.75)";
    P(175 + (f % 2), 135, s); P(176 - (f % 2), 133, s); P(175 + (f > 1 ? 1 : 0), 131, s);
    P(178 - (f % 2), 134, s); P(178 + (f % 2), 132, s);
  }
  function drawPhone() {
    var dx = 0, dy = 0;
    if (ringing > 0) { dx = (tick % 2) ? 1 : -1; dy = (tick % 4 < 2) ? -1 : 0; }
    g.drawImage(phoneCv, 222 + dx, 130 + dy);
    if (ringing > 0 && tick % 4 < 2) {
      c = g;
      ln(219, 131, 216, 128, "#ffe14a"); ln(218, 136, 214, 136, "#ffe14a"); ln(236, 129, 236, 125, "#ffe14a"); ln(243, 130, 246, 126, "#ffe14a");
    }
  }
  function drawRobot() {
    var blink = !reduce && tick % 48 > 44;
    P(297, 63, blink ? "#4a525a" : "#22d3ee"); P(301, 63, blink ? "#4a525a" : "#22d3ee");
    P(299, 57, tick % 12 < 6 ? "#ff4a3a" : "#7a1a12");
  }
  function drawNight() {
    R(0, 0, W, H, "rgba(6,8,36,0.62)");
    g.fillStyle = "rgba(255,214,110,0.20)";
    g.beginPath(); g.moveTo(47, 133); g.lineTo(69, 133); g.lineTo(104, 166); g.lineTo(26, 166); g.closePath(); g.fill();
    R(47, 126, 22, 7, "#3ad07c"); R(48, 125, 20, 1, "#7af0a8"); R(47, 133, 22, 1, "#fff2a8");
    R(82, 102, 42, 30, "rgba(60,255,90,0.10)");
    drawScreen(); drawWindow();
    P(137 + 12, 18 + 16, "#ff4030"); P(137 + 17, 18 + 16, "#ff4030");
    drawRobot();
  }
  function drawHighlight() {
    if (!hover || (tick % 6 === 5 && !reduce)) return;
    var r = hover.r, x = r[0] - 1, y = r[1] - 1, w = r[2] + 2, h = r[3] + 2, k = Math.min(5, w >> 1, h >> 1), col = "#ffe14a", sh = "#000000";
    [[1, 1, sh], [0, 0, col]].forEach(function (o) {
      var ox = x + o[0], oy = y + o[1], cl = o[2];
      R(ox, oy, k, 1, cl); R(ox, oy, 1, k, cl); R(ox + w - k, oy, k, 1, cl); R(ox + w - 1, oy, 1, k, cl);
      R(ox, oy + h - 1, k, 1, cl); R(ox, oy + h - k, 1, k, cl); R(ox + w - k, oy + h - 1, k, 1, cl); R(ox + w - 1, oy + h - k, 1, k, cl);
    });
  }
  function frame() {
    tick++;
    c = g;
    g.drawImage(bg, 0, 0);
    drawWindow();
    g.drawImage(PORTRAITS[portrait].cv, 137, 18);
    drawScreen(); drawClock(); drawSteam(); drawPhone(); c = g; drawRobot();
    if (night) drawNight();
    drawHighlight();
  }

  /* ---------- hotspots ---------- */
  var HS = [
    { id: "diplomas", r: [55, 69, 44, 26], label: "About", verb: "Read the diplomas: who is this person?", panel: "about" },
    { id: "papers", r: [138, 142, 34, 18], label: "Current work", verb: "Look at the papers on the desk: current work", panel: "desk" },
    { id: "computer", r: [79, 99, 48, 59], label: "Publications", verb: "Use the computer: all publications", panel: "research" },
    { id: "briefcase", r: [3, 168, 31, 27], label: "Consulting", verb: "Open the briefcase: consulting & policy", panel: "consulting" },
    { id: "board", r: [52, 14, 72, 53], label: "Teaching", verb: "Read the blackboard: teaching & advising", panel: "teaching" },
    { id: "news", r: [239, 153, 45, 13], label: "Media", verb: "Read the newspaper: in the media", panel: "media" },
    { id: "phone", r: [223, 132, 31, 20], label: "Contact", verb: "Pick up the phone: contact", panel: "contact" },
    { id: "portrait", r: [132, 13, 40, 54], label: "Dead referees", verb: "Look at the portrait: peer review from beyond the grave", panel: "quotes" },
    { id: "towel", r: [122, 68, 60, 32], label: "Wisdom", verb: "Admire the embroidered towel", panel: "towel" },
    { id: "cabinet", r: [192, 85, 28, 47], label: "CV", verb: "Open the filing cabinet: curriculum vitae", panel: "cv" },
    { id: "robot", r: [293, 56, 13, 21], label: "AI", verb: "Poke the robot: AI × economics", panel: "ai", z: 3 },
    { id: "door", r: [4, 20, 42, 112], label: "Exit", verb: "Leave the office", panel: "exit" },
    { id: "lamp", r: [46, 124, 24, 29], label: "Lamp", verb: "Pull the lamp chain", act: "lamp" },
    { id: "mug", r: [172, 130, 11, 18], label: "Coffee", verb: "Drink the coffee", act: "mug" },
    { id: "gavel", r: [185, 146, 28, 15], label: "Gavel", verb: "Bang the gavel", act: "gavel" },
    { id: "window", r: [184, 12, 64, 56], label: "Window", verb: "Look out of the window", act: "window" },
    { id: "cactus", r: [198, 65, 14, 19], label: "Cactus", verb: "Water the cactus", act: "cactus", z: 3 },
    { id: "books", r: [260, 10, 58, 122], label: "Books", verb: "Browse the bookshelf", act: "books" },
    { id: "clock", r: [17, 3, 17, 17], label: "Clock", verb: "Check the time", act: "clock" },
    { id: "bin", r: [290, 173, 27, 26], label: "Bin", verb: "Inspect the waste bin", act: "bin" }
  ];
  var EGGS = {
    gavel: ["Going once…", "Going twice…", "SOLD! To the bidder who shaded the bid exactly right."],
    cactus: ["The cactus has been watered. It did not ask for this.", "The office cactus thrives on neglect, like most working papers.", "It is in a steady state."],
    books: [
      "A shelf of auction theory. The revenue equivalence chapter falls open by itself.",
      "A row of dissertations. Nobody has opened them since the defense.",
      "A game theory textbook. Backward induction sold separately.",
      "Conference proceedings, 2009–2026. Structurally important: they hold up the shelf."
    ],
    bin: ["Rejected drafts. Desk rejections are filed elsewhere.", "Proof attempt no. 14. It was “obvious” until it wasn’t.", "A crumpled bid. Somebody fell for the winner’s curse."]
  };
  var eggAt = {};
  var statusEl = doc.getElementById("status"), stage = doc.getElementById("stage"), layer = doc.getElementById("hotspots");
  var coffeeEl = doc.getElementById("hud-coffee"), dateEl = doc.getElementById("hud-date");
  var stickyUntil = 0, idleAt = 0;
  var IDLE = [
    "Click on things. It is 1994 and this is how menus work.",
    "TIP: The rules make the difference.",
    "NEWS: Local professor proves theorem. Humans in the lab decline to comply.",
    "TIP: Splitting the difference is rarely a Nash equilibrium.",
    "TIP: Press H to see everything you can click.",
    "REMINDER: Referee report due. You are Referee 2 (the constructive version).",
    "NEWS: Procurement manager insists talking to suppliers lowers prices. Experiment disagrees.",
    "TIP: The portrait on the wall changes. The opinions of the dead do not."
  ];
  function say(msg, hold) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    stickyUntil = hold ? Date.now() + hold : 0;
  }
  function idle() { say(IDLE[idleAt % IDLE.length]); }
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function hud() {
    if (coffeeEl) {
      var s = "";
      for (var i = 0; i < 5; i++) s += i < coffee ? "▮" : "▯";
      coffeeEl.textContent = s;
      coffeeEl.setAttribute("aria-label", coffee + " of 5 cups of coffee left");
    }
    if (dateEl) dateEl.textContent = pad(now.getDate()) + "." + pad(now.getMonth() + 1) + "." + now.getFullYear() + " " + pad(now.getHours()) + ":" + pad(now.getMinutes());
  }

  /* sound: square-wave blips, off unless asked for */
  var ac = null, soundOn = false;
  function beep(f, d, t) {
    if (!soundOn) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      var o = ac.createOscillator(), v = ac.createGain(), at = ac.currentTime + (t || 0);
      o.type = "square"; o.frequency.value = f; v.gain.value = 0.035;
      o.connect(v); v.connect(ac.destination); o.start(at); o.stop(at + d);
    } catch (e) { /* no audio, no problem */ }
  }

  function act(h) {
    var a = h.act, list, msg;
    if (a === "lamp") {
      night = !night;
      say(night ? "Night shift. The R&R is not going to revise itself." : "Lights on. Back to business hours.", 6000);
      beep(night ? 220 : 440, 0.06);
    } else if (a === "mug") {
      coffee = 5; hud(); beep(660, 0.05); beep(880, 0.08, 0.06);
      say("Coffee refilled. A theorist is a device for turning coffee into theorems. Economists add assumptions.", 7000);
    } else if (a === "window") {
      var hr = hourNow();
      msg = raining ? "It is raining in Münster. Either it rains or the church bells ring. If both, it is Sunday."
        : "No rain in Münster. Enjoy this off-equilibrium event.";
      if ((eggAt.window = (eggAt.window || 0) + 1) % 2 === 0) msg = (hr < 6 || hr >= 20.5) ? "Dark outside. The marginal product of the last working hour is debatable." : "That is St. Lamberti. Yes, those are the cages.";
      say(msg, 7000); beep(330, 0.05);
    } else if (a === "clock") {
      say("It is " + pad(now.getHours()) + ":" + pad(now.getMinutes()) + ". Office hours are by appointment; the discount factor is strictly below one.", 7000); beep(990, 0.03);
    } else {
      list = EGGS[a]; eggAt[a] = eggAt[a] || 0;
      say(list[eggAt[a] % list.length], 6000);
      if (a === "gavel") { beep(eggAt[a] % 3 === 2 ? 180 : 300, 0.07); if (eggAt[a] % 3 === 2) beep(120, 0.12, 0.08); } else beep(330, 0.05);
      eggAt[a]++;
    }
    if (reduce) frame();
  }

  HS.forEach(function (h) {
    if (!layer) return;
    var b = doc.createElement("button");
    b.type = "button"; b.className = "hs" + (h.panel ? " hs-main" : " hs-egg"); b.id = "hs-" + h.id;
    b.style.left = (h.r[0] / W * 100) + "%"; b.style.top = (h.r[1] / H * 100) + "%";
    b.style.width = (h.r[2] / W * 100) + "%"; b.style.height = (h.r[3] / H * 100) + "%";
    if (h.z) b.style.zIndex = h.z;
    b.setAttribute("aria-label", h.verb);
    var s = doc.createElement("span"); s.textContent = h.label; s.setAttribute("aria-hidden", "true"); b.appendChild(s);
    function on() { hover = h; say(h.verb); if (reduce) frame(); }
    function off() { if (hover === h) { hover = null; if (Date.now() > stickyUntil) idle(); if (reduce) frame(); } }
    b.addEventListener("mouseenter", on); b.addEventListener("focus", on);
    b.addEventListener("mouseleave", off); b.addEventListener("blur", off);
    b.addEventListener("click", function () { if (h.panel) openPanel(h.panel, b); else act(h); });
    layer.appendChild(b);
  });

  /* ---------- windows ---------- */
  var win = doc.getElementById("win"), winTitle = doc.getElementById("win-title"), winBody = doc.getElementById("win-body");
  var store = doc.getElementById("panels"), current = null, opener = null;
  var ALIAS = { selected: "desk", blurbs: "quotes", top: null };

  function openPanel(id, from, keepHash) {
    var sec = doc.getElementById(id);
    if (!sec || !win || sec.parentNode !== store && sec !== current) return false;
    if (current && current !== sec) store.appendChild(current);
    current = sec; if (from) opener = from;
    winTitle.textContent = sec.getAttribute("data-title") || id;
    win.setAttribute("data-skin", sec.getAttribute("data-skin") || "plain");
    winBody.appendChild(sec); winBody.scrollTop = 0;
    if (!win.open) { if (win.showModal) win.showModal(); else win.setAttribute("open", ""); }
    if (!keepHash) try { history.replaceState(null, "", "#" + id); } catch (e) { }
    if (coffee > 0) { coffee--; hud(); }
    beep(523, 0.04); beep(784, 0.06, 0.05);
    if (id === "quotes") showBlurb(portrait);
    if (id === "towel") showTowel(towelAt);
    if (id === "about") mugshot();
    return true;
  }
  function closed() {
    if (current) { store.appendChild(current); current = null; }
    try { history.replaceState(null, "", location.pathname + location.search); } catch (e) { }
    if (opener && opener.focus) opener.focus();
    opener = null;
    if (coffee === 0) say("Out of coffee. Productivity is collapsing. Click the mug.", 8000);
    else if (Date.now() > stickyUntil) idle();
  }
  if (win) {
    win.addEventListener("close", closed);
    win.addEventListener("click", function (ev) {
      if (ev.target === win || ev.target.closest("[data-close]")) { win.close ? win.close() : (win.removeAttribute("open"), closed()); return; }
      var a = ev.target.closest("a[href^='#']");
      if (a) { if (route(a.getAttribute("href").slice(1))) ev.preventDefault(); }
    });
  }
  function route(hash) {
    if (!hash) return false;
    if (ALIAS.hasOwnProperty(hash)) hash = ALIAS[hash];
    if (!hash) return false;
    var target = doc.getElementById(hash);
    if (!target) return false;
    if (target.classList.contains("panel")) return openPanel(hash);
    var sec = target.closest(".panel");
    if (!sec) return false;
    if (sec.id === "research") resetFilter();
    openPanel(sec.id, null, true);
    target.classList.remove("flash"); void target.offsetWidth; target.classList.add("flash");
    var tr = target.getBoundingClientRect(), br = winBody.getBoundingClientRect();
    winBody.scrollTop += tr.top - br.top - Math.max(0, (br.height - tr.height) / 2);
    return true;
  }
  doc.addEventListener("click", function (ev) {
    var a = ev.target.closest && ev.target.closest("a[data-panel]");
    if (a) { ev.preventDefault(); openPanel(a.getAttribute("data-panel"), a); }
  });
  window.addEventListener("hashchange", function () { route(location.hash.slice(1)); });

  /* ---------- peer review from beyond the grave ---------- */
  var blurbs = [].slice.call(doc.querySelectorAll("#quotes .blurb")), bigCv = doc.getElementById("big-portrait"), countEl = doc.getElementById("blurb-count");
  function showBlurb(i) {
    var n = PORTRAITS.length;
    portrait = (i % n + n) % n;
    blurbs.forEach(function (b, k) { b.classList.toggle("active", k === portrait); });
    if (bigCv) { var k = bigCv.getContext("2d"); k.clearRect(0, 0, 30, 38); k.drawImage(PORTRAITS[portrait].cv, 0, 0); bigCv.setAttribute("aria-label", "Pixel portrait of " + PORTRAITS[portrait].name); }
    if (countEl) countEl.textContent = (portrait + 1) + "/" + n;
    if (reduce) frame();
  }
  var bp = doc.getElementById("blurb-prev"), bn = doc.getElementById("blurb-next");
  if (bp) bp.addEventListener("click", function () { showBlurb(portrait - 1); beep(392, 0.04); });
  if (bn) bn.addEventListener("click", function () { showBlurb(portrait + 1); beep(494, 0.04); });

  /* ---------- the embroidered towel ---------- */
  var towels = [].slice.call(doc.querySelectorAll("#towel-list li")), towelAt = 0, stitchCv = doc.getElementById("stitch"), stitchCap = doc.getElementById("stitch-caption");
  function wrap(s, n) {
    var words = s.split(" "), lines = [], cur = "";
    words.forEach(function (w) {
      if (cur && (cur + " " + w).length > n) { lines.push(cur); cur = w; } else cur = cur ? cur + " " + w : w;
    });
    if (cur) lines.push(cur);
    return lines;
  }
  function showTowel(i) {
    if (!towels.length || !stitchCv) return;
    towelAt = (i % towels.length + towels.length) % towels.length;
    var li = towels[towelAt], text = li.getAttribute("data-stitch") || li.textContent, by = li.getAttribute("data-by") || "";
    var lines = wrap(text.toUpperCase(), 18), cols = 18 * 6 - 1 + 14, rows = lines.length * 9 - 2 + 14, s = 5;
    stitchCv.width = cols * s; stitchCv.height = rows * s;
    var k = stitchCv.getContext("2d"), x, y;
    k.fillStyle = "#efe6cf"; k.fillRect(0, 0, stitchCv.width, stitchCv.height);
    k.fillStyle = "#e0d5b8";
    for (y = 0; y < rows; y++) for (x = 0; x < cols; x++) k.fillRect(x * s, y * s, 1, 1);
    function st(cx, cy, col, dark) {
      var px = cx * s, py = cy * s;
      k.lineWidth = 1.6; k.lineCap = "round";
      k.strokeStyle = dark; k.beginPath(); k.moveTo(px + 0.8, py + s - 0.8); k.lineTo(px + s - 0.8, py + 0.8); k.stroke();
      k.strokeStyle = col; k.beginPath(); k.moveTo(px + 0.8, py + 0.8); k.lineTo(px + s - 0.8, py + s - 0.8); k.stroke();
    }
    var red = ["#b3261e", "#7a1812"], blue = ["#1f3a7a", "#142650"], green = ["#2f7a3a", "#1c4a22"];
    for (x = 2; x < cols - 2; x++) { var cA = x % 4 < 2 ? red : blue; st(x, 2, cA[0], cA[1]); st(x, rows - 3, cA[0], cA[1]); }
    for (y = 3; y < rows - 3; y++) { var cB = y % 4 < 2 ? red : blue; st(2, y, cB[0], cB[1]); st(cols - 3, y, cB[0], cB[1]); }
    [[4, 4], [cols - 5, 4], [4, rows - 5], [cols - 5, rows - 5]].forEach(function (p) { st(p[0], p[1], green[0], green[1]); });
    lines.forEach(function (line, li2) {
      var lw = line.length * 6 - 1, ox = Math.floor((cols - lw) / 2), oy = 7 + li2 * 9, col = li2 % 2 ? blue : red;
      for (var ci = 0; ci < line.length; ci++) {
        var gl = F5[line.charAt(ci)];
        if (!gl) continue;
        for (var q = 0; q < 35; q++) if (gl.charAt(q) === "#") st(ox + ci * 6 + (q % 5), oy + (q / 5 | 0), col[0], col[1]);
      }
    });
    stitchCv.setAttribute("aria-label", "Cross-stitch embroidery reading: " + text);
    if (stitchCap) stitchCap.textContent = "“" + text + "”" + (by ? " " + by : "");
  }
  var tn = doc.getElementById("towel-next");
  if (tn) tn.addEventListener("click", function () { showTowel(towelAt + 1); beep(587, 0.04); });

  /* ---------- the staff photo, digitised at great expense ---------- */
  var mugDone = false;
  function mugshot() {
    var img = doc.getElementById("mugshot");
    if (mugDone || !img) return;
    function go() {
      try {
        var n = 64, k = canvas(n, n), x = k.getContext("2d");
        x.drawImage(img, 0, 0, n, n);
        var d = x.getImageData(0, 0, n, n), p = d.data, B = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
        for (var i = 0; i < p.length; i += 4) {
          var px = (i / 4) % n, py = (i / 4 / n) | 0, t = (B[(py % 4) * 4 + (px % 4)] / 16 - 0.5) * 48;
          for (var ch = 0; ch < 3; ch++) { var v = Math.round((p[i + ch] + t) / 51) * 51; p[i + ch] = v < 0 ? 0 : v > 255 ? 255 : v; }
        }
        x.putImageData(d, 0, 0);
        k.className = img.className; k.setAttribute("role", "img"); k.setAttribute("aria-label", img.alt);
        img.parentNode.replaceChild(k, img); mugDone = true;
      } catch (e) { /* keep the plain photo */ }
    }
    if (img.complete && img.naturalWidth) go(); else img.addEventListener("load", go);
  }

  /* ---------- publication filter ---------- */
  var pubs = [].slice.call(doc.querySelectorAll("#research .pub")), groups = [].slice.call(doc.querySelectorAll("#research .pub-group"));
  var fbtns = [].slice.call(doc.querySelectorAll("#research .filter")), search = doc.getElementById("pub-search"), pubCount = doc.getElementById("pub-count"), pubEmpty = doc.getElementById("pub-empty");
  var kind = "all";
  function applyFilter() {
    var q = search ? search.value.trim().toLowerCase() : "", shown = 0, per = {};
    pubs.forEach(function (p) {
      var k = p.getAttribute("data-kind"), ok = (kind === "all" || kind === k) && (!q || p.textContent.toLowerCase().indexOf(q) !== -1);
      p.hidden = !ok; if (ok) { shown++; per[k] = 1; }
    });
    groups.forEach(function (gh) { var v = !per[gh.getAttribute("data-group")]; gh.hidden = v; if (gh.nextElementSibling) gh.nextElementSibling.hidden = v; });
    if (pubCount) pubCount.textContent = shown + " file(s)";
    if (pubEmpty) pubEmpty.hidden = shown > 0;
  }
  function resetFilter() {
    kind = "all"; if (search) search.value = "";
    fbtns.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-filter") === "all" ? "true" : "false"); });
    applyFilter();
  }
  fbtns.forEach(function (b) {
    b.addEventListener("click", function () {
      kind = b.getAttribute("data-filter");
      fbtns.forEach(function (o) { o.setAttribute("aria-pressed", o === b ? "true" : "false"); });
      applyFilter(); beep(440, 0.03);
    });
  });
  if (search) search.addEventListener("input", applyFilter);
  applyFilter();

  /* ---------- HUD buttons, keys ---------- */
  var hintBtn = doc.getElementById("btn-hints"), soundBtn = doc.getElementById("btn-sound");
  function setHints(on) { if (stage) stage.classList.toggle("hints", on); if (hintBtn) hintBtn.setAttribute("aria-pressed", on ? "true" : "false"); }
  if (hintBtn) hintBtn.addEventListener("click", function () { setHints(!stage.classList.contains("hints")); });
  if (soundBtn) soundBtn.addEventListener("click", function () {
    soundOn = !soundOn; soundBtn.setAttribute("aria-pressed", soundOn ? "true" : "false");
    soundBtn.textContent = soundOn ? "Sound: on" : "Sound: off";
    beep(523, 0.05); beep(659, 0.05, 0.06); beep(784, 0.08, 0.12);
  });
  doc.addEventListener("keydown", function (ev) {
    if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
    var t = ev.target && ev.target.tagName;
    if (t === "INPUT" || t === "TEXTAREA") return;
    if (ev.key === "h" || ev.key === "H" || ev.key === "?") setHints(!stage.classList.contains("hints"));
  });
  if (window.matchMedia && window.matchMedia("(hover: none) and (min-width: 700px)").matches) setHints(true);

  /* ---------- go ---------- */
  paintRoom(); paintPhone(); hud(); idle(); frame();
  var acc = 0;
  setInterval(function () {
    now = new Date();
    if (doc.hidden) return;
    acc++;
    if (acc % 8 === 0) hud();
    if (!hover && Date.now() > stickyUntil && acc % 56 === 0 && !(win && win.open)) { idleAt++; idle(); }
    if (reduce) { if (acc % 80 === 0) frame(); return; }
    if (win && win.open) return;
    if (acc % 72 === 0) portrait = (portrait + 1) % PORTRAITS.length;
    if (ringing > 0) ringing--;
    else if (acc % 280 === 96) {
      ringing = 14; beep(1400, 0.05); beep(1750, 0.05, 0.07); beep(1400, 0.05, 0.14); beep(1750, 0.05, 0.21);
      if (!hover && Date.now() > stickyUntil) say("The phone rings. Probably a procurement manager.", 4000);
    }
    frame();
  }, 125);

  doc.documentElement.classList.add("office-ready");
  if (location.hash.length > 1) route(location.hash.slice(1));
})();
