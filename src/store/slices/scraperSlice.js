import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { getSessionId } from "../../utils/session";
import { SSE } from "sse.js";
import { addMessageToQueue } from "../../utils/messageQueueUtils";
import cleanProfileString from "../../utils/markdownUtils";

let storeAPI;

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Utility function to generate unique IDs
const generateUniqueId = () => {
  return "id-" + Math.random().toString(36).substr(2, 9);
};

export const setStoreAPI = (api) => {
  storeAPI = api;
};

export const fetchQuestions = createAsyncThunk(
  "scraper/fetchQuestions",
  async (url, { dispatch, rejectWithValue }) => {
    try {
      const sessionId = getSessionId();
      Cookies.set("sessionId", sessionId, { expires: 1 });

      const sse = new SSE(`${BACKEND_URL}/api/v1/scrape_by_url`, {
        method: "POST",
        payload: JSON.stringify({ url }),
        headers: {
          "Content-Type": "application/json",
          "Session-ID": sessionId,
        },
      });

      sse.onmessage = (event) => {
        const data = JSON.parse(event.data);

        dispatch({ type: "scraper/stopLoading" });

        if (data.message) {
          // Initialize questions with a unique ID
          dispatch(
            scraperSlice.actions.setQuestion([
              { id: generateUniqueId(), content: "" },
            ])
          );
          addMessageToQueue(
            data.message,
            0,
            storeAPI,
            scraperSlice.actions.updateQuestionContent
          );
        } else if (data.profile) {
          // Initialize profile with the url
          const cleanProfile = cleanProfileString(data.profile);
          dispatch(scraperSlice.actions.setClassificationResult(cleanProfile));
          // console.log(cleanProfile);
        }
      };

      sse.onerror = (error) => {
        console.error("SSE Error:", error);
        dispatch({ type: "scraper/stopLoading" });
        dispatch({
          type: "scraper/setError",
          payload: "Failed to connect to the server.",
        });
      };

      sse.stream();
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const submitUserSelection = createAsyncThunk(
  "scraper/submitAnswer",
  async (selectedOptions, { dispatch, rejectWithValue }) => {
    try {
      const sessionId = Cookies.get("sessionId");
      // console.log(
      //   JSON.stringify({
      //     selectedOptions,
      //   })
      // );
      const sse = new SSE(`${BACKEND_URL}/api/v1/submit_answer`, {
        method: "POST",
        payload: JSON.stringify({
          selectedOptions,
        }),
        headers: {
          "Content-Type": "application/json",
          "Session-ID": sessionId,
        },
      });

      sse.onmessage = (event) => {
        const data = JSON.parse(event.data);
        dispatch({ type: "scraper/stopLoading" });
        const currentQuestionsLength =
          storeAPI.getState().scraper.questions.length;
        if (data.message) {
          // Initialize questions with a unique ID
          dispatch(
            scraperSlice.actions.setQuestion([
              { id: generateUniqueId(), content: "" },
            ])
          );
          addMessageToQueue(
            data.message,
            currentQuestionsLength - 1,
            storeAPI,
            scraperSlice.actions.updateQuestionContent
          );
        } else if (data.profile) {
          // Initialize profile with the url
          const cleanProfile = data.profile.replace(/##\d+\$\$/, "");
          const currentClassificationResult =
            storeAPI.getState().scraper.classificationResult;
          const updatedClassificationResult = currentClassificationResult
            ? `${currentClassificationResult}，${cleanProfile}`
            : cleanProfile;
          dispatch(
            scraperSlice.actions.setClassificationResult(
              updatedClassificationResult
            )
          );
          // console.log(cleanProfile);
        }
      };

      sse.onerror = (error) => {
        console.error("SSE Error:", error);
      };

      sse.stream();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const scraperSlice = createSlice({
  name: "scraper",
  initialState: {
    url: "",
    questions: [],
    classificationResult: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUrl(state, action) {
      state.url = action.payload;
    },
    setQuestion(state, action) {
      state.questions = action.payload;
    },
    setClassificationResult(state, action) {
      state.classificationResult = action.payload;
    },
    updateQuestionContent(state, action) {
      const { content, index } = action.payload;
      if (state.questions[index]) {
        state.questions[index].content = content;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload.map((question) => ({
          ...question,
          id: generateUniqueId(), // Add unique ID to each question
        }));
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitUserSelection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitUserSelection.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload.map((question) => ({
          ...question,
          id: generateUniqueId(), // Add unique ID to each question
        }));
      })
      .addCase(submitUserSelection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase("scraper/stopLoading", (state) => {
        state.loading = false;
      });
  },
});

export const { setUrl, setClassificationResult, updateQuestionContent } =
  scraperSlice.actions;

export default scraperSlice.reducer;
