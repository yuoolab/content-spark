import { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Users,
  FileText,
  Award,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
} from 'lucide-react';
import { PlatformBadge } from '../platform/PlatformBadge';

/* ─── Data ─────────────────────────────────────────────────────────────── */

const participationData = [
  { date: '2026-04-10', participants: 45, submissions: 67 },
  { date: '2026-04-11', participants: 52, submissions: 78 },
  { date: '2026-04-12', participants: 61, submissions: 89 },
  { date: '2026-04-13', participants: 58, submissions: 85 },
  { date: '2026-04-14', participants: 73, submissions: 102 },
  { date: '2026-04-15', participants: 68, submissions: 98 },
  { date: '2026-04-16', participants: 79, submissions: 115 },
];

const platformData = [
  { name: '小红书', value: 58, count: 342, color: '#FF385C' },
  { name: '抖音',   value: 30, count: 177, color: '#333333' },
  { name: '哔哩哔哩',   value: 12, count: 71,  color: '#00A1D6' },
];

const interactionData = [
  { platform: '小红书', likes: 52800, comments: 7900, collections: 4300 },
  { platform: '抖音', likes: 21200, comments: 3500, collections: 1700 },
  { platform: '哔哩哔哩', likes: 6400, comments: 1200, collections: 1000 },
];

const reviewData = [
  { status: '已通过', count: 456, fill: 'rgba(82,196,26,1)'  },
  { status: '待审核', count: 89,  fill: 'rgba(250,173,20,1)' },
  { status: '已拒绝', count: 42,  fill: 'rgba(255,77,79,1)'  },
];

type TimePreset = 'today' | '7d' | '30d' | 'custom';

function parseYmd(ymd: string) {
  const [y, m, d] = ymd.split('-').map((n) => Number(n));
  return new Date(y, m - 1, d);
}

function toYmd(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function shiftDays(ymd: string, deltaDays: number) {
  const dt = parseYmd(ymd);
  dt.setDate(dt.getDate() + deltaDays);
  return toYmd(dt);
}

const EXPOSURE_WEIGHTS = {
  likes: 20,
  comments: 35,
  collections: 50,
} as const;

function estimateExposureFromInteractions(
  likes: number,
  comments: number,
  collections: number
) {
  return Math.round(
    likes * EXPOSURE_WEIGHTS.likes +
      comments * EXPOSURE_WEIGHTS.comments +
      collections * EXPOSURE_WEIGHTS.collections
  );
}


/* ─── Custom SVG line-area chart (avoids recharts key collision) ────────── */

type LineSeries = { key: string; name: string; color: string };

function SVGLineAreaChart({
  data,
  series,
  xKey,
  height = 260,
}: {
  data: Record<string, any>[];
  series: LineSeries[];
  xKey: string;
  height?: number;
}) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const VW = 500;
  const VH = height;
  const pad = { top: 16, right: 16, bottom: 28, left: 44 };
  const iW = VW - pad.left - pad.right;
  const iH = VH - pad.top - pad.bottom;

  const allVals = series.flatMap((s) => data.map((d) => Number(d[s.key]) || 0));
  const rawMin = Math.min(...allVals);
  const rawMax = Math.max(...allVals);
  const range = Math.max(rawMax - rawMin, 1);
  const maxY = rawMax + range * 0.1;
  const minY = Math.max(0, rawMin - range * 0.2);

  const gx = (i: number) => pad.left + (i / Math.max(data.length - 1, 1)) * iW;
  const gy = (v: number) => pad.top + iH - ((v - minY) / (maxY - minY || 1)) * iH;

  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div style={{ position: 'relative' }}>
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        preserveAspectRatio="none"
        style={{ width: '100%', height: `${height}px`, display: 'block', overflow: 'visible' }}
        onMouseLeave={() => setHoverIdx(null)}
      >
        {/* Horizontal grid lines */}
        {yTicks.map((t) => {
          const yv = minY + (maxY - minY) * t;
          return (
            <line
              key={`gy-${t}`}
              x1={pad.left} y1={gy(yv)}
              x2={VW - pad.right} y2={gy(yv)}
              stroke="rgba(217,217,217,0.6)"
              strokeDasharray="3 3"
            />
          );
        })}

        {/* Y-axis labels */}
        {yTicks.filter((t) => t % 0.5 === 0).map((t) => {
          const v = minY + (maxY - minY) * t;
          return (
            <text
              key={`yl-${t}`}
              x={pad.left - 6}
              y={gy(v) + 4}
              textAnchor="end"
              fontSize={10}
              fill="rgba(0,0,0,0.4)"
              fontFamily="'PingFang SC', sans-serif"
            >
              {v >= 1000 ? `${(v / 1000).toFixed(0)}k` : Math.round(v)}
            </text>
          );
        })}

        {/* X-axis labels */}
        {data.map((d, i) => (
          <text
            key={`xl-${i}`}
            x={gx(i)}
            y={VH - 6}
            textAnchor="middle"
            fontSize={10}
            fill="rgba(0,0,0,0.4)"
            fontFamily="'PingFang SC', sans-serif"
          >
            {d[xKey]}
          </text>
        ))}

        {/* Series paths */}
        {series.map((s) => {
          const pts = data.map((d, i) => ({ x: gx(i), y: gy(Number(d[s.key]) || 0) }));
          const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
          const area = `${line} L${pts[pts.length - 1].x.toFixed(1)},${gy(minY).toFixed(1)} L${pts[0].x.toFixed(1)},${gy(minY).toFixed(1)} Z`;
          return (
            <g key={`series-${s.key}`}>
              <path d={area} fill={s.color} fillOpacity={0.08} />
              <path d={line} stroke={s.color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          );
        })}

        {/* Hover vertical line + dots */}
        {hoverIdx !== null && (
          <g>
            <line
              x1={gx(hoverIdx)} y1={pad.top}
              x2={gx(hoverIdx)} y2={pad.top + iH}
              stroke="rgba(0,0,0,0.12)"
              strokeDasharray="3 3"
              strokeWidth={1}
            />
            {series.map((s) => (
              <circle
                key={`dot-${s.key}`}
                cx={gx(hoverIdx)}
                cy={gy(Number(data[hoverIdx][s.key]) || 0)}
                r={4}
                fill={s.color}
                stroke="white"
                strokeWidth={2}
              />
            ))}
          </g>
        )}

        {/* Invisible hit strips for hover */}
        {data.map((_, i) => (
          <rect
            key={`hit-${i}`}
            x={gx(i) - iW / data.length / 2}
            y={pad.top}
            width={iW / data.length}
            height={iH}
            fill="transparent"
            onMouseEnter={() => setHoverIdx(i)}
          />
        ))}
      </svg>

      {/* Tooltip */}
      {hoverIdx !== null && (
        <div
          style={{
            position: 'absolute',
            left: `calc(${((gx(hoverIdx)) / VW) * 100}% )`,
            top: '10px',
            transform: 'translateX(-50%)',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '8px 12px',
            fontSize: '12px',
            color: 'var(--foreground)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            pointerEvents: 'none',
            zIndex: 10,
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{ color: 'var(--muted-foreground)', marginBottom: '5px' }}>
            {data[hoverIdx][xKey]}
          </div>
          {series.map((s) => (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: s.color, display: 'inline-block', flexShrink: 0 }} />
              <span style={{ color: 'var(--card-foreground)' }}>{s.name}：</span>
              <span style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>
                {Number(data[hoverIdx][s.key]).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      {series.length > 1 && (
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '10px' }}>
          {series.map((s) => (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color, display: 'inline-block' }} />
              <span style={{ fontSize: '12px', color: 'var(--card-foreground)' }}>{s.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Custom SVG Donut chart ─────────────────────────────────────────────── */

function SVGDonutChart({ data }: { data: typeof platformData }) {
  const cx = 80; const cy = 80;
  const R = 62; const r = 40;
  const gap = 0.025; // radians gap between slices
  const total = data.reduce((s, d) => s + d.value, 0);

  let angle = -Math.PI / 2;
  const slices = data.map((d) => {
    const start = angle;
    const sweep = (d.value / total) * 2 * Math.PI;
    angle += sweep;
    return { ...d, start, sweep };
  });

  const arc = (start: number, sweep: number, ro: number, ri: number) => {
    const s = start + gap / 2;
    const sw = sweep - gap;
    if (sw <= 0) return '';
    const x1 = cx + ro * Math.cos(s);
    const y1 = cy + ro * Math.sin(s);
    const x2 = cx + ro * Math.cos(s + sw);
    const y2 = cy + ro * Math.sin(s + sw);
    const ix1 = cx + ri * Math.cos(s + sw);
    const iy1 = cy + ri * Math.sin(s + sw);
    const ix2 = cx + ri * Math.cos(s);
    const iy2 = cy + ri * Math.sin(s);
    const lg = sw > Math.PI ? 1 : 0;
    return `M${x1},${y1} A${ro},${ro} 0 ${lg},1 ${x2},${y2} L${ix1},${iy1} A${ri},${ri} 0 ${lg},0 ${ix2},${iy2} Z`;
  };

  return (
    <svg viewBox="0 0 160 160" style={{ width: '100%', height: '160px', display: 'block' }}>
      {slices.map((s) => (
        <path key={s.name} d={arc(s.start, s.sweep, R, r)} fill={s.color} />
      ))}
    </svg>
  );
}

/* ─── Shared UI shells ────────────────────────────────────────────────────── */

function KpiCard({
  label, value, suffix, icon: Icon, accent, trend, trendLabel,
}: {
  label: string; value: string | number; suffix?: string;
  icon: React.ElementType; accent: string;
  trend?: 'up' | 'down'; trendLabel?: string;
}) {
  return (
    <div
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        boxShadow: 'var(--elevation-sm)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute', top: 0, right: 0,
          width: '80px', height: '80px',
          borderRadius: '0 0 0 80px',
          background: `${accent}0D`,
          pointerEvents: 'none',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
        <span style={{ fontSize: 'var(--text-base)', color: 'var(--card-foreground)' }}>{label}</span>
        <div style={{ width: '34px', height: '34px', borderRadius: 'var(--radius)', background: `${accent}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={16} style={{ color: accent }} />
        </div>
      </div>
      <div style={{ fontSize: 'var(--text-h1)', fontWeight: 'var(--font-weight-semibold)', color: accent, lineHeight: '1.1', marginBottom: '6px' }}>
        {value}
        {suffix && <span style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-normal)', marginLeft: '4px', opacity: 0.8 }}>{suffix}</span>}
      </div>
      {trend && trendLabel && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', color: trend === 'up' ? 'rgba(82,196,26,1)' : 'rgba(255,77,79,1)' }}>
          {trend === 'up' ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {trendLabel}
        </div>
      )}
    </div>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', boxShadow: 'var(--elevation-sm)' }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', lineHeight: '1.4' }}>{title}</div>
        {subtitle && <div style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginTop: '2px' }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export function DataDashboard() {
  const lastDataDate = participationData[participationData.length - 1].date;
  const [timePreset, setTimePreset] = useState<TimePreset>('7d');
  const [customStartDate, setCustomStartDate] = useState(shiftDays(lastDataDate, -6));
  const [customEndDate, setCustomEndDate] = useState(lastDataDate);

  const computedRange = useMemo(() => {
    if (timePreset === 'today') {
      return { start: lastDataDate, end: lastDataDate };
    }
    if (timePreset === '30d') {
      return { start: shiftDays(lastDataDate, -29), end: lastDataDate };
    }
    if (timePreset === 'custom') {
      return { start: customStartDate || lastDataDate, end: customEndDate || lastDataDate };
    }
    return { start: shiftDays(lastDataDate, -6), end: lastDataDate };
  }, [timePreset, customStartDate, customEndDate, lastDataDate]);

  const filteredParticipationData = useMemo(
    () =>
      participationData
        .filter((item) => item.date >= computedRange.start && item.date <= computedRange.end)
        .map((item) => ({ ...item, dateLabel: item.date.slice(5).replace('-', '/') })),
    [computedRange]
  );

  const chartData = filteredParticipationData.length > 0
    ? filteredParticipationData
    : [{ ...participationData[participationData.length - 1], dateLabel: participationData[participationData.length - 1].date.slice(5).replace('-', '/') }];

  const totalParticipants = 379;
  const totalSubmissions  = 590;
  const totalRewards      = 31700;
  const avgPassRate       = 78;
  const totalLikes = interactionData.reduce((sum, item) => sum + item.likes, 0);
  const totalComments = interactionData.reduce((sum, item) => sum + item.comments, 0);
  const totalCollections = interactionData.reduce((sum, item) => sum + item.collections, 0);
  const totalInteractions = totalLikes + totalComments + totalCollections;
  const estimatedExposure = estimateExposureFromInteractions(totalLikes, totalComments, totalCollections);

  const TOOLTIP_STYLE = {
    backgroundColor: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    fontSize: '12px',
    color: 'var(--foreground)',
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <div
          style={{
            display: 'inline-flex',
            border: '1px solid var(--border)',
            borderRadius: '2px',
            overflow: 'hidden',
            background: 'var(--card)',
          }}
        >
          {[
            { key: 'today' as const, label: '当天' },
            { key: '7d' as const, label: '近7天' },
            { key: '30d' as const, label: '近30天' },
            { key: 'custom' as const, label: '自定义' },
          ].map((item) => {
            const active = timePreset === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setTimePreset(item.key)}
                style={{
                  border: 'none',
                  borderRight: item.key === 'custom' ? 'none' : '1px solid var(--border)',
                  background: active ? 'rgba(36,116,255,0.08)' : 'transparent',
                  color: active ? 'rgba(36,116,255,1)' : 'var(--muted-foreground)',
                  fontSize: '12px',
                  height: '30px',
                  padding: '0 16px',
                  cursor: 'pointer',
                  fontWeight: active ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            height: '30px',
            padding: '0 10px',
            border: '1px solid var(--border)',
            borderRadius: '2px',
            background: 'var(--card)',
          }}
        >
          <input
            type="date"
            value={computedRange.start}
            onChange={(e) => {
              setTimePreset('custom');
              setCustomStartDate(e.target.value);
            }}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '12px',
              color: 'var(--foreground)',
            }}
          />
          <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>→</span>
          <input
            type="date"
            value={computedRange.end}
            onChange={(e) => {
              setTimePreset('custom');
              setCustomEndDate(e.target.value);
            }}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '12px',
              color: 'var(--foreground)',
            }}
          />
          <CalendarDays size={14} style={{ color: 'var(--muted-foreground)' }} />
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '16px', marginBottom: '24px' }}>
        <KpiCard label="总参与人数"   value={totalParticipants.toLocaleString()} icon={Users}     accent="rgba(36,116,255,1)"  trend="up"   trendLabel="较上周 +18%" />
        <KpiCard label="内容提交量"   value={totalSubmissions.toLocaleString()}  icon={FileText}  accent="rgba(82,196,26,1)"   trend="up"   trendLabel="较上周 +24%" />
        <KpiCard label="审核通过率"   value={`${avgPassRate}%`}                  icon={TrendingUp} accent="rgba(250,173,20,1)"  trend="down" trendLabel="较上周 -2%"  />
        <KpiCard label="奖励发放总量" value={totalRewards.toLocaleString()} icon={Award} accent="rgba(255,77,79,1)" trend="up" trendLabel="较上周 +31%" />
        <KpiCard label="预估曝光量"   value={(estimatedExposure/10000).toFixed(1)} suffix="万" icon={Eye} accent="rgba(60,153,216,1)" trend="up" trendLabel="较上周 +15%" />
      </div>

      {/* Charts Row 1 — Participation full width */}
      <div style={{ marginBottom: '16px' }}>
        <ChartCard title="参与趋势" subtitle="近 7 日参与人数与内容提交量变化">
          <SVGLineAreaChart
            data={chartData}
            xKey="dateLabel"
            height={340}
            series={[
              { key: 'participants', name: '参与人数', color: 'rgba(36,116,255,1)' },
              { key: 'submissions',  name: '内容提交量',   color: 'rgba(82,196,26,1)'  },
            ]}
          />
        </ChartCard>
      </div>

      {/* Charts Row 2 — Platform + Review side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

        {/* Platform Distribution */}
        <ChartCard title="平台分布" subtitle="各平台内容提交量占比">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Donut */}
            <div style={{ flexShrink: 0, width: '160px' }}>
              <SVGDonutChart data={platformData} />
            </div>
            {/* Legend list */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {platformData.map((item) => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <PlatformBadge platform={item.name} size={12} />
                      <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>{item.value}%</span>
                    </div>
                    <div style={{ height: '4px', background: 'var(--muted)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${item.value}%`, background: item.color, borderRadius: '2px' }} />
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--muted-foreground)', minWidth: '32px', textAlign: 'right' }}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Review Status */}
        <ChartCard title="审核状态分布" subtitle="各审核状态的内容数量">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={reviewData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }} barSize={48}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(217,217,217,0.5)" vertical={false} />
              <XAxis dataKey="status" tick={{ fill: 'rgba(0,0,0,0.45)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(0,0,0,0.45)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="count" name="数量" radius={[3, 3, 0, 0]}>
                {reviewData.map((entry) => (
                  <Cell key={`review-${entry.status}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ROI Summary */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--elevation-sm)', overflow: 'hidden', marginBottom: '16px' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>ROI 分析</div>
            <div style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginTop: '1px' }}>基于积分市值 ¥0.1/分 进行估算</div>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', background: 'rgba(82,196,26,0.1)', borderRadius: '100px', fontSize: '12px', color: 'rgba(82,196,26,1)', fontWeight: 'var(--font-weight-medium)' }}>
            <TrendingUp size={12} />ROI 良好
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', padding: '24px' }}>
          {[
            { label: '每千次曝光成本（CPM）', value: `¥${(((totalRewards*0.1)/estimatedExposure)*1000).toFixed(2)}`, sub: '低于行业均值 ¥3.5', good: true },
            { label: '人均内容产出',          value: `${(totalSubmissions/totalParticipants).toFixed(2)} 篇`,          sub: '每位参与用户平均贡献',  good: false },
            { label: '人均激励成本',          value: `${Math.round(totalRewards/totalParticipants)} 积分`,             sub: `约 ¥${((totalRewards*0.1)/totalParticipants).toFixed(2)} / 人`, good: false },
            { label: '内容互动预估',          value: `${(totalInteractions/10000).toFixed(1)} 万`,                     sub: '点赞+评论+收藏合计',    good: false },
          ].map((m, i) => (
            <div key={m.label} style={{ padding: '0 24px', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: '8px' }}>{m.label}</div>
              <div style={{ fontSize: 'var(--text-h2)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', lineHeight: '1.2', marginBottom: '4px' }}>{m.value}</div>
              <div style={{ fontSize: '12px', color: m.good ? 'rgba(82,196,26,1)' : 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                {m.good && <ArrowDownRight size={12} />}{m.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
