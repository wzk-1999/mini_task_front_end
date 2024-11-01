// src/middleware/typingMiddleware.js
import {
  addMessageToQueue,
  startTypingEffect,
} from "../utils/messageQueueUtils";
import { updateQuestionContent } from "../store/slices/scraperSlice";

export const typingMiddleware = (storeAPI) => (next) => (action) => {
  if (action.type === "scraper/startTyping") {
    const { message, currentMessageIndex } = action.payload;
    // 将storeAPI传递给addMessageToQueue和startTypingEffect函数
    addMessageToQueue(
      message,
      currentMessageIndex,
      storeAPI,
      updateQuestionContent
    );
    startTypingEffect(
      currentMessageIndex,
      storeAPI.dispatch,
      updateQuestionContent,
      storeAPI
    );
  }
  return next(action);
};
