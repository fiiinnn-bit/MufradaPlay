/* =========================================================
   Mufradat Game — script.js
   Berisi: data kosakata, navigasi, mode malam,
   dan logika tiga permainan (A, B, C).
   ========================================================= */

/* ---------- 1. DATA ---------- */

// Jumlah soal per permainan
const QUESTION_COUNT = 6;

const GAME_TITLES = {
  A: 'Permainan A — Tebak Gambar',
  B: 'Permainan B — Cocokkan Arti',
  C: 'Permainan C — Susun Huruf'
};

/*
  Sumber kosakata: glosarium buku "Bahasa Arab MA Kelas X" (Kemenag RI, 2020),
  halaman buku 90, 91, 93, 95 — dicek secara visual.
  Pengelompokan per bab berdasarkan tema, perlu diverifikasi dengan teks bab.
*/
const CHAPTERS = [
  {
    id: 'bab1',
    label: 'Bab 1',
    theme: 'Salam dan Perkenalan',
    arabTitle: 'التَّحِيَّاتُ وَالتَّعَارُفُ',
    description: 'Ungkapan salam dan kosakata dasar untuk memperkenalkan diri.',
    words: [
      { arab: 'أَهْلًا', arti: 'Selamat datang', emoji: '👋' },
      { arab: 'تَعَارُفٌ', arti: 'Kenalan', emoji: '🤝' },
      { arab: 'اِسْمٌ', arti: 'Nama', emoji: '🏷️' },
      { arab: 'صَبَاحٌ', arti: 'Pagi', emoji: '🌅' },
      { arab: 'صَدِيقٌ', arti: 'Teman', emoji: '🧑‍🤝‍🧑' },
      { arab: 'تَحَدَّثَ', arti: 'Berbicara', emoji: '💬' }
    ]
  },
  {
    id: 'bab2',
    label: 'Bab 2',
    theme: 'Keluarga dan Rumah',
    arabTitle: 'الْأُسْرَةُ وَالْبَيْتُ',
    description: 'Kosakata tentang anggota keluarga dan bagian-bagian rumah.',
    words: [
      { arab: 'أَبٌ', arti: 'Ayah', emoji: '👨' },
      { arab: 'أُمٌّ', arti: 'Ibu', emoji: '👩' },
      { arab: 'أَخٌ', arti: 'Saudara (laki-laki)', emoji: '👦' },
      { arab: 'أُخْتٌ', arti: 'Saudara (perempuan)', emoji: '👧' },
      { arab: 'أُسْرَةٌ', arti: 'Keluarga', emoji: '👨‍👩‍👧' },
      { arab: 'بَيْتٌ', arti: 'Rumah', emoji: '🏠' },
      { arab: 'مَطْبَخٌ', arti: 'Dapur', emoji: '🍳' },
      { arab: 'بُسْتَانٌ', arti: 'Kebun', emoji: '🌳' }
    ]
  },
  {
    id: 'bab3',
    label: 'Bab 3',
    theme: 'Madrasah dan Lingkungan Sekitarnya',
    arabTitle: 'الْمَدْرَسَةُ وَالْبِيئَةُ الْمُحِيْطَةُ بِهَا',
    description: 'Kosakata tentang madrasah dan lingkungan di sekitarnya.',
    words: [
      { arab: 'مَدْرَسَةٌ', arti: 'Sekolah', emoji: '🏫' },
      { arab: 'صَفٌّ', arti: 'Kelas', emoji: '🚪' },
      { arab: 'سَبُّورَةٌ', arti: 'Papan tulis', emoji: '📋' },
      { arab: 'كُرْسِيٌّ', arti: 'Kursi', emoji: '🪑' },
      { arab: 'مَكْتَبَةٌ', arti: 'Perpustakaan', emoji: '📚' },
      { arab: 'مَسْجِدٌ', arti: 'Masjid', emoji: '🕌' },
      { arab: 'مَدِينَةٌ', arti: 'Kota', emoji: '🏙️' },
      { arab: 'سَاحَةٌ', arti: 'Halaman', emoji: '🏞️' },
      { arab: 'مَقْصَفٌ', arti: 'Kantin', emoji: '🥤' },
      { arab: 'مُدَرِّسٌ', arti: 'Bapak guru', emoji: '👨‍🏫' },
      { arab: 'كُرَّاسَةٌ', arti: 'Buku tulis', emoji: '📓' }
    ]
  }
];

/* ---------- 2. STATE (data yang berubah saat dipakai) ---------- */

const app = {
  chapterId: 'bab1',   // bab yang sedang dipilih
  gameKey: null,       // 'A', 'B', atau 'C'
  game: null,          // data permainan yang sedang berjalan
  lastResult: null     // hasil permainan terakhir
};

/* ---------- 3. FUNGSI BANTU ---------- */

function $(selector) {
  return document.querySelector(selector);
}

function getChapter(chapterId) {
  return CHAPTERS.find((chapter) => chapter.id === chapterId) || CHAPTERS[0];
}

// Mengacak urutan array (Fisher-Yates)
function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Mengambil sejumlah item acak
function pickRandom(list, count) {
  return shuffle(list).slice(0, count);
}

// Memecah kata Arab menjadi "huruf + harakat" (satu huruf utuh per elemen)
function splitArabicLetters(word) {
  return word.match(/[\s\S][\u064B-\u065F\u0670]*/g) || [];
}

// Membuat ubin huruf yang sudah diacak untuk Permainan C
function makeLetterTiles(word) {
  const letters = splitArabicLetters(word).map((text, id) => ({ text, id }));
  let tiles = shuffle(letters);
  let attempts = 0;
  // Pastikan urutan acak tidak sama dengan urutan asli
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
  if (!feedback) {
    return '<div class="feedback feedback-empty" aria-live="polite"></div>';
  }
  return `<div class="feedback feedback-${feedback.type}" role="status">${feedback.text}</div>`;
}

function currentQuestion() {
  return app.game.questions[app.game.index];
}

/* ---------- 4. NAVIGASI & TAMPILAN ---------- */

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
  const menu = $('#mobile-menu');
  const isHidden = menu.classList.toggle('hidden');
  $('#menu-toggle').setAttribute('aria-expanded', String(!isHidden));
}

// Menampilkan satu "halaman" dan menyembunyikan yang lain
function showView(viewName, navName = viewName) {
  document.querySelectorAll('.view').forEach((view) => view.classList.add('hidden'));

  const view = document.getElementById('view-' + viewName);
  if (!view) return;

  view.classList.remove('hidden');
  view.classList.remove('view-enter');
  void view.offsetWidth; // memulai ulang animasi
  view.classList.add('view-enter');

  setActiveNav(navName);
  closeMobileMenu();
  window.scrollTo({ top: 0, behavior: 'auto' });
  refreshIcons();
}

/* ---------- 5. MODE MALAM ---------- */

function applyTheme(isDark) {
  document.documentElement.classList.toggle('dark', isDark);
  $('#theme-toggle').innerHTML = `<i data-lucide="${isDark ? 'sun' : 'moon'}"></i>`;
  refreshIcons();
}

function initTheme() {
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem('mufradat-theme');
  } catch (error) {
    savedTheme = null; // jika penyimpanan browser diblokir, lanjut tanpa error
  }
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme ? savedTheme === 'dark' : prefersDark);
}

function toggleTheme() {
  const isDark = !document.documentElement.classList.contains('dark');
  applyTheme(isDark);
  try {
    localStorage.setItem('mufradat-theme', isDark ? 'dark' : 'light');
  } catch (error) {
    // abaikan jika penyimpanan tidak tersedia
  }
}

/* ---------- 6. HALAMAN MATERI ---------- */

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

      <p class="note">
        Sumber: glosarium buku Bahasa Arab MA Kelas X (halaman 90–95), dicek secara visual.
        Pengelompokan kosakata per bab berdasarkan tema dan <strong>perlu diverifikasi dengan teks bab</strong>.
      </p>
    </div>
  `;

  showView('detail', 'materi');
}

/* ---------- 7. HALAMAN PERMAINAN (PILIH BAB) ---------- */

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

/* ---------- 8. MULAI PERMAINAN ---------- */

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

// Menampilkan permainan yang sedang berjalan ke layar
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

/* ---------- 9. PERMAINAN A — TEBAK GAMBAR ---------- */

function createGameA(chapter) {
  const questions = pickRandom(chapter.words, QUESTION_COUNT).map((word) => {
    // 3 pengecoh dari bab yang sama, lalu diacak bersama jawaban benar
    const distractors = shuffle(chapter.words.filter((item) => item.arab !== word.arab)).slice(0, 3);
    return { word, options: shuffle([word, ...distractors]) };
  });

  return {
    index: 0,
    questions,
    total: questions.length,
    correct: 0,
    answered: false,
    selected: null,
    feedback: null
  };
}

function renderGameA(game) {
  const question = game.questions[game.index];

  const optionsHtml = question.options.map((option, optionIndex) => {
    let stateClass = '';
    if (game.answered) {
      if (option.arab === question.word.arab) stateClass = 'is-correct';
      else if (optionIndex === game.selected) stateClass = 'is-wrong';
    }
    return `
      <button class="option-btn arab ${stateClass}" dir="rtl"
        data-action="answer-a" data-option="${optionIndex}"
        ${game.answered ? 'disabled' : ''}>${option.arab}</button>`;
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
  if (game.index >= game.total) {
    finishGame();
    return;
  }
  game.answered = false;
  game.selected = null;
  game.feedback = null;
  renderGame();
}

/* ---------- 10. PERMAINAN B — COCOKKAN ARTI ---------- */

function createGameB(chapter) {
  const pairs = pickRandom(chapter.words, QUESTION_COUNT).map((word, id) => ({ id, word }));

  return {
    pairs,
    leftItems: shuffle(pairs),    // kolom kosakata Arab
    rightItems: shuffle(pairs),   // kolom arti Indonesia
    selectedLeftId: null,
    matchedIds: [],
    wrongCounts: {},              // jumlah salah per pasangan
    wrongAttempts: 0,
    flashLeft: null,
    flashRight: null,
    correct: 0,                   // pasangan benar pada percobaan pertama
    total: pairs.length,
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
    const classes = [
      'match-btn',
      matched ? 'is-matched' : '',
      game.flashRight === pair.id ? 'is-wrong' : ''
    ].join(' ');
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
    // Pasangan benar
    if (!game.wrongCounts[pairId]) game.correct++;   // hanya dihitung jika benar di percobaan pertama
    game.matchedIds.push(pairId);
    game.selectedLeftId = null;
    game.feedback = { type: 'ok', text: 'Tepat! Pasangan benar.' };
    renderGame();
  } else {
    // Pasangan salah
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

/* ---------- 11. PERMAINAN C — SUSUN HURUF ---------- */

function createGameC(chapter) {
  const questions = pickRandom(chapter.words, QUESTION_COUNT).map((word) => ({
    word,
    tiles: makeLetterTiles(word.arab),
    picked: [],          // id huruf yang sudah dipilih, sesuai urutan
    checked: false,      // sudah pernah diperiksa?
    isCorrect: false     // sudah benar?
  }));

  return {
    index: 0,
    questions,
    total: questions.length,
    correct: 0,          // soal benar pada pemeriksaan pertama
    feedback: null
  };
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

  const hasPicked = question.picked.length > 0;

  return `
    <div class="game-panel">
      <p class="game-progress">Soal ${game.index + 1} dari ${game.total}</p>
      <p class="question-text">Susun huruf menjadi kosakata yang artinya:</p>
      <p class="question-meaning">${question.word.arti}</p>

      <div class="answer-slot" aria-label="Jawaban">${answerHtml}</div>

      <div class="letter-bank">${bankHtml}</div>

      ${feedbackHtml(game.feedback)}

      <div class="game-actions">
        <button class="btn btn-ghost" data-action="reset-c" ${hasPicked && !question.isCorrect ? '' : 'disabled'}><i data-lucide="rotate-ccw"></i> Ulangi</button>
        <button class="btn btn-primary" data-action="check-c" ${hasPicked && !question.isCorrect ? '' : 'disabled'}><i data-lucide="check"></i> Periksa</button>
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
  const question = currentQuestion();
  question.picked = [];
  app.game.feedback = null;
  renderGame();
}

function checkGameC() {
  const game = app.game;
  const question = currentQuestion();
  if (question.picked.length === 0 || question.isCorrect) return;

  // Gabungkan huruf yang dipilih sesuai urutan
  const typed = question.picked
    .map((id) => question.tiles.find((tile) => tile.id === id).text)
    .join('');
  const isRight = typed === question.word.arab;

  // Skor hanya dihitung pada pemeriksaan pertama
  if (!question.checked) {
    question.checked = true;
    if (isRight) game.correct++;
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
  if (game.index >= game.total) {
    finishGame();
    return;
  }
  game.feedback = null;
  renderGame();
}

/* ---------- 12. SELESAI & HASIL ---------- */

function finishGame() {
  const game = app.game;
  const percent = game.total ? Math.round((game.correct / game.total) * 100) : 0;
  const chapter = getChapter(app.chapterId);

  let note = '';
  if (app.gameKey === 'A') {
    note = 'Skor dihitung dari jawaban yang kamu pilih pada setiap soal.';
  } else if (app.gameKey === 'B') {
    note = `Pasangan dihitung benar jika tepat pada percobaan pertama. Percobaan salah: ${game.wrongAttempts} kali.`;
  } else if (app.gameKey === 'C') {
    note = 'Soal dihitung benar jika susunan hurufnya tepat pada pemeriksaan pertama.';
  }

  app.lastResult = {
    title: GAME_TITLES[app.gameKey],
    chapter: `${chapter.label} · ${chapter.theme}`,
    correct: game.correct,
    total: game.total,
    percent,
    note
  };

  renderResult();
  showView('hasil', 'permainan');
}

function renderResult() {
  const result = app.lastResult;
  $('#hasil-title').textContent = result.title;
  $('#hasil-chapter').textContent = result.chapter;
  $('#hasil-benar').textContent = result.correct;
  $('#hasil-soal').textContent = result.total;
  $('#hasil-skor').textContent = result.percent;
  $('#hasil-catatan').textContent = result.note;
}

/* ---------- 13. PENANGANAN KLIK (EVENT) ---------- */

function handleAction(action, data) {
  switch (action) {
    case 'answer-a':   answerGameA(Number(data.option)); break;
    case 'next-a':     nextGameA(); break;
    case 'pick-b-left':  pickLeftB(Number(data.id)); break;
    case 'pick-b-right': pickRightB(Number(data.id)); break;
    case 'finish-b':   finishGame(); break;
    case 'pick-c':     pickLetterC(Number(data.id)); break;
    case 'unpick-c':   unpickLetterC(Number(data.id)); break;
    case 'reset-c':    resetGameC(); break;
    case 'check-c':    checkGameC(); break;
    case 'next-c':     nextGameC(); break;
    case 'restart':    startGame(app.gameKey); break;
    default: break;
  }
}

function handleClick(event) {
  const element = event.target;

  const navButton = element.closest('[data-nav]');
  if (navButton) {
    showView(navButton.dataset.nav);
    return;
  }

  const detailButton = element.closest('[data-chapter-detail]');
  if (detailButton) {
    openChapterDetail(detailButton.dataset.chapterDetail);
    return;
  }

  const playButton = element.closest('[data-chapter-play]');
  if (playButton) {
    selectChapter(playButton.dataset.chapterPlay);
    showView('permainan');
    return;
  }

  const chipButton = element.closest('[data-select-chapter]');
  if (chipButton) {
    selectChapter(chipButton.dataset.selectChapter);
    return;
  }

  const gameButton = element.closest('[data-game-start]');
  if (gameButton) {
    startGame(gameButton.dataset.gameStart);
    return;
  }

  const actionButton = element.closest('[data-action]');
  if (actionButton && !actionButton.disabled) {
    handleAction(actionButton.dataset.action, actionButton.dataset);
  }
}

/* ---------- 14. INISIALISASI ---------- */

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