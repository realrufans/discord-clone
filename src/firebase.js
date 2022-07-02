import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {getStorage} from 'firebase/storage'
  
const firebaseConfig = {
    apiKey: "AIzaSyBG_M896fM_3Px5U-k4LNzOv402P7iO-yg",
    authDomain: "dicord-clone-fbb6f.firebaseapp.com",
    projectId: "dicord-clone-fbb6f",
    storageBucket: "dicord-clone-fbb6f.appspot.com",
    messagingSenderId: "106878401739",
    appId: "1:106878401739:web:decd5fa740e6302aa06f4e"
  };
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore()
  const auth = firebase.auth()
  const provider = new firebase.auth.GoogleAuthProvider()
  const storage = getStorage(firebaseApp)
      
  export { auth, db,provider, firebaseApp, storage };
  

 