"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";
import { ArrowLeft, Shield, Lock } from "reicon-react";

export default function PrivacyPage() {
  const { language } = useLanguage();

  const isVi = language === "vi";

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-[#1c1917]">
      {/* Header */}
      <header className="border-b border-[#e8e1d5] bg-[#faf7f2]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative h-8 w-8 rounded-xl overflow-hidden border border-[#ded7c8] bg-[#1c1917] flex items-center justify-center shrink-0">
              <Image
                src="/demuse_logo.png"
                alt="Demuse Logo"
                width={32}
                height={32}
                className="object-cover h-full w-full"
              />
            </div>
            <span className="font-serif text-xl font-medium tracking-tight text-[#1c1917]">
              Demuse
            </span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#57534e] hover:text-[#1c1917] px-3 py-1.5 rounded-lg border border-[#ded7c8] bg-white transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{isVi ? "Trang chủ" : "Home"}</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="rounded-2xl border border-[#ded7c8] bg-white p-6 sm:p-10 shadow-xs space-y-8">
          {/* Title */}
          <div className="space-y-2 pb-6 border-b border-[#f0eae1]">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#78716c]">
              <Shield className="h-4 w-4" />
              <span>{isVi ? "Chính Sách Bảo Mật" : "Privacy Policy"}</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-medium tracking-tight text-[#1c1917]">
              {isVi ? "Chính Sách Quyền Riêng Tư & Dữ Liệu" : "Privacy & Data Protection Policy"}
            </h1>
            <p className="text-xs sm:text-sm text-[#78716c]">
              {isVi ? "Cập nhật lần cuối: Tháng 8, 2026" : "Last updated: August 2026"}
            </p>
          </div>

          {/* Body Sections */}
          <div className="prose prose-stone text-xs sm:text-sm text-[#57534e] space-y-6 leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-serif text-base sm:text-lg font-semibold text-[#1c1917]">
                {isVi ? "1. Thu thập dữ liệu cá nhân" : "1. Personal Data Collection"}
              </h2>
              <p>
                {isVi
                  ? "Demuse chỉ thu thập các thông tin tối thiểu cần thiết để cung cấp dịch vụ quản lý lịch học:"
                  : "Demuse collects only minimal data necessary to provide timetable and schedule management services:"}
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>{isVi ? "Thông tin tài khoản: Họ và tên, địa chỉ email, mật khẩu đã được mã hóa bằng thuật toán Argon2id." : "Account details: Full name, email address, Argon2id cryptographically salted and hashed password."}</li>
                <li>{isVi ? "Dữ liệu thời khóa biểu: Tên môn học, mã môn, phòng học, giảng viên, ghi chú và khung giờ học do bạn nhập." : "Timetable data: Subject names, course codes, classrooms, instructors, notes, and class time slots entered by you."}</li>
                <li>{isVi ? "Tùy chọn cá nhân: Cài đặt thông báo, ngôn ngữ hiển thị (VI, EN, FR, DE)." : "User preferences: Notification lead times and UI language choices (VI, EN, FR, DE)."}</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-base sm:text-lg font-semibold text-[#1c1917]">
                {isVi ? "2. Cam kết bảo mật & Lưu trữ phiên đăng nhập" : "2. Security & Session Storage"}
              </h2>
              <p>
                {isVi
                  ? "Chúng tôi áp dụng các tiêu chuẩn an toàn bảo mật cao nhất trong kỹ thuật web hiện đại:"
                  : "We adhere to rigorous modern web security standards:"}
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>
                  <strong>Cookie HTTPOnly:</strong> {isVi ? "Phiên làm việc (JWT) được lưu trữ độc quyền trong HTTPOnly Cookie, ngăn chặn hoàn toàn việc rò rỉ token qua các lỗ hổng mã độc XSS." : "Authentication tokens (JWT) are stored exclusively in HTTPOnly cookies to prevent token extraction via XSS vulnerabilities."}
                </li>
                <li>
                  <strong>{isVi ? "Cách ly dữ liệu người dùng:" : "Tenant Isolation:"}</strong> {isVi ? "Mỗi người dùng có vùng dữ liệu riêng biệt. Hệ thống kiểm tra quyền sở hữu chặt chẽ trên mỗi truy vấn cơ sở dữ liệu." : "Every user's schedule is strictly isolated and validated via verified user ID checks on every database transaction."}
                </li>
                <li>
                  <strong>{isVi ? "Không lưu dữ liệu nhạy cảm trên máy khách:" : "No Sensitive Storage in Browser:"}</strong> {isVi ? "Trình duyệt (localStorage) chỉ lưu các cài đặt giao diện không nhạy cảm như lựa chọn ngôn ngữ." : "Browser local storage is restricted strictly to non-sensitive UI settings such as language selection."}
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-base sm:text-lg font-semibold text-[#1c1917]">
                {isVi ? "3. Quyền chia sẻ công khai" : "3. Public Sharing Controls"}
              </h2>
              <p>
                {isVi
                  ? "Thời khóa biểu của bạn mặc định là Riêng tư (Private). Bạn chỉ chia sẻ thời khóa biểu ở chế độ chỉ đọc khi bạn chủ động bật tính năng 'Chia sẻ' và gửi liên kết (Share Token) cho người khác. Bạn có thể thu hồi quyền truy cập hoặc đổi mã liên kết bất kỳ lúc nào trong trang Thời khóa biểu."
                  : "Your timetable is Private by default. It is only accessible to others in read-only mode if you explicitly enable public sharing. You can revoke public access or regenerate share tokens at any time."}
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-base sm:text-lg font-semibold text-[#1c1917]">
                {isVi ? "4. Quyền của người dùng & Xóa dữ liệu" : "4. User Rights & Data Deletion"}
              </h2>
              <p>
                {isVi
                  ? "Bạn có toàn quyền chỉnh sửa, cập nhật hoặc xóa bất kỳ môn học, lịch học nào trong tài khoản của mình. Khi bạn xóa một môn học, toàn bộ lịch học tương ứng sẽ được xóa vĩnh viễn khỏi cơ sở dữ liệu."
                  : "You retain full ownership of your data with the right to update or delete any subjects and schedule slots at any time. Deleted records are permanently removed from our databases."}
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e8e1d5] bg-white py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#78716c]">
          <span className="flex items-center gap-1">
            <Lock className="h-3.5 w-3.5" />
            <span>Demuse Data Protection & Security</span>
          </span>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-[#1c1917] underline">
              {isVi ? "Điều khoản dịch vụ" : "Terms of Service"}
            </Link>
            <span>© {new Date().getFullYear()} Demuse</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
