function init() {
    chrome.runtime.sendMessage({ message: 'is_user_signed_in' }, 
        function (response) {
            var user_signed_in = JSON.parse(localStorage.getItem('user_signed_in'))
            if (response.status === "success" && user_signed_in) {
                window.location.replace('./main.html');
            }
        })
}

init();