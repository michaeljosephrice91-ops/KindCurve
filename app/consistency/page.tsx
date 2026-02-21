"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useKindCurveStore } from "@/lib/store";
import { generateProjectionData } from "@/lib/impactProjection";
import { BackButton, TealButton, SecondaryButton, Card, PageShell } from "@/components/ui/shared";

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
const XAxis = dynamic(
  () => import("recharts").then((m) => m.XAxis),
  { ssr: false }
);
const YAxis = dynamic(
  () => import("recharts").then((m) => m.YAxis),
  { ssr: false }
);
const CartesianGrid = dynamic(
  () => import("recharts").then((m) => m.CartesianGrid),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("recharts").then((m) => m.Tooltip),
  { ssr: false }
);

export default function ConsistencyPage() {
  const router = useRouter();
  const { monthlyGift } = useKindCurveStore();
  const data = useMemo(generateProjectionData, []);
  return (
    <PageShell>
      <BackButton href="/pie" />

      <h1 className="text-[26px] font-bold mt-3 mb-2">The power of consistency</h1>
      <p className="text-[15px] leading-relaxed mb-6">
        Your monthly kindness compounds into 2–4× more long-term impact than sporadic giving.
      </p>

      <Card className="mb-3 !p-5">
        <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-2">Impact over 10 years</p>
        <div className="flex gap-4 mb-3">
          <span className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-kc-teal to-kc-green inline-block" />
            Kind Curve (consistent)
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600 inline-block" />
            Irregular giving
          </span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis dataKey="year" className="text-[11px]" stroke="#9ca3af" tick={{ fontSize: 11, fill: "#9ca3af" }}
              label={{ value: "Years", position: "insideBottom", offset: -4, fill: "#9ca3af", fontSize: 11 }} />
            <YAxis className="text-[11px]" stroke="#9ca3af" tick={{ fontSize: 11, fill: "#9ca3af" }}
              label={{ value: "Impact", angle: -90, position: "insideLeft", fill: "#9ca3af", fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
            <defs>
              <linearGradient id="kcGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#267D91" />
                <stop offset="100%" stopColor="#4BB78F" />
              </linearGradient>
            </defs>
            <Line type="monotone" dataKey="kindCurve" stroke="url(#kcGrad)" strokeWidth={3} dot={false} name="Kind Curve" />
            <Line type="monotone" dataKey="irregular" stroke="#d1d5db" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Irregular" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <p className="text-center text-gray-400 dark:text-gray-500 text-[13px] mb-5">
        Based on your £{monthlyGift}/month Kind Curve
      </p>

      <Card className="mb-3 !p-5">
        <h4 className="text-kc-teal dark:text-kc-cyan text-[15px] font-semibold mb-1.5">Consistency creates stability</h4>
        <p className="text-gray-500 dark:text-gray-400 text-[13px] leading-relaxed">
          Regular monthly giving allows charities to plan ahead, invest in long-term programs, and create sustainable impact.
        </p>
      </Card>
      <Card className="mb-2 !p-5">
        <h4 className="text-kc-teal dark:text-kc-cyan text-[15px] font-semibold mb-1.5">Your impact compounds
