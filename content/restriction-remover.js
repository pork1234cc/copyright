/**
 * 复制限制解除器类
 * @class RestrictionRemover
 */
class RestrictionRemover {
  constructor() {
    if (!this.shouldRun()) return;
    this.init();
  }

  /**
   * 检查是否需要在当前网站运行
   * @returns {boolean}
   */
  shouldRun() {
    const whitelist = [
      'example.com',
      'your-site.com'
    ];
    return whitelist.some(domain => location.hostname.includes(domain));
  }

  /**
   * 初始化解除器
   */
  init() {
    this.removeEventListeners();
    this.enableUserSelect();
    this.observeDOM();
  }

  /**
   * 移除复制相关的事件监听器
   */
  removeEventListeners() {
    const events = ['copy', 'select', 'selectstart', 'contextmenu'];
    
    events.forEach(event => {
      document.addEventListener(event, (e) => {
        e.stopPropagation();
      }, true);
    });

    // 清除可能存在的事件处理程序
    this.clearEventHandlers(document);
  }

  /**
   * 启用文本选择
   */
  enableUserSelect() {
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * 观察DOM变化
   */
  observeDOM() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.clearEventHandlers(/** @type {HTMLElement} */ (node));
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * 清除元素上的事件处理程序
   * @param {HTMLElement} element 
   */
  clearEventHandlers(element) {
    const events = ['copy', 'select', 'selectstart', 'contextmenu'];
    
    if (element.getAttribute) {
      events.forEach(event => {
        element.removeAttribute(`on${event}`);
      });
    }
  }
}

// 初始化复制限制解除器
new RestrictionRemover(); 