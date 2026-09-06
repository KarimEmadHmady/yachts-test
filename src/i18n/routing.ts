import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'ar'],
 
  // Used when no locale matches
  defaultLocale: 'en',

  // Keep the current locale out of public URLs (for example, use `/` instead of `/en`).
  localePrefix: 'never'
});