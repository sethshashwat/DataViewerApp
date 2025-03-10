// src/components/DataImporter.tsx
import React from "react";
import * as XLSX from "xlsx";
import { useAppDispatch } from "../store";
import { setStores } from "../store/storesSlice";
import { setSkus } from "../store/skusSlice";
import { setPlanning, RawCalcRow } from "../store/planningSlice";
import { setCalendar } from "../store/calendarSlice";
import { nanoid } from "nanoid";

const DataImporter: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });

      // ----- 1. Parse STORES sheet -----
      let storesData: any[] = [];
      let storeMap = new Map<string, any>();
      const storesSheet = workbook.Sheets["Stores"];
      if (storesSheet) {
        const storesJson = XLSX.utils.sheet_to_json(storesSheet, { defval: "" });
        storesData = storesJson.map((row: any) => ({
          id: row.ID?.toString() || nanoid(),
          name: row.Label,
          city: row.City,
          state: row.State
        }));
        storesData.forEach((store) => {
          storeMap.set(store.id, store);
        });
        dispatch(setStores(storesData));
      }

      // ----- 2. Parse SKUs sheet -----
      let skusData: any[] = [];
      let skuMap = new Map<string, any>();
      const skusSheet = workbook.Sheets["SKUs"];
      if (skusSheet) {
        const skusJson = XLSX.utils.sheet_to_json(skusSheet, { defval: "" });
        skusData = skusJson.map((row: any) => ({
          id: row.ID?.toString() || nanoid(),
          name: row.Label,
          price: parseFloat(row.Price) || 0,
          cost: parseFloat(row.Cost) || 0
        }));
        skusData.forEach((sku) => {
          skuMap.set(sku.id, sku);
        });
        dispatch(setSkus(skusData));
      }

      const calcSheet = workbook.Sheets["Calculations"];
      if (calcSheet) {
        const calcJson = XLSX.utils.sheet_to_json(calcSheet, { defval: "" });
        const planningData: RawCalcRow[] = calcJson.map((row: any) => ({
          Store: row.Store || "",
          SKU: row.SKU || "",
          Week: row.Week || "",
          "Sales Units": parseFloat(row["Sales Units"]) || 0,
          "Sales Dollars": parseFloat(row["Sales Dollars"]) || 0,
          "Cost Dollars": parseFloat(row["Cost Dollars"]) || 0,
          "GM Dollars": parseFloat(row["GM Dollars"]) || 0,
          "GM %": parseFloat(row["GM %"]) || 0
        }));
        dispatch(setPlanning(planningData));
      };

      // ----- 4. Parse CALENDER sheet -----
      // This sheet must contain at least two columns: "Week Label" and "Month Label".
      const calSheet = workbook.Sheets["Calendar"];
      if (calSheet) {
        const calJson = XLSX.utils.sheet_to_json(calSheet, { defval: "" });
        const calendarData = calJson.map((row: any) => ({
          weekLabel: row["Week Label"]?.toString() || "",
          monthLabel: row["Month Label"]?.toString() || ""
        }));
        dispatch(setCalendar(calendarData));
      }

      // Parse the "Planning" sheet
      const planningSheet = workbook.Sheets["Planning"];
      if (planningSheet) {
        const planningJson = XLSX.utils.sheet_to_json(planningSheet, { defval: "" });
        const planningData: RawCalcRow[] = planningJson.map((row: any) => ({
          Store: row.Store || "",
          SKU: row.SKU || "",
          Week: row.Week || "",
          "Sales Units": parseInt(row["Sales Units"]) || 0
        }));
        dispatch(setPlanning(planningData));
      }

    };

    reader.readAsBinaryString(file);
  };

  return (
    <div style={{ border: "1px dashed #ccc", padding: "1rem", marginBottom: "1rem" }}>
      <h3>Import Excel Data</h3>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <p>Select your Excel file to import.</p>
    </div>
  );
};

export default DataImporter;
