(function() {
    function containsPersian(text) {
        const persianRegex = /[\u0600-\u06FF]/;
        return persianRegex.test(text);
    }

    function setDirection(element) {
        if (containsPersian(element.textContent)) {
            element.style.direction = 'rtl';
            element.style.textAlign = 'right';
        } else {
            element.style.direction = 'ltr';
            element.style.textAlign = 'left';
        }
    }

    function processExistingMessages() {
        const chatMessages = document.querySelectorAll('[data-element-id="chat-space-middle-part"] div');
        chatMessages.forEach(setDirection);
    }

    function observeNewMessages() {
        const chatContainer = document.querySelector('[data-element-id="chat-space-middle-part"]');
        if (!chatContainer) return;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        setDirection(node);
                    }
                });
            });
        });

        observer.observe(chatContainer, { childList: true, subtree: true });
    }

    function waitForChatContainer() {
        const checkExist = setInterval(() => {
            const chatContainer = document.querySelector('[data-element-id="chat-space-middle-part"]');
            if (chatContainer) {
                clearInterval(checkExist);
                processExistingMessages();
                observeNewMessages();
            }
        }, 1000);
    }

    waitForChatContainer();
})();
