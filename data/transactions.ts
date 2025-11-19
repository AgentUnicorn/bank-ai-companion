// --- NEW: data/transactions.ts ---

export interface Transaction {
    id: string;
    date: string;
    recipient: string;
    amount: number;
    status: 'Completed' | 'Pending' | 'Failed';
    type: 'Transfer' | 'Bill Payment' | 'QR Payment';
}

// Helper to format dates relative to today
const getDate = (daysAgo: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const transactionsData: Transaction[] = [
    {
        id: 'TXN847261940',
        date: getDate(2),
        recipient: 'Chau',
        amount: 20.00,
        status: 'Completed',
        type: 'Transfer'
    },
    {
        id: 'TXN283710384',
        date: getDate(5),
        recipient: 'Uber Eats',
        amount: 32.50,
        status: 'Completed',
        type: 'Bill Payment'
    },
    {
        id: 'TXN991028472',
        date: getDate(10),
        recipient: 'Alex Johnson',
        amount: 150.00,
        status: 'Completed',
        type: 'Transfer'
    },
    {
        id: 'TXN502847163',
        date: getDate(15),
        recipient: 'Starbucks',
        amount: 7.85,
        status: 'Completed',
        type: 'QR Payment'
    },
    {
        id: 'TXN110384726',
        date: getDate(22),
        recipient: 'Jane Doe',
        amount: 500.00,
        status: 'Pending',
        type: 'Transfer'
    }
];
