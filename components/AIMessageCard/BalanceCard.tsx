export const BalanceCard = ({ data }: { data: { balance: number; account_number: string } }) => {
    const formattedBalance = data.balance.toLocaleString("vi-VN");
    const formattedAccountNumber = data.account_number.slice(-4)

    return (
        <div className="p-4 rounded-lg bg-white shadow-sm rounded-bl-none border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">Số dư khả dụng</span>
            </div>

            <div className="text-center mb-4">
                <div className="text-3xl font-bold text-emerald-600">
                    {formattedBalance} <span className="text-xl">đ</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                    Tài khoản **** {formattedAccountNumber}
                </div>
            </div>

            <div className="flex gap-2 text-xs">
                <div className="flex-1 bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-gray-600">Cập nhật lúc</div>
                    <div className="font-medium">{new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</div>
                </div>
                <div className="flex-1 bg-emerald-50 rounded-lg p-2 text-center">
                    <div className="text-emerald-700 font-medium">An toàn 100%</div>
                </div>
            </div>
        </div>
    );
};