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
const dataFolderText = document.getElementById('dataFolderText');
const chooseDataFolderBtn = document.getElementById('chooseDataFolderBtn');

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
    privacyNotice: '🔒 所有数据仅保存在你的浏览器和本地磁盘上，本站点永远不会获得你的数据',
    exportSuccess: '✓ 配置已导出',
    importSuccess: '✓ 配置已导入',
    exportAskTitle: '选择要导出的数据',
    exportAskDesc: '勾选要包含在导出文件中的数据种类：',
    importAskTitle: '选择要导入的数据',
    importAskDesc: '勾选要导入的数据种类，并选择导入方式：',
    categoryConfirmBtn: '确定',
    categoryCancelBtn: '取消',
    categoryEmpty: '请至少选择一种数据',
    importModeTitle: '导入方式',
    importMergeLabel: '合并（保留现有数据，按名称去重）',
    importOverwriteLabel: '覆盖（清空现有数据后整体替换）',
    catCropper: '图片裁切',
    catCropperDesc: '裁切设置',
    catCaptioner: '图片描述',
    catCaptionerDesc: '配置 / 提示词 / 预设 / 进度 / 结果',
    catTagtool: '标签工具',
    catTagtoolDesc: '分组 / 标签 / 预览图',
    importError: '❌ 配置导入失败',
    exportError: '❌ 配置导出失败',
    importInvalid: '❌ 无效的配置文件',
    dataFolderLabel: '选择数据缓存位置：',
    dataFolderDefault: '浏览器本地',
    chooseDataFolder: '选择数据缓存位置（图片描述的缓存与标签工具的数据文件共用）',
    dataFolderUnsupported: '当前浏览器不支持选择文件夹',
    dataFolderFailed: '❌ 选择文件夹失败',
    storageChoiceTitle: '选择数据保存位置',
    storageChoiceDesc: '所有设置、标签与结果缓存都将保存到你选择的本地文件夹，不占用浏览器存储，清理浏览器数据也不会丢失。',
    storageChoiceFolderBtn: '📁 选择本地保存位置',
    storageChoiceCancel: '取消（本次暂不保存）',
    storageReauthTitle: '需要重新授权数据文件夹',
    storageReauthDesc: '浏览器重启后需要重新授权才能读写已选择的数据文件夹。点击下方按钮重新授权，设置与标签将从该文件夹恢复。',
    storageReauthFolderBtn: '🔓 重新授权数据文件夹',
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
    privacyNotice: '🔒 All data is stored only in your browser and local disk. This site never receives your data.',
    exportSuccess: '✓ Configuration exported',
    importSuccess: '✓ Configuration imported',
    exportAskTitle: 'Select data to export',
    exportAskDesc: 'Check the data categories to include in the export file:',
    importAskTitle: 'Select data to import',
    importAskDesc: 'Check the data categories to import and choose the import mode:',
    categoryConfirmBtn: 'Confirm',
    categoryCancelBtn: 'Cancel',
    categoryEmpty: 'Please select at least one data category',
    importModeTitle: 'Import Mode',
    importMergeLabel: 'Merge (keep existing data, dedupe by name)',
    importOverwriteLabel: 'Overwrite (clear existing data, then replace entirely)',
    catCropper: 'Image Cropper',
    catCropperDesc: 'Crop settings',
    catCaptioner: 'Image Captioner',
    catCaptionerDesc: 'Config / Prompts / Presets / Progress / Results',
    catTagtool: 'Tag Tool',
    catTagtoolDesc: 'Groups / tags / preview images',
    importError: '❌ Configuration import failed',
    exportError: '❌ Configuration export failed',
    importInvalid: '❌ Invalid configuration file',
    dataFolderLabel: 'Choose data cache location: ',
    dataFolderDefault: 'Browser Storage',
    chooseDataFolder: 'Choose data cache location (shared by the captioner cache and tag tool data file)',
    dataFolderUnsupported: 'This browser does not support choosing a folder',
    dataFolderFailed: '❌ Failed to choose folder',
    storageChoiceTitle: 'Choose where to store your data',
    storageChoiceDesc: 'All settings, tags and result caches are saved to a local folder you choose — no browser storage, immune to clearing browser data.',
    storageChoiceFolderBtn: '📁 Choose a local folder',
    storageChoiceCancel: 'Cancel (do not save this time)',
    storageReauthTitle: 'Re-authorize the data folder',
    storageReauthDesc: 'After a browser restart, access to the data folder must be re-granted. Click the button below to re-authorize; settings and tags will be restored from that folder.',
    storageReauthFolderBtn: '🔓 Re-authorize data folder',
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
  // 标签预览图（anatomy_tag_images_v1）与输入框内容一并导出，换设备时不丢
  tagtool: [
    'anatomy_tag_groups_v1',
    'anatomy_categories_v1',
    'anatomy_tag_images_v1',
    'tag_tool_inputs_state',
    'app_language',
  ],
};

// 数据种类定义：id 用于勾选过滤，i18nKey/i18nDescKey 提供多语言标签
// 三种工具各一项；图片描述项内部包含 API 配置/提示词/预设/进度/结果
const DATA_CATEGORIES = [
  { id: 'cropper', i18nKey: 'catCropper', i18nDescKey: 'catCropperDesc' },
  { id: 'captioner', i18nKey: 'catCaptioner', i18nDescKey: 'catCaptionerDesc' },
  { id: 'tagtool', i18nKey: 'catTagtool', i18nDescKey: 'catTagtoolDesc' },
];

function allCategoryIds() {
  return DATA_CATEGORIES.map((cat) => cat.id);
}

const TOOL_SELECTORS = {
  captioner: {
    serverUrl: '#serverUrlInput',
    model: '#modelInput',
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
  // 向 iframe 实时请求最新运行数据（buildExportData 读的是当前表单/状态）。
  // 不用 sessionStorage 兜底缓存：captioner 只在特定时刻同步它，里面可能是过期的
  // 配置快照，导入时会把刚写入的新 API 配置覆盖掉。
  const reply = await postToCaptioner(CAPTIONER_EXPORT_MESSAGE);
  if (reply && reply.payload && typeof reply.payload === 'object') {
    return reply.payload;
  }
  // 回退：iframe 不可达时才读同源 sessionStorage
  try {
    const raw = sessionStorage.getItem(CAPTIONER_RUNTIME_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch {
    // ignore
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

  // 仅读取页面真实存在的表单字段；timeoutSeconds 等页面无输入项的字段由调用方从已有配置继承
  return {
    serverUrl: String(readValue(selectors.serverUrl)).trim(),
    model: String(readValue(selectors.model)).trim(),
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
      // 用实时表单值覆盖，但保留页面无输入项的字段（如 timeoutSeconds、providerType）原值
      let previous = {};
      try {
        previous = JSON.parse(stored['image-captioner-config'] || '{}');
      } catch {
        // ignore malformed stored config
      }
      stored['image-captioner-config'] = JSON.stringify({ ...previous, ...liveConfig });
    }
  } catch {
    // Ignore iframe access/read issues and fall back to stored values.
  }

  return stored;
}

async function collectAllLocalStorageData(categories) {
  const set = new Set(categories && categories.length ? categories : allCategoryIds());
  const tools = {};
  if (set.has('cropper')) {
    tools.cropper = readScopedLocalStorage(TOOL_STORAGE_KEYS.cropper);
  }
  if (set.has('captioner')) {
    // 图片描述项包含：配置/预设（localStorage）、进度（带前缀 localStorage）、结果（IndexedDB/sessionStorage）
    tools.captioner = collectCaptionerData();
    tools.captionerProgress = readPrefixedLocalStorage(PREFIX_STORAGE_KEYS.captionerProgress);
    tools.captionerRuntime = await collectCaptionerRuntimeData();
  }
  if (set.has('tagtool')) {
    tools.tagtool = readScopedLocalStorage(TOOL_STORAGE_KEYS.tagtool);
  }
  return {
    version: CONFIG_VERSION,
    exportDate: new Date().toISOString(),
    tools,
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
    const selection = await showCategorySelection({ mode: 'export' });
    if (!selection) return;
    const config = await collectAllLocalStorageData(selection.categories);
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

      // 弹窗选择要导入的数据种类与导入方式（合并/覆盖）
      const selection = await showCategorySelection({ mode: 'import' });
      if (!selection) return;

      await applyImportedTools(config, selection.importMode, selection.categories);

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

// 数据种类选择弹窗：mode 为 'export' 或 'import'
// 返回 { categories: string[], importMode: 'merge'|'overwrite'|null }，取消返回 null
function showCategorySelection({ mode }) {
  return new Promise((resolve) => {
    const modal = document.getElementById('categoryModal');
    const title = document.getElementById('categoryModalTitle');
    const desc = document.getElementById('categoryModalDesc');
    const list = document.getElementById('categoryList');
    const modeRow = document.getElementById('importModeRow');
    const confirmBtn = document.getElementById('categoryConfirmBtn');
    const cancelBtn = document.getElementById('categoryCancelBtn');
    if (!modal || !list || !confirmBtn || !cancelBtn) {
      resolve(null);
      return;
    }

    const isExport = mode === 'export';
    title.textContent = t(isExport ? 'exportAskTitle' : 'importAskTitle');
    desc.textContent = t(isExport ? 'exportAskDesc' : 'importAskDesc');

    // 渲染分类复选框（默认全选）
    list.innerHTML = '';
    for (const cat of DATA_CATEGORIES) {
      const label = document.createElement('label');
      label.className = 'category-option';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = cat.id;
      checkbox.checked = true;

      const name = document.createElement('span');
      name.textContent = t(cat.i18nKey);

      const hint = document.createElement('span');
      hint.className = 'category-desc';
      hint.textContent = t(cat.i18nDescKey);

      label.appendChild(checkbox);
      label.appendChild(name);
      label.appendChild(hint);
      list.appendChild(label);
    }

    // 导入时显示合并/覆盖选择，导出时隐藏
    if (modeRow) {
      modeRow.hidden = !isExport ? false : true;
      if (!isExport) {
        const mergeRadio = modeRow.querySelector('input[name="importMode"][value="merge"]');
        if (mergeRadio) mergeRadio.checked = true;
      }
    }

    confirmBtn.textContent = t('categoryConfirmBtn');
    cancelBtn.textContent = t('categoryCancelBtn');

    const cleanup = () => {
      modal.hidden = true;
      confirmBtn.removeEventListener('click', onConfirm);
      cancelBtn.removeEventListener('click', onCancel);
    };
    const onConfirm = () => {
      const checked = [...list.querySelectorAll('input[type="checkbox"]:checked')].map((el) => el.value);
      if (!checked.length) {
        alert(t('categoryEmpty'));
        return;
      }
      const importMode = isExport
        ? null
        : (modeRow?.querySelector('input[name="importMode"]:checked')?.value || 'merge');
      cleanup();
      resolve({ categories: checked, importMode });
    };
    const onCancel = () => {
      cleanup();
      resolve(null);
    };

    confirmBtn.addEventListener('click', onConfirm);
    cancelBtn.addEventListener('click', onCancel);
    modal.hidden = false;
  });
}

async function applyImportedTools(config, mode, categories) {
  const set = new Set(categories && categories.length ? categories : allCategoryIds());

  // 写入各工具 localStorage 配置
  if (set.has('cropper')) {
    writeScopedLocalStorage(config.tools.cropper, TOOL_STORAGE_KEYS.cropper);
  }
  if (set.has('captioner')) {
    writeScopedLocalStorage(config.tools.captioner, TOOL_STORAGE_KEYS.captioner);
    replacePrefixedLocalStorage(PREFIX_STORAGE_KEYS.captionerProgress, config.tools.captionerProgress);

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
  if (set.has('tagtool')) {
    writeScopedLocalStorage(config.tools.tagtool, TOOL_STORAGE_KEYS.tagtool);
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

  updateDataFolderText();
  const dataFolderLabelEl = document.getElementById('dataFolderLabel');
  if (dataFolderLabelEl) {
    dataFolderLabelEl.textContent = t('dataFolderLabel');
  }
  if (chooseDataFolderBtn) {
    chooseDataFolderBtn.title = t('chooseDataFolder');
    chooseDataFolderBtn.setAttribute('aria-label', t('chooseDataFolder'));
  }

  const privacyNotice = document.getElementById('privacyNotice');
  if (privacyNotice) {
    privacyNotice.textContent = t('privacyNotice');
  }

  const categoryModal = document.getElementById('categoryModal');
  if (categoryModal) {
    for (const node of categoryModal.querySelectorAll('[data-i18n]')) {
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

// ═══════════════════════════════════════════════════════════
//  Unified data folder (captioner cache + tag tool data file)
//  Hub 顶部公共栏是唯一入口：选中的目录同时下发给图片描述（缓存）
//  与标签工具（tag-data.json），两侧数据仍在每次变更时实时写盘。
// ═══════════════════════════════════════════════════════════

const HUB_DB_NAME = 'web-tools-hub';
const HUB_DB_STORE = 'kv';
const HUB_DATA_FOLDER_KEY = 'dataFolderHandle';
const STUDIO_SET_DATA_FOLDER = 'studio:set-data-folder';
const STUDIO_FRAME_READY = 'studio:frame-ready';

let hubDataFolderHandle = null;

function openHubDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(HUB_DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(HUB_DB_STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function hubDbSet(key, value) {
  const db = await openHubDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HUB_DB_STORE, 'readwrite');
    tx.objectStore(HUB_DB_STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function hubDbGet(key) {
  const db = await openHubDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HUB_DB_STORE, 'readonly');
    const request = tx.objectStore(HUB_DB_STORE).get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function updateDataFolderText() {
  if (!dataFolderText) return;
  if (hubDataFolderHandle) {
    dataFolderText.textContent = hubDataFolderHandle.name;
    dataFolderText.title = hubDataFolderHandle.name;
  } else {
    dataFolderText.textContent = t('dataFolderDefault');
    dataFolderText.title = t('storageChoiceDesc');
  }
}

// 向工具页投递消息；targetWindow 为空时广播给所有工具页
function postToToolFrames(message, targetWindow) {
  if (targetWindow) {
    try {
      targetWindow.postMessage(message, '*');
    } catch {
      // Ignore cross-frame sync errors.
    }
    return;
  }
  for (const frame of getToolFrames()) {
    try {
      frame.contentWindow?.postMessage(message, '*');
    } catch {
      // Ignore cross-frame sync errors.
    }
  }
}

function broadcastDataFolder(targetWindow) {
  postToToolFrames({ type: STUDIO_SET_DATA_FOLDER, handle: hubDataFolderHandle }, targetWindow);
}

async function chooseDataFolder() {
  if (typeof window.showDirectoryPicker !== 'function') {
    alert(t('dataFolderUnsupported'));
    return;
  }
  try {
    const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
    hubDataFolderHandle = handle;
    updateDataFolderText();
    try {
      await hubDbSet(HUB_DATA_FOLDER_KEY, handle);
    } catch {
      // 句柄无法持久化时仍可用，仅刷新后需重新选择
    }
    broadcastDataFolder();
    scheduleDataFolderRebroadcast();
    // 选定目录后立即落盘一份设置快照，保证 studio-settings.json 从此刻起存在
    flushSettingsToFile();
  } catch (error) {
    if (error?.name === 'AbortError') return;
    alert(t('dataFolderFailed') + ': ' + (error?.message || error));
  }
}

async function restoreDataFolder() {
  try {
    const handle = await hubDbGet(HUB_DATA_FOLDER_KEY);
    if (!handle) return;
    hubDataFolderHandle = handle;
    updateDataFolderText();
    broadcastDataFolder();
  } catch {
    // IndexedDB 不可用时忽略，用户重新选择即可
  }
}

// 延迟补发：工具页在 iframe load 之后还要经过 init 才会注册监听，
// 单次广播可能发在它注册之前。这里在启动/选择后多补几次，保证刷新后能恢复。
function scheduleDataFolderRebroadcast() {
  [600, 1500, 3000].forEach((delay) => {
    window.setTimeout(() => {
      if (hubDataFolderHandle) broadcastDataFolder();
    }, delay);
  });
}

// ═══════════════════════════════════════════════════════════
//  Settings persistence (studio-settings.json in the data folder)
//  所有工具页与 Hub 同源共享 localStorage，因此只需 Hub 一处：
//  启动时从文件夹恢复（以文件为准），运行中把受管 key 的变更
//  实时镜像写入 studio-settings.json。工具页代码无需感知。
// ═══════════════════════════════════════════════════════════

const SETTINGS_FILE_NAME = 'studio-settings.json';
const SETTINGS_FILE_VERSION = '1.0';
const SETTINGS_SYNC_INTERVAL_MS = 3000;
const SETTINGS_SYNC_DEBOUNCE_MS = 1000;

// 受管 key：Hub 自身 + 各工具的设置类 localStorage（进度按前缀收集）
const SETTINGS_MANAGED_KEYS = [
  STORAGE_KEYS.activeTab,
  STORAGE_KEYS.language,
  STORAGE_KEYS.theme,
  ...TOOL_STORAGE_KEYS.cropper,
  ...TOOL_STORAGE_KEYS.captioner,
  ...TOOL_STORAGE_KEYS.tagtool,
  'anatomy_collapsed_cats',
  'tag_tool_insert_mode',
  'tag_tool_search_mode_sidebar',
  'tag_tool_search_mode_gallery',
];
const SETTINGS_MANAGED_PREFIXES = [PREFIX_STORAGE_KEYS.captionerProgress];

function collectSettingsSnapshot() {
  const snapshot = {};
  for (const key of SETTINGS_MANAGED_KEYS) {
    const value = localStorage.getItem(key);
    if (value !== null) snapshot[key] = value;
  }
  for (const prefix of SETTINGS_MANAGED_PREFIXES) {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) snapshot[key] = localStorage.getItem(key);
    }
  }
  return snapshot;
}

function snapshotToPayload(snapshot) {
  return JSON.stringify({
    version: SETTINGS_FILE_VERSION,
    updatedDate: new Date().toISOString(),
    settings: snapshot,
  });
}

async function writeSettingsFile(snapshot) {
  if (!hubDataFolderHandle) return;
  try {
    const fileHandle = await hubDataFolderHandle.getFileHandle(SETTINGS_FILE_NAME, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(snapshotToPayload(snapshot));
    await writable.close();
  } catch (error) {
    console.warn('Failed to write studio-settings.json:', error);
  }
}

async function readSettingsFile() {
  if (!hubDataFolderHandle) return null;
  try {
    const fileHandle = await hubDataFolderHandle.getFileHandle(SETTINGS_FILE_NAME, { create: false });
    const file = await fileHandle.getFile();
    const parsed = JSON.parse(await file.text());
    return parsed && typeof parsed.settings === 'object' && parsed.settings ? parsed : null;
  } catch {
    // 文件不存在或损坏时返回 null，回退到浏览器里的现有数据
    return null;
  }
}

// 以文件夹文件为准恢复受管 key；返回是否发生了恢复
async function restoreSettingsFromFolder() {
  const data = await readSettingsFile();
  if (!data) return false;
  for (const [key, value] of Object.entries(data.settings)) {
    try {
      localStorage.setItem(key, String(value));
    } catch {
      // 单条写入失败不阻断整体恢复
    }
  }
  return true;
}

let lastSyncedSnapshotJson = null;
let settingsSyncTimer = null;
let settingsDebounceTimer = null;

// 比较快照与上次已写盘内容，有变化才写（防抖合并密集变更）
function scheduleSettingsFlush() {
  if (!hubDataFolderHandle) return;
  const snapshotJson = JSON.stringify(collectSettingsSnapshot());
  if (snapshotJson === lastSyncedSnapshotJson) return;
  if (settingsDebounceTimer) window.clearTimeout(settingsDebounceTimer);
  settingsDebounceTimer = window.setTimeout(() => {
    settingsDebounceTimer = null;
    const latest = JSON.stringify(collectSettingsSnapshot());
    if (latest === lastSyncedSnapshotJson) return;
    lastSyncedSnapshotJson = latest;
    writeSettingsFile(JSON.parse(latest));
  }, SETTINGS_SYNC_DEBOUNCE_MS);
}

function flushSettingsToFile() {
  if (!hubDataFolderHandle) return;
  if (settingsDebounceTimer) {
    window.clearTimeout(settingsDebounceTimer);
    settingsDebounceTimer = null;
  }
  const snapshot = collectSettingsSnapshot();
  lastSyncedSnapshotJson = JSON.stringify(snapshot);
  writeSettingsFile(snapshot);
}

function startSettingsSync() {
  if (settingsSyncTimer) return;
  settingsSyncTimer = window.setInterval(scheduleSettingsFlush, SETTINGS_SYNC_INTERVAL_MS);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushSettingsToFile();
  });
  window.addEventListener('pagehide', flushSettingsToFile);
}

// ═══════════════════════════════════════════════════════════
//  Startup storage-choice dialog + boot sequence
//  数据文件夹未配置 → 开屏弹「浏览器 / 本地文件夹」选择；
//  已配置但权限丢失（浏览器重启） → 弹重新授权。
//  恢复完成后才加载工具 iframe，保证工具页读到恢复后的设置。
// ═══════════════════════════════════════════════════════════

const storageChoiceModal = document.getElementById('storageChoiceModal');
const storageChoiceTitle = document.getElementById('storageChoiceTitle');
const storageChoiceDesc = document.getElementById('storageChoiceDesc');
const storageFolderBtn = document.getElementById('storageFolderBtn');
const storageCancelLink = document.getElementById('storageLaterLink');

function showStorageChoiceDialog({ mode }) {
  return new Promise((resolve) => {
    if (!storageChoiceModal || !storageFolderBtn || !storageCancelLink) {
      resolve(null);
      return;
    }
    const reauth = mode === 'reauth';
    if (storageChoiceTitle) storageChoiceTitle.textContent = t(reauth ? 'storageReauthTitle' : 'storageChoiceTitle');
    if (storageChoiceDesc) storageChoiceDesc.textContent = t(reauth ? 'storageReauthDesc' : 'storageChoiceDesc');
    storageFolderBtn.textContent = t(reauth ? 'storageReauthFolderBtn' : 'storageChoiceFolderBtn');
    storageCancelLink.textContent = t('storageChoiceCancel');

    const cleanup = () => {
      storageChoiceModal.hidden = true;
      storageFolderBtn.removeEventListener('click', onFolder);
      storageCancelLink.removeEventListener('click', onCancel);
    };
    const onFolder = () => {
      cleanup();
      resolve('folder');
    };
    const onCancel = (event) => {
      event.preventDefault();
      cleanup();
      resolve('cancel');
    };

    storageFolderBtn.addEventListener('click', onFolder);
    storageCancelLink.addEventListener('click', onCancel);
    storageChoiceModal.hidden = false;
  });
}

async function ensureFolderPermission(handle) {
  if (!handle) return false;
  const opts = { mode: 'readwrite' };
  try {
    if (typeof handle.queryPermission === 'function' && (await handle.queryPermission(opts)) === 'granted') {
      return true;
    }
    if (typeof handle.requestPermission === 'function') {
      return (await handle.requestPermission(opts)) === 'granted';
    }
    return false;
  } catch {
    return false;
  }
}

function loadToolFrames() {
  for (const frame of getToolFrames()) {
    const src = frame.dataset.src;
    if (src && !frame.getAttribute('src')) frame.src = src;
  }
}

// 启动后重新应用从文件恢复出来的语言/主题/页签
function applyRestoredPreferences() {
  state.language = localStorage.getItem(STORAGE_KEYS.language) === 'en' ? 'en' : 'zh';
  state.theme = localStorage.getItem(STORAGE_KEYS.theme) || 'dark';
  applyLanguage();
  applyTheme();
  setActiveTab(localStorage.getItem(STORAGE_KEYS.activeTab) || 'cropper');
}

async function startup() {
  await restoreDataFolder();

  if (hubDataFolderHandle) {
    const granted = await ensureFolderPermission(hubDataFolderHandle);
    if (!granted) {
      // requestPermission 需要用户手势：由对话框按钮点击触发
      const choice = await showStorageChoiceDialog({ mode: 'reauth' });
      if (choice === 'folder') {
        await ensureFolderPermission(hubDataFolderHandle);
      }
    }
    if (hubDataFolderHandle && (await ensureFolderPermission(hubDataFolderHandle))) {
      await restoreSettingsFromFolder();
    }
  } else if (typeof window.showDirectoryPicker === 'function') {
    // 不再提供「存浏览器」选项：数据一律落盘本地文件夹；取消后下次打开仍会提示
    const choice = await showStorageChoiceDialog({ mode: 'choose' });
    if (choice === 'folder') {
      try {
        const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
        hubDataFolderHandle = handle;
        updateDataFolderText();
        try {
          await hubDbSet(HUB_DATA_FOLDER_KEY, handle);
        } catch {
          // 句柄无法持久化时仍可用，仅刷新后需重新选择
        }
        await restoreSettingsFromFolder();
        flushSettingsToFile();
      } catch (error) {
        if (error?.name !== 'AbortError') {
          alert(t('dataFolderFailed') + ': ' + (error?.message || error));
        }
      }
    }
  }

  applyRestoredPreferences();
  loadToolFrames();
  broadcastDataFolder();
  scheduleDataFolderRebroadcast();
  startSettingsSync();
  if (hubDataFolderHandle) {
    await ensureFolderPermission(hubDataFolderHandle).catch(() => {});
    flushSettingsToFile();
  }
}

chooseDataFolderBtn?.addEventListener('click', chooseDataFolder);

// 工具页每次加载完成后补发一次句柄（Hub 恢复句柄可能早于 iframe 注册监听）
for (const frame of getToolFrames()) {
  frame.addEventListener('load', () => {
    if (hubDataFolderHandle) broadcastDataFolder(frame.contentWindow);
  });
}

// 工具页就绪握手：无论 Hub 恢复与 iframe 加载谁先完成，都能拿到当前句柄
window.addEventListener('message', (event) => {
  if (event.data?.type !== STUDIO_FRAME_READY) return;
  // 只回应本页自己的工具页，避免把目录句柄交给第三方页面
  if (event.origin !== window.location.origin) return;
  const isToolFrame = getToolFrames().some((frame) => frame.contentWindow === event.source);
  if (!isToolFrame) return;
  broadcastDataFolder(event.source);
});

applyLanguage();
applyTheme();
setActiveTab(localStorage.getItem(STORAGE_KEYS.activeTab) || 'cropper');
startup();