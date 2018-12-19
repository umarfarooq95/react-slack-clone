  import firebase from 'firebase/app';
  import "firebase/auth";
  import "firebase/database";
  import "firebase/storage";

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyA0j4bviD4_mDw-XVUa6pdOleYTEP3OXMA",
    authDomain: "react-slack-clone-5b18a.firebaseapp.com",
    databaseURL: "https://react-slack-clone-5b18a.firebaseio.com",
    projectId: "react-slack-clone-5b18a",
    storageBucket: "react-slack-clone-5b18a.appspot.com",
    messagingSenderId: "319617299912"
  };
  firebase.initializeApp(config);

  export default firebase;