import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Users, FileText, TrendingUp, Award, Eye } from 'lucide-react';

type ParticipantStatus = '已通过' | '待审核' | '已拒绝';

type TaskParticipant = {
  id: string;
  avatar: string;
  name: string;
  phone: string;
  platform: '小红书' | '抖音' | '哔哩哔哩';
  contentTitle: string;
  submittedAt: string;
  status: ParticipantStatus;
  likes: number;
  comments: number;
  collections: number;
};

type PrizeIssueStatus = '已领取' | '未领取' | '已失效';

type TaskPrizeIssue = {
  id: string;
  avatar: string;
  userName: string;
  phone: string;
  prizeType: '积分' | '赠品' | '现金红包';
  prizeValue: string;
  issuedAt: string;
  status: PrizeIssueStatus;
};

type TaskData = {
  id: string;
  name: string;
  participants: number;
  submissions: number;
  passRate: number;
  rewards: number;
  interactions: Array<{
    platform: string;
    likes: number;
    comments: number;
    collections: number;
  }>;
  participantDetails: TaskParticipant[];
  prizeIssueDetails: TaskPrizeIssue[];
};

const TASK_DATA: Record<string, TaskData> = {
  '1': {
    id: '1',
    name: '春季新品种草计划',
    participants: 234,
    submissions: 456,
    passRate: 78,
    rewards: 19200,
    interactions: [
      { platform: '小红书', likes: 1240, comments: 89, collections: 312 },
      { platform: '抖音', likes: 920, comments: 56, collections: 188 },
    ],
    participantDetails: [
      { id: 'u001', avatar: '🌸', name: '小鹿Elaine', phone: '138****1623', platform: '小红书', contentTitle: '春季护肤日记｜用了这款精华皮肤真的好了', submittedAt: '2026-04-16 14:32', status: '已通过', likes: 1240, comments: 89, collections: 312 },
      { id: 'u002', avatar: '🎵', name: 'Tony的日常', phone: '139****8831', platform: '抖音', contentTitle: '开箱｜这款产品真的太好用了不接受反驳', submittedAt: '2026-04-16 13:08', status: '已通过', likes: 920, comments: 56, collections: 188 },
      { id: 'u013', avatar: '🍃', name: 'Lina晴天', phone: '137****4796', platform: '小红书', contentTitle: '这波新品真的值得冲，使用感超预期', submittedAt: '2026-04-16 09:45', status: '待审核', likes: 488, comments: 31, collections: 102 },
      { id: 'u014', avatar: '🦊', name: '阿橘同学', phone: '136****5521', platform: '小红书', contentTitle: '春日妆容分享，通勤也能很出片', submittedAt: '2026-04-15 20:16', status: '已通过', likes: 402, comments: 22, collections: 86 },
      { id: 'u015', avatar: '🍋', name: '柠檬汽水', phone: '135****7433', platform: '抖音', contentTitle: '平价替代测评，这几款真能打', submittedAt: '2026-04-15 18:43', status: '待审核', likes: 355, comments: 19, collections: 70 },
      { id: 'u016', avatar: '🎀', name: 'Yoyo酱', phone: '134****9287', platform: '小红书', contentTitle: '敏感肌一周体验记录，真实反馈', submittedAt: '2026-04-15 16:21', status: '已通过', likes: 511, comments: 28, collections: 95 },
      { id: 'u017', avatar: '🧃', name: '可可早安', phone: '133****4408', platform: '抖音', contentTitle: '30秒看完新品亮点，不踩雷指南', submittedAt: '2026-04-15 11:05', status: '已通过', likes: 468, comments: 33, collections: 79 },
      { id: 'u018', avatar: '🌼', name: '木木日记', phone: '132****7912', platform: '小红书', contentTitle: '春季护肤搭配思路，干皮亲测有效', submittedAt: '2026-04-14 22:38', status: '待审核', likes: 297, comments: 17, collections: 58 },
      { id: 'u019', avatar: '🎬', name: '镜头里的安安', phone: '131****6645', platform: '哔哩哔哩', contentTitle: '全流程开箱+使用对比，建议收藏', submittedAt: '2026-04-14 19:44', status: '已通过', likes: 632, comments: 40, collections: 121 },
      { id: 'u020', avatar: '🐳', name: '阿蓝爱生活', phone: '130****2054', platform: '小红书', contentTitle: '高性价比护肤组合，这套我无限回购', submittedAt: '2026-04-14 15:27', status: '已拒绝', likes: 180, comments: 9, collections: 21 },
      { id: 'u023', avatar: '🍑', name: '桃子酱', phone: '189****3016', platform: '抖音', contentTitle: '新品实测：早晚用法和效果差异', submittedAt: '2026-04-14 13:12', status: '已通过', likes: 420, comments: 24, collections: 75 },
      { id: 'u024', avatar: '🪐', name: '北极星', phone: '188****4720', platform: '小红书', contentTitle: '新手也能看懂的成分党科普', submittedAt: '2026-04-14 10:48', status: '待审核', likes: 266, comments: 12, collections: 43 },
      { id: 'u025', avatar: '☕', name: 'Morning咖', phone: '187****5589', platform: '哔哩哔哩', contentTitle: '一周跟拍：新品到底值不值得买', submittedAt: '2026-04-13 21:30', status: '已通过', likes: 706, comments: 52, collections: 138 },
      { id: 'u026', avatar: '🍉', name: '夏天不迟到', phone: '186****6402', platform: '抖音', contentTitle: '预算100内，能买到哪些好物？', submittedAt: '2026-04-13 18:04', status: '待审核', likes: 244, comments: 14, collections: 39 },
      { id: 'u027', avatar: '🦄', name: '软糖星球', phone: '185****7168', platform: '小红书', contentTitle: '实拍对比：连续7天使用前后变化', submittedAt: '2026-04-13 14:51', status: '已通过', likes: 538, comments: 30, collections: 97 },
    ],
    prizeIssueDetails: [
      { id: 'p001', avatar: '🌸', userName: '小鹿Elaine', phone: '138****1623', prizeType: '积分', prizeValue: '50积分', issuedAt: '2026-04-17 10:22', status: '已领取' },
      { id: 'p002', avatar: '🎵', userName: 'Tony的日常', phone: '139****8831', prizeType: '积分', prizeValue: '50积分', issuedAt: '2026-04-17 10:22', status: '已领取' },
      { id: 'p003', avatar: '🍃', userName: 'Lina晴天', phone: '137****4796', prizeType: '积分', prizeValue: '50积分', issuedAt: '—', status: '未领取' },
      { id: 'p004', avatar: '🧢', userName: '阿诺测评', phone: '136****4059', prizeType: '赠品', prizeValue: '品牌联名帆布包', issuedAt: '2026-04-18 16:20', status: '已领取' },
      { id: 'p005', avatar: '🍓', userName: 'Momo爱分享', phone: '135****9082', prizeType: '现金红包', prizeValue: '20元', issuedAt: '—', status: '未领取' },
      { id: 'p006', avatar: '🌊', userName: '南风Vlog', phone: '132****6615', prizeType: '现金红包', prizeValue: '10元', issuedAt: '2026-04-18 20:45', status: '已领取' },
      { id: 'p007', avatar: '🦊', userName: '阿橘同学', phone: '136****5521', prizeType: '积分', prizeValue: '50积分', issuedAt: '2026-04-18 09:13', status: '已领取' },
      { id: 'p008', avatar: '🍋', userName: '柠檬汽水', phone: '135****7433', prizeType: '赠品', prizeValue: '联名保温杯', issuedAt: '—', status: '未领取' },
      { id: 'p009', avatar: '🎀', userName: 'Yoyo酱', phone: '134****9287', prizeType: '现金红包', prizeValue: '25元', issuedAt: '2026-04-18 11:56', status: '已领取' },
      { id: 'p010', avatar: '🧃', userName: '可可早安', phone: '133****4408', prizeType: '积分', prizeValue: '80积分', issuedAt: '2026-04-18 12:20', status: '已领取' },
      { id: 'p011', avatar: '🌼', userName: '木木日记', phone: '132****7912', prizeType: '现金红包', prizeValue: '15元', issuedAt: '—', status: '未领取' },
      { id: 'p012', avatar: '🎬', userName: '镜头里的安安', phone: '131****6645', prizeType: '赠品', prizeValue: '新品体验礼盒', issuedAt: '2026-04-18 15:44', status: '已领取' },
      { id: 'p013', avatar: '🐳', userName: '阿蓝爱生活', phone: '130****2054', prizeType: '积分', prizeValue: '20积分', issuedAt: '—', status: '已失效' },
      { id: 'p014', avatar: '🍑', userName: '桃子酱', phone: '189****3016', prizeType: '现金红包', prizeValue: '30元', issuedAt: '2026-04-18 17:02', status: '已领取' },
      { id: 'p015', avatar: '🪐', userName: '北极星', phone: '188****4720', prizeType: '赠品', prizeValue: '定制帆布袋', issuedAt: '—', status: '未领取' },
      { id: 'p016', avatar: '☕', userName: 'Morning咖', phone: '187****5589', prizeType: '积分', prizeValue: '60积分', issuedAt: '2026-04-18 19:11', status: '已领取' },
      { id: 'p017', avatar: '🍉', userName: '夏天不迟到', phone: '186****6402', prizeType: '现金红包', prizeValue: '10元', issuedAt: '—', status: '未领取' },
      { id: 'p018', avatar: '🦄', userName: '软糖星球', phone: '185****7168', prizeType: '赠品', prizeValue: 'IP徽章套装', issuedAt: '2026-04-18 20:30', status: '已领取' },
    ],
  },
  '2': {
    id: '2',
    name: '会员日专属福利',
    participants: 89,
    submissions: 132,
    passRate: 74,
    rewards: 8600,
    interactions: [
      { platform: '小红书', likes: 541, comments: 29, collections: 67 },
    ],
    participantDetails: [
      { id: 'u021', avatar: '🌈', name: '彩虹豌豆', phone: '131****2477', platform: '小红书', contentTitle: '会员日好物清单，平价也有高质感', submittedAt: '2026-04-15 14:05', status: '待审核', likes: 334, comments: 21, collections: 55 },
      { id: 'u022', avatar: '🧁', name: '奶油可可', phone: '130****5391', platform: '小红书', contentTitle: '会员福利第一波，闭眼入不踩雷', submittedAt: '2026-04-15 12:22', status: '已通过', likes: 541, comments: 29, collections: 67 },
    ],
    prizeIssueDetails: [
      { id: 'p021', avatar: '🧁', userName: '奶油可可', phone: '130****5391', prizeType: '积分', prizeValue: '50积分', issuedAt: '2026-04-16 09:11', status: '已领取' },
      { id: 'p022', avatar: '🌈', userName: '彩虹豌豆', phone: '131****2477', prizeType: '赠品', prizeValue: '品牌周边礼盒', issuedAt: '—', status: '未领取' },
    ],
  },
  '3': {
    id: '3',
    name: '产品体验官招募',
    participants: 56,
    submissions: 78,
    passRate: 69,
    rewards: 5600,
    interactions: [
      { platform: '抖音', likes: 334, comments: 21, collections: 55 },
    ],
    participantDetails: [
      { id: 'u031', avatar: '🔥', name: '大头爱摄影', phone: '189****2246', platform: '抖音', contentTitle: '体验官开箱实测，素人真实感受', submittedAt: '2026-04-15 18:49', status: '待审核', likes: 334, comments: 21, collections: 55 },
      { id: 'u032', avatar: '⭐', name: '星星点灯er', phone: '187****3302', platform: '抖音', contentTitle: '真实vlog：试用新品的一天', submittedAt: '2026-04-14 23:15', status: '已拒绝', likes: 78, comments: 5, collections: 9 },
    ],
    prizeIssueDetails: [
      { id: 'p031', avatar: '🔥', userName: '大头爱摄影', phone: '189****2246', prizeType: '现金红包', prizeValue: '10元', issuedAt: '—', status: '未领取' },
      { id: 'p032', avatar: '⭐', userName: '星星点灯er', phone: '187****3302', prizeType: '积分', prizeValue: '30积分', issuedAt: '2026-04-15 11:20', status: '已失效' },
    ],
  },
  '4': {
    id: '4',
    name: '哔哩哔哩开箱挑战赛',
    participants: 112,
    submissions: 180,
    passRate: 72,
    rewards: 10400,
    interactions: [
      { platform: '哔哩哔哩', likes: 621, comments: 47, collections: 98 },
    ],
    participantDetails: [
      { id: 'u041', avatar: '📺', name: 'Vivian爱生活', phone: '186****7841', platform: '哔哩哔哩', contentTitle: '【测评】春夏必备好物合集，这几款超推荐', submittedAt: '2026-04-16 12:45', status: '待审核', likes: 621, comments: 47, collections: 98 },
      { id: 'u042', avatar: '🦋', name: 'Sophie甜酒', phone: '185****9036', platform: '哔哩哔哩', contentTitle: '护肤科普向｜成分党如何挑选适合自己的产品', submittedAt: '2026-04-15 20:33', status: '已通过', likes: 1290, comments: 84, collections: 206 },
    ],
    prizeIssueDetails: [
      { id: 'p041', avatar: '📺', userName: 'Vivian爱生活', phone: '186****7841', prizeType: '赠品', prizeValue: '体验装礼盒', issuedAt: '—', status: '未领取' },
      { id: 'p042', avatar: '🦋', userName: 'Sophie甜酒', phone: '185****9036', prizeType: '积分', prizeValue: '50积分', issuedAt: '2026-04-16 18:36', status: '已领取' },
    ],
  },
  '5': {
    id: '5',
    name: '五一出游穿搭征集',
    participants: 148,
    submissions: 221,
    passRate: 76,
    rewards: 9300,
    interactions: [{ platform: '小红书', likes: 732, comments: 48, collections: 116 }],
    participantDetails: [
      { id: 'u051', avatar: '👒', name: '旅行小夏', phone: '139****2012', platform: '小红书', contentTitle: '五一出游穿搭合集，显瘦又上镜', submittedAt: '2026-04-20 12:10', status: '已通过', likes: 402, comments: 27, collections: 66 },
      { id: 'u052', avatar: '🧳', name: 'Mina在路上', phone: '137****6632', platform: '小红书', contentTitle: '三套万能出游穿搭，直接照抄', submittedAt: '2026-04-20 15:46', status: '待审核', likes: 330, comments: 21, collections: 50 },
    ],
    prizeIssueDetails: [
      { id: 'p051', avatar: '👒', userName: '旅行小夏', phone: '139****2012', prizeType: '积分', prizeValue: '60积分', issuedAt: '2026-04-21 09:20', status: '已领取' },
      { id: 'p052', avatar: '🧳', userName: 'Mina在路上', phone: '137****6632', prizeType: '现金红包', prizeValue: '20元', issuedAt: '—', status: '未领取' },
    ],
  },
  '6': {
    id: '6',
    name: '母亲节好物推荐',
    participants: 95,
    submissions: 130,
    passRate: 73,
    rewards: 7600,
    interactions: [{ platform: '抖音', likes: 520, comments: 32, collections: 61 }],
    participantDetails: [
      { id: 'u061', avatar: '💐', name: '礼物研究所', phone: '136****7510', platform: '抖音', contentTitle: '母亲节礼物清单，实用不踩雷', submittedAt: '2026-05-01 10:42', status: '已通过', likes: 298, comments: 19, collections: 41 },
      { id: 'u062', avatar: '🎁', name: '阿木推荐', phone: '138****9426', platform: '抖音', contentTitle: '送妈妈什么？这几款口碑超好', submittedAt: '2026-05-01 14:38', status: '待审核', likes: 222, comments: 13, collections: 20 },
    ],
    prizeIssueDetails: [
      { id: 'p061', avatar: '💐', userName: '礼物研究所', phone: '136****7510', prizeType: '赠品', prizeValue: '品牌礼盒', issuedAt: '2026-05-02 11:30', status: '已领取' },
      { id: 'p062', avatar: '🎁', userName: '阿木推荐', phone: '138****9426', prizeType: '积分', prizeValue: '80积分', issuedAt: '—', status: '未领取' },
    ],
  },
  '7': {
    id: '7',
    name: '春夏轻薄底妆挑战',
    participants: 173,
    submissions: 248,
    passRate: 80,
    rewards: 11200,
    interactions: [{ platform: '抖音', likes: 880, comments: 61, collections: 102 }],
    participantDetails: [
      { id: 'u071', avatar: '🪞', name: '底妆实验室', phone: '135****3250', platform: '抖音', contentTitle: '轻薄底妆全天持妆实测', submittedAt: '2026-04-12 09:30', status: '已通过', likes: 510, comments: 34, collections: 55 },
      { id: 'u072', avatar: '✨', name: '糖糖美妆', phone: '137****1294', platform: '抖音', contentTitle: '毛孔肌也能用的春夏底妆', submittedAt: '2026-04-12 16:08', status: '已通过', likes: 370, comments: 27, collections: 47 },
    ],
    prizeIssueDetails: [
      { id: 'p071', avatar: '🪞', userName: '底妆实验室', phone: '135****3250', prizeType: '现金红包', prizeValue: '30元', issuedAt: '2026-04-13 12:01', status: '已领取' },
      { id: 'p072', avatar: '✨', userName: '糖糖美妆', phone: '137****1294', prizeType: '积分', prizeValue: '50积分', issuedAt: '2026-04-13 12:10', status: '已领取' },
    ],
  },
  '8': {
    id: '8',
    name: '新品成分科普周',
    participants: 68,
    submissions: 96,
    passRate: 71,
    rewards: 5800,
    interactions: [{ platform: '哔哩哔哩', likes: 412, comments: 29, collections: 68 }],
    participantDetails: [
      { id: 'u081', avatar: '🧪', name: '配方拆解站', phone: '186****2109', platform: '哔哩哔哩', contentTitle: '新品核心成分科普，一看就懂', submittedAt: '2026-03-21 11:25', status: '已通过', likes: 269, comments: 18, collections: 43 },
      { id: 'u082', avatar: '📘', name: '成分党Leo', phone: '188****8821', platform: '哔哩哔哩', contentTitle: '真有用还是噱头？成分解析来了', submittedAt: '2026-03-21 17:10', status: '已拒绝', likes: 143, comments: 11, collections: 25 },
    ],
    prizeIssueDetails: [
      { id: 'p081', avatar: '🧪', userName: '配方拆解站', phone: '186****2109', prizeType: '积分', prizeValue: '120积分', issuedAt: '2026-03-22 10:35', status: '已领取' },
      { id: 'p082', avatar: '📘', userName: '成分党Leo', phone: '188****8821', prizeType: '积分', prizeValue: '30积分', issuedAt: '—', status: '已失效' },
    ],
  },
  '9': {
    id: '9',
    name: '618预热清单投稿',
    participants: 124,
    submissions: 188,
    passRate: 75,
    rewards: 9400,
    interactions: [{ platform: '小红书', likes: 610, comments: 42, collections: 93 }],
    participantDetails: [
      { id: 'u091', avatar: '🛍️', name: '好物雷达', phone: '130****5832', platform: '小红书', contentTitle: '618预热清单第一波，先收藏', submittedAt: '2026-05-16 13:44', status: '已通过', likes: 358, comments: 23, collections: 54 },
      { id: 'u092', avatar: '🧾', name: '精打细算阿七', phone: '132****7955', platform: '小红书', contentTitle: '预算党必看：618怎么买最划算', submittedAt: '2026-05-16 18:22', status: '待审核', likes: 252, comments: 19, collections: 39 },
    ],
    prizeIssueDetails: [
      { id: 'p091', avatar: '🛍️', userName: '好物雷达', phone: '130****5832', prizeType: '现金红包', prizeValue: '20元', issuedAt: '2026-05-17 09:40', status: '已领取' },
      { id: 'p092', avatar: '🧾', userName: '精打细算阿七', phone: '132****7955', prizeType: '赠品', prizeValue: '优惠券礼包', issuedAt: '—', status: '未领取' },
    ],
  },
  '10': {
    id: '10',
    name: '敏感肌修护实测',
    participants: 211,
    submissions: 309,
    passRate: 82,
    rewards: 13100,
    interactions: [{ platform: '小红书', likes: 1180, comments: 77, collections: 145 }],
    participantDetails: [
      { id: 'u101', avatar: '🫧', name: '敏感肌阿圆', phone: '139****4602', platform: '小红书', contentTitle: '7天修护记录，泛红真的有改善', submittedAt: '2026-04-09 09:40', status: '已通过', likes: 640, comments: 41, collections: 79 },
      { id: 'u102', avatar: '🌙', name: '夜间修护室', phone: '137****7133', platform: '小红书', contentTitle: '敏感肌护肤流程，少走弯路', submittedAt: '2026-04-09 19:27', status: '已通过', likes: 540, comments: 36, collections: 66 },
    ],
    prizeIssueDetails: [
      { id: 'p101', avatar: '🫧', userName: '敏感肌阿圆', phone: '139****4602', prizeType: '赠品', prizeValue: '修护套装', issuedAt: '2026-04-10 10:15', status: '已领取' },
      { id: 'p102', avatar: '🌙', userName: '夜间修护室', phone: '137****7133', prizeType: '积分', prizeValue: '100积分', issuedAt: '2026-04-10 10:20', status: '已领取' },
    ],
  },
  '11': {
    id: '11',
    name: '晚间护肤打卡计划',
    participants: 133,
    submissions: 177,
    passRate: 72,
    rewards: 6900,
    interactions: [{ platform: '抖音', likes: 520, comments: 39, collections: 71 }],
    participantDetails: [
      { id: 'u111', avatar: '🌃', name: '晚安护肤', phone: '158****6441', platform: '抖音', contentTitle: '连续打卡14天，状态肉眼可见提升', submittedAt: '2026-03-29 22:11', status: '已通过', likes: 303, comments: 21, collections: 38 },
      { id: 'u112', avatar: '🛏️', name: '睡前仪式感', phone: '159****1882', platform: '抖音', contentTitle: '晚间护肤三步走，简单又稳定', submittedAt: '2026-03-30 00:08', status: '待审核', likes: 217, comments: 18, collections: 33 },
    ],
    prizeIssueDetails: [
      { id: 'p111', avatar: '🌃', userName: '晚安护肤', phone: '158****6441', prizeType: '积分', prizeValue: '40积分', issuedAt: '2026-03-30 10:05', status: '已领取' },
      { id: 'p112', avatar: '🛏️', userName: '睡前仪式感', phone: '159****1882', prizeType: '现金红包', prizeValue: '10元', issuedAt: '—', status: '未领取' },
    ],
  },
  '12': {
    id: '12',
    name: '学生党平价好物推荐',
    participants: 186,
    submissions: 265,
    passRate: 79,
    rewards: 9900,
    interactions: [{ platform: '小红书', likes: 850, comments: 58, collections: 118 }],
    participantDetails: [
      { id: 'u121', avatar: '🎒', name: '学生党琳琳', phone: '156****9024', platform: '小红书', contentTitle: '百元内平价好物合集，开学必备', submittedAt: '2026-04-03 14:09', status: '已通过', likes: 482, comments: 33, collections: 61 },
      { id: 'u122', avatar: '📚', name: '寝室测评官', phone: '157****3201', platform: '小红书', contentTitle: '宿舍党超实用单品，这些真香', submittedAt: '2026-04-03 19:26', status: '待审核', likes: 368, comments: 25, collections: 57 },
    ],
    prizeIssueDetails: [
      { id: 'p121', avatar: '🎒', userName: '学生党琳琳', phone: '156****9024', prizeType: '积分', prizeValue: '55积分', issuedAt: '2026-04-04 11:13', status: '已领取' },
      { id: 'p122', avatar: '📚', userName: '寝室测评官', phone: '157****3201', prizeType: '赠品', prizeValue: '文具礼包', issuedAt: '—', status: '未领取' },
    ],
  },
};

function getPublishTime(submittedAt: string, participantId: string) {
  const dt = new Date(submittedAt.replace(' ', 'T'));
  if (Number.isNaN(dt.getTime())) return submittedAt;

  const numericId = parseInt(participantId.replace(/\D/g, ''), 10) || 1;
  const offsetHours = (numericId % 3) + 1;
  dt.setHours(dt.getHours() - offsetHours);

  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const d = String(dt.getDate()).padStart(2, '0');
  const hh = String(dt.getHours()).padStart(2, '0');
  const mm = String(dt.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm}`;
}

function getPlatformContentUrl(platform: TaskParticipant['platform']) {
  if (platform === '小红书') return 'https://www.xiaohongshu.com/';
  if (platform === '抖音') return 'https://www.douyin.com/';
  return 'https://www.bilibili.com/';
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

const STATUS_CONFIG: Record<ParticipantStatus, { color: string; bg: string; border: string }> = {
  '已通过': { color: 'rgba(82,196,26,1)', bg: 'rgba(82,196,26,0.08)', border: 'rgba(82,196,26,0.25)' },
  '待审核': { color: 'rgba(250,173,20,1)', bg: 'rgba(250,173,20,0.08)', border: 'rgba(250,173,20,0.25)' },
  '已拒绝': { color: 'rgba(255,77,79,1)', bg: 'rgba(255,77,79,0.08)', border: 'rgba(255,77,79,0.25)' },
};

type DeliveryStatus = '已发放' | '发放失败';

const DELIVERY_STATUS_CONFIG: Record<DeliveryStatus, { color: string; bg: string; border: string }> = {
  '已发放': { color: 'rgba(82,196,26,1)', bg: 'rgba(82,196,26,0.08)', border: 'rgba(82,196,26,0.25)' },
  '发放失败': { color: 'rgba(255,77,79,1)', bg: 'rgba(255,77,79,0.08)', border: 'rgba(255,77,79,0.25)' },
};

function toDeliveryStatus(status: PrizeIssueStatus): DeliveryStatus {
  return status === '已领取' ? '已发放' : '发放失败';
}

function KpiCard({
  label,
  value,
  icon: Icon,
  accent,
  suffix,
  tooltip,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  accent: string;
  suffix?: string;
  tooltip: string;
}) {
  const [showTip, setShowTip] = useState(false);

  return (
    <div
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '14px 16px',
        boxShadow: 'var(--elevation-sm)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <Icon size={16} style={{ color: accent }} />
        <span style={{ fontSize: '12px', color: 'var(--muted-foreground)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          {label}
          <span
            onMouseEnter={() => setShowTip(true)}
            onMouseLeave={() => setShowTip(false)}
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '14px',
              height: '14px',
              borderRadius: '999px',
              border: '1px solid rgba(148,163,184,0.9)',
              color: 'rgba(100,116,139,1)',
              fontSize: '10px',
              lineHeight: 1,
              cursor: 'help',
              background: '#fff',
            }}
          >
            ?
            {showTip && (
              <span
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: 'calc(100% + 8px)',
                  transform: 'translateX(-50%)',
                  minWidth: '180px',
                  maxWidth: '240px',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  background: 'rgba(15,23,42,0.94)',
                  color: '#fff',
                  fontSize: '11px',
                  lineHeight: 1.5,
                  fontWeight: 400,
                  boxShadow: '0 10px 26px rgba(15,23,42,0.32)',
                  whiteSpace: 'normal',
                  zIndex: 20,
                  pointerEvents: 'none',
                }}
              >
                {tooltip}
                <span
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '100%',
                    marginLeft: '-5px',
                    width: 0,
                    height: 0,
                    borderLeft: '5px solid transparent',
                    borderRight: '5px solid transparent',
                    borderTop: '6px solid rgba(15,23,42,0.94)',
                  }}
                />
              </span>
            )}
          </span>
        </span>
      </div>
      <div style={{ fontSize: '24px', fontWeight: 'var(--font-weight-semibold)', color: accent, lineHeight: 1.2 }}>
        {value}
        {suffix ? <span style={{ fontSize: '14px', marginLeft: '4px' }}>{suffix}</span> : null}
      </div>
    </div>
  );
}

export function TaskDataDetail() {
  const PAGE_SIZE = 10;
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const data = TASK_DATA[id];
  const [detailTab, setDetailTab] = useState<'participants' | 'prizes'>('participants');
  const [participantPhoneQuery, setParticipantPhoneQuery] = useState('');
  const [prizePhoneQuery, setPrizePhoneQuery] = useState('');
  const [participantStatusFilter, setParticipantStatusFilter] = useState<'all' | ParticipantStatus>('all');
  const [prizeStatusFilter, setPrizeStatusFilter] = useState<'all' | DeliveryStatus>('all');
  const [participantPage, setParticipantPage] = useState(1);
  const [prizePage, setPrizePage] = useState(1);

  if (!data) {
    return (
      <div style={{ padding: '24px' }}>
        <button
          onClick={() => navigate('/backend/tasks')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--accent)',
            fontSize: 'var(--text-base)',
            padding: 0,
            marginBottom: '14px',
          }}
        >
          <ArrowLeft size={15} />
          返回任务列表
        </button>
        <div style={{ color: 'var(--muted-foreground)' }}>未找到该活动的数据</div>
      </div>
    );
  }

  const totalLikes = data.participantDetails.reduce((sum, item) => sum + item.likes, 0);
  const totalComments = data.participantDetails.reduce((sum, item) => sum + item.comments, 0);
  const totalCollections = data.participantDetails.reduce((sum, item) => sum + item.collections, 0);
  const estimatedExposure = estimateExposureFromInteractions(totalLikes, totalComments, totalCollections);
  const filteredParticipants = data.participantDetails.filter((item) => {
    const matchPhone = item.phone.includes(participantPhoneQuery.trim());
    const matchStatus = participantStatusFilter === 'all' || item.status === participantStatusFilter;
    return matchPhone && matchStatus;
  });
  const filteredPrizeIssues = data.prizeIssueDetails.filter((item) => {
    const matchPhone = item.phone.includes(prizePhoneQuery.trim());
    const matchStatus = prizeStatusFilter === 'all' || toDeliveryStatus(item.status) === prizeStatusFilter;
    return matchPhone && matchStatus;
  });
  const participantTotalPages = Math.max(1, Math.ceil(filteredParticipants.length / PAGE_SIZE));
  const prizeTotalPages = Math.max(1, Math.ceil(filteredPrizeIssues.length / PAGE_SIZE));
  const safeParticipantPage = Math.min(participantPage, participantTotalPages);
  const safePrizePage = Math.min(prizePage, prizeTotalPages);
  const pagedParticipants = filteredParticipants.slice((safeParticipantPage - 1) * PAGE_SIZE, safeParticipantPage * PAGE_SIZE);
  const pagedPrizeIssues = filteredPrizeIssues.slice((safePrizePage - 1) * PAGE_SIZE, safePrizePage * PAGE_SIZE);

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button
          onClick={() => navigate('/backend/tasks')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--accent)',
            fontSize: 'var(--text-base)',
            padding: 0,
          }}
        >
          <ArrowLeft size={15} />
          返回任务列表
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '12px', marginBottom: '16px' }}>
        <KpiCard
          label="总参与人数"
          tooltip="统计当前任务中提交并参与活动的去重用户人数。"
          value={data.participants.toLocaleString()}
          icon={Users}
          accent="rgba(36,116,255,1)"
        />
        <KpiCard
          label="内容提交量"
          tooltip="统计当前任务下用户提交的内容总条数。"
          value={data.submissions.toLocaleString()}
          icon={FileText}
          accent="rgba(82,196,26,1)"
        />
        <KpiCard
          label="审核通过率"
          tooltip="通过内容数 ÷ 已审核内容数，反映内容质量通过情况。"
          value={String(data.passRate)}
          suffix="%"
          icon={TrendingUp}
          accent="rgba(250,173,20,1)"
        />
        <KpiCard
          label="积分发放总量 "
          tooltip="当前任务已发放的积分总和。"
          value={data.rewards.toLocaleString()}
          icon={Award}
          accent="rgba(255,77,79,1)"
        />
        <KpiCard
          label="抽奖机会发放总量"
          tooltip="当前任务已发放的抽奖机会总和 。"
          value={(estimatedExposure / 10000).toFixed(1)}
          icon={Eye}
          accent="rgba(60,153,216,1)"
        />
      </div>

      <div
        style={{
          marginTop: '16px',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--elevation-sm)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--muted)' }}>
          <div style={{ display: 'inline-flex', gap: '16px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => {
                setDetailTab('participants');
                setParticipantPage(1);
              }}
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: 'var(--text-h4)',
                fontWeight: 'var(--font-weight-semibold)',
                color: detailTab === 'participants' ? 'var(--accent)' : 'var(--foreground)',
                padding: 0,
              }}
            >
              参与人明细
            </button>
            <button
              type="button"
              onClick={() => {
                setDetailTab('prizes');
                setPrizePage(1);
              }}
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: 'var(--text-h4)',
                fontWeight: 'var(--font-weight-semibold)',
                color: detailTab === 'prizes' ? 'var(--accent)' : 'var(--foreground)',
                padding: 0,
              }}
            >
              奖品发放明细
            </button>
          </div>
        </div>

        <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--border)', background: 'var(--card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>手机号：</span>
              <input
                value={detailTab === 'participants' ? participantPhoneQuery : prizePhoneQuery}
                onChange={(event) => {
                  if (detailTab === 'participants') {
                    setParticipantPhoneQuery(event.target.value);
                    setParticipantPage(1);
                  } else {
                    setPrizePhoneQuery(event.target.value);
                    setPrizePage(1);
                  }
                }}
                placeholder="输入手机号查询"
                style={{
                  width: '220px',
                  height: '32px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  fontSize: '12px',
                  padding: '0 10px',
                  outline: 'none',
                }}
              />
            </div>

            {detailTab === 'participants' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>审核状态：</span>
                <select
                  value={participantStatusFilter}
                  onChange={(event) => {
                    setParticipantStatusFilter(event.target.value as 'all' | ParticipantStatus);
                    setParticipantPage(1);
                  }}
                  style={{
                    height: '32px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--background)',
                    color: 'var(--foreground)',
                    fontSize: '12px',
                    padding: '0 10px',
                    outline: 'none',
                    minWidth: '120px',
                  }}
                >
                  <option value="all">全部</option>
                  <option value="已通过">已通过</option>
                  <option value="待审核">待审核</option>
                  <option value="已拒绝">已拒绝</option>
                </select>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>发放状态：</span>
                <select
                  value={prizeStatusFilter}
                  onChange={(event) => {
                    setPrizeStatusFilter(event.target.value as 'all' | DeliveryStatus);
                    setPrizePage(1);
                  }}
                  style={{
                    height: '32px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--background)',
                    color: 'var(--foreground)',
                    fontSize: '12px',
                    padding: '0 10px',
                    outline: 'none',
                    minWidth: '120px',
                  }}
                >
                  <option value="all">全部</option>
                  <option value="已发放">已发放</option>
                  <option value="发放失败">发放失败</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', background: 'var(--card)' }}>
          <div style={{ fontSize: '13px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
            {detailTab === 'participants' ? '内容审核明细' : '奖品发放明细'}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          {detailTab === 'participants' ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-base)' }}>
              <thead>
                <tr style={{ background: 'var(--muted)' }}>
                  {['参与用户', '内容标题', '链接', '提交时间', '发布时间', '审核状态'].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '10px 16px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--foreground)',
                        borderBottom: '1px solid var(--border)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagedParticipants.map((p, idx) => {
                  const sc = STATUS_CONFIG[p.status];
                  const isLast = idx === pagedParticipants.length - 1;
                  return (
                    <tr key={p.id} style={{ borderBottom: isLast ? 'none' : '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0, background: 'var(--muted)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                            {p.avatar}
                          </div>
                          <div>
                            <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>{p.name}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', maxWidth: '280px' }}>
                        <span style={{ color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }} title={p.contentTitle}>
                          {p.contentTitle}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <a
                          href={getPlatformContentUrl(p.platform)}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '12px', fontWeight: 'var(--font-weight-medium)' }}
                        >
                          查看内容
                        </a>
                      </td>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', color: 'var(--muted-foreground)', fontSize: '12px' }}>
                        {p.submittedAt}
                      </td>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', color: 'var(--muted-foreground)', fontSize: '12px' }}>
                        {getPublishTime(p.submittedAt, p.id)}
                      </td>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: 'var(--font-weight-medium)', color: sc.color, background: sc.bg, border: `1px solid ${sc.border}` }}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-base)' }}>
              <thead>
                <tr style={{ background: 'var(--muted)' }}>
                  {['用户昵称', '奖励类型', '奖励值', '发放时间', '发放状态'].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '10px 16px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--foreground)',
                        borderBottom: '1px solid var(--border)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagedPrizeIssues.map((item, idx) => {
                  const deliveryStatus = toDeliveryStatus(item.status);
                  const issueStatus = DELIVERY_STATUS_CONFIG[deliveryStatus];
                  const isLast = idx === pagedPrizeIssues.length - 1;
                  return (
                    <tr key={item.id} style={{ borderBottom: isLast ? 'none' : '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0, background: 'var(--muted)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                            {item.avatar}
                          </div>
                          <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>{item.userName}</div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>{item.prizeType}</td>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', color: 'rgba(36,116,255,1)', fontWeight: 'var(--font-weight-medium)' }}>{item.prizeValue}</td>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', color: 'var(--muted-foreground)', fontSize: '12px' }}>{item.issuedAt}</td>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: 'var(--font-weight-medium)', color: issueStatus.color, background: issueStatus.bg, border: `1px solid ${issueStatus.border}` }}>
                          {deliveryStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--border)',
            background: 'var(--card)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
          }}
        >
          {detailTab === 'participants' ? (
            <>
              <button
                type="button"
                onClick={() => setParticipantPage((prev) => Math.max(1, prev - 1))}
                disabled={safeParticipantPage === 1}
                style={{
                  height: '30px',
                  padding: '0 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                  color: safeParticipantPage === 1 ? 'var(--muted-foreground)' : 'var(--foreground)',
                  cursor: safeParticipantPage === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                上一页
              </button>
              {Array.from({ length: participantTotalPages }, (_, i) => i + 1).map((page) => {
                const active = page === safeParticipantPage;
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setParticipantPage(page)}
                    style={{
                      minWidth: '30px',
                      height: '30px',
                      padding: '0 8px',
                      borderRadius: '6px',
                      border: active ? '1px solid var(--accent)' : '1px solid var(--border)',
                      background: active ? 'var(--accent)' : 'var(--card)',
                      color: active ? '#fff' : 'var(--foreground)',
                      cursor: 'pointer',
                    }}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setParticipantPage((prev) => Math.min(participantTotalPages, prev + 1))}
                disabled={safeParticipantPage === participantTotalPages}
                style={{
                  height: '30px',
                  padding: '0 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                  color: safeParticipantPage === participantTotalPages ? 'var(--muted-foreground)' : 'var(--foreground)',
                  cursor: safeParticipantPage === participantTotalPages ? 'not-allowed' : 'pointer',
                }}
              >
                下一页
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setPrizePage((prev) => Math.max(1, prev - 1))}
                disabled={safePrizePage === 1}
                style={{
                  height: '30px',
                  padding: '0 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                  color: safePrizePage === 1 ? 'var(--muted-foreground)' : 'var(--foreground)',
                  cursor: safePrizePage === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                上一页
              </button>
              {Array.from({ length: prizeTotalPages }, (_, i) => i + 1).map((page) => {
                const active = page === safePrizePage;
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setPrizePage(page)}
                    style={{
                      minWidth: '30px',
                      height: '30px',
                      padding: '0 8px',
                      borderRadius: '6px',
                      border: active ? '1px solid var(--accent)' : '1px solid var(--border)',
                      background: active ? 'var(--accent)' : 'var(--card)',
                      color: active ? '#fff' : 'var(--foreground)',
                      cursor: 'pointer',
                    }}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setPrizePage((prev) => Math.min(prizeTotalPages, prev + 1))}
                disabled={safePrizePage === prizeTotalPages}
                style={{
                  height: '30px',
                  padding: '0 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                  color: safePrizePage === prizeTotalPages ? 'var(--muted-foreground)' : 'var(--foreground)',
                  cursor: safePrizePage === prizeTotalPages ? 'not-allowed' : 'pointer',
                }}
              >
                下一页
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
