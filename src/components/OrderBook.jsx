import React from 'react';

const OrderBook = ({ orders }) => {
  // 买单按价格从高到低排序
  const buyOrders = [...orders.buy]
    .sort((a, b) => {
      const priceA = Number(a.price);
      const priceB = Number(b.price);
      if (priceB !== priceA) return priceB - priceA;
      return a.id.localeCompare(b.id);
    });
  
  // 卖单按价格从低到高排序
  const sellOrders = [...orders.sell]
    .sort((a, b) => {
      const priceA = Number(a.price);
      const priceB = Number(b.price);
      if (priceA !== priceB) return priceA - priceB;
      return a.id.localeCompare(b.id);
    });

  return (
    <div className="bg-white rounded-lg shadow-md p-2 sm:p-3 mb-0 h-full">
      <h2 className="text-sm font-bold text-gray-800 mb-1">订单簿</h2>
      
      <div className="grid grid-cols-2 gap-2">
        {/* 买单 */}
        <div>
          <h3 className="font-bold text-red-600 mb-1 text-center text-xs">买单</h3>
          <div 
            className="overflow-y-auto max-h-32 sm:max-h-48 scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <div className="space-y-0.5">
              <div className="grid grid-cols-3 gap-1 text-xs font-medium text-gray-600 border-b pb-0.5 sticky top-0 bg-white">
                <span>价格</span>
                <span className="text-center">量</span>
                <span className="text-right">玩家</span>
              </div>
              {buyOrders.length > 0 ? (
                buyOrders.map((order, index) => (
                  <div key={order.id} className="grid grid-cols-3 gap-1 text-xs py-0.5 hover:bg-red-50 rounded">
                    <span className="text-red-600 font-medium">¥{Number(order.price).toFixed(3)}</span>
                    <span className="text-center">{order.shares}</span>
                    <span className="text-gray-500 truncate text-right">
                      {order.player || '玩家'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-2 text-xs">暂无买单</div>
              )}
            </div>
          </div>
        </div>

        {/* 卖单 */}
        <div>
          <h3 className="font-bold text-green-600 mb-1 text-center text-xs">卖单</h3>
          <div 
            className="overflow-y-auto max-h-32 sm:max-h-48 scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <div className="space-y-0.5">
              <div className="grid grid-cols-3 gap-1 text-xs font-medium text-gray-600 border-b pb-0.5 sticky top-0 bg-white">
                <span>价格</span>
                <span className="text-center">量</span>
                <span className="text-right">玩家</span>
              </div>
              {sellOrders.length > 0 ? (
                sellOrders.map((order, index) => (
                  <div key={order.id} className="grid grid-cols-3 gap-1 text-xs py-0.5 hover:bg-green-50 rounded">
                    <span className="text-green-600 font-medium">¥{Number(order.price).toFixed(3)}</span>
                    <span className="text-center">{order.shares}</span>
                    <span className="text-gray-500 truncate text-right">
                      {order.player || '玩家'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-2 text-xs">暂无卖单</div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default OrderBook;
