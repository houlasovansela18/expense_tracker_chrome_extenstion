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
    if (response.data != undefined){
        user_info = response.data
        parseUserData(user_info);
    }else{
        chrome.runtime.sendMessage({ message: 'sign_out' },() => {
            window.location.replace('./popup.html');
        })
    }
});

window.onclick = function(event) {
    var target = event.target ;
    if(target.matches('.remove_history')) {
        firebase.database().ref('/user_info/'+ user_info.id +"/"+ target.id).remove()
        parseUserData(user_info)
    }
}

$(document).ready(function() {

    document.querySelector("#logout").addEventListener('click', () => {
        chrome.runtime.sendMessage({ message: 'sign_out' },() => {
            window.location.replace('./signup.html');
        })
    })
    document.querySelector("#clear_all").addEventListener('click', () => {
        firebase.database().ref('/user_info/'+ user_info.id).remove()
        parseUserData(user_info)
    })
    document.querySelector("#income_button").addEventListener('click', () => {
        if (validate_input()){
            const d = new Date();
            try {
                firebase.database().ref('/user_info/'+ user_info.id).push().set({
                    amount: document.getElementById('amount').value,
                    date: d.toDateString(),
                    description: document.getElementById('description').value,
                    type: "income"
                });
            } catch (error) {
                console.log("error:",e);
            }
            document.getElementById('amount').value = '';
            document.getElementById('description').value = '';
            parseUserData(user_info)
        }
    })
    
    document.querySelector("#expense_button").addEventListener('click', () => {
        if(validate_input()){
            const d = new Date();
            try {
                firebase.database().ref('/user_info/'+ user_info.id).push().set({
                    amount: document.getElementById('amount').value,
                    date: d.toDateString(),
                    description: document.getElementById('description').value,
                    type: "expense"
                });
            } catch (error) {
                console.log("error:",e);
            }
            document.getElementById('amount').value = '';
            document.getElementById('description').value = '';
            parseUserData(user_info)
        }
    })
});

function validate_input(){
    if (document.getElementById("description").value != ''){
        if(document.getElementById("amount").value != ''){
            return true
        }else{
            $("#amount_div").effect("shake",{ direction: "left", times: 2, distance: 2}, 200);
        }
    }else{
        $("#description_div").effect("shake",{ direction: "left", times: 2, distance: 2}, 200);
    }
}

var parseUserData = function(user_credential_data){
    try{
        firebase.database().ref('/user_info/'+ user_credential_data.id).orderByChild('date').once('value', (snapshot) =>{
            if (snapshot.val()){
                var historyList = ""
                var total_income = 0
                var total_expense = 0
                var snapshot_length = 0
                snapshot.forEach((childSnapshot) => {
                    snapshot_length+=1
                    var history = childSnapshot.val();
                    var text_color = "text-light"
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
                    document.getElementById("balance_div").className = "pb-2 text-center display-2 fw-bold text-danger"
                }else{
                    document.getElementById("balance_div").className = "pb-2 text-center display-2 fw-bold text-light"
                }
                if (snapshot_length > 0){
                    document.getElementById("clear_all").innerHTML = '<span class="text-light fw-lighter" type="button">clear all</span>'
                }
            }else{
                document.getElementById("clear_all").innerHTML = '<span class="text-light fw-lighter" type="button"></span>'
                document.getElementById("history_display").innerHTML = 'No user history'
            }
        });
        document.getElementById("user_picture").src = user_credential_data.picture;
        document.getElementById("balance_label").innerHTML = user_credential_data.given_name+"'s BALANCE"
    }catch(e){
        console.log("Something error while trying accessing firebase",e);
    }
}



