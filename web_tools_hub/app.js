const STORAGE_KEYS = {
  activeTab: 'web-tools-hub-active-tab',
  language: 'web-tools-hub-language',
};

const LANGUAGE_SYNC_MESSAGE = 'web-tools-hub:set-language';

const tabButtons = [...document.querySelectorAll('[data-tab]')];
const tabPanels = [...document.querySelectorAll('.tool-panel')];
const langToggleBtn = document.getElementById('langToggleBtn');
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
    exportSuccess: '✓ 配置已导出',
    importSuccess: '✓ 配置已导入',
    importConfirm: '导入配置将覆盖现有设置，是否继续？',
    importError: '❌ 配置导入失败',
    exportError: '❌ 配置导出失败',
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
    exportSuccess: '✓ Configuration exported',
    importSuccess: '✓ Configuration imported',
    importConfirm: 'Importing configuration will overwrite existing settings. Continue?',
    importError: '❌ Configuration import failed',
    exportError: '❌ Configuration export failed',
  },
};

const state = {
  language: localStorage.getItem(STORAGE_KEYS.language) === 'en' ? 'en' : 'zh',
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
  });
}

if (langToggleBtn) {
  langToggleBtn.addEventListener('click', () => {
    state.language = state.language === 'zh' ? 'en' : 'zh';
    localStorage.setItem(STORAGE_KEYS.language, state.language);
    applyLanguage();
  });
}

// ═══════════════════════════════════════════════════════════
//  Configuration Export/Import Functions
// ═══════════════════════════════════════════════════════════

// Storage keys for each tool
const TOOL_STORAGE_KEYS = {
  cropper: ['image_cropper_web_sizes', 'image-cropper-web-language'],
  captioner: ['image-captioner-config', 'image-captioner-language'],
  captionerProgress: [], // Progress records with prefix 'image-captioner-progress:'
  tagtool: ['anatomy_tag_groups_v1', 'anatomy_categories_v1', 'app_language'],
};

// Collect all localStorage data for all tools
function collectAllLocalStorageData() {
  const config = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    tools: {},
  };

  // Collect Image Cropper data
  config.tools.cropper = {};
  for (const key of TOOL_STORAGE_KEYS.cropper) {
    const value = localStorage.getItem(key);
    if (value !== null) {
      config.tools.cropper[key] = value;
    }
  }

  // Collect Image Captioner data
  config.tools.captioner = {};
  for (const key of TOOL_STORAGE_KEYS.captioner) {
    const value = localStorage.getItem(key);
    if (value !== null) {
      config.tools.captioner[key] = value;
    }
  }

  // Collect Image Captioner progress records
  config.tools.captionerProgress = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('image-captioner-progress:')) {
      config.tools.captionerProgress[key] = localStorage.getItem(key);
    }
  }

  // Collect Tag Tool data
  config.tools.tagtool = {};
  for (const key of TOOL_STORAGE_KEYS.tagtool) {
    const value = localStorage.getItem(key);
    if (value !== null) {
      config.tools.tagtool[key] = value;
    }
  }

  // Collect Web Tools Hub data
  config.tools.hub = {};
  for (const key of Object.values(STORAGE_KEYS)) {
    const value = localStorage.getItem(key);
    if (value !== null) {
      config.tools.hub[key] = value;
    }
  }

  return config;
}

// Export configuration to JSON file
async function exportConfig() {
  try {
    const config = collectAllLocalStorageData();
    const json = JSON.stringify(config, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    const timestamp = new Date().toISOString().slice(0, 10);
    a.download = `web-tools-config-${timestamp}.json`;
    a.click();
    
    setTimeout(() => URL.revokeObjectURL(url), 500);
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
      
      // Validate config structure
      if (!config.tools || typeof config.tools !== 'object') {
        throw new Error('Invalid configuration file');
      }
      
      // Confirm import
      if (!confirm(t('importConfirm'))) {
        return;
      }
      
      // Clear existing data and import new data
      // Import Image Cropper data
      if (config.tools.cropper) {
        for (const key of TOOL_STORAGE_KEYS.cropper) {
          if (config.tools.cropper[key] !== undefined) {
            localStorage.setItem(key, config.tools.cropper[key]);
          }
        }
      }
      
      // Import Image Captioner data
      if (config.tools.captioner) {
        for (const key of TOOL_STORAGE_KEYS.captioner) {
          if (config.tools.captioner[key] !== undefined) {
            localStorage.setItem(key, config.tools.captioner[key]);
          }
        }
      }
      
      // Import Image Captioner progress records
      if (config.tools.captionerProgress) {
        // Clear existing progress records
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key.startsWith('image-captioner-progress:')) {
            localStorage.removeItem(key);
          }
        }
        // Import new progress records
        for (const [key, value] of Object.entries(config.tools.captionerProgress)) {
          localStorage.setItem(key, value);
        }
      }
      
      // Import Tag Tool data
      if (config.tools.tagtool) {
        for (const key of TOOL_STORAGE_KEYS.tagtool) {
          if (config.tools.tagtool[key] !== undefined) {
            localStorage.setItem(key, config.tools.tagtool[key]);
          }
        }
      }
      
      // Import Web Tools Hub data
      if (config.tools.hub) {
        for (const [key, value] of Object.entries(config.tools.hub)) {
          localStorage.setItem(key, value);
        }
      }
      
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
const savedTab = localStorage.getItem(STORAGE_KEYS.activeTab);
setActiveTab(savedTab || 'cropper');
