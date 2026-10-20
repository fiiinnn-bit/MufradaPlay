/* =========================================================
   MufradaPlay — script.js
   Kosakata dari buku Bahasa Arab MA Kelas X (Bab 1–3),
   tiga permainan, navigasi, dan mode malam.
   ========================================================= */

/* ---------- DATA ---------- */

// 10 soal per permainan (A, B, C) untuk setiap bab
const QUESTION_COUNT = 10;

const GAME_TITLES = {
  A: 'Tebak Gambar',
  B: 'Cocokkan Arti',
  C: 'Susun Huruf'
};

/*
  Sumber:
  - Bab 1: teks bacaan, biodata, dan latihan pelajaran 1 (halaman buku 5–23)
  - Bab 2: daftar "استمع إلى المفردات وافهمها" (halaman buku 19),
           teks bacaan (halaman buku 21), dan latihan (halaman buku 22–29)
  - Bab 3: daftar "استمع إلى المفردات وافهمها" (halaman buku 31–32),
           dan latihan pelajaran 3
  Harakat dibaca dari gambar halaman buku. Silakan dicek ulang dengan buku.
*/
const CHAPTERS = [
  {
    id: 'bab1',
    label: 'Bab 1',
    theme: 'Salam dan Perkenalan',
    arabTitle: 'التَّحِيَّاتُ وَالتَّعَارُفُ',
    description: 'Ungkapan salam, perkenalan diri, data pribadi, dan angka dasar.',
    words: [
      { arab: 'وَاحِدٌ', arti: 'Satu', emoji: '1️⃣' },
      { arab: 'اِثْنَانِ', arti: 'Dua', emoji: '2️⃣' },
      { arab: 'ثَلَاثَةٌ', arti: 'Tiga', emoji: '3️⃣' },
      { arab: 'أَرْبَعَةٌ', arti: 'Empat', emoji: '4️⃣' },
      { arab: 'خَمْسَةٌ', arti: 'Lima', emoji: '5️⃣' },
      { arab: 'تِلْمِيذٌ', arti: 'Siswa', emoji: '🧑‍🎓' },
      { arab: 'جَدِيدٌ', arti: 'Baru', emoji: '🆕' },
      { arab: 'يَتَعَلَّمُ', arti: 'Belajar', emoji: '🧠' },
      { arab: 'الصَّفُّ', arti: 'Kelas', emoji: '🚪' },
      { arab: 'الْمَدْرَسَةُ', arti: 'Sekolah', emoji: '🏫' },
      { arab: 'شَخْصِيَّةٌ', arti: 'Pribadi', emoji: '🙋' },
      { arab: 'بِطَاقَةٌ', arti: 'Kartu', emoji: '🪪' },
      { arab: 'اِسْمٌ', arti: 'Nama', emoji: '🏷️' },
      { arab: 'عُنْوَانٌ', arti: 'Alamat', emoji: '📍' },
      { arab: 'رَقْمٌ', arti: 'Nomor', emoji: '🔢' },
      { arab: 'هَاتِفٌ', arti: 'Telepon', emoji: '☎️' },
      { arab: 'عُمْرٌ', arti: 'Umur', emoji: '⏳' },
      { arab: 'تَعَارُفٌ', arti: 'Perkenalan', emoji: '🤝' },
      { arab: 'صَدِيقٌ', arti: 'Teman', emoji: '🧑‍🤝‍🧑' },
      { arab: 'صَبَاحٌ', arti: 'Pagi', emoji: '🌅' },
      { arab: 'أَهْلًا', arti: 'Selamat datang', emoji: '👋' },
      { arab: 'تَحَدَّثَ', arti: 'Berbicara', emoji: '💬' },
      { arab: 'أَيْنَ', arti: 'Di mana?', emoji: '❓' },
      { arab: 'بَعِيدٌ', arti: 'Jauh', emoji: '🛣️' }
    ]
  },
  {
    id: 'bab2',
    label: 'Bab 2',
    theme: 'Keluarga dan Rumah',
    arabTitle: 'الْأُسْرَةُ وَالْبَيْتُ',
    description: 'Anggota keluarga, bagian-bagian rumah, dan kegiatan sehari-hari.',
    words: [
      { arab: 'أَبٌ', arti: 'Ayah', emoji: '👨' },
      { arab: 'أُمٌّ', arti: 'Ibu', emoji: '👩' },
      { arab: 'أَخِي الْكَبِيرُ', arti: 'Kakak laki-laki', emoji: '🧑' },
      { arab: 'أَخِي الصَّغِيرُ', arti: 'Adik laki-laki', emoji: '👦' },
      { arab: 'أُخْتِي الْكَبِيرَةُ', arti: 'Kakak perempuan', emoji: '👩‍🦰' },
      { arab: 'أُخْتِي الصَّغِيرَةُ', arti: 'Adik perempuan', emoji: '👧' },
      { arab: 'رَبَّةُ الْبَيْتِ', arti: 'Ibu rumah tangga', emoji: '👩‍🍳' },
      { arab: 'الْبَوَّابَةُ', arti: 'Gerbang', emoji: '🚧' },
      { arab: 'الشُّرْفَةُ', arti: 'Teras', emoji: '🏡' },
      { arab: 'الطَّابَقُ الْعُلْوِيُّ', arti: 'Lantai atas', emoji: '🔼' },
      { arab: 'الطَّابَقُ السُّفْلِيُّ', arti: 'Lantai bawah', emoji: '🔽' },
      { arab: 'غُرْفَةُ الْجُلُوسِ', arti: 'Ruang tamu', emoji: '🛋️' },
      { arab: 'غُرْفَةُ النَّوْمِ', arti: 'Kamar tidur', emoji: '🛏️' },
      { arab: 'غُرْفَةُ الْأَكْلِ', arti: 'Ruang makan', emoji: '🍽️' },
      { arab: 'الْمَطْبَخُ', arti: 'Dapur', emoji: '🍳' },
      { arab: 'الْحَمَّامُ', arti: 'Kamar mandi', emoji: '🚿' },
      { arab: 'غُرْفَةُ الْمُذَاكَرَةِ', arti: 'Ruang belajar', emoji: '📚' },
      { arab: 'النَّافِذَةُ', arti: 'Jendela', emoji: '🪟' },
      { arab: 'أَكَلَ', arti: 'Makan', emoji: '🍚' },
      { arab: 'أَنَامُ', arti: 'Tidur', emoji: '😴' },
      { arab: 'أَسْتَيْقِظُ', arti: 'Bangun', emoji: '🌞' },
      { arab: 'أَغْسِلُ الْمَلَابِسَ', arti: 'Mencuci pakaian', emoji: '🧺' },
      { arab: 'أُشَاهِدُ التِّلْفِزْيُونَ', arti: 'Menonton TV', emoji: '📺' },
      { arab: 'أَطْبَخُ', arti: 'Memasak', emoji: '🍲' },
      { arab: 'أَكْتُبُ', arti: 'Menulis', emoji: '✍️' },
      { arab: 'أَقْرَأُ', arti: 'Membaca', emoji: '📖' }
    ]
  },
  {
    id: 'bab3',
    label: 'Bab 3',
    theme: 'Madrasah dan Lingkungan Sekitarnya',
    arabTitle: 'الْمَدْرَسَةُ وَالْبِيئَةُ الْمُحِيْطَةُ بِهَا',
    description: 'Mata pelajaran, perlengkapan belajar, hari dalam seminggu, dan lingkungan sekolah.',
    words: [
      { arab: 'الرِّيَاضِيَّاتُ', arti: 'Matematika', emoji: '➗' },
      { arab: 'التَّارِيخُ', arti: 'Sejarah', emoji: '📜' },
      { arab: 'الْفَنُّ', arti: 'Seni', emoji: '🎨' },
      { arab: 'الْحَاسُوبُ', arti: 'Komputer', emoji: '💻' },
      { arab: 'الْجَامِعَةُ', arti: 'Universitas', emoji: '🎓' },
      { arab: 'اللُّغَةُ', arti: 'Bahasa', emoji: '🗣️' },
      { arab: 'الْجَدْوَلُ الدِّرَاسِيُّ', arti: 'Jadwal pelajaran', emoji: '🗓️' },
      { arab: 'الْعَامُ الدِّرَاسِيُّ', arti: 'Tahun ajaran', emoji: '📅' },
      { arab: 'عُطْلَةُ الْأُسْبُوعِ', arti: 'Akhir pekan', emoji: '🏖️' },
      { arab: 'الِامْتِحَانَاتُ', arti: 'Ujian', emoji: '📝' },
      { arab: 'السَّكَنُ', arti: 'Asrama', emoji: '🏘️' },
      { arab: 'سَرِيرٌ', arti: 'Ranjang', emoji: '🛏️' },
      { arab: 'جَزَانَةُ الْمَلَابِسِ', arti: 'Lemari pakaian', emoji: '👔' },
      { arab: 'الْغَدَاءُ', arti: 'Makan siang', emoji: '🍱' },
      { arab: 'الْعَشَاءُ', arti: 'Makan malam', emoji: '🥘' },
      { arab: 'الْمُدَرِّسُ الْمُشْرِفُ', arti: 'Guru pembimbing', emoji: '👨‍🏫' },
      { arab: 'سَبُّورَةٌ', arti: 'Papan tulis', emoji: '📋' },
      { arab: 'طَبَاشِيرُ', arti: 'Kapur tulis', emoji: '⚪' },
      { arab: 'مِسْطَرَةٌ', arti: 'Penggaris', emoji: '📏' },
      { arab: 'مِمْحَاةٌ', arti: 'Penghapus', emoji: '🧽' },
      { arab: 'سَاعَةُ الْجِدَارِ', arti: 'Jam dinding', emoji: '🕰️' },
      { arab: 'مَكْتَبَةٌ', arti: 'Perpustakaan', emoji: '📚' },
      { arab: 'يَوْمُ الْأَحَدِ', arti: 'Hari Minggu', emoji: '📅' },
      { arab: 'يَوْمُ الْجُمُعَةِ', arti: 'Hari Jumat', emoji: '🕌' },
      { arab: 'يَوْمُ السَّبْتِ', arti: 'Hari Sabtu', emoji: '🌴' }
    ]
  }
];

/* ---------- STATE ---------- */

const app = {
  chapterId: 'bab1',
  gameKey: null,
  game: null,
  lastResult: null
};

/* ---------- FUNGSI BANTU ---------- */

function $(selector) { return document.querySelector(selector); }

function getChapter(chapterId) {
  return CHAPTERS.find((chapter) => chapter.id === chapterId) || CHAPTERS[0];
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickRandom(list, count) { return shuffle(list).slice(0, count); }

// Memecah kata Arab menjadi "huruf + harakat"
function splitArabicLetters(word) {
  return word.match(/[\s\S][\u064B-\u065F\u0670]*/g) || [];
}

function makeLetterTiles(word) {
  const letters = splitArabicLetters(word).map((text, id) => ({ text, id }));
  let tiles = shuffle(letters);
  let attempts = 0;
  while (attempts < 10 && letters.length > 1 && tiles.every((tile, i) => tile.id === i)) {
    tiles = shuffle(letters);
    attempts++;
  }
  return tiles;
}

function refreshIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

function feedbackHtml(feedback) {
  if (!feedback) return '<div class="feedback feedback-empty" aria-live="polite"></div>';
  return `<div class="feedback feedback-${feedback.type}" role="status">${feedback.text}</div>`;
}

function currentQuestion() { return app.game.questions[app.game.index]; }

/* ---------- NAVIGASI ---------- */

function setActiveNav(navName) {
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.classList.toggle('is-active', link.dataset.nav === navName);
  });
}

function closeMobileMenu() {
  $('#mobile-menu').classList.add('hidden');
  $('#menu-toggle').setAttribute('aria-expanded', 'false');
}

function toggleMobileMenu() {
  const isHidden = $('#mobile-menu').classList.toggle('hidden');
  $('#menu-toggle').setAttribute('aria-expanded', String(!isHidden));
}

function showView(viewName, navName = viewName) {
  document.querySelectorAll('.view').forEach((view) => view.classList.add('hidden'));

  const view = document.getElementById('view-' + viewName);
  if (!view) return;

  view.classList.remove('hidden');
  view.classList.remove('view-enter');
  void view.offsetWidth;
  view.classList.add('view-enter');

  setActiveNav(navName);
  closeMobileMenu();
  window.scrollTo({ top: 0, behavior: 'auto' });
  refreshIcons();
}

/* ---------- MODE MALAM ---------- */

function applyTheme(isDark) {
  document.documentElement.classList.toggle('dark', isDark);
  $('#theme-toggle').innerHTML = `<i data-lucide="${isDark ? 'sun' : 'moon'}"></i>`;
  refreshIcons();
}

function initTheme() {
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('mufradaplay-theme'); } catch (error) { savedTheme = null; }
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme ? savedTheme === 'dark' : prefersDark);
}

function toggleTheme() {
  const isDark = !document.documentElement.classList.contains('dark');
  applyTheme(isDark);
  try { localStorage.setItem('mufradaplay-theme', isDark ? 'dark' : 'light'); } catch (error) { /* abaikan */ }
}

/* ---------- MATERI ---------- */

function renderChapterCards() {
  $('#materi-cards').innerHTML = CHAPTERS.map((chapter) => `
    <article class="card card-hover chapter-card">
      <div class="flex items-center justify-between">
        <span class="chapter-badge">${chapter.label.toUpperCase()}</span>
        <span class="chapter-count">${chapter.words.length} kosakata</span>
      </div>
      <h3 class="chapter-theme">${chapter.theme}</h3>
      <p class="chapter-arab arab">${chapter.arabTitle}</p>
      <p class="chapter-desc">${chapter.description}</p>
      <div class="chapter-actions">
        <button class="btn btn-ghost" data-chapter-detail="${chapter.id}"><i data-lucide="book-open"></i> Pelajari</button>
        <button class="btn btn-primary" data-chapter-play="${chapter.id}"><i data-lucide="gamepad-2"></i> Mainkan</button>
      </div>
    </article>
  `).join('');
}

function openChapterDetail(chapterId) {
  app.chapterId = chapterId;
  const chapter = getChapter(chapterId);

  $('#detail-content').innerHTML = `
    <div class="card">
      <div class="detail-head">
        <span class="chapter-badge">${chapter.label.toUpperCase()}</span>
        <h2>${chapter.theme}</h2>
        <p class="detail-arab arab">${chapter.arabTitle}</p>
        <p>${chapter.description}</p>
        <div>
          <button class="btn btn-primary" data-chapter-play="${chapter.id}"><i data-lucide="gamepad-2"></i> Mainkan Bab Ini</button>
        </div>
      </div>

      <h3 class="label-sm">Daftar Kosakata (${chapter.words.length})</h3>
      <ul class="vocab-list">
        ${chapter.words.map((word) => `
          <li class="vocab-item">
            <span class="vocab-emoji" aria-hidden="true">${word.emoji}</span>
            <span class="vocab-arab arab">${word.arab}</span>
            <span class="vocab-arti">${word.arti}</span>
          </li>
        `).join('')}
      </ul>
    </div>
  `;

  showView('detail', 'materi');
}

/* ---------- PILIH BAB ---------- */

function renderChapterChips() {
  $('#chapter-chips').innerHTML = CHAPTERS.map((chapter) => `
    <button class="chip ${chapter.id === app.chapterId ? 'chip-active' : ''}" data-select-chapter="${chapter.id}">
      ${chapter.label} · ${chapter.theme}
    </button>
  `).join('');
}

function selectChapter(chapterId) {
  app.chapterId = chapterId;
  renderChapterChips();
}

/* ---------- MULAI PERMAINAN ---------- */

function startGame(gameKey) {
  const chapter = getChapter(app.chapterId);
  app.gameKey = gameKey;

  if (gameKey === 'A') app.game = createGameA(chapter);
  if (gameKey === 'B') app.game = createGameB(chapter);
  if (gameKey === 'C') app.game = createGameC(chapter);

  $('#game-title').textContent = GAME_TITLES[gameKey];
  $('#game-chapter').textContent = `${chapter.label} · ${chapter.theme}`;

  showView('game', 'permainan');
  renderGame();
}

function renderGame() {
  const game = app.game;
  if (!game) return;

  let html = '';
  if (app.gameKey === 'A') html = renderGameA(game);
  if (app.gameKey === 'B') html = renderGameB(game);
  if (app.gameKey === 'C') html = renderGameC(game);

  $('#game-body').innerHTML = html;
  $('#game-score').textContent = `Benar ${game.correct} dari ${game.total}`;
  refreshIcons();
}

/* ---------- PERMAINAN A — TEBAK GAMBAR ---------- */

function createGameA(chapter) {
  const questions = pickRandom(chapter.words, QUESTION_COUNT).map((word) => {
    const distractors = shuffle(chapter.words.filter((item) => item.arab !== word.arab)).slice(0, 3);
    return { word, options: shuffle([word, ...distractors]) };
  });

  return { index: 0, questions, total: questions.length, correct: 0, answered: false, selected: null, feedback: null };
}

function renderGameA(game) {
  const question = game.questions[game.index];

  const optionsHtml = question.options.map((option, optionIndex) => {
    let stateClass = '';
    if (game.answered) {
      if (option.arab === question.word.arab) stateClass = 'is-correct';
      else if (optionIndex === game.selected) stateClass = 'is-wrong';
    }
    return `<button class="option-btn arab ${stateClass}" dir="rtl" data-action="answer-a" data-option="${optionIndex}" ${game.answered ? 'disabled' : ''}>${option.arab}</button>`;
  }).join('');

  return `
    <div class="game-panel">
      <p class="game-progress">Soal ${game.index + 1} dari ${game.total}</p>
      <div class="emoji-stage" aria-hidden="true">${question.word.emoji}</div>
      <p class="question-text">Pilih kosakata Arab yang sesuai dengan gambar.</p>
      <div class="options-grid">${optionsHtml}</div>
      ${feedbackHtml(game.feedback)}
      <button class="btn btn-primary" data-action="next-a" ${game.answered ? '' : 'disabled'}>
        Soal Berikutnya <i data-lucide="arrow-right"></i>
      </button>
    </div>`;
}

function answerGameA(optionIndex) {
  const game = app.game;
  if (game.answered) return;

  const question = game.questions[game.index];
  const chosen = question.options[optionIndex];
  const isRight = chosen.arab === question.word.arab;

  game.answered = true;
  game.selected = optionIndex;
  if (isRight) game.correct++;

  game.feedback = isRight
    ? { type: 'ok', text: 'Benar! Kamu memilih jawaban yang tepat.' }
    : { type: 'bad', text: `Belum tepat. Jawaban yang benar: <span class="arab">${question.word.arab}</span> (${question.word.arti}).` };

  renderGame();
}

function nextGameA() {
  const game = app.game;
  if (!game.answered) return;

  game.index++;
  if (game.index >= game.total) { finishGame(); return; }

  game.answered = false;
  game.selected = null;
  game.feedback = null;
  renderGame();
}

/* ---------- PERMAINAN B — COCOKKAN ARTI ---------- */

function createGameB(chapter) {
  const pairs = pickRandom(chapter.words, QUESTION_COUNT).map((word, id) => ({ id, word }));

  return {
    leftItems: shuffle(pairs),
    rightItems: shuffle(pairs),
    total: pairs.length,
    selectedLeftId: null,
    matchedIds: [],
    wrongCounts: {},
    wrongAttempts: 0,
    flashLeft: null,
    flashRight: null,
    correct: 0,
    feedback: { type: 'info', text: 'Pilih satu kosakata Arab, lalu pilih artinya yang sesuai.' }
  };
}

function renderGameB(game) {
  const leftHtml = game.leftItems.map((pair) => {
    const matched = game.matchedIds.includes(pair.id);
    const classes = [
      'match-btn', 'arab',
      matched ? 'is-matched' : '',
      game.selectedLeftId === pair.id ? 'is-selected' : '',
      game.flashLeft === pair.id ? 'is-wrong' : ''
    ].join(' ');
    return `<button class="${classes}" dir="rtl" data-action="pick-b-left" data-id="${pair.id}" ${matched ? 'disabled' : ''}>${pair.word.arab}</button>`;
  }).join('');

  const rightHtml = game.rightItems.map((pair) => {
    const matched = game.matchedIds.includes(pair.id);
    const classes = ['match-btn', matched ? 'is-matched' : '', game.flashRight === pair.id ? 'is-wrong' : ''].join(' ');
    return `<button class="${classes}" data-action="pick-b-right" data-id="${pair.id}" ${matched ? 'disabled' : ''}>${pair.word.arti}</button>`;
  }).join('');

  return `
    <div class="game-panel">
      <p class="game-progress">Pasangan benar: ${game.matchedIds.length} dari ${game.total}</p>
      <div class="match-grid">
        <div class="match-col">
          <p class="match-col-title">Kosakata Arab</p>
          ${leftHtml}
        </div>
        <div class="match-col">
          <p class="match-col-title">Arti (Indonesia)</p>
          ${rightHtml}
        </div>
      </div>
      ${feedbackHtml(game.feedback)}
      ${game.matchedIds.length === game.total
        ? '<button class="btn btn-primary" data-action="finish-b"><i data-lucide="trophy"></i> Lihat Hasil</button>'
        : ''}
    </div>`;
}

function pickLeftB(pairId) {
  const game = app.game;
  if (game.matchedIds.includes(pairId)) return;
  game.selectedLeftId = pairId;
  game.feedback = { type: 'info', text: 'Sekarang pilih arti yang sesuai.' };
  renderGame();
}

function pickRightB(pairId) {
  const game = app.game;
  if (game.matchedIds.includes(pairId)) return;

  if (game.selectedLeftId === null) {
    game.feedback = { type: 'info', text: 'Pilih kosakata Arab terlebih dahulu.' };
    renderGame();
    return;
  }

  const leftId = game.selectedLeftId;

  if (leftId === pairId) {
    if (!game.wrongCounts[pairId]) game.correct++; // hanya benar pada percobaan pertama
    game.matchedIds.push(pairId);
    game.selectedLeftId = null;
    game.feedback = { type: 'ok', text: 'Tepat! Pasangan benar.' };
    renderGame();
  } else {
    game.wrongCounts[leftId] = (game.wrongCounts[leftId] || 0) + 1;
    game.wrongAttempts++;
    game.selectedLeftId = null;
    game.flashLeft = leftId;
    game.flashRight = pairId;
    game.feedback = { type: 'bad', text: 'Belum tepat. Coba pasangan lain.' };
    renderGame();

    setTimeout(() => {
      if (app.game === game) {
        game.flashLeft = null;
        game.flashRight = null;
        renderGame();
      }
    }, 600);
  }
}

/* ---------- PERMAINAN C — SUSUN HURUF ---------- */

function createGameC(chapter) {
  const questions = pickRandom(chapter.words, QUESTION_COUNT).map((word) => ({
    word,
    tiles: makeLetterTiles(word.arab),
    picked: [],
    checked: false,
    isCorrect: false
  }));

  return { index: 0, questions, total: questions.length, correct: 0, feedback: null };
}

function renderGameC(game) {
  const question = currentQuestion();
  const pickedSet = new Set(question.picked);

  const answerHtml = question.picked.length === 0
    ? '<span class="answer-placeholder">Ketuk huruf di bawah untuk menyusun kata</span>'
    : question.picked.map((id) => {
        const tile = question.tiles.find((item) => item.id === id);
        return `<button class="letter-chip is-answer arab" data-action="unpick-c" data-id="${id}" ${question.isCorrect ? 'disabled' : ''} aria-label="Hapus huruf">${tile.text}</button>`;
      }).join('');

  const bankHtml = question.tiles.map((tile) => {
    const used = pickedSet.has(tile.id);
    return `<button class="letter-chip arab" data-action="pick-c" data-id="${tile.id}" ${used || question.isCorrect ? 'disabled' : ''}>${tile.text}</button>`;
  }).join('');

  const canEdit = question.picked.length > 0 && !question.isCorrect;

  return `
    <div class="game-panel">
      <p class="game-progress">Soal ${game.index + 1} dari ${game.total}</p>
      <p class="question-text">Susun huruf menjadi kosakata yang artinya:</p>
      <p class="question-meaning">${question.word.arti}</p>

      <div class="answer-slot" aria-label="Jawaban">${answerHtml}</div>
      <div class="letter-bank">${bankHtml}</div>

      ${feedbackHtml(game.feedback)}

      <div class="game-actions">
        <button class="btn btn-ghost" data-action="reset-c" ${canEdit ? '' : 'disabled'}><i data-lucide="rotate-ccw"></i> Ulangi</button>
        <button class="btn btn-primary" data-action="check-c" ${canEdit ? '' : 'disabled'}><i data-lucide="check"></i> Periksa</button>
        <button class="btn btn-accent" data-action="next-c" ${question.checked ? '' : 'disabled'}>Lanjut <i data-lucide="arrow-right"></i></button>
      </div>
    </div>`;
}

function pickLetterC(tileId) {
  const question = currentQuestion();
  if (question.isCorrect || question.picked.includes(tileId)) return;
  question.picked.push(tileId);
  app.game.feedback = null;
  renderGame();
}

function unpickLetterC(tileId) {
  const question = currentQuestion();
  if (question.isCorrect) return;
  question.picked = question.picked.filter((id) => id !== tileId);
  app.game.feedback = null;
  renderGame();
}

function resetGameC() {
  currentQuestion().picked = [];
  app.game.feedback = null;
  renderGame();
}

function checkGameC() {
  const game = app.game;
  const question = currentQuestion();
  if (question.picked.length === 0 || question.isCorrect) return;

  const typed = question.picked.map((id) => question.tiles.find((tile) => tile.id === id).text).join('');
  const isRight = typed === question.word.arab;

  if (!question.checked) {
    question.checked = true;
    if (isRight) game.correct++; // skor hanya dihitung pada pemeriksaan pertama
  }

  if (isRight) {
    question.isCorrect = true;
    game.feedback = { type: 'ok', text: 'Benar! Susunan hurufnya tepat.' };
  } else {
    game.feedback = { type: 'bad', text: 'Belum tepat. Tekan Ulangi untuk menyusun ulang.' };
  }
  renderGame();
}

function nextGameC() {
  const game = app.game;
  if (!currentQuestion().checked) return;

  game.index++;
  if (game.index >= game.total) { finishGame(); return; }

  game.feedback = null;
  renderGame();
}

/* ---------- HASIL ---------- */

function finishGame() {
  const game = app.game;
  const percent = game.total ? Math.round((game.correct / game.total) * 100) : 0;
  const chapter = getChapter(app.chapterId);

  let note = '';
  if (app.gameKey === 'A') note = 'Skor dihitung dari jawaban yang kamu pilih pada setiap soal.';
  if (app.gameKey === 'B') note = `Pasangan dihitung benar jika tepat pada percobaan pertama. Percobaan salah: ${game.wrongAttempts} kali.`;
  if (app.gameKey === 'C') note = 'Soal dihitung benar jika susunan hurufnya tepat pada pemeriksaan pertama.';

  app.lastResult = {
    title: `Permainan ${app.gameKey} — ${GAME_TITLES[app.gameKey]}`,
    chapter: `${chapter.label} · ${chapter.theme}`,
    correct: game.correct,
    total: game.total,
    percent,
    note
  };

  $('#hasil-title').textContent = app.lastResult.title;
  $('#hasil-chapter').textContent = app.lastResult.chapter;
  $('#hasil-benar').textContent = app.lastResult.correct;
  $('#hasil-soal').textContent = app.lastResult.total;
  $('#hasil-skor').textContent = app.lastResult.percent;
  $('#hasil-catatan').textContent = app.lastResult.note;

  showView('hasil', 'permainan');
}

/* ---------- KLIK & INISIALISASI ---------- */

function handleAction(action, data) {
  switch (action) {
    case 'answer-a':     answerGameA(Number(data.option)); break;
    case 'next-a':       nextGameA(); break;
    case 'pick-b-left':  pickLeftB(Number(data.id)); break;
    case 'pick-b-right': pickRightB(Number(data.id)); break;
    case 'finish-b':     finishGame(); break;
    case 'pick-c':       pickLetterC(Number(data.id)); break;
    case 'unpick-c':     unpickLetterC(Number(data.id)); break;
    case 'reset-c':      resetGameC(); break;
    case 'check-c':      checkGameC(); break;
    case 'next-c':       nextGameC(); break;
    case 'restart':      startGame(app.gameKey); break;
    default: break;
  }
}

function handleClick(event) {
  const element = event.target;

  const navButton = element.closest('[data-nav]');
  if (navButton) { showView(navButton.dataset.nav); return; }

  const detailButton = element.closest('[data-chapter-detail]');
  if (detailButton) { openChapterDetail(detailButton.dataset.chapterDetail); return; }

  const playButton = element.closest('[data-chapter-play]');
  if (playButton) {
    selectChapter(playButton.dataset.chapterPlay);
    showView('permainan');
    return;
  }

  const chipButton = element.closest('[data-select-chapter]');
  if (chipButton) { selectChapter(chipButton.dataset.selectChapter); return; }

  const gameButton = element.closest('[data-game-start]');
  if (gameButton) { startGame(gameButton.dataset.gameStart); return; }

  const actionButton = element.closest('[data-action]');
  if (actionButton && !actionButton.disabled) {
    handleAction(actionButton.dataset.action, actionButton.dataset);
  }
}

function bindEvents() {
  document.addEventListener('click', handleClick);
  $('#theme-toggle').addEventListener('click', toggleTheme);
  $('#menu-toggle').addEventListener('click', toggleMobileMenu);
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderChapterCards();
  renderChapterChips();
  setActiveNav('beranda');
  bindEvents();
  refreshIcons();
});