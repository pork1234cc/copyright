/**
 * UI管理器类
 * @class UIManager
 */
class UIManager {
  constructor() {
    /** @type {HTMLElement} */
    this.tipElement = null;
    
    this.init();
  }

  /**
   * 初始化UI管理器
   */
  init() {
    this.createTipElement();
    this.addEventListeners();
  }

  /**
   * 创建提示元素
   */
  createTipElement() {
    const tip = document.createElement('div');
    tip.className = 'smart-copy-tip';
    tip.style.cssText = `
      position: fixed;
      padding: 6px 12px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      border-radius: 4px;
      font-size: 14px;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s;
      z-index: 999999;
    `;
    tip.textContent = '已复制';
    
    document.body.appendChild(tip);
    this.tipElement = tip;
  }

  /**
   * 添加事件监听器
   */
  addEventListeners() {
    document.addEventListener('showCopyTip', (event) => {
      this.showTip(event.detail.x, event.detail.y);
    });
  }

  /**
   * 显示提示
   * @param {number} x - 鼠标X坐标
   * @param {number} y - 鼠标Y坐标
   */
  showTip(x, y) {
    const tip = this.tipElement;
    
    // 设置位置
    tip.style.left = `${x + 10}px`;
    tip.style.top = `${y + 10}px`;
    
    // 显示动画
    tip.style.opacity = '1';
    
    // 自动隐藏
    setTimeout(() => {
      tip.style.opacity = '0';
    }, 1000);
  }
}

// 初始化UI管理器
new UIManager(); 