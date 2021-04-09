const CURSORS = [
    'pointer0.png',
    'pointer1.png',
    'pointer2.png',
    'pointer3.png',
    'pointer4.png',
    'pointer5.png',
    'pointer6.png',
    'pointer7.png',
    'pointer8.png',
    'pointer9.png'
];

const sha256 = async (text) => {
    async function digestMessage(message) {
        const encoder = new TextEncoder();
        const data = encoder.encode(message);

        if (!crypto.subtle) {
            const arr = new Uint8Array(1);
            arr[0] = 0x10;
            return arr.buffer;
        }
        const hash = await crypto.subtle.digest('SHA-256', data);
        return hash;
    }
    
    const digest = await digestMessage(text);
    return digest;
};

const users = {

};

let myUsername = window.localStorage.getItem('myUsername');
if (!myUsername) {
    myUsername = prompt('Enter your name:');
    // TODO: check that the user doesn't already exist in the room            
    window.localStorage.setItem('myUsername', myUsername);
}

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: window['FIREBASE_API_KEY'],
    authDomain: "multi-waldo.firebaseapp.com",
    databaseURL: "https://multi-waldo-default-rtdb.firebaseio.com",
    projectId: "multi-waldo",
    storageBucket: "multi-waldo.appspot.com",
    messagingSenderId: "1004459203213",
    appId: "1:1004459203213:web:bef8c615d69f315c5920c4"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const annosRef = database.ref().child('001-annos');
const miceRef = database.ref().child('001-mice');

annosRef.once('value', snap => {
    // debugger;
    snap.forEach(item => {
        // debugger;
        if (item.key === myUsername) {
            return;
        }
        //cb('add', item.key, item.val());
    });
});

miceRef.on('value', snap => {
    snap.forEach((item) => {
        if (item.key === myUsername) {
            // return;
        }

        updateUserPosition(item.key, item.val().x, item.val().y);
    });
});

// console.log('send position');
// if (!myUsername) {
//     return;
// }
miceRef
    .child(myUsername)
    .set({ id: myUsername, x: 10, y: 10 });


new ScrollZoom($('#imageContainer'), 9, 0.1);

const updateUserPosition = (userId, x, y) => {
    let png;
    if (users[userId]) {
        const user = users[userId];
        user.x = x;
        user.y = y;
        png = user.png;
    } else {
        png = document.createElement('img');
        png.setAttribute('class', 'mouse-pointer');
        document.body.appendChild(png);
        
        users[userId] = {
            x,
            y,
            png
        };

        sha256(userId).then(hash => {
            const uintArray = new Uint8Array(hash);
            const cursor = CURSORS[uintArray[0] % CURSORS.length];
            png.setAttribute('src', cursor);
        });
    }

    png.style.left = `${x * window['theScale']}px`;
    png.style.top = `${y * window['theScale']}px`;
};

// addOtherUser('bbb', 50, 50);

const theImage = document.getElementById('theImage');
theImage.addEventListener('mousemove', e => {
    miceRef
        .child(myUsername)
        .set({ id: myUsername, x: e.offsetX, y: e.offsetY });

});
setInterval(() => {

}, 1000);