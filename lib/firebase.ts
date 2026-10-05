// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // 匯入驗證服務
import { getFirestore } from "firebase/firestore"; // 匯入 Firestore 資料庫服務
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA96lpA6O3CFQbj15iXsNO7bacdU-Y0q2w",
  authDomain: "accounting-app-845c1.firebaseapp.com",
  projectId: "accounting-app-845c1",
  storageBucket: "accounting-app-845c1.firebasestorage.app",
  messagingSenderId: "941749225770",
  appId: "1:941749225770:web:f9c3c4d81a6d13d76af653"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // 取得驗證服務，供其他檔案使用
export const db = getFirestore(app); // 取得資料庫服務，供其他檔案使用