import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, Eye, Database, Shield } from 'lucide-react';
import SEO from '@/components/SEO';

export default function Privacy() {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';

  const policies = [
    {
      icon: <Lock className="w-6 h-6 text-primary" />,
      title: currentLang === 'ar' ? 'حماية بياناتك' : 'Protecting Your Data',
      content: currentLang === 'ar'
        ? 'نحن في فنادق فيرسيل نولي اهتماماً بالغاً بخصوصيتك. يتم تشفير جميع معلوماتك الشخصية ومعلومات الدفع باستخدام أحدث تقنيات الأمان (SSL) لضمان بقاء بياناتك آمنة وسرية تماماً في كل مرحلة من مراحل الحجز.'
        : 'At Vercel Hotels, your privacy is our utmost priority. All your personal and payment information is encrypted using state-of-the-art security technologies (SSL) to ensure your data remains completely secure and strictly confidential throughout the booking process.'
    },
    {
      icon: <Database className="w-6 h-6 text-primary" />,
      title: currentLang === 'ar' ? 'جمع المعلومات' : 'Information Collection',
      content: currentLang === 'ar'
        ? 'نقوم بجمع المعلومات الضرورية فقط لتقديم تجربة إقامة مخصصة واستثنائية لك. يشمل ذلك تفاصيل الحجز، التفضيلات الشخصية للإقامة، ومعلومات التواصل. لن نقوم ببيع أو مشاركة بياناتك مع أي طرف ثالث لأغراض تسويقية دون موافقتك الصريحة.'
        : 'We collect only the information necessary to provide you with a personalized and exceptional stay. This includes booking details, personal stay preferences, and contact information. We will never sell or share your data with third parties for marketing purposes without your explicit consent.'
    },
    {
      icon: <Eye className="w-6 h-6 text-primary" />,
      title: currentLang === 'ar' ? 'الشفافية والتحكم' : 'Transparency & Control',
      content: currentLang === 'ar'
        ? 'لديك الحق الكامل في الوصول إلى معلوماتك الشخصية، أو تعديلها، أو طلب حذفها في أي وقت. يمكنك إدارة تفضيلات الخصوصية الخاصة بك بسهولة من خلال حسابك الشخصي أو عبر التواصل المباشر مع فريق العناية بالضيوف.'
        : 'You have full rights to access, modify, or request the deletion of your personal information at any time. You can easily manage your privacy preferences through your personal account or by directly contacting our Guest Relations team.'
    },
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: currentLang === 'ar' ? 'ملفات تعريف الارتباط' : 'Cookies Policy',
      content: currentLang === 'ar'
        ? 'نستخدم ملفات تعريف الارتباط (Cookies) لتحسين تجربتك الرقمية وتوفير محتوى يتناسب مع اهتماماتك. يمكنك تخصيص إعدادات المتصفح لرفض ملفات تعريف الارتباط، ولكن هذا قد يؤثر على بعض ميزات الموقع التي تعتمد عليها.'
        : 'We use Cookies to enhance your digital experience and provide content tailored to your interests. You may adjust your browser settings to refuse cookies, though this may affect certain site features that rely on them.'
    }
  ];

  return (
    <div className={`max-w-4xl mx-auto px-6 py-16 space-y-12 ${currentLang === 'ar' ? 'font-interfaceAr text-right' : 'font-interfaceEn text-left'}`}>
      <SEO title={currentLang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'} />

      <section className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-[13px] font-semibold text-primary uppercase tracking-widest block">
          {currentLang === 'ar' ? 'التزامنا تجاهك' : 'Our Commitment to You'}
        </span>
        <h1 className="font-serif-display text-4xl lg:text-5xl font-bold text-ink dark:text-canvas my-0 leading-tight">
          {currentLang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
        </h1>
        <p className="text-[15px] text-body/80 dark:text-canvas/70 leading-relaxed font-light mt-4">
          {currentLang === 'ar'
            ? 'خصوصيتك هي أمانة نعتز بها. تعرف على كيفية قيامنا بحماية معلوماتك الشخصية وضمان تجربة رقمية آمنة تليق بضيوفنا.'
            : 'Your privacy is a trust we highly value. Discover how we protect your personal information and ensure a secure digital experience worthy of our guests.'}
        </p>
      </section>

      <div className="space-y-8 mt-12">
        {policies.map((policy, idx) => (
          <div key={idx} className="bg-white dark:bg-ink border border-border/40 dark:border-border-strong/15 rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-transform hover:-translate-y-1 rtl:text-right text-left">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                {policy.icon}
              </div>
              <h2 className="font-serif-display text-2xl font-bold text-ink dark:text-canvas">
                {policy.title}
              </h2>
            </div>
            <p className="text-[15px] text-body/80 dark:text-canvas/70 leading-relaxed font-light rtl:pr-16 ltr:pl-16">
              {policy.content}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center pt-8 border-t border-border/40 dark:border-border-strong/10">
        <p className="text-[14px] text-muted">
          {currentLang === 'ar' ? 'آخر تحديث: ' : 'Last updated: '}
          <span className="font-medium">{new Date().toLocaleDateString(currentLang === 'ar' ? 'ar-AE' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </p>
        <p className="text-[14px] mt-2 text-primary font-medium">
          {currentLang === 'ar' ? 'للاستفسارات المتعلقة بالخصوصية، يرجى التواصل معنا عبر privacy@vercelhotels.com' : 'For privacy-related inquiries, please contact privacy@vercelhotels.com'}
        </p>
      </div>
    </div>
  );
}
