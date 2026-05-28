"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ranges = ["7D", "30D", "90D"] as const;

const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const previous = [3, 5, 4, 6, 7, 4, 7];

export function VisitsChart({ data }: { data: number[] }) {
  const [range, setRange] = useState<(typeof ranges)[number]>("7D");
  const max = Math.max(...data, ...previous, 1) + 2;

  const W = 600;
  const H = 220;
  const padL = 32;
  const padR = 20;
  const padT = 16;
  const padB = 32;

  function point(i: number, v: number, arr: number[]) {
    const x = padL + ((W - padL - padR) / (arr.length - 1)) * i;
    const y = padT + (H - padT - padB) * (1 - v / max);
    return { x, y };
  }

  const linePath = data
    .map((v, i) => {
      const { x, y } = point(i, v, data);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  const areaPath = `${linePath} L ${point(data.length - 1, 0, data).x} ${point(0, 0, data).y} L ${point(0, 0, data).x} ${point(0, 0, data).y} Z`;

  const prevPath = previous
    .map((v, i) => {
      const { x, y } = point(i, v, previous);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-[14.5px] font-semibold tracking-tight">
            Visits this week
          </h3>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            Daily completed visits with previous week comparison
          </p>
        </div>
        <div className="flex items-center gap-0.5 rounded-lg border border-border bg-muted/50 p-0.5">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "rounded-md px-2.5 py-1 text-[11.5px] font-medium transition-colors",
                range === r
                  ? "bg-white text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-44 w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="visits-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(214 100% 48%)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="hsl(214 100% 48%)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* gridlines */}
          {[0.25, 0.5, 0.75].map((t) => {
            const y = padT + (H - padT - padB) * t;
            return (
              <line
                key={t}
                x1={padL}
                x2={W - padR}
                y1={y}
                y2={y}
                stroke="hsl(220 13% 91%)"
                strokeDasharray="3 4"
                strokeWidth="1"
              />
            );
          })}

          {/* y-axis labels */}
          {[max, Math.round(max * 0.5), 0].map((v, i) => (
            <text
              key={i}
              x={padL - 8}
              y={padT + (H - padT - padB) * (i / 2) + 4}
              fontSize="9"
              fill="hsl(220 9% 46%)"
              textAnchor="end"
            >
              {v}
            </text>
          ))}

          {/* previous week — dashed */}
          <path
            d={prevPath}
            stroke="hsl(220 13% 80%)"
            strokeWidth="1.5"
            strokeDasharray="3 4"
            fill="none"
            strokeLinecap="round"
          />

          {/* this week area */}
          <motion.path
            d={areaPath}
            fill="url(#visits-fill)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />

          {/* this week line */}
          <motion.path
            d={linePath}
            stroke="hsl(214 100% 48%)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* dots */}
          {data.map((v, i) => {
            const { x, y } = point(i, v, data);
            const isPeak = v === Math.max(...data);
            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r={isPeak ? "5" : "3"}
                  fill="white"
                  stroke="hsl(214 100% 48%)"
                  strokeWidth="2"
                />
                {isPeak && (
                  <text
                    x={x}
                    y={y - 12}
                    fontSize="10"
                    fontWeight="600"
                    fill="hsl(214 100% 48%)"
                    textAnchor="middle"
                  >
                    {v}
                  </text>
                )}
              </g>
            );
          })}

          {/* x-axis labels */}
          {labels.map((l, i) => {
            const { x } = point(i, 0, data);
            return (
              <text
                key={l}
                x={x}
                y={H - 10}
                fontSize="10"
                fill="hsl(220 9% 46%)"
                textAnchor="middle"
              >
                {l}
              </text>
            );
          })}
        </svg>
      </div>

      <div className="flex items-center gap-4 border-t border-border pt-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span className="text-[11px] text-muted-foreground">This week</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-px w-4 border-t border-dashed border-muted-foreground/60" />
          <span className="text-[11px] text-muted-foreground">Previous week</span>
        </div>
      </div>
    </div>
  );
}
