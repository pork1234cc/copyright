/**
 * 输入框检测器类
 * @class InputDetector
 */
class InputDetector {
  constructor() {
    /** @type {Set<HTMLElement>} */
    this.inputElements = new Set();
    /** @type {boolean} */
    this.isObserving = false;
    /** @type {MutationObserver|null} */
    this.observer = null;
    
    this.init();
  }

  /**
   * 初始化检测器
   */
  init() {
    this.detectInputElements();
    this.addEventListeners();
    // 5分钟后停止观察，减少资源占用
    setTimeout(() => this.stopObserving(), 300000);
  }

  /**
   * 停止DOM观察
   */
  stopObserving() {
    if (this.observer) {
      this.observer.disconnect();
      this.isObserving = false;
      this.observer = null;
    }
  }

  /**
   * 检测页面中的输入元素
   */
  detectInputElements() {
    const inputs = document.querySelectorAll('input, textarea, [contenteditable="true"]');
    inputs.forEach(input => this.inputElements.add(input));
  }

  /**
   * 添加事件监听器
   */
  addEventListeners() {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (this.isInputElement(node)) {
            this.inputElements.add(node);
          }
        });
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    this.isObserving = true;

    // 阻止输入框内的复制行为
    document.addEventListener('mousedown', (event) => {
      if (this.isEventInInput(event)) {
        event.stopPropagation();
      }
    }, true);
  }

  /**
   * 检查元素是否为输入元素
   * @param {Node} node 
   * @returns {boolean}
   */
  isInputElement(node) {
    if (node.nodeType !== Node.ELEMENT_NODE) return false;
    
    const element = /** @type {HTMLElement} */ (node);
    return (
      element.tagName === 'INPUT' ||
      element.tagName === 'TEXTAREA' ||
      element.getAttribute('contenteditable') === 'true'
    );
  }

  /**
   * 检查事件是否发生在输入元素内
   * @param {MouseEvent} event 
   * @returns {boolean}
   */
  isEventInInput(event) {
    const target = /** @type {HTMLElement} */ (event.target);
    return this.inputElements.has(target) || 
           Array.from(this.inputElements).some(input => input.contains(target));
  }
}

// 初始化输入框检测器
new InputDetector(); 