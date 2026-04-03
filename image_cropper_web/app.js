const MIN_BOX_SIZE = 24;
const EDGE_TOL = 10;
const HANDLE_SIZE = 6;
const LANGUAGE_KEY = 'image-cropper-web-language';
const LANGUAGE_SYNC_MESSAGE = 'web-tools-hub:set-language';
const DEFAULT_SIZES = [
  [512, 512],
  [768, 512],
  [512, 768],
  [1024, 1024],
];
const DB_NAME = 'image-cropper-web';
const DB_STORE = 'handles';
const SAVE_DIR_KEY = 'save-directory';

const COLORS = {
  canvas: '#f9fbff',
  mask: 'rgba(0, 0, 0, 0.42)',
  accent: '#3b82f6',
  success: '#16a34a',
  textDim: '#6b7280',
  grid: 'rgba(255, 255, 255, 0.7)',
};

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
    actualSizeLabel: '按实际尺寸预览',
    sizeHint: '未勾选时按比例裁切；勾选后输入尺寸会直接控制实际输出尺寸。',
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
    tipsText: '裁切框模式：\n• 拖动框内移动裁切框\n• 拖动边或角调整裁切框\n• Ctrl + 拖动可锁定比例\n• 滚轮缩放裁切框\n\n图片自由变换模式：\n• 拖动图片移动取景\n• 滚轮缩放图片\n• Shift + 滚轮旋转图片\n• 导出结果与框内内容保持一致',
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
    loadedFolder: '已加载文件夹：{name}（{count} 张图片）',
    noImagesInFolder: '所选文件夹中未找到图片',
    enterValidSize: '请输入有效的宽度和高度',
    addedPreset: '已添加预设：{size}',
    modeSwitched: '模式已切换',
    previewZoomReset: '预览缩放已重置为 100%',
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
    actualSizeLabel: 'Preview at actual size',
    sizeHint: 'When unchecked, cropping follows the ratio; when checked, the entered size directly controls the real output size.',
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
    tipsText: 'Crop box mode:\n• Drag inside the box to move it\n• Drag edges or corners to resize it\n• Hold Ctrl while dragging to lock aspect ratio\n• Use the mouse wheel to scale the crop box\n\nFree transform mode:\n• Drag the image to reposition framing\n• Use the mouse wheel to scale the image\n• Shift + mouse wheel rotates the image\n• Exported output matches the framed content',
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
    loadedFolder: 'Loaded folder: {name} ({count} images)',
    noImagesInFolder: 'No images found in selected folder',
    enterValidSize: 'Enter valid width and height',
    addedPreset: 'Added preset: {size}',
    modeSwitched: 'Mode switched',
    previewZoomReset: 'Preview zoom reset to 100%',
  },
};

const els = {
  fileInput: document.getElementById('fileInput'),
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
  zoomInBtn: document.getElementById('zoomInBtn'),
  zoomResetBtn: document.getElementById('zoomResetBtn'),
  zoomOutBtn: document.getElementById('zoomOutBtn'),
  langToggleBtn: document.getElementById('langToggleBtn'),
  canvas: document.getElementById('previewCanvas'),
  imageScaleBar: document.getElementById('imageScaleBar'),
  imageScaleSlider: document.getElementById('imageScaleSlider'),
  imageScaleValue: document.getElementById('imageScaleValue'),
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

  els.langToggleBtn.textContent = t('langToggle');
  els.langToggleBtn.setAttribute('aria-label', t('langToggleLabel'));
  els.langToggleBtn.setAttribute('title', t('langToggleLabel'));
  els.addPresetBtn.setAttribute('aria-label', t('addPresetLabel'));
  els.addPresetBtn.setAttribute('title', t('addPresetLabel'));
  els.zoomInBtn.setAttribute('aria-label', t('zoomInLabel'));
  els.zoomInBtn.setAttribute('title', t('zoomInLabel'));
  els.zoomResetBtn.setAttribute('aria-label', t('zoomResetLabel'));
  els.zoomResetBtn.setAttribute('title', t('zoomResetLabel'));
  els.zoomOutBtn.setAttribute('aria-label', t('zoomOutLabel'));
  els.zoomOutBtn.setAttribute('title', t('zoomOutLabel'));
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
  const panelRect = els.canvas.parentElement?.getBoundingClientRect();
  const canvasRect = els.canvas.getBoundingClientRect();
  const width = Math.round(panelRect?.width || canvasRect.width || els.canvas.clientWidth || 300);
  const height = Math.round(panelRect?.height || canvasRect.height || els.canvas.clientHeight || 360);
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
    redraw();
  });
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
    return;
  }

  if (w > bounds.x2 - bounds.x1 || h > bounds.y2 - bounds.y1) {
    state.crop = { x1, y1, x2: x1 + w, y2: y1 + h };
    return;
  }

  x1 = Math.max(bounds.x1, Math.min(x1, bounds.x2 - w));
  y1 = Math.max(bounds.y1, Math.min(y1, bounds.y2 - h));
  state.crop = { x1, y1, x2: x1 + w, y2: y1 + h };
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
  const boxW = Math.max(1, state.crop.x2 - state.crop.x1);
  const boxH = Math.max(1, state.crop.y2 - state.crop.y1);
  const rad = (state.imageRotation * Math.PI) / 180;
  const rotW = Math.abs(state.currentBitmap.width * Math.cos(rad)) + Math.abs(state.currentBitmap.height * Math.sin(rad));
  const rotH = Math.abs(state.currentBitmap.width * Math.sin(rad)) + Math.abs(state.currentBitmap.height * Math.cos(rad));
  const { width: cw, height: ch } = getCanvasSize();
  const fitW = Math.max(boxW + 40, cw * 0.85);
  const fitH = Math.max(boxH + 40, ch * 0.85);
  const fitScale = Math.min(fitW / Math.max(1, rotW), fitH / Math.max(1, rotH));
  const drawScale = Math.max(0.02, fitScale * state.imageUserScale * state.previewZoom);
  return {
    width: state.currentBitmap.width * drawScale,
    height: state.currentBitmap.height * drawScale,
    drawScale,
  };
}

function getTransformOffset(width, height) {
  const boxCx = (state.crop.x1 + state.crop.x2) / 2;
  const boxCy = (state.crop.y1 + state.crop.y2) / 2;
  return {
    x: boxCx - width / 2 + state.imageTx,
    y: boxCy - height / 2 + state.imageTy,
  };
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
    els.infoText.textContent = [
      t('infoModeCrop'),
      t('infoInputSize', { size: `${state.targetW} x ${state.targetH}` }),
      t('infoOutputSize', { size: `${state.targetW} x ${state.targetH}` }),
      t('infoSourceSample', { size: `${rawW} x ${rawH}` }),
      t('infoOverflowFill', { value: getFillDescription() }),
      t('infoExportResized'),
    ].join('\n');
  } else {
    els.infoText.textContent = [
      t('infoModeCrop'),
      t('infoAspect', { size: `${state.targetW} x ${state.targetH}` }),
      t('infoCurrentOutput', { size: `${rawW} x ${rawH}` }),
      t('infoOverflowFill', { value: getFillDescription() }),
      t('infoDragCropBox'),
    ].join('\n');
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

  const { x1, y1, x2, y2 } = state.crop;
  const borderColor = state.freeTransform ? COLORS.accent : COLORS.success;

  ctx.save();
  ctx.fillStyle = COLORS.mask;
  ctx.fillRect(0, 0, cw, y1);
  ctx.fillRect(0, y2, cw, ch - y2);
  ctx.fillRect(0, y1, x1, y2 - y1);
  ctx.fillRect(x2, y1, cw - x2, y2 - y1);
  ctx.restore();

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
  await loadCurrentImage();
}

async function loadCurrentImage() {
  if (state.imageIndex < 0 || state.imageIndex >= state.imageItems.length) return;
  const item = state.imageItems[state.imageIndex];
  const bitmap = await createImageBitmap(item.file);
  state.currentBitmap = bitmap;
  state.currentImage = item;
  resetTransformState();
  fitImageToCanvas(true);
  setNav(`${state.imageIndex + 1} / ${state.imageItems.length} - ${item.file.name}`);
  setStatus(t('loadedImage', { name: item.file.name, size: `${bitmap.width} x ${bitmap.height}` }));
  updateNavButtons();
  syncScaleBarVisibility();
}

function updateNavButtons() {
  els.prevBtn.disabled = state.imageIndex <= 0;
  els.nextBtn.disabled = state.imageIndex >= state.imageItems.length - 1;
}

function zoomPreview(factor) {
  if (!state.currentBitmap) return;
  state.previewZoom = Math.max(0.2, Math.min(state.previewZoom * factor, 5));
  fitImageToCanvas(state.freeTransform || state.useActualSize);
  setStatus(t('previewZoom', { value: Math.round(state.previewZoom * 100) }));
}

function onPointerDown(event) {
  if (!state.currentBitmap) return;
  const { x, y } = getPointerPos(event);
  els.canvas.setPointerCapture(event.pointerId);
  if (state.freeTransform) {
    state.dragMode = 'image_move';
    state.dragStart = { x, y, tx: state.imageTx, ty: state.imageTy };
    return;
  }
  const mode = hitTest(x, y);
  if (!mode) return;
  state.dragMode = mode;
  state.dragStart = {
    x, y, ...state.crop,
    boxW: state.crop.x2 - state.crop.x1,
    boxH: state.crop.y2 - state.crop.y1,
    tw: state.targetW,
    th: state.targetH,
  };
}

function onPointerMove(event) {
  const { x, y } = getPointerPos(event);
  if (!state.dragMode || !state.dragStart) {
    const mode = state.freeTransform ? 'move' : hitTest(x, y);
    els.canvas.style.cursor = cursorForMode(mode);
    return;
  }

  if (state.freeTransform && state.dragMode === 'image_move') {
    state.imageTx = state.dragStart.tx + (x - state.dragStart.x);
    state.imageTy = state.dragStart.ty + (y - state.dragStart.y);
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
  if (state.useActualSize && mode !== 'move') {
    syncTargetSizeFromCropBox();
  }
  scheduleRedraw();
}

function onPointerUp(event) {
  if (event && els.canvas.hasPointerCapture(event.pointerId)) {
    els.canvas.releasePointerCapture(event.pointerId);
  }
  state.dragMode = null;
  state.dragStart = null;
}

function cursorForMode(mode) {
  if (state.freeTransform) return 'grab';
  return {
    tl: 'nwse-resize',
    br: 'nwse-resize',
    tr: 'nesw-resize',
    bl: 'nesw-resize',
    t: 'ns-resize',
    b: 'ns-resize',
    l: 'ew-resize',
    r: 'ew-resize',
    move: 'move',
  }[mode] || 'crosshair';
}

// 将 imageUserScale (0.1 ~ 20) 映射到滑动条值 (0 ~ 1000)，使用对数刻度
function scaleToSlider(scale) {
  const minLog = Math.log(0.1);
  const maxLog = Math.log(20);
  return Math.round(((Math.log(scale) - minLog) / (maxLog - minLog)) * 1000);
}

function sliderToScale(value) {
  const minLog = Math.log(0.1);
  const maxLog = Math.log(20);
  return Math.exp(minLog + (value / 1000) * (maxLog - minLog));
}

function syncScaleSlider() {
  if (!els.imageScaleSlider) return;
  const sliderVal = scaleToSlider(state.imageUserScale);
  els.imageScaleSlider.value = String(sliderVal);
  els.imageScaleValue.textContent = `${state.imageUserScale.toFixed(2)}×`;
  // 更新滑动条渐变背景，反映当前位置
  const pct = (sliderVal / 1000) * 100;
  els.imageScaleSlider.style.background =
    `linear-gradient(to right, var(--accent) 0%, var(--accent) ${pct}%, var(--border) ${pct}%, var(--border) 100%)`;
}

function syncScaleBarVisibility() {
  const show = state.freeTransform && !!state.currentBitmap;
  els.imageScaleBar.classList.toggle('hidden', !show);
  els.imageScaleBar.setAttribute('aria-hidden', String(!show));
  if (show) syncScaleSlider();
}

function onWheel(event) {
  if (!state.currentBitmap) return;
  event.preventDefault();
  if (state.freeTransform) {
    if (event.shiftKey) {
      // 旋转：保持原有逻辑，每次 ±2 度
      const delta = event.deltaY < 0 ? 1 : -1;
      state.imageRotation = (state.imageRotation + delta * 2 + 360) % 360;
    } else {
      // 无级缩放：根据 deltaY 实际值计算缩放因子，更丝滑
      // deltaY 通常为 ±100（鼠标滚轮）或更小（触控板），归一化后乘以灵敏度系数
      const sensitivity = 0.001;
      const rawDelta = event.deltaY;
      // 对 deltaMode 做适配：0=像素, 1=行, 2=页
      const normalizedDelta = event.deltaMode === 1 ? rawDelta * 20
        : event.deltaMode === 2 ? rawDelta * 400
        : rawDelta;
      const factor = Math.exp(-normalizedDelta * sensitivity);
      state.imageUserScale = Math.max(0.1, Math.min(state.imageUserScale * factor, 20));
      syncScaleSlider();
    }
    scheduleRedraw();
    return;
  }
  const delta = event.deltaY < 0 ? 1 : -1;

  const cx = (state.crop.x1 + state.crop.x2) / 2;
  const cy = (state.crop.y1 + state.crop.y2) / 2;
  let hw = (state.crop.x2 - state.crop.x1) / 2;
  let hh = (state.crop.y2 - state.crop.y1) / 2;

  if (state.useActualSize) {
    const factor = delta > 0 ? 1.04 : 1 / 1.04;
    hw = Math.max(MIN_BOX_SIZE / 2, hw * factor);
    hh = Math.max(MIN_BOX_SIZE / 2, hh * factor);
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
  if (state.useActualSize) {
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

async function writeBlobToDirectory(filename, blob) {
  if (!state.saveDirectoryHandle) return false;
  const granted = await ensureDirectoryPermission(state.saveDirectoryHandle, 'readwrite');
  if (!granted) {
    throw new Error(t('directoryPermissionDenied'));
  }
  const fileHandle = await state.saveDirectoryHandle.getFileHandle(filename, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(blob);
  await writable.close();
  return true;
}

async function saveCrop() {
  if (!state.currentBitmap || !state.currentImage) return;
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

  try {
    const blob = await canvasToBlob(outCanvas);
    if (state.saveDirectoryHandle) {
      await writeBlobToDirectory(filename, blob);
      setStatus(t('savedToFolder', { name: filename }));
    } else {
      downloadCanvas(outCanvas, filename);
      setStatus(t('downloadedFile', { name: filename }));
    }
  } catch (error) {
    downloadCanvas(outCanvas, filename);
    setStatus(t('directorySaveFallback', { name: filename }));
  }

  if (state.imageIndex < state.imageItems.length - 1) {
    state.imageIndex += 1;
    await loadCurrentImage();
  }
}

function nudge(dx, dy) {
  if (!state.currentBitmap) return;
  if (state.freeTransform) {
    state.imageTx += dx;
    state.imageTy += dy;
  } else {
    state.crop.x1 += dx;
    state.crop.x2 += dx;
    state.crop.y1 += dy;
    state.crop.y2 += dy;
    constrainBox();
  }
  scheduleRedraw();
}

function bindEvents() {
  els.fileInput.addEventListener('change', async (event) => {
    const files = [...event.target.files];
    await loadImageList(files);
    event.target.value = '';
  });

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
      setStatus(t('loadedFolder', { name: folderName, count: files.length }));
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

  els.freeTransformCheck.addEventListener('change', () => {
    state.freeTransform = els.freeTransformCheck.checked;
    setStatus(t('modeSwitched'));
    if (state.currentBitmap) {
      fitImageToCanvas(true);
    } else {
      scheduleRedraw();
    }
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
    state.imageUserScale = Math.max(0.1, Math.min(sliderToScale(val), 20));
    syncScaleSlider();
    scheduleRedraw();
    updateInfo();
  });

  els.zoomInBtn.addEventListener('click', () => zoomPreview(1.25));
  els.zoomOutBtn.addEventListener('click', () => zoomPreview(1 / 1.25));
  els.zoomResetBtn.addEventListener('click', () => {
    state.previewZoom = 1;
    if (state.currentBitmap) {
      fitImageToCanvas(state.freeTransform || state.useActualSize);
    } else {
      scheduleRedraw();
    }
    setStatus(t('previewZoomReset'));
  });

  els.langToggleBtn.addEventListener('click', () => {
    state.language = state.language === 'zh' ? 'en' : 'zh';
    localStorage.setItem(LANGUAGE_KEY, state.language);
    applyI18n();
  });

  window.addEventListener('message', (event) => {
    if (event.data?.type !== LANGUAGE_SYNC_MESSAGE) return;
    const nextLanguage = event.data?.language === 'en' ? 'en' : 'zh';
    if (state.language === nextLanguage) return;
    state.language = nextLanguage;
    localStorage.setItem(LANGUAGE_KEY, state.language);
    applyI18n();
  });

  els.canvas.addEventListener('pointerdown', onPointerDown);
  els.canvas.addEventListener('pointermove', onPointerMove);
  els.canvas.addEventListener('pointerup', onPointerUp);
  els.canvas.addEventListener('pointercancel', onPointerUp);
  els.canvas.addEventListener('pointerleave', onPointerUp);
  els.canvas.addEventListener('wheel', onWheel, { passive: false });

  window.addEventListener('keydown', (event) => {
    if (!state.currentBitmap) return;
    if (event.key === 'ArrowLeft') nudge(-1, 0);
    if (event.key === 'ArrowRight') nudge(1, 0);
    if (event.key === 'ArrowUp') nudge(0, -1);
    if (event.key === 'ArrowDown') nudge(0, 1);
    if (event.key === 'a' || event.key === 'A') els.prevBtn.click();
    if (event.key === 'd' || event.key === 'D') els.nextBtn.click();
    if (event.key.toLowerCase() === 's' && event.ctrlKey) {
      event.preventDefault();
      saveCrop();
    }
  });

  window.addEventListener('resize', handleViewportResize);
  window.addEventListener('fullscreenchange', handleViewportResize);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', handleViewportResize);
  }
}

async function init() {
  renderPresets();
  syncSizeInputs();
  syncFillBackgroundControls();
  bindEvents();
  updateNavButtons();
  updateSaveDirInfo();
  applyI18n();
  setStatus(t('statusReady'));
  setNav(t('navEmpty'));
  scheduleRedraw();
  await restoreSavedDirectoryHandle();
}

init();
