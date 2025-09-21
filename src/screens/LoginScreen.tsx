import { useEffect, useState } from 'react';
import { LanguageSelector } from './LanguageSelector';
import { EcosafeLogo } from './EcosafeLogo';
import { PhoneNumberInput } from './PhoneNumberInput';
import { BottomNavigation } from './BottomNavigation';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NumericKeypad } from './NumericKeypad';

export function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [hint, setHint] = useState<string | undefined>();
  const [country, setCountry] = useState<'IN' | 'US'>('IN');
  const nav = useNavigate();
  const { t } = useTranslation('login');

  const handleConfirm = (digitsOnly: string) => {
    if (digitsOnly.length !== 10) {
      setError(t('invalidPhone'));
      return;
    }
    if (country === 'IN' && !/^[6-9]/.test(digitsOnly)) {
      setError(t('invalidStartDigit'));
      return;
    }
    setError(undefined);
    // Move to OTP screen; persist on success screen
    nav('/otp', { replace: true, state: { phone: digitsOnly, country } });
  };

  // Try pre-filling from clipboard (best-effort; may fail without gesture)
  useEffect(() => {
    let cancelled = false;
    if (!phoneNumber && navigator.clipboard?.readText) {
      navigator.clipboard.readText().then((text) => {
        if (cancelled || !text) return;
        const match = text.replace(/\s/g, '').match(/([6-9]\d{9})/);
        if (match && !phoneNumber) {
          setPhoneNumber(match[1]);
          setHint(t('detectedClipboard'));
        }
      }).catch(() => {/* ignore permission errors */});
    }
    return () => { cancelled = true };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced early validation on digit change
  useEffect(() => {
    setError(undefined);
    const id = setTimeout(() => {
      const digits = phoneNumber.replace(/\D/g, '');
      if (!digits) return;
      if (digits.length < 10 && country === 'IN' && digits.length >= 1 && !/^[6-9]/.test(digits)) {
        setError(t('invalidStartDigit'));
      }
    }, 250);
    return () => clearTimeout(id);
  }, [phoneNumber, country, t]);

  return (
    <div className="min-h-screen bg-white flex flex-col w-full sm:max-w-md sm:mx-auto sm:border-x sm:border-gray-200">
      
      {/* Language Selector */}
      <LanguageSelector />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Logo */}
        <EcosafeLogo />
        
        {/* Phone Number Input */}
        <div className="flex-1 flex flex-col justify-center">
          <PhoneNumberInput 
            phoneNumber={phoneNumber} 
            error={error} 
            hint={hint}
            countryPrefix={country === 'IN' ? '+91' : '+1'}
            onToggleCountry={() => setCountry(country === 'IN' ? 'US' : 'IN')}
          />
        </div>
        
        {/* Numeric Keypad */}
        <NumericKeypad 
          phoneNumber={phoneNumber} 
          setPhoneNumber={setPhoneNumber}
          onConfirm={handleConfirm}
        />
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
