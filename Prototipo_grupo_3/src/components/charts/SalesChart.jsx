import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCurrency } from '../../utils/currency.js';

export function SalesChart({ data }) {
  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1783e4" stopOpacity={0.32} />
              <stop offset="95%" stopColor="#1783e4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#e1e2e4" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis hide />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Area type="monotone" dataKey="sales" stroke="#1783e4" strokeWidth={3} fill="url(#salesFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
