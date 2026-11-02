const { app, BrowserWindow, shell, dialog, screen } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;

const getWindowStatePath = () => path.join(app.getPath('userData'), 'window-state.json');

const loadWindowState = () => {
  try {
    const data = fs.readFileSync(getWindowStatePath(), 'utf-8');
    const state = JSON.parse(data);

    if (state && typeof state.width === 'number' && typeof state.height === 'number') {
      const displays = screen.getAllDisplays();
      const isVisible = displays.some(display => {
        const { x, y, width, height } = display.bounds;
        return (
          state.x >= x - 50 &&
          state.x <= x + width &&
          state.y >= y - 50 &&
          state.y <= y + height
        );
      });

      return {
        width: Math.max(960, state.width),
        height: Math.max(640, state.height),
        x: isVisible ? state.x : undefined,
        y: isVisible ? state.y : undefined,
        isMaximized: !!state.isMaximized
      };
    }
  } catch (e) {
    // 首次開啟或檔案不存在時使用預設值
  }
  return { width: 1400, height: 900, isMaximized: false };
};

const saveWindowState = (win) => {
  if (!win || win.isDestroyed()) return;
  try {
    const isMaximized = win.isMaximized();
    let bounds = {};
    if (!isMaximized && !win.isMinimized()) {
      bounds = win.getBounds();
    } else {
      const prev = loadWindowState();
      bounds = { width: prev.width, height: prev.height, x: prev.x, y: prev.y };
    }
    const state = {
      ...bounds,
      isMaximized
    };
    fs.writeFileSync(getWindowStatePath(), JSON.stringify(state, null, 2));
  } catch (e) {
    // 略過寫入錯誤
  }
};

const createWindow = () => {
  const windowState = loadWindowState();

  mainWindow = new BrowserWindow({
    width: windowState.width,
    height: windowState.height,
    x: windowState.x,
    y: windowState.y,
    minWidth: 960,
    minHeight: 640,
    title: '特製抽籤系統',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (windowState.isMaximized) {
    mainWindow.maximize();
  }

  // 監聽並記憶使用者調整的視窗尺寸、位置與比例
  let saveTimeout = null;
  const debouncedSave = () => {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => saveWindowState(mainWindow), 300);
  };

  mainWindow.on('resize', debouncedSave);
  mainWindow.on('move', debouncedSave);
  mainWindow.on('close', () => {
    saveWindowState(mainWindow);
  });

  // 外部連結用系統瀏覽器開啟
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
};

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  app.quit();
});

process.on('uncaughtException', (err) => {
  dialog.showErrorBox('發生錯誤', String(err && err.stack ? err.stack : err));
});
