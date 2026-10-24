// Helpers
const $  = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const isMobile = () => matchMedia('(max-width: 760px)').matches;
const escapeHtml = (text) => text.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

// Sprites
const PALETTE = {
  o: '#655B79', w: '#F6EFFF', W: '#F6EFFF', g: '#C6C5CD',
  p: '#E45CB7', P: '#F4C7DD', k: '#261342', L: '#C6A5F2'
};

const SPRITES = {
  folder : ['...ooo..........', '..owPPooooooo...', '.oPPPPPkkkkkko..', '.opkkkkkkkkkkko.', '.opLLLLLLLLLLLo.', '.opLLLLLLLLLLLo.', '.opLLLLLLLLLLLo.', '.opLLLLLLLLLLLo.', '.opLLLLLLLLLLLo.', '.opLLLLLLLLLLLo.', '.oppLLLLLLLLLLo.', '..oooooooooooo..'],
  bin    : ['.....oo.....', '...oowPoo...', '..okwLLgko..', '.oLwPPPPppo.', '.okoogogoko.', '..owPogLgo..', '..owPogLpo..', '..oLPogLpo..', '..okPogLko..', '..okPogLko..', '...oooooo...', '....oooo....'],
  dl:     ['.....oooo.....', '.....oLLo.....', '.....oLLo.....', '.....oLLo.....', '..ooooLLoooo..', '...oLLLLLLo...', '....oLLLLo....', '.....oLLo.....', '......oo......', 'oooooooooooooo', 'oPPPPPPPPPPPPo', 'oooooooooooooo'],
  mail:   ['oooooooooooooooo', 'oWWWWWWWWWWWWWWo', 'ooWWWWWWWWWWWWoo', 'oWooWWWWWWWWooWo', 'oWWWooWWWWooWWWo', 'oWWWWWooooWWWWWo', 'oWWWWWWWWWWWWWWo', 'oWWWWWWWWWWWWWWo', 'oooooooooooooooo'],
  cat:    ['.pp........pp.', 'ppPp......pPpp', 'pPPpppppppPPpp', 'pppppppppppppp', 'ppkkppppppkkpp', 'ppkkppppppkkpp', 'ppppppkkpppppp', 'pppppkkkkppppp', 'pppppppppppppp', '.pppppppppppp.', '..pppppppppp..', '...pppppppp...'],
  dog:    ['.oo......oo.', 'owwo....owwo', 'owwwwwwwwwwo', 'owkwwwwwwkwo', 'owwwwooowwwo', '.owwwokowwo.', '..owwwwwwo..', '..owwwwwwo..', '.owwwwwwwwo.', '.owwwwwwwwo.', '.owowwwwowo.', '.oo.oo.oo.o.'],
  ghost:  ['...oooooo...', '..owwwwwwo..', '.owwwwwwwwo.', '.owwkwwkwwo.', '.owwwwwwwwo.', '.owwwwwwwwo.', '.owwwwwwwwo.', '.owwwwwwwwo.', '.owwwwwwwwo.', '.owowwowwowo', '.oo.oo.oo.o.'],
  heart:  ['.pp.pp.', 'ppPpppp', 'ppppppp', '.ppppp.', '..ppp..', '...p...'],
  logo:   ['kkkkkkkkkkkk', 'kppkkkkkkppk', 'kkppkkkkppkk', 'kkkppkkppkkk', 'kkkkppppkkkk', 'kkkkkppkkkkk', 'kkkkkppkkkkk', 'kkkkkkkkkkkk'],
  ghostBlink: ['...oooooo...', '..owwwwwwo..', '.owwwwwwwwo.', '.owwowwowwo.', '.owwwwwwwwo.', '.owwwwwwwwo.', '.owwwwwwwwo.', '.owwwwwwwwo.', '.owwwwwwwwo.', '.owowwowwowo', '.oo.oo.oo.o.'],
  desktop: ['oooooooooooo', 'oLLLLLLLLLLo', 'oLLLLLLLLLLo', 'oLLLLLLLLLLo', 'oLLLLLLLLLLo', 'oooooooooooo', '....oooo....', '..oooooooo..'],
  star:   ['....w....', '...wPw...', 'wwwwPwwww', '.wPPPPPw.', '..wPPPw..', '..wP.Pw..', '..w...w..'],
  cloud:  ['.......wwww.........', '....wwwwPPPwww......', '..wwPPPPPPPPPPww....', '.wPPPPPPPPPPPPPPww..', 'wPPPPPPPPPPPPPPPPPww', '.wwwwwwwwwwwwwwwwww.'],
  planet: ['....oooo....', '..ooLLLLoo..', '.oLLPPLLLLo.', 'owwwwwwwwwwo', '.oLLLLLLLLo.', '..ooLLLLoo..', '....oooo....'],
  butterfly: ['LL.....LL', 'LLL...LLL', 'LLLpkpLLL', '.LLLkLLL.', 'ppp.k.ppp', '.pp.k.pp.', '....k....'],
  cassette: ['oooooooooooooo', 'oPPPPPPPPPPPPo', 'oPLLLLLLLLLLPo', 'oPLwwwwwwwwLPo', 'oPLLLLLLLLLLPo', 'oPPkkPPPPkkPPo', 'oPPkkPPPPkkPPo', 'oPPPPPPPPPPPPo', 'oooooooooooooo']
};

const spriteCache = {};

function spriteUrl(name) {
  if (spriteCache[name]) return spriteCache[name];
  const rows = SPRITES[name];
  const canvas = document.createElement('canvas');
  canvas.width = rows[0].length;
  canvas.height = rows.length;
  const ctx = canvas.getContext('2d');
  rows.forEach((row, y) => [...row].forEach((char, x) => {
    if (!PALETTE[char]) return;
    ctx.fillStyle = PALETTE[char];
    ctx.fillRect(x, y, 1, 1);
  }));
  return (spriteCache[name] = `url(${canvas.toDataURL()})`);
}

function paintSprites(root) {
  $$('[data-sprite]', root).forEach((el) => {
    el.style.backgroundImage = spriteUrl(el.dataset.sprite);
    if (!el.dataset.blink) return;
    el.style.setProperty('--sprite', spriteUrl(el.dataset.sprite));
    el.style.setProperty('--sprite-blink', spriteUrl(el.dataset.blink));
  });
}

$('#hearts').innerHTML = '<i class="pixel" data-sprite="heart"></i>'.repeat(12);
paintSprites(document);

const iconHtml = (name) => SPRITES[name] ? `<i class="pixel" data-sprite="${name}"></i>` : `<i class="icon icon--${name}"></i>`;

// Window manager
const windows = $$('.window');
const GEOMETRY = ['left', 'top', 'width', 'height'];
let topZ = 10;

const isShown = (win) => !win.classList.contains('is-minimized') && !win.classList.contains('is-closed');

function syncTaskbar() {
  windows.forEach((win) => {
    win.taskButton.hidden = win.classList.contains('is-closed');
    win.taskButton.classList.toggle('is-on', win.classList.contains('is-active'));
    win.taskButton.classList.toggle('is-min', win.classList.contains('is-minimized'));
  });
}

function focusWindow(win) {
  windows.forEach((other) => other.classList.remove('is-active'));
  win.classList.remove('is-minimized', 'is-closed');
  win.classList.add('is-active');
  win.style.zIndex = ++topZ;
  syncTaskbar();
}

function hideWindow(win, state) {
  win.classList.add(state);
  win.classList.remove('is-active');
  const next = windows.filter(isShown).sort((a, b) => b.style.zIndex - a.style.zIndex)[0];
  if (next) focusWindow(next); else syncTaskbar();
}

function showDesktop() {
  windows.forEach((win) => {
    win.classList.remove('is-active');
    if (!win.classList.contains('is-closed')) win.classList.add('is-minimized');
  });
  syncTaskbar();
}

function toggleMaximize(win) {
  if (win.classList.toggle('is-maximized')) {
    win.savedGeometry = GEOMETRY.map((prop) => win.style[prop]);
    GEOMETRY.forEach((prop) => { win.style[prop] = ''; });
  } else {
    GEOMETRY.forEach((prop, i) => { win.style[prop] = win.savedGeometry[i]; });
  }
}

function enableDrag(win) {
  const bar = $('.titlebar', win);
  bar.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button') || isMobile() || win.classList.contains('is-maximized')) return;
    event.preventDefault();
    const box = win.getBoundingClientRect();
    const dx = event.clientX - box.left;
    const dy = event.clientY - box.top;
    const desk = $('#desktop').getBoundingClientRect();
    bar.setPointerCapture(event.pointerId);

    const move = (e) => {
      win.style.left = Math.min(Math.max(e.clientX - dx, 60 - box.width), desk.width - 40) + 'px';
      win.style.top = Math.min(Math.max(e.clientY - dy, 0), desk.height - 22) + 'px';
    };
    bar.addEventListener('pointermove', move);
    bar.addEventListener('pointerup', () => bar.removeEventListener('pointermove', move), { once: true });
  });
}

const CONTROL_ICONS = {
  minimize: '<path d="M1 7h6v2H1z"/>',
  maximize: '<path class="ico-max" fill-rule="evenodd" d="M1 1h8v8H1zM2 3h6v5H2z"/><g class="ico-restore"><path fill-rule="evenodd" d="M4 1h5v5H4zM5 3h3v2H5z"/><path fill-rule="evenodd" d="M1 4h5v5H1zM2 6h3v2H2z"/></g>',
  close: '<path d="M1 1h2v2H1zM7 1h2v2H7zM3 3h2v2H3zM5 3h2v2H5zM3 5h2v2H3zM5 5h2v2H5zM1 7h2v2H1zM7 7h2v2H7z"/>'
};
const controlButton = (name, label) =>
  `<button class="btn btn--ctl" data-ctl="${name}" title="${label}" aria-label="${label}"><svg viewBox="0 0 10 10" shape-rendering="crispEdges" aria-hidden="true">${CONTROL_ICONS[name]}</svg></button>`;

function setUpWindow(win) {
  win.insertAdjacentHTML('afterbegin', `
    <div class="titlebar">
      <span class="titlebar__text">${win.dataset.title}</span>
      ${controlButton('minimize', 'Minimize')}${controlButton('maximize', 'Maximize / restore')}${controlButton('close', 'Close')}
    </div>`);

  const task = document.createElement('button');
  task.className = 'btn taskbar__task';
  task.title = win.dataset.title;
  task.innerHTML = `${iconHtml(win.dataset.icon)}<span>${win.dataset.title}</span>`;
  paintSprites(task);
  task.addEventListener('click', () => {
    if (!isShown(win)) focusWindow(win);
    else if (win.classList.contains('is-active')) hideWindow(win, 'is-minimized');
    else focusWindow(win);
  });
  win.taskButton = task;
  $('#tasks').append(task);

  win.addEventListener('pointerdown', () => focusWindow(win));
  $('.titlebar', win).addEventListener('dblclick', (e) => { if (!e.target.closest('button')) toggleMaximize(win); });
  $$('[data-ctl]', win).forEach((button) => button.addEventListener('click', () => {
    const action = button.dataset.ctl;
    if (action === 'maximize') toggleMaximize(win);
    else hideWindow(win, action === 'minimize' ? 'is-minimized' : 'is-closed');
  }));
  enableDrag(win);
}

windows.forEach(setUpWindow);

// Desktop icons and start menu
const openApp = (id) => focusWindow($('#' + id));
const startMenu = $('#start-menu');
const startButton = $('#start-button');

function setStartMenu(open) {
  startMenu.classList.toggle('is-open', open);
  startButton.classList.toggle('is-on', open);
}

$$('.desk-icon').forEach((icon) => {
  icon.addEventListener('click', () => {
    $$('.desk-icon').forEach((other) => other.classList.toggle('is-selected', other === icon));
  });
  icon.addEventListener('dblclick', () => openApp(icon.dataset.open));
  icon.addEventListener('keydown', (e) => { if (e.key === 'Enter') openApp(icon.dataset.open); });
});

$('#desktop').addEventListener('pointerdown', (e) => {
  if (!e.target.closest('.desk-icon')) $$('.desk-icon').forEach((icon) => icon.classList.remove('is-selected'));
});

startButton.addEventListener('click', (e) => { e.stopPropagation(); setStartMenu(!startMenu.classList.contains('is-open')); });
document.addEventListener('click', (e) => { if (!e.target.closest('#start-menu, #start-button')) setStartMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setStartMenu(false); });

startMenu.addEventListener('click', (e) => {
  const item = e.target.closest('button');
  if (!item) return;
  setStartMenu(false);
  if (item.dataset.open) openApp(item.dataset.open);
  else if (item.dataset.action === 'show-desktop') showDesktop();
  else if (item.dataset.action === 'restart') location.reload();
});

// Clock
function updateClock() {
  $('#clock').textContent = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}
updateClock();
setInterval(updateClock, 5000);

$('#show-desktop').addEventListener('click', showDesktop);
$('#tray-mail').addEventListener('click', () => openApp('messenger'));

// Terminal
const screen = $('#terminal-screen');
const row = $('#terminal-row');
const input = $('#terminal-input');
const REPLIES = ['[1]: Then guess again!<', '[2]: Moon. It’s a big moon.', '[1]: Wait here, brb.<', '[2]: ...ok. Sparkly.'];
let replyIndex = 0;

function printLine(text, className = '') {
  const line = document.createElement('div');
  line.className = className;
  line.textContent = text;
  row.before(line);
}

screen.addEventListener('click', () => input.focus());
input.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const command = input.value.trim();
  input.value = '';
  if (!command) return;

  printLine(`[3]: ${command}`);
  if (command === 'clear') {
    $$('#terminal-screen > div:not(#terminal-row), #terminal-screen > hr').forEach((node) => node.remove());
  } else if (command === 'help') {
    printLine('commands: help, clear, date, or just say something', 'terminal__who');
  } else if (command === 'date') {
    printLine(new Date().toDateString());
  } else {
    printLine(REPLIES[replyIndex++ % REPLIES.length]);
  }
  screen.scrollTop = screen.scrollHeight;
});

// Messenger
const CONTACTS = {
  sparkles: {
    log: [['sparkles', 'g00d m0rn1ng sl33py c4t >:3'], ['sparkles', 'th3 m00n w4s s0 b1g l4st n1ght'], ['sparkles', 'l3t m3 kn0w wh3n u r34dy 4 t34 xD'], ['sparkles', 'w4k3 up w4k3 up w4k3 up!!']],
    replies: ['xD ok ok', 'hehe 1 s3c...', '>:3 c0m1ng']
  },
  skrepka: {
    log: [['skrepka', 'mrrp. i sat on your keyboard again.'], ['skrepka', 'fixed it. maybe. dfghjkl'], ['skrepka', 'dinner at 7?? i’m a cat so yes']],
    replies: ['mrrp.', '*stares at you*', 'feed me.']
  },
  moth: {
    log: [['moth', 'found a new wallpaper pack :)'], ['moth', 'purple clouds, very dreamy'], ['moth', 'sending it over soon']],
    replies: ['flutter flutter', 'lights on or off?', 'brb, lamp']
  }
};
const contactNames = Object.keys(CONTACTS);
const messengerLog = $('#messenger-log');
let currentContact = 'sparkles';

function renderContact(name) {
  currentContact = name;
  $$('#messenger [data-contact]').forEach((el) => el.classList.toggle('is-on', el.dataset.contact === name));
  messengerLog.innerHTML = CONTACTS[name].log.map(([author, text]) => {
    if (author === 'system') return `<div class="messenger__note">${escapeHtml(text)}</div>`;
    const nameClass = author === 'sanush' ? 'message__name message__name--me' : 'message__name';
    return `<div class="message"><i class="pixel" data-sprite="ghost"></i><div><div class="${nameClass}">${author}</div>${escapeHtml(text)}</div></div>`;
  }).join('');
  paintSprites(messengerLog);
  messengerLog.scrollTop = messengerLog.scrollHeight;
}

function sendMessage(text) {
  const contact = currentContact;
  CONTACTS[contact].log.push(['sanush', text]);
  renderContact(contact);
  setTimeout(() => {
    const replies = CONTACTS[contact].replies;
    CONTACTS[contact].log.push([contact, replies[Math.floor(Math.random() * replies.length)]]);
    if (currentContact === contact) renderContact(contact);
    notifyIfAway(`${contact}: ${CONTACTS[contact].log.at(-1)[1]}`);
  }, 900);
}

$$('#messenger [data-contact]').forEach((el) => el.addEventListener('click', () => renderContact(el.dataset.contact)));

$$('#messenger [data-action]').forEach((el) => el.addEventListener('click', () => {
  if (el.dataset.action === 'back') {
    renderContact(contactNames[(contactNames.indexOf(currentContact) + contactNames.length - 1) % contactNames.length]);
  } else {
    CONTACTS[currentContact].log.push(['system', `-- profile: ${currentContact} · status: online · mood: sparkly --`]);
    renderContact(currentContact);
  }
}));

$('#messenger-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const field = $('#messenger-input');
  const text = field.value.trim();
  field.value = '';
  if (text) sendMessage(text);
});

renderContact('sparkles');

// Todo note
const todoBoxes = $$('#todo input');
function updateTodoCount() {
  const done = todoBoxes.filter((box) => box.checked).length;
  $('#todo-count').textContent = `${done}/${todoBoxes.length} done`;
  $('#todo-bar').style.width = `${(done / todoBoxes.length) * 100}%`;
}
todoBoxes.forEach((box) => box.addEventListener('change', updateTodoCount));
updateTodoCount();

// Notifications
function notify(text) {
  $('.toast')?.remove();
  const toast = document.createElement('button');
  toast.className = 'toast';
  toast.innerHTML = `<i class="pixel" data-sprite="mail"></i><span>${escapeHtml(text)}</span>`;
  paintSprites(toast);
  toast.addEventListener('click', () => { openApp('messenger'); toast.remove(); });
  document.body.append(toast);
  setTimeout(() => toast.remove(), 5000);
}

function notifyIfAway(text) {
  if (!$('#messenger').classList.contains('is-active')) notify(text);
}

setTimeout(() => {
  CONTACTS.sparkles.log.push(['sparkles', 'psst. look at the moon.']);
  if (currentContact === 'sparkles') renderContact('sparkles');
  notifyIfAway('sparkles: psst. look at the moon.');
}, 25000);

// Atmosphere
const rand = (min, max) => min + Math.random() * (max - min);

const STARS = [[6, 7], [15, 18], [26, 4], [47, 5], [55, 3], [72, 14], [88, 9], [94, 21], [38, 24, true], [63, 20, true], [10, 30, true]];
$('#sky').append(...STARS.map(([x, y, sparkle]) => {
  const star = document.createElement('i');
  star.style.cssText = `left:${x}%; top:${y}%; --dur:${rand(sparkle ? 7 : 2.5, sparkle ? 12 : 5).toFixed(1)}s; --start:${-rand(0, 8).toFixed(1)}s`;
  star.classList.toggle('is-sparkle', Boolean(sparkle));
  return star;
}));

function scheduleShootingStar() {
  setTimeout(() => {
    const star = $('.shooting');
    star.style.left = `${rand(55, 95)}%`;
    star.style.top = `${rand(3, 20)}%`;
    star.classList.remove('is-flying');
    void star.offsetWidth;
    star.classList.add('is-flying');
    scheduleShootingStar();
  }, rand(12000, 30000));
}
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) scheduleShootingStar();

$$('.critter, .deco').forEach((el) => el.style.setProperty('--delay', `${-rand(0, 30).toFixed(1)}s`));

// Vesper tunes
const TUNES_PLAYLIST = [
  { title: 'Pixel Lullaby', artist: 'vesper', src: 'assets/audio/pixel-lullaby.wav' }
];

const tunes = { audio: $('#tunes-audio'), seek: $('#tunes-seek'), playButton: $('#tunes-play'), index: -1 };

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
}
const setTunesNote = (text) => { $('#tunes-note').textContent = text; };

function renderTunesList() {
  const list = $('#tunes-list');
  if (!TUNES_PLAYLIST.length) {
    list.innerHTML = '<li class="player__empty">No tracks yet. Put audio files in assets/audio/ and add them to TUNES_PLAYLIST in script.js.</li>';
    return;
  }
  list.innerHTML = TUNES_PLAYLIST.map((track, i) =>
    `<li><button class="player__track" data-track="${i}"><span>${String(i + 1).padStart(2, '0')}</span><span>${escapeHtml(track.title)}</span></button></li>`).join('');
}

function loadTrack(index, shouldPlay = false) {
  const track = TUNES_PLAYLIST[index];
  if (!track) return;
  tunes.index = index;
  tunes.audio.src = track.src;
  $('#tunes-title').textContent = track.title;
  $('#tunes-artist').textContent = track.artist || 'unknown artist';
  $('#tunes-current').textContent = '0:00';
  $('#tunes-total').textContent = '0:00';
  tunes.seek.value = 0;
  tunes.seek.disabled = false;
  setTunesNote('');
  const art = $('#tunes-art');
  art.classList.toggle('has-art', Boolean(track.art));
  art.style.backgroundImage = track.art ? `url("${track.art}")` : '';
  $$('.player__track').forEach((button) => button.classList.toggle('is-current', Number(button.dataset.track) === index));
  if (shouldPlay) playTunes();
}

function playTunes() {
  if (tunes.index < 0) { setTunesNote('Nothing to play yet.'); return; }
  tunes.audio.play().catch(() => setTunesNote('Couldn’t play this file.'));
}

function stepTrack(delta) {
  if (!TUNES_PLAYLIST.length) return;
  loadTrack((tunes.index + delta + TUNES_PLAYLIST.length) % TUNES_PLAYLIST.length, !tunes.audio.paused);
}

tunes.audio.addEventListener('loadedmetadata', () => { $('#tunes-total').textContent = formatTime(tunes.audio.duration); });
tunes.audio.addEventListener('timeupdate', () => {
  $('#tunes-current').textContent = formatTime(tunes.audio.currentTime);
  if (document.activeElement !== tunes.seek && tunes.audio.duration) tunes.seek.value = (tunes.audio.currentTime / tunes.audio.duration) * 1000;
});
tunes.audio.addEventListener('play', () => { tunes.playButton.textContent = 'pause'; });
tunes.audio.addEventListener('pause', () => { tunes.playButton.textContent = 'play'; });
tunes.audio.addEventListener('ended', () => {
  if (tunes.index < TUNES_PLAYLIST.length - 1) loadTrack(tunes.index + 1, true);
  else { tunes.seek.value = 0; tunes.audio.currentTime = 0; }
});
tunes.audio.addEventListener('error', () => {
  tunes.playButton.textContent = 'play';
  setTunesNote('Missing or unsupported audio file.');
});

tunes.seek.addEventListener('input', () => {
  if (tunes.audio.duration) tunes.audio.currentTime = (tunes.seek.value / 1000) * tunes.audio.duration;
});
$('#tunes-volume').addEventListener('input', (e) => { tunes.audio.volume = e.target.value / 100; });
$('#tunes-list-toggle').addEventListener('click', (e) => {
  const list = $('#tunes-list');
  list.hidden = !list.hidden;
  e.currentTarget.setAttribute('aria-expanded', String(!list.hidden));
});
$('#tunes').addEventListener('click', (e) => {
  const track = e.target.closest('[data-track]');
  const control = e.target.closest('[data-tunes]');
  if (track) loadTrack(Number(track.dataset.track), true);
  else if (control?.dataset.tunes === 'play') (tunes.audio.paused ? playTunes() : tunes.audio.pause());
  else if (control?.dataset.tunes === 'prev') stepTrack(-1);
  else if (control?.dataset.tunes === 'next') stepTrack(1);
});

tunes.audio.volume = 0.6;
renderTunesList();
if (TUNES_PLAYLIST.length) loadTrack(0);

// Startup
['terminal', 'todo', 'room', 'sprkls', 'messenger'].forEach(openApp);
if (isMobile()) showDesktop();
