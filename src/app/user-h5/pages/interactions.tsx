import { BadgeCheck, CircleCheckBig, Clock3, Copy, Gift, ShieldCheck } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useMemo, useState } from "react";
import { useUserH5 } from "../state";
import { Card, Container, Pill, SectionTitle } from "../shared";

export function SubmissionsPage() {
  const { submissions, tasks, rewards } = useUserH5();
  const navigate = useNavigate();
  const [rejectReasonModal, setRejectReasonModal] = useState<{ title: string; reason: string } | null>(null);
  const lotterySubmissionIds = useMemo(() => new Set(["sub-2", "sub-7"]), []);
  const [status, setStatus] = useState<"全部" | "待审核" | "已通过" | "已拒绝">("全部");
  const taskNameMap = useMemo(
    () => new Map(tasks.map((task) => [task.id, task.name])),
    [tasks]
  );
  const rewardMap = useMemo(
    () => new Map(rewards.map((reward) => [reward.submissionId, reward])),
    [rewards]
  );
  const filtered = submissions.filter((item) => status === "全部" || item.status === status);

  return (
    <Container>
      <div style={{ display: "grid", gap: 12 }}>
        <Card style={{ padding: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
            {(["全部", "待审核", "已通过", "已拒绝"] as const).map((item) => (
              <button key={item} onClick={() => setStatus(item)} style={tabStyle(status === item)}>{item}</button>
            ))}
          </div>
        </Card>

        {filtered.length === 0 ? (
          <Card style={{ padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: 36 }}>📭</div>
            <div style={{ marginTop: 12, fontSize: 16, fontWeight: 800, color: "#0f172a" }}>暂无记录</div>
            <div style={{ marginTop: 6, fontSize: 13, color: "#64748b" }}>还没有提交内容，先去任务页提交吧。</div>
          </Card>
        ) : (
          filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(`/tasks/${item.taskId}`)}
              style={{
                padding: 0,
                border: "none",
                width: "100%",
                textAlign: "left",
                cursor: "pointer",
                background: "transparent",
              }}
            >
              <Card
                style={{
                  padding: 14,
                }}
              >
                <div style={{ display: "grid", gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "nowrap", minWidth: 0 }}>
                      <Pill tone={submissionStatusTone(item.status)}>{item.status}</Pill>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>
                        {item.title}
                      </div>
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        padding: "10px 12px",
                        borderRadius: 14,
                        border: "1px solid rgba(226,232,240,0.9)",
                        background: "rgba(247,250,255,0.95)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 10,
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.06em" }}>关联任务</div>
                        <div style={{ marginTop: 4, fontSize: 13, color: "#334155", fontWeight: 700, lineHeight: 1.45 }}>
                          {taskNameMap.get(item.taskId) ?? "任务已下线"}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        marginTop: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 10,
                        fontSize: 12,
                        color: "#64748b",
                        lineHeight: 1.6,
                      }}
                    >
                      <div style={{ minWidth: 0 }}>提交时间 {item.submitTime}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                        {item.status === "已通过" && (
                          lotterySubmissionIds.has(item.id) ? (
                            <div
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "4px 4px 4px 8px",
                                borderRadius: 999,
                                background: "rgba(255,243,217,0.95)",
                                border: "1px solid rgba(250,173,20,0.18)",
                              }}
                            >
                              <Pill tone="orange">抽奖机会 1</Pill>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  navigate(`/tasks/${item.taskId}`);
                                }}
                                style={{
                                  height: 28,
                                  padding: "0 10px",
                                  borderRadius: 999,
                                  border: "none",
                                  background: "#2474ff",
                                  color: "#fff",
                                  fontSize: 12,
                                  fontWeight: 800,
                                  cursor: "pointer",
                                }}
                              >
                                去抽奖
                              </button>
                            </div>
                          ) : rewardMap.get(item.id)?.amount ? (
                            <Pill tone="blue">{rewardMap.get(item.id)?.amount} 星云币</Pill>
                          ) : (
                            <Pill tone="gray">暂无奖励</Pill>
                          )
                        )}
                        {item.status === "已拒绝" && item.rejectReason && (
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              setRejectReasonModal({ title: item.title, reason: item.rejectReason as string });
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                event.stopPropagation();
                                setRejectReasonModal({ title: item.title, reason: item.rejectReason as string });
                              }
                            }}
                            style={{ fontSize: 12, fontWeight: 700, color: "#ef4444", cursor: "pointer", whiteSpace: "nowrap" }}
                          >
                            拒绝原因
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </button>
          ))
        )}
      </div>

      {rejectReasonModal && (
        <div
          onClick={() => setRejectReasonModal(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(15,23,42,0.42)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "min(100%, 360px)",
              borderRadius: 20,
              background: "#fff",
              border: "1px solid rgba(226,232,240,0.88)",
              boxShadow: "0 20px 44px rgba(15,23,42,0.16)",
              padding: 16,
              display: "grid",
              gap: 10,
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>拒绝原因</div>
            <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{rejectReasonModal.title}</div>
            <div style={{ padding: 12, borderRadius: 14, background: "rgba(255,77,79,0.08)", color: "#b91c1c", fontSize: 13, lineHeight: 1.7 }}>
              {rejectReasonModal.reason}
            </div>
            <button
              type="button"
              onClick={() => setRejectReasonModal(null)}
              style={{
                height: 38,
                borderRadius: 12,
                border: "1px solid rgba(203,213,225,0.9)",
                background: "rgba(248,250,252,0.95)",
                fontWeight: 700,
                color: "#334155",
                cursor: "pointer",
              }}
            >
              我知道了
            </button>
          </div>
        </div>
      )}
    </Container>
  );
}

export function SubmissionDetailPage() {
  const { submissions, tasks, rewards } = useUserH5();
  const navigate = useNavigate();
  const { id } = useParams();
  const item = submissions.find((entry) => entry.id === id);
  const task = item ? tasks.find((entry) => entry.id === item.taskId) ?? null : null;
  const arrivedReward = item ? rewards.find((entry) => entry.submissionId === item.id && entry.status === "已到账") ?? null : null;
  const handleCopyLink = async () => {
    if (!item) return;
    try {
      await navigator.clipboard.writeText(item.contentUrl);
    } catch {
      window.prompt("复制链接", item.contentUrl);
    }
  };
  const giftRewards = useMemo(
    () =>
      task
        ? task.rewardSpecs.flatMap((spec) => {
        if (spec.kind === "base") {
          return spec.rewardType === "gift" && spec.giftName ? [{ title: spec.title, giftName: spec.giftName, releaseMode: spec.releaseMode, releaseDays: spec.releaseDays, note: spec.note ?? "" }] : [];
        }
        if (spec.kind === "ranking") {
          return spec.tiers
            .filter((tier) => tier.rewardType === "gift" && tier.giftName)
            .map((tier) => ({
              title: spec.title,
              giftName: tier.giftName as string,
              releaseMode: spec.releaseMode,
              releaseDays: spec.releaseDays,
              note: spec.note ?? "",
              range: `${tier.rankStart} - ${tier.rankEnd} 名`,
            }));
        }
        return spec.rules
          .filter((rule) => rule.rewardType === "gift" && rule.giftName)
            .map((rule) => ({
              title: spec.title,
              giftName: rule.giftName as string,
              releaseMode: spec.releaseMode,
              releaseDays: spec.releaseDays,
              note: spec.note ?? "",
              range: `达标 ${rule.threshold}`,
            }));
          })
        : [],
    [task]
  );
  return (
    <Container>
      {!item ? (
        <Card style={{ padding: 24, textAlign: "center" }}>
          <div style={{ fontSize: 36 }}>🫥</div>
          <div style={{ marginTop: 12, fontSize: 16, fontWeight: 800, color: "#0f172a" }}>未找到提交记录</div>
          <div style={{ marginTop: 6, fontSize: 13, color: "#64748b" }}>这条记录可能已被删除或链接不正确。</div>
          <button onClick={() => navigate("/submissions")} style={primaryButtonStyle}>返回列表</button>
        </Card>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          <button
            type="button"
            onClick={() => navigate(`/tasks/${item.taskId}`)}
            style={{
              padding: 0,
              border: "none",
              width: "100%",
              textAlign: "left",
              cursor: "pointer",
              background: "transparent",
            }}
          >
            <Card
              style={{
                padding: 16,
                overflow: "hidden",
                border: "1px solid rgba(226,232,240,0.86)",
                boxShadow: "0 18px 40px rgba(15,23,42,0.07)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", minWidth: 0 }}>
                  <Pill tone={item.status === "已通过" ? "green" : item.status === "待审核" ? "orange" : item.status === "已拒绝" ? "red" : "gray"}>{item.status}</Pill>
                </div>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 14,
                    background: "rgba(241,245,249,0.96)",
                    border: "1px solid rgba(226,232,240,0.9)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#94a3b8",
                    fontSize: 18,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  ›
                </div>
              </div>
              <div style={{ marginTop: 12, fontSize: 21, fontWeight: 950, color: "#0f172a", lineHeight: 1.25 }}>{item.title}</div>
            </Card>
          </button>

          <Card style={{ padding: 16 }}>
            <SectionTitle title="内容摘要" />
            <div style={summaryShellStyle}>
              <div style={summaryStripeStyle} />
              <div style={summaryContentStyle}>
                <div style={summaryMetaRowStyle}>
                  <span style={summaryMetaLabelStyle}>发布时间</span>
                  <span style={summaryMetaValueStyle}>{item.publishTime}</span>
                </div>
                <div style={summaryPreviewStyle}>{item.contentPreview}</div>
                <div style={summaryUrlStyle}>{item.contentUrl}</div>
              </div>
            </div>
          </Card>

          {item.status === "已通过" && giftRewards.length > 0 && (
            <Card style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>奖励信息</div>
                <span style={fakeViewTagStyle}>查看</span>
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                {giftRewards.map((reward) => (
                  <div
                    key={`${reward.title}-${reward.giftName}-${reward.range ?? ""}`}
                    style={{
                      padding: 14,
                      borderRadius: 18,
                      background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(247,250,252,0.96))",
                      border: "1px solid rgba(226,232,240,0.9)",
                      display: "grid",
                      gap: 10,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 900, color: "#0f172a" }}>{reward.title}</div>
                        <div style={{ marginTop: 4, fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
                          {reward.range ? `${reward.range}获得` : "已到账赠品"}
                        </div>
                      </div>
                      <Pill tone="green">已到账</Pill>
                    </div>
                    <div
                      style={{
                        padding: 12,
                        borderRadius: 16,
                        background: "rgba(247,250,255,0.95)",
                        display: "grid",
                        gap: 6,
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.08em" }}>赠品信息</div>
                      <div style={{ fontSize: 15, fontWeight: 900, color: "#0f172a" }}>{giftLabelMap[reward.giftName] ?? reward.giftName}</div>
                      <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
                        {arrivedReward ? arrivedReward.note : "奖励已发放到账"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card style={{ padding: 16 }}>
            <SectionTitle title="提交内容" />
            <div style={{ display: "grid", gap: 10 }}>
              <div style={submissionContentRowStyle}>
                <div style={submissionContentLabelStyle}>内容标题</div>
                <button type="button" onClick={handleCopyLink} style={copyLinkButtonStyle} aria-label="复制内容链接" title="复制内容链接">
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, textAlign: "left" }}>{item.title}</span>
                  <span style={copyLinkIconStyle}>
                    <Copy size={13} />
                  </span>
                </button>
              </div>
              <div style={submissionContentRowStyle}>
                <div style={submissionContentLabelStyle}>内容链接</div>
                <div style={submissionContentValueStyle}>{item.contentUrl}</div>
              </div>
              <div style={submissionContentRowStyle}>
                <div style={submissionContentLabelStyle}>内容摘要</div>
                <div style={submissionContentValueStyle}>{item.contentPreview}</div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Container>
  );
}

export function RewardsPage() {
  const { rewards, settleReward } = useUserH5();
  const totalArrived = rewards.filter((item) => item.status === "已到账").reduce((sum, item) => sum + item.amount, 0);
  const totalPending = rewards.filter((item) => item.status === "待到账").reduce((sum, item) => sum + item.amount, 0);

  return (
    <Container>
      <div style={{ display: "grid", gap: 12 }}>
        <Card style={{ padding: 16, background: "linear-gradient(135deg, rgba(36,116,255,0.95), rgba(15,23,42,0.95))", color: "#fff" }}>
          <SectionTitle title="我的奖励" extra={<Pill tone="gray">积分</Pill>} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            <MiniStat title="已到账" value={totalArrived} />
            <MiniStat title="待到账" value={totalPending} />
          </div>
        </Card>

        <div style={{ display: "grid", gap: 10 }}>
          {rewards.map((item) => (
            <Card key={item.id} style={{ padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                    <Pill tone={item.status === "已到账" ? "green" : item.status === "待到账" ? "orange" : "gray"}>{item.status}</Pill>
                    <Pill tone="blue">{item.amount} 积分</Pill>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{item.taskName}</div>
                  <div style={{ marginTop: 6, fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>{item.note}</div>
                </div>
                {item.status === "待到账" ? <button onClick={() => settleReward(item.id)} style={iconButtonStyle("#16a34a")}> <CircleCheckBig size={18} /> </button> : <div style={iconDisabledStyle}><CircleCheckBig size={18} /></div>}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
}

export function MessagesPage() {
  const { messages, markMessageRead, markAllMessagesRead } = useUserH5();
  const navigate = useNavigate();
  const unread = messages.filter((item) => !item.read).length;

  return (
    <Container>
      <div style={{ display: "grid", gap: 12 }}>
        <Card style={{ padding: 16 }}>
          <SectionTitle title="消息中心" extra={<button onClick={markAllMessagesRead} style={linkButtonStyle}>全部已读</button>} />
          <Pill tone={unread > 0 ? "red" : "green"}>{unread > 0 ? `${unread} 条未读` : "全部已读"}</Pill>
        </Card>
        <div style={{ display: "grid", gap: 10 }}>
          {messages.map((item) => {
            const iconMap = { 审核: Clock3, 奖励: Gift, 账号: BadgeCheck, 系统: ShieldCheck } as const;
            const Icon = iconMap[item.type];
            return (
              <Card key={item.id} style={{ padding: 14, opacity: item.read ? 0.72 : 1 }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 16, background: "rgba(36,116,255,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={18} color="#2474ff" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{item.title}</div>
                      {!item.read && <span style={{ width: 8, height: 8, borderRadius: 999, background: "#2474ff", marginTop: 7 }} />}
                    </div>
                    <div style={{ marginTop: 6, fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{item.desc}</div>
                    <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>{item.time}</span>
                      <button onClick={() => { markMessageRead(item.id); if (item.target) navigate(item.target); }} style={linkButtonStyle}>查看</button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </Container>
  );
}

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Container>
      <Card style={{ padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 36 }}>404</div>
        <div style={{ marginTop: 12, fontSize: 16, fontWeight: 800, color: "#0f172a" }}>页面不存在</div>
        <button onClick={() => navigate("/tasks")} style={primaryButtonStyle}>返回任务中心</button>
      </Card>
    </Container>
  );
}

function MiniStat({ title, value }: { title: string; value: number }) {
  return (
    <div style={{ padding: 14, borderRadius: 18, background: "rgba(255,255,255,0.12)" }}>
      <div style={{ fontSize: 12, opacity: 0.8 }}>{title}</div>
      <div style={{ marginTop: 6, fontSize: 24, fontWeight: 900 }}>{value}</div>
    </div>
  );
}

const iconButtonStyle = (color: string): React.CSSProperties => ({ alignSelf: "center", width: 42, height: 42, borderRadius: 16, border: "none", background: `${color}1f`, color, cursor: "pointer" });
const iconDisabledStyle: React.CSSProperties = { alignSelf: "center", width: 42, height: 42, borderRadius: 16, background: "rgba(241,245,249,0.9)", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" };
const errorBoxStyle: React.CSSProperties = { marginTop: 10, padding: 12, borderRadius: 18, background: "rgba(255,77,79,0.10)", color: "#ef4444", fontSize: 13, lineHeight: 1.6 };
const linkButtonStyle: React.CSSProperties = { border: "none", background: "transparent", color: "#2474ff", fontSize: 12, fontWeight: 700, cursor: "pointer" };
const primaryButtonStyle: React.CSSProperties = { marginTop: 16, height: 42, padding: "0 18px", border: "none", borderRadius: 16, background: "#2474ff", color: "#fff", fontWeight: 800, cursor: "pointer" };
const summaryShellStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "6px minmax(0, 1fr)",
  gap: 12,
  padding: 14,
  borderRadius: 20,
  background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(247,250,255,0.94))",
  border: "1px solid rgba(226,232,240,0.88)",
  boxShadow: "0 12px 30px rgba(15,23,42,0.05)",
};
const summaryStripeStyle: React.CSSProperties = {
  borderRadius: 999,
  background: "linear-gradient(180deg, #2474ff 0%, rgba(36,116,255,0.28) 100%)",
};
const summaryContentStyle: React.CSSProperties = { display: "grid", gap: 10 };
const summaryMetaRowStyle: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 };
const summaryMetaLabelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.08em" };
const summaryMetaValueStyle: React.CSSProperties = { fontSize: 12, fontWeight: 800, color: "#334155" };
const summaryPreviewStyle: React.CSSProperties = {
  padding: 14,
  borderRadius: 16,
  background: "rgba(248,250,252,0.98)",
  border: "1px solid rgba(226,232,240,0.86)",
  color: "#0f172a",
  fontSize: 13,
  lineHeight: 1.75,
};
const summaryUrlStyle: React.CSSProperties = { fontSize: 12, color: "#94a3b8", wordBreak: "break-all", lineHeight: 1.6 };
const fakeViewTagStyle: React.CSSProperties = {
  border: "1px solid rgba(203,213,225,0.95)",
  background: "rgba(255,255,255,0.92)",
  color: "#334155",
  borderRadius: 999,
  height: 30,
  padding: "0 12px",
  fontSize: 12,
  fontWeight: 800,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};
const submissionContentRowStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
};
const submissionContentLabelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  color: "#94a3b8",
  letterSpacing: "0.08em",
};
const submissionContentValueStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 16,
  background: "rgba(247,250,255,0.95)",
  border: "1px solid rgba(226,232,240,0.88)",
  color: "#0f172a",
  fontSize: 13,
  lineHeight: 1.7,
  wordBreak: "break-word",
};
const copyLinkButtonStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid rgba(36,116,255,0.14)",
  background: "rgba(36,116,255,0.08)",
  color: "#1d4ed8",
  borderRadius: 16,
  padding: "12px 14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  fontSize: 13,
  fontWeight: 800,
  cursor: "pointer",
};
const copyLinkIconStyle: React.CSSProperties = {
  width: 24,
  height: 24,
  borderRadius: 999,
  background: "rgba(255,255,255,0.96)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 13,
  flexShrink: 0,
};
const giftLabelMap: Record<string, string> = {
  g1: "品牌帆布包",
  g2: "定制马克杯",
  g3: "品牌T恤（M码）",
  g4: "护肤礼盒套装",
  g5: "无线蓝牙耳机",
  g6: "限定款香薰蜡烛",
  g7: "品牌帽子",
  g8: "手提保温杯",
};

const tabStyle = (active: boolean): React.CSSProperties => ({
  height: 38,
  borderRadius: 14,
  border: "none",
  background: active ? "rgba(36,116,255,0.12)" : "rgba(241,245,249,0.9)",
  color: active ? "#2474ff" : "#475569",
  fontWeight: 800,
  fontSize: 12,
  cursor: "pointer",
});

function submissionStatusTone(status: "待审核" | "已通过" | "已拒绝") {
  if (status === "已通过") return "green";
  if (status === "待审核") return "orange";
  if (status === "已拒绝") return "red";
  return "gray";
}

function rewardStatusBg(status: "待到账" | "已到账" | "已失效") {
  if (status === "已到账") return "rgba(82,196,26,0.12)";
  if (status === "待到账") return "rgba(36,116,255,0.10)";
  return "rgba(148,163,184,0.14)";
}

function rewardStatusFg(status: "待到账" | "已到账" | "已失效") {
  if (status === "已到账") return "#16a34a";
  if (status === "待到账") return "#2474ff";
  return "#64748b";
}
