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
    catTagtoolDesc: '分组与标签',
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
    catTagtoolDesc: 'Groups and tags',
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

applyLanguage();
applyTheme();
const savedTab = localStorage.getItem(STORAGE_KEYS.activeTab);
setActiveTab(savedTab || 'cropper');