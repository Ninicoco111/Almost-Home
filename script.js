const audio = document.getElementById('audio');
const seek = document.getElementById('seek');
const play = document.getElementById('play');
const playIcon = document.getElementById('playIcon');
const playText = document.getElementById('playText');
const mute = document.getElementById('mute');
const volume = document.getElementById('volume');
const time = document.getElementById('time');
const status = document.getElementById('status');
const note = document.getElementById('audioNote');
const hero = document.querySelector('.hero');
const images = [...document.querySelectorAll('.scene-image')];
const cards = [...document.querySelectorAll('.chapter-card')];
const scenes = [
    { at: 0, label: '01 / THE DESCENT', title: 'Almost <em>Home.</em>', text: 'Sometimes, home is not a place you see.<br>It\'s a sound you recognize.', detail: 'SOMEWHERE ABOVE THE CLOUDS' },
    { at: 12, label: '02 / TOUCHDOWN', title: 'We <em>landed.</em>', text: 'The wheels touch the ground.<br>Everything suddenly feels closer.', detail: 'THE SOUND OF ARRIVAL' },
    { at: 34, label: '03 / ARRIVALS', title: 'So <em>familiar.</em>', text: 'Footsteps, voices, rolling suitcases.<br>The airport begins to sound like home.', detail: 'ARRIVALS / BEIJING' },
    { at: 52, label: '04 / WELCOME HOME', title: '欢迎<em>回家.</em>', text: 'A familiar language fills the air.<br>After all this time, I am almost home.', detail: 'THE JOURNEY HOME' }
];
let active = -1; let touched = false; let touchdownPlayed = false;
const format = s => { s = Math.floor(Math.max(0, s) || 0); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0') };
const duration = () => Number.isFinite(audio.duration) ? audio.duration : 73;
function updateScene(t) { let i = 0; for (let n = 0; n < scenes.length; n++) { if (t >= scenes[n].at) i = n } if (i === active) return; active = i; images.forEach((im, n) => im.classList.toggle('active', n === i)); cards.forEach((c, n) => c.classList.toggle('selected', n === i)); const s = scenes[i]; document.getElementById('sceneLabel').textContent = s.label; document.getElementById('heroTitle').innerHTML = s.title; document.getElementById('heroText').innerHTML = s.text; document.getElementById('sceneDetail').textContent = s.detail; document.getElementById('sceneCounter').textContent = String(i + 1).padStart(2, '0') + ' — 04'; if (i === 1 && !touchdownPlayed && audio.currentTime > 11 && audio.currentTime < 14 && !audio.paused) { touchdownPlayed = true; hero.classList.add('touchdown'); setTimeout(() => hero.classList.remove('touchdown'), 420) } }
function update() { const t = audio.currentTime || 0; seek.max = duration(); if (!touched) seek.value = t; seek.style.background = `linear-gradient(to right,#c6a97d 0%,#c6a97d ${(100 * t / duration()).toFixed(2)}%,#52606b ${(100 * t / duration()).toFixed(2)}%,#52606b 100%)`; time.innerHTML = `${format(t)} <span class="muted">/ ${format(duration())}</span>`; updateScene(t) }
function updatePlay() { const running = !audio.paused && !audio.ended; playIcon.textContent = running ? 'Ⅱ' : '▶'; playText.textContent = running ? 'PAUSE THE JOURNEY' : audio.ended ? 'PLAY AGAIN' : 'BEGIN THE JOURNEY'; status.textContent = audio.ended ? 'JOURNEY COMPLETE' : running ? 'NOW PLAYING' : audio.currentTime > 0 ? 'PAUSED' : 'READY FOR ARRIVAL' }
play.addEventListener('click', async () => { if (audio.paused) { if (audio.ended) audio.currentTime = 0; try { await audio.play(); note.textContent = 'Listen closely. Every sound is a step closer to home.' } catch (e) { note.textContent = 'Audio could not play. Check that assets/audio/almost-home-v3.mp3 is present.' } } else audio.pause(); updatePlay() });
document.getElementById('restart').addEventListener('click', () => { audio.currentTime = 0; touchdownPlayed = false; update(); updatePlay() });
seek.addEventListener('input', () => { touched = true; audio.currentTime = Number(seek.value); updateScene(audio.currentTime); update(); }); seek.addEventListener('change', () => { touched = false; update() });
volume.addEventListener('input', () => { audio.volume = Number(volume.value); audio.muted = false; mute.textContent = '♫'; mute.setAttribute('aria-label', 'Mute audio') });
mute.addEventListener('click', () => { audio.muted = !audio.muted; mute.textContent = audio.muted ? '♪̸' : '♫'; mute.setAttribute('aria-label', audio.muted ? 'Unmute audio' : 'Mute audio') });
cards.forEach(c => c.addEventListener('click', () => { audio.currentTime = Number(c.dataset.seek); update(); document.querySelector('.hero').scrollIntoView({ behavior: 'smooth', block: 'start' }) }));
audio.addEventListener('loadedmetadata', update); audio.addEventListener('timeupdate', update); audio.addEventListener('play', updatePlay); audio.addEventListener('pause', updatePlay); audio.addEventListener('ended', () => { update(); updatePlay(); note.textContent = 'Welcome home. 欢迎回家。' }); audio.addEventListener('error', () => { note.textContent = 'Audio file missing. Please keep the assets folder beside index.html.' }); audio.volume = .85; update(); updatePlay();
