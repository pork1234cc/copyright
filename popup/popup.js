/**
 * 初始化弹出窗口
 */
document.addEventListener('DOMContentLoaded', async () => {
  const switchElement = document.getElementById('enableSwitch');
  
  // 从存储中获取当前状态
  const { enabled = false } = await chrome.storage.local.get('enabled');
  switchElement.checked = enabled;
  
  // 监听开关变化
  switchElement.addEventListener('change', async (e) => {
    const enabled = e.target.checked;
    await chrome.storage.local.set({ enabled });
    
    // 通知内容脚本状态变化
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs[0]?.id && tabs[0].url?.startsWith('http')) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'TOGGLE_COPY', enabled });
      }
    } catch (error) {
      console.warn('无法发送消息到内容脚本:', error);
    }
  });
}); 