"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, TrendingUp, Award, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabaseClient";
import { generateSparklineData } from "@/lib/impactProjection";
import { KCLogo } from "@/components/KCLogo";
import { TealButton, Card, PageShell } from "@/components/ui/shared";

import { ResponsiveContainer, LineChart, Line } from "recharts";

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
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

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

      setAllocations((allocs as any[]) || []);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleNewCurve = () => router.push("/onboarding/q1");

  if (loading) {
    return (
      <PageShell>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-400 dark:text-gray-500">Loading your dashboard…</p>
        </div>
      </PageShell>
    );
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <PageShell>
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
          <KCLogo size={60} className="mb-6" />
          <h1 className="text-xl font-semibold mb-3">Dashboard unavailable</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-[320px]">
            Connect Supabase environment variables to enable saved portfolios and the dashboard.
          </p>
          <TealButton onClick={handleNewCurve}>Build a Kind Curve</TealButton>
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
          <TealButton onClick={handleNewCurve}>Build your Kind Curve</TealButton>
        </div>
      </PageShell>
    );
  }

  const monthlyAmount = Number(portfolio.monthly_amount || 0);

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
        <Card className="!p-5">
          <div className="text-[28px] font-bold text-kc-teal dark:text-kc-cyan">£{monthlyAmount}</div>
          <div className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">Monthly commitment</div>
        </Card>
        <Card className="!p-5">
          <div className="text-[28px] font-bold">{allocations.length}</div>
          <div className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">Charities</div>
        </Card>
      </div>

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
      </Card>

      <Card className="mb-4">
        <h3 className="text-[15px] font-semibold mb-3.5">Recent activity</h3>
        <div className="space-y-3">
          {impactEvents.map((event) => {
            const Icon = event.icon;
            return (
              <motion.div
                key={event.text}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${event.color}22` }}>
                    <Icon size={15} style={{ color: event.color }} />
                  </span>
                  <p className="text-sm">{event.text}</p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">{event.date}</span>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </PageShell>
  );
}
