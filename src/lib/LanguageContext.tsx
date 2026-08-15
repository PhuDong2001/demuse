"use client";

import * as React from "react";
import { translations, type Language, type TranslationSchema } from "./i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationSchema;
}

const LanguageContext = React.createContext<LanguageContextType>({
  language: "vi",
  setLanguage: () => {},
  t: translations["vi"],
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = React.useState<Language>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("demuse_lang") as Language;
        if (saved === "en" || saved === "vi" || saved === "fr" || saved === "de") {
          return saved;
        }
      } catch {
        // ignore
      }
    }
    return "vi";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("demuse_lang", lang);
    } catch {
      // ignore
    }
  };

  const t = translations[language] || translations["vi"];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return React.useContext(LanguageContext);
}
