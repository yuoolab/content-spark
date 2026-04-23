import { useNavigate, useParams } from 'react-router';
import { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Info,
  Hash,
  Gift,
  Check,
  Share2,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { DateRangePicker } from '../ui/DateRangePicker';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { PlatformBadge } from '../platform/PlatformBadge';

// Mock gift catalog from the backend
const GIFT_CATALOG = [
  { id: 'g1', name: '品牌帆布包',     stock: 120, tag: '实物',   emoji: '👜' },
  { id: 'g2', name: '定制马克杯',     stock: 85,  tag: '实物',   emoji: '☕' },
  { id: 'g3', name: '品牌T恤（M码）', stock: 60,  tag: '服饰',   emoji: '👕' },
  { id: 'g4', name: '护肤礼盒套装',   stock: 40,  tag: '美妆',   emoji: '🧴' },
  { id: 'g5', name: '无线蓝牙耳机',   stock: 20,  tag: '电子',   emoji: '🎧' },
  { id: 'g6', name: '限定款香薰蜡烛', stock: 55,  tag: '生活',   emoji: '🕯️' },
  { id: 'g7', name: '品牌帽子',       stock: 98,  tag: '服饰',   emoji: '🧢' },
  { id: 'g8', name: '手提保温杯',     stock: 75,  tag: '实物',   emoji: '🧃' },
];

const LOTTERY_CATALOG = [
  { id: 'l1', name: '转盘抽奖机会 - 标准版', desc: '适合常规任务发放' },
  { id: 'l2', name: '转盘抽奖机会 - 会员专享版', desc: '适合会员权益任务' },
  { id: 'l3', name: '转盘抽奖机会 - 活动加码版', desc: '适合活动期间限时发放' },
];

type BaseRewardType = 'points' | 'lottery';
type RewardValueType = 'points' | 'gift' | 'cash' | 'lottery';

interface EngagementTier {
  rankStart: number;
  rankEnd: number;
  rewardType: 'points' | 'gift' | 'cash';
  amount: number;
  giftName: string;
}

type EngagementRewardMode = 'ranking' | 'fixed';

type BaseRewardReleaseMode = 'after_end' | 'after_review';

type EngagementRewardReleaseMode = 'after_end';

interface FixedEngagementReward {
  metric: 'likes' | 'comments' | 'collections' | 'combined';
  threshold: number;
  rewardType: 'points' | 'gift' | 'cash';
  amount: number;
  giftName: string;
}

function SectionCard({
  title,
  description,
  icon: Icon,
  children,
  step,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
  step: number;
}) {
  return (
    <div
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--elevation-sm)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'var(--muted)',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--primary)',
            color: 'var(--primary-foreground)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: 'var(--font-weight-semibold)',
            flexShrink: 0,
          }}
        >
          {step}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 'var(--text-h4)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--foreground)',
              lineHeight: '1.4',
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginTop: '1px' }}>
            {description}
          </div>
        </div>
        <Icon size={18} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
      </div>
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  );
}

function FormField({
  label,
  hint,
  required,
  badge,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          marginBottom: '6px',
          fontSize: 'var(--text-base)',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--foreground)',
        }}
      >
        {label}
        {required && (
          <span style={{ color: 'var(--destructive)', fontSize: '14px' }}>*</span>
        )}
        {hint && (
          <span
            title={hint}
            style={{ cursor: 'help', display: 'flex', alignItems: 'center' }}
          >
            <Info size={13} style={{ color: 'var(--muted-foreground)' }} />
          </span>
        )}
        {badge && <span style={{ marginLeft: 'auto' }}>{badge}</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  fontSize: 'var(--text-base)',
  background: 'var(--input-background)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  color: 'var(--foreground)',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
};

export function TaskCreate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    taskRuleMode: 'auto' as 'auto' | 'manual',
    manualRuleType: 'text' as 'text' | 'image',
    manualRuleImage: null as File | null,
    taskImage: null as File | null,
    platform: 'xiaohongshu',
    hashtags: [''],
    keywords: [''],
    keywordLogic: 'OR' as 'OR' | 'AND',
    contentType: 'all',
    startDate: '',
    endDate: '',
    // 投稿奖励
    baseRewardEnabled: true,
    baseRewardType: 'points' as BaseRewardType,
    baseRewardAmount: 50,
    baseRewardLotteryId: '',
    maxSubmissionsPerUser: 1,
    baseRewardReleaseMode: 'after_end' as BaseRewardReleaseMode,
    baseRewardReleaseDays: 3,
    // 互动量奖励
    engagementRewardEnabled: false,
    engagementRewardMode: 'ranking' as EngagementRewardMode,
    engagementMetric: 'likes' as 'likes' | 'comments' | 'collections' | 'combined',
    engagementTiers: [] as EngagementTier[],
    fixedEngagementRewards: [] as FixedEngagementReward[],
    engagementRewardReleaseMode: 'after_end' as EngagementRewardReleaseMode,
    engagementRewardReleaseDays: 3,
    shareTitle: '',
    shareImage: null as File | null,
  });
  const [showValidation, setShowValidation] = useState(false);
  const [shareImagePreview, setShareImagePreview] = useState('');
  const [manualRuleImagePreview, setManualRuleImagePreview] = useState('');
  const [platformHover, setPlatformHover] = useState<string | null>(null);
  const [lotteryDialogOpen, setLotteryDialogOpen] = useState(false);
  const validationColor = '#ff4d4f';
  const validationTextStyle: React.CSSProperties = {
    fontSize: '12px',
    color: validationColor,
    lineHeight: '18px',
    marginTop: '2px',
  };

  const isTaskNameEmpty = !formData.name.trim();
  const isTaskTimeEmpty = !formData.startDate || !formData.endDate;
  const isTaskImageEmpty = !formData.taskImage;
  const isManualRuleTextEmpty =
    formData.taskRuleMode === 'manual' &&
    formData.manualRuleType === 'text' &&
    !formData.description.trim();
  const isManualRuleImageEmpty =
    formData.taskRuleMode === 'manual' &&
    formData.manualRuleType === 'image' &&
    !formData.manualRuleImage;
  const isBaseRewardLotteryEmpty =
    formData.baseRewardEnabled &&
    formData.baseRewardType === 'lottery' &&
    !formData.baseRewardLotteryId;
  const isShareTitleEmpty = !formData.shareTitle.trim();
  const isShareImageEmpty = !formData.shareImage;

  const hasFormError =
    isTaskNameEmpty ||
    isTaskTimeEmpty ||
    isTaskImageEmpty ||
    isManualRuleTextEmpty ||
    isManualRuleImageEmpty ||
    isBaseRewardLotteryEmpty ||
    isShareTitleEmpty ||
    isShareImageEmpty;

  const platformOptions = [
    { value: 'xiaohongshu', label: '小红书', emoji: '📕' },
    { value: 'douyin', label: '抖音', emoji: '🎵' },
    { value: 'bilibili', label: '哔哩哔哩', emoji: '📺' },
  ];

  const HASHTAG_MAX = 10;
  const KEYWORD_MAX = 10;

  const addHashtag = () => {
    if (formData.hashtags.length >= HASHTAG_MAX) return;
    setFormData({ ...formData, hashtags: [...formData.hashtags, ''] });
  };
  const updateHashtag = (index: number, value: string) => {
    const n = [...formData.hashtags];
    n[index] = value;
    setFormData({ ...formData, hashtags: n });
  };
  const removeHashtag = (index: number) =>
    setFormData({
      ...formData,
      hashtags: formData.hashtags.filter((_, i) => i !== index),
    });

  const addKeyword = () => {
    if (formData.keywords.length >= KEYWORD_MAX) return;
    setFormData({ ...formData, keywords: [...formData.keywords, ''] });
  };
  const updateKeyword = (index: number, value: string) => {
    const n = [...formData.keywords];
    n[index] = value;
    setFormData({ ...formData, keywords: n });
  };
  const removeKeyword = (index: number) =>
    setFormData({
      ...formData,
      keywords: formData.keywords.filter((_, i) => i !== index),
    });

  const ENGAGEMENT_TIER_MAX = 5;
  const addEngagementTier = () => {
    if (formData.engagementTiers.length >= ENGAGEMENT_TIER_MAX) return;
    const last = formData.engagementTiers[formData.engagementTiers.length - 1];
    const nextStart = last ? last.rankEnd + 1 : 1;
    setFormData({
      ...formData,
      engagementTiers: [
        ...formData.engagementTiers,
        { rankStart: nextStart, rankEnd: nextStart, rewardType: 'points', amount: 0, giftName: '' },
      ],
    });
  };
  const updateEngagementTier = (index: number, field: keyof EngagementTier, value: any) => {
    const n = [...formData.engagementTiers];
    n[index] = { ...n[index], [field]: value };
    setFormData({ ...formData, engagementTiers: n });
  };
  const removeEngagementTier = (index: number) =>
    setFormData({
      ...formData,
      engagementTiers: formData.engagementTiers.filter((_, i) => i !== index),
    });

  const FIXED_ENGAGEMENT_REWARD_MAX = 10;
  const addFixedEngagementReward = () => {
    if (formData.fixedEngagementRewards.length >= FIXED_ENGAGEMENT_REWARD_MAX) return;
    setFormData({
      ...formData,
      fixedEngagementRewards: [
        ...formData.fixedEngagementRewards,
        { metric: 'likes', threshold: 0, rewardType: 'points', amount: 0, giftName: '' },
      ],
    });
  };
  const updateFixedEngagementReward = (
    index: number,
    field: keyof FixedEngagementReward,
    value: any
  ) => {
    const n = [...formData.fixedEngagementRewards];
    n[index] = { ...n[index], [field]: value };
    setFormData({ ...formData, fixedEngagementRewards: n });
  };
  const removeFixedEngagementReward = (index: number) =>
    setFormData({
      ...formData,
      fixedEngagementRewards: formData.fixedEngagementRewards.filter((_, i) => i !== index),
    });

  const rewardTypeOptions: { value: 'points' | 'gift' | 'cash'; label: string; icon: string }[] = [
    { value: 'points', label: '积分', icon: '🪙' },
    { value: 'gift',   label: '赠品', icon: '🎁' },
    { value: 'cash',   label: '现金红包', icon: '🧧' },
  ];
  const baseRewardTypeOptions: { value: BaseRewardType; label: string; icon: string }[] = [
    { value: 'points', label: '积分', icon: '🪙' },
    { value: 'lottery', label: '抽奖机会', icon: '🎡' },
  ];
  const engagementMetricOptions: { value: 'likes' | 'comments' | 'collections' | 'combined'; label: string }[] = [
    { value: 'likes',       label: '点赞数' },
    { value: 'comments',    label: '评论数' },
    { value: 'collections', label: '收藏数' },
    { value: 'combined',    label: '综合互动' },
  ];
  const fixedRewardMetricOptions: { value: 'likes' | 'comments' | 'collections' | 'combined'; label: string }[] = [
    { value: 'likes', label: '点赞数' },
    { value: 'comments', label: '评论数' },
    { value: 'collections', label: '收藏数' },
    { value: 'combined', label: '综合互动' },
  ];

  function RewardValueInput({
    rewardType, amount, giftName, onAmountChange, onGiftNameChange, onPickLottery, compact = false,
  }: {
    rewardType: RewardValueType;
    amount: number;
    giftName: string;
    onAmountChange: (v: number) => void;
    onGiftNameChange: (v: string) => void;
    onPickLottery?: () => void;
    compact?: boolean;
  }) {
    if (rewardType === 'gift') {
      const selected = GIFT_CATALOG.find((g) => g.id === giftName);
      return (
        <div style={{ position: 'relative', flex: compact ? '0 0 180px' : 1, minWidth: compact ? '180px' : '180px' }}>
          <select
            value={giftName}
            onChange={(e) => onGiftNameChange(e.target.value)}
            style={{
              ...selectStyle,
              paddingLeft: selected ? '34px' : '12px',
              color: selected ? 'var(--foreground)' : 'var(--muted-foreground)',
            }}
          >
            <option value="">— 从库存中选择赠品 —</option>
            {GIFT_CATALOG.map((g) => (
              <option key={g.id} value={g.id}>
                {g.emoji} {g.name}（库存 {g.stock}）
              </option>
            ))}
          </select>
          {selected && (
            <span style={{
              position: 'absolute', left: '10px', top: '50%',
              transform: 'translateY(-50%)', fontSize: '14px', pointerEvents: 'none',
            }}>
              {selected.emoji}
            </span>
          )}
        </div>
      );
    }
    if (rewardType === 'lottery') {
      const selected = LOTTERY_CATALOG.find((item) => item.id === giftName);
      return (
        <button
          type="button"
          onClick={onPickLottery}
          style={{
            ...inputStyle,
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            cursor: 'pointer',
            textAlign: 'left',
            flex: compact ? '0 0 260px' : 1,
            minWidth: compact ? '260px' : '220px',
            color: selected ? 'var(--foreground)' : 'var(--muted-foreground)',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <span>🎡</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {selected ? selected.name : '选择转盘抽奖'}
            </span>
          </span>
          <span style={{ color: 'var(--primary)', fontSize: '12px', whiteSpace: 'nowrap' }}>
            点击选择
          </span>
        </button>
      );
    }
    return (
      <div style={{ position: 'relative', flex: compact ? '0 0 96px' : 1 }}>
        <input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
          style={{
            ...inputStyle,
            paddingRight: '52px',
            width: compact ? '96px' : '100%',
            minWidth: compact ? '96px' : undefined,
          }}
          min="0"
          placeholder="0"
        />
        <span style={{
          position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
          fontSize: '12px', color: 'var(--muted-foreground)', pointerEvents: 'none',
        }}>
          {rewardType === 'points' ? '积分' : '元'}
        </span>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowValidation(true);
    if (hasFormError) return;
    navigate('/backend/tasks');
  };

  const chooseLottery = (lotteryId: string) => {
    setFormData({
      ...formData,
      baseRewardType: 'lottery',
      baseRewardLotteryId: lotteryId,
    });
    setLotteryDialogOpen(false);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
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
            padding: '0',
            marginBottom: '14px',
          }}
        >
          <ArrowLeft size={15} />
          返回任务列表
        </button>
      </div>

      <form noValidate onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Section 1: Basic Info */}
        <SectionCard
          step={1}
          title="基本信息"
          description="设置任务名称、平台和时间范围"
          icon={Info}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FormField label="任务名称" required>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={formData.name}
                    maxLength={30}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      ...inputStyle,
                      borderColor: showValidation && isTaskNameEmpty ? validationColor : 'var(--border)',
                      paddingRight: '60px',
                    }}
                    placeholder="例如：春季新品种草计划"
                  />
                  <span
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '12px',
                      color: 'var(--muted-foreground)',
                      pointerEvents: 'none',
                    }}
                  >
                    {formData.name.length}/30
                  </span>
                </div>
                {showValidation && isTaskNameEmpty && (
                  <div style={validationTextStyle}>请输入任务名称</div>
                )}
              </div>
            </FormField>

            <FormField label="任务时间" required hint="任务开放参与的时间范围">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div
                  style={{
                    border: `1px solid ${showValidation && isTaskTimeEmpty ? validationColor : 'var(--border)'}`,
                    borderRadius: 'var(--radius)',
                    padding: '8px 10px',
                  }}
                >
                  <DateRangePicker
                    startDate={formData.startDate}
                    endDate={formData.endDate}
                    onStartChange={(v) => setFormData({ ...formData, startDate: v })}
                    onEndChange={(v) => setFormData({ ...formData, endDate: v })}
                  />
                </div>
                {showValidation && isTaskTimeEmpty && (
                  <div style={validationTextStyle}>请选择任务时间</div>
                )}
              </div>
            </FormField>

            <FormField label="任务图片" required hint="仅支持上传 1 张图片">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  id="task-image-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      taskImage: e.target.files && e.target.files[0] ? e.target.files[0] : null,
                    })
                  }
                  style={{ display: 'none' }}
                />
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
                  <label
                    htmlFor="task-image-input"
                    style={{
                      width: '104px',
                      height: '104px',
                      border: `1px dashed ${showValidation && isTaskImageEmpty ? validationColor : 'var(--border)'}`,
                      borderRadius: '2px',
                      background: 'var(--card)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                      userSelect: 'none',
                      boxSizing: 'border-box',
                    }}
                  >
                    <Plus size={16} style={{ color: 'var(--muted-foreground)' }} />
                    <span style={{ fontSize: '12px', color: 'var(--card-foreground)' }}>
                      上传图片
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, taskImage: null })}
                    style={{
                      border: 'none',
                      background: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      fontSize: '12px',
                      color: 'rgba(36,116,255,1)',
                      marginBottom: '8px',
                    }}
                  >
                    恢复默认图
                  </button>
                </div>

                {formData.taskImage && (
                  <div style={{ fontSize: '12px', color: 'var(--foreground)' }}>
                    已上传：{formData.taskImage.name}
                  </div>
                )}
                {showValidation && isTaskImageEmpty && (
                  <div style={validationTextStyle}>请上传任务图片</div>
                )}
                <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
                  建议图片尺寸为 1125*633，仅支持上传 1 张
                </div>
              </div>
            </FormField>

            <FormField label="参与规则" required>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { value: 'auto' as const, label: '根据规则自动生成' },
                    { value: 'manual' as const, label: '自定义规则' },
                  ].map((opt) => {
                    const selected = formData.taskRuleMode === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, taskRuleMode: opt.value })}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 'var(--radius)',
                          border: `1.5px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
                          background: selected ? 'rgba(36,116,255,0.06)' : 'var(--input-background)',
                          cursor: 'pointer',
                          fontSize: 'var(--text-base)',
                          color: selected ? 'var(--primary)' : 'var(--foreground)',
                          fontWeight: selected ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
                {formData.taskRuleMode === 'manual' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                      {[
                        { value: 'text' as const, label: '文本规则' },
                        { value: 'image' as const, label: '图片规则' },
                      ].map((opt) => {
                        const selected = formData.manualRuleType === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, manualRuleType: opt.value })}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              background: 'none',
                              border: 'none',
                              padding: 0,
                              cursor: 'pointer',
                              color: 'var(--foreground)',
                              fontSize: 'var(--text-base)',
                            }}
                          >
                            <span
                              style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                border: `2px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
                                boxSizing: 'border-box',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {selected && (
                                <span
                                  style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: 'var(--primary)',
                                  }}
                                />
                              )}
                            </span>
                            <span>{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {formData.manualRuleType === 'text' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ position: 'relative' }}>
                          <textarea
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({ ...formData, description: e.target.value })
                            }
                            maxLength={2000}
                            placeholder="简要说明任务内容，让用户了解参与方式和奖励机制，例如：1. 参与平台 2. 内容要求 3. 奖励设置等"
                            style={{
                              ...inputStyle,
                              minHeight: '88px',
                              resize: 'vertical',
                              paddingBottom: '28px',
                              borderColor:
                                showValidation && isManualRuleTextEmpty ? validationColor : 'var(--border)',
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              right: '12px',
                              bottom: '10px',
                              fontSize: '12px',
                              color: 'var(--muted-foreground)',
                              pointerEvents: 'none',
                            }}
                          >
                            {formData.description.length}/2000
                          </div>
                        </div>
                        {showValidation && isManualRuleTextEmpty && (
                          <div style={validationTextStyle}>请输入活动规则</div>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input
                          id="manual-rule-image-input"
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          onChange={(e) => {
                            const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                            setFormData({ ...formData, manualRuleImage: file });
                            if (!file) {
                              setManualRuleImagePreview('');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = () =>
                              setManualRuleImagePreview(typeof reader.result === 'string' ? reader.result : '');
                            reader.readAsDataURL(file);
                          }}
                          style={{ display: 'none' }}
                        />
                        <label
                          htmlFor="manual-rule-image-input"
                          style={{
                            width: '104px',
                            height: '104px',
                            border: `1px dashed ${showValidation && isManualRuleImageEmpty ? validationColor : 'var(--border)'}`,
                            borderRadius: '2px',
                            background: 'var(--card)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            cursor: 'pointer',
                            userSelect: 'none',
                            boxSizing: 'border-box',
                            overflow: 'hidden',
                          }}
                        >
                          {manualRuleImagePreview ? (
                            <img
                              src={manualRuleImagePreview}
                              alt="参与规则图片预览"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <>
                              <span style={{ fontSize: '24px', lineHeight: 1, color: 'var(--muted-foreground)' }}>+</span>
                              <span style={{ fontSize: '12px', color: 'var(--card-foreground)' }}>
                                上传图片
                              </span>
                            </>
                          )}
                        </label>
                        {showValidation && isManualRuleImageEmpty && (
                          <div style={validationTextStyle}>请上传活动规则图片</div>
                        )}
                        <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
                          图片高度不限，支持jpg/png/jpeg格式，大小不超过6M，最多上传1张
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </FormField>

          </div>
        </SectionCard>

        {/* Section 2: Content Requirements */}
        <SectionCard
          step={2}
          title="内容要求"
          description="设置话题标签、关键词和内容门槛"
          icon={Hash}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FormField label="参与平台" required>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {platformOptions.map((platform) => {
                  const checked = formData.platform === platform.value;
                  const isLocked = true;
                  const disabledHint =
                    platform.value === 'xiaohongshu' ? '当前固定为小红书' : '敬请期待';
                  return (
                    <div key={platform.value} style={{ position: 'relative' }}>
                      <label
                        onMouseEnter={() => setPlatformHover(platform.value)}
                        onMouseLeave={() => setPlatformHover((current) => (current === platform.value ? null : current))}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 16px',
                          borderRadius: 'var(--radius)',
                          border: `1px solid ${checked ? 'var(--primary)' : 'var(--border)'}`,
                          background: checked ? 'rgba(36,116,255,0.06)' : 'var(--input-background)',
                          cursor: isLocked ? 'not-allowed' : 'pointer',
                          transition: 'all 0.15s',
                          userSelect: 'none',
                          opacity: platform.value === 'xiaohongshu' ? 1 : 0.58,
                        }}
                      >
                        <span
                          style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '3px',
                            border: `1.5px solid ${checked ? 'var(--primary)' : 'var(--border)'}`,
                            background: checked ? 'var(--primary)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            transition: 'all 0.15s',
                          }}
                        >
                          {checked && <Check size={10} color="white" strokeWidth={3} />}
                        </span>
                        <input
                          type="radio"
                          checked={checked}
                          readOnly
                          disabled
                          name="task-platform"
                          style={{ display: 'none' }}
                        />
                        <PlatformBadge
                          platform={platform.label}
                          size={12}
                          strong={checked}
                          style={{
                            padding: '2px 8px 2px 3px',
                            fontSize: '11px',
                            borderColor: checked ? 'rgba(36,116,255,0.22)' : 'var(--border)',
                            background: checked ? 'rgba(36,116,255,0.08)' : 'var(--input-background)',
                          }}
                        />
                      </label>
                      {platformHover === platform.value && platform.value !== 'xiaohongshu' && (
                        <div
                          style={{
                            position: 'absolute',
                            left: '50%',
                            top: '-42px',
                            transform: 'translateX(-50%)',
                            background: 'rgba(0,0,0,0.82)',
                            color: '#fff',
                            fontSize: '12px',
                            lineHeight: '1',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            whiteSpace: 'nowrap',
                            pointerEvents: 'none',
                            zIndex: 20,
                            boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
                          }}
                        >
                          {disabledHint}
                          <div
                            style={{
                              position: 'absolute',
                              left: '50%',
                              bottom: '-5px',
                              transform: 'translateX(-50%) rotate(45deg)',
                              width: '10px',
                              height: '10px',
                              background: 'rgba(0,0,0,0.82)',
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </FormField>

            <FormField
              label="必须包含话题标签"
              hint="用户发布内容时需带上这些标签"
              badge={
                <span style={{
                  fontSize: '11px',
                  padding: '2px 7px',
                  borderRadius: '99px',
                  background: formData.hashtags.length >= HASHTAG_MAX ? 'rgba(255,77,79,0.1)' : 'var(--muted)',
                  color: formData.hashtags.length >= HASHTAG_MAX ? 'var(--destructive)' : 'var(--muted-foreground)',
                  fontWeight: 'var(--font-weight-medium)',
                  border: `1px solid ${formData.hashtags.length >= HASHTAG_MAX ? 'rgba(255,77,79,0.25)' : 'var(--border)'}`,
                }}>
                  {formData.hashtags.length} / {HASHTAG_MAX}
                  {formData.hashtags.length >= HASHTAG_MAX && ' 已达上限'}
                </span>
              }
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {formData.hashtags.map((tag, index) => (
                  <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <span
                        style={{
                          position: 'absolute',
                          left: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--muted-foreground)',
                          fontSize: 'var(--text-base)',
                          pointerEvents: 'none',
                        }}
                      >
                        #
                      </span>
                      <input
                        type="text"
                        value={tag.startsWith('#') ? tag.slice(1) : tag}
                        onChange={(e) => updateHashtag(index, '#' + e.target.value)}
                        style={{ ...inputStyle, paddingLeft: '24px' }}
                        placeholder="例如：春季新品"
                      />
                    </div>
                    {formData.hashtags.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHashtag(index)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: 'var(--radius)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(255,77,79,0.08)',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--destructive)',
                          flexShrink: 0,
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
                {formData.hashtags.length < HASHTAG_MAX && (
                  <button
                    type="button"
                    onClick={addHashtag}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'none',
                      border: '1px dashed var(--border)',
                      borderRadius: 'var(--radius)',
                      cursor: 'pointer',
                      color: 'var(--accent)',
                      fontSize: 'var(--text-base)',
                      padding: '7px 12px',
                      width: '100%',
                      justifyContent: 'center',
                      transition: 'background 0.15s',
                    }}
                  >
                    <Plus size={14} />
                    添加标签
                  </button>
                )}
              </div>
            </FormField>

            <div
              style={{
                height: '1px',
                background: 'var(--border)',
                margin: '0 -24px',
                width: 'calc(100% + 48px)',
              }}
            />

            <FormField
              label="必须包含关键词"
              badge={
                <span style={{
                  fontSize: '11px',
                  padding: '2px 7px',
                  borderRadius: '99px',
                  background: formData.keywords.length >= KEYWORD_MAX ? 'rgba(255,77,79,0.1)' : 'var(--muted)',
                  color: formData.keywords.length >= KEYWORD_MAX ? 'var(--destructive)' : 'var(--muted-foreground)',
                  fontWeight: 'var(--font-weight-medium)',
                  border: `1px solid ${formData.keywords.length >= KEYWORD_MAX ? 'rgba(255,77,79,0.25)' : 'var(--border)'}`,
                }}>
                  {formData.keywords.length} / {KEYWORD_MAX}
                  {formData.keywords.length >= KEYWORD_MAX && ' 已达上限'}
                </span>
              }
            >
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '10px',
                  padding: '8px',
                  background: 'var(--muted)',
                  borderRadius: 'var(--radius)',
                }}
              >
                {(['OR', 'AND'] as const).map((opt) => (
                  <label
                    key={opt}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      flex: 1,
                      padding: '5px 10px',
                      borderRadius: 'var(--radius)',
                      background:
                        formData.keywordLogic === opt
                          ? 'var(--card)'
                          : 'transparent',
                      boxShadow:
                        formData.keywordLogic === opt
                          ? 'var(--elevation-sm)'
                          : 'none',
                      justifyContent: 'center',
                    }}
                  >
                    <input
                      type="radio"
                      checked={formData.keywordLogic === opt}
                      onChange={() => setFormData({ ...formData, keywordLogic: opt })}
                      style={{ display: 'none' }}
                    />
                    <span
                      style={{
                        fontSize: 'var(--text-base)',
                        fontWeight:
                          formData.keywordLogic === opt
                            ? 'var(--font-weight-medium)'
                            : 'var(--font-weight-normal)',
                        color:
                          formData.keywordLogic === opt
                            ? 'var(--foreground)'
                            : 'var(--muted-foreground)',
                      }}
                    >
                      {opt === 'OR' ? '满足任一关键词' : '满足全部关键词'}
                    </span>
                  </label>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {formData.keywords.map((kw, index) => (
                  <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={kw}
                      onChange={(e) => updateKeyword(index, e.target.value)}
                      style={{ ...inputStyle, flex: 1 }}
                      placeholder="例如：春季新品、好用"
                    />
                    {formData.keywords.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeKeyword(index)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: 'var(--radius)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(255,77,79,0.08)',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--destructive)',
                          flexShrink: 0,
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
                {formData.keywords.length < KEYWORD_MAX && (
                  <button
                    type="button"
                    onClick={addKeyword}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'none',
                      border: '1px dashed var(--border)',
                      borderRadius: 'var(--radius)',
                      cursor: 'pointer',
                      color: 'var(--accent)',
                      fontSize: 'var(--text-base)',
                      padding: '7px 12px',
                      width: '100%',
                      justifyContent: 'center',
                    }}
                  >
                    <Plus size={14} />
                    添加关键词
                  </button>
                )}
              </div>
            </FormField>

            <div style={{ width: '33%', minWidth: '240px' }}>
              <FormField label="内容类型">
                <select
                  value={formData.contentType}
                  onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                  style={{ ...selectStyle, height: '40px' }}
                >
                  <option value="all">不限（图文 + 视频）</option>
                  <option value="image">仅图文笔记</option>
                  <option value="video">仅短视频</option>
                </select>
              </FormField>
            </div>
            <div style={{ width: '33%', minWidth: '240px' }}>
              <FormField label="单用户最多可提交次数" hint="可输入 1-30，默认 1 次">
                <input
                  type="number"
                  value={formData.maxSubmissionsPerUser}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const next = raw === '' ? 1 : Math.min(30, Math.max(1, parseInt(raw) || 1));
                    setFormData({ ...formData, maxSubmissionsPerUser: next });
                  }}
                  style={inputStyle}
                  placeholder="1"
                  min="1"
                  max="30"
                />
              </FormField>
            </div>
          </div>
        </SectionCard>

        {/* Section 3: Rewards */}
        <SectionCard
          step={3}
          title="奖励设置"
          description="配置投稿奖励、互动量排名奖励与固定奖励"
          icon={Gift}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

            {/* ── 投稿奖励 ── */}
            <div style={{ paddingBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: formData.baseRewardEnabled ? '16px' : '0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>🪙</span>
                  <div>
                    <div style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>投稿奖励</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginTop: '1px' }}>用户发布内容即可领取，按提交次数发放</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, baseRewardEnabled: !formData.baseRewardEnabled })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center', flexShrink: 0 }}
                >
                  {formData.baseRewardEnabled
                    ? <ToggleRight size={34} style={{ color: 'var(--primary)' }} />
                    : <ToggleLeft  size={34} style={{ color: 'var(--muted-foreground)' }} />}
                </button>
              </div>

              {formData.baseRewardEnabled && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Reward type pills */}
                  <FormField label="奖励类型" required>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {baseRewardTypeOptions.map((opt) => {
                        const sel = formData.baseRewardType === opt.value;
                        return (
                          <button key={opt.value} type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                baseRewardType: opt.value,
                                baseRewardLotteryId: opt.value === 'lottery' ? formData.baseRewardLotteryId : '',
                              })
                            }
                            style={{
                              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                              padding: '8px 12px', borderRadius: 'var(--radius)',
                              border: `1.5px solid ${sel ? 'var(--primary)' : 'var(--border)'}`,
                              background: sel ? 'rgba(36,116,255,0.06)' : 'var(--input-background)',
                              cursor: 'pointer', transition: 'all 0.15s',
                            }}
                          >
                            <span style={{ fontSize: '15px' }}>{opt.icon}</span>
                            <span style={{ fontSize: 'var(--text-base)', color: sel ? 'var(--primary)' : 'var(--foreground)', fontWeight: sel ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)' }}>
                              {opt.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </FormField>

                  {/* Reward value */}
                  <FormField label={formData.baseRewardType === 'lottery' ? '抽奖机会' : '积分数量'} required>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <RewardValueInput
                        rewardType={formData.baseRewardType}
                        amount={formData.baseRewardAmount}
                        giftName={formData.baseRewardType === 'lottery' ? formData.baseRewardLotteryId : ''}
                        onAmountChange={(v) => setFormData({ ...formData, baseRewardAmount: v })}
                        onGiftNameChange={(v) =>
                          setFormData({ ...formData, baseRewardLotteryId: v })
                        }
                        onPickLottery={() => setLotteryDialogOpen(true)}
                      />
                      {showValidation && isBaseRewardLotteryEmpty && (
                        <div style={validationTextStyle}>请选择抽奖机会</div>
                      )}
                    </div>
                  </FormField>

                  <FormField label="奖励发放时间" required>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {[
                          { value: 'after_end' as const, label: '活动结束后自动发放' },
                          { value: 'after_review' as const, label: '审核通过后自动发放' },
                        ].map((opt) => {
                          const sel = formData.baseRewardReleaseMode === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() =>
                                setFormData({ ...formData, baseRewardReleaseMode: opt.value })
                              }
                              style={{
                                padding: '6px 14px',
                                borderRadius: 'var(--radius)',
                                border: `1.5px solid ${sel ? 'var(--primary)' : 'var(--border)'}`,
                                background: sel ? 'rgba(36,116,255,0.06)' : 'var(--input-background)',
                                cursor: 'pointer',
                                fontSize: 'var(--text-base)',
                                color: sel ? 'var(--primary)' : 'var(--foreground)',
                                fontWeight: sel ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                              }}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                      {formData.baseRewardReleaseMode === 'after_end' && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 'var(--text-base)', color: 'var(--card-foreground)' }}>
                            活动结束后
                          </span>
                          <input
                            type="number"
                            value={formData.baseRewardReleaseDays}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                baseRewardReleaseDays: parseInt(e.target.value) || 0,
                              })
                            }
                            style={{ ...inputStyle, width: '120px' }}
                            min="0"
                          />
                          <span style={{ fontSize: 'var(--text-base)', color: 'var(--card-foreground)' }}>
                            天后自动发放
                          </span>
                        </div>
                      )}
                    </div>
                  </FormField>
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'var(--border)', margin: '0 -24px', width: 'calc(100% + 48px)' }} />

            {/* ── 互动量奖励 ── */}
            <div style={{ paddingTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: formData.engagementRewardEnabled ? '16px' : '0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>🏆</span>
                  <div>
                    <div style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>互动量奖励</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginTop: '1px' }}>支持按排名发放或按互动阈值发放奖励</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, engagementRewardEnabled: !formData.engagementRewardEnabled })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center', flexShrink: 0 }}
                >
                  {formData.engagementRewardEnabled
                    ? <ToggleRight size={34} style={{ color: 'var(--primary)' }} />
                    : <ToggleLeft  size={34} style={{ color: 'var(--muted-foreground)' }} />}
                </button>
              </div>

              {formData.engagementRewardEnabled && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <FormField label="奖励模式" required>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {[
                        { value: 'ranking' as const, label: '按排名奖励', desc: '根据互动量排序，按名次区间发放' },
                        { value: 'fixed' as const, label: '互动量固定奖励', desc: '达到某个互动阈值就发放固定奖励' },
                      ].map((opt) => {
                        const sel = formData.engagementRewardMode === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, engagementRewardMode: opt.value })}
                            style={{
                              flex: '1 1 240px',
                              textAlign: 'left',
                              padding: '10px 14px',
                              borderRadius: 'var(--radius)',
                              border: `1.5px solid ${sel ? 'var(--primary)' : 'var(--border)'}`,
                              background: sel ? 'rgba(36,116,255,0.06)' : 'var(--input-background)',
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                            }}
                          >
                            <div style={{ fontSize: 'var(--text-base)', color: sel ? 'var(--primary)' : 'var(--foreground)', fontWeight: sel ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)' }}>
                              {opt.label}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginTop: '3px', lineHeight: '1.5' }}>
                              {opt.desc}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </FormField>

                  {formData.engagementRewardMode === 'ranking' && (
                    <FormField label="排名依据" required hint="以哪种互动指标统计用户排名">
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {engagementMetricOptions.map((opt) => {
                          const sel = formData.engagementMetric === opt.value;
                          return (
                            <button key={opt.value} type="button"
                              onClick={() => setFormData({ ...formData, engagementMetric: opt.value })}
                              style={{
                                padding: '6px 16px', borderRadius: 'var(--radius)',
                                border: `1.5px solid ${sel ? 'var(--primary)' : 'var(--border)'}`,
                                background: sel ? 'rgba(36,116,255,0.06)' : 'var(--input-background)',
                                cursor: 'pointer', fontSize: 'var(--text-base)', transition: 'all 0.15s',
                                color: sel ? 'var(--primary)' : 'var(--foreground)',
                                fontWeight: sel ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                              }}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </FormField>
                  )}

                  {formData.engagementRewardMode === 'ranking' ? (
                    <FormField
                      label="排名奖励档位"
                      hint="任务结束后按最终排名自动发放，最多 5 档"
                      badge={
                        <span style={{
                          fontSize: '11px', padding: '2px 7px', borderRadius: '99px',
                          background: formData.engagementTiers.length >= ENGAGEMENT_TIER_MAX ? 'rgba(255,77,79,0.1)' : 'var(--muted)',
                          color: formData.engagementTiers.length >= ENGAGEMENT_TIER_MAX ? 'var(--destructive)' : 'var(--muted-foreground)',
                          fontWeight: 'var(--font-weight-medium)',
                          border: `1px solid ${formData.engagementTiers.length >= ENGAGEMENT_TIER_MAX ? 'rgba(255,77,79,0.25)' : 'var(--border)'}`,
                        }}>
                          {formData.engagementTiers.length} / {ENGAGEMENT_TIER_MAX}
                        </span>
                      }
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {formData.engagementTiers.map((tier, index) => {
                          const rankColors = [
                            { bg: 'rgba(255,197,0,0.15)', color: '#d48806' },
                            { bg: 'rgba(192,192,192,0.2)', color: '#8c8c8c' },
                            { bg: 'rgba(180,100,40,0.15)', color: '#a0522d' },
                          ];
                          const rc = rankColors[index] || { bg: 'var(--muted)', color: 'var(--muted-foreground)' };
                          return (
                            <div key={index} style={{ background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                  width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                                  background: rc.bg, color: rc.color,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: '11px', fontWeight: 'var(--font-weight-semibold)',
                                }}>
                                  {index + 1}
                                </div>
                                <span style={{ fontSize: 'var(--text-base)', color: 'var(--card-foreground)', whiteSpace: 'nowrap' }}>第</span>
                                <input
                                  type="number"
                                  value={tier.rankStart}
                                  onChange={(e) => updateEngagementTier(index, 'rankStart', parseInt(e.target.value) || 1)}
                                  style={{ ...inputStyle, width: '64px', flex: 'none' }}
                                  min="1"
                                />
                                <span style={{ fontSize: 'var(--text-base)', color: 'var(--card-foreground)', whiteSpace: 'nowrap' }}>名 至 第</span>
                                <input
                                  type="number"
                                  value={tier.rankEnd}
                                  onChange={(e) => updateEngagementTier(index, 'rankEnd', parseInt(e.target.value) || 1)}
                                  style={{ ...inputStyle, width: '64px', flex: 'none' }}
                                  min={tier.rankStart}
                                />
                                <span style={{ fontSize: 'var(--text-base)', color: 'var(--card-foreground)', whiteSpace: 'nowrap' }}>名</span>
                                <button
                                  type="button"
                                  onClick={() => removeEngagementTier(index)}
                                  style={{
                                    marginLeft: 'auto', width: '28px', height: '28px', borderRadius: 'var(--radius)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(255,77,79,0.08)', border: 'none', cursor: 'pointer',
                                    color: 'var(--destructive)', flexShrink: 0,
                                  }}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: 'var(--text-base)', color: 'var(--card-foreground)', whiteSpace: 'nowrap', flexShrink: 0 }}>奖励</span>
                                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                                  {rewardTypeOptions.map((opt) => {
                                    const sel = tier.rewardType === opt.value;
                                    return (
                                      <button key={opt.value} type="button"
                                        onClick={() => updateEngagementTier(index, 'rewardType', opt.value)}
                                        style={{
                                          display: 'flex', alignItems: 'center', gap: '4px',
                                          padding: '4px 10px', borderRadius: 'var(--radius)',
                                          border: `1.5px solid ${sel ? 'var(--primary)' : 'var(--border)'}`,
                                          background: sel ? 'rgba(36,116,255,0.08)' : 'var(--card)',
                                          cursor: 'pointer', fontSize: '12px',
                                          color: sel ? 'var(--primary)' : 'var(--card-foreground)',
                                          fontWeight: sel ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                                          transition: 'all 0.15s',
                                        }}
                                      >
                                        <span>{opt.icon}</span><span>{opt.label}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                                <RewardValueInput
                                  rewardType={tier.rewardType}
                                  amount={tier.amount}
                                  giftName={tier.giftName}
                                  onAmountChange={(v) => updateEngagementTier(index, 'amount', v)}
                                  onGiftNameChange={(v) => updateEngagementTier(index, 'giftName', v)}
                                />
                              </div>
                            </div>
                          );
                        })}

                        {formData.engagementTiers.length < ENGAGEMENT_TIER_MAX && (
                          <button
                            type="button"
                            onClick={addEngagementTier}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '5px',
                              background: 'none', border: '1px dashed var(--border)',
                              borderRadius: 'var(--radius)', cursor: 'pointer',
                              color: 'var(--accent)', fontSize: 'var(--text-base)',
                              padding: '7px 12px', width: '100%', justifyContent: 'center',
                            }}
                          >
                            <Plus size={14} />
                            添加排名档位
                          </button>
                        )}
                      </div>
                    </FormField>
                  ) : (
                    <FormField
                      label="固定奖励规则"
                      hint="达到对应互动阈值即可发放奖励，最多 10 条"
                      badge={
                        <span style={{
                          fontSize: '11px', padding: '2px 7px', borderRadius: '99px',
                          background: formData.fixedEngagementRewards.length >= FIXED_ENGAGEMENT_REWARD_MAX ? 'rgba(255,77,79,0.1)' : 'var(--muted)',
                          color: formData.fixedEngagementRewards.length >= FIXED_ENGAGEMENT_REWARD_MAX ? 'var(--destructive)' : 'var(--muted-foreground)',
                          fontWeight: 'var(--font-weight-medium)',
                          border: `1px solid ${formData.fixedEngagementRewards.length >= FIXED_ENGAGEMENT_REWARD_MAX ? 'rgba(255,77,79,0.25)' : 'var(--border)'}`,
                        }}>
                          {formData.fixedEngagementRewards.length} / {FIXED_ENGAGEMENT_REWARD_MAX}
                        </span>
                      }
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {formData.fixedEngagementRewards.map((rule, index) => (
                          <div key={index} style={{ background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: '22px',
                                height: '22px',
                                padding: '0 6px',
                                borderRadius: '999px',
                                fontSize: '11px',
                                fontWeight: 'var(--font-weight-medium)',
                                color: 'var(--primary)',
                                background: 'rgba(36,116,255,0.08)',
                                border: '1px solid rgba(36,116,255,0.18)',
                                flexShrink: 0,
                              }}>
                                {index + 1}
                              </span>
                              <span style={{ fontSize: 'var(--text-base)', color: 'var(--card-foreground)', whiteSpace: 'nowrap', flexShrink: 0 }}>当</span>
                              <select
                                value={rule.metric}
                                onChange={(e) => updateFixedEngagementReward(index, 'metric', e.target.value as FixedEngagementReward['metric'])}
                                style={{ ...selectStyle, width: '92px', flex: 'none', height: '30px', padding: '4px 10px' }}
                              >
                                {fixedRewardMetricOptions.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                              <span style={{ fontSize: 'var(--text-base)', color: 'var(--card-foreground)', whiteSpace: 'nowrap' }}>达到</span>
                              <input
                                type="number"
                                value={rule.threshold}
                                onChange={(e) => updateFixedEngagementReward(index, 'threshold', parseInt(e.target.value) || 0)}
                                style={{ ...inputStyle, width: '84px', flex: 'none', height: '30px', padding: '4px 10px' }}
                                min="0"
                              />
                              <span style={{ fontSize: 'var(--text-base)', color: 'var(--card-foreground)', whiteSpace: 'nowrap' }}>时发放</span>
                              <button
                                type="button"
                                onClick={() => removeFixedEngagementReward(index)}
                                style={{
                                  marginLeft: 'auto',
                                  width: '26px',
                                  height: '26px',
                                  borderRadius: 'var(--radius)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: 'rgba(255,77,79,0.08)',
                                  border: 'none',
                                  cursor: 'pointer',
                                  color: 'var(--destructive)',
                                  flexShrink: 0,
                                }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: '72px 84px 84px 84px',
                                alignItems: 'center',
                                gap: '6px',
                                paddingLeft: '30px',
                              }}
                            >
                              <span style={{ fontSize: 'var(--text-base)', color: 'var(--card-foreground)', whiteSpace: 'nowrap', flexShrink: 0 }}>奖励配置</span>
                              <button
                                type="button"
                                onClick={() => updateFixedEngagementReward(index, 'rewardType', 'points')}
                                style={{
                                  width: '100%',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '4px 8px',
                                  borderRadius: 'var(--radius)',
                                  border: `1px solid ${rule.rewardType === 'points' ? 'var(--primary)' : 'var(--border)'}`,
                                  background: rule.rewardType === 'points' ? 'rgba(36,116,255,0.08)' : 'var(--card)',
                                  cursor: 'pointer',
                                  fontSize: '11px',
                                  color: rule.rewardType === 'points' ? 'var(--primary)' : 'var(--card-foreground)',
                                }}
                              >
                                🪙 积分
                              </button>
                              <button
                                type="button"
                                onClick={() => updateFixedEngagementReward(index, 'rewardType', 'gift')}
                                style={{
                                  width: '100%',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '4px 8px',
                                  borderRadius: 'var(--radius)',
                                  border: `1px solid ${rule.rewardType === 'gift' ? 'var(--primary)' : 'var(--border)'}`,
                                  background: rule.rewardType === 'gift' ? 'rgba(36,116,255,0.08)' : 'var(--card)',
                                  cursor: 'pointer',
                                  fontSize: '11px',
                                  color: rule.rewardType === 'gift' ? 'var(--primary)' : 'var(--card-foreground)',
                                }}
                              >
                                🎁 赠品
                              </button>
                              <button
                                type="button"
                                onClick={() => updateFixedEngagementReward(index, 'rewardType', 'cash')}
                                style={{
                                  width: '100%',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '4px 8px',
                                  borderRadius: 'var(--radius)',
                                  border: `1px solid ${rule.rewardType === 'cash' ? 'var(--primary)' : 'var(--border)'}`,
                                  background: rule.rewardType === 'cash' ? 'rgba(36,116,255,0.08)' : 'var(--card)',
                                  cursor: 'pointer',
                                  fontSize: '11px',
                                color: rule.rewardType === 'cash' ? 'var(--primary)' : 'var(--card-foreground)',
                                }}
                              >
                                🧧 现金红包
                              </button>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingLeft: '30px' }}>
                              <span style={{ fontSize: 'var(--text-base)', color: 'var(--card-foreground)', whiteSpace: 'nowrap', flexShrink: 0 }}>奖励值</span>
                              <RewardValueInput
                                rewardType={rule.rewardType}
                                amount={rule.amount}
                                giftName={rule.giftName}
                                onAmountChange={(v) => updateFixedEngagementReward(index, 'amount', v)}
                                onGiftNameChange={(v) => updateFixedEngagementReward(index, 'giftName', v)}
                                compact
                              />
                            </div>
                          </div>
                        ))}

                        {formData.fixedEngagementRewards.length < FIXED_ENGAGEMENT_REWARD_MAX && (
                          <button
                            type="button"
                            onClick={addFixedEngagementReward}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              background: 'none',
                              border: '1px dashed var(--border)',
                              borderRadius: 'var(--radius)',
                              cursor: 'pointer',
                              color: 'var(--accent)',
                              fontSize: 'var(--text-base)',
                              padding: '7px 12px',
                              width: '100%',
                              justifyContent: 'center',
                              minHeight: '34px',
                            }}
                          >
                            <Plus size={14} />
                            添加固定奖励规则
                          </button>
                        )}
                      </div>
                    </FormField>
                  )}

                  <FormField label="奖励发放时间" required>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 'var(--text-base)', color: 'var(--card-foreground)' }}>
                        活动结束后
                      </span>
                      <input
                        type="number"
                        value={formData.engagementRewardReleaseDays}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            engagementRewardReleaseDays: parseInt(e.target.value) || 0,
                          })
                        }
                        style={{ ...inputStyle, width: '120px' }}
                        min="0"
                      />
                      <span style={{ fontSize: 'var(--text-base)', color: 'var(--card-foreground)' }}>
                        天后自动发放
                      </span>
                    </div>
                  </FormField>
                </div>
              )}
            </div>
          </div>
        </SectionCard>

        <SectionCard
          step={4}
          title="分享设置"
          description="设置小程序分享卡片的标题与配图"
          icon={Share2}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FormField
              label="分享标题"
              required
              badge={
                <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
                  {formData.shareTitle.length}/20
                </span>
              }
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <input
                  type="text"
                  value={formData.shareTitle}
                  maxLength={20}
                  onChange={(e) => setFormData({ ...formData, shareTitle: e.target.value })}
                  placeholder="请输入分享标题"
                  style={{
                    ...inputStyle,
                    borderColor:
                      showValidation && isShareTitleEmpty ? validationColor : 'var(--border)',
                  }}
                />
                {showValidation && isShareTitleEmpty && (
                  <div style={validationTextStyle}>请输入分享标题</div>
                )}
              </div>
            </FormField>

            <FormField label="分享图片" required>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  id="share-image-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                    setFormData({
                      ...formData,
                      shareImage: file,
                    });
                    if (!file) {
                      setShareImagePreview('');
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = () => setShareImagePreview(typeof reader.result === 'string' ? reader.result : '');
                    reader.readAsDataURL(file);
                  }}
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor="share-image-input"
                  style={{
                    width: '120px',
                    height: '96px',
                    border: `1px dashed ${showValidation && isShareImageEmpty ? validationColor : 'var(--border)'}`,
                    borderRadius: '2px',
                    background: 'var(--card)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    userSelect: 'none',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                  }}
                >
                  {shareImagePreview ? (
                    <img
                      src={shareImagePreview}
                      alt="分享图片预览"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <>
                      <Plus size={16} style={{ color: 'var(--muted-foreground)' }} />
                      <span style={{ fontSize: '12px', color: 'var(--card-foreground)' }}>
                        上传图片
                      </span>
                    </>
                  )}
                </label>
                {formData.shareImage && (
                  <div style={{ fontSize: '12px', color: 'var(--foreground)' }}>
                    已上传：{formData.shareImage.name}
                  </div>
                )}
                {showValidation && isShareImageEmpty && (
                  <div style={validationTextStyle}>请上传分享图片</div>
                )}
                <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
                  建议图片比例5:4，适用于小程序分享卡片
                </div>
              </div>
            </FormField>
          </div>
        </SectionCard>

        <Dialog open={lotteryDialogOpen} onOpenChange={setLotteryDialogOpen}>
          <DialogContent style={{ maxWidth: '720px' }}>
            <DialogHeader>
              <DialogTitle>选择转盘抽奖</DialogTitle>
              <DialogDescription>
                请选择系统中已创建的抽奖活动，作为投稿奖励的发放方式。
              </DialogDescription>
            </DialogHeader>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
              {LOTTERY_CATALOG.map((item) => {
                const selected = formData.baseRewardLotteryId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => chooseLottery(item.id)}
                    style={{
                      width: '100%',
                      border: `1px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
                      background: selected ? 'rgba(36,116,255,0.06)' : 'var(--card)',
                      borderRadius: 'var(--radius)',
                      padding: '14px 16px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'rgba(36,116,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        flexShrink: 0,
                      }}
                    >
                      🎡
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 'var(--text-base)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--foreground)',
                        }}
                      >
                        {item.name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginTop: '2px' }}>
                        {item.desc}
                      </div>
                    </div>
                    {selected && (
                      <span style={{ color: 'var(--primary)', fontSize: '12px', fontWeight: 500 }}>
                        已选择
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'flex-end',
            paddingBottom: '8px',
          }}
        >
          <button
            type="button"
            onClick={() => navigate('/backend/tasks')}
            style={{
              padding: '8px 20px',
              background: 'var(--secondary)',
              color: 'var(--secondary-foreground)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-weight-medium)',
            }}
          >
            取消
          </button>
          <button
            type="submit"
            style={{
              padding: '8px 24px',
              background: 'var(--primary)',
              color: 'var(--primary-foreground)',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-weight-medium)',
              boxShadow: '0 2px 8px rgba(36,116,255,0.25)',
            }}
          >
            {isEdit ? '保存修改' : '发布任务'}
          </button>
        </div>
      </form>
    </div>
  );
}
