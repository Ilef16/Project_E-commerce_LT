import { messages, type MessageKey } from "./messages";

export const locales = ["fr", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);
export const dirOf = (l: Locale) => (l === "ar" ? "rtl" : "ltr");
export const t = (l: Locale, key: MessageKey): string => messages[key][l];
export type { MessageKey };
