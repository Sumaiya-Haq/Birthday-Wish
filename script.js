/* ==========================================================================
   BIRTHDAY SURPRISE APP - PURE VANILLA JAVASCRIPT CONTROLLER
   ========================================================================== */

// Default Configuration & Demo Data
const DEFAULT_DATA = {
  bdayName: "Sophia",
  relationship: "Best Friend",
  senderName: "Alex",
  wishMessage: "Happy Birthday! 🎂✨ May your year ahead be filled with endless laughter, boundless joy, health, and amazing new adventures. You bring so much light and warmth into the world—never stop shining bright!",
  photoData: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23ff2a75'/><stop offset='50%' stop-color='%23a855f7'/><stop offset='100%' stop-color='%2306b6d4'/></linearGradient></defs><rect width='400' height='400' fill='url(%23g)'/><circle cx='200' cy='160' r='65' fill='white' opacity='0.9'/><path d='M100 340 C100 250 300 250 300 340 Z' fill='white' opacity='0.9'/><text x='200' y='380' font-size='24' font-family='sans-serif' font-weight='bold' fill='white' text-anchor='middle'>Happy Birthday! ✨</text></svg>"
};

// Preset Message Suggestions
const PRESET_MESSAGES = {
  heartfelt: "Wishing you a birthday that is as extraordinary, kind, and beautiful as your soul. Thank you for being such a wonderful presence in my life. May all your wildest dreams come true this year! ❤️",
  funny: "Happy Birthday! 🎉 Remember: age is just a number... in your case, a really high one! Just kidding! May your day be filled with cake, laughter, and zero adulting responsibilities today!",
  sweet: "To someone who brightens every room they walk into: Happy Birthday! 🌟 Sending you the biggest hugs, warmest smiles, and endless love on your special day!"
};

// Global App State
const state = {
  currentStep: 1,
  bdayName: DEFAULT_DATA.bdayName,
  relationship: DEFAULT_DATA.relationship,
  senderName: DEFAULT_DATA.senderName,
  wishMessage: DEFAULT_DATA.wishMessage,
  photoData: DEFAULT_DATA.photoData,
  isAudioPlaying: false,
  typingTimer: null,
  terminalTimer: null,
  confettiActive: false
};

// Audio Engine (Web Audio API Synth Melody)
class SynthAudioPlayer {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.timer = null;
    this.notes = [261.63, 261.63, 293.66, 261.63, 349.23, 329.63, 261.63, 261.63, 293.66, 261.63, 392.00, 349.23]; // Happy birthday notes
    this.currentNoteIndex = 0;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
  }

  playNote(freq, duration = 0.4) {
    if (!this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  start() {
    this.init();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    this.isPlaying = true;
    this.currentNoteIndex = 0;
    this.scheduleNextNote();
  }

  scheduleNextNote() {
    if (!this.isPlaying) return;
    const freq = this.notes[this.currentNoteIndex];
    this.playNote(freq, 0.45);
    this.currentNoteIndex = (this.currentNoteIndex + 1) % this.notes.length;
    this.timer = setTimeout(() => this.scheduleNextNote(), 450);
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) clearTimeout(this.timer);
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }
}

const synthPlayer = new SynthAudioPlayer();

// Initialize App on DOM Load
document.addEventListener("DOMContentLoaded", () => {
  loadSavedState();
  initBackgroundParticles();
  initConfettiCanvas();
  setupEventListeners();
  renderCurrentScene();
});

/* --------------------------------------------------------------------------
   STATE PERSISTENCE & SHARE URL HANDLING
   -------------------------------------------------------------------------- */
function loadSavedState() {
  // Check URL params / Hash for encoded payload first
  const hash = window.location.hash;
  if (hash && hash.includes("bdayData=")) {
    try {
      const encoded = hash.split("bdayData=")[1];
      const decodedJson = JSON.parse(decodeURIComponent(atob(encoded)));
      if (decodedJson.bdayName) {
        state.bdayName = decodedJson.bdayName;
        state.relationship = decodedJson.relationship || DEFAULT_DATA.relationship;
        state.senderName = decodedJson.senderName || DEFAULT_DATA.senderName;
        state.wishMessage = decodedJson.wishMessage || DEFAULT_DATA.wishMessage;
        if (decodedJson.photoData) state.photoData = decodedJson.photoData;
        showToast("✨ Loaded custom birthday surprise link!");
        return;
      }
    } catch (err) {
      console.warn("Failed to parse URL bdayData", err);
    }
  }

  // Fallback to localStorage
  const saved = localStorage.getItem("birthday_surprise_data");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      state.bdayName = parsed.bdayName || DEFAULT_DATA.bdayName;
      state.relationship = parsed.relationship || DEFAULT_DATA.relationship;
      state.senderName = parsed.senderName || DEFAULT_DATA.senderName;
      state.wishMessage = parsed.wishMessage || DEFAULT_DATA.wishMessage;
      state.photoData = parsed.photoData || DEFAULT_DATA.photoData;
    } catch (e) {
      console.warn("Failed to parse localStorage", e);
    }
  }
}

function saveStateToLocal() {
  const dataToSave = {
    bdayName: state.bdayName,
    relationship: state.relationship,
    senderName: state.senderName,
    wishMessage: state.wishMessage,
    // Only store photoData if under 1.5MB to avoid quota issues
    photoData: state.photoData.length < 1500000 ? state.photoData : DEFAULT_DATA.photoData
  };
  try {
    localStorage.setItem("birthday_surprise_data", JSON.stringify(dataToSave));
  } catch (e) {
    console.warn("LocalStorage full, payload omitted photo.", e);
  }
}

function generateShareUrl() {
  const payload = {
    bdayName: state.bdayName,
    relationship: state.relationship,
    senderName: state.senderName,
    wishMessage: state.wishMessage
  };
  // Include image data if small enough for URL
  if (state.photoData && state.photoData.length < 100000) {
    payload.photoData = state.photoData;
  }

  const jsonStr = JSON.stringify(payload);
  const b64 = btoa(encodeURIComponent(jsonStr));
  const fullUrl = `${window.location.origin}${window.location.pathname}#bdayData=${b64}`;

  navigator.clipboard.writeText(fullUrl).then(() => {
    showToast("🔗 Custom surprise link copied to clipboard!");
  }).catch(() => {
    showToast("📋 Copy link error. Copy manually from address bar.");
  });
}

/* --------------------------------------------------------------------------
   UI EVENT LISTENERS & MODAL MANAGEMENT
   -------------------------------------------------------------------------- */
function setupEventListeners() {
  // Navigation & Step Dots
  document.querySelectorAll(".step-dot").forEach(dot => {
    dot.addEventListener("click", () => {
      const targetStep = parseInt(dot.getAttribute("data-step"));
      goToStep(targetStep);
    });
  });

  // Next / Prev Scene Buttons
  document.querySelectorAll(".next-scene-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const nextStep = parseInt(btn.getAttribute("data-next"));
      goToStep(nextStep);
    });
  });

  // Music Toggle Button
  const musicBtn = document.getElementById("music-toggle-btn");
  musicBtn.addEventListener("click", () => {
    const isNowPlaying = synthPlayer.toggle();
    state.isAudioPlaying = isNowPlaying;
    if (isNowPlaying) {
      musicBtn.classList.remove("muted");
      showToast("🎵 Playing ambient birthday tunes!");
    } else {
      musicBtn.classList.add("muted");
      showToast("🔇 Audio muted");
    }
  });

  // Edit / Customizer Modal Triggers
  const modal = document.getElementById("customizer-modal");
  const editBtn = document.getElementById("edit-modal-btn");
  const closeBtn = document.getElementById("close-modal-btn");
  const editFromFinale = document.getElementById("edit-from-finale-btn");

  const openModal = () => {
    populateModalForm();
    modal.classList.remove("hidden");
  };

  const closeModal = () => {
    modal.classList.add("hidden");
  };

  editBtn.addEventListener("click", openModal);
  if (editFromFinale) editFromFinale.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);

  // Close modal when clicking dark overlay
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Share Link Triggers
  document.getElementById("share-link-btn").addEventListener("click", generateShareUrl);
  const shareFromFinale = document.getElementById("share-from-finale-btn");
  if (shareFromFinale) shareFromFinale.addEventListener("click", generateShareUrl);

  // Replay Button
  const replayBtn = document.getElementById("replay-btn");
  if (replayBtn) {
    replayBtn.addEventListener("click", () => {
      goToStep(1);
    });
  }

  // Customizer Form Submissions
  const form = document.getElementById("customizer-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    state.bdayName = document.getElementById("input-bday-name").value.trim() || DEFAULT_DATA.bdayName;
    state.relationship = document.getElementById("input-relationship").value || DEFAULT_DATA.relationship;
    state.wishMessage = document.getElementById("input-wish-message").value.trim() || DEFAULT_DATA.wishMessage;
    state.senderName = document.getElementById("input-sender-name").value.trim() || DEFAULT_DATA.senderName;

    saveStateToLocal();
    closeModal();
    showToast("✨ Surprise updated successfully!");
    goToStep(1); // Restart from Scene 1 with new inputs
  });

  // Demo Preset Button
  document.getElementById("demo-preset-btn").addEventListener("click", () => {
    document.getElementById("input-bday-name").value = "Sophia";
    document.getElementById("input-relationship").value = "Best Friend";
    document.getElementById("input-wish-message").value = DEFAULT_DATA.wishMessage;
    document.getElementById("input-sender-name").value = "Alex";
    updateCharCounter();
  });

  // Character Counter for Wish Message
  const wishTextarea = document.getElementById("input-wish-message");
  wishTextarea.addEventListener("input", updateCharCounter);

  // Preset Pills Buttons
  document.querySelectorAll(".preset-pill-btn").forEach(pill => {
    pill.addEventListener("click", () => {
      const type = pill.getAttribute("data-preset");
      if (PRESET_MESSAGES[type]) {
        wishTextarea.value = PRESET_MESSAGES[type];
        updateCharCounter();
      }
    });
  });

  // Photo Upload FileReader Handling
  const photoInput = document.getElementById("input-photo");
  const dropzone = document.getElementById("upload-dropzone");
  const removePhotoBtn = document.getElementById("remove-photo-btn");

  dropzone.addEventListener("click", () => photoInput.click());

  photoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        showToast("⚠️ Image size exceeds 5MB. Please select a smaller photo.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        state.photoData = event.target.result;
        updatePhotoPreview(state.photoData);
        showToast("📸 Photo uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  });

  removePhotoBtn.addEventListener("click", () => {
    state.photoData = DEFAULT_DATA.photoData;
    updatePhotoPreview(null);
    photoInput.value = "";
    showToast("Photo reset to default avatar.");
  });

  // Interactive Candle Blowing on Cake
  const cakeElement = document.getElementById("cake-element");
  if (cakeElement) {
    cakeElement.addEventListener("click", () => {
      const candles = cakeElement.querySelectorAll(".candle");
      candles.forEach(c => {
        if (!c.classList.contains("blown")) {
          c.classList.add("blown");
        }
      });

      const status = document.getElementById("cake-blown-status");
      if (status) {
        status.textContent = "🎂 Candles blown out! Your wish has been sent to the stars! ✨";
        status.style.color = "#ff2a75";
      }

      // Trigger extra confetti burst
      triggerConfettiBurst();
      showToast("🎉 Happy Birthday! Make a wish!");
    });
  }
}

function updateCharCounter() {
  const wishTextarea = document.getElementById("input-wish-message");
  const countSpan = document.getElementById("char-count");
  if (wishTextarea && countSpan) {
    countSpan.textContent = wishTextarea.value.length;
  }
}

function populateModalForm() {
  document.getElementById("input-bday-name").value = state.bdayName;
  document.getElementById("input-relationship").value = state.relationship;
  document.getElementById("input-wish-message").value = state.wishMessage;
  document.getElementById("input-sender-name").value = state.senderName;
  updateCharCounter();
  updatePhotoPreview(state.photoData);
}

function updatePhotoPreview(dataUrl) {
  const previewImg = document.getElementById("upload-preview-img");
  const icon = document.getElementById("upload-placeholder-icon");
  const actionsBar = document.getElementById("photo-actions-bar");

  if (dataUrl && dataUrl !== DEFAULT_DATA.photoData) {
    previewImg.src = dataUrl;
    previewImg.classList.remove("hidden");
    icon.classList.add("hidden");
    actionsBar.classList.remove("hidden");
  } else {
    previewImg.classList.add("hidden");
    icon.classList.remove("hidden");
    actionsBar.classList.add("hidden");
  }
}

/* --------------------------------------------------------------------------
   SCENE RENDER & STEP NAVIGATION CONTROLLER
   -------------------------------------------------------------------------- */
function goToStep(stepNumber) {
  if (stepNumber < 1 || stepNumber > 6) return;
  state.currentStep = stepNumber;

  // Update Dots
  document.querySelectorAll(".step-dot").forEach((dot, index) => {
    if (index + 1 === stepNumber) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });

  // Switch Scene Visibility
  document.querySelectorAll(".scene").forEach(scene => {
    scene.classList.remove("active");
  });

  const activeScene = document.getElementById(`scene-${stepNumber}`);
  if (activeScene) {
    activeScene.classList.add("active");
  }

  renderCurrentScene();
}

function renderCurrentScene() {
  // Start audio on first transition if not played yet
  if (!state.isAudioPlaying) {
    synthPlayer.start();
    state.isAudioPlaying = true;
    const musicBtn = document.getElementById("music-toggle-btn");
    if (musicBtn) musicBtn.classList.remove("muted");
  }

  switch (state.currentStep) {
    case 1:
      renderScene1();
      break;
    case 2:
      renderScene2();
      break;
    case 3:
      renderScene3();
      break;
    case 4:
      renderScene4();
      break;
    case 5:
      renderScene5();
      break;
    case 6:
      renderScene6();
      break;
  }
}

/* Scene 1: Dark Cinematic Intro */
function renderScene1() {
  const lines = document.querySelectorAll("#scene-1 .intro-line");
  lines.forEach((line, index) => {
    line.classList.remove("visible");
    setTimeout(() => {
      line.classList.add("visible");
    }, (index + 1) * 700);
  });
}

/* Scene 2: Developer Terminal Visual */
function renderScene2() {
  const codeEditor = document.getElementById("code-content");
  const consoleLogs = document.getElementById("console-logs");
  if (!codeEditor || !consoleLogs) return;

  codeEditor.innerHTML = "";
  consoleLogs.innerHTML = "";

  const codeString = `// Secret Birthday Protocol v2.4
<span class="kw">const</span> <span class="fn">birthdayPerson</span> = {
  name: <span class="str">"${state.bdayName}"</span>,
  relation: <span class="str">"${state.relationship}"</span>,
  status: <span class="str">"Awesome & Loved 🌟"</span>
};

<span class="kw">async function</span> <span class="fn">compileSurprise</span>() {
  <span class="cm">// Executing emotion compiler...</span>
  <span class="kw">await</span> <span class="fn">injectHappiness</span>({ amount: <span class="str">"INFINITY"</span> });
  <span class="kw">return</span> <span class="str">"HAPPY BIRTHDAY ${state.bdayName.toUpperCase()}! ❤️"</span>;
}

<span class="fn">compileSurprise</span>();`;

  codeEditor.innerHTML = codeString;

  // Console Logs Typing Animation
  const logs = [
    { text: `[SYS] Target acquired: ${state.bdayName}`, type: "info" },
    { text: `[SYS] Relationship: ${state.relationship}`, type: "info" },
    { text: `[SYS] Compiling memories... 100%`, type: "success" },
    { text: `[SYS] Surprise ready! Click REVEAL below! ✨`, type: "highlight-log" }
  ];

  logs.forEach((log, i) => {
    setTimeout(() => {
      const entry = document.createElement("div");
      entry.className = `log-entry ${log.type}`;
      entry.textContent = log.text;
      consoleLogs.appendChild(entry);
    }, (i + 1) * 600);
  });
}

/* Scene 3: Birthday Reveal & Photo */
function renderScene3() {
  const bdayNameEl = document.getElementById("display-bday-name");
  const badgeEl = document.getElementById("display-badge");
  const photoEl = document.getElementById("display-photo");

  if (bdayNameEl) bdayNameEl.textContent = state.bdayName;
  if (badgeEl) badgeEl.textContent = `To My Dearest ${state.relationship} 💖`;
  if (photoEl) photoEl.src = state.photoData || DEFAULT_DATA.photoData;
}

/* Scene 4: Digital Birthday Letter (Typewriter Animation) */
function renderScene4() {
  const typedEl = document.getElementById("typed-message");
  const statusEl = document.getElementById("type-status");
  if (!typedEl) return;

  typedEl.textContent = "";
  if (statusEl) statusEl.textContent = "Writing message...";

  let charIndex = 0;
  if (state.typingTimer) clearInterval(state.typingTimer);

  const fullText = state.wishMessage;

  state.typingTimer = setInterval(() => {
    if (charIndex < fullText.length) {
      typedEl.textContent += fullText.charAt(charIndex);
      charIndex++;
    } else {
      clearInterval(state.typingTimer);
      if (statusEl) statusEl.textContent = "Letter complete ❤️";
    }
  }, 40);
}

/* Scene 5: Sender Sign-Off */
function renderScene5() {
  const senderEl = document.getElementById("display-sender-name");
  const relEl = document.getElementById("display-relationship");

  if (senderEl) senderEl.textContent = state.senderName;
  if (relEl) relEl.textContent = state.relationship;
}

/* Scene 6: Interactive Finale Party */
function renderScene6() {
  state.confettiActive = true;
  triggerConfettiBurst();
  spawnFloatingHearts();
  spawnFloatingBalloons();

  // Reset candle flames
  const cakeElement = document.getElementById("cake-element");
  if (cakeElement) {
    cakeElement.querySelectorAll(".candle").forEach(c => c.classList.remove("blown"));
  }
  const status = document.getElementById("cake-blown-status");
  if (status) {
    status.textContent = "Candles are lit! Make a wish ✨";
    status.style.color = "var(--accent-gold)";
  }
}

/* --------------------------------------------------------------------------
   PARTICLE BACKGROUND & CONFETTI ENGINE
   -------------------------------------------------------------------------- */
function initBackgroundParticles() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(width < 768 ? 40 : 80, 100);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.5,
      color: ["#ff2a75", "#a855f7", "#06b6d4", "#ffffff"][Math.floor(Math.random() * 4)],
      alpha: Math.random() * 0.6 + 0.2,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4
    });
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.fill();
    });

    requestAnimationFrame(loop);
  }

  loop();
}

let confettiParticles = [];
function initConfettiCanvas() {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  function renderConfetti() {
    ctx.clearRect(0, 0, width, height);

    confettiParticles.forEach((p, index) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotationSpeed;
      p.alpha -= 0.003;

      if (p.alpha <= 0 || p.y > height + 50) {
        confettiParticles.splice(index, 1);
        return;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
      ctx.restore();
    });

    requestAnimationFrame(renderConfetti);
  }

  renderConfetti();
}

function triggerConfettiBurst() {
  const colors = ["#ff2a75", "#a855f7", "#06b6d4", "#fbbf24", "#f43f5e", "#ffffff"];
  for (let i = 0; i < 120; i++) {
    confettiParticles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2 + 100,
      size: Math.random() * 10 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.8) * 20,
      gravity: 0.25,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      alpha: 1.0
    });
  }
}

/* --------------------------------------------------------------------------
   FLOATING HEARTS & BALLOONS GENERATOR
   -------------------------------------------------------------------------- */
function spawnFloatingHearts() {
  const container = document.getElementById("floating-hearts-layer");
  if (!container) return;
  container.innerHTML = "";

  const hearts = ["💖", "💗", "✨", "💓", "❤️", "🌸"];
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      const heart = document.createElement("div");
      heart.className = "floating-heart";
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.left = `${Math.random() * 85 + 5}%`;
      heart.style.animationDuration = `${Math.random() * 3 + 4}s`;

      heart.addEventListener("click", () => {
        heart.style.transform = "scale(2) rotate(45deg)";
        heart.style.opacity = "0";
        showToast("💖 Love burst!");
        setTimeout(() => heart.remove(), 200);
      });

      container.appendChild(heart);
    }, i * 300);
  }
}

function spawnFloatingBalloons() {
  const container = document.getElementById("floating-balloons-layer");
  if (!container) return;
  container.innerHTML = "";

  const balloonColors = [
    "linear-gradient(135deg, #ff2a75, #e11d48)",
    "linear-gradient(135deg, #a855f7, #7e22ce)",
    "linear-gradient(135deg, #06b6d4, #0284c7)",
    "linear-gradient(135deg, #fbbf24, #d97706)"
  ];

  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      const balloon = document.createElement("div");
      balloon.className = "floating-balloon";
      balloon.style.background = balloonColors[Math.floor(Math.random() * balloonColors.length)];
      balloon.style.left = `${Math.random() * 80 + 10}%`;
      balloon.style.animationDuration = `${Math.random() * 4 + 6}s`;

      container.appendChild(balloon);
    }, i * 700);
  }
}

/* --------------------------------------------------------------------------
   TOAST NOTIFICATION ENGINE
   -------------------------------------------------------------------------- */
function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
