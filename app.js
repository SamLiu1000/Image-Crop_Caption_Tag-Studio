const STORAGE_KEYS = {
  activeTab: 'web-tools-hub-active-tab',
  language: 'web-tools-hub-language',
  theme: 'web-tools-hub-theme',
};

const LANGUAGE_SYNC_MESSAGE = 'web-tools-hub:set-language';
const THEME_SYNC_MESSAGE = 'web-tools-hub:set-theme';

const tabButtons = [...document.querySelectorAll('[data-tab]')];
const tabPanels = [...document.querySelectorAll('.tool-panel')];
const langToggleBtn = document.getElementById('langToggleBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const exportConfigBtn = document.getElementById('exportConfigBtn');
const importConfigBtn = document.getElementById('importConfigBtn');

const I18N = {
  zh: {
    toggle: 'EN',
    tabCropper: '图片裁切',
    tabCaptioner: '图片描述',
    tabTagtool: '标签工具',
    frameCropper: '图片裁切工具',
    frameCaptioner: '图片描述工具',
    frameTagtool: '标签工具',
    exportConfig: '📥 导出配置',
    importConfig: '📤 导入配置',
    themeDark: '🌙',
    themeLight: '☀️',
    exportSuccess: '✓ 配置已导出',
    importSuccess: '✓ 配置已导入',
    importConfirm: '导入配置将覆盖现有设置，是否继续？',
    importAskTitle: '选择导入方式',
    importAskDesc: '合并：保留现有数据，导入内容按名称去重合并；覆盖：清空现有配置与结果后整体替换。',
    importMergeBtn: '合并',
    importOverwriteBtn: '覆盖',
    importCancelBtn: '取消',
    importError: '❌ 配置导入失败',
    exportError: '❌ 配置导出失败',
    importInvalid: '❌ 无效的配置文件',
  },
  en: {
    toggle: '中文',
    tabCropper: 'Image Cropper',
    tabCaptioner: 'Image Captioner',
    tabTagtool: 'Tag Tool',
    frameCropper: 'Image Cropper',
    frameCaptioner: 'Image Captioner',
    frameTagtool: 'Tag Tool',
    exportConfig: '📥 Export Config',
    importConfig: '📤 Import Config',
    themeDark: '🌙',
    themeLight: '☀️',
    exportSuccess: '✓ Configuration exported',
    importSuccess: '✓ Configuration imported',
    importConfirm: 'Importing configuration will overwrite existing settings. Continue?',
    importAskTitle: 'Choose import mode',
    importAskDesc: 'Merge: keep existing data, import merges by name (dedup). Overwrite: clear existing config and results, then replace entirely.',
    importMergeBtn: 'Merge',
    importOverwriteBtn: 'Overwrite',
    importCancelBtn: 'Cancel',
    importError: '❌ Configuration import failed',
    exportError: '❌ Configuration export failed',
    importInvalid: '❌ Invalid configuration file',
  },
};

const state = {
  language: localStorage.getItem(STORAGE_KEYS.language) === 'en' ? 'en' : 'zh',
  theme: localStorage.getItem(STORAGE_KEYS.theme) || 'dark',
};

function t(key) {
  return I18N[state.language][key] || '';
}

function getToolFrames() {
  return [...document.querySelectorAll('.tool-frame')];
}

function broadcastLanguageToFrames(language) {
  for (const frame of getToolFrames()) {
    try {
      frame.contentWindow?.postMessage({ type: LANGUAGE_SYNC_MESSAGE, language }, '*');
    } catch {
      // Ignore cross-frame sync errors to avoid blocking the hub UI.
    }
  }
}

function broadcastThemeToFrames(theme) {
  for (const frame of getToolFrames()) {
    try {
      frame.contentWindow?.postMessage({ type: THEME_SYNC_MESSAGE, theme }, '*');
    } catch {
      // Ignore cross-frame sync errors.
    }
  }
}

function applyTheme() {
  updateThemeBtnLabel();
  broadcastThemeToFrames(state.theme);
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem(STORAGE_KEYS.theme, state.theme);
  applyTheme();
}

function updateThemeBtnLabel() {
  if (!themeToggleBtn) return;
  themeToggleBtn.textContent = t(state.theme === 'light' ? 'themeLight' : 'themeDark');
  themeToggleBtn.title = state.theme === 'light' ? '切换暗色主题' : 'Switch to light theme';
}

function applyLanguage() {
  document.documentElement.lang = state.language === 'zh' ? 'zh-CN' : 'en';
  document.title = state.language === 'zh' ? '网页工具合集' : 'Web Tools Hub';

  const cropperTab = document.getElementById('tab-cropper');
  const captionerTab = document.getElementById('tab-captioner');
  const tagtoolTab = document.getElementById('tab-tagtool');
  const cropperFrame = document.querySelector('#panel-cropper iframe');
  const captionerFrame = document.querySelector('#panel-captioner iframe');
  const tagtoolFrame = document.querySelector('#panel-tagtool iframe');

  if (cropperTab) cropperTab.textContent = t('tabCropper');
  if (captionerTab) captionerTab.textContent = t('tabCaptioner');
  if (tagtoolTab) tagtoolTab.textContent = t('tabTagtool');

  if (cropperFrame) cropperFrame.title = t('frameCropper');
  if (captionerFrame) captionerFrame.title = t('frameCaptioner');
  if (tagtoolFrame) tagtoolFrame.title = t('frameTagtool');

  if (langToggleBtn) {
    langToggleBtn.textContent = t('toggle');
    langToggleBtn.setAttribute('aria-label', state.language === 'zh' ? '切换到英文' : 'Switch to Chinese');
    langToggleBtn.setAttribute('title', state.language === 'zh' ? '切换到英文' : 'Switch to Chinese');
  }

  broadcastLanguageToFrames(state.language);
}

function setActiveTab(tabName) {
  let matched = false;

  for (const button of tabButtons) {
    const active = button.dataset.tab === tabName;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
    if (active) matched = true;
  }

  for (const panel of tabPanels) {
    const active = panel.id === `panel-${tabName}`;
    panel.classList.toggle('active', active);
    panel.hidden = !active;
  }

  if (matched) {
    localStorage.setItem(STORAGE_KEYS.activeTab, tabName);
  }
}

for (const button of tabButtons) {
  button.addEventListener('click', () => {
    setActiveTab(button.dataset.tab);
  });
}

for (const frame of getToolFrames()) {
  frame.addEventListener('load', () => {
    broadcastLanguageToFrames(state.language);
    broadcastThemeToFrames(state.theme);
  });
}

if (langToggleBtn) {
  langToggleBtn.addEventListener('click', () => {
    state.language = state.language === 'zh' ? 'en' : 'zh';
    localStorage.setItem(STORAGE_KEYS.language, state.language);
    applyLanguage();
  });
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', toggleTheme);
}

// ═══════════════════════════════════════════════════════════
//  Configuration Export/Import Functions
// ═══════════════════════════════════════════════════════════

// Storage keys for each tool
const TOOL_STORAGE_KEYS = {
  cropper: ['image_cropper_web_sizes', 'image-cropper-web-language'],
  captioner: ['image-captioner-config', 'image-captioner-config-presets', 'image-captioner-language'],
  tagtool: ['anatomy_tag_groups_v1', 'anatomy_categories_v1', 'app_language'],
};

const TOOL_SELECTORS = {
  captioner: {
    providerType: '#providerTabs [data-provider].active',
    serverUrl: '#serverUrlInput',
    model: '#modelInput',
    timeoutSeconds: '#timeoutInput',
    apiKey: '#apiKeyInput',
    recursive: '#recursiveCheck',
    skipExisting: '#skipExistingCheck',
    stripThinking: '#stripThinkingCheck',
    systemPrompt: '#systemPromptInput',
    userPrompt: '#userPromptInput',
  },
};

const PREFIX_STORAGE_KEYS = {
  captionerProgress: 'image-captioner-progress:',
};

const CONFIG_VERSION = '1.1';

const CAPTIONER_EXPORT_MESSAGE = 'captioner:export-data';
const CAPTIONER_IMPORT_MESSAGE = 'captioner:import-data';
const CAPTIONER_RUNTIME_KEY = 'captioner-runtime';
const CAPTIONER_PENDING_IMPORT_KEY = 'captioner-pending-import';

function postToCaptioner(type, payload, mode) {
  return new Promise((resolve) => {
    const frame = document.querySelector('#panel-captioner iframe');
    if (!frame?.contentWindow) {
      resolve(null);
      return;
    }
    const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    let timer = null;
    const onMessage = (event) => {
      const data = event.data || {};
      if (data.requestId !== requestId) return;
      if (timer) window.clearTimeout(timer);
      window.removeEventListener('message', onMessage);
      resolve(data);
    };
    window.addEventListener('message', onMessage);
    timer = window.setTimeout(() => {
      window.removeEventListener('message', onMessage);
      resolve(null);
    }, 3000);
    frame.contentWindow.postMessage(
      { type, requestId, payload, mode },
      { targetOrigin: '*' },
    );
  });
}

async function collectCaptionerRuntimeData() {
  // 优先从 sessionStorage 读取 captioner 实时同步的导出数据（同源共享，最可靠）
  try {
    const raw = sessionStorage.getItem(CAPTIONER_RUNTIME_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch {
    // ignore
  }
  // 回退：postMessage 请求 iframe
  const reply = await postToCaptioner(CAPTIONER_EXPORT_MESSAGE);
  if (reply && reply.payload && typeof reply.payload === 'object') {
    return reply.payload;
  }
  return null;
}

function readScopedLocalStorage(keys) {
  const output = {};
  for (const key of keys) {
    const value = localStorage.getItem(key);
    if (value !== null) {
      output[key] = value;
    }
  }
  return output;
}

function readPrefixedLocalStorage(prefix) {
  const output = {};
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      output[key] = localStorage.getItem(key);
    }
  }
  return output;
}

function readFormSnapshot(frameDocument, selectors) {
  if (!frameDocument || !selectors) return null;

  const readValue = (selector) => frameDocument.querySelector(selector)?.value ?? '';
  const readChecked = (selector, fallback = true) => {
    const element = frameDocument.querySelector(selector);
    return element ? !!element.checked : fallback;
  };
  const activeProvider = frameDocument.querySelector(selectors.providerType);

  return {
    providerType: activeProvider?.dataset?.provider === 'openai' ? 'openai' : 'lmstudio',
    serverUrl: String(readValue(selectors.serverUrl)).trim(),
    model: String(readValue(selectors.model)).trim(),
    timeoutSeconds: Number.parseInt(readValue(selectors.timeoutSeconds), 10) || 120,
    apiKey: String(readValue(selectors.apiKey)),
    recursive: readChecked(selectors.recursive, true),
    skipExisting: readChecked(selectors.skipExisting, true),
    stripThinking: readChecked(selectors.stripThinking, true),
    systemPrompt: String(readValue(selectors.systemPrompt)).trim(),
    userPrompt: String(readValue(selectors.userPrompt)).trim(),
  };
}

function collectCaptionerData() {
  const stored = readScopedLocalStorage(TOOL_STORAGE_KEYS.captioner);
  const captionerFrame = document.querySelector('#panel-captioner iframe');

  try {
    const frameDocument = captionerFrame?.contentDocument;
    const liveConfig = readFormSnapshot(frameDocument, TOOL_SELECTORS.captioner);
    if (liveConfig) {
      stored['image-captioner-config'] = JSON.stringify(liveConfig);
    }
  } catch {
    // Ignore iframe access/read issues and fall back to stored values.
  }

  return stored;
}

async function collectAllLocalStorageData() {
  const captionerRuntime = await collectCaptionerRuntimeData();
  return {
    version: CONFIG_VERSION,
    exportDate: new Date().toISOString(),
    tools: {
      cropper: readScopedLocalStorage(TOOL_STORAGE_KEYS.cropper),
      captioner: collectCaptionerData(),
      captionerProgress: readPrefixedLocalStorage(PREFIX_STORAGE_KEYS.captionerProgress),
      captionerRuntime, // 图片描述工具新增数据（单图/文件夹结果、缓存文件夹名等，来自 IndexedDB）
      tagtool: readScopedLocalStorage(TOOL_STORAGE_KEYS.tagtool),
      hub: readScopedLocalStorage(Object.values(STORAGE_KEYS)),
    },
  };
}

function writeScopedLocalStorage(data, keys) {
  if (!data || typeof data !== 'object') return;
  for (const key of keys) {
    const value = data[key];
    if (value !== undefined) {
      localStorage.setItem(key, value);
    }
  }
}

function replacePrefixedLocalStorage(prefix, data) {
  for (let i = localStorage.length - 1; i >= 0; i -= 1) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      localStorage.removeItem(key);
    }
  }

  if (!data || typeof data !== 'object') return;
  for (const [key, value] of Object.entries(data)) {
    if (key.startsWith(prefix)) {
      localStorage.setItem(key, value);
    }
  }
}

function isValidConfigPayload(config) {
  return !!config && typeof config === 'object' && !!config.tools && typeof config.tools === 'object';
}

// Export configuration to JSON file (choose save location when supported)
async function exportConfig() {
  try {
    const config = await collectAllLocalStorageData();
    const json = JSON.stringify(config, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const timestamp = new Date().toISOString().slice(0, 10);
    const suggestedName = `web-tools-config-${timestamp}.json`;

    // 优先使用 showSaveFilePicker 让用户选择保存位置（Chromium 内核浏览器）
    if (window.showSaveFilePicker) {
      let handle;
      try {
        handle = await window.showSaveFilePicker({
          suggestedName,
          types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }],
        });
      } catch (error) {
        if (error?.name === 'AbortError') return; // 用户取消选择
        throw error;
      }
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
    } else {
      // 回退：直接下载到默认下载目录
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = suggestedName;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 500);
    }
    alert(t('exportSuccess'));
  } catch (error) {
    console.error('Export failed:', error);
    alert(t('exportError') + ': ' + error.message);
  }
}

// Import configuration from JSON file
async function importConfig() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json,.json';

  input.onchange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const config = JSON.parse(text);

      if (!isValidConfigPayload(config)) {
        throw new Error(t('importInvalid'));
      }

      // 弹窗询问合并还是覆盖
      const mode = await askImportMode();
      if (!mode) return;

      await applyImportedTools(config, mode);

      // Reload page to apply changes
      alert(t('importSuccess'));
      location.reload();
    } catch (error) {
      console.error('Import failed:', error);
      alert(t('importError') + ': ' + error.message);
    }
  };

  input.click();
}

function showImportModal() {
  const modal = document.getElementById('importModal');
  if (modal) modal.hidden = false;
}

function hideImportModal() {
  const modal = document.getElementById('importModal');
  if (modal) modal.hidden = true;
}

function askImportMode() {
  return new Promise((resolve) => {
    showImportModal();
    const mergeBtn = document.getElementById('importMergeConfirmBtn');
    const overwriteBtn = document.getElementById('importOverwriteConfirmBtn');
    const cancelBtn = document.getElementById('importCancelConfirmBtn');

    const cleanup = () => {
      hideImportModal();
      if (mergeBtn) mergeBtn.removeEventListener('click', onMerge);
      if (overwriteBtn) overwriteBtn.removeEventListener('click', onOverwrite);
      if (cancelBtn) cancelBtn.removeEventListener('click', onCancel);
    };
    const onMerge = () => { cleanup(); resolve('merge'); };
    const onOverwrite = () => { cleanup(); resolve('overwrite'); };
    const onCancel = () => { cleanup(); resolve(null); };

    if (mergeBtn) mergeBtn.addEventListener('click', onMerge);
    if (overwriteBtn) overwriteBtn.addEventListener('click', onOverwrite);
    if (cancelBtn) cancelBtn.addEventListener('click', onCancel);
  });
}

async function applyImportedTools(config, mode) {
  // 写入各工具 localStorage 配置
  writeScopedLocalStorage(config.tools.cropper, TOOL_STORAGE_KEYS.cropper);
  writeScopedLocalStorage(config.tools.captioner, TOOL_STORAGE_KEYS.captioner);
  replacePrefixedLocalStorage(PREFIX_STORAGE_KEYS.captionerProgress, config.tools.captionerProgress);
  writeScopedLocalStorage(config.tools.tagtool, TOOL_STORAGE_KEYS.tagtool);
  writeScopedLocalStorage(config.tools.hub, Object.values(STORAGE_KEYS));

  // 图片描述工具的新数据（单图/文件夹结果等，存于 IndexedDB）
  // 优先写入 sessionStorage：同源共享，reload 后 captioner 自己读取应用，规避 iframe 时序问题
  if (config.tools.captionerRuntime && typeof config.tools.captionerRuntime === 'object') {
    try {
      sessionStorage.setItem(
        CAPTIONER_PENDING_IMPORT_KEY,
        JSON.stringify({ payload: config.tools.captionerRuntime, mode }),
      );
    } catch {
      // sessionStorage 不可用/超限时，回退为 postMessage 即时应用
      await postToCaptioner(CAPTIONER_IMPORT_MESSAGE, config.tools.captionerRuntime, mode);
    }
  }
}

// Update config button text when language changes
function updateConfigButtons() {
  if (exportConfigBtn) {
    exportConfigBtn.textContent = t('exportConfig');
    exportConfigBtn.title = t('exportConfig');
  }
  if (importConfigBtn) {
    importConfigBtn.textContent = t('importConfig');
    importConfigBtn.title = t('importConfig');
  }

  const i18nNodeIds = ['importModal', 'importMergeConfirmBtn', 'importOverwriteConfirmBtn', 'importCancelConfirmBtn'];
  for (const id of i18nNodeIds) {
    const node = document.getElementById(id);
    if (node?.dataset.i18n) {
      node.textContent = t(node.dataset.i18n);
    }
  }
  const modal = document.getElementById('importModal');
  if (modal) {
    for (const node of modal.querySelectorAll('[data-i18n]')) {
      node.textContent = t(node.dataset.i18n);
    }
  }
}

// Override applyLanguage to update config buttons
const originalApplyLanguage = applyLanguage;
applyLanguage = function() {
  originalApplyLanguage();
  updateConfigButtons();
};

// Bind export/import buttons
if (exportConfigBtn) {
  exportConfigBtn.addEventListener('click', exportConfig);
}

if (importConfigBtn) {
  importConfigBtn.addEventListener('click', importConfig);
}

applyLanguage();
applyTheme();
const savedTab = localStorage.getItem(STORAGE_KEYS.activeTab);
setActiveTab(savedTab || 'cropper');