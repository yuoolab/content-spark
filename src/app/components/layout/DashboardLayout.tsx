import { Outlet, Link, useLocation, useSearchParams } from 'react-router';

import { CheckSquare, FileText, Sparkles, Users } from 'lucide-react';

const navItems = [
  { path: '/backend/scenarios', label: '玩转内容种草', icon: Sparkles },
  { path: '/backend/follow', label: '账号加粉', icon: Users },
  { path: '/backend/tasks', label: '内容互动', icon: FileText },
  { path: '/backend/review', label: '内容审核', icon: CheckSquare },
];

export function DashboardLayout() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isReviewRoute = location.pathname === '/backend/review' || location.pathname.startsWith('/backend/review/');

  const isScenariosRoute = location.pathname === '/backend/scenarios';
  const isFollowRoute = location.pathname === '/backend/follow' || (location.pathname === '/backend/tasks/create' && searchParams.get('scene') === 'follow');
  const isTaskRoute = location.pathname === '/backend/tasks' || (location.pathname.startsWith('/backend/tasks/') && !isFollowRoute);

  const isActive = (path: string) => {
    if (path === '/backend/scenarios') return isScenariosRoute;
    if (path === '/backend/follow') return isFollowRoute;
    if (path === '/backend/tasks') return isTaskRoute || (!isReviewRoute && !isScenariosRoute && !isFollowRoute);
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
