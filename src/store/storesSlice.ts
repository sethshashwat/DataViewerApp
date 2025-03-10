// src/store/storesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

export interface Store {
  id: string;
  name: string;
  city: string;
  state: string;
}

interface StoresState {
  data: Store[];
}

const initialState: StoresState = {
  data: [
    {
      id: nanoid(),
      name: "Atlanta Outfitters",
      city: "Atlanta",
      state: "GA"
    },
    {
      id: nanoid(),
      name: "Chicago Charm Boutique",
      city: "Chicago",
      state: "IL"
    },
    {
      id: nanoid(),
      name: "Houston Harvest Market",
      city: "Houston",
      state: "TX"
    }
  ]
};

const storesSlice = createSlice({
  name: "stores",
  initialState,
  reducers: {
    addStore: (state, action: PayloadAction<{ name: string; city: string; state: string }>) => {
      const { name, city, state: storeState } = action.payload;
      state.data.push({
        id: nanoid(),
        name,
        city,
        state: storeState
      });
    },

    removeStore: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter((store) => store.id !== action.payload);
    },
   
    setStores: (state, action: PayloadAction<Store[]>) => {
      state.data = action.payload;
    },

    updateStore: (
      state,
      action: PayloadAction<{
        id: string;
        name: string;
        city: string;
        state: string;
      }>
    ) => {
      const { id, name, city, state: storeState } = action.payload;
      const existing = state.data.find((s) => s.id === id);
      if (existing) {
        existing.name = name;
        existing.city = city;
        existing.state = storeState;
      }
    },

    reorderStore: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      if (
        fromIndex < 0 ||
        fromIndex >= state.data.length ||
        toIndex < 0 ||
        toIndex >= state.data.length
      ) {
        return; // out of range, do nothing
      }
      const [removed] = state.data.splice(fromIndex, 1);
      state.data.splice(toIndex, 0, removed);
    },

  }
});

export const { addStore, removeStore, setStores, updateStore, reorderStore } = storesSlice.actions;
export default storesSlice.reducer;
