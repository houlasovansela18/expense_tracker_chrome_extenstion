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
var user_info = {}

chrome.runtime.sendMessage({command: "getUserData"}, (response) => {
    user_info = response.data
    if (user_info.email != ""){
        parseUserInfo(user_info)
    }else{
        chrome.runtime.sendMessage({ message: 'sign_out' },() => {
            window.location.replace('./popup.html');
        })
    }
});

window.onclick = function(event) {
    var target = event.target ;
    const selected_wallet = $("#wallet_collections :selected").text();
    if(target.matches('.remove_history')) {
        firebase.database().ref(`/user_info/${user_info.id}/${selected_wallet}/${target.id}`).remove()
        parseUserData(selected_wallet)
    }
}

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

$(document).ready(function() {

    if(localStorage.getItem('theme') === "light"){
        turnOnLight()
    }else{
        turnOffLight()
    }

    document.querySelector("#logout").addEventListener('dblclick', () => {
        chrome.runtime.sendMessage({ message: 'sign_out' },() => {
            window.location.replace('./signup.html');
        })
    })
    document.querySelector("#clear_all").addEventListener('click', () => {
        const selected_wallet = $("#wallet_collections :selected").text();
        firebase.database().ref(`/user_info/${user_info.id}/${selected_wallet}/`).remove()
        parseUserData(selected_wallet)
    })
    document.querySelector("#income_button").addEventListener('click', () => {
        const d = new Date();
        const selected_wallet = $("#wallet_collections :selected").text();
        if(validate_input()){
            try {
                firebase.database().ref(`/user_info/${user_info.id}/${selected_wallet}/`).push().set({
                    amount: document.getElementById('amount').value,
                    date: d.toDateString(),
                    description: document.getElementById('description').value,
                    type: "income"
                });
            } catch (error) {
                console.log("error:",error);
            }
            document.getElementById('amount').value = '';
            document.getElementById('description').value = '';
            parseUserData(selected_wallet)
        }
    })
    document.querySelector("#expense_button").addEventListener('click', () => {
        const d = new Date();
        const selected_wallet = $("#wallet_collections :selected").text();
        if(validate_input()){
            try {
                firebase.database().ref(`/user_info/${user_info.id}/${selected_wallet}/`).push().set({
                    amount: document.getElementById('amount').value,
                    date: d.toDateString(),
                    description: document.getElementById('description').value,
                    type: "expense"
                });
            } catch (error) {
                console.log("error:",error);
            }
            document.getElementById('amount').value = '';
            document.getElementById('description').value = '';
            parseUserData(selected_wallet)
        }
    })
    document.querySelector("#wallet_button").addEventListener('click', () => {
        if(validate_input_wallet()){
            $("#wallet_collections").append(new Option(document.getElementById("wallet").value));
        }
        document.getElementById("wallet").value = '';
    })
    $("select").change(function(){
        const selected_wallet = $("#wallet_collections :selected").text();
        parseUserData(selected_wallet)
    })
    $('input:checkbox').change(
        function(){
            if (localStorage.getItem('theme') == "dark"){
                turnOnLight()
                localStorage.setItem("theme","light")
            }else{
                turnOffLight()
                localStorage.setItem("theme","dark")
            }
        });
});

function validate_input(){
    const selected_wallet = $("#wallet_collections :selected").text();
    if(selected_wallet != ''){
        if (document.getElementById("description").value.length >= 4){
            if(document.getElementById("amount").value != ''){
                return true
            }else{
                $("#amount_div").effect("shake",{ direction: "left", times: 2, distance: 2}, 200);
                return false
            }
        }else{
            $("#description_div").effect("shake",{ direction: "left", times: 2, distance: 2}, 200);
            return false
        }
    }else{
        alert("Create or select wallet before add transaction")
    }
    
}

function validate_input_wallet(){
    if(document.getElementById("wallet").value.length >= 4 && document.getElementById("wallet").value.length <= 8){
        return true
    }else{
        $("#wallet_div").effect("shake",{ direction: "left", times: 2, distance: 2}, 200);
        return false
    }
}

var parseUserInfo = function(user_info){

    document.getElementById("user_picture").src = user_info.picture;
    document.getElementById("balance_label").innerHTML = user_info.given_name+"'s BALANCE"
    firebase.database().ref(`/user_info/${user_info.id}/`).once('value', (snapshot) =>{
        if (snapshot.val()){
            var walletList = '<option>select wallet</option>';
            snapshot.forEach((childSnapshot) => {
                walletList += '<option>'+childSnapshot.key+'</option>'
            });
        }else{
            document.getElementById("history_display").innerHTML = 'No user wallet'
        }
        document.getElementById("wallet_collections").innerHTML = walletList
    }); 
}

var parseUserData = function(selected_wallet){
    try{
        firebase.database().ref(`/user_info/${user_info.id}/${selected_wallet}/`).orderByChild('date').once('value', (snapshot) =>{
            if (snapshot.val()){
                var historyList = ""
                var total_income = 0
                var total_expense = 0
                var snapshot_length = 0
                snapshot.forEach((childSnapshot) => {
                    snapshot_length+=1
                    var history = childSnapshot.val();
                    var text_color = "text-success"
                    var li_class = "border-start rounded-start border-success border-3"
                    var amount = parseFloat(history.amount)
                    if(history.type === "expense"){
                        li_class = "border-start rounded-start border-danger border-3"
                        text_color = "text-danger"
                        total_expense += amount
                        amount = (-1) * amount
                    }else{
                        total_income += amount
                    }
                    historyList+='<li class="'+li_class+' ps-3 mb-1" id="'+childSnapshot.key+'">'+
                    '<div class="clearfix">'+
                    '<div class="float-start fs-5 '+text_color+'">'+history.description+'</div>'+
                    '<div class="float-end fs-5 '+text_color+'">'+
                    amount+
                    ' $<span class="ms-3 fs-6 text-danger remove_history" type="button" id="'+childSnapshot.key+'">x</span>'+
                    '</div>'+
                    '</div>'+
                    '<div class="text-secondary">'+
                    history.date+
                    '</div>'+
                    '</li>'
                });
                document.getElementById("history_display").innerHTML = historyList;
                document.getElementById("income").innerHTML = total_income;
                document.getElementById("expense").innerHTML = total_expense;
                var balance_differ = total_income - total_expense;
                balance = Math.abs(balance_differ)
                document.getElementById("balance").innerHTML = balance;
                if(balance_differ < 0){
                    document.getElementById("balance_div").className = "pb-1 text-center display-2 fw-bold text-danger"
                }else{
                    document.getElementById("balance_div").className = "pb-1 text-center display-2 fw-bold text-success"
                }
                if (snapshot_length > 0){
                    document.getElementById("clear_all").innerHTML = '<span class="text-secondary" type="button">clear all</span>'
                }
            }else{
                document.getElementById("clear_all").innerHTML = '<span class="text-secondary" type="button"></span>'
                document.getElementById("history_display").innerHTML = 'No user history'
            }
        });
    }catch(e){
        console.log("Something error while trying accessing firebase",e);
    }
}
