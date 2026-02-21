"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { RotateCcw } from "lucide-react";
import { useKindCurveStore } from "@/lib/store";
import { PIE_COLORS } from "@/lib/constants";
import { BackButton, TealButton, Card, PageShell } from "@/components/ui/shared";

const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false }
);
const PieChart = dynamic(
  () => import("recharts").then((m) => m.PieChart),
  { ssr: false }
);
const Pie = dynamic(
  () => import("recharts").then((m) => m.Pie),
  { ssr: false }
);
const Cell = dynamic(
  () => import("recharts").then((m) => m.Cell),
  { ssr: false }
);

export default function PiePage() {
  const router = useRouter();
  const { charities, setCharities, initialCharities, monthlyGift } = useKindCurveStore();
  const [isCustom, setIsCustom] = useState(false);

  const total = charities.reduce((s, c) => s + c.allocation, 0);

  const handleChange = (idx: number, newVal: number) => {
    setIsCustom(true);
    const clamped = Math.max(0, Math.min(100, newVal));
    const arr = charities.map((c) => ({ ...c }));
    const old = arr[idx].allocation;
    arr[idx].allocation = clamped;
    const diff = old - clamped;

    if (diff !== 0 && arr.length > 1) {
      const otherIdx = arr.map((_, i) => i).filter((i) => i !== idx);
      const otherTotal = otherIdx.reduce((s, i) => s + arr[i].allocation, 0);
      let rem = diff;

      otherIdx.forEach((i, j) => {
        if (j === otherIdx.length - 1) {
          arr[i].allocation = Math.max(0, +(arr[i].allocation + rem).toFixed(2));
        } else {
          const adj = otherTotal > 0
            ? +(diff * (arr[i].allocation / otherTotal)).toFixed(2)
            : +(diff / otherIdx.length).toFixed(2);
          arr[i].allocation = Math.max(0, +(arr[i].allocation + adj).toFixed(2));
          rem -= adj;
        }
      });

      const tt = arr.reduce((s, c) => s + c.allocation, 0);
      if (Math.abs(tt - 100) > 0.01) {
        arr[0].allocation = +(arr[0].allocation + (100 - tt)).toFixed(2);
      }
    }
    setCharities(arr);
  };

  const resetToRecommended = () => {
    if (initialCharities.length) {
      setCharities(initialCharities.map((c) => ({ ...c })));
      setIsCustom(false);
    }
  };

  const equalSplit = () => {
    const eq = +(100 / charities.length).toFixed(2);
    setCharities(
      charities.map((c, i) => ({
        ...c,
        allocation: i === 0 ? +(eq + (100 - eq * charities.length)).toFixed(2) : eq,
      }))
    );
    setIsCustom(true);
  };

  const pieData = charities.map((c, i) => ({
    name: c.name,
    value: c.allocation,
    color: PIE_COLORS[i % PIE_COLORS.length],
  }));

  if (!charities.length) {
    router.push("/onboarding/q1");
    return null;
  }

  return (
    <PageShell>
      <BackButton href="/onboarding/q2" />

      <h1 className="text-[26px] font-bold mt-3 mb-1">Your Kind Curve Pie</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-0.5">
        {isCustom ? "Custom allocations" : "Recommended allocations"}
      </p>
      <p className="text-gray-400 dark:text-gray-500 text-[13px] mb-5">
        Adjust the sliders to customize your giving mix.
      </p>

      <Card className="mb-4 !p-5 dark:!bg-[#0f172a] dark:!border-[#1e3a4a]">
        <div className="flex justify-center">
          <ResponsiveContainer width={240} height={240}>
            <PieChart>
