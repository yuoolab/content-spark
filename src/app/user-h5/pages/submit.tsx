import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useUserH5 } from "../state";
import { Card, Container, SectionTitle } from "../shared";
import { PlatformBadge } from "../../components/platform/PlatformBadge";

function InputField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} style={{ ...inputStyle, height: "auto", padding: 14, resize: "vertical" }} />
    </label>
  );
}

export function SubmitPage() {
  const { tasks, accounts, submitContent } = useUserH5();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get("taskId") ?? tasks[0]?.id ?? "";
  const task = useMemo(() => tasks.find((item) => item.id === taskId) ?? tasks[0], [tasks, taskId]);
  const [contentUrl, setContentUrl] = useState("https://www.xiaohongshu.com/explore/demo-submit");
  const [contentPreview, setContentPreview] = useState("春季换季期分享一篇真实种草笔记，突出使用感受与推荐理由。");
  const [feedback, setFeedback] = useState("");

  if (!task) {
    return (
      <Container>
        <Card style={{ padding: 24, textAlign: "center" }}>
          <div style={{ fontSize: 36 }}>🫥</div>
          <div style={{ marginTop: 12, fontSize: 16, fontWeight: 800, color: "#0f172a" }}>暂无可提交任务</div>
          <button onClick={() => navigate("/tasks")} style={primaryButtonStyle}>去任务中心</button>
        </Card>
      </Container>
    );
  }

  const platform = task.platform[0] ?? "小红书";
  const account = accounts.find((item) => item.platform === platform);
  const submissionRules = [
    "内容链接必须公开可访问",
    "同一链接不能重复提交",
    "提交内容必须是认证账号发布的",
    `单任务每人提交上限为 ${task.maxPerUser} 条`,
  ];

  const handleSubmit = () => {
    if (!account) {
      setFeedback("当前平台还没有完成绑定，请先去账号认证页完成认证。");
      return;
    }

    const result = submitContent({
      taskId: task.id,
      platform,
      title: task.name,
      contentUrl,
      contentPreview,
      publishTime: new Date().toLocaleString("zh-CN", { hour12: false }),
      accountHandle: account.accountHandle,
    });
    setFeedback(result.message);
    if (result.ok) navigate("/submissions");
  };

  return (
    <Container>
      <div style={{ display: "grid", gap: 12 }}>
        <Card style={{ padding: 16 }}>
          <SectionTitle title="来源任务" />
          <div style={heroSourceStyle}>
            <div style={heroThumbStyle}>
              <img src={task.image} alt={task.name} style={heroThumbImgStyle} />
            </div>

            <div style={heroRightColStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "nowrap", minWidth: 0 }}>
                <div style={heroTaskTitleStyle}>{task.name}</div>
              </div>
              <div style={heroMetaRowStyle}>
                <PlatformBadge platform={platform} />
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
            <InputField label="内容链接" value={contentUrl} onChange={setContentUrl} />
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>内容摘要</span>
              <textarea value={contentPreview} onChange={(e) => setContentPreview(e.target.value)} rows={4} style={{ ...inputStyle, height: "auto", padding: 14, resize: "vertical" }} />
            </label>
          </div>
        </Card>

        <Card style={{ padding: 16 }}>
          <SectionTitle title="提交规则" />
          <div style={ruleBoardStyle}>
            <div style={ruleBoardHeaderStyle}>
              <div>
                <div style={ruleBoardHeaderTitleStyle}>提交前请确认</div>
                <div style={ruleBoardHeaderDescStyle}>系统会在提交时自动校验，减少无效投稿</div>
              </div>
            </div>

            <div style={ruleBoardListStyle}>
              {submissionRules.map((rule, index) => (
                <div key={rule} style={ruleBoardItemStyle(index === submissionRules.length - 1)}>
                  <span style={ruleBoardIndexStyle}>{String(index + 1).padStart(2, "0")}</span>
                  <span style={ruleBoardTextStyle}>{rule}</span>
                </div>
              ))}
            </div>
          </div>
          {feedback && <div style={{ marginTop: 12, padding: 12, borderRadius: 18, background: feedback.includes("成功") ? "rgba(82,196,26,0.10)" : "rgba(250,173,20,0.10)", color: feedback.includes("成功") ? "#15803d" : "#b45309", fontSize: 13, lineHeight: 1.6 }}>{feedback}</div>}
        </Card>
      </div>

      <div style={fixedSubmitBarWrapStyle}>
        <button
          onClick={handleSubmit}
          style={fixedSubmitButtonStyle}
        >
          提交审核
        </button>
      </div>
    </Container>
  );
}

const inputStyle: React.CSSProperties = { width: "100%", height: 44, borderRadius: 16, border: "1px solid rgba(203,213,225,0.9)", padding: "0 14px", outline: "none", background: "#fff" };
const primaryButtonStyle: React.CSSProperties = {
  height: 54,
  border: "none",
  borderRadius: 18,
  background: "#2474ff",
  color: "#fff",
  fontSize: 15,
  fontWeight: 900,
  cursor: "pointer",
  width: "100%",
  letterSpacing: "0.02em",
};
const fixedSubmitBarWrapStyle: React.CSSProperties = {
  position: "fixed",
  left: "50%",
  bottom: 16,
  transform: "translateX(-50%)",
  width: "min(calc(100vw - 20px), 500px)",
  padding: "0 16px calc(env(safe-area-inset-bottom, 0px) + 0px) 16px",
  boxSizing: "border-box",
  zIndex: 20,
};
const fixedSubmitButtonStyle: React.CSSProperties = {
  ...primaryButtonStyle,
  height: 48,
  borderRadius: 16,
  background: "#2474ff",
  boxShadow: "0 18px 34px rgba(36,116,255,0.24)",
  cursor: "pointer",
};
const heroSourceStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "128px 1fr",
  gap: 12,
  alignItems: "stretch",
  padding: 12,
  borderRadius: 24,
  background: "rgba(255,255,255,0.94)",
  border: "1px solid rgba(255,255,255,0.9)",
  boxShadow: "0 12px 40px rgba(36,116,255,0.08)",
};
const heroThumbStyle: React.CSSProperties = {
  position: "relative",
  borderRadius: 20,
  overflow: "hidden",
  aspectRatio: "16 / 10",
  width: "100%",
  background: "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(59,130,246,0.22))",
};
const heroRightColStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: 10,
  minWidth: 0,
  padding: "4px 0",
};
const heroThumbImgStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};
const heroSourceLabelStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  width: "fit-content",
  padding: "4px 8px",
  borderRadius: 999,
  background: "rgba(36,116,255,0.10)",
  color: "#2474ff",
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "0.02em",
};
const heroTaskTitleStyle: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 900,
  color: "#0f172a",
  lineHeight: 1.25,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};
const heroMetaRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  alignItems: "center",
};
const ruleBoardStyle: React.CSSProperties = {
  padding: 14,
  borderRadius: 20,
  background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.96))",
  border: "1px solid rgba(226,232,240,0.95)",
  boxShadow: "0 10px 26px rgba(15,23,42,0.04)",
};
const ruleBoardHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  marginBottom: 12,
};
const ruleBoardHeaderTitleStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 900,
  color: "#0f172a",
};
const ruleBoardHeaderDescStyle: React.CSSProperties = {
  marginTop: 4,
  fontSize: 12,
  color: "#64748b",
  lineHeight: 1.5,
};
const ruleBoardListStyle: React.CSSProperties = {
  display: "grid",
  gap: 0,
};
const ruleBoardItemStyle = (isLast: boolean): React.CSSProperties => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "14px 4px",
  borderTop: "1px solid rgba(226,232,240,0.92)",
  borderBottom: isLast ? "1px solid rgba(226,232,240,0.92)" : "none",
});
const ruleBoardIndexStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 10,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(36,116,255,0.10)",
  color: "#2474ff",
  fontSize: 11,
  fontWeight: 900,
  flexShrink: 0,
};
const ruleBoardTextStyle: React.CSSProperties = {
  fontSize: 14,
  color: "#0f172a",
  fontWeight: 700,
  lineHeight: 1.45,
};
