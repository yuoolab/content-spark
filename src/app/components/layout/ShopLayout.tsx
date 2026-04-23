import { Outlet, Link, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import {
  Home,
  ShoppingCart,
  Package,
  Users,
  Store,
  TrendingUp,
  Sparkles,
  FileText,
  Globe,
  RotateCcw,
  ChevronDown,
  MonitorPlay,
} from 'lucide-react';
import { PageAnnotations } from '../annotations/PageAnnotations';

const sidebarGroups = [
  {
    label: '订单管理',
    items: [
      { label: '订单列表', path: '#' },
      { label: '订单核销', path: '#' },
    ],
  },
  {
    label: '商品管理',
    items: [
      { label: '商品列表', path: '#' },
      { label: '商品类目', path: '#' },
      { label: '商品工具', path: '#' },
    ],
  },
  {
    label: '经营工具',
    items: [
      { label: '促销工具', path: '#' },
      { label: '会员营销', path: '/backend/interactive-marketing' },
      { label: '活动中心', path: '#' },
      { label: '微社区', path: '#' },
      { label: '导购商城', path: '#' },
    ],
  },
];

const iconNav = [
  { icon: Home, label: '首页', path: '#' },
  { icon: Users, label: '获客', path: '#' },
  { icon: Globe, label: '触达', path: '#' },
  { icon: Users, label: '用户', path: '#' },
  { icon: Store, label: '小店', path: '/backend/interactive-marketing' },
  { icon: TrendingUp, label: '营销', path: '#' },
  { icon: Sparkles, label: 'AI', path: '#' },
  { icon: FileText, label: '内容', path: '#' },
  { icon: RotateCcw, label: '回公域', path: '#' },
];

export function ShopLayout() {
  const location = useLocation();
  const pathname = location.pathname;

  const isShopAreaActive =
    pathname === '/backend/interactive-marketing' ||
    pathname.startsWith('/backend/member/') ||
    pathname.startsWith('/backend/tasks') ||
    pathname === '/backend/review' ||
    pathname === '/backend/verification' ||
    pathname === '/backend/platform-config' ||
    pathname === '/backend/dashboard';

  const isMemberArea = pathname.startsWith('/backend/member/');
  const isMemberMarketingActive = isShopAreaActive && !isMemberArea;

  const [isMemberMenuOpen, setIsMemberMenuOpen] = useState<boolean>(true);
  useEffect(() => {
    if (isMemberArea) setIsMemberMenuOpen(true);
  }, [isMemberArea]);

  return (
    <div className="flex h-screen bg-gray-50" style={{ fontFamily: 'PingFang SC, sans-serif' }}>
      {/* Icon nav */}
      <div
        style={{
          width: '64px',
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '12px',
          gap: '4px',
          flexShrink: 0,
        }}
      >
        {iconNav.map(({ icon: Icon, label, path }) => {
          const active = false;
          return (
            <Link
              key={label}
              to={path}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                padding: '8px 4px',
                borderRadius: '8px',
                textDecoration: 'none',
                width: '52px',
                background: 'transparent',
                color: '#9ca3af',
              }}
            >
              <Icon size={20} />
              <span style={{ fontSize: '10px', whiteSpace: 'nowrap' }}>{label}</span>
            </Link>
          );
        })}
      </div>

      {/* Sidebar */}
      <div
        style={{
          width: '140px',
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
          padding: '16px 0',
          flexShrink: 0,
          overflowY: 'auto',
        }}
      >
        {sidebarGroups.map((group) => (
          <div key={group.label} style={{ marginBottom: '8px' }}>
            <div
              style={{
                fontSize: '12px',
                color: '#999',
                padding: '4px 16px',
                fontWeight: 500,
              }}
            >
              {group.label}
            </div>
            {group.items.map((item) => {
              const active =
                item.label === '会员营销'
                  ? true
                  : false;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  style={{
                    display: 'block',
                    padding: '7px 16px',
                    fontSize: '13px',
                    textDecoration: 'none',
                    color: active ? '#3B5BDB' : '#9ca3af',
                    background: active ? '#EEF3FF' : 'transparent',
                    borderRight: active ? '2px solid #3B5BDB' : 'none',
                  }}
                >
                  {item.label}
                </Link>
              );
            })}

            {group.label === '经营工具' && (
              <div style={{ padding: '6px 8px 0' }}>
                <button
                  type="button"
                  onClick={() => setIsMemberMenuOpen((v) => !v)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 8px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#333',
                  }}
                >
                  <span>会员管理</span>
                  <ChevronDown
                    size={14}
                    style={{
                      transform: isMemberMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.15s',
                      color: '#999',
                    }}
                  />
                </button>

                {isMemberMenuOpen && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {[
                      { label: '会员信息', path: '/backend/member/info' },
                      { label: '会员体系', path: '/backend/member/system' },
                      { label: '会员权益', path: '/backend/member/benefits' },
                    ].map((sub) => {
                      const active =
                        sub.label === '会员信息';
                      return (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          style={{
                            display: 'block',
                            padding: '7px 12px',
                            marginLeft: '10px',
                            marginRight: '4px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            textDecoration: 'none',
                            color: active ? '#3B5BDB' : '#9ca3af',
                            background: active ? '#EEF3FF' : 'transparent',
                          }}
                        >
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
          </div>

      {/* Main content */}
      <div style={{ flex: 1, overflowY: 'auto', background: '#f7f8fa' }}>
        <Outlet />
      </div>

      {/* Floating preview for backend */}
      <Link
        to="/tasks"
        style={{
          position: 'fixed',
          left: '16px',
          bottom: '16px',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 14px',
          borderRadius: '16px',
          background: '#fff',
          border: '1px solid rgba(59,91,219,0.18)',
          boxShadow: '0 14px 36px rgba(15,23,42,0.14)',
          textDecoration: 'none',
          color: '#3B5BDB',
          fontSize: '13px',
          fontWeight: 700,
        }}
      >
        <MonitorPlay size={16} />
        预览小程序
      </Link>
      <PageAnnotations scope="backend" />
    </div>
  );
}
