const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('pcTools', {
  listApps: () => ipcRenderer.invoke('apps:list'),
  addApp: (item) => ipcRenderer.invoke('apps:add', item),
  removeApp: (id) => ipcRenderer.invoke('apps:remove', id),
  launch: (executable) => ipcRenderer.invoke('apps:launch', executable),
  systemInfo: () => ipcRenderer.invoke('system:info'),
  openExternal: (url) => ipcRenderer.invoke('shell:open', url)
});
