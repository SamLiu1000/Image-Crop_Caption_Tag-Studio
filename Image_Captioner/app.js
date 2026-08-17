const CONFIG_KEY = 'image-captioner-config';
const PRESETS_KEY = 'image-captioner-config-presets';
const PROGRESS_PREFIX = 'image-captioner-progress:';
const LANGUAGE_KEY = 'image-captioner-language';
const LANGUAGE_SYNC_MESSAGE = 'web-tools-hub:set-language';
const THEME_SYNC_MESSAGE = 'web-tools-hub:set-theme';
const SUPPORTED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.gif', '.avif']);
const LM_STUDIO_DEFAULT_URL = 'http://localhost:1234/v1';
const DEFAULT_TIMEOUT_SECONDS = 60;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1120;
const MIN_IMAGE_DIMENSION = 256;
const JPEG_QUALITY_STEPS = [85, 75, 65, 55, 45, 35];
const RESIZE_FACTOR = 0.75;
const MAX_PIXELS = 1120 * 1120;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;
const CACHE_DB_NAME = 'image-captioner-cache';
const CACHE_RESULTS_KEY = 'all';
const CACHE_FOLDERS_KEY = 'folders';
const CACHE_SESSION_KEY = 'current';

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
    skippedByGenerated: '跳过（本次已生成）：{name}',
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
    resultItemCopyBtn: '复制',
    resultItemCopied: '已复制结果：{name}',
    logCleared: '日志已清空。',
    directoryRescanned: '已重新扫描目录，当前图片数量：{count}',
    appReady: '程序已就绪，等待选择目录。',
    githubLinkTitle: 'GitHub 项目主页',
    cacheLocationLabel: '缓存位置',
    cacheLocationDefault: '浏览器存储',
    cacheFolderChosen: '文件夹：{name}',
    chooseCacheFolderBtn: '选择缓存文件夹',
    clearCacheBtn: '清除缓存',
    cacheHelper: '刷新后保留；文件夹缓存存于所选文件夹的同名子目录，单图存于 captioner-cache，互不干扰；文件夹文件手动删除；清除只清浏览器缓存。',    cacheFolderSet: '已设置缓存文件夹：{name}',
    chooseCacheFolderFailed: '选择缓存文件夹失败：{error}',
    cacheCleared: '已清除缓存。',
    cacheFolderWriteFailed: '写入缓存文件夹失败，请检查文件夹权限。',
    restoreFolderBtn: '恢复上次文件夹：{name}',
    folderRestored: '已恢复文件夹 {name}，共 {count} 张图片。',
    singlePreviewRestored: '已恢复上次的单图预览。',
    folderViewDeleted: '已删除文件夹结果：{name}',
    folderResultsLabel: '文件夹结果',
    importNoCacheFolder: '缓存文件夹句柄无法跨部署转移，请重新选择缓存文件夹。',
    importNoFolderHandle: '文件夹结果已导入，但目录关联无法跨部署转移；点击文件夹标签可查看结果，重新选择对应文件夹可恢复预览。',
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
    skippedByGenerated: 'Skipped (already generated this session): {name}',
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
    resultItemCopyBtn: 'Copy',
    resultItemCopied: 'Copied result: {name}',
    logCleared: 'Log cleared.',
    directoryRescanned: 'Directory rescanned. Current image count: {count}',
    appReady: 'Application ready. Waiting for a directory selection.',
    githubLinkTitle: 'GitHub project page',
    cacheLocationLabel: 'Cache Location',
    cacheLocationDefault: 'Browser Storage',
    cacheFolderChosen: 'Folder: {name}',
    chooseCacheFolderBtn: 'Choose Cache Folder',
    clearCacheBtn: 'Clear Cache',
    cacheHelper: 'Survives refresh; folder caches go into a same-named subfolder of the chosen folder, single images into captioner-cache. Folder files are deleted manually; Clear only wipes browser cache.',
    cacheFolderSet: 'Cache folder set: {name}',
    chooseCacheFolderFailed: 'Failed to choose cache folder: {error}',
    cacheCleared: 'Cache cleared.',
    cacheFolderWriteFailed: 'Failed to write to cache folder. Please check folder permissions.',
    restoreFolderBtn: 'Restore last folder: {name}',
    folderRestored: 'Restored folder {name} with {count} images.',
    singlePreviewRestored: 'Restored the previous single-image preview.',
    folderViewDeleted: 'Deleted folder results: {name}',
    folderResultsLabel: 'Folder Results',
    importNoCacheFolder: 'Cache folder handles cannot transfer across deployments, please re-choose the cache folder.',
    importNoFolderHandle: 'Folder results imported, but directory links cannot transfer across deployments; click a folder chip to view results, re-choose the folder to restore preview.',
  },
};

const els = {
  connectionBadge: document.getElementById('connectionBadge'),
  serverUrlInput: document.getElementById('serverUrlInput'),
  modelInput: document.getElementById('modelInput'),
  modelDropdownBtn: document.getElementById('modelDropdownBtn'),
  modelDropdown: document.getElementById('modelDropdown'),
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
  cacheLocationText: document.getElementById('cacheLocationText'),
  chooseCacheFolderBtn: document.getElementById('chooseCacheFolderBtn'),
  clearCacheBtn: document.getElementById('clearCacheBtn'),
  restoreFolderBtn: document.getElementById('restoreFolderBtn'),
  folderChips: document.getElementById('folderChips'),
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
  results: [],                 // 当前视图的结果（单图或某个文件夹）
  singleResults: [],           // 单图模式结果（与文件夹结果分开保存）
  folderResults: [],           // [{ name, results: [] }] 各文件夹结果
  activeFolderName: '',        // 当前查看的文件夹名，'' 表示单图视图
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
  runAbortController: null,
  cacheFolderHandle: null,
  pendingFolderHandle: null,
  pendingFolderLabel: '',
  pendingCurrentIndex: 0,
  processedSingleNames: new Set(),
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

/* ---------- 浏览器缓存（IndexedDB） ---------- */

let cacheDbPromise = null;

function getCacheDb() {
  if (!cacheDbPromise) {
    cacheDbPromise = new Promise((resolve) => {
      if (!('indexedDB' in window)) {
        resolve(null);
        return;
      }
      const request = indexedDB.open(CACHE_DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('results')) db.createObjectStore('results');
        if (!db.objectStoreNames.contains('session')) db.createObjectStore('session');
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    });
  }
  return cacheDbPromise;
}

function dbRequestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function dbPut(storeName, value, key) {
  const db = await getCacheDb();
  if (!db) return;
  try {
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).put(value, key);
    await new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } catch {
    // 缓存不可用时静默降级为内存模式
  }
}

async function dbGet(storeName, key) {
  const db = await getCacheDb();
  if (!db) return undefined;
  try {
    const tx = db.transaction(storeName, 'readonly');
    return await dbRequestToPromise(tx.objectStore(storeName).get(key));
  } catch {
    return undefined;
  }
}

async function dbClear(storeName) {
  const db = await getCacheDb();
  if (!db) return;
  try {
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).clear();
    await new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } catch {
    // 忽略清除失败
  }
}

async function saveResultsToCache() {
  await dbPut('results', state.singleResults, CACHE_RESULTS_KEY);
  await dbPut('results', state.folderResults, CACHE_FOLDERS_KEY);
}

async function loadResultsFromCache() {
  const [single, folders] = await Promise.all([
    dbGet('results', CACHE_RESULTS_KEY),
    dbGet('results', CACHE_FOLDERS_KEY),
  ]);
  return {
    single: Array.isArray(single) ? single : [],
    folders: Array.isArray(folders) ? folders : [],
  };
}

async function saveSessionToCache() {
  const session = {
    mode: state.singleFileMode ? 'single' : 'folder',
    singleFiles: state.singleFileMode ? state.files.map((item) => item.sourceFile).filter(Boolean) : [],
    directoryHandle: state.directoryHandle || null,
    directoryLabel: state.directoryLabel || '',
    currentIndex: state.currentIndex,
    resultSeq: state.resultSeq,
    cacheFolderHandle: state.cacheFolderHandle || null,
    activeFolderName: state.activeFolderName || '',
  };
  await dbPut('session', session, CACHE_SESSION_KEY);
}

async function loadSessionFromCache() {
  return dbGet('session', CACHE_SESSION_KEY);
}

/* ---------- 可选缓存文件夹 ---------- */

async function chooseCacheFolder() {
  if (typeof window.showDirectoryPicker !== 'function') {
    log('browserNoDirectoryPicker');
    return;
  }
  try {
    const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
    state.cacheFolderHandle = handle;
    updateCacheLocationText();
    await saveSessionToCache();
    log('cacheFolderSet', { name: handle.name });
  } catch (error) {
    if (error?.name !== 'AbortError') {
      log('chooseCacheFolderFailed', { error: error.message || error });
    }
  }
}

// 把单个结果以「原图 + 同名 .txt」形式写入缓存文件夹（按相对路径镜像子目录）
// 文件夹模式的缓存放在与输入文件夹同名的子目录下，单图模式放在 captioner-cache，两者分开
async function writeResultToCacheFolder(item, file, caption) {
  if (!state.cacheFolderHandle) return;
  try {
    const subDir = !state.singleFileMode && state.directoryLabel
      ? state.directoryLabel
      : 'captioner-cache';
    const cacheRoot = await state.cacheFolderHandle.getDirectoryHandle(subDir, { create: true });
    const rel = item.relativePath || item.name || `result-${state.resultSeq}`;
    const parts = rel.split('/');
    const fileName = parts.pop();
    const baseName = fileName.replace(/\.[^.]+$/, '');
    let targetDir = cacheRoot;
    for (const part of parts) {
      targetDir = await targetDir.getDirectoryHandle(part, { create: true });
    }
    const imageHandle = await targetDir.getFileHandle(fileName, { create: true });
    const imageWritable = await imageHandle.createWritable();
    await imageWritable.write(file);
    await imageWritable.close();
    const txtHandle = await targetDir.getFileHandle(`${baseName}.txt`, { create: true });
    const txtWritable = await txtHandle.createWritable();
    await txtWritable.write(caption || '');
    await txtWritable.close();
  } catch {
    log('cacheFolderWriteFailed');
  }
}

function updateCacheLocationText() {
  if (!els.cacheLocationText) return;
  els.cacheLocationText.textContent = state.cacheFolderHandle
    ? t('cacheFolderChosen', { name: state.cacheFolderHandle.name })
    : t('cacheLocationDefault');
}

/* ---------- 配置导出 / 导入（由 Hub 调用） ---------- */

const HUB_EXPORT_MESSAGE = 'captioner:export-data';
const HUB_IMPORT_MESSAGE = 'captioner:import-data';
const PENDING_IMPORT_KEY = 'captioner-pending-import';

function buildExportData() {
  return {
    app: 'Image_Captioner',
    version: 1,
    exportedAt: new Date().toISOString(),
    config: getConfig(),
    presets: state.presets,
    singleResults: state.singleResults,
    folderResults: state.folderResults.map((entry) => ({
      name: entry.name,
      results: entry.results,
    })),
    cacheFolderName: state.cacheFolderHandle?.name || '',
    // 目录句柄无法序列化导出（浏览器安全限制），只保留名称作参考
    folderNames: state.folderResults.map((entry) => entry.name),
  };
}

function sanitizeImportedResults(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item) => item && typeof item === 'object' && typeof item.name === 'string')
    .map((item) => ({
      id: Number(item.id) || 0,
      name: item.name,
      caption: String(item.caption ?? ''),
      thumbUrl: typeof item.thumbUrl === 'string' ? item.thumbUrl : '',
    }));
}

function applyImportedConfig(data, mode) {
  const config = data?.config;
  if (config && typeof config === 'object') {
    applyConfig(config);
    persistCurrentConfig(getConfig(), false);
  }

  // 收集当前会话中已有的文件夹目录句柄（IndexedDB 恢复的），供导入后按名称保留
  const existingHandleMap = new Map();
  for (const entry of state.folderResults) {
    if (entry.name && entry.directoryHandle) {
      existingHandleMap.set(entry.name, entry.directoryHandle);
    }
  }

  if (mode === 'overwrite') {
    state.presets = Array.isArray(data?.presets)
      ? data.presets.filter((item) => item && typeof item.name === 'string' && item.name.trim())
      : [];
    state.singleResults = sanitizeImportedResults(data?.singleResults);
    state.folderResults = Array.isArray(data?.folderResults)
      ? data.folderResults
          .filter((entry) => entry && typeof entry.name === 'string' && entry.name.trim())
          .map((entry) => ({
            name: entry.name,
            results: sanitizeImportedResults(entry.results),
            // 同一浏览器导入时保留原有目录句柄，避免覆盖模式丢失目录关联
            directoryHandle: existingHandleMap.get(entry.name) || null,
          }))
      : [];
  } else {
    // 合并：预设按名称去重，结果按名称去重合并
    const presetMap = new Map(state.presets.map((item) => [item.name, item]));
    for (const item of (data?.presets || [])) {
      if (item && typeof item.name === 'string' && item.name.trim()) {
        presetMap.set(item.name, item);
      }
    }
    state.presets = [...presetMap.values()];

    const singleMap = new Map(state.singleResults.map((item) => [item.name, item]));
    for (const item of sanitizeImportedResults(data?.singleResults)) {
      singleMap.set(item.name, item);
    }
    state.singleResults = [...singleMap.values()];

    const folderMap = new Map(state.folderResults.map((entry) => [entry.name, entry]));
    for (const entry of (data?.folderResults || [])) {
      if (!entry || typeof entry.name !== 'string' || !entry.name.trim()) continue;
      const existing = folderMap.get(entry.name);
      const importedResults = sanitizeImportedResults(entry.results);
      if (existing) {
        const resultMap = new Map(existing.results.map((item) => [item.name, item]));
        for (const item of importedResults) {
          resultMap.set(item.name, item);
        }
        existing.results = [...resultMap.values()];
      } else {
        folderMap.set(entry.name, {
          name: entry.name,
          results: importedResults,
          directoryHandle: existingHandleMap.get(entry.name) || null,
        });
      }
    }
    state.folderResults = [...folderMap.values()];
  }

  state.folderResults = state.folderResults.filter((entry) => entry.results.length > 0);
  state.resultSeq = state.singleResults.reduce((maxId, item) => Math.max(maxId, item.id || 0), 0);
  for (const entry of state.folderResults) {
    for (const item of entry.results) {
      state.resultSeq = Math.max(state.resultSeq, item.id || 0);
    }
  }
  state.processedSingleNames = new Set(state.singleResults.map((item) => item.name));
  state.presets.sort((a, b) => a.name.localeCompare(b.name, state.language === 'zh' ? 'zh-CN' : 'en'));
  persistPresets();
}

async function applyImportedConfigAndRefresh(data, mode) {
  // init 阶段合并时，state 尚未从 IndexedDB 恢复 → 先加载现有结果再合并，避免覆盖
  if (!state.singleResults.length && !state.folderResults.length) {
    try {
      const existing = await loadResultsFromCache();
      state.singleResults = Array.isArray(existing.single) ? existing.single : [];
      state.folderResults = Array.isArray(existing.folders) ? existing.folders : [];
    } catch {
      // ignore
    }
  }
  // 同浏览器导入时，保留当前会话中已有的目录/文件信息（导入文件不含句柄）
  // 关键：避免下面 saveSessionToCache() 在 init 阶段把旧目录句柄覆盖为 null
  let prev = null;
  try {
    prev = await loadSessionFromCache();
  } catch {
    prev = null;
  }
  const prevDirectoryHandle = prev?.directoryHandle || null;
  const prevDirectoryLabel = prev?.directoryLabel || '';
  const prevSingleFileMode = prev?.mode === 'single';
  const prevSingleFiles = prevSingleFileMode && Array.isArray(prev.singleFiles) ? prev.singleFiles : [];
  const prevSingleSource = prev?.singleFileSource || (prevSingleFiles.length ? prevSingleFiles[prevSingleFiles.length - 1] : null);
  const prevCurrentIndex = prev?.currentIndex ?? 0;
  const prevCacheHandle = prev?.cacheFolderHandle || null;
  applyImportedConfig(data, mode);
  // 恢复无法从导入文件重建的会话字段
  if (!state.cacheFolderHandle && prevCacheHandle) {
    state.cacheFolderHandle = prevCacheHandle;
  }
  if (!state.directoryHandle && prevDirectoryHandle) {
    state.directoryHandle = prevDirectoryHandle;
    state.directoryLabel = prevDirectoryLabel;
    state.singleFileMode = prevSingleFileMode;
    if (prevSingleFileMode && prevSingleFiles.length) {
      state.singleFileSource = prevSingleSource;
      state.files = prevSingleFiles.map((file) => createVirtualFileItem(file));
      state.currentIndex = Math.min(prevCurrentIndex, state.files.length - 1);
    } else if (!prevSingleFileMode) {
      state.singleFileMode = false;
    }
  }
  updatePresetSelectOptions();
  updateCacheLocationText();
  enterSingleView();
  renderFolderChips();
  // 等待 IndexedDB 写入完成，避免 Hub 立即刷新导致数据丢失
  await Promise.all([saveResultsToCache(), saveSessionToCache()]);
  syncRuntimeToSession();
  // 导入的文件夹结果没有目录句柄（跨部署无法转移）→ 明确提示
  const hasImportedFolders = Array.isArray(data.folderResults) && data.folderResults.some((entry) => entry?.results?.length > 0);
  if (hasImportedFolders) {
    log('importNoFolderHandle');
  }
  if (data.cacheFolderName && !state.cacheFolderHandle) {
    log('importNoCacheFolder');
  }
}

function setupHubBridge() {
  // Hub 与 captioner 同源，通过 sessionStorage 可靠传递导入数据（reload 后仍可读）
  window.addEventListener('message', (event) => {
    const { type } = event.data || {};
    if (type === HUB_EXPORT_MESSAGE) {
      // Hub 请求导出数据
      event.source?.postMessage(
        { type: `${HUB_EXPORT_MESSAGE}:reply`, payload: buildExportData() },
        { targetOrigin: '*' },
      );
    } else if (type === HUB_IMPORT_MESSAGE) {
      // Hub 请求导入数据（mode: 'merge' | 'overwrite'），等待写入完成后回复
      applyImportedConfigAndRefresh(event.data.payload, event.data.mode || 'merge').then(() => {
        event.source?.postMessage(
          { type: `${HUB_IMPORT_MESSAGE}:reply`, ok: true },
          { targetOrigin: '*' },
        );
      });
    }
  });
}

// 把当前导出数据同步到 sessionStorage，供 Hub 导出时读取（同源共享，规避 postMessage 时序）
function syncRuntimeToSession() {
  try {
    sessionStorage.setItem('captioner-runtime', JSON.stringify(buildExportData()));
  } catch {
    // sessionStorage 容量超限或不可用时忽略
  }
}

// 应用 Hub 写入 sessionStorage 的待导入数据（reload 后 captioner init 时调用）
async function applyPendingImportFromSession() {
  let raw = null;
  try {
    raw = sessionStorage.getItem('captioner-pending-import');
  } catch {
    return;
  }
  if (!raw) return;
  try {
    sessionStorage.removeItem('captioner-pending-import');
    const { payload, mode } = JSON.parse(raw);
    if (payload && typeof payload === 'object') {
      await applyImportedConfigAndRefresh(payload, mode || 'merge');
    }
  } catch {
    // 解析失败时忽略
  }
}

/* ---------- 文件夹结果视图 ---------- */

function getFolderEntry(name) {
  return state.folderResults.find((entry) => entry.name === name);
}

function enterSingleView() {
  state.activeFolderName = '';
  state.results = state.singleResults;
  state.selectedResultId = null;
  renderResults();
  renderFolderChips();
}

function enterFolderView(name) {
  const entry = getFolderEntry(name);
  if (!entry) return;
  state.activeFolderName = name;
  state.results = entry.results;
  state.selectedResultId = null;
  renderResults();
  renderFolderChips();
}

async function toggleFolderView(name) {
  if (state.activeFolderName === name) {
    enterSingleView();
  } else {
    enterFolderView(name);
    // 点击文件夹结果标签时，自动把预览切回该文件夹目录
    await restoreFolderDirectory(name);
  }
}

async function deleteFolderView(name) {
  const wasActive = state.activeFolderName === name;
  state.folderResults = state.folderResults.filter((entry) => entry.name !== name);
  if (wasActive) {
    enterSingleView();
  } else {
    renderFolderChips();
  }
  saveResultsToCache();
  saveSessionToCache();
  log('folderViewDeleted', { name });
}

function renderFolderChips() {
  if (!els.folderChips) return;
  els.folderChips.innerHTML = '';
  const visible = state.folderResults.filter((entry) => entry.results.length > 0);
  els.folderChips.hidden = visible.length === 0;
  if (!visible.length) return;

  const label = document.createElement('span');
  label.className = 'folder-chips-label';
  label.textContent = t('folderResultsLabel');
  els.folderChips.appendChild(label);

  for (const entry of visible) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'folder-chip' + (state.activeFolderName === entry.name ? ' active' : '');
    chip.title = entry.name;

    const label = document.createElement('span');
    label.className = 'folder-chip-name';
    label.textContent = entry.name;

    const del = document.createElement('span');
    del.className = 'folder-chip-del';
    del.textContent = '×';
    del.addEventListener('click', (event) => {
      event.stopPropagation();
      deleteFolderView(entry.name);
    });

    chip.appendChild(label);
    chip.appendChild(del);
    chip.addEventListener('click', () => toggleFolderView(entry.name));
    els.folderChips.appendChild(chip);
  }
}

async function restoreFolderDirectory(name) {
  const entry = getFolderEntry(name);
  if (!entry || !entry.directoryHandle) return;
  let granted = false;
  try {
    granted = await ensureDirectoryPermission(entry.directoryHandle, 'readwrite');
  } catch {
    granted = false;
  }
  if (!granted) return;
  state.singleFileMode = false;
  state.directoryHandle = entry.directoryHandle;
  state.directoryLabel = entry.name;
  els.folderPathInput.value = entry.name;
  state.files = await collectImageFiles(entry.directoryHandle, els.recursiveCheck.checked);
  state.currentIndex = state.files.length ? 0 : -1;
  resetCounters();
  syncStats();
  renderThumbStrip();
  await renderPreview();
  saveSessionToCache();
}

/* ---------- 缓存恢复与清除 ---------- */

function showRestoreFolderBtn() {
  if (!els.restoreFolderBtn) return;
  els.restoreFolderBtn.hidden = false;
  els.restoreFolderBtn.textContent = t('restoreFolderBtn', { name: state.pendingFolderLabel || '' });
}

function hideRestoreFolderBtn() {
  if (!els.restoreFolderBtn) return;
  els.restoreFolderBtn.hidden = true;
}

async function tryRestoreFolderSession() {
  const handle = state.pendingFolderHandle;
  if (!handle) return;
  let granted = false;
  try {
    granted = await ensureDirectoryPermission(handle, 'readwrite');
  } catch {
    granted = false;
  }
  if (!granted) {
    showRestoreFolderBtn();
    return;
  }
  state.directoryHandle = handle;
  state.directoryLabel = state.pendingFolderLabel || handle.name || 'selected-folder';
  els.folderPathInput.value = state.directoryLabel;
  state.files = await collectImageFiles(handle, els.recursiveCheck.checked);
  state.currentIndex = state.pendingCurrentIndex >= 0 && state.pendingCurrentIndex < state.files.length
    ? state.pendingCurrentIndex
    : (state.files.length ? 0 : -1);
  resetCounters();
  syncStats();
  renderThumbStrip();
  await renderPreview();
  hideRestoreFolderBtn();
  log('folderRestored', { name: state.directoryLabel, count: state.files.length });
  saveSessionToCache();
}

async function restoreCachedSession() {
  const [cachedResults, cachedSession] = await Promise.all([
    loadResultsFromCache(),
    loadSessionFromCache(),
  ]);

  state.singleResults = Array.isArray(cachedResults.single) ? cachedResults.single : [];
  state.folderResults = Array.isArray(cachedResults.folders) ? cachedResults.folders : [];
  state.resultSeq = state.singleResults.reduce((maxId, entry) => Math.max(maxId, Number(entry.id) || 0), 0);
  for (const folder of state.folderResults) {
    for (const entry of folder.results) {
      state.resultSeq = Math.max(state.resultSeq, Number(entry.id) || 0);
    }
  }
  state.processedSingleNames = new Set(state.singleResults.map((entry) => entry.name));
  enterSingleView();

  if (!cachedSession) return;

  state.cacheFolderHandle = cachedSession.cacheFolderHandle || null;
  updateCacheLocationText();
  if (cachedSession.resultSeq > state.resultSeq) state.resultSeq = cachedSession.resultSeq;

  if (cachedSession.mode === 'single') {
    const singleFiles = Array.isArray(cachedSession.singleFiles) && cachedSession.singleFiles.length
      ? cachedSession.singleFiles
      : (cachedSession.singleFile ? [cachedSession.singleFile] : []);
    if (singleFiles.length) {
      state.singleFileMode = true;
      state.singleFileSource = singleFiles[singleFiles.length - 1];
      state.files = singleFiles.map((file) => createVirtualFileItem(file));
      state.currentIndex = Math.min(cachedSession.currentIndex || 0, state.files.length - 1);
      renderThumbStrip();
      await renderPreview();
      log('singlePreviewRestored');
    }
  } else if (cachedSession.mode === 'folder' && cachedSession.directoryHandle) {
    state.pendingFolderHandle = cachedSession.directoryHandle;
    state.pendingFolderLabel = cachedSession.directoryLabel || '';
    state.pendingCurrentIndex = cachedSession.currentIndex || 0;
    tryRestoreFolderSession();
  }

  // 恢复上次查看的文件夹结果视图（若仍存在）
  if (cachedSession.activeFolderName && getFolderEntry(cachedSession.activeFolderName)) {
    enterFolderView(cachedSession.activeFolderName);
  }

  // 恢复完成后同步到 sessionStorage，供 Hub 导出时读取（即使刚打开页面未做任何操作也能导出）
  syncRuntimeToSession();
}

async function clearCache() {
  await dbClear('results');
  await dbClear('session');
  if (state.currentObjectUrl) {
    URL.revokeObjectURL(state.currentObjectUrl);
    state.currentObjectUrl = '';
  }
  state.results = [];
  state.singleResults = [];
  state.folderResults = [];
  state.activeFolderName = '';
  state.selectedResultId = null;
  state.resultSeq = 0;
  state.processedSingleNames = new Set();
  state.files = [];
  state.currentIndex = -1;
  state.singleFileMode = false;
  state.singleFileSource = null;
  state.directoryHandle = null;
  state.directoryLabel = '';
  state.cacheFolderHandle = null;
  state.pendingFolderHandle = null;
  state.pendingFolderLabel = '';
  state.pendingCurrentIndex = 0;
  els.folderPathInput.value = '';
  hideRestoreFolderBtn();
  updateCacheLocationText();
  renderFolderChips();
  resetCounters();
  renderThumbStrip();
  renderResults();
  await renderPreview();
  log('cacheCleared');
}

function buildResultItem(entry) {
  const item = document.createElement('div');
  item.className = 'result-item';
  item.dataset.resultId = String(entry.id);
  item.dataset.resultName = entry.name;

  const thumb = document.createElement('img');
  if (entry.thumbUrl) {
    thumb.src = entry.thumbUrl;
  } else {
    thumb.className = 'result-thumb-missing';
  }
  thumb.alt = entry.name;

  const textColumn = document.createElement('div');
  textColumn.className = 'result-text';

  const fileNameRow = document.createElement('div');
  fileNameRow.className = 'result-file-row';

  const fileName = document.createElement('div');
  fileName.className = 'result-file-name';
  fileName.textContent = entry.name;

  const copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className = 'result-copy-btn';
  copyBtn.textContent = t('resultItemCopyBtn');
  copyBtn.title = t('copyCaptionBtn');
  copyBtn.addEventListener('click', async (event) => {
    event.stopPropagation();
    if (await copyTextToClipboard(entry.caption)) {
      log('resultItemCopied', { name: entry.name });
    }
  });

  fileNameRow.appendChild(fileName);
  fileNameRow.appendChild(copyBtn);

  const caption = document.createElement('div');
  caption.className = 'result-caption';
  caption.textContent = entry.caption;

  textColumn.appendChild(fileNameRow);
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
  // 若同名条目已存在（重复处理同一文件），先移除旧节点再插入新节点
  const oldNode = list.querySelector(`.result-item[data-result-name="${CSS.escape(entry.name)}"]`);
  if (oldNode) oldNode.remove();
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

function getActiveResultsTarget() {
  if (!state.singleFileMode && state.directoryLabel) {
    let entry = getFolderEntry(state.directoryLabel);
    if (!entry) {
      entry = { name: state.directoryLabel, results: [] };
      state.folderResults.push(entry);
    }
    state.activeFolderName = state.directoryLabel;
    return entry.results;
  }
  state.activeFolderName = '';
  return state.singleResults;
}

function addResultEntry(name, caption, thumbUrl) {
  state.resultSeq += 1;
  const entry = { id: state.resultSeq, name, caption, thumbUrl };
  const target = getActiveResultsTarget();
  // 同一文件名已存在结果时（多次处理同一文件夹），替换旧条目避免重复
  const existingIndex = target.findIndex((item) => item.name === name);
  if (existingIndex >= 0) {
    target[existingIndex] = entry;
  } else {
    target.push(entry);
  }
  state.results = target;
  appendResultItem(entry);
  renderFolderChips();
  saveResultsToCache();
  saveSessionToCache();
  syncRuntimeToSession();
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
  updateCacheLocationText();
  renderFolderChips();
  if (state.pendingFolderLabel && els.restoreFolderBtn && !els.restoreFolderBtn.hidden) {
    els.restoreFolderBtn.textContent = t('restoreFolderBtn', { name: state.pendingFolderLabel || '' });
  }

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
    timeoutSeconds: DEFAULT_TIMEOUT_SECONDS,
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

  // 拖入单图总是单独处理：从文件夹模式切回单图模式（清空文件夹列表），或单图模式继续累加
  const switchingFromFolder = !!state.directoryHandle && !state.singleFileMode;
  state.singleFileMode = true;
  state.singleFileSource = file;
  state.directoryHandle = null;
  state.directoryLabel = '';
  els.folderPathInput.value = '';
  if (switchingFromFolder) {
    state.files = [createVirtualFileItem(file)];
    state.currentIndex = 0;
  } else {
    state.files.push(createVirtualFileItem(file));
    state.currentIndex = state.files.length - 1;
  }
  enterSingleView();
  state.isRunning = false;
  state.stopRequested = false;
  resetCounters();
  setTaskButtonsDisabled(false);
  setRuntimeStatus('runtimeIdle');
  setConnectionBadgeByKey('idle');
  renderThumbStrip();
  await renderPreview();
  await saveSessionToCache();
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
    state.processedSingleNames = new Set();
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
    await saveSessionToCache();
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
  const onRunAbort = () => controller.abort(new Error('stopped'));
  const timeoutId = window.setTimeout(() => controller.abort(new Error('timeout')), timeoutSeconds * 1000);
  state.runAbortController?.signal.addEventListener('abort', onRunAbort, { once: true });
  return {
    signal: controller.signal,
    cleanup() {
      window.clearTimeout(timeoutId);
      state.runAbortController?.signal.removeEventListener('abort', onRunAbort);
    },
  };
}

function isStopRequested() {
  return state.stopRequested || !!state.runAbortController?.signal.aborted;
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
  const abortable = buildAbortSignal(config.timeoutSeconds);
  try {
    const data = await safeFetchJson(`${baseUrl}/models`, {
      method: 'GET',
      mode: 'cors',
      headers: config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {},
      signal: abortable.signal,
    });
    const models = (data?.data || []).map((item) => item.id).filter(Boolean);
    const modelId = models[0];
    if (!modelId) throw new Error(t('modelListEmpty'));
    populateModelList(models, modelId);
    state.currentModel = modelId;
    return modelId;
  } finally {
    abortable.cleanup();
  }
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
    if (isStopRequested()) break;
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
      if (isStopRequested()) break;
      const message = String(error?.message || error);
      const retryable = /failed to process image|memory slot|channel error|timeout|abort/i.test(message);
      if (attempt < MAX_RETRIES && retryable) {
        log('retryRequest', { name: item.relativePath, attempt, seconds: Math.round(RETRY_DELAY_MS / 1000) });
        await sleep(RETRY_DELAY_MS);
        if (isStopRequested()) break;
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
  if (isStopRequested()) return;
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
  if (isStopRequested()) return;
  addResultEntry(progressName, finalCaption, thumbUrl);
  writeResultToCacheFolder(item, file, finalCaption);
  if (state.singleFileMode) {
    state.processedSingleNames.add(progressName);
  }
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
  state.runAbortController = new AbortController();
  resetCounters();
  state.lastLogLines = [];
  log('taskStarted');
  if (!state.singleFileMode) {
    // 文件夹处理结果单独保存到对应文件夹名下
    // 注意：不在此清空已有结果，多次分开处理同一文件夹时结果累积显示
    let entry = getFolderEntry(state.directoryLabel);
    if (!entry) {
      entry = { name: state.directoryLabel, results: [] };
      state.folderResults.push(entry);
    }
    // 记住该文件夹的目录句柄，点击结果标签时可自动切回对应目录
    entry.directoryHandle = state.directoryHandle;
    state.activeFolderName = state.directoryLabel;
    state.results = entry.results;
    state.selectedResultId = null;
    renderResults();
    renderFolderChips();
    saveResultsToCache();
    saveSessionToCache();
  } else {
    // 单图模式：结果显示在单图视图
    enterSingleView();
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

      if (state.singleFileMode && state.processedSingleNames.has(progressName)) {
        state.stats.skipped += 1;
        syncStats();
        log('skippedByGenerated', { name: progressName });
        continue;
      }

      if (!state.singleFileMode) {
        const hasTxt = await hasExistingCaption(item);
        if (combineMode === 'none' && config.skipExisting && hasTxt) {
          // 已有 txt 且勾选跳过 → 跳过
          progressSet.add(progressName);
          saveProgressRecord(progressSet);
          state.stats.skipped += 1;
          syncStats();
          log('skippedByExisting', { name: progressName });
          continue;
        }
        if (hasTxt && progressSet.has(progressName)) {
          // txt 仍存在但用户关闭跳过：按进度记录跳过（中断续跑场景）
          state.stats.skipped += 1;
          syncStats();
          log('skippedByProgress', { name: progressName });
          continue;
        }
        // TXT 已被删除（用户想重新生成）→ 清理过期进度记录并处理
        if (!hasTxt && progressSet.has(progressName)) {
          progressSet.delete(progressName);
          saveProgressRecord(progressSet);
        }
      }

      try {
        await processItem(item, config, combineMode, progressSet);
      } catch (error) {
        if (isStopRequested()) break;
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
    if (isStopRequested()) {
      log('taskStopped');
      setConnectionBadgeByKey('taskFinished');
    } else {
      setConnectionBadgeByKey('taskError');
      log('taskException', { error: error.message || error });
    }
  } finally {
    state.isRunning = false;
    state.stopRequested = false;
    state.runAbortController = null;
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
  state.runAbortController = new AbortController();
  state.lastLogLines = [];
  log('taskStarted');
  setRuntimeStatus('runtimeRunning');
  setConnectionBadgeByKey('taskRunning');
  setTaskButtonsDisabled(true);
  if (!state.singleFileMode) {
    // 文件夹模式：结果归入当前文件夹
    let entry = getFolderEntry(state.directoryLabel);
    if (!entry) {
      entry = { name: state.directoryLabel, results: [] };
      state.folderResults.push(entry);
    }
    entry.directoryHandle = state.directoryHandle;
    state.activeFolderName = state.directoryLabel;
    state.results = entry.results;
    state.selectedResultId = null;
    renderResults();
    renderFolderChips();
    saveResultsToCache();
    saveSessionToCache();
  } else {
    enterSingleView();
  }

  const targetItem = state.files[state.currentIndex];
  const itemName = targetItem.relativePath;
  try {
    await detectModelIfNeeded(config);
    const progressSet = state.singleFileMode ? null : loadProgressRecord();
    await processItem(targetItem, config, 'none', progressSet);
    setConnectionBadgeByKey('taskFinished');
  } catch (error) {
    if (isStopRequested()) {
      setConnectionBadgeByKey('taskFinished');
    } else {
      state.stats.failed += 1;
      syncStats();
      log('processingFailed', { name: itemName, error: error.message || error });
      setConnectionBadgeByKey('taskError');
    }
  } finally {
    state.isRunning = false;
    state.stopRequested = false;
    state.runAbortController = null;
    setTaskButtonsDisabled(false);
    setRuntimeStatus('runtimeIdle');
  }
}

function stopProcessing() {
  if (!state.isRunning) return;
  state.stopRequested = true;
  state.runAbortController?.abort();
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
  if (state.activeFolderName) {
    // 清空当前文件夹的结果（空条目一并移除，标签消失）
    state.folderResults = state.folderResults.filter((entry) => entry.name !== state.activeFolderName);
    state.results = [];
    state.selectedResultId = null;
    enterSingleView();
  } else {
    state.singleResults = [];
    state.results = [];
    state.selectedResultId = null;
    state.processedSingleNames = new Set();
    renderResults();
  }
  saveResultsToCache();
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

  els.chooseCacheFolderBtn.addEventListener('click', chooseCacheFolder);
  els.clearCacheBtn.addEventListener('click', clearCache);
  els.restoreFolderBtn.addEventListener('click', tryRestoreFolderSession);
}

async function init() {
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
  // 先应用 Hub 通过 sessionStorage 传来的待导入数据，再恢复会话，避免读取时序问题
  await applyPendingImportFromSession();
  await restoreCachedSession();
  setupHubBridge();
}

init();
