import {
  defaultLanguage,
  getNestedTranslation,
  languages,
} from '../../src/lib/i18n';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('i18n', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNestedTranslation', () => {
    it('should return translation for existing key', () => {
      const translations = languages['en-US'].translations;
      const result = getNestedTranslation(translations, 'common.search');

      expect(result).toBe('Search');
    });

    it('should return key when translation not found', () => {
      const translations = languages['en-US'].translations;
      const result = getNestedTranslation(translations, 'nonexistent.key');

      expect(result).toBe('nonexistent.key');
    });

    it('should handle nested keys', () => {
      const translations = languages['en-US'].translations;
      const result = getNestedTranslation(translations, 'welcome.title');

      expect(result).toBe('Welcome Back');
    });
  });

  describe('languages', () => {
    it('should have correct language structure', () => {
      expect(languages['en-US']).toHaveProperty('name', 'English');
      expect(languages['en-US']).toHaveProperty('translations');
      expect(languages['zh-CN']).toHaveProperty('name', '中文');
      expect(languages['zh-CN']).toHaveProperty('translations');
    });
  });

  describe('defaultLanguage', () => {
    it('should be zh-CN', () => {
      expect(defaultLanguage).toBe('zh-CN');
    });
  });
});
