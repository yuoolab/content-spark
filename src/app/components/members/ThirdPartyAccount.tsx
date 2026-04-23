import { Outlet, Link, useLocation } from 'react-router';

const tabs = [
  { label: '账号审核', path: '/backend/member/info/third-party/verification' },
  { label: '三方账号配置', path: '/backend/member/info/third-party/platform-config' },
];

export function ThirdPartyAccount() {
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
          return (
            <Link
              key={tab.path}
              to={tab.path}
              style={{
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
              }}
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
