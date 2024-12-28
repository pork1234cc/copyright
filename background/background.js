/**
 * 后台脚本
 * 用于处理插件图标状态等
 * 
 * @license MIT
 * @author 您的名字
 * @version 1.0.0
 * @description 该脚本仅用于管理扩展状态，不会收集任何用户数据
 */
chrome.runtime.onInstalled.addListener(() => {
  // 显示欢迎信息
  chrome.tabs.create({
    url: 'welcome.html'
  });
  // 初始化存储
  chrome.storage.local.set({ enabled: false });
}); 