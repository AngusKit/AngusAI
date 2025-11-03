import { zhCN } from '../locales/zh-CN';
import { enUS } from '../locales/en-US';

export type Language = 'zh-CN' | 'en-US';

export const languages = {
  'zh-CN': { name: '中文', translations: zhCN },
  'en-US': { name: 'English', translations: enUS },
};

export const defaultLanguage: Language = 'zh-CN';

// Helper function to get nested translation
export function getNestedTranslation(obj: any, path: string): string {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return path; // Return the key if not found
    }
  }
  
  return typeof result === 'string' ? result : path;
}
