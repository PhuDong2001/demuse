import Link from "next/link";
import Image from "next/image";
import { RegisterForm } from "../RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-[#faf7f2] text-[#1c1917]">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <div className="relative h-12 w-12 mx-auto rounded-xl overflow-hidden border border-[#ded7c8] shadow-xs">
              <Image
                src="/demuse_logo.png"
                alt="Demuse Logo"
                width={48}
                height={48}
                className="object-cover h-full w-full"
                priority
              />
            </div>
          </Link>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-[#1c1917]">
            Demuse
          </h1>
          <p className="text-xs text-[#78716c]">
            Intentional timetable & weekly schedule planner
          </p>
        </div>

        {/* Register Card */}
        <div className="rounded-2xl border border-[#ded7c8] bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="font-serif text-lg font-medium text-[#1c1917]">
              Create your account
            </h2>
            <p className="text-xs text-[#78716c] mt-0.5">
              Start building your personal semester timetable
            </p>
          </div>

          {/* Form */}
          <RegisterForm />

          <div className="pt-2 text-center text-xs text-[#78716c]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#1c1917] hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>

        <p className="text-center text-[11px] text-[#a8a29e]">
          Designed with intention · Demuse Personal Planner
        </p>
      </div>
    </div>
  );
}
