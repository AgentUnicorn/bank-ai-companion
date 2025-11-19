import React from 'react';
// FIX: Import TransferIcon from the central Icons component file.
import { TransferIcon } from '../components/Icons';

export interface Feature {
    nameKey: string;
    key: string;
    icon: React.FC<any>;
    descriptionKey: string;
}

// --- NEW BANKING ICON COMPONENTS ---
const PromotionsIcon: React.FC = () => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement("path", { d: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" }),
    React.createElement("line", { x1: "7", y1: "7", x2: "7.01", y2: "7" })
);
// FIX: Add className prop to QrScanIcon to allow styling.
export const QrScanIcon: React.FC<{ className?: string }> = ({ className }) => React.createElement("svg", { className, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement("path", { d: "M3 7V5a2 2 0 0 1 2-2h2" }),
    React.createElement("path", { d: "M17 3h2a2 2 0 0 1 2 2v2" }),
    React.createElement("path", { d: "M21 17v2a2 2 0 0 1-2 2h-2" }),
    React.createElement("path", { d: "M7 21H5a2 2 0 0 1-2-2v-2" }),
    React.createElement("rect", { x: "7", y: "7", width: "10", height: "10" })
);
const StatementIcon: React.FC = () => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
    React.createElement("polyline", { points: "14 2 14 8 20 8" }),
    React.createElement("line", { x1: "16", y1: "13", x2: "8", y2: "13" }),
    React.createElement("line", { x1: "16", y1: "17", x2: "8", y2: "17" }),
    React.createElement("polyline", { points: "10 9 9 9 8 9" })
);
// FIX: Add className prop to PaymentIcon to allow styling.
export const PaymentIcon: React.FC<{ className?: string }> = ({ className }) => React.createElement("svg", { className, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement("rect", { x: "2", y: "7", width: "20", height: "14", rx: "2", ry: "2" }),
    React.createElement("path", { d: "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" })
);
const APIKeyIcon: React.FC = () => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor" }, React.createElement("path", { d: "M12.75 2.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5zM12.25 10.5a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0zM10.5 12.25a2.25 2.25 0 110-4.5 2.25 2.25 0 010 4.5zM7.25 10.5a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0zM10.5 7.25a2.25 2.25 0 110-4.5 2.25 2.25 0 010 4.5zM4.75 13.75a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H4.75zM12 16.5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5a.75.75 0 01.75-.75z" }));

const CardIcon: React.FC = () => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement("rect", { x: "1", y: "6", width: "22", height: "12", rx: "2" }),
    React.createElement("line", { x1: "1", y1: "10", x2: "23", y2: "10" })
);
const LoanIcon: React.FC = () => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement("path", { d: "M15 18H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" }),
    React.createElement("path", { d: "M12 18v-1.4c0-1 .8-1.8 1.8-1.8h1.4" }),
    React.createElement("path", { d: "M14 6v2h3" }),
    React.createElement("path", { d: "M9 14h.01" }),
    React.createElement("path", { d: "M10 10.5c.8-.8 2-.8 2.8 0L15 12.7" }),
    React.createElement("path", { d: "M18 21.3a4.3 4.3 0 1 0 0-8.6 4.3 4.3 0 0 0 0 8.6Z" }),
    React.createElement("path", { d: "M18 15v4" }),
    React.createElement("path", { d: "M16 17h4" })
);
const InvestmentIcon: React.FC = () => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement("path", { d: "M3 3v18h18" }),
    React.createElement("path", { d: "m19 9-5 5-4-4-3 3" })
);
const InsuranceIcon: React.FC = () => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }),
    React.createElement("path", { d: "m9 12 2 2 4-4" })
);
const LocationIcon: React.FC = () => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement("path", { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }),
    React.createElement("circle", { cx: "12", cy: "10", r: "3" })
);

export const features: Feature[] = [
    { nameKey: 'feature_transfer_name', key: 'transfer', icon: TransferIcon, descriptionKey: 'feature_transfer_description' },
    { nameKey: 'feature_promotions_name', key: 'promotions', icon: PromotionsIcon, descriptionKey: 'feature_promotions_description' },
    { nameKey: 'feature_qr_scan_name', key: 'qr_scan', icon: QrScanIcon, descriptionKey: 'feature_qr_scan_description' },
    { nameKey: 'feature_statement_name', key: 'statement', icon: StatementIcon, descriptionKey: 'feature_statement_description' },
    { nameKey: 'feature_payment_name', key: 'payment', icon: PaymentIcon, descriptionKey: 'feature_payment_description' },
    { nameKey: 'feature_card_name', key: 'card', icon: CardIcon, descriptionKey: 'feature_card_description' },
    { nameKey: 'feature_loan_name', key: 'loan', icon: LoanIcon, descriptionKey: 'feature_loan_description' },
    { nameKey: 'feature_investment_name', key: 'investment', icon: InvestmentIcon, descriptionKey: 'feature_investment_description' },
    { nameKey: 'feature_insurance_name', key: 'insurance', icon: InsuranceIcon, descriptionKey: 'feature_insurance_description' },
    { nameKey: 'feature_location_name', key: 'location', icon: LocationIcon, descriptionKey: 'feature_location_description' },
    { nameKey: 'feature_api_key_name', key: 'api_key', icon: APIKeyIcon, descriptionKey: 'feature_api_key_description' },
];

export const featureMap = new Map(features.map(f => [f.key, f]));
