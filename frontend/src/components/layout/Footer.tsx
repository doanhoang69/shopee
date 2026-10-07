import { Fingerprint } from "lucide-react";

function VerifiedBadge() {
  return (
    <div className="flex items-center gap-1 rounded-sm border border-red-500 bg-white px-2 py-1">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path
            d="M5 13l4 4L19 7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="leading-tight text-red-600">
        <div className="text-[11px] font-bold">ĐÃ ĐĂNG KÝ</div>
        <div className="text-[9px] font-semibold">BỘ CÔNG THƯƠNG</div>
      </div>
    </div>
  );
}

const Footer = () => {
  const links = [
    "CHÍNH SÁCH BẢO MẬT",
    "QUY CHẾ HOẠT ĐỘNG",
    "CHÍNH SÁCH VẬN CHUYỂN",
    "CHÍNH SÁCH TRẢ HÀNG VÀ HOÀN TIỀN",
  ];

  return (
    <footer className="mt-10 bg-white px-4 py-10 text-gray-500">
      <div className="mx-auto max-w-4xl">
        {/* Policy links */}
        <nav className="flex flex-wrap items-center justify-center gap-4 text-[13px] font-medium tracking-wide">
          {links.map((label, i) => (
            <span key={label} className="flex items-center gap-4">
              {i > 0 && <span className="h-3 w-px bg-gray-300" />}
              <p className="hover:text-gray-700">{label}</p>
            </span>
          ))}
        </nav>

        {/* Badges */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <VerifiedBadge />
          <VerifiedBadge />
          <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-red-500">
            <Fingerprint className="h-6 w-6 text-red-500" />
          </div>
        </div>

        {/* Company info */}
        <div className="mt-4 space-y-1.5 text-center text-[13px]">
          <p className="font-medium text-gray-600">Công ty TNHH Shopee</p>
          <p>
            Địa chỉ: Tầng 4-5-6, Tòa nhà Capital Place, số 29 đường Liễu Giai,
            Phường Ngọc Hà, Thành phố Hà Nội, Việt Nam
          </p>
          <p>
            Chăm sóc khách hàng: Gọi tổng đài Shopee (miễn phí) hoặc Trò chuyện
            với Shopee ngay trên Trung tâm trợ giúp
          </p>
          <p>Chịu Trách Nhiệm Quản Lý Nội Dung: Nguyễn Bùi Anh Tuấn</p>
          <p>
            Mã số doanh nghiệp: 0106773786 do Sở Kế hoạch và Đầu tư TP Hà Nội
            cấp lần đầu ngày 10/02/2015
          </p>
          <p>© 2015 - Bản quyền thuộc về Công ty TNHH Shopee</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
