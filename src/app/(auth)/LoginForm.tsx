"use client";

import * as React from "react";
import { useActionState } from "react";
import { loginAction, type ActionState } from "@/actions/auth.actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const initialState: ActionState = {};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-medium">
          {state.error}
        </div>
      )}

      <Input
        label="Email Address"
        name="email"
        type="email"
        placeholder="you@university.edu"
        error={state.fieldErrors?.email?.[0]}
        required
      />

      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="••••••••"
        error={state.fieldErrors?.password?.[0]}
        required
      />

      {/* Remember Me Option */}
      <div className="flex items-center justify-between pt-0.5">
        <label className="flex items-center gap-2 text-xs text-[#57534e] cursor-pointer select-none group">
          <input
            type="checkbox"
            name="rememberMe"
            defaultChecked
            className="h-4 w-4 rounded border border-[#ded7c8] accent-[#1c1917] focus:ring-1 focus:ring-[#1c1917] cursor-pointer"
          />
          <span className="group-hover:text-[#1c1917] transition-colors">
            Remember me on this device
          </span>
        </label>
      </div>

      <Button type="submit" size="md" className="w-full mt-2" isLoading={isPending}>
        Sign In
      </Button>
    </form>
  );
}
