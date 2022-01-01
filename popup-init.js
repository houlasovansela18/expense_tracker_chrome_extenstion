function init() {
    chrome.runtime.sendMessage({ message: 'is_user_signed_in' }, 
        function (response) {
            if (response.status === 'success' && response.payload) {
                window.location.replace('./main.html');
            }
        })
}

init();