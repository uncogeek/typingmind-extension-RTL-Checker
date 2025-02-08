(function() {
 // Function to detect Persian characters in a string
 function containsPersian(text) {
   const persianRegex = /[\u0600-\u06FF]/;
   return persianRegex.test(text);
 }

 // Function to set the text direction of a chat message
 function setDirection(element) {
   if (element && element.textContent) {
     if (containsPersian(element.textContent)) {
       element.style.direction = 'rtl';
       element.style.textAlign = 'right';
     } else {
       element.style.direction = 'ltr';
       element.style.textAlign = 'left';
     }
   }
 }

 // Function to apply direction to all messages
 function applyDirectionToAllMessages() {
   const chatMessages = document.querySelectorAll('[data-element-id="response-block"] .prose p');
   chatMessages.forEach(setDirection);
 }

 // Function to observe new messages
 function observeNewMessages() {
   const chatContainer = document.querySelector('[data-element-id="response-block"]');
   if (!chatContainer) {
     setTimeout(observeNewMessages, 500);
     return;
   }

   const observer = new MutationObserver((mutations) => {
     mutations.forEach((mutation) => {
       if (mutation.type === 'childList') {
         mutation.addedNodes.forEach((node) => {
           if (node.nodeType === Node.ELEMENT_NODE) {
             node.querySelectorAll('p').forEach(setDirection);
           }
         });
       } else if (mutation.type === 'characterData') {
         setDirection(mutation.target.parentElement);
       }
     });
   });

   observer.observe(chatContainer, { 
     childList: true, 
     subtree: true,
     characterData: true
   });
 }

 // Polling function as a fallback
 function pollForNewMessages() {
   setInterval(applyDirectionToAllMessages, 1000);
 }

 // Function to handle URL changes
 function handleURLChange() {
   setTimeout(() => {
     applyDirectionToAllMessages();
     observeNewMessages();
   }, 10);
 }

 // Listen for URL changes using different methods
 
 // Method 1: Using hashchange event
 window.addEventListener('hashchange', handleURLChange);
 
 // Method 2: Using History API
 let lastUrl = location.href;
 new MutationObserver(() => {
   const url = location.href;
   if (url !== lastUrl) {
     lastUrl = url;
     handleURLChange();
   }
 }).observe(document, { subtree: true, childList: true });

 // Initial setup
 document.addEventListener('DOMContentLoaded', () => {
   handleURLChange();
   pollForNewMessages();
 });

 // Also run initial setup immediately in case DOM is already loaded
 if (document.readyState === 'complete' || document.readyState === 'interactive') {
   handleURLChange();
   pollForNewMessages();
 }
})();
