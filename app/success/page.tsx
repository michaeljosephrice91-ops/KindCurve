"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabaseClient";
import { useKindCurveStore } from "@/lib/store";
import { THEME_LABELS } from "@/lib/constants";
import { KCLogo } from "@/components/KCLogo";
import { BackButton, TealButton, Card, PageShell } from "@/components/ui/shared";

export default function SuccessPage() {
  const router = useRouter();
  const { selectedThemes, charities, monthlyGift, scope, reset } =
    useKindCurveStore();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const savePortfolio = async () => {
    setSaving(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    // Deactivate any existing active portfolios
    await supabase
      .from("portfolios")
      .update({ is_active: false })
      .eq("user_id", user.id)
      .eq("is_active", true);

    // Create new portfolio
    const { data: portfolio, error: portError } = await supabase
      .from("portfolios")
      .insert({
        user_id: user.id,
        monthly_amount: monthlyGift,
        selected_themes: selectedThemes,
        scope: scope || "mix",
        is_active: true,
      })
      .select()
      .single();

    if (portError || !portfolio) {
      console.error("Error saving portfolio:", portError);
      setSaving(false);
      return;
    }

    // Save allocations
    const allocations = charities
      .filter((c: any) => c.charity_id)
      .map((c: any) => ({
        portfolio_id: portfolio.id,
        charity_id: c.charity_id,
        allocation_pct: c.allocation,
      }));

    if (allocations.length > 0) {
      const { error: allocError } = await supabase
        .from("portfolio_allocations")
        .insert(allocations);

      if (allocError) {
        console.error("Error saving allocations:", allocError);
      }
    }

    setSaving(false);
    setSaved(true);
  };

  const handleDashboard = async () => {
    if (!saved) {
      await savePortfolio();
    }
    router.push("/dashboard");
  };

  const startAgain = () => {
    reset();
    router.push("/");
  };

  return (
    <PageShell>
      <BackButton href="/consistency" />

      <div className="text-center mt-5">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <KCLogo size={60} className="mx-auto" />
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="mt-4 mb-3"
        >
          <CheckCircle size={48} className="text-kc-green mx-auto" strokeWidth={1.5} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-2xl font-semibold mb-2"
        >
          Your Kind Curve is ready
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-500 dark:text-gray-400 text-sm max-w-[340px] mx-auto mb-7 leading-relaxed"
        >
          You&apos;ve built a personalised giving portfolio that puts your
          values to work every month.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="mb-6">
          <div className="flex justify-between py-2 border-b border-[#f0ebe0] dark:border-kc-border">
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              Monthly gift
            </span>
            <span className="text-kc-teal dark:text-kc-cyan text-base font-bold">
              £{monthlyGift}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-[#f0ebe0] dark:border-kc-border">
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              Causes selected
            </span>
            <span className="font-semibold">{selectedThemes.length}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[#f0ebe0] dark:border-kc-border">
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              Charities supported
            </span>
            <span className="font-semibold">{charities.length}</span>
          </div>
          <div className="pt-3">
            <p className="text-gray-400 dark:text-gray-500 text-[13px] mb-2">
              Your causes:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {selectedThemes.map((t: string) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full border border-[#e8e4da] dark:border-kc-border text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-kc-border"
                >
                  {THEME_LABELS[t] || t}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      <TealButton onClick={handleDashboard} disabled={saving}>
        {saving ? "Saving your Kind Curve…" : "View your dashboard"}
      </TealButton>
      <button
        onClick={startAgain}
        className="w-full py-3.5 text-gray-500 dark:text-gray-400 text-[15px] mt-2"
      >
        Start again
      </button>
    </PageShell>
  );
}
