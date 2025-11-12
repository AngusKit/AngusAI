import { zhCN } from '../locales/zh-CN';
import { enUS } from '../locales/en-US';

export type Language = 'zh-CN' | 'en-US';

export const languages = {
  'zh-CN': { name: '中文', translations: zhCN },
  'en-US': { name: 'English', translations: enUS },
};

export const defaultLanguage: Language = 'zh-CN';

// Helper function to get nested translation
export function getNestedTranslation(obj: any, path: string, params?: Record<string, string | number>): string {
  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return path; // Return the key if not found
    }
  }

  if (typeof result !== 'string') {
    return path;
  }

  // Interpolate params: replace occurrences of {key} with provided values
  if (params && typeof params === 'object') {
    return result.replace(/\{(\w+)\}/g, (_match: string, key: string) => {
      const value = params[key];
      return value === undefined || value === null ? '' : String(value);
    });
  }

  return result;
}
