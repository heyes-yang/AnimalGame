import React, { useState, useMemo } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { createLogger } from '../utils/logger';

const chartLogger = createLogger('ui');

const PriceChart = ({ priceHistory, currentPrice, startTime, dailyVolumes, gameTime }) => {
  // 【新增】图表类型状态：'daily' 为日线，'monthly' 为月K线
  const [chartType, setChartType] = useState('daily');
  
  // 初始日期（游戏开始时的日期）
  const baseDate = startTime || new Date(2000, 2, 1); // 默认2000年3月1日
  
  // 获取当前游戏时间（用于确定当前月份）
  const currentDate = gameTime || baseDate;
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // 从订单ID中提取时间戳的辅助函数（用于计算月份）
  const baseDateNormalized = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());

  // 【新增】生成月K线数据（最近60个月）
  const monthlyKLineData = useMemo(() => {
    if (!priceHistory || priceHistory.length === 0) return [];
    
    const monthlyData = [];
    const totalDays = priceHistory.length;
    
    // 计算起始日期（游戏开始日期）
    const startDate = new Date(baseDate);
    
    chartLogger.debug(`📊 月K线计算: priceHistory长度=${totalDays}`);
    
    // 遍历每一天，按月分组
    let currentMonthData = null;
    let currentMonthKey = null;
    
    for (let dayIndex = 0; dayIndex < totalDays; dayIndex++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + dayIndex);
      
      const year = date.getFullYear();
      const month = date.getMonth();
      const monthKey = `${year}-${month}`;
      
      const price = priceHistory[dayIndex];
      const volume = dailyVolumes ? (dailyVolumes[dayIndex] || 0) : 0;
      
      if (monthKey !== currentMonthKey) {
        // 新的一月开始
        if (currentMonthData) {
          monthlyData.push(currentMonthData);
        }
        currentMonthKey = monthKey;
        currentMonthData = {
          year: year,
          month: month,
          monthKey: monthKey,
          date: new Date(year, month, 1),
          dateStr: format(new Date(year, month, 1), 'yyyy/MM'),
          open: price,        // 月初开盘价
          close: price,       // 月末收盘价（会持续更新）
          high: price,        // 月内最高价
          low: price,         // 月内最低价
          volume: volume,     // 月内总成交量
          days: 1             // 月内天数
        };
      } else {
        // 同一月内，更新数据
        if (currentMonthData) {
          currentMonthData.close = price;
          currentMonthData.high = Math.max(currentMonthData.high, price);
          currentMonthData.low = Math.min(currentMonthData.low, price);
          currentMonthData.volume += volume;
          currentMonthData.days++;
        }
      }
    }
    
    // 添加最后一个月的数据（当前正在进行的月份）
    if (currentMonthData) {
      monthlyData.push(currentMonthData);
    }
    
    chartLogger.debug(`📊 月K线生成完成: 共${monthlyData.length}个月数据`);
    if (monthlyData.length > 0) {
      // chartLogger.debug(`📊 第一个月: ${monthlyData[0].dateStr}, 最后一个月: ${monthlyData[monthlyData.length - 1].dateStr}`);
    }
    
    // 只取最近60个月
    return monthlyData.slice(-60);
  }, [priceHistory, dailyVolumes, baseDate, currentDate]);

  // 计算当前日期在 priceHistory 中的索引（从游戏开始算起的天数）
  const getCurrentDayIndex = () => {
    const daysFromStart = Math.floor((currentDate - baseDateNormalized) / (1000 * 60 * 60 * 24));
    return Math.max(0, Math.min(priceHistory.length - 1, daysFromStart));
  };

  const currentDayIndex = getCurrentDayIndex();

  // 计算当前月份的天数
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const currentDayInMonth = currentDate.getDate();

  // 【修复】获取当前月份的价格数据，从上个月末尾开始计算
  const getMonthDailyData = () => {
    const data = [];
    const monthStartDay = currentDayInMonth; // 当前是当月第几天
    
    // 计算本月已经过去的天数
    const daysInCurrentMonth = Math.min(monthStartDay, priceHistory.length);
    
    // 计算本月起始索引：当前日期索引 - (当前日 - 1)
    // 例如：当前是4月3日，那么本月数据从索引 (currentDayIndex - 2) 开始
    const monthStartIndex = Math.max(0, currentDayIndex - (currentDayInMonth - 1));
    
    // 获取本月的价格数据
    const monthPrices = priceHistory.slice(monthStartIndex, currentDayIndex + 1);
    const monthVols = dailyVolumes ? dailyVolumes.slice(monthStartIndex, currentDayIndex + 1) : [];
    
    // 如果本月第一天还没有数据，使用上个月最后一天的价格作为起始
    if (monthPrices.length === 0 && currentDayInMonth === 1 && priceHistory.length > 0) {
      // 新月份的第一天，使用上个月最后一天的价格
      const lastMonthPrice = priceHistory[priceHistory.length - 1];
      data.push({
        date: new Date(currentYear, currentMonth, 1),
        dateStr: format(new Date(currentYear, currentMonth, 1), 'MM/dd'),
        dayOfMonth: 1,
        price: Number(lastMonthPrice.toFixed(3)),
        volume: 0
      });
    } else {
      // 生成当前月份的数据
      for (let i = 0; i < monthPrices.length; i++) {
        const dayOfMonth = currentDayInMonth - monthPrices.length + i + 1;
        const date = new Date(currentYear, currentMonth, dayOfMonth);
        
        data.push({
          date: date,
          dateStr: format(date, 'MM/dd'),
          dayOfMonth: dayOfMonth,
          price: Number(monthPrices[i].toFixed(3)),
          volume: monthVols[i] || 0
        });
      }
    }
    
    return data;
  };

  const dailyData = getMonthDailyData();
  
  // 获取当前月份的价格数据（用于计算涨跌幅）
  const monthPriceHistory = dailyData.map(d => d.price);
  const monthVolumes = dailyData.map(d => d.volume);

  // 【修改】计算当月涨跌幅
  const calculateCurrentMonthChange = () => {
    if (monthPriceHistory.length < 2) return null;
    
    const startPrice = monthPriceHistory[0]; // 月初价格
    const endPrice = monthPriceHistory[monthPriceHistory.length - 1]; // 当前价格
    const change = ((endPrice - startPrice) / startPrice) * 100;
    
    return {
      percentage: change.toFixed(2),
      isPositive: change >= 0,
      days: monthPriceHistory.length
    };
  };

  // 【修改】计算上月涨跌幅
  const calculateLastMonthChange = () => {
    // 计算上个月的起始和结束索引
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const lastMonthStart = new Date(lastMonthYear, lastMonth, 1);
    const lastMonthEnd = new Date(currentYear, currentMonth, 0); // 当前月份的最后一天的前一天
    
    const lastMonthStartIndex = Math.floor((lastMonthStart - baseDateNormalized) / (1000 * 60 * 60 * 24));
    const lastMonthEndIndex = Math.floor((lastMonthEnd - baseDateNormalized) / (1000 * 60 * 60 * 24));
    
    if (lastMonthStartIndex < 0 || lastMonthEndIndex < 0 || lastMonthEndIndex >= priceHistory.length) {
      return null;
    }
    
    if (lastMonthStartIndex >= priceHistory.length || lastMonthStartIndex >= lastMonthEndIndex) {
      return null;
    }
    
    const startPrice = priceHistory[lastMonthStartIndex];
    const endPrice = priceHistory[lastMonthEndIndex];
    const change = ((endPrice - startPrice) / startPrice) * 100;
    
    return {
      percentage: change.toFixed(2),
      isPositive: change >= 0,
      days: lastMonthEndIndex - lastMonthStartIndex + 1
    };
  };

  const currentMonthChange = calculateCurrentMonthChange();
  const lastMonthChange = calculateLastMonthChange();

  // 计算最大成交量用于缩放（日线）
  const maxDailyVolume = Math.max(...dailyData.map(d => d.volume), 1);
  
  // 计算最大成交量用于缩放（月K线）
  const maxMonthlyVolume = Math.max(...monthlyKLineData.map(d => d.volume), 1);

  const formatTooltip = (value, name) => {
    if (name === 'price' || name === 'close') {
      return [`¥${value}`, '股价'];
    }
    if (name === 'volume') {
      return [`${value}股`, '成交量'];
    }
    return [value, name];
  };

  // 月K线专用 Tooltip 格式化
  const formatMonthlyTooltip = (value, name) => {
    if (name === 'close') {
      return [`¥${value}`, '收盘价'];
    }
    if (name === 'volume') {
      return [`${value}股`, '成交量'];
    }
    return [value, name];
  };

  const formatXAxis = (date) => {
    if (!date) return '';
    const day = date.getDate();
    // 每5天显示一个标签
    if (day % 5 === 1 || day === 1) {
      return format(date, 'MM/dd');
    }
    return '';
  };

  // 月K线 X轴格式化
  const formatMonthlyXAxis = (date) => {
    if (!date) return '';
    return format(date, 'yy/MM');
  };

  // 计算月度总成交量
  const totalVolume = dailyData.reduce((sum, d) => sum + d.volume, 0);
  
  // 计算今日成交量
  const todayVolume = dailyData.length > 0 ? dailyData[dailyData.length - 1].volume : 0;

  // 显示当前月份信息
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  const currentMonthName = monthNames[currentMonth];

  // 渲染K线柱子（红涨绿跌）
  const renderCandlestick = (props) => {
    const { x, y, width, height, payload } = props;
    if (!payload) return null;
    
    const isUp = payload.close >= payload.open;
    const color = isUp ? '#ef4444' : '#22c55e'; // 红涨绿跌
    
    // 计算K线柱子的位置
    const barWidth = Math.max(width * 0.6, 4);
    const barX = x + (width - barWidth) / 2;
    
    return (
      <g>
        {/* 成交量柱子 */}
        <rect
          x={barX}
          y={y}
          width={barWidth}
          height={height}
          fill={color}
          fillOpacity={0.3}
        />
      </g>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-2 sm:p-3 mb-0">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-gray-800">股价走势</h2>
          {/* 切换按钮 */}
          <div className="flex bg-gray-100 rounded p-0.5">
            <button
              onClick={() => setChartType('daily')}
              className={`px-2 py-0.5 text-xs rounded transition-colors ${
                chartType === 'daily' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              日线
            </button>
            <button
              onClick={() => setChartType('monthly')}
              className={`px-2 py-0.5 text-xs rounded transition-colors ${
                chartType === 'monthly' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              月K
            </button>
          </div>
        </div>
        <div className="text-right">
          <div className="text-base font-bold text-blue-600">
            ¥{currentPrice.toFixed(3)}
          </div>
          {/* 当月涨跌幅 */}
          {currentMonthChange && (
            <div className={`text-xs font-medium ${currentMonthChange.isPositive ? 'text-red-600' : 'text-green-600'}`}>
              {currentMonthChange.isPositive ? '+' : ''}{currentMonthChange.percentage}%
            </div>
          )}
        </div>
      </div>
      
      {/* 日线图表 */}
      {chartType === 'daily' && (
        <>
          {/* 当前月份信息 */}
          <div className="flex flex-wrap gap-2 mb-1 text-xs text-gray-600">
            <span>{currentYear}年{currentMonthName}</span>
            <span>第{currentDayInMonth}天</span>
            <span>今{todayVolume}股</span>
            <span>月{totalVolume}股</span>
          </div>
          
          {dailyData.length > 0 ? (
            <div className="h-32 sm:h-40 md:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280"
                    fontSize={10}
                    tickFormatter={formatXAxis}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    yAxisId="price"
                    stroke="#6b7280"
                    fontSize={10}
                    domain={['dataMin - 0.1', 'dataMax + 0.1']}
                    tickFormatter={(value) => value.toFixed(3)}
                    orientation="left"
                  />
                  <YAxis 
                    yAxisId="volume"
                    stroke="#9ca3af"
                    fontSize={10}
                    domain={[0, maxDailyVolume * 1.2]}
                    tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}
                    orientation="right"
                  />
                  <Tooltip 
                    formatter={formatTooltip}
                    labelFormatter={(label) => label ? format(label, 'MM月dd日') : ''}
                    contentStyle={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    yAxisId="volume"
                    dataKey="volume" 
                    fill="#93c5fd"
                    fillOpacity={0.6}
                    barSize={8}
                    name="成交量"
                  />
                  <Line 
                    yAxisId="price"
                    type="monotone" 
                    dataKey="price" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: '#1d4ed8' }}
                    name="股价"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 sm:h-56 flex items-center justify-center text-gray-400">
              本月暂无数据
            </div>
          )}
          
          {/* 图例 */}
          <div className="flex justify-center gap-6 mt-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-blue-500"></div>
              <span>股价</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-300 opacity-60 rounded-sm"></div>
              <span>成交量</span>
            </div>
          </div>
        </>
      )}
      
      {/* 月K线图表 */}
      {chartType === 'monthly' && (
        <>
          {/* 月K线信息 */}
          <div className="flex gap-2 mb-1 text-xs text-gray-600">
            <span>月K线（近60月）</span>
            <span>共{monthlyKLineData.length}月</span>
          </div>
          
          {monthlyKLineData.length > 0 ? (
            <div className="h-32 sm:h-40 md:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyKLineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280"
                    fontSize={10}
                    tickFormatter={formatMonthlyXAxis}
                    interval={Math.max(0, Math.floor(monthlyKLineData.length / 12))}
                  />
                  <YAxis 
                    yAxisId="price"
                    stroke="#6b7280"
                    fontSize={10}
                    domain={['dataMin - 0.1', 'dataMax + 0.1']}
                    tickFormatter={(value) => value.toFixed(3)}
                    orientation="left"
                  />
                  <YAxis 
                    yAxisId="volume"
                    stroke="#9ca3af"
                    fontSize={10}
                    domain={[0, maxMonthlyVolume * 1.2]}
                    tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}
                    orientation="right"
                  />
                  <Tooltip 
                    formatter={formatMonthlyTooltip}
                    labelFormatter={(label) => {
                      const item = monthlyKLineData.find(d => d.date === label);
                      return item ? item.dateStr : '';
                    }}
                    contentStyle={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                    payloadFormatter={(payload) => {
                      if (!payload || !payload.payload) return payload;
                      const data = payload.payload;
                      return {
                        ...payload,
                        name: payload.name,
                        value: payload.name === 'volume' 
                          ? `${data.volume}股`
                          : `开盘: ¥${data.open.toFixed(3)}, 收盘: ¥${data.close.toFixed(3)}, 最高: ¥${data.high.toFixed(3)}, 最低: ¥${data.low.toFixed(3)}`
                      };
                    }}
                  />
                  <Bar 
                    yAxisId="volume"
                    dataKey="volume" 
                    fill="#93c5fd"
                    fillOpacity={0.6}
                    barSize={12}
                    name="成交量"
                  />
                  <Line 
                    yAxisId="price"
                    type="monotone" 
                    dataKey="close" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={(props) => {
                      const { cx, cy, payload } = props;
                      if (!payload) return null;
                      const isUp = payload.close >= payload.open;
                      const color = isUp ? '#ef4444' : '#22c55e';
                      return <circle cx={cx} cy={cy} r={3} fill={color} />;
                    }}
                    activeDot={{ r: 5 }}
                    name="收盘价"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 sm:h-56 flex items-center justify-center text-gray-400">
              暂无历史数据
            </div>
          )}
          
          {/* 月K线图例 */}
          <div className="flex justify-center gap-6 mt-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-blue-500"></div>
              <span>收盘价</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>上涨</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>下跌</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-300 opacity-60 rounded-sm"></div>
              <span>成交量</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PriceChart;
