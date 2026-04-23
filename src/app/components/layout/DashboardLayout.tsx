import { Outlet, Link, useLocation } from 'react-router';

import { CheckSquare, FileText, LayoutDashboard } from 'lucide-react';

const navItems = [
  { path: '/backend/dashboard', label: '数据看板', icon: LayoutDashboard },
  { path: '/backend/tasks', label: '任务管理', icon: FileText },
  { path: '/backend/review', label: '内容审核', icon: CheckSquare },
];

export function DashboardLayout() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/backend/dashboard') return location.pathname === '/backend/dashboard';
    if (path === '/backend/tasks') return location.pathname === '/backend/tasks' || location.pathname.startsWith('/backend/tasks/');
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top tab bar */}
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
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
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
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Page content */}
      <div style={{ flex: 1, overflowY: 'auto', background: '#f7f8fa' }}>
        <Outlet />
      </div>
    </div>
  );
}
