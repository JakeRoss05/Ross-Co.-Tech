import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

console.log("App.js loaded");

// Firebase config (yours is correct)
const firebaseConfig = {
  apiKey: "AIzaSyAn_y-ImEEHlz4-SiQwP0c1FW9rlqfOvJA",
  authDomain: "ross-co-tech.firebaseapp.com",
  projectId: "ross-co-tech",
  storageBucket: "ross-co-tech.firebasestorage.app",
  messagingSenderId: "679496581179",
  appId: "1:679496581179:web:0949a2cf065c85591adc1e"
};

// Initialize Firebase ONCE
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// UI refs
const yearEl = document.getElementById("year");
const authBtn = document.getElementById("authBtn");
const backdrop = document.getElementById("modalBackdrop");
const closeModalBtn = document.getElementById("closeModal");
const googleBtn = document.getElementById("googleBtn");
const emailForm = document.getElementById("emailForm");
const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");
const authMsg = document.getElementById("authMsg");

// Footer year
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Modal helpers
function openModal(){
  backdrop.classList.add("open");
  backdrop.setAttribute("aria-hidden", "false");
  authMsg.textContent = "";
  setTimeout(() => emailEl?.focus(), 50);
}
function closeModal(){
  backdrop.classList.remove("open");
  backdrop.setAttribute("aria-hidden", "true");
}

backdrop?.addEventListener("click", (e) => {
  if (e.target === backdrop) closeModal();
});
closeModalBtn?.addEventListener("click", closeModal);

// Auth button
authBtn?.addEventListener("click", async () => {
  if (auth.currentUser) {
    await signOut(auth);
    return;
  }
  openModal();
});

// Google login
googleBtn?.addEventListener("click", async () => {
  authMsg.textContent = "Opening Google…";
  try {
    await signInWithPopup(auth, provider);
    console.log("EMAIL LOGIN SUCCESS — redirecting");
    window.location.href = "./dashboard.html";
  } catch (err) {
    authMsg.textContent = err.message;
  }
});


// Email login / signup
emailForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  authMsg.textContent = "Checking…";

  const email = emailEl.value.trim();
  const password = passwordEl.value;

  try {
    // LOGIN (if Auth functions available)
    await signInWithEmailAndPassword(auth, email, password);
    console.log("EMAIL LOGIN SUCCESS — redirecting");
    window.location.href = "./dashboard.html";
  } catch {
    try {
      // SIGN UP
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("EMAIL SIGNUP SUCCESS — redirecting");
      window.location.href = "./dashboard.html";
    } catch (err) {
      authMsg.textContent = err.message;
    }
  }
});


// Auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    authBtn.textContent = "Logout";
  } else {
    authBtn.textContent = "Login";
  }
});

document.getElementById("testRedirect")?.addEventListener("click", () => {
  console.log("MANUAL REDIRECT CLICKED");
  window.location.assign("/dashboard.html");
});

const bookingForm = document.getElementById("bookingForm");
console.log("Booking form:", bookingForm);
const nameInput = document.getElementById("nameInput");
const messageInput = document.getElementById("messageInput");

bookingForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const message = messageInput.value.trim();

  if (!name || !message) return;

  try {
    // If Firestore isn't configured, skip the network save but continue
    if (typeof addDoc === "function" && typeof db !== "undefined") {
      await addDoc(collection(db, "submissions"), {
        name,
        message,
        userId: auth.currentUser?.uid || null,
        createdAt: typeof serverTimestamp === "function" ? serverTimestamp() : null,
        source: "website"
      });
    } else {
      console.warn("Firestore not configured — skipping remote save");
    }

    bookingForm.reset();
    alert("Submitted. I’ll get back to you shortly.");

  } catch (err) {
    console.error("Submission failed:", err);
    alert("Something went wrong. Try again.");
  }
});

// Make horizontal card collections draggable (pointer events)
document.querySelectorAll(".cards").forEach((cards) => {
  let isDragging = false;
  let startX;
  let startScrollLeft;

  cards.addEventListener("pointerdown", (e) => {
    isDragging = true;
    cards.classList.add("dragging");

    startX = e.clientX - cards.offsetLeft;
    startScrollLeft = cards.scrollLeft;

    if (typeof e.pointerId !== "undefined") cards.setPointerCapture(e.pointerId);
  });

  cards.addEventListener("pointermove", (e) => {
    if (!isDragging) return;

    const distanceMoved = e.clientX - startX;
    cards.scrollLeft = startScrollLeft - distanceMoved;

  });

  const endDrag = (e) => {
    isDragging = false;
    cards.classList.remove("dragging");
    if (typeof e?.pointerId !== "undefined") {
      try { cards.releasePointerCapture(e.pointerId); } catch (_) { }
    }
  };

  cards.addEventListener("pointerup", endDrag);
  cards.addEventListener("pointercancel", endDrag);
  cards.addEventListener("pointerleave", endDrag);
});
