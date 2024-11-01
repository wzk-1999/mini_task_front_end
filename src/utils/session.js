import Cookies from "js-cookie";

const SESSION_COOKIE_NAME = "sessionId";
const SESSION_EXPIRATION = 1; // 1 hour

export const getSessionId = () => {
  let sessionId = Cookies.get(SESSION_COOKIE_NAME);
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    Cookies.set(SESSION_COOKIE_NAME, sessionId, {
      expires: SESSION_EXPIRATION,
    });
  }
  return sessionId;
};
