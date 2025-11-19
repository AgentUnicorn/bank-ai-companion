// --- NEW: components/TransactionsModal.tsx ---

import React, { useState, useMemo } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { Transaction } from '../data/transactions';
import { TransferIcon } from './Icons'; // Re-using for visual consistency
import { PaymentIcon, QrScanIcon } from '../data/features'; // Re-using feature icons

// --- ICONS ---
const CloseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);
const SearchIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
);

interface TransactionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    transactions: Transaction[];
}

const TransactionTypeIcon: React.FC<{ type: Transaction['type'] }> = ({ type }) => {
    switch (type) {
        case 'Transfer': return <TransferIcon className="w-5 h-5 text-cyan-600" />;
        case 'Bill Payment': return <PaymentIcon className="w-5 h-5 text-purple-600" />;
        case 'QR Payment': return <QrScanIcon className="w-5 h-5 text-emerald-600" />;
        default: return null;
    }
};

const StatusBadge: React.FC<{ status: Transaction['status'] }> = ({ status }) => {
    const { t } = useTranslation();
    const baseClasses = "text-xs font-semibold px-2 py-0.5 rounded-full";
    switch (status) {
        case 'Completed': return <span className={`${baseClasses} bg-green-100 text-green-800`}>{t('transactions_status_completed')}</span>;
        case 'Pending': return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>{t('transactions_status_pending')}</span>;
        case 'Failed': return <span className={`${baseClasses} bg-red-100 text-red-800`}>{t('transactions_status_failed')}</span>;
        default: return null;
    }
};

const TransactionsModal: React.FC<TransactionsModalProps> = ({ isOpen, onClose, transactions }) => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx =>
            tx.recipient.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [transactions, searchQuery]);

    if (!isOpen) {
        return null;
    }

    return (
        <div
            id="transactions-modal"
            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-[fadeIn_0.3s_ease-out]"
            onClick={onClose}
        >
             <style>{`
                #transactions-scroll-container::-webkit-scrollbar { width: 6px; }
                #transactions-scroll-container::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.1); border-radius: 10px; }
                #transactions-scroll-container::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.2); border-radius: 10px; }
                #transactions-scroll-container::-webkit-scrollbar-thumb:hover { background-color: rgba(0, 0, 0, 0.3); }
            `}</style>
            <div
                id="transactions-modal-container"
                className="relative bg-white/90 backdrop-blur-xl border border-gray-200 rounded-lg w-full max-w-lg h-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl shadow-cyan-500/10"
                onClick={(e) => e.stopPropagation()}
            >
                {/* --- HEADER --- */}
                <header id="transactions-modal-header" className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 tracking-wide">{t('transactions_modal_title')}</h2>
                    <button
                        id="transactions-modal-close-button"
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors rounded-full"
                        aria-label="Close"
                    >
                        <CloseIcon />
                    </button>
                </header>

                {/* --- SEARCH BAR --- */}
                <div className="p-4 border-b border-gray-200 flex-shrink-0">
                    <div className="relative text-gray-500">
                        <input
                            id="transactions-search-input"
                            type="search"
                            placeholder={t('transactions_search_placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-100 border border-gray-300 rounded-full py-2.5 pl-10 pr-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/80 focus:border-cyan-400 transition-all"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon />
                        </div>
                    </div>
                </div>

                {/* --- TRANSACTIONS LIST --- */}
                <div id="transactions-scroll-container" className="flex-grow overflow-y-auto bg-gray-50/50">
                    {transactions.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <p>{t('transactions_no_history')}</p>
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                         <div className="flex items-center justify-center h-full text-gray-500">
                            <p>{t('transactions_no_results')}</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {filteredTransactions.map(tx => (
                                <li key={tx.id} id={`transaction-${tx.id}`} className="p-4 flex items-center justify-between hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-200 shadow-sm">
                                            <TransactionTypeIcon type={tx.type} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{tx.recipient}</p>
                                            <p className="text-sm text-gray-500">{tx.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-800">${tx.amount.toFixed(2)}</p>
                                        <StatusBadge status={tx.status} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionsModal;
