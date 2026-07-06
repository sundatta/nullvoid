import en from './locales/en.json' assert { type: 'json' };
import es from './locales/es.json' assert { type: 'json' };
import fr from './locales/fr.json' assert { type: 'json' };
import de from './locales/de.json' assert { type: 'json' };
import ja from './locales/ja.json' assert { type: 'json' };
import hi from './locales/hi.json' assert { type: 'json' };

const locales = { en, es, fr, de, ja, hi } as const;
type Locale = keyof typeof locales;

function flatten(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
  let result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object') {
      result = { ...result, ...flatten(value as Record<string, unknown>, fullKey) };
    } else {
      result[fullKey] = String(value);
    }
  }
  return result;
}

const flattened = Object.fromEntries(
  Object.entries(locales).map(([key, value]) => [key, flatten(value as unknown as Record<string, unknown>)]),
) as Record<Locale, Record<string, string>>;

export function t(key: string, locale: string = 'en', vars?: Record<string, string | number>): string {
  const lang = (locale in locales ? locale : 'en') as Locale;
  let message = flattened[lang][key] ?? flattened.en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      message = message.replace(`{${k}}`, String(v));
    }
  }
  return message;
}

export function getAvailableLocales(): { code: string; name: string }[] {
  const names: Record<string, string> = {
    en: 'English', es: 'Español', fr: 'Français',
    de: 'Deutsch', ja: '日本語', hi: 'हिन्दी',
  };
  return Object.keys(flattened).map((code) => ({ code, name: names[code] ?? code }));
}

export { locales };
export type { Locale };
