import { copyToClipboard } from '../../src/lib/clipboard';

// Mock navigator.clipboard
const mockWriteText = jest.fn();
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: mockWriteText,
  },
  writable: true,
});

// Mock document.execCommand
const mockExecCommand = jest.fn();
Object.defineProperty(document, 'execCommand', {
  value: mockExecCommand,
  writable: true,
});

// Mock document.createElement
const mockTextArea = {
  value: '',
  select: jest.fn(),
  setSelectionRange: jest.fn(),
  style: {
    position: '',
    left: '',
    top: '',
  },
  focus: jest.fn(),
};
const mockCreateElement = jest.fn(() => mockTextArea);
Object.defineProperty(document, 'createElement', {
  value: mockCreateElement,
  writable: true,
});

// Mock document.body
Object.defineProperty(document, 'body', {
  value: {
    appendChild: jest.fn(),
    removeChild: jest.fn(),
  },
  writable: true,
});

describe('clipboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('copyToClipboard', () => {
    it('should copy text to clipboard using navigator.clipboard when available', async () => {
      const text = 'test text';
      mockWriteText.mockResolvedValue(undefined);

      // 确保navigator.clipboard可用
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: mockWriteText,
        },
        writable: true,
      });

      // 确保window.isSecureContext为true
      Object.defineProperty(window, 'isSecureContext', {
        value: true,
        writable: true,
      });

      await copyToClipboard(text);

      expect(mockWriteText).toHaveBeenCalledWith(text);
    });

    it('should fallback to document.execCommand when navigator.clipboard fails', async () => {
      const text = 'test text';
      mockWriteText.mockRejectedValue(new Error('Clipboard API not available'));
      mockExecCommand.mockReturnValue(true);

      await copyToClipboard(text);

      expect(mockExecCommand).toHaveBeenCalledWith('copy');
      expect(mockCreateElement).toHaveBeenCalledWith('textarea');
      expect(mockTextArea.value).toBe(text);
    });
  });

  describe('copyToClipboard fallback', () => {
    it('should use document.execCommand when navigator.clipboard fails', async () => {
      const text = 'test text';
      mockWriteText.mockRejectedValue(new Error('Clipboard API not available'));
      mockExecCommand.mockReturnValue(true);

      const result = await copyToClipboard(text);

      expect(result).toBe(true);
      expect(mockExecCommand).toHaveBeenCalledWith('copy');
      expect(mockCreateElement).toHaveBeenCalledWith('textarea');
      expect(mockTextArea.value).toBe(text);
    });
  });
});
