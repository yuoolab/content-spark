import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';

type MemberDetailData = {
  id: string;
  name: string;
  uid: string;
  phone: string;
  level: string;
  status: '正常' | '冻结';
  points: number;
  joinedAt: string;
  avatar: string;
  gender: string;
  birthday: string;
  shippingAddress: string;
  conversionStats: {
    successOrderCount: number;
    successTotalPoints: number;
    frozenPoints: number;
  };
  tradeStats: {
    totalAmount: number;
    totalOrderCount: number;
    totalPointsOrderCount: number;
    totalRefundAmount: number;
    totalRefundOrderCount: number;
    recentOrderAt: string;
  };
  thirdPartyAccounts: Array<{
    platform: '小红书' | '抖音' | '哔哩哔哩' | '微博' | '公众号';
    accountName: string;
    profileUrl: string;
    authStatus: '已认证' | '待认证' | '未认证' | '认证失效';
    authAt: string;
  }>;
};

const MEMBER_DETAILS: Record<string, MemberDetailData> = {
  m1: {
    id: 'm1',
    name: '我在，你说',
    uid: '1000176829298939',
    phone: '156****3621',
    level: '初级会员',
    status: '正常',
    points: 0,
    joinedAt: '2026-04-16 19:19:52',
    avatar: '🧥',
    gender: '-',
    birthday: '-',
    shippingAddress: '广东省广州市海珠区新港中路397号',
    conversionStats: { successOrderCount: 0, successTotalPoints: 0, frozenPoints: 0 },
    tradeStats: {
      totalAmount: 30.9,
      totalOrderCount: 1,
      totalPointsOrderCount: 0,
      totalRefundAmount: 0,
      totalRefundOrderCount: 0,
      recentOrderAt: '2026-04-22 14:41:33',
    },
    thirdPartyAccounts: [
      { platform: '小红书', accountName: '小鹿Elaine', profileUrl: 'https://www.xiaohongshu.com/user/profile/elaine_diary', authStatus: '已认证', authAt: '2026-04-20 10:12' },
      { platform: '抖音', accountName: 'Tony的日常', profileUrl: 'https://www.douyin.com/user/tony_daily', authStatus: '已认证', authAt: '2026-04-20 10:15' },
      { platform: '哔哩哔哩', accountName: 'Lina晴天', profileUrl: '', authStatus: '未认证', authAt: '-' },
    ],
  },
  m2: {
    id: 'm2',
    name: '130****2993',
    uid: '1000146222855358',
    phone: '130****2993',
    level: '初级会员',
    status: '正常',
    points: 5,
    joinedAt: '2026-04-12 14:08:11',
    avatar: '🙂',
    gender: '-',
    birthday: '-',
    shippingAddress: '广东省深圳市南山区粤海街道科技中二路8号',
    conversionStats: { successOrderCount: 2, successTotalPoints: 120, frozenPoints: 0 },
    tradeStats: {
      totalAmount: 268.0,
      totalOrderCount: 4,
      totalPointsOrderCount: 1,
      totalRefundAmount: 39.9,
      totalRefundOrderCount: 1,
      recentOrderAt: '2026-04-21 11:08:10',
    },
    thirdPartyAccounts: [
      { platform: '小红书', accountName: '130****2993', profileUrl: 'https://www.xiaohongshu.com/user/profile/1302993', authStatus: '已认证', authAt: '2026-04-15 13:02' },
      { platform: '抖音', accountName: '未绑定', profileUrl: '', authStatus: '待认证', authAt: '-' },
      { platform: '哔哩哔哩', accountName: '未绑定', profileUrl: '', authStatus: '待认证', authAt: '-' },
      { platform: '微博', accountName: '未绑定', profileUrl: '', authStatus: '待认证', authAt: '-' },
    ],
  },
};

const AUTH_STATUS_STYLE: Record<MemberDetailData['thirdPartyAccounts'][number]['authStatus'], { color: string; bg: string; border: string }> = {
  已认证: { color: 'rgba(82,196,26,1)', bg: 'rgba(82,196,26,0.10)', border: 'rgba(82,196,26,0.25)' },
  待认证: { color: 'rgba(250,173,20,1)', bg: 'rgba(250,173,20,0.10)', border: 'rgba(250,173,20,0.25)' },
  未认证: { color: 'rgba(250,173,20,1)', bg: 'rgba(250,173,20,0.10)', border: 'rgba(250,173,20,0.25)' },
  认证失效: { color: 'rgba(255,77,79,1)', bg: 'rgba(255,77,79,0.10)', border: 'rgba(255,77,79,0.25)' },
};

export function MemberDetail() {
  const navigate = useNavigate();
  const { memberId = '' } = useParams();

  const member = useMemo(() => MEMBER_DETAILS[memberId] || MEMBER_DETAILS.m1, [memberId]);

  return (
    <div style={{ padding: '24px' }}>
      <button
        type="button"
        onClick={() => navigate('/backend/member/info/list')}
        style={{
          height: '32px',
          padding: '0 12px',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          background: '#fff',
          color: 'var(--foreground)',
          fontSize: '12px',
          cursor: 'pointer',
          marginBottom: '12px',
        }}
      >
        返回会员列表
      </button>

      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--elevation-sm)',
          overflow: 'hidden',
          marginBottom: '12px',
        }}
      >
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', background: 'var(--muted)' }}>
          <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--foreground)' }}>会员信息</span>
        </div>
        <div
          style={{
            padding: '14px 16px 16px',
            background:
              'linear-gradient(136deg, rgba(241,245,249,0.98) 0%, rgba(248,251,255,0.98) 58%, rgba(236,244,255,0.94) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '4px', background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                {member.avatar}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '30px', fontWeight: 600, color: 'var(--foreground)', lineHeight: 1.2 }}>{member.name}</div>
                  <span style={{ width: '20px', height: '20px', borderRadius: '999px', background: 'rgba(36,116,255,0.12)', color: 'rgba(36,116,255,1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>⌕</span>
                </div>
                <div style={{ marginTop: '4px', fontSize: '14px', color: 'rgba(75,85,99,1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>注册手机号：{member.phone}</span>
                  <span style={{ color: 'rgba(36,116,255,1)' }}>〰</span>
                  <span style={{ color: 'rgba(36,116,255,1)' }}>✎</span>
                </div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '14px', color: 'rgba(107,114,128,1)' }}>◷ 最近登录时间：2026-04-23</div>
            </div>
          </div>

          <div style={{ marginTop: '14px', display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '2px' }}>
            {[
              { icon: '🪙', value: String(member.points), label: '可用积分' },
              { icon: '🎟️', value: '0', label: '可用优惠券' },
              { icon: '💳', value: '2', label: '可用返现卡' },
              { icon: '🌱', value: '0', label: '成长值' },
            ].map((card) => (
              <div
                key={card.label}
                style={{
                  minWidth: '240px',
                  background: '#fff',
                  border: '1px solid rgba(226,232,240,0.9)',
                  borderRadius: '6px',
                  padding: '14px 14px 12px',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '36px', height: '36px', borderRadius: '999px', background: 'rgba(59,130,246,0.12)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                      {card.icon}
                    </span>
                    <span style={{ fontSize: '32px', fontWeight: 600, color: 'var(--foreground)', lineHeight: 1 }}>
                      {card.value}
                    </span>
                  </div>
                  <span style={{ color: 'rgba(59,130,246,1)', fontSize: '20px', lineHeight: 1 }}>···</span>
                </div>
                <div style={{ marginTop: '8px', fontSize: '14px', color: 'rgba(107,114,128,1)' }}>{card.label}</div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: '14px',
              padding: '10px 12px',
              borderRadius: '8px',
              background: 'var(--muted)',
              fontSize: '14px',
              color: 'var(--foreground)',
            }}
          >
            收货地址：{member.shippingAddress}
          </div>
        </div>
      </div>

      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--elevation-sm)',
          overflow: 'hidden',
          marginBottom: '12px',
        }}
      >
        <div
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid var(--border)',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '3px', height: '16px', borderRadius: '2px', background: 'rgba(36,116,255,1)', display: 'inline-block' }} />
            <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--foreground)', lineHeight: 1.2 }}>会员信息</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '14px' }}>
            <button
              type="button"
              style={{
                border: 'none',
                background: 'transparent',
                color: 'rgba(36,116,255,1)',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              编辑
            </button>
            <button
              type="button"
              style={{
                border: 'none',
                background: 'transparent',
                color: 'rgba(36,116,255,1)',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              展开 ˅
            </button>
          </div>
        </div>
        <div style={{ padding: '14px 18px', background: '#fff' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '14px 24px' }}>
            <InfoItem label="会员编号" value={member.uid} />
            <InfoItem label="会员等级" value={member.level} />
            <InfoItem label="入会时间" value={member.joinedAt} />
            <InfoItem label="性别" value={member.gender} />
            <InfoItem label="生日" value={member.birthday} />
            <InfoItem label="宠物" value="-" />
          </div>
          <div
            style={{
              marginTop: '12px',
              padding: '10px 12px',
              borderRadius: '6px',
              background: 'var(--muted)',
              fontSize: '14px',
              color: 'var(--foreground)',
            }}
          >
            收货地址：{member.shippingAddress || '-'}
          </div>
        </div>
      </div>

      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--elevation-sm)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', background: 'var(--muted)' }}>
          <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--foreground)' }}>三方账号认证信息</span>
        </div>
        <div style={{ padding: '16px 18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px' }}>
            {member.thirdPartyAccounts.map((item) => {
              const statusStyle = AUTH_STATUS_STYLE[item.authStatus];
              return (
                <div
                  key={`${member.id}-${item.platform}`}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '6px 8px',
                    background: '#fff',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', lineHeight: 1.2 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>{item.platform}</div>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '1px 8px',
                        borderRadius: '100px',
                        fontSize: '11px',
                        fontWeight: 500,
                        color: statusStyle.color,
                        background: statusStyle.bg,
                        border: `1px solid ${statusStyle.border}`,
                      }}
                    >
                      {item.authStatus}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginBottom: '3px', lineHeight: 1.2 }}>
                    账号：
                    {item.authStatus === '待认证' || item.authStatus === '未认证' ? (
                      '-'
                    ) : item.profileUrl ? (
                      <a
                        href={item.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ marginLeft: '4px', color: 'rgba(36,116,255,1)', textDecoration: 'none' }}
                        title={item.profileUrl}
                      >
                        {item.accountName}
                      </a>
                    ) : (
                      <span style={{ marginLeft: '4px' }}>{item.accountName}</span>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted-foreground)', lineHeight: 1.2 }}>认证时间：{item.authAt}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--elevation-sm)',
          overflow: 'hidden',
          marginTop: '12px',
        }}
      >
        <SectionHeader title="订单转换数据" actionText="查看转换记录" />
        <div style={{ padding: '16px 18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px 24px' }}>
            <StatItem label="转换成功订单数" value={String(member.conversionStats.successOrderCount)} />
            <StatItem label="转换成功总积分" value={String(member.conversionStats.successTotalPoints)} />
            <StatItem label="冻结积分" value={String(member.conversionStats.frozenPoints)} />
          </div>
        </div>
      </div>

      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--elevation-sm)',
          overflow: 'hidden',
          marginTop: '12px',
        }}
      >
        <SectionHeader title="交易信息" actionText="查看订单" />
        <div style={{ padding: '16px 18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '14px 24px' }}>
            <StatItem label="小店累计消费金额(元)" value={member.tradeStats.totalAmount.toString()} />
            <StatItem label="小店累计消费订单笔数" value={String(member.tradeStats.totalOrderCount)} />
            <StatItem label="小店累计积分订单数" value={String(member.tradeStats.totalPointsOrderCount)} />
            <StatItem label="小店累计退款金额(元)" value={member.tradeStats.totalRefundAmount.toString()} />
            <StatItem label="小店累计退款订单笔数" value={String(member.tradeStats.totalRefundOrderCount)} />
            <StatItem label="小店最近下单时间" value={member.tradeStats.recentOrderAt} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
  valueColor = 'var(--foreground)',
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div>
      <div style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '14px', color: valueColor }}>{value}</div>
    </div>
  );
}

function SectionHeader({ title, actionText }: { title: string; actionText?: string }) {
  return (
    <div
      style={{
        padding: '14px 18px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--foreground)' }}>{title}</span>
      {actionText ? (
        <button
          type="button"
          style={{
            border: 'none',
            background: 'none',
            color: 'rgba(36,116,255,1)',
            fontSize: '14px',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          {actionText} ›
        </button>
      ) : null}
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: '6px' }}>{label}</div>
      <div style={{ fontSize: '16px', lineHeight: 1.4, fontWeight: 500, color: 'var(--foreground)' }}>{value}</div>
    </div>
  );
}
