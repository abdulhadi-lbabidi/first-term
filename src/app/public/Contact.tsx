import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Phone, MapPin, CheckCircle2, AlertCircle, Send, Map } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import SEO from '@/components/SEO';

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
    <div className={`max-w-7xl mx-auto px-6 space-y-16 py-12 ${currentLang === 'ar' ? 'font-interfaceAr' : 'font-interfaceEn'}`}>
      <SEO title={t('common.contact')} />
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[13px] font-semibold text-primary uppercase tracking-widest block">
          {t('common.contact')}
        </span>
        <h1 className="font-serif-display text-4xl lg:text-5xl font-bold text-ink dark:text-canvas my-0 leading-tight">
          {currentLang === 'ar' ? 'نحن هنا لخدمتك' : 'At Your Service'}
        </h1>
        <p className="text-[15px] text-body/80 dark:text-canvas/70 leading-relaxed font-light mt-4">
          {currentLang === 'ar'
            ? 'فريق العناية بالضيوف مكرس لتلبية أدق تفاصيل إقامتك والإجابة على كافة استفساراتك على مدار الساعة لضمان تجربة لا تُنسى.'
            : 'Our dedicated Guest Relations team is at your complete disposal to arrange every detail of your stay and address any inquiries around the clock.'}
        </p>
      </section>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">

        {/* Left Side: Visual & Contact Info */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">

          <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-lg border border-border/20">
            <img
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80"
              alt="Hotel Entrance"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white rtl:text-right">
              <h3 className="font-serif-display text-2xl font-bold mb-1">
                {currentLang === 'ar' ? 'المقر الرئيسي' : 'Headquarters'}
              </h3>
              <p className="text-sm text-white/80 flex items-center gap-2 rtl:flex-row-reverse rtl:justify-end">
                <MapPin className="w-4 h-4" />
                {currentLang === 'ar' ? 'شارع الشيخ زايد، دبي، الإمارات' : 'Sheikh Zayed Road, Dubai, UAE'}
              </p>
            </div>
          </div>

          <div className="bg-canvas/50 dark:bg-body/30 border border-border/40 dark:border-border-strong/15 rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] rtl:text-right">
            <h4 className="font-serif-display text-xl font-bold text-ink dark:text-canvas mb-6 pb-4 border-b border-border/40 dark:border-border-strong/10">
              {currentLang === 'ar' ? 'فريق العناية بالضيوف' : 'Guest Relations'}
            </h4>

            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-ink border border-border/40 dark:border-border-strong/10 shadow-sm flex items-center justify-center text-primary shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1 pt-1 text-left rtl:text-right">
                  <span className="text-[12px] font-semibold text-muted uppercase tracking-wider">
                    {currentLang === 'ar' ? 'الهاتف' : 'Phone'}
                  </span>
                  <p className="text-[15px] font-medium text-ink dark:text-canvas"><bdi>+971 4 123 4567</bdi></p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-ink border border-border/40 dark:border-border-strong/10 shadow-sm flex items-center justify-center text-primary shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1 pt-1 text-left rtl:text-right">
                  <span className="text-[12px] font-semibold text-muted uppercase tracking-wider">
                    {currentLang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  </span>
                  <p className="text-[15px] font-medium text-ink dark:text-canvas">reservations@vercelhotels.com</p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Right Side: Contact Form */}
        <div className="lg:col-span-7 bg-white dark:bg-ink border border-border dark:border-border-strong/15 rounded-3xl p-8 lg:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.03)] text-left rtl:text-right relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          {formSuccess ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-5 animate-fade-in relative z-10">
              <div className="w-20 h-20 bg-success/10 border border-success/20 rounded-full flex items-center justify-center text-success mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif-display text-3xl font-bold text-ink dark:text-canvas">
                {currentLang === 'ar' ? 'تم إرسال رسالتك بنجاح' : 'Message Sent Successfully'}
              </h3>
              <p className="text-[15px] text-muted max-w-sm mx-auto leading-relaxed">
                {currentLang === 'ar'
                  ? 'شكراً لتواصلك معنا. سيقوم فريق العناية بالضيوف بمراجعة طلبك والرد عليك خلال 24 ساعة.'
                  : 'Thank you for reaching out. Our Guest Relations team will review your inquiry and get back to you within 24 hours.'}
              </p>
              <button
                onClick={() => setFormSuccess(false)}
                className="mt-6 bg-ink dark:bg-canvas hover:bg-ink-hover dark:hover:bg-canvas-hover text-canvas dark:text-ink text-[14px] font-semibold px-8 py-3 rounded-full transition-luxury shadow-md"
              >
                {currentLang === 'ar' ? 'إرسال رسالة أخرى' : 'Send Another Message'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
              <div className="mb-8">
                <h3 className="font-serif-display text-2xl lg:text-3xl font-bold text-ink dark:text-canvas mb-2">
                  {currentLang === 'ar' ? 'أرسل لنا استفسارك' : 'Send an Inquiry'}
                </h3>
                <p className="text-sm text-muted">
                  {currentLang === 'ar' ? 'يرجى تعبئة النموذج أدناه وسيقوم فريقنا بالتواصل معك قريباً.' : 'Please fill out the form below and our team will contact you shortly.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  type="text"
                  label={currentLang === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                  error={errors.name?.message}
                  {...register('name')}
                />
                <Input
                  type="email"
                  label={t('auth.emailLabel')}
                  error={errors.email?.message}
                  {...register('email')}
                />
              </div>

              <Input
                type="text"
                label={t('auth.phoneLabel')}
                error={errors.phone?.message}
                {...register('phone')}
              />

              <div className="space-y-1.5 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink dark:text-canvas">
                  {currentLang === 'ar' ? 'الرسالة' : 'Your Inquiry'}
                </label>
                <textarea
                  rows={5}
                  {...register('message')}
                  className="w-full min-h-[140px] p-4 bg-transparent border border-input focus:border-primary focus:ring-3 focus:ring-primary/20 rounded-xl text-base outline-none transition-all dark:bg-input/30"
                  placeholder={currentLang === 'ar' ? 'اكتب تفاصيل طلبك أو استفسارك هنا...' : 'Please describe your request in detail...'}
                />
                {errors.message && (
                  <p className="text-[12px] text-destructive font-medium mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-hover text-white font-semibold h-12 lg:h-14 rounded-full transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 mt-4 text-[15px]"
              >
                {isSubmitting ? (
                  currentLang === 'ar' ? 'جاري الإرسال...' : 'Sending...'
                ) : (
                  <>
                    <span>{currentLang === 'ar' ? 'إرسال الرسالة' : 'Send Inquiry'}</span>
                    <Send className="w-4 h-4 rtl:rotate-180" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
