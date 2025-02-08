(function() {
  // Enhanced function to detect Persian characters
  function containsPersian(text) {
    const persianRegex = /[\u0600-\u06FF\uFB8A\u067E\u0686\u06AF\u200C\u200F]/g;
    const persianCharCount = (text.match(persianRegex) || []).length;
    const totalCharCount = text.replace(/\s/g, '').length; // Count non-space characters
    return persianCharCount / totalCharCount > 0.4; // 40% threshold
  }

  // Function to detect English characters
  function containsEnglish(text) {
    const englishRegex = /[a-zA-Z]/g;
    const englishCharCount = (text.match(englishRegex) || []).length;
    const totalCharCount = text.replace(/\s/g, '').length; // Count non-space characters
    return englishCharCount / totalCharCount > 0.5; // 50% threshold
  }

  // Function to set RTL for AI response and all its child elements
  function setRTLForAIResponse() {
    const aiResponseDiv = document.querySelector('[data-element-id="ai-response"]');
    if (aiResponseDiv) {
      const allElements = aiResponseDiv.querySelectorAll('*');
      allElements.forEach(element => {
        if (element.textContent.trim()) {
          setDirection(element);
        }
      });
      // Set the main container to RTL
      aiResponseDiv.style.setProperty('direction', 'rtl', 'important');
    }
  }

  // Function to set the text direction of an element
  function setDirection(element) {
    if (element && element.textContent) {
      const text = element.textContent.trim();
      if (containsPersian(text)) {
        element.style.setProperty('direction', 'rtl', 'important');
        element.style.setProperty('text-align', 'right', 'important');
      } else if (containsEnglish(text)) {
        element.style.setProperty('direction', 'ltr', 'important');
        element.style.setProperty('text-align', 'left', 'important');
      } else {
        // Default to RTL for mixed or non-detected content
        element.style.setProperty('direction', 'rtl', 'important');
        element.style.setProperty('text-align', 'right', 'important');
      }
    }
  }

  // Function to apply direction to all messages
  function applyDirectionToAllMessages() {
    const chatMessages = document.querySelectorAll('[data-element-id="response-block"] .prose');
    chatMessages.forEach(message => {
      const allElements = message.querySelectorAll('*');
      allElements.forEach(element => {
        if (element.textContent.trim()) {
          setDirection(element);
        }
      });
      // Set the main message container to RTL
      message.style.setProperty('direction', 'rtl', 'important');
    });
  }

  // Function to observe new messages and AI response div
  function observeNewContent() {
    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    const observer = new MutationObserver((mutationsList, observer) => {
      for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          const aiResponseDiv = document.querySelector('[data-element-id="ai-response"]');
          if (aiResponseDiv) {
            setRTLForAIResponse();
          }
          applyDirectionToAllMessages();
        }
      }
    });
    observer.observe(targetNode, config);
  }

  // Function to handle URL changes
  function handleURLChange() {
    setTimeout(() => {
      applyDirectionToAllMessages();
      setRTLForAIResponse();
    }, 1000);
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
  function initialSetup() {
    applyDirectionToAllMessages();
    setRTLForAIResponse();
    observeNewContent();
  }

  // Run initial setup when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialSetup);
  } else {
    // DOM is already ready, run setup immediately
    initialSetup();
  }
})();
