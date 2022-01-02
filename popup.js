
const firebaseConfig = {
    apiKey: "AIzaSyD87VxswmmW2yqUwH1NndVNfpyQp1mXQ1A",
    authDomain: "mydatabase0801.firebaseapp.com",
    databaseURL: "https://mydatabase0801.firebaseio.com",
    projectId: "mydatabase0801",
    storageBucket: "mydatabase0801.appspot.com",
    messagingSenderId: "774056850128",
    appId: "1:774056850128:web:b3caf6b51eea104fe464d5"
};

firebase.initializeApp(firebaseConfig);

// Initialize the FirebaseUI Widget using Firebase.
const ui = new firebaseui.auth.AuthUI(firebase.auth());


const uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {

                const user_data = {
                    id: authResult.additionalUserInfo.profile.id,
                    email: authResult.additionalUserInfo.profile.email,
                    given_name: authResult.additionalUserInfo.profile.given_name,
                    picture: authResult.additionalUserInfo.profile.picture
                }
                chrome.runtime.sendMessage({command: "fetch", payload: user_data}, () => {});
                chrome.runtime.sendMessage({ message: 'sign_in'}, () => {
                    window.location.replace('./main.html');
                });
            return false;
        },
        uiShown: function () {
            document.getElementById('wrapper').style.pointerEvents = 'none';
        }
    },
    signInFlow: 'popup',
    // signInSuccessUrl: '<url-to-redirect-to-on-success>',
    signInOptions: [
        // User sign in options 
        {
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            customParameters: {
                prompt: 'select_account'
            }
        },
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
};

ui.start('#sign_in_options', uiConfig);