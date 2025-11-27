import { useEffect, useState } from 'react';
import { validatePassword, getPasswordStrengthColor, getPasswordStrengthText, type PasswordValidationResult } from '../utils/passwordValidation';
import { checkPasswordBreach } from '../utils/passwordBreachCheck';

interface PasswordStrengthIndicatorProps {
  password: string;
  showDetails?: boolean;
}

export const PasswordStrengthIndicator = ({ password, showDetails = true }: PasswordStrengthIndicatorProps) => {
  const [validation, setValidation] = useState<PasswordValidationResult | null>(null);
  const [isBreached, setIsBreached] = useState<boolean | null>(null);
  const [isCheckingBreach, setIsCheckingBreach] = useState(false);

  useEffect(() => {
    if (!password) {
      setValidation(null);
      setIsBreached(null);
      return;
    }

    const result = validatePassword(password);
    setValidation(result);

    if (result.isValid && password.length >= 8) {
      setIsCheckingBreach(true);
      const timeoutId = setTimeout(() => {
        checkPasswordBreach(password).then(({ isBreached: breached }) => {
          setIsBreached(breached);
          setIsCheckingBreach(false);
        });
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setIsBreached(null);
    }
  }, [password]);

  if (!password || !validation) {
    return null;
  }

  const strengthColor = getPasswordStrengthColor(validation.strength);
  const strengthText = getPasswordStrengthText(validation.strength);
  const barWidth = `${(validation.score / 20) * 100}%`;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-600">Password Strength:</span>
        <span className={`text-xs font-bold ${strengthColor}`}>{strengthText}</span>
      </div>

      <div className="w-full bg-gray-200 h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            validation.strength === 'weak'
              ? 'bg-red-600'
              : validation.strength === 'medium'
              ? 'bg-yellow-500'
              : 'bg-green-600'
          }`}
          style={{ width: barWidth }}
        />
      </div>

      {showDetails && validation.errors.length > 0 && (
        <div className="space-y-1">
          {validation.errors.map((error, index) => (
            <p key={index} className="text-xs text-red-600">
              • {error}
            </p>
          ))}
        </div>
      )}

      {isCheckingBreach && (
        <p className="text-xs text-gray-500">
          Checking against known breaches...
        </p>
      )}

      {isBreached === true && (
        <p className="text-xs text-red-600 font-semibold">
          ⚠️ This password has been found in data breaches. Please choose a different password.
        </p>
      )}

      {isBreached === false && validation.isValid && (
        <p className="text-xs text-green-600">
          ✓ Password has not been found in known breaches
        </p>
      )}
    </div>
  );
};
