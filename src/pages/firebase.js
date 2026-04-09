import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth'; 

const firebaseConfig = {
  //testing
  // apiKey: "AIzaSyCTmFMUSQL_lvxZSGzihrx5G7AypB4Uk5Q",
  // authDomain: "testing-855ce.firebaseapp.com",
  // projectId: "testing-855ce",
  // storageBucket: "testing-855ce.appspot.com",
  // messagingSenderId: "1086229411180",
  // appId: "1:1086229411180:web:4a835dadcfb73b08a42f49" 
  //Demo billing
  apiKey: "AIzaSyBMTREK-1iSuSTbpoz_SHPZlNCbsOsiN18",
  authDomain: "fir-billing-615c8.firebaseapp.com",
  projectId: "fir-billing-615c8",
  storageBucket: "fir-billing-615c8.firebasestorage.app",
  messagingSenderId: "109725325303",
  appId: "1:109725325303:web:98c3541fd93fa5bc4a80f2"

  //main db
//  apiKey: "AIzaSyCJsTvLgkcT4NqBF0ZhVzSwOaSSKEI5MCE",
//   authDomain: "vibha-485e5.firebaseapp.com",
//   projectId: "vibha-485e5",
//   storageBucket: "vibha-485e5.firebasestorage.app",
//   messagingSenderId: "813087105222",
//   appId: "1:813087105222:web:c262de3aee7866ebe977c7"


};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 
const storage = getStorage(app); 
const auth = getAuth(app); 
const firestore = getFirestore(app);
export { db, storage, auth , firestore}; 
