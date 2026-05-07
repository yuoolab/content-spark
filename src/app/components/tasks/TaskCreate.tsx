import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import type { CSSProperties, ElementType, FormEvent, ReactNode } from 'react';
import {
  ArrowLeft,
  BarChart3,
  Heart,
  Plus,
  Save,
  Send,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react';
import { DateRangePicker } from '../ui/DateRangePicker';

type SceneKey = 'follow' | 'engagement' | 'seeding' | 'engagement_reward';
type RewardType = 'points' | 'cash' | 'gift';
type FollowRewardMode = 'all_accounts' | 'per_account';
type PrizeType = 'points' | 'gift' | 'wechat_redpacket';
type RedpacketType = 'lucky' | 'fixed';

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

const followPlatformOptions = ['小红书', '抖音', '快手', '视频号'];
const rewardOptions: Array<{ value: RewardType; label: string }> = [
  { value: 'points', label: '积分' },
  { value: 'cash', label: '现金红包' },
  { value: 'gift', label: '赠品' },
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
  const initialScene = getSceneKey(searchParams.get('scene'));
  const [scene, setScene] = useState<SceneKey>(initialScene);
  const [showValidation, setShowValidation] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [hoveredSampleIndex, setHoveredSampleIndex] = useState<number | null>(null);
  const [showPrizeModal, setShowPrizeModal] = useState(false);
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
  });
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    rewardType: 'points' as RewardType,
    rewardAmount: 50,
    followRewardMode: 'all_accounts' as FollowRewardMode,
    followAllowResubmitAfterReject: false,
    engagementAllowResubmitAfterReject: false,
    showEnabled: true,
    maxPerUser: 1,
    followTargets: [{ platform: '小红书', account: '', sampleImage: null as File | null, sampleImagePreview: '', guideText: '' }],
    followRuleDescription: '',
    engagementPlatform: '小红书',
    contentUrl: '',
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
    seedingAllowResubmitAfterReject: false,
    seedingRuleDescription: '',
    contentType: '图文或视频',
    seedingRewardMode: 'unlimited' as 'unlimited' | 'limited',
    seedingMaxRewardCount: 10,
    rankRewardEnabled: true,
    engagementRewardMode: 'single' as 'single' | 'multi',
    engagementRewardTiers: [{
      interactionType: '综合互动' as '综合互动' | '点赞' | '评论' | '收藏',
      interactionAmount: 100,
      prize: null as PrizeConfig | null,
    }],
    engagementRewardRuleDescription: '',
    engagementRewardAllowResubmitAfterReject: false,
  });

  const sceneMeta = sceneOptions.find((item) => item.key === scene) ?? sceneOptions[0];
  const pageTitle = id ? '编辑任务' : '创建任务';
  const requiredMissing = !formData.name.trim() || !formData.startDate || !formData.endDate || !isSceneValid(scene, formData);

  const switchScene = (nextScene: SceneKey) => {
    setScene(nextScene);
    setShowValidation(false);
    setSearchParams({ scene: nextScene });
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setShowValidation(true);
    if (requiredMissing) return;
    navigate('/backend/tasks');
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
    });
    setShowPrizeModal(true);
  };

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
        <button type="button" onClick={() => navigate('/backend/tasks')} style={backButtonStyle}>
          <ArrowLeft size={15} />
          返回任务列表
        </button>

        <div style={sceneGridStyle}>
          {sceneOptions.map((item) => {
            const Icon = item.icon;
            const active = item.key === scene;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => switchScene(item.key)}
                style={{
                  ...sceneButtonStyle,
                  borderColor: active ? '#2f6fff' : '#dfe5ee',
                  background: '#ffffff',
                }}
              >
                <span style={{ minWidth: 0 }}>
                  <span style={{ ...sceneLabelStyle, color: active ? '#2f6fff' : '#172033' }}>{item.label}</span>
                  <span style={sceneShortStyle}>{item.short}</span>
                </span>
                {active && (
                  <>
                    <span style={sceneSelectedCornerStyle} />
                    <span style={sceneSelectedCheckStyle}>✓</span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        <form onSubmit={submit} noValidate style={contentGridStyle}>
            <Panel title="基础设置">
              <Field label="任务名称" required error={showValidation && !formData.name.trim() ? '请输入任务名称' : ''}>
                <div style={{ position: 'relative', width: 'min(540px, 100%)' }}>
                  <input
                    value={formData.name}
                    onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                    placeholder="请输入"
                    maxLength={30}
                    style={{ ...inputStyle(showValidation && !formData.name.trim()), paddingRight: 48, width: '100%' }}
                  />
                  <span style={{ position: 'absolute', right: 10, bottom: 7, fontSize: 11, color: '#9aa4b2', pointerEvents: 'none' }}>{formData.name.length}/30</span>
                </div>
              </Field>

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

            </Panel>

            <Panel title={`${sceneMeta.label}玩法`}>
              {scene === 'follow' && (
                <SceneFields>
                  <Field
                    label="关注账号列表"
                    required
                    error={showValidation && hasFollowTargetError(formData.followTargets) ? '请完整填写平台、目标账号和上传引导文案' : ''}
                  >
                    <div style={{ display: 'grid', gap: 8 }}>
                      {formData.followTargets.map((target, index) => (
                        <div
                          key={`${index}-${target.platform}`}
                          style={{
                            display: 'grid',
                            gap: 10,
                            padding: 10,
                            border: '1px solid #e1e7f0',
                            borderRadius: 8,
                            background: '#fcfdff',
                            width: 'fit-content',
                            maxWidth: '100%',
                          }}
                        >
                          <div style={{ display: 'grid', gridTemplateColumns: '160px 180px 350px 32px', gap: 8, alignItems: 'center' }}>
                            <select
                              value={target.platform}
                              onChange={(event) =>
                                setFormData({
                                  ...formData,
                                  followTargets: formData.followTargets.map((item, itemIndex) =>
                                    itemIndex === index ? { ...item, platform: event.target.value } : item
                                  ),
                                })
                              }
                              style={baseInputStyle}
                            >
                              {followPlatformOptions.map((platform) => <option key={platform}>{platform}</option>)}
                            </select>
                            <input
                              value={target.account}
                              onChange={(event) =>
                                setFormData({
                                  ...formData,
                                  followTargets: formData.followTargets.map((item, itemIndex) =>
                                    itemIndex === index ? { ...item, account: event.target.value } : item
                                  ),
                                })
                              }
                              placeholder="输入目标账号（昵称 / ID）"
                              maxLength={15}
                              style={{ ...inputStyle(showValidation && !target.account.trim()), width: '100%' }}
                            />
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
                                      : formData.followTargets.filter((_, itemIndex) => {
                                          const keep = itemIndex !== index;
                                          if (!keep && formData.followTargets[itemIndex].sampleImagePreview) {
                                            URL.revokeObjectURL(formData.followTargets[itemIndex].sampleImagePreview);
                                          }
                                          return keep;
                                        }),
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
                          <div style={{ display: 'grid', gap: 6 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: '#172033' }}>关注示例图</span>
                            <input
                              id={`follow-sample-image-${index}`}
                              type="file"
                              accept="image/*"
                              onChange={(event) => {
                                const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
                                setFormData({
                                  ...formData,
                                  followTargets: formData.followTargets.map((item, itemIndex) =>
                                    itemIndex === index
                                      ? (() => {
                                          if (item.sampleImagePreview) URL.revokeObjectURL(item.sampleImagePreview);
                                          const preview = file ? URL.createObjectURL(file) : '';
                                          return { ...item, sampleImage: file, sampleImagePreview: preview };
                                        })()
                                      : item
                                  ),
                                });
                              }}
                              style={{ display: 'none' }}
                            />
                            {target.sampleImagePreview ? (
                              <div
                                style={{
                                  width: 70,
                                  height: 70,
                                  border: '1px dashed #cbd5e1',
                                  borderRadius: 4,
                                  background: '#fff',
                                  position: 'relative',
                                  overflow: 'hidden',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                                onMouseEnter={() => setHoveredSampleIndex(index)}
                                onMouseLeave={() => setHoveredSampleIndex((current) => (current === index ? null : current))}
                              >
                                <img
                                  src={target.sampleImagePreview}
                                  alt="示例图预览"
                                  onClick={() => setPreviewImageUrl(target.sampleImagePreview)}
                                  style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'zoom-in' }}
                                />
                                {hoveredSampleIndex === index && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setFormData({
                                        ...formData,
                                        followTargets: formData.followTargets.map((item, itemIndex) => {
                                          if (itemIndex !== index) return item;
                                          if (item.sampleImagePreview) URL.revokeObjectURL(item.sampleImagePreview);
                                          return { ...item, sampleImage: null, sampleImagePreview: '' };
                                        }),
                                      })
                                    }
                                    style={{
                                      position: 'absolute',
                                      top: 5,
                                      right: 5,
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
                                    aria-label="删除示例图"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                )}
                              </div>
                            ) : (
                              <label
                                htmlFor={`follow-sample-image-${index}`}
                                style={{
                                  width: 70,
                                  height: 70,
                                  border: '1px dashed #cbd5e1',
                                  borderRadius: 4,
                                  background: '#fff',
                                  display: 'inline-flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: 8,
                                  color: '#4b5565',
                                  cursor: 'pointer',
                                }}
                              >
                                <Plus size={24} color="#8b95a7" />
                                <span style={{ fontSize: 12, fontWeight: 600 }}>上传图片</span>
                              </label>
                            )}
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
                                formData.followTargets.length >= 10
                                  ? formData.followTargets
                                  : [...formData.followTargets, { platform: '小红书', account: '', sampleImage: null, sampleImagePreview: '', guideText: '' }],
                            })
                          }
                          disabled={formData.followTargets.length >= 10}
                          style={{
                            height: 32,
                            padding: '0 10px',
                            borderRadius: 6,
                            border: '1px dashed #cbd5e1',
                            background: '#fff',
                            color: formData.followTargets.length >= 10 ? '#a1a8b3' : '#1d4ed8',
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: formData.followTargets.length >= 10 ? 'not-allowed' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <Plus size={13} />
                          新增账号（0/10）
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
                        开启后，若审核拒绝，用户修改后可以重新提交审核
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
                </SceneFields>
              )}

              {scene === 'engagement' && (
                <SceneFields>
                  <Field label="互动平台">
                    <select
                      value={formData.engagementPlatform}
                      onChange={(event) => setFormData({ ...formData, engagementPlatform: event.target.value })}
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
                  <Field label="互动内容链接" required error={showValidation && !formData.contentUrl.trim() ? '请输入内容链接' : ''}>
                    <input
                      value={formData.contentUrl}
                      onChange={(event) => setFormData({ ...formData, contentUrl: event.target.value })}
                      placeholder="粘贴指定笔记或视频链接"
                      style={inputStyle(showValidation && !formData.contentUrl.trim())}
                    />
                  </Field>
                  <Field label="内容示例图">
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
                        可上传内容的截图，方便用户快速找到对应内容进行互动，最多 3 张。
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
                        开启后，若审核拒绝，用户修改后可以重新提交审核
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
                  <Field label="引导文案">
                    <input
                      value={formData.engagementProofDescription}
                      onChange={(event) => setFormData({ ...formData, engagementProofDescription: event.target.value })}
                      placeholder="例如：截图需清晰展示互动数据"
                      style={baseInputStyle}
                    />
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
                        开启后，若审核拒绝，用户修改后可以重新提交审核
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
                  <Field label="引导文案">
                    <input
                      value={formData.seedingGuideText}
                      onChange={(event) => setFormData({ ...formData, seedingGuideText: event.target.value })}
                      placeholder="请输入引导文案"
                      style={baseInputStyle}
                    />
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
                        开启后，若审核拒绝，用户修改后可以重新提交审核
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
                  <Field label="奖励模式">
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                      {[
                        { value: 'all_accounts' as const, label: '关注所有账号发奖' },
                        { value: 'per_account' as const, label: '每关注1个账号发奖' },
                      ].map((option) => {
                        const checked = formData.followRewardMode === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, followRewardMode: option.value })}
                            style={radioLikeButtonStyle(checked)}
                          >
                            <span style={radioCircleStyle(checked)} />
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </Field>
                )}
                {scene === 'seeding' && (
                  <Field label="奖励模式">
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                      {[
                        { value: 'unlimited' as const, label: '每条内容都发放' },
                        { value: 'limited' as const, label: '限制奖励次数' },
                      ].map((option) => {
                        const checked = formData.seedingRewardMode === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, seedingRewardMode: option.value })}
                            style={radioLikeButtonStyle(checked)}
                          >
                            <span style={radioCircleStyle(checked)} />
                            {option.label}
                          </button>
                        );
                      })}
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
                      <button type="button" onClick={() => openPrizeModal()} style={addPrizeButtonStyle}>
                        <Plus size={22} />
                        添加奖品
                      </button>
                      {selectedPrize && (
                        <div style={prizeSummaryStyle}>
                          <div>奖品类型：{getPrizeTypeLabel(selectedPrize.prizeType)}</div>
                          <div>奖品名称：{selectedPrize.prizeName}</div>
                          {selectedPrize.prizeType === 'wechat_redpacket' ? (
                            <div>红包总额：{selectedPrize.redpacketTotalAmount} 元 / {selectedPrize.redpacketCount} 个</div>
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
        </form>
        {showValidation && requiredMissing && (
          <div style={errorBoxStyle}>还有必填项未完成，请检查红色提示字段。</div>
        )}
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
            {id ? <Save size={15} /> : <Send size={15} />}
            {id ? '保存修改' : '创建任务'}
          </button>
        </div>

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
          <div style={modalOverlayStyle} onClick={() => setShowPrizeModal(false)}>
            <div style={modalPanelStyle} onClick={(event) => event.stopPropagation()}>
              <div style={modalHeaderStyle}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#172033' }}>添加奖品</h3>
                <button type="button" onClick={() => setShowPrizeModal(false)} style={modalCloseStyle}>×</button>
              </div>
              <div style={modalBodyStyle}>
                <Field label="奖品类型" required>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
                    {[
                      { value: 'points' as PrizeType, label: '积分' },
                      { value: 'gift' as PrizeType, label: '赠品' },
                      { value: 'wechat_redpacket' as PrizeType, label: '微信红包' },
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

                {prizeForm.prizeType !== 'gift' && prizeForm.prizeType !== 'wechat_redpacket' && (
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
                <button type="button" onClick={() => setShowPrizeModal(false)} style={modalCancelStyle}>取消</button>
                <button type="button" onClick={confirmPrize} style={modalConfirmStyle}>确定</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getPrizeTypeLabel(type: PrizeType) {
  if (type === 'points') return '积分';
  if (type === 'gift') return '赠品';
  return '微信红包';
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
  if (scene === 'follow') return !hasFollowTargetError(data.followTargets) && Boolean(data.followRuleDescription.trim());
  if (scene === 'engagement') return Boolean(data.contentUrl.trim()) && data.interactionActions.length > 0 && Boolean(data.engagementRuleDescription.trim());
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

const sceneGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: 10,
  marginTop: 12,
};

const sceneButtonStyle: CSSProperties = {
  minHeight: 78,
  border: '1px solid',
  borderRadius: 8,
  padding: 12,
  textAlign: 'left',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'flex-start',
  gap: 10,
  position: 'relative',
  overflow: 'hidden',
};

const sceneLabelStyle: CSSProperties = {
  display: 'block',
  fontSize: 14,
  fontWeight: 800,
  lineHeight: 1.2,
};

const sceneShortStyle: CSSProperties = {
  display: 'block',
  marginTop: 5,
  fontSize: 12,
  color: '#687386',
  lineHeight: 1.35,
};

const sceneSelectedCornerStyle: CSSProperties = {
  position: 'absolute',
  right: 0,
  bottom: 0,
  width: 0,
  height: 0,
  borderStyle: 'solid',
  borderWidth: '0 0 20px 20px',
  borderColor: 'transparent transparent #2f6fff transparent',
};

const sceneSelectedCheckStyle: CSSProperties = {
  position: 'absolute',
  right: 3,
  bottom: 1,
  fontSize: 12,
  lineHeight: 1,
  color: '#fff',
  fontWeight: 700,
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
