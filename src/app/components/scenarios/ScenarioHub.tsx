import { Link } from 'react-router';
import {
  AtSign,
  BarChart3,
  Heart,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Users,
  Target,
  Zap,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  Search,
  Repeat,
  DollarSign,
} from 'lucide-react';
import type { ElementType } from 'react';
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
  tagline: string;
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

const COMBO_STRATEGIES: Array<{
  name: string;
  description: string;
  scenes: SceneKey[];
  color: string;
}> = [
  {
    name: '新品牌冷启动',
    description: '快速积累种子用户与初始口碑内容',
    scenes: ['follow', 'engagement'],
    color: '#0f766e',
  },
  {
    name: '大促爆发期',
    description: '集中引爆 UGC 声量，筛选高效 KOC',
    scenes: ['seeding', 'engagement_reward'],
    color: '#7c3aed',
  },
  {
    name: '全域增长闭环',
    description: '从蓄水到转化的完整营销漏斗',
    scenes: ['follow', 'engagement', 'seeding', 'engagement_reward'],
    color: '#1d4ed8',
  },
];

export function ScenarioHub() {
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';
  const isTablet = bp === 'tablet';
  const pad = isMobile ? '20px 16px' : isTablet ? '28px 24px' : '36px 40px';
  const maxW = '1060px';

  const [hoveredCard, setHoveredCard] = useState<SceneKey | null>(null);
  const [hoveredCase, setHoveredCase] = useState<number | null>(null);
  const [hoveredData, setHoveredData] = useState<number | null>(null);
  const [feedbackScene, setFeedbackScene] = useState<SceneKey | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: '#f7f8fa' }}>
      {/* ============ Hero Section ============ */}
      <div
        style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #eff6ff 30%, #eef2ff 60%, #f5f3ff 100%)',
          padding: isMobile ? '20px 16px 18px' : '28px 40px 28px',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid #e0e7ff',
        }}
      >
        {/* Decorative shapes */}
        <div
          style={{
            position: 'absolute',
            top: '-40px',
            right: '-20px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.04) 100%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            left: '25%',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.05) 0%, rgba(99,102,241,0.03) 100%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '200px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(139,92,246,0.04)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', maxWidth: '900px' }}>
          <div
            style={{
              fontSize: isMobile ? '20px' : '26px',
              fontWeight: 800,
              lineHeight: 1.35,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #312e81 0%, #4338ca 50%, #6366f1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            玩转内容种草
          </div>

          <div
            style={{
              marginTop: '10px',
              fontSize: isMobile ? '13px' : '14px',
              color: '#475569',
              lineHeight: 1.7,
              maxWidth: '620px',
            }}
          >
            在小红书、抖音等主流平台，通过「账号加粉 → 内容互动 → 内容种草 → 效果种草」的全链路运营，
            帮助达人或品牌精准获客、高效转化，并沉淀私域实现持续复购。
          </div>

          {/* Funnel steps */}
          <div
            style={{
              marginTop: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '0',
              flexWrap: 'wrap',
            }}
          >
            {['蓄水 · 私域沉淀', '助推 · 流量撬动', '造势 · UGC 规模化', '转化 · KOC 孵化'].map(
              (step, i) => {
                const colors = ['#0f766e', '#c2410c', '#1d4ed8', '#7c3aed'];
                return (
                  <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '5px 14px',
                        borderRadius: '100px',
                        background: '#fff',
                        border: `1px solid ${colors[i]}20`,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                      }}
                    >
                      <span
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: colors[i],
                          color: '#fff',
                          fontSize: '10px',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {i + 1}
                      </span>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: colors[i],
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {step}
                      </span>
                    </div>
                    {i < 3 && (
                      <ChevronRight
                        size={14}
                        style={{ color: '#cbd5e1', margin: '0 6px', flexShrink: 0 }}
                      />
                    )}
                  </div>
                );
              },
            )}
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

      {/* ============ Scenario Matrix ============ */}
      <div style={{ padding: isMobile ? '0 16px 24px' : '0 40px 36px', maxWidth: maxW }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--foreground)' }}>
            四大场景能力矩阵
          </div>
          <div style={{ marginTop: '4px', fontSize: '13px', color: MODULE_DESC_COLOR }}>
            按照营销漏斗逻辑，从关注到转化的完整链路 —— 结合 BGC（品牌内容）、UGC（用户打卡）、PGC（达人探店）三维内容运营策略
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '14px' }}>
          {FUNNEL_STEPS.map((scene, i) => {
            const Icon = scene.icon;
            const hovered = hoveredCard === scene.value;
            return (
              <div
                key={scene.value}
                onMouseEnter={() => setHoveredCard(scene.value)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  background: '#fff',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'box-shadow 0.25s, transform 0.25s',
                  boxShadow: hovered
                    ? '0 12px 32px rgba(0,0,0,0.1)'
                    : '0 1px 4px rgba(0,0,0,0.04)',
                  transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 14px',
                    background: scene.gradient,
                    borderBottom: `1px solid ${scene.color}18`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: scene.color,
                        background: '#fff',
                        padding: '1px 7px',
                        borderRadius: '100px',
                        letterSpacing: '0.03em',
                      }}
                    >
                      STEP {i + 1}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: scene.color }}>
                      {scene.stage}·{scene.stageLabel}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '14px 14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <span
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '9px',
                        background: scene.bg,
                        color: scene.color,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={18} />
                    </span>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)' }}>
                        {scene.label}
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: scene.color }}>
                        {scene.tagline}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: '12px',
                      color: MODULE_DESC_COLOR,
                      lineHeight: 1.6,
                      marginBottom: '12px',
                      flex: 1,
                    }}
                  >
                    {scene.description}
                  </div>

                  {(scene.value === 'seeding' || scene.value === 'engagement_reward') ? (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-start' }}>
                      <button
                        type="button"
                        onClick={() => { setFeedbackScene(scene.value); setFeedbackText(''); setFeedbackSubmitted(false); }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          padding: '7px 16px',
                          borderRadius: '7px',
                          background: scene.color,
                          color: '#fff',
                          fontSize: '12px',
                          fontWeight: 600,
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        创建任务
                        <ArrowRight size={13} />
                      </button>
                      <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 500 }}>
                        敬请期待
                      </span>
                    </div>
                  ) : (
                    <Link
                      to={scene.value === 'engagement' ? '/backend/tasks' : `/backend/tasks/create?scene=${scene.value}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        padding: '7px 16px',
                        borderRadius: '7px',
                        background: scene.color,
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 600,
                        textDecoration: 'none',
                        transition: 'opacity 0.15s',
                        alignSelf: 'flex-start',
                      }}
                    >
                      创建任务
                      <ArrowRight size={13} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============ Combo Strategies ============ */}
      <div style={{ padding: isMobile ? '0 16px 24px' : '0 40px 36px', maxWidth: maxW }}>
        <div style={{ marginBottom: '18px' }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--foreground)' }}>
            组合策略推荐
          </div>
          <div style={{ marginTop: '4px', fontSize: '13px', color: MODULE_DESC_COLOR }}>
            根据业务阶段选择合适的场景组合，实现 1+1 &gt; 2 的营销效果
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '14px' }}>
          {COMBO_STRATEGIES.map((combo) => (
            <div
              key={combo.name}
              style={{
                background: '#fff',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: combo.color,
                  marginBottom: '6px',
                }}
              >
                {combo.name}
              </div>
              <div
                style={{
                  fontSize: '12.5px',
                  color: MODULE_DESC_COLOR,
                  lineHeight: 1.5,
                  marginBottom: '14px',
                }}
              >
                {combo.description}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {combo.scenes.map((key) => {
                  const scene = FUNNEL_STEPS.find((s) => s.value === key)!;
                  return (
                    <span
                      key={key}
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '3px 10px',
                        borderRadius: '100px',
                        background: scene.bg,
                        color: scene.color,
                      }}
                    >
                      {scene.label}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
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
