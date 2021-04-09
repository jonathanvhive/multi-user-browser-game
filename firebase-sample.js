import * as firebase from 'firebase';

var firebaseConfig = {
  apiKey: 'AIzaSyBfHsxqzK5WmFM7kpqQGlWR2B61m9CXJQw',
  authDomain: 'cursordemo.firebaseapp.com',
  databaseURL: 'https://cursordemo.firebaseio.com',
  projectId: 'cursordemo',
  storageBucket: 'cursordemo.appspot.com',
  messagingSenderId: '560061883486',
  appId: '1:560061883486:web:010133b460f7818df680cf'
};

class Firebase {
  firebase;
  database;
  roomRef;
  currentUserId;

  constructor() {
    this.firebase = firebase.apps.length
      ? firebase.app()
      : firebase.initializeApp(firebaseConfig);
    this.database = this.firebase.database();
    this.roomRef = this.database.ref().child('roomId');
  }

  onCursorPositionChanged = ({ x, y }) => {
    console.log('send position');
    if (!this.currentUserId) {
      return;
    }
    this.roomRef
      .child(this.currentUserId)
      .set({ id: this.currentUserId, x, y });

    this.roomRef
      .child(this.currentUserId)
      .onDisconnect()
      .remove();
  };

  monitorCursors = cb => {
    this.firebase.auth().onAuthStateChanged(user => {
      if (user) {
        var uid = user.uid;

        this.currentUserId = uid;
        this._monitorCursors(cb);
      } else {
      }
    });

    this.firebase.auth().signInAnonymously();
  };

  _monitorCursors = cb => {
    this.roomRef.once('value', snap => {
      snap.forEach(item => {
        if (item.key === this.currentUserId) {
          return;
        }
        cb('add', item.key, item.val());
      });
    });

    this.roomRef.on('child_added', snap => {
      if (snap.key === this.currentUserId) {
        return;
      }

      cb('add', snap.key, snap.val());
    });
    this.roomRef.on('child_changed', snap => {
      if (snap.key === this.currentUserId) {
        return;
      }

      cb('change', snap.key, snap.val());
    });

    this.roomRef.on('child_removed', snap => {
      cb('remove', snap.key);
    });
  };

  disconnect = () => {
    this.roomRef.off();
  };
}

const getFirebaseInstance = () => {
  return new Firebase();
};

export { getFirebaseInstance };
