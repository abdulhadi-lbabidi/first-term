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
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

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
