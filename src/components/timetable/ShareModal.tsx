"use client";

import * as React from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { toggleShareAction, regenerateShareTokenAction } from "@/actions/timetable.actions";
import { Copy, Check, Globe, Lock, Refresh } from "reicon-react";
import { useLanguage } from "@/lib/LanguageContext";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  timetableId: string;
  isPublic: boolean;
  shareToken: string;
  onUpdate?: () => void;
}

interface ShareInnerProps {
  onClose: () => void;
  timetableId: string;
  isPublic: boolean;
  shareToken: string;
  onUpdate?: () => void;
}

function ShareInner({
  onClose,
  timetableId,
  isPublic,
  shareToken,
  onUpdate,
}: ShareInnerProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentPublic, setCurrentPublic] = React.useState(isPublic);
  const [currentToken, setCurrentToken] = React.useState(shareToken);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = `${origin}/share/${currentToken}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleTogglePublic = async () => {
    setIsLoading(true);
    try {
      const nextVal = !currentPublic;
      const res = await toggleShareAction(timetableId, nextVal);
      setCurrentPublic(res.isPublic);
      onUpdate?.();
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!confirm(t.resetLink + "?")) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await regenerateShareTokenAction(timetableId);
      setCurrentToken(res.shareToken);
      onUpdate?.();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Toggle Switch */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-[#ded7c8] bg-[#faf7f2]/60">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${
              currentPublic
                ? "bg-emerald-100 text-emerald-800"
                : "bg-[#ede8dc] text-[#57534e]"
            }`}
          >
            {currentPublic ? (
              <Globe className="h-5 w-5" />
            ) : (
              <Lock className="h-5 w-5" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1c1917]">
              {currentPublic ? t.publicLinkActive : t.privateTimetable}
            </p>
            <p className="text-xs text-[#78716c]">
              {currentPublic ? t.publicLinkHelp : t.privateLinkHelp}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleTogglePublic}
          disabled={isLoading}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            currentPublic ? "bg-[#1c1917]" : "bg-[#ded7c8]"
          }`}
          role="switch"
          aria-checked={currentPublic}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
              currentPublic ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Link display & copy */}
      {currentPublic ? (
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#57534e]">
            {t.shareableLink}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full rounded-lg border border-[#ded7c8] bg-[#fcfbfa] px-3 py-2 text-xs text-[#1c1917] font-mono select-all focus:outline-none"
            />
            <Button
              type="button"
              onClick={handleCopy}
              size="sm"
              className="gap-1.5 shrink-0"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  {t.copied}
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  {t.copyLink}
                </>
              )}
            </Button>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleRegenerate}
              disabled={isLoading}
              className="inline-flex items-center gap-1 text-[11px] text-[#78716c] hover:text-[#1c1917] transition-colors cursor-pointer"
            >
              <Refresh className="h-3 w-3" />
              {t.resetLink}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-dashed border-[#ded7c8] text-center text-xs text-[#78716c]">
          {t.turnOnPublic}
        </div>
      )}

      <div className="flex justify-end pt-3 border-t border-[#f0eae1]">
        <Button variant="secondary" size="md" onClick={onClose}>
          {t.done}
        </Button>
      </div>
    </div>
  );
}

export function ShareModal({
  isOpen,
  onClose,
  timetableId,
  isPublic,
  shareToken,
  onUpdate,
}: ShareModalProps) {
  const { t } = useLanguage();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.shareTimetable}
      description={t.shareTimetableDesc}
      maxWidth="md"
    >
      {isOpen && (
        <ShareInner
          key={shareToken}
          onClose={onClose}
          timetableId={timetableId}
          isPublic={isPublic}
          shareToken={shareToken}
          onUpdate={onUpdate}
        />
      )}
    </Modal>
  );
}
