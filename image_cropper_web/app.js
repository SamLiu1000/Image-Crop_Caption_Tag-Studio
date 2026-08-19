const MIN_BOX_SIZE = 24;
const EDGE_TOL = 10;
const HANDLE_SIZE = 6;
const LANGUAGE_KEY = 'image-cropper-web-language';
const LANGUAGE_SYNC_MESSAGE = 'web-tools-hub:set-language';
const THEME_SYNC_MESSAGE = 'web-tools-hub:set-theme';
const DEFAULT_SIZES = [
  [512, 512],
  [768, 512],
  [512, 768],
  [768, 768],
  [1024, 1024],
  [768, 1024],
  [896, 1216],
  [1152, 1636],
];
const DB_NAME = 'image-cropper-web';
const DB_STORE = 'handles';
const SAVE_DIR_KEY = 'save-directory';

let COLORS = readColors();

function readColors() {
  const style = getComputedStyle(document.documentElement);
  return {
    canvas: style.getPropertyValue('--canvas').trim() || '#f9fbff',
    mask: 'rgba(0, 0, 0, 0.42)',
    accent: style.getPropertyValue('--accent').trim() || '#3b82f6',
    success: style.getPropertyValue('--success').trim() || '#16a34a',
    textDim: style.getPropertyValue('--text-dim').trim() || '#6b7280',
    grid: 'rgba(255, 255, 255, 0.7)',
  };
}

const I18N = {
  zh: {
    pageTitle: '图片裁切工具 Web 版',
    langToggle: 'EN',
    langToggleLabel: '切换到英文',
    openImageBtn: '打开图片',
    importFolderBtn: '导入文件夹',
    chooseSaveDirBtn: '设置保存位置',
    prevBtn: '上一张',
    nextBtn: '下一张',
    saveBtn: '裁切并保存',
    statusReady: '请选择图片或导入图片文件夹',
    navEmpty: '未加载图片',
    sizeTitle: '尺寸',
    widthLabel: '宽',
    heightLabel: '高',
    addPresetLabel: '添加预设',
    swapSizeBtn: '交换宽高',
    actualSizeLabel: '按定义尺寸输出',
    sizeHint: '未勾选时按比例裁切；勾选后输入尺寸会直接控制实际输出尺寸。',
    fixedOutputSizeLabel: '固定导出尺寸，仅缩放取景范围',
    presetTitle: '常用尺寸',
    optionsTitle: '选项',
    freeTransformLabel: '图片自由变换',
    constrainLabel: '裁切框限制在图片范围内',
    fillBgLabel: '裁切框超出图片时填充背景',
    fillTransparentLabel: '使用透明背景',
    fillColorLabel: '背景颜色',
    optionsHint: '自由变换：裁切框固定为输出尺寸，拖动/滚轮操作图片，Shift + 滚轮旋转图片。勾选背景填充后，裁切框超出原图范围的区域可填充为指定颜色或透明。',
    saveLocationTitle: '保存位置',
    saveLocationUnset: '未设置，默认通过浏览器下载',
    saveLocationUnsupported: '当前浏览器不支持目录保存，保存时将回退为浏览器下载。',
    saveLocationSet: '已设置保存位置：{name}',
    cropInfoTitle: '裁切信息',
    cropInfoWaiting: '等待加载图片',
    tipsTitle: '操作提示',
    tipsText: '裁切框模式：\n• 拖动框内移动裁切框\n• 拖动边或角调整裁切框\n• Ctrl + 拖动可锁定比例\n• 滚轮缩放裁切框\n• 拖动底部缩放条调整预览缩放（双击恢复 100%）\n• 图片放大超出画布时，拖动遮罩区域平移取景\n\n快捷键：\n• WASD 切换上一张 / 下一张\n• 方向键微调裁切框位置\n• R 交换宽高\n• Q 勾选固定导出尺寸\n• E 保存\n\n参考线：\n• 点击"竖边界 / 横边界"添加参考线\n• 拖动参考线调整位置\n• 右键点击参考线可删除\n• 裁切框不会越过参考线\n• 参考线会保留到切换后的图片\n\n图片自由变换模式：\n• 裁切框可自由拖动、拉伸，与普通模式一致\n• 框外拖动图片移动取景\n• Shift + 滚轮旋转图片\n• 拖动底部缩放条缩放图片（双击恢复 100%）\n• 导出结果与框内内容保持一致',
    zoomInLabel: '放大',
    zoomResetLabel: '重置缩放',
    zoomOutLabel: '缩小',
    deletedPreset: '已删除预设：{size}',
    waitingForImage: '等待加载图片',
    infoModeFree: '模式：自由变换',
    infoModeCrop: '模式：裁切框',
    infoOutputSize: '输出尺寸：{size} px',
    infoInputSize: '输入尺寸：{size}',
    infoSourceSample: '源采样：{size} px',
    infoAspect: '比例：{size}',
    infoCurrentOutput: '当前输出：{size} px',
    infoScale: '缩放：{value} x',
    infoRotation: '旋转：{value} 度',
    infoOverflowFill: '超出区域填充：{value}',
    infoExportMatchesFrame: '导出结果与裁切框视图一致',
    infoExportResized: '导出结果会缩放到目标尺寸',
    infoDragCropBox: '拖动裁切框以定义输出区域',
    fillTransparent: '透明',
    fillDisabled: '关闭',
    canvasHint: '打开图片或导入图片文件夹',
    canvasLabelFree: '自由输出：{size} px',
    canvasLabelActual: '实际输出：{size} px',
    canvasLabelCrop: '裁切：{size} px',
    loadedImage: '已加载：{name} ({size})',
    previewZoom: '预览缩放：{value}%',
    indexedDbBlobFailed: 'Canvas toBlob failed',
    indexedDbOpenFailed: 'IndexedDB open failed',
    indexedDbWriteFailed: 'IndexedDB write failed',
    indexedDbWriteAborted: 'IndexedDB write aborted',
    indexedDbReadFailed: 'IndexedDB read failed',
    indexedDbDeleteFailed: 'IndexedDB delete failed',
    indexedDbDeleteAborted: 'IndexedDB delete aborted',
    saveLocationRestored: '已恢复保存位置：{name}',
    browserNoPickerFallback: '浏览器不支持目录选择器；将使用下载作为回退方式。',
    directoryPermissionDenied: '目录权限被拒绝',
    saveLocationSetStatus: '已设置保存位置：{name}',
    saveLocationSetFailed: '设置保存位置失败',
    invalidCropArea: '无效的裁切区域',
    savedToFolder: '已保存到文件夹：{name}',
    downloadedFile: '已下载：{name}',
    directorySaveFallback: '目录保存失败，已改为下载：{name}',
    loadedFolder: '已加载文件夹：{name}（{size}）',
    noImagesInFolder: '所选文件夹中未找到图片',
    enterValidSize: '请输入有效的宽度和高度',
    addedPreset: '已添加预设：{size}',
    modeSwitched: '模式已切换',
    previewZoomReset: '预览缩放已重置为 100%',
    doodleModeBtn: '涂鸦',
    doodleTitle: '涂鸦',
    brushSizeLabel: '画笔大小',
    brushOpacityLabel: '画笔透明度（仅用于预览）',
    customColorLabel: '自定义',
    undoStrokeBtn: '撤销上一笔',
    doodleActive: '涂鸦模式已激活',
    cropActive: '裁切模式已激活',
    doodleSaved: '已保存涂鸦：{name}',
    doodleNoStrokes: '无涂鸦笔画，保存原图',
    doodleSaveBtn: '涂鸦并保存',
    doodleTips: '涂鸦模式：\n• 在图片上拖动鼠标/触控笔进行涂鸦\n• 涂鸦不会超出图片范围\n• Ctrl+Z 撤销上一笔\n• 按住空格或鼠标中键拖拽可平移取景\n• 拖动底部缩放条缩放图片（放大后画细节）\n• 调低画笔透明度可半透明预览，检查蒙版区域是否画到位\n• 选择下方"输出"类型后点击保存\n• 涂鸦图片存入 doodle/ 文件夹，蒙版存入 mask/ 文件夹，文件名与源图一致',
    doodleOutputTitle: '输出',
    doodleOutImage: '涂鸦图片',
    doodleOutMask: '蒙版',
    doodleOutBoth: '涂鸦图片+蒙版',
    doodleMaskSaved: '已保存蒙版：{name}',
    doodleBothSaved: '已保存涂鸦图片与蒙版：{img} / {mask}',
    addVLineTitle: '竖边界',
    addHLineTitle: '横边界',
    clearGuidesTitle: '清除所有参考线',
    guideAdded: '已添加参考线',
    guideDeleted: '已删除参考线',
    guidesCleared: '已清除参考线',
    infoGuides: '参考线：竖 {v} 横 {h}',
    zoomResetHint: '点击恢复 100%',
  },
  en: {
    pageTitle: 'Image Cropper Web',
    langToggle: '中文',
    langToggleLabel: 'Switch to Chinese',
    openImageBtn: 'Open Image',
    importFolderBtn: 'Import Folder',
    chooseSaveDirBtn: 'Set Save Location',
    prevBtn: 'Previous',
    nextBtn: 'Next',
    saveBtn: 'Crop & Save',
    statusReady: 'Choose an image or import an image folder',
    navEmpty: 'No image loaded',
    sizeTitle: 'Size',
    widthLabel: 'Width',
    heightLabel: 'Height',
    addPresetLabel: 'Add preset',
    swapSizeBtn: 'Swap Width/Height',
    actualSizeLabel: 'Output at defined size',
    sizeHint: 'When unchecked, cropping follows the ratio; when checked, the entered size directly controls the real output size.',
    fixedOutputSizeLabel: 'Keep output size fixed, scale framing only',
    presetTitle: 'Common Sizes',
    optionsTitle: 'Options',
    freeTransformLabel: 'Free transform image',
    constrainLabel: 'Keep crop box inside image bounds',
    fillBgLabel: 'Fill background when crop box exceeds image',
    fillTransparentLabel: 'Use transparent background',
    fillColorLabel: 'Background color',
    optionsHint: 'Free transform: the crop box stays fixed to the output size while you drag/scroll the image. Use Shift + wheel to rotate the image. With background fill enabled, areas outside the source image can be filled with a chosen color or transparency.',
    saveLocationTitle: 'Save Location',
    saveLocationUnset: 'Not set, files will be downloaded through the browser',
    saveLocationUnsupported: 'This browser does not support directory saving, so saving will fall back to browser download.',
    saveLocationSet: 'Save location set: {name}',
    cropInfoTitle: 'Crop Info',
    cropInfoWaiting: 'Waiting for image',
    tipsTitle: 'Tips',
    tipsText: 'Crop box mode:\n• Drag inside the box to move it\n• Drag edges or corners to resize it\n• Hold Ctrl while dragging to lock aspect ratio\n• Use the mouse wheel to scale the crop box\n• Drag the bottom zoom slider to adjust preview zoom (double-click to reset to 100%)\n• When zoomed beyond the canvas, drag the masked area to pan the view\n\nShortcuts:\n• WASD to switch previous / next image\n• Arrow keys to nudge the crop box\n• R to swap width / height\n• Q to toggle fixed output size\n• E to save\n\nGuides:\n• Click "Vertical / Horizontal Boundary" to place a guide\n• Drag a guide to move it\n• Right-click a guide to remove it\n• The crop box will not cross guide lines\n• Guides persist when switching images\n\nFree transform mode:\n• The crop box can be freely dragged and resized, same as crop mode\n• Drag outside the box to move the image\n• Shift + mouse wheel rotates the image\n• Drag the bottom zoom slider to scale the image (double-click to reset to 100%)\n• Exported output matches the framed content',
    zoomInLabel: 'Zoom in',
    zoomResetLabel: 'Reset zoom',
    zoomOutLabel: 'Zoom out',
    deletedPreset: 'Deleted preset: {size}',
    waitingForImage: 'Waiting for image',
    infoModeFree: 'Mode: Free transform',
    infoModeCrop: 'Mode: Crop box',
    infoOutputSize: 'Output size: {size} px',
    infoInputSize: 'Input size: {size}',
    infoSourceSample: 'Source sample: {size} px',
    infoAspect: 'Aspect: {size}',
    infoCurrentOutput: 'Current output: {size} px',
    infoScale: 'Scale: {value} x',
    infoRotation: 'Rotation: {value} deg',
    infoOverflowFill: 'Overflow fill: {value}',
    infoExportMatchesFrame: 'Export matches the crop frame view',
    infoExportResized: 'Export is resized to the target size',
    infoDragCropBox: 'Drag the crop box to define the output area',
    fillTransparent: 'Transparent',
    fillDisabled: 'Disabled',
    canvasHint: 'Open an image or import an image folder',
    canvasLabelFree: 'Free output: {size} px',
    canvasLabelActual: 'Actual output: {size} px',
    canvasLabelCrop: 'Crop: {size} px',
    loadedImage: 'Loaded: {name} ({size})',
    previewZoom: 'Preview zoom: {value}%',
    indexedDbBlobFailed: 'Canvas toBlob failed',
    indexedDbOpenFailed: 'IndexedDB open failed',
    indexedDbWriteFailed: 'IndexedDB write failed',
    indexedDbWriteAborted: 'IndexedDB write aborted',
    indexedDbReadFailed: 'IndexedDB read failed',
    indexedDbDeleteFailed: 'IndexedDB delete failed',
    indexedDbDeleteAborted: 'IndexedDB delete aborted',
    saveLocationRestored: 'Save location restored: {name}',
    browserNoPickerFallback: 'Browser does not support directory picker; fallback download will be used.',
    directoryPermissionDenied: 'Directory permission denied',
    saveLocationSetStatus: 'Save location set: {name}',
    saveLocationSetFailed: 'Failed to set save location',
    invalidCropArea: 'Invalid crop area',
    savedToFolder: 'Saved to folder: {name}',
    downloadedFile: 'Downloaded: {name}',
    directorySaveFallback: 'Directory save failed, downloaded instead: {name}',
    loadedFolder: 'Loaded folder: {name} ({size})',
    noImagesInFolder: 'No images found in selected folder',
    enterValidSize: 'Enter valid width and height',
    addedPreset: 'Added preset: {size}',
    modeSwitched: 'Mode switched',
    previewZoomReset: 'Preview zoom reset to 100%',
    doodleModeBtn: 'Doodle',
    doodleTitle: 'Doodle',
    brushSizeLabel: 'Brush size',
    brushOpacityLabel: 'Brush opacity (preview only)',
    customColorLabel: 'Custom',
    undoStrokeBtn: 'Undo stroke',
    doodleActive: 'Doodle mode activated',
    cropActive: 'Crop mode activated',
    doodleSaved: 'Doodle saved: {name}',
    doodleNoStrokes: 'No doodle strokes, saved original',
    doodleSaveBtn: 'Doodle & Save',
    doodleTips: 'Doodle mode:\n• Drag on the image to draw\n• Drawing is confined within image bounds\n• Ctrl+Z to undo last stroke\n• Hold Space or drag with the middle mouse button to pan\n• Drag the bottom zoom slider to zoom in/out (zoom in for fine detail)\n• Lower the brush opacity for a semi-transparent preview to verify the mask coverage\n• Pick an "Output" type below, then click Save\n• Doodle images go into the doodle/ folder, masks into the mask/ folder, named after the source image',
    doodleOutputTitle: 'Output',
    doodleOutImage: 'Doodle image',
    doodleOutMask: 'Mask',
    doodleOutBoth: 'Doodle image + mask',
    doodleMaskSaved: 'Mask saved: {name}',
    doodleBothSaved: 'Saved doodle image and mask: {img} / {mask}',
    addVLineTitle: 'Vertical boundary',
    addHLineTitle: 'Horizontal boundary',
    clearGuidesTitle: 'Clear all guides',
    guideAdded: 'Guide added',
    guideDeleted: 'Guide removed',
    guidesCleared: 'Guides cleared',
    infoGuides: 'Guides: {v} V, {h} H',
    zoomResetHint: 'Click to reset to 100%',
  },
};

const els = {
  multiFileInput: document.getElementById('multiFileInput'),
  chooseSaveDirBtn: document.getElementById('chooseSaveDirBtn'),
  prevBtn: document.getElementById('prevBtn'),
  nextBtn: document.getElementById('nextBtn'),
  saveBtn: document.getElementById('saveBtn'),
  widthInput: document.getElementById('widthInput'),
  heightInput: document.getElementById('heightInput'),
  addPresetBtn: document.getElementById('addPresetBtn'),
  swapSizeBtn: document.getElementById('swapSizeBtn'),
  actualSizeCheck: document.getElementById('actualSizeCheck'),
  fixedOutputSizeCheck: document.getElementById('fixedOutputSizeCheck'),
  freeTransformCheck: document.getElementById('freeTransformCheck'),
  constrainCheck: document.getElementById('constrainCheck'),
  fillBgCheck: document.getElementById('fillBgCheck'),
  fillBgControls: document.getElementById('fillBgControls'),
  fillTransparentCheck: document.getElementById('fillTransparentCheck'),
  fillColorInput: document.getElementById('fillColorInput'),
  presetList: document.getElementById('presetList'),
  statusText: document.getElementById('statusText'),
  navText: document.getElementById('navText'),
  saveDirText: document.getElementById('saveDirText'),
  infoText: document.getElementById('infoText'),
  tipsText: document.getElementById('tipsText'),
  canvas: document.getElementById('previewCanvas'),
  imageScaleBar: document.getElementById('imageScaleBar'),
  imageScaleSlider: document.getElementById('imageScaleSlider'),
  imageScaleValue: document.getElementById('imageScaleValue'),
  imageScaleMinLabel: document.getElementById('imageScaleMinLabel'),
  imageScaleMaxLabel: document.getElementById('imageScaleMaxLabel'),
  thumbnailList: document.getElementById('thumbnailList'),
  doodleModeBtn: document.getElementById('doodleModeBtn'),
  doodlePanel: document.getElementById('doodlePanel'),
  brushSizeSlider: document.getElementById('brushSizeSlider'),
  brushSizeValue: document.getElementById('brushSizeValue'),
  brushOpacitySlider: document.getElementById('brushOpacitySlider'),
  brushOpacityValue: document.getElementById('brushOpacityValue'),
  colorPalette: document.getElementById('colorPalette'),
  doodleColorInput: document.getElementById('doodleColorInput'),
  undoStrokeBtn: document.getElementById('undoStrokeBtn'),
  doodleOutImage: document.querySelector('input[name="doodleOutput"][value="image"]'),
  doodleOutMask: document.querySelector('input[name="doodleOutput"][value="mask"]'),
  doodleOutBoth: document.querySelector('input[name="doodleOutput"][value="both"]'),
  addVLineBtn: document.getElementById('addVLineBtn'),
  addHLineBtn: document.getElementById('addHLineBtn'),
  clearGuidesBtn: document.getElementById('clearGuidesBtn'),
};

const ctx = els.canvas.getContext('2d');

const state = {
  imageItems: [],
  imageIndex: -1,
  currentBitmap: null,
  currentImage: null,
  previewZoom: 1,
  targetW: 512,
  targetH: 512,
  useActualSize: true,
  fixedOutputSize: false,
  freeTransform: false,
  constrain: true,
  fillBackground: false,
  fillTransparent: false,
  fillColor: '#000000',
  crop: { x1: 120, y1: 120, x2: 420, y2: 420 },
  basePreviewScale: 1,
  basePreviewOffset: { x: 0, y: 0 },
  imageTx: 0,
  imageTy: 0,
  imageUserScale: 1,
  imageRotation: 0,
  dragMode: null,
  dragStart: null,
  presets: loadPresets(),
  redrawPending: false,
  resizeTimer: 0,
  viewportResizeTimer: 0,
  saveDirectoryHandle: null,
  saveDirectoryName: '',
  supportsDirectoryPicker: typeof window.showDirectoryPicker === 'function',
  language: localStorage.getItem(LANGUAGE_KEY) === 'en' ? 'en' : 'zh',
  doodleMode: false,
  doodleStrokes: [],
  doodleColor: '#ff0000',
  doodleBrushSize: 5,
  doodleOpacity: 1,
  doodleDrawing: false,
  doodleCurrentStroke: null,
  doodleCursorPos: null,
  guides: { vertical: [], horizontal: [] },
  lastPointer: null,
  hoverGuide: null,
  doodleOutput: 'image',
  spacePan: false,
};

function t(key, params = {}) {
  const dict = I18N[state.language] || I18N.zh;
  const template = dict[key] || key;
  return template.replace(/\{(\w+)\}/g, (_, name) => String(params[name] ?? ''));
}

function applyI18n() {
  document.documentElement.lang = state.language === 'zh' ? 'zh-CN' : 'en';
  document.title = t('pageTitle');

  for (const node of document.querySelectorAll('[data-i18n]')) {
    node.textContent = t(node.dataset.i18n);
  }

  els.addPresetBtn.setAttribute('aria-label', t('addPresetLabel'));
  els.addPresetBtn.setAttribute('aria-label', t('addPresetLabel'));
  els.addPresetBtn.setAttribute('title', t('addPresetLabel'));
  els.addVLineBtn.setAttribute('aria-label', t('addVLineTitle'));
  els.addVLineBtn.setAttribute('title', t('addVLineTitle'));
  els.addHLineBtn.setAttribute('aria-label', t('addHLineTitle'));
  els.addHLineBtn.setAttribute('title', t('addHLineTitle'));
  els.clearGuidesBtn.setAttribute('aria-label', t('clearGuidesTitle'));
  els.clearGuidesBtn.setAttribute('title', t('clearGuidesTitle'));
  els.imageScaleValue.setAttribute('title', t('zoomResetHint'));
  els.tipsText.textContent = t('tipsText');

  if (!state.imageItems.length) {
    setStatus(t('statusReady'));
    setNav(t('navEmpty'));
  }

  updateSaveDirInfo();
  updateInfo();
  renderPresets();
  scheduleRedraw();
}

function loadPresets() {
  try {
    const raw = localStorage.getItem('image_cropper_web_sizes');
    if (!raw) return [...DEFAULT_SIZES];
    const parsed = JSON.parse(raw);
    return uniqueSizes(parsed);
  } catch {
    return [...DEFAULT_SIZES];
  }
}

function savePresets() {
  localStorage.setItem('image_cropper_web_sizes', JSON.stringify(state.presets));
}

function uniqueSizes(items) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const w = Number(item[0]);
    const h = Number(item[1]);
    if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) continue;
    const key = `${Math.round(w)}x${Math.round(h)}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push([Math.round(w), Math.round(h)]);
    }
  }
  return out.length ? out : [...DEFAULT_SIZES];
}

function aspect() {
  return state.targetH ? state.targetW / state.targetH : 1;
}

function setStatus(text) {
  els.statusText.textContent = text;
}

function setNav(text) {
  els.navText.textContent = text;
}

function syncFillBackgroundControls() {
  const enabled = state.fillBackground;
  const transparent = state.fillTransparent;
  els.fillBgCheck.checked = enabled;
  els.fillBgControls.classList.toggle('hidden', !enabled);
  els.fillBgControls.setAttribute('aria-hidden', String(!enabled));
  els.fillTransparentCheck.checked = transparent;
  els.fillColorInput.disabled = !enabled || transparent;
  els.fillColorInput.value = state.fillColor;
}

function paintBackground(ctx2d, width, height) {
  if (!state.fillBackground) {
    ctx2d.clearRect(0, 0, width, height);
    return;
  }
  if (state.fillTransparent) {
    ctx2d.clearRect(0, 0, width, height);
    return;
  }
  ctx2d.fillStyle = state.fillColor;
  ctx2d.fillRect(0, 0, width, height);
}

function updateSaveDirInfo() {
  if (!state.supportsDirectoryPicker) {
    els.saveDirText.textContent = t('saveLocationUnsupported');
    return;
  }
  if (state.saveDirectoryName) {
    els.saveDirText.textContent = t('saveLocationSet', { name: state.saveDirectoryName });
    return;
  }
  els.saveDirText.textContent = t('saveLocationUnset');
}

function updateCanvasSize() {
  const dpr = window.devicePixelRatio || 1;
  const rect = els.canvas.getBoundingClientRect();
  const width = Math.max(300, Math.round(rect.width));
  const height = Math.max(360, Math.round(rect.height));
  els.canvas.width = Math.round(width * dpr);
  els.canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { width, height };
}

function getCanvasSize() {
  // 使用画布元素本身的尺寸（排除底部缩放条占用的空间），与绘制尺寸保持一致
  const rect = els.canvas.getBoundingClientRect();
  const width = Math.round(rect.width || els.canvas.clientWidth || 300);
  const height = Math.round(rect.height || els.canvas.clientHeight || 360);
  return {
    width: Math.max(300, width),
    height: Math.max(360, height),
  };
}

function handleViewportResize() {
  clearTimeout(state.resizeTimer);
  clearTimeout(state.viewportResizeTimer);
  const refresh = () => {
    if (state.currentBitmap) {
      fitImageToCanvas(state.freeTransform || state.useActualSize);
    } else {
      scheduleRedraw();
    }
  };
  state.resizeTimer = window.setTimeout(refresh, 80);
  state.viewportResizeTimer = window.setTimeout(refresh, 220);
}

function scheduleRedraw() {
  if (state.redrawPending) return;
  state.redrawPending = true;
  requestAnimationFrame(() => {
    state.redrawPending = false;
    refitBoxToAspect();
    redraw();
  });
}

// 按定义尺寸输出/自由变换模式下，裁切框必须始终保持目标宽高比。
// 参考线、图片边界等钳制可能会单独压缩某一边导致比例跑偏，
// 这里把框重新校正为目标比例，保证导出时不会把画面拉伸变形。
function refitBoxToAspect() {
  if (!state.currentBitmap || state.doodleMode) return;
  if (!state.freeTransform && !state.useActualSize) return;
  const asp = aspect();
  if (!Number.isFinite(asp) || asp <= 0) return;
  const w = state.crop.x2 - state.crop.x1;
  const h = state.crop.y2 - state.crop.y1;
  if (w < 1 || h < 1) return;
  if (Math.abs(w / h - asp) <= 0.001) return;
  const cx = (state.crop.x1 + state.crop.x2) / 2;
  const cy = (state.crop.y1 + state.crop.y2) / 2;
  let hw;
  let hh;
  if (w / h > asp) {
    hh = h / 2;
    hw = hh * asp;
  } else {
    hw = w / 2;
    hh = hw / asp;
  }
  state.crop = { x1: cx - hw, y1: cy - hh, x2: cx + hw, y2: cy + hh };
}

function applySizeInputs() {
  const w = Number.parseInt(els.widthInput.value, 10);
  const h = Number.parseInt(els.heightInput.value, 10);
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return false;
  state.targetW = w;
  state.targetH = h;
  renderPresets();
  if (state.currentBitmap) {
    if (state.freeTransform || state.useActualSize) {
      fitImageToCanvas(true);
    } else {
      applyAspectToBox();
      constrainBox();
      scheduleRedraw();
    }
  }
  return true;
}

function syncSizeInputs() {
  els.widthInput.value = String(state.targetW);
  els.heightInput.value = String(state.targetH);
  renderPresets();
}

function renderPresets() {
  els.presetList.innerHTML = '';
  for (const [w, h] of state.presets) {
    const item = document.createElement('div');
    item.className = 'preset-item';

    const main = document.createElement('button');
    main.type = 'button';
    main.className = 'btn preset-main';
    if (state.targetW === w && state.targetH === h) main.classList.add('active');
    main.textContent = `${w} x ${h}`;
    main.addEventListener('click', () => {
      state.targetW = w;
      state.targetH = h;
      syncSizeInputs();
      if (state.currentBitmap) {
        if (state.freeTransform || state.useActualSize) {
          fitImageToCanvas(true);
        } else {
          applyAspectToBox();
          constrainBox();
          scheduleRedraw();
        }
      }
    });

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'btn preset-remove';
    remove.textContent = 'x';
    remove.addEventListener('click', (event) => {
      event.stopPropagation();
      state.presets = uniqueSizes(state.presets.filter(([pw, ph]) => pw !== w || ph !== h));
      savePresets();
      renderPresets();
      setStatus(t('deletedPreset', { size: `${w} x ${h}` }));
    });

    item.append(main, remove);
    els.presetList.append(item);
  }
}

function resetTransformState() {
  state.imageTx = 0;
  state.imageTy = 0;
  state.imageUserScale = 1;
  state.imageRotation = 0;
}

function fitImageToCanvas(resetCrop = false) {
  if (!state.currentBitmap) {
    scheduleRedraw();
    return;
  }
  const { width: cw, height: ch } = getCanvasSize();
  const baseScale = Math.min((cw * 0.9) / state.currentBitmap.width, (ch * 0.9) / state.currentBitmap.height);
  state.basePreviewScale = Math.max(0.02, baseScale * state.previewZoom);
  const dispW = state.currentBitmap.width * state.basePreviewScale;
  const dispH = state.currentBitmap.height * state.basePreviewScale;
  state.basePreviewOffset = { x: (cw - dispW) / 2, y: (ch - dispH) / 2 };

  let boxW;
  let boxH;
  if (state.freeTransform || state.useActualSize) {
    const scale = Math.min((cw * 0.72) / Math.max(1, state.targetW), (ch * 0.72) / Math.max(1, state.targetH));
    boxW = state.targetW * scale;
    boxH = state.targetH * scale;
  } else {
    boxH = Math.min(dispH * 0.6, ch * 0.52);
    boxW = boxH * aspect();
    if (boxW > cw * 0.7) {
      boxW = cw * 0.7;
      boxH = boxW / aspect();
    }
  }

  boxW = Math.max(MIN_BOX_SIZE, Math.min(boxW, cw - 20));
  boxH = Math.max(MIN_BOX_SIZE, Math.min(boxH, ch - 20));
  const cx = cw / 2;
  const cy = ch / 2;

  if (resetCrop || state.freeTransform || state.useActualSize) {
    state.crop.x1 = cx - boxW / 2;
    state.crop.y1 = cy - boxH / 2;
    state.crop.x2 = cx + boxW / 2;
    state.crop.y2 = cy + boxH / 2;
  }

  constrainBox();
  scheduleRedraw();
}

function getImageBounds() {
  if (!state.currentBitmap) return null;
  if (state.freeTransform) {
    const { width, height } = getTransformedImageRect();
    const { x, y } = getTransformOffset(width, height);
    return { x1: x, y1: y, x2: x + width, y2: y + height };
  }
  const dispW = state.currentBitmap.width * state.basePreviewScale;
  const dispH = state.currentBitmap.height * state.basePreviewScale;
  return {
    x1: state.basePreviewOffset.x,
    y1: state.basePreviewOffset.y,
    x2: state.basePreviewOffset.x + dispW,
    y2: state.basePreviewOffset.y + dispH,
  };
}

function constrainBox() {
  const { width: cw, height: ch } = getCanvasSize();
  let { x1, y1, x2, y2 } = state.crop;
  let w = Math.max(MIN_BOX_SIZE, x2 - x1);
  let h = Math.max(MIN_BOX_SIZE, y2 - y1);

  if (state.freeTransform) {
    // 与普通模式一致：勾选"限制在图片范围内"时，裁切框限制在图片范围内
    const bounds = getImageBounds();
    if (bounds && state.constrain) {
      if (w > bounds.x2 - bounds.x1 || h > bounds.y2 - bounds.y1) {
        state.crop = { x1, y1, x2: x1 + w, y2: y1 + h };
        return;
      }
      x1 = Math.max(bounds.x1, Math.min(x1, bounds.x2 - w));
      y1 = Math.max(bounds.y1, Math.min(y1, bounds.y2 - h));
      state.crop = { x1, y1, x2: x1 + w, y2: y1 + h };
      return;
    }
    w = Math.min(w, cw - 20);
    h = Math.min(h, ch - 20);
    x1 = Math.max(10, Math.min(x1, cw - w - 10));
    y1 = Math.max(10, Math.min(y1, ch - h - 10));
    state.crop = { x1, y1, x2: x1 + w, y2: y1 + h };
    return;
  }

  const bounds = getImageBounds();
  if (!state.constrain || !bounds) {
    state.crop = { x1, y1, x2: x1 + w, y2: y1 + h };
    if (!state.dragMode) applyGuideWalls();
    return;
  }

  if (w > bounds.x2 - bounds.x1 || h > bounds.y2 - bounds.y1) {
    state.crop = { x1, y1, x2: x1 + w, y2: y1 + h };
    if (!state.dragMode) applyGuideWalls();
    return;
  }

  x1 = Math.max(bounds.x1, Math.min(x1, bounds.x2 - w));
  y1 = Math.max(bounds.y1, Math.min(y1, bounds.y2 - h));
  state.crop = { x1, y1, x2: x1 + w, y2: y1 + h };
  if (!state.dragMode) applyGuideWalls();
}

function syncTargetSizeFromCropBox() {
  if (!state.dragStart) return;
  const curW = state.crop.x2 - state.crop.x1;
  const curH = state.crop.y2 - state.crop.y1;
  const ratioW = curW / Math.max(1, state.dragStart.boxW);
  const ratioH = curH / Math.max(1, state.dragStart.boxH);
  state.targetW = Math.max(1, Math.round(state.dragStart.tw * ratioW));
  state.targetH = Math.max(1, Math.round(state.dragStart.th * ratioH));
  syncSizeInputs();
}

function applyAspectToBox() {
  const cx = (state.crop.x1 + state.crop.x2) / 2;
  const cy = (state.crop.y1 + state.crop.y2) / 2;
  const hh = Math.max(MIN_BOX_SIZE / 2, (state.crop.y2 - state.crop.y1) / 2);
  const hw = hh * aspect();
  state.crop.x1 = cx - hw;
  state.crop.x2 = cx + hw;
  state.crop.y1 = cy - hh;
  state.crop.y2 = cy + hh;
}

function hitTest(mx, my) {
  const { x1, y1, x2, y2 } = state.crop;
  const t = EDGE_TOL;
  const inX = mx >= x1 - t && mx <= x2 + t;
  const inY = my >= y1 - t && my <= y2 + t;
  if (!inX || !inY) return null;
  const nearL = Math.abs(mx - x1) <= t;
  const nearR = Math.abs(mx - x2) <= t;
  const nearT = Math.abs(my - y1) <= t;
  const nearB = Math.abs(my - y2) <= t;
  if (nearT && nearL) return 'tl';
  if (nearT && nearR) return 'tr';
  if (nearB && nearL) return 'bl';
  if (nearB && nearR) return 'br';
  if (nearT) return 't';
  if (nearB) return 'b';
  if (nearL) return 'l';
  if (nearR) return 'r';
  if (mx > x1 + t && mx < x2 - t && my > y1 + t && my < y2 - t) return 'move';
  return null;
}

function getPointerPos(event) {
  const rect = els.canvas.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function getTransformedImageRect() {
  if (!state.currentBitmap) return { width: 0, height: 0, drawScale: 1 };
  const rad = (state.imageRotation * Math.PI) / 180;
  const rotW = Math.abs(state.currentBitmap.width * Math.cos(rad)) + Math.abs(state.currentBitmap.height * Math.sin(rad));
  const rotH = Math.abs(state.currentBitmap.width * Math.sin(rad)) + Math.abs(state.currentBitmap.height * Math.cos(rad));
  const { width: cw, height: ch } = getCanvasSize();
  // 图片默认按 85% 缩放内含于画布（四周留白），缩放与裁切框大小无关（框的逻辑与普通模式一致）
  const fitScale = Math.min((cw * 0.85) / Math.max(1, rotW), (ch * 0.85) / Math.max(1, rotH));
  const drawScale = Math.max(0.02, fitScale * state.imageUserScale * state.previewZoom);
  return {
    width: state.currentBitmap.width * drawScale,
    height: state.currentBitmap.height * drawScale,
    drawScale,
  };
}

function getTransformOffset(width, height) {
  const { width: cw, height: ch } = getCanvasSize();
  return {
    x: cw / 2 - width / 2 + state.imageTx,
    y: ch / 2 - height / 2 + state.imageTy,
  };
}

// 限制图片平移/旋转范围，保证图片始终盖住裁切框（避免导出空白）
function clampImageToBox() {
  const { width: cw, height: ch } = getCanvasSize();
  const { width, height } = getTransformedImageRect();
  const boxW = state.crop.x2 - state.crop.x1;
  const boxH = state.crop.y2 - state.crop.y1;
  if (width >= boxW) {
    const lo = state.crop.x2 - (cw + width) / 2;
    const hi = state.crop.x1 - (cw - width) / 2;
    state.imageTx = clamp(state.imageTx, lo, hi);
  }
  if (height >= boxH) {
    const lo = state.crop.y2 - (ch + height) / 2;
    const hi = state.crop.y1 - (ch - height) / 2;
    state.imageTy = clamp(state.imageTy, lo, hi);
  }
}

function drawImageLayer() {
  if (!state.currentBitmap) return;
  if (state.freeTransform) {
    const { width, height } = getTransformedImageRect();
    const offset = getTransformOffset(width, height);
    const cx = offset.x + width / 2;
    const cy = offset.y + height / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((state.imageRotation * Math.PI) / 180);
    ctx.drawImage(state.currentBitmap, -width / 2, -height / 2, width, height);
    ctx.restore();
    return;
  }
  const dispW = state.currentBitmap.width * state.basePreviewScale;
  const dispH = state.currentBitmap.height * state.basePreviewScale;
  ctx.drawImage(state.currentBitmap, state.basePreviewOffset.x, state.basePreviewOffset.y, dispW, dispH);
}

function getImageDisplayBounds() {
  if (!state.currentBitmap) {
    const { width: cw, height: ch } = getCanvasSize();
    return { x: 0, y: 0, w: cw, h: ch };
  }
  const dispW = state.currentBitmap.width * state.basePreviewScale;
  const dispH = state.currentBitmap.height * state.basePreviewScale;
  return {
    x: state.basePreviewOffset.x,
    y: state.basePreviewOffset.y,
    w: dispW,
    h: dispH,
  };
}

// 图片显示尺寸是否大于画布（放大后需要平移才能看到全部内容）
function isImageLargerThanCanvas() {
  if (!state.currentBitmap) return false;
  const { width: cw, height: ch } = getCanvasSize();
  const dispW = state.currentBitmap.width * state.basePreviewScale;
  const dispH = state.currentBitmap.height * state.basePreviewScale;
  return dispW > cw + 1 || dispH > ch + 1;
}

// 限制平移偏移：图片大于画布的轴可平移且始终盖满画布，小于画布的轴保持居中
function clampPanOffset(ox, oy) {
  const { width: cw, height: ch } = getCanvasSize();
  const dispW = state.currentBitmap.width * state.basePreviewScale;
  const dispH = state.currentBitmap.height * state.basePreviewScale;
  const x = dispW > cw ? clamp(ox, cw - dispW, 0) : (cw - dispW) / 2;
  const y = dispH > ch ? clamp(oy, ch - dispH, 0) : (ch - dispH) / 2;
  return { x, y };
}

function drawSingleStroke(stroke) {
  if (!stroke || stroke.points.length < 2) return;
  // 笔画存的是图片坐标，绘制时映射到当前屏幕位置（随缩放/平移贴合图片）
  const toDisp = (p) => ({
    x: p.x * state.basePreviewScale + state.basePreviewOffset.x,
    y: p.y * state.basePreviewScale + state.basePreviewOffset.y,
  });
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = stroke.color;
  // 宽度以图片像素存储，按当前缩放换算回屏幕（缩放时粗细与图片成比例）
  ctx.lineWidth = stroke.size * state.basePreviewScale;
  // 半透明预览：透过笔画查看蒙版区域是否画到位（导出时仍为不透明）
  ctx.globalAlpha = stroke.opacity ?? 1;
  ctx.beginPath();
  const p0 = toDisp(stroke.points[0]);
  ctx.moveTo(p0.x, p0.y);
  for (let i = 1; i < stroke.points.length; i++) {
    const p = toDisp(stroke.points[i]);
    const pm = toDisp({ x: (stroke.points[i - 1].x + stroke.points[i].x) / 2, y: (stroke.points[i - 1].y + stroke.points[i].y) / 2 });
    ctx.quadraticCurveTo(p.x, p.y, pm.x, pm.y);
  }
  const plast = toDisp(stroke.points[stroke.points.length - 1]);
  ctx.lineTo(plast.x, plast.y);
  ctx.stroke();
  ctx.restore();
}

function drawDoodleStrokes() {
  for (const stroke of state.doodleStrokes) {
    drawSingleStroke(stroke);
  }
}

function displayToBaseImageCoords(dx, dy) {
  return {
    x: (dx - state.basePreviewOffset.x) / state.basePreviewScale,
    y: (dy - state.basePreviewOffset.y) / state.basePreviewScale,
  };
}

function getCropRectStandard() {
  const p1 = displayToBaseImageCoords(state.crop.x1, state.crop.y1);
  const p2 = displayToBaseImageCoords(state.crop.x2, state.crop.y2);
  const x1 = Math.round(Math.min(p1.x, p2.x));
  const y1 = Math.round(Math.min(p1.y, p2.y));
  const x2 = Math.round(Math.max(p1.x, p2.x));
  const y2 = Math.round(Math.max(p1.y, p2.y));
  return { x1, y1, x2, y2 };
}

function getFillDescription() {
  if (!state.fillBackground) return t('fillDisabled');
  if (state.fillTransparent) return t('fillTransparent');
  return state.fillColor.toUpperCase();
}

function updateInfo() {
  if (!state.currentBitmap) {
    els.infoText.textContent = t('waitingForImage');
    return;
  }
  if (state.doodleMode) {
    els.infoText.textContent = [
      t('doodleActive'),
      t('infoOutputSize', { size: state.currentBitmap ? `${state.currentBitmap.width} x ${state.currentBitmap.height}` : '--' }),
      `画笔：${state.doodleBrushSize}px  ${state.doodleColor}`,
      `笔画数：${state.doodleStrokes.length}`,
    ].join('\n');
    return;
  }
  if (state.freeTransform) {
    els.infoText.textContent = [
      t('infoModeFree'),
      t('infoOutputSize', { size: `${state.targetW} x ${state.targetH}` }),
      t('infoScale', { value: state.imageUserScale.toFixed(2) }),
      t('infoRotation', { value: state.imageRotation.toFixed(1) }),
      t('infoOverflowFill', { value: getFillDescription() }),
      t('infoExportMatchesFrame'),
    ].join('\n');
    return;
  }
  const rect = getCropRectStandard();
  const rawW = Math.max(0, rect.x2 - rect.x1);
  const rawH = Math.max(0, rect.y2 - rect.y1);
  if (state.useActualSize) {
    const exportHint = state.fixedOutputSize ? t('infoExportMatchesFrame') : t('infoExportResized');
    const lines = [
      t('infoModeCrop'),
      t('infoInputSize', { size: `${state.targetW} x ${state.targetH}` }),
      t('infoOutputSize', { size: `${state.targetW} x ${state.targetH}` }),
      t('infoSourceSample', { size: `${rawW} x ${rawH}` }),
      t('infoOverflowFill', { value: getFillDescription() }),
      exportHint,
    ];
    const guidesLine = guidesInfoLine();
    if (guidesLine) lines.push(guidesLine);
    els.infoText.textContent = lines.join('\n');
  } else {
    const lines = [
      t('infoModeCrop'),
      t('infoAspect', { size: `${state.targetW} x ${state.targetH}` }),
      t('infoCurrentOutput', { size: `${rawW} x ${rawH}` }),
      t('infoOverflowFill', { value: getFillDescription() }),
      t('infoDragCropBox'),
    ];
    const guidesLine = guidesInfoLine();
    if (guidesLine) lines.push(guidesLine);
    els.infoText.textContent = lines.join('\n');
  }
}

function redraw() {
  const { width: cw, height: ch } = updateCanvasSize();
  ctx.clearRect(0, 0, cw, ch);
  ctx.fillStyle = COLORS.canvas;
  ctx.fillRect(0, 0, cw, ch);

  if (!state.currentBitmap) {
    ctx.fillStyle = COLORS.textDim;
    ctx.font = '16px Microsoft YaHei UI';
    ctx.textAlign = 'center';
    ctx.fillText(t('canvasHint'), cw / 2, ch / 2);
    updateInfo();
    return;
  }

  drawImageLayer();

  // Draw doodle strokes in doodle mode
  if (state.doodleMode) {
    const bounds = getImageDisplayBounds();

    // Clip all doodle drawing to the image area
    ctx.save();
    ctx.beginPath();
    ctx.rect(bounds.x, bounds.y, bounds.w, bounds.h);
    ctx.clip();

    // Draw a subtle border around the image area (drawn after clip to be visible)
    drawDoodleStrokes();

    // Draw current in-progress stroke
    if (state.doodleDrawing && state.doodleCurrentStroke) {
      drawSingleStroke(state.doodleCurrentStroke);
    }

    ctx.restore();

    // Image boundary indicator (drawn outside clip)
    ctx.save();
    ctx.strokeStyle = 'rgba(59,130,246,0.5)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(bounds.x, bounds.y, bounds.w, bounds.h);
    ctx.setLineDash([]);
    ctx.restore();

    // Draw brush cursor circle at pointer if hovering
    if (state.doodleCursorPos) {
      const p = state.doodleCursorPos;
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, state.doodleBrushSize / 2, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([2, 2]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    updateInfo();
    return;
  }

  const { x1, y1, x2, y2 } = state.crop;
  const borderColor = state.freeTransform ? COLORS.accent : COLORS.success;

  ctx.save();
  ctx.fillStyle = COLORS.mask;
  ctx.fillRect(0, 0, cw, y1);
  ctx.fillRect(0, y2, cw, ch - y2);
  ctx.fillRect(0, y1, x1, y2 - y1);
  ctx.fillRect(x2, y1, cw - x2, y2 - y1);
  ctx.restore();

  drawGuides();

  ctx.save();
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = COLORS.grid;
  const fx1 = x1 + (x2 - x1) / 3;
  const fx2 = x1 + ((x2 - x1) * 2) / 3;
  const fy1 = y1 + (y2 - y1) / 3;
  const fy2 = y1 + ((y2 - y1) * 2) / 3;
  for (const x of [fx1, fx2]) {
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
  for (const y of [fy1, fy2]) {
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.fillStyle = borderColor;
  for (const [px, py] of [[x1, y1], [x2, y1], [x1, y2], [x2, y2]]) {
    ctx.fillRect(px - HANDLE_SIZE, py - HANDLE_SIZE, HANDLE_SIZE * 2, HANDLE_SIZE * 2);
  }
  ctx.font = 'bold 13px Microsoft YaHei UI';
  ctx.textAlign = 'center';
  ctx.fillStyle = borderColor;
  const label = state.freeTransform
    ? t('canvasLabelFree', { size: `${state.targetW} x ${state.targetH}` })
    : state.useActualSize
      ? t('canvasLabelActual', { size: `${state.targetW} x ${state.targetH}` })
      : (() => {
          const rect = getCropRectStandard();
          return t('canvasLabelCrop', { size: `${Math.max(0, rect.x2 - rect.x1)} x ${Math.max(0, rect.y2 - rect.y1)}` });
        })();
  ctx.fillText(label, (x1 + x2) / 2, Math.max(18, y1 - 12));
  ctx.restore();

  updateInfo();
}

async function loadImageList(files) {
  if (!files.length) return;
  if (state.imageItems.length) {
    for (const item of state.imageItems) {
      if (item.url) URL.revokeObjectURL(item.url);
    }
  }
  state.imageItems = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
  state.imageIndex = 0;
  renderThumbnails();
  await loadCurrentImage();
}

async function loadCurrentImage() {
  if (state.imageIndex < 0 || state.imageIndex >= state.imageItems.length) return;
  const item = state.imageItems[state.imageIndex];
  const bitmap = await createImageBitmap(item.file);
  state.currentBitmap = bitmap;
  state.currentImage = item;
  resetTransformState();
  state.doodleStrokes = [];
  state.doodleDrawing = false;
  state.doodleCurrentStroke = null;
  state.doodleCursorPos = null;
  state.guides.vertical = state.guides.vertical.map((v) => clamp(v, 0, bitmap.width));
  state.guides.horizontal = state.guides.horizontal.map((h) => clamp(h, 0, bitmap.height));
  updateGuideButtons();
  // 先让底部缩放条就位（会改变画布高度），再按实际画布尺寸居中图片
  syncScaleBarVisibility();
  fitImageToCanvas(true);
  // 分辨率固定在导航栏，避免被"XX模式已激活"等状态消息覆盖
  setNav(`${state.imageIndex + 1} / ${state.imageItems.length} - ${item.file.name} (${bitmap.width} x ${bitmap.height})`);
  setStatus(t('loadedImage', { name: item.file.name, size: `${bitmap.width} x ${bitmap.height}` }));
  updateNavButtons();
  updateThumbnailActive();
}

function updateNavButtons() {
  els.prevBtn.disabled = state.imageIndex <= 0;
  els.nextBtn.disabled = state.imageIndex >= state.imageItems.length - 1;
}

function renderThumbnails() {
  els.thumbnailList.innerHTML = '';
  for (let i = 0; i < state.imageItems.length; i++) {
    const item = state.imageItems[i];
    const thumb = document.createElement('div');
    thumb.className = 'thumbnail-item';
    if (i === state.imageIndex) thumb.classList.add('active');
    thumb.title = item.file.name;

    const img = document.createElement('img');
    img.src = item.url;
    img.alt = item.file.name;
    img.loading = 'lazy';

    thumb.appendChild(img);
    thumb.addEventListener('click', async () => {
      if (i === state.imageIndex) return;
      state.imageIndex = i;
      await loadCurrentImage();
    });

    els.thumbnailList.appendChild(thumb);
  }
}

function updateThumbnailActive() {
  const items = els.thumbnailList.querySelectorAll('.thumbnail-item');
  for (let i = 0; i < items.length; i++) {
    items[i].classList.toggle('active', i === state.imageIndex);
  }
  // 滚动到当前项可见
  const activeItem = items[state.imageIndex];
  if (activeItem) {
    activeItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}

function onPointerDown(event) {
  if (!state.currentBitmap) return;
  const { x, y } = getPointerPos(event);
  els.canvas.setPointerCapture(event.pointerId);

  if (state.doodleMode) {
    // 按住空格或鼠标中键拖拽 = 平移取景；否则画画
    if (state.spacePan || event.button === 1) {
      state.dragMode = 'image_pan';
      state.dragStart = { x, y, offX: state.basePreviewOffset.x, offY: state.basePreviewOffset.y };
      els.canvas.style.cursor = 'grabbing';
      return;
    }
    const bounds = getImageDisplayBounds();
    const clamped = { x: clamp(x, bounds.x, bounds.x + bounds.w), y: clamp(y, bounds.y, bounds.y + bounds.h) };
    state.doodleDrawing = true;
    state.doodleCurrentStroke = {
      color: state.doodleColor,
      // 宽度换算为图片像素，保证任何缩放下笔画粗细与图片成比例
      size: state.doodleBrushSize / state.basePreviewScale,
      opacity: state.doodleOpacity,
      // 笔画记录在图片坐标中，缩放/平移时笔画始终贴在图片内容上
      points: [displayToBaseImageCoords(clamped.x, clamped.y)],
    };
    scheduleRedraw();
    return;
  }
  if (state.freeTransform) {
    const mode = hitTest(x, y);
    if (mode) {
      state.dragMode = mode;
      state.dragStart = {
        x, y, ...state.crop,
        boxW: state.crop.x2 - state.crop.x1,
        boxH: state.crop.y2 - state.crop.y1,
        tw: state.targetW,
        th: state.targetH,
        walls: getGuideWallsForBox(state.crop),
      };
      setHoverGuide(null);
      return;
    }
    // 框外拖拽图片移动取景
    state.dragMode = 'image_move';
    state.dragStart = { x, y, tx: state.imageTx, ty: state.imageTy };
    return;
  }
  const mode = hitTest(x, y);
  if (mode) {
    state.dragMode = mode;
    state.dragStart = {
      x, y, ...state.crop,
      boxW: state.crop.x2 - state.crop.x1,
      boxH: state.crop.y2 - state.crop.y1,
      tw: state.targetW,
      th: state.targetH,
      walls: getGuideWallsForBox(state.crop),
    };
    setHoverGuide(null);
    return;
  }
  const guideHit = hitTestGuide(x, y);
  if (guideHit) {
    state.dragMode = guideHit.axis === 'vertical' ? 'vguide' : 'hguide';
    state.dragStart = { x, y, index: guideHit.index };
    setHoverGuide(guideHit);
    return;
  }
  // 图片放大超出画布时，在遮罩区域拖拽可平移取景
  if (isImageLargerThanCanvas()) {
    state.dragMode = 'image_pan';
    state.dragStart = {
      x, y,
      offX: state.basePreviewOffset.x,
      offY: state.basePreviewOffset.y,
    };
  }
}

function onPointerMove(event) {
  const { x, y } = getPointerPos(event);
  state.lastPointer = { x, y };

  // 平移取景（裁切/涂鸦模式通用）
  if (state.dragMode === 'image_pan') {
    const dx = x - state.dragStart.x;
    const dy = y - state.dragStart.y;
    const offset = clampPanOffset(state.dragStart.offX + dx, state.dragStart.offY + dy);
    const moveX = offset.x - state.basePreviewOffset.x;
    const moveY = offset.y - state.basePreviewOffset.y;
    state.basePreviewOffset = offset;
    // 裁切框跟随图片平移（涂鸦模式下框不可见，无影响）
    state.crop.x1 += moveX;
    state.crop.x2 += moveX;
    state.crop.y1 += moveY;
    state.crop.y2 += moveY;
    constrainBox();
    els.canvas.style.cursor = 'grabbing';
    scheduleRedraw();
    return;
  }

  if (state.doodleMode) {
    if (state.spacePan) {
      state.doodleCursorPos = null;
      els.canvas.style.cursor = 'grab';
      scheduleRedraw();
      return;
    }
    const bounds = getImageDisplayBounds();
    state.doodleCursorPos = { x: clamp(x, bounds.x, bounds.x + bounds.w), y: clamp(y, bounds.y, bounds.y + bounds.h) };
    if (state.doodleDrawing && state.doodleCurrentStroke) {
      state.doodleCurrentStroke.points.push(displayToBaseImageCoords(state.doodleCursorPos.x, state.doodleCursorPos.y));
    }
    scheduleRedraw();
    els.canvas.style.cursor = 'none';
    return;
  }

  if (!state.dragMode || !state.dragStart) {
    const mode = hitTest(x, y);
    const guideHit = mode ? null : hitTestGuide(x, y);
    const pan = !mode && !guideHit && !state.freeTransform && isImageLargerThanCanvas();
    const imageMove = !mode && state.freeTransform;
    setHoverGuide(guideHit);
    els.canvas.style.cursor = cursorForMode(mode || (guideHit ? (guideHit.axis === 'vertical' ? 'vguide' : 'hguide') : pan ? 'pan' : imageMove ? 'grab' : null));
    return;
  }

  if (state.freeTransform && state.dragMode === 'image_move') {
    state.imageTx = state.dragStart.tx + (x - state.dragStart.x);
    state.imageTy = state.dragStart.ty + (y - state.dragStart.y);
    clampImageToBox();
    scheduleRedraw();
    return;
  }

  if (state.dragMode === 'vguide' || state.dragMode === 'hguide') {
    const bp = displayToBaseImageCoords(x, y);
    if (state.dragMode === 'vguide') {
      state.guides.vertical[state.dragStart.index] = clamp(bp.x, 0, state.currentBitmap.width);
    } else {
      state.guides.horizontal[state.dragStart.index] = clamp(bp.y, 0, state.currentBitmap.height);
    }
    constrainBox();
    applyGuideWalls();
    scheduleRedraw();
    return;
  }

  const dx = x - state.dragStart.x;
  const dy = y - state.dragStart.y;
  const { x1: ox1, y1: oy1, x2: ox2, y2: oy2 } = state.dragStart;
  const mode = state.dragMode;
  const lockRatio = event.ctrlKey;
  const asp = aspect();

  if (mode === 'move') {
    state.crop.x1 = ox1 + dx;
    state.crop.y1 = oy1 + dy;
    state.crop.x2 = ox2 + dx;
    state.crop.y2 = oy2 + dy;
  } else if (state.fixedOutputSize) {
    const factorX = 1 + dx / Math.max(MIN_BOX_SIZE, state.dragStart.boxW);
    const factorY = 1 + dy / Math.max(MIN_BOX_SIZE, state.dragStart.boxH);
    let factor;

    if (mode === 'tl') {
      factor = Math.min(1 - dx / Math.max(MIN_BOX_SIZE, state.dragStart.boxW), 1 - dy / Math.max(MIN_BOX_SIZE, state.dragStart.boxH));
    } else if (mode === 'tr') {
      factor = Math.min(1 + dx / Math.max(MIN_BOX_SIZE, state.dragStart.boxW), 1 - dy / Math.max(MIN_BOX_SIZE, state.dragStart.boxH));
    } else if (mode === 'bl') {
      factor = Math.min(1 - dx / Math.max(MIN_BOX_SIZE, state.dragStart.boxW), 1 + dy / Math.max(MIN_BOX_SIZE, state.dragStart.boxH));
    } else if (mode === 'br') {
      factor = Math.min(1 + dx / Math.max(MIN_BOX_SIZE, state.dragStart.boxW), 1 + dy / Math.max(MIN_BOX_SIZE, state.dragStart.boxH));
    } else if (mode === 't') {
      factor = 1 - dy / Math.max(MIN_BOX_SIZE, state.dragStart.boxH);
    } else if (mode === 'b') {
      factor = 1 + dy / Math.max(MIN_BOX_SIZE, state.dragStart.boxH);
    } else if (mode === 'l') {
      factor = 1 - dx / Math.max(MIN_BOX_SIZE, state.dragStart.boxW);
    } else if (mode === 'r') {
      factor = 1 + dx / Math.max(MIN_BOX_SIZE, state.dragStart.boxW);
    }

    factor = Math.max(MIN_BOX_SIZE / Math.max(state.dragStart.boxW, state.dragStart.boxH), factor || 1);
    const halfW = (state.dragStart.boxW * factor) / 2;
    const halfH = (state.dragStart.boxH * factor) / 2;
    const cx = (ox1 + ox2) / 2;
    const cy = (oy1 + oy2) / 2;
    state.crop.x1 = cx - halfW;
    state.crop.x2 = cx + halfW;
    state.crop.y1 = cy - halfH;
    state.crop.y2 = cy + halfH;
  } else if (mode === 'tl') {
    if (lockRatio) {
      const newH = Math.max(MIN_BOX_SIZE, (oy2 - oy1) - dy);
      const newW = newH * asp;
      state.crop.x1 = ox2 - newW;
      state.crop.y1 = oy2 - newH;
    } else {
      state.crop.x1 = Math.min(ox2 - MIN_BOX_SIZE, ox1 + dx);
      state.crop.y1 = Math.min(oy2 - MIN_BOX_SIZE, oy1 + dy);
    }
    state.crop.x2 = ox2;
    state.crop.y2 = oy2;
  } else if (mode === 'tr') {
    if (lockRatio) {
      const newH = Math.max(MIN_BOX_SIZE, (oy2 - oy1) - dy);
      const newW = newH * asp;
      state.crop.y1 = oy2 - newH;
      state.crop.x2 = ox1 + newW;
    } else {
      state.crop.y1 = Math.min(oy2 - MIN_BOX_SIZE, oy1 + dy);
      state.crop.x2 = Math.max(ox1 + MIN_BOX_SIZE, ox2 + dx);
    }
    state.crop.x1 = ox1;
    state.crop.y2 = oy2;
  } else if (mode === 'bl') {
    if (lockRatio) {
      const newH = Math.max(MIN_BOX_SIZE, (oy2 - oy1) + dy);
      const newW = newH * asp;
      state.crop.x1 = ox2 - newW;
      state.crop.y2 = oy1 + newH;
    } else {
      state.crop.x1 = Math.min(ox2 - MIN_BOX_SIZE, ox1 + dx);
      state.crop.y2 = Math.max(oy1 + MIN_BOX_SIZE, oy2 + dy);
    }
    state.crop.x2 = ox2;
    state.crop.y1 = oy1;
  } else if (mode === 'br') {
    if (lockRatio) {
      const newH = Math.max(MIN_BOX_SIZE, (oy2 - oy1) + dy);
      const newW = newH * asp;
      state.crop.x2 = ox1 + newW;
      state.crop.y2 = oy1 + newH;
    } else {
      state.crop.x2 = Math.max(ox1 + MIN_BOX_SIZE, ox2 + dx);
      state.crop.y2 = Math.max(oy1 + MIN_BOX_SIZE, oy2 + dy);
    }
    state.crop.x1 = ox1;
    state.crop.y1 = oy1;
  } else if (mode === 't') {
    if (lockRatio) {
      const newH = Math.max(MIN_BOX_SIZE, (oy2 - oy1) - dy);
      const newW = newH * asp;
      const cx = (ox1 + ox2) / 2;
      state.crop.x1 = cx - newW / 2;
      state.crop.x2 = cx + newW / 2;
    } else {
      state.crop.x1 = ox1;
      state.crop.x2 = ox2;
    }
    state.crop.y1 = Math.min(oy2 - MIN_BOX_SIZE, oy1 + dy);
    state.crop.y2 = oy2;
  } else if (mode === 'b') {
    if (lockRatio) {
      const newH = Math.max(MIN_BOX_SIZE, (oy2 - oy1) + dy);
      const newW = newH * asp;
      const cx = (ox1 + ox2) / 2;
      state.crop.x1 = cx - newW / 2;
      state.crop.x2 = cx + newW / 2;
    } else {
      state.crop.x1 = ox1;
      state.crop.x2 = ox2;
    }
    state.crop.y1 = oy1;
    state.crop.y2 = Math.max(oy1 + MIN_BOX_SIZE, oy2 + dy);
  } else if (mode === 'l') {
    if (lockRatio) {
      const newW = Math.max(MIN_BOX_SIZE, (ox2 - ox1) - dx);
      const newH = newW / asp;
      const cy = (oy1 + oy2) / 2;
      state.crop.y1 = cy - newH / 2;
      state.crop.y2 = cy + newH / 2;
    } else {
      state.crop.y1 = oy1;
      state.crop.y2 = oy2;
    }
    state.crop.x1 = Math.min(ox2 - MIN_BOX_SIZE, ox1 + dx);
    state.crop.x2 = ox2;
  } else if (mode === 'r') {
    if (lockRatio) {
      const newW = Math.max(MIN_BOX_SIZE, (ox2 - ox1) + dx);
      const newH = newW / asp;
      const cy = (oy1 + oy2) / 2;
      state.crop.y1 = cy - newH / 2;
      state.crop.y2 = cy + newH / 2;
    } else {
      state.crop.y1 = oy1;
      state.crop.y2 = oy2;
    }
    state.crop.x1 = ox1;
    state.crop.x2 = Math.max(ox1 + MIN_BOX_SIZE, ox2 + dx);
  }

  constrainBox();
  if (state.dragStart && state.dragStart.walls) {
    state.crop = clampToWalls(state.crop, state.dragStart.walls, mode === 'move');
  }
  if ((state.useActualSize || state.freeTransform) && !state.fixedOutputSize && mode !== 'move') {
    syncTargetSizeFromCropBox();
  }
  scheduleRedraw();
}

function onPointerUp(event) {
  if (event && els.canvas.hasPointerCapture(event.pointerId)) {
    els.canvas.releasePointerCapture(event.pointerId);
  }
  if (state.doodleDrawing && state.doodleCurrentStroke && state.doodleCurrentStroke.points.length > 0) {
    state.doodleStrokes.push(state.doodleCurrentStroke);
  }
  state.doodleDrawing = false;
  state.doodleCurrentStroke = null;
  state.doodleCursorPos = null;
  state.dragMode = null;
  state.dragStart = null;
  setHoverGuide(null);
  els.canvas.style.cursor = state.doodleMode ? 'crosshair' : '';
  if (state.doodleMode) scheduleRedraw();
}

function cursorForMode(mode) {
  return {
    tl: 'nwse-resize',
    br: 'nwse-resize',
    tr: 'nesw-resize',
    bl: 'nesw-resize',
    t: 'ns-resize',
    b: 'ns-resize',
    l: 'ew-resize',
    r: 'ew-resize',
    vguide: 'col-resize',
    hguide: 'row-resize',
    pan: 'grab',
    move: 'move',
  }[mode] || 'crosshair';
}

// 底部缩放条的缩放范围：自由变换控制图片缩放 (0.1~20)，普通裁切控制预览缩放 (0.2~5)
function getZoomRange() {
  if (state.freeTransform) return { min: 0.1, max: 20 };
  return { min: 0.2, max: 5 };
}

// 将缩放值映射到滑动条值 (0 ~ 1000)，使用对数刻度
function scaleToSlider(scale) {
  const { min, max } = getZoomRange();
  const minLog = Math.log(min);
  const maxLog = Math.log(max);
  return Math.round(((Math.log(scale) - minLog) / (maxLog - minLog)) * 1000);
}

function sliderToScale(value) {
  const { min, max } = getZoomRange();
  const minLog = Math.log(min);
  const maxLog = Math.log(max);
  return Math.exp(minLog + (value / 1000) * (maxLog - minLog));
}

function syncScaleSlider() {
  if (!els.imageScaleSlider) return;
  const { min, max } = getZoomRange();
  const zoom = state.freeTransform ? state.imageUserScale : state.previewZoom;
  els.imageScaleMinLabel.textContent = `${min}×`;
  els.imageScaleMaxLabel.textContent = `${max}×`;
  const sliderVal = scaleToSlider(zoom);
  els.imageScaleSlider.value = String(sliderVal);
  els.imageScaleValue.textContent = `${zoom.toFixed(2)}×`;
  // 更新滑动条渐变背景，反映当前位置
  const pct = (sliderVal / 1000) * 100;
  els.imageScaleSlider.style.background =
    `linear-gradient(to right, var(--accent) 0%, var(--accent) ${pct}%, var(--border) ${pct}%, var(--border) 100%)`;
}

function syncScaleBarVisibility() {
  const show = !!state.currentBitmap;
  els.imageScaleBar.classList.toggle('hidden', !show);
  els.imageScaleBar.setAttribute('aria-hidden', String(!show));
  if (show) syncScaleSlider();
}

// 设置预览缩放。裁切模式以裁切框中心为锚点（框保持不动）；涂鸦模式以鼠标位置为锚点（保持注视点稳定）
function setPreviewZoom(zoom) {
  if (!state.currentBitmap) return;
  const { width: cw, height: ch } = getCanvasSize();
  const baseScale = Math.min((cw * 0.9) / state.currentBitmap.width, (ch * 0.9) / state.currentBitmap.height);
  const newScale = Math.max(0.02, baseScale * zoom);
  const k = newScale / Math.max(0.02, state.basePreviewScale);
  let bx;
  let by;
  if (state.doodleMode) {
    const p = state.lastPointer;
    if (p && p.x >= 0 && p.x <= cw && p.y >= 0 && p.y <= ch) {
      bx = p.x;
      by = p.y;
    } else {
      bx = cw / 2;
      by = ch / 2;
    }
  } else {
    bx = (state.crop.x1 + state.crop.x2) / 2;
    by = (state.crop.y1 + state.crop.y2) / 2;
  }
  state.basePreviewScale = newScale;
  state.basePreviewOffset.x = bx - (bx - state.basePreviewOffset.x) * k;
  state.basePreviewOffset.y = by - (by - state.basePreviewOffset.y) * k;
  if (state.doodleMode) {
    // 涂鸦模式锚点在鼠标处，缩放后限制图片仍盖住画布，避免出现空白
    const clamped = clampPanOffset(state.basePreviewOffset.x, state.basePreviewOffset.y);
    state.basePreviewOffset.x = clamped.x;
    state.basePreviewOffset.y = clamped.y;
  }
  state.previewZoom = zoom;
  constrainBox();
  scheduleRedraw();
  updateInfo();
}

function onWheel(event) {
  if (!state.currentBitmap) return;
  if (state.doodleMode) return;
  event.preventDefault();

  // 自由变换模式下 Shift + 滚轮旋转图片
  if (state.freeTransform && event.shiftKey) {
    const delta = event.deltaY < 0 ? 1 : -1;
    state.imageRotation = (state.imageRotation + delta * 2 + 360) % 360;
    clampImageToBox();
    scheduleRedraw();
    return;
  }

  // 普通模式与自由变换模式一致：滚轮缩放裁切框
  const delta = event.deltaY < 0 ? 1 : -1;
  const cx = (state.crop.x1 + state.crop.x2) / 2;
  const cy = (state.crop.y1 + state.crop.y2) / 2;
  let hw = (state.crop.x2 - state.crop.x1) / 2;
  let hh = (state.crop.y2 - state.crop.y1) / 2;

  if (state.useActualSize || state.freeTransform) {
    const factor = delta > 0 ? 1.04 : 1 / 1.04;
    if (state.fixedOutputSize) {
      hw = Math.max(MIN_BOX_SIZE / 2, hw / factor);
      hh = Math.max(MIN_BOX_SIZE / 2, hh / factor);
    } else {
      hw = Math.max(MIN_BOX_SIZE / 2, hw * factor);
      hh = Math.max(MIN_BOX_SIZE / 2, hh * factor);
    }
  } else {
    const step = event.shiftKey ? 1 : Math.max(2, (state.crop.y2 - state.crop.y1) * 0.03);
    hh = Math.max(MIN_BOX_SIZE / 2, hh + delta * step);
    hw = hh * aspect();
  }

  state.crop.x1 = cx - hw;
  state.crop.x2 = cx + hw;
  state.crop.y1 = cy - hh;
  state.crop.y2 = cy + hh;
  constrainBox();
  if ((state.useActualSize && !state.fixedOutputSize) || state.freeTransform) {
    const factor = delta > 0 ? 1.04 : 1 / 1.04;
    state.targetW = Math.max(1, Math.round(state.targetW * factor));
    state.targetH = Math.max(1, Math.round(state.targetH * factor));
    syncSizeInputs();
  }
  scheduleRedraw();
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/* ---- Guide lines ---- */

// 参考线以图片像素坐标存储（不受预览缩放影响），拖拽时限制裁切框不能越过参考线。
// 以给定裁切框的中心确定其所在的"区间"（最近的两条参考线之间），返回左右上下四堵墙的显示坐标。
function getGuideWallsForBox(box) {
  if (state.freeTransform || !state.currentBitmap) return null;
  if (!state.guides.vertical.length && !state.guides.horizontal.length) return null;
  const cx = (box.x1 + box.x2) / 2;
  const cy = (box.y1 + box.y2) / 2;
  let left = -Infinity;
  let right = Infinity;
  let top = -Infinity;
  let bottom = Infinity;
  for (const v of state.guides.vertical) {
    const gx = v * state.basePreviewScale + state.basePreviewOffset.x;
    if (gx <= cx) left = Math.max(left, gx);
    else right = Math.min(right, gx);
  }
  for (const h of state.guides.horizontal) {
    const gy = h * state.basePreviewScale + state.basePreviewOffset.y;
    if (gy <= cy) top = Math.max(top, gy);
    else bottom = Math.min(bottom, gy);
  }
  return { left, right, top, bottom };
}

// 把裁切框限制在四堵墙内。preserveSize=true（移动整框）时保持宽高不变、整体平移；
// 否则（拉伸边/角）边缘会被墙挡住，允许框缩小。
function clampToWalls(crop, walls, preserveSize = false) {
  if (!walls) return crop;
  let { x1, y1, x2, y2 } = crop;
  const w = x2 - x1;
  const h = y2 - y1;
  const hasLeft = Number.isFinite(walls.left);
  const hasRight = Number.isFinite(walls.right);
  const hasTop = Number.isFinite(walls.top);
  const hasBottom = Number.isFinite(walls.bottom);

  if (preserveSize) {
    if (hasLeft && x1 < walls.left) x1 = walls.left;
    if (hasRight && x1 + w > walls.right) x1 = walls.right - w;
    if (hasTop && y1 < walls.top) y1 = walls.top;
    if (hasBottom && y1 + h > walls.bottom) y1 = walls.bottom - h;
    return { x1, y1, x2: x1 + w, y2: y1 + h };
  }

  if (hasLeft) x1 = Math.max(x1, walls.left);
  if (hasRight) x2 = Math.min(x2, walls.right);
  if (hasTop) y1 = Math.max(y1, walls.top);
  if (hasBottom) y2 = Math.min(y2, walls.bottom);
  // 两条参考线靠得太近时，保证裁切框仍有最小尺寸
  if (x2 - x1 < MIN_BOX_SIZE) {
    if (hasLeft && hasRight) {
      const cx = (walls.left + walls.right) / 2;
      x1 = cx - MIN_BOX_SIZE / 2;
      x2 = cx + MIN_BOX_SIZE / 2;
    } else if (hasLeft) {
      x2 = x1 + MIN_BOX_SIZE;
    } else if (hasRight) {
      x1 = x2 - MIN_BOX_SIZE;
    }
  }
  if (y2 - y1 < MIN_BOX_SIZE) {
    if (hasTop && hasBottom) {
      const cy = (walls.top + walls.bottom) / 2;
      y1 = cy - MIN_BOX_SIZE / 2;
      y2 = cy + MIN_BOX_SIZE / 2;
    } else if (hasTop) {
      y2 = y1 + MIN_BOX_SIZE;
    } else if (hasBottom) {
      y1 = y2 - MIN_BOX_SIZE;
    }
  }
  return { x1, y1, x2, y2 };
}

function applyGuideWalls() {
  const walls = getGuideWallsForBox(state.crop);
  if (!walls) return;
  state.crop = clampToWalls(state.crop, walls);
}

function hitTestGuide(mx, my) {
  if (!state.currentBitmap || state.freeTransform) return null;
  const bounds = getImageDisplayBounds();
  const tol = EDGE_TOL;
  if (mx < bounds.x - tol || mx > bounds.x + bounds.w + tol) return null;
  if (my < bounds.y - tol || my > bounds.y + bounds.h + tol) return null;
  for (let i = 0; i < state.guides.vertical.length; i++) {
    const gx = state.guides.vertical[i] * state.basePreviewScale + state.basePreviewOffset.x;
    if (Math.abs(mx - gx) <= tol) return { axis: 'vertical', index: i };
  }
  for (let i = 0; i < state.guides.horizontal.length; i++) {
    const gy = state.guides.horizontal[i] * state.basePreviewScale + state.basePreviewOffset.y;
    if (Math.abs(my - gy) <= tol) return { axis: 'horizontal', index: i };
  }
  return null;
}

function setHoverGuide(guide) {
  const key = (g) => (g ? `${g.axis}:${g.index}` : '');
  if (key(state.hoverGuide) === key(guide)) return;
  state.hoverGuide = guide;
  scheduleRedraw();
}

function addGuide(axis) {
  if (!state.currentBitmap || state.freeTransform || state.doodleMode) return;
  const imgW = state.currentBitmap.width;
  const imgH = state.currentBitmap.height;
  let base = axis === 'vertical' ? imgW / 2 : imgH / 2;
  // 鼠标悬停在图片上时，把参考线加到鼠标位置
  if (state.lastPointer) {
    const b = getImageDisplayBounds();
    const p = state.lastPointer;
    if (p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h) {
      const bp = displayToBaseImageCoords(p.x, p.y);
      base = axis === 'vertical' ? clamp(bp.x, 0, imgW) : clamp(bp.y, 0, imgH);
    }
  }
  if (axis === 'vertical') state.guides.vertical.push(base);
  else state.guides.horizontal.push(base);
  constrainBox();
  updateGuideButtons();
  setStatus(t('guideAdded'));
  scheduleRedraw();
  updateInfo();
}

function removeGuide(axis, index) {
  if (axis === 'vertical') state.guides.vertical.splice(index, 1);
  else state.guides.horizontal.splice(index, 1);
  state.hoverGuide = null;
  updateGuideButtons();
  updateInfo();
  scheduleRedraw();
}

function clearGuides() {
  state.guides.vertical = [];
  state.guides.horizontal = [];
  state.hoverGuide = null;
  updateGuideButtons();
  setStatus(t('guidesCleared'));
  updateInfo();
  scheduleRedraw();
}

function guidesInfoLine() {
  const v = state.guides.vertical.length;
  const h = state.guides.horizontal.length;
  if (!v && !h) return null;
  return t('infoGuides', { v, h });
}

function updateGuideButtons() {
  const active = !!state.currentBitmap && !state.freeTransform && !state.doodleMode;
  els.addVLineBtn.disabled = !active;
  els.addHLineBtn.disabled = !active;
  els.clearGuidesBtn.disabled = !active || (!state.guides.vertical.length && !state.guides.horizontal.length);
}

function drawGuides() {
  if (!state.currentBitmap || state.freeTransform || state.doodleMode) return;
  if (!state.guides.vertical.length && !state.guides.horizontal.length) return;
  const bounds = getImageDisplayBounds();
  ctx.save();
  ctx.beginPath();
  ctx.rect(bounds.x, bounds.y, bounds.w, bounds.h);
  ctx.clip();
  ctx.setLineDash([7, 5]);
  for (let i = 0; i < state.guides.vertical.length; i++) {
    const gx = state.guides.vertical[i] * state.basePreviewScale + state.basePreviewOffset.x;
    const hovered = state.hoverGuide && state.hoverGuide.axis === 'vertical' && state.hoverGuide.index === i;
    ctx.strokeStyle = hovered ? '#fbbf24' : '#f59e0b';
    ctx.lineWidth = hovered ? 3 : 1.5;
    ctx.beginPath();
    ctx.moveTo(gx, bounds.y);
    ctx.lineTo(gx, bounds.y + bounds.h);
    ctx.stroke();
  }
  for (let i = 0; i < state.guides.horizontal.length; i++) {
    const gy = state.guides.horizontal[i] * state.basePreviewScale + state.basePreviewOffset.y;
    const hovered = state.hoverGuide && state.hoverGuide.axis === 'horizontal' && state.hoverGuide.index === i;
    ctx.strokeStyle = hovered ? '#fbbf24' : '#f59e0b';
    ctx.lineWidth = hovered ? 3 : 1.5;
    ctx.beginPath();
    ctx.moveTo(bounds.x, gy);
    ctx.lineTo(bounds.x + bounds.w, gy);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.restore();
}

function buildStandardExportCanvas() {
  const rect = getCropRectStandard();
  const cropW = rect.x2 - rect.x1;
  const cropH = rect.y2 - rect.y1;
  if (cropW <= 0 || cropH <= 0) return null;

  const outCanvas = document.createElement('canvas');
  outCanvas.width = cropW;
  outCanvas.height = cropH;
  const outCtx = outCanvas.getContext('2d');
  paintBackground(outCtx, cropW, cropH);

  const srcX1 = clamp(rect.x1, 0, state.currentBitmap.width);
  const srcY1 = clamp(rect.y1, 0, state.currentBitmap.height);
  const srcX2 = clamp(rect.x2, 0, state.currentBitmap.width);
  const srcY2 = clamp(rect.y2, 0, state.currentBitmap.height);
  if (srcX2 <= srcX1 || srcY2 <= srcY1) return outCanvas;

  const pasteX = srcX1 - rect.x1;
  const pasteY = srcY1 - rect.y1;
  outCtx.drawImage(
    state.currentBitmap,
    srcX1,
    srcY1,
    srcX2 - srcX1,
    srcY2 - srcY1,
    pasteX,
    pasteY,
    srcX2 - srcX1,
    srcY2 - srcY1,
  );
  return outCanvas;
}

function buildTransformExportCanvas() {
  const boxW = Math.max(1, Math.round(state.crop.x2 - state.crop.x1));
  const boxH = Math.max(1, Math.round(state.crop.y2 - state.crop.y1));
  const outCanvas = document.createElement('canvas');
  outCanvas.width = Math.max(1, state.targetW);
  outCanvas.height = Math.max(1, state.targetH);
  const outCtx = outCanvas.getContext('2d');
  paintBackground(outCtx, outCanvas.width, outCanvas.height);

  const scaleX = outCanvas.width / boxW;
  const scaleY = outCanvas.height / boxH;
  outCtx.setTransform(scaleX, 0, 0, scaleY, 0, 0);

  const { width, height } = getTransformedImageRect();
  const offset = getTransformOffset(width, height);
  const centerX = offset.x + width / 2;
  const centerY = offset.y + height / 2;

  outCtx.save();
  outCtx.translate(centerX - state.crop.x1, centerY - state.crop.y1);
  outCtx.rotate((state.imageRotation * Math.PI) / 180);
  outCtx.drawImage(state.currentBitmap, -width / 2, -height / 2, width, height);
  outCtx.restore();
  return outCanvas;
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error(t('indexedDbBlobFailed')));
    }, 'image/png');
  });
}

function downloadCanvas(canvas, filenameBase) {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filenameBase;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 500);
  }, 'image/png');
}

function openHandleDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error(t('indexedDbOpenFailed')));
  });
}

async function saveHandleToDb(key, value) {
  const db = await openHandleDb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readwrite');
    tx.objectStore(DB_STORE).put(value, key);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error || new Error(t('indexedDbWriteFailed')));
    tx.onabort = () => reject(tx.error || new Error(t('indexedDbWriteAborted')));
  });
  db.close();
}

async function loadHandleFromDb(key) {
  const db = await openHandleDb();
  const value = await new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readonly');
    const req = tx.objectStore(DB_STORE).get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error || new Error(t('indexedDbReadFailed')));
  });
  db.close();
  return value;
}

async function clearHandleFromDb(key) {
  const db = await openHandleDb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readwrite');
    tx.objectStore(DB_STORE).delete(key);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error || new Error(t('indexedDbDeleteFailed')));
    tx.onabort = () => reject(tx.error || new Error(t('indexedDbDeleteAborted')));
  });
  db.close();
}

async function ensureDirectoryPermission(handle, mode = 'readwrite') {
  if (!handle) return false;
  const options = { mode };
  if ((await handle.queryPermission(options)) === 'granted') return true;
  if ((await handle.requestPermission(options)) === 'granted') return true;
  return false;
}

async function restoreSavedDirectoryHandle() {
  if (!state.supportsDirectoryPicker) {
    updateSaveDirInfo();
    return;
  }
  try {
    const handle = await loadHandleFromDb(SAVE_DIR_KEY);
    if (!handle) {
      updateSaveDirInfo();
      return;
    }
    const hasPermission = await ensureDirectoryPermission(handle, 'readwrite');
    if (!hasPermission) {
      await clearHandleFromDb(SAVE_DIR_KEY);
      state.saveDirectoryHandle = null;
      state.saveDirectoryName = '';
      updateSaveDirInfo();
      return;
    }
    state.saveDirectoryHandle = handle;
    state.saveDirectoryName = handle.name || 'selected-folder';
    updateSaveDirInfo();
    setStatus(t('saveLocationRestored', { name: state.saveDirectoryName }));
  } catch {
    state.saveDirectoryHandle = null;
    state.saveDirectoryName = '';
    updateSaveDirInfo();
  }
}

async function chooseSaveDirectory() {
  if (!state.supportsDirectoryPicker) {
    setStatus(t('browserNoPickerFallback'));
    updateSaveDirInfo();
    return;
  }
  try {
    const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
    const granted = await ensureDirectoryPermission(handle, 'readwrite');
    if (!granted) {
      setStatus(t('directoryPermissionDenied'));
      return;
    }
    state.saveDirectoryHandle = handle;
    state.saveDirectoryName = handle.name || 'selected-folder';
    await saveHandleToDb(SAVE_DIR_KEY, handle);
    updateSaveDirInfo();
    setStatus(t('saveLocationSetStatus', { name: state.saveDirectoryName }));
  } catch (error) {
    if (error && error.name === 'AbortError') return;
    setStatus(t('saveLocationSetFailed'));
  }
}

async function writeBlobToDirectory(filename, blob, subfolder = null) {
  if (!state.saveDirectoryHandle) return false;
  const granted = await ensureDirectoryPermission(state.saveDirectoryHandle, 'readwrite');
  if (!granted) {
    throw new Error(t('directoryPermissionDenied'));
  }
  let dir = state.saveDirectoryHandle;
  if (subfolder) {
    dir = await state.saveDirectoryHandle.getDirectoryHandle(subfolder, { create: true });
  }
  const fileHandle = await dir.getFileHandle(filename, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(blob);
  await writable.close();
  return true;
}

function buildDoodleExportCanvas() {
  // Render the full image + doodle strokes, keeping the aspect ratio
  const imgW = state.currentBitmap.width;
  const imgH = state.currentBitmap.height;
  const outCanvas = document.createElement('canvas');
  outCanvas.width = imgW;
  outCanvas.height = imgH;
  const outCtx = outCanvas.getContext('2d');

  // Draw the image at its natural size
  outCtx.drawImage(state.currentBitmap, 0, 0);

  if (!state.doodleStrokes.length) return outCanvas;

  // 笔画已存为图片坐标与图片宽度，直接绘制
  for (const stroke of state.doodleStrokes) {
    if (stroke.points.length < 2) continue;
    outCtx.strokeStyle = stroke.color;
    outCtx.lineWidth = stroke.size;
    outCtx.lineCap = 'round';
    outCtx.lineJoin = 'round';
    outCtx.beginPath();
    outCtx.moveTo(stroke.points[0].x, stroke.points[0].y);
    for (let i = 1; i < stroke.points.length; i++) {
      const p = stroke.points[i];
      const pm = { x: (stroke.points[i - 1].x + p.x) / 2, y: (stroke.points[i - 1].y + p.y) / 2 };
      outCtx.quadraticCurveTo(p.x, p.y, pm.x, pm.y);
    }
    const plast = stroke.points[stroke.points.length - 1];
    outCtx.lineTo(plast.x, plast.y);
    outCtx.stroke();
  }
  return outCanvas;
}

// 生成涂鸦蒙版：黑底 + 白色笔画，尺寸与源图一致（用于图片+蒙版训练）
function buildDoodleMaskCanvas() {
  const imgW = state.currentBitmap.width;
  const imgH = state.currentBitmap.height;
  const outCanvas = document.createElement('canvas');
  outCanvas.width = imgW;
  outCanvas.height = imgH;
  const outCtx = outCanvas.getContext('2d');

  outCtx.fillStyle = '#000000';
  outCtx.fillRect(0, 0, imgW, imgH);

  if (!state.doodleStrokes.length) return outCanvas;

  // 笔画已存为图片坐标与图片宽度，直接绘制（蒙版为白色不透明）
  outCtx.fillStyle = '#ffffff';
  outCtx.strokeStyle = '#ffffff';
  outCtx.lineCap = 'round';
  outCtx.lineJoin = 'round';

  for (const stroke of state.doodleStrokes) {
    if (stroke.points.length < 2) {
      // 单点笔画：画成圆点
      const p = stroke.points[0];
      outCtx.beginPath();
      outCtx.arc(p.x, p.y, Math.max(1, stroke.size / 2), 0, Math.PI * 2);
      outCtx.fill();
      continue;
    }
    outCtx.lineWidth = stroke.size;
    outCtx.beginPath();
    outCtx.moveTo(stroke.points[0].x, stroke.points[0].y);
    for (let i = 1; i < stroke.points.length; i++) {
      const p = stroke.points[i];
      const pm = { x: (stroke.points[i - 1].x + p.x) / 2, y: (stroke.points[i - 1].y + p.y) / 2 };
      outCtx.quadraticCurveTo(p.x, p.y, pm.x, pm.y);
    }
    const plast = stroke.points[stroke.points.length - 1];
    outCtx.lineTo(plast.x, plast.y);
    outCtx.stroke();
  }
  return outCanvas;
}

// 将画布保存为文件：优先保存到设置的目录（可指定子文件夹），否则浏览器下载；失败时回退为下载
async function saveCanvasAs(outCanvas, filename, subfolder = null) {
  try {
    const blob = await canvasToBlob(outCanvas);
    if (state.saveDirectoryHandle) {
      await writeBlobToDirectory(filename, blob, subfolder);
    } else {
      downloadCanvas(outCanvas, subfolder ? `${subfolder}_${filename}` : filename);
    }
  } catch (error) {
    downloadCanvas(outCanvas, subfolder ? `${subfolder}_${filename}` : filename);
  }
}

async function saveCrop() {
  if (!state.currentBitmap || !state.currentImage) return;
  refitBoxToAspect();

  // 涂鸦模式：按"输出"选项保存 涂鸦图片 / 蒙版 / 图片+蒙版
  if (state.doodleMode) {
    // 输出文件名与源文件基名一致，分别存入 doodle / mask 子文件夹
    const baseName = state.currentImage.file.name.replace(/\.[^.]+$/, '');
    const doodleName = `${baseName}.png`;
    const maskName = `${baseName}.png`;
    if (state.doodleOutput === 'mask') {
      await saveCanvasAs(buildDoodleMaskCanvas(), maskName, 'mask');
      setStatus(t('doodleMaskSaved', { name: `mask/${maskName}` }));
    } else if (state.doodleOutput === 'both') {
      await saveCanvasAs(buildDoodleExportCanvas(), doodleName, 'doodle');
      await saveCanvasAs(buildDoodleMaskCanvas(), maskName, 'mask');
      setStatus(t('doodleBothSaved', { img: `doodle/${doodleName}`, mask: `mask/${maskName}` }));
    } else {
      await saveCanvasAs(buildDoodleExportCanvas(), doodleName, 'doodle');
      setStatus(t('doodleSaved', { name: `doodle/${doodleName}` }));
    }
    if (state.imageIndex < state.imageItems.length - 1) {
      state.imageIndex += 1;
      await loadCurrentImage();
    }
    return;
  }

  let outCanvas;
  let actualW;
  let actualH;

  if (state.freeTransform) {
    outCanvas = buildTransformExportCanvas();
    actualW = outCanvas.width;
    actualH = outCanvas.height;
  } else {
    outCanvas = buildStandardExportCanvas();
    if (!outCanvas) {
      setStatus(t('invalidCropArea'));
      return;
    }
    if (state.useActualSize) {
      const resized = document.createElement('canvas');
      resized.width = state.targetW;
      resized.height = state.targetH;
      resized.getContext('2d').drawImage(outCanvas, 0, 0, resized.width, resized.height);
      outCanvas = resized;
      actualW = state.targetW;
      actualH = state.targetH;
    } else {
      actualW = outCanvas.width;
      actualH = outCanvas.height;
    }
  }

  const rawName = state.currentImage.file.name.replace(/\.[^.]+$/, '');
  const filename = `${rawName}_crop_${actualW}x${actualH}.png`;

  await saveCanvasAs(outCanvas, filename);
  setStatus(t('savedToFolder', { name: filename }));

  if (state.imageIndex < state.imageItems.length - 1) {
    state.imageIndex += 1;
    await loadCurrentImage();
  }
}

function nudge(dx, dy) {
  if (!state.currentBitmap) return;
  state.crop.x1 += dx;
  state.crop.x2 += dx;
  state.crop.y1 += dy;
  state.crop.y2 += dy;
  constrainBox();
  scheduleRedraw();
}

function bindEvents() {
  els.multiFileInput.addEventListener('change', async (event) => {
    const files = [...event.target.files]
      .filter((file) => file.type.startsWith('image/'))
      .sort((a, b) => {
        const pathA = (a.webkitRelativePath || a.name).toLowerCase();
        const pathB = (b.webkitRelativePath || b.name).toLowerCase();
        return pathA.localeCompare(pathB, state.language === 'zh' ? 'zh-CN' : 'en');
      });
    await loadImageList(files);
    if (files.length) {
      const folderName = files[0].webkitRelativePath.split('/')[0] || 'folder';
      const size = state.currentBitmap ? `${state.currentBitmap.width} x ${state.currentBitmap.height}` : '';
      setStatus(t('loadedFolder', { name: folderName, size }));
    } else {
      setStatus(t('noImagesInFolder'));
    }
    event.target.value = '';
  });

  els.chooseSaveDirBtn.addEventListener('click', chooseSaveDirectory);

  els.prevBtn.addEventListener('click', async () => {
    if (state.imageIndex > 0) {
      state.imageIndex -= 1;
      await loadCurrentImage();
    }
  });

  els.nextBtn.addEventListener('click', async () => {
    if (state.imageIndex < state.imageItems.length - 1) {
      state.imageIndex += 1;
      await loadCurrentImage();
    }
  });

  els.saveBtn.addEventListener('click', () => {
    saveCrop();
  });

  els.swapSizeBtn.addEventListener('click', () => {
    [state.targetW, state.targetH] = [state.targetH, state.targetW];
    syncSizeInputs();
    if (state.currentBitmap) {
      if (state.freeTransform || state.useActualSize) {
        fitImageToCanvas(true);
      } else {
        applyAspectToBox();
        constrainBox();
        scheduleRedraw();
      }
    }
  });

  els.addPresetBtn.addEventListener('click', () => {
    if (!applySizeInputs()) {
      setStatus(t('enterValidSize'));
      return;
    }
    state.presets = uniqueSizes([...state.presets, [state.targetW, state.targetH]]);
    savePresets();
    renderPresets();
    setStatus(t('addedPreset', { size: `${state.targetW} x ${state.targetH}` }));
  });

  els.widthInput.addEventListener('input', applySizeInputs);
  els.heightInput.addEventListener('input', applySizeInputs);

  els.actualSizeCheck.addEventListener('change', () => {
    state.useActualSize = els.actualSizeCheck.checked;
    applySizeInputs();
  });

  els.fixedOutputSizeCheck.checked = state.fixedOutputSize;
  els.fixedOutputSizeCheck.disabled = false;
  els.fixedOutputSizeCheck.addEventListener('change', () => {
    state.fixedOutputSize = els.fixedOutputSizeCheck.checked;
    if (state.currentBitmap) {
      constrainBox();
      scheduleRedraw();
    }
  });

  els.freeTransformCheck.addEventListener('change', () => {
    state.freeTransform = els.freeTransformCheck.checked;
    setStatus(t('modeSwitched'));
    if (state.currentBitmap) {
      fitImageToCanvas(true);
    } else {
      scheduleRedraw();
    }
    updateGuideButtons();
    syncScaleBarVisibility();
  });

  els.constrainCheck.addEventListener('change', () => {
    state.constrain = els.constrainCheck.checked;
    constrainBox();
    scheduleRedraw();
  });

  els.fillBgCheck.addEventListener('change', () => {
    state.fillBackground = els.fillBgCheck.checked;
    syncFillBackgroundControls();
    scheduleRedraw();
  });

  els.fillTransparentCheck.addEventListener('change', () => {
    state.fillTransparent = els.fillTransparentCheck.checked;
    syncFillBackgroundControls();
    scheduleRedraw();
  });

  els.fillColorInput.addEventListener('input', () => {
    state.fillColor = els.fillColorInput.value || '#000000';
    syncFillBackgroundControls();
    scheduleRedraw();
  });

  els.imageScaleSlider.addEventListener('input', () => {
    const val = Number(els.imageScaleSlider.value);
    const { min, max } = getZoomRange();
    const zoom = clamp(sliderToScale(val), min, max);
    if (state.freeTransform) {
      state.imageUserScale = zoom;
      syncScaleSlider();
      scheduleRedraw();
      updateInfo();
    } else {
      setPreviewZoom(zoom);
      syncScaleSlider();
    }
  });

  // 双击缩放条或点击右侧倍率文字，恢复 100% 并让图片居中
  const resetZoom = () => {
    if (!state.currentBitmap) return;
    if (state.freeTransform) {
      state.imageUserScale = 1;
      state.imageTx = 0;
      state.imageTy = 0;
      state.previewZoom = 1;
      fitImageToCanvas(true);
    } else {
      // 恢复 100% 并重新居中图片（裁切框跟随图片移动，保持与图片内容的相对位置不变）
      state.previewZoom = 1;
      const { width: cw, height: ch } = getCanvasSize();
      const baseScale = Math.min((cw * 0.9) / state.currentBitmap.width, (ch * 0.9) / state.currentBitmap.height);
      const newScale = Math.max(0.02, baseScale);
      const dispW = state.currentBitmap.width * newScale;
      const dispH = state.currentBitmap.height * newScale;
      const newX = (cw - dispW) / 2;
      const newY = (ch - dispH) / 2;
      const dx = newX - state.basePreviewOffset.x;
      const dy = newY - state.basePreviewOffset.y;
      state.basePreviewScale = newScale;
      state.basePreviewOffset = { x: newX, y: newY };
      state.crop.x1 += dx;
      state.crop.x2 += dx;
      state.crop.y1 += dy;
      state.crop.y2 += dy;
      constrainBox();
    }
    syncScaleSlider();
    scheduleRedraw();
    setStatus(t('previewZoomReset'));
  };
  els.imageScaleSlider.addEventListener('dblclick', resetZoom);
  els.imageScaleValue.addEventListener('click', resetZoom);

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
      COLORS = readColors();
      scheduleRedraw();
    }
  });

  els.canvas.addEventListener('pointerdown', onPointerDown);
  els.canvas.addEventListener('pointermove', onPointerMove);
  els.canvas.addEventListener('pointerup', onPointerUp);
  els.canvas.addEventListener('pointercancel', onPointerUp);
  els.canvas.addEventListener('pointerleave', onPointerUp);
  els.canvas.addEventListener('wheel', onWheel, { passive: false });

  // Doodle mode
  els.doodleModeBtn.addEventListener('click', toggleDoodleMode);
  for (const [radio, value] of [[els.doodleOutImage, 'image'], [els.doodleOutMask, 'mask'], [els.doodleOutBoth, 'both']]) {
    radio.addEventListener('change', () => {
      if (radio.checked) state.doodleOutput = value;
    });
  }

  // Guide lines
  els.addVLineBtn.addEventListener('click', () => addGuide('vertical'));
  els.addHLineBtn.addEventListener('click', () => addGuide('horizontal'));
  els.clearGuidesBtn.addEventListener('click', clearGuides);

  els.canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    const { x, y } = getPointerPos(event);
    const hit = hitTestGuide(x, y);
    if (hit) {
      removeGuide(hit.axis, hit.index);
      setStatus(t('guideDeleted'));
    }
  });

  els.brushSizeSlider.addEventListener('input', () => {
    state.doodleBrushSize = Number(els.brushSizeSlider.value);
    els.brushSizeValue.textContent = `${state.doodleBrushSize}px`;
    updateBrushSliderBg();
  });

  els.brushOpacitySlider.addEventListener('input', () => {
    state.doodleOpacity = Number(els.brushOpacitySlider.value) / 100;
    els.brushOpacityValue.textContent = `${Math.round(state.doodleOpacity * 100)}%`;
    updateBrushOpacityBg();
  });

  els.doodleColorInput.addEventListener('input', () => {
    state.doodleColor = els.doodleColorInput.value;
    updateColorSwatchActive();
  });

  els.undoStrokeBtn.addEventListener('click', () => {
    if (state.doodleStrokes.length > 0) {
      state.doodleStrokes.pop();
      scheduleRedraw();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (!state.currentBitmap) return;
    const target = event.target;
    const typing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT');

    // 方向键移动裁切框（并阻止页面随之滚动）
    if (!typing && !state.doodleMode) {
      if (event.key.startsWith('Arrow')) event.preventDefault();
      if (event.key === 'ArrowLeft') nudge(-1, 0);
      if (event.key === 'ArrowRight') nudge(1, 0);
      if (event.key === 'ArrowUp') nudge(0, -1);
      if (event.key === 'ArrowDown') nudge(0, 1);
    }

    // WASD 切换上一张 / 下一张（输入框聚焦时不触发）
    if (!typing && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const key = event.key.toLowerCase();
      if (key === 'w' || key === 'a') els.prevBtn.click();
      if (key === 's' || key === 'd') els.nextBtn.click();
      // R/Q/E：交换宽高 / 勾选固定导出尺寸 / 保存（一次性操作，长按不重复）
      if (!event.repeat) {
        if (key === 'e') {
          saveCrop();
        } else if (!state.doodleMode) {
          if (key === 'r') els.swapSizeBtn.click();
          else if (key === 'q') els.fixedOutputSizeCheck.click();
        }
      }
    }

    // 按住空格：涂鸦模式下平移取景
    if (event.code === 'Space' && state.doodleMode && !typing) {
      state.spacePan = true;
      event.preventDefault();
    }

    if (event.key.toLowerCase() === 's' && event.ctrlKey) {
      event.preventDefault();
      saveCrop();
    }
    if (event.key.toLowerCase() === 'z' && event.ctrlKey && state.doodleMode) {
      event.preventDefault();
      if (state.doodleStrokes.length > 0) {
        state.doodleStrokes.pop();
        scheduleRedraw();
      }
    }
  });

  // 松开空格结束平移
  window.addEventListener('keyup', (event) => {
    if (event.code === 'Space') state.spacePan = false;
  });

  window.addEventListener('resize', handleViewportResize);
  window.addEventListener('fullscreenchange', handleViewportResize);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', handleViewportResize);
  }
}

const DOODLE_PALETTE = [
  '#ff0000', '#ff4500', '#ff8c00', '#ffd700', '#ffff00', '#9acd32',
  '#32cd32', '#00ced1', '#1e90ff', '#4169e1', '#8a2be2', '#ff69b4',
  '#ffffff', '#808080', '#000000', '#8b4513',
];

function updateBrushSliderBg() {
  const pct = ((state.doodleBrushSize - 1) / 49) * 100;
  els.brushSizeSlider.style.background =
    `linear-gradient(to right, var(--accent) 0%, var(--accent) ${pct}%, var(--border) ${pct}%, var(--border) 100%)`;
}

function updateBrushOpacityBg() {
  const pct = ((Number(els.brushOpacitySlider.value) - 5) / 95) * 100;
  els.brushOpacitySlider.style.background =
    `linear-gradient(to right, var(--accent) 0%, var(--accent) ${pct}%, var(--border) ${pct}%, var(--border) 100%)`;
}

function updateColorSwatchActive() {
  for (const swatch of els.colorPalette.querySelectorAll('.color-swatch')) {
    swatch.classList.toggle('active', swatch.dataset.color === state.doodleColor);
  }
}

function initColorPalette() {
  els.colorPalette.innerHTML = '';
  for (const color of DOODLE_PALETTE) {
    const swatch = document.createElement('div');
    swatch.className = 'color-swatch';
    swatch.dataset.color = color;
    swatch.style.backgroundColor = color;
    if (color === state.doodleColor) swatch.classList.add('active');
    swatch.title = color;
    swatch.addEventListener('click', () => {
      state.doodleColor = color;
      els.doodleColorInput.value = color;
      updateColorSwatchActive();
    });
    els.colorPalette.appendChild(swatch);
  }
}

function toggleDoodleMode() {
  state.doodleMode = !state.doodleMode;
  els.doodleModeBtn.classList.toggle('active', state.doodleMode);
  els.doodlePanel.style.display = state.doodleMode ? '' : 'none';

  if (state.doodleMode) {
    state.freeTransform = false;
    els.freeTransformCheck.checked = false;
    els.saveBtn.textContent = t('doodleSaveBtn');
    document.querySelector('.app-shell').classList.add('doodle-mode');
    setStatus(t('doodleActive'));
  } else {
    els.saveBtn.textContent = t('saveBtn');
    document.querySelector('.app-shell').classList.remove('doodle-mode');
    setStatus(t('cropActive'));
  }

  // Reset strokes when switching
  state.doodleStrokes = [];
  state.doodleDrawing = false;
  state.doodleCurrentStroke = null;
  state.doodleCursorPos = null;
  state.dragMode = null;
  state.dragStart = null;

  els.tipsText.textContent = state.doodleMode ? t('doodleTips') : t('tipsText');
  updateGuideButtons();
  // 先让缩放条就位（涂鸦模式隐藏、退出后显示），再按实际画布尺寸居中
  syncScaleBarVisibility();
  if (state.currentBitmap) {
    fitImageToCanvas(true);
  }
  scheduleRedraw();
}

async function init() {
  renderPresets();
  syncSizeInputs();
  syncFillBackgroundControls();
  if (els.fixedOutputSizeCheck) {
    els.fixedOutputSizeCheck.checked = state.fixedOutputSize;
    els.fixedOutputSizeCheck.disabled = false;
  }
  bindEvents();
  initColorPalette();
  updateBrushSliderBg();
  updateBrushOpacityBg();
  els.brushOpacityValue.textContent = `${Math.round(state.doodleOpacity * 100)}%`;
  updateNavButtons();
  updateGuideButtons();
  updateSaveDirInfo();
  applyI18n();
  setStatus(t('statusReady'));
  setNav(t('navEmpty'));
  // 立即同步 canvas 内部像素尺寸，避免绘制前 canvas 停留在 300×150 默认值而被 CSS 拉伸
  updateCanvasSize();
  scheduleRedraw();
  await restoreSavedDirectoryHandle();

  // 修复：canvas 内部像素尺寸与 CSS 显示尺寸不同步时，绘制内容会被浏览器拉伸变形
  // （初次打开 iframe 布局抖动、字体加载等会让 canvas 经历中间尺寸）。
  // 1) ResizeObserver 监听 CSS 尺寸变化，变化时重新同步内部像素并重绘
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(() => {
      if (state.redrawPending) return;
      scheduleRedraw();
    });
    observer.observe(els.canvas);
  }
  // 2) 非 rAF 兜底：布局稳定后直接同步并重绘（不依赖 requestAnimationFrame 时序）
  window.setTimeout(() => redraw(), 120);
  window.setTimeout(() => redraw(), 500);
  // 3) 字体/布局完全稳定后（load 事件）再强制同步一次
  window.addEventListener('load', () => {
    scheduleRedraw();
    window.setTimeout(() => redraw(), 100);
  });
}

init();
