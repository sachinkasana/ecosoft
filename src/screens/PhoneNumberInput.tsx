import { Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PhoneNumberInputProps {
  phoneNumber: string;
  error?: string;
  hint?: string;
  countryPrefix: string;
  onToggleCountry?: () => void;
}

export function PhoneNumberInput({ phoneNumber, error, hint, countryPrefix, onToggleCountry }: PhoneNumberInputProps) {
  const { t } = useTranslation('login');
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Indian mobile format: 99999 99999 (5+5 grouping)
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)} ${digits.slice(5, 10)}`.trim();
  };

  return (
    <div className="px-6 py-4">
      {/* Phone icon */}
      <div className="flex justify-start mb-6">
        <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
          <Smartphone className="w-7 h-7 text-green-600" />
        </div>
      </div>
      
      {/* Title */}
      <h2 className="text-xl font-medium text-gray-800 mb-8">{t('enterMobile')}</h2>
      
      {/* Input field */}
      <div className="relative mb-6">
        <label className="block text-sm text-green-600 mb-3 font-medium">{t('mobileNumber')}</label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <Smartphone className="w-5 h-5 text-gray-400" />
          </div>
          <div className="w-full pl-14 pr-4 py-4 border-2 border-green-200 rounded-xl bg-gray-50 text-lg font-medium text-gray-800 min-h-[56px] flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleCountry}
              aria-label={t('changeCountry')}
              className="px-2 py-0.5 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm active:scale-95 transition-transform"
            >
              {countryPrefix}
            </button>
            {formatPhoneNumber(phoneNumber) || ''}
            <span className="animate-pulse text-gray-400">|</span>
          </div>
        </div>
      </div>
      
      {/* Helper or error */}
      <p className={`text-sm leading-relaxed ${error ? 'text-red-600' : 'text-gray-500'}`} aria-live="polite">
        {error || hint || t('example')}
      </p>

      {/* Terms and conditions */}
      <p className="text-sm text-gray-500 leading-relaxed mt-3">
        {t('termsPrefix')} <button className="text-blue-600 underline font-medium">{t('terms')}</button> {t('and')}{' '}
        <button className="text-blue-600 underline font-medium">{t('privacy')}</button>
      </p>
    </div>
  );
}
