"use client";

import React, { useState, useRef, useEffect } from "react";

// ==========================================
// AREA & LINE CHART
// ==========================================
interface AreaChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
  fillColor?: string;
  unit?: string;
}

export function AreaChart({
  data,
  height = 200,
  color = "#3B82F6", // Brand Sky
  fillColor = "rgba(59, 130, 246, 0.1)",
  unit = ""
}: AreaChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map((d) => d.value)) || 10;
  const paddingX = 40;
  const paddingY = 20;
  
  // Grid layout sizes
  const svgWidth = 500;
  const svgHeight = height;

  const getCoordinates = () => {
    const coords: { x: number; y: number }[] = [];
    const widthAvailable = svgWidth - paddingX * 2;
    const heightAvailable = svgHeight - paddingY * 2;
    const steps = data.length > 1 ? data.length - 1 : 1;

    data.forEach((d, i) => {
      const x = paddingX + (i / steps) * widthAvailable;
      const y = paddingY + heightAvailable - (d.value / maxVal) * heightAvailable;
      coords.push({ x, y });
    });
    return coords;
  };

  const coords = getCoordinates();

  // Create path strings
  let linePath = "";
  let areaPath = "";

  if (coords.length > 0) {
    linePath = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      linePath += ` L ${coords[i].x} ${coords[i].y}`;
    }
    // Area path closes at bottom corners
    areaPath = `${linePath} L ${coords[coords.length - 1].x} ${svgHeight - paddingY} L ${coords[0].x} ${svgHeight - paddingY} Z`;
  }

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!containerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Map clientX to svg coordinates
    const scaleX = svgWidth / rect.width;
    const svgX = clientX * scaleX;

    // Find closest data point
    let closestIdx = 0;
    let minDistance = Infinity;

    coords.forEach((coord, i) => {
      const dist = Math.abs(coord.x - svgX);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = i;
      }
    });

    setHoverIndex(closestIdx);
    
    // Position tooltip in CSS pixels (relative to relative container)
    const scaleY = rect.height / svgHeight;
    setTooltipPos({
      x: coords[closestIdx].x / scaleX,
      y: coords[closestIdx].y * scaleY - 35
    });
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden select-none">
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="overflow-visible cursor-crosshair"
      >
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0.0} />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {Array.from({ length: 4 }).map((_, idx) => {
          const yVal = paddingY + (idx / 3) * (svgHeight - paddingY * 2);
          const gridVal = Math.round(maxVal - (idx / 3) * maxVal);
          return (
            <g key={idx} className="opacity-40">
              <line
                x1={paddingX}
                y1={yVal}
                x2={svgWidth - paddingX}
                y2={yVal}
                stroke="currentColor"
                strokeWidth={0.5}
                className="text-zinc-200 dark:text-zinc-800"
                strokeDasharray="4 4"
              />
              <text
                x={paddingX - 10}
                y={yVal + 3}
                textAnchor="end"
                className="text-[9px] font-bold font-mono fill-muted-foreground"
              >
                {gridVal}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        {areaPath && <path d={areaPath} fill="url(#areaGradient)" />}

        {/* Line drawing */}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Data points */}
        {coords.map((coord, i) => (
          <circle
            key={i}
            cx={coord.x}
            cy={coord.y}
            r={hoverIndex === i ? 4.5 : 2}
            fill={hoverIndex === i ? color : "currentColor"}
            stroke={hoverIndex === i ? "#fff" : "transparent"}
            strokeWidth={1.5}
            className={hoverIndex === i ? "shadow-sm" : "text-muted-foreground/45"}
            style={{ transition: "r 0.15s ease" }}
          />
        ))}

        {/* Hover marker line */}
        {hoverIndex !== null && (
          <line
            x1={coords[hoverIndex].x}
            y1={paddingY}
            x2={coords[hoverIndex].x}
            y2={svgHeight - paddingY}
            stroke={color}
            strokeWidth={0.75}
            strokeDasharray="2 2"
            opacity={0.6}
          />
        )}
      </svg>

      {/* Axis Labels */}
      <div className="flex justify-between px-10 text-[9px] font-bold font-mono text-muted-foreground pt-1.5 border-t border-border/40 select-none">
        {data.map((d, i) => (
          <span key={i}>{d.label}</span>
        ))}
      </div>

      {/* Floating Tooltip */}
      {hoverIndex !== null && (
        <div
          className="absolute z-10 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-2 py-1 rounded-md text-[10px] font-bold font-mono pointer-events-none shadow-md border border-border/30 -translate-x-1/2 flex flex-col gap-0.5"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          <span className="opacity-80 leading-none">{data[hoverIndex].label}</span>
          <span className="leading-none text-brand-sky font-extrabold">
            {unit}
            {data[hoverIndex].value.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}

// ==========================================
// DONUT / PIE CHART
// ==========================================
interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
}

export function DonutChart({ data, size = 120 }: DonutChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const total = data.reduce((acc, item) => acc + item.value, 0) || 1;
  const radius = 35;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius; // ~219.91

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 select-none">
      {/* SVG Donut circle */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 100 100" className="-rotate-90">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-zinc-100 dark:text-zinc-800"
          />
          {data.map((item, i) => {
            const percent = item.value / total;
            const strokeLength = percent * circumference;
            const strokeOffset = circumference - strokeLength + accumulatedPercent * circumference;
            accumulatedPercent -= percent;

            const isHovered = hoverIndex === i;

            return (
              <circle
                key={i}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={isHovered ? strokeWidth + 2 : strokeWidth}
                strokeDasharray={`${strokeLength} ${circumference}`}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase leading-none">Total</span>
          <span className="text-sm font-extrabold text-foreground leading-snug">
            {hoverIndex !== null ? data[hoverIndex].value : total}
          </span>
        </div>
      </div>

      {/* Legends column */}
      <div className="flex flex-col gap-1.5 flex-grow">
        {data.map((item, i) => {
          const percent = ((item.value / total) * 100).toFixed(0);
          return (
            <div
              key={i}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
              className={`flex items-center justify-between px-2 py-1 rounded-md transition-colors cursor-pointer ${
                hoverIndex === i ? "bg-zinc-100 dark:bg-zinc-800/60" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-semibold text-muted-foreground">{item.label}</span>
              </div>
              <span className="text-xs font-extrabold text-foreground font-mono">{percent}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// BAR CHART
// ==========================================
interface BarChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}

export function BarChart({ data, height = 150, color = "#3B82F6" }: BarChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const maxVal = Math.max(...data.map((d) => d.value)) || 10;
  const svgWidth = 400;
  const svgHeight = height;
  const paddingX = 30;
  const paddingY = 15;

  const widthAvailable = svgWidth - paddingX * 2;
  const heightAvailable = svgHeight - paddingY * 2;
  const barGap = 16;
  const totalBarSpace = widthAvailable - barGap * (data.length - 1);
  const barWidth = totalBarSpace / data.length;

  return (
    <div className="relative w-full overflow-hidden select-none">
      <svg width="100%" height={height} viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
        {data.map((d, i) => {
          const barHeight = (d.value / maxVal) * heightAvailable;
          const x = paddingX + i * (barWidth + barGap);
          const y = svgHeight - paddingY - barHeight;

          return (
            <g
              key={i}
              className="cursor-pointer"
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={hoverIndex === i ? color : `${color}dd`}
                rx={2.5}
                ry={2.5}
                className="transition-all duration-150"
              />
              {/* Dynamic count above bar on hover */}
              {hoverIndex === i && (
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  className="text-[9px] font-bold font-mono fill-foreground"
                >
                  {d.value}
                </text>
              )}
            </g>
          );
        })}
        {/* Horizontal base line */}
        <line
          x1={paddingX - 10}
          y1={svgHeight - paddingY}
          x2={svgWidth - paddingX + 10}
          y2={svgHeight - paddingY}
          stroke="currentColor"
          strokeWidth={0.5}
          className="text-zinc-200 dark:text-zinc-800"
        />
      </svg>
      {/* X Labels */}
      <div className="flex justify-between px-6 text-[9px] font-bold font-mono text-muted-foreground pt-1.5">
        {data.map((d, i) => (
          <span key={i} className="text-center truncate" style={{ width: `${100 / data.length}%` }}>
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// ACTIVITY MATRIX GRAPH
// ==========================================
interface ActivityGraphProps {
  cols?: number;
}

export function ActivityGraph({ cols = 28 }: ActivityGraphProps) {
  // Mock data representing activity over the past 4 weeks (28 cells)
  // Value represents activity levels (0: none, 1: low, 2: mid, 3: high)
  const [activity, setActivity] = useState<number[]>([]);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  useEffect(() => {
    // Generate static deterministic pattern
    const pattern = [
      0, 2, 3, 1, 0, 1, 0,
      3, 1, 2, 0, 2, 1, 3,
      0, 1, 0, 2, 3, 1, 0,
      2, 3, 1, 0, 2, 1, 3
    ];
    setActivity(pattern);
  }, []);

  const getColorClass = (val: number) => {
    switch (val) {
      case 1:
        return "bg-emerald-500/20 border border-emerald-500/10";
      case 2:
        return "bg-emerald-500/50 border border-emerald-500/20";
      case 3:
        return "bg-emerald-500 border border-emerald-600/30";
      default:
        return "bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/20 dark:border-zinc-800/40";
    }
  };

  const getTooltipText = (val: number, idx: number) => {
    const daysAgo = 27 - idx;
    const msg = val === 0 ? "No actions" : val === 1 ? "3 runs" : val === 2 ? "12 runs" : "34 runs";
    return `${msg} (${daysAgo === 0 ? "Today" : `${daysAgo} days ago`})`;
  };

  return (
    <div className="relative flex flex-col gap-2 select-none w-full">
      <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase">
        <span>Recent Automation Activity Logs</span>
        <span className="text-[9px] font-semibold text-emerald-500 lowercase flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          Active Webhook Stream
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1.5 md:gap-2.5 max-w-[280px] p-2 rounded-xl bg-zinc-950/5 border border-border/40 justify-center mx-auto">
        {activity.map((val, idx) => (
          <div
            key={idx}
            onMouseEnter={() => setHoverIdx(idx)}
            onMouseLeave={() => setHoverIdx(null)}
            className={`h-4.5 w-4.5 rounded cursor-pointer transition-all duration-150 ${getColorClass(val)}`}
          />
        ))}
      </div>

      {/* Floating details label */}
      <div className="h-4.5 text-[9px] font-bold font-mono text-center text-muted-foreground">
        {hoverIdx !== null ? getTooltipText(activity[hoverIdx], hoverIdx) : "Hover squares to view status history"}
      </div>
    </div>
  );
}
