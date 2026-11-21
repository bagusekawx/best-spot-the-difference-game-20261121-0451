/* Spot the Difference — game logic. Two canvases show the same scene with a
   few differences; click them all before the clock runs out. */
(function () {
  'use strict';

  var W = 480;
  var H = 360;
  var cvA = document.getElementById('canvasA');
  var cvB = document.getElementById('canvasB');
  var ctxA = cvA.getContext('2d');
  var ctxB = cvB.getContext('2d');
  var roundLabel = document.getElementById('roundLabel');
  var foundLabel = document.getElementById('foundLabel');
  var scoreLabel = document.getElementById('scoreLabel');
  var timeLabel = document.getElementById('timeLabel');
  var sceneName = document.getElementById('sceneName');
  var hintBtn = document.getElementById('hintBtn');
  var muteBtn = document.getElementById('muteBtn');
  var pauseBtn = document.getElementById('pauseBtn');
  var overlay = document.getElementById('overlay');
  var overlayCard = document.getElementById('overlayCard');
  var timeStat = timeLabel.parentElement;

  var state = 'start'; // start | playing | roundEnd | gameOver | win
  var sceneIndex = 0;
  var found = [];
  var score = 0;
  var timeLeft = 0;
  var hints = 2;
  var muted = false;
  var paused = false;
  var missMarks = [];
  var hintPulse = null;
  var audio = null;
  var lastNow = 0;
  var lastHud = '';

  function scene() { return SCENES[sceneIndex]; }

  function fmtTime(s) {
    s = Math.max(0, Math.ceil(s));
    var m = Math.floor(s / 60);
    var r = s % 60;
    return m + ':' + (r < 10 ? '0' : '') + r;
  }

  function ensureAudio() {
    if (!audio) {
      try {
        var AC = window.AudioContext || window.webkitAudioContext;
        audio = AC ? new AC() : null;
      } catch (e) { audio = null; }
    }
    if (audio && audio.state === 'suspended') audio.resume();
  }

  function tone(freq, delay, dur, type, vol) {
    if (!audio || muted) return;
    try {
      var t = audio.currentTime + delay;
      var o = audio.createOscillator();
      var g = audio.createGain();
      o.type = type || 'sine';
      o.frequency.value = freq;
      g.gain.setValueAtTime(vol || 0.12, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g);
      g.connect(audio.destination);
      o.start(t);
      o.stop(t + dur + 0.02);
    } catch (e) { /* no audio, no problem */ }
  }

  function playFound() { tone(660, 0, 0.12); tone(880, 0.09, 0.2); }
  function playMiss() { tone(150, 0, 0.18, 'sawtooth', 0.05); }
  function playWin() { tone(523, 0, 0.14); tone(659, 0.12, 0.14); tone(784, 0.24, 0.14); tone(1046, 0.36, 0.3); }
  function playClick() { tone(440, 0, 0.06, 'sine', 0.05); }

  function updateHud() {
    var s = scene();
    var key = sceneIndex + '|' + found.length + '|' + score + '|' + fmtTime(timeLeft) + '|' + hints + '|' + muted + '|' + paused;
    if (key === lastHud) return;
    lastHud = key;
    roundLabel.textContent = (sceneIndex + 1) + ' / ' + SCENES.length;
    foundLabel.textContent = found.length + ' / ' + s.diffs.length;
    scoreLabel.textContent = String(score);
    timeLabel.textContent = fmtTime(timeLeft);
    sceneName.textContent = s.name;
    hintBtn.textContent = 'Hint (' + hints + ')';
    hintBtn.disabled = hints <= 0 || state !== 'playing';
    muteBtn.textContent = muted ? 'Sound: off' : 'Sound: on';
    pauseBtn.textContent = paused ? 'Resume' : 'Pause';
    pauseBtn.disabled = state !== 'playing';
    if (timeLeft <= 15 && state === 'playing') timeStat.classList.add('low');
    else timeStat.classList.remove('low');
  }

  function showOverlay(html) {
    overlayCard.innerHTML = html;
    overlay.classList.remove('hidden');
  }

  function hideOverlay() {
    overlay.classList.add('hidden');
    overlay.classList.remove('click-through');
  }

  function showStart() {
    state = 'start';
    showOverlay(
      '<h2>Spot the Difference</h2>' +
      '<p>Two pictures, a few sneaky differences. Find them all before the clock runs out.</p>' +
      '<ul>' +
      '<li>Click a difference on either picture to mark it.</li>' +
      '<li>3 rounds: a cozy room, a beach, a market stall.</li>' +
      '<li>Wrong clicks cost 3 seconds. Hints cost 50 points.</li>' +
      '</ul>' +
      '<div class="row"><button type="button" id="startBtn">Start playing</button></div>'
    );
    document.getElementById('startBtn').addEventListener('click', function () {
      ensureAudio();
      playClick();
      startGame();
    });
  }

  function startGame() {
    sceneIndex = 0;
    score = 0;
    startRound();
  }

  function startRound() {
    found = [];
    hints = 2;
    paused = false;
    missMarks = [];
    hintPulse = null;
    timeLeft = scene().time;
    state = 'playing';
    hideOverlay();
    updateHud();
  }

  function endRound() {
    var bonus = Math.round(timeLeft) * 5;
    score += bonus;
    playWin();
    if (sceneIndex + 1 >= SCENES.length) {
      state = 'win';
      showOverlay(
        '<h2>You found them all!</h2>' +
        '<p class="big">Final score: ' + score + '</p>' +
        '<p>Every difference in all three worlds, found.</p>' +
        '<div class="row"><button type="button" id="againBtn">Play again</button></div>'
      );
      document.getElementById('againBtn').addEventListener('click', function () {
        ensureAudio();
        playClick();
        startGame();
      });
      return;
    }
    state = 'roundEnd';
    showOverlay(
      '<h2>Round clear!</h2>' +
      '<p class="big">Time bonus: +' + bonus + '</p>' +
      '<p>Score so far: ' + score + '. Next up: ' + SCENES[sceneIndex + 1].name + '.</p>' +
      '<div class="row"><button type="button" id="nextBtn">Next round</button></div>'
    );
    document.getElementById('nextBtn').addEventListener('click', function () {
      ensureAudio();
      playClick();
      sceneIndex += 1;
      startRound();
    });
  }

  function endGame() {
    state = 'gameOver';
    playMiss();
    showOverlay(
      '<h2>Time\'s up!</h2>' +
      '<p class="big">Score: ' + score + '</p>' +
      '<p>You cleared ' + sceneIndex + ' of ' + SCENES.length + ' rounds.</p>' +
      '<div class="row"><button type="button" id="againBtn">Try again</button></div>'
    );
    document.getElementById('againBtn').addEventListener('click', function () {
      ensureAudio();
      playClick();
      startGame();
    });
  }

  function drawInto(ctx, variant, now) {
    var s = scene();
    ctx.clearRect(0, 0, W, H);
    s.draw(ctx, variant);
    // found markers
    ctx.strokeStyle = '#e63946';
    ctx.lineWidth = 3;
    for (var i = 0; i < found.length; i++) {
      var d = s.diffs[found[i]];
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r + 4, 0, Math.PI * 2);
      ctx.stroke();
    }
    // hint pulse
    if (hintPulse && now < hintPulse.until) {
      var d2 = s.diffs[hintPulse.index];
      var p = (hintPulse.until - now) / 2000;
      var pr = d2.r + 6 + Math.sin(now / 120) * 3;
      ctx.strokeStyle = 'rgba(232, 178, 58, ' + (0.4 + 0.6 * p) + ')';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.arc(d2.x, d2.y, pr, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    // miss marks, fading over 600ms
    for (var j = missMarks.length - 1; j >= 0; j--) {
      var age = now - missMarks[j].t;
      if (age > 600) { missMarks.splice(j, 1); continue; }
      var a = 1 - age / 600;
      ctx.strokeStyle = 'rgba(230, 57, 70, ' + a + ')';
      ctx.lineWidth = 3;
      var mx = missMarks[j].x, my = missMarks[j].y;
      ctx.beginPath();
      ctx.moveTo(mx - 8, my - 8); ctx.lineTo(mx + 8, my + 8);
      ctx.moveTo(mx + 8, my - 8); ctx.lineTo(mx - 8, my + 8);
      ctx.stroke();
    }
  }

  function render(now) {
    drawInto(ctxA, 0, now);
    drawInto(ctxB, 1, now);
  }

  function onCanvasClick(ev) {
    if (state !== 'playing' || paused) return;
    ensureAudio();
    var cv = ev.currentTarget;
    var rect = cv.getBoundingClientRect();
    var x = (ev.clientX - rect.left) * (W / rect.width);
    var y = (ev.clientY - rect.top) * (H / rect.height);
    var s = scene();
    for (var i = 0; i < s.diffs.length; i++) {
      if (found.indexOf(i) !== -1) continue;
      var d = s.diffs[i];
      var dx = x - d.x, dy = y - d.y;
      if (dx * dx + dy * dy <= d.r * d.r) {
        found.push(i);
        score += 100;
        playFound();
        updateHud();
        if (found.length === s.diffs.length) endRound();
        return;
      }
    }
    missMarks.push({ x: x, y: y, t: performance.now() });
    timeLeft = Math.max(0, timeLeft - 3);
    playMiss();
    updateHud();
  }

  function useHint() {
    if (state !== 'playing' || paused || hints <= 0) return;
    var s = scene();
    var remaining = [];
    for (var i = 0; i < s.diffs.length; i++) {
      if (found.indexOf(i) === -1) remaining.push(i);
    }
    if (!remaining.length) return;
    hints -= 1;
    score = Math.max(0, score - 50);
    hintPulse = { index: remaining[Math.floor(Math.random() * remaining.length)], until: performance.now() + 2000 };
    playClick();
    updateHud();
  }

  function togglePause() {
    if (state !== 'playing') return;
    paused = !paused;
    if (paused) {
      showOverlay(
        '<h2>Paused</h2>' +
        '<p>The clock is frozen. Take a breath.</p>' +
        '<div class="row"><button type="button" id="resumeBtn">Resume</button></div>'
      );
      overlay.classList.add('click-through');
      document.getElementById('resumeBtn').addEventListener('click', function () {
        playClick();
        togglePause();
      });
    } else {
      hideOverlay();
    }
    updateHud();
  }

  cvA.addEventListener('click', onCanvasClick);
  cvB.addEventListener('click', onCanvasClick);
  hintBtn.addEventListener('click', useHint);
  pauseBtn.addEventListener('click', function () {
    ensureAudio();
    playClick();
    togglePause();
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'p' || ev.key === 'P') togglePause();
  });
  muteBtn.addEventListener('click', function () {
    muted = !muted;
    updateHud();
  });

  function frame(now) {
    if (!lastNow) lastNow = now;
    var dt = Math.min(0.25, (now - lastNow) / 1000);
    lastNow = now;
    if (state === 'playing' && !paused) {
      timeLeft -= dt;
      if (timeLeft <= 0) {
        timeLeft = 0;
        endGame();
      }
    }
    render(now);
    updateHud();
    requestAnimationFrame(frame);
  }

  showStart();
  updateHud();
  requestAnimationFrame(frame);
})();
