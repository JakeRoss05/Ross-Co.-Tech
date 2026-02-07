import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAn_y-ImEEHlz4-SiQwP0c1FW9rlqfOvJA",
  authDomain: "ross-co-tech.firebaseapp.com",
  projectId: "ross-co-tech",
  appId: "1:679496581179:web:0949a2cf065c85591adc1e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const logoutBtn = document.getElementById("logoutBtn");
const userLine = document.getElementById("userLine");

let authChecked = false; // 👈 IMPORTANT

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "./index.html";
});

onAuthStateChanged(auth, (user) => {
  if (!authChecked) {
    authChecked = true;

    if (!user) {
      // Only redirect AFTER Firebase has finished checking
      window.location.href = "./index.html";
      return;
    }

    // User is logged in
    userLine.textContent = `Logged in as ${user.email || "user"}`;
  }
});
