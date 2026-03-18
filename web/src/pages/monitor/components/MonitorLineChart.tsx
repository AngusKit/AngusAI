import { useLanguage } from '@/components/LanguageProvider';
import type { ChartDataPointVo } from '@/services/MonitorTypes';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface MonitorLineChartProps {
  title: string;
  range: 'year' | 'month' | 'day';
  selectedYear: string;
  selectedMonth: string;
  selectedDay: string;
  onRangeChange: (v: 'year' | 'month' | 'day') => void;
  onYearChange: (v: string) => void;
  onMonthChange: (v: string) => void;
  onDayChange: (v: string) => void;
  data: ChartDataPointVo[];
  loading?: boolean;
  lineColor?: string;
  lineName: string;
}

export function MonitorLineChart({
  title,
  range,
  selectedYear,
  selectedMonth,
  selectedDay,
  onRangeChange,
  onYearChange,
  onMonthChange,
  onDayChange,
  data,
  loading,
  lineColor = '#3b82f6',
  lineName,
}: MonitorLineChartProps) {
  const { language } = useLanguage();

  return (
    <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold dark:text-white">{title}</h3>
        <div className="flex items-center gap-3">
          <Select value={range} onValueChange={(v: 'year' | 'month' | 'day') => onRangeChange(v)}>
            <SelectTrigger className="w-32 dark:bg-gray-900 dark:border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              <SelectItem value="year">{language === 'zh-CN' ? '按年' : 'Yearly'}</SelectItem>
              <SelectItem value="month">{language === 'zh-CN' ? '按月' : 'Monthly'}</SelectItem>
              <SelectItem value="day">{language === 'zh-CN' ? '按天' : 'Daily'}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={onYearChange}>
            <SelectTrigger className="w-32 dark:bg-gray-900 dark:border-gray-700">
              <SelectValue placeholder={language === 'zh-CN' ? '年份' : 'Year'} />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(range === 'month' || range === 'day') && (
            <Select value={selectedMonth} onValueChange={onMonthChange}>
              <SelectTrigger className="w-32 dark:bg-gray-900 dark:border-gray-700">
                <SelectValue placeholder={language === 'zh-CN' ? '月份' : 'Month'} />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <SelectItem key={month} value={month.toString()}>
                    {language === 'zh-CN'
                      ? `${month}月`
                      : new Date(2000, month - 1).toLocaleString('en', { month: 'long' })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {range === 'day' && (
            <Select value={selectedDay} onValueChange={onDayChange}>
              <SelectTrigger className="w-32 dark:bg-gray-900 dark:border-gray-700">
                <SelectValue placeholder={language === 'zh-CN' ? '日期' : 'Day'} />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <SelectItem key={day} value={day.toString()}>
                    {language === 'zh-CN' ? `${day}日` : day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            {language === 'zh-CN' ? '加载中...' : 'Loading...'}
          </div>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
            <XAxis dataKey="date" className="text-xs dark:text-gray-400" stroke="currentColor" />
            <YAxis className="text-xs dark:text-gray-400" stroke="currentColor" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
              }}
              labelClassName="dark:text-white"
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              name={lineName}
              stroke={lineColor}
              strokeWidth={2}
              dot={{ fill: lineColor, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </Card>
  );
}
