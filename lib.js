/**
 * Housing Services DSM – shared library
 * Vyumba kwa wanafunzi wa vyuo vyote vya Dar es Salaam
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

/* ─────────────────────────────────────────────
   WEKA CONFIG YAKO HAPA
   ───────────────────────────────────────────── */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

/** Nenosiri la admin – BADILISHA hili! */
export const ADMIN_PASSWORD = "admin123";

/* ───────────────────────────────────────────── */

const isConfigured =
  firebaseConfig.apiKey !== "YOUR_API_KEY" &&
  firebaseConfig.projectId !== "YOUR_PROJECT_ID";

let app, db, storage;
if (isConfigured) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
}

export const TYPES = [
  "Single",
  "Shared (2)",
  "Shared (3+)",
  "Bedsitter",
  "Self-contained",
  "Master bedroom",
  "Hostel-style",
];

export const UNIS = [
  "UDSM (University of Dar es Salaam)",
  "IFM (Institute of Finance Management)",
  "Ardhi University",
  "MUHAS (Muhimbili)",
  "DIT (Dar es Salaam Institute of Technology)",
  "CBE (College of Business Education)",
  "OUT (Open University of Tanzania)",
  "Tumaini University DSM",
  "St. Joseph University",
  "KIU Dar es Salaam",
  "Institute of Social Work",
  "Mwalimu Nyerere Memorial Academy",
  "Other / Multiple",
];

export const AREAS = [
  "Sinza", "Mbezi Beach", "Mbezi Luis", "Kimara", "Ubungo", "Mabibo",
  "Kijitonyama", "Makongo", "Mlalakuwa", "Goba", "Kibamba", "Tegeta",
  "Kawe", "Masaki", "Mikocheni", "Kinondoni", "Magomeni", "Manzese",
  "Tandale", "Tabata", "Segerea", "Kigamboni", "Temeke", "Mbagala",
  "Chang'ombe", "Njiro",
];

/* ── Helpers ────────────────────────────────── */

export function $(id) {
  return document.getElementById(id);
}

export function esc(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function money(n) {
  return "TSh " + (Number(n) || 0).toLocaleString("en-TZ");
}

export function waNumber(phone) {
  if (!phone) return "";
  let p = String(phone).replace(/\D/g, "");
  if (p.startsWith("0")) p = "255" + p.slice(1);
  if (!p.startsWith("255") && p.length === 9) p = "255" + p;
  return p;
}

export function needConfig() {
  if (!isConfigured) {
    const el = $("config-warning");
    if (el) el.hidden = false;
    return false;
  }
  return true;
}

/**
 * Resize image client-side then upload to Firebase Storage.
 * Returns download URL.
 */
export async function uploadImage(file, path) {
  if (!storage) throw new Error("Storage haijawekwa");
  const blob = await resizeImage(file, 1200, 0.82);
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob, { contentType: "image/jpeg" });
  return getDownloadURL(storageRef);
}

/** Resize & compress to JPEG via canvas */
function resizeImage(file, maxW = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxW) {
        height = Math.round((height * maxW) / width);
        width = maxW;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Compress failed"))),
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Picha haikusomeka"));
    };
    img.src = url;
  });
}

export {
  db,
  storage,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
};
