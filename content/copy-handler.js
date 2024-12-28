/**
 * 复制处理类
 * @class CopyHandler
 */
class CopyHandler {
  constructor() {
    /** @type {boolean} */
    this.enabled = false;
    /** @type {boolean} */
    this.isSelecting = false;
    /** @type {Range} */
    this.lastRange = null;
    
    this.init();
  }

  /**
   * 初始化复制处理器
   */
  async init() {
    // 获取存储的启用状态
    const { enabled = false } = await chrome.storage.local.get('enabled');
    this.enabled = enabled;
    
    // 添加事件监听
    this.addEventListeners();
    
    // 监听来自popup的消息
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'TOGGLE_COPY') {
        this.enabled = message.enabled;
        console.log('复制功能状态:', this.enabled ? '启用' : '禁用');
        sendResponse({ success: true });
      }
      return true;
    });

    // 监听存储变化
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.enabled) {
        this.enabled = changes.enabled.newValue;
        console.log('存储状态变化:', this.enabled ? '启用' : '禁用');
      }
    });
  }

  /**
   * 添加事件监听器
   */
  addEventListeners() {
    document.addEventListener('mousedown', this.handleMouseDown.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  /**
   * 处理鼠标按下事件
   * @param {MouseEvent} event 
   */
  handleMouseDown(event) {
    if (!this.enabled || event.button !== 0) return;
    this.isSelecting = true;
    this.lastRange = null;
  }

  /**
   * 处理鼠标释放事件
   * @param {MouseEvent} event 
   */
  handleMouseUp(event) {
    if (!this.enabled || !this.isSelecting || event.button !== 0) return;
    
    this.isSelecting = false;
    const selection = window.getSelection();
    
    // 保存选区，以保持原始格式
    if (selection.rangeCount > 0) {
      this.lastRange = selection.getRangeAt(0).cloneRange();
    }
    
    const selectedText = selection.toString().trim();
    
    if (selectedText) {
      this.copyText(selectedText, event);
    }
  }

  /**
   * 复制文本到剪贴板
   * @param {string} text 
   * @param {MouseEvent} event 
   */
  async copyText(text, event) {
    if (!this.enabled) return;
    
    try {
      // 使用 ClipboardItem 来保持富文本格式
      if (this.lastRange) {
        const clipboardData = new DataTransfer();
        clipboardData.setData('text/plain', text);
        
        // 创建临时容器保存带格式的内容
        const tempDiv = document.createElement('div');
        tempDiv.appendChild(this.lastRange.cloneContents());
        clipboardData.setData('text/html', tempDiv.innerHTML);
        
        // 尝试写入富文本
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/plain': new Blob([text], { type: 'text/plain' }),
            'text/html': new Blob([tempDiv.innerHTML], { type: 'text/html' })
          })
        ]);
      } else {
        // 降级为纯文本复制
        await navigator.clipboard.writeText(text);
      }

      // 触发UI提示
      document.dispatchEvent(new CustomEvent('showCopyTip', {
        detail: { x: event.clientX, y: event.clientY }
      }));
    } catch (error) {
      console.error('复制失败:', error);
      // 降级尝试
      try {
        await navigator.clipboard.writeText(text);
        document.dispatchEvent(new CustomEvent('showCopyTip', {
          detail: { x: event.clientX, y: event.clientY }
        }));
      } catch (e) {
        console.error('降级复制也失败:', e);
      }
    }
  }
}

// 初始化复制处理器
new CopyHandler(); 