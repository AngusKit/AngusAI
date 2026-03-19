import { useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider.tsx';
import { useTheme as useAppTheme } from '@/components/ThemeProvider.tsx';
import { useTheme as useMarkdownTheme, useLocale as useMarkdownLocale } from '@xcan-cloud/markdown';

/**
 * 将 AngusAI 的语言和主题同步到 @xcan-cloud/markdown 的 context。
 * 需作为 MarkdownProvider 的子组件使用。
 */
export function MarkdownThemeLocaleSync() {
  const { language } = useLanguage();
  const { theme: appTheme } = useAppTheme();
  const { setTheme: setMarkdownTheme } = useMarkdownTheme();
  const { setLocale: setMarkdownLocale } = useMarkdownLocale();

  useEffect(() => {
    setMarkdownLocale(language);
  }, [language, setMarkdownLocale]);

  useEffect(() => {
    setMarkdownTheme(appTheme);
  }, [appTheme, setMarkdownTheme]);

  return null;
}
