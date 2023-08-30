
const {initializeApp} = require("firebase/app");
const {ref, getStorage, getDownloadURL, uploadBytes} = require("firebase/storage");
const admin = require("firebase-admin");
const { initializeApp: firebaseAdminInitialize } = require('firebase-admin/app');



const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId:process.env.FIREBASE_PROJECT_ID,
  storageBucket:process.env.FIREBASE_STORAGE_BUCKET ,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDERID,
  appId: process.env.FIREBASE_APPID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

const adminApp = firebaseAdminInitialize({
  credential: admin.credential.cert(require('./serviceAccount.json')) 
});


module.exports={storage, ref, getDownloadURL, uploadBytes, adminApp, admin}
