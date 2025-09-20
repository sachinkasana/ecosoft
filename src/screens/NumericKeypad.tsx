import { Minus, RotateCcw, X, Check } from 'lucide-react';

interface NumericKeypadProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  onConfirm?: (digitsOnly: string) => void;
}

export function NumericKeypad({ phoneNumber, setPhoneNumber, onConfirm }: NumericKeypadProps) {
  const handleNumberClick = (num: string) => {
    // Limit to 10 digits for US phone numbers
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      setPhoneNumber(phoneNumber + num);
    }
  };

  const handleDelete = () => {
    setPhoneNumber(phoneNumber.slice(0, -1));
  };

  const handleClear = () => {
    setPhoneNumber('');
  };

  const handleConfirm = () => {
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    if (digitsOnly.length === 10) {
      onConfirm?.(digitsOnly);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-t-3xl border-t border-gray-200">
      <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
        {/* Row 1 */}
        <button
          onClick={() => handleNumberClick('1')}
          className="h-14 bg-white rounded-xl flex items-center justify-center text-xl font-medium shadow-sm active:scale-95 transition-transform touch-manipulation"
        >
          1
        </button>
        <button
          onClick={() => handleNumberClick('2')}
          className="h-14 bg-white rounded-xl flex items-center justify-center text-xl font-medium shadow-sm active:scale-95 transition-transform touch-manipulation"
        >
          2
        </button>
        <button
          onClick={() => handleNumberClick('3')}
          className="h-14 bg-white rounded-xl flex items-center justify-center text-xl font-medium shadow-sm active:scale-95 transition-transform touch-manipulation"
        >
          3
        </button>
        <button
          onClick={handleClear}
          className="h-14 bg-red-100 rounded-xl flex items-center justify-center shadow-sm active:scale-95 transition-transform touch-manipulation"
        >
          <Minus className="w-6 h-6 text-red-600" />
        </button>

        {/* Row 2 */}
        <button
          onClick={() => handleNumberClick('4')}
          className="h-14 bg-white rounded-xl flex items-center justify-center text-xl font-medium shadow-sm active:scale-95 transition-transform touch-manipulation"
        >
          4
        </button>
        <button
          onClick={() => handleNumberClick('5')}
          className="h-14 bg-white rounded-xl flex items-center justify-center text-xl font-medium shadow-sm active:scale-95 transition-transform touch-manipulation"
        >
          5
        </button>
        <button
          onClick={() => handleNumberClick('6')}
          className="h-14 bg-white rounded-xl flex items-center justify-center text-xl font-medium shadow-sm active:scale-95 transition-transform touch-manipulation"
        >
          6
        </button>
        <button
          onClick={handleClear}
          className="h-14 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm active:scale-95 transition-transform touch-manipulation"
        >
          <RotateCcw className="w-6 h-6 text-blue-600" />
        </button>

        {/* Row 3 */}
        <button
          onClick={() => handleNumberClick('7')}
          className="h-14 bg-white rounded-xl flex items-center justify-center text-xl font-medium shadow-sm active:scale-95 transition-transform touch-manipulation"
        >
          7
        </button>
        <button
          onClick={() => handleNumberClick('8')}
          className="h-14 bg-white rounded-xl flex items-center justify-center text-xl font-medium shadow-sm active:scale-95 transition-transform touch-manipulation"
        >
          8
        </button>
        <button
          onClick={() => handleNumberClick('9')}
          className="h-14 bg-white rounded-xl flex items-center justify-center text-xl font-medium shadow-sm active:scale-95 transition-transform touch-manipulation"
        >
          9
        </button>
        <button
          onClick={handleDelete}
          className="h-14 bg-gray-200 rounded-xl flex items-center justify-center shadow-sm active:scale-95 transition-transform touch-manipulation"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        {/* Row 4 */}
        <div className="h-14"></div>
        <button
          onClick={() => handleNumberClick('0')}
          className="h-14 bg-white rounded-xl flex items-center justify-center text-xl font-medium shadow-sm active:scale-95 transition-transform touch-manipulation"
        >
          0
        </button>
        <div className="h-14"></div>
        <button
          onClick={handleConfirm}
          disabled={phoneNumber.replace(/\D/g, '').length !== 10}
          className={`h-14 rounded-xl flex items-center justify-center shadow-sm active:scale-95 transition-transform touch-manipulation ${phoneNumber.replace(/\D/g, '').length === 10 ? 'bg-green-500' : 'bg-gray-300'}`}
        >
          <Check className={`w-6 h-6 ${phoneNumber.replace(/\D/g, '').length === 10 ? 'text-white' : 'text-gray-500'}`} />
        </button>
      </div>
    </div>
  );
}
