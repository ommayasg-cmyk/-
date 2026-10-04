import React, { useState } from 'react';
import { Lock, ShieldAlert, KeyRound, X, CheckCircle } from 'lucide-react';

interface TeacherCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TeacherCodeModal: React.FC<TeacherCodeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim() === '1111') {
      setError('');
      setCode('');
      onSuccess();
    } else {
      setError('رمز الدخول السري غير صحيح! يرجى المحاولة مرة أخرى.');
      setCode('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden text-right animate-in fade-in zoom-in-95 duration-200"
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mb-3 shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-cairo text-xl font-bold">
            دخول المعلم/ـة المشرف/ـة
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            منطقة محمية خاصة بالمعلمين للاطلاع على سجل نتائج الطلبة ونسب الأداء والتقارير.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 flex items-start gap-2.5">
            <KeyRound className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>
              الرجاء إدخال رمز الدخول السري المخصص للمعلم/ـة للاطلاع على سجل نتائج وأداء الطلبة.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              رمز الدخول (PIN Code):
            </label>
            <input
              type="password"
              maxLength={6}
              autoFocus
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError('');
              }}
              placeholder="••••"
              className="w-full px-4 py-3 text-center text-2xl tracking-widest font-mono bg-slate-50 border border-slate-300 rounded-2xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-hidden transition-all text-slate-900"
            />
            {error && (
              <p className="text-xs text-rose-600 font-bold mt-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </p>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 active:scale-98 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <CheckCircle className="w-4 h-4 text-amber-400" />
              <span>دخول سجل النتائج</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
