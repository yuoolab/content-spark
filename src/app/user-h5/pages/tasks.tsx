import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Copy,
  Clock3,
  FileText,
  Gift,
  Globe,
  Grid2x2,
  Hash,
  History,
  Image as ImageIcon,
  Link2,
  MessageCircle,
  PlayCircle,
  Send,
  Star,
  Target,
  ThumbsUp,
  Trophy,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { useUserH5 } from "../state";
import type { Platform, Task, TaskRewardSpec } from "../state";
import { Card, Container, Pill, fmtNumber } from "../shared";
import { PlatformLogo } from "../../components/platform/PlatformBadge";

type DetailScene = NonNullable<Task["scene"]>;
type FollowProofStatus = "待完成" | "已完成" | "审核中" | "已拒绝";
type FollowProofState = { status: FollowProofStatus; rejectReason?: string; proofUrl?: string };
type RewardPreviewKind = "points" | "gift" | "cash";
type EngagementSubmitPreviewState = "pending" | "reviewing" | "rejected" | "approved";
type ActivityStatusPreviewState = "未开始" | "进行中" | "已结束";

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
  未开始: { icon: Clock3, accent: "#f59e0b", soft: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.18)", text: "#f59e0b" },
  进行中: { icon: PlayCircle, accent: "#22c55e", soft: "rgba(34,197,94,0.10)", border: "rgba(34,197,94,0.18)", text: "#16a34a" },
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

const colorAlpha = (hex: string, alpha: number) => {
  const value = hex.replace("#", "");
  const normalized = value.length === 3 ? value.split("").map((item) => `${item}${item}`).join("") : value;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

function DetailCardTitle({ title, extra }: { title: string; extra?: ReactNode }) {
  return (
    <div style={detailCardTitleRowStyle}>
      <div style={detailCardTitleMainStyle}>
        <span style={detailCardTitleAccentStyle} />
        <span>{title}</span>
      </div>
      {extra}
    </div>
  );
}

export function TaskListPage() {
  const { tasks } = useUserH5();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"全部" | "未开始" | "进行中" | "已结束">("全部");
  const filters: Array<"全部" | "进行中" | "未开始" | "已结束"> = ["全部", "未开始", "进行中", "已结束"];

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
                <Icon size={18} color={active ? meta.accent : "#64748b"} strokeWidth={2} />
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

                    <div style={taskListMetaRowStyle} />
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

    </Container>
  );
}

export function TaskDetailPage() {
  const { id = "" } = useParams();
  const [searchParams] = useSearchParams();
  const { tasks, submissions, accounts, submitContent, subscribeTaskStartReminder } = useUserH5();
  const navigate = useNavigate();
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

  const handleSubscribeStartReminder = () => {
    const res = subscribeTaskStartReminder(task.id);
    if (res.ok) setStartReminderSubscribed(true);
  };
  const previewRewardParam = searchParams.get("reward");
  const previewRewardKind: RewardPreviewKind =
    previewRewardParam === "gift" || previewRewardParam === "cash" ? previewRewardParam : "points";
  const previewSubmitStateParam = searchParams.get("submitState");
  const previewSubmitState: EngagementSubmitPreviewState =
    previewSubmitStateParam === "reviewing" ||
    previewSubmitStateParam === "rejected" ||
    previewSubmitStateParam === "approved"
      ? previewSubmitStateParam
      : "pending";
  const previewActivityStatusParam = searchParams.get("activityStatus");
  const previewActivityStatus: ActivityStatusPreviewState =
    previewActivityStatusParam === "upcoming"
      ? "未开始"
      : previewActivityStatusParam === "finished"
      ? "已结束"
      : "进行中";

  return (
    <SceneTaskDetail
      task={task}
      scene={task.scene ?? "seeding"}
      rankingEntries={rankingEntries}
      previewRewardKind={previewRewardKind}
      previewSubmitState={previewSubmitState}
      previewActivityStatus={previewActivityStatus}
      accounts={accounts}
      submitContent={submitContent}
      startReminderSubscribed={startReminderSubscribed}
      onSubscribeStartReminder={handleSubscribeStartReminder}
    />
  );
}

function SceneTaskDetail({
  task,
  scene,
  rankingEntries,
  previewRewardKind,
  previewSubmitState,
  previewActivityStatus,
  accounts,
  submitContent,
  startReminderSubscribed,
  onSubscribeStartReminder,
}: {
  task: Task;
  scene: DetailScene;
  rankingEntries: Array<{
    id: string;
    accountHandle: string;
    title: string;
    platform: string;
    interactionScore: number;
  }>;
  previewRewardKind: RewardPreviewKind;
  previewSubmitState: EngagementSubmitPreviewState;
  previewActivityStatus: ActivityStatusPreviewState;
  accounts: Array<{ platform: Platform; accountHandle: string }>;
  submitContent: (payload: {
    taskId: string;
    platform: Platform;
    title: string;
    contentUrl: string;
    contentPreview: string;
    publishTime: string;
    accountHandle: string;
  }) => { ok: boolean; message: string };
  startReminderSubscribed: boolean;
  onSubscribeStartReminder: () => void;
}) {
  const navigate = useNavigate();
  const [copiedAccount, setCopiedAccount] = useState("");
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);
  const [showRankingSheet, setShowRankingSheet] = useState(false);
  const [followProofStates, setFollowProofStates] = useState<Record<number, FollowProofState>>({
    0: { status: "待完成" },
    1: { status: "已完成" },
    2: { status: "审核中" },
    3: { status: "已拒绝", rejectReason: "截图未包含主页名称与已关注状态，请按示例图重新上传。" },
  });
  const [followUploadSheet, setFollowUploadSheet] = useState<{ index: number; fileUrl: string } | null>(null);
  const [engagementUploadSheet, setEngagementUploadSheet] = useState<{ fileUrls: string[] } | null>(null);
  const [seedingSubmitSheet, setSeedingSubmitSheet] = useState<{ contentUrl: string; contentPreview: string } | null>(null);
  const meta = getDetailSceneMeta(scene);
  const targets = task.followTargets ?? [];
  const actions = task.engagementActions ?? [];
  const hasComment = actions.includes("评论");
  const baseReward = task.rewardSpecs.find((spec) => spec.kind === "base");
  const performanceSpecs = task.rewardSpecs.filter((spec) => spec.kind !== "base");
  const detailHighlights = getDetailHighlights(task, scene);
  const sceneRules = getSceneRules(task, scene);
  const sceneSteps = getSceneSteps(scene);
  const hasLeaderboard = scene === "engagement_reward" && rankingEntries.length > 0;
  const submitButtonText = scene === "follow" || scene === "engagement" ? "去提交凭证" : "去提交内容";
  const displayStatus = scene === "follow" || scene === "engagement" ? previewActivityStatus : task.status;
  const isTaskUpcoming = displayStatus === "未开始";
  const useInlineSeedingSubmit = scene === "seeding" && task.name === "春季新品种草计划";
  const engagementSubmitMeta =
    previewSubmitState === "reviewing"
      ? { label: "审核中", disabled: true, tone: "rgba(59,130,246,0.9)", showArrow: false }
      : previewSubmitState === "rejected"
      ? { label: "重新提交凭证", disabled: false, tone: "#ef4444", showArrow: false }
      : previewSubmitState === "approved"
      ? { label: "已通过，查看奖励", disabled: false, tone: "#22c55e", showArrow: true }
      : { label: submitButtonText, disabled: false, tone: meta.accent, showArrow: false };

  const shortLink = (value: string) => {
    try {
      const { hostname, pathname } = new URL(value);
      const text = `${hostname}${pathname}`;
      return text.length > 26 ? `${text.slice(0, 26)}...` : text;
    } catch {
      return value.length > 26 ? `${value.slice(0, 26)}...` : value;
    }
  };

  const handleCopyText = async (value: string, activeKey?: string) => {
    try {
      await navigator.clipboard.writeText(value);
      if (activeKey) {
        setCopiedAccount(activeKey);
        window.setTimeout(() => {
          setCopiedAccount((current) => (current === activeKey ? "" : current));
        }, 1600);
      }
      toast.success("复制成功");
    } catch {
      if (activeKey) setCopiedAccount("");
      toast.error("复制失败，请稍后重试");
    }
  };

  const handleSubmitSingleFollowProof = (index: number) => {
    const target = targets[index];
    if (!target) return;
    if (!followUploadSheet?.fileUrl || followUploadSheet.index !== index) {
      toast.error("请先上传该账号的关注截图");
      return;
    }
    const result = submitContent({
      taskId: task.id,
      platform: target.platform,
      title: `${task.name}｜${target.account} 关注凭证`,
      contentUrl: `https://proof.local/follow/${task.id}/${index + 1}/${Date.now()}`,
      contentPreview: task.proofDescription || "已按要求关注指定账号并提交截图凭证。",
      publishTime: new Date().toLocaleString("zh-CN", { hour12: false }),
      accountHandle: "系统提交",
    });
    if (result.ok) {
      setFollowProofStates((prev) => ({
        ...prev,
        [index]: { status: "审核中", proofUrl: followUploadSheet.fileUrl },
      }));
      setFollowUploadSheet(null);
      toast.success("截图已提交，等待审核");
      return;
    }
    toast.error(result.message);
  };

  const openFollowUploadSheet = (index: number) => setFollowUploadSheet({ index, fileUrl: "" });
  const closeFollowUploadSheet = () => setFollowUploadSheet(null);
  const activeFollowState = followUploadSheet ? followProofStates[followUploadSheet.index] : undefined;
  const openEngagementUploadSheet = () => setEngagementUploadSheet({ fileUrls: [] });
  const closeEngagementUploadSheet = () => setEngagementUploadSheet(null);
  const openSeedingSubmitSheet = () =>
    setSeedingSubmitSheet({
      contentUrl: "https://www.xiaohongshu.com/explore/demo-submit",
      contentPreview: task.description || "",
    });
  const closeSeedingSubmitSheet = () => setSeedingSubmitSheet(null);

  const handleSubmitEngagementProof = () => {
    if (scene !== "engagement") return;
    if (!engagementUploadSheet?.fileUrls?.length) {
      toast.error("请先上传互动截图");
      return;
    }
    const result = submitContent({
      taskId: task.id,
      platform: task.engagementPlatform ?? task.platform[0] ?? "小红书",
      title: `${task.name}｜互动凭证`,
      contentUrl: `https://proof.local/engagement/${task.id}/${Date.now()}`,
      contentPreview: `${task.engagementProofDescription || "已按要求完成互动动作并提交截图凭证。"}（共 ${engagementUploadSheet.fileUrls.length} 张截图）`,
      publishTime: new Date().toLocaleString("zh-CN", { hour12: false }),
      accountHandle: "系统提交",
    });
    if (result.ok) {
      setEngagementUploadSheet(null);
      toast.success("截图已提交，等待审核");
      return;
    }
    toast.error(result.message);
  };

  const handleSubmitSeedingContent = () => {
    if (scene !== "seeding" || !seedingSubmitSheet) return;
    if (!seedingSubmitSheet.contentUrl.trim()) {
      toast.error("请填写内容链接");
      return;
    }
    if (!seedingSubmitSheet.contentPreview.trim()) {
      toast.error("请填写内容摘要");
      return;
    }
    const result = submitContent({
      taskId: task.id,
      platform: task.platform[0] ?? "小红书",
      title: `${task.name}｜内容提交`,
      contentUrl: seedingSubmitSheet.contentUrl.trim(),
      contentPreview: seedingSubmitSheet.contentPreview.trim(),
      publishTime: new Date().toLocaleString("zh-CN", { hour12: false }),
      accountHandle: "系统提交",
    });
    if (result.ok) {
      setSeedingSubmitSheet(null);
      toast.success("内容已提交，等待审核");
      return;
    }
    toast.error(result.message);
  };

  return (
    <Container>
      <div style={{ position: "relative" }}>
      <div style={{ display: "grid", gap: 12 }}>
        <>
          <section style={followHeroShellStyle}>
            <h1 style={{ ...followHeroTitleStyle, display: "flex", alignItems: "center", gap: 8 }}>
              <Pill tone={displayStatus === "进行中" ? "green" : displayStatus === "未开始" ? "orange" : "gray"}>{displayStatus}</Pill>
              {task.name}
            </h1>
            <div style={followHeroDescStyle}>{meta.description}</div>
            <div style={detailHeroMetaListStyle}>
              <span style={detailHeroMetaPillStyle}>
                <CalendarDays size={13} />
                {formatTaskRange(task.startDate, task.endDate)}
              </span>
            </div>
          </section>

          <Card style={{ padding: 14, borderRadius: 22, border: "1px solid rgba(218,228,242,0.95)" }}>
            <DetailCardTitle title="任务速览" />
            {scene === "follow" ? (
              <div style={followStepListStyle}>
                {[
                  { title: "关注指定平台账号", icon: Target, tone: "rgba(20,184,166,0.14)", iconBg: "linear-gradient(145deg,#34d399,#10b981)" },
                  { title: "上传关注截图", icon: ImageIcon, tone: "rgba(59,130,246,0.14)", iconBg: "linear-gradient(145deg,#60a5fa,#3b82f6)" },
                  { title: "审核通过发放奖励", icon: Gift, tone: "rgba(139,92,246,0.14)", iconBg: "linear-gradient(145deg,#a78bfa,#8b5cf6)" },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} style={followStepPairStyle}>
                      <div style={followStepItemStyle}>
                        <div style={followStepHeadStyle}>
                          <div style={followStepBadgeStyle(item.tone)}>
                            <Icon size={13} color="#334155" />
                            <span>{index + 1}</span>
                          </div>
                        </div>
                        <div style={followStepTitleStyle}>{item.title}</div>
                      </div>
                      {index < 2 && <span style={followStepConnectorStyle} />}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={sceneStepsGridStyle}>
                {sceneSteps.map((step, index) => (
                  <div key={step.title} style={sceneStepStyle}>
                    <div style={sceneStepConnectorStyle(index !== sceneSteps.length - 1)} />
                    <div style={sceneStepBadgeStyle(meta.accent)}>{String(index + 1).padStart(2, "0")}</div>
                    <div style={sceneStepTitleStyle}>{step.title}</div>
                    <div style={sceneStepDescStyle}>{step.desc}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>

        {scene === "follow" && (
          <Card style={followSectionCardStyle}>
            <DetailCardTitle title="关注账号清单" />
            <div style={{ display: "grid", gap: 10 }}>
              {targets.map((target, index) => (
                <div key={`${target.platform}-${target.account}-${index}`} style={followTargetCardStyle}>
                  {(() => {
                    const followState = followProofStates[index]?.status ?? "待完成";
                    const hideUpload = followState === "已完成" || followState === "审核中";
                    const isRejected = followState === "已拒绝";
                    return (
                      <>
                        <div style={followCardHeaderStyle}>
                          <div style={followCardTitleWrapStyle}>
                            <PlatformLogo platform={target.platform} size={16} />
                            <div style={scenePrimaryTextStyle}>{target.account}</div>
                            <button
                              type="button"
                              onClick={() => void handleCopyText(target.account, target.account)}
                              style={followCopyIconButtonStyle(copiedAccount === target.account)}
                              aria-label={`复制${target.account}`}
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                          {!isTaskUpcoming ? <span style={followStatusTagStyle(followState)}>{followState}</span> : null}
                        </div>
                        <div style={followCardFooterStyle}>
                          <div style={detailSecondaryTextStyle}>请复制账号名称在对应平台搜索后关注，详情请看示例图。</div>
                          {!isTaskUpcoming && displayStatus !== "已结束" && !hideUpload && (
                            <button type="button" style={followProofUploadTriggerStyle(isRejected)} onClick={() => openFollowUploadSheet(index)}>
                              {isRejected ? "重新上传" : "上传截图"}
                            </button>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              ))}
            </div>
          </Card>
        )}

        {scene === "engagement" && (
          <Card style={{ padding: 14 }}>
            <DetailCardTitle title="互动要求" />
            <div style={{ display: "grid", gap: 10 }}>
              <InfoRow
                icon={BadgeCheck}
                label="互动平台"
                value={
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <PlatformLogo platform={task.engagementPlatform ?? task.platform[0] ?? "小红书"} size={16} />
                    <span>{task.engagementPlatform ?? task.platform[0] ?? "小红书"}</span>
                  </span>
                }
              />
              <InfoRow
                icon={Link2}
                label="内容链接"
                value={
                  <button
                    type="button"
                    onClick={() => void handleCopyText(task.engagementContentUrl ?? "")}
                    style={linkCopyButtonStyle}
                    aria-label="复制内容链接"
                  >
                    <span>{shortLink(task.engagementContentUrl ?? "以后台配置链接为准")}</span>
                    <Copy size={14} />
                  </button>
                }
              />
              <InfoRow icon={ThumbsUp} label="互动动作" value={actions.join("、")} />
              {hasComment && task.commentKeyword && (
                <InfoRow
                  icon={MessageCircle}
                  label="评论关键词"
                  value={
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <span>{task.commentKeyword}</span>
                      <button
                        type="button"
                        onClick={() => void handleCopyText(task.commentKeyword ?? "", "评论关键词")}
                        style={{ border: "none", background: "transparent", padding: 0, color: "#64748b", cursor: "pointer", display: "inline-flex", alignItems: "center" }}
                        aria-label="复制评论关键词"
                      >
                        <Copy size={14} />
                      </button>
                    </span>
                  }
                />
              )}
              {task.engagementSampleImage && (
                <div
                  style={{ ...sceneImagePreviewStyle, cursor: "pointer" }}
                  onClick={() => setPreviewImage({ src: task.engagementSampleImage ?? "", title: "内容示例图" })}
                >
                  <div style={sceneImagePreviewHeadStyle}>
                    <ImageIcon size={15} color={meta.accent} />
                    <span>内容示例图</span>
                  </div>
                  <img src={task.engagementSampleImage} alt="内容示例图" style={scenePreviewImageStyle} />
                </div>
              )}
            </div>
          </Card>
        )}

        {scene === "seeding" && (
          <Card style={{ padding: 14 }}>
            <DetailCardTitle title="创作要求" />
            <div style={{ display: "grid", gap: 10 }}>
              <InfoRow icon={Globe} label="发布平台" value={task.platform.join(" / ")} />
              <InfoRow icon={FileText} label="创作方向" value={task.contentType} />
              <InfoRow
                icon={Send}
                label={task.seedingRewardMode === "streak" ? "奖励周期" : "奖励次数"}
                value={
                  task.seedingRewardMode === "streak" && task.seedingStreakConfig
                    ? `每日${task.seedingStreakConfig.minPerDay}条，连续${task.seedingStreakConfig.streakDays}天`
                    : `每人最多奖励 ${task.maxPerUser} 次`
                }
              />
              <div style={sceneTagCopyRowStyle}>
                <div style={sceneTagCopyRowHeadStyle}>
                  <div style={sceneTagCopyRowTitleStyle}>
                    <span style={sceneTagIconWrapStyle}><Hash size={14} color="#2474ff" /></span>
                    <span>必带话题</span>
                  </div>
                  <button type="button" style={sceneTagCopyButtonStyle} onClick={() => void handleCopyText(task.hashtags.join("、"))}>
                    <Copy size={13} />
                  </button>
                </div>
                <div style={sceneTagWrapFlowStyle}>
                  {(task.hashtags.length ? task.hashtags : ["无"]).map((tag) => (
                    <span key={tag} style={sceneTagChipStyle}>{tag}</span>
                  ))}
                </div>
              </div>
              <div style={sceneTagCopyRowStyle}>
                <div style={sceneTagCopyRowHeadStyle}>
                  <div style={sceneTagCopyRowTitleStyle}>
                    <span style={sceneTagIconWrapStyle}><Target size={14} color="#2474ff" /></span>
                    <span>必带关键词</span>
                  </div>
                  <button type="button" style={sceneTagCopyButtonStyle} onClick={() => void handleCopyText(task.keywords.join("、"))}>
                    <Copy size={13} />
                  </button>
                </div>
                <div style={sceneTagWrapFlowStyle}>
                  {(task.keywords.length ? task.keywords : ["无"]).map((keyword) => (
                    <span key={keyword} style={sceneTagChipStyle}>{keyword}</span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {scene === "engagement_reward" && (
          <>
            <Card style={{ padding: 14 }}>
              <DetailCardTitle title="内容门槛" />
              <div style={{ display: "grid", gap: 10 }}>
                <InfoRow icon={Globe} label="发布平台" value={task.platform.join(" / ")} />
                <InfoRow icon={FileText} label="创作方向" value={task.contentType} />
                <InfoRow icon={Send} label="投稿上限" value={`每人最多 ${task.maxPerUser} 条`} />
                <InfoRow icon={Hash} label="必带话题" value={task.hashtags.join("、") || "无"} />
                <InfoRow icon={Target} label="内容关键词" value={task.keywords.join("、") || "无"} />
              </div>
            </Card>

            <Card style={{ padding: 14 }}>
              <DetailCardTitle title="效果追踪" />
              <div style={{ display: "grid", gap: 10 }}>
                <div style={detailBriefStyle(meta.soft)}>
                  <div style={detailBriefTitleStyle}>计奖逻辑</div>
                  <div style={detailBriefTextStyle}>
                    发布内容并通过审核后进入效果观察期，互动达标或排名进入奖池后，再按后台配置发放额外奖励。
                  </div>
                </div>
                {hasLeaderboard ? (
                  <div style={{ display: "grid", gap: 8 }}>
                    {rankingEntries.slice(0, 3).map((item, index) => (
                      <div key={item.id} style={detailRankingPreviewRowStyle(meta.soft)}>
                        <div style={rankingRankStyle(index)}>{index + 1}</div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={detailRankingHandleStyle}>{item.accountHandle}</div>
                          <div style={detailRankingTitleStyle}>{item.title}</div>
                        </div>
                        <div style={detailRankingScoreStyle(meta.accent)}>{item.interactionScore}</div>
                      </div>
                    ))}
                    <button type="button" onClick={() => setShowRankingSheet(true)} style={detailSecondaryButtonStyle(meta.accent, meta.soft)}>
                      <Trophy size={15} />
                      查看完整榜单
                    </button>
                  </div>
                ) : (
                  <div style={detailEmptyStateStyle}>当前还没有可展示的效果排名，内容提交后会逐步生成榜单。</div>
                )}
              </div>
            </Card>
          </>
        )}

        <Card style={scene === "follow" ? followSectionCardStyle : { padding: 14 }}>
          {scene === "follow" ? (
            <DetailCardTitle
              title="奖励说明"
              extra={
                !isTaskUpcoming ? (
                  <button type="button" style={followRewardLinkButtonStyle} onClick={() => navigate("/rewards")}>
                    <span>查看奖励</span>
                    <ChevronRight size={14} />
                  </button>
                ) : null
              }
            />
          ) : (
            <DetailCardTitle title={scene === "engagement_reward" ? "奖励与计奖方式" : "奖励说明"} />
          )}
          <div style={{ display: "grid", gap: 10 }}>
            {task.rewardSpecs.map((spec) => (
              <RewardSpecCard key={spec.id} spec={spec} previewRewardKind={previewRewardKind} />
            ))}
            {scene === "engagement_reward" && performanceSpecs.length > 0 && (
              <div style={detailRewardHintStyle(meta.soft)}>
                <TrendingUp size={15} color={meta.accent} />
                <span>额外效果奖励以后台配置的互动阈值或排名结果为准，最终奖励按内容表现结算。</span>
              </div>
            )}
          </div>
        </Card>

        <Card style={{ padding: 14 }}>
          {scene === "follow" ? (
            <DetailCardTitle title="规则说明" />
          ) : (
            <DetailCardTitle title="规则说明" />
          )}
          <ol style={sceneRuleListStyle}>
            {sceneRules.map((item, index) => (
              <li key={item} style={sceneRuleItemStyle}>
                <span style={sceneRuleIndexStyle}>{index + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </Card>

        {scene !== "follow" && scene !== "engagement" && (
          <Card style={{ padding: 14 }}>
            <DetailCardTitle title="参与提醒" />
            <div style={{ display: "grid", gap: 10 }}>
              <div style={detailTipCardStyle(meta.soft)}>
                <div style={detailTipTitleStyle}>{scene === "engagement" ? "按规则提交凭证" : "先完成账号认证"}</div>
                <div style={detailTipTextStyle}>
                  {scene === "engagement"
                    ? "内容互动任务可直接提交截图凭证，无需先完成账号认证。"
                    : "提交内容时会校验平台认证状态，未绑定账号将无法提交。"}
                </div>
              </div>
              <div style={detailTipCardStyle(meta.soft)}>
                <div style={detailTipTitleStyle}>同一链接不可重复领奖</div>
                <div style={detailTipTextStyle}>系统会校验重复投稿、账号归属和内容状态，删除内容后奖励可能失效。</div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {displayStatus !== "未开始" && scene !== "follow" && scene !== "engagement" && (
        <div style={floatingDockStyle}>
          <div style={floatingDockInnerStyle}>
            <button onClick={() => navigate("/submissions")} style={floatingButtonStyle}>
              <span style={floatingIconWrapStyle}>
                <History size={14} />
              </span>
              <span style={floatingTextStyle}>提交记录</span>
            </button>
          </div>
        </div>
      )}

      {displayStatus === "进行中" && scene !== "follow" && (
        <div style={detailSubmitDockStyle}>
          <div style={detailSubmitInnerStyle}>
            <button
              disabled={scene === "engagement" ? engagementSubmitMeta.disabled : false}
              onClick={() => {
                if (scene === "engagement") {
                  if (previewSubmitState === "approved") {
                    navigate("/rewards");
                    return;
                  }
                  openEngagementUploadSheet();
                  return;
                }
                if (useInlineSeedingSubmit) {
                  openSeedingSubmitSheet();
                  return;
                }
                navigate(`/submit?taskId=${task.id}`);
              }}
              style={{
                ...detailSubmitButtonStyle,
                background: scene === "engagement" ? engagementSubmitMeta.tone : meta.accent,
                cursor: scene === "engagement" && engagementSubmitMeta.disabled ? "not-allowed" : "pointer",
                opacity: scene === "engagement" && engagementSubmitMeta.disabled ? 0.9 : 1,
              }}
            >
              {scene === "engagement" ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span>{engagementSubmitMeta.label}</span>
                  {engagementSubmitMeta.showArrow ? <ChevronRight size={16} /> : null}
                </span>
              ) : (
                submitButtonText
              )}
            </button>
          </div>
        </div>
      )}

      {displayStatus === "未开始" && scene !== "follow" && scene !== "engagement" && (
        <div style={detailSubscribeDockStyle}>
          <div style={detailSubscribeInnerStyle}>
            <div style={{ display: "grid", gap: 8, width: "100%" }}>
              <div style={detailSubscribeHintStyle}>任务未开始，订阅后任务开启会通知你来参与。</div>
              <button onClick={onSubscribeStartReminder} style={detailSubscribeButtonStyle(startReminderSubscribed)}>
                {startReminderSubscribed ? "已订阅开始提醒" : "订阅开始提醒"}
              </button>
            </div>
          </div>
        </div>
      )}

      {displayStatus === "已结束" && hasLeaderboard && (
        <div style={detailSubmitDockStyle}>
          <div style={detailSubmitInnerStyle}>
            <button onClick={() => setShowRankingSheet(true)} style={{ ...detailSubmitButtonStyle, background: meta.accent }}>
              查看榜单
            </button>
          </div>
        </div>
      )}

      {showRankingSheet && (
        <div style={rankingBackdropStyle} onClick={() => setShowRankingSheet(false)}>
          <div style={rankingSheetStyle} onClick={(e) => e.stopPropagation()}>
            <div style={rankingSheetHeaderStyle}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>效果榜单</div>
                <div style={{ marginTop: 4, fontSize: 12, color: "#64748b" }}>按互动表现展示当前任务的参与内容排名</div>
              </div>
              <button onClick={() => setShowRankingSheet(false)} style={rankingCloseButtonStyle}>关闭</button>
            </div>
            <div style={{ display: "grid", gap: 8, maxHeight: "52vh", overflowY: "auto", paddingRight: 2 }}>
              {rankingEntries.map((item, index) => (
                <div key={item.id} style={rankingRowStyle}>
                  <div style={rankingRankStyle(index)}>{index + 1}</div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={detailRankingHandleStyle}>{item.accountHandle}</div>
                    <div style={detailRankingTitleStyle}>{item.title}</div>
                  </div>
                  <div style={rankingScoreStyle}>
                    {item.interactionScore}
                    <span style={{ marginLeft: 4, fontSize: 11, fontWeight: 600 }}>互动量</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {followUploadSheet && scene === "follow" && (
        <div style={followUploadBackdropStyle} onClick={closeFollowUploadSheet}>
          <div style={followUploadSheetStyle} onClick={(event) => event.stopPropagation()}>
            <div style={followUploadHeadStyle}>
              <div style={followUploadTitleStyle}>上传关注截图</div>
              <button type="button" onClick={closeFollowUploadSheet} style={followUploadCloseStyle}>
                关闭
              </button>
            </div>
            {activeFollowState?.status === "已拒绝" && activeFollowState.rejectReason && (
              <div style={followUploadRejectReasonStyle}>拒绝原因：{activeFollowState.rejectReason}</div>
            )}
            <div style={followUploadMediaRowStyle}>
              {targets[followUploadSheet.index]?.sampleImage && (
                <div style={followUploadMediaItemStyle}>
                  <div style={followUploadMediaLabelStyle}>示例图</div>
                  <img
                    src={targets[followUploadSheet.index].sampleImage}
                    alt="示例图"
                    style={followUploadSampleImageStyle}
                    onClick={() => setPreviewImage({ src: targets[followUploadSheet.index].sampleImage ?? "", title: "示例图" })}
                  />
                </div>
              )}
              <div style={followUploadMediaItemStyle}>
                <div style={followUploadMediaLabelStyle}>选择截图</div>
                <label style={followUploadPickerStyle(Boolean(followUploadSheet.fileUrl))}>
                  {followUploadSheet.fileUrl ? (
                    <img src={followUploadSheet.fileUrl} alt="关注截图预览" style={followUploadPreviewImageStyle} />
                  ) : (
                    <span style={followUploadPickerTextStyle}>点击选择</span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      setFollowUploadSheet((prev) => (prev ? { ...prev, fileUrl: URL.createObjectURL(file) } : prev));
                    }}
                  />
                </label>
              </div>
            </div>
            <button
              type="button"
              style={followUploadSubmitInSheetStyle}
              onClick={() => {
                if (!followUploadSheet.fileUrl) {
                  toast.error("请先选择一张截图");
                  return;
                }
                handleSubmitSingleFollowProof(followUploadSheet.index);
              }}
            >
              提交截图
            </button>
          </div>
        </div>
      )}

      {engagementUploadSheet && scene === "engagement" && (
        <div style={followUploadBackdropStyle} onClick={closeEngagementUploadSheet}>
          <div style={followUploadSheetStyle} onClick={(event) => event.stopPropagation()}>
            <div style={followUploadHeadStyle}>
              <div style={followUploadTitleStyle}>上传互动截图</div>
              <button type="button" onClick={closeEngagementUploadSheet} style={followUploadCloseStyle}>
                关闭
              </button>
            </div>
            {previewSubmitState === "rejected" && (
              <div style={followUploadRejectReasonStyle}>拒绝原因：截图未包含完整互动状态和评论内容，请按示例图重新上传。</div>
            )}
            <div style={{ display: "grid", gap: 12 }}>
              {task.engagementSampleImage && (
                <div style={followUploadMediaItemStyle}>
                  <div style={followUploadMediaLabelStyle}>示例图</div>
                  <img
                    src={task.engagementSampleImage}
                    alt="示例图"
                    style={{ ...followUploadSampleImageStyle, width: 132, height: 132 }}
                    onClick={() => setPreviewImage({ src: task.engagementSampleImage ?? "", title: "示例图" })}
                  />
                </div>
              )}
              <div style={followUploadMediaItemStyle}>
                <div style={followUploadMediaLabelStyle}>上传截图</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
                  {[0, 1].map((slot) => (
                    <label
                      key={slot}
                      style={{
                        ...followUploadPickerStyle(Boolean(engagementUploadSheet.fileUrls[slot])),
                        width: 132,
                        height: 132,
                        aspectRatio: "1 / 1",
                      }}
                    >
                      {engagementUploadSheet.fileUrls[slot] ? (
                        <img src={engagementUploadSheet.fileUrls[slot]} alt={`互动截图预览${slot + 1}`} style={followUploadPreviewImageStyle} />
                      ) : (
                        <span style={followUploadPickerTextStyle}>{`选择第${slot + 1}张`}</span>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          setEngagementUploadSheet((prev) => {
                            if (!prev) return prev;
                            const next = [...prev.fileUrls];
                            next[slot] = URL.createObjectURL(file);
                            return { ...prev, fileUrls: next.slice(0, 2) };
                          });
                        }}
                      />
                    </label>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: "#64748b", fontWeight: 400 }}>最多支持上传 2 张截图</div>
              </div>
            </div>
            <button type="button" style={followUploadSubmitInSheetStyle} onClick={handleSubmitEngagementProof}>
              提交截图
            </button>
          </div>
        </div>
      )}

      {seedingSubmitSheet && useInlineSeedingSubmit && (
        <div style={followUploadBackdropStyle} onClick={closeSeedingSubmitSheet}>
          <div style={followUploadSheetStyle} onClick={(event) => event.stopPropagation()}>
            <div style={followUploadHeadStyle}>
              <div style={followUploadTitleStyle}>提交内容</div>
              <button type="button" onClick={closeSeedingSubmitSheet} style={followUploadCloseStyle}>
                关闭
              </button>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ display: "grid", gap: 6 }}>
                <div style={followUploadMediaLabelStyle}>内容链接</div>
                <textarea
                  value={seedingSubmitSheet.contentUrl}
                  onChange={(event) =>
                    setSeedingSubmitSheet((prev) => (prev ? { ...prev, contentUrl: event.target.value } : prev))
                  }
                  style={seedingSheetTextareaStyle}
                />
              </div>
              <div style={{ display: "grid", gap: 6 }}>
                <div style={followUploadMediaLabelStyle}>内容摘要</div>
                <textarea
                  value={seedingSubmitSheet.contentPreview}
                  onChange={(event) =>
                    setSeedingSubmitSheet((prev) => (prev ? { ...prev, contentPreview: event.target.value } : prev))
                  }
                  style={seedingSheetTextareaStyle}
                />
              </div>
            </div>
            <button type="button" style={followUploadSubmitInSheetStyle} onClick={handleSubmitSeedingContent}>
              提交内容
            </button>
          </div>
        </div>
      )}

      {previewImage && (
        <div style={scenePreviewBackdropStyle} onClick={() => setPreviewImage(null)}>
          <div style={scenePreviewSheetStyle} onClick={(event) => event.stopPropagation()}>
            <div style={scenePreviewHeaderStyle}>
              <div style={scenePreviewTitleStyle}>{previewImage.title}</div>
              <button type="button" onClick={() => setPreviewImage(null)} style={scenePreviewCloseStyle}>
                关闭
              </button>
            </div>
            <div style={scenePreviewFrameStyle}>
              <img src={previewImage.src} alt={previewImage.title} style={scenePreviewLargeImageStyle} />
            </div>
          </div>
        </div>
      )}
      </div>
    </Container>
  );
}

function getDetailSceneMeta(scene: DetailScene) {
  const meta: Record<DetailScene, { label: string; accent: string; soft: string; description: string }> = {
    follow: {
      label: "账号加粉",
      accent: "#0f766e",
      soft: "rgba(15,118,110,0.10)",
      description: "按后台配置关注指定账号，上传清晰凭证后完成审核领取奖励。",
    },
    engagement: {
      label: "内容互动",
      accent: "#c2410c",
      soft: "rgba(194,65,12,0.10)",
      description: "围绕指定内容完成点赞、评论、收藏等动作，适合短周期互动助推。",
    },
    seeding: {
      label: "内容种草",
      accent: "#1d4ed8",
      soft: "rgba(29,78,216,0.10)",
      description: "围绕指定主题发布原创内容，审核通过即可进入基础奖励和种草激励流程。",
    },
    engagement_reward: {
      label: "效果种草",
      accent: "#7c3aed",
      soft: "rgba(124,58,237,0.10)",
      description: "先发布内容，再按互动阈值或榜单排名结算额外奖励，和后台效果计奖玩法对齐。",
    },
  };

  return meta[scene];
}

function getDetailHighlights(task: Task, scene: DetailScene) {
  const baseReward = task.rewardSpecs.find((spec) => spec.kind === "base");
  const rewardText = baseReward
    ? baseReward.rewardType === "cash"
      ? `${baseReward.amount} 元起`
      : baseReward.rewardType === "gift"
        ? "赠品奖励"
        : `${baseReward.amount} 星云币起`
    : "按规则发放";

  const sceneText =
    scene === "follow"
      ? `${task.followTargets?.length ?? 0} 个账号`
      : scene === "engagement"
        ? `${task.engagementActions?.length ?? 0} 个动作`
        : scene === "engagement_reward"
          ? `${task.rewardSpecs.filter((spec) => spec.kind !== "base").length} 个效果档位`
          : `${task.hashtags.length} 个话题`;

  const sceneLabel =
    scene === "follow"
      ? "关注目标"
      : scene === "engagement"
        ? "互动动作"
        : scene === "engagement_reward"
          ? "效果机制"
          : "创作标签";

  return [
    { label: "基础奖励", value: rewardText, icon: Gift },
    { label: "提交上限", value: `每人 ${task.maxPerUser} 条`, icon: Send },
    { label: sceneLabel, value: sceneText, icon: scene === "engagement_reward" ? Trophy : Target },
  ];
}

function getSceneRules(task: Task, scene: DetailScene) {
  if (scene === "follow") {
    return [
      ...(task.proofDescription?.split(/\n+/).map((item) => item.trim()).filter(Boolean) ?? []),
      `需完成全部指定账号关注后再提交，当前共 ${task.followTargets?.length ?? 0} 个账号。`,
      `截图需清晰展示账号名称与已关注状态。`,
    ];
  }

  if (scene === "engagement") {
    return [
      ...(task.engagementProofDescription?.split(/\n+/).map((item) => item.trim()).filter(Boolean) ?? []),
      `需完成 ${task.engagementActions?.join("、") || "指定互动动作"} 后再提交凭证。`,
      ...(task.commentKeyword ? [`评论内容需包含关键词「${task.commentKeyword}」。`] : []),
    ];
  }

  if (scene === "engagement_reward") {
    return [
      "需先发布符合要求的原创内容，审核通过后才会进入效果统计周期。",
      "基础奖励与效果奖励分开结算，额外奖励以互动达标档位或榜单名次为准。",
      "内容需保留至奖励结算完成，如中途删除或隐藏，可能导致奖励失效。",
      `每位用户最多可提交 ${task.maxPerUser} 条内容，最终解释以后台任务配置为准。`,
    ];
  }

  return [
    `需在 ${task.platform.join(" / ")} 发布符合要求的原创内容并提交公开链接。`,
    ...(task.hashtags.length > 0 ? [`内容需包含话题 ${task.hashtags.join("、")}。`] : []),
    ...(task.keywords.length > 0 ? [`建议围绕 ${task.keywords.join("、")} 等关键词展开创作。`] : []),
    ...(task.seedingRewardMode === "streak" && task.seedingStreakConfig
      ? [
          `活动期间内，每天至少提交 ${task.seedingStreakConfig.minPerDay} 条内容，连续 ${task.seedingStreakConfig.streakDays} 天可获得奖励。`,
          `当前连续进度：${task.seedingStreakConfig.currentStreakDays ?? 0}/${task.seedingStreakConfig.streakDays} 天。`,
        ]
      : []),
    `每位用户最多可提交 ${task.maxPerUser} 条内容，审核通过后进入奖励发放流程。`,
  ];
}

function getSceneSteps(scene: DetailScene) {
  if (scene === "follow") {
    return [
      { title: "查看账号", desc: "确认后台下发的关注平台和账号名单" },
      { title: "完成关注", desc: "逐个平台完成关注并核对状态" },
      { title: "保留截图", desc: "保留账号主页和已关注状态截图" },
      { title: "提交审核", desc: "回到 H5 上传凭证等待审核发奖" },
    ];
  }

  if (scene === "engagement") {
    return [
      { title: "打开内容", desc: "复制链接在浏览器打开" },
      { title: "完成互动", desc: "按要求完成互动动作" },
      { title: "上传凭证", desc: "在该页面上传互动截图" },
      { title: "发放奖励", desc: "审核通过发放奖励" },
    ];
  }

  if (scene === "engagement_reward") {
    return [
      { title: "发布内容", desc: "按主题完成原创内容发布" },
      { title: "提交链接", desc: "在 H5 回传公开内容链接" },
      { title: "进入观察", desc: "内容通过审核后开始统计互动数据" },
      { title: "按效果结算", desc: "达标或进榜后发放额外奖励" },
    ];
  }

  return [
    { title: "理解主题", desc: "查看话题、关键词和内容形式要求" },
    { title: "创作发布", desc: "在指定平台发布原创种草内容" },
    { title: "回传链接", desc: "将公开内容链接提交到任务中" },
    { title: "审核领奖", desc: "等待审核通过并按规则发放奖励" },
  ];
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "7px 10px", borderRadius: 14, background: "rgba(247,250,255,0.9)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
        <div style={{ width: 26, height: 26, borderRadius: 9, background: "rgba(36,116,255,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={13} color="#2474ff" />
        </div>
        <div style={{ fontSize: 12, color: "#64748b", fontWeight: 400, lineHeight: 1.15 }}>{label}</div>
      </div>
      <div style={{ fontSize: 12, color: "#0f172a", fontWeight: 700, textAlign: "right", lineHeight: 1.25, maxWidth: "56%", overflowWrap: "anywhere" }}>{value}</div>
    </div>
  );
}

function RewardSpecCard({ spec, previewRewardKind }: { spec: TaskRewardSpec; previewRewardKind: RewardPreviewKind }) {
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
          fontSize: 12, fontWeight: 400,
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

  const previewRewardMeta =
    previewRewardKind === "gift"
      ? { name: GIFT_LABELS.g1, image: GIFT_IMAGES.g1, tone: "rgba(250,173,20,0.12)", border: "rgba(250,173,20,0.24)" }
      : previewRewardKind === "cash"
      ? { name: "现金红包", image: GIFT_IMAGES.g5, tone: "rgba(255,77,79,0.10)", border: "rgba(255,77,79,0.24)" }
      : { name: "积分奖励", image: GIFT_IMAGES.g2, tone: "rgba(36,116,255,0.10)", border: "rgba(36,116,255,0.22)" };
  const previewAmountText =
    previewRewardKind === "points"
      ? `${spec.amount} 星云币`
      : previewRewardKind === "cash"
      ? `${spec.amount} 元红包`
      : "价值299元";

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
        <div style={{ display: "grid", gap: 8, padding: "8px 10px", borderRadius: 14, background: "rgba(255,255,255,0.92)" }}>
          <div style={{ fontSize: 12, color: "#64748b", fontWeight: 400 }}>奖励内容</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: 8, borderRadius: 12, background: previewRewardMeta.tone, border: `1px solid ${previewRewardMeta.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <img src={previewRewardMeta.image} alt={previewRewardMeta.name} style={{ width: 40, height: 40, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
            <div style={{ fontSize: 13, color: "#0f172a", fontWeight: 700 }}>{previewRewardMeta.name}</div>
            </div>
            {previewAmountText ? (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 28,
                  padding: "0 10px",
                  borderRadius: 999,
                  border: "1px solid rgba(148,163,184,0.44)",
                  background: "rgba(255,255,255,0.86)",
                  color: "#0f172a",
                  fontSize: 12,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {previewAmountText}
              </span>
            ) : null}
          </div>
        </div>
      )}

      {spec.kind === "ranking" && (
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ fontSize: 12, color: "#64748b", fontWeight: 400 }}>按 {metricLabelMap[spec.metric]} 排名计算</div>
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
          <div style={{ fontSize: 12, color: "#64748b", fontWeight: 400 }}>触发指标：{metricLabelMap[spec.metric]}</div>
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

const sceneHeroStyle: React.CSSProperties = {
  position: "relative",
  padding: "12px 18px",
  borderRadius: 30,
  overflow: "hidden",
  color: "#0f172a",
  background: "radial-gradient(circle at 84% 8%, rgba(36,116,255,0.20), transparent 32%), linear-gradient(135deg, #f7fbff 0%, #eaf3ff 100%)",
  border: "1px solid rgba(255,255,255,0.86)",
  boxShadow: "0 18px 42px rgba(36,116,255,0.12)",
};

const detailHeroStyle = (accent: string, soft: string): React.CSSProperties => ({
  position: "relative",
  minHeight: 208,
  padding: 18,
  borderRadius: 30,
  overflow: "hidden",
  background: `linear-gradient(145deg, rgba(255,255,255,0.98) 0%, ${soft} 58%, rgba(255,255,255,0.96) 100%)`,
  border: "1px solid rgba(226,232,240,0.9)",
  boxShadow: `0 22px 48px color-mix(in srgb, ${accent} 14%, rgba(15,23,42,0.08))`,
});

const detailHeroDecorationStyle = (accent: string): React.CSSProperties => ({
  position: "absolute",
  inset: 0,
  background: `
    radial-gradient(circle at 88% 16%, ${colorAlpha(accent, 0.18)} 0, transparent 24%),
    radial-gradient(circle at 78% 82%, ${colorAlpha(accent, 0.1)} 0, transparent 20%),
    linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.28) 100%)
  `,
});

const detailHeroContentStyle: React.CSSProperties = {
  position: "relative",
  zIndex: 1,
  display: "grid",
  alignContent: "space-between",
  minHeight: 184,
  gap: 18,
};

const detailHeroTopRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
};

const detailHeroEyebrowStyle = (accent: string): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  height: 30,
  padding: "0 12px",
  borderRadius: 999,
  background: colorAlpha(accent, 0.18),
  color: accent,
  fontSize: 12, fontWeight: 400,
  letterSpacing: "0.08em",
});

const detailHeroTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 24,
  lineHeight: 1.16,
  letterSpacing: "-0.03em",
  fontWeight: 900,
  color: "#0f172a",
};

const detailHeroDescStyle: React.CSSProperties = {
  maxWidth: "92%",
  fontSize: 13,
  lineHeight: 1.8,
  color: "#526076",
  fontWeight: 700,
};

const detailHeroMetaListStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
};

const detailHeroMetaPillStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 10px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.88)",
  border: "1px solid rgba(226,232,240,0.96)",
  color: "#475569",
  fontSize: 12, fontWeight: 400,
};

const detailHighlightGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 10,
};

const detailHighlightCardStyle = (soft: string): React.CSSProperties => ({
  display: "grid",
  gap: 12,
  padding: 12,
  borderRadius: 20,
  background: `linear-gradient(180deg, ${soft}, rgba(255,255,255,0.96))`,
  border: "1px solid rgba(226,232,240,0.88)",
});

const detailHighlightIconStyle = (soft: string, accent: string): React.CSSProperties => ({
  width: 34,
  height: 34,
  borderRadius: 12,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: soft,
  color: accent,
});

const detailHighlightLabelStyle: React.CSSProperties = {
  fontSize: 12,
  lineHeight: 1.2,
  color: "#64748b", fontWeight: 400,
};

const detailHighlightValueStyle: React.CSSProperties = {
  fontSize: 16,
  lineHeight: 1.3,
  color: "#0f172a",
  fontWeight: 900,
};

const detailSecondaryTextStyle: React.CSSProperties = {
  fontSize: 12,
  lineHeight: 1.6,
  color: "#64748b", fontWeight: 400,
  flex: 1,
  minWidth: 0,
};

const detailTagBoardStyle = (soft: string): React.CSSProperties => ({
  display: "grid",
  gap: 10,
  padding: 12,
  borderRadius: 18,
  background: soft,
  border: "1px solid rgba(226,232,240,0.84)",
});

const detailTagBoardLabelStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b", fontWeight: 400,
};

const detailTagWrapStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
};

const detailTagStyle = (accent: string, soft: string): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "7px 10px",
  borderRadius: 999,
  background: soft,
  color: accent,
  fontSize: 12, fontWeight: 400,
});

const detailBriefStyle = (soft: string): React.CSSProperties => ({
  display: "grid",
  gap: 6,
  padding: 14,
  borderRadius: 20,
  background: `linear-gradient(180deg, rgba(255,255,255,0.98), ${soft})`,
  border: "1px solid rgba(226,232,240,0.88)",
});

const detailBriefTitleStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#0f172a",
  fontWeight: 900,
};

const detailBriefTextStyle: React.CSSProperties = {
  fontSize: 13,
  lineHeight: 1.8,
  color: "#475569", fontWeight: 400,
};

const detailRankingPreviewRowStyle = (soft: string): React.CSSProperties => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 12px",
  borderRadius: 18,
  background: `linear-gradient(180deg, rgba(255,255,255,0.98), ${soft})`,
  border: "1px solid rgba(226,232,240,0.84)",
});

const detailRankingHandleStyle: React.CSSProperties = {
  fontSize: 13,
  lineHeight: 1.25,
  color: "#0f172a",
  fontWeight: 900,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const detailRankingTitleStyle: React.CSSProperties = {
  marginTop: 4,
  fontSize: 12,
  lineHeight: 1.4,
  color: "#64748b", fontWeight: 400,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const detailRankingScoreStyle = (accent: string): React.CSSProperties => ({
  fontSize: 16,
  color: accent,
  fontWeight: 900,
  flexShrink: 0,
});

const detailSecondaryButtonStyle = (accent: string, soft: string): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  height: 40,
  border: "none",
  borderRadius: 999,
  background: soft,
  color: accent,
  fontSize: 13, fontWeight: 400,
  cursor: "pointer",
});

const detailEmptyStateStyle: React.CSSProperties = {
  padding: 14,
  borderRadius: 18,
  background: "rgba(248,250,252,0.96)",
  color: "#64748b",
  fontSize: 13,
  lineHeight: 1.7,
  fontWeight: 700,
};

const detailRewardHintStyle = (soft: string): React.CSSProperties => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 12px",
  borderRadius: 16,
  background: soft,
  color: "#475569",
  fontSize: 12,
  lineHeight: 1.6,
  fontWeight: 700,
});

const detailTipCardStyle = (soft: string): React.CSSProperties => ({
  display: "grid",
  gap: 6,
  padding: 14,
  borderRadius: 18,
  background: `linear-gradient(180deg, rgba(255,255,255,0.98), ${soft})`,
  border: "1px solid rgba(226,232,240,0.86)",
});

const detailTipTitleStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#0f172a",
  fontWeight: 900,
};

const detailTipTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  lineHeight: 1.7,
  fontWeight: 700,
};

const sceneHeroBadgeStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  minHeight: 24,
  fontSize: 12, fontWeight: 400,
  color: "#2474ff",
};

const followSceneHeroHeadStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
};

const followSceneHeroTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 18,
  lineHeight: 1.2,
  letterSpacing: "-0.03em",
  fontWeight: 900,
  flex: 1,
};

const sceneHeroMetaStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "nowrap",
  gap: 8,
  marginTop: 8,
  alignItems: "center",
};

const sceneHeroMetaPillStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "7px 10px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.72)",
  color: "#52647f",
  fontSize: 12, fontWeight: 400,
};

const followParticipantsStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 6,
  color: "#52647f",
  fontSize: 12, fontWeight: 400,
  marginLeft: "auto",
  textAlign: "right",
  flexShrink: 0,
};

const followTargetCardStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
  padding: "12px 11px",
  borderRadius: 16,
  background: "linear-gradient(180deg, rgba(246,250,255,0.98), rgba(255,255,255,1))",
  border: "1px solid rgba(218,228,242,0.88)",
};

const followCardHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  minWidth: 0,
};

const followCardTitleWrapStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  minWidth: 0,
  flex: 1,
};

const followCardFooterStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
};

const followStatusTagStyle = (status: FollowProofStatus): React.CSSProperties => {
  const tone =
    status === "已完成"
      ? { border: "rgba(34,197,94,0.30)", bg: "rgba(34,197,94,0.12)", color: "#15803d" }
      : status === "审核中"
      ? { border: "rgba(59,130,246,0.26)", bg: "rgba(59,130,246,0.10)", color: "#1d4ed8" }
      : status === "已拒绝"
      ? { border: "rgba(239,68,68,0.26)", bg: "rgba(239,68,68,0.10)", color: "#dc2626" }
      : { border: "rgba(148,163,184,0.26)", bg: "rgba(148,163,184,0.10)", color: "#64748b" };
  return {
    display: "inline-flex",
    alignItems: "center",
    height: 22,
    padding: "0 8px",
    borderRadius: 999,
    border: `1px solid ${tone.border}`,
    background: tone.bg,
    color: tone.color,
    fontSize: 11, fontWeight: 400,
  };
};

const followCopyIconButtonStyle = (copied: boolean): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 32,
  height: 32,
  padding: 0,
  borderRadius: 8,
  border: "none",
  background: copied ? "rgba(36,116,255,0.10)" : "transparent",
  color: copied ? "#2474ff" : "#94a3b8",
  cursor: "pointer",
  flexShrink: 0,
});

const followGhostActionStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: 32,
  minWidth: 68,
  padding: "0 10px",
  borderRadius: 8,
  border: "1px solid rgba(191,219,254,0.9)",
  background: "rgba(239,246,255,0.78)",
  color: "#2563eb",
  fontSize: 12, fontWeight: 400,
  cursor: "pointer",
  flexShrink: 0,
};

const followProofUploadTriggerStyle = (danger?: boolean): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 80,
  height: 32,
  padding: "0 10px",
  borderRadius: 8,
  border: danger ? "1px solid rgba(252,165,165,0.92)" : "1px solid rgba(191,219,254,0.95)",
  background: danger ? "rgba(254,242,242,0.92)" : "rgba(239,246,255,0.84)",
  color: danger ? "#dc2626" : "#2474ff",
  fontSize: 12, fontWeight: 400,
  cursor: "pointer",
});

const followHeroShellStyle: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  borderRadius: 28,
  padding: 16,
  border: "1px solid rgba(215,228,243,0.92)",
  background: "linear-gradient(135deg, #e6fcf5 0%, #e0f7fa 30%, #e8f4fd 60%, #f0f4ff 100%)",
  boxShadow: "0 14px 34px rgba(149,180,214,0.18)",
  display: "grid",
  gap: 10,
};

const followHeroTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 48 / 3,
  lineHeight: 1.28,
  color: "#0f172a",
  fontWeight: 900,
  letterSpacing: "-0.02em",
};

const followHeroDescStyle: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.72,
  color: "#4b5e7a",
  fontWeight: 400,
  width: "100%",
  maxWidth: "100%",
  textAlign: "left",
};

const followHeroOrnamentStyle: React.CSSProperties = {
  position: "absolute",
  right: -20,
  bottom: -24,
  width: 180,
  height: 160,
  pointerEvents: "none",
};

const followHeroBubbleStyle: React.CSSProperties = {
  position: "absolute",
  right: 28,
  bottom: 30,
  width: 110,
  height: 110,
  borderRadius: "50%",
  background: "radial-gradient(circle at 30% 26%, #9af3e8, #58d7c9 62%, #51b8d0 100%)",
  filter: "drop-shadow(0 16px 24px rgba(64,190,193,0.24))",
};

const followHeroArrowStyle: React.CSSProperties = {
  position: "absolute",
  right: 6,
  bottom: 16,
  width: 90,
  height: 64,
  borderRadius: 24,
  background: "linear-gradient(145deg, rgba(208,235,255,0.98), rgba(121,182,255,0.5))",
  transform: "rotate(-28deg)",
};

const followOverviewGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 10,
};

const followOverviewItemStyle = (bg: string): React.CSSProperties => ({
  display: "grid",
  gap: 6,
  alignContent: "start",
  minHeight: 126,
  borderRadius: 20,
  padding: 12,
  border: "1px solid rgba(218,228,242,0.88)",
  background: `linear-gradient(180deg, ${bg}, rgba(255,255,255,0.98))`,
});

const followOverviewIconStyle = (bg: string): React.CSSProperties => ({
  width: 38,
  height: 38,
  borderRadius: "50%",
  background: bg,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 10px 20px rgba(59,130,246,0.18)",
});

const followOverviewValueStyle: React.CSSProperties = {
  fontSize: 36 / 3,
  lineHeight: 1.35,
  color: "#0f172a",
  fontWeight: 900,
};

const followStepListStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  alignItems: "start",
  gap: 0,
};

const followStepPairStyle: React.CSSProperties = {
  width: "100%",
  minWidth: 0,
  position: "relative",
  display: "grid",
  justifyItems: "center",
  alignItems: "flex-start",
};

const followStepItemStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  display: "grid",
  gap: 8,
  alignContent: "start",
  padding: "0 6px",
  justifyItems: "center",
};

const followStepHeadStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const followStepBadgeStyle = (bg: string): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  height: 28,
  minWidth: 52,
  padding: "0 10px",
  borderRadius: 999,
  background: bg,
  border: "1px solid rgba(203,213,225,0.8)",
  color: "#1e293b",
  fontSize: 13,
  fontWeight: 700,
  justifyContent: "center",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
});

const followStepTitleStyle: React.CSSProperties = {
  fontSize: 12,
  lineHeight: 1.35,
  color: "#0f172a",
  fontWeight: 500,
  wordBreak: "break-word",
  whiteSpace: "nowrap",
  textAlign: "center",
};

const followStepConnectorStyle: React.CSSProperties = {
  position: "absolute",
  top: 14,
  left: "calc(50% + 30px)",
  width: "calc(100% - 60px)",
  height: 1,
  borderTop: "1px dashed rgba(148,163,184,0.75)",
};

const engagementStepGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 8,
};

const engagementStepCardStyle = (tone: string): React.CSSProperties => ({
  minHeight: 56,
  borderRadius: 14,
  border: "1px solid rgba(218,228,242,0.9)",
  background: `linear-gradient(180deg, ${tone}, rgba(255,255,255,0.98))`,
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 10px",
});

const engagementStepIndexStyle: React.CSSProperties = {
  width: 22,
  height: 22,
  borderRadius: 999,
  background: "rgba(15,23,42,0.08)",
  color: "#0f172a",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 12,
  fontWeight: 700,
  flexShrink: 0,
};

const engagementStepTextStyle: React.CSSProperties = {
  fontSize: 12,
  lineHeight: 1.35,
  color: "#0f172a",
  fontWeight: 500,
};

const followSectionCardStyle: React.CSSProperties = {
  padding: 14,
  borderRadius: 24,
  border: "1px solid rgba(220,230,245,0.95)",
  background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(249,252,255,0.98))",
  boxShadow: "0 10px 28px rgba(148,173,211,0.12)",
};

const detailCardTitleRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 12,
};

const detailCardTitleMainStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontSize: 40 / 3,
  color: "#0f172a",
  fontWeight: 900,
};

const detailCardTitleAccentStyle: React.CSSProperties = {
  width: 4,
  height: 22,
  borderRadius: 999,
  background: "linear-gradient(180deg,#69e5d7,#2cc4b0)",
  flexShrink: 0,
};

const followRewardLinkButtonStyle: React.CSSProperties = {
  border: "none",
  background: "transparent",
  color: "#2474ff",
  fontSize: 12,
  fontWeight: 500,
  display: "inline-flex",
  alignItems: "center",
  gap: 2,
  cursor: "pointer",
  padding: 0,
};

const followUploadBackdropStyle: React.CSSProperties = {
  position: "fixed",
  left: "50%",
  transform: "translateX(-50%)",
  top: 0,
  bottom: 0,
  width: "var(--h5-screen-width)",
  background: "rgba(15,23,42,0.35)",
  borderRadius: 34,
  zIndex: 40,
  display: "flex",
  alignItems: "flex-end",
  overflow: "hidden",
};

const followUploadSheetStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 420,
  borderTopLeftRadius: 18,
  borderTopRightRadius: 18,
  background: "#fff",
  padding: "24px 12px 28px",
  display: "grid",
  gap: 10,
};

const followUploadHeadStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const followUploadTitleStyle: React.CSSProperties = {
  fontSize: 15,
  color: "#0f172a",
  fontWeight: 900,
};

const followUploadCloseStyle: React.CSSProperties = {
  border: "none",
  background: "transparent",
  color: "#64748b",
  fontSize: 13, fontWeight: 400,
  cursor: "pointer",
};

const followUploadRejectReasonStyle: React.CSSProperties = {
  fontSize: 12,
  lineHeight: 1.6,
  color: "#dc2626",
  background: "rgba(239,68,68,0.08)",
  border: "1px solid rgba(239,68,68,0.16)",
  borderRadius: 12,
  padding: "8px 10px",
};

const followUploadMediaRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 12,
  flexWrap: "nowrap",
};

const followUploadMediaItemStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
  justifyItems: "start",
};

const followUploadMediaLabelStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  fontWeight: 400,
};

const followUploadSampleImageStyle: React.CSSProperties = {
  width: 120,
  height: 120,
  borderRadius: 12,
  objectFit: "cover",
  cursor: "pointer",
};

const followUploadPickerStyle = (hasImage: boolean): React.CSSProperties => ({
  width: 120,
  height: 120,
  borderRadius: 14,
  border: "1px dashed rgba(148,163,184,0.58)",
  background: hasImage ? "#f8fafc" : "rgba(248,250,252,0.78)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  cursor: "pointer",
});

const followUploadPickerTextStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#64748b", fontWeight: 400,
};

const followUploadPreviewImageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const followUploadSubmitInSheetStyle: React.CSSProperties = {
  height: 42,
  borderRadius: 12,
  border: "none",
  background: "#2474ff",
  color: "#fff",
  fontSize: 14,
  fontWeight: 900,
  cursor: "pointer",
};

const seedingSheetTextareaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 72,
  borderRadius: 12,
  border: "1px solid rgba(203,213,225,0.9)",
  background: "#fff",
  color: "#0f172a",
  fontSize: 13,
  lineHeight: 1.5,
  padding: "10px 12px",
  resize: "none",
  boxSizing: "border-box",
  outline: "none",
};

const sceneIndexStyle = (accent: string): React.CSSProperties => ({
  width: 28,
  height: 28,
  borderRadius: 11,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: `${accent}1A`,
  color: accent,
  fontSize: 12, fontWeight: 400,
  flexShrink: 0,
});

const scenePrimaryTextStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 900,
  color: "#0f172a",
  lineHeight: 1.35,
};

const copyAccountIconButtonStyle = (copied: boolean): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 24,
  height: 24,
  padding: 0,
  borderRadius: 999,
  border: copied ? "1px solid rgba(36,116,255,0.22)" : "1px solid transparent",
  background: copied ? "rgba(36,116,255,0.10)" : "transparent",
  color: "#64748b",
  cursor: "pointer",
  flexShrink: 0,
});

const sampleViewButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: 24,
  padding: "0 10px",
  borderRadius: 999,
  border: "1px solid rgba(36,116,255,0.14)",
  background: "rgba(36,116,255,0.08)",
  color: "#2474ff",
  fontSize: 12, fontWeight: 400,
  cursor: "pointer",
  flexShrink: 0,
};

const linkCopyButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 8,
  border: "none",
  background: "transparent",
  padding: 0,
  color: "#0f172a",
  fontSize: 12, fontWeight: 400,
  cursor: "pointer",
  maxWidth: "100%",
};

const sceneImagePreviewStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
  padding: 12,
  borderRadius: 18,
  background: "rgba(247,250,255,0.96)",
  color: "#64748b",
  fontSize: 12, fontWeight: 400,
};

const sceneTagCopyRowStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
  padding: 12,
  borderRadius: 16,
  border: "1px solid rgba(226,232,240,0.88)",
  background: "rgba(247,250,255,0.96)",
};

const sceneTagCopyRowHeadStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
};

const sceneTagCopyRowTitleStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontSize: 13,
  color: "#64748b",
  fontWeight: 500,
};

const sceneTagIconWrapStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 999,
  background: "rgba(36,116,255,0.10)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const sceneTagCopyButtonStyle: React.CSSProperties = {
  border: "none",
  background: "transparent",
  color: "#64748b",
  fontSize: 12,
  fontWeight: 500,
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  cursor: "pointer",
  padding: 0,
};

const sceneTagWrapFlowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
};

const sceneTagChipStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  height: 28,
  padding: "0 10px",
  borderRadius: 999,
  border: "1px solid rgba(191,219,254,0.95)",
  background: "rgba(239,246,255,0.84)",
  color: "#1d4ed8",
  fontSize: 12,
  fontWeight: 500,
  whiteSpace: "nowrap",
};

const sceneImagePreviewHeadStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
};

const scenePreviewImageStyle: React.CSSProperties = {
  width: 112,
  height: 112,
  borderRadius: 18,
  objectFit: "cover",
  border: "1px solid rgba(226,232,240,0.9)",
};

const sceneRuleListStyle: React.CSSProperties = {
  margin: 0,
  paddingLeft: 18,
  display: "grid",
  gap: 8,
};

const sceneRuleItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 6,
  fontSize: 14,
  lineHeight: 1.8,
  color: "#475569", fontWeight: 400,
};

const sceneRuleIndexStyle: React.CSSProperties = {
  minWidth: 16,
  color: "#334155",
  fontWeight: 500,
  lineHeight: 1.8,
};

const sceneStepStyle: React.CSSProperties = {
  display: "grid",
  justifyItems: "center",
  alignContent: "start",
  gap: 6,
  minHeight: 118,
  padding: "10px 8px 10px",
  borderRadius: 18,
  background: "linear-gradient(180deg, rgba(248,250,252,0.98), rgba(255,255,255,0.96))",
  border: "1px solid rgba(226,232,240,0.82)",
  position: "relative",
  overflow: "hidden",
};

const sceneStepsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: 8,
};

const sceneStepBadgeStyle = (accent: string): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 32,
  height: 32,
  borderRadius: 999,
  background: `linear-gradient(180deg, ${accent}, color-mix(in srgb, ${accent} 72%, white))`,
  color: "#fff",
  fontSize: 12, fontWeight: 400,
  boxShadow: `0 10px 20px color-mix(in srgb, ${accent} 22%, transparent)`,
});

const sceneStepConnectorStyle = (show: boolean): React.CSSProperties => ({
  position: "absolute",
  top: 26,
  left: "calc(50% + 24px)",
  width: "calc(100% - 48px)",
  height: 2,
  borderRadius: 999,
  background: show ? "linear-gradient(90deg, rgba(36,116,255,0.22), rgba(36,116,255,0.06))" : "transparent",
});

const sceneStepTitleStyle: React.CSSProperties = {
  fontSize: 12, fontWeight: 400,
  color: "#0f172a",
  lineHeight: 1.3,
  textAlign: "center",
};

const sceneStepDescStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 400, color: "#64748b",
  lineHeight: 1.45,
  textAlign: "center",
};

const scenePreviewBackdropStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,0.56)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  zIndex: 40,
  backdropFilter: "blur(6px)",
};

const scenePreviewSheetStyle: React.CSSProperties = {
  width: "min(100%, 420px)",
  padding: 14,
  borderRadius: 26,
  background: "rgba(255,255,255,0.98)",
  boxShadow: "0 24px 60px rgba(15,23,42,0.24)",
  display: "grid",
  gap: 12,
};

const scenePreviewHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
};

const scenePreviewTitleStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 900,
  color: "#0f172a",
};

const scenePreviewCloseStyle: React.CSSProperties = {
  height: 32,
  padding: "0 12px",
  borderRadius: 999,
  border: "1px solid rgba(226,232,240,0.9)",
  background: "rgba(248,250,252,0.96)",
  color: "#475569",
  fontSize: 12, fontWeight: 400,
  cursor: "pointer",
};

const scenePreviewFrameStyle: React.CSSProperties = {
  minHeight: 240,
  borderRadius: 20,
  background: "rgba(241,245,249,0.9)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
};

const scenePreviewLargeImageStyle: React.CSSProperties = {
  width: "100%",
  maxHeight: "70vh",
  objectFit: "contain",
  display: "block",
};

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
  gap: 6,
  padding: 7,
  borderRadius: 20,
  background: "rgba(255,255,255,0.92)",
  border: "1px solid rgba(232,239,249,0.98)",
  boxShadow: "0 16px 40px rgba(112, 135, 176, 0.10)",
};

const taskFilterButtonStyle = (active: boolean, label: keyof typeof TASK_STATUS_META): React.CSSProperties => {
  const meta = TASK_STATUS_META[label];
  return {
    height: 44,
    borderRadius: 14,
    border: active ? `1.5px solid ${meta.border}` : "1px solid transparent",
    background: active ? "rgba(244,251,245,0.98)" : "rgba(245,248,253,0.92)",
    boxShadow: active ? "0 8px 22px rgba(34,197,94,0.10)" : "none",
    color: active ? meta.text : "#4b5f7d",
    fontSize: 12,
    fontWeight: 700,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
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
  gridTemplateColumns: "minmax(0, 1fr)",
  gap: 10,
  alignItems: "start",
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
    fontSize: 12, fontWeight: 400,
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
  fontSize: 11, fontWeight: 400,
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
  fontSize: 12, fontWeight: 400,
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
  width: "var(--h5-screen-width)",
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
  fontSize: 11, fontWeight: 400,
  cursor: "pointer",
  zIndex: 26,
};

const floatingDockStyle: React.CSSProperties = {
  position: "fixed",
  left: "50%",
  transform: "translateX(-50%)",
  width: "var(--h5-screen-width)",
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
  width: "var(--h5-screen-width)",
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
  width: "var(--h5-screen-width)",
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
  width: "calc(var(--h5-screen-width) - 20px)",
  maxWidth: "calc(var(--h5-screen-width) - 20px)",
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
  fontSize: 12, fontWeight: 400,
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
  fontSize: 12, fontWeight: 400,
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
