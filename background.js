
let user_signed_in = false;
var user_data = {
    id: "",
    email: "",
    given_name: "",
    picture: ""
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === 'is_user_signed_in') {
        sendResponse({
            status: 'success',
            payload: user_signed_in
        });
    } else if (request.message === 'sign_out') {
        user_signed_in = false
        user_data = {
            id: "",
            email: "",
            given_name: "",
            picture: ""
        }
        sendResponse({ status: 'success' });
    } else if (request.message === 'sign_in') {
        user_signed_in = true
        sendResponse({ status: 'success' });
    }

    return true;
});

chrome.runtime.onMessage.addListener((msg, sender, response) => {
    
    if(msg.command == "fetch"){
        user_data = msg.payload
    }else if (msg.command == "getUserData"){
        response({
            type: "result",
            status: "success",
            data: user_data,
            request: msg
        });
    }
    return true
})
