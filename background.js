
chrome.runtime.onMessage.addListener(function (request, sender, response) {
    if (request.message === 'is_user_signed_in') {
        var user_signed_in = JSON.parse(localStorage.getItem('user_signed_in'))
        if (user_signed_in != undefined){
            response({
                status: 'success',
                payload: user_signed_in
            });
        }else{
            localStorage.setItem('user_signed_in', false);
        }
    } else if (request.message === 'sign_out') {
        localStorage.setItem('user_signed_in', false);
        var user_data = {}
        localStorage.setItem('user_data', JSON.stringify(user_data));
        response({ status: 'success' });

    } else if (request.message === 'sign_in') {
        localStorage.setItem('user_signed_in', true);
        response({ status: 'success' });
    }
    return true;
});

chrome.runtime.onMessage.addListener((msg, sender, response) => {
    
    if(msg.command == "fetch"){
        localStorage.setItem('user_data', JSON.stringify(msg.payload));
    }else if (msg.command == "getUserData"){
        var user_data = localStorage.getItem('user_data');
        user_data = JSON.parse(user_data)
        response({
            type: "result",
            status: "success",
            data: user_data,
            request: msg
        });
    }
    return true
})

