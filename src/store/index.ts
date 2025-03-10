import { configureStore } from "@reduxjs/toolkit";
import storesReducer from "./storesSlice";
import skusReducer from "./skusSlice";
import planningRow from "./planningSlice";
import calendarReducer from "./calendarSlice"
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";

export const store = configureStore({
  reducer: {
    stores: storesReducer,
    skus: skusReducer,
    planning: planningRow,
    calendar: calendarReducer
  }
});

// Infer the `RootState` and `AppDispatch` types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
