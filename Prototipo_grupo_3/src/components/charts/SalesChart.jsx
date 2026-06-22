import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCurrency } from '../../utils/currency.js';

export function SalesChart({ data }) {
  const average = data.length
    ? data.reduce((sum, item) => sum + Number(item.sales || 0), 0) / data.length
    : 0;

  return (
    <div className="chart-box sales-chart-premium">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 16, right: 8, left: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1783e4" stopOpacity={0.34} />
              <stop offset="62%" stopColor="#57cc99" stopOpacity={0.10} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="salesStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#025ba4" />
              <stop offset="72%" stopColor="#1783e4" />
              <stop offset="100%" stopColor="#57cc99" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#e6ece7" strokeDasharray="4 6" vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tick={{ fill: '#75827a', fontSize: 9, fontWeight: 700 }}
          />
          <YAxis hide domain={[0, 'dataMax + 140']} />
          <ReferenceLine y={average} stroke="#57cc99" strokeDasharray="5 5" strokeOpacity={0.62} />
          <Tooltip cursor={{ stroke: '#1783e4', strokeDasharray: '3 4', strokeOpacity: 0.42 }} content={<PremiumTooltip />} />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="url(#salesStroke)"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="url(#salesFill)"
            dot={{ r: 3, fill: '#ffffff', stroke: '#1783e4', strokeWidth: 2 }}
            activeDot={{ r: 5, fill: '#57cc99', stroke: '#ffffff', strokeWidth: 3 }}
            animationDuration={850}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function PremiumTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="sales-chart-tooltip">
      <span>{label}</span>
      <strong>{formatCurrency(payload[0].value)}</strong>
    </div>
  );
}
