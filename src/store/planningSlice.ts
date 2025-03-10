// src/store/planningSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface RawCalcRow {
  id?: string;
  Store: string;
  SKU: string;
  Week: string;
  "Sales Units": number;
  // You can optionally include calculated fields if needed:
  "Sales Dollars"?: number;
  "GM Dollars"?: number;
  "GM %"?: number;
}

interface PlanningState {
  data: RawCalcRow[];
}

const initialState: PlanningState = {
  data: []
};

const planningSlice = createSlice({
  name: "planning",
  initialState,
  reducers: {
    setPlanning: (state, action: PayloadAction<RawCalcRow[]>) => {
      state.data = action.payload;
    },
    updatePlanningRow: (state, action: PayloadAction<RawCalcRow>) => {
      const updated = action.payload;
      // Find the row that has the same 'id'
      // const index = state.data.findIndex((row) => row.Store === updated);
      // if (index >= 0) {
      //   state.data[index] = updated;
      // }
    }
  }
});

export const { setPlanning, updatePlanningRow } = planningSlice.actions;
export default planningSlice.reducer;
