/**
 * 复制文本
 * @param {string} text
 * @returns {Promise<boolean>} 是否成功
 */
async function copyText(text: string): Promise<boolean> {
  // Latest Clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return await navigator.clipboard.writeText(text).then(() => true, () => false);
  }

  // Internet Explorer-specific code (depreacted)
  // if (window.clipboardData && window.clipboardData.setData) {
  //   // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
  //   return window.clipboardData.setData('Text', text);
  // }

  // Common copy path
  if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
    const textarea = document.createElement('textarea');
    textarea.textContent = text;
    // Prevent scrolling to bottom of page in Microsoft Edge.
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      // Security exception may be thrown by some browsers.
      return document.execCommand('copy');
    } catch (ex) {
      window.console.warn('Failed to copy to clipboard', ex);
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
  return false;
}

/**
* 检查是否支持最新的 ClipboardItem API
* @returns {boolean} 是否支持
*/
function isSupportClipboardItemAPI(): boolean {
  return navigator.clipboard
    && navigator.clipboard.write !== undefined
    && (typeof ClipboardItem === 'function');
}

/**
* 复制 Canvas 元素中的内容到剪贴板，使用前请检查是否支持 API
* @param {HTMLCanvasElement} canvas HTML Canvas 元素
* @param {string} [type=image/png] 输出的图像格式
* @param {number?} quality 质量
*/
function copyCanvasImage(canvas: HTMLCanvasElement, type = 'image/png', quality?: number) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('canvas.toBlob returns empty data');
      }
      const item = new ClipboardItem({ [type]: blob });
      navigator.clipboard.write([item]).then(resolve, reject);
    }, type, quality);
  });
}

export {
  copyText,
  isSupportClipboardItemAPI,
  copyCanvasImage,
};
