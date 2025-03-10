// src/store/skusSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

export interface Sku {
  id: string;
  name: string;
  price: number;
  cost: number;
}

interface SkusState {
  data: Sku[];
}

const initialState: SkusState = {
  data: [
    { id: nanoid(), name: "Cotton Polo Shirt", price: 19.99, cost: 8.5 },
    { id: nanoid(), name: "Fleece-lined Parka", price: 49.99, cost: 20 }
  ]
};

const skusSlice = createSlice({
  name: "skus",
  initialState,
  reducers: {
    addSku: (state, action: PayloadAction<{ name: string; price: number; cost: number }>) => {
      const { name, price, cost } = action.payload;
      state.data.push({ id: nanoid(), name, price, cost });
    },

    removeSku: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter((sku) => sku.id !== action.payload);
    },
   
    setSkus: (state, action: PayloadAction<Sku[]>) => {
      state.data = action.payload;
    },

    updateSku: (
      state,
      action: PayloadAction<{
        id: string;
        name: string;
        price: number;
        cost: number;
      }>
    ) => {
      const { id, name, price, cost } = action.payload;
      const existing = state.data.find((s) => s.id === id);
      if (existing) {
        existing.name = name;
        existing.price = price;
        existing.cost = cost;
      }
    }
  }
});

export const { addSku, removeSku, setSkus, updateSku } = skusSlice.actions;
export default skusSlice.reducer;
