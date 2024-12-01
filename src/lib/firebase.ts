import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCP2YU9uWeLMQZ7RyfP09m44OzI13YYnkk",
  authDomain: "simplecrm-e5414.firebaseapp.com",
  projectId: "simplecrm-e5414",
  storageBucket: "simplecrm-e5414.firebasestorage.app",
  messagingSenderId: "474280339014",
  appId: "1:474280339014:web:20527825c0d8ace3a98c47",
  measurementId: "G-JYXJREFMGM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Initialize Storage with default bucket
storage.maxUploadRetryTime = 30000; // 30 seconds max retry time
storage.maxOperationRetryTime = 30000;