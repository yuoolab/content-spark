import type { CSSProperties } from "react";

export type PlatformName = "小红书" | "抖音" | "哔哩哔哩" | "哔哩哔哩" | "微博";

const PLATFORM_META: Record<"小红书" | "抖音" | "哔哩哔哩" | "微博", {
  label: string;
  color: string;
  bg: string;
  border: string;
}> = {
  小红书: {
    label: "小红书",
    color: "#FF2442",
    bg: "rgba(255,36,66,0.10)",
    border: "rgba(255,36,66,0.18)",
  },
  抖音: {
    label: "抖音",
    color: "#111111",
    bg: "rgba(17,17,17,0.08)",
    border: "rgba(17,17,17,0.12)",
  },
  哔哩哔哩: {
    label: "哔哩哔哩",
    color: "#FF5A8F",
    bg: "rgba(255,90,143,0.10)",
    border: "rgba(255,90,143,0.18)",
  },
  微博: {
    label: "微博",
    color: "#E6162D",
    bg: "rgba(230,22,45,0.10)",
    border: "rgba(230,22,45,0.18)",
  },
};

export function normalizePlatformName(platform: string): "小红书" | "抖音" | "哔哩哔哩" | "微博" {
  if (platform === "哔哩哔哩") return "哔哩哔哩";
  if (platform === "哔哩哔哩") return "哔哩哔哩";
  if (platform === "抖音") return "抖音";
  if (platform === "微博") return "微博";
  return "小红书";
}

export function PlatformLogo({
  platform,
  size = 16,
}: {
  platform: string;
  size?: number;
}) {
  const key = normalizePlatformName(platform);

  if (key === "小红书") {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="24" fill="#FF2442" />
        <text
          x="24"
          y="28"
          textAnchor="middle"
          fill="white"
          fontSize="11.5"
          fontWeight="700"
          fontFamily="'PingFang SC','Noto Sans SC','Microsoft YaHei',sans-serif"
          letterSpacing="-0.8"
        >
          小红书
        </text>
      </svg>
    );
  }

  if (key === "抖音") {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="24" fill="#000000" />
        <path
          d="M18.5 12.3V27.1C18.5 29.8 16.5 31.8 13.8 31.8C11.1 31.8 9.2 29.8 9.2 27.4C9.2 25 11 23 13.5 22.8C14.5 22.7 15.4 22.9 16.2 23.3V18.1C17.4 18.4 18.8 18.7 20.2 18.7V15.1C21.4 16.8 23.1 18 25.2 18.3V21.7C23.7 21.6 22.4 21.1 21.2 20.2V27"
          stroke="#00F2EA"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.95"
          transform="translate(4 4)"
        />
        <path
          d="M18.5 12.3V27.1C18.5 29.8 16.5 31.8 13.8 31.8C11.1 31.8 9.2 29.8 9.2 27.4C9.2 25 11 23 13.5 22.8C14.5 22.7 15.4 22.9 16.2 23.3V18.1C17.4 18.4 18.8 18.7 20.2 18.7V15.1C21.4 16.8 23.1 18 25.2 18.3V21.7C23.7 21.6 22.4 21.1 21.2 20.2V27"
          stroke="#FE2C55"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
          transform="translate(0 0)"
        />
        <path
          d="M18.5 12.3V27.1C18.5 29.8 16.5 31.8 13.8 31.8C11.1 31.8 9.2 29.8 9.2 27.4C9.2 25 11 23 13.5 22.8C14.5 22.7 15.4 22.9 16.2 23.3V18.1C17.4 18.4 18.8 18.7 20.2 18.7V15.1C21.4 16.8 23.1 18 25.2 18.3V21.7C23.7 21.6 22.4 21.1 21.2 20.2V27"
          stroke="white"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (key === "微博") {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="24" fill="#E6162D" />
        <text
          x="24"
          y="29"
          textAnchor="middle"
          fill="white"
          fontSize="11.2"
          fontWeight="800"
          fontFamily="'PingFang SC','Noto Sans SC','Microsoft YaHei',sans-serif"
          letterSpacing="-0.4"
        >
          微博
        </text>
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="24" fill="#FF5A8F" />
      <text
        x="24"
        y="29"
        textAnchor="middle"
        fill="white"
        fontSize="11"
        fontWeight="800"
        fontFamily="'PingFang SC','Noto Sans SC','Microsoft YaHei',sans-serif"
        letterSpacing="-0.4"
      >
        bilibili
      </text>
    </svg>
  );
}

export function PlatformBadge({
  platform,
  style,
  size = 14,
  strong = true,
}: {
  platform: string;
  style?: CSSProperties;
  size?: number;
  strong?: boolean;
}) {
  const meta = PLATFORM_META[normalizePlatformName(platform)];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px 4px 4px",
        borderRadius: 999,
        background: meta.bg,
        border: `1px solid ${meta.border}`,
        color: meta.color,
        fontSize: 12,
        fontWeight: strong ? 800 : 600,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      <span
        style={{
          width: size + 4,
          height: size + 4,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <PlatformLogo platform={platform} size={size} />
      </span>
      <span>{meta.label}</span>
    </span>
  );
}

export function PlatformName({
  platform,
  style,
  size = 14,
}: {
  platform: string;
  style?: CSSProperties;
  size?: number;
}) {
  return <PlatformBadge platform={platform} style={style} size={size} />;
}

export function PlatformBadges({
  platforms,
  size = 14,
  style,
}: {
  platforms: string[];
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, ...style }}>
      {platforms.map((platform) => (
        <PlatformBadge key={platform} platform={platform} size={size} />
      ))}
    </div>
  );
}
