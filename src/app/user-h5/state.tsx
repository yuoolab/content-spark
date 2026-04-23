import { createContext, useContext, useMemo, useState } from "react";

export type Platform = "小红书" | "抖音" | "哔哩哔哩" | "微博";
export type TaskStatus = "进行中" | "未开始" | "已结束";
export type SubmissionStatus = "待审核" | "已通过" | "已拒绝";
export type RewardStatus = "待到账" | "已到账" | "已失效";
export type MessageType = "审核" | "奖励" | "账号" | "系统";
export type RewardType = "points" | "gift" | "cash";
export type RewardMetric = "likes" | "comments" | "collections" | "combined";
export type RewardReleaseMode = "after_end" | "after_review";

export interface BaseRewardSpec {
  id: string;
  kind: "base";
  title: string;
  rewardType: RewardType;
  amount: number;
  lotteryChances?: number;
  giftName?: string;
  releaseMode: RewardReleaseMode;
  releaseDays: number;
  note?: string;
}

export interface RankingRewardTier {
  rankStart: number;
  rankEnd: number;
  rewardType: RewardType;
  amount: number;
  giftName?: string;
}

export interface RankingRewardSpec {
  id: string;
  kind: "ranking";
  title: string;
  metric: RewardMetric;
  tiers: RankingRewardTier[];
  releaseMode: RewardReleaseMode;
  releaseDays: number;
  note?: string;
}

export interface FixedRewardRule {
  threshold: number;
  rewardType: RewardType;
  amount: number;
  giftName?: string;
}

export interface FixedRewardSpec {
  id: string;
  kind: "fixed";
  title: string;
  metric: RewardMetric;
  rules: FixedRewardRule[];
  releaseMode: RewardReleaseMode;
  releaseDays: number;
  note?: string;
}

export type TaskRewardSpec = BaseRewardSpec | RankingRewardSpec | FixedRewardSpec;

export interface Task {
  id: string;
  name: string;
  platform: Platform[];
  status: TaskStatus;
  image: string;
  participants: number;
  submissions: number;
  baseReward: number;
  tierReward: string;
  startDate: string;
  endDate: string;
  hashtags: string[];
  keywords: string[];
  minFollowers: number;
  maxPerUser: number;
  contentType: "不限" | "图文" | "视频";
  description: string;
  rewardSpecs: TaskRewardSpec[];
}

export interface AccountBinding {
  platform: Platform;
  accountName: string;
  accountHandle: string;
  profileUrl: string;
  followers: number;
  works: number;
  verifiedAt: string;
}

export interface Submission {
  id: string;
  taskId: string;
  taskName: string;
  platform: Platform;
  title: string;
  contentUrl: string;
  contentPreview: string;
  submitTime: string;
  publishTime: string;
  status: SubmissionStatus;
  rejectReason?: string;
  likes: number;
  comments: number;
  collections: number;
  accountHandle: string;
  rewardStatus: RewardStatus;
}

export interface RewardRecord {
  id: string;
  submissionId: string;
  taskName: string;
  amount: number;
  status: RewardStatus;
  createdAt: string;
  arrivedAt?: string;
  note: string;
}

export interface MessageItem {
  id: string;
  type: MessageType;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  target?: string;
}

export interface UserH5State {
  tasks: Task[];
  accounts: AccountBinding[];
  submissions: Submission[];
  rewards: RewardRecord[];
  messages: MessageItem[];
}

type UserH5ContextValue = UserH5State & {
  verifyAccount: (
    platform: Platform,
    payload: {
      accountName: string;
      accountHandle: string;
      profileUrl: string;
      followers: number;
      works: number;
    }
  ) => boolean;
  unbindAccount: (platform: Platform) => void;
  submitContent: (payload: {
    taskId: string;
    platform: Platform;
    title: string;
    contentUrl: string;
    contentPreview: string;
    publishTime: string;
    accountHandle: string;
  }) => { ok: boolean; message: string };
  approveSubmission: (submissionId: string) => void;
  rejectSubmission: (submissionId: string, reason: string) => void;
  settleReward: (rewardId: string) => void;
  subscribeTaskStartReminder: (taskId: string) => { ok: boolean; message: string };
  subscribeTaskNotification: (taskId: string) => { ok: boolean; message: string };
  markMessageRead: (messageId: string) => void;
  markAllMessagesRead: () => void;
};

const UserH5Context = createContext<UserH5ContextValue | null>(null);

const makeId = (prefix = "id") =>
  `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

const nowText = () => new Date().toLocaleString("zh-CN", { hour12: false });

const initialTasks: Task[] = [
  {
    id: "task-1",
    name: "春季新品种草计划",
    platform: ["小红书", "抖音"],
    status: "进行中",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
    participants: 234,
    submissions: 456,
    baseReward: 50,
    tierReward: "点赞达 50 +50 积分；点赞达 200 +150 积分",
    startDate: "2026-04-01",
    endDate: "2026-04-30",
    hashtags: ["#春季新品", "#品牌名"],
    keywords: ["新品", "种草", "好用"],
    minFollowers: 1000,
    maxPerUser: 3,
    contentType: "不限",
    description: "围绕春季新品体验、真实使用感受、开箱测评进行内容创作。",
    rewardSpecs: [
      {
        id: "task-1-base",
        kind: "base",
        title: "投稿奖励",
        rewardType: "points",
        amount: 50,
        lotteryChances: 1,
        releaseMode: "after_end",
        releaseDays: 3,
        note: "审核通过后进入待发放，活动结束后统一发放。",
      },
      {
        id: "task-1-ranking",
        kind: "ranking",
        title: "互动排名奖励",
        metric: "likes",
        tiers: [
          { rankStart: 1, rankEnd: 3, rewardType: "points", amount: 200 },
          { rankStart: 4, rankEnd: 10, rewardType: "cash", amount: 30 },
          { rankStart: 11, rankEnd: 30, rewardType: "gift", amount: 1, giftName: "g2" },
        ],
        releaseMode: "after_end",
        releaseDays: 3,
        note: "按单篇内容点赞排名发放，前三档奖励分别包含积分、红包和赠品。",
      },
    ],
  },
  {
    id: "task-2",
    name: "会员日专属福利",
    platform: ["小红书"],
    status: "未开始",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    participants: 89,
    submissions: 132,
    baseReward: 100,
    tierReward: "点赞达 100 +100 积分",
    startDate: "2026-04-25",
    endDate: "2026-05-10",
    hashtags: ["#会员日", "#品牌福利"],
    keywords: ["会员", "福利", "推荐"],
    minFollowers: 800,
    maxPerUser: 2,
    contentType: "图文",
    description: "适合会员福利、低门槛好物推荐、清单分享场景。",
    rewardSpecs: [
      {
        id: "task-2-base",
        kind: "base",
        title: "投稿奖励",
        rewardType: "points",
        amount: 100,
        lotteryChances: 2,
        releaseMode: "after_end",
        releaseDays: 3,
        note: "活动结束后按达标内容统一发放。",
      },
      {
        id: "task-2-fixed",
        kind: "fixed",
        title: "互动量奖励",
        metric: "combined",
        rules: [
          { threshold: 100, rewardType: "points", amount: 100 },
          { threshold: 30, rewardType: "cash", amount: 20 },
          { threshold: 50, rewardType: "gift", amount: 1, giftName: "g2" },
        ],
        releaseMode: "after_end",
        releaseDays: 5,
        note: "单条内容达标后可叠加领取不同档位奖励。",
      },
    ],
  },
  {
    id: "task-3",
    name: "产品体验官招募",
    platform: ["抖音"],
    status: "已结束",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    participants: 56,
    submissions: 78,
    baseReward: 200,
    tierReward: "互动综合排名前 10 额外奖励",
    startDate: "2026-03-15",
    endDate: "2026-03-31",
    hashtags: ["#体验官", "#新品测评"],
    keywords: ["测评", "体验", "真实"],
    minFollowers: 2000,
    maxPerUser: 1,
    contentType: "视频",
    description: "偏向视频测评、开箱、真实体验内容。",
    rewardSpecs: [
      {
        id: "task-3-base",
        kind: "base",
        title: "投稿奖励",
        rewardType: "points",
        amount: 200,
        releaseMode: "after_review",
        releaseDays: 7,
        note: "审核通过后进入待到账状态。",
      },
      {
        id: "task-3-ranking",
        kind: "ranking",
        title: "综合排名奖励",
        metric: "combined",
        tiers: [
          { rankStart: 1, rankEnd: 3, rewardType: "gift", amount: 1, giftName: "g5" },
          { rankStart: 4, rankEnd: 10, rewardType: "points", amount: 300 },
          { rankStart: 11, rankEnd: 20, rewardType: "points", amount: 100 },
        ],
        releaseMode: "after_review",
        releaseDays: 7,
        note: "综合互动表现越高，奖励越高。",
      },
    ],
  },
  {
    id: "task-4",
    name: "夏日清单分享计划",
    platform: ["小红书", "哔哩哔哩"],
    status: "进行中",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80",
    participants: 178,
    submissions: 241,
    baseReward: 80,
    tierReward: "收藏达 80 +80 积分；评论达 20 +120 积分",
    startDate: "2026-05-08",
    endDate: "2026-06-08",
    hashtags: ["#夏日清单", "#生活方式"],
    keywords: ["清单", "分享", "推荐"],
    minFollowers: 1200,
    maxPerUser: 2,
    contentType: "图文",
    description: "围绕夏日好物清单、生活方式推荐和真实体验内容创作。",
    rewardSpecs: [
      {
        id: "task-4-base",
        kind: "base",
        title: "投稿奖励",
        rewardType: "points",
        amount: 80,
        lotteryChances: 1,
        releaseMode: "after_end",
        releaseDays: 3,
        note: "符合规则即可进入投稿奖励队列。",
      },
      {
        id: "task-4-fixed",
        kind: "fixed",
        title: "互动量奖励",
        metric: "collections",
        rules: [
          { threshold: 80, rewardType: "points", amount: 80 },
          { threshold: 20, rewardType: "points", amount: 120 },
          { threshold: 50, rewardType: "cash", amount: 30 },
        ],
        releaseMode: "after_end",
        releaseDays: 3,
        note: "收藏、评论等达到对应阈值时可领取加奖。",
      },
    ],
  },
  {
    id: "task-5",
    name: "节日礼赠种草活动",
    platform: ["抖音"],
    status: "未开始",
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=80",
    participants: 96,
    submissions: 118,
    baseReward: 120,
    tierReward: "互动达标额外加奖 200 积分",
    startDate: "2026-06-15",
    endDate: "2026-07-01",
    hashtags: ["#节日礼赠", "#好物推荐"],
    keywords: ["礼物", "送礼", "种草"],
    minFollowers: 1500,
    maxPerUser: 2,
    contentType: "视频",
    description: "适合礼赠、节日消费、送礼推荐方向的短视频内容。",
    rewardSpecs: [
      {
        id: "task-5-base",
        kind: "base",
        title: "投稿奖励",
        rewardType: "points",
        amount: 120,
        lotteryChances: 3,
        releaseMode: "after_end",
        releaseDays: 3,
        note: "完成发布且内容通过审核后发放。",
      },
      {
        id: "task-5-ranking",
        kind: "ranking",
        title: "综合表现奖励",
        metric: "combined",
        tiers: [
          { rankStart: 1, rankEnd: 3, rewardType: "cash", amount: 100 },
          { rankStart: 4, rankEnd: 10, rewardType: "gift", amount: 1, giftName: "g6" },
        ],
        releaseMode: "after_end",
        releaseDays: 5,
        note: "表现优异内容可额外获得节日专项奖励。",
      },
    ],
  },
  {
    id: "task-6",
    name: "会员权益体验官",
    platform: ["小红书", "抖音"],
    status: "已结束",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
    participants: 302,
    submissions: 388,
    baseReward: 150,
    tierReward: "综合表现优秀者额外奖励",
    startDate: "2026-02-20",
    endDate: "2026-03-20",
    hashtags: ["#会员权益", "#体验官"],
    keywords: ["会员", "权益", "体验"],
    minFollowers: 800,
    maxPerUser: 3,
    contentType: "不限",
    description: "从会员权益、体验感受、使用反馈等角度输出内容。",
    rewardSpecs: [
      {
        id: "task-6-base",
        kind: "base",
        title: "投稿奖励",
        rewardType: "points",
        amount: 150,
        lotteryChances: 2,
        releaseMode: "after_review",
        releaseDays: 7,
        note: "内容审核通过后统一进入待到账。",
      },
      {
        id: "task-6-fixed",
        kind: "fixed",
        title: "达标奖励",
        metric: "combined",
        rules: [
          { threshold: 100, rewardType: "points", amount: 100 },
          { threshold: 30, rewardType: "gift", amount: 1, giftName: "g7" },
          { threshold: 60, rewardType: "cash", amount: 50 },
        ],
        releaseMode: "after_review",
        releaseDays: 7,
        note: "适合多维互动达标场景。",
      },
    ],
  },
];

const initialAccounts: AccountBinding[] = [];

const initialSubmissions: Submission[] = [
  {
    id: "sub-1",
    taskId: "task-1",
    taskName: "春季新品种草计划",
    platform: "小红书",
    title: "春季护肤日记｜用了这款精华真的好用",
    contentUrl: "https://www.xiaohongshu.com/explore/demo-1",
    contentPreview: "春季换季期皮肤容易干，这次分享一款近期很喜欢的精华，真实体验很舒服。",
    submitTime: "2026-04-17 14:30",
    publishTime: "2026-04-16 21:05",
    status: "待审核",
    likes: 125,
    comments: 23,
    collections: 31,
    accountHandle: "@elaine_diary",
    rewardStatus: "待到账",
  },
  {
    id: "sub-2",
    taskId: "task-1",
    taskName: "春季新品种草计划",
    platform: "抖音",
    title: "开箱｜这款新品真的太好用了",
    contentUrl: "https://www.douyin.com/video/demo-2",
    contentPreview: "收到新品后第一时间开箱，分享真实上脸感受，适合做种草展示。",
    submitTime: "2026-04-16 13:15",
    publishTime: "2026-04-16 12:40",
    status: "已通过",
    likes: 456,
    comments: 78,
    collections: 96,
    accountHandle: "@tony_daily",
    rewardStatus: "待到账",
  },
  {
    id: "sub-3",
    taskId: "task-2",
    taskName: "会员日专属福利",
    platform: "小红书",
    title: "会员日好物清单，平价也有高质感",
    contentUrl: "https://www.xiaohongshu.com/explore/demo-3",
    contentPreview: "会员日福利整理成一份清单，适合有购买意愿的用户快速了解。",
    submitTime: "2026-04-15 18:20",
    publishTime: "2026-04-15 17:50",
    status: "已拒绝",
    rejectReason: "内容未包含必须话题标签",
    likes: 89,
    comments: 15,
    collections: 22,
    accountHandle: "@croissant_life",
    rewardStatus: "已失效",
  },
  {
    id: "sub-4",
    taskId: "task-3",
    taskName: "产品体验官招募",
    platform: "抖音",
    title: "体验官实测｜这一轮新品里我最推荐的是它",
    contentUrl: "https://www.douyin.com/video/demo-4",
    contentPreview: "结合真实使用体验做了一条种草视频，重点讲了上手感受和适合人群。",
    submitTime: "2026-04-12 20:10",
    publishTime: "2026-04-12 19:36",
    status: "已通过",
    likes: 628,
    comments: 104,
    collections: 88,
    accountHandle: "@tony_daily",
    rewardStatus: "已到账",
  },
  {
    id: "sub-5",
    taskId: "task-4",
    taskName: "假日穿搭分享季",
    platform: "小红书",
    title: "假日穿搭灵感｜一套搞定通勤和周末约会",
    contentUrl: "https://www.xiaohongshu.com/explore/demo-5",
    contentPreview: "围绕假日穿搭主题做了图文分享，突出搭配灵感和购买建议。",
    submitTime: "2026-04-11 15:42",
    publishTime: "2026-04-11 14:58",
    status: "待审核",
    likes: 74,
    comments: 12,
    collections: 19,
    accountHandle: "@elaine_diary",
    rewardStatus: "待到账",
  },
  {
    id: "sub-6",
    taskId: "task-5",
    taskName: "节日礼赠种草活动",
    platform: "抖音",
    title: "节日礼赠清单｜这 3 款礼物闭眼送都很稳",
    contentUrl: "https://www.douyin.com/video/demo-6",
    contentPreview: "从包装、预算和使用场景切入，整理了一条节日礼赠推荐视频。",
    submitTime: "2026-04-10 11:26",
    publishTime: "2026-04-10 10:50",
    status: "已拒绝",
    rejectReason: "内容已被删除，无法继续参与审核",
    likes: 52,
    comments: 6,
    collections: 9,
    accountHandle: "@gift_hunter",
    rewardStatus: "已失效",
  },
  {
    id: "sub-7",
    taskId: "task-6",
    taskName: "会员权益体验官",
    platform: "哔哩哔哩",
    title: "会员权益体验记录｜哪些福利真的值得开通",
    contentUrl: "https://space.bilibili.com/demo-video-7",
    contentPreview: "从权益价值和使用场景出发做了一条长图文总结，适合做深度种草。",
    submitTime: "2026-04-09 22:08",
    publishTime: "2026-04-09 21:22",
    status: "已通过",
    likes: 318,
    comments: 47,
    collections: 63,
    accountHandle: "@alureview",
    rewardStatus: "已到账",
  },
  {
    id: "sub-8",
    taskId: "task-2",
    taskName: "会员日专属福利",
    platform: "小红书",
    title: "会员日折扣攻略｜怎么买最划算",
    contentUrl: "https://www.xiaohongshu.com/explore/demo-8",
    contentPreview: "整理了活动节奏、优惠力度和推荐单品，适合活动前预热种草。",
    submitTime: "2026-04-08 09:18",
    publishTime: "2026-04-08 08:45",
    status: "已拒绝",
    rejectReason: "内容与任务方向不符",
    likes: 41,
    comments: 8,
    collections: 14,
    accountHandle: "@citywalk_mia",
    rewardStatus: "已失效",
  },
];

const initialRewards: RewardRecord[] = [
  {
    id: "rew-1",
    submissionId: "sub-2",
    taskName: "春季新品种草计划",
    amount: 50,
    status: "待到账",
    createdAt: "2026-04-16 13:16",
    note: "内容通过审核，投稿奖励进入待到账状态",
  },
  {
    id: "rew-2",
    submissionId: "sub-4",
    taskName: "产品体验官招募",
    amount: 200,
    status: "已到账",
    createdAt: "2026-04-12 20:20",
    arrivedAt: "2026-04-15 10:18",
    note: "综合互动表现达标，奖励已发放到账",
  },
  {
    id: "rew-3",
    submissionId: "sub-7",
    taskName: "会员权益体验官",
    amount: 150,
    status: "已到账",
    createdAt: "2026-04-09 22:20",
    arrivedAt: "2026-04-16 09:30",
    note: "内容审核通过后，基础奖励已自动到账",
  },
];

const initialMessages: MessageItem[] = [
  {
    id: "msg-1",
    type: "审核",
    title: "内容已通过审核",
    desc: "春季新品种草计划的提交内容已通过审核，奖励待到账。",
    time: "2026-04-16 13:16",
    read: false,
    target: "/submissions",
  },
  {
    id: "msg-2",
    type: "账号",
    title: "请先完成账号认证",
    desc: "绑定小红书/抖音/哔哩哔哩账号后，可获得对应任务的提交资格。",
    time: "2026-04-16 09:00",
    read: true,
    target: "/account/verify",
  },
];

export function UserH5Provider({ children }: { children: React.ReactNode }) {
  const [tasks] = useState(initialTasks);
  const [accounts, setAccounts] = useState<AccountBinding[]>(initialAccounts);
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [rewards, setRewards] = useState<RewardRecord[]>(initialRewards);
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);

  const verifyAccount: UserH5ContextValue["verifyAccount"] = (platform, payload) => {
    if (!payload.accountName.trim() || !payload.accountHandle.trim() || !payload.profileUrl.trim()) {
      return false;
    }
    if (!payload.profileUrl.includes("http")) {
      return false;
    }

    setAccounts((prev) => {
      const next = prev.filter((item) => item.platform !== platform);
      return [
        ...next,
        {
          platform,
          accountName: payload.accountName,
          accountHandle: payload.accountHandle,
          profileUrl: payload.profileUrl,
          followers: payload.followers,
          works: payload.works,
          verifiedAt: nowText(),
        },
      ];
    });
    setMessages((prev) => [
      {
        id: makeId("msg"),
        type: "账号",
        title: `${platform} 账号认证成功`,
        desc: `${payload.accountHandle} 已完成认证，可用于后续内容提交。`,
        time: nowText(),
        read: false,
        target: "/account",
      },
      ...prev,
    ]);
    return true;
  };

  const unbindAccount = (platform: Platform) => {
    setAccounts((prev) => prev.filter((item) => item.platform !== platform));
    setMessages((prev) => [
      {
        id: makeId("msg"),
        type: "账号",
        title: `${platform} 账号已解绑`,
        desc: "你可以重新进行认证绑定。",
        time: nowText(),
        read: false,
        target: "/account/verify",
      },
      ...prev,
    ]);
  };

  const submitContent: UserH5ContextValue["submitContent"] = (payload) => {
    const task = tasks.find((item) => item.id === payload.taskId);
    if (!task) {
      return { ok: false, message: "未找到对应任务" };
    }

    const linkedAccount = accounts.find((item) => item.platform === payload.platform);
    if (!linkedAccount) {
      return { ok: false, message: "请先完成对应平台账号认证" };
    }

    if (!payload.contentUrl.includes("http")) {
      return { ok: false, message: "链接格式不正确，请粘贴完整内容链接" };
    }

    const existed = submissions.some((item) => item.contentUrl === payload.contentUrl);
    if (existed) {
      return { ok: false, message: "该链接已提交过，不能重复提交" };
    }

    const countInTask = submissions.filter((item) => item.taskId === payload.taskId).length;
    if (countInTask >= task.maxPerUser) {
      return { ok: false, message: `本任务每人最多提交 ${task.maxPerUser} 条内容` };
    }

    const item: Submission = {
      id: makeId("sub"),
      taskId: task.id,
      taskName: task.name,
      platform: payload.platform,
      title: payload.title,
      contentUrl: payload.contentUrl,
      contentPreview: payload.contentPreview,
      submitTime: nowText(),
      publishTime: payload.publishTime,
      status: "待审核",
      likes: Math.floor(Math.random() * 700) + 20,
      comments: Math.floor(Math.random() * 120) + 5,
      collections: Math.floor(Math.random() * 100) + 3,
      accountHandle: payload.accountHandle,
      rewardStatus: "待到账",
    };

    setSubmissions((prev) => [item, ...prev]);
    setMessages((prev) => [
      {
        id: makeId("msg"),
        type: "审核",
        title: "内容已提交，等待审核",
        desc: `${task.name} 的内容提交成功，当前状态为待审核。`,
        time: nowText(),
        read: false,
        target: "/submissions",
      },
      ...prev,
    ]);

    return { ok: true, message: "提交成功，已进入待审核" };
  };

  const approveSubmission = (submissionId: string) => {
    setSubmissions((prev) =>
      prev.map((item) =>
        item.id === submissionId
          ? { ...item, status: "已通过", rewardStatus: "待到账" }
          : item
      )
    );
    setRewards((prev) => {
      const item = submissions.find((sub) => sub.id === submissionId);
      if (!item) return prev;
      const existed = prev.some((reward) => reward.submissionId === submissionId);
      if (existed) return prev;
      const task = tasks.find((taskItem) => taskItem.id === item.taskId);
      const baseSpec = task?.rewardSpecs.find((spec) => spec.kind === "base");
      return [
        {
          id: makeId("rew"),
          submissionId,
          taskName: item.taskName,
          amount: baseSpec?.amount ?? task?.baseReward ?? 50,
          status: "待到账",
          createdAt: nowText(),
          note: baseSpec?.kind === "base" && baseSpec.rewardType === "gift"
            ? `审核通过，${task?.name ?? "任务"} 的赠品奖励待到账`
            : "审核通过，奖励待到账",
        },
        ...prev,
      ];
    });
    setMessages((prev) => [
      {
        id: makeId("msg"),
        type: "审核",
        title: "内容审核通过",
        desc: "你的内容已通过审核，奖励已经进入待到账状态。",
        time: nowText(),
        read: false,
        target: "/rewards",
      },
      ...prev,
    ]);
  };

  const rejectSubmission = (submissionId: string, reason: string) => {
    setSubmissions((prev) =>
      prev.map((item) =>
        item.id === submissionId
          ? { ...item, status: "已拒绝", rejectReason: reason, rewardStatus: "已失效" }
          : item
      )
    );
    setRewards((prev) =>
      prev.map((item) =>
        item.submissionId === submissionId ? { ...item, status: "已失效" } : item
      )
    );
    setMessages((prev) => [
      {
        id: makeId("msg"),
        type: "审核",
        title: "内容审核未通过",
        desc: reason,
        time: nowText(),
        read: false,
        target: "/submissions",
      },
      ...prev,
    ]);
  };

  const settleReward = (rewardId: string) => {
    setRewards((prev) =>
      prev.map((item) =>
        item.id === rewardId
          ? { ...item, status: "已到账", arrivedAt: nowText() }
          : item
      )
    );
    setSubmissions((prev) =>
      prev.map((item) =>
        rewards.some((reward) => reward.id === rewardId && reward.submissionId === item.id)
          ? { ...item, rewardStatus: "已到账" }
          : item
      )
    );
    setMessages((prev) => [
      {
        id: makeId("msg"),
        type: "奖励",
        title: "奖励已到账",
        desc: "积分已经进入你的账户，可前往奖励页查看。",
        time: nowText(),
        read: false,
        target: "/rewards",
      },
      ...prev,
    ]);
  };

  const subscribeTaskStartReminder: UserH5ContextValue["subscribeTaskStartReminder"] = (taskId) => {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) {
      return { ok: false, message: "未找到对应任务" };
    }

    setMessages((prev) => [
      {
        id: makeId("msg"),
        type: "系统",
        title: `${task.name} 开始提醒已订阅`,
        desc: "任务开始后会通过消息中心提醒你来参与。",
        time: nowText(),
        read: false,
        target: "/messages",
      },
      ...prev,
    ]);

    return { ok: true, message: "已订阅任务开始提醒" };
  };

  const subscribeTaskNotification: UserH5ContextValue["subscribeTaskNotification"] = (taskId) => {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) {
      return { ok: false, message: "未找到对应任务" };
    }

    setMessages((prev) => [
      {
        id: makeId("msg"),
        type: "系统",
        title: `${task.name} 消息通知已开启`,
        desc: "任务开始后，相关通知会优先进入消息中心。",
        time: nowText(),
        read: false,
        target: "/messages",
      },
      ...prev,
    ]);

    return { ok: true, message: "已开启消息通知" };
  };

  const markMessageRead = (messageId: string) => {
    setMessages((prev) =>
      prev.map((item) =>
        item.id === messageId ? { ...item, read: true } : item
      )
    );
  };

  const markAllMessagesRead = () => {
    setMessages((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const value = useMemo<UserH5ContextValue>(
    () => ({
      tasks,
      accounts,
      submissions,
      rewards,
      messages,
      verifyAccount,
      unbindAccount,
      submitContent,
      approveSubmission,
      rejectSubmission,
      settleReward,
      subscribeTaskStartReminder,
      subscribeTaskNotification,
      markMessageRead,
      markAllMessagesRead,
    }),
    [tasks, accounts, submissions, rewards, messages]
  );

  return <UserH5Context.Provider value={value}>{children}</UserH5Context.Provider>;
}

export function useUserH5() {
  const ctx = useContext(UserH5Context);
  if (!ctx) {
    throw new Error("useUserH5 must be used within UserH5Provider");
  }
  return ctx;
}
