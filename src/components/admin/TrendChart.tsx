"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

type ChartData = {
  date: string;
  visites: number;
};

export default function TrendChart({ data }: { data: ChartData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center text-sm text-foreground/40">
        Aucune donnée disponible.
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorVisites" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6d5dfc" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6d5dfc" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="rgba(255,255,255,0.2)" 
            fontSize={12} 
            tickMargin={10} 
            axisLine={false}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.2)" 
            fontSize={12} 
            axisLine={false} 
            tickLine={false} 
            allowDecimals={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "rgba(10,10,15,0.9)", 
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
            }} 
            itemStyle={{ color: "#6d5dfc" }}
          />
          <Area 
            type="monotone" 
            dataKey="visites" 
            stroke="#6d5dfc" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorVisites)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
