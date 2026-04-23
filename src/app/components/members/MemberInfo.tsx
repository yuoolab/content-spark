import { Outlet, Link, useLocation } from 'react-router';

const tabs = [
  { label: '会员列表', path: '/backend/member/info/list' },
  { label: '会员资料', path: '/backend/member/info/profile' },
  { label: '三方账号', path: '/backend/member/info/third-party' },
];

export function MemberInfo() {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '0',
          flexShrink: 0,
        }}
      >
        {tabs.map((tab) => {
          const active = isActive(tab.path);
          const disabled = tab.label === '会员资料';
          const baseStyle: React.CSSProperties = {
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '14px 16px',
            fontSize: '13px',
            fontWeight: active ? 600 : 400,
            color: active ? '#3B5BDB' : '#555',
            textDecoration: 'none',
            borderBottom: active ? '2px solid #3B5BDB' : '2px solid transparent',
            marginBottom: '-1px',
            position: 'relative',
            whiteSpace: 'nowrap',
          };

          if (disabled) {
            return (
              <div
                key={tab.path}
                style={{
                  ...baseStyle,
                  color: '#999',
                  borderBottom: '2px solid transparent',
                  cursor: 'not-allowed',
                  pointerEvents: 'none',
                }}
              >
                {tab.label}
              </div>
            );
          }
          return (
            <Link
              key={tab.path}
              to={tab.path}
              style={baseStyle}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', background: '#f7f8fa' }}>
        <Outlet />
      </div>
    </div>
  );
}
