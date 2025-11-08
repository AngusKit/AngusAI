/**
 * Copy text to clipboard with fallback for environments where Clipboard API is blocked
 * @param text - The text to copy
 * @returns Promise that resolves to true if successful, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text || text.trim() === '') {
    console.warn('尝试复制空内容');
    return false;
  }

  // Try modern Clipboard API first
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Clipboard API 失败，使用 fallback 方法:', err);
      // Fall through to fallback method
    }
  }

  // Fallback method using execCommand
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  textArea.style.opacity = '0';
  textArea.style.pointerEvents = 'none';
  textArea.setAttribute('readonly', '');
  textArea.setAttribute('aria-hidden', 'true');
  
  document.body.appendChild(textArea);
  
  // Select the text
  let selectionSuccess = false;
  if (navigator.userAgent.match(/ipad|iphone/i)) {
    // iOS specific handling
    const range = document.createRange();
    range.selectNodeContents(textArea);
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
      textArea.contentEditable = 'true';
      textArea.readOnly = false;
      selectionSuccess = true;
    }
  } else {
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, text.length);
    selectionSuccess = true;
  }

  try {
    let successful = false;
    if (selectionSuccess) {
      successful = document.execCommand('copy');
    }
    
    // Clean up
    if (document.body.contains(textArea)) {
      document.body.removeChild(textArea);
    }
    
    return successful;
  } catch (err) {
    console.error('复制失败:', err);
    // Clean up on error
    if (document.body.contains(textArea)) {
      document.body.removeChild(textArea);
    }
    return false;
  }
}
