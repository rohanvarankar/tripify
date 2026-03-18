import React from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  YAxis,
  XAxis,
  CartesianGrid,
} from "recharts";
import { format } from "timeago.js";

export default function Chart({ data }) {
  const realData = data?.map((item) => ({
    price: item.totalPrice,
    date: format(item.createdAt),
  }));

  return (
    <div className="w-full bg-white rounded-2xl p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <span className="w-2 h-6 rounded-full bg-indigo-500"></span>
        Revenue Overview
      </h2>
      
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={realData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.9}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

            <XAxis
              dataKey="date"
              tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
              dy={10}
            />

            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${value}`}
            />

            <Tooltip
              cursor={{ fill: '#f8fafc' }}
              content={({ payload }) => {
                if (!payload || payload.length === 0) return null;
                const item = payload[0];
                return (
                  <div className="bg-slate-900 border border-slate-700 shadow-xl rounded-xl p-3 flex flex-col gap-1">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      {item.payload.date}
                    </p>
                    <p className="text-lg font-extrabold text-white">
                      ${item.value?.toLocaleString()}
                    </p>
                  </div>
                );
              }}
            />

            <Bar
              dataKey="price"
              fill="url(#colorRevenue)"
              radius={[6, 6, 0, 0]}
              barSize={32}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}