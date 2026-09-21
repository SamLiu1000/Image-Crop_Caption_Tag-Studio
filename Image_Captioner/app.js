const CONFIG_KEY = 'image-captioner-config';
const PRESETS_KEY = 'image-captioner-config-presets';
const PROGRESS_PREFIX = 'image-captioner-progress:';
const LANGUAGE_KEY = 'image-captioner-language';
const LANGUAGE_SYNC_MESSAGE = 'web-tools-hub:set-language';
const THEME_SYNC_MESSAGE = 'web-tools-hub:set-theme';
const VIDEO_EXTENSIONS = new Set(['.mp4', '.webm', '.mov', '.m4v']);
const SUPPORTED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.gif', '.avif', ...VIDEO_EXTENSIONS]);
const LM_STUDIO_DEFAULT_URL = 'http://localhost:1234/v1';
const DEFAULT_TIMEOUT_SECONDS = 60;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE_BYTES = 80 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1120;
const MIN_IMAGE_DIMENSION = 256;
const JPEG_QUALITY_STEPS = [85, 75, 65, 55, 45, 35];
const RESIZE_FACTOR = 0.75;
const MAX_PIXELS = 1120 * 1120;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;
// 预览条缩略图：格子已放大到约 143px，在 2 倍像素密度下需要 ~286px，故用 320px 源。
// 与结果列表缩略图同尺寸 → 一次解码即可同时供两处使用。
const THUMB_STRIP_DIMENSION = 320;
// 结果列表缩略图：显示框 120px，同样取 320px 以免高分屏/显示缩放下发虚。
const RESULT_THUMB_DIMENSION = 320;
// 缩略图规格版本：调整尺寸/质量后递增，让已持久化的旧缩略图自动失效并重新生成
const THUMB_VERSION = 2;
// 缩略图落盘文件后缀：带版本号，缩略图规格变更后旧文件自然失效并重新生成
const THUMB_FILE_SUFFIX = `.thumb.v${THUMB_VERSION}.webp`;
const CACHE_DB_NAME = 'image-captioner-cache';
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

const DEFAULT_SYSTEM_PROMPT_TAGS = `You are a tagging system, NOT a caption writer.

Your task is to analyze the image and output ONLY a list of tags.

CRITICAL RULES:

DO NOT write sentences.
DO NOT write a description.
DO NOT use grammar like a caption.
ONLY output tags.

Tag rules:

Use short English keywords or phrases (1–3 words per tag).
Separate tags with commas.
No periods, no full sentences.
No explanations, no extra text.
No line breaks.

Content rules:

Only describe visible content.
Focus on: person, body, clothing, nudity, pose, expression, actions.
Include: hair, body type, skin tone, camera angle, accessories.
Include environment only if clearly visible.

Formatting rules (STRICT):

Output EXACTLY one line.
Output format example:
1girl, solo, long hair, blonde hair, nude, sitting, looking at viewer
Your output MUST look like the example above.

If you produce a sentence or paragraph, your answer is WRONG.`;

const DEFAULT_USER_PROMPT_TAGS = 'Analyze this image and output only a comma-separated list of tags on a single line.';

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
    statSelected: '已选文件',
    statProcessed: '已完成',
    statSkipped: '已跳过',
    statFailed: '失败',
    sectionPromptTitle: '提示词',
    fillDefaultCaptionBtn: '填入默认提示（自然语言）',
    fillDefaultTagBtn: '填入默认提示（Tag）',
    clearPromptsBtn: '清空',
    systemPromptPlaceholder: '系统提示词',
    userPromptPlaceholder: '例如：Describe this image in one detailed English paragraph。',
    modeSingleBtn: '单图',
    modeFolderBtn: '文件夹',
    generateBtn: '生成',
    stopBtn: '停止任务',
    prependBtn: '生成（前置）',
    appendBtn: '生成（追加）',
    clearProgressBtn: '清除进度记录',
    previewTitle: '媒体预览',
    prevPreviewBtn: '上一张',
    nextPreviewBtn: '下一张',
    previewImageAlt: '预览图',
    thumbSortName: '名称',
    thumbSortTime: '时间',
    thumbSortImport: '导入时间',
    thumbSortNameHint: '按名称排序（再次点击切换升序 / 降序）',
    thumbSortTimeHint: '按时间排序（文件修改时间，再次点击切换升序 / 降序）',
    thumbSortImportHint: '按拖入/导入的先后时间排序，最新的在上（再次点击切换）',
    previewPlaceholder: '选择图片目录后，可在这里查看当前处理图片。',
    previewDropHint: '支持拖入单张图片或视频进行导入，并直接生成描述/反推提示词。',
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
    resultDeleted: '已删除结果：{name}',
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
    directoryLoaded: '已加载目录 {name}，共 {count} 个文件。',
    chooseDirectoryFailed: '选择目录失败：{error}',
    fileReadFailed: '读取文件失败',
    canvasExportFailed: 'Canvas 导出失败',
    imageDecodeFailed: '图片解码失败',
    videoDecodeFailed: '视频解码失败',
    videoTooLarge: '视频文件过大（默认上限 80MB），无法处理。',
    videoSupportNote: '视频会以原生视频形式直接发送给模型，需要模型/服务端支持视频输入；官方 OpenAI/Anthropic 通常不支持。',
    modelListEmpty: '模型列表为空，请手动填写模型 ID',
    emptyResponse: '返回内容为空',
    retryRequest: '  {name} 第 {attempt} 次请求失败，{seconds} 秒后重试。',
    unknownRequestError: '未知请求错误',
    taskCompletedWithFailure: '任务已结束，但有 {count} 张图片处理失败。',
    chooseDirectoryFirst: '请先选择图片目录。',
    loadSingleFirst: '请先在预览中拖入或加载一张图片。',
    useSingleGenerateButton: '单图模式下，请使用「生成」按钮。',
    modeSwitchedSingle: '已切换到单图模式。',
    modeSwitchedFolder: '已切换到文件夹模式。',
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
    clearCacheBtn: '删除选中',
    cacheHelper: '选择缓存文件夹后自动识别其中内容：captioner-cache 为单图缓存，其它子目录按文件夹名识别为处理结果。先点击标签高亮要删除的目标，再点「删除选中」；删除为永久删除，不经过回收站，无法恢复。',
    queueLabel: '处理队列',
    addToQueueBtn: '加入队列',
    clearQueueBtn: '清空队列',
    queueCount: '{count} 个文件夹',
    queueEmpty: '尚未加入文件夹。先选择目录，再点「加入队列」。',
    queueAdded: '已加入队列：{name}',
    queueExists: '该文件夹已在队列中：{name}',
    queueRemoved: '已从队列移除：{name}',
    queueCleared: '已清空处理队列。',
    queueNeedFolder: '请先选择一个目录，再加入队列。',
    queueProcessing: '正在处理：{name}',
    cacheFolderSet: '已设置缓存文件夹：{name}',
    chooseCacheFolderFailed: '选择缓存文件夹失败：{error}',
    cacheCleared: '已删除缓存。',
    cacheFolderWriteFailed: '写入缓存文件夹失败，请检查文件夹权限。',
    cacheScanned: '已识别缓存内容：单图 {single} 条，文件夹 {folders} 个。',
    cachePreviewRestored: '已从缓存恢复预览：{count} 张图片。',
    cacheScanFailed: '识别缓存内容失败：{error}',
    confirmDeleteCache: '确定删除缓存文件夹中的全部缓存文件吗？此操作不可恢复。',
    confirmDeleteSingleCache: '确定删除单图缓存吗？删除为永久删除，不经过回收站，无法恢复。',
    confirmDeleteFolderView: '确定删除文件夹 {name} 的缓存结果吗？删除为永久删除，不经过回收站，无法恢复。',
    singleCacheLabel: '单图缓存',
    cacheDeleteConfirmed: '已删除缓存文件夹内容。',
    singleCacheDeleted: '已删除单图缓存。',
    noResultToClear: '当前没有可删除的缓存项，请先点击标签高亮目标。',
    restoreFolderBtn: '恢复上次文件夹：{name}',
    folderRestored: '已恢复文件夹 {name}，共 {count} 个文件。',
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
    statSelected: 'Files Selected',
    statProcessed: 'Processed',
    statSkipped: 'Skipped',
    statFailed: 'Failed',
    sectionPromptTitle: 'Prompts',
    fillDefaultCaptionBtn: 'Fill Default (Caption)',
    fillDefaultTagBtn: 'Fill Default (Tags)',
    clearPromptsBtn: 'Clear',
    systemPromptPlaceholder: 'System prompt',
    userPromptPlaceholder: 'Example: Describe this image in one detailed English paragraph.',
    modeSingleBtn: 'Single',
    modeFolderBtn: 'Folder',
    generateBtn: 'Generate',
    stopBtn: 'Stop Task',
    prependBtn: 'Generate (Prepend)',
    appendBtn: 'Generate (Append)',
    clearProgressBtn: 'Clear Progress',
    previewTitle: 'Media Preview',
    prevPreviewBtn: 'Previous',
    nextPreviewBtn: 'Next',
    previewImageAlt: 'Preview image',
    thumbSortName: 'Name',
    thumbSortTime: 'Time',
    thumbSortImport: 'Imported',
    thumbSortNameHint: 'Sort by name (click again to toggle ascending / descending)',
    thumbSortTimeHint: 'Sort by time (file modified time; click again to toggle ascending / descending)',
    thumbSortImportHint: 'Sort by drag/import time, newest on top (click again to toggle)',
    previewPlaceholder: 'After selecting an image folder, the current image will be previewed here.',
    previewDropHint: 'This area also supports dragging in a single image or video for direct import and caption/prompt generation.',
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
    resultDeleted: 'Deleted result: {name}',
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
    directoryLoaded: 'Loaded directory {name} with {count} files.',
    chooseDirectoryFailed: 'Failed to choose directory: {error}',
    fileReadFailed: 'Failed to read file',
    canvasExportFailed: 'Canvas export failed',
    imageDecodeFailed: 'Image decode failed',
    videoDecodeFailed: 'Video decode failed',
    videoTooLarge: 'Video file is too large to process (default limit 80MB).',
    videoSupportNote: 'Video is sent to the model as native video input and requires the model/endpoint to support video; official OpenAI/Anthropic generally do not.',
    modelListEmpty: 'The model list is empty. Please enter the model ID manually.',
    emptyResponse: 'The response content is empty',
    retryRequest: '  Request failed for {name} on attempt {attempt}, retrying in {seconds} seconds.',
    unknownRequestError: 'Unknown request error',
    taskCompletedWithFailure: 'Task finished, but {count} image(s) failed.',
    chooseDirectoryFirst: 'Please choose an image directory first.',
    loadSingleFirst: 'Drop or load a single image in the preview first.',
    useSingleGenerateButton: 'In single image mode, please use the "Generate" button.',
    modeSwitchedSingle: 'Switched to single-image mode.',
    modeSwitchedFolder: 'Switched to folder mode.',
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
    clearCacheBtn: 'Delete Selected',
    cacheHelper: 'After choosing a cache folder its contents are auto-detected: captioner-cache is single-image cache, other subfolders are folder results by name. Click a chip to highlight the target, then click "Delete Selected". Deletion is permanent, skips the recycle bin, and cannot be undone.',
    queueLabel: 'Processing Queue',
    addToQueueBtn: 'Add to Queue',
    clearQueueBtn: 'Clear Queue',
    queueCount: '{count} folder(s)',
    queueEmpty: 'No folders queued yet. Choose a directory, then click "Add to Queue".',
    queueAdded: 'Added to queue: {name}',
    queueExists: 'Folder already in queue: {name}',
    queueRemoved: 'Removed from queue: {name}',
    queueCleared: 'Processing queue cleared.',
    queueNeedFolder: 'Choose a directory first, then add it to the queue.',
    queueProcessing: 'Processing: {name}',
    cacheFolderSet: 'Cache folder set: {name}',
    chooseCacheFolderFailed: 'Failed to choose cache folder: {error}',
    cacheCleared: 'Cache deleted.',
    cacheFolderWriteFailed: 'Failed to write to cache folder. Please check folder permissions.',
    cacheScanned: 'Cache detected: {single} single result(s), {folders} folder result(s).',
    cachePreviewRestored: 'Preview restored from cache: {count} image(s).',
    cacheScanFailed: 'Failed to scan cache folder: {error}',
    confirmDeleteCache: 'Delete all cache files in the cache folder? This cannot be undone.',
    confirmDeleteSingleCache: 'Delete the single-image cache? Deletion is permanent, skips the recycle bin, and cannot be undone.',
    confirmDeleteFolderView: 'Delete cached results for folder {name}? Deletion is permanent, skips the recycle bin, and cannot be undone.',
    singleCacheLabel: 'Single Cache',
    cacheDeleteConfirmed: 'Cache folder contents deleted.',
    singleCacheDeleted: 'Single-image cache deleted.',
    noResultToClear: 'Nothing to delete. Click a chip to highlight a target first.',
    restoreFolderBtn: 'Restore last folder: {name}',
    folderRestored: 'Restored folder {name} with {count} files.',
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
  presetDropdownBtn: document.getElementById('presetDropdownBtn'),
  presetSelectText: document.getElementById('presetSelectText'),
  presetDropdown: document.getElementById('presetDropdown'),
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
  fillDefaultCaptionBtn: document.getElementById('fillDefaultCaptionBtn'),
  fillDefaultTagBtn: document.getElementById('fillDefaultTagBtn'),
  clearPromptsBtn: document.getElementById('clearPromptsBtn'),
  systemPromptInput: document.getElementById('systemPromptInput'),
  userPromptInput: document.getElementById('userPromptInput'),
  modeSingleBtn: document.getElementById('modeSingleBtn'),
  modeFolderBtn: document.getElementById('modeFolderBtn'),
  generateBtn: document.getElementById('generateBtn'),
  prependBtn: document.getElementById('prependBtn'),
  appendBtn: document.getElementById('appendBtn'),
  stopBtn: document.getElementById('stopBtn'),
  clearProgressBtn: document.getElementById('clearProgressBtn'),
  prevPreviewBtn: document.getElementById('prevPreviewBtn'),
  nextPreviewBtn: document.getElementById('nextPreviewBtn'),
  previewStage: document.getElementById('previewStage'),
  previewImage: document.getElementById('previewImage'),
  previewVideo: document.getElementById('previewVideo'),
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
  cacheLocationText: document.getElementById('cacheLocationText'),
  chooseCacheFolderBtn: document.getElementById('chooseCacheFolderBtn'),
  clearCacheBtn: document.getElementById('clearCacheBtn'),
  restoreFolderBtn: document.getElementById('restoreFolderBtn'),
  folderChips: document.getElementById('folderChips'),
  addToQueueBtn: document.getElementById('addToQueueBtn'),
  clearQueueBtn: document.getElementById('clearQueueBtn'),
  folderQueueList: document.getElementById('folderQueueList'),
  queueCountText: document.getElementById('queueCountText'),
  thumbSortBar: document.getElementById('thumbSortBar'),
  thumbSortNameBtn: document.getElementById('thumbSortNameBtn'),
  thumbSortTimeBtn: document.getElementById('thumbSortTimeBtn'),
  thumbSortImportBtn: document.getElementById('thumbSortImportBtn'),
};

// 预览条排序状态：key 为 'imported' / 'name' / 'time'，dir 为 1（升序）或 -1（降序）
// 默认按导入时间、最新在上；listRef 记录被排序的那个数组，用于在换文件夹 / 重新导入时自动复位排序标记
const thumbSort = { key: 'imported', dir: -1, listRef: null };

// 导入时间登记表：记录每张图被拖入/导入工具的时刻（键为 "文件名:大小"），
// 随会话快照持久化，保证重开页面后「导入时间」排序稳定不变
const importTimes = new Map();
const IMPORT_TIMES_MAX = 1000;

function importTimeKey(file) {
  return `${file?.name || ''}:${file?.size || 0}`;
}

function recordImportTime(file, timestamp = Date.now()) {
  if (!file?.name) return;
  importTimes.set(importTimeKey(file), timestamp);
  if (importTimes.size > IMPORT_TIMES_MAX) {
    const oldest = importTimes.keys().next().value;
    importTimes.delete(oldest);
  }
}

// 排序用的导入时间：优先登记表，其次文件修改时间，最后 0
function itemImportTime(item) {
  if (typeof item.importedAt === 'number') return item.importedAt;
  if (item.sourceFile) {
    const recorded = importTimes.get(importTimeKey(item.sourceFile));
    if (typeof recorded === 'number') return recorded;
    if (item.sourceFile.lastModified) return item.sourceFile.lastModified;
  }
  return 0;
}

const state = {
  files: [],
  currentIndex: -1,
  currentObjectUrl: '',
  currentPreviewItem: null,
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
  folderQueue: [],        // [{ label, handle }] 有序，文件夹批处理的队列
  activeQueueIndex: -1,   // 批处理队列时当前正在处理的队列项下标，-1 表示非队列处理
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

// 剥离结果条目中的内存级 File 引用，避免持久化图片本体
function stripResultFiles(results) {
  return results.map((item) => ({ ...item, file: undefined, dir: undefined }));
}

// 结果数据不再缓存在浏览器（IndexedDB）里：唯一来源是数据文件夹扫描。
// 会话快照只保留目录句柄与轻量状态，图片/结果/缩略图一律落盘在缓存文件夹。

async function saveSessionToCache() {
  const session = {
    mode: state.singleFileMode ? 'single' : 'folder',
    directoryHandle: state.directoryHandle || null,
    directoryLabel: state.directoryLabel || '',
    currentIndex: state.currentIndex,
    cacheFolderHandle: state.cacheFolderHandle || null,
    activeFolderName: state.activeFolderName || '',
    folderQueue: (state.folderQueue || []).map((item) => ({ label: item.label, handle: item.handle })),
    // 导入时间登记表：拖入顺序的持久化依据，重开页面后「导入时间」排序仍稳定
    importTimes: Object.fromEntries(importTimes),
    // 浏览状态持久化：缩略条滚动位置（比例），刷新后恢复到上次浏览位置
    thumbScrollRatio: sessionThumbRatio,
  };
  await dbPut('session', session, CACHE_SESSION_KEY);
}

async function loadSessionFromCache() {
  return dbGet('session', CACHE_SESSION_KEY);
}

/* ---------- 可选缓存文件夹 ---------- */

// 本次页面会话里已扫描过的数据文件夹（Hub 加载与握手时会各下发一次，避免重复扫描）
let scannedCacheFolderEntry = null;

// 应用统一数据文件夹（由 Hub 顶部公共栏下发，与标签工具的数据文件共用一个目录）。
// 每次应用都要重新扫描目录：里面有缓存数据时恢复结果列表、文件夹标签与预览条，
// 与原来面板内「选择缓存文件夹」的行为保持一致。
async function applyCacheFolder(handle, force = false) {
  if (!handle) return;
  state.cacheFolderHandle = handle;
  updateCacheLocationText();
  await saveSessionToCache();
  if (!force && scannedCacheFolderEntry && typeof handle.isSameEntry === 'function') {
    try {
      if (await handle.isSameEntry(scannedCacheFolderEntry)) return;
    } catch {
      // isSameEntry 不可用/抛错时按新文件夹处理
    }
  }
  scannedCacheFolderEntry = handle;
  // 无用户手势时 requestPermission 可能失败，这里只做尽力授权，不阻止后面的扫描
  try {
    await ensureDirectoryPermission(handle, 'readwrite');
  } catch {
    // 忽略：扫描自身会处理权限不足的情况
  }
  const ok = await scanCacheFolderContent();
  // 扫描失败（如权限未授予）时不留标记，让 Hub 的重播或下一次点击还能重试
  if (!ok) scannedCacheFolderEntry = null;
  return ok;
}

// 未嵌入 Hub（直接打开本页）时的本地兜底入口；嵌入时按钮由顶部公共栏代替
async function chooseCacheFolder() {
  if (typeof window.showDirectoryPicker !== 'function') {
    log('browserNoDirectoryPicker');
    return;
  }
  try {
    const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
    log('cacheFolderSet', { name: handle.name });
    await applyCacheFolder(handle, true);
  } catch (error) {
    if (error?.name !== 'AbortError') {
      log('chooseCacheFolderFailed', { error: error.message || error });
    }
  }
}

// 把单个结果以「原图 + 同名 .txt」形式写入缓存文件夹（按相对路径镜像子目录）
// 文件夹模式的缓存放在与输入文件夹同名的子目录下，单图模式放在 captioner-cache，两者分开
async function writeResultToCacheFolder(item, file, caption, nameOverride = '') {
  if (!state.cacheFolderHandle) return;
  try {
    // 若缓存文件夹就是当前处理的源文件夹，再以同名子目录缓存会套出「文件夹名/文件夹名」的嵌套目录，
    // 混乱且多余——此时 writeCaptionFile 已把合并结果写回原图旁的 txt，直接跳过这份缓存副本。
    if (state.directoryHandle && typeof state.cacheFolderHandle.isSameEntry === 'function') {
      try {
        if (await state.cacheFolderHandle.isSameEntry(state.directoryHandle)) return;
      } catch {
        // isSameEntry 不可用/抛错时继续走正常缓存
      }
    }
    // 缓存位置跟随「所在文件夹上下文」：有文件夹（无论单图/文件夹模式）缓存在该文件夹同名子目录，
    // 独立拖入的单图（无文件夹）缓存在 captioner-cache
    const subDir = state.directoryLabel ? state.directoryLabel : 'captioner-cache';
    const cacheRoot = await state.cacheFolderHandle.getDirectoryHandle(subDir, { create: true });
    // nameOverride 用于单图多次生成（已带 _N 后缀），此时直接作为缓存内的结果文件名
    const rel = nameOverride || item.relativePath || item.name || `result-${state.resultSeq}`;
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
    return targetDir;
  } catch {
    log('cacheFolderWriteFailed');
    return null;
  }
}

function updateCacheLocationText() {
  if (!els.cacheLocationText) return;
  els.cacheLocationText.textContent = state.cacheFolderHandle
    ? t('cacheFolderChosen', { name: state.cacheFolderHandle.name })
    : t('cacheLocationDefault');
}

/* ---------- 缓存内容扫描与删除 ---------- */

// 递归删除目录内的全部文件与子目录
async function removeDirContents(dirHandle) {
  if (!dirHandle) return;
  for await (const entry of dirHandle.values()) {
    if (entry.kind === 'file') {
      await dirHandle.removeEntry(entry.name);
    } else if (entry.kind === 'directory') {
      await removeDirContents(entry);
      await dirHandle.removeEntry(entry.name);
    }
  }
}

// 递归收集缓存目录中的结果：匹配「原图 + 同名 .txt」对，返回 [{ name, caption, thumbUrl }]
async function collectCacheResults(dirHandle, relPath = '') {
  const results = [];
  const files = [];
  const subDirs = [];
  for await (const entry of dirHandle.values()) {
    if (entry.kind === 'file') {
      files.push(entry);
    } else if (entry.kind === 'directory') {
      subDirs.push(entry);
    }
  }

  const txtFiles = files.filter((entry) => entry.name.toLowerCase().endsWith('.txt'));
  for (const txtEntry of txtFiles) {
    const baseName = txtEntry.name.slice(0, -4);
    const imageEntry = files.find((entry) => {
      if (entry.name.toLowerCase() === txtEntry.name.toLowerCase()) return false;
      const extIndex = entry.name.lastIndexOf('.');
      const base = extIndex > 0 ? entry.name.slice(0, extIndex) : entry.name;
      return base === baseName;
    });
    if (!imageEntry) continue;
    try {
      const txtFile = await (await txtEntry.getFile()).text();
      const caption = (txtFile || '').trim();
      const imageFile = await imageEntry.getFile();
      const name = relPath ? `${relPath}/${baseName}` : baseName;
      // 缩略图不在此处生成：逐张解码大图会长时间阻塞界面（缩略条迟迟不出现）。
      // 改为扫描只读字幕 + 保留文件句柄，UI 立即渲染，缩略图由后台任务填充。
      // size/mtime 作为文件指纹，用于下次刷新时复用已持久化的缩略图（文件没变就不必重新解码）
      results.push({
        name,
        caption,
        thumbUrl: '',
        file: imageFile,
        // 结果所在目录与缩略图文件名：缩略图持久化在缓存文件夹里（与原图同目录），
        // 刷新后直接读文件，不必整目录重新解码原图
        dir: dirHandle,
        thumbName: `${baseName}${THUMB_FILE_SUFFIX}`,
        size: imageFile.size,
        mtime: imageFile.lastModified,
        thumbVer: THUMB_VERSION,
      });
      await sleep(0); // 大目录扫描时让出主线程，保持界面可响应
    } catch {
      // 单个文件读取失败则跳过
    }
  }

  for (const sub of subDirs) {
    const nested = await collectCacheResults(sub, relPath ? `${relPath}/${sub.name}` : sub.name);
    results.push(...nested);
  }
  return results;
}

// ---------- 缩略图持久化（缓存文件夹内，与原图同目录） ----------

function dataUrlToBlob(dataUrl) {
  const commaIndex = dataUrl.indexOf(',');
  if (commaIndex < 0) return null;
  const header = dataUrl.slice(0, commaIndex);
  const mime = (header.match(/^data:([^;,]+)/) || [])[1] || 'application/octet-stream';
  const binary = atob(dataUrl.slice(commaIndex + 1));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

// 把缩略图 dataURL 写入缓存文件夹（与原图同目录的 <名字>.thumb.vN.webp），失败静默
async function persistThumbFile(entry, thumbUrl) {
  if (!entry || !entry.dir || !entry.thumbName || !thumbUrl || !thumbUrl.startsWith('data:')) return;
  try {
    const blob = dataUrlToBlob(thumbUrl);
    if (!blob) return;
    const handle = await entry.dir.getFileHandle(entry.thumbName, { create: true });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
  } catch {
    // 写失败不影响界面，下次刷新会重新生成
  }
}

// 从缓存文件夹读取持久化的缩略图；没有或读取失败返回空串
async function readThumbFile(entry) {
  if (!entry || !entry.dir || !entry.thumbName) return '';
  try {
    const handle = await entry.dir.getFileHandle(entry.thumbName);
    const file = await handle.getFile();
    if (!file.size) return '';
    return await blobToDataUrl(file);
  } catch {
    return '';
  }
}

// 扫描后异步补齐条目缩略图：优先读已落盘的缩略图文件，缺失的按需解码原图再落盘。
// 逐条让出主线程，避免大目录时阻塞界面。
async function hydrateEntryThumbs() {
  const allEntries = [
    ...state.singleResults,
    ...state.folderResults.flatMap((folder) => folder.results || []),
  ];
  for (const entry of allEntries) {
    if (entry.thumbUrl || !entry.file) continue;
    const cached = await readThumbFile(entry);
    if (cached) {
      entry.thumbUrl = cached;
      entry.thumbVer = THUMB_VERSION;
      refreshResultThumb(entry);
      await sleep(0);
    }
  }
  // 没有落盘缩略图的条目（旧缓存/规格升级）：解码原图生成并落盘
  fillUnreferencedResultThumbs();
}

// 扫描缓存文件夹：captioner-cache → 单图结果，其它子目录 → 文件夹结果（以缓存为准覆盖）
async function scanCacheFolderContent() {
  if (!state.cacheFolderHandle) return;
  try {
    const single = [];
    const folders = [];
    for await (const entry of state.cacheFolderHandle.values()) {
      if (entry.kind !== 'directory') continue;
      if (entry.name === 'captioner-cache') {
        single.push(...await collectCacheResults(entry));
      } else {
        const results = await collectCacheResults(entry);
        if (results.length) {
          folders.push({ name: entry.name, results });
        }
      }
    }

    // 以缓存文件夹为准覆盖当前结果，并为恢复的条目分配递增 id
    let seq = 0;
    const withIds = (results) => results.map((item) => ({ ...item, id: ++seq }));
    state.singleResults = withIds(single);
    state.folderResults = folders.map((folder) => ({ ...folder, results: withIds(folder.results) }));
    state.resultSeq = seq;

    // 读取刷新前的会话，恢复用户上次所在的视图/当前图片/缩略条滚动位置
    const prior = await loadSessionFromCache().catch(() => null);
    const priorActive = prior && typeof prior.activeFolderName === 'string' ? prior.activeFolderName : null;
    const priorIndex = Number(prior?.currentIndex) || 0;
    const priorRatio = Number(prior?.thumbScrollRatio) || 0;

    try {
      if (state.directoryHandle) {
        // 正在处理真实文件夹：state.files 是该目录的真实列表，保留不动，只还原视图与当前图片
        if (priorActive && getFolderEntry(priorActive)) {
          enterFolderView(priorActive);
        } else if (priorActive === '') {
          enterSingleView();
        } else if (state.directoryLabel && getFolderEntry(state.directoryLabel)) {
          enterFolderView(state.directoryLabel);
        } else {
          enterSingleView();
        }
        if (state.files.length && priorIndex < state.files.length) state.currentIndex = priorIndex;
        renderThumbStrip();
        await renderPreview();
      } else if (priorActive && getFolderEntry(priorActive)) {
        // 上次在看某个文件夹结果：用缓存副本重建该文件夹预览
        enterFolderView(priorActive);
        await restoreFolderPreviewFromCache(priorActive, priorIndex);
      } else if (priorActive === '') {
        // 上次在单图视图：恢复单图缓存预览
        await restoreSinglePreviewFromCache(priorIndex);
        enterSingleView();
      } else if (state.directoryLabel && getFolderEntry(state.directoryLabel)) {
        enterFolderView(state.directoryLabel);
      } else {
        await restoreSinglePreviewFromCache(0);
        enterSingleView();
      }
    } finally {
      // 还原缩略条滚动位置（不强制滚回当前选中项）
      sessionThumbRatio = priorRatio;
      applyThumbScrollRatio(priorRatio);
    }
    // 首帧渲染后可能被滚动定位再次改写，等布局稳定后重放一次并补存会话
    const settleApply = () => requestAnimationFrame(() => requestAnimationFrame(() => {
      applyThumbScrollRatio(priorRatio);
      sessionThumbRatio = priorRatio;
      saveSessionToCache();
    }));
    renderFolderChips();
    settleApply();
    saveSessionToCache();
    log('cacheScanned', { single: state.singleResults.length, folders: state.folderResults.length });
    // 缩略图异步补齐：先读缓存文件夹里已落盘的缩略图，缺失的再解码原图并落盘
    hydrateEntryThumbs();
    return true;
  } catch (error) {
    log('cacheScanFailed', { error: error.message || error });
    return false;
  }
}

/* ---------- 配置导出 / 导入（由 Hub 调用） ---------- */

const HUB_EXPORT_MESSAGE = 'captioner:export-data';
const HUB_IMPORT_MESSAGE = 'captioner:import-data';
// Hub 顶部公共栏：统一数据文件夹（缓存目录）
const HUB_SET_DATA_FOLDER = 'studio:set-data-folder';
const HUB_FRAME_READY = 'studio:frame-ready';
const PENDING_IMPORT_KEY = 'captioner-pending-import';

function buildExportData() {
  return {
    app: 'Image_Captioner',
    version: 1,
    exportedAt: new Date().toISOString(),
    config: getConfig(),
    presets: state.presets,
    singleResults: stripResultFiles(state.singleResults),
    folderResults: state.folderResults.map((entry) => ({
      name: entry.name,
      results: stripResultFiles(entry.results),
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
  state.presets.sort((a, b) => a.name.localeCompare(b.name, state.language === 'zh' ? 'zh-CN' : 'en'));
  persistPresets();
}

async function applyImportedConfigAndRefresh(data, mode) {
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
  // 等待会话写入完成，避免 Hub 立即刷新导致数据丢失
  await saveSessionToCache();
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
      // Hub 请求导出数据：回带 requestId 让 Hub 能配对到本次请求
      event.source?.postMessage(
        {
          type: `${HUB_EXPORT_MESSAGE}:reply`,
          requestId: event.data.requestId,
          payload: buildExportData(),
        },
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
    } else if (type === HUB_SET_DATA_FOLDER) {
      // Hub 顶部公共栏选定了统一数据文件夹
      if (event.data.handle) applyCacheFolder(event.data.handle).catch(() => {});
    }
  });

  // 通知 Hub 本页已就绪，索取当前统一数据文件夹（避免加载时序导致漏发）
  if (window.parent && window.parent !== window) {
    try {
      window.parent.postMessage({ type: HUB_FRAME_READY }, '*');
    } catch {
      // 忽略跨域同步失败
    }
  }
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
  // 确保按钮状态正确：单图模式下禁用"生成（文件夹）"按钮
  setTaskButtonsDisabled(state.isRunning);
}

function enterFolderView(name) {
  const entry = getFolderEntry(name);
  if (!entry) return;
  state.activeFolderName = name;
  state.results = entry.results;
  state.selectedResultId = null;
  renderResults();
  renderFolderChips();
  // 确保按钮状态正确：文件夹模式下启用"生成（文件夹）"按钮
  setTaskButtonsDisabled(state.isRunning);
}

async function toggleFolderView(name) {
  if (state.activeFolderName === name) {
    enterSingleView();
    // 切回单图视图时，若无真实文件列表则尝试从缓存恢复单图预览
    const restored = await restoreSinglePreviewFromCache();
    if (!restored && state.cacheFolderHandle) {
      await applyCacheFolder(state.cacheFolderHandle, true).catch(() => {});
    }
  } else {
    enterFolderView(name);
    // 点击文件夹结果标签时，自动把预览切回该文件夹目录
    const restored = await restoreFolderDirectory(name);
    if (!restored) {
      // 无真实目录句柄（如其它浏览器导入配置后）→ 用缓存中的原图副本恢复预览
      const fromCache = await restoreFolderPreviewFromCache(name);
      // 缓存条目也还没有文件句柄（本会话尚未扫描缓存目录）→ 先扫描再重建一次
      if (!fromCache && state.cacheFolderHandle) {
        await applyCacheFolder(state.cacheFolderHandle, true).catch(() => {});
      }
    }
  }
}

// 用缓存扫描得到的单图结果文件重建预览列表（跨浏览器导入配置后的恢复路径）
async function restoreSinglePreviewFromCache(index = 0) {
  const entries = state.singleResults.filter((item) => item.file);
  if (!entries.length) return false;
  const files = entries.map((item) => item.file);
  const unchanged = state.files.length === files.length
    && state.files.every((item, index) => item.sourceFile === files[index]);
  if (unchanged) {
    // 文件列表相同也确保缩略条可见（例如刚从文件夹模式切回单图视图）
    if (els.thumbStrip && els.thumbStrip.hidden) renderThumbStrip();
    return true;
  }
  state.singleFileMode = true;
  state.directoryHandle = null;
  state.directoryLabel = '';
  els.folderPathInput.value = '';
  state.singleFileSource = files[files.length - 1];
  // 复用扫描时已生成的缩略图（entry.thumbUrl），避免恢复后再整张解码一次；
  // _entry 让后台缩略图任务解码一次即可同时更新结果列表与预览条
  state.files = entries.map((entry) => {
    const v = createVirtualFileItem(entry.file);
    v._entry = entry;
    if (entry.thumbUrl) v.thumbUrl = entry.thumbUrl;
    return v;
  });
  state.currentIndex = Math.min(Math.max(0, Number(index) || 0), state.files.length - 1);
  syncStats();
  renderModeToggle();
  renderThumbStrip();
  await renderPreview();
  log('cachePreviewRestored', { count: files.length });
  return true;
}

// 用文件夹结果在缓存中的原图副本重建预览列表
async function restoreFolderPreviewFromCache(name, index = 0) {
  const entry = getFolderEntry(name);
  const entries = (entry?.results || []).filter((item) => item.file);
  if (!entries.length) return false;
  state.singleFileMode = false;
  state.directoryHandle = null;
  state.directoryLabel = entry.name;
  els.folderPathInput.value = entry.name;
  // 复用扫描时已生成的缩略图（entry.thumbUrl），避免恢复后再整张解码一次；
  // _entry 让后台缩略图任务解码一次即可同时更新结果列表与预览条
  state.files = entries.map((item) => {
    const v = createVirtualFileItem(item.file);
    v._entry = item;
    if (item.thumbUrl) v.thumbUrl = item.thumbUrl;
    return v;
  });
  state.currentIndex = Math.min(Math.max(0, Number(index) || 0), state.files.length - 1);
  syncStats();
  renderModeToggle();
  renderThumbStrip();
  await renderPreview();
  log('cachePreviewRestored', { count: entries.length });
  return true;
}

async function deleteFolderView(name) {
  if (!window.confirm(t('confirmDeleteFolderView', { name }))) return;
  // 删除缓存文件夹中的物理子目录（若存在）
  if (state.cacheFolderHandle) {
    try {
      const subDir = await state.cacheFolderHandle.getDirectoryHandle(name);
      await removeDirContents(subDir);
      await state.cacheFolderHandle.removeEntry(name);
    } catch {
      // 子目录不存在或删除失败则忽略
    }
  }
  const wasActive = state.activeFolderName === name;
  state.folderResults = state.folderResults.filter((entry) => entry.name !== name);
  if (wasActive) {
    enterSingleView();
  } else {
    renderFolderChips();
  }
  saveSessionToCache();
  syncRuntimeToSession();
  log('folderViewDeleted', { name });
}

/* ---------- 处理队列 ---------- */

function renderQueue() {
  if (!els.folderQueueList) return;
  els.folderQueueList.innerHTML = '';
  const count = state.folderQueue.length;
  if (els.queueCountText) els.queueCountText.textContent = t('queueCount', { count });

  if (!count) {
    const li = document.createElement('li');
    li.className = 'queue-empty';
    li.textContent = t('queueEmpty');
    els.folderQueueList.appendChild(li);
    return;
  }

  state.folderQueue.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'queue-item' + (index === state.activeQueueIndex ? ' active' : '');
    li.dataset.index = String(index);

    const drag = document.createElement('span');
    drag.className = 'queue-drag-handle';
    drag.textContent = '⠿';
    drag.title = '拖拽排序';
    li.appendChild(drag);

    const label = document.createElement('span');
    label.className = 'queue-item-label';
    label.textContent = item.label;
    li.appendChild(label);

    if (index === state.activeQueueIndex) {
      const status = document.createElement('span');
      status.className = 'queue-item-status';
      status.textContent = t('queueProcessing', { name: item.label });
      li.appendChild(status);
    }

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'queue-item-del';
    del.innerHTML = '&times;';
    del.title = '从队列移除';
    del.disabled = state.isRunning;
    del.addEventListener('click', (event) => {
      event.stopPropagation();
      removeFromQueue(index);
    });
    li.appendChild(del);

    if (!state.isRunning) {
      li.draggable = true;
      li.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/queue-index', String(index));
        event.dataTransfer.effectAllowed = 'move';
        li.classList.add('drag-source');
      });
      li.addEventListener('dragover', (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        li.classList.add('drag-over');
      });
      li.addEventListener('dragleave', () => li.classList.remove('drag-over'));
      li.addEventListener('drop', (event) => {
        event.preventDefault();
        li.classList.remove('drag-over');
        const from = Number(event.dataTransfer.getData('text/queue-index'));
        reorderQueue(from, index);
      });
      li.addEventListener('dragend', () => li.classList.remove('drag-source'));
    }

    els.folderQueueList.appendChild(li);
  });
}

function addToQueue() {
  if (state.isRunning) return;
  if (!state.directoryHandle || !state.directoryLabel) {
    log('queueNeedFolder');
    return;
  }
  if (state.folderQueue.some((item) => item.label === state.directoryLabel)) {
    log('queueExists', { name: state.directoryLabel });
    return;
  }
  state.folderQueue.push({ label: state.directoryLabel, handle: state.directoryHandle });
  renderQueue();
  saveSessionToCache();
  log('queueAdded', { name: state.directoryLabel });
}

function removeFromQueue(index) {
  if (state.isRunning) return;
  const removed = state.folderQueue.splice(index, 1)[0];
  if (index < state.activeQueueIndex) state.activeQueueIndex -= 1;
  renderQueue();
  saveSessionToCache();
  if (removed) log('queueRemoved', { name: removed.label });
}

function clearQueue() {
  if (state.isRunning) return;
  if (!state.folderQueue.length) return;
  state.folderQueue = [];
  state.activeQueueIndex = -1;
  renderQueue();
  saveSessionToCache();
  log('queueCleared');
}

function reorderQueue(from, to) {
  if (state.isRunning || from === to) return;
  if (from < 0 || from >= state.folderQueue.length || to < 0 || to >= state.folderQueue.length) return;
  const [moved] = state.folderQueue.splice(from, 1);
  const insertAt = from < to ? to - 1 : to;
  state.folderQueue.splice(insertAt, 0, moved);
  renderQueue();
  saveSessionToCache();
}

function renderFolderChips() {
  if (!els.folderChips) return;
  els.folderChips.innerHTML = '';
  const visible = state.folderResults.filter((entry) => entry.results.length > 0);
  const hasSingle = state.singleResults.length > 0;
  els.folderChips.hidden = !hasSingle && visible.length === 0;
  if (!hasSingle && !visible.length) return;

  // 单图缓存标签（独立可删除）
  if (hasSingle) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'folder-chip single-cache-chip' + (!state.activeFolderName ? ' active' : '');
    chip.title = t('singleCacheLabel');

    const label = document.createElement('span');
    label.className = 'folder-chip-name';
    label.textContent = t('singleCacheLabel');

    chip.appendChild(label);
    chip.addEventListener('click', async () => {
      enterSingleView();
      // 点击单图缓存标签时恢复单图缓存的图片预览（若当前预览还是其它文件夹的图片）
      const restored = await restoreSinglePreviewFromCache();
      // 结果条目还没有文件句柄（本会话尚未扫描缓存目录）→ 先扫描再重建一次预览条
      if (!restored && state.cacheFolderHandle) {
        await applyCacheFolder(state.cacheFolderHandle, true).catch(() => {});
      }
      setTaskButtonsDisabled(state.isRunning);
    });
    els.folderChips.appendChild(chip);
  }

  if (visible.length) {
    const label = document.createElement('span');
    label.className = 'folder-chips-label';
    label.textContent = t('folderResultsLabel');
    els.folderChips.appendChild(label);
  }

  for (const entry of visible) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'folder-chip' + (state.activeFolderName === entry.name ? ' active' : '');
    chip.title = entry.name;

    const label = document.createElement('span');
    label.className = 'folder-chip-name';
    label.textContent = entry.name;

    chip.appendChild(label);
    chip.addEventListener('click', () => toggleFolderView(entry.name));
    els.folderChips.appendChild(chip);
  }
}

async function deleteSingleCache() {
  if (!state.singleResults.length) return;
  if (!window.confirm(t('confirmDeleteSingleCache'))) return;
  // 删除缓存文件夹中的 captioner-cache 物理子目录（若存在）
  if (state.cacheFolderHandle) {
    try {
      const subDir = await state.cacheFolderHandle.getDirectoryHandle('captioner-cache');
      await removeDirContents(subDir);
      await state.cacheFolderHandle.removeEntry('captioner-cache');
    } catch {
      // 子目录不存在或删除失败则忽略
    }
  }
  state.singleResults = [];
  state.results = [];
  state.selectedResultId = null;
  state.resultSeq = 0;
  if (!state.activeFolderName) {
    renderResults();
    renderFolderChips();
  } else {
    renderFolderChips();
  }
  saveSessionToCache();
  syncRuntimeToSession();
  log('singleCacheDeleted');
}

async function restoreFolderDirectory(name) {
  const entry = getFolderEntry(name);
  if (!entry || !entry.directoryHandle) return false;
  let granted = false;
  try {
    granted = await ensureDirectoryPermission(entry.directoryHandle, 'readwrite');
  } catch {
    granted = false;
  }
  if (!granted) return false;
  state.singleFileMode = false;
  state.directoryHandle = entry.directoryHandle;
  state.directoryLabel = entry.name;
  els.folderPathInput.value = entry.name;
  state.files = await collectImageFiles(entry.directoryHandle, els.recursiveCheck.checked);
  state.currentIndex = state.files.length ? 0 : -1;
  resetCounters();
  syncStats();
  renderModeToggle();
  renderThumbStrip();
  await renderPreview();
  saveSessionToCache();
  return true;
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
  const cachedSession = await loadSessionFromCache();
  // 结果数据不再存浏览器：顺手清掉旧版本留在 IndexedDB 的结果缓存（可能非常大）
  dbClear('results');
  // 记住上次的滚动位置，供本会话内其它保存沿用（避免初始化中间态覆盖成 0）
  if (cachedSession && typeof cachedSession.thumbScrollRatio === 'number') {
    sessionThumbRatio = cachedSession.thumbScrollRatio;
  }

  state.singleResults = [];
  state.folderResults = [];
  state.resultSeq = 0;
  enterSingleView();

  if (!cachedSession) return;

  importTimes.clear();
  if (cachedSession.importTimes && typeof cachedSession.importTimes === 'object') {
    for (const [key, ts] of Object.entries(cachedSession.importTimes)) {
      if (typeof ts === 'number') importTimes.set(key, ts);
    }
  }

  state.cacheFolderHandle = cachedSession.cacheFolderHandle || null;
  updateCacheLocationText();

  if (cachedSession.mode === 'folder' && cachedSession.directoryHandle) {
    state.singleFileMode = false;
    state.pendingFolderHandle = cachedSession.directoryHandle;
    state.pendingFolderLabel = cachedSession.directoryLabel || '';
    state.pendingCurrentIndex = cachedSession.currentIndex || 0;
    await tryRestoreFolderSession();
    renderModeToggle();
  }

  // 恢复上次查看的文件夹结果视图（若仍存在）
  if (cachedSession.activeFolderName && getFolderEntry(cachedSession.activeFolderName)) {
    enterFolderView(cachedSession.activeFolderName);
  }

  // 恢复处理队列（文件夹句柄从 IndexedDB 会话恢复，处理时会重新授权）
  if (Array.isArray(cachedSession.folderQueue)) {
    state.folderQueue = cachedSession.folderQueue
      .filter((item) => item && item.label)
      .map((item) => ({ label: item.label, handle: item.handle || null }));
  }
  renderQueue();

  // 恢复完成后同步到 sessionStorage，供 Hub 导出时读取（即使刚打开页面未做任何操作也能导出）
  syncRuntimeToSession();
}

// 删除当前选中的缓存项：高亮文件夹 → 删文件夹；单图视图 → 删单图缓存
async function clearCache() {
  if (state.activeFolderName) {
    await deleteFolderView(state.activeFolderName);
    return;
  }
  if (state.singleResults.length) {
    await deleteSingleCache();
    return;
  }
  log('noResultToClear');
}

function buildResultItem(entry) {
  const item = document.createElement('div');
  item.className = 'result-item';
  item.dataset.resultId = String(entry.id);
  item.dataset.resultName = entry.name;

  const thumb = document.createElement('img');
  thumb.draggable = false; // 关闭原生图片拖拽
  if (entry.thumbUrl) {
    thumb.src = entry.thumbUrl;
    // 兜底：持久化的缩略图若损坏（刷新后偶发破图），退回占位并让后台重新生成
    thumb.addEventListener('error', () => {
      thumb.removeAttribute('src');
      thumb.classList.add('result-thumb-missing');
      entry.thumbUrl = '';
      fillUnreferencedResultThumbs();
    }, { once: true });
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

  // 右上角删除按钮
  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'result-delete-btn';
  deleteBtn.innerHTML = '&times;';
  deleteBtn.title = '删除此结果';
  deleteBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    deleteResultItem(entry.id);
  });

  fileNameRow.appendChild(fileName);
  fileNameRow.appendChild(deleteBtn);

  const caption = document.createElement('div');
  caption.className = 'result-caption';
  caption.textContent = entry.caption;

  // 右下角复制按钮
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

  const actionsRow = document.createElement('div');
  actionsRow.className = 'result-actions-row';
  actionsRow.appendChild(copyBtn);

  textColumn.appendChild(fileNameRow);
  textColumn.appendChild(caption);
  textColumn.appendChild(actionsRow);
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
  if (state.directoryLabel) {
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
  const entry = { id: state.resultSeq, name, caption, thumbUrl, thumbVer: THUMB_VERSION };
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
  saveSessionToCache();
  syncRuntimeToSession();
  return entry;
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
  renderModeToggle();
  updateThumbSortButtons();
  renderQueue();
  if (state.pendingFolderLabel && els.restoreFolderBtn && !els.restoreFolderBtn.hidden) {
    els.restoreFolderBtn.textContent = t('restoreFolderBtn', { name: state.pendingFolderLabel || '' });
  }

  els.toggleApiKeyBtn.textContent = els.apiKeyInput.type === 'password' ? t('show') : t('hide');

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

// 已保存配置的自定义下拉列表（原生 select 的弹出层跟随系统样式，无法与主题统一）
function renderPresetDropdownList() {
  const list = els.presetDropdown;
  if (!list) return;
  list.innerHTML = '';
  const entries = [{ name: '', label: t('presetSelectPlaceholder'), placeholder: true }]
    .concat(state.presets.map((preset) => ({ name: preset.name, label: preset.name })));
  for (const entry of entries) {
    const item = document.createElement('div');
    item.className = 'combobox-option';
    if (entry.placeholder) item.classList.add('preset-option-placeholder');
    if (state.activePresetName === entry.name) item.classList.add('active');
    item.textContent = entry.label;
    item.addEventListener('mousedown', (event) => {
      event.preventDefault(); // 先于外部点击关闭逻辑处理
      selectPresetOption(entry.name);
    });
    list.appendChild(item);
  }
}

function selectPresetOption(name) {
  state.activePresetName = name;
  closePresetDropdown();
  updatePresetSelectOptions();
  // 与原来原生下拉的 change 行为一致：选中即载入该配置
  if (name) loadSelectedPreset({ shouldLog: false });
}

function closePresetDropdown() {
  if (!els.presetDropdown || els.presetDropdown.hidden) return;
  els.presetDropdown.hidden = true;
  els.presetDropdownBtn?.setAttribute('aria-expanded', 'false');
}

function togglePresetDropdown() {
  if (!els.presetDropdown || !els.presetDropdownBtn) return;
  if (!els.presetDropdown.hidden) {
    closePresetDropdown();
    return;
  }
  renderPresetDropdownList();
  els.presetDropdown.hidden = false;
  els.presetDropdownBtn.setAttribute('aria-expanded', 'true');
}

function updatePresetSelectOptions() {
  const nextValue = state.presets.some((preset) => preset.name === state.activePresetName)
    ? state.activePresetName
    : '';
  state.activePresetName = nextValue;

  if (els.presetSelectText) {
    els.presetSelectText.textContent = nextValue || t('presetSelectPlaceholder');
  }
  if (els.presetNameInput) {
    els.presetNameInput.value = nextValue;
  }
  renderPresetDropdownList();
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
  const presetName = state.activePresetName;
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
  const presetName = state.activePresetName;
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
  const sourceName = state.activePresetName;
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

function isVideoName(name) {
  return VIDEO_EXTENSIONS.has(getExtension(name));
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
    const item = createVirtualFileItem(file);
    item.importedAt = Date.now();
    recordImportTime(file, item.importedAt);
    state.files = [item];
    state.currentIndex = 0;
  } else {
    const item = createVirtualFileItem(file);
    item.importedAt = Date.now();
    recordImportTime(file, item.importedAt);
    state.files.push(item);
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
    state.directoryHandle = directoryHandle;
    state.directoryLabel = directoryHandle.name || 'selected-folder';
    els.folderPathInput.value = state.directoryLabel;
    state.files = await collectImageFiles(directoryHandle, els.recursiveCheck.checked);
    state.currentIndex = state.files.length ? 0 : -1;
    resetCounters();
    syncStats();
    renderThumbStrip();
    renderPreview();
    // 更新按钮状态：文件夹模式下启用"生成（文件夹）"按钮
    setTaskButtonsDisabled(false);
    log('directoryLoaded', { name: state.directoryLabel, count: state.files.length });
    await saveSessionToCache();
  } catch (error) {
    if (error?.name !== 'AbortError') {
      log('chooseDirectoryFailed', { error: error.message || error });
    }
  }
}

// 手动切换操作模式（单图 / 文件夹）：单图模式保留文件夹上下文——
// 单图模式也能作用于当前文件夹里的文件（缓存仍写该文件夹同名子目录、合并其 txt）。
async function switchMode(mode) {
  if (state.isRunning) return;

  if (mode === 'single') {
    if (state.singleFileMode) return;
    state.singleFileMode = true;
    // 保留文件夹上下文（不清空 directoryHandle/Label），仅改变处理范围
    if (!state.files.length) {
      // 无任何内容时尝试恢复单图源/单图缓存，否则置空
      if (state.singleFileSource && SUPPORTED_EXTENSIONS.has(getExtension(state.singleFileSource.name || ''))) {
        state.files = [createVirtualFileItem(state.singleFileSource)];
        state.currentIndex = 0;
      } else if (state.singleResults.length && state.singleResults[state.singleResults.length - 1].file) {
        const cachedFile = state.singleResults[state.singleResults.length - 1].file;
        state.singleFileSource = cachedFile;
        state.files = [createVirtualFileItem(cachedFile)];
        state.currentIndex = 0;
      } else {
        state.files = [];
        state.currentIndex = -1;
      }
    }
    resetCounters();
    // 结果视图：有文件夹上下文且已有结果 → 该文件夹视图；否则单图视图
    if (state.directoryLabel && getFolderEntry(state.directoryLabel)) {
      enterFolderView(state.directoryLabel);
    } else {
      enterSingleView();
    }
    renderModeToggle();
    renderThumbStrip();
    await renderPreview();
    setTaskButtonsDisabled(state.isRunning);
    saveSessionToCache();
    log('modeSwitchedSingle');
  } else {
    if (!state.singleFileMode) return;
    state.singleFileMode = false;
    // 切到文件夹批量需要目录上下文；独立单图无法批处理，提示选择目录
    if (!state.directoryHandle) {
      state.files = [];
      state.currentIndex = -1;
      log('chooseDirectoryFirst');
    }
    resetCounters();
    if (state.directoryLabel && getFolderEntry(state.directoryLabel)) {
      enterFolderView(state.directoryLabel);
    } else {
      enterSingleView();
    }
    renderModeToggle();
    renderThumbStrip();
    await renderPreview();
    setTaskButtonsDisabled(state.isRunning);
    saveSessionToCache();
    log('modeSwitchedFolder');
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
  img.draggable = false; // 关闭原生图片拖拽，避免点击时轻微移动被当成拖动
  return img;
}

// 刷新排序按钮文案与箭头（语言切换时也要重跑，因此不依赖 data-i18n）
function updateThumbSortButtons() {
  if (!els.thumbSortNameBtn || !els.thumbSortTimeBtn) return;
  const arrowFor = (key) => (thumbSort.key === key ? (thumbSort.dir > 0 ? ' ↑' : ' ↓') : '');
  els.thumbSortNameBtn.textContent = t('thumbSortName') + arrowFor('name');
  els.thumbSortTimeBtn.textContent = t('thumbSortTime') + arrowFor('time');
  if (els.thumbSortImportBtn) els.thumbSortImportBtn.textContent = t('thumbSortImport') + arrowFor('imported');
  els.thumbSortNameBtn.classList.toggle('active', thumbSort.key === 'name');
  els.thumbSortTimeBtn.classList.toggle('active', thumbSort.key === 'time');
  if (els.thumbSortImportBtn) els.thumbSortImportBtn.classList.toggle('active', thumbSort.key === 'imported');
  els.thumbSortNameBtn.title = t('thumbSortNameHint');
  els.thumbSortTimeBtn.title = t('thumbSortTimeHint');
  if (els.thumbSortImportBtn) els.thumbSortImportBtn.title = t('thumbSortImportHint');
}

// 读取每个文件的修改时间并缓存到 item.mtime（浏览器不提供真正的「创建时间」）
async function ensureFileTimestamps() {
  for (const item of state.files) {
    if (typeof item.mtime === 'number') continue;
    try {
      const file = item.sourceFile || await item.handle.getFile();
      item.mtime = file.lastModified || 0;
    } catch {
      item.mtime = 0;
    }
  }
}

// 排序偏好持久化：刷新页面后继续沿用上次的名称 / 时间排序
const THUMB_SORT_STORAGE_KEY = 'image-captioner-thumb-sort';

function loadThumbSort() {
  try {
    const raw = localStorage.getItem(THUMB_SORT_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed && (parsed.key === 'name' || parsed.key === 'time' || parsed.key === 'imported')) {
      thumbSort.key = parsed.key;
      thumbSort.dir = parsed.dir === -1 ? -1 : 1;
    }
  } catch {
    // 读取失败时保持默认顺序
  }
}

function saveThumbSort() {
  try {
    localStorage.setItem(
      THUMB_SORT_STORAGE_KEY,
      JSON.stringify({ key: thumbSort.key, dir: thumbSort.dir }),
    );
  } catch {
    // 忽略存储不可用
  }
}

// 同步重排 state.files。缓存恢复的条目带 sourceFile，可同步读修改时间；
// 只有目录句柄类文件才需要异步读盘。返回是否已同步排好。
function sortThumbFilesSync() {
  if (!thumbSort.key || state.files.length < 2) return true;
  for (const item of state.files) {
    if (item.sourceFile && typeof item.mtime !== 'number') {
      item.mtime = item.sourceFile.lastModified || 0;
    }
  }
  const key = thumbSort.key;
  const factor = thumbSort.dir;
  const needMtime = key === 'time' && state.files.some((item) => typeof item.mtime !== 'number');
  if (needMtime) return false;
  const current = state.files[state.currentIndex];
  state.files.sort((a, b) => {
    let diff = 0;
    if (key === 'time') {
      diff = (a.mtime || 0) - (b.mtime || 0);
    } else if (key === 'imported') {
      diff = itemImportTime(a) - itemImportTime(b);
    } else {
      diff = String(a.name || '').localeCompare(String(b.name || ''), undefined, { numeric: true, sensitivity: 'base' });
    }
    // 同键值时按名称稳定排列，避免重开页面后同级条目来回换位
    if (!diff) {
      diff = String(a.name || '').localeCompare(String(b.name || ''), undefined, { numeric: true, sensitivity: 'base' }) * (key === 'name' ? factor : 1);
    }
    return diff * factor;
  });
  if (current) {
    const index = state.files.indexOf(current);
    state.currentIndex = index >= 0 ? index : Math.max(0, state.files.length - 1);
  }
  thumbSort.listRef = state.files;
  return true;
}

// 把记住的排序偏好应用到最新文件列表；时间排序缺修改时间时先异步补齐再重绘一次
function applyThumbSortToFiles() {
  if (!thumbSort.key || thumbSort.listRef === state.files) return;
  thumbSort.listRef = state.files;
  if (sortThumbFilesSync()) return;
  const filesRef = state.files;
  ensureFileTimestamps().then(() => {
    if (thumbSort.listRef !== filesRef) return; // 期间列表又换了，交由下一次渲染
    sortThumbFilesSync();
    if (thumbSort.listRef === state.files) renderThumbStrip();
  });
}

// 按名称 / 时间排序预览条（同一个按钮再次点击切换升序与降序）
function sortThumbStrip(key) {
  if (!state.files.length) return;
  if (thumbSort.key === key) {
    thumbSort.dir = -thumbSort.dir;
  } else {
    thumbSort.key = key;
    // 导入时间默认最新在上（降序），其余默认升序
    thumbSort.dir = key === 'imported' ? -1 : 1;
  }
  saveThumbSort();
  thumbSort.listRef = null; // 让 renderThumbStrip 在绘制前按新偏好重排
  updateThumbSortButtons();
  renderThumbStrip();
}

function renderThumbStrip() {
  // 文件列表被整体替换（换文件夹 / 重新导入 / 刷新后恢复）时，按记住的排序偏好重排
  if (thumbSort.key) applyThumbSortToFiles();
  state.thumbToken += 1;
  els.thumbStrip.innerHTML = '';
  els.thumbStrip.hidden = !state.files.length;
  if (els.thumbSortBar) els.thumbSortBar.hidden = !state.files.length;
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
    cell.addEventListener('pointerdown', (event) => {
      // 记录按下位置；selection 由容器级 pointerup 统一判定（避免 click 被取消/被重建吞掉）
      thumbPress = { index, x: event.clientX, y: event.clientY };
    });
    els.thumbStrip.appendChild(cell);
  });
  updateThumbStripCurrent();
  generateThumbnailsInBackground();
  // 重建后按记住的滚动位置定位；用户滚动时 captureThumbScrollRatio 会实时更新该值
  applyThumbScrollRatio(sessionThumbRatio);
}

// 浏览状态持久化：恢复上次视图 / 当前图片时，不要强制把缩略条滚回当前项，
// 而是按上次的滚动比例还原（渲染阶段不自动滚动，滚动只发生在用户点击缩略图时）
// sessionThumbRatio 只在用户滚动或恢复时更新；保存会话时用它，避免初始化阶段的
// 中间渲染把已保存的滚动位置覆盖成 0。
let sessionThumbRatio = 0;

function captureThumbScrollRatio() {
  const s = els.thumbStrip;
  if (!s || s.scrollHeight <= s.clientHeight) {
    sessionThumbRatio = 0;
    return 0;
  }
  sessionThumbRatio = Math.min(1, Math.max(0, s.scrollTop / (s.scrollHeight - s.clientHeight)));
  return sessionThumbRatio;
}

// 缩略图选择：用 pointerdown/up 判定（微小的按下移动不会让浏览器取消 click），
// 并容忍缩略条在按下与抬起之间被重建（记录按下的目标，抬起时仍执行）
let thumbPress = null;
let previewSeq = 0;

function activateThumbIndex(index) {
  if (index < 0 || index >= state.files.length) return;
  state.currentIndex = index;
  renderPreview();
  const cell = els.thumbStrip.querySelector(`.thumb-cell[data-index="${index}"]`);
  if (cell) cell.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}

function applyThumbScrollRatio(ratio) {
  const s = els.thumbStrip;
  if (!s || !ratio || s.scrollHeight <= s.clientHeight) return;
  s.scrollTop = ratio * (s.scrollHeight - s.clientHeight);
}

function updateThumbStripCurrent() {
  for (const cell of els.thumbStrip.querySelectorAll('.thumb-cell')) {
    const index = Number(cell.dataset.index);
    cell.classList.toggle('current', index === state.currentIndex);
  }
}

async function generateThumbnailsInBackground() {
  const token = state.thumbToken;
  for (let index = 0; index < state.files.length; index += 1) {
    if (token !== state.thumbToken) return; // 文件列表已更换，中止旧任务
    const item = state.files[index];
    if (item.thumbUrl !== undefined) continue;
    let pair = null;
    try {
      // 会话内复用已取到的 File：后台缩略图取过后，预览大图不必再 getFile 一次
      let file = item.file;
      if (!file) {
        file = await item.handle.getFile();
        item.file = file;
      }
      // 一次解码同时得到预览条缩略图与结果列表缩略图（后者更大，避免高分屏下发虚）
      pair = await makeThumbnailPair(file, THUMB_STRIP_DIMENSION, RESULT_THUMB_DIMENSION);
      item.thumbUrl = pair.small;
    } catch {
      item.thumbUrl = '';
    }
    if (token !== state.thumbToken) return;
    // 结果列表条目若还没有缩略图，用同一张位图产出的结果尺寸版本补上
    if (item._entry) {
      const entry = item._entry;
      if (!entry.thumbUrl && pair && pair.big) {
        entry.thumbUrl = pair.big;
        entry.thumbVer = THUMB_VERSION;
        refreshResultThumb(entry);
        persistThumbFile(entry, pair.big);
      }
    }
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

// 结果列表里 <img> 的缩略图更新（result 条目可能尚未渲染，因此找不到就跳过）
function refreshResultThumb(entry) {
  if (!els.resultList || !entry.thumbUrl) return;
  const node = els.resultList.querySelector(
    `.result-item[data-result-name="${CSS.escape(entry.name)}"]`,
  );
  if (!node) return;
  const img = node.querySelector('img');
  if (img && !img.src) {
    img.src = entry.thumbUrl;
    img.classList.remove('result-thumb-missing');
  }
}

// 扫描后没有被预览条引用的结果（例如只读文件夹视图的结果）在此后台补缩略图。
// 若已有一次填充在跑，只登记「待补」，等它跑完再接着补——直接返回会让这批条目永远空着。
async function fillUnreferencedResultThumbs() {
  if (state._thumbFillBusy) {
    state._thumbFillPending = true;
    return;
  }
  state._thumbFillBusy = true;
  try {
    for (let round = 0; round < 4; round += 1) {
      state._thumbFillPending = false;
      const targets = [];
      for (const entry of state.singleResults) {
        if (!entry.thumbUrl && entry.file) targets.push(entry);
      }
      for (const folder of state.folderResults) {
        for (const entry of folder.results) {
          if (!entry.thumbUrl && entry.file) targets.push(entry);
        }
      }
      // 已被预览条 item 引用（item._entry === entry）的由 generateThumbnailsInBackground 处理
      const referenced = new Set(
        state.files.filter((item) => item._entry).map((item) => item._entry),
      );
      let filled = 0;
      for (const entry of targets) {
        if (referenced.has(entry)) continue;
        if (!entry.file || entry.thumbUrl) continue;
        try {
          entry.thumbUrl = await makeThumbnail(entry.file, RESULT_THUMB_DIMENSION);
          entry.thumbVer = THUMB_VERSION;
          refreshResultThumb(entry);
          // 缩略图落盘到缓存文件夹，下次刷新直接读取（否则每次刷新都要重新解码整目录）
          persistThumbFile(entry, entry.thumbUrl);
          filled += 1;
        } catch {
          entry.thumbUrl = '';
        }
        await sleep(0);
      }
      if (!state._thumbFillPending) break;
    }
  } finally {
    state._thumbFillBusy = false;
  }
}

async function renderPreview() {
  if (state.currentIndex < 0 || state.currentIndex >= state.files.length) {
    if (state.currentObjectUrl) {
      URL.revokeObjectURL(state.currentObjectUrl);
      state.currentObjectUrl = '';
    }
    state.currentPreviewItem = null;
    els.previewImage.removeAttribute('src');
    els.previewImage.hidden = true;
    els.previewVideo.removeAttribute('src');
    els.previewVideo.hidden = true;
    els.previewPlaceholder.hidden = false;
    els.thumbStrip.hidden = true;
    els.currentFileText.textContent = t('currentFileNone');
    els.progressText.textContent = '0 / 0';
    syncStats();
    return;
  }
  // 快速连点/切换时，只让最后一次渲染生效（前面的异步读取结果作废）
  const seq = ++previewSeq;
  const item = state.files[state.currentIndex];
  // 当前预览的就是这一条：不必重复读盘/解码（再次点击当前缩略图、刷新中间态时）
  if (state.currentPreviewItem === item && state.currentObjectUrl) {
    els.previewPlaceholder.hidden = true;
    els.thumbStrip.hidden = false;
    els.currentFileText.textContent = item.relativePath;
    syncStats();
    updateThumbStripCurrent();
    return;
  }
  if (state.currentObjectUrl) {
    URL.revokeObjectURL(state.currentObjectUrl);
    state.currentObjectUrl = '';
  }
  // 会话内复用已取过的 File（后台缩略图或上次预览已读过就不再 getFile）
  let file = item.file;
  if (!file) {
    file = await item.handle.getFile();
    if (seq !== previewSeq) return; // 已有更新的选择
    item.file = file;
  }
  state.currentPreviewItem = item;
  state.currentObjectUrl = URL.createObjectURL(file);
  els.previewPlaceholder.hidden = true;
  els.thumbStrip.hidden = false;
  els.currentFileText.textContent = item.relativePath;
  syncStats();
  updateThumbStripCurrent();

  const isVideo = isVideoName(item.name);
  els.previewImage.hidden = isVideo;
  els.previewVideo.hidden = !isVideo;
  els.previewImage.draggable = false;
  els.previewVideo.draggable = false;
  if (isVideo) {
    els.previewVideo.src = state.currentObjectUrl;
    // 生成首帧海报，确保未播放时也能看到画面（解码失败则忽略）
    if (!els.previewVideo.poster) {
      makeVideoThumbnail(file, 480)
        .then((poster) => { els.previewVideo.poster = poster; })
        .catch(() => {});
    }
  } else {
    els.previewImage.src = state.currentObjectUrl;
  }
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

// 把 ArrayBuffer 转成 base64（分块拼接，避免大视频一次性展开导致堆栈溢出）
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = '';
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

// 视频走原生 video_url 时，按扩展名推断 MIME 并手动构造 data URI，
// 规避部分文件 File.type 为空（得到 application/octet-stream）导致供应商不识别的问题
async function videoFileToDataUrl(file) {
  const mimeByExt = {
    '.mp4': 'video/mp4',
    '.m4v': 'video/mp4',
    '.mov': 'video/quicktime',
    '.webm': 'video/webm',
  };
  const mime = mimeByExt[getExtension(file.name)] || file.type || 'video/mp4';
  const buffer = await file.arrayBuffer();
  return `data:${mime};base64,${arrayBufferToBase64(buffer)}`;
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

async function makeVideoThumbnail(file, maxDimension = 160) {
  const objectUrl = URL.createObjectURL(file);
  try {
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.src = objectUrl;
    await new Promise((resolve, reject) => {
      video.onloadeddata = resolve;
      video.onerror = () => reject(new Error(t('videoDecodeFailed')));
    });
    // 跳到 0.1s（或时长的 10%），避免取到常见的黑首帧
    const target = video.duration ? Math.min(0.1, video.duration * 0.1) : 0;
    if (target > 0) {
      await new Promise((resolve) => {
        video.onseeked = () => resolve();
        video.currentTime = target;
      });
    }
    const ratio = Math.min(1, maxDimension / video.videoWidth, maxDimension / video.videoHeight);
    const width = Math.max(1, Math.round(video.videoWidth * ratio));
    const height = Math.max(1, Math.round(video.videoHeight * ratio));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(video, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', 0.8);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

// 把已解码的源（ImageBitmap 或 HTMLImageElement）缩到最长边 maxDimension 并编码成 JPEG
function drawThumbFromSource(source, maxDimension) {
  const ratio = Math.min(1, maxDimension / source.width, maxDimension / source.height);
  const width = Math.max(1, Math.round(source.width * ratio));
  const height = Math.max(1, Math.round(source.height * ratio));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d').drawImage(source, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', 0.8);
}

// 优先用 createImageBitmap 解码（解码在浏览器解码线程，主线程只做一次小尺寸绘制），
// 不支持或失败时退回「读成 base64 → <img>」的兼容路径
async function decodeImageSource(file) {
  if (typeof createImageBitmap === 'function') {
    try {
      return { source: await createImageBitmap(file), owned: true };
    } catch {
      // 该格式不支持 createImageBitmap（或解码失败）时走兼容路径
    }
  }
  return { source: await loadImage(await fileToDataUrl(file)), owned: false };
}

function releaseImageSource({ source, owned }) {
  if (owned && source && typeof source.close === 'function') source.close();
}

async function makeThumbnail(file, maxDimension = THUMB_STRIP_DIMENSION) {
  if (isVideoName(file.name)) {
    return makeVideoThumbnail(file, maxDimension);
  }
  const decoded = await decodeImageSource(file);
  try {
    return drawThumbFromSource(decoded.source, maxDimension);
  } finally {
    releaseImageSource(decoded);
  }
}

// 一次解码同时产出预览条（小）与结果列表（大）两种缩略图，避免同一张图解码两次
async function makeThumbnailPair(file, smallDim, bigDim) {
  if (isVideoName(file.name)) {
    const small = await makeVideoThumbnail(file, smallDim);
    return { small, big: smallDim === bigDim ? small : await makeVideoThumbnail(file, bigDim) };
  }
  const decoded = await decodeImageSource(file);
  try {
    const small = drawThumbFromSource(decoded.source, smallDim);
    const big = smallDim === bigDim ? small : drawThumbFromSource(decoded.source, bigDim);
    return { small, big };
  } finally {
    releaseImageSource(decoded);
  }
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
  const messages = [];

  if (config.systemPrompt) {
    messages.push({ role: 'system', content: config.systemPrompt });
  }

  let mediaPart;
  if (isVideoName(file.name)) {
    if (file.size > MAX_VIDEO_SIZE_BYTES) {
      throw new Error(t('videoTooLarge'));
    }
    const videoDataUrl = await videoFileToDataUrl(file);
    mediaPart = { type: 'video_url', video_url: { url: videoDataUrl } };
  } else {
    const imageDataUrl = await imageFileToPayloadUrl(file);
    mediaPart = { type: 'image_url', image_url: { url: imageDataUrl } };
  }

  messages.push({
    role: 'user',
    content: [
      mediaPart,
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
  if (!state.directoryHandle) return '';
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

// 让模式切换器（单图/文件夹）高亮当前操作模式
function renderModeToggle() {
  if (!els.modeSingleBtn || !els.modeFolderBtn) return;
  const single = state.singleFileMode;
  els.modeSingleBtn.classList.toggle('active', single);
  els.modeFolderBtn.classList.toggle('active', !single);
}

function setTaskButtonsDisabled(disabled) {
  renderModeToggle();
  els.generateBtn.disabled = disabled;
  els.prependBtn.disabled = disabled;
  els.appendBtn.disabled = disabled;
  els.stopBtn.disabled = !disabled;
}

// 单图模式：为多次生成分配唯一结果名（hello.jpg → hello.jpg, hello_2.jpg, hello_3.jpg …）
function nextSingleResultName(baseName) {
  const existing = state.singleResults.map((item) => item.name);
  if (!existing.includes(baseName)) return baseName;
  const extIndex = baseName.lastIndexOf('.');
  const stem = extIndex > 0 ? baseName.slice(0, extIndex) : baseName;
  const ext = extIndex > 0 ? baseName.slice(extIndex) : '';
  let n = 2;
  while (existing.includes(`${stem}_${n}${ext}`)) n += 1;
  return `${stem}_${n}${ext}`;
}

// 单图合并：前置/追加应合并进该图原有的同名结果（原来的 txt），而不是编号副本
// 取 name === baseName 的那条结果的 caption 作为基准；尚无则该图没有旧话，返回空
function getSingleBaseCaption(baseName) {
  const base = state.singleResults.find((item) => item.name === baseName);
  return base?.caption || '';
}

// 独立单图：从 captioner-cache 读该图同名 txt 的真实内容，作为前置/追加合并基准。
// 未设置缓存文件夹或该 txt 不存在时返回空（再由调用方回退到内存同名结果）。
async function readSingleCacheCaption(baseName) {
  if (!state.cacheFolderHandle) return '';
  try {
    const cacheRoot = await state.cacheFolderHandle.getDirectoryHandle('captioner-cache', { create: false });
    const parts = String(baseName).split('/');
    const fileName = parts.pop();
    const stem = fileName.replace(/\.[^.]+$/, '');
    let dir = cacheRoot;
    for (const part of parts) {
      dir = await dir.getDirectoryHandle(part, { create: false });
    }
    const txtHandle = await dir.getFileHandle(`${stem}.txt`);
    const file = await txtHandle.getFile();
    return (await file.text()).trim();
  } catch {
    return '';
  }
}

async function processItem(item, config, combineMode, progressSet, singleExistingCaption = '') {
  const baseName = item.relativePath;
  // 文件夹上下文（无论单图/文件夹模式）：始终用原图同名文件名，缓存/写回都在该文件夹同名子目录；
  // 独立单图（无文件夹）：普通「生成」递增序号（多生成挑一条），前置/追加则合并进原图同名结果
  const resultName = state.directoryHandle
    ? baseName
    : (combineMode !== 'none' ? baseName : nextSingleResultName(baseName));
  const file = await item.handle.getFile();
  log('processingStarted', { name: resultName });
  if (isStopRequested()) return;
  const newCaption = await requestCaption(config, item, file);
  let finalCaption = newCaption;
  if (combineMode !== 'none') {
    if (state.directoryHandle) {
      // 文件夹上下文：与这张图自己的 txt 合并
      const existing = await readExistingCaption(item);
      if (existing) {
        finalCaption = combineMode === 'prepend'
          ? `${newCaption}, ${existing}`
          : `${existing}, ${newCaption}`;
      }
    } else if (singleExistingCaption) {
      // 独立单图：与这张图原有的同名结果合并
      finalCaption = combineMode === 'prepend'
        ? `${newCaption}, ${singleExistingCaption}`
        : `${singleExistingCaption}, ${newCaption}`;
    }
  }
  if (state.directoryHandle) {
    await writeCaptionFile(item, finalCaption);
  }
  let thumbUrl = '';
  try {
    thumbUrl = await makeThumbnail(file, RESULT_THUMB_DIMENSION);
  } catch {
    thumbUrl = '';
  }
  if (isStopRequested()) return;
  const entry = addResultEntry(resultName, finalCaption, thumbUrl);
  const targetDir = await writeResultToCacheFolder(item, file, finalCaption, resultName);
  // 新生成的缩略图随结果一起落盘，刷新后从缓存文件夹直接读取，无需重新解码
  if (entry && targetDir) {
    const base = String(resultName).split('/').pop().replace(/\.[^.]+$/, '');
    entry.dir = targetDir;
    entry.thumbName = `${base}${THUMB_FILE_SUFFIX}`;
    persistThumbFile(entry, thumbUrl);
  }
  if (state.directoryHandle && progressSet) {
    progressSet.add(baseName);
    saveProgressRecord(progressSet);
  }
  state.stats.processed += 1;
  syncStats();
  log('processingFinished', { name: resultName });
}

// 处理单个文件夹的一批文件（内部包含跳过/进度/合并/写回逻辑），返回该文件夹的统计
async function processFolderBatch(handle, label, combineMode, config) {
  state.directoryHandle = handle;
  state.directoryLabel = label;
  state.singleFileMode = false;
  els.folderPathInput.value = label;

  const hasPermission = await ensureDirectoryPermission(handle, 'readwrite');
  if (!hasPermission) {
    log('directoryPermissionDenied');
    return { processed: 0, skipped: 0, failed: 0 };
  }

  state.files = await collectImageFiles(handle, els.recursiveCheck.checked);
  state.currentIndex = state.files.length ? 0 : -1;
  if (!state.files.length) {
    log('directoryLoaded', { name: label, count: 0 });
    return { processed: 0, skipped: 0, failed: 0 };
  }
  if (isStopRequested()) return { processed: 0, skipped: 0, failed: 0 };

  resetCounters();
  // 文件夹处理结果单独保存到对应文件夹名下（跨多次处理时结果累积显示）
  let entry = getFolderEntry(label);
  if (!entry) {
    entry = { name: label, results: [] };
    state.folderResults.push(entry);
  }
  entry.directoryHandle = handle;
  state.activeFolderName = label;
  state.results = entry.results;
  state.selectedResultId = null;
  renderResults();
  renderFolderChips();
  saveSessionToCache();

  // 进度记录仅对普通「生成」用于中断续跑；前置/追加总是重新处理全部图片
  const progressSet = combineMode === 'none' ? loadProgressRecord() : new Set();
  if (progressSet.size) {
    log('progressDetected', { count: progressSet.size });
  }

  const indices = state.files.map((_, i) => i);
  for (const index of indices) {
    if (state.stopRequested) break;

    state.currentIndex = index;
    await renderPreview();
    const item = state.files[index];
    const progressName = item.relativePath;

    // 跳过逻辑只对普通「生成」(none) 生效；前置/追加要重新处理并合并已有 txt，因此不跳
    if (combineMode === 'none') {
      const hasTxt = await hasExistingCaption(item);
      if (config.skipExisting && hasTxt) {
        progressSet.add(progressName);
        saveProgressRecord(progressSet);
        state.stats.skipped += 1;
        syncStats();
        log('skippedByExisting', { name: progressName });
        continue;
      }
      if (hasTxt && progressSet.has(progressName)) {
        state.stats.skipped += 1;
        syncStats();
        log('skippedByProgress', { name: progressName });
        continue;
      }
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
  renderThumbStrip();
  await renderPreview();
  return { processed: state.stats.processed, skipped: state.stats.skipped, failed: state.stats.failed };
}

async function processAll(combineMode = 'none') {
  if (state.isRunning) return;

  // 处理目标：队列非空则按队列顺序逐个文件夹处理；否则仅当前文件夹（保留原有单文件夹行为）
  const hasQueue = state.folderQueue.length > 0;
  const targets = hasQueue
    ? state.folderQueue.map((item, i) => ({ index: i, handle: item.handle, label: item.label }))
    : [{ index: -1, handle: state.directoryHandle, label: state.directoryLabel }];

  if (!hasQueue && !state.directoryHandle) {
    log('chooseDirectoryFirst');
    return;
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
  if (hasQueue) state.activeQueueIndex = targets[0].index;
  renderQueue();

  let totalProcessed = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  try {
    await detectModelIfNeeded(config);
    for (const target of targets) {
      if (state.stopRequested) break;
      state.activeQueueIndex = target.index;
      if (hasQueue) {
        log('queueProcessing', { name: target.label });
        renderQueue();
      }
      const stats = await processFolderBatch(target.handle, target.label, combineMode, config);
      totalProcessed += stats.processed;
      totalSkipped += stats.skipped;
      totalFailed += stats.failed;
      if (state.stopRequested) break;
    }

    if (state.stopRequested) {
      log('taskStopped');
    } else if (totalFailed > 0) {
      log('taskCompletedWithFailure', { count: totalFailed });
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
    state.activeQueueIndex = -1;
    renderQueue();
    setTaskButtonsDisabled(false);
    setRuntimeStatus('runtimeIdle');
  }
}

// 单图模式（作用于当前选中图）：无论该图来自文件夹还是独立拖入，都只处理当前这张。
// 有文件夹上下文时，结果写入该文件夹同名子目录、并与该图自己的 txt 合并/写回；
// 独立单图则写入 captioner-cache，前置/追加与它原有的同名结果合并。
async function processSingleImage(combineMode = 'none') {
  if (state.isRunning) return;

  const hasCurrent = state.currentIndex >= 0 && state.currentIndex < state.files.length;
  if (!hasCurrent) {
    log(state.singleFileMode ? 'loadSingleFirst' : 'chooseDirectoryFirst');
    return;
  }

  if (state.directoryHandle) {
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

  // 结果视图：有文件夹上下文 → 显示该文件夹结果；独立单图 → 单图视图
  if (state.directoryLabel) {
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
      saveSessionToCache();
  } else {
    enterSingleView();
  }

  const targetItem = state.files[state.currentIndex];
  const itemName = targetItem.relativePath;
  try {
    await detectModelIfNeeded(config);
    // 独立单图的前置/追加：合并基准优先取 captioner-cache 里该图的真实 txt，其次内存同名结果；
    // 文件夹上下文由 processItem 读取该图自己的 txt。
    const existingCaption = combineMode !== 'none' && !state.directoryHandle
      ? (await readSingleCacheCaption(itemName)) || getSingleBaseCaption(itemName)
      : '';
    await processItem(targetItem, config, combineMode, null, existingCaption);
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

// 生成按钮入口：单图模式→处理当前图；文件夹模式→全量批处理
function handleGenerate() {
  if (state.singleFileMode) {
    processSingleImage('none');
  } else {
    processAll('none');
  }
}

function handlePrepend() {
  if (state.singleFileMode) {
    processSingleImage('prepend');
  } else {
    processAll('prepend');
  }
}

function handleAppend() {
  if (state.singleFileMode) {
    processSingleImage('append');
  } else {
    processAll('append');
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

function deleteResultItem(resultId) {
  const index = state.results.findIndex((entry) => entry.id === resultId);
  if (index === -1) return;

  const entry = state.results[index];
  state.results.splice(index, 1);

  if (state.selectedResultId === resultId) {
    state.selectedResultId = null;
  }

  // 同步更新 folderResults 中的对应条目
  if (state.activeFolderName) {
    const folderEntry = state.folderResults.find((f) => f.name === state.activeFolderName);
    if (folderEntry) {
      folderEntry.results = state.results;
      if (!state.results.length) {
        // 如果该文件夹结果为空，移除该文件夹条目
        state.folderResults = state.folderResults.filter((f) => f.name !== state.activeFolderName);
        state.activeFolderName = null;
        enterSingleView();
      }
    }
  } else {
    state.singleResults = state.results;
  }

  renderResults();
  renderFolderChips();
  saveSessionToCache();
  log('resultDeleted', { name: entry.name });
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
    renderResults();
  }
  log('resultsCleared');
}

function clearPrompts() {
  els.systemPromptInput.value = '';
  els.userPromptInput.value = '';
}

function fillDefaultCaptionPrompts() {
  els.systemPromptInput.value = DEFAULT_SYSTEM_PROMPT;
  els.userPromptInput.value = DEFAULT_USER_PROMPT;
}

function fillDefaultTagPrompts() {
  els.systemPromptInput.value = DEFAULT_SYSTEM_PROMPT_TAGS;
  els.userPromptInput.value = DEFAULT_USER_PROMPT_TAGS;
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
  els.presetDropdownBtn.addEventListener('click', togglePresetDropdown);
  document.addEventListener('mousedown', (event) => {
    if (!els.presetDropdown || els.presetDropdown.hidden) return;
    if (els.presetDropdownBtn?.contains(event.target)) return;
    if (els.presetDropdown.contains(event.target)) return;
    closePresetDropdown();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closePresetDropdown();
  });
  els.chooseFolderBtn.addEventListener('click', chooseFolder);
  els.addToQueueBtn.addEventListener('click', addToQueue);
  els.clearQueueBtn.addEventListener('click', clearQueue);
  els.modeSingleBtn.addEventListener('click', () => switchMode('single'));
  els.modeFolderBtn.addEventListener('click', () => switchMode('folder'));
  els.generateBtn.addEventListener('click', handleGenerate);
  els.prependBtn.addEventListener('click', handlePrepend);
  els.appendBtn.addEventListener('click', handleAppend);
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
  els.fillDefaultCaptionBtn.addEventListener('click', fillDefaultCaptionPrompts);
  els.fillDefaultTagBtn.addEventListener('click', fillDefaultTagPrompts);
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

  // 嵌入 Hub 时「选择缓存文件夹」入口在顶部公共栏；「删除选中」要先在本面板高亮目标，故留在原位
  const embeddedInHub = window.parent && window.parent !== window;
  els.chooseCacheFolderBtn.hidden = embeddedInHub;

  els.thumbSortNameBtn.addEventListener('click', () => { sortThumbStrip('name'); });
  els.thumbSortTimeBtn.addEventListener('click', () => { sortThumbStrip('time'); });
  els.thumbSortImportBtn?.addEventListener('click', () => { sortThumbStrip('imported'); });
  updateThumbSortButtons();

  // 缩略条滚动时记住位置（比例），滚停后写入会话，供刷新后恢复浏览位置
  let thumbScrollTimer = null;
  els.thumbStrip.addEventListener('scroll', () => {
    captureThumbScrollRatio();
    if (thumbScrollTimer) window.clearTimeout(thumbScrollTimer);
    thumbScrollTimer = window.setTimeout(() => saveSessionToCache(), 350);
  });

  // 缩略图选择（容器级委托）：抬起且移动很小时触发；即使列表在按下后重建也不会丢
  els.thumbStrip.addEventListener('pointerdown', (event) => {
    // 按在单元格以外的区域（缝隙/滚动条）时清空，避免误选上一次的按下
    if (!event.target.closest || !event.target.closest('.thumb-cell')) thumbPress = null;
  });
  els.thumbStrip.addEventListener('pointerup', (event) => {
    if (!thumbPress) return;
    const dx = event.clientX - thumbPress.x;
    const dy = event.clientY - thumbPress.y;
    if (dx * dx + dy * dy > 100) {
      // 移动超过阈值，视为拖拽/滑动，不做选择
      thumbPress = null;
      return;
    }
    activateThumbIndex(thumbPress.index);
    thumbPress = null;
  });
  els.thumbStrip.addEventListener('pointercancel', () => {
    thumbPress = null;
  });

  // 兜底：任何以 <img>/<video> 为源的原生拖拽一律取消（防止点击带出图片幽灵拖拽）
  document.addEventListener('dragstart', (event) => {
    const t = event.target;
    if (t && (t.tagName === 'IMG' || t.tagName === 'VIDEO')) {
      event.preventDefault();
    }
  });
}

async function init() {
  loadPresets();
  loadConfig();
  loadThumbSort();
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
  // 会话恢复出来的缓存文件夹也要扫描一次：否则结果条目没有文件句柄（file 不持久化），
  // 点击「单图缓存」标签无法重建预览条，只能靠刷新时 Hub 重播目录才恢复。
  if (state.cacheFolderHandle) applyCacheFolder(state.cacheFolderHandle).catch(() => {});
  setupHubBridge();
}

init();
