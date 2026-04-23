import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { ArrowLeft, LayoutDashboard, LayoutList, User } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

export const NAV_ITEMS = [
  { path: "/tasks", label: "任务", icon: LayoutList },
  { path: "/account", label: "我的", icon: User },
] as const;

export function fmtNumber(value: number) {
  return value >= 10000 ? `${(value / 10000).toFixed(1)}w` : value.toString();
}

export function shortDate(value: string) {
  return value.slice(5);
}

export function Container({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        maxWidth: 480,
        minHeight: "100%",
        margin: "0 auto",
        padding: "16px 14px 96px",
      }}
    >
      {children}
    </div>
  );
}

type CardProps = ComponentPropsWithoutRef<"div"> & {
  children: ReactNode;
  style?: React.CSSProperties;
};

export function Card({ children, style, ...props }: CardProps) {
  return (
    <div
      {...props}
      style={{
        background: "rgba(255,255,255,0.9)",
        border: "1px solid rgba(255,255,255,0.85)",
        borderRadius: 24,
        boxShadow: "0 12px 40px rgba(36, 116, 255, 0.08)",
        overflow: "hidden",
        backdropFilter: "blur(14px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  title,
  extra,
}: {
  title: ReactNode;
  extra?: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>{title}</div>
      {extra}
    </div>
  );
}

export function Pill({
  children,
  tone = "blue",
}: {
  children: ReactNode;
  tone?: "blue" | "green" | "orange" | "red" | "gray";
}) {
  const colors = {
    blue: { bg: "rgba(36,116,255,0.10)", fg: "#2474ff" },
    green: { bg: "rgba(82,196,26,0.10)", fg: "#52c41a" },
    orange: { bg: "rgba(250,173,20,0.12)", fg: "#f59e0b" },
    red: { bg: "rgba(255,77,79,0.10)", fg: "#ff4d4f" },
    gray: { bg: "rgba(148,163,184,0.12)", fg: "#64748b" },
  }[tone];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "4px 10px",
        borderRadius: 999,
        background: colors.bg,
        color: colors.fg,
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

export function NavShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const phoneFrameWidth = 520;
  const accountVerifyPlatform = (() => {
    if (!pathname.startsWith("/account/verify/")) return "";
    const slug = pathname.split("/")[3] ?? "";
    if (slug === "xiaohongshu") return "小红书";
    if (slug === "douyin") return "抖音";
    if (slug === "bilibili") return "B站";
    if (slug === "weibo") return "微博";
    return "";
  })();
  const pageTitle =
    pathname === "/tasks"
      ? "任务中心"
      : pathname === "/account"
        ? "三方账号认证"
      : pathname === "/account/verify" || pathname.startsWith("/account/verify/")
          ? (accountVerifyPlatform ? `${accountVerifyPlatform}账号认证` : "账号认证")
        : pathname === "/submissions"
          ? "我的任务"
        : pathname.startsWith("/submissions/")
          ? "提交详情"
        : pathname === "/submit" || pathname.startsWith("/submit?")
          ? "提交内容"
        : pathname.startsWith("/tasks/")
          ? "任务详情"
        : "";

  const activeMatch = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const showBottomNav = pathname === "/tasks" || pathname === "/account";
  const isSubPage = !showBottomNav;

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/tasks");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        background:
          "radial-gradient(circle at top, rgba(36,116,255,0.12), transparent 34%), linear-gradient(180deg, #edf4ff 0%, #f8fbff 100%)",
      }}
    >
      <div
        style={{
          position: "relative",
          maxWidth: phoneFrameWidth,
          margin: "0 auto",
          padding: "16px 10px 26px",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 2,
            top: 158,
            width: 4,
            height: 74,
            borderRadius: "999px 0 0 999px",
            background: "linear-gradient(180deg, #0f172a 0%, #334155 100%)",
            boxShadow: "0 8px 18px rgba(15, 23, 42, 0.18)",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: 2,
            top: 194,
            width: 4,
            height: 92,
            borderRadius: "0 999px 999px 0",
            background: "linear-gradient(180deg, #0f172a 0%, #334155 100%)",
            boxShadow: "0 8px 18px rgba(15, 23, 42, 0.18)",
          }}
        />
        <div
          style={{
            position: "relative",
            padding: 10,
            borderRadius: 42,
            background: "linear-gradient(180deg, #111827 0%, #334155 100%)",
            boxShadow:
              "0 40px 90px rgba(15, 23, 42, 0.28), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 12,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 4,
              width: 132,
              height: 28,
              borderRadius: 999,
              background: "#0f172a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                width: 54,
                height: 6,
                borderRadius: 999,
                background: "rgba(255,255,255,0.16)",
              }}
            />
          </div>
          <div
            style={{
              minHeight: "calc(100vh - 42px)",
              borderRadius: 34,
              overflow: "hidden",
              background: "linear-gradient(180deg, #edf4ff 0%, #f8fbff 100%)",
            }}
          >
            <div
              style={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                backdropFilter: "blur(18px)",
                background: "rgba(247,250,255,0.84)",
                borderBottom: "1px solid rgba(203,213,225,0.45)",
              }}
            >
              <div style={{ padding: "42px 16px 12px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ minHeight: 36, minWidth: 36, display: "flex", alignItems: "center" }}>
                    {isSubPage && (
                      <button
                        type="button"
                        onClick={handleBack}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 12,
                          border: "1px solid rgba(203,213,225,0.75)",
                          background: "#fff",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 8px 18px rgba(15, 23, 42, 0.06)",
                          cursor: "pointer",
                        }}
                        aria-label="返回上一页"
                        title="返回上一页"
                      >
                        <ArrowLeft size={18} color="#2474ff" />
                      </button>
                    )}
                  </div>
                  <div style={{ flex: 1, textAlign: "center", fontSize: 20, fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}>
                    {pageTitle}
                  </div>
                  <div style={{ width: 40, height: 40 }} />
                </div>
              </div>
            </div>
            <Outlet />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate("/backend/dashboard")}
        style={{
          position: "fixed",
          left: "max(16px, calc(50% - 260px - 130px))",
          bottom: "16px",
          zIndex: 25,
          height: 42,
          padding: "0 14px",
          borderRadius: 999,
          border: "1px solid rgba(36,116,255,0.18)",
          background: "rgba(255,255,255,0.96)",
          color: "#2474ff",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
          fontWeight: 800,
          cursor: "pointer",
          boxShadow: "0 14px 34px rgba(36,116,255,0.18)",
          backdropFilter: "blur(14px)",
        }}
      >
        <LayoutDashboard size={14} />
        预览后台
      </button>

      {showBottomNav && (
        <div
          style={{
            position: "fixed",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(calc(100vw - 20px), 500px)",
            bottom: 0,
            zIndex: 20,
            padding: "0 10px 10px",
            pointerEvents: "none",
          }}
        >
          <div style={{ width: "100%", pointerEvents: "auto" }}>
            <Card style={{ padding: 8, borderRadius: 24 }}>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${NAV_ITEMS.length}, minmax(0, 1fr))`, gap: 4 }}>
                {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
                  const active = activeMatch(path);
                  return (
                    <Link
                      key={path}
                      to={path}
                      style={{
                        textDecoration: "none",
                        color: active ? "#2474ff" : "#64748b",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 4,
                        padding: "8px 4px",
                        borderRadius: 18,
                        background: active ? "rgba(36,116,255,0.08)" : "transparent",
                      }}
                    >
                      <Icon size={18} />
                      <span style={{ fontSize: 11, fontWeight: 600 }}>{label}</span>
                    </Link>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
