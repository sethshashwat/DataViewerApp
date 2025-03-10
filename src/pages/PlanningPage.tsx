// src/pages/PlanningPage.tsx

import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ColGroupDef, CellStyle } from "ag-grid-community";
import { useAppSelector, useAppDispatch } from "../store";
import { updatePlanningRow, RawCalcRow } from "../store/planningSlice";
import { Store } from "../store/storesSlice";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

interface PlanningRow {
  id: string;
  storeName: string;
  skuName: string;
  price: number;
  cost: number;
  [key: string]: any; // dynamic fields like w01_units, w01_salesDollars, etc.
}

function pivotPlanningData(
  rawData: RawCalcRow[],
  skuData: { id: string; name: string; price: number; cost: number }[],
  storeMap: Map<string, string>
): PlanningRow[] {
  const skuMap = new Map<string, { price: number; cost: number; name: string }>();
  skuData.forEach((sku) => {
    skuMap.set(sku.id, { price: sku.price, cost: sku.cost, name: sku.name });
  });

  const pivot: Record<string, PlanningRow> = {};
  rawData.forEach((row) => {
    // Look up the store label using row.Store (store ID)
    const storeLabel = storeMap.get(row.Store) || row.Store;
    const key = `${storeLabel}||${row.SKU}`;
    if (!pivot[key]) {
      const skuRec = skuMap.get(row.SKU) || { price: 0, cost: 0, name: row.SKU };
      pivot[key] = {
        id: key,
        storeName: storeLabel, // use store label instead of store ID
        skuName: skuRec.name,
        price: skuRec.price,
        cost: skuRec.cost,
      };
    }
    // Normalize week label, e.g. "W01" becomes "w01"
    const normWeek = row.Week.replace(/\s+/g, "").toLowerCase();
    const units = row["Sales Units"] || 0;
    pivot[key][`${normWeek}_units`] = units;
    const salesDollars = units * pivot[key].price;
    pivot[key][`${normWeek}_salesDollars`] = salesDollars;
    const gmDollars = salesDollars - units * pivot[key].cost;
    pivot[key][`${normWeek}_gmDollars`] = gmDollars;
    const gmPercent = salesDollars ? gmDollars / salesDollars : 0;
    pivot[key][`${normWeek}_gmPercent`] = gmPercent;
  });
  return Object.values(pivot);
}

// Formatter and style functions
function currencyFormatter(params: any) {
  const val = params.value || 0;
  return val.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
function percentFormatter(params: any) {
  const val = params.value || 0;
  return (val * 100).toFixed(2) + "%";
}
function gmPercentCellStyle(params: any): CellStyle {
  const val = params.value || 0;
  if (val >= 0.4) {
    return { backgroundColor: "green", color: "#fff" };
  } else if (val >= 0.1) {
    return { backgroundColor: "yellow", color: "inherit" };
  } else if (val >= 0.05) {
    return { backgroundColor: "orange", color: "inherit" };
  } else {
    return { backgroundColor: "red", color: "#fff" };
  }
}

// Manual grouping: define month groups that map weeks to months
// For example, February groups w01 to w04, March groups w05 to w08, etc.
const MONTH_GROUPS: Record<string, string[]> = {
  Feb: ["w01", "w02", "w03", "w04"],
  Mar: ["w05", "w06", "w07", "w08", "w09"],
  Apr: ["w10", "w11", "w12", "w13"],
  May: ["w14", "w15", "w16", "w17"],
  Jun: ["w18", "w19", "w20", "w21", "w22"],
  Jul: ["w23", "w24", "w25", "w26"],
  Aug: ["w27", "w28", "w29", "w30"],
  Sept: ["w31", "w32", "w33", "w34", "w35"],
  Oct: ["w36", "w37", "w38", "w39"],
  Nov: ["w40", "w41", "w42", "w43"],
  Dec: ["w44", "w45", "w46", "w47", "w48"],
  Jan: ["w49", "w50", "w51", "w52"],
};

const PlanningPage: React.FC = () => {
  const dispatch = useAppDispatch();

  // Get raw planning data from Redux (from the "Planning" sheet)
  const rawPlanningData = useAppSelector((state) => state.planning.data) as RawCalcRow[];
  // console.log(rawPlanningData)
  // Get SKU data from Redux (from the "SKUs" sheet)
  const skuData = useAppSelector((state) => state.skus.data) as { id: string; name: string; price: number; cost: number }[];
  console.log(skuData)
  // Get store records from Redux (from the "Store" sheet with columns "ID" and "Label")
  const storeRecords = useAppSelector((state) => state.stores.data) as Store[];

  // Build a map from store ID to store label
  const storeMap = useMemo(() => {
    const map = new Map<string, string>();
    storeRecords.forEach((s) => {
      map.set(s.id, s.name);
    });
    return map;
  }, [storeRecords]);

  // Pivot the data using the storeMap (to get storeName from label)
  const pivotData: PlanningRow[] = useMemo(
    () => pivotPlanningData(rawPlanningData, skuData, storeMap),
    [rawPlanningData, skuData, storeMap]
  );

  // Build column definitions: first two fixed columns, then groups per month (from MONTH_GROUPS)
  type PColDef = ColDef<PlanningRow>;
  type PColGroupDef = ColGroupDef<PlanningRow>;

  const columnDefs = useMemo<(PColDef | PColGroupDef)[]>(() => {
    const baseCols: (PColDef | PColGroupDef)[] = [
      { headerName: "Store", field: "storeName", pinned: "left", width: 150 },
      { headerName: "SKU", field: "skuName", pinned: "left", width: 200 }
    ];

    // For each month in MONTH_GROUPS, create a group with sub-groups for each week
    Object.entries(MONTH_GROUPS).forEach(([month, weeks]) => {
      const weekChildren = weeks.map((wk) => ({
        headerName: wk.toUpperCase(), // e.g., "W01"
        children: [
          {
            headerName: "Sales Units",
            field: `${wk}_units`,
            editable: true,
            valueParser: (params: { newValue: string; }) => parseInt(params.newValue) || 0
          },
          {
            headerName: "Sales Dollars",
            field: `${wk}_salesDollars`,
            valueFormatter: currencyFormatter,
            cellStyle: { backgroundColor: "#f0f0f0" }
          },
          {
            headerName: "GM Dollars",
            field: `${wk}_gmDollars`,
            valueFormatter: currencyFormatter,
            cellStyle: { backgroundColor: "#f0f0f0" }
          },
          {
            headerName: "GM %",
            field: `${wk}_gmPercent`,
            valueFormatter: percentFormatter,
            cellStyle: gmPercentCellStyle
          }
        ]
      }));
      baseCols.push({
        headerName: month,
        children: weekChildren
      });
    });

    return baseCols;
  }, []);

  // Recalculate derived fields when a user edits Sales Units
  const onCellValueChanged = (params: any) => {
    if (params.colDef.field && params.colDef.field.endsWith("_units")) {
      const updatedRow = { ...params.data };
      const prefix = params.colDef.field.replace("_units", "");
      const units = Number(updatedRow[params.colDef.field]) || 0;
      const price = updatedRow.price || 1000;
      const cost = updatedRow.cost || 1000;
      const salesDollars = units * price;
      updatedRow[`${prefix}_salesDollars`] = salesDollars;
      const gmDollars = salesDollars - units * cost;
      updatedRow[`${prefix}_gmDollars`] = gmDollars;
      const gmPercent = salesDollars ? gmDollars / salesDollars : 0;
      updatedRow[`${prefix}_gmPercent`] = gmPercent;
      // console.log(updatedRow);
      dispatch(updatePlanningRow(updatedRow as RawCalcRow));
    }
  };

  return (
    <div style={{ width: "100%", height: "calc(100vh - 100px)" }}>
      <h2 style={{ marginBottom: "1rem" }}>Planning</h2>
      <div className="ag-theme-alpine" style={{ width: "100%", height: "100%" }}>
        <AgGridReact<PlanningRow>
          rowData={pivotData}
          columnDefs={columnDefs}
          onCellValueChanged={onCellValueChanged}
          defaultColDef={{ resizable: true }}
        />
      </div>
    </div>
  );
};

export default PlanningPage;
