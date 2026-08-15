"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";
import { ArrowLeft, FileText, Lock } from "reicon-react";

export default function TermsPage() {
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
              <FileText className="h-4 w-4" />
              <span>{isVi ? "Điều Khoản Sử Dụng" : "Terms of Service"}</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-medium tracking-tight text-[#1c1917]">
              {isVi ? "Điều Khoản & Điều Kiện Dịch Vụ" : "Terms & Conditions"}
            </h1>
            <p className="text-xs sm:text-sm text-[#78716c]">
              {isVi ? "Có hiệu lực từ: Tháng 8, 2026" : "Effective date: August 2026"}
            </p>
          </div>

          {/* Body Sections */}
          <div className="prose prose-stone text-xs sm:text-sm text-[#57534e] space-y-6 leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-serif text-base sm:text-lg font-semibold text-[#1c1917]">
                {isVi ? "1. Chấp thuận điều khoản" : "1. Acceptance of Terms"}
              </h2>
              <p>
                {isVi
                  ? "Bằng việc đăng ký tài khoản hoặc sử dụng ứng dụng Demuse, bạn đồng ý tuân thủ các điều khoản dịch vụ và chính sách quyền riêng tư này."
                  : "By creating an account or accessing Demuse, you agree to be bound by these Terms of Service and our Privacy Policy."}
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-base sm:text-lg font-semibold text-[#1c1917]">
                {isVi ? "2. Tài khoản & Trách nhiệm bảo mật" : "2. Account Responsibility"}
              </h2>
              <p>
                {isVi
                  ? "Bạn có trách nhiệm bảo mật mật khẩu tài khoản của mình và chịu trách nhiệm cho mọi hoạt động diễn ra dưới tài khoản đó. Vui lòng thông báo ngay cho chúng tôi nếu bạn phát hiện hành vi truy cập trái phép."
                  : "You are responsible for safeguarding your password and account credentials. Notify us immediately if you suspect unauthorized access to your account."}
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-base sm:text-lg font-semibold text-[#1c1917]">
                {isVi ? "3. Sử dụng hợp pháp & Đúng mục đích" : "3. Permitted & Acceptable Use"}
              </h2>
              <p>
                {isVi
                  ? "Demuse được thiết kế nhằm mục đích hỗ trợ học sinh, sinh viên và giảng viên quản lý lịch trình cá nhân. Bạn không được phép sử dụng dịch vụ để truyền bá nội dung độc hại, vi phạm pháp luật hoặc cố ý tấn công hệ thống."
                  : "Demuse is designed to help students and educators manage academic schedules. You agree not to abuse, reverse-engineer, or attempt unauthorized exploitation of the platform."}
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-base sm:text-lg font-semibold text-[#1c1917]">
                {isVi ? "4. Giới hạn trách nhiệm" : "4. Disclaimer of Warranties"}
              </h2>
              <p>
                {isVi
                  ? "Dịch vụ được cung cấp theo nguyên trạng ('as is'). Mặc dù chúng tôi nỗ lực tối đa để duy trì tính liên tục và độ tin cậy của thông báo, chúng tôi khuyến khích người dùng chủ động kiểm tra lịch học chính thức từ trường học của mình."
                  : "Demuse is provided 'as is' without warranties of any kind. While we strive for maximum uptime and reliable alerts, students are encouraged to cross-check schedules with official university sources."}
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
            <span>Demuse Legal & Compliance</span>
          </span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-[#1c1917] underline">
              {isVi ? "Chính sách bảo mật" : "Privacy Policy"}
            </Link>
            <span>© {new Date().getFullYear()} Demuse</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
