import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// GANTI DENGAN firebaseConfig ANDA
const firebaseConfig = {
  apiKey: "AIzaSyCN4toCiRuRnro8gmiYIaGBcWMx837t0H8",
  authDomain: "chat-wa-firebase.firebaseapp.com",
  projectId: "chat-wa-firebase"
  storageBucket: "chat-wa-firebase.firebasestorage.app",
  messagingSenderId: "893969750964",
  appId: "1:893969750964:web:5c2286a43266b57661f0e1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let username = "";
let currentRoom = "umum";

window.startChat = () => {
  username = document.getElementById("username").value;
  if (!username) return alert("Nama wajib diisi");
  document.getElementById("login").style.display = "none";
  document.getElementById("chat").style.display = "block";
  loadMessages();
};

document.getElementById("room").addEventListener("change", e => {
  currentRoom = e.target.value;
  document.getElementById("messages").innerHTML = "";
  loadMessages();
});

function loadMessages() {
  const q = query(
    collection(db, "messages"),
    where("room", "==", currentRoom),
    orderBy("time")
  );

  onSnapshot(q, snapshot => {
    const msgBox = document.getElementById("messages");
    msgBox.innerHTML = "";
    snapshot.forEach(doc => {
      const d = doc.data();
      msgBox.innerHTML += `<div class="msg"><span>${d.user}</span>: ${d.text}</div>`;
    });
    msgBox.scrollTop = msgBox.scrollHeight;
  });
}

window.sendMessage = async () => {
  const text = document.getElementById("messageInput").value;
  if (!text) return;
  await addDoc(collection(db, "messages"), {
    user: username,
    text,
    room: currentRoom,
    time: Date.now()
  });
  document.getElementById("messageInput").value = "";
};
