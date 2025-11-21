import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import {users} from "../data/users.ts";

// --- ICONS ---
const CloseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);
const BackspaceIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 002.828 0L21 12M3 12l6.414-6.414a2 2 0 012.828 0L21 12" /></svg>
);
const CheckCircleIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
);
const FaceScanIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <g clipPath="url(#clip0_face_scan_icon)">
            <path d="M21.0802 8.58003V15.42C21.0802 16.54 20.4802 17.58 19.5102 18.15L13.5702 21.58C12.6002 22.14 11.4002 22.14 10.4202 21.58L4.48016 18.15C3.51016 17.59 2.91016 16.55 2.91016 15.42V8.58003C2.91016 7.46003 3.51016 6.41999 4.48016 5.84999L10.4202 2.42C11.3902 1.86 12.5902 1.86 13.5702 2.42L19.5102 5.84999C20.4802 6.41999 21.0802 7.45003 21.0802 8.58003Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11.9999 10.9998C13.2867 10.9998 14.3299 9.95662 14.3299 8.6698C14.3299 7.38298 13.2867 6.33984 11.9999 6.33984C10.7131 6.33984 9.66992 7.38298 9.66992 8.6698C9.66992 9.95662 10.7131 10.9998 11.9999 10.9998Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 16.6594C16 14.8594 14.21 13.3994 12 13.3994C9.79 13.3994 8 14.8594 8 16.6594" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
            <clipPath id="clip0_face_scan_icon">
                <rect width="24" height="24" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

const ValidatedIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <g clipPath="url(#clip0_validated_icon)">
            <path d="M10.49 2.23055L5.50003 4.11055C4.35003 4.54055 3.41003 5.90055 3.41003 7.12055V14.5505C3.41003 15.7305 4.19003 17.2805 5.14003 17.9905L9.44003 21.2005C10.85 22.2605 13.17 22.2605 14.58 21.2005L18.88 17.9905C19.83 17.2805 20.61 15.7305 20.61 14.5505V7.12055C20.61 5.89055 19.67 4.53055 18.52 4.10055L13.53 2.23055C12.68 1.92055 11.32 1.92055 10.49 2.23055Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.05005 11.8697L10.66 13.4797L14.96 9.17969" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
            <clipPath id="clip0_validated_icon">
                <rect width="24" height="24" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);

export type TransferStep = 'input' | 'confirm' | 'scanning' | 'validated' | 'success';

interface TransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    suggestedTransfer: { recipientName: string; amount: number; accountNumber?: string; memo?: string; } | null;
    onSuggestionHandled: () => void;
    step: TransferStep;
    onStepChange: (step: TransferStep) => void;
    onViewTransactions: () => void;
}

const TransferModal: React.FC<TransferModalProps> = ({ isOpen, onClose, suggestedTransfer, onSuggestionHandled, step, onStepChange, onViewTransactions }) => {
    const { t } = useTranslation();
    const [recipient, setRecipient] = useState('');
    const [bankName, setBankName] = useState('Gianty Bank');
    const [accountNumber, setAccountNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [memo, setMemo] = useState('');
    const [transactionDetails, setTransactionDetails] = useState({ id: '', time: '' });
    
    const amountInputRef = useRef<HTMLInputElement>(null);

    const isInputValid = recipient.trim() !== '' && accountNumber.toString().trim().length > 5 && parseFloat(amount) > 0;
    const user = users[0]

    const resetForm = useCallback(() => {
        onStepChange('input');
        setRecipient('');
        setBankName('Gianty Bank');
        setAccountNumber('');
        setAmount('');
        setMemo('');
        setTransactionDetails({ id: '', time: '' });
    }, [onStepChange]);
    
    const handleClose = useCallback(() => {
        resetForm();
        onClose();
    }, [onClose, resetForm]);

    useEffect(() => {
        if (suggestedTransfer) {
            onStepChange('input');
            setRecipient(suggestedTransfer.recipientName);
            setAmount(String(suggestedTransfer.amount));
            setAccountNumber(suggestedTransfer.accountNumber.toString() || '');
            setMemo(suggestedTransfer.memo || '');
            // onSuggestionHandled();
        }
    }, [suggestedTransfer, onSuggestionHandled, onStepChange]);
    
    useEffect(() => {
        if (isOpen && step === 'input') {
            setTimeout(() => amountInputRef.current?.focus(), 100);
        }
    }, [isOpen, step]);
    
    useEffect(() => {
        if (step === 'scanning') {
            setTransactionDetails({
                id: `TXN${Date.now()}`,
                time: new Date().toLocaleString()
            });
            const scanTimer = setTimeout(() => {
                onStepChange('validated');
                const successTimer = setTimeout(() => {
                    onStepChange('success');
                }, 1500);
                return () => clearTimeout(successTimer);
            }, 2000);
            return () => clearTimeout(scanTimer);
        }
    }, [step, onStepChange]);

    if (!isOpen) {
        return null;
    }

    const handleNumpadPress = (digit: string) => {
        if (digit === '.') {
            if (!amount.includes('.')) {
                setAmount(prev => prev.length === 0 ? '0.' : prev + '.');
            }
        } else {
            setAmount(prev => prev + digit);
        }
    };
    
    const handleBackspace = () => {
        setAmount(prev => prev.slice(0, -1));
    };
    
    const renderInputView = () => (
        <>
            <div id="transfer-modal-input-view" className="p-6 space-y-4">
                {/* Source Account */}
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-500 px-2">{t('transfer_from')}</label>
                    <button className="w-full flex items-center justify-between text-left p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400">
                        <div>
                            <p className="font-bold text-gray-800">{user.name}</p>
                            <p className="text-sm text-gray-600">...{user.account_number.slice(-4)}</p>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                 {/* Transfer To */}
                <div className="space-y-1">
                     <label className="text-sm font-semibold text-gray-500 px-2">{t('transfer_to')}</label>
                    <div className="bg-gray-100 border border-gray-300 rounded-lg divide-y divide-gray-300">
                        <div className="flex items-center">
                             <input id="bank-name-input" type="text" value={bankName} onChange={e => setBankName(e.target.value)} placeholder={t('transfer_bank')} aria-label={t('transfer_bank')} className="w-full bg-transparent py-3 px-4 text-gray-800 placeholder-gray-500 focus:outline-none" />
                             <ChevronRightIcon className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                        </div>
                        <input id="recipient-input" type="text" value={recipient} onChange={e => setRecipient(e.target.value)} placeholder={t('transfer_recipient')} aria-label={t('transfer_recipient')} className="w-full bg-transparent py-3 px-4 text-gray-800 placeholder-gray-500 focus:outline-none" />
                        <input id="account-number-input" type="text" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} placeholder={t('transfer_account_number')} aria-label={t('transfer_account_number')} className="w-full bg-transparent py-3 px-4 text-gray-800 placeholder-gray-500 focus:outline-none" />
                    </div>
                </div>

                {/* Amount */}
                <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-700/80 text-xl font-semibold">$</span>
                    <input ref={amountInputRef} id="amount-display-input" type="text" readOnly value={parseFloat(amount || '0').toLocaleString()} placeholder={t('transfer_amount')} aria-label={t('transfer_amount')} className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 pl-10 pr-5 text-gray-800 placeholder-gray-500 text-right text-3xl font-bold focus:outline-none" />
                </div>
                 <div id="numpad" className="grid grid-cols-3 gap-2 text-gray-800">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'].map(d => (
                        <button key={d} id={`numpad-${d}`} onClick={() => handleNumpadPress(d)} className="py-3 bg-gray-100 rounded-lg text-xl font-bold transition-all duration-100 ease-in-out hover:bg-gray-200 active:scale-95">{d}</button>
                    ))}
                    <button id="numpad-backspace" onClick={handleBackspace} className="py-3 bg-gray-100 rounded-lg flex items-center justify-center transition-all duration-100 ease-in-out hover:bg-gray-200 active:scale-95"><BackspaceIcon /></button>
                </div>
                <input id="memo-input" type="text" value={memo} onChange={e => setMemo(e.target.value)} placeholder={t('transfer_memo_optional')} aria-label={t('transfer_memo_optional')} className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-4 text-gray-800 placeholder-gray-500 focus:outline-none" />
            </div>
            <footer className="p-4 bg-gray-50 border-t border-gray-200">
                <button id="transfer-continue-button" onClick={() => onStepChange('confirm')} disabled={!isInputValid} className="w-full py-3 bg-cyan-500 text-white font-bold rounded-full transition-all hover:bg-cyan-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed">
                    {t('transfer_continue')}
                </button>
            </footer>
        </>
    );

    const renderConfirmView = () => (
        <>
            <div id="transfer-modal-confirm-view" className="p-6 space-y-4 text-gray-800">
                <div className="text-center">
                    <p className="text-gray-500">{t('transfer_move_money')}</p>
                    <p className="text-4xl font-bold text-cyan-600">$ {parseFloat(amount).toLocaleString()}</p>
                </div>
                <div id="transfer-summary" className="space-y-4">
                    <div className="p-3 bg-gray-100 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-500">{t('transfer_from')}</p>
                        <p className="font-semibold">{user.name}</p>
                        <p className="font-mono text-sm text-gray-600">...{user.account_number.slice(-4)}</p>
                    </div>
                     <div className="p-3 bg-gray-100 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-500">{t('transfer_to')}</p>
                        <p className="font-semibold">{recipient}</p>
                        <p className="font-mono text-sm text-gray-600">{bankName} - ...{accountNumber.slice(-4)}</p>
                    </div>
                    {memo && (
                         <div className="p-3 bg-gray-100 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-500">{t('transfer_memo')}</p>
                            <p className="italic">{memo}</p>
                        </div>
                    )}
                </div>
            </div>
             <footer className="p-4 bg-gray-50 border-t border-gray-200 flex gap-4">
                <button id="transfer-cancel-button" onClick={() => onStepChange('input')} className="w-full py-3 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors text-gray-700 font-semibold">{t('transfer_cancel')}</button>
                <button id="transfer-confirm-button" onClick={() => onStepChange('scanning')} className="w-full py-3 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition-colors font-semibold">{t('transfer_confirm_purchase')}</button>
            </footer>
        </>
    );
    
    const renderScanningView = () => (
        <div id="transfer-modal-scanning-view" className="p-8 flex flex-col items-center justify-center text-center space-y-4 text-gray-800 flex-grow h-[400px]">
            <style>{`
                @keyframes scan-line {
                    0% { transform: translateY(-10px); }
                    100% { transform: translateY(10px); }
                }
            `}</style>
            <div className="relative w-24 h-24 text-cyan-500">
                <FaceScanIcon className="w-full h-full" />
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-cyan-300/80 rounded-full" style={{ animation: 'scan-line 1s alternate ease-in-out infinite' }} />
            </div>
            <h3 className="text-xl font-bold animate-pulse">Scanning Face...</h3>
        </div>
    );
    
    const renderValidatedView = () => (
        <div id="transfer-modal-validated-view" className="p-8 flex flex-col items-center justify-center text-center space-y-4 text-gray-800 flex-grow h-[400px] animate-[fadeIn_0.3s_ease-out]">
            <ValidatedIcon className="w-24 h-24 text-cyan-500" />
            <h3 className="text-xl font-bold">Authenticated</h3>
        </div>
    );

     const renderSuccessView = () => (
        <div id="transfer-modal-success-view" className="p-8 flex flex-col items-center justify-center text-center space-y-4 text-gray-800 flex-grow">
            <CheckCircleIcon className="w-20 h-20 text-cyan-500" />
            <p className="text-gray-500">{t('transfer_move_money')}</p>
            <p className="text-4xl font-bold text-cyan-600">$ {parseFloat(amount).toLocaleString()}</p>
            
            <div className="w-full text-left space-y-3 pt-4 text-sm">
                 <div className="flex justify-between"><span className="text-gray-500">{t('transfer_from')}</span><span className="font-semibold text-right">{t('transfer_payment_account')} (...8765)</span></div>
                 <div className="flex justify-between"><span className="text-gray-500">{t('transfer_to')}</span><span className="font-semibold text-right">{recipient} (...{accountNumber.slice(-4)})</span></div>
                 {memo && <div className="flex justify-between"><span className="text-gray-500">{t('transfer_memo')}</span><span className="font-semibold text-right italic">"{memo}"</span></div>}
                 <div className="flex justify-between border-t border-gray-200 pt-3 mt-3"><span className="text-gray-500">{t('transfer_transaction_time')}</span><span className="font-mono text-gray-600">{transactionDetails.time}</span></div>
                 <div className="flex justify-between"><span className="text-gray-500">{t('transfer_transaction_id')}</span><span className="font-mono text-gray-600">{transactionDetails.id}</span></div>
            </div>
            
            <div className="pt-6 w-full max-w-xs flex flex-col gap-2">
                 <button id="transfer-done-button" onClick={handleClose} className="w-full py-3 bg-cyan-500 text-white font-semibold rounded-full hover:bg-cyan-600 transition-colors">{t('transfer_close')}</button>
                 <button id="view-transactions-button" onClick={onViewTransactions} className="w-full py-3 bg-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-300 transition-colors">{t('transfer_view_transactions')}</button>
            </div>
        </div>
    );
    
    const getTitle = () => {
        switch (step) {
            case 'input': return t('transfer_modal_title');
            case 'confirm': return t('transfer_purchase_summary');
            case 'scanning':
            case 'validated': return t('transfer_authenticating');
            case 'success': return t('transfer_successful');
            default: return '';
        }
    }

    return (
        <div id="transfer-modal" className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-[fadeIn_0.3s_ease-out]" onClick={handleClose}>
            <div id="transfer-modal-container" className="relative bg-white/90 backdrop-blur-xl border border-gray-200 rounded-lg w-full max-w-md flex flex-col overflow-hidden shadow-2xl shadow-cyan-500/10" onClick={(e) => e.stopPropagation()}>
                <header id="transfer-modal-header" className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 tracking-wide">{getTitle()}</h2>
                    <button id="transfer-modal-close-button" onClick={handleClose} className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors rounded-full" aria-label={t('transfer_close_modal')}><CloseIcon /></button>
                </header>
                {step === 'input' && renderInputView()}
                {step === 'confirm' && renderConfirmView()}
                {step === 'scanning' && renderScanningView()}
                {step === 'validated' && renderValidatedView()}
                {step === 'success' && renderSuccessView()}
            </div>
        </div>
    );
};

export default TransferModal;