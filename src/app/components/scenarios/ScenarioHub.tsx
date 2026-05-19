import { Link } from 'react-router';
import {
  BarChart3,
  Bookmark,
  Heart,
  Sparkles,
  TrendingUp,
  Users,
  Target,
  BookOpen,
  ShieldCheck,
  Search,
  Repeat,
  DollarSign,
  MessageCircle,
  ThumbsUp,
  UserPlus,
} from 'lucide-react';
import type { ElementType, ReactNode } from 'react';
import { useEffect, useState } from 'react';

function useBreakpoint() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

type SceneKey = 'follow' | 'engagement' | 'seeding' | 'engagement_reward';
const MODULE_DESC_COLOR = '#334155';

const FUNNEL_STEPS: Array<{
  value: SceneKey;
  label: string;
  stage: string;
  stageLabel: string;
  description: string;
  valuePoints: string[];
  icon: ElementType;
  color: string;
  bg: string;
  gradient: string;
}> = [
  {
    value: 'follow',
    label: '账号加粉',
    stage: '蓄水',
    stageLabel: '私域沉淀',
    description: '引导用户关注官方账号，将公域散客转化为可长期触达的品牌粉丝，快速积累精准粉丝。',
    valuePoints: [
      '公域流量 → 私域粉丝的高效转化',
      '顾客下单后自动弹窗"加企微领券"，48 小时内转化私域',
      '社群用户月均复购 2.5 次，客单价提升 130%',
    ],
    icon: Users,
    color: '#0f766e',
    bg: '#ecfdf5',
    gradient: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
  },
  {
    value: 'engagement',
    label: '内容互动',
    stage: '助推',
    stageLabel: '流量撬动',
    description: '指定用户对热点内容点赞评论收藏，触发平台推荐机制，撬动公域自然流量。',
    valuePoints: [
      '提升重点内容的互动率与权重，触发平台推荐算法',
      '一条优质图文笔记可持续引流 3-6 个月',
      '智能识别高潜力笔记，AI 自动实时精准投放',
    ],
    icon: Heart,
    color: '#c2410c',
    bg: '#fff7ed',
    gradient: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
  },
  {
    value: 'seeding',
    label: '内容种草',
    stage: '造势',
    stageLabel: 'UGC 规模化',
    description: '激励用户发布原创种草内容，征集真实买家秀与体验笔记，UGC 裂变传播撬动曝光量提升。',
    valuePoints: [
      '海量真实 UGC 构建品牌内容资产，用户视角更具说服力',
      'AI 批量生成爆款笔记，1 小时产出 30 条',
      'UGC 裂变传播效率显著提升，持续放大品牌曝光与拉新效果',
    ],
    icon: Sparkles,
    color: '#1d4ed8',
    bg: '#eff6ff',
    gradient: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
  },
  {
    value: 'engagement_reward',
    label: '效果种草',
    stage: '转化',
    stageLabel: 'KOC 孵化',
    description: '发布种草内容并达到指定互动量得奖励，适用优质内容筛选、KOC潜力挖掘等场景。',
    valuePoints: [
      '按互动量付费，ROI 清晰可衡量，投产比稳定 1:5+',
      '自动筛选高潜力 KOC 种子用户，建立品牌专属达人资源库',
      '实时分析单篇笔记引流金额，智能调整投流策略',
    ],
    icon: Target,
    color: '#7c3aed',
    bg: '#f5f3ff',
    gradient: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
  },
];

const PLATFORM_DATA: Array<{
  icon: ElementType;
  title: string;
  stat: string;
  description: string;
  color: string;
}> = [
  {
    icon: Users,
    title: '精准触达',
    stat: '多平台',
    description: '覆盖小红书、抖音等主流平台，精准触达目标用户群体',
    color: '#0f766e',
  },
  {
    icon: TrendingUp,
    title: '内容驱动',
    stat: '长尾',
    description: '优质内容持续引流，一次投放长期受益，流量复利效应显著',
    color: '#1d4ed8',
  },
  {
    icon: ShieldCheck,
    title: '信任背书',
    stat: 'UGC',
    description: '真实用户口碑更具说服力，UGC 内容转化率远高于硬广',
    color: '#c2410c',
  },
  {
    icon: Search,
    title: '搜索沉淀',
    stat: 'SEO',
    description: '内容被搜索引擎长期收录，形成品牌关键词流量资产',
    color: '#7c3aed',
  },
  {
    icon: DollarSign,
    title: '成本可控',
    stat: '按效果',
    description: '按互动量发放奖励，ROI 清晰可衡量，预算灵活可控',
    color: '#059669',
  },
  {
    icon: Repeat,
    title: '私域沉淀',
    stat: '闭环',
    description: '公域流量引导至私域，形成「获客 → 转化 → 复购」完整闭环',
    color: '#d97706',
  },
];

const CASES: Array<{
  industry: string;
  title: string;
  description: string;
  metrics: string;
  tags: string[];
}> = [
  {
    industry: '美妆护肤',
    title: '某国货美妆品牌 · 双 11 小红书声量翻倍',
    description: '通过「内容互动 + 效果种草」组合策略，双 11 前集中引爆小红书笔记互动量，筛选出 50+ 优质 KOC 建立长期合作。',
    metrics: '互动量提升 220%，笔记曝光增长 3.5 倍',
    tags: ['内容互动', '效果种草'],
  },
  {
    industry: '新消费零售',
    title: '某新锐饮品品牌 · 新品冷启动获客 10 万+',
    description: '新品上市期通过「账号加粉 + 内容种草」组合拳，快速积累品牌粉丝并征集 UGC 晒单内容。',
    metrics: '7 天新增粉丝 12 万，UGC 内容 2000+ 篇',
    tags: ['账号加粉', '内容种草'],
  },
  {
    industry: '快消品',
    title: '某日化品牌 · 会员日营销闭环',
    description: '将内容激励任务嵌入会员积分体系，用户完成任务得积分、积分兑换权益，形成完整营销闭环。',
    metrics: '会员活跃度提升 180%，复购率增长 45%',
    tags: ['账号加粉', '内容互动', '内容种草'],
  },
];

function getHeroGradient(scene: SceneKey) {
  if (scene === 'follow') return 'linear-gradient(135deg, #064e3b 0%, #0f766e 48%, #14b8a6 100%)';
  if (scene === 'engagement') return 'linear-gradient(135deg, #7c2d12 0%, #c2410c 48%, #fb923c 100%)';
  if (scene === 'seeding') return 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 48%, #60a5fa 100%)';
  return 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 48%, #c084fc 100%)';
}

function SceneIllustration({ scene }: { scene: SceneKey }) {
  return (
    <div
      style={{
        height: 260,
        borderRadius: 18,
        background: 'rgba(255,255,255,0.16)',
        border: '1px solid rgba(255,255,255,0.26)',
        boxShadow: '0 24px 56px rgba(15,23,42,0.24)',
        padding: 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {scene === 'follow' && <FollowIllustration />}
      {scene === 'engagement' && <EngagementIllustration />}
      {scene === 'seeding' && <SeedingIllustration />}
      {scene === 'engagement_reward' && <RewardIllustration />}
    </div>
  );
}

function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: 210,
        height: 232,
        borderRadius: 22,
        background: '#f8fafc',
        border: '6px solid rgba(15,23,42,0.82)',
        boxShadow: '0 18px 36px rgba(15,23,42,0.28)',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}

function FollowIllustration() {
  return (
    <PhoneShell>
      <div style={{ height: '100%', background: '#fff', padding: 14, boxSizing: 'border-box' }}>
        <div style={{ height: 72, borderRadius: 12, background: 'linear-gradient(135deg, #fee2e2 0%, #fff7ed 100%)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: -22 }}>
          <div style={{ width: 48, height: 48, borderRadius: 999, background: '#fff', border: '3px solid #fff', boxShadow: '0 4px 12px rgba(15,23,42,0.12)' }} />
          <div style={{ display: 'grid', gap: 5, flex: 1, paddingTop: 20 }}>
            <div style={{ width: 96, height: 10, borderRadius: 999, background: '#172033' }} />
            <div style={{ width: 70, height: 8, borderRadius: 999, background: '#cbd5e1' }} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 16 }}>
          {['笔记', '粉丝', '获赞'].map((label, index) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#172033' }}>{[38, 1280, 6420][index]}</div>
              <div style={{ fontSize: 10, color: '#64748b' }}>{label}</div>
            </div>
          ))}
        </div>
        <button
          type="button"
          style={{
            marginTop: 14,
            width: '100%',
            height: 34,
            borderRadius: 999,
            border: 'none',
            background: '#ff2442',
            color: '#fff',
            fontSize: 13,
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <UserPlus size={15} />
          关注小红书主页
        </button>
      </div>
    </PhoneShell>
  );
}

function EngagementIllustration() {
  return (
    <PhoneShell>
      <div style={{ height: '100%', background: '#fff', padding: 14, boxSizing: 'border-box' }}>
        <div style={{ height: 118, borderRadius: 14, background: 'linear-gradient(135deg, #fed7aa 0%, #fee2e2 100%)', padding: 12, boxSizing: 'border-box' }}>
          <div style={{ width: 88, height: 10, borderRadius: 999, background: 'rgba(255,255,255,0.84)' }} />
          <div style={{ width: 130, height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.58)', marginTop: 10 }} />
        </div>
        <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
          {[
            { icon: ThumbsUp, label: '点赞', value: '2,486' },
            { icon: MessageCircle, label: '评论', value: '318' },
            { icon: Bookmark, label: '收藏', value: '756' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 26 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#334155', fontSize: 12, fontWeight: 700 }}>
                  <Icon size={16} color="#ff2442" />
                  {item.label}
                </span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#172033' }}>{item.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </PhoneShell>
  );
}

function SeedingIllustration() {
  return (
    <PhoneShell>
      <div style={{ height: '100%', background: '#f8fafc', padding: 14, boxSizing: 'border-box' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              style={{
                height: item % 2 === 0 ? 78 : 96,
                borderRadius: 12,
                background: item % 2 === 0
                  ? 'linear-gradient(135deg, #bfdbfe 0%, #dbeafe 100%)'
                  : 'linear-gradient(135deg, #fde68a 0%, #fed7aa 100%)',
              }}
            />
          ))}
        </div>
        <div style={{ marginTop: 12, padding: '9px 10px', borderRadius: 12, background: '#fff', border: '1px solid #e2e8f0' }}>
          <div style={{ width: 136, height: 10, borderRadius: 999, background: '#172033' }} />
          <div style={{ width: 104, height: 8, borderRadius: 999, background: '#cbd5e1', marginTop: 8 }} />
          <div style={{ marginTop: 10, display: 'inline-flex', padding: '4px 8px', borderRadius: 999, background: '#dbeafe', color: '#1d4ed8', fontSize: 11, fontWeight: 800 }}>
            已发布原创内容
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}

function RewardIllustration() {
  return (
    <PhoneShell>
      <div style={{ height: '100%', background: '#fff', padding: 14, boxSizing: 'border-box' }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#172033' }}>效果种草榜单</div>
        <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
          {[86, 68, 48].map((width, index) => (
            <div key={width} style={{ display: 'grid', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>KOC {index + 1}</span>
                <span style={{ fontSize: 11, color: '#7c3aed', fontWeight: 800 }}>达标</span>
              </div>
              <div style={{ height: 8, borderRadius: 999, background: '#ede9fe', overflow: 'hidden' }}>
                <div style={{ width: `${width}%`, height: '100%', borderRadius: 999, background: '#7c3aed' }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 18, borderRadius: 14, background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)', padding: 14 }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#6d28d9', lineHeight: 1 }}>TOP 10</div>
          <div style={{ marginTop: 6, fontSize: 12, lineHeight: 1.5, color: '#5b21b6', fontWeight: 700 }}>
            按互动表现结算额外奖励
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}

export function ScenarioHub() {
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';
  const isTablet = bp === 'tablet';
  const pad = isMobile ? '20px 16px' : isTablet ? '28px 24px' : '36px 40px';
  const maxW = '1060px';

  const [hoveredCase, setHoveredCase] = useState<number | null>(null);
  const [hoveredData, setHoveredData] = useState<number | null>(null);
  const [activeHeroScene, setActiveHeroScene] = useState<SceneKey>('follow');
  const [feedbackScene, setFeedbackScene] = useState<SceneKey | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const activeScene = FUNNEL_STEPS.find((scene) => scene.value === activeHeroScene) ?? FUNNEL_STEPS[0];
  const heroTitle = '玩转内容种草';
  const heroDescription = '在小红书、抖音等主流平台，通过「账号加粉 → 内容互动 → 内容种草 → 效果种草」的全链路运营，帮助达人或品牌精准获客、高效转化，并沉淀私域实现持续复购。';
  const getSceneConfigPath = (scene: SceneKey) => {
    if (scene === 'follow') return '/backend/follow';
    if (scene === 'engagement') return '/backend/tasks';
    return '';
  };

  useEffect(() => {
    const sceneOrder: SceneKey[] = ['follow', 'engagement', 'seeding', 'engagement_reward'];
    const timer = window.setInterval(() => {
      setActiveHeroScene((current) => {
        const currentIndex = sceneOrder.indexOf(current);
        const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % sceneOrder.length;
        return sceneOrder[nextIndex];
      });
    }, 3000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f7f8fa' }}>
      {/* ============ Hero Section ============ */}
      <div
        style={{
          background: getHeroGradient(activeHeroScene),
          padding: isMobile ? '24px 16px 22px' : '42px 40px 40px',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(15,23,42,0.08)',
          transition: 'background 0.25s ease',
        }}
      >
        <div
          style={{
            position: 'relative',
            maxWidth: maxW,
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) 360px',
            gap: isMobile ? '22px' : '34px',
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                color: '#fff',
                fontSize: isMobile ? '30px' : '52px',
                fontWeight: 800,
                lineHeight: 1.12,
                letterSpacing: 0,
              }}
            >
              {heroTitle}
            </div>
            <div
              style={{
                marginTop: '14px',
                fontSize: isMobile ? '13px' : '15px',
                color: 'rgba(255,255,255,0.88)',
                lineHeight: 1.75,
                maxWidth: '620px',
              }}
            >
              {heroDescription}
            </div>
          </div>

          {!isMobile && <SceneIllustration scene={activeHeroScene} />}

          <div
            style={{
              gridColumn: isMobile ? '1' : '1 / -1',
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, minmax(0, 1fr))',
              gap: '12px',
              marginTop: isMobile ? 0 : '8px',
            }}
          >
            {FUNNEL_STEPS.map((scene, i) => {
              const Icon = scene.icon;
              const active = activeHeroScene === scene.value;
              const configPath = getSceneConfigPath(scene.value);
              const pending = scene.value === 'seeding' || scene.value === 'engagement_reward';
              return (
                <div
                  key={scene.value}
                  onClick={() => setActiveHeroScene(scene.value)}
                  style={{
                    minHeight: isMobile ? 72 : 118,
                    border: active ? '1px solid rgba(255,255,255,0.72)' : '1px solid rgba(255,255,255,0.16)',
                    borderRadius: '10px',
                    background: active ? 'rgba(255,255,255,0.92)' : 'rgba(15,23,42,0.34)',
                    color: active ? '#172033' : '#fff',
                    padding: isMobile ? '10px 12px' : '16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'grid',
                    gap: '8px',
                    boxShadow: active ? '0 14px 34px rgba(15,23,42,0.20)' : 'none',
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setActiveHeroScene(scene.value);
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 8,
                        background: active ? scene.bg : 'rgba(255,255,255,0.16)',
                        color: active ? scene.color : '#fff',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={15} />
                    </span>
                    <div style={{ display: 'grid', gap: 2, minWidth: 0 }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: active ? scene.color : 'rgba(255,255,255,0.76)' }}>STEP {i + 1}</span>
                      <span style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 800 }}>{scene.label}</span>
                    </div>
                  </div>
                  {!isMobile && (
                    <div style={{ fontSize: '12px', lineHeight: 1.55, color: active ? '#475569' : 'rgba(255,255,255,0.74)' }}>
                      {scene.description}
                    </div>
                  )}
                  <div style={{ marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {pending ? (
                      <span
                        style={{
                          height: 28,
                          padding: '0 12px',
                          borderRadius: 6,
                          border: active ? '1px solid rgba(148,163,184,0.72)' : '1px solid rgba(148,163,184,0.55)',
                          background: active ? 'rgba(148,163,184,0.34)' : 'rgba(148,163,184,0.20)',
                          color: '#fff',
                          fontSize: 12,
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                        }}
                      >
                        敬请期待
                      </span>
                    ) : (
                      <Link
                        to={configPath}
                        onClick={(event) => event.stopPropagation()}
                        style={{
                          height: 28,
                          padding: '0 12px',
                          borderRadius: 6,
                          background: active ? scene.color : 'rgba(255,255,255,0.22)',
                          color: '#fff',
                          fontSize: 12,
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                        }}
                      >
                        去配置
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============ Platform Advantages ============ */}
      <div style={{ padding: pad, maxWidth: maxW }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--foreground)' }}>
            为什么选择内容营销
          </div>
          <div style={{ marginTop: '4px', fontSize: '13px', color: MODULE_DESC_COLOR }}>
            覆盖小红书、抖音等主流内容平台，通过内容驱动获客与转化，构建品牌长效增长引擎
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '12px' }}>
          {PLATFORM_DATA.map((item, idx) => {
            const Icon = item.icon;
            const hovered = hoveredData === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredData(idx)}
                onMouseLeave={() => setHoveredData(null)}
                style={{
                  background: '#fff',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '18px',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                  boxShadow: hovered ? '0 6px 20px rgba(0,0,0,0.07)' : '0 1px 3px rgba(0,0,0,0.03)',
                  transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: `${item.color}12`,
                      color: item.color,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={16} />
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>
                    {item.title}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: MODULE_DESC_COLOR, lineHeight: 1.5 }}>
                  {item.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============ Best Practices ============ */}
      <div style={{ padding: isMobile ? '0 16px 28px' : '0 40px 40px', maxWidth: maxW }}>
        <div style={{ marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <BookOpen size={18} style={{ color: 'var(--foreground)' }} />
            <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--foreground)' }}>
              真实案例，用效果说话
            </span>
          </div>
          <div style={{ fontSize: '13px', color: MODULE_DESC_COLOR }}>
            来自不同行业的商家，通过内容种草实现业务增长
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '14px' }}>
          {CASES.map((c, idx) => {
            const hovered = hoveredCase === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredCase(idx)}
                onMouseLeave={() => setHoveredCase(null)}
                style={{
                  background: '#fff',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  transition: 'box-shadow 0.25s, transform 0.25s',
                  boxShadow: hovered
                    ? '0 8px 24px rgba(0,0,0,0.08)'
                    : '0 1px 3px rgba(0,0,0,0.04)',
                  transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      padding: '3px 10px',
                      borderRadius: '100px',
                      background: '#f0fdf4',
                      color: '#15803d',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  >
                    {c.industry}
                  </span>
                </div>

                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)', lineHeight: 1.4 }}>
                  {c.title}
                </div>

                <div style={{ fontSize: '12.5px', color: MODULE_DESC_COLOR, lineHeight: 1.6 }}>
                  {c.description}
                </div>

                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: '#f0fdf4',
                    border: '1px solid #dcfce7',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#059669',
                  }}
                >
                  {c.metrics}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {c.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '11px',
                        fontWeight: 500,
                        padding: '2px 8px',
                        borderRadius: '100px',
                        background: '#f3f4f6',
                        color: '#6b7280',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============ Feedback Modal ============ */}
      {feedbackScene && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1200,
            background: 'rgba(0,0,0,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setFeedbackScene(null)}
        >
          <div
            style={{
              width: 'min(92vw, 440px)',
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 22px 46px rgba(15,23,42,0.22)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a1a' }}>
                {FUNNEL_STEPS.find((s) => s.value === feedbackScene)?.label}功能规划中
              </div>
              <div style={{ marginTop: '6px', fontSize: '13px', color: MODULE_DESC_COLOR, lineHeight: 1.6 }}>
                该功能正在紧锣密鼓地规划中，我们将优先实现最有价值的玩法。如果您对该场景有想法或建议，欢迎留下宝贵意见，帮助我们更好地打磨产品。
              </div>
            </div>

            <div style={{ padding: '16px 24px' }}>
              {feedbackSubmitted ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>🎉</div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a1a', marginBottom: '4px' }}>
                    感谢您的反馈！
                  </div>
                  <div style={{ fontSize: '13px', color: '#666' }}>
                    我们会认真参考您的建议，功能上线后将第一时间通知您
                  </div>
                </div>
              ) : (
                <>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="请输入您的建议，例如：希望支持按互动量阶梯奖励…"
                    rows={4}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      border: '1px solid #d8dee8',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      fontSize: '13px',
                      color: '#1a1a1a',
                      background: '#fbfcfe',
                      resize: 'vertical',
                      outline: 'none',
                      lineHeight: 1.6,
                      fontFamily: 'inherit',
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setFeedbackScene(null)}
                      style={{
                        height: '34px',
                        padding: '0 16px',
                        borderRadius: '7px',
                        border: '1px solid #d8dee8',
                        background: '#fff',
                        color: '#4b5565',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!feedbackText.trim()) return;
                        setFeedbackSubmitted(true);
                      }}
                      style={{
                        height: '34px',
                        padding: '0 16px',
                        borderRadius: '7px',
                        border: 'none',
                        background: feedbackText.trim() ? '#3B5BDB' : '#c5ccd8',
                        color: '#fff',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: feedbackText.trim() ? 'pointer' : 'not-allowed',
                      }}
                    >
                      提交建议
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
