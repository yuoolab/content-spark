import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Gift,
  Globe,
  Grid2x2,
  Hash,
  History,
  PlayCircle,
  Send,
  Star,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useMemo, useRef, useState } from "react";
import { useUserH5 } from "../state";
import type { TaskRewardSpec } from "../state";
import { Card, Container, Pill, SectionTitle, fmtNumber } from "../shared";
import { PlatformBadge } from "../../components/platform/PlatformBadge";

const formatTaskRange = (startDate: string, endDate: string) =>
  `${startDate.split("-").join("/")} 至 ${endDate.split("-").join("/")}`;

const GIFT_LABELS: Record<string, string> = {
  g1: "品牌帆布包",
  g2: "定制马克杯",
  g3: "品牌T恤（M码）",
  g4: "护肤礼盒套装",
  g5: "无线蓝牙耳机",
  g6: "限定款香薰蜡烛",
  g7: "品牌帽子",
  g8: "手提保温杯",
};

const GIFT_IMAGES: Record<string, string> = {
  g1: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80",
  g2: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=200&q=80",
  g3: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=200&q=80",
  g4: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=200&q=80",
  g5: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80",
  g6: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=200&q=80",
  g7: "https://images.unsplash.com/photo-1523398002811-6b3e3f0f9f0e?auto=format&fit=crop&w=200&q=80",
  g8: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=200&q=80",
};

const TASK_STATUS_META = {
  全部: { icon: Grid2x2, accent: "#22c55e", soft: "rgba(34,197,94,0.10)", border: "rgba(34,197,94,0.55)", text: "#16a34a" },
  进行中: { icon: PlayCircle, accent: "#22c55e", soft: "rgba(34,197,94,0.10)", border: "rgba(34,197,94,0.18)", text: "#16a34a" },
  未开始: { icon: Clock3, accent: "#f59e0b", soft: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.18)", text: "#f59e0b" },
  已结束: { icon: CheckCircle2, accent: "#94a3b8", soft: "rgba(148,163,184,0.12)", border: "rgba(203,213,225,0.85)", text: "#64748b" },
} as const;

const RANKING_PROFILES = [
  { handle: "@luna_story", title: "春季护肤开箱｜真实上脸感受", platform: "小红书" },
  { handle: "@mike_review", title: "新品测评｜这次真的超出预期", platform: "抖音" },
  { handle: "@coco_diary", title: "一周种草记录｜好用到想回购", platform: "小红书" },
  { handle: "@nina_vlog", title: "开箱Vlog｜这款新品太适合春天了", platform: "抖音" },
  { handle: "@anna_notes", title: "春季新品清单，认真挑了 5 个", platform: "小红书" },
  { handle: "@james_daily", title: "真实使用一周后，体验变化很明显", platform: "抖音" },
  { handle: "@sasa_life", title: "分享一个我最近很喜欢的新品", platform: "小红书" },
  { handle: "@tom_choice", title: "测评向内容｜互动数据持续上涨", platform: "抖音" },
  { handle: "@lily_sees", title: "春日上新分享｜性价比超预期", platform: "小红书" },
  { handle: "@ray_view", title: "体验记录｜这波新品真的不错", platform: "抖音" },
] as const;

const seededValue = (seed: string, min: number, max: number) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const span = max - min + 1;
  return min + (hash % span);
};

export function TaskListPage() {
  const { tasks } = useUserH5();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"全部" | "进行中" | "未开始" | "已结束">("全部");
  const filters: Array<"全部" | "进行中" | "未开始" | "已结束"> = ["全部", "进行中", "未开始", "已结束"];

  const filtered = useMemo(
    () =>
      tasks.filter((task) => {
        const okStatus = status === "全部" || task.status === status;
        return okStatus;
      }),
    [tasks, status]
  );

  return (
    <Container>
      <div style={{ display: "grid", gap: 14 }}>
        <section style={taskHeroStyle}>
          <div style={taskHeroCopyStyle}>
            <div style={taskHeroTitleStyle}>任务中心</div>
            <div style={taskHeroSubtitleStyle}>轻松参与活动，赢取丰厚奖励</div>
          </div>

          <div aria-hidden="true" style={taskHeroVisualStyle}>
            <div style={taskHeroHaloStyle} />
            <div style={taskHeroClipboardStyle}>
              <div style={taskHeroClipStyle} />
              <div style={taskHeroCheckStyle(0)} />
              <div style={taskHeroLineStyle(0)} />
              <div style={taskHeroCheckStyle(1)} />
              <div style={taskHeroLineStyle(1)} />
              <div style={taskHeroCheckStyle(2)} />
              <div style={taskHeroLineStyle(2)} />
            </div>
            <div style={taskHeroBellStyle} />
            <div style={taskHeroSparkStyle({ top: 18, right: 18 })} />
            <div style={taskHeroSparkStyle({ top: 56, right: 122, scale: 0.8 })} />
          </div>
        </section>

        <div style={taskFilterShellStyle}>
          {filters.map((item) => {
            const meta = TASK_STATUS_META[item];
            const Icon = meta.icon;
            const active = status === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setStatus(item)}
                style={taskFilterButtonStyle(active, item)}
              >
                <Icon size={21} color={active ? meta.accent : "#64748b"} strokeWidth={2.1} />
                <span>{item}</span>
              </button>
            );
          })}
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {filtered.length === 0 ? (
            <div style={taskEmptyStyle}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>暂无符合条件的任务</div>
              <div style={{ marginTop: 6, fontSize: 13, color: "#7b8aa5" }}>试试切换任务状态</div>
            </div>
          ) : (
            filtered.map((task) => (
              <button
                key={task.id}
                type="button"
                style={taskListCardStyle}
                onClick={() => navigate(`/tasks/${task.id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(110, 138, 191, 0.14)";
                  e.currentTarget.style.borderColor = "rgba(219, 228, 243, 1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = taskListCardStyle.boxShadow as string;
                  e.currentTarget.style.borderColor = "rgba(235,241,250,0.96)";
                }}
              >
                <div style={taskListCardInnerStyle}>
                  <div style={taskListImageWrapStyle}>
                    <img
                      src={task.image}
                      alt={task.name}
                      style={taskListImageStyle}
                    />
                  </div>

                  <div style={taskListContentStyle}>
                    <div style={taskListTopRowStyle}>
                      <div style={taskListTitleWrapStyle}>
                        <div style={taskStatusChipStyle(task.status)}>
                          {task.status}
                        </div>
                        <div style={taskListTitleStyle}>
                          {task.name}
                        </div>
                      </div>
                      <div style={taskListArrowBubbleStyle}>
                        <ChevronRight size={18} color="#5f708f" />
                      </div>
                    </div>

                    <div style={taskListDatePillStyle}>
                      <CalendarDays size={15} color="#74839f" />
                      <span>任务时间</span>
                      <span style={{ color: "#60708c", fontWeight: 700 }}>{formatTaskRange(task.startDate, task.endDate)}</span>
                    </div>

                    <div style={taskListMetaRowStyle}>
                      <div style={taskListMetaItemStyle}>
                        <Users size={15} color="#74839f" />
                        <span>参与人数 {fmtNumber(task.participants)}</span>
                      </div>
                      <div style={taskListMetaItemStyle}>
                        <Send size={15} color="#74839f" />
                        <span>提交量 {fmtNumber(task.submissions)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div style={taskListFloatingDockStyle}>
        <div style={taskListFloatingDockInnerStyle}>
          <button onClick={() => navigate("/submissions")} style={taskListFloatingButtonStyle}>
            <span style={taskListFloatingIconWrapStyle}>
              <History size={18} />
            </span>
            <span style={taskListFloatingTextStyle}>我的任务</span>
          </button>
        </div>
      </div>
    </Container>
  );
}

export function TaskDetailPage() {
  const { id = "" } = useParams();
  const { tasks, submissions, subscribeTaskStartReminder } = useUserH5();
  const navigate = useNavigate();
  const taskStepsRef = useRef<HTMLDivElement | null>(null);
  const [showRankingSheet, setShowRankingSheet] = useState(false);
  const [startReminderSubscribed, setStartReminderSubscribed] = useState(false);
  const task = tasks.find((item) => item.id === id);
  const taskRanking = useMemo(
    () =>
      submissions
        .filter((item) => item.taskId === task?.id)
        .map((item) => ({
          ...item,
          interactionScore: item.likes + item.comments + item.collections,
        }))
        .sort((a, b) => b.interactionScore - a.interactionScore),
    [submissions, task?.id]
  );
  const rankingEntries = useMemo(() => {
    if (!task) return [];

    const actual = taskRanking.map((item) => ({
      id: item.id,
      accountHandle: item.accountHandle,
      title: item.title,
      platform: item.platform,
      interactionScore: item.interactionScore,
    }));

    const fallback = RANKING_PROFILES.map((profile, index) => ({
      id: `${task.id}-rank-${index + 1}`,
      accountHandle: profile.handle,
      title: profile.title,
      platform: profile.platform,
      interactionScore: seededValue(`${task.id}-${profile.handle}`, 88 - index * 4, 720 - index * 18),
    }));

    const merged = [...actual];
    const seen = new Set(actual.map((item) => `${item.accountHandle}|${item.title}`));
    for (const item of fallback) {
      if (merged.length >= 8) break;
      const key = `${item.accountHandle}|${item.title}`;
      if (seen.has(key)) continue;
      merged.push(item);
      seen.add(key);
    }

    merged.sort((a, b) => b.interactionScore - a.interactionScore);
    return merged.slice(0, 10);
  }, [task, taskRanking]);
  const helpSteps = [
    "1. 先完成三方平台的账号认证",
    "2. 查看任务的详细规则说明",
    "3. 去平台发布内容并复制链接",
    "4. 提交已发布的内容进行审核",
    "5. 审核通过到达指定时间自动发放奖励",
  ] as const;
  const faqs = [
    ["为什么要先认证三方账号？", "为了确认内容归属，避免重复提交和冒领奖励。"],
    ["为什么提交后不是立刻到账？", "内容需要先经过审核，再进入奖励待到账状态，避免发布后再删除。"],
    ["为什么我的内容会被拒绝？", "常见原因包括链接无效、账号不一致、未包含指定话题标签或内容不符合要求。"],
    ["为什么同一个链接不能重复提交？", "这是为了防止重复领奖和异常刷量，同一链接仅可提交一次。"],
  ] as const;

  if (!task) {
    return (
      <Container>
        <Card style={{ padding: 24, textAlign: "center" }}>
          <div style={{ fontSize: 36 }}>🫥</div>
          <div style={{ marginTop: 12, fontSize: 16, fontWeight: 800, color: "#0f172a" }}>未找到任务</div>
          <button onClick={() => navigate("/tasks")} style={primaryButtonStyle}>返回任务中心</button>
        </Card>
      </Container>
    );
  }

  const scrollToTaskIntro = () => {
    taskStepsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubscribeStartReminder = () => {
    const res = subscribeTaskStartReminder(task.id);
    if (res.ok) setStartReminderSubscribed(true);
  };

  return (
    <Container>
      <div style={{ display: "grid", gap: 10 }}>
        <div
          style={{
            position: "relative",
            borderRadius: 28,
            overflow: "hidden",
            aspectRatio: "16 / 9.2",
            background: "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(59,130,246,0.22))",
            boxShadow: "0 18px 36px rgba(36,116,255,0.10)",
          }}
        >
          <img
            src={task.image}
            alt={task.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(15,23,42,0.02) 22%, rgba(15,23,42,0.16) 58%, rgba(15,23,42,0.42) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 14,
              right: 14,
              top: 14,
              display: "flex",
              alignItems: "center",
              gap: 10,
              minWidth: 0,
              padding: "8px 10px",
              borderRadius: 18,
              background: "rgba(255,255,255,0.58)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 6px 14px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.52)",
            }}
          >
            {task.status === "已结束" ? (
              <span style={detailEndedStatusStyle}>已结束</span>
            ) : (
              <Pill tone={task.status === "进行中" ? "green" : "orange"}>{task.status}</Pill>
            )}
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: 16,
                  fontWeight: 900,
                  color: "#0f172a",
                  lineHeight: 1.12,
                  letterSpacing: "-0.02em",
                }}
              >
                {task.name}
              </div>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 14,
              right: 14,
              bottom: 14,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                flexShrink: 0,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 10px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(14px)",
                color: "rgba(255,255,255,0.96)",
                fontSize: 11,
                fontWeight: 700,
                whiteSpace: "nowrap",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22)",
              }}
            >
              <CalendarDays size={12} />
              {formatTaskRange(task.startDate, task.endDate)}
            </div>
          </div>
        </div>

        <Card style={{ padding: 12 }}>
          <SectionTitle title="参与规则" />
          <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.8 }}>
            在 {`{平台}`} 发布符合要求的内容，需包含以下指定的话题标签和关键词，每人最多提交 {`{上限}`} 条，内容审核通过后，将在活动结束{`{上限}`}天后自动发放奖励。
          </div>
        </Card>

        <Card style={{ padding: 12 }}>
          <SectionTitle title="内容要求" />
          <div style={{ display: "grid", gap: 5 }}>
            <InfoRow
              icon={BadgeCheck}
              label="发布平台"
              value={
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <PlatformBadge platform={task.platform[0] ?? "小红书"} size={13} />
                </div>
              }
            />
            <InfoRow icon={Hash} label="必带话题" value={task.hashtags.join("、")} />
            <InfoRow icon={Target} label="关键词" value={task.keywords.join("、")} />
            <InfoRow icon={Globe} label="内容类型" value={task.contentType} />
          </div>
        </Card>

        <Card style={{ padding: 12 }}>
          <SectionTitle title="奖励说明" />
          <div style={{ display: "grid", gap: 10 }}>
            {task.rewardSpecs.filter((spec) => spec.kind !== "ranking").map((spec) => (
              <RewardSpecCard key={spec.id} spec={spec} />
            ))}
          </div>
        </Card>

        <div
          ref={taskStepsRef}
          style={{
            scrollMarginTop: 92,
          }}
        >
          <Card style={{ padding: 12 }}>
            <SectionTitle title="参与步骤" />
            <div style={{ display: "grid", gap: 10 }}>
              {helpSteps.map((step) => (
                <div
                  key={step}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 10px",
                    borderRadius: 16,
                    background: "rgba(241,245,249,0.85)",
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 999,
                      background: "rgba(36,116,255,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#2474ff",
                      fontSize: 12,
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </div>
                  <div style={{ fontSize: 14, color: "#0f172a", fontWeight: 600 }}>{step}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card style={{ padding: 12 }}>
          <SectionTitle title="FAQ" />
          <div style={{ display: "grid", gap: 10 }}>
            {faqs.map(([q, a]) => (
              <div key={q} style={{ padding: 12, borderRadius: 16, background: "rgba(247,250,255,0.95)" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{q}</div>
                <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.7, color: "#64748b" }}>{a}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <button
        type="button"
        onClick={scrollToTaskIntro}
        style={{
          position: "fixed",
          right: "max(0px, calc((100vw - 500px) / 2))",
          top: "clamp(128px, 23vh, 186px)",
          width: 26,
          height: 72,
          border: "1px solid rgba(226,232,240,0.96)",
          borderRight: "none",
          borderRadius: "12px 0 0 12px",
          background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))",
          color: "#475569",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          boxShadow: "0 8px 16px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.92)",
          cursor: "pointer",
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          letterSpacing: "0",
          lineHeight: 1.05,
          fontSize: 11,
          fontWeight: 700,
          zIndex: 28,
        }}
        aria-label="任务说明"
        title="任务说明"
      >
        任务说明
      </button>

      {task.status !== "未开始" && (
        <div style={floatingDockStyle}>
          <div style={floatingDockInnerStyle}>
            <button onClick={() => navigate("/submissions")} style={floatingButtonStyle}>
              <span style={floatingIconWrapStyle}>
                <History size={14} />
              </span>
              <span style={floatingTextStyle}>我的任务</span>
            </button>
          </div>
        </div>
      )}

      {task.status === "进行中" && (
        <div style={detailSubmitDockStyle}>
          <div style={detailSubmitInnerStyle}>
            <button onClick={() => navigate(`/submit?taskId=${task.id}`)} style={detailSubmitButtonStyle}>
              去提交内容
            </button>
          </div>
        </div>
      )}

      {task.status === "未开始" && (
        <div style={detailSubscribeDockStyle}>
          <div style={detailSubscribeInnerStyle}>
            <div style={{ display: "grid", gap: 8, width: "100%" }}>
              <div style={detailSubscribeHintStyle}>任务未开始，订阅后任务开启会通知你来参与。</div>
              <button
                onClick={handleSubscribeStartReminder}
                style={detailSubscribeButtonStyle(startReminderSubscribed)}
              >
                {startReminderSubscribed ? "已订阅开始提醒" : "订阅开始提醒"}
              </button>
            </div>
          </div>
        </div>
      )}

      {task.status === "已结束" && (
        <div style={detailSubmitDockStyle}>
          <div style={detailSubmitInnerStyle}>
            <button onClick={() => setShowRankingSheet(true)} style={detailSubmitButtonStyle}>
              查看名次
            </button>
          </div>
        </div>
      )}

      {showRankingSheet && (
        <div style={rankingBackdropStyle} onClick={() => setShowRankingSheet(false)}>
          <div style={rankingSheetStyle} onClick={(e) => e.stopPropagation()}>
            <div style={rankingSheetHeaderStyle}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>参与人排名</div>
                <div style={{ marginTop: 4, fontSize: 12, color: "#64748b" }}>按互动量展示当前任务的参与人排名</div>
              </div>
              <button onClick={() => setShowRankingSheet(false)} style={rankingCloseButtonStyle}>关闭</button>
            </div>
            <div style={{ display: "grid", gap: 8, maxHeight: "52vh", overflowY: "auto", paddingRight: 2 }}>
              {rankingEntries.length === 0 ? (
                <div style={rankingEmptyStyle}>暂无可展示的排行榜数据</div>
              ) : (
                rankingEntries.map((item, index) => (
                  <div key={item.id} style={rankingRowStyle}>
                    <div style={rankingRankStyle(index)}>{index + 1}</div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.accountHandle}
                      </div>
                    </div>
                    <div style={rankingScoreStyle}>
                      {item.interactionScore}
                      <span style={{ marginLeft: 4, fontSize: 11, fontWeight: 600 }}>互动量</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "7px 10px", borderRadius: 14, background: "rgba(247,250,255,0.9)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
        <div style={{ width: 26, height: 26, borderRadius: 9, background: "rgba(36,116,255,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={13} color="#2474ff" />
        </div>
        <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, lineHeight: 1.15 }}>{label}</div>
      </div>
      <div style={{ fontSize: 12, color: "#0f172a", fontWeight: 700, textAlign: "right", lineHeight: 1.25, maxWidth: "56%", overflowWrap: "anywhere" }}>{value}</div>
    </div>
  );
}

function RewardSpecCard({ spec }: { spec: TaskRewardSpec }) {
  const rewardTone = (rewardType: "points" | "gift" | "cash") =>
    rewardType === "gift" ? "orange" : rewardType === "cash" ? "red" : "blue";

  const rewardValue = (rewardType: "points" | "gift" | "cash", amount: number, giftName?: string) => {
    if (rewardType === "gift") return giftName ? `赠品：${GIFT_LABELS[giftName] ?? giftName}` : "赠品";
    if (rewardType === "cash") return `${amount} 元红包`;
    return `${amount} 星云币`;
  };

  const renderRewardBadge = (rewardType: "points" | "gift" | "cash", amount: number, giftName?: string) => {
    if (rewardType !== "gift") {
      return <Pill tone={rewardTone(rewardType)}>{rewardValue(rewardType, amount, giftName)}</Pill>;
    }

    const giftLabel = giftName ? GIFT_LABELS[giftName] ?? giftName : "赠品";
    const giftImage = giftName ? GIFT_IMAGES[giftName] : undefined;

    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "4px 10px 4px 4px",
          borderRadius: 999,
          background: "rgba(250,173,20,0.12)",
          color: "#f59e0b",
          fontSize: 12,
          fontWeight: 700,
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: 999,
            overflow: "hidden",
            background: "rgba(255,255,255,0.94)",
            border: "1px solid rgba(245,158,11,0.18)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 4px 10px rgba(15,23,42,0.06)",
          }}
        >
          {giftImage ? (
            <img
              src={giftImage}
              alt={giftLabel}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            "🎁"
          )}
        </span>
        <span>{giftLabel}</span>
      </span>
    );
  };

  const metricLabelMap = {
    likes: "点赞数",
    comments: "评论数",
    collections: "收藏数",
    combined: "综合互动",
  } as const;

  return (
    <div
      style={{
        padding: 12,
        borderRadius: 18,
        background: "rgba(247,250,255,0.96)",
        border: "1px solid rgba(226,232,240,0.75)",
        display: "grid",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{spec.title}</div>
          <div style={{ marginTop: 4, fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
            {spec.kind === "base" && (spec.note ?? "达到活动要求后获得投稿奖励。")}
            {spec.kind === "ranking" && (spec.note ?? `按 ${metricLabelMap[spec.metric]} 排名发放。`)}
            {spec.kind === "fixed" && (spec.note ?? `按 ${metricLabelMap[spec.metric]} 阈值触发奖励。`)}
          </div>
        </div>
      </div>

      {spec.kind === "base" && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "8px 10px", borderRadius: 14, background: "rgba(255,255,255,0.92)" }}>
          <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>奖励内容</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {renderRewardBadge(spec.rewardType, spec.amount, spec.giftName)}
            {!!spec.lotteryChances && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: "rgba(250,173,20,0.14)",
                  color: "#b45309",
                  fontSize: 12,
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                抽奖机会 {spec.lotteryChances} 次
              </span>
            )}
          </div>
        </div>
      )}

      {spec.kind === "ranking" && (
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>按 {metricLabelMap[spec.metric]} 排名计算</div>
          <div style={{ display: "grid", gap: 8 }}>
            {spec.tiers.map((tier) => (
              <div
                key={`${tier.rankStart}-${tier.rankEnd}-${tier.rewardType}-${tier.amount}-${tier.giftName ?? ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  padding: "8px 10px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.92)",
                }}
              >
                <div style={{ fontSize: 12, color: "#0f172a", fontWeight: 700 }}>
                  第 {tier.rankStart}{tier.rankEnd > tier.rankStart ? ` - ${tier.rankEnd}` : ""} 名
                </div>
                {renderRewardBadge(tier.rewardType, tier.amount, tier.giftName)}
              </div>
            ))}
          </div>
        </div>
      )}

      {spec.kind === "fixed" && (
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>触发指标：{metricLabelMap[spec.metric]}</div>
          <div style={{ display: "grid", gap: 8 }}>
            {spec.rules.map((rule, index) => (
              <div
                key={`${spec.id}-${index}-${rule.threshold}-${rule.rewardType}-${rule.amount}-${rule.giftName ?? ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  padding: "8px 10px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.92)",
                }}
              >
                <div style={{ fontSize: 12, color: "#0f172a", fontWeight: 700 }}>
                  达到 {rule.threshold} {metricLabelMap[spec.metric]}
                </div>
                {renderRewardBadge(rule.rewardType, rule.amount, rule.giftName)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const primaryButtonStyle: React.CSSProperties = {
  height: 46,
  border: "none",
  borderRadius: 16,
  background: "#2474ff",
  color: "#fff",
  fontSize: 14,
  fontWeight: 800,
  cursor: "pointer",
};

const taskHeroStyle: React.CSSProperties = {
  position: "relative",
  display: "grid",
  gridTemplateColumns: "1fr 126px",
  gap: 8,
  alignItems: "center",
  minHeight: 112,
  padding: "2px 2px 0",
};

const taskHeroCopyStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
  alignSelf: "start",
  paddingTop: 4,
};

const taskHeroTitleStyle: React.CSSProperties = {
  fontSize: "clamp(24px, 6.4vw, 34px)",
  lineHeight: 1.02,
  fontWeight: 900,
  letterSpacing: "-0.045em",
  color: "#0f1d39",
};

const taskHeroSubtitleStyle: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.5,
  fontWeight: 600,
  color: "#70809b",
};

const taskHeroVisualStyle: React.CSSProperties = {
  position: "relative",
  width: 126,
  height: 112,
  justifySelf: "end",
};

const taskHeroHaloStyle: React.CSSProperties = {
  position: "absolute",
  right: -10,
  bottom: -16,
  width: 130,
  height: 84,
  borderRadius: "999px 999px 0 0",
  background: "radial-gradient(circle at top, rgba(225,233,247,0.95), rgba(225,233,247,0.24) 68%, transparent 72%)",
};

const taskHeroClipboardStyle: React.CSSProperties = {
  position: "absolute",
  right: 14,
  top: 6,
  width: 78,
  height: 96,
  borderRadius: 18,
  background: "linear-gradient(180deg, #ffffff 0%, #f5f9ff 100%)",
  border: "1px solid rgba(214,225,243,0.95)",
  boxShadow: "0 20px 36px rgba(79, 127, 230, 0.22)",
  transform: "rotate(10deg)",
};

const taskHeroClipStyle: React.CSSProperties = {
  position: "absolute",
  top: -6,
  left: "50%",
  transform: "translateX(-50%)",
  width: 34,
  height: 14,
  borderRadius: 999,
  background: "linear-gradient(180deg, #5f92ff 0%, #3f76f5 100%)",
  boxShadow: "0 8px 16px rgba(63, 118, 245, 0.28)",
};

const taskHeroCheckStyle = (index: number): React.CSSProperties => ({
  position: "absolute",
  left: 14,
  top: 22 + index * 21,
  width: 12,
  height: 12,
  borderRadius: 999,
  background: "rgba(79, 142, 255, 0.18)",
  boxShadow: "inset 0 0 0 1px rgba(79, 142, 255, 0.14)",
});

const taskHeroLineStyle = (index: number): React.CSSProperties => ({
  position: "absolute",
  left: 32,
  top: 24 + index * 21,
  width: 28,
  height: 7,
  borderRadius: 999,
  background: "rgba(84, 114, 170, 0.18)",
});

const taskHeroBellStyle: React.CSSProperties = {
  position: "absolute",
  right: 0,
  bottom: 14,
  width: 28,
  height: 34,
  borderRadius: "18px 18px 12px 12px",
  background: "linear-gradient(180deg, #ffd36f 0%, #ffb62f 100%)",
  boxShadow: "0 12px 18px rgba(255, 182, 47, 0.28)",
  transform: "rotate(8deg)",
};

const taskHeroSparkStyle = ({
  top,
  right,
  scale = 1,
}: {
  top: number;
  right: number;
  scale?: number;
}): React.CSSProperties => ({
  position: "absolute",
  top,
  right,
  width: 10 * scale,
  height: 10 * scale,
  background: "linear-gradient(180deg, #ffcf66 0%, #ffb347 100%)",
  clipPath: "polygon(50% 0%, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0% 50%, 39% 39%)",
  opacity: 0.85,
});

const taskFilterShellStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: 8,
  padding: 9,
  borderRadius: 24,
  background: "rgba(255,255,255,0.92)",
  border: "1px solid rgba(232,239,249,0.98)",
  boxShadow: "0 16px 40px rgba(112, 135, 176, 0.10)",
};

const taskFilterButtonStyle = (active: boolean, label: keyof typeof TASK_STATUS_META): React.CSSProperties => {
  const meta = TASK_STATUS_META[label];
  return {
    height: 50,
    borderRadius: 16,
    border: active ? `1.5px solid ${meta.border}` : "1px solid transparent",
    background: active ? "rgba(244,251,245,0.98)" : "rgba(245,248,253,0.92)",
    boxShadow: active ? "0 8px 22px rgba(34,197,94,0.10)" : "none",
    color: active ? meta.text : "#4b5f7d",
    fontSize: 15,
    fontWeight: 800,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    cursor: "pointer",
  };
};

const taskEmptyStyle: React.CSSProperties = {
  padding: "20px 16px",
  borderRadius: 22,
  background: "rgba(255,255,255,0.9)",
  border: "1px solid rgba(232,239,249,0.98)",
  textAlign: "center",
  boxShadow: "0 16px 40px rgba(112, 135, 176, 0.10)",
};

const taskListCardStyle: React.CSSProperties = {
  width: "100%",
  padding: 14,
  border: "1px solid rgba(235,241,250,0.96)",
  borderRadius: 24,
  background: "rgba(255,255,255,0.95)",
  boxShadow: "0 16px 40px rgba(112, 135, 176, 0.10)",
  cursor: "pointer",
  textAlign: "left",
  transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
};

const taskListCardInnerStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "116px minmax(0, 1fr)",
  gap: 12,
  alignItems: "stretch",
};

const taskListImageWrapStyle: React.CSSProperties = {
  borderRadius: 18,
  overflow: "hidden",
  width: "100%",
  height: 94,
  background: "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(59,130,246,0.22))",
  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.16)",
};

const taskListImageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

const taskListContentStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  minWidth: 0,
  gap: 8,
};

const taskListTopRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 12,
};

const taskListTitleWrapStyle: React.CSSProperties = {
  minWidth: 0,
  display: "grid",
  gap: 8,
};

const taskStatusChipStyle = (status: "进行中" | "未开始" | "已结束"): React.CSSProperties => {
  const meta =
    status === "进行中"
      ? TASK_STATUS_META["进行中"]
      : status === "未开始"
        ? TASK_STATUS_META["未开始"]
        : TASK_STATUS_META["已结束"];

  return {
    width: "fit-content",
    padding: "4px 10px",
    borderRadius: 999,
    background: meta.soft,
    color: meta.text,
    fontSize: 12,
    fontWeight: 800,
    lineHeight: 1,
  };
};

const taskListTitleStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 900,
  lineHeight: 1.25,
  color: "#0f1d39",
  letterSpacing: "-0.03em",
  overflow: "hidden",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
};

const taskListArrowBubbleStyle: React.CSSProperties = {
  width: 34,
  height: 34,
  flexShrink: 0,
  borderRadius: 999,
  background: "rgba(245,248,253,0.95)",
  border: "1px solid rgba(231,237,247,0.96)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const taskListDatePillStyle: React.CSSProperties = {
  width: "fit-content",
  maxWidth: "100%",
  padding: "7px 10px",
  borderRadius: 999,
  background: "rgba(244,247,252,0.98)",
  color: "#7a88a3",
  fontSize: 11,
  fontWeight: 700,
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  flexWrap: "wrap",
};

const taskListMetaRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  color: "#74839f",
  fontSize: 12,
  fontWeight: 700,
};

const taskListMetaItemStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  minWidth: 0,
};

const taskListFloatingDockStyle: React.CSSProperties = {
  position: "fixed",
  left: "50%",
  transform: "translateX(-50%)",
  width: "min(calc(100vw - 20px), 500px)",
  bottom: 80,
  zIndex: 26,
  pointerEvents: "none",
};

const taskListFloatingDockInnerStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  justifyContent: "flex-end",
  padding: "0 18px",
  pointerEvents: "auto",
};

const taskListFloatingButtonStyle: React.CSSProperties = {
  height: 46,
  border: "none",
  borderRadius: 999,
  padding: "0 16px 0 10px",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  color: "#fff",
  background: "linear-gradient(180deg, #4b89ff 0%, #2f6ef3 100%)",
  boxShadow: "0 18px 34px rgba(47,110,243,0.30)",
  fontSize: 14,
  fontWeight: 900,
  cursor: "pointer",
  letterSpacing: "-0.02em",
};

const taskListFloatingIconWrapStyle: React.CSSProperties = {
  width: 26,
  height: 26,
  borderRadius: 999,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(255,255,255,0.16)",
  color: "#fff",
  flexShrink: 0,
};

const taskListFloatingTextStyle: React.CSSProperties = {
  whiteSpace: "nowrap",
};

const floatingButtonStyle: React.CSSProperties = {
  height: 38,
  border: "1px solid rgba(255,255,255,0.55)",
  borderRadius: 999,
  padding: "0 10px 0 6px",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  color: "#fff",
  background: "linear-gradient(135deg, rgba(37,99,235,0.96), rgba(59,130,246,0.92))",
  boxShadow: "0 14px 30px rgba(37,99,235,0.32), inset 0 1px 0 rgba(255,255,255,0.28)",
  backdropFilter: "blur(8px)",
  fontSize: 11,
  fontWeight: 800,
  cursor: "pointer",
  zIndex: 26,
};

const floatingDockStyle: React.CSSProperties = {
  position: "fixed",
  left: "50%",
  transform: "translateX(-50%)",
  width: "min(calc(100vw - 20px), 500px)",
  bottom: 86,
  zIndex: 26,
  pointerEvents: "none",
};

const floatingDockInnerStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  justifyContent: "flex-end",
  padding: "0 18px",
  pointerEvents: "auto",
};

const floatingIconWrapStyle: React.CSSProperties = {
  width: 24,
  height: 24,
  borderRadius: 999,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(255,255,255,0.18)",
  color: "#fff",
  flexShrink: 0,
};

const floatingTextStyle: React.CSSProperties = {
  whiteSpace: "nowrap",
  letterSpacing: "0.1px",
};

const detailSubmitDockStyle: React.CSSProperties = {
  position: "fixed",
  left: "50%",
  transform: "translateX(-50%)",
  width: "min(calc(100vw - 20px), 500px)",
  bottom: 0,
  zIndex: 24,
  padding: "0 10px 10px",
  background: "linear-gradient(180deg, rgba(247,250,255,0), rgba(247,250,255,0.92) 36%, rgba(247,250,255,0.98) 100%)",
  pointerEvents: "none",
};

const detailSubmitInnerStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  pointerEvents: "auto",
};

const detailSubmitButtonStyle: React.CSSProperties = {
  width: "min(440px, calc(100% - 20px))",
  height: 42,
  border: "none",
  borderRadius: 999,
  background: "#2474ff",
  color: "#fff",
  fontSize: 15,
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 10px 22px rgba(36,116,255,0.30)",
};

const detailSubscribeDockStyle: React.CSSProperties = {
  position: "fixed",
  left: "50%",
  transform: "translateX(-50%)",
  width: "min(calc(100vw - 20px), 500px)",
  bottom: 0,
  zIndex: 24,
  padding: "0 10px 10px",
  background: "linear-gradient(180deg, rgba(247,250,255,0), rgba(247,250,255,0.92) 36%, rgba(247,250,255,0.98) 100%)",
  pointerEvents: "none",
};

const detailSubscribeInnerStyle: React.CSSProperties = {
  width: "100%",
  pointerEvents: "auto",
};

const detailSubscribeHintStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 14,
  background: "rgba(36,116,255,0.08)",
  color: "#2453a6",
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1.5,
  textAlign: "center",
};

const detailSubscribeButtonStyle = (active: boolean): React.CSSProperties => ({
  height: 42,
  border: "none",
  borderRadius: 999,
  background: active ? "rgba(36,116,255,0.12)" : "#2474ff",
  color: active ? "#2474ff" : "#fff",
  fontSize: 14,
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: active ? "none" : "0 10px 22px rgba(36,116,255,0.30)",
});

const rankingBackdropStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,0.38)",
  zIndex: 40,
  display: "flex",
  alignItems: "flex-end",
};

const rankingSheetStyle: React.CSSProperties = {
  width: "calc(100% - 20px)",
  maxWidth: 500,
  margin: "0 auto",
  background: "#fff",
  borderRadius: "24px 24px 0 0",
  padding: "16px 14px 18px",
  boxShadow: "0 -18px 40px rgba(15,23,42,0.18)",
};

const rankingSheetHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 12,
  marginBottom: 12,
};

const rankingCloseButtonStyle: React.CSSProperties = {
  height: 34,
  padding: "0 12px",
  border: "none",
  borderRadius: 999,
  background: "rgba(241,245,249,0.95)",
  color: "#475569",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
  flexShrink: 0,
};

const rankingEmptyStyle: React.CSSProperties = {
  padding: "20px 12px",
  borderRadius: 16,
  background: "rgba(247,250,255,0.95)",
  color: "#64748b",
  fontSize: 13,
  textAlign: "center",
};

const rankingRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: 12,
  borderRadius: 16,
  background: "rgba(247,250,255,0.96)",
};

const rankingRankStyle = (index: number): React.CSSProperties => ({
  width: 30,
  height: 30,
  borderRadius: 999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    index === 0 ? "linear-gradient(135deg, #f59e0b, #facc15)" : index === 1 ? "linear-gradient(135deg, #94a3b8, #cbd5e1)" : index === 2 ? "linear-gradient(135deg, #f97316, #fb7185)" : "rgba(36,116,255,0.10)",
  color: index < 3 ? "#fff" : "#2474ff",
  fontSize: 12,
  fontWeight: 800,
  flexShrink: 0,
});

const rankingScoreStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "baseline",
  padding: "6px 10px",
  borderRadius: 999,
  background: "rgba(36,116,255,0.10)",
  color: "#2474ff",
  fontSize: 18,
  fontWeight: 900,
  flexShrink: 0,
};

const detailEndedStatusStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "4px 10px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.92)",
  border: "1px solid rgba(148,163,184,0.22)",
  color: "#334155",
  fontSize: 12,
  fontWeight: 600,
  whiteSpace: "nowrap",
  boxShadow: "0 4px 10px rgba(15,23,42,0.06)",
};
