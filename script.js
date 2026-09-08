/* =========================================================
   TWO HEARTS • ONE DATE
   Birthday Surprise - Vanilla HTML/CSS/JS
   ========================================================= */

const screens = [...document.querySelectorAll(".screen")];
let current = "intro";
const magicVideos = [...document.querySelectorAll("#magic-video video")];
const magicVideoFrames = [...document.querySelectorAll("#magic-video .video-frame")];
const videoFallback = document.getElementById("videoFallback");

function playMagicVideo(index) {
  magicVideos.forEach((video, videoIndex) => {
    video.pause();
    if (videoIndex !== index) video.currentTime = 0;
  });
  magicVideoFrames.forEach((frame, frameIndex) => {
    frame.classList.toggle("video-hidden", frameIndex !== index);
  });
  magicVideos[index].play().catch(() => {});
}

function showScreen(id) {
  screens.forEach(s => s.classList.toggle("active", s.id === id));
  current = id;
  window.scrollTo({top: 0, behavior: "instant"});
  if (id === "magic-video") {
    playMagicVideo(0);
  } else {
    magicVideos.forEach(video => video.pause());
  }
}

magicVideos[0].addEventListener("ended", () => playMagicVideo(1));

magicVideos.forEach(video => {
  video.addEventListener("error", () => {
    videoFallback.hidden = false;
  });
  video.addEventListener("loadeddata", () => {
    if (magicVideos.every(item => item.readyState >= 2)) videoFallback.hidden = true;
  });
});

document.getElementById("beginBtn").addEventListener("click", () => {
  burstHearts(25);
  showScreen("reveal");
});

document.querySelectorAll("[data-next]").forEach(btn => {
  btn.addEventListener("click", () => {
    showScreen(btn.dataset.next);
    burstHearts(10);
  });
});

document.getElementById("replayBtn").addEventListener("click", () => {
  stopFireworks();
  showScreen("intro");
});

document.getElementById("giftBtn").addEventListener("click", () => {
  stopFireworks();
  showScreen("gift-vault");
  burstHearts(18);
});

document.getElementById("cakeBtn").addEventListener("click", () => {
  stopFireworks();
  showScreen("cake");
  burstHearts(12);
});

document.getElementById("cutCakeBtn").addEventListener("click", () => {
  const cakeScreen = document.getElementById("cake");
  const cutButton = document.getElementById("cutCakeBtn");
  cutButton.disabled = true;
  cutButton.querySelector("span + span").textContent = "Cake cut!";
  cakeScreen.classList.add("cake-cut");
  document.getElementById("cakeReveal").classList.add("show");
  startFireworks();
  blastMany(12);
  burstHearts(30);
  setTimeout(stopFireworks, 5200);
});

document.getElementById("wishAfterCake").addEventListener("click", event => {
  event.currentTarget.textContent = "Wish sent into the stars ♥";
  event.currentTarget.disabled = true;
  burstHearts(20);
  blastMany(5);
});

/* ---------- stars ---------- */
const stars = document.getElementById("stars");
for (let i = 0; i < 130; i++) {
  const s = document.createElement("i");
  s.className = "star";
  s.style.left = Math.random() * 100 + "%";
  s.style.top = Math.random() * 100 + "%";
  s.style.setProperty("--d", (2 + Math.random() * 4) + "s");
  s.style.animationDelay = (-Math.random() * 4) + "s";
  stars.appendChild(s);
}

/* ---------- floating hearts ---------- */
const hearts = document.getElementById("hearts");

function floatHeart() {
  const h = document.createElement("span");
  h.className = "floating-heart";
  h.textContent = Math.random() > .5 ? "♥" : "♡";
  h.style.left = Math.random() * 100 + "%";
  h.style.bottom = "-30px";
  h.style.fontSize = (10 + Math.random() * 18) + "px";
  h.style.animationDuration = (7 + Math.random() * 7) + "s";
  hearts.appendChild(h);
  setTimeout(() => h.remove(), 15000);
}
setInterval(floatHeart, 650);

function burstHearts(count = 15) {
  for (let i = 0; i < count; i++) {
    setTimeout(floatHeart, i * 35);
  }
}

/* ---------- gallery ----------
   Add your photos here later.
   Example:
   "images/photo-03.jpg",
   "images/photo-04.jpg"
*/
const photos = [
  {src: "images/mother-daughter-01.jpg", group: "memories", label: "Our story", caption: "The beginning of a beautiful journey."},
  {src: "images/mother-daughter-02.jpg", group: "memories", label: "Together", caption: "A tiny heart made the date brighter."},
  {src: "images/celebration.jpg", group: "celebration", label: "Celebration", caption: "Let every happy moment sparkle."},
  {src: "images/joy.jpg", group: "celebration", label: "Joy", caption: "The best memories are made together."},
  {src: "images/birthday-glow.jpg", group: "celebration", label: "Birthday glow", caption: "A little sweetness for a very special date."},
  {src: "images/starlight.jpg", group: "starlight", label: "Starlight", caption: "Wishes look brighter when shared."},
  {src: "images/dreams.jpg", group: "starlight", label: "Dreams", caption: "Here is to every beautiful dream ahead."},
  {src: "images/make-a-wish.jpg", group: "celebration", label: "Make a wish", caption: "One unforgettable date, a thousand reasons to smile."}
];

const gallery = document.getElementById("gallery");
let activeFilter = "all";

function renderGallery(filter = activeFilter) {
  activeFilter = filter;
  gallery.innerHTML = "";
  photos.forEach((photo, index) => {
    if (filter !== "all" && photo.group !== filter) return;
    const item = document.createElement("div");
    item.className = "gallery-item is-new";
    item.dataset.label = photo.label;
    item.innerHTML = `<img src="${photo.src}" alt="${photo.caption}" loading="lazy"><div class="gallery-caption">${photo.caption}</div>`;
    item.addEventListener("click", () => openLightbox(index));
    gallery.appendChild(item);
  });
}

renderGallery();
document.querySelectorAll(".collection-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".collection-tab").forEach(button => button.classList.remove("active"));
    tab.classList.add("active");
    renderGallery(tab.dataset.filter);
  });
});

document.getElementById("shuffleGallery").addEventListener("click", () => {
  const shuffled = [...photos].sort(() => Math.random() - .5);
  photos.splice(0, photos.length, ...shuffled);
  renderGallery();
  burstHearts(8);
});

/* ---------- lightbox ---------- */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const photoCounter = document.getElementById("photoCounter");
let photoIndex = 0;

function openLightbox(index) {
  photoIndex = index;
  updateLightbox();
  lightbox.classList.add("show");
}

function updateLightbox() {
  lightboxImg.src = photos[photoIndex].src;
  lightboxImg.alt = photos[photoIndex].caption;
  photoCounter.textContent = `${photoIndex + 1} / ${photos.length}`;
}

function closeLightbox() {
  lightbox.classList.remove("show");
}

document.getElementById("closeLightbox").addEventListener("click", closeLightbox);
document.getElementById("prevPhoto").addEventListener("click", () => {
  photoIndex = (photoIndex - 1 + photos.length) % photos.length;
  updateLightbox();
});
document.getElementById("nextPhoto").addEventListener("click", () => {
  photoIndex = (photoIndex + 1) % photos.length;
  updateLightbox();
});

document.addEventListener("keydown", e => {
  if (!lightbox.classList.contains("show")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") document.getElementById("prevPhoto").click();
  if (e.key === "ArrowRight") document.getElementById("nextPhoto").click();
});

document.getElementById("openGallery").addEventListener("click", () => {
  if (photos.length) openLightbox(0);
});

/* ---------- gift vault ---------- */
const wishes = [
  "May this year surprise you with the kind of joy you never saw coming.",
  "May every ordinary day find a reason to feel as special as 08 September.",
  "May your two hearts keep collecting laughter, courage, and beautiful little stories.",
  "May the next chapter be softer, brighter, and full of moments worth keeping."
];
const wishText = document.getElementById("wishText");
const wishModule = document.querySelector(".wish-module");
let wishIndex = -1;

const giftModel = document.getElementById("giftModel");
const giftOpenBtn = document.getElementById("giftOpenBtn");
giftOpenBtn.addEventListener("click", () => {
  const isOpen = giftModel.classList.toggle("open");
  giftOpenBtn.innerHTML = isOpen ? "Gift opened <span>♥</span>" : "Open your special gift <span>✦</span>";
  if (isOpen) burstHearts(18);
});

document.getElementById("wishBtn").addEventListener("click", () => {
  let nextIndex;
  do nextIndex = Math.floor(Math.random() * wishes.length);
  while (nextIndex === wishIndex && wishes.length > 1);
  wishIndex = nextIndex;
  wishText.textContent = wishes[wishIndex];
  wishModule.classList.remove("revealed");
  void wishModule.offsetWidth;
  wishModule.classList.add("revealed");
  burstHearts(7);
});

const keepsakeInput = document.getElementById("keepsakeInput");
const noteStatus = document.getElementById("noteStatus");
const savedNote = localStorage.getItem("birthday-keepsake");
if (savedNote) {
  keepsakeInput.value = savedNote;
  noteStatus.textContent = "A keepsake is already saved.";
}
document.getElementById("saveNoteBtn").addEventListener("click", () => {
  const note = keepsakeInput.value.trim();
  if (!note) {
    noteStatus.textContent = "Write a little something first.";
    keepsakeInput.focus();
    return;
  }
  localStorage.setItem("birthday-keepsake", note);
  noteStatus.textContent = "Saved with love ♥";
});

document.getElementById("toastBtn").addEventListener("click", () => {
  const toastMessage = document.getElementById("toastMessage");
  toastMessage.textContent = "To love, laughter, and many more birthdays!";
  toastMessage.classList.add("raised");
  burstHearts(16);
});

/* ---------- optional music ---------- */
const music = document.getElementById("birthdayMusic");
const musicBtn = document.getElementById("musicBtn");
let musicReady = true;

function playBirthdayMusic() {
  if (!musicReady || !music.paused) return;
  music.play()
    .then(() => musicBtn.classList.add("playing"))
    .catch(() => {
      musicBtn.title = "Click to play music";
    });
}

playBirthdayMusic();
document.addEventListener("pointerdown", playBirthdayMusic, {once: true});

music.addEventListener("error", () => {
  musicReady = false;
  musicBtn.title = "Add music/birthday.mp3 to enable music";
});

musicBtn.addEventListener("click", async () => {
  if (!musicReady) {
    alert("To enable music, put your MP3 file at: music/birthday.mp3");
    return;
  }
  if (music.paused) {
    playBirthdayMusic();
  } else {
    music.pause();
    musicBtn.classList.remove("playing");
  }
});

/* ---------- fireworks ---------- */
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
const fireworkNames = document.getElementById("fireworkNames");
const celebrationNames = ["Jabeen", "Amira"];
let particles = [];
let fireworksRunning = false;
let fireworksTimer;
let fireworksAutoTimer;
const FIRST_FIREWORKS_DURATION = 10000;

function resizeCanvas() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function firework(x, y) {
  const hue = Math.random() * 360;
  for (let i = 0; i < 75; i++) {
    const angle = (Math.PI * 2 * i) / 75;
    const speed = 1.5 + Math.random() * 5;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: .012 + Math.random() * .012,
      hue
    });
  }
}

function showFireworkName(x, y, name) {
  const label = document.createElement("span");
  label.className = "firework-name";
  label.textContent = name;
  label.style.left = `${x}px`;
  label.style.top = `${y}px`;
  fireworkNames.appendChild(label);
  setTimeout(() => label.remove(), 3400);
}

function blastMany(count) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const x = 70 + Math.random() * (innerWidth - 140);
      const y = 70 + Math.random() * innerHeight * .5;
      firework(x, y);
      showFireworkName(x, y, celebrationNames[i % celebrationNames.length]);
    }, i * 170);
  }
}

function animateFireworks() {
  if (!fireworksRunning && particles.length === 0) {
    ctx.clearRect(0,0,innerWidth,innerHeight);
    return;
  }

  ctx.fillStyle = "rgba(8,6,17,.16)";
  ctx.fillRect(0,0,innerWidth,innerHeight);

  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= .985;
    p.vy = p.vy * .985 + .045;
    p.life -= p.decay;

    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue},100%,75%,${p.life})`;
    ctx.fill();
  });

  requestAnimationFrame(animateFireworks);
}

function startFireworks(duration = null, nextScreen = null) {
  clearTimeout(fireworksAutoTimer);
  fireworksRunning = true;
  const launch = () => {
    if (!fireworksRunning) return;
    const nameX = 80 + Math.random() * (innerWidth - 160);
    const nameY = 80 + Math.random() * innerHeight * .45;
    firework(nameX, nameY);
    showFireworkName(nameX, nameY, celebrationNames[Math.floor(Math.random() * celebrationNames.length)]);
    fireworksTimer = setTimeout(launch, 500 + Math.random() * 800);
  };
  launch();
  animateFireworks();
  if (duration && nextScreen) {
    fireworksAutoTimer = setTimeout(() => {
      stopFireworks();
      showScreen(nextScreen);
      burstHearts(18);
    }, duration);
  }
}

function stopFireworks() {
  fireworksRunning = false;
  clearTimeout(fireworksTimer);
  clearTimeout(fireworksAutoTimer);
  particles = [];
  ctx.clearRect(0,0,innerWidth,innerHeight);
  fireworkNames.innerHTML = "";
}

document.getElementById("celebrateBtn").addEventListener("click", () => {
  showScreen("finale");
  burstHearts(45);
  startFireworks(FIRST_FIREWORKS_DURATION, "cake");

  if (musicReady && music.paused) {
    music.play().then(() => musicBtn.classList.add("playing")).catch(() => {});
  }
});

/* ---------- subtle 3D tilt ---------- */
document.querySelectorAll(".birthday-card").forEach(card => {
  card.addEventListener("pointermove", e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    const direction = card.classList.contains("daughter-card") ? 1 : -1;
    card.style.transform =
      `perspective(1000px) rotateY(${x * 7 * direction}deg) rotateX(${y * -5}deg) translateY(-5px)`;
  });
  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

/* ---------- initial ambient effect ---------- */
for (let i = 0; i < 12; i++) setTimeout(floatHeart, i * 250);
