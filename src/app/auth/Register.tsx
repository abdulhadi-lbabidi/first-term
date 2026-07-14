import { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authService } from '@/services';
import { useAppDispatch } from '@/store';
import { loginSuccess, setAuthLoading, setAuthError } from '@/store/authSlice';
import { Mail, Lock, User, Phone, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function Register() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formError, setFormError] = useState('');

  // Zod registration schema
  const registerSchema = z.object({
    fullName: z.string().min(1, t('auth.validation.nameRequired')),
    email: z.string().min(1, t('auth.validation.emailRequired')).email(t('auth.validation.emailInvalid')),
    password: z.string().min(6, t('auth.validation.passwordMin')),
    phone: z.string().optional(),
  });

  type RegisterForm = z.infer<typeof registerSchema>;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterForm) => {
    setFormError('');
    dispatch(setAuthLoading(true));
    try {
      const user = await authService.register(
        data.fullName,
        data.email,
        data.password,
        data.phone
      );
      dispatch(loginSuccess(user));
      navigate(`/${currentLang}/rooms`);
    } catch (err: any) {
      setFormError(err.message || 'فشل إنشاء الحساب');
      dispatch(setAuthError(err.message || 'Registration failed'));
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 font-interfaceEn my-12">
      <div className="bg-white dark:bg-ink border border-border dark:border-border-strong/20 rounded-2xl p-8 shadow-md text-left rtl:text-right space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-serif-display text-3xl font-semibold text-ink dark:text-canvas my-0">
            {t('auth.registerTitle')}
          </h1>
          <p className="text-[14px] text-muted">
            {t('common.footerText')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <Input
            type="text"
            label={t('auth.nameLabel')}
            placeholder="Ariyan Hosseini"
            error={errors.fullName?.message}
            icon={<User className="w-4.5 h-4.5 text-muted" />}
            {...register('fullName')}
          />

          {/* Email */}
          <Input
            type="email"
            label={t('auth.emailLabel')}
            placeholder="concierge@luxury.com"
            error={errors.email?.message}
            icon={<Mail className="w-4.5 h-4.5 text-muted" />}
            {...register('email')}
          />

          {/* Phone */}
          <Input
            type="text"
            label={t('auth.phoneLabel')}
            placeholder="+971 50 123 4567"
            icon={<Phone className="w-4.5 h-4.5 text-muted" />}
            {...register('phone')}
          />

          {/* Password */}
          <Input
            type="password"
            label={t('auth.passwordLabel')}
            placeholder="••••••••"
            error={errors.password?.message}
            icon={<Lock className="w-4.5 h-4.5 text-muted" />}
            {...register('password')}
          />

          {/* Form Error */}
          {formError && (
            <div className="p-3 bg-error/5 border border-error/20 rounded-xl text-error text-[13px] font-medium flex items-start space-x-2 rtl:space-x-reverse">
              <AlertCircle className="w-4.5 h-4.5 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            isLoading={isSubmitting}
            fullWidth
            variant="primary"
            className="mt-2"
          >
            {isSubmitting ? t('common.submitting') : t('auth.registerBtn')}
          </Button>
        </form>

        <hr className="border-border dark:border-border-strong/10" />

        {/* Redirect */}
        <div className="text-center text-[14px]">
          <span className="text-muted">{t('auth.hasAccount')} </span>
          <Link to={`/${currentLang}/login`} className="text-primary font-semibold hover:underline">
            {t('common.login')}
          </Link>
        </div>
      </div>
    </div>
  );
}
