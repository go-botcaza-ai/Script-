import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Lock,
  CheckCircle2,
  Mail,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ContentItem, PurchaseRecord, AccessTokenState } from '../types';
import { sendPayPerViewReceiptEmail } from '../lib/gmail';
import { googleSignIn } from '../lib/auth';

interface CheckoutModalProps {
  item: ContentItem | null;
  isOpen: boolean;
  onClose: () => void;
  authState: AccessTokenState;
  onAuthStateChange: (state: AccessTokenState) => void;
  onUnlockSuccess: (record: PurchaseRecord) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  item,
  isOpen,
  onClose,
  authState,
  onAuthStateChange,
  onUnlockSuccess
}) => {
  if (!isOpen || !item) return null;

  const [selectedGateway, setSelectedGateway] = useState<'stripe' | 'paypal' | 'crypto' | 'card'>('stripe');
  const [buyerEmail, setBuyerEmail] = useState(authState.userEmail || '');
  const [buyerName, setBuyerName] = useState(authState.userName || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sendReceiptCheckbox, setSendReceiptCheckbox] = useState(true);

  // Quick Google Sign-In helper if user is not signed in
  const handleConnectGoogle = async () => {
    try {
      setErrorMessage(null);
      const res = await googleSignIn();
      if (res) {
        onAuthStateChange({
          userEmail: res.user.email,
          userName: res.user.displayName,
          userPhoto: res.user.photoURL,
          accessToken: res.accessToken,
          isAuthenticated: true
        });
        setBuyerEmail(res.user.email || '');
        setBuyerName(res.user.displayName || '');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al conectar cuenta de Google');
    }
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerEmail.trim()) {
      setErrorMessage('Por favor introduce tu correo para recibir el token de acceso.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setStatusMessage('Validando pasarela de pago ' + selectedGateway.toUpperCase() + '...');

    try {
      // Simulate gateway transaction validation (Stripe/PayPal PHP Webhook simulation)
      await new Promise((resolve) => setTimeout(resolve, 1400));

      const generatedToken = 'PPV-' + Math.random().toString(36).substring(2, 9).toUpperCase() + '-' + Date.now().toString(36).toUpperCase();
      let receiptDelivered = false;

      // If user has Gmail authorization and checkbox is selected, send via Gmail API
      if (sendReceiptCheckbox && authState.accessToken && authState.isAuthenticated) {
        setStatusMessage('Enviando recibo oficial y token de acceso a tu Gmail...');
        try {
          await sendPayPerViewReceiptEmail({
            accessToken: authState.accessToken,
            recipientEmail: buyerEmail,
            recipientName: buyerName || 'Suscriptor Pay Per View',
            contentTitle: item.title,
            amount: item.price,
            currency: 'USD',
            paymentGateway: selectedGateway,
            accessKey: generatedToken,
            accessDuration: item.accessDuration
          });
          receiptDelivered = true;
        } catch (mailErr: any) {
          console.warn('Gmail notification note:', mailErr);
          // Don't fail the purchase unlock if Gmail quota or scope failed, inform the user
        }
      }

      const purchaseRecord: PurchaseRecord = {
        id: 'tx-' + Date.now(),
        contentId: item.id,
        contentTitle: item.title,
        amount: item.price,
        currency: 'USD',
        paymentGateway: selectedGateway,
        buyerEmail: buyerEmail,
        buyerName: buyerName || 'Usuario Premium',
        purchaseDate: new Date().toISOString(),
        accessKey: generatedToken,
        status: 'completed',
        receiptSentViaGmail: receiptDelivered
      };

      // Fire celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      onUnlockSuccess(purchaseRecord);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error durante la transacción de pago');
    } finally {
      setIsProcessing(false);
      setStatusMessage(null);
    }
  };

  return (
    <div id="checkout-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div
        id="checkout-modal-dialog"
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Pase Pay Per View (PPV)
              </h2>
              <p className="text-xs text-slate-500">
                Acceso instantáneo y seguro por visualización
              </p>
            </div>
          </div>
          <button
            id="btn-close-checkout"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Content summary box */}
          <div className="flex gap-4 p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-24 h-16 object-cover rounded-lg shrink-0 border border-slate-200"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wide block">
                {item.categoryLabel}
              </span>
              <h4 className="text-sm font-semibold text-slate-900 truncate">
                {item.title}
              </h4>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {item.duration}
                </span>
                <span>•</span>
                <span>{item.accessDuration}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[11px] text-slate-400 block">Total a pagar</span>
              <span className="text-lg font-black text-slate-900">${item.price.toFixed(2)}</span>
            </div>
          </div>

          {/* Google Sign In Banner for Receipts */}
          {!authState.isAuthenticated && (
            <div className="bg-indigo-50/80 border border-indigo-100 rounded-xl p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-indigo-950">
                    ¿Quieres recibir tu recibo por Gmail?
                  </p>
                  <p className="text-[11px] text-indigo-700">
                    Conecta tu cuenta para enviar comprobante con tu token.
                  </p>
                </div>
              </div>
              <button
                type="button"
                id="btn-modal-connect-google"
                onClick={handleConnectGoogle}
                className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors"
              >
                Conectar
              </button>
            </div>
          )}

          <form onSubmit={handleProcessPayment} className="space-y-4">
            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Selecciona la Pasarela de Pago
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'stripe', name: 'Stripe', desc: 'Tarjetas crédito/débito' },
                  { id: 'paypal', name: 'PayPal', desc: 'Saldo o tarjeta' },
                  { id: 'card', name: 'Direct Card', desc: 'PHP Gateway' },
                  { id: 'crypto', name: 'Coinbase', desc: 'Criptoactivos' }
                ].map((gw) => (
                  <button
                    key={gw.id}
                    type="button"
                    onClick={() => setSelectedGateway(gw.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      selectedGateway === gw.id
                        ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-900 block">{gw.name}</span>
                    <span className="text-[10px] text-slate-500 mt-1 block leading-tight">{gw.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* User Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nombre completo
                </label>
                <input
                  id="checkout-input-name"
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Correo electrónico <span className="text-rose-500">*</span>
                </label>
                <input
                  id="checkout-input-email"
                  type="email"
                  required
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Gmail dispatch checkbox */}
            {authState.isAuthenticated && (
              <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 text-xs text-emerald-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendReceiptCheckbox}
                  onChange={(e) => setSendReceiptCheckbox(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <span className="flex-1 font-medium">
                  Enviar confirmación oficial de Pay Per View a <strong>{buyerEmail || authState.userEmail}</strong> mediante Gmail
                </span>
              </label>
            )}

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-2">
              <button
                id="btn-confirm-purchase"
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{statusMessage || 'Procesando pago seguro...'}</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Completar Pago de ${item.price.toFixed(2)} USD</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security guarantee footnotes */}
          <div className="flex items-center justify-center gap-6 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Encriptación AES-256
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Desbloqueo Inmediato
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
