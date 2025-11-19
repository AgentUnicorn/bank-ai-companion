export const TransferSuccessCard = ({ data }: {
    data: {
        amount: number;
        receiver_name: string;
        receiver_account: string;
        receiver_bank: string;
        transaction_id: string;
        time: string;
        description?: string;
    }
}) => {
    const formattedAmount = data.amount.toLocaleString("vi-VN");

    return (
        <div className="p-4 rounded-lg bg-white shadow-sm rounded-bl-none border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">Chuyển tiền thành công!</span>
            </div>

            <div className="text-center mb-4">
                <div className="text-3xl font-bold text-emerald-600">
                    -{formattedAmount} đ
                </div>
            </div>

            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">Người nhận</span>
                    <span className="font-medium text-right">{data.receiver_name}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Số tài khoản</span>
                    <span className="font-mono font-medium">{data.receiver_account}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Ngân hàng</span>
                    <span className="font-medium">{data.receiver_bank}</span>
                </div>
                {data.description && (
                    <div className="bg-gray-50 rounded-lg p-3 text-sm">
                        <span className="text-gray-600">Nội dung:</span> {data.description}
                    </div>
                )}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Mã giao dịch</span>
                    <span className="font-mono font-bold text-emerald-700">{data.transaction_id}</span>
                </div>
                <div className="text-center text-xs text-gray-500 mt-2">
                    Đã gửi biên lai qua SMS & email • {data.time}
                </div>
            </div>
        </div>
    );
};