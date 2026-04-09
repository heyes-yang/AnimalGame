/**
 * 日志工具类 - 控制日志输出级别
 * 生产环境可设置 DEBUG = false 来禁用所有日志
 * 开发环境可设置具体模块的日志开关
 */

// 全局调试开关 - 生产环境设为 false
const DEBUG = import.meta.env.DEV;

// 模块级别日志开关 - 可单独控制各模块的日志输出
const LOG_CONFIG = {
  // 核心交易模块
  trade: DEBUG,           // 交易撮合相关
  order: false,           // 订单生成相关（高频日志，默认关闭）
  
  // 生命周期模块
  lifecycle: DEBUG,       // 动物生命周期（加入/离开/打工）
  
  // 游戏状态模块
  game: DEBUG,            // 游戏状态变化
  company: DEBUG,         // 公司交易相关
  
  // 调试模块
  check: false,           // 资产核查（高频日志，默认关闭）
  
  // UI 模块
  ui: DEBUG,              // UI 状态变化
};

// 日志级别
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

// 当前日志级别
const CURRENT_LEVEL = DEBUG ? LOG_LEVELS.DEBUG : LOG_LEVELS.ERROR;

/**
 * 创建模块专用日志器
 * @param {string} module - 模块名称
 * @returns {Object} 日志方法对象
 */
export const createLogger = (module) => {
  const isModuleEnabled = LOG_CONFIG[module] !== false;
  
  const shouldLog = (level) => {
    return isModuleEnabled && level <= CURRENT_LEVEL;
  };

  return {
    log: (...args) => shouldLog(LOG_LEVELS.INFO) && console.log(...args),
    info: (...args) => shouldLog(LOG_LEVELS.INFO) && console.info(...args),
    warn: (...args) => shouldLog(LOG_LEVELS.WARN) && console.warn(...args),
    error: (...args) => shouldLog(LOG_LEVELS.ERROR) && console.error(...args),
    debug: (...args) => shouldLog(LOG_LEVELS.DEBUG) && console.debug(...args),
    
    // 分组日志
    group: (label) => shouldLog(LOG_LEVELS.DEBUG) && console.group(label),
    groupEnd: () => shouldLog(LOG_LEVELS.DEBUG) && console.groupEnd(),
    
    // 表格日志
    table: (data) => shouldLog(LOG_LEVELS.DEBUG) && console.table(data),
  };
};

// 预创建常用日志器
export const tradeLogger = createLogger('trade');
export const orderLogger = createLogger('order');
export const lifecycleLogger = createLogger('lifecycle');
export const gameLogger = createLogger('game');
export const companyLogger = createLogger('company');
export const checkLogger = createLogger('check');
export const uiLogger = createLogger('ui');

// 默认导出
export default {
  createLogger,
  tradeLogger,
  orderLogger,
  lifecycleLogger,
  gameLogger,
  companyLogger,
  checkLogger,
  uiLogger,
  LOG_CONFIG,
  DEBUG,
};
