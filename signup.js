
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
        signInSuccessWithAuthResult: (authResult) => {
            var user_data = {}
            if(authResult.additionalUserInfo.providerId === "github.com"){
                user_data = {
                    id: authResult.additionalUserInfo.profile.id,
                    email: authResult.user.email,
                    given_name: authResult.additionalUserInfo.username,
                    picture: authResult.user.photoURL
                }
            }else{
                user_data = {
                    id: authResult.additionalUserInfo.profile.id,
                    email: authResult.additionalUserInfo.profile.email,
                    given_name: authResult.additionalUserInfo.profile.given_name,
                    picture: authResult.additionalUserInfo.profile.picture
                }
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
    signInSuccessUrl: 'https://oienndfoecflnmgocpgmbhmkpoakcfmn.chromiumapp.org/',
    signInOptions: [
        // User sign in options 
        {
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            customParameters: {
                prompt: 'select_account'
            }
        },
        {
            provider: firebase.auth.GithubAuthProvider.PROVIDER_ID,
            customParameters: {
                prompt: 'select_account'
            }
        },
    ],
};

ui.start('#sign_in_options', uiConfig);


function turnOnLight(){
    document.body.style.backgroundColor = "#fff"
    const highlightedItems = document.querySelectorAll(".text_class");
    highlightedItems.forEach(function(userItem) {
        userItem.className = userItem.className.replace("text-light","text-dark")
    });
    const highlightedItems_bg = document.querySelectorAll(".bg-dark");
    highlightedItems_bg.forEach(function(userItem) {
        userItem.className = userItem.className.replace("bg-dark","bg-light")
    });
}

function turnOffLight(){
    document.body.style.backgroundColor = "rgb(20, 20, 20)"
    const highlightedItems = document.querySelectorAll(".text_class");
    highlightedItems.forEach(function(userItem) {
        userItem.className = userItem.className.replace("text-dark","text-light")
    });
    const highlightedItems_bg = document.querySelectorAll(".bg-light");
    highlightedItems_bg.forEach(function(userItem) {
        userItem.className = userItem.className.replace("bg-light","bg-dark")
    });
}

if(localStorage.getItem('theme') === "light" || localStorage.getItem('theme') == ''){
    turnOnLight()
}else{
    turnOffLight()
}