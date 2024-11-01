import { createSlice } from "@reduxjs/toolkit";
import { getSessionId } from "../../utils/session";

const sessionSlice = createSlice({
  name: "session",
  initialState: {
    sessionId: getSessionId(),
  },
  reducers: {},
});

export default sessionSlice.reducer;
