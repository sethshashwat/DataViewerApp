// src/store/calendarSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CalendarEntry {
  weekLabel: string;
  monthLabel: string;
}

interface CalendarState {
  data: CalendarEntry[];
}

const initialState: CalendarState = {
  data: []
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setCalendar: (state, action: PayloadAction<CalendarEntry[]>) => {
      state.data = action.payload;
    }
  }
});

export const { setCalendar } = calendarSlice.actions;
export default calendarSlice.reducer;
