import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authService } from '../services';
import { useAppDispatch, useAppSelector } from '../store';
import { updateProfileSuccess } from '../store/authSlice';
import { User, Phone, CheckCircle, AlertCircle, CalendarDays, ShieldCheck, Mail, Lock } from 'lucide-react';
import { bookingService } from '../services';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function Profile() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');
  const [bookingCount, setBookingCount] = useState(0);

  useEffect(() => {
    if (user) {
      bookingService.getBookings(user.id).then(res => setBookingCount(res.length)).catch(console.error);
    }
  }, [user]);

  // Route protection
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate(`/${currentLang}/login?redirect=profile`);
    }
  }, [isAuthenticated, navigate, currentLang, user]);

  const profileSchema = z.object({
    fullName: z.string().min(1, t('auth.validation.nameRequired')),
    email: z.string().email(t('auth.validation.emailInvalid')).optional(),
    phone: z.string().optional(),
    password: z.string().optional(),
  });

  type ProfileForm = z.infer<typeof profileSchema>;

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      password: '',
    }
  });

  // Reset form when user loads
  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || '',
        password: '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileForm) => {
    setFormSuccess('');
    setFormError('');
    if (!user) return;

    try {
      const updatedUser = await authService.updateProfile(user.id, data.fullName, data.phone, data.email, data.password);
      dispatch(updateProfileSuccess(updatedUser));
      setFormSuccess(currentLang === 'ar' ? 'تم تحديث الملف الشخصي بنجاح' : 'Profile updated successfully');
    } catch (err: any) {
      setFormError(err.message || 'خطأ في التحديث');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 font-interfaceEn my-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left rtl:text-right">

        {/* Left Sidebar: Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-ink border border-border dark:border-border-strong/20 rounded-3xl p-8 shadow-sm text-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-4xl font-bold mx-auto mb-4 relative">
              {user.fullName.charAt(0).toUpperCase()}
              <div className="absolute bottom-0 right-0 rtl:left-0 rtl:right-auto w-6 h-6 bg-success rounded-full border-4 border-white dark:border-ink" />
            </div>
            <h1 className="font-serif-display text-2xl font-bold text-ink dark:text-canvas my-0 line-clamp-1">
              {user.fullName}
            </h1>
            <p className="text-[13px] text-muted font-mono mt-1">{user.email}</p>

            <div className="mt-6 pt-6 border-t border-border/40 dark:border-border-strong/10 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-ink dark:text-canvas">{bookingCount}</p>
                <p className="text-[11px] font-semibold text-muted uppercase tracking-wider">{currentLang === 'ar' ? 'حجوزات' : 'Bookings'}</p>
              </div>
              <div className="text-center flex justify-between flex-col">
                <p className="text-2xl font-bold text-success flex justify-center"><ShieldCheck className="w-6 h-6" /></p>
                <p className="text-[11px] font-semibold text-muted uppercase tracking-wider">{currentLang === 'ar' ? 'مؤكد' : 'Verified'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-ink border border-border dark:border-border-strong/20 rounded-3xl p-8 shadow-sm">
            <h2 className="font-serif-display text-xl font-bold text-ink dark:text-canvas mb-6 pb-4 border-b border-border/40 dark:border-border-strong/10">
              {t('common.profile')}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  type="text"
                  label={t('auth.nameLabel')}
                  error={errors.fullName?.message}
                  icon={<User className="w-4.5 h-4.5 text-muted" />}
                  {...register('fullName')}
                />
                <Input
                  type="email"
                  label={currentLang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  error={errors.email?.message}
                  icon={<Mail className="w-4.5 h-4.5 text-muted" />}
                  {...register('email')}
                />
                <Input
                  type="text"
                  label={t('auth.phoneLabel')}
                  icon={<Phone className="w-4.5 h-4.5 text-muted" />}
                  {...register('phone')}
                />
                <Input
                  type="password"
                  label={currentLang === 'ar' ? 'كلمة المرور الجديدة (اختياري)' : 'New Password (Optional)'}
                  error={errors.password?.message}
                  icon={<Lock className="w-4.5 h-4.5 text-muted" />}
                  placeholder="••••••••"
                  {...register('password')}
                />
              </div>

              {formSuccess && (
                <div className="p-4 bg-success/5 border border-success/20 rounded-xl text-success text-[13px] font-medium flex items-center space-x-2 rtl:space-x-reverse">
                  <CheckCircle className="w-4.5 h-4.5 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              {formError && (
                <div className="p-4 bg-error/5 border border-error/20 rounded-xl text-error text-[13px] font-medium flex items-center space-x-2 rtl:space-x-reverse">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  variant="primary"
                  className="px-8 py-2.5 rounded-full"
                >
                  {isSubmitting ? t('common.submitting') : t('common.save')}
                </Button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
