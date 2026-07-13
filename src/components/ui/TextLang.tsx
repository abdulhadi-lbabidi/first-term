import { useParams } from 'react-router-dom';

interface TextLangProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Arabic text */
  ar: string;
  /** English text */
  en: string;
  /** Override the detected language (optional) */
  lang?: string;
  /** Render as a different element, defaults to span */
  as?: React.ElementType;
}

/**
 * Renders Arabic or English text based on the current route language param.
 * Spreads all extra props onto the element (className, style, onClick, etc.)
 *
 * @example
 * <TextLang ar="جميع الفروع" en="All Branches" />
 * <TextLang ar="ابحث الآن" en="Search Now" className="font-bold" />
 * <TextLang as="h2" ar="مرحباً" en="Welcome" className="text-xl" />
 */
export function TextLang({ ar, en, lang, as: Tag = 'span', ...props }: TextLangProps) {
  const { lang: routeLang } = useParams<{ lang: string }>();
  const currentLang = lang ?? routeLang ?? 'en';
  return <Tag {...props}>{currentLang === 'ar' ? ar : en}</Tag>;
}
