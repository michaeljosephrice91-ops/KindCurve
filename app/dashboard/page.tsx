"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, TrendingUp, Award, LogOut } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { createClient } from "@/lib/supabaseClient";
import { generateSparklineData } from "@/lib/impactProjection";
import { KCLogo } from "@/components/KCLogo";
import { BackButton, TealButton, Card, PageShell } from "@/components/ui/shared";

const sparkData = generateSparklineData();

const impactEvents = [
  { icon: Heart, text: "Your Kind Curve is live!", date: "Just now", color: "#22d3ee" },
  { icon: Award, text: "Portfolio created successfully", date: "Just now", color: "#a855f7" },
  { icon: TrendingUp, text: "Your impact journey has begun", date: "Today", color: "#fb7185" },
];

interface PortfolioData {
  id: string;
  monthly_amount: number;
  selected_themes: string[];
  created_at: string;
}

interface AllocationData {
  id: string;
  allocation_pct: number;
  charities: {
    id: string;
    name: string;
    url: string;
    geo: string;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [allocations, setAllocations] = useState<AllocationData[]>([]);
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

    // Get active portfolio
    const { data: portfolios } = await supabase
      .from("portfolios")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1);

    if (portfolios && portfolios.length > 0) {
      setPortfolio(portfolios[0]);

      // Get allocations with charity details
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
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
        {userEmail}
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="!p-5 !bg-gradient-to-br !from-kc-teal/[0.08] !to-kc-cyan/[0.04] dark:!from-kc-teal/20 dark:!to-kc-cyan/10 !border-kc-teal/[0.15] dark:!border-kc-teal/30">
            <div className="text-[28px] font-bold text-kc-teal dark:text-kc-cyan">
              £{monthlyAmount}
            </div>
            <div className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">
              Monthly commitment
            </div>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="!p-5">
            <div className="text-[28px] font-bold">{allocations.length}</div>
            <div className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">
              Charities
            </div>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="!p-5">
            <div className="text-[28px] font-bold">
              {portfolio.selected_themes.length}
            </div>
            <div className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">
              Causes
            </div>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="!p-5 !border-kc-green/30 dark:!border-kc-green/40">
            <div className="text-[28px] font-bold text-kc-green">Active</div>
            <div className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">
              Status
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Giving Projection (placeholder until Stripe) */}
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

      {/* Charities */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="mb-4">
          <h3 className="text-[15px] font-semibold mb-3.5">Your charities</h3>
          {allocations.map((a, i) => (
            <div
              key={a.id}
              className={`flex items-center justify-between py-2.5 ${
                i > 0 ? "border-t border-[#f0ebe0] dark:border-kc-border" : ""
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gray-50 dark:bg-kc-border flex items-center justify-center">
                  <Heart size={16} className="text-kc-teal" />
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {(a.charities as any)?.name || "Unknown"}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    {a.allocation_pct}% · £
                    {((a.allocation_pct / 100) * monthlyAmount).toFixed(2)}/mo
                  </div>
                </div>
              </div>
              <span className="bg-kc-green/[0.12] dark:bg-kc-green/20 text-kc-green text-xs font-semibold px-2.5 py-0.5 rounded-xl">
                Active
              </span>
            </div>
          ))}
        </Card>
      </motion.div>

      {/* Impact Updates */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card className="mb-6">
          <h3 className="text-[15px] font-semibold mb-3.5">Activity</h3>
          {impactEvents.map((e, i) => (
            <div
              key={i}
              className={`flex gap-2.5 ${
                i < impactEvents.length - 1 ? "mb-3.5" : ""
              }`}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${e.color}18` }}
              >
                <e.icon size={16} color={e.color} />
              </div>
              <div>
                <p className="text-[13px] mb-0.5">{e.text}</p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500">
                  {e.date}
                </p>
              </div>
            </div>
          ))}
        </Card>
      </motion.div>

      <TealButton onClick={handleNewCurve}>Build a new Kind Curve</TealButton>

      <p className="text-center text-gray-400 dark:text-gray-500 text-xs mt-6">
        Stripe payments coming in Phase 2
      </p>
    </PageShell>
  );
}
