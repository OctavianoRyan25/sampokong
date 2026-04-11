import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'id', label: 'ID' },
  { code: 'en', label: 'EN' },
  { code: 'cn', label: '中文' },
];

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="lang-switcher" id="language-switcher">
      {languages.map((lang) => (
        <button
          key={lang.code}
          className={`lang-btn ${i18n.language === lang.code ? 'active' : ''}`}
          onClick={() => i18n.changeLanguage(lang.code)}
          id={`lang-btn-${lang.code}`}
          aria-label={`Switch to ${lang.label}`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher;
