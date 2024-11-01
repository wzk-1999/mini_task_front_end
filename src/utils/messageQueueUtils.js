// src/utils/messageQueueUtils.js
const messageQueue = [];
let typingInterval = null;
let currentIndex = 0;

export const addMessageToQueue = (
  message,
  currentMessageIndex,
  storeAPI,
  updateQuestionContent
) => {
  messageQueue.push(message);
  if (!typingInterval) {
    startTypingEffect(
      currentMessageIndex,
      storeAPI.dispatch,
      updateQuestionContent,
      storeAPI
    );
  }
};

export const startTypingEffect = (
  currentMessageIndex,
  dispatch,
  updateQuestionContent,
  storeAPI
) => {
  if (messageQueue.length > 0) {
    const fullMessage = messageQueue[0];
    // console.log(fullMessage);
    // Since we can't import store directly
    const questions = storeAPI.getState().scraper.questions;
    let displayedMessage = questions[currentMessageIndex]?.content || "";
    // console.log(displayedMessage);
    let index = displayedMessage.length;
    // console.log(index);

    typingInterval = setInterval(() => {
      if (currentIndex + index < fullMessage.length) {
        displayedMessage += fullMessage[currentIndex + index];
        currentIndex++;
        // Update the Redux store’s latest question with the progressively typed message
        dispatch(
          updateQuestionContent({
            index: currentMessageIndex,
            content: displayedMessage,
          })
        );
      } else {
        clearInterval(typingInterval);
        typingInterval = null;
        messageQueue.shift(); // Remove the fully displayed message from the queue
        currentIndex = 0; // Reset index for the next message
        startTypingEffect(
          currentMessageIndex,
          dispatch,
          updateQuestionContent,
          storeAPI
        );
      }
    }, 50);
  }
};
