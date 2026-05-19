import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import type { CSSProperties, ElementType, FormEvent, ReactNode } from 'react';
import {
  ArrowLeft,
  BarChart3,
  Flame,
  Heart,
  Plus,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react';
import { DateRangePicker } from '../ui/DateRangePicker';
import { PlatformBadge } from '../platform/PlatformBadge';

type SceneKey = 'follow' | 'engagement' | 'seeding' | 'engagement_reward';
type RewardType = 'points' | 'cash' | 'gift';
type FollowRewardMode = 'all_accounts' | 'per_account';
type PrizeType = 'points' | 'gift' | 'wechat_redpacket' | 'lottery_chance';
type RedpacketType = 'lucky' | 'fixed';
type EngagementContentMode = 'link' | 'share_image';
type FollowTabKey = 'task' | 'account' | 'follow_data';

type PrizeConfig = {
  prizeType: PrizeType;
  redpacketType: RedpacketType;
  rewardAmount: number;
  prizeName: string;
  prizeCount: number;
  imageFile: File | null;
  imagePreview: string;
  giftName: string;
  giftContent: string;
  giftStock: number;
  redpacketCount: number;
  redpacketTotalAmount: number;
  lotteryActivityId: string;
  lotteryChanceCount: number;
};

const sceneOptions: Array<{
  key: SceneKey;
  label: string;
  short: string;
  icon: ElementType;
  accent: string;
  bg: string;
  summary: string;
  defaultName: string;
}> = [
  {
    key: 'follow',
    label: '账号加粉',
    short: '引导关注官方社媒账号，适合拉新关注、账号矩阵导流等场景',
    icon: Users,
    accent: '#0f766e',
    bg: '#ecfdf5',
    summary: '适合拉新关注、账号矩阵导流、会员关注认证',
    defaultName: '官方账号关注任务',
  },
  {
    key: 'engagement',
    label: '内容互动',
    short: '指定社媒内容点赞评论收藏，适合给重点笔记、短视频做互动助推',
    icon: Heart,
    accent: '#c2410c',
    bg: '#fff7ed',
    summary: '适合给重点笔记、短视频、直播预热视频做互动助推',
    defaultName: '重点内容互动助推',
  },
  {
    key: 'seeding',
    label: '内容种草',
    short: '发布原创内容并回传链接，适合征集原创笔记、短视频和晒单内容',
    icon: Sparkles,
    accent: '#1d4ed8',
    bg: '#eff6ff',
    summary: '承接原创建活动流程，适合征集原创笔记、短视频和晒单内容',
    defaultName: '新品内容种草计划',
  },
  {
    key: 'engagement_reward',
    label: '效果种草',
    short: '发布种草内容并达到指定互动量得奖励，适用优质内容筛选、KOC潜力挖掘等场景',
    icon: BarChart3,
    accent: '#7c3aed',
    bg: '#f5f3ff',
    summary: '适合按效果付费、筛选优质KOC内容、激励高互动创作者。',
    defaultName: '效果种草奖励计划',
  },
];

const followPlatformOptions = ['小红书', '抖音'];
const rewardOptions: Array<{ value: RewardType; label: string }> = [
  { value: 'points', label: '积分' },
  { value: 'cash', label: '现金红包' },
  { value: 'gift', label: '赠品' },
];
const lotteryActivityOptions = [
  { id: 'lottery-new-user', name: '新客抽奖转盘' },
  { id: 'lottery-seeding-booster', name: '种草助推转盘' },
  { id: 'lottery-festival', name: '节日福利转盘' },
];

function getRewardOptionsByScene(scene: SceneKey) {
  if (scene === 'follow' || scene === 'engagement' || scene === 'engagement_reward') {
    return rewardOptions.filter((item) => item.value !== 'gift');
  }
  return rewardOptions;
}


const baseInputStyle: CSSProperties = {
  width: 'min(540px, 100%)',
  height: 32,
  border: '1px solid #d8dee8',
  borderRadius: 6,
  background: '#fbfcfe',
  color: '#172033',
  fontSize: 12,
  padding: '0 10px',
  outline: 'none',
  boxSizing: 'border-box',
};

export function TaskCreate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const scene = getSceneKey(searchParams.get('scene'));
  const followTabParam = searchParams.get('tab');
  const [showValidation, setShowValidation] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [showLotteryActivityModal, setShowLotteryActivityModal] = useState(false);
  const [followTab, setFollowTab] = useState<FollowTabKey>(
    followTabParam === 'account' ? 'account' : followTabParam === 'follow_data' ? 'follow_data' : 'task',
  );
  const [draggingFollowIndex, setDraggingFollowIndex] = useState<number | null>(null);
  const [prizeError, setPrizeError] = useState('');
  const [selectedPrize, setSelectedPrize] = useState<PrizeConfig | null>(null);
  const [editingTierIndex, setEditingTierIndex] = useState<number | null>(null);
  const [prizeForm, setPrizeForm] = useState<PrizeConfig>({
    prizeType: 'points',
    redpacketType: 'lucky',
    rewardAmount: 0,
    prizeName: '',
    prizeCount: 1,
    imageFile: null,
    imagePreview: '',
    giftName: '美团外卖红包-10元',
    giftContent: '美团外卖红包-10元',
    giftStock: 2,
    redpacketCount: 0,
    redpacketTotalAmount: 0,
    lotteryActivityId: '',
    lotteryChanceCount: 1,
  });
  const [formData, setFormData] = useState({
    name: '',
    taskDescription: '',
    startDate: '',
    endDate: '',
    rewardType: 'points' as RewardType,
    rewardAmount: 50,
    followRewardMode: 'all_accounts' as FollowRewardMode,
    followAllowResubmitAfterReject: true,
    engagementAllowResubmitAfterReject: true,
    showEnabled: true,
    maxPerUser: 1,
    followTargets: [{ platform: '小红书', account: '', sampleImage: null as File | null, sampleImagePreview: '', guideText: '' }],
    followManagedAccounts: [
      { id: 'fa_1', platform: '小红书', accountName: '品牌官方小红书', profileImage: null as File | null, profileImagePreview: '', totalFollowers: 1280, accountAddedAt: '2023-03-18' },
      { id: 'fa_2', platform: '抖音', accountName: '品牌官方抖音号', profileImage: null as File | null, profileImagePreview: '', totalFollowers: 960, accountAddedAt: '2023-08-09' },
    ] as Array<{ id: string; platform: string; accountName: string; profileImage: File | null; profileImagePreview: string; totalFollowers: number; accountAddedAt: string }>,
    followRuleDescription: '',
    followPlaybookDescription: '',
    followPlaybookEnabled: true,
    engagementPlatform: '小红书',
    engagementContentMode: 'link' as EngagementContentMode,
    contentUrl: '',
    engagementShareImage: null as File | null,
    engagementShareImagePreview: '',
    engagementSampleImages: [] as File[],
    engagementSampleImagePreviews: [] as string[],
    engagementProofDescription: '',
    engagementRuleDescription: '',
    interactionActions: [],
    commentKeyword: '',
    orderChannel: '小店',
    skuScope: '',
    minAmount: 0,
    needReviewImage: true,
    seedingPlatform: '小红书',
    seedingHashtag: '',
    seedingKeyword: '',
    seedingGuideText: '',
    seedingSampleImages: [] as File[],
    seedingSampleImagePreviews: [] as string[],
    seedingAllowResubmitAfterReject: true,
    seedingRuleDescription: '',
    contentType: '图文或视频',
    seedingRewardMode: 'limited' as 'limited',
    seedingMaxRewardCount: 10,
    rankRewardEnabled: true,
    engagementRewardMode: 'single' as 'single' | 'multi',
    engagementRewardTiers: [{
      interactionType: '综合互动' as '综合互动' | '点赞' | '评论' | '收藏',
      interactionAmount: 100,
      prize: null as PrizeConfig | null,
    }],
    engagementRewardRuleDescription: '',
    engagementRewardAllowResubmitAfterReject: true,
    engagementRewardSampleImages: [] as File[],
    engagementRewardSampleImagePreviews: [] as string[],
  });

  const sceneMeta = sceneOptions.find((item) => item.key === scene) ?? sceneOptions[0];
  const pageTitle = id ? '编辑任务' : '创建任务';
  const requiredMissing = scene === 'follow'
    ? !isSceneValid(scene, formData)
    : !formData.name.trim() || !formData.startDate || !formData.endDate || !isSceneValid(scene, formData);
  const isManagedAccountLinked = (accountName: string) =>
    formData.followTargets.some((target) => target.account.trim() && target.account === accountName);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setShowValidation(true);
    if (requiredMissing) return;
    navigate(scene === 'follow' ? '/backend/follow' : '/backend/tasks');
  };

  const reorderFollowTargets = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    setFormData((current) => {
      const next = [...current.followTargets];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return { ...current, followTargets: next };
    });
  };

  const openPrizeModal = (tierIndex?: number) => {
    setPrizeError('');
    setEditingTierIndex(tierIndex ?? null);
    const existingPrize = tierIndex !== undefined ? formData.engagementRewardTiers[tierIndex]?.prize : selectedPrize;
    setPrizeForm(existingPrize ? { ...existingPrize } : {
      prizeType: 'points',
      redpacketType: 'lucky',
      rewardAmount: 0,
      prizeName: '',
      prizeCount: 1,
      imageFile: null,
      imagePreview: '',
      giftName: '美团外卖红包-10元',
      giftContent: '美团外卖红包-10元',
      giftStock: 2,
      redpacketCount: 0,
      redpacketTotalAmount: 0,
      lotteryActivityId: '',
      lotteryChanceCount: 1,
    });
    setShowPrizeModal(true);
    setShowLotteryActivityModal(false);
  };

  const switchFollowTab = (tab: FollowTabKey) => {
    setFollowTab(tab);
    const next = new URLSearchParams(searchParams);
    next.set('tab', tab);
    setSearchParams(next, { replace: true });
  };

  useEffect(() => {
    if (scene !== 'follow') return;
    const tabValue = searchParams.get('tab');
    const tabFromQuery: FollowTabKey = tabValue === 'account' ? 'account' : tabValue === 'follow_data' ? 'follow_data' : 'task';
    if (tabFromQuery !== followTab) setFollowTab(tabFromQuery);
  }, [scene, searchParams, followTab]);

  const confirmPrize = () => {
    if (!prizeForm.prizeName.trim()) {
      setPrizeError('请输入奖品名称');
      return;
    }
    if (!prizeForm.imagePreview) {
      setPrizeError('请上传奖品图片');
      return;
    }
    if (prizeForm.prizeType === 'wechat_redpacket') {
      if (prizeForm.redpacketCount < 1 || prizeForm.redpacketTotalAmount <= 0) {
        setPrizeError('请输入红包个数和总金额');
        return;
      }
    } else if (prizeForm.prizeType === 'lottery_chance') {
      if (!prizeForm.lotteryActivityId) {
        setPrizeError('请选择转盘抽奖活动');
        return;
      }
      if (prizeForm.lotteryChanceCount <= 0) {
        setPrizeError('请输入发放机会次数');
        return;
      }
    } else if (prizeForm.prizeType !== 'gift' && prizeForm.rewardAmount <= 0) {
      setPrizeError('请输入奖励额度');
      return;
    }
    if (editingTierIndex !== null) {
      const newTiers = [...formData.engagementRewardTiers];
      newTiers[editingTierIndex] = { ...newTiers[editingTierIndex], prize: { ...prizeForm } };
      setFormData({ ...formData, engagementRewardTiers: newTiers });
    } else {
      setSelectedPrize({ ...prizeForm });
    }
    setShowPrizeModal(false);
    setEditingTierIndex(null);
    setPrizeError('');
  };

  return (
    <div style={pageStyle}>
      <div style={shellStyle}>
        {scene !== 'follow' && (
        <button type="button" onClick={() => navigate('/backend/tasks')} style={backButtonStyle}>
          <ArrowLeft size={15} />
          创建{sceneMeta.label}
        </button>
        )}

        {scene === 'follow' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, marginBottom: 10, width: '100%' }}>
            <button type="button" onClick={() => switchFollowTab('task')} style={followTabButtonStyle(followTab === 'task')}>任务配置</button>
            <button type="button" onClick={() => switchFollowTab('account')} style={followTabButtonStyle(followTab === 'account')}>账号管理</button>
            <button type="button" onClick={() => switchFollowTab('follow_data')} style={followTabButtonStyle(followTab === 'follow_data')}>关注数据</button>
          </div>
        )}
        <form onSubmit={submit} noValidate style={contentGridStyle}>
          {scene === 'follow' && followTab === 'follow_data' ? (
            <Panel title="关注数据">
              <Field label="账号关注统计">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, width: 'min(980px, 100%)' }}>
                  {formData.followManagedAccounts.map((item) => (
                    <div
                      key={`stats-${item.id}`}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)',
                        padding: 12,
                        display: 'grid',
                        gap: 10,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <div style={{ display: 'grid', gap: 2 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#172033' }}>
                            {item.accountName || '未命名账号'}
                          </div>
                          <div style={{ marginTop: 2 }}>
                            <PlatformBadge platform={item.platform as "小红书" | "抖音" | "快手" | "视频号" | "哔哩哔哩" | "微博"} size="sm" />
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: 8,
                          borderTop: '1px solid #e8eef7',
                          paddingTop: 10,
                        }}
                      >
                        <div style={{ display: 'grid', gap: 4 }}>
                          <span style={{ fontSize: 11, color: '#94a3b8' }}>任务带来关注</span>
                          <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{item.totalFollowers}</span>
                        </div>
                        <div style={{ display: 'grid', gap: 4 }}>
                          <span style={{ fontSize: 11, color: '#94a3b8' }}>账号添加时间</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{item.accountAddedAt || '-'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Field>
            </Panel>
          ) : scene === 'follow' && followTab === 'account' ? (
            <Panel title="账号管理">
              <Field label="平台账号维护">
                <div style={{ display: 'grid', gap: 8 }}>
                  {formData.followManagedAccounts.map((item, idx) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'grid',
                        gap: 8,
                        padding: 10,
                        border: '1px solid #e2e8f0',
                        borderRadius: 10,
                        background: '#fcfdff',
                        width: 'fit-content',
                        maxWidth: '100%',
                        position: 'relative',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (isManagedAccountLinked(item.accountName)) {
                            window.alert('该账号已被任务关联，暂不可删除。请先在关注账号列表中替换或移除后再删除。');
                            return;
                          }
                          if (formData.followManagedAccounts.length <= 1) return;
                          const next = formData.followManagedAccounts.filter((_, i) => i !== idx);
                          setFormData({ ...formData, followManagedAccounts: next });
                        }}
                        disabled={formData.followManagedAccounts.length <= 1}
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          width: 22,
                          height: 22,
                          borderRadius: 999,
                          border: '1px solid #d8dee8',
                          background: formData.followManagedAccounts.length <= 1 ? '#f3f4f6' : '#fff',
                          color: formData.followManagedAccounts.length <= 1 ? '#a1a8b3' : '#6b7280',
                          cursor: formData.followManagedAccounts.length <= 1 ? 'not-allowed' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0,
                          lineHeight: 1,
                        }}
                        aria-label="删除账号"
                      >
                        <Trash2 size={12} />
                      </button>
                      <div style={{ display: 'grid', gridTemplateColumns: '120px 220px 90px 190px', gap: 8, alignItems: 'center', paddingRight: 30 }}>
                      <select
                        value={item.platform}
                        onChange={(event) => {
                          const next = [...formData.followManagedAccounts];
                          next[idx] = { ...next[idx], platform: event.target.value };
                          setFormData({ ...formData, followManagedAccounts: next });
                        }}
                        style={baseInputStyle}
                      >
                        {followPlatformOptions.map((platform) => <option key={platform}>{platform}</option>)}
                      </select>
                      <input
                        value={item.accountName}
                        onChange={(event) => {
                          const next = [...formData.followManagedAccounts];
                          next[idx] = { ...next[idx], accountName: event.target.value.slice(0, 20) };
                          setFormData({ ...formData, followManagedAccounts: next });
                        }}
                        placeholder={item.platform === '抖音' ? '请输入抖音号' : '请输入小红书号'}
                        style={baseInputStyle}
                      />
                      <input
                        id={`follow-managed-profile-${item.id}`}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(event) => {
                          const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
                          const next = [...formData.followManagedAccounts];
                          const current = next[idx];
                          if (current.profileImagePreview) URL.revokeObjectURL(current.profileImagePreview);
                          next[idx] = {
                            ...current,
                            profileImage: file,
                            profileImagePreview: file ? URL.createObjectURL(file) : '',
                          };
                          setFormData({ ...formData, followManagedAccounts: next });
                          event.target.value = '';
                        }}
                      />
                      <label
                        htmlFor={`follow-managed-profile-${item.id}`}
                        style={{
                          height: 32,
                          border: '1px dashed #cbd5e1',
                          borderRadius: 6,
                          background: '#fff',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#4b5565',
                          cursor: 'pointer',
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        上传主页截图
                      </label>
                      <div
                        style={{
                          height: 32,
                          borderRadius: 8,
                          border: '1px solid #fde68a',
                          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0 8px',
                          color: '#92400e',
                        }}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600 }}>
                          <Flame size={12} />
                          任务引流关注
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 800, color: '#78350f' }}>
                          {item.totalFollowers}
                        </span>
                      </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {item.profileImagePreview ? (
                          <div
                            style={{
                              width: 72,
                              height: 72,
                              border: '1px dashed #cbd5e1',
                              borderRadius: 6,
                              position: 'relative',
                              overflow: 'hidden',
                              background: '#fff',
                            }}
                          >
                            <img
                              src={item.profileImagePreview}
                              alt="主页截图预览"
                              onClick={() => setPreviewImageUrl(item.profileImagePreview)}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...formData.followManagedAccounts];
                                const current = next[idx];
                                if (current.profileImagePreview) URL.revokeObjectURL(current.profileImagePreview);
                                next[idx] = { ...current, profileImage: null, profileImagePreview: '' };
                                setFormData({ ...formData, followManagedAccounts: next });
                              }}
                              style={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                width: 20,
                                height: 20,
                                borderRadius: 999,
                                border: 'none',
                                background: 'rgba(220,38,38,0.92)',
                                color: '#fff',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                padding: 0,
                                lineHeight: 1,
                              }}
                              aria-label="删除主页截图"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, color: '#94a3b8' }}>未上传主页截图</span>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        followManagedAccounts:
                            formData.followManagedAccounts.length >= 20
                              ? formData.followManagedAccounts
                              : [...formData.followManagedAccounts, { id: `fa_${Date.now()}`, platform: '小红书', accountName: '', profileImage: null, profileImagePreview: '', totalFollowers: 0, accountAddedAt: '2026-01-01' }],
                      })
                    }
                    disabled={formData.followManagedAccounts.length >= 20}
                    style={addInlineButtonStyle(formData.followManagedAccounts.length >= 20)}
                  >
                    <Plus size={13} />
                    新增账号（0/20）
                  </button>
                </div>
              </Field>
            </Panel>
          ) : (
            <>
            {scene !== 'follow' && (
            <Panel title="基础设置">
              {scene !== 'follow' && (
              <Field label="任务名称" required error={showValidation && !formData.name.trim() ? '请输入任务名称' : ''}>
                <div style={{ position: 'relative', width: 'min(540px, 100%)' }}>
                  <input
                    value={formData.name}
                    onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                    placeholder="请输入"
                    maxLength={20}
                    style={{ ...inputStyle(showValidation && !formData.name.trim()), paddingRight: 48, width: '100%' }}
                  />
                  <span style={{ position: 'absolute', right: 10, bottom: 7, fontSize: 11, color: '#9aa4b2', pointerEvents: 'none' }}>{formData.name.length}/20</span>
                </div>
              </Field>
              )}

              <Field label="任务描述">
                <div style={{ position: 'relative', width: 'min(540px, 100%)' }}>
                  <input
                    value={formData.taskDescription}
                    onChange={(event) => setFormData({ ...formData, taskDescription: event.target.value })}
                    placeholder="请输入任务描述"
                    maxLength={50}
                    style={{ ...baseInputStyle, paddingRight: 56, width: '100%' }}
                  />
                  <span style={{ position: 'absolute', right: 10, bottom: 7, fontSize: 11, color: '#9aa4b2', pointerEvents: 'none' }}>
                    {formData.taskDescription.length}/50
                  </span>
                </div>
              </Field>

              {scene !== 'follow' && (
              <Field label="任务时间" required error={showValidation && (!formData.startDate || !formData.endDate) ? '请选择任务时间' : ''}>
                <div style={dateWrapStyle(showValidation && (!formData.startDate || !formData.endDate))}>
                  <DateRangePicker
                    startDate={formData.startDate}
                    endDate={formData.endDate}
                    onStartChange={(value) => setFormData({ ...formData, startDate: value })}
                    onEndChange={(value) => setFormData({ ...formData, endDate: value })}
                  />
                </div>
              </Field>
              )}

            </Panel>
            )}

            <Panel title={`${sceneMeta.label}玩法`}>
              {scene === 'follow' && (
                <SceneFields>
                  <Field label="场景功能">
                    <div style={{ display: 'grid', gap: 10, width: 'min(720px, 100%)' }}>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 150px',
                          gap: 12,
                          padding: 12,
                          borderRadius: 10,
                          border: '1px solid #dbe4f2',
                          background: 'linear-gradient(135deg, #f8fbff 0%, #f1f7ff 100%)',
                        }}
                      >
                        <div style={{ display: 'grid', gap: 8 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#172033' }}>账号加粉玩法说明</div>
                          <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.75 }}>
                            通过引导用户关注指定账号并提交关注凭证，完成审核后发放奖励，适用于拉新关注、账号矩阵导流等场景。
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              minHeight: 32,
                              padding: '6px 10px',
                              borderRadius: 8,
                              border: '1px solid #dbe4f2',
                              background: 'rgba(255,255,255,0.85)',
                            }}
                          >
                            <span style={{ fontSize: 12, color: '#475569', minWidth: 72 }}>开启该玩法</span>
                            <button
                              type="button"
                              role="switch"
                              aria-checked={formData.followPlaybookEnabled}
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  followPlaybookEnabled: !formData.followPlaybookEnabled,
                                })
                              }
                              style={switchStyle(formData.followPlaybookEnabled)}
                            >
                              <span style={switchThumbStyle(formData.followPlaybookEnabled)} />
                            </button>
                            <span style={{ fontSize: 12, color: '#687386', lineHeight: 1.5 }}>
                              关闭后，用户无法参与该玩法，待审核的奖励通过会正常发放。
                            </span>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
                            {[
                              { no: '01', text: '查看账号并完成关注' },
                              { no: '02', text: '上传账号关注截图' },
                              { no: '03', text: '审核通过发放奖励' },
                            ].map((step) => (
                              <div
                                key={step.no}
                                style={{
                                  border: '1px solid #d9e5f6',
                                  borderRadius: 8,
                                  background: 'rgba(255,255,255,0.78)',
                                  padding: '8px 8px 7px',
                                  display: 'grid',
                                  gap: 4,
                                  minHeight: 56,
                                }}
                              >
                                <span
                                  style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: 999,
                                    background: 'rgba(59,130,246,0.14)',
                                    color: '#2563eb',
                                    fontSize: 11,
                                    fontWeight: 700,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  {step.no}
                                </span>
                                <span style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{step.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div
                          style={{
                            borderRadius: 8,
                            border: '1px solid #d7e3f5',
                            background: 'radial-gradient(circle at 30% 20%, #d9ecff 0%, #eef6ff 52%, #f8fbff 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#3b82f6',
                            fontSize: 36,
                            fontWeight: 700,
                          }}
                        >
                          @+
                        </div>
                      </div>
                    </div>
                  </Field>
                  <fieldset
                      disabled={!formData.followPlaybookEnabled}
                      style={{
                        display: 'grid',
                        gap: 16,
                        margin: 0,
                        padding: 0,
                        border: 0,
                        minWidth: 0,
                        opacity: formData.followPlaybookEnabled ? 1 : 0.52,
                        pointerEvents: formData.followPlaybookEnabled ? 'auto' : 'none',
                      }}
                  >
                      <Field
                        label="关注账号列表"
                        required
                        error={showValidation && hasFollowTargetError(formData.followTargets) ? '请完整填写目标账号和上传引导文案' : ''}
                      >
                        <div style={{ display: 'grid', gap: 8 }}>
                          {formData.followTargets.map((target, index) => (
                            <div
                              key={`${index}-${target.platform}`}
                              draggable={formData.followPlaybookEnabled}
                              onDragStart={() => {
                                if (!formData.followPlaybookEnabled) return;
                                setDraggingFollowIndex(index);
                              }}
                              onDragOver={(event) => {
                                if (!formData.followPlaybookEnabled) return;
                                event.preventDefault();
                              }}
                              onDrop={() => {
                                if (!formData.followPlaybookEnabled || draggingFollowIndex === null) return;
                                reorderFollowTargets(draggingFollowIndex, index);
                                setDraggingFollowIndex(null);
                              }}
                              onDragEnd={() => setDraggingFollowIndex(null)}
                              style={{
                                display: 'grid',
                                gap: 10,
                                padding: 10,
                                border: '1px solid #e1e7f0',
                                borderRadius: 8,
                                background: draggingFollowIndex === index ? '#f1f5f9' : '#fcfdff',
                                width: 'fit-content',
                                maxWidth: '100%',
                                cursor: formData.followPlaybookEnabled ? 'grab' : 'not-allowed',
                              }}
                            >
                              <div style={{ display: 'grid', gridTemplateColumns: '340px 350px 32px', gap: 8, alignItems: 'center' }}>
                                <select
                                  value={target.account}
                                  onChange={(event) => {
                                    if (event.target.value === '__manage_accounts__') {
                                      switchFollowTab('account');
                                      return;
                                    }
                                    setFormData({
                                      ...formData,
                                      followTargets: formData.followTargets.map((item, itemIndex) =>
                                        itemIndex === index ? { ...item, account: event.target.value } : item
                                      ),
                                    });
                                  }}
                                  style={{ ...inputStyle(showValidation && !target.account.trim()), width: '100%' }}
                                >
                                  <option value="">请选择账号</option>
                                  <option value="__manage_accounts__" style={{ color: '#1d4ed8', fontWeight: 700 }}>去管理账号</option>
                                  {formData.followManagedAccounts.map((item) => (
                                      <option key={item.id} value={item.accountName}>
                                        {item.platform} - {item.accountName}
                                      </option>
                                  ))}
                                </select>
                                <input
                                  value={target.guideText}
                                  onChange={(event) =>
                                    setFormData({
                                      ...formData,
                                      followTargets: formData.followTargets.map((item, itemIndex) =>
                                        itemIndex === index ? { ...item, guideText: event.target.value } : item
                                      ),
                                    })
                                  }
                                  placeholder="关注引导文案（例如：请上传包含已关注状态的清晰截图）"
                                  maxLength={30}
                                  style={inputStyle(showValidation && !target.guideText.trim())}
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setFormData({
                                      ...formData,
                                      followTargets:
                                        formData.followTargets.length === 1
                                          ? formData.followTargets
                                          : formData.followTargets.filter((_, itemIndex) => itemIndex !== index),
                                    })
                                  }
                                  disabled={formData.followTargets.length === 1}
                                  style={{
                                    width: 32,
                                    height: 32,
                                    border: '1px solid #d8dee8',
                                    borderRadius: 6,
                                    background: formData.followTargets.length === 1 ? '#f3f4f6' : '#fff',
                                    color: formData.followTargets.length === 1 ? '#a1a8b3' : '#6b7280',
                                    cursor: formData.followTargets.length === 1 ? 'not-allowed' : 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 0,
                                    lineHeight: 1,
                                  }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <button
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  followTargets:
                                    [...formData.followTargets, { platform: '小红书', account: '', sampleImage: null, sampleImagePreview: '', guideText: '' }],
                                })
                              }
                              style={{
                                height: 32,
                                padding: '0 10px',
                                borderRadius: 6,
                                border: '1px dashed #cbd5e1',
                                background: '#fff',
                                color: '#1d4ed8',
                                fontSize: 12,
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                              }}
                            >
                              <Plus size={13} />
                              新增账号
                            </button>
                            <span style={{ fontSize: 12, color: '#687386' }}></span>
                          </div>
                        </div>
                      </Field>
                      <Field label="拒绝后再次提交">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={formData.followAllowResubmitAfterReject}
                            onClick={() =>
                              setFormData({
                                ...formData,
                                followAllowResubmitAfterReject: !formData.followAllowResubmitAfterReject,
                              })
                            }
                            style={switchStyle(formData.followAllowResubmitAfterReject)}
                          >
                            <span style={switchThumbStyle(formData.followAllowResubmitAfterReject)} />
                          </button>
                          <span style={{ fontSize: 12, color: '#687386', lineHeight: 1.5 }}>
                            默认开启：若审核拒绝，用户修改后可再次提交审核（可手动关闭）
                          </span>
                        </div>
                      </Field>
                      <Field
                        label="规则说明"
                        required
                        error={showValidation && !formData.followRuleDescription.trim() ? '请输入规则说明' : ''}
                      >
                        <div style={{ position: 'relative', width: 'min(540px, 100%)' }}>
                          <textarea
                            value={formData.followRuleDescription}
                            onChange={(event) => setFormData({ ...formData, followRuleDescription: event.target.value })}
                            placeholder="例如：每位用户需完成全部账号关注并上传清晰截图，截图需包含账号主页与已关注状态。"
                            maxLength={200}
                            style={{ ...textareaStyle(showValidation && !formData.followRuleDescription.trim()), paddingBottom: 22, width: '100%' }}
                          />
                          <span style={{ position: 'absolute', right: 10, bottom: 6, fontSize: 11, color: '#9aa4b2', pointerEvents: 'none' }}>{formData.followRuleDescription.length}/200</span>
                        </div>
                      </Field>
                  </fieldset>
                </SceneFields>
              )}

              {scene === 'engagement' && (
                <SceneFields>
                  <Field label="互动平台">
                    <select
                      value={formData.engagementPlatform}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          engagementPlatform: event.target.value,
                          engagementContentMode:
                            event.target.value === '抖音' ? 'link' : formData.engagementContentMode,
                        })
                      }
                      style={baseInputStyle}
                    >
                      {followPlatformOptions.map((platform) => <option key={platform}>{platform}</option>)}
                    </select>
                  </Field>
                  <Field
                    label="互动动作"
                    required
                    error={showValidation && formData.interactionActions.length === 0 ? '请至少选择一个互动动作' : ''}
                  >
                    <CheckboxGroup
                      values={formData.interactionActions}
                      options={['点赞', '评论', '收藏']}
                      onChange={(values) => setFormData({ ...formData, interactionActions: values })}
                    />
                  </Field>
                  {formData.interactionActions.includes('评论') && (
                    <Field label="评论关键词">
                      <input
                        value={formData.commentKeyword}
                        onChange={(event) => setFormData({ ...formData, commentKeyword: event.target.value })}
                        placeholder="选填，例如：已种草、想试试或输入默认的评论内容"
                        style={baseInputStyle}
                      />
                      <span style={{ fontSize: 12, color: '#687386', lineHeight: 1.5 }}>
                        若输入评论关键词，则评论中必须包含指定的关键词，否则系统自动审核不通过。
                      </span>
                    </Field>
                  )}
                  <Field label="互动内容方式" required>
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                      {[
                        { value: 'link' as EngagementContentMode, label: '输入内容链接' },
                        ...(formData.engagementPlatform === '抖音'
                          ? []
                          : [{ value: 'share_image' as EngagementContentMode, label: '上传分享图' }]),
                      ].map((item) => {
                        const checked = formData.engagementContentMode === item.value;
                        return (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, engagementContentMode: item.value })}
                            style={radioLikeButtonStyle(checked)}
                          >
                            <span style={radioCircleStyle(checked)} />
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </Field>
                  {formData.engagementContentMode === 'link' && (
                    <Field label="互动内容链接" required error={showValidation && !formData.contentUrl.trim() ? '请输入内容链接' : ''}>
                      <input
                        value={formData.contentUrl}
                        onChange={(event) => setFormData({ ...formData, contentUrl: event.target.value })}
                        placeholder="粘贴指定笔记或视频链接"
                        style={inputStyle(showValidation && !formData.contentUrl.trim())}
                      />
                    </Field>
                  )}
                  {formData.engagementContentMode === 'share_image' && (
                    <Field
                      label="上传分享图"
                      required
                      error={showValidation && !formData.engagementShareImagePreview ? '请上传分享图' : ''}
                    >
                      <div style={{ display: 'grid', gap: 10 }}>
                        <input
                          id="engagement-share-image"
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
                            if (!file) return;
                            setFormData((current) => {
                              if (current.engagementShareImagePreview) URL.revokeObjectURL(current.engagementShareImagePreview);
                              return {
                                ...current,
                                engagementShareImage: file,
                                engagementShareImagePreview: URL.createObjectURL(file),
                              };
                            });
                            event.target.value = '';
                          }}
                          style={{ display: 'none' }}
                        />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                          {formData.engagementShareImagePreview ? (
                            <div
                              style={{
                                width: 112,
                                height: 112,
                                border: '1px dashed #cbd5e1',
                                borderRadius: 4,
                                position: 'relative',
                                overflow: 'hidden',
                                background: '#fff',
                              }}
                            >
                              <img
                                src={formData.engagementShareImagePreview}
                                alt="分享图预览"
                                onClick={() => setPreviewImageUrl(formData.engagementShareImagePreview)}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setFormData((current) => {
                                    if (current.engagementShareImagePreview) URL.revokeObjectURL(current.engagementShareImagePreview);
                                    return { ...current, engagementShareImage: null, engagementShareImagePreview: '' };
                                  })
                                }
                                style={{
                                  position: 'absolute',
                                  top: 6,
                                  right: 6,
                                  width: 22,
                                  height: 22,
                                  borderRadius: 999,
                                  border: 'none',
                                  background: 'rgba(220,38,38,0.92)',
                                  color: '#fff',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  padding: 0,
                                  lineHeight: 1,
                                }}
                                aria-label="删除分享图"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ) : (
                            <label
                              htmlFor="engagement-share-image"
                              style={{
                                width: 112,
                                height: 112,
                                border: '1px dashed #cbd5e1',
                                borderRadius: 4,
                                background: '#fff',
                                display: 'inline-flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 4,
                                cursor: 'pointer',
                                userSelect: 'none',
                                color: '#4b5565',
                              }}
                            >
                              <span style={{ fontSize: 34, lineHeight: 1, color: '#9aa4b2' }}>+</span>
                              <span style={{ fontSize: 12, fontWeight: 600 }}>上传图片</span>
                            </label>
                          )}
                        </div>
                        <span style={{ fontSize: 12, color: '#687386', lineHeight: 1.5 }}>
                          分享图可在小红书内容详情页，点击「分享」后保存到本地获取，查看示例。
                        </span>
                      </div>
                    </Field>
                  )}
                  <Field
                    label="内容示例图"
                  >
                    <div style={{ display: 'grid', gap: 10 }}>
                      <input
                        id="engagement-sample-image"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(event) => {
                          const files = event.target.files ? Array.from(event.target.files) : [];
                          if (files.length === 0) return;
                          setFormData((current) => {
                            const remaining = 3 - current.engagementSampleImages.length;
                            const added = files.slice(0, remaining);
                            const newPreviews = added.map((f) => URL.createObjectURL(f));
                            return {
                              ...current,
                              engagementSampleImages: [...current.engagementSampleImages, ...added],
                              engagementSampleImagePreviews: [...current.engagementSampleImagePreviews, ...newPreviews],
                            };
                          });
                          event.target.value = '';
                        }}
                        style={{ display: 'none' }}
                      />
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        {formData.engagementSampleImagePreviews.map((preview, imgIndex) => (
                          <div
                            key={preview}
                            style={{
                              width: 112,
                              height: 112,
                              border: '1px dashed #cbd5e1',
                              borderRadius: 4,
                              position: 'relative',
                              overflow: 'hidden',
                              background: '#fff',
                            }}
                          >
                            <img
                              src={preview}
                              alt="内容示例图预览"
                              onClick={() => setPreviewImageUrl(preview)}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                cursor: 'zoom-in',
                              }}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((current) => {
                                  URL.revokeObjectURL(current.engagementSampleImagePreviews[imgIndex]);
                                  return {
                                    ...current,
                                    engagementSampleImages: current.engagementSampleImages.filter((_, i) => i !== imgIndex),
                                    engagementSampleImagePreviews: current.engagementSampleImagePreviews.filter((_, i) => i !== imgIndex),
                                  };
                                })
                              }
                              style={{
                                position: 'absolute',
                                top: 6,
                                right: 6,
                                width: 22,
                                height: 22,
                                borderRadius: 999,
                                border: 'none',
                                background: 'rgba(220,38,38,0.92)',
                                color: '#fff',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                padding: 0,
                                lineHeight: 1,
                              }}
                              aria-label="删除内容示例图"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                        {formData.engagementSampleImages.length < 3 && <label
                          htmlFor="engagement-sample-image"
                          style={{
                            width: 112,
                            height: 112,
                            border: '1px dashed #cbd5e1',
                            borderRadius: 4,
                            background: '#fff',
                            display: 'inline-flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 4,
                            cursor: 'pointer',
                            userSelect: 'none',
                            color: '#4b5565',
                          }}
                        >
                          <span style={{ fontSize: 34, lineHeight: 1, color: '#9aa4b2' }}>+</span>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>上传图片</span>
                        </label>}
                      </div>
                      <span style={{ fontSize: 12, color: '#687386', lineHeight: 1.5 }}>
                        可上传内容截图辅助引导，最多 3 张。
                      </span>
                    </div>
                  </Field>
                  <Field label="引导文案">
                    <input
                      value={formData.engagementProofDescription}
                      onChange={(event) => setFormData({ ...formData, engagementProofDescription: event.target.value })}
                      placeholder="例如：截图需清晰展示互动内容与账号信息"
                      style={baseInputStyle}
                    />
                  </Field>
                  <Field label="拒绝后再次提交">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={formData.engagementAllowResubmitAfterReject}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            engagementAllowResubmitAfterReject: !formData.engagementAllowResubmitAfterReject,
                          })
                        }
                        style={switchStyle(formData.engagementAllowResubmitAfterReject)}
                      >
                        <span style={switchThumbStyle(formData.engagementAllowResubmitAfterReject)} />
                      </button>
                      <span style={{ fontSize: 12, color: '#687386', lineHeight: 1.5 }}>
                        默认开启：若审核拒绝，用户修改后可再次提交审核（可手动关闭）
                      </span>
                    </div>
                  </Field>
                  <Field
                    label="规则说明"
                    required
                    error={showValidation && !formData.engagementRuleDescription.trim() ? '请输入规则说明' : ''}
                  >
                    <div style={{ position: 'relative', width: 'min(540px, 100%)' }}>
                      <textarea
                        value={formData.engagementRuleDescription}
                        onChange={(event) => setFormData({ ...formData, engagementRuleDescription: event.target.value })}
                        placeholder="例如：需完成指定互动动作后再提交截图，评论任务需展示完整评论内容与发布时间。"
                        maxLength={200}
                        style={{ ...textareaStyle(showValidation && !formData.engagementRuleDescription.trim()), paddingBottom: 22, width: '100%' }}
                      />
                      <span style={{ position: 'absolute', right: 10, bottom: 6, fontSize: 11, color: '#9aa4b2', pointerEvents: 'none' }}>{formData.engagementRuleDescription.length}/200</span>
                    </div>
                  </Field>
                </SceneFields>
              )}

              {scene === 'engagement_reward' && (
                <SceneFields>
                  <Field label="参与平台">
                    <select
                      value={formData.engagementPlatform}
                      onChange={(event) => setFormData({ ...formData, engagementPlatform: event.target.value })}
                      style={baseInputStyle}
                    >
                      {followPlatformOptions.map((platform) => <option key={platform}>{platform}</option>)}
                    </select>
                  </Field>
                  <Field label="必须包含话题标签">
                    <input
                      value={formData.seedingHashtag}
                      onChange={(event) => setFormData({ ...formData, seedingHashtag: event.target.value })}
                      placeholder="例如：#新品体验，多个请用逗号分隔开"
                      style={baseInputStyle}
                    />
                  </Field>
                  <Field label="必须包含关键词">
                    <input
                      value={formData.seedingKeyword}
                      onChange={(event) => setFormData({ ...formData, seedingKeyword: event.target.value })}
                      placeholder="例如：真实体验，多个请用逗号分隔开"
                      style={baseInputStyle}
                    />
                  </Field>
                  <Field label="内容类型">
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                      {['图文或视频', '仅图文', '仅视频'].map((option) => {
                        const checked = formData.contentType === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setFormData({ ...formData, contentType: option })}
                            style={radioLikeButtonStyle(checked)}
                          >
                            <span style={radioCircleStyle(checked)} />
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </Field>
                  <Field label="创作方向">
                    <input
                      value={formData.engagementProofDescription}
                      onChange={(event) => setFormData({ ...formData, engagementProofDescription: event.target.value })}
                      placeholder="例如：围绕指定主题进行真实体验分享，突出核心卖点"
                      style={baseInputStyle}
                    />
                  </Field>
                  <Field label="内容示例图">
                    <div style={{ display: 'grid', gap: 8 }}>
                      <input
                        id="engagement-reward-sample-image"
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: 'none' }}
                        onChange={(event) => {
                          const files = Array.from(event.target.files ?? []);
                          setFormData((current) => {
                            if (files.length === 0) return current;
                            const remaining = 3 - current.engagementRewardSampleImages.length;
                            if (remaining <= 0) return current;
                            const added = files.slice(0, remaining);
                            const previews = added.map((file) => URL.createObjectURL(file));
                            return {
                              ...current,
                              engagementRewardSampleImages: [...current.engagementRewardSampleImages, ...added],
                              engagementRewardSampleImagePreviews: [...current.engagementRewardSampleImagePreviews, ...previews],
                            };
                          });
                          event.target.value = '';
                        }}
                      />
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {formData.engagementRewardSampleImagePreviews.map((preview, imgIndex) => (
                          <div
                            key={`engagement-reward-sample-${imgIndex}`}
                            style={{
                              width: 112,
                              height: 112,
                              border: '1px dashed #cbd5e1',
                              borderRadius: 4,
                              position: 'relative',
                              overflow: 'hidden',
                              background: '#fff',
                            }}
                          >
                            <img
                              src={preview}
                              alt="内容示例图预览"
                              onClick={() => setPreviewImageUrl(preview)}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((current) => {
                                  URL.revokeObjectURL(current.engagementRewardSampleImagePreviews[imgIndex]);
                                  return {
                                    ...current,
                                    engagementRewardSampleImages: current.engagementRewardSampleImages.filter((_, i) => i !== imgIndex),
                                    engagementRewardSampleImagePreviews: current.engagementRewardSampleImagePreviews.filter((_, i) => i !== imgIndex),
                                  };
                                })
                              }
                              style={{
                                position: 'absolute',
                                top: 6,
                                right: 6,
                                width: 22,
                                height: 22,
                                borderRadius: 999,
                                border: 'none',
                                background: 'rgba(220,38,38,0.92)',
                                color: '#fff',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                padding: 0,
                                lineHeight: 1,
                              }}
                              aria-label="删除内容示例图"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                        {formData.engagementRewardSampleImages.length < 3 && (
                          <label
                            htmlFor="engagement-reward-sample-image"
                            style={{
                              width: 112,
                              height: 112,
                              border: '1px dashed #cbd5e1',
                              borderRadius: 4,
                              background: '#fff',
                              display: 'inline-flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 4,
                              cursor: 'pointer',
                              userSelect: 'none',
                              color: '#4b5565',
                            }}
                          >
                            <span style={{ fontSize: 34, lineHeight: 1, color: '#9aa4b2' }}>+</span>
                            <span style={{ fontSize: 12, fontWeight: 600 }}>上传图片</span>
                          </label>
                        )}
                      </div>
                      <span style={{ fontSize: 12, color: '#687386', lineHeight: 1.5 }}>
                        可上传内容示例图，方便用户参考，最多 3 张。
                      </span>
                    </div>
                  </Field>
                  <Field label="拒绝后再次提交">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={formData.engagementRewardAllowResubmitAfterReject}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            engagementRewardAllowResubmitAfterReject: !formData.engagementRewardAllowResubmitAfterReject,
                          })
                        }
                        style={switchStyle(formData.engagementRewardAllowResubmitAfterReject)}
                      >
                        <span style={switchThumbStyle(formData.engagementRewardAllowResubmitAfterReject)} />
                      </button>
                      <span style={{ fontSize: 12, color: '#687386', lineHeight: 1.5 }}>
                        默认开启：若审核拒绝，用户修改后可再次提交审核（可手动关闭）
                      </span>
                    </div>
                  </Field>
                  <Field
                    label="规则说明"
                    required
                    error={showValidation && !formData.engagementRewardRuleDescription.trim() ? '请输入规则说明' : ''}
                  >
                    <div style={{ position: 'relative', width: 'min(540px, 100%)' }}>
                      <textarea
                        value={formData.engagementRewardRuleDescription}
                        onChange={(event) => setFormData({ ...formData, engagementRewardRuleDescription: event.target.value })}
                        placeholder="例如：发布种草内容后，互动量需在活动截止前达到要求，数据以平台截图为准。"
                        maxLength={200}
                        style={{ ...textareaStyle(showValidation && !formData.engagementRewardRuleDescription.trim()), paddingBottom: 22, width: '100%' }}
                      />
                      <span style={{ position: 'absolute', right: 10, bottom: 6, fontSize: 11, color: '#9aa4b2', pointerEvents: 'none' }}>{formData.engagementRewardRuleDescription.length}/200</span>
                    </div>
                  </Field>
                </SceneFields>
              )}

              {scene === 'seeding' && (
                <SceneFields>
                  <Field label="参与平台">
                    <select
                      value={formData.seedingPlatform}
                      onChange={(event) => setFormData({ ...formData, seedingPlatform: event.target.value })}
                      style={baseInputStyle}
                    >
                      {followPlatformOptions.map((platform) => <option key={platform}>{platform}</option>)}
                    </select>
                  </Field>
                  <Field label="必须包含话题标签">
                    <input
                      value={formData.seedingHashtag}
                      onChange={(event) => setFormData({ ...formData, seedingHashtag: event.target.value })}
                      placeholder="例如：#新品体验，多个请用逗号分隔开"
                      style={baseInputStyle}
                    />
                  </Field>

                  <Field label="必须包含关键词">
                    <input
                      value={formData.seedingKeyword}
                      onChange={(event) => setFormData({ ...formData, seedingKeyword: event.target.value })}
                      placeholder="例如：真实体验，多个请用逗号分隔开"
                      style={baseInputStyle}
                    />
                  </Field>
                  <Field label="内容类型">
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                      {['图文或视频', '仅图文', '仅视频'].map((option) => {
                        const checked = formData.contentType === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setFormData({ ...formData, contentType: option })}
                            style={radioLikeButtonStyle(checked)}
                          >
                            <span style={radioCircleStyle(checked)} />
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </Field>
                  <Field label="创作方向">
                    <input
                      value={formData.seedingGuideText}
                      onChange={(event) => setFormData({ ...formData, seedingGuideText: event.target.value })}
                      placeholder="请输入创作方向"
                      style={baseInputStyle}
                    />
                  </Field>
                  <Field label="内容示例图">
                    <div style={{ display: 'grid', gap: 8 }}>
                      <input
                        id="seeding-sample-image"
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: 'none' }}
                        onChange={(event) => {
                          const files = Array.from(event.target.files ?? []);
                          setFormData((current) => {
                            if (files.length === 0) return current;
                            const remaining = 3 - current.seedingSampleImages.length;
                            if (remaining <= 0) return current;
                            const added = files.slice(0, remaining);
                            const previews = added.map((file) => URL.createObjectURL(file));
                            return {
                              ...current,
                              seedingSampleImages: [...current.seedingSampleImages, ...added],
                              seedingSampleImagePreviews: [...current.seedingSampleImagePreviews, ...previews],
                            };
                          });
                          event.target.value = '';
                        }}
                      />
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {formData.seedingSampleImagePreviews.map((preview, imgIndex) => (
                          <div
                            key={`seeding-sample-${imgIndex}`}
                            style={{
                              width: 112,
                              height: 112,
                              border: '1px dashed #cbd5e1',
                              borderRadius: 4,
                              position: 'relative',
                              overflow: 'hidden',
                              background: '#fff',
                            }}
                          >
                            <img
                              src={preview}
                              alt="内容示例图预览"
                              onClick={() => setPreviewImageUrl(preview)}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((current) => {
                                  URL.revokeObjectURL(current.seedingSampleImagePreviews[imgIndex]);
                                  return {
                                    ...current,
                                    seedingSampleImages: current.seedingSampleImages.filter((_, i) => i !== imgIndex),
                                    seedingSampleImagePreviews: current.seedingSampleImagePreviews.filter((_, i) => i !== imgIndex),
                                  };
                                })
                              }
                              style={{
                                position: 'absolute',
                                top: 6,
                                right: 6,
                                width: 22,
                                height: 22,
                                borderRadius: 999,
                                border: 'none',
                                background: 'rgba(220,38,38,0.92)',
                                color: '#fff',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                padding: 0,
                                lineHeight: 1,
                              }}
                              aria-label="删除内容示例图"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                        {formData.seedingSampleImages.length < 3 && (
                          <label
                            htmlFor="seeding-sample-image"
                            style={{
                              width: 112,
                              height: 112,
                              border: '1px dashed #cbd5e1',
                              borderRadius: 4,
                              background: '#fff',
                              display: 'inline-flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 4,
                              cursor: 'pointer',
                              userSelect: 'none',
                              color: '#4b5565',
                            }}
                          >
                            <span style={{ fontSize: 34, lineHeight: 1, color: '#9aa4b2' }}>+</span>
                            <span style={{ fontSize: 12, fontWeight: 600 }}>上传图片</span>
                          </label>
                        )}
                      </div>
                      <span style={{ fontSize: 12, color: '#687386', lineHeight: 1.5 }}>
                        可上传内容示例图，方便用户参考，最多 3 张。
                      </span>
                    </div>
                  </Field>
                  <Field label="拒绝后再次提交">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={formData.seedingAllowResubmitAfterReject}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            seedingAllowResubmitAfterReject: !formData.seedingAllowResubmitAfterReject,
                          })
                        }
                        style={switchStyle(formData.seedingAllowResubmitAfterReject)}
                      >
                        <span style={switchThumbStyle(formData.seedingAllowResubmitAfterReject)} />
                      </button>
                      <span style={{ fontSize: 12, color: '#687386', lineHeight: 1.5 }}>
                        默认开启：若审核拒绝，用户修改后可再次提交审核（可手动关闭）
                      </span>
                    </div>
                  </Field>
                  <Field
                    label="规则说明"
                    required
                    error={showValidation && !formData.seedingRuleDescription.trim() ? '请输入规则说明' : ''}
                  >
                    <div style={{ position: 'relative', width: 'min(540px, 100%)' }}>
                      <textarea
                        value={formData.seedingRuleDescription}
                        onChange={(event) => setFormData({ ...formData, seedingRuleDescription: event.target.value })}
                        placeholder="例如：发布原创种草内容并回传链接，内容需包含指定话题标签和关键词。"
                        maxLength={200}
                        style={{ ...textareaStyle(showValidation && !formData.seedingRuleDescription.trim()), paddingBottom: 22, width: '100%' }}
                      />
                      <span style={{ position: 'absolute', right: 10, bottom: 6, fontSize: 11, color: '#9aa4b2', pointerEvents: 'none' }}>{formData.seedingRuleDescription.length}/200</span>
                    </div>
                  </Field>
                </SceneFields>
              )}
            </Panel>

            <Panel title="奖励配置">
              <SceneFields>
                {scene === 'follow' && (
                  <Field label="奖励说明">
                    <div style={{ fontSize: 12, color: '#4b5565', lineHeight: 1.7 }}>
                      每关注 1 个账号发放 1 次奖励。
                    </div>
                  </Field>
                )}
                {scene === 'seeding' && (
                  <Field label="奖励次数">
                    <div style={{ display: 'grid', gap: 10 }}>
                      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                        <button type="button" style={radioLikeButtonStyle(true)}>
                          <span style={radioCircleStyle(true)} />
                          限制奖励次数
                        </button>
                      </div>
                      {formData.seedingRewardMode === 'limited' && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 12, color: '#4b5565' }}>活动中最多发放</span>
                          <input
                            type="number"
                            min={1}
                            value={formData.seedingMaxRewardCount}
                            onChange={(event) => setFormData({ ...formData, seedingMaxRewardCount: Math.max(1, Number(event.target.value) || 1) })}
                            style={{ ...baseInputStyle, width: 72, textAlign: 'center' }}
                          />
                          <span style={{ fontSize: 12, color: '#4b5565' }}>次</span>
                        </div>
                      )}
                    </div>
                  </Field>
                )}
                {scene === 'engagement_reward' && (
                  <Field label="互动量档位" required>
                    <div style={{ display: 'grid', gap: 10 }}>
                      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                        {([['single', '单一档位'], ['multi', '多档位']] as const).map(([value, label]) => {
                          const checked = formData.engagementRewardMode === value;
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => setFormData({ ...formData, engagementRewardMode: value })}
                              style={radioLikeButtonStyle(checked)}
                            >
                              <span style={radioCircleStyle(checked)} />
                              {label}
                            </button>
                          );
                        })}
                      </div>
                      {formData.engagementRewardMode === 'single' ? (
                        <div style={{ display: 'grid', gap: 10, padding: 10, border: '1px solid #e1e7f0', borderRadius: 8, background: '#fcfdff', width: '41.66%' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, alignItems: 'center' }}>
                            <select
                              value={formData.engagementRewardTiers[0]?.interactionType || '综合互动'}
                              onChange={(event) => {
                                const newTiers = [...formData.engagementRewardTiers];
                                if (newTiers[0]) {
                                  newTiers[0] = { ...newTiers[0], interactionType: event.target.value as '综合互动' | '点赞' | '评论' | '收藏' };
                                  setFormData({ ...formData, engagementRewardTiers: newTiers });
                                }
                              }}
                              style={baseInputStyle}
                            >
                              {['综合互动', '点赞', '评论', '收藏'].map((type) => <option key={type}>{type}</option>)}
                            </select>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <input
                                type="number"
                                min={1}
                                value={formData.engagementRewardTiers[0]?.interactionAmount || 100}
                                onChange={(event) => {
                                  const newTiers = [...formData.engagementRewardTiers];
                                  if (newTiers[0]) {
                                    newTiers[0] = { ...newTiers[0], interactionAmount: Math.max(1, Number(event.target.value) || 1) };
                                    setFormData({ ...formData, engagementRewardTiers: newTiers });
                                  }
                                }}
                                placeholder="互动量"
                                style={{ ...baseInputStyle, flex: 1 }}
                              />
                              <span style={{ fontSize: 12, color: '#687386', whiteSpace: 'nowrap' }}>次</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 12, color: '#687386', whiteSpace: 'nowrap' }}>奖品：</span>
                            {formData.engagementRewardTiers[0]?.prize ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 6, background: '#f8fafc' }}>
                                {formData.engagementRewardTiers[0].prize.imagePreview && (
                                  <img src={formData.engagementRewardTiers[0].prize.imagePreview} alt="奖品图片" style={{ width: 36, height: 36, borderRadius: 4, objectFit: 'cover' }} />
                                )}
                                <div style={{ display: 'grid', gap: 2, flex: 1 }}>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: '#172033' }}>{formData.engagementRewardTiers[0].prize.prizeName}</span>
                                  <span style={{ fontSize: 11, color: '#687386' }}>{getPrizeTypeLabel(formData.engagementRewardTiers[0].prize.prizeType)}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => openPrizeModal(0)}
                                  style={{ fontSize: 12, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                >
                                  编辑
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => openPrizeModal(0)}
                                style={{
                                  height: 28,
                                  padding: '0 10px',
                                  borderRadius: 6,
                                  border: '1px dashed #cbd5e1',
                                  background: '#fff',
                                  color: '#1d4ed8',
                                  fontSize: 12,
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                }}
                              >
                                <Plus size={12} />
                                添加奖品
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <>
                          {formData.engagementRewardTiers.map((tier: typeof formData.engagementRewardTiers[number], index: number) => (
                            <div
                              key={`tier-${index}`}
                              style={{
                                display: 'grid',
                                gap: 10,
                                padding: 10,
                                border: '1px solid #e1e7f0',
                                borderRadius: 8,
                                background: '#fcfdff',
                                width: '41.66%',
                              }}
                            >
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 32px', gap: 8, alignItems: 'center' }}>
                                <select
                                  value={tier.interactionType}
                                  onChange={(event) => {
                                    const newTiers = [...formData.engagementRewardTiers];
                                    newTiers[index] = { ...tier, interactionType: event.target.value as '综合互动' | '点赞' | '评论' | '收藏' };
                                    setFormData({ ...formData, engagementRewardTiers: newTiers });
                                  }}
                                  style={baseInputStyle}
                                >
                                  {['综合互动', '点赞', '评论', '收藏'].map((type) => <option key={type}>{type}</option>)}
                                </select>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <input
                                    type="number"
                                    min={1}
                                    value={tier.interactionAmount}
                                    onChange={(event) => {
                                      const newTiers = [...formData.engagementRewardTiers];
                                      newTiers[index] = { ...tier, interactionAmount: Math.max(1, Number(event.target.value) || 1) };
                                      setFormData({ ...formData, engagementRewardTiers: newTiers });
                                    }}
                                    placeholder="互动量"
                                    style={{ ...baseInputStyle, flex: 1 }}
                                  />
                                  <span style={{ fontSize: 12, color: '#687386', whiteSpace: 'nowrap' }}>次</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (formData.engagementRewardTiers.length <= 1) return;
                                    const newTiers = formData.engagementRewardTiers.filter((_: typeof formData.engagementRewardTiers[number], i: number) => i !== index);
                                    setFormData({ ...formData, engagementRewardTiers: newTiers });
                                  }}
                                  disabled={formData.engagementRewardTiers.length <= 1}
                                  style={{
                                    width: 32,
                                    height: 32,
                                    border: '1px solid #d8dee8',
                                    borderRadius: 6,
                                    background: formData.engagementRewardTiers.length <= 1 ? '#f3f4f6' : '#fff',
                                    color: formData.engagementRewardTiers.length <= 1 ? '#a1a8b3' : '#6b7280',
                                    cursor: formData.engagementRewardTiers.length <= 1 ? 'not-allowed' : 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 0,
                                    lineHeight: 1,
                                  }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 12, color: '#687386', whiteSpace: 'nowrap' }}>对应奖品：</span>
                                {tier.prize ? (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '0 1 50%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 6, background: '#f8fafc' }}>
                                    {tier.prize.imagePreview && (
                                      <img src={tier.prize.imagePreview} alt="奖品图片" style={{ width: 36, height: 36, borderRadius: 4, objectFit: 'cover' }} />
                                    )}
                                    <div style={{ display: 'grid', gap: 2, flex: 1 }}>
                                      <span style={{ fontSize: 12, fontWeight: 700, color: '#172033' }}>{tier.prize.prizeName}</span>
                                      <span style={{ fontSize: 11, color: '#687386' }}>{getPrizeTypeLabel(tier.prize.prizeType)}</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => openPrizeModal(index)}
                                      style={{ fontSize: 12, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                    >
                                      编辑
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => openPrizeModal(index)}
                                    style={{
                                      height: 28,
                                      padding: '0 10px',
                                      borderRadius: 6,
                                      border: '1px dashed #cbd5e1',
                                      background: '#fff',
                                      color: '#1d4ed8',
                                      fontSize: 12,
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 4,
                                    }}
                                  >
                                    <Plus size={12} />
                                    添加奖品
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              if (formData.engagementRewardTiers.length >= 5) return;
                              setFormData({
                                ...formData,
                                engagementRewardTiers: [
                                  ...formData.engagementRewardTiers,
                                  { interactionType: '综合互动', interactionAmount: 100, prize: null },
                                ],
                              });
                            }}
                            disabled={formData.engagementRewardTiers.length >= 5}
                            style={{
                              height: 32,
                              padding: '0 10px',
                              borderRadius: 6,
                              border: '1px dashed #cbd5e1',
                              background: '#fff',
                              color: formData.engagementRewardTiers.length >= 5 ? '#a1a8b3' : '#1d4ed8',
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: formData.engagementRewardTiers.length >= 5 ? 'not-allowed' : 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              width: 'fit-content',
                            }}
                          >
                            <Plus size={13} />
                            添加档位（{formData.engagementRewardTiers.length}/5）
                          </button>
                        </>
                      )}
                    </div>
                  </Field>
                )}
                {scene !== 'engagement_reward' && (
                  <Field label="奖品选择" required error={showValidation && !selectedPrize ? '请添加奖品' : ''}>
                    <div style={{ display: 'grid', gap: 10 }}>
                      <button
                        type="button"
                        onClick={() => openPrizeModal()}
                        disabled={scene === 'follow' && !formData.followPlaybookEnabled}
                        style={{
                          ...addPrizeButtonStyle,
                          opacity: scene === 'follow' && !formData.followPlaybookEnabled ? 0.52 : 1,
                          cursor: scene === 'follow' && !formData.followPlaybookEnabled ? 'not-allowed' : 'pointer',
                          color: scene === 'follow' && !formData.followPlaybookEnabled ? '#94a3b8' : addPrizeButtonStyle.color,
                          border: scene === 'follow' && !formData.followPlaybookEnabled ? '1px solid #d8dee8' : addPrizeButtonStyle.border,
                        }}
                      >
                        <Plus size={22} />
                        添加奖品
                      </button>
                      {selectedPrize && (
                        <div style={prizeSummaryStyle}>
                          <div>奖品类型：{getPrizeTypeLabel(selectedPrize.prizeType)}</div>
                          <div>奖品名称：{selectedPrize.prizeName}</div>
                          {selectedPrize.prizeType === 'wechat_redpacket' ? (
                            <div>红包总额：{selectedPrize.redpacketTotalAmount} 元 / {selectedPrize.redpacketCount} 个</div>
                          ) : selectedPrize.prizeType === 'lottery_chance' ? (
                            <div>抽奖活动：{selectedPrize.lotteryActivityId}，发放 {selectedPrize.lotteryChanceCount} 次机会</div>
                          ) : selectedPrize.prizeType !== 'gift' ? (
                            <div>奖励额度：{selectedPrize.rewardAmount} {getPrizeUnit(selectedPrize.prizeType)}</div>
                          ) : (
                            <div>赠品信息：{selectedPrize.giftContent}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </Field>
                )}
              </SceneFields>
            </Panel>
            </>
          )}
        </form>
        {showValidation && requiredMissing && (
          <div style={errorBoxStyle}>还有必填项未完成，请检查红色提示字段。</div>
        )}
        {scene !== 'follow' && (
          <div style={bottomActionBarStyle}>
            <button type="button" onClick={() => navigate('/backend/tasks')} style={secondaryButtonStyle}>
              取消
            </button>
            <button
              type="button"
              onClick={() => {
                setShowValidation(true);
                if (requiredMissing) return;
                navigate('/backend/tasks');
              }}
              style={{ ...primaryButtonStyle, background: '#1d4ed8' }}
            >
              保存
            </button>
          </div>
        )}

        {previewImageUrl && (
          <div
            onClick={() => setPreviewImageUrl('')}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1400,
              background: 'rgba(15,23,42,0.65)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
            }}
          >
            <div
              onClick={(event) => event.stopPropagation()}
              style={{
                position: 'relative',
                maxWidth: 'min(92vw, 980px)',
                maxHeight: '86vh',
                borderRadius: 8,
                overflow: 'hidden',
                background: '#fff',
                boxShadow: '0 16px 48px rgba(15,23,42,0.35)',
              }}
            >
              <button
                type="button"
                onClick={() => setPreviewImageUrl('')}
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  width: 30,
                  height: 30,
                  borderRadius: 999,
                  border: 'none',
                  background: 'rgba(15,23,42,0.65)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: 16,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
              <img
                src={previewImageUrl}
                alt="示例图预览"
                style={{
                  display: 'block',
                  maxWidth: '100%',
                  maxHeight: '86vh',
                  objectFit: 'contain',
                }}
              />
            </div>
          </div>
        )}
        {showPrizeModal && (
          <div
            style={modalOverlayStyle}
            onClick={() => {
              setShowPrizeModal(false);
              setShowLotteryActivityModal(false);
            }}
          >
            <div style={modalPanelStyle} onClick={(event) => event.stopPropagation()}>
              <div style={modalHeaderStyle}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#172033' }}>添加奖品</h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowPrizeModal(false);
                    setShowLotteryActivityModal(false);
                  }}
                  style={modalCloseStyle}
                >
                  ×
                </button>
              </div>
              <div style={modalBodyStyle}>
                <Field label="奖品类型" required>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
                    {[
                      { value: 'points' as PrizeType, label: '积分' },
                      { value: 'gift' as PrizeType, label: '赠品' },
                      { value: 'wechat_redpacket' as PrizeType, label: '微信红包' },
                      { value: 'lottery_chance' as PrizeType, label: '抽奖机会' },
                    ].map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setPrizeForm({ ...prizeForm, prizeType: item.value })}
                        style={radioLikeButtonStyle(prizeForm.prizeType === item.value)}
                      >
                        <span style={radioCircleStyle(prizeForm.prizeType === item.value)} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </Field>

                {prizeForm.prizeType === 'gift' && (
                  <Field label="选择赠品" required>
                    <div style={{ display: 'grid', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <button type="button" style={addPrizeButtonStyle}>
                          <Plus size={22} />
                          添加赠品
                        </button>
                        <button type="button" style={giftManageLinkStyle}>赠品管理</button>
                      </div>
                      <div style={giftInfoStyle}>
                        <div>赠品名称: {prizeForm.giftName}</div>
                        <div>赠品内容: {prizeForm.giftContent}</div>
                        <div>剩余库存: {prizeForm.giftStock}</div>
                      </div>
                    </div>
                  </Field>
                )}

                {prizeForm.prizeType === 'wechat_redpacket' && (
                  <>
                    <Field label="红包类型">
                      <div style={{ display: 'flex', gap: 20 }}>
                        {[
                          { value: 'lucky' as RedpacketType, label: '拼手气红包' },
                          { value: 'fixed' as RedpacketType, label: '普通红包' },
                        ].map((item) => (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => setPrizeForm({ ...prizeForm, redpacketType: item.value })}
                            style={radioLikeButtonStyle(prizeForm.redpacketType === item.value)}
                          >
                            <span style={radioCircleStyle(prizeForm.redpacketType === item.value)} />
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </Field>
                    <div style={redpacketBoxStyle}>
                      <Field label="红包个数" required>
                        <div style={inlineInputWrapStyle}>
                          <input
                            type="number"
                            min={1}
                            value={prizeForm.redpacketCount || ''}
                            onChange={(event) => setPrizeForm({ ...prizeForm, redpacketCount: Number(event.target.value) || 0 })}
                            placeholder="请输入"
                            style={baseInputStyle}
                          />
                          <span>个</span>
                        </div>
                      </Field>
                      <Field label="总金额" required>
                        <div style={inlineInputWrapStyle}>
                          <input
                            type="number"
                            min={0}
                            value={prizeForm.redpacketTotalAmount || ''}
                            onChange={(event) => setPrizeForm({ ...prizeForm, redpacketTotalAmount: Number(event.target.value) || 0 })}
                            placeholder="请输入"
                            style={baseInputStyle}
                          />
                          <span>元</span>
                        </div>
                      </Field>
                    </div>
                  </>
                )}

                {prizeForm.prizeType === 'lottery_chance' && (
                  <>
                    <Field label="转盘抽奖活动" required>
                      <div style={{ display: 'grid', gap: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <button type="button" onClick={() => setShowLotteryActivityModal(true)} style={addPrizeButtonStyle}>
                            <Plus size={22} />
                            选择抽奖活动
                          </button>
                          <button type="button" style={giftManageLinkStyle}>活动管理</button>
                        </div>
                        <div style={giftInfoStyle}>
                          <div>活动名称: {lotteryActivityOptions.find((item) => item.id === prizeForm.lotteryActivityId)?.name || '未选择'}</div>
                          <div>活动ID: {prizeForm.lotteryActivityId || '--'}</div>
                        </div>
                      </div>
                    </Field>
                    <Field label="发放机会次数" required>
                      <div style={inlineInputWrapStyle}>
                        <input
                          type="number"
                          min={1}
                          value={prizeForm.lotteryChanceCount || ''}
                          onChange={(event) => setPrizeForm({ ...prizeForm, lotteryChanceCount: Number(event.target.value) || 0 })}
                          placeholder="请输入"
                          style={baseInputStyle}
                        />
                        <span>次</span>
                      </div>
                    </Field>
                  </>
                )}

                {prizeForm.prizeType !== 'gift' && prizeForm.prizeType !== 'wechat_redpacket' && prizeForm.prizeType !== 'lottery_chance' && (
                  <Field label="奖励额度" required>
                    <div style={inlineInputWrapStyle}>
                      <input
                        type="number"
                        min={1}
                        value={prizeForm.rewardAmount || ''}
                        onChange={(event) => setPrizeForm({ ...prizeForm, rewardAmount: Number(event.target.value) || 0 })}
                        placeholder="请输入"
                        style={baseInputStyle}
                      />
                      <span>{getPrizeUnit(prizeForm.prizeType)}</span>
                    </div>
                  </Field>
                )}

                <Field label="奖品名称" required>
                  <input
                    value={prizeForm.prizeName}
                    onChange={(event) => setPrizeForm({ ...prizeForm, prizeName: event.target.value.slice(0, 6) })}
                    placeholder="请输入奖品名称"
                    style={baseInputStyle}
                  />
                </Field>
                <Field label="奖品图片" required>
                  <div style={{ display: 'grid', gap: 8 }}>
                    <input
                      id="prize-image"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(event) => {
                        const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
                        setPrizeForm((current) => {
                          if (current.imagePreview) URL.revokeObjectURL(current.imagePreview);
                          return {
                            ...current,
                            imageFile: file,
                            imagePreview: file ? URL.createObjectURL(file) : '',
                          };
                        });
                      }}
                    />
                    <label htmlFor="prize-image" style={prizeImageUploaderStyle}>
                      {prizeForm.imagePreview ? (
                        <img src={prizeForm.imagePreview} alt="奖品图片" style={prizeImagePreviewStyle} />
                      ) : (
                        <span style={{ fontSize: 14, color: '#687386', fontWeight: 700 }}>上传图片</span>
                      )}
                    </label>
                    <span style={{ fontSize: 12, color: '#8b95a7' }}>建议图片尺寸为 280*280 或 1:1</span>
                  </div>
                </Field>
                {prizeError && <div style={errorBoxStyle}>{prizeError}</div>}
              </div>
              <div style={modalFooterStyle}>
                <button
                  type="button"
                  onClick={() => {
                    setShowPrizeModal(false);
                    setShowLotteryActivityModal(false);
                  }}
                  style={modalCancelStyle}
                >
                  取消
                </button>
                <button type="button" onClick={confirmPrize} style={modalConfirmStyle}>确定</button>
              </div>
            </div>
            {showLotteryActivityModal && (
              <div style={{ ...modalOverlayStyle, background: 'rgba(15,23,42,0.24)' }} onClick={() => setShowLotteryActivityModal(false)}>
                <div style={{ ...modalPanelStyle, width: 520 }} onClick={(event) => event.stopPropagation()}>
                  <div style={modalHeaderStyle}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#172033' }}>选择抽奖活动</h3>
                    <button type="button" onClick={() => setShowLotteryActivityModal(false)} style={modalCloseStyle}>×</button>
                  </div>
                  <div style={{ ...modalBodyStyle, display: 'grid', gap: 8 }}>
                    {lotteryActivityOptions.map((item) => {
                      const active = prizeForm.lotteryActivityId === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setPrizeForm({ ...prizeForm, lotteryActivityId: item.id });
                            setShowLotteryActivityModal(false);
                          }}
                          style={{
                            height: 40,
                            borderRadius: 8,
                            border: active ? '1px solid #3b82f6' : '1px solid #d8dee8',
                            background: active ? '#eff6ff' : '#fff',
                            color: active ? '#1d4ed8' : '#334155',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0 12px',
                            fontSize: 13,
                            cursor: 'pointer',
                          }}
                        >
                          <span>{item.name}</span>
                          <span style={{ fontSize: 12, color: active ? '#2563eb' : '#94a3b8' }}>{item.id}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function getPrizeTypeLabel(type: PrizeType) {
  if (type === 'points') return '积分';
  if (type === 'gift') return '赠品';
  if (type === 'lottery_chance') return '抽奖机会';
  return '微信红包';
}

function followTabButtonStyle(active: boolean): CSSProperties {
  return {
    height: 32,
    padding: '0 14px',
    borderRadius: 999,
    border: active ? '1px solid #1d4ed8' : '1px solid #d8dee8',
    background: active ? 'rgba(29,78,216,0.10)' : '#fff',
    color: active ? '#1d4ed8' : '#475569',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
  };
}

function removeIconButtonStyle(disabled: boolean): CSSProperties {
  return {
    width: 32,
    height: 32,
    border: '1px solid #d8dee8',
    borderRadius: 6,
    background: disabled ? '#f3f4f6' : '#fff',
    color: disabled ? '#a1a8b3' : '#6b7280',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    lineHeight: 1,
  };
}

function addInlineButtonStyle(disabled: boolean): CSSProperties {
  return {
    height: 32,
    width: 'fit-content',
    padding: '0 10px',
    borderRadius: 6,
    border: '1px dashed #cbd5e1',
    background: '#fff',
    color: disabled ? '#a1a8b3' : '#1d4ed8',
    fontSize: 12,
    fontWeight: 700,
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
  };
}

function getPrizeUnit(type: PrizeType) {
  if (type === 'points') return '积分';
  return '';
}

function getSceneKey(value: string | null): SceneKey {
  return sceneOptions.some((item) => item.key === value) ? (value as SceneKey) : 'seeding';
}

function isSceneValid(scene: SceneKey, data: {
  followTargets: Array<{ platform: string; account: string; sampleImage: File | null; sampleImagePreview: string; guideText: string }>;
  followRuleDescription: string;
  followPlaybookEnabled: boolean;
  engagementContentMode: EngagementContentMode;
  engagementShareImagePreview: string;
  engagementSampleImages: File[];
  contentUrl: string;
  engagementRuleDescription: string;
  interactionActions: string[];
  skuScope: string;
  seedingHashtag: string;
  seedingKeyword: string;
  seedingRuleDescription: string;
  engagementRewardRuleDescription: string;
  engagementRewardTiers: Array<{ interactionType: string; interactionAmount: number; prize: unknown }>;
}) {
  if (scene === 'follow') {
    if (!data.followPlaybookEnabled) return true;
    return !hasFollowTargetError(data.followTargets) && Boolean(data.followRuleDescription.trim());
  }
  if (scene === 'engagement') {
    const hasContentSource =
      data.engagementContentMode === 'link' ? Boolean(data.contentUrl.trim()) : Boolean(data.engagementShareImagePreview);
    return hasContentSource && data.interactionActions.length > 0 && Boolean(data.engagementRuleDescription.trim());
  }
  if (scene === 'engagement_reward') return Boolean(data.contentUrl.trim()) && Boolean(data.engagementRewardRuleDescription.trim()) && data.engagementRewardTiers.length > 0 && data.engagementRewardTiers.every((tier) => tier.interactionAmount > 0 && tier.prize !== null);
  return Boolean(data.seedingRuleDescription.trim());
}

function hasFollowTargetError(targets: Array<{ platform: string; account: string; sampleImage: File | null; sampleImagePreview: string; guideText: string }>) {
  return targets.length === 0 || targets.some((target) => !target.platform.trim() || !target.account.trim() || !target.guideText.trim());
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={panelStyle}>
      <div style={panelHeaderStyle}>
        <h2 style={panelTitleStyle}>{title}</h2>
      </div>
      <div style={panelBodyStyle}>{children}</div>
    </section>
  );
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: ReactNode }) {
  return (
    <label style={fieldStyle}>
      <span style={labelStyle}>
        {label}
        {required && <span style={{ color: '#d92d20' }}>*</span>}
      </span>
      {children}
      {error && <span style={fieldErrorStyle}>{error}</span>}
    </label>
  );
}

function SceneFields({ children }: { children: ReactNode }) {
  return <div style={{ display: 'grid', gap: 16 }}>{children}</div>;
}

function Segmented({ value, options, onChange }: { value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <div style={segmentedStyle}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          style={{
            ...segmentButtonStyle,
            background: value === option ? '#172033' : 'transparent',
            color: value === option ? '#f8fafc' : '#4b5565',
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function CheckboxGroup({ values, options, onChange }: { values: string[]; options: string[]; onChange: (values: string[]) => void }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map((option) => {
        const checked = values.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(checked ? values.filter((item) => item !== option) : [...values, option])}
            style={{
              ...chipButtonStyle,
              borderColor: checked ? '#2563eb' : '#d8dee8',
              background: checked ? 'rgba(37,99,235,0.08)' : '#fbfcfe',
              color: checked ? '#1d4ed8' : '#3b4558',
            }}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function inputStyle(hasError?: boolean): CSSProperties {
  return {
    ...baseInputStyle,
    borderColor: hasError ? '#d92d20' : '#d8dee8',
    background: hasError ? '#fff8f7' : '#fbfcfe',
  };
}

function textareaStyle(hasError?: boolean): CSSProperties {
  return {
    ...inputStyle(hasError),
    minHeight: 96,
    height: 'auto',
    padding: '10px 11px',
    lineHeight: 1.6,
    resize: 'vertical',
    fontFamily: 'inherit',
  };
}

function switchStyle(enabled: boolean): CSSProperties {
  return {
    width: 46,
    height: 26,
    borderRadius: 999,
    border: 'none',
    background: enabled ? '#2563eb' : '#d1d5db',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: enabled ? 'flex-end' : 'flex-start',
    padding: 3,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };
}

function switchThumbStyle(enabled: boolean): CSSProperties {
  return {
    width: 20,
    height: 20,
    borderRadius: 999,
    background: '#fff',
    boxShadow: enabled ? '0 2px 6px rgba(37,99,235,0.4)' : '0 2px 6px rgba(15,23,42,0.18)',
  };
}

function dateWrapStyle(hasError?: boolean): CSSProperties {
  return {
    border: `1px solid ${hasError ? '#d92d20' : '#d8dee8'}`,
    borderRadius: 6,
    background: '#fbfcfe',
    padding: '6px 8px',
  };
}

const pageStyle: CSSProperties = {
  minHeight: '100%',
  padding: 24,
  background: 'linear-gradient(180deg, #f5f7fb 0%, #eef2f7 100%)',
};

const shellStyle: CSSProperties = {
  maxWidth: 1180,
  margin: '0 auto',
};

const backButtonStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  height: 32,
  border: 'none',
  background: 'transparent',
  color: '#41516a',
  cursor: 'pointer',
  fontSize: 13,
  padding: 0,
  marginBottom: 14,
};

const heroStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 20,
  alignItems: 'flex-start',
  padding: '22px 24px',
  border: '1px solid #dfe5ee',
  borderRadius: 8,
  background: 'linear-gradient(135deg, #ffffff 0%, #f7f9fc 58%, #eef4f7 100%)',
};

const eyebrowStyle: CSSProperties = {
  fontSize: 11,
  letterSpacing: 0,
  fontWeight: 800,
  color: '#687386',
  marginBottom: 6,
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 26,
  lineHeight: 1.2,
  fontWeight: 800,
  color: '#111827',
};

const subTitleStyle: CSSProperties = {
  maxWidth: 650,
  margin: '8px 0 0',
  fontSize: 13,
  lineHeight: 1.7,
  color: '#5b6678',
};

const contentGridStyle: CSSProperties = {
  display: 'grid',
  gap: 14,
  marginTop: 14,
};

const panelStyle: CSSProperties = {
  border: '1px solid #dfe5ee',
  borderRadius: 8,
  background: '#ffffff',
  overflow: 'visible',
};

const panelHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '15px 18px',
  borderBottom: '1px solid #edf1f6',
  background: '#fbfcfe',
};

const panelTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 16,
  fontWeight: 800,
  color: '#172033',
  lineHeight: 1.3,
};

const panelBodyStyle: CSSProperties = {
  display: 'grid',
  gap: 16,
  padding: 18,
};

const twoColumnStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 14,
};

const addPrizeButtonStyle: CSSProperties = {
  height: 42,
  minWidth: 150,
  width: 'fit-content',
  padding: '0 16px',
  border: '1px solid #c3c9d2',
  borderRadius: 4,
  background: '#fff',
  color: '#4d5562',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
};

const prizeSummaryStyle: CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: 6,
  background: '#f8fafc',
  padding: '10px 12px',
  display: 'grid',
  gap: 6,
  fontSize: 13,
  color: '#344256',
};

const modalOverlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 1500,
  background: 'rgba(15,23,42,0.32)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
};

const modalPanelStyle: CSSProperties = {
  width: 'min(80vw, 640px)',
  maxHeight: '86vh',
  background: '#ffffff',
  borderRadius: 8,
  border: '1px solid #d9dee6',
  display: 'grid',
  gridTemplateRows: 'auto minmax(0, 1fr) auto',
  overflow: 'hidden',
};

const modalHeaderStyle: CSSProperties = {
  padding: '14px 18px',
  borderBottom: '1px solid #d9dee6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: '#fff',
};

const modalCloseStyle: CSSProperties = {
  border: 'none',
  background: 'transparent',
  fontSize: 20,
  lineHeight: 1,
  color: '#8d95a3',
  cursor: 'pointer',
  width: 28,
  height: 28,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 6,
  padding: 0,
};

const modalBodyStyle: CSSProperties = {
  padding: '16px 18px',
  overflowY: 'auto',
  display: 'grid',
  gap: 14,
};

const modalFooterStyle: CSSProperties = {
  borderTop: '1px solid #d9dee6',
  padding: '10px 16px',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 8,
  background: '#fff',
};

const modalCancelStyle: CSSProperties = {
  minWidth: 84,
  height: 38,
  border: '1px solid #c5ccd8',
  borderRadius: 4,
  background: '#fff',
  color: '#4b5565',
  fontSize: 12,
  fontWeight: 700,
  cursor: 'pointer',
};

const modalConfirmStyle: CSSProperties = {
  minWidth: 84,
  height: 38,
  border: 'none',
  borderRadius: 4,
  background: '#2563eb',
  color: '#fff',
  fontSize: 12,
  fontWeight: 700,
  cursor: 'pointer',
};

const radioLikeButtonStyle = (checked: boolean): CSSProperties => ({
  border: 'none',
  background: 'transparent',
  fontSize: 12,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  cursor: 'pointer',
  padding: 0,
  fontWeight: checked ? 700 : 500,
  color: checked ? '#2563eb' : '#4b5565',
});

const radioCircleStyle = (checked: boolean): CSSProperties => ({
  width: 18,
  height: 18,
  borderRadius: 999,
  border: `2px solid ${checked ? '#2563eb' : '#c8cdd6'}`,
  boxSizing: 'border-box',
  background: checked ? 'radial-gradient(circle, #2563eb 42%, transparent 46%)' : 'transparent',
});

const giftManageLinkStyle: CSSProperties = {
  border: 'none',
  background: 'transparent',
  color: '#2563eb',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  padding: 0,
};

const giftInfoStyle: CSSProperties = {
  width: 'min(100%, 820px)',
  background: '#eef0f3',
  borderRadius: 2,
  padding: 10,
  display: 'grid',
  gap: 4,
  fontSize: 12,
  color: '#505a68',
};

const redpacketBoxStyle: CSSProperties = {
  width: 'min(100%, 820px)',
  padding: 10,
  borderRadius: 2,
  background: '#eef0f3',
  display: 'grid',
  gap: 10,
};

const inlineInputWrapStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
};

const prizeImageUploaderStyle: CSSProperties = {
  width: 120,
  height: 120,
  border: '1px dashed #cbd5e1',
  borderRadius: 4,
  background: '#fff',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  overflow: 'hidden',
};

const prizeImagePreviewStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const fieldStyle: CSSProperties = {
  display: 'grid',
  gap: 7,
};

const labelStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 3,
  fontSize: 13,
  fontWeight: 700,
  color: '#2f3a4d',
};

const fieldErrorStyle: CSSProperties = {
  fontSize: 12,
  color: '#d92d20',
};

const segmentedStyle: CSSProperties = {
  display: 'inline-flex',
  width: 'fit-content',
  maxWidth: '100%',
  padding: 3,
  borderRadius: 7,
  background: '#eef2f6',
  gap: 3,
  flexWrap: 'wrap',
};

const segmentButtonStyle: CSSProperties = {
  height: 30,
  padding: '0 11px',
  border: 'none',
  borderRadius: 5,
  fontSize: 12,
  fontWeight: 700,
  cursor: 'pointer',
};

const chipButtonStyle: CSSProperties = {
  height: 32,
  padding: '0 12px',
  border: '1px solid',
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 700,
  cursor: 'pointer',
};

const toggleStyle: CSSProperties = {
  position: 'relative',
  width: 116,
  height: 36,
  border: 'none',
  borderRadius: 999,
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 800,
  paddingLeft: 13,
  textAlign: 'left',
};

const toggleDotStyle: CSSProperties = {
  position: 'absolute',
  right: 6,
  top: 6,
  width: 24,
  height: 24,
  borderRadius: 999,
  background: '#ffffff',
  boxShadow: '0 2px 7px rgba(15,23,42,0.18)',
  transition: 'transform 0.18s ease-out',
};

const switchRowStyle: CSSProperties = {
  minHeight: 42,
  display: 'flex',
  alignItems: 'center',
  padding: '10px 12px',
  border: '1px solid #edf1f6',
  borderRadius: 7,
  background: '#fbfcfe',
};

const checkboxLabelStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 13,
  fontWeight: 700,
  color: '#2f3a4d',
  cursor: 'pointer',
};

const errorBoxStyle: CSSProperties = {
  marginTop: 10,
  padding: '9px 10px',
  borderRadius: 6,
  background: '#fff1f0',
  color: '#b42318',
  fontSize: 12,
  lineHeight: 1.55,
};

const bottomActionBarStyle: CSSProperties = {
  position: 'sticky',
  bottom: 0,
  zIndex: 20,
  marginTop: 14,
  padding: '10px 0',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 8,
  background: 'linear-gradient(180deg, rgba(245,247,251,0), rgba(245,247,251,0.96) 32%)',
};

const secondaryButtonStyle: CSSProperties = {
  height: 38,
  padding: '0 20px',
  border: '1px solid #d8dee8',
  borderRadius: 6,
  background: '#ffffff',
  color: '#435066',
  fontSize: 13,
  fontWeight: 750,
  cursor: 'pointer',
};

const primaryButtonStyle: CSSProperties = {
  height: 38,
  padding: '0 20px',
  border: 'none',
  borderRadius: 6,
  color: '#ffffff',
  fontSize: 13,
  fontWeight: 800,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 7,
};
