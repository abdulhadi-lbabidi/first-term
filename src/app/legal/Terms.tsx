import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileText, ShieldCheck, Scale, AlertCircle } from 'lucide-react';
import SEO from '@/components/SEO';

export default function Terms() {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';

  const sections = [
    {
      icon: <FileText className="w-6 h-6 text-primary" />,
      title: currentLang === 'ar' ? 'قبول الشروط' : 'Acceptance of Terms',
      content: currentLang === 'ar'
        ? 'من خلال وصولك واستخدامك لموقع فنادق فيرسيل وتطبيقاتها، فإنك توافق على الالتزام بشروط الاستخدام الخاصة بنا. نحن نسعى لتقديم تجربة استثنائية، ولهذا فإن هذه الشروط تهدف لحمايتك وحماية مستوى الجودة الذي نعدك به.'
        : 'By accessing and using the Vercel Hotels website and applications, you agree to comply with our Terms of Use. We strive to provide an exceptional experience, and these terms are intended to protect both you and the standard of quality we promise.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      title: currentLang === 'ar' ? 'الحجز والإلغاء' : 'Booking & Cancellation',
      content: currentLang === 'ar'
        ? 'تعتبر الحجوزات مؤكدة فقط بعد إتمام الدفع أو تقديم ضمان صالح. تتيح لك سياسة الإلغاء المرنة لدينا تعديل أو إلغاء حجزك بدون رسوم إضافية بشرط الالتزام بالمدة المحددة قبل موعد الوصول والموضحة في تفاصيل حجزك.'
        : 'Reservations are considered confirmed only upon successful payment or provision of a valid guarantee. Our flexible cancellation policy allows you to modify or cancel your booking without additional fees, provided you adhere to the notice period specified in your booking details prior to your arrival.'
    },
    {
      icon: <AlertCircle className="w-6 h-6 text-primary" />,
      title: currentLang === 'ar' ? 'سلوك الضيوف' : 'Guest Conduct',
      content: currentLang === 'ar'
        ? 'للحفاظ على البيئة الهادئة والراقية التي تميز فنادقنا، يُتوقع من جميع الضيوف الالتزام بأعلى معايير السلوك اللائق. نحتفظ بالحق في اتخاذ الإجراءات المناسبة في حال وجود أي تصرف يمس براحة وسلامة ضيوفنا الآخرين.'
        : 'To maintain the serene and refined environment that defines our properties, all guests are expected to adhere to the highest standards of conduct. We reserve the right to take appropriate action in the event of any behavior that compromises the comfort or safety of our other guests.'
    },
    {
      icon: <Scale className="w-6 h-6 text-primary" />,
      title: currentLang === 'ar' ? 'التعديلات القانونية' : 'Legal Modifications',
      content: currentLang === 'ar'
        ? 'تحتفظ إدارة فنادق فيرسيل بالحق في تحديث وتعديل هذه الشروط في أي وقت لتتوافق مع أعلى المعايير القانونية والتشغيلية. يُنصح بمراجعة هذه الصفحة بشكل دوري للوقوف على أحدث التعديلات.'
        : 'The management of Vercel Hotels reserves the right to update and modify these terms at any time to align with the highest legal and operational standards. You are advised to review this page periodically to stay informed of any changes.'
    }
  ];

  return (
    <div className={`max-w-4xl mx-auto px-6 py-16 space-y-12 ${currentLang === 'ar' ? 'font-interfaceAr text-right' : 'font-interfaceEn text-left'}`}>
      <SEO title={currentLang === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'} />

      <section className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-[13px] font-semibold text-primary uppercase tracking-widest block">
          {currentLang === 'ar' ? 'الإطار القانوني' : 'Legal Framework'}
        </span>
        <h1 className="font-serif-display text-4xl lg:text-5xl font-bold text-ink dark:text-canvas my-0 leading-tight">
          {currentLang === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
        </h1>
        <p className="text-[15px] text-body/80 dark:text-canvas/70 leading-relaxed font-light mt-4">
          {currentLang === 'ar'
            ? 'تجسد هذه الشروط التزامنا بتقديم خدمات فندقية راقية وشفافة، وتحدد العلاقة المتميزة التي نبنيها مع ضيوفنا الأعزاء.'
            : 'These terms embody our commitment to delivering refined and transparent hospitality services, outlining the esteemed relationship we build with our valued guests.'}
        </p>
      </section>

      <div className="space-y-8 mt-12">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-canvas/50 dark:bg-body/30 border border-border/40 dark:border-border-strong/15 rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-colors hover:border-primary/20 rtl:text-right text-left">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white dark:bg-ink rounded-xl border border-border/40 dark:border-border-strong/10 shadow-sm flex items-center justify-center shrink-0">
                {section.icon}
              </div>
              <h2 className="font-serif-display text-2xl font-bold text-ink dark:text-canvas">
                {section.title}
              </h2>
            </div>
            <p className="text-[15px] text-body/80 dark:text-canvas/70 leading-relaxed font-light rtl:pr-16 ltr:pl-16">
              {section.content}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center pt-8 border-t border-border/40 dark:border-border-strong/10">
        <p className="text-[14px] text-muted">
          {currentLang === 'ar' ? 'آخر تحديث: ' : 'Last updated: '}
          <span className="font-medium">{new Date().toLocaleDateString(currentLang === 'ar' ? 'ar-AE' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </p>
      </div>
    </div>
  );
}
