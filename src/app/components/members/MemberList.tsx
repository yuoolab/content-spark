import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

type MemberRow = {
  id: string;
  name: string;
  uid: string;
  phone: string;
  points: number;
  level: string;
  status: '正常' | '冻结';
  shopTag: string;
  avatar: string;
};

const MOCK_MEMBERS: MemberRow[] = [
  { id: 'm1', name: '我在，你说', uid: '1000176829298939', phone: '156****3621', points: 0, level: '初级会员', status: '正常', shopTag: '-', avatar: '🧥' },
  { id: 'm2', name: '130****2993', uid: '1000146222855358', phone: '130****2993', points: 5, level: '初级会员', status: '正常', shopTag: '-', avatar: '🙂' },
  { id: 'm3', name: '啵啵', uid: '1000122022709714', phone: '134****3985', points: 0, level: '初级会员', status: '正常', shopTag: '-', avatar: '🏝️' },
  { id: 'm4', name: '178****5669', uid: '1000136622398172', phone: '178****5669', points: 0, level: 'VIP10', status: '正常', shopTag: '-', avatar: '😎' },
  { id: 'm5', name: '189****1446', uid: '1000197821544737', phone: '189****1446', points: 0, level: '初级会员', status: '正常', shopTag: '-', avatar: '📷' },
];

function FilterInput({
  label,
  placeholder = '请输入',
  width = 240,
}: {
  label: string;
  placeholder?: string;
  width?: number;
}) {
  return (
    <div
      style={{
        width,
        height: '32px',
        border: '1px solid var(--border)',
        borderRadius: '2px',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        boxSizing: 'border-box',
      }}
    >
      <span style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginRight: '10px', whiteSpace: 'nowrap' }}>{label}：</span>
      <input
        placeholder={placeholder}
        style={{
          border: 'none',
          outline: 'none',
          width: '100%',
          fontSize: '12px',
          color: 'var(--foreground)',
          background: 'transparent',
        }}
      />
    </div>
  );
}

function FilterSelect({
  label,
  placeholder = '请选择',
  width = 240,
}: {
  label: string;
  placeholder?: string;
  width?: number;
}) {
  return (
    <div
      style={{
        width,
        height: '32px',
        border: '1px solid var(--border)',
        borderRadius: '2px',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        boxSizing: 'border-box',
      }}
    >
      <span style={{ fontSize: '12px', color: 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>{label}：{placeholder}</span>
      <span style={{ fontSize: '10px', color: 'var(--muted-foreground)' }}>▼</span>
    </div>
  );
}

export function MemberList() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const rows = useMemo(
    () => MOCK_MEMBERS.filter((item) => item.name.includes(keyword) || item.phone.includes(keyword) || item.uid.includes(keyword)),
    [keyword]
  );

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
        <button
          style={{
            height: '32px',
            padding: '0 16px',
            border: '1px solid var(--border)',
            borderRadius: '2px',
            background: '#fff',
            color: 'var(--foreground)',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          会员分析
        </button>
      </div>
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--elevation-sm)',
          padding: '16px 16px 14px',
          marginBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '10px' }}>
          <div
            style={{
              width: '240px',
              height: '32px',
              border: '1px solid var(--border)',
              borderRadius: '2px',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
              boxSizing: 'border-box',
            }}
          >
            <span style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginRight: '10px', whiteSpace: 'nowrap' }}>会员手机号：</span>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="请输入"
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '12px', color: 'var(--foreground)', background: 'transparent' }}
            />
          </div>
          <FilterInput label="会员昵称" />
          <FilterSelect label="会员等级" />
          <FilterSelect label="企微好友" />
          <button style={{ height: '32px', padding: '0 16px', border: '1px solid var(--border)', borderRadius: '2px', background: '#fff', fontSize: '12px', cursor: 'pointer' }}>导出会员</button>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
          <FilterSelect label="会员状态" placeholder="正常" />
          <FilterSelect label="小店标签" />
          <FilterInput label="入会时间" placeholder="开始时间        →        结束时间" width={496} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button style={{ height: '30px', minWidth: '64px', border: '1px solid rgba(36,116,255,0.55)', borderRadius: '2px', background: 'rgba(36,116,255,0.08)', color: 'rgba(36,116,255,1)', fontSize: '12px', cursor: 'pointer' }}>查询</button>
          <button style={{ height: '30px', minWidth: '64px', border: '1px solid var(--border)', borderRadius: '2px', background: '#fff', color: 'var(--foreground)', fontSize: '12px', cursor: 'pointer' }}>重置</button>
          <button style={{ height: '30px', border: 'none', background: 'none', color: 'rgba(36,116,255,1)', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>新增会员</button>
          <button style={{ height: '30px', border: 'none', background: 'none', color: 'rgba(36,116,255,1)', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>批量导入客户</button>
          <button style={{ height: '30px', border: 'none', background: 'none', color: 'var(--muted-foreground)', fontSize: '12px', cursor: 'pointer' }}>展开</button>
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
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#fff' }}>
              {['', '会员信息', '手机号', '积分', '会员等级', '会员状态', '小店标签', '操作'].map((th, idx) => (
                <th
                  key={th + idx}
                  style={{
                    textAlign: 'left',
                    padding: '14px 14px',
                    borderBottom: '1px solid var(--border)',
                    fontSize: '12px',
                    color: 'var(--foreground)',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {th || '□'}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td style={{ padding: '14px', borderBottom: '1px solid var(--border)', fontSize: '13px', color: 'var(--muted-foreground)' }}>□</td>
                <td style={{ padding: '14px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '4px', background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{row.avatar}</div>
                    <div>
                      <div style={{ fontSize: '13px', color: 'var(--foreground)', fontWeight: 500 }}>{row.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginTop: '2px' }}>{row.uid}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px', borderBottom: '1px solid var(--border)', fontSize: '13px', color: 'var(--foreground)' }}>{row.phone}</td>
                <td style={{ padding: '14px', borderBottom: '1px solid var(--border)', fontSize: '13px', color: 'rgba(36,116,255,1)' }}>{row.points}</td>
                <td style={{ padding: '14px', borderBottom: '1px solid var(--border)', fontSize: '13px', color: 'var(--foreground)' }}>{row.level}</td>
                <td style={{ padding: '14px', borderBottom: '1px solid var(--border)', fontSize: '13px', color: 'var(--foreground)' }}>
                  <span style={{ color: 'rgba(82,196,26,1)', fontSize: '14px', marginRight: '6px' }}>•</span>
                  {row.status}
                </td>
                <td style={{ padding: '14px', borderBottom: '1px solid var(--border)', fontSize: '13px', color: 'var(--muted-foreground)' }}>{row.shopTag}</td>
                <td style={{ padding: '14px', borderBottom: '1px solid var(--border)', fontSize: '13px' }}>
                  <span style={{ position: 'relative', display: 'inline-block', marginRight: '16px' }}>
                    <span
                      style={{ color: 'rgba(36,116,255,1)', cursor: 'pointer' }}
                      onClick={() => navigate(`/backend/member/info/list/${row.id}`)}
                    >
                      详情
                    </span>
                    <span
                      style={{
                        position: 'absolute',
                        left: '50%',
                        bottom: 'calc(100% + 8px)',
                        transform: 'translateX(-50%)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        height: '24px',
                        padding: '0 9px',
                        borderRadius: '6px',
                        background: 'rgba(239,68,68,0.95)',
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: 600,
                        lineHeight: 1,
                        whiteSpace: 'nowrap',
                        boxShadow: '0 8px 18px rgba(239,68,68,0.3)',
                        pointerEvents: 'none',
                        zIndex: 2,
                      }}
                    >
                      这里有改动
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
                          borderTop: '6px solid rgba(239,68,68,0.95)',
                        }}
                      />
                    </span>
                  </span>
                  <span style={{ color: 'rgba(36,116,255,1)', marginRight: '16px', cursor: 'pointer' }}>改积分</span>
                  <span style={{ color: 'rgba(36,116,255,1)', marginRight: '16px', cursor: 'pointer' }}>送优惠券</span>
                  <span style={{ color: 'rgba(36,116,255,1)', cursor: 'pointer' }}>···</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
