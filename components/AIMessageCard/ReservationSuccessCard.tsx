import {MessageData} from "../../types/aiMessage.ts";
import {v4 as uuidv4} from "uuid";

export const ReservationSuccessCard = ({ data }: { data: MessageData }) => {
    return (
        <div className="p-4 rounded-lg bg-white shadow-sm rounded-bl-none border border-gray-100">
            {/* Header thành công */}
            <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">Đặt bàn thành công!</span>
            </div>

            <div className="text-sm text-gray-600 mb-3">
                Mã đặt chỗ: <span className="font-bold text-green-600 text-base">{uuidv4()}</span>
            </div>

            {/* Thông tin chi tiết */}
            <div className="space-y-2 text-gray-800">
                <div className="flex justify-between">
                    <span className="text-gray-600">Nhà hàng</span>
                    <span className="font-medium text-right max-w-[60%]">{data.restaurant}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Thời gian</span>
                    <span className="font-medium">{data.datetime}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Số khách</span>
                    <span className="font-medium">{data.partySize} người</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Tên đặt chỗ</span>
                    <span className="font-medium">{data.fullName}</span>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500 text-center">
                Xác nhận đã gửi qua SMS & email • Có thể chỉnh sửa qua tin nhắn
            </div>
        </div>
    );
};