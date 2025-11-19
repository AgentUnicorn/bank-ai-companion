export const exampleAccountInfo = {
    accountId: "NB-2025001",
    name: "Nguyễn Minh Anh",
    phone: "+84-912-345-678",
    email: "minhanh.nguyen@example.com",
    membershipTier: "Silver Member",        // (ví dụ cấp thành viên)
    balanceDue: "₫1,250,000",
    lastOrderDate: "2025-10-28",
    lastPaymentDate: "2025-10-30",
    lastPaymentAmount: "₫1,250,000",
    status: "Active",
    shippingAddress: {
        street: "45A Lê Lợi",
        ward: "Bến Nghé",
        district: "Quận 1",
        city: "TP. HCM",
        postalCode: "700000"
    },
    lastOrderDetails: {
        product: "Sữa bột nội địa Nhật – Nobinobi Premium",
        quantity: 2,
        subtotal: "₫1,190,000",
        shippingFee: "₫20,000",
        taxesAndFees: "₫40,000",
        notes: "Khách chọn giao nhanh – đã áp dụng mã giảm giá thành viên Silver."
    }
};

export const examplePolicyDocs = [
    {
        id: "NB-PD-001",
        name: "Chính sách đổi trả Nobinobi",
        topic: "đổi trả hàng",
        content: "Khách hàng có thể đổi hoặc trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng nếu hóa đơn và tem niêm phong còn nguyên vẹn. Sản phẩm phải còn nguyên trạng, không dùng thử, và không thuộc danh mục đồ ăn/dinh dưỡng mở hộp."
    },
    {
        id: "NB-PD-002",
        name: "Chính sách giao hàng và vận chuyển",
        topic: "giao hàng",
        content: "Miễn phí vận chuyển cho đơn hàng trên ₫1,000,000 trong nội thành TP.HCM và Hà Nội. Thời gian giao hàng thường 1-3 ngày làm việc, ngoại trừ các sản phẩm nhập khẩu đặc biệt."
    },
    {
        id: "NB-PD-003",
        name: "Chính sách thành viên Nobinobi",
        topic: "thành viên",
        content: "Khách hàng khi đạt tổng chi tiêu 10 triệu đồng/năm sẽ được nâng cấp lên cấp Gold và hưởng thêm 5% giảm giá vĩnh viễn cho các sản phẩm Nhật nội địa trong danh mục chính."
    }
];

export const exampleStoreLocations = [

    {
        name: "Nobinobi Store Đà Nẵng  Vincom",
        address: "89 Nguyễn Văn Linh, Hải Châu, Đà Nẵng",
        phone: "090 4 123 456",
        hours: "T2-CN 10:00-21:00"
    }
];

export const exampleProductSamples = [
    {
        productId: "NB-PR-001",
        name: "Sữa bột nội địa Nhật Nobinobi Premium 900g",
        price: "₫599,000",
        description: "Nhập khẩu từ Nhật Bản, dành cho bé từ 1 tuổi trở lên, thành phần chất lượng, không chứa hương liệu tổng hợp."
    },
    {
        productId: "NB-PR-002",
        name: "Kem dưỡng da bé Nhật Nobinobi Gentle Skin 200ml",
        price: "₫249,000",
        description: "Kem dưỡng da nhật bản dành cho da nhạy cảm của bé, không paraben, đã kiểm nghiệm an toàn."
    },
    {
        productId: "NB-PR-003",
        name: "Tã quần nội địa Nhật Smart Angel XL 44 miếng",
        price: "₫349,000",
        description: "Tã quần Nhật Smart Angel nhập khẩu từ Nhật, phù hợp cho bé cân nặng 12-17kg, thoáng khí – tốt cho làn da bé."
    }
];