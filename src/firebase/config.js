import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAvloyko-5La5rqaTj8sKoU2MhXKR7BezI',
  authDomain: 'my-native-fridge.firebaseapp.com',
  databaseURL: 'https://my-native-fridge.firebaseio.com',
  projectId: 'my-native-fridge',
  storageBucket: 'my-native-fridge.appspot.com',
  messagingSenderId: '730096168799',
  appId: '1:730096168799:ios:103e4627d5ba721ebf10ea',
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };
