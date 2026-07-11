import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Phone, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Contact() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';

  const [formSuccess, setFormSuccess] = useState(false);

  const contactSchema = z.object({
    name: z.string().min(1, t('auth.validation.nameRequired')),
    email: z.string().min(1, t('auth.validation.emailRequired')).email(t('auth.validation.emailInvalid')),
    phone: z.string().optional(),
    message: z.string().min(5, currentLang === 'ar' ? 'يجب كتابة رسالة من 5 أحرف على الأقل' : 'Message must be at least 5 characters'),
  });

  type ContactForm = z.infer<typeof contactSchema>;

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactForm) => {
    console.log('Contact form submitted:', data);
    setFormSuccess(true);
    reset();
  };

  return (
    <div className="font-interfaceEn max-w-7xl mx-auto px-6 space-y-16">
      {/* Header */}
      <section className="text-center max-w-2xl mx-auto space-y-4 mt-6">
        <span className="text-[13px] font-semibold text-primary uppercase tracking-widest block">
          {t('common.contact')}
        </span>
        <h1 className="font-serif-display text-4xl lg:text-5xl font-semibold text-ink dark:text-canvas my-0">
          {currentLang === 'ar' ? 'يسعدنا دائماً التواصل معك' : 'We Look Forward to Your Message'}
        </h1>
        <p className="text-[15px] text-body/80 dark:text-canvas/70 leading-relaxed font-light">
          {currentLang === 'ar'
            ? 'سواء كنت ترغب في الاستفسار عن حجز حالي أو مشاركتنا ملاحظاتك، فريق الكونسيرج متاح لمساعدتك.'
            : 'Whether you require assistance with a current booking, or wish to share feedback, our concierge team is always at your disposal.'}
        </p>
      </section>

      {/* Grid: Contact Info (40%) vs Form (60%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Contact Info Panels (40%) */}
        <div className="lg:col-span-5 bg-white dark:bg-ink border border-border dark:border-border-strong/20 rounded-2xl p-8 shadow-sm space-y-8 text-left rtl:text-right">
          <h3 className="font-serif-display text-2xl font-semibold text-ink dark:text-canvas pb-3 border-b border-border/40 dark:border-border-strong/10">
            {currentLang === 'ar' ? 'معلومات الاتصال' : 'Concierge Desk'}
          </h3>
          
          <ul className="space-y-6">
            <li className="flex items-start space-x-4 rtl:space-x-reverse">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[14px] font-semibold text-ink dark:text-canvas">
                  {currentLang === 'ar' ? 'المقر الرئيسي' : 'Headquarters'}
                </h4>
                <p className="text-[13.5px] text-muted leading-relaxed font-light">
                  {currentLang === 'ar' ? 'شارع الشيخ زايد، دبي، دولة الإمارات العربية المتحدة' : 'Sheikh Zayed Road, Dubai, UAE'}
                </p>
              </div>
            </li>

            <li className="flex items-start space-x-4 rtl:space-x-reverse">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[14px] font-semibold text-ink dark:text-canvas">
                  {currentLang === 'ar' ? 'رقم الهاتف' : 'Telephone'}
                </h4>
                <p className="text-[13.5px] text-muted font-light">+971 4 123 4567</p>
              </div>
            </li>

            <li className="flex items-start space-x-4 rtl:space-x-reverse">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[14px] font-semibold text-ink dark:text-canvas">
                  {currentLang === 'ar' ? 'البريد الإلكتروني' : 'Electronic Mail'}
                </h4>
                <p className="text-[13.5px] text-muted font-light">concierge@vercelhotels.com</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Contact Form (60%) */}
        <div className="lg:col-span-7 bg-white dark:bg-ink border border-border dark:border-border-strong/20 rounded-2xl p-8 shadow-sm text-left rtl:text-right">
          {formSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center text-success mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif-display text-2xl font-semibold text-ink dark:text-canvas">
                {currentLang === 'ar' ? 'تم إرسال رسالتك بنجاح' : 'Message Sent Successfully'}
              </h3>
              <p className="text-[14px] text-muted max-w-sm mx-auto leading-relaxed">
                {currentLang === 'ar'
                  ? 'شكراً لتواصلك معنا. سيقوم فريق الكونسيرج بالرد على رسالتك خلال 24 ساعة.'
                  : 'Thank you for reaching out. Our concierge desk will review your inquiry and get back to you within 24 hours.'}
              </p>
              <button
                onClick={() => setFormSuccess(false)}
                className="bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold px-6 py-2.5 rounded-full transition-luxury shadow-sm"
              >
                {currentLang === 'ar' ? 'إرسال رسالة أخرى' : 'Send Another Message'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <h3 className="font-serif-display text-2xl font-semibold text-ink dark:text-canvas pb-3 border-b border-border/40 dark:border-border-strong/10">
                {currentLang === 'ar' ? 'أرسل لنا استفسارك' : 'Contact Concierge'}
              </h3>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-ink/80 dark:text-canvas/80 uppercase block">
                  {currentLang === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full h-11 px-4 bg-canvas/30 dark:bg-body/10 border border-border dark:border-border-strong/20 focus:border-primary rounded-xl text-[14px] outline-none transition-luxury"
                  placeholder="Ariyan"
                />
                {errors.name && (
                  <span className="text-[12px] text-error font-medium flex items-center space-x-1 rtl:space-x-reverse">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.name.message}</span>
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-ink/80 dark:text-canvas/80 uppercase block">
                  {t('auth.emailLabel')}
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full h-11 px-4 bg-canvas/30 dark:bg-body/10 border border-border dark:border-border-strong/20 focus:border-primary rounded-xl text-[14px] outline-none transition-luxury"
                  placeholder="concierge@luxury.com"
                />
                {errors.email && (
                  <span className="text-[12px] text-error font-medium flex items-center space-x-1 rtl:space-x-reverse">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.email.message}</span>
                  </span>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-ink/80 dark:text-canvas/80 uppercase block">
                  {t('auth.phoneLabel')}
                </label>
                <input
                  type="text"
                  {...register('phone')}
                  className="w-full h-11 px-4 bg-canvas/30 dark:bg-body/10 border border-border dark:border-border-strong/20 focus:border-primary rounded-xl text-[14px] outline-none transition-luxury"
                  placeholder="+971 50 123 4567"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-ink/80 dark:text-canvas/80 uppercase block">
                  {currentLang === 'ar' ? 'الرسالة' : 'Your Inquiry'}
                </label>
                <textarea
                  rows={5}
                  {...register('message')}
                  className="w-full p-4 bg-canvas/30 dark:bg-body/10 border border-border dark:border-border-strong/20 focus:border-primary rounded-xl text-[14px] outline-none transition-luxury"
                  placeholder={currentLang === 'ar' ? 'اكتب استفسارك هنا بالتفصيل...' : 'Please describe your request in detail...'}
                />
                {errors.message && (
                  <span className="text-[12px] text-error font-medium flex items-center space-x-1 rtl:space-x-reverse">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.message.message}</span>
                  </span>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-hover text-white font-semibold h-12 rounded-full transition-luxury shadow-md flex items-center justify-center disabled:opacity-50 mt-2"
              >
                {isSubmitting ? t('common.submitting') : (currentLang === 'ar' ? 'إرسال الرسالة' : 'Send Inquiry')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
