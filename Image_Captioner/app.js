const CONFIG_KEY = 'image-captioner-config';
const PRESETS_KEY = 'image-captioner-config-presets';
const PROGRESS_PREFIX = 'image-captioner-progress:';
const LANGUAGE_KEY = 'image-captioner-language';
const LANGUAGE_SYNC_MESSAGE = 'web-tools-hub:set-language';
const THEME_SYNC_MESSAGE = 'web-tools-hub:set-theme';
const SUPPORTED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.gif', '.avif']);
const LM_STUDIO_DEFAULT_URL = 'http://localhost:1234/v1';
const DEFAULT_TIMEOUT_SECONDS = 120;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1120;
const MIN_IMAGE_DIMENSION = 256;
const JPEG_QUALITY_STEPS = [85, 75, 65, 55, 45, 35];
const RESIZE_FACTOR = 0.75;
const MAX_PIXELS = 1120 * 1120;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

const DEFAULT_SYSTEM_PROMPT = `You are an image analysis assistant that describes images containing adult human characters. Your task is to observe the image and generate a single, complete English caption that clearly and accurately describes the visual content.

Rules:

Describe only what is visible in the image; do not invent details.

Focus on the adult character(s): appearance, body features, clothing or nudity, pose, facial expression, and actions.

Include notable visual details such as hairstyle, body type, skin tone, accessories, tattoos, lighting, and composition if relevant.

Mention the environment or setting only when it helps explain the scene.

Use neutral, descriptive language without opinions or judgments.

The output must be one continuous paragraph describing the image.

Do not output lists, labels, explanations, or metadata. Only produce the caption text.

Output requirement:
Generate exactly one complete English image description paragraph.`;

const DEFAULT_USER_PROMPT = 'Describe this image in one complete English paragraph.';

const I18N = {
  zh: {
    pageTitle: 'Image_Captioner',
    langToggle: 'EN',
    langToggleLabel: '切换到英文',
    brandEyebrow: 'OpenAI Compatible API',
    brandDesc: '面向批量图片描述生成的轻量工具，支持 OpenAI 兼容接口、进度记录与连续处理。',
    badgeFrontend: '纯前端',
    badgeBatch: '批量处理',
    badgeVision: '视觉模型',
    sectionApiTitle: 'API 配置',
    serverUrlLabel: '接口地址',
    modelLabel: '模型 ID',
    modelPlaceholder: '自动读取或手动填写',
    timeoutLabel: '请求超时（秒）',
    apiKeyPlaceholder: 'OpenAI 兼容接口可填写，本地服务可留空',
    show: '显示',
    hide: '隐藏',
    testConnectionBtn: '测试连接并读取模型',
    saveConfigBtn: '保存当前配置',
    presetSelectLabel: '已保存配置',
    presetSelectPlaceholder: '选择一个已保存配置',
    presetSaveLabel: '配置名称',
    loadPresetBtn: '载入',
    deletePresetBtn: '删除',
    copyPresetBtn: '复制',
    presetSaved: '已保存配置：{name}',
    presetCopied: '已复制配置：{name}',
    presetLoaded: '已载入配置：{name}',
    presetDeleted: '已删除配置：{name}',
    presetDeleteMissing: '请先选择一个要删除的配置。',
    presetLoadMissing: '请先选择一个要载入的配置。',
    presetSaveEmpty: '请输入配置名称。',
    presetNameExists: '配置名已存在，已覆盖：{name}',
    presetPromptLabel: '请输入配置名称',
    apiHelper: '兼容 `/models` 与 `/chat/completions` 接口；可接本地服务、中转、OpenAI 兼容服务。',
    sectionTaskTitle: '任务设置',
    folderLabel: '图片文件夹',
    folderPlaceholder: '使用浏览器目录选择器选择图片文件夹',
    chooseFolderBtn: '选择目录',
    recursiveLabel: '递归子目录',
    skipExistingLabel: '跳过已有 .txt',
    stripThinkingLabel: '去除思考内容',
    statSelected: '已选图片',
    statProcessed: '已完成',
    statSkipped: '已跳过',
    statFailed: '失败',
    sectionPromptTitle: '提示词',
    fillDefaultPromptBtn: '填入默认提示',
    clearPromptsBtn: '清空',
    systemPromptPlaceholder: '系统提示词',
    userPromptPlaceholder: '例如：Describe this image in one detailed English paragraph。',
    startBtn: '开始生成',
    generateCurrentBtn: '单图生成（文件夹）',
    stopBtn: '停止任务',
    prependBtn: '生成（前置）',
    appendBtn: '生成（追加）',
    clearProgressBtn: '清除进度记录',
    previewTitle: '图片预览',
    prevPreviewBtn: '上一张',
    nextPreviewBtn: '下一张',
    previewImageAlt: '预览图',
    previewPlaceholder: '选择图片目录后，可在这里查看当前处理图片。',
    previewDropHint: '支持单张图片拖拽到此区域进行导入，并直接生成描述/反推提示词。',
    currentFileLabel: '当前文件',
    currentFileNone: '未选择目录',
    progressLabel: '进度',
    outputTitle: '结果与日志',
    copyCaptionBtn: '复制结果',
    clearResultsBtn: '清除生成结果',
    clearLogBtn: '清空日志',
    resultLabel: '生成结果（图片 + 字幕，点选后复制）',
    resultsEmptyHint: '生成结果将以图片 + 字幕的形式显示在这里，最新在最上方；点选条目后点击“复制结果”可单独复制该条。',
    resultsCleared: '已清除生成结果。',
    noResultToClear: '当前没有可清除的生成结果。',
    runtimeLogLabel: '运行日志',
    runtimeIdle: '待命中',
    runtimeRunning: '运行中',
    previewSectionKicker: 'Preview',
    outputSectionKicker: 'Output',
    connectionIdle: '未检测',
    connectionChecking: '检测中',
    connectionSuccess: '连接成功',
    connectionFailed: '连接失败',
    connectionTaskRunning: '任务运行中',
    connectionTaskFinished: '任务结束',
    connectionTaskError: '任务异常',
    configSaved: '配置已保存到浏览器本地。',
    connectionSuccessLog: '连接成功，模型：{model}',
    connectionFailedLog: '连接失败：{error}',
    corsHint: '如果服务端日志只看到 OPTIONS 或提示缺少 messages，通常是浏览器跨域预检未被正确处理，需要在 API 端开启 CORS。',
    noProgressToClear: '当前还没有目录进度记录可清除。',
    progressCleared: '已清除目录进度记录：{name}',
    browserNoDirectoryPicker: '当前浏览器不支持目录选择器，请使用 Chromium 内核浏览器。',
    directoryLoaded: '已加载目录 {name}，共 {count} 张图片。',
    chooseDirectoryFailed: '选择目录失败：{error}',
    fileReadFailed: '读取文件失败',
    canvasExportFailed: 'Canvas 导出失败',
    imageDecodeFailed: '图片解码失败',
    modelListEmpty: '模型列表为空，请手动填写模型 ID',
    emptyResponse: '返回内容为空',
    retryRequest: '  {name} 第 {attempt} 次请求失败，{seconds} 秒后重试。',
    unknownRequestError: '未知请求错误',
    taskCompletedWithFailure: '任务已结束，但有 {count} 张图片处理失败。',
    chooseDirectoryFirst: '请先选择图片目录。',
    directoryPermissionDenied: '目录读写权限被拒绝。',
    progressDetected: '检测到历史进度记录：{count} 项。',
    skippedByProgress: '跳过（进度记录）：{name}',
    skippedByExisting: '跳过（已存在 txt）：{name}',
    processingStarted: '开始处理：{name}',
    processingFinished: '处理完成：{name}',
    processingFailed: '处理失败：{name} -> {error}',
    taskStopped: '任务已手动停止。',
    taskCompleted: '所有任务处理完成。',
    taskException: '任务异常：{error}',
    stopRequested: '已请求停止，当前图片处理完成后结束。',
    taskStarted: '开始新的生成任务。',
    dropRejectedWhileRunning: '任务运行中，请等待完成或先停止任务，再拖入新图片。',
    noResultToCopy: '当前没有可复制的结果。',
    resultCopied: '已复制选中的结果到剪贴板。',
    allResultsCopied: '已复制全部 {count} 条结果（每条一行）。',
    copyFailed: '复制失败，浏览器可能拒绝了剪贴板访问。',
    logCleared: '日志已清空。',
    directoryRescanned: '已重新扫描目录，当前图片数量：{count}',
    appReady: '程序已就绪，等待选择目录。',
    githubLinkTitle: 'GitHub 项目主页',
  },
  en: {
    pageTitle: 'Image_Captioner',
    langToggle: '中文',
    langToggleLabel: 'Switch to Chinese',
    brandEyebrow: 'OpenAI Compatible API',
    brandDesc: 'A lightweight tool for batch image caption generation with OpenAI-compatible endpoints, progress tracking, and continuous processing.',
    badgeFrontend: 'Frontend Only',
    badgeBatch: 'Batch Processing',
    badgeVision: 'Vision Model',
    sectionApiTitle: 'API Settings',
    serverUrlLabel: 'Server URL',
    modelLabel: 'Model ID',
    modelPlaceholder: 'Auto-detect or enter manually',
    timeoutLabel: 'Timeout (seconds)',
    apiKeyPlaceholder: 'Optional for OpenAI-compatible APIs, can be left blank for local services',
    show: 'Show',
    hide: 'Hide',
    testConnectionBtn: 'Test Connection & Load Model',
    saveConfigBtn: 'Save Current Config',
    presetSelectLabel: 'Saved Presets',
    presetSelectPlaceholder: 'Select a saved preset',
    presetSaveLabel: 'Preset Name',
    loadPresetBtn: 'Load',
    deletePresetBtn: 'Delete',
    copyPresetBtn: 'Copy',
    presetSaved: 'Saved preset: {name}',
    presetCopied: 'Copied preset: {name}',
    presetLoaded: 'Loaded preset: {name}',
    presetDeleted: 'Deleted preset: {name}',
    presetDeleteMissing: 'Select a preset to delete first.',
    presetLoadMissing: 'Select a preset to load first.',
    presetSaveEmpty: 'Please enter a preset name.',
    presetNameExists: 'Preset already existed and was overwritten: {name}',
    presetPromptLabel: 'Enter a preset name',
    apiHelper: 'Compatible with `/models` and `/chat/completions`; works with local services, relays, and OpenAI-compatible services.',
    sectionTaskTitle: 'Task Settings',
    folderLabel: 'Image Folder',
    folderPlaceholder: 'Use the browser directory picker to select an image folder',
    chooseFolderBtn: 'Choose Folder',
    recursiveLabel: 'Recursive subfolders',
    skipExistingLabel: 'Skip existing .txt',
    stripThinkingLabel: 'Strip thinking',
    statSelected: 'Selected',
    statProcessed: 'Processed',
    statSkipped: 'Skipped',
    statFailed: 'Failed',
    sectionPromptTitle: 'Prompts',
    fillDefaultPromptBtn: 'Fill Default Prompts',
    clearPromptsBtn: 'Clear',
    systemPromptPlaceholder: 'System prompt',
    userPromptPlaceholder: 'Example: Describe this image in one detailed English paragraph.',
    startBtn: 'Start Generation',
    generateCurrentBtn: 'Generate Current (Folder)',
    stopBtn: 'Stop Task',
    prependBtn: 'Generate (Prepend)',
    appendBtn: 'Generate (Append)',
    clearProgressBtn: 'Clear Progress',
    previewTitle: 'Image Preview',
    prevPreviewBtn: 'Previous',
    nextPreviewBtn: 'Next',
    previewImageAlt: 'Preview image',
    previewPlaceholder: 'After selecting an image folder, the current image will be previewed here.',
    previewDropHint: 'This area also supports dragging in a single image for direct import and caption/prompt generation.',
    currentFileLabel: 'Current File',
    currentFileNone: 'No folder selected',
    progressLabel: 'Progress',
    outputTitle: 'Results & Logs',
    copyCaptionBtn: 'Copy Result',
    clearResultsBtn: 'Clear Results',
    clearLogBtn: 'Clear Log',
    resultLabel: 'Results (Image + Caption, click to select)',
    resultsEmptyHint: 'Results appear here as image + caption pairs, newest on top. Click an entry, then click "Copy Result" to copy that one.',
    resultsCleared: 'Generated results cleared.',
    noResultToClear: 'There are no generated results to clear yet.',
    allResultsCopied: 'Copied all {count} result(s), one per line.',
    runtimeLogLabel: 'Runtime Log',
    runtimeIdle: 'Idle',
    runtimeRunning: 'Running',
    previewSectionKicker: 'Preview',
    outputSectionKicker: 'Output',
    connectionIdle: 'Not Checked',
    connectionChecking: 'Checking',
    connectionSuccess: 'Connected',
    connectionFailed: 'Connection Failed',
    connectionTaskRunning: 'Task Running',
    connectionTaskFinished: 'Task Finished',
    connectionTaskError: 'Task Error',
    configSaved: 'Settings saved to browser storage.',
    connectionSuccessLog: 'Connection successful, model: {model}',
    connectionFailedLog: 'Connection failed: {error}',
    corsHint: 'If the server only logs OPTIONS or reports missing messages, the browser CORS preflight is likely not handled correctly. Enable CORS on the API side.',
    noProgressToClear: 'There is no directory progress record to clear yet.',
    progressCleared: 'Cleared directory progress record: {name}',
    browserNoDirectoryPicker: 'This browser does not support the directory picker. Please use a Chromium-based browser.',
    directoryLoaded: 'Loaded directory {name} with {count} images.',
    chooseDirectoryFailed: 'Failed to choose directory: {error}',
    fileReadFailed: 'Failed to read file',
    canvasExportFailed: 'Canvas export failed',
    imageDecodeFailed: 'Image decode failed',
    modelListEmpty: 'The model list is empty. Please enter the model ID manually.',
    emptyResponse: 'The response content is empty',
    retryRequest: '  Request failed for {name} on attempt {attempt}, retrying in {seconds} seconds.',
    unknownRequestError: 'Unknown request error',
    taskCompletedWithFailure: 'Task finished, but {count} image(s) failed.',
    chooseDirectoryFirst: 'Please choose an image directory first.',
    directoryPermissionDenied: 'Directory read/write permission was denied.',
    progressDetected: 'Detected historical progress records: {count}.',
    skippedByProgress: 'Skipped (progress record): {name}',
    skippedByExisting: 'Skipped (existing txt): {name}',
    processingStarted: 'Processing started: {name}',
    processingFinished: 'Processing finished: {name}',
    processingFailed: 'Processing failed: {name} -> {error}',
    taskStopped: 'The task was stopped manually.',
    taskCompleted: 'All tasks have been completed.',
    taskException: 'Task exception: {error}',
    stopRequested: 'Stop requested. The task will end after the current image finishes processing.',
    taskStarted: 'Starting a new generation task.',
    dropRejectedWhileRunning: 'A task is running. Wait for it to finish or stop it before dragging in a new image.',
    noResultToCopy: 'There is no result to copy right now.',
    resultCopied: 'The selected result has been copied to the clipboard.',
    copyFailed: 'Copy failed. The browser may have blocked clipboard access.',
    logCleared: 'Log cleared.',
    directoryRescanned: 'Directory rescanned. Current image count: {count}',
    appReady: 'Application ready. Waiting for a directory selection.',
    githubLinkTitle: 'GitHub project page',
  },
};

const els = {
  connectionBadge: document.getElementById('connectionBadge'),
  serverUrlInput: document.getElementById('serverUrlInput'),
  modelInput: document.getElementById('modelInput'),
  modelDropdownBtn: document.getElementById('modelDropdownBtn'),
  modelDropdown: document.getElementById('modelDropdown'),
  timeoutInput: document.getElementById('timeoutInput'),
  apiKeyInput: document.getElementById('apiKeyInput'),
  toggleApiKeyBtn: document.getElementById('toggleApiKeyBtn'),
  testConnectionBtn: document.getElementById('testConnectionBtn'),
  saveConfigBtn: document.getElementById('saveConfigBtn'),
  configPresetSelect: document.getElementById('configPresetSelect'),
  presetNameInput: document.getElementById('presetNameInput'),
  loadPresetBtn: document.getElementById('loadPresetBtn'),
  copyPresetBtn: document.getElementById('copyPresetBtn'),
  deletePresetBtn: document.getElementById('deletePresetBtn'),
  folderPathInput: document.getElementById('folderPathInput'),
  chooseFolderBtn: document.getElementById('chooseFolderBtn'),
  recursiveCheck: document.getElementById('recursiveCheck'),
  skipExistingCheck: document.getElementById('skipExistingCheck'),
  stripThinkingCheck: document.getElementById('stripThinkingCheck'),
  selectedCountText: document.getElementById('selectedCountText'),
  processedCountText: document.getElementById('processedCountText'),
  skippedCountText: document.getElementById('skippedCountText'),
  failedCountText: document.getElementById('failedCountText'),
  fillDefaultPromptBtn: document.getElementById('fillDefaultPromptBtn'),
  clearPromptsBtn: document.getElementById('clearPromptsBtn'),
  systemPromptInput: document.getElementById('systemPromptInput'),
  userPromptInput: document.getElementById('userPromptInput'),
  startBtn: document.getElementById('startBtn'),
  generateCurrentBtn: document.getElementById('generateCurrentBtn'),
  prependBtn: document.getElementById('prependBtn'),
  appendBtn: document.getElementById('appendBtn'),
  stopBtn: document.getElementById('stopBtn'),
  clearProgressBtn: document.getElementById('clearProgressBtn'),
  prevPreviewBtn: document.getElementById('prevPreviewBtn'),
  nextPreviewBtn: document.getElementById('nextPreviewBtn'),
  previewStage: document.getElementById('previewStage'),
  previewImage: document.getElementById('previewImage'),
  previewPlaceholder: document.getElementById('previewPlaceholder'),
  thumbStrip: document.getElementById('thumbStrip'),
  currentFileText: document.getElementById('currentFileText'),
  progressText: document.getElementById('progressText'),
  copyCaptionBtn: document.getElementById('copyCaptionBtn'),
  clearResultsBtn: document.getElementById('clearResultsBtn'),
  clearLogBtn: document.getElementById('clearLogBtn'),
  resultList: document.getElementById('resultList'),
  runtimeStatusText: document.getElementById('runtimeStatusText'),
  logOutput: document.getElementById('logOutput'),
  githubLink: document.getElementById('githubLink'),
};

const state = {
  files: [],
  currentIndex: -1,
  currentObjectUrl: '',
  directoryHandle: null,
  directoryLabel: '',
  singleFileMode: false,
  singleFileSource: null,
  currentModel: '',
  availableModels: [],
  language: localStorage.getItem(LANGUAGE_KEY) === 'en' ? 'en' : 'zh',
  connectionBadgeType: 'idle',
  runtimeStatusKey: 'runtimeIdle',
  lastLogLines: [],
  results: [],
  selectedResultId: null,
  resultSeq: 0,
  thumbToken: 0,
  presets: [],
  activePresetName: '',
  stats: {
    processed: 0,
    skipped: 0,
    failed: 0,
  },
  isRunning: false,
  stopRequested: false,
};

function t(key, params = {}) {
  const dict = I18N[state.language] || I18N.zh;
  const template = dict[key] || key;
  return template.replace(/\{(\w+)\}/g, (_, name) => String(params[name] ?? ''));
}

function formatLogEntry(entry) {
  return `[${entry.time}] ${entry.message}`;
}

function renderLogs() {
  els.logOutput.textContent = state.lastLogLines.map(formatLogEntry).join('\n');
}

function buildResultItem(entry) {
  const item = document.createElement('div');
  item.className = 'result-item';
  item.dataset.resultId = String(entry.id);

  const thumb = document.createElement('img');
  if (entry.thumbUrl) {
    thumb.src = entry.thumbUrl;
  } else {
    thumb.className = 'result-thumb-missing';
  }
  thumb.alt = entry.name;

  const textColumn = document.createElement('div');
  textColumn.className = 'result-text';

  const fileName = document.createElement('div');
  fileName.className = 'result-file-name';
  fileName.textContent = entry.name;

  const caption = document.createElement('div');
  caption.className = 'result-caption';
  caption.textContent = entry.caption;

  textColumn.appendChild(fileName);
  textColumn.appendChild(caption);
  item.appendChild(thumb);
  item.appendChild(textColumn);

  item.addEventListener('click', () => {
    state.selectedResultId = state.selectedResultId === entry.id ? null : entry.id;
    updateResultSelection();
  });
  return item;
}

function updateResultSelection() {
  for (const node of els.resultList.querySelectorAll('.result-item')) {
    node.classList.toggle('selected', Number(node.dataset.resultId) === state.selectedResultId);
  }
}

function appendResultItem(entry) {
  const list = els.resultList;
  const placeholder = list.querySelector('.result-empty');
  if (placeholder) placeholder.remove();
  const nearTop = list.scrollTop < 80;
  const item = buildResultItem(entry);
  list.prepend(item); // 最新的在最上方
  if (nearTop) {
    list.scrollTop = 0;
  } else {
    // 用户正在下方查看旧结果时，补偿新条目占用的空间，保持视口不动（列表 gap 为 10px）
    list.scrollTop += item.offsetHeight + 10;
  }
  state.selectedResultId = entry.id;
  updateResultSelection();
}

function renderResults() {
  els.resultList.innerHTML = '';
  if (!state.results.length) {
    const hint = document.createElement('p');
    hint.className = 'result-empty';
    hint.textContent = t('resultsEmptyHint');
    els.resultList.appendChild(hint);
    return;
  }
  for (let i = state.results.length - 1; i >= 0; i -= 1) {
    els.resultList.appendChild(buildResultItem(state.results[i]));
  }
  els.resultList.scrollTop = 0;
}

function addResultEntry(name, caption, thumbUrl) {
  state.resultSeq += 1;
  const entry = { id: state.resultSeq, name, caption, thumbUrl };
  state.results.push(entry);
  appendResultItem(entry);
}

function applyI18n() {
  document.documentElement.lang = state.language === 'zh' ? 'zh-CN' : 'en';
  document.title = t('pageTitle');

  for (const node of document.querySelectorAll('[data-i18n]')) {
    node.textContent = t(node.dataset.i18n);
  }

  els.modelInput.placeholder = t('modelPlaceholder');
  els.apiKeyInput.placeholder = t('apiKeyPlaceholder');
  els.folderPathInput.placeholder = t('folderPlaceholder');
  els.systemPromptInput.placeholder = t('systemPromptPlaceholder');
  els.userPromptInput.placeholder = t('userPromptPlaceholder');
  els.previewImage.alt = t('previewImageAlt');
  updatePresetSelectOptions();

  els.toggleApiKeyBtn.textContent = els.apiKeyInput.type === 'password' ? t('show') : t('hide');

  if (els.githubLink) {
    els.githubLink.setAttribute('aria-label', t('githubLinkTitle'));
    els.githubLink.setAttribute('title', t('githubLinkTitle'));
  }

  setConnectionBadgeByKey(state.connectionBadgeType);
  setRuntimeStatus(state.runtimeStatusKey);

  if (state.currentIndex < 0 || state.currentIndex >= state.files.length) {
    els.currentFileText.textContent = t('currentFileNone');
  }

  renderLogs();
  renderResults();
}

function getConfig() {
  return {
    serverUrl: (els.serverUrlInput.value || '').trim(),
    model: (els.modelInput.value || '').trim(),
    timeoutSeconds: clampNumber(Number.parseInt(els.timeoutInput.value, 10), 5, 600, DEFAULT_TIMEOUT_SECONDS),
    apiKey: els.apiKeyInput.value || '',
    recursive: els.recursiveCheck.checked,
    skipExisting: els.skipExistingCheck.checked,
    stripThinking: els.stripThinkingCheck.checked,
    systemPrompt: els.systemPromptInput.value.trim(),
    userPrompt: els.userPromptInput.value.trim(),
  };
}

function loadConfig() {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) {
      applyConfig({});
      return;
    }
    applyConfig(JSON.parse(raw));
  } catch {
    applyConfig({});
  }
}

function loadPresets() {
  try {
    const raw = localStorage.getItem(PRESETS_KEY);
    if (!raw) {
      state.presets = [];
      return;
    }
    const parsed = JSON.parse(raw);
    state.presets = Array.isArray(parsed)
      ? parsed.filter((item) => item && typeof item.name === 'string' && item.name.trim())
      : [];
  } catch {
    state.presets = [];
  }
}

function persistPresets() {
  localStorage.setItem(PRESETS_KEY, JSON.stringify(state.presets));
}

function updatePresetSelectOptions() {
  if (!els.configPresetSelect) return;
  const previousValue = state.activePresetName || els.configPresetSelect.value;
  els.configPresetSelect.innerHTML = '';

  const placeholderOption = document.createElement('option');
  placeholderOption.value = '';
  placeholderOption.textContent = t('presetSelectPlaceholder');
  els.configPresetSelect.appendChild(placeholderOption);

  for (const preset of state.presets) {
    const option = document.createElement('option');
    option.value = preset.name;
    option.textContent = preset.name;
    els.configPresetSelect.appendChild(option);
  }

  const nextValue = state.presets.some((preset) => preset.name === previousValue) ? previousValue : '';
  state.activePresetName = nextValue;
  els.configPresetSelect.value = nextValue;

  if (els.presetNameInput) {
    els.presetNameInput.value = nextValue;
  }
}

function applyConfig(config) {
  els.serverUrlInput.value = config.serverUrl || LM_STUDIO_DEFAULT_URL;
  els.modelInput.value = config.model || '';
  els.timeoutInput.value = String(clampNumber(config.timeoutSeconds, 5, 600, DEFAULT_TIMEOUT_SECONDS));
  els.apiKeyInput.value = config.apiKey || '';
  els.recursiveCheck.checked = config.recursive ?? true;
  els.skipExistingCheck.checked = config.skipExisting ?? true;
  els.stripThinkingCheck.checked = config.stripThinking ?? true;
  els.systemPromptInput.value = config.systemPrompt || DEFAULT_SYSTEM_PROMPT;
  els.userPromptInput.value = config.userPrompt || DEFAULT_USER_PROMPT;
}

function persistCurrentConfig(config = getConfig(), shouldLog = true) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  if (shouldLog) {
    log('configSaved');
  }
}

function saveConfig() {
  const config = getConfig();
  persistCurrentConfig(config, true);
}

function saveConfigAsPreset() {
  const config = getConfig();
  const presetName = (els.presetNameInput.value || '').trim();
  if (!presetName) {
    log('presetSaveEmpty');
    return;
  }

  const existed = state.presets.some((preset) => preset.name === presetName);
  state.presets = state.presets.filter((preset) => preset.name !== presetName);
  state.presets.push({ name: presetName, config });
  state.presets.sort((a, b) => a.name.localeCompare(b.name, state.language === 'zh' ? 'zh-CN' : 'en'));
  state.activePresetName = presetName;
  persistPresets();
  updatePresetSelectOptions();
  persistCurrentConfig(config, false);
  log(existed ? 'presetNameExists' : 'presetSaved', { name: presetName });
}

function loadSelectedPreset(options = {}) {
  const { shouldLog = true } = options;
  const presetName = els.configPresetSelect.value;
  if (!presetName) {
    if (shouldLog) log('presetLoadMissing');
    return;
  }

  const preset = state.presets.find((item) => item.name === presetName);
  if (!preset) {
    if (shouldLog) log('presetLoadMissing');
    return;
  }

  state.activePresetName = preset.name;
  els.presetNameInput.value = preset.name;
  applyConfig(preset.config || {});
  persistCurrentConfig(getConfig(), false);
  if (shouldLog) {
    log('presetLoaded', { name: preset.name });
  }
}

function deleteSelectedPreset() {
  const presetName = els.configPresetSelect.value;
  if (!presetName) {
    log('presetDeleteMissing');
    return;
  }

  state.presets = state.presets.filter((preset) => preset.name !== presetName);
  state.activePresetName = '';
  els.presetNameInput.value = '';
  persistPresets();
  updatePresetSelectOptions();
  log('presetDeleted', { name: presetName });
}

function copySelectedPreset() {
  const sourceName = els.configPresetSelect.value;
  if (!sourceName) {
    log('presetLoadMissing');
    return;
  }

  const source = state.presets.find((item) => item.name === sourceName);
  if (!source) {
    log('presetLoadMissing');
    return;
  }

  const copiedName = sourceName + '_copy';
  state.presets = state.presets.filter((preset) => preset.name !== copiedName);
  state.presets.push({ name: copiedName, config: { ...source.config } });
  state.presets.sort((a, b) => a.name.localeCompare(b.name, state.language === 'zh' ? 'zh-CN' : 'en'));
  state.activePresetName = copiedName;
  els.presetNameInput.value = copiedName;
  persistPresets();
  updatePresetSelectOptions();
  applyConfig(source.config);
  persistCurrentConfig(getConfig(), false);
  log('presetCopied', { name: copiedName });
}


function setConnectionBadgeByKey(type = 'idle') {
  state.connectionBadgeType = type;
  const keyMap = {
    idle: 'connectionIdle',
    running: 'connectionChecking',
    success: 'connectionSuccess',
    error: 'connectionFailed',
    taskRunning: 'connectionTaskRunning',
    taskFinished: 'connectionTaskFinished',
    taskError: 'connectionTaskError',
  };
  els.connectionBadge.textContent = t(keyMap[type] || 'connectionIdle');
  els.connectionBadge.className = `status-badge ${type === 'taskRunning' ? 'running' : type === 'taskFinished' ? 'success' : type === 'taskError' ? 'error' : type}`;
}

function setRuntimeStatus(key) {
  state.runtimeStatusKey = key;
  els.runtimeStatusText.textContent = t(key);
}

function log(keyOrMessage, params = {}, raw = false) {
  const stamp = new Date().toLocaleTimeString(state.language === 'zh' ? 'zh-CN' : 'en-US', { hour12: false });
  const message = raw ? String(keyOrMessage) : t(keyOrMessage, params);
  state.lastLogLines.unshift({ time: stamp, message });
  renderLogs();
}

function resetCounters() {
  state.stats.processed = 0;
  state.stats.skipped = 0;
  state.stats.failed = 0;
  syncStats();
}

function syncStats() {
  els.selectedCountText.textContent = String(state.files.length);
  els.processedCountText.textContent = String(state.stats.processed);
  els.skippedCountText.textContent = String(state.stats.skipped);
  els.failedCountText.textContent = String(state.stats.failed);
  els.progressText.textContent = state.files.length ? `${Math.max(0, state.currentIndex + 1)} / ${state.files.length}` : '0 / 0';
}

function clampNumber(value, min, max, fallback) {
  if (!Number.isFinite(value)) return fallback;
  return Math.max(min, Math.min(max, value));
}

function sanitizeBaseUrl(value) {
  return (value || '').trim().replace(/\/$/, '');
}

function getHeaders(config) {
  const headers = { 'Content-Type': 'application/json' };
  if (config.apiKey) {
    headers.Authorization = `Bearer ${config.apiKey}`;
  }
  return headers;
}

async function testConnection() {
  const config = getConfig();
  const baseUrl = sanitizeBaseUrl(config.serverUrl) || LM_STUDIO_DEFAULT_URL;
  const manualModel = config.model;
  setConnectionBadgeByKey('running');
  try {
    const data = await safeFetchJson(`${baseUrl}/models`, {
      method: 'GET',
      mode: 'cors',
      headers: config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {},
    });
    const models = (data?.data || []).map((item) => item.id).filter(Boolean);
    populateModelList(models, manualModel);
    const modelId = manualModel || models[0] || 'local-model';
    state.currentModel = modelId;
    setConnectionBadgeByKey('success');
    log('connectionSuccessLog', { model: modelId });
  } catch (error) {
    setConnectionBadgeByKey('error');
    log('connectionFailedLog', { error: error.message || error });
    log('corsHint');
  }
}

function populateModelList(models, preferredModel) {
  state.availableModels = models.slice();
  if (preferredModel) {
    els.modelInput.value = preferredModel;
  } else if (models.length === 1) {
    els.modelInput.value = models[0];
  }
  renderModelDropdown('');
}

function renderModelDropdown(filter) {
  const filterLower = filter.toLowerCase();
  const filtered = filter
    ? state.availableModels.filter((m) => m.toLowerCase().includes(filterLower))
    : state.availableModels;

  els.modelDropdown.innerHTML = '';
  if (state.availableModels.length === 0) return;

  if (filtered.length === 0 && filter) {
    const noMatch = document.createElement('div');
    noMatch.className = 'combobox-option no-match';
    noMatch.textContent = state.language === 'zh' ? '无匹配模型，可直接输入' : 'No match, type to enter custom';
    els.modelDropdown.appendChild(noMatch);
  } else {
    for (const modelId of filtered) {
      const item = document.createElement('div');
      item.className = 'combobox-option';
      item.textContent = modelId;
      item.addEventListener('mousedown', (e) => {
        e.preventDefault();
        selectModel(modelId);
      });
      els.modelDropdown.appendChild(item);
    }
  }
}

function selectModel(modelId) {
  els.modelInput.value = modelId;
  state.currentModel = modelId;
  els.modelDropdown.hidden = true;
}

function toggleModelDropdown() {
  if (els.modelDropdown.hidden) {
    renderModelDropdown(els.modelInput.value.trim());
    els.modelDropdown.hidden = false;
  } else {
    els.modelDropdown.hidden = true;
  }
}

function getProgressKey() {
  if (!state.directoryLabel) return '';
  return `${PROGRESS_PREFIX}${state.directoryLabel}`;
}

function loadProgressRecord() {
  const key = getProgressKey();
  if (!key) return new Set();
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed.processed) ? parsed.processed : []);
  } catch {
    return new Set();
  }
}

function saveProgressRecord(processedSet) {
  const key = getProgressKey();
  if (!key) return;
  localStorage.setItem(key, JSON.stringify({ processed: [...processedSet].sort() }));
}

function clearProgressRecord() {
  const key = getProgressKey();
  if (!key) {
    log('noProgressToClear');
    return;
  }
  localStorage.removeItem(key);
  log('progressCleared', { name: state.directoryLabel });
}

function getExtension(name) {
  const index = name.lastIndexOf('.');
  return index >= 0 ? name.slice(index).toLowerCase() : '';
}

function createVirtualFileItem(file) {
  return {
    handle: {
      async getFile() {
        return file;
      },
    },
    relativePath: file.name,
    name: file.name,
    sourceFile: file,
  };
}

async function collectImageFiles(directoryHandle, recursive) {
  const files = [];
  async function walk(handle, path = '') {
    for await (const entry of handle.values()) {
      if (entry.kind === 'file') {
        const ext = getExtension(entry.name);
        if (SUPPORTED_EXTENSIONS.has(ext)) {
          files.push({
            handle: entry,
            relativePath: path ? `${path}/${entry.name}` : entry.name,
            name: entry.name,
          });
        }
      } else if (entry.kind === 'directory' && recursive) {
        await walk(entry, path ? `${path}/${entry.name}` : entry.name);
      }
    }
  }
  await walk(directoryHandle, '');
  files.sort((a, b) => a.relativePath.localeCompare(b.relativePath, state.language === 'zh' ? 'zh-CN' : 'en'));
  return files;
}

async function loadSingleFile(file) {
  const ext = getExtension(file?.name || '');
  if (!file || !SUPPORTED_EXTENSIONS.has(ext)) {
    return;
  }

  if (state.isRunning) {
    log('dropRejectedWhileRunning');
    return;
  }

  state.singleFileMode = true;
  state.singleFileSource = file;
  state.directoryHandle = null;
  state.directoryLabel = '';
  els.folderPathInput.value = '';
  state.files = [createVirtualFileItem(file)];
  state.currentIndex = 0;
  state.isRunning = false;
  state.stopRequested = false;
  resetCounters();
  setTaskButtonsDisabled(false);
  setRuntimeStatus('runtimeIdle');
  setConnectionBadgeByKey('idle');
  renderThumbStrip();
  await renderPreview();
}

async function handlePreviewDrop(event) {
  event.preventDefault();
  els.previewStage.classList.remove('drag-active');
  const [file] = Array.from(event.dataTransfer?.files || []);
  await loadSingleFile(file);
}

async function chooseFolder() {
  if (typeof window.showDirectoryPicker !== 'function') {
    log('browserNoDirectoryPicker');
    return;
  }
  try {
    const directoryHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
    state.singleFileMode = false;
    state.directoryHandle = directoryHandle;
    state.directoryLabel = directoryHandle.name || 'selected-folder';
    els.folderPathInput.value = state.directoryLabel;
    state.files = await collectImageFiles(directoryHandle, els.recursiveCheck.checked);
    state.currentIndex = state.files.length ? 0 : -1;
    resetCounters();
    syncStats();
    renderThumbStrip();
    renderPreview();
    log('directoryLoaded', { name: state.directoryLabel, count: state.files.length });
  } catch (error) {
    if (error?.name !== 'AbortError') {
      log('chooseDirectoryFailed', { error: error.message || error });
    }
  }
}

async function ensureDirectoryPermission(handle, mode = 'readwrite') {
  if (!handle) return false;
  const options = { mode };
  if ((await handle.queryPermission(options)) === 'granted') return true;
  if ((await handle.requestPermission(options)) === 'granted') return true;
  return false;
}

function buildThumbImage(thumbUrl, name) {
  const img = document.createElement('img');
  img.src = thumbUrl;
  img.alt = name;
  return img;
}

function renderThumbStrip() {
  state.thumbToken += 1;
  els.thumbStrip.innerHTML = '';
  els.thumbStrip.hidden = !state.files.length;
  state.files.forEach((item, index) => {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'thumb-cell';
    cell.dataset.index = String(index);
    cell.title = item.relativePath;
    if (item.thumbUrl) {
      cell.appendChild(buildThumbImage(item.thumbUrl, item.name));
    } else {
      const pending = document.createElement('span');
      pending.className = 'thumb-pending';
      pending.textContent = '…';
      cell.appendChild(pending);
    }
    cell.addEventListener('click', () => {
      state.currentIndex = index;
      renderPreview();
    });
    els.thumbStrip.appendChild(cell);
  });
  updateThumbStripCurrent();
  generateThumbnailsInBackground();
}

function updateThumbStripCurrent() {
  for (const cell of els.thumbStrip.querySelectorAll('.thumb-cell')) {
    const index = Number(cell.dataset.index);
    cell.classList.toggle('current', index === state.currentIndex);
    if (index === state.currentIndex) {
      cell.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }
}

async function generateThumbnailsInBackground() {
  const token = state.thumbToken;
  for (let index = 0; index < state.files.length; index += 1) {
    if (token !== state.thumbToken) return; // 文件列表已更换，中止旧任务
    const item = state.files[index];
    if (item.thumbUrl !== undefined) continue;
    try {
      const file = await item.handle.getFile();
      item.thumbUrl = await makeThumbnail(file);
    } catch {
      item.thumbUrl = '';
    }
    if (token !== state.thumbToken) return;
    const cell = els.thumbStrip.querySelector(`.thumb-cell[data-index="${index}"]`);
    if (cell) {
      const pending = cell.querySelector('.thumb-pending');
      if (pending) pending.remove();
      if (item.thumbUrl) {
        cell.appendChild(buildThumbImage(item.thumbUrl, item.name));
      }
    }
    await sleep(0); // 让出主线程，避免大目录时卡顿
  }
}

async function renderPreview() {
  if (state.currentObjectUrl) {
    URL.revokeObjectURL(state.currentObjectUrl);
    state.currentObjectUrl = '';
  }
  if (state.currentIndex < 0 || state.currentIndex >= state.files.length) {
    els.previewImage.removeAttribute('src');
    els.previewImage.hidden = true;
    els.previewPlaceholder.hidden = false;
    els.thumbStrip.hidden = true;
    els.currentFileText.textContent = t('currentFileNone');
    els.progressText.textContent = '0 / 0';
    syncStats();
    return;
  }
  const item = state.files[state.currentIndex];
  const file = await item.handle.getFile();
  state.currentObjectUrl = URL.createObjectURL(file);
  els.previewImage.src = state.currentObjectUrl;
  els.previewImage.hidden = false;
  els.previewPlaceholder.hidden = true;
  els.thumbStrip.hidden = false;
  els.currentFileText.textContent = item.relativePath;
  syncStats();
  updateThumbStripCurrent();
}

function stripThinking(text) {
  return text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
}

async function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error || new Error(t('fileReadFailed')));
    reader.readAsDataURL(file);
  });
}


async function compressImage(file) {
  const imageUrl = await fileToDataUrl(file);
  const image = await loadImage(imageUrl);
  let canvas = document.createElement('canvas');
  let width = image.width;
  let height = image.height;

  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION || width * height > MAX_PIXELS) {
    const ratio = Math.min(MAX_IMAGE_DIMENSION / width, MAX_IMAGE_DIMENSION / height, Math.sqrt(MAX_PIXELS / (width * height)));
    width = Math.max(1, Math.floor(width * ratio));
    height = Math.max(1, Math.floor(height * ratio));
  }

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, width, height);

  let blob = await canvasToBlob(canvas, 'image/jpeg', JPEG_QUALITY_STEPS[0] / 100);
  let qualityIndex = 0;

  while (blob.size > MAX_IMAGE_SIZE_BYTES && qualityIndex < JPEG_QUALITY_STEPS.length - 1) {
    qualityIndex += 1;
    blob = await canvasToBlob(canvas, 'image/jpeg', JPEG_QUALITY_STEPS[qualityIndex] / 100);
  }

  while (blob.size > MAX_IMAGE_SIZE_BYTES) {
    const nextWidth = Math.floor(canvas.width * RESIZE_FACTOR);
    const nextHeight = Math.floor(canvas.height * RESIZE_FACTOR);
    if (nextWidth < MIN_IMAGE_DIMENSION || nextHeight < MIN_IMAGE_DIMENSION) break;
    const nextCanvas = document.createElement('canvas');
    nextCanvas.width = nextWidth;
    nextCanvas.height = nextHeight;
    nextCanvas.getContext('2d').drawImage(canvas, 0, 0, nextWidth, nextHeight);
    canvas = nextCanvas;
    blob = await canvasToBlob(canvas, 'image/jpeg', JPEG_QUALITY_STEPS[qualityIndex] / 100);
  }

  return fileToDataUrl(new File([blob], `${file.name}.jpg`, { type: 'image/jpeg' }));
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error(t('canvasExportFailed')));
    }, type, quality);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(t('imageDecodeFailed')));
    img.src = src;
  });
}

async function imageFileToPayloadUrl(file) {
  return compressImage(file);
}

async function makeThumbnail(file, maxDimension = 160) {
  const imageUrl = await fileToDataUrl(file);
  const image = await loadImage(imageUrl);
  const ratio = Math.min(1, maxDimension / image.width, maxDimension / image.height);
  const width = Math.max(1, Math.round(image.width * ratio));
  const height = Math.max(1, Math.round(image.height * ratio));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d').drawImage(image, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', 0.8);
}

function buildAbortSignal(timeoutSeconds) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(new Error('timeout')), timeoutSeconds * 1000);
  return {
    signal: controller.signal,
    cleanup() {
      window.clearTimeout(timeoutId);
    },
  };
}

async function safeFetchJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }
  return response.json();
}

async function detectModelIfNeeded(config) {
  if (config.model) return config.model;
  const baseUrl = sanitizeBaseUrl(config.serverUrl) || LM_STUDIO_DEFAULT_URL;
  const data = await safeFetchJson(`${baseUrl}/models`, {
    method: 'GET',
    mode: 'cors',
    headers: config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {},
  });
  const models = (data?.data || []).map((item) => item.id).filter(Boolean);
  const modelId = models[0];
  if (!modelId) throw new Error(t('modelListEmpty'));
  populateModelList(models, modelId);
  state.currentModel = modelId;
  return modelId;
}

async function requestCaption(config, item, file) {
  const baseUrl = sanitizeBaseUrl(config.serverUrl) || LM_STUDIO_DEFAULT_URL;
  const model = await detectModelIfNeeded(config);
  const imageDataUrl = await imageFileToPayloadUrl(file);
  const messages = [];

  if (config.systemPrompt) {
    messages.push({ role: 'system', content: config.systemPrompt });
  }

  messages.push({
    role: 'user',
    content: [
      {
        type: 'image_url',
        image_url: {
          url: imageDataUrl,
        },
      },
      { type: 'text', text: config.userPrompt || DEFAULT_USER_PROMPT },
    ],
  });

  const payload = {
    model,
    messages,
  };

  let lastError = null;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    const abortable = buildAbortSignal(config.timeoutSeconds);
    try {
      const result = await safeFetchJson(`${baseUrl}/chat/completions`, {
        method: 'POST',
        mode: 'cors',
        headers: getHeaders(config),
        body: JSON.stringify(payload),
        signal: abortable.signal,
      });
      abortable.cleanup();
      const rawText = result?.choices?.[0]?.message?.content ?? '';
      const caption = config.stripThinking ? stripThinking(String(rawText)) : String(rawText).trim();
      if (!caption) throw new Error(t('emptyResponse'));
      return caption.replace(/\r?\n+/g, ' ').trim();
    } catch (error) {
      abortable.cleanup();
      lastError = error;
      const message = String(error?.message || error);
      const retryable = /failed to process image|memory slot|channel error|timeout|abort/i.test(message);
      if (attempt < MAX_RETRIES && retryable) {
        log('retryRequest', { name: item.relativePath, attempt, seconds: Math.round(RETRY_DELAY_MS / 1000) });
        await sleep(RETRY_DELAY_MS);
        continue;
      }
      break;
    }
  }
  throw lastError || new Error(t('unknownRequestError'));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function writeCaptionFile(item, caption) {
  const relativePath = item.relativePath.replace(/\.[^.]+$/, '.txt');
  const parts = relativePath.split('/');
  const fileName = parts.pop();
  let dir = state.directoryHandle;

  for (const part of parts) {
    dir = await dir.getDirectoryHandle(part, { create: true });
  }

  const fileHandle = await dir.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(caption);
  await writable.close();
}

async function hasExistingCaption(item) {
  try {
    const relativePath = item.relativePath.replace(/\.[^.]+$/, '.txt');
    const parts = relativePath.split('/');
    const fileName = parts.pop();
    let dir = state.directoryHandle;
    for (const part of parts) {
      dir = await dir.getDirectoryHandle(part);
    }
    await dir.getFileHandle(fileName);
    return true;
  } catch {
    return false;
  }
}

async function readExistingCaption(item) {
  if (state.singleFileMode || !state.directoryHandle) return '';
  try {
    const relativePath = item.relativePath.replace(/\.[^.]+$/, '.txt');
    const parts = relativePath.split('/');
    const fileName = parts.pop();
    let dir = state.directoryHandle;
    for (const part of parts) {
      dir = await dir.getDirectoryHandle(part);
    }
    const fileHandle = await dir.getFileHandle(fileName);
    const file = await fileHandle.getFile();
    return (await file.text()).trim();
  } catch {
    return '';
  }
}

function setTaskButtonsDisabled(disabled) {
  els.startBtn.disabled = disabled;
  els.generateCurrentBtn.disabled = disabled;
  els.prependBtn.disabled = disabled;
  els.appendBtn.disabled = disabled;
  els.stopBtn.disabled = !disabled;
}

async function processItem(item, config, combineMode, progressSet) {
  const progressName = item.relativePath;
  const file = await item.handle.getFile();
  log('processingStarted', { name: progressName });
  const newCaption = await requestCaption(config, item, file);
  let finalCaption = newCaption;
  if (combineMode !== 'none' && !state.singleFileMode) {
    const existing = await readExistingCaption(item);
    if (existing) {
      finalCaption = combineMode === 'prepend'
        ? `${newCaption}, ${existing}`
        : `${existing}, ${newCaption}`;
    }
  }
  if (!state.singleFileMode) {
    await writeCaptionFile(item, finalCaption);
  }
  let thumbUrl = '';
  try {
    thumbUrl = await makeThumbnail(file);
  } catch {
    thumbUrl = '';
  }
  addResultEntry(progressName, finalCaption, thumbUrl);
  if (!state.singleFileMode && progressSet) {
    progressSet.add(progressName);
    saveProgressRecord(progressSet);
  }
  state.stats.processed += 1;
  syncStats();
  log('processingFinished', { name: progressName });
}

async function processAll(combineMode = 'none') {
  if (state.isRunning) return;

  const shouldRestoreSingleFile = state.singleFileMode
    && !state.files.length
    && state.singleFileSource
    && SUPPORTED_EXTENSIONS.has(getExtension(state.singleFileSource.name || ''));

  if (shouldRestoreSingleFile) {
    state.files = [createVirtualFileItem(state.singleFileSource)];
    state.currentIndex = 0;
    await renderPreview();
  }

  if (!state.files.length) {
    log('chooseDirectoryFirst');
    return;
  }

  if (!state.singleFileMode && !state.directoryHandle) {
    log('chooseDirectoryFirst');
    return;
  }

  if (!state.singleFileMode) {
    const hasPermission = await ensureDirectoryPermission(state.directoryHandle, 'readwrite');
    if (!hasPermission) {
      log('directoryPermissionDenied');
      return;
    }
  }

  const config = getConfig();
  config.serverUrl = sanitizeBaseUrl(config.serverUrl) || LM_STUDIO_DEFAULT_URL;
  if (!config.userPrompt) config.userPrompt = DEFAULT_USER_PROMPT;

  persistCurrentConfig(config, false);
  state.isRunning = true;
  state.stopRequested = false;
  resetCounters();
  state.lastLogLines = [];
  log('taskStarted');
  if (!state.singleFileMode) {
    state.results = [];
    state.selectedResultId = null;
    renderResults();
  }
  setRuntimeStatus('runtimeRunning');
  setConnectionBadgeByKey('taskRunning');
  setTaskButtonsDisabled(true);

  const progressSet = state.singleFileMode ? new Set() : loadProgressRecord();
  if (progressSet.size) {
    log('progressDetected', { count: progressSet.size });
  }

  try {
    await detectModelIfNeeded(config);
    for (let index = 0; index < state.files.length; index += 1) {
      if (state.stopRequested) break;

      state.currentIndex = index;
      await renderPreview();
      const item = state.files[index];
      const progressName = item.relativePath;

      if (progressSet.has(progressName)) {
        state.stats.skipped += 1;
        syncStats();
        log('skippedByProgress', { name: progressName });
        continue;
      }

      if (combineMode === 'none' && !state.singleFileMode && config.skipExisting && await hasExistingCaption(item)) {
        progressSet.add(progressName);
        saveProgressRecord(progressSet);
        state.stats.skipped += 1;
        syncStats();
        log('skippedByExisting', { name: progressName });
        continue;
      }

      try {
        await processItem(item, config, combineMode, progressSet);
      } catch (error) {
        state.stats.failed += 1;
        syncStats();
        log('processingFailed', { name: progressName, error: error.message || error });
      }
    }

    if (state.stopRequested) {
      log('taskStopped');
    } else if (state.stats.failed > 0) {
      log('taskCompletedWithFailure', { count: state.stats.failed });
    } else {
      log('taskCompleted');
    }
    setConnectionBadgeByKey('taskFinished');
  } catch (error) {
    setConnectionBadgeByKey('taskError');
    log('taskException', { error: error.message || error });
  } finally {
    state.isRunning = false;
    state.stopRequested = false;
    setTaskButtonsDisabled(false);
    setRuntimeStatus('runtimeIdle');
  }
}

async function processCurrent() {
  if (state.isRunning) return;

  const hasCurrent = state.currentIndex >= 0 && state.currentIndex < state.files.length;
  if (!hasCurrent) {
    log('chooseDirectoryFirst');
    return;
  }

  if (!state.singleFileMode && !state.directoryHandle) {
    log('chooseDirectoryFirst');
    return;
  }

  if (!state.singleFileMode) {
    const hasPermission = await ensureDirectoryPermission(state.directoryHandle, 'readwrite');
    if (!hasPermission) {
      log('directoryPermissionDenied');
      return;
    }
  }

  const config = getConfig();
  config.serverUrl = sanitizeBaseUrl(config.serverUrl) || LM_STUDIO_DEFAULT_URL;
  if (!config.userPrompt) config.userPrompt = DEFAULT_USER_PROMPT;
  persistCurrentConfig(config, false);

  state.isRunning = true;
  state.stopRequested = false;
  state.lastLogLines = [];
  log('taskStarted');
  setRuntimeStatus('runtimeRunning');
  setConnectionBadgeByKey('taskRunning');
  setTaskButtonsDisabled(true);

  const targetItem = state.files[state.currentIndex];
  const itemName = targetItem.relativePath;
  try {
    await detectModelIfNeeded(config);
    const progressSet = state.singleFileMode ? null : loadProgressRecord();
    await processItem(targetItem, config, 'none', progressSet);
    setConnectionBadgeByKey('taskFinished');
  } catch (error) {
    state.stats.failed += 1;
    syncStats();
    log('processingFailed', { name: itemName, error: error.message || error });
    setConnectionBadgeByKey('taskError');
  } finally {
    state.isRunning = false;
    state.stopRequested = false;
    setTaskButtonsDisabled(false);
    setRuntimeStatus('runtimeIdle');
  }
}

function stopProcessing() {
  if (!state.isRunning) return;
  state.stopRequested = true;
  state.isRunning = false;
  setTaskButtonsDisabled(false);
  log('stopRequested');
}

async function copyTextToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    log('copyFailed');
    return false;
  }
}

async function copyCurrentCaption() {
  const selected = state.results.find((entry) => entry.id === state.selectedResultId);
  if (selected) {
    if (await copyTextToClipboard(selected.caption)) {
      log('resultCopied');
    }
    return;
  }
  const text = state.results.map((entry) => entry.caption).join('\n');
  if (!text.trim()) {
    log('noResultToCopy');
    return;
  }
  if (await copyTextToClipboard(text)) {
    log('allResultsCopied', { count: state.results.length });
  }
}

function clearResults() {
  if (!state.results.length) {
    log('noResultToClear');
    return;
  }
  state.results = [];
  state.selectedResultId = null;
  renderResults();
  log('resultsCleared');
}

function clearPrompts() {
  els.systemPromptInput.value = '';
  els.userPromptInput.value = '';
}

function fillDefaultPrompts() {
  els.systemPromptInput.value = DEFAULT_SYSTEM_PROMPT;
  els.userPromptInput.value = DEFAULT_USER_PROMPT;
}

function bindEvents() {
  els.toggleApiKeyBtn.addEventListener('click', () => {
    const isPassword = els.apiKeyInput.type === 'password';
    els.apiKeyInput.type = isPassword ? 'text' : 'password';
    els.toggleApiKeyBtn.textContent = isPassword ? t('hide') : t('show');
  });

  window.addEventListener('message', (event) => {
    if (event.data?.type === LANGUAGE_SYNC_MESSAGE) {
      const nextLanguage = event.data?.language === 'en' ? 'en' : 'zh';
      if (state.language === nextLanguage) return;
      state.language = nextLanguage;
      localStorage.setItem(LANGUAGE_KEY, state.language);
      applyI18n();
    }
    if (event.data?.type === THEME_SYNC_MESSAGE) {
      document.documentElement.setAttribute('data-theme', event.data.theme);
    }
  });

  els.testConnectionBtn.addEventListener('click', testConnection);
  els.modelDropdownBtn.addEventListener('mousedown', (e) => {
    e.preventDefault();
    toggleModelDropdown();
  });
  els.modelInput.addEventListener('focus', () => {
    if (state.availableModels.length > 0 && els.modelDropdown.hidden) {
      renderModelDropdown(els.modelInput.value.trim());
      els.modelDropdown.hidden = false;
    }
  });
  els.modelInput.addEventListener('input', () => {
    renderModelDropdown(els.modelInput.value.trim());
    els.modelDropdown.hidden = false;
  });
  document.addEventListener('click', (e) => {
    if (!els.modelInput.parentElement.contains(e.target)) {
      els.modelDropdown.hidden = true;
    }
  });
  els.saveConfigBtn.addEventListener('click', saveConfigAsPreset);
  els.loadPresetBtn.addEventListener('click', () => loadSelectedPreset());
  els.copyPresetBtn.addEventListener('click', copySelectedPreset);
  els.deletePresetBtn.addEventListener('click', deleteSelectedPreset);
  els.configPresetSelect.addEventListener('change', () => {
    state.activePresetName = els.configPresetSelect.value;
    if (state.activePresetName) {
      loadSelectedPreset({ shouldLog: false });
    }
  });
  els.chooseFolderBtn.addEventListener('click', chooseFolder);
  els.startBtn.addEventListener('click', () => processAll('none'));
  els.generateCurrentBtn.addEventListener('click', processCurrent);
  els.prependBtn.addEventListener('click', () => processAll('prepend'));
  els.appendBtn.addEventListener('click', () => processAll('append'));
  els.stopBtn.addEventListener('click', stopProcessing);
  els.previewStage.addEventListener('dragenter', (event) => {
    event.preventDefault();
    els.previewStage.classList.add('drag-active');
  });
  els.previewStage.addEventListener('dragover', (event) => {
    event.preventDefault();
    els.previewStage.classList.add('drag-active');
  });
  els.previewStage.addEventListener('dragleave', (event) => {
    if (event.currentTarget === event.target || !els.previewStage.contains(event.relatedTarget)) {
      els.previewStage.classList.remove('drag-active');
    }
  });
  els.previewStage.addEventListener('drop', handlePreviewDrop);
  els.clearProgressBtn.addEventListener('click', clearProgressRecord);
  els.clearPromptsBtn.addEventListener('click', clearPrompts);
  els.fillDefaultPromptBtn.addEventListener('click', fillDefaultPrompts);
  els.copyCaptionBtn.addEventListener('click', copyCurrentCaption);
  els.clearResultsBtn.addEventListener('click', clearResults);
  els.clearLogBtn.addEventListener('click', () => {
    state.lastLogLines = [{ time: new Date().toLocaleTimeString(state.language === 'zh' ? 'zh-CN' : 'en-US', { hour12: false }), message: t('logCleared') }];
    renderLogs();
  });

  els.prevPreviewBtn.addEventListener('click', async () => {
    if (state.currentIndex > 0) {
      state.currentIndex -= 1;
      await renderPreview();
    }
  });

  els.nextPreviewBtn.addEventListener('click', async () => {
    if (state.currentIndex < state.files.length - 1) {
      state.currentIndex += 1;
      await renderPreview();
    }
  });

  els.recursiveCheck.addEventListener('change', async () => {
    if (!state.directoryHandle || state.singleFileMode) return;
    state.files = await collectImageFiles(state.directoryHandle, els.recursiveCheck.checked);
    state.currentIndex = state.files.length ? 0 : -1;
    resetCounters();
    renderThumbStrip();
    await renderPreview();
    log('directoryRescanned', { count: state.files.length });
  });
}

function init() {
  loadPresets();
  loadConfig();
  resetCounters();
  renderPreview();
  renderResults();
  bindEvents();
  applyI18n();
  updatePresetSelectOptions();
  setConnectionBadgeByKey('idle');
  setRuntimeStatus('runtimeIdle');
  log('appReady');
}

init();
