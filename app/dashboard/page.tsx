"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Heart, TrendingUp, Award, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabaseClient";
import { generateSparklineData } from "@/lib/impactProjection";
import { KCLogo } from "@/components/KCLogo";
import { TealButton, Card, PageShell } from "@/components/ui/shared";

const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false }
);
const LineChart = dynamic(
  () => import("recharts").then((m) => m.LineChart),
  { ssr: false }
);
const Line = dynamic(
  () => import("recharts").then((m) => m.Line),
  { ssr: false }
);

const sparkData = generateSparklineData();

const impactEvents = [
  { icon: Heart, text: "Your Kind Curve is live!", date: "Just now", color: "#22d3ee" },
  { icon: Award, text: "Portfolio created successfully", date: "Just now", color: "#a855f7" },
  { icon: TrendingUp, text: "Your impact journey has begun", date: "Today", color: "#fb7185" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setUserEmail(user.email || "");

    const { data: portfolios } = await supabase
      .from("portfolios")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1);

    if (portfolios && portfolios.length > 0) {
      setPortfolio(portfolios[0]);

      const { data: allocs } = await supabase
        .from("portfolio_allocations")
        .select("id, allocation_pct, charities(id, name, url, geo)")
        .eq("portfolio_id", portfolios[0].id);

      if (allocs) {
        setAllocations(allocs as any);
      }
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleNewCurve = () => {
    router.push("/onboarding/q1");
  };

  if (loading) {
    return (
      <PageShell>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-400 dark:text-gray-500">Loading your dashboard…</p>
        </div>
      </PageShell>
    );
  }

  if (!portfolio) {
    return (
      <PageShell>
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
          <KCLogo size={60} className="mb-6" />
          <h1 className="text-xl font-semibold mb-3">No portfolio yet</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            Create your first Kind Curve to see your dashboard.
          </p>
          <TealButton onClick={handleNewCurve}>
            Build your Kind Curve
          </TealButton>
        </div>
      </PageShell>
    );
  }

  const monthlyAmount = Number(portfolio.monthly_amount);

  return (
    <PageShell>
      <div className="flex items-center justify-between pt-3 pb-1">
        <KCLogo size={36} />
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 text-sm hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>

      <h1 className="text-2xl font-bold mt-4 mb-1">Your impact dashboard</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">{userEmail}</p>

      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="!p-5 !bg-gradient-to-br !from-kc-teal/[0.08] !to-kc-cyan/[0.04] dark:!from-kc-teal/20 dark:!to-kc-cyan/10 !border-kc-teal/[0.15] dark:!border-kc-teal/30">
            <div className="text-[28px] font-bold text-kc-teal dark:text-kc-cyan">£{monthlyAmount}</div>
            <div className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">Monthly commitment</div>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="!p-5">
            <div className="text-[28px] font-bold">{allocations.length}</div>
            <div className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">Charities</div>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="!p-5">
            <div className="text-[28px] font-bold">{portfolio.selected_themes.length}</div>
            <div className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">Causes</div>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="!p-5 !border-kc-green/30 dark:!border-kc-green/40">
            <div className="text-[28px] font-bold text-kc-green">Active</div>
            <div className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">Status</div>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="mb-4 !p-5">
          <div className="flex justify-between items-center mb-2.5">
            <h3 className="text-[15px] font-semibold">Projected giving</h3>
            <TrendingUp size={18} className="text-kc-green" />
          </div>
          <ResponsiveContainer width="100%" height={80}>
            <LineChart data={sparkData}>
              <Line type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            £{(monthlyAmount * 12).toFixed(0)} projected in year 1
          </p>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="mb-4">
          <h3 className="text-[15px] font-semibold mb-3.5">Your charities</h3>
          {allocations.ma
