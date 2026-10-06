const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('pcTools', {
  listApps: () => ipcRenderer.invoke('apps:list'),
  addApp: (item) => ipcRenderer.invoke('apps:add', item),
  removeApp: (id) => ipcRenderer.invoke('apps:remove', id),
  launch: (executable, protocol) => ipcRenderer.invoke('apps:launch', executable, protocol),
  scan: (target) => ipcRenderer.invoke('security:scan', target),
  systemInfo: () => ipcRenderer.invoke('system:info'),
  openExternal: (url) => ipcRenderer.invoke('shell:open', url)
});
