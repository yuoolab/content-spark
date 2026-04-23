import { ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { useUserH5, type Platform } from "../state";
import { Card, Container } from "../shared";
import { PlatformBadge } from "../../components/platform/PlatformBadge";

function InputField({
  label,
  value,
  onChange,
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontSize: 12, color: "#475569", fontWeight: 800, letterSpacing: "0.01em" }}>{label}</span>
      <input
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
        style={readOnly ? { ...inputStyle, ...readOnlyInputStyle } : inputStyle}
      />
    </label>
  );
}

const VERIFY_STATUS_META = [
  {
    platform: "小红书" as Platform,
    slug: "xiaohongshu",
    status: "去认证",
    tone: "orange" as const,
    hint: "绑定账号信息后即可提交认证",
  },
  {
    platform: "抖音" as Platform,
    slug: "douyin",
    status: "认证中...",
    tone: "gray" as const,
    hint: "资料已提交，正在等待审核",
  },
  {
    platform: "哔哩哔哩" as Platform,
    slug: "bilibili",
    status: "已认证",
    tone: "green" as const,
    hint: "账号已通过认证，可直接参与任务",
  },
  {
    platform: "微博" as Platform,
    slug: "weibo",
    status: "认证失败",
    tone: "red" as const,
    hint: "资料不完整，请重新提交认证",
  },
] as const;

const toVerifyPlatform = (slug?: string): Platform | null =>
  ({ xiaohongshu: "小红书", douyin: "抖音", bilibili: "哔哩哔哩", weibo: "微博" } as Record<string, Platform>)[slug ?? ""] ?? null;

const defaultAccountForm: Record<Platform, { accountName: string; accountHandle: string; profileUrl: string; followers: string; works: string }> = {
  小红书: {
    accountName: "小鹿Elaine日记",
    accountHandle: "@elaine_diary",
    profileUrl: "https://www.xiaohongshu.com/user/profile/demo",
    followers: "12400",
    works: "86",
  },
  抖音: {
    accountName: "Tony日常",
    accountHandle: "@tony_daily",
    profileUrl: "https://www.douyin.com/user/demo",
    followers: "8500",
    works: "62",
  },
  哔哩哔哩: {
    accountName: "阿鹿测评屋",
    accountHandle: "@alureview",
    profileUrl: "https://space.bilibili.com/demo",
    followers: "5300",
    works: "41",
  },
  微博: {
    accountName: "阿柚生活方式",
    accountHandle: "@yoyo_share",
    profileUrl: "https://weibo.com/u/demo",
    followers: "9100",
    works: "58",
  },
};

const PLATFORM_THEME: Record<"小红书" | "抖音" | "B站" | "微博", { accent: string; accentBorder: string; headerBg: string }> = {
  小红书: {
    accent: "#FF2442",
    accentBorder: "rgba(255,36,66,0.18)",
    headerBg: "linear-gradient(135deg, rgba(255,36,66,0.12), rgba(255,36,66,0.04))",
  },
  抖音: {
    accent: "#111111",
    accentBorder: "rgba(17,17,17,0.12)",
    headerBg: "linear-gradient(135deg, rgba(17,17,17,0.10), rgba(17,17,17,0.03))",
  },
  B站: {
    accent: "#FF5A8F",
    accentBorder: "rgba(255,90,143,0.18)",
    headerBg: "linear-gradient(135deg, rgba(255,90,143,0.12), rgba(255,90,143,0.04))",
  },
  微博: {
    accent: "#E6162D",
    accentBorder: "rgba(230,22,45,0.18)",
    headerBg: "linear-gradient(135deg, rgba(230,22,45,0.12), rgba(230,22,45,0.04))",
  },
};

const displayPlatformName = (platform: Platform) => (platform === "哔哩哔哩" ? "B站" : platform);
const themePlatformKey = (platform: Platform) =>
  (platform === "哔哩哔哩" ? "B站" : platform) as "小红书" | "抖音" | "B站" | "微博";

export function AccountVerifyCenterPage() {
  const navigate = useNavigate();

  return (
    <Container>
      <div style={{ display: "grid", gap: 12 }}>
        <Card style={{ padding: 12 }}>
          <div style={{ display: "grid", gap: 10 }}>
            {VERIFY_STATUS_META.map((item) => {
              const toneMeta = {
                orange: { bg: "rgba(250,173,20,0.10)", fg: "#f97316", border: "rgba(250,173,20,0.18)" },
                gray: { bg: "rgba(148,163,184,0.14)", fg: "#64748b", border: "rgba(148,163,184,0.20)" },
                green: { bg: "rgba(82,196,26,0.10)", fg: "#16a34a", border: "rgba(82,196,26,0.18)" },
                red: { bg: "rgba(255,77,79,0.10)", fg: "#ef4444", border: "rgba(255,77,79,0.18)" },
              }[item.tone];

              const content = (
                <>
                  <div style={{ minWidth: 0 }}>
                    <PlatformBadge platform={item.platform} size={15} />
                    <div style={{ marginTop: 6, fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>
                      {item.hint}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "5px 10px",
                        borderRadius: 999,
                        background: toneMeta.bg,
                        border: `1px solid ${toneMeta.border}`,
                        color: toneMeta.fg,
                        fontSize: 12,
                        fontWeight: 800,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.status}
                    </span>
                    {item.slug ? <ChevronRight size={18} color="#cbd5e1" /> : null}
                  </div>
                </>
              );

              if (item.slug) {
                return (
                  <button
                    key={item.platform}
                    type="button"
                    onClick={() => navigate(`/account/verify/${item.slug}`)}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 12,
                      width: "100%",
                      border: "1px solid rgba(226,232,240,0.95)",
                      borderRadius: 18,
                      background: "rgba(247,250,255,0.95)",
                      padding: "14px 12px",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    {content}
                  </button>
                );
              }

              return (
                <div
                  key={item.platform}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 12,
                    width: "100%",
                    border: "1px solid rgba(226,232,240,0.95)",
                    borderRadius: 18,
                    background: "rgba(247,250,255,0.95)",
                    padding: "14px 12px",
                    textAlign: "left",
                    opacity: 0.96,
                  }}
                >
                  {content}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </Container>
  );
}

export function AccountVerifyPage() {
  const { accounts, verifyAccount } = useUserH5();
  const navigate = useNavigate();
  const { platform: platformSlug } = useParams();
  const platform = toVerifyPlatform(platformSlug);
  const visualPlatform = platform ? displayPlatformName(platform) : "小红书";
  const theme = PLATFORM_THEME[themePlatformKey(platform ?? "小红书")];
  const currentAccount = useMemo(
    () => (platform ? accounts.find((item) => item.platform === platform) ?? null : null),
    [accounts, platform]
  );
  const statusMeta = platform ? VERIFY_STATUS_META.find((item) => item.platform === platform) ?? null : null;
  const detailStatus = currentAccount ? "已认证" : statusMeta?.status ?? "去认证";
  const preset = platform
    ? currentAccount
      ? {
          accountName: currentAccount.accountName,
          accountHandle: currentAccount.accountHandle,
          profileUrl: currentAccount.profileUrl,
          followers: String(currentAccount.followers),
          works: String(currentAccount.works),
        }
      : defaultAccountForm[platform]
    : defaultAccountForm["小红书"];
  const [accountName, setAccountName] = useState(preset.accountName);
  const [accountHandle, setAccountHandle] = useState(preset.accountHandle);
  const [profileUrl, setProfileUrl] = useState(preset.profileUrl);
  const [followers, setFollowers] = useState(preset.followers);
  const [works, setWorks] = useState(preset.works);
  const [retryMode, setRetryMode] = useState(false);
  const [result, setResult] = useState("");
  const isEditable = detailStatus === "去认证" || retryMode;

  useEffect(() => {
    if (!platform) return;
    setAccountName(preset.accountName);
    setAccountHandle(preset.accountHandle);
    setProfileUrl(preset.profileUrl);
    setFollowers(preset.followers);
    setWorks(preset.works);
    setRetryMode(false);
    setResult("");
  }, [platform, preset]);

  if (!platform) {
    return (
      <Container>
        <Card style={{ padding: 24, textAlign: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>认证平台不存在</div>
          <div style={{ marginTop: 6, fontSize: 13, color: "#64748b" }}>请先回到认证中心，选择可用的平台入口。</div>
          <button
            onClick={() => navigate("/account")}
            style={{
              marginTop: 14,
              height: 46,
              padding: "0 18px",
              border: "none",
              borderRadius: 16,
              background: "#2474ff",
              color: "#fff",
              fontSize: 14,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            返回认证中心
          </button>
        </Card>
      </Container>
    );
  }

  const handleVerify = () => {
    const ok = verifyAccount(platform, {
      accountName,
      accountHandle,
      profileUrl,
      followers: Number(followers) || 0,
      works: Number(works) || 0,
    });
    setResult(ok ? "认证提交成功，账号已绑定。" : "认证失败，请检查账号信息后重试。");
    if (ok) {
      setRetryMode(false);
    }
  };

  return (
    <Container>
      <div style={{ display: "grid", gap: 12 }}>
        <Card
          style={{
            padding: 0,
            overflow: "hidden",
            border: `1px solid ${theme.accentBorder}`,
            boxShadow: "0 18px 44px rgba(15,23,42,0.07)",
          }}
        >
          <div
            style={{
              padding: 14,
              background: theme.headerBg,
              borderBottom: `1px solid ${theme.accentBorder}`,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <PlatformBadge platform={platform} size={15} />
              <div style={{ marginTop: 8, fontSize: 18, fontWeight: 900, color: "#0f172a", lineHeight: 1.2 }}>
                {visualPlatform}账号认证
              </div>
              <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "4px 9px",
                    borderRadius: 999,
                    background:
                      detailStatus === "已认证"
                        ? "rgba(82,196,26,0.10)"
                        : detailStatus === "认证失败"
                          ? "rgba(255,77,79,0.10)"
                          : detailStatus === "认证中..."
                            ? "rgba(148,163,184,0.14)"
                            : "rgba(36,116,255,0.10)",
                    color:
                      detailStatus === "已认证"
                        ? "#16a34a"
                        : detailStatus === "认证失败"
                          ? "#ef4444"
                          : detailStatus === "认证中..."
                            ? "#64748b"
                            : "#2474ff",
                    border: `1px solid ${
                      detailStatus === "已认证"
                        ? "rgba(82,196,26,0.18)"
                        : detailStatus === "认证失败"
                          ? "rgba(255,77,79,0.18)"
                          : detailStatus === "认证中..."
                            ? "rgba(148,163,184,0.20)"
                            : "rgba(36,116,255,0.18)"
                    }`,
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  {detailStatus}
                </span>
                <span style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
                  {retryMode
                    ? "请重新填写认证信息后再次提交。"
                    : isEditable
                    ? "当前为未认证状态，可以填写并提交认证资料。"
                    : "当前仅可查看已提交的认证资料，不可修改或再次提交。"}
                </span>
              </div>
            </div>
          </div>

          <div style={{ padding: 14, display: "grid", gap: 14 }}>
            <div
              style={{
                display: "grid",
                gap: 12,
                padding: 14,
                borderRadius: 18,
                background: "rgba(248,250,252,0.96)",
                border: "1px solid rgba(226,232,240,0.95)",
              }}
            >
              <InputField label="账号昵称" value={accountName} onChange={setAccountName} readOnly={!isEditable} />
              <InputField label="账号标识" value={accountHandle} onChange={setAccountHandle} readOnly={!isEditable} />
              <InputField label="主页链接" value={profileUrl} onChange={setProfileUrl} readOnly={!isEditable} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
                <InputField label="粉丝数" value={followers} onChange={setFollowers} readOnly={!isEditable} />
                <InputField label="作品数" value={works} onChange={setWorks} readOnly={!isEditable} />
              </div>
            </div>

            {(detailStatus === "认证失败" || isEditable) && (
              <div
                style={{
                  paddingTop: 2,
                }}
              >
                {detailStatus === "认证失败" && !retryMode ? (
                  <button
                    type="button"
                    onClick={() => setRetryMode(true)}
                    style={{
                      width: "100%",
                      height: 46,
                      border: "none",
                      borderRadius: 16,
                      background: theme.accent,
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: 800,
                      cursor: "pointer",
                      boxShadow: `0 14px 26px ${theme.accent}22`,
                    }}
                  >
                    重新认证
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleVerify}
                    style={{
                      width: "100%",
                      height: 46,
                      border: "none",
                      borderRadius: 16,
                      background: theme.accent,
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: 800,
                      cursor: "pointer",
                      boxShadow: `0 14px 26px ${theme.accent}22`,
                    }}
                  >
                    提交认证
                  </button>
                )}
                {result && (
                  <div
                    style={{
                      marginTop: 10,
                      padding: 12,
                      borderRadius: 16,
                      background: result.includes("成功") ? "rgba(82,196,26,0.10)" : "rgba(36,116,255,0.10)",
                      color: result.includes("成功") ? "#15803d" : "#2474ff",
                      fontSize: 13,
                      lineHeight: 1.6,
                    }}
                  >
                    {result}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </Container>
  );
}

export function AccountPage() {
  return <AccountVerifyCenterPage />;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 42,
  borderRadius: 14,
  border: "1px solid rgba(203,213,225,0.82)",
  padding: "0 14px",
  outline: "none",
  background: "rgba(255,255,255,0.96)",
  color: "#0f172a",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
};
const readOnlyInputStyle: React.CSSProperties = {
  color: "#334155",
  background: "rgba(248,250,252,0.98)",
  border: "1px solid rgba(226,232,240,0.95)",
  cursor: "default",
};
