import { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authService } from '../services';
import { useAppDispatch } from '../store';
import { loginSuccess, setAuthLoading, setAuthError } from '../store/authSlice';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Login() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formError, setFormError] = useState('');

  // Zod login schema
  const loginSchema = z.object({
    email: z.string().min(1, t('auth.validation.emailRequired')).email(t('auth.validation.emailInvalid')),
    password: z.string().min(1, t('auth.validation.passwordRequired')),
  });

  type LoginForm = z.infer<typeof loginSchema>;

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginForm) => {
    setFormError('');
    dispatch(setAuthLoading(true));
    try {
      const user = await authService.login(data.email, data.password);
      dispatch(loginSuccess(user));
      navigate(`/${currentLang}/rooms`);
    } catch (err: any) {
      setFormError(err.message || 'فشل تسجيل الدخول');
      dispatch(setAuthError(err.message || 'Login failed'));
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
            {t('auth.loginTitle')}
          </h1>
          <p className="text-[14px] text-muted">
            {t('common.footerText')}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <Input
            type="email"
            label={t('auth.emailLabel')}
            placeholder="concierge@luxury.com"
            error={errors.email?.message}
            icon={<Mail className="w-4.5 h-4.5 text-muted" />}
            {...register('email')}
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
            <div className="p-3.5 bg-error/5 border border-error/20 rounded-xl text-error text-[13px] font-medium flex items-start space-x-2 rtl:space-x-reverse">
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
          >
            {isSubmitting ? t('common.submitting') : t('auth.loginBtn')}
          </Button>
        </form>

        {/* Default credentials suggestion */}
        <div className="bg-canvas/50 dark:bg-body/20 border border-border dark:border-border-strong/10 rounded-xl p-4 text-[13px] space-y-2">
          <p className="font-semibold text-ink/75 dark:text-canvas/75 flex items-center gap-1.5 justify-center">
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            {t('auth.defaultCredentials')}
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                setValue('email', 'concierge@luxury.com');
                setValue('password', '12345678');
              }}
              className="bg-white dark:bg-ink hover:bg-canvas dark:hover:bg-body/30 border border-border dark:border-border-strong/10 rounded-lg p-2.5 text-center transition-luxury cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/50 text-[12px] shadow-sm font-interfaceEn"
            >
              <div className="font-semibold text-primary mb-0.5">{t('auth.defaultConcierge')}</div>
              <div className="text-muted text-[11px] truncate">concierge@luxury.com</div>
            </button>
            <button
              type="button"
              onClick={() => {
                setValue('email', 'guest@luxury.com');
                setValue('password', '12345678');
              }}
              className="bg-white dark:bg-ink hover:bg-canvas dark:hover:bg-body/30 border border-border dark:border-border-strong/10 rounded-lg p-2.5 text-center transition-luxury cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/50 text-[12px] shadow-sm font-interfaceEn"
            >
              <div className="font-semibold text-primary mb-0.5">{t('auth.defaultGuest')}</div>
              <div className="text-muted text-[11px] truncate">guest@luxury.com</div>
            </button>
          </div>
          <p className="text-[11px] text-muted text-center italic mt-1 font-interfaceEn">
            {t('auth.defaultPassword')}
          </p>
        </div>

        <hr className="border-border dark:border-border-strong/10" />

        {/* Redirect */}
        <div className="text-center text-[14px]">
          <span className="text-muted">{t('auth.noAccount')} </span>
          <Link to={`/${currentLang}/register`} className="text-primary font-semibold hover:underline">
            {t('auth.registerBtn')}
          </Link>
        </div>
      </div>
    </div>
  );
}
