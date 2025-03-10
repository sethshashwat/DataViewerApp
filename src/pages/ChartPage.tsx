// src/pages/ChartPage.tsx
import React, { useState, useMemo } from "react";
import { useAppSelector } from "../store";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { Store } from "store/storesSlice";


const ChartPage: React.FC = () => {
  // 1. State for selected store ID
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");

  // 2. Grab store records from Redux
  //    e.g. each store = { id: "ST035", label: "Houston Harvest Market" }
  const storeRecords = useAppSelector((state) => state.stores.data) as Store[];

  // 3. Grab raw planning data from Redux
  const rawPlanningData = useAppSelector((state) => state.planning.data) as {
    Store: string;
    SKU: string;
    Week: string;
    "Sales Units": number;
  }[];

  // 4. Grab SKU data from Redux
  const skuData = useAppSelector((state) => state.skus.data) as {
    id: string;
    name: string;
    price: number;
    cost: number;
  }[];

  // 5. List or set of weeks in your data
  //    We can glean from rawPlanningData, or define a static list if you know them.
  const weeks = useMemo(() => {
    const set = new Set<string>();
    rawPlanningData.forEach((row) => {
      set.add(row.Week);
    });
    // Sort them numerically, e.g. W01, W02, ...
    const array = Array.from(set);
    array.sort((a, b) => {
      // e.g. "W01" => 1, "W07" => 7
      const aNum = parseInt(a.replace(/\D+/g, ""), 10) || 0;
      const bNum = parseInt(b.replace(/\D+/g, ""), 10) || 0;
      return aNum - bNum;
    });
    return array;
  }, [rawPlanningData]);

  // 6. Build chart data for the selected store
  //    For each week, sum GM Dollars & Sales Dollars across all SKUs for that store
  //    GM Dollars = (units * price) - (units * cost)
  //    Sales Dollars = units * price
  //    GM% = GM Dollars / Sales Dollars
  const chartData = useMemo(() => {
    if (!selectedStoreId) return [];

    // Filter for rows matching that store ID
    const storeRows = rawPlanningData.filter((r) => r.Store === selectedStoreId);

    return weeks.map((week) => {
      let sumGMDollars = 0;
      let sumSalesDollars = 0;

      // sum up across all SKUs for that store & week
      storeRows.forEach((r) => {
        if (r.Week === week) {
          // find the SKU in skuData
          const skuRec = skuData.find((sku) => sku.id === r.SKU);
          const price = skuRec ? skuRec.price : 0;
          const cost = skuRec ? skuRec.cost : 0;
          const units = r["Sales Units"] || 0;

          const salesDollars = units * price;
          const gmDollars = salesDollars - (units * cost);

          sumSalesDollars += salesDollars;
          sumGMDollars += gmDollars;
        }
      });

      const gmPercent = sumSalesDollars ? sumGMDollars / sumSalesDollars : 0;
      return {
        week,
        gmDollars: sumGMDollars,
        gmPercent
      };
    });
  }, [selectedStoreId, rawPlanningData, skuData, weeks]);

  // 7. Handle store selection
  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStoreId(e.target.value);
  };

  return (
    <div style={{ width: "100%", padding: "1rem" }}>
      <h2>Gross Margin Trends</h2>

      {/* Store dropdown */}
      <div style={{ marginBottom: "1rem" }}>
        <label>Select a Store: </label>
        <select value={selectedStoreId} onChange={handleStoreChange}>
          <option value="">-- Choose --</option>
          {storeRecords.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      {selectedStoreId && chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            {/* Left axis for GM Dollars */}
            <YAxis
              yAxisId="left"
              label={{ value: "GM Dollars", angle: -90, position: "insideLeft" }}
            />
            {/* Right axis for GM % */}
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 1]}
              tickFormatter={(val) => (val * 100).toFixed(0) + "%"}
              label={{ value: "GM %", angle: 90, position: "insideRight" }}
            />
            <Tooltip />
            <Legend />

            {/* Bars for GM Dollars */}
            <Bar
              yAxisId="left"
              dataKey="gmDollars"
              fill="#8884d8"
              name="GM Dollars"
              barSize={30}
            />

            {/* Line for GM% */}
            <Line
              yAxisId="right"
              dataKey="gmPercent"
              name="GM %"
              stroke="#82ca9d"
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      ) : (
        <p>Please select a store to see the chart.</p>
      )}
    </div>
  );
};

export default ChartPage;
