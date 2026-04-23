import { Link } from 'react-router';
import { Shield } from 'lucide-react';

const interactiveCards = [
  {
    title: '转盘抽奖',
    desc: '通过抽奖玩法刺激用户参与，提高用户粘性',
    tag: '热',
    tagColor: '#FF4D4F',
    icon: '🎡',
    iconBg: '#FFF0F0',
  },
  {
    title: '直播预告',
    desc: '开播及商品开卖消息提醒',
    icon: '📺',
    iconBg: '#F0F5FF',
  },
  {
    title: '心愿单',
    desc: '帮助用户实现心愿，通过互动提升用户粘性',
    icon: '💙',
    iconBg: '#FFF0F5',
  },
  {
    title: '定时开奖',
    desc: '指定时间开奖，通过开奖瞬间的期待感吸引...',
    icon: '⏰',
    iconBg: '#F0FFF4',
  },
  {
    title: '预约事件',
    desc: '自定义活动事件，提醒用户订阅活动提醒',
    icon: '📅',
    iconBg: '#F0F5FF',
  },
  {
    title: '下单密令',
    desc: '在私域内植入下单密令，给公域渠道带来...',
    icon: '🔑',
    iconBg: '#FFF7E6',
  },
  {
    title: '打卡任务',
    desc: '通过创建粉丝打卡任务，培养和提高客户...',
    tag: '最新',
    tagColor: '#52C41A',
    icon: '✅',
    iconBg: '#F0FFF4',
  },
  {
    title: '内容激励计划',
    desc: '激励用户在小红书、抖音等平台发布内容，获得互动奖励',
    tag: '最新',
    tagColor: '#52C41A',
    icon: '🎯',
    iconBg: '#EEF3FF',
    link: '/backend/dashboard',
    highlight: true,
  },
];

const giftCards = [
  {
    title: '入会有礼',
    desc: '注册成为店铺会员可获得奖励，引导用户...',
    icon: '👑',
    iconBg: '#FFF7E6',
    tag: 'VIP',
    tagColor: '#FA8C16',
  },
  {
    title: '订单转换满赠',
    desc: '参与转积分的订单，会自动计入满赠活动...',
    icon: '🎁',
    iconBg: '#F0FFF4',
  },
  {
    title: '订单转换满抽',
    desc: '订单转换后，满足指定条件可兑换抽奖机会',
    tag: '最新',
    tagColor: '#52C41A',
    icon: '🎰',
    iconBg: '#FFF0F5',
  },
];

type CardData = {
  title: string;
  desc: string;
  icon: string;
  iconBg: string;
  tag?: string;
  tagColor?: string;
  link?: string;
  highlight?: boolean;
};

function MarketingCard({ card }: { card: CardData }) {
  const inner = (
    <div
      style={{
        background: '#fff',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        border: card.highlight ? '1.5px solid #3B5BDB' : '1px solid #f0f0f0',
        cursor: card.link ? 'pointer' : 'default',
        position: 'relative',
        height: '72px',
        boxSizing: 'border-box',
      }}
      className={card.link ? 'hover-card' : ''}
    >
      {card.tag && (
        <span
          style={{
            position: 'absolute',
            top: '6px',
            left: '6px',
            background: card.tagColor,
            color: '#fff',
            fontSize: '10px',
            padding: '1px 5px',
            borderRadius: '4px',
            fontWeight: 500,
            lineHeight: '16px',
          }}
        >
          {card.tag}
        </span>
      )}
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: card.iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          flexShrink: 0,
        }}
      >
        {card.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a', marginBottom: '3px' }}>
          {card.title}
        </div>
        <div
          style={{
            fontSize: '12px',
            color: '#888',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {card.desc}
        </div>
      </div>
      <span style={{ fontSize: '12px', color: '#3B5BDB', flexShrink: 0, fontWeight: 500 }}>
        去营销
      </span>
    </div>
  );

  return card.link ? (
    <Link to={card.link} style={{ textDecoration: 'none' }}>
      {inner}
    </Link>
  ) : (
    <div>{inner}</div>
  );
}

export function InteractiveMarketing() {
  return (
    <div style={{ padding: '24px', fontFamily: 'PingFang SC, sans-serif' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a', margin: 0 }}>
          互动营销
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
          <Shield size={14} color="#3B5BDB" />
          <span style={{ color: '#3B5BDB' }}>护航服务</span>
          <span style={{ color: '#666', marginLeft: '4px' }}>
            大流量活动请提前报备，获取专项保障，
          </span>
          <span style={{ color: '#3B5BDB', cursor: 'pointer' }}>去报备 &gt;</span>
        </div>
      </div>

      {/* Interactive cards grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '28px',
        }}
      >
        {interactiveCards.map((card) => (
          <MarketingCard key={card.title} card={card} />
        ))}
      </div>

      {/* 有礼营销 */}
      <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a', margin: '0 0 16px' }}>
        有礼营销
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
        }}
      >
        {giftCards.map((card) => (
          <MarketingCard key={card.title} card={card} />
        ))}
      </div>
    </div>
  );
}
