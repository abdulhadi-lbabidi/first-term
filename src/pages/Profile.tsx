import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authService } from '../services';
import { useAppDispatch, useAppSelector } from '../store';
import { updateProfileSuccess } from '../store/authSlice';
import { User, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Profile() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  // Route protection
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate(`/${currentLang}/login?redirect=profile`);
    }
  }, [isAuthenticated, navigate, currentLang, user]);

  const profileSchema = z.object({
    fullName: z.string().min(1, t('auth.validation.nameRequired')),
    phone: z.string().optional(),
  });

  type ProfileForm = z.infer<typeof profileSchema>;

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      phone: user?.phone || '',
    }
  });

  // Reset form when user loads
  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName,
        phone: user.phone || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileForm) => {
    setFormSuccess('');
    setFormError('');
    if (!user) return;

    try {
      const updatedUser = await authService.updateProfile(user.id, data.fullName, data.phone);
      dispatch(updateProfileSuccess(updatedUser));
      setFormSuccess(currentLang === 'ar' ? 'تم تحديث الملف الشخصي بنجاح' : 'Profile updated successfully');
    } catch (err: any) {
      setFormError(err.message || 'خطأ في التحديث');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto px-6 font-interfaceEn my-12">
      <div className="bg-white dark:bg-ink border border-border dark:border-border-strong/20 rounded-2xl p-8 shadow-md text-left rtl:text-right space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold mx-auto mb-3">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <h1 className="font-serif-display text-2xl font-semibold text-ink dark:text-canvas my-0">
            {t('common.profile')}
          </h1>
          <p className="text-[13px] text-muted font-mono">{user.email}</p>
        </div>

        {/* Update Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <Input
            type="text"
            label={t('auth.nameLabel')}
            error={errors.fullName?.message}
            icon={<User className="w-4.5 h-4.5 text-muted" />}
            {...register('fullName')}
          />

          {/* Phone */}
          <Input
            type="text"
            label={t('auth.phoneLabel')}
            icon={<Phone className="w-4.5 h-4.5 text-muted" />}
            {...register('phone')}
          />

          {/* Messages */}
          {formSuccess && (
            <div className="p-3 bg-success/5 border border-success/20 rounded-xl text-success text-[13px] font-medium flex items-center space-x-2 rtl:space-x-reverse">
              <CheckCircle className="w-4.5 h-4.5 shrink-0" />
              <span>{formSuccess}</span>
            </div>
          )}

          {formError && (
            <div className="p-3 bg-error/5 border border-error/20 rounded-xl text-error text-[13px] font-medium flex items-center space-x-2 rtl:space-x-reverse">
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
            {isSubmitting ? t('common.submitting') : t('common.save')}
          </Button>
        </form>
      </div>
    </div>
  );
}
