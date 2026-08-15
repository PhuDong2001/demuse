"use client";

import * as React from "react";
import { useActionState } from "react";
import { registerAction, type ActionState } from "@/actions/auth.actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const initialState: ActionState = {};

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-medium">
          {state.error}
        </div>
      )}

      <Input
        label="Full Name"
        name="name"
        placeholder="e.g. Alex Morgan"
        error={state.fieldErrors?.name?.[0]}
        required
      />
      <Input
        label="Email Address"
        name="email"
        type="email"
        placeholder="alex@university.edu"
        error={state.fieldErrors?.email?.[0]}
        required
      />
      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="Min. 6 characters"
        error={state.fieldErrors?.password?.[0]}
        required
      />

      <Button type="submit" size="md" className="w-full mt-2" isLoading={isPending}>
        Create Account
      </Button>
    </form>
  );
}
