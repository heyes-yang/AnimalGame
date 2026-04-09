import { useCallback, useEffect, useState, useRef } from 'react';
import { ANIMAL_TEMPLATES, ANIMAL_STATUS, ANIMAL_LIFECYCLE_CONFIG } from '../data/animalTemplates';
import { gameLogger } from '../utils/logger';

const INITIAL_PRICE = 1.0;
const TOTAL_SHARES = 1000000; // 总股份调整为100万份
const TRADING_SHARES = 100; // 最小交易单位
const MAX_SHARES = 2000; // 单次最大交易数量

// 森林梦想公司配置
const DREAM_COMPANY = {
    name: '森林梦想公司',
    icon: '🏛️',
    initialShares: 1000000, // 初始持有100万股
    baseTradeRatio: 0.02, // 基础交易波动比例 2%
    maxTradeShares: 50000, // 单次最大交易股数
    minTradeShares: 5000, // 单次最小交易股数
};

// 初始玩家配置 - 前7个动物分配本金和股份，其他动物只分配本金并处于离开状态
// 初始参与交易的动物：cat, dog, bear, fox, tiger, rabbit, cow
const INITIAL_ACTIVE_ANIMALS = ['cat', 'dog', 'bear', 'fox', 'tiger', 'rabbit', 'cow'];

const INITIAL_PLAYERS = {
    cat: {
        name: '散户猫',
        money: 5000,
        shares: 500, // 分配500股
        icon: '🐱',
        emotion: 'neutral',
        initialMoney: 5000,
        initialShares: 500,
        initialPrice: 1.0
    },
    dog: {
        name: '中产狗',
        money: 15000,
        shares: 1000, // 分配1000股
        icon: '🐶',
        emotion: 'neutral',
        initialMoney: 15000,
        initialShares: 1000,
        initialPrice: 1.0
    },
    bear: {
        name: '大户熊',
        money: 80000,
        shares: 2000, // 分配2000股
        icon: '🐻',
        emotion: 'neutral',
        initialMoney: 80000,
        initialShares: 2000,
        initialPrice: 1.0
    },
    fox: {
        name: '游资狐',
        money: 40000,
        shares: 1500, // 分配1500股
        icon: '🦊',
        emotion: 'neutral',
        initialMoney: 40000,
        initialShares: 1500,
        initialPrice: 1.0
    },
    tiger: {
        name: '庄家虎',
        money: 150000,
        shares: 10000, // 分配5000股
        icon: '🐯',
        emotion: 'neutral',
        initialMoney: 150000,
        initialShares: 10000,
        initialPrice: 1.0
    },
    rabbit: {
        name: '量化兔',
        money: 20000,
        shares: 2000, // 分配2000股
        icon: '🐰',
        emotion: 'neutral',
        initialMoney: 20000,
        initialShares: 2000,
        initialPrice: 1.0
    },
    cow: {
        name: '神秘牛',
        money: 10000,
        shares: 100000, // 神秘牛持有10000股
        icon: '🐮',
        emotion: 'neutral',
        initialMoney: 10000,
        initialShares: 100000,
        initialPrice: 1.0
    },
    // 以下动物初始处于离开状态，只有本金不分配股份
    panda: {
        name: '懒熊猫',
        money: 6000,
        shares: 0,
        icon: '🐼',
        emotion: 'neutral',
        initialMoney: 6000,
        initialShares: 0,
        initialPrice: 1.0
    },
    lion: {
        name: '狮子王',
        money: 30000,
        shares: 0,
        icon: '🦁',
        emotion: 'neutral',
        initialMoney: 30000,
        initialShares: 0,
        initialPrice: 1.0
    },
    elephant: {
        name: '大象象',
        money: 15000,
        shares: 0,
        icon: '🐘',
        emotion: 'neutral',
        initialMoney: 15000,
        initialShares: 0,
        initialPrice: 1.0
    },
    wolf: {
        name: '独狼哥',
        money: 25000,
        shares: 0,
        icon: '🐺',
        emotion: 'neutral',
        initialMoney: 25000,
        initialShares: 0,
        initialPrice: 1.0
    },
    monkey: {
        name: '调皮猴',
        money: 8000,
        shares: 0,
        icon: '🐒',
        emotion: 'neutral',
        initialMoney: 8000,
        initialShares: 0,
        initialPrice: 1.0
    },
    owl: {
        name: '猫头鹰',
        money: 12000,
        shares: 0,
        icon: '🦉',
        emotion: 'neutral',
        initialMoney: 12000,
        initialShares: 0,
        initialPrice: 1.0
    },
    snake: {
        name: '青蛇妹',
        money: 18000,
        shares: 0,
        icon: '🐍',
        emotion: 'neutral',
        initialMoney: 18000,
        initialShares: 0,
        initialPrice: 1.0
    },
    pig: {
        name: '存钱猪',
        money: 5000,
        shares: 0,
        icon: '🐷',
        emotion: 'neutral',
        initialMoney: 5000,
        initialShares: 0,
        initialPrice: 1.0
    }
};

// 初始动物状态 - 前7个动物参与交易，其他动物处于离开状态
const INITIAL_ANIMAL_STATUS = {};
Object.keys(INITIAL_PLAYERS).forEach(key => {
    if (INITIAL_ACTIVE_ANIMALS.includes(key)) {
        INITIAL_ANIMAL_STATUS[key] = { status: ANIMAL_STATUS.ACTIVE };
    } else {
        INITIAL_ANIMAL_STATUS[key] = {
            status: ANIMAL_STATUS.LEFT,
            reason: '尚未加入市场'
        };
    }
});

export const useGameState = () => {
    const [gameTime, setGameTime] = useState(new Date(2000, 2, 1)); // 2000年3月1日
    const [currentPrice, setCurrentPrice] = useState(INITIAL_PRICE);
    const [priceHistory, setPriceHistory] = useState([INITIAL_PRICE]);
    const [players, setPlayers] = useState(INITIAL_PLAYERS);
    const [userPlayer, setUserPlayer] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [orders, setOrders] = useState({ buy: [], sell: [] });
    const [gameStarted, setGameStarted] = useState(false);
    const [orderCounters, setOrderCounters] = useState({});
    const [isPaused, setIsPaused] = useState(false);
    const [speedMode, setSpeedMode] = useState(1); // 1=正常, 2=2倍速, 4=4倍速
    const [monthlyWeather, setMonthlyWeather] = useState({}); // 存储每月的天气
    const [chatMessages, setChatMessages] = useState([]); // 聊天室消息
    const [annualSummaries, setAnnualSummaries] = useState([]); // 年度大会历史记录
    const [donationPrivileges, setDonationPrivileges] = useState([]); // 捐款特权（公告头条）
    const [workingPlayers, setWorkingPlayers] = useState({}); // 打工中的玩家 { playerKey: { untilDate: Date, salary: number } }
    const [dailyVolumes, setDailyVolumes] = useState([]); // 每日成交量 [volume1, volume2, ...]
    const [monthStartPrice, setMonthStartPrice] = useState(INITIAL_PRICE); // 【新增】当月月初价格，用于计算涨跌停
    const [animalStatus, setAnimalStatus] = useState(INITIAL_ANIMAL_STATUS); // 动物状态：active/working/hibernating/left
    const [gameStartMonth, setGameStartMonth] = useState(null); // 游戏开始的月份，用于计算新动物加入时机

    // 森林梦想公司状态
    const [dreamCompany, setDreamCompany] = useState({
        shares: DREAM_COMPANY.initialShares, // 公司持有的股份
        money: 0, // 公司资金
        yearlyProfit: 0, // 今年利润
        totalTradedShares: 0, // 累计交易股数
        yearlyBuyAmount: 0, // 今年买入金额
        yearlySellAmount: 0, // 今年卖出金额
        initialized: false, // 是否已初始化
    });

    const gameTimeRef = useRef(gameTime);

    // 计算公司剩余股份 - 游戏开始时调用
    const calculateCompanyShares = useCallback((currentPlayers) => {
        // 计算所有玩家（动物+用户）持有的股份总和
        let totalPlayerShares = 0;
        Object.entries(currentPlayers || players).forEach(([key, player]) => {
            if (player && typeof player.shares === 'number') {
                totalPlayerShares += player.shares + (player.frozenShares || 0);
            }
        });

        // 公司剩余股份 = 总股份 - 玩家持有股份
        const companyShares = Math.max(0, TOTAL_SHARES - totalPlayerShares);

        gameLogger.debug(`🏛️ 计算公司股份: 总股份${TOTAL_SHARES} - 玩家持有${totalPlayerShares} = 公司持有${companyShares}`);

        return companyShares;
    }, [players]);
    const isPausedRef = useRef(isPaused);
    const speedModeRef = useRef(speedMode);

    // 更新ref值
    useEffect(() => {
        gameTimeRef.current = gameTime;
    }, [gameTime]);

    useEffect(() => {
        isPausedRef.current = isPaused;
    }, [isPaused]);

    useEffect(() => {
        speedModeRef.current = speedMode;
    }, [speedMode]);

    // 从本地存储加载游戏状态
    useEffect(() => {
        const savedState = localStorage.getItem('animalStockGame');
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                if (parsed.gameTime) setGameTime(new Date(parsed.gameTime));
                if (typeof parsed.currentPrice === 'number') setCurrentPrice(parsed.currentPrice);
                if (Array.isArray(parsed.priceHistory)) setPriceHistory(parsed.priceHistory);
                if (parsed.players) setPlayers(parsed.players);
                if (parsed.userPlayer) {
                    // 确保 userPlayer 包含所有必需的属性
                    const validatedUserPlayer = {
                        ...parsed.userPlayer,
                        money: typeof parsed.userPlayer.money === 'number' ? parsed.userPlayer.money : 0,
                        shares: typeof parsed.userPlayer.shares === 'number' ? parsed.userPlayer.shares : 0,
                        name: parsed.userPlayer.name || '未知玩家',
                        icon: parsed.userPlayer.icon || '👤',
                        emotion: parsed.userPlayer.emotion || 'neutral',
                        initialMoney: typeof parsed.userPlayer.initialMoney === 'number' ? parsed.userPlayer.initialMoney : 1000,
                        initialShares: typeof parsed.userPlayer.initialShares === 'number' ? parsed.userPlayer.initialShares : 0,
                        initialPrice: typeof parsed.userPlayer.initialPrice === 'number' ? parsed.userPlayer.initialPrice : 1.0,
                        currentPrice: typeof parsed.userPlayer.currentPrice === 'number' ? parsed.userPlayer.currentPrice : currentPrice
                    };
                    setUserPlayer(validatedUserPlayer);
                }
                if (Array.isArray(parsed.transactions)) setTransactions(parsed.transactions);
                if (parsed.orders) setOrders(parsed.orders);
                if (typeof parsed.gameStarted === 'boolean') setGameStarted(parsed.gameStarted);
                if (parsed.orderCounters) setOrderCounters(parsed.orderCounters);
                if (typeof parsed.isPaused === 'boolean') setIsPaused(parsed.isPaused);
                if (typeof parsed.speedMode === 'number') setSpeedMode(parsed.speedMode);
                if (parsed.monthlyWeather) setMonthlyWeather(parsed.monthlyWeather);
                if (Array.isArray(parsed.annualSummaries)) setAnnualSummaries(parsed.annualSummaries);
                if (Array.isArray(parsed.donationPrivileges)) setDonationPrivileges(parsed.donationPrivileges);
                if (parsed.workingPlayers) setWorkingPlayers(parsed.workingPlayers);
                if (Array.isArray(parsed.dailyVolumes)) setDailyVolumes(parsed.dailyVolumes);
                if (typeof parsed.monthStartPrice === 'number') setMonthStartPrice(parsed.monthStartPrice); // 【新增】加载月初价格
                if (parsed.animalStatus) setAnimalStatus(parsed.animalStatus); // 加载动物状态
                if (parsed.gameStartMonth) setGameStartMonth(parsed.gameStartMonth); // 加载游戏开始月份
                if (parsed.dreamCompany) setDreamCompany(parsed.dreamCompany); // 加载梦想公司状态
            } catch (error) {
                console.error('加载游戏状态失败:', error);
                localStorage.removeItem('animalStockGame');
            }
        }
    }, []);

    // 保存游戏状态到本地存储
    const saveGameState = useCallback(() => {
        try {
            const state = {
                gameTime: gameTime.toISOString(),
                currentPrice,
                priceHistory,
                players,
                userPlayer,
                transactions,
                orders,
                gameStarted,
                orderCounters,
                isPaused,
                speedMode,
                monthlyWeather,
                annualSummaries,
                donationPrivileges,
                workingPlayers,
                dailyVolumes,
                monthStartPrice, // 【新增】保存月初价格
                animalStatus, // 保存动物状态
                gameStartMonth, // 保存游戏开始月份
                dreamCompany // 保存梦想公司状态
            };
            localStorage.setItem('animalStockGame', JSON.stringify(state));
        } catch (error) {
            console.error('保存游戏状态失败:', error);
        }
    }, [gameTime, currentPrice, priceHistory, players, userPlayer, transactions, orders, gameStarted, orderCounters, isPaused, speedMode, annualSummaries, donationPrivileges, dailyVolumes, animalStatus, gameStartMonth, dreamCompany]);

    // 根据速度模式更新游戏时间
    useEffect(() => {
        if (!gameStarted || isPaused) return;

        // 正常5秒一天，2倍速2.5秒一天，4倍速1.25秒一天
        const baseInterval = 5000;
        const interval = baseInterval / speedMode;

        const timer = setInterval(() => {
            setGameTime(prev => {
                const newTime = new Date(prev);
                newTime.setDate(newTime.getDate() + 1);
                return newTime;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [gameStarted, isPaused, speedMode]);

    // 保存游戏状态
    useEffect(() => {
        saveGameState();
    }, [saveGameState]);

    const resetGame = useCallback((confirmed = false) => {
        // 如果没有确认，返回 false 表示需要确认
        if (!confirmed) {
            return false;
        }

        setGameTime(new Date(2000, 2, 1)); // 2000年3月1日
        setCurrentPrice(INITIAL_PRICE);
        setPriceHistory([INITIAL_PRICE]);
        setPlayers(INITIAL_PLAYERS);
        setUserPlayer(null);
        setTransactions([]);
        setOrders({ buy: [], sell: [] });
        setDailyVolumes([]);
        setGameStarted(false);
        setOrderCounters({});
        setIsPaused(false);
        setSpeedMode(1);
        setMonthlyWeather({});
        setChatMessages([]);
        setAnnualSummaries([]);
        setDonationPrivileges([]);
        setWorkingPlayers({});
        setMonthStartPrice(INITIAL_PRICE); // 【新增】重置月初价格
        setAnimalStatus(INITIAL_ANIMAL_STATUS); // 重置动物状态为初始状态（前7个活跃，其他已离开）
        setGameStartMonth(null); // 重置游戏开始月份
        setDreamCompany({ // 重置梦想公司状态
            shares: DREAM_COMPANY.initialShares,
            money: 0,
            yearlyProfit: 0,
            totalTradedShares: 0,
            yearlyBuyAmount: 0,
            yearlySellAmount: 0,
            initialized: false, // 重置初始化标记
        });
        // 重置 ref
        gameTimeRef.current = new Date(2000, 2, 1);
        isPausedRef.current = false;
        speedModeRef.current = 1;
        // 清除本地存储
        localStorage.removeItem('animalStockGame');
        gameLogger.log('🔄 游戏已重置，所有缓存已清理');
        return true;
    }, []);

    const togglePause = useCallback(() => {
        setIsPaused(prev => !prev);
    }, []);

    // 切换速度模式：1 -> 2 -> 4 -> 1
    const cycleSpeedMode = useCallback(() => {
        setSpeedMode(prev => {
            if (prev === 1) return 2;
            if (prev === 2) return 4;
            return 1;
        });
    }, []);

    return {
        gameTime,
        currentPrice,
        priceHistory,
        players,
        userPlayer,
        transactions,
        orders,
        gameStarted,
        orderCounters,
        isPaused,
        speedMode,
        setCurrentPrice,
        setPriceHistory,
        setPlayers,
        setUserPlayer,
        setTransactions,
        setOrders,
        setOrderCounters,
        setGameStarted,
        resetGame,
        togglePause,
        cycleSpeedMode,
        monthlyWeather,
        setMonthlyWeather,
        chatMessages,
        setChatMessages,
        annualSummaries,
        setAnnualSummaries,
        donationPrivileges,
        setDonationPrivileges,
        workingPlayers,
        setWorkingPlayers,
        dailyVolumes,
        setDailyVolumes,
        monthStartPrice, // 【新增】导出月初价格
        setMonthStartPrice, // 【新增】导出设置月初价格的函数
        animalStatus, // 导出动物状态
        setAnimalStatus, // 导出设置动物状态的函数
        gameStartMonth, // 导出游戏开始月份
        setGameStartMonth, // 导出设置游戏开始月份的函数
        dreamCompany, // 导出梦想公司状态
        setDreamCompany, // 导出设置梦想公司状态的函数
        DREAM_COMPANY, // 导出梦想公司配置
        TRADING_SHARES,
        MAX_SHARES,
        TOTAL_SHARES
    };
};
