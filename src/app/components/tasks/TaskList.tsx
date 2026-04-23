import { Link, useNavigate } from 'react-router';
import {
  Plus,
  Search,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { PlatformBadge } from '../platform/PlatformBadge';

interface Task {
  id: string;
  name: string;
  platform: string;
  status: 'upcoming' | 'active' | 'expired' | 'inactive';
  showEnabled: boolean;
  showOrder: number;
  participants: number;
  submissions: number;
  baseReward: number;
  startDate: string;
  endDate: string;
}

const PLATFORM_COLOR: Record<string, { bg: string; color: string }> = {
  小红书: { bg: 'rgba(255, 56, 92, 0.08)', color: '#FF385C' },
  抖音: { bg: 'rgba(0, 0, 0, 0.06)', color: '#161823' },
  '哔哩哔哩': { bg: 'rgba(0, 161, 214, 0.1)', color: '#00A1D6' },
};

const PLATFORM_OPTIONS = [
  { value: '小红书', label: '小红书' },
  { value: '抖音', label: '抖音' },
  { value: '哔哩哔哩', label: '哔哩哔哩' },
] as const;

function normalizePlatform(platform: string) {
  return platform === '哔哩哔哩' ? '哔哩哔哩' : platform;
}

function formatTaskId(id: string) {
  const digitsOnly = id.replace(/\D/g, '');
  return digitsOnly.slice(-8).padStart(8, '0');
}

const STATUS_META: Record<Task['status'], { label: string; bg: string; color: string; dot: string }> = {
  upcoming: {
    label: '未开始',
    bg: 'rgba(24, 144, 255, 0.08)',
    color: 'rgba(24, 144, 255, 1)',
    dot: 'rgba(24, 144, 255, 1)',
  },
  active: {
    label: '进行中',
    bg: 'rgba(82, 196, 26, 0.1)',
    color: 'rgba(82, 196, 26, 1)',
    dot: 'rgba(82, 196, 26, 1)',
  },
  expired: {
    label: '已失效',
    bg: 'rgba(250, 173, 20, 0.1)',
    color: 'rgba(250, 173, 20, 1)',
    dot: 'rgba(250, 173, 20, 1)',
  },
  inactive: {
    label: '已结束',
    bg: 'var(--muted)',
    color: 'var(--muted-foreground)',
    dot: 'var(--muted-foreground)',
  },
};

function StatusBadge({ status }: { status: Task['status'] }) {
  const meta = STATUS_META[status];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 10px',
        borderRadius: '100px',
        fontSize: '12px',
        fontWeight: 'var(--font-weight-medium)',
        background: meta.bg,
        color: meta.color,
      }}
    >
      <span
        style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: meta.dot,
          flexShrink: 0,
        }}
      />
      {meta.label}
    </span>
  );
}

export function TaskList() {
  const PAGE_SIZE = 10;
  const navigate = useNavigate();
  const platformDropdownRef = useRef<HTMLDivElement | null>(null);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      name: '春季新品种草计划',
      platform: '小红书',
      status: 'active',
      showEnabled: true,
      showOrder: 100,
      participants: 234,
      submissions: 456,
      baseReward: 50,
      startDate: '2026-04-01',
      endDate: '2026-04-30',
    },
    {
      id: '2',
      name: '会员日专属福利',
      platform: '小红书',
      status: 'upcoming',
      showEnabled: true,
      showOrder: 90,
      participants: 89,
      submissions: 132,
      baseReward: 100,
      startDate: '2026-04-25',
      endDate: '2026-05-10',
    },
    {
      id: '3',
      name: '产品体验官招募',
      platform: '抖音',
      status: 'inactive',
      showEnabled: false,
      showOrder: 60,
      participants: 56,
      submissions: 78,
      baseReward: 200,
      startDate: '2026-03-15',
      endDate: '2026-03-31',
    },
    {
      id: '4',
      name: '哔哩哔哩开箱挑战赛',
      platform: '哔哩哔哩',
      status: 'expired',
      showEnabled: true,
      showOrder: 80,
      participants: 112,
      submissions: 180,
      baseReward: 150,
      startDate: '2026-04-05',
      endDate: '2026-04-18',
    },
    {
      id: '5',
      name: '五一出游穿搭征集',
      platform: '小红书',
      status: 'active',
      showEnabled: true,
      showOrder: 78,
      participants: 148,
      submissions: 221,
      baseReward: 60,
      startDate: '2026-04-20',
      endDate: '2026-05-06',
    },
    {
      id: '6',
      name: '母亲节好物推荐',
      platform: '抖音',
      status: 'upcoming',
      showEnabled: true,
      showOrder: 76,
      participants: 95,
      submissions: 130,
      baseReward: 80,
      startDate: '2026-05-01',
      endDate: '2026-05-12',
    },
    {
      id: '7',
      name: '春夏轻薄底妆挑战',
      platform: '抖音',
      status: 'active',
      showEnabled: true,
      showOrder: 74,
      participants: 173,
      submissions: 248,
      baseReward: 70,
      startDate: '2026-04-12',
      endDate: '2026-04-30',
    },
    {
      id: '8',
      name: '新品成分科普周',
      platform: '哔哩哔哩',
      status: 'inactive',
      showEnabled: false,
      showOrder: 72,
      participants: 68,
      submissions: 96,
      baseReward: 120,
      startDate: '2026-03-20',
      endDate: '2026-04-02',
    },
    {
      id: '9',
      name: '618预热清单投稿',
      platform: '小红书',
      status: 'upcoming',
      showEnabled: true,
      showOrder: 70,
      participants: 124,
      submissions: 188,
      baseReward: 90,
      startDate: '2026-05-15',
      endDate: '2026-06-05',
    },
    {
      id: '10',
      name: '敏感肌修护实测',
      platform: '小红书',
      status: 'active',
      showEnabled: true,
      showOrder: 68,
      participants: 211,
      submissions: 309,
      baseReward: 100,
      startDate: '2026-04-08',
      endDate: '2026-04-28',
    },
    {
      id: '11',
      name: '晚间护肤打卡计划',
      platform: '抖音',
      status: 'expired',
      showEnabled: true,
      showOrder: 66,
      participants: 133,
      submissions: 177,
      baseReward: 40,
      startDate: '2026-03-28',
      endDate: '2026-04-10',
    },
    {
      id: '12',
      name: '学生党平价好物推荐',
      platform: '小红书',
      status: 'active',
      showEnabled: true,
      showOrder: 64,
      participants: 186,
      submissions: 265,
      baseReward: 55,
      startDate: '2026-04-02',
      endDate: '2026-04-26',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Task['status']>('all');
  const [platformFilter, setPlatformFilter] = useState<string[]>([]);
  const [isPlatformDropdownOpen, setIsPlatformDropdownOpen] = useState(false);
  const [orderEditor, setOrderEditor] = useState<{ taskId: string; value: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [syncedTaskIds, setSyncedTaskIds] = useState<string[]>(['2', '4', '7', '10']);
  const [confirmAction, setConfirmAction] = useState<{ type: 'invalidate' | 'delete'; task: Task } | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        platformDropdownRef.current &&
        !platformDropdownRef.current.contains(event.target as Node)
      ) {
        setIsPlatformDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const invalidateTask = (id: string) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, status: task.status === 'active' ? 'inactive' : 'active' }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((current) => current.filter((task) => task.id !== id));
    setSyncedTaskIds((current) => current.filter((taskId) => taskId !== id));
  };

  const copyTask = (task: Task) => {
    const randomTaskId = String(Math.floor(10000000 + Math.random() * 90000000));
    const newTask: Task = {
      ...task,
      id: randomTaskId,
      name: `${task.name}（副本）`,
      status: 'inactive',
      showOrder: task.showOrder - 1,
    };
    setTasks((current) => [...current, newTask]);
  };

  const toggleTaskShowEnabled = (id: string) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, showEnabled: !task.showEnabled } : task
      )
    );
  };

  const updateTaskShowOrder = (id: string, value: string) => {
    const parsed = Number(value);
    const nextOrder = Number.isFinite(parsed) ? Math.max(0, Math.floor(parsed)) : 0;
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, showOrder: nextOrder } : task
      )
    );
  };

  const syncToActivityCenter = (id: string) => {
    setSyncedTaskIds((current) =>
      current.includes(id) ? current : [...current, id]
    );
  };

  const openOrderEditor = (task: Task) => {
    setOrderEditor({ taskId: task.id, value: String(task.showOrder) });
  };

  const saveOrderEditor = () => {
    if (!orderEditor) return;
    updateTaskShowOrder(orderEditor.taskId, orderEditor.value);
    setOrderEditor(null);
  };

  const handleConfirmAction = () => {
    if (!confirmAction) return;
    if (confirmAction.type === 'invalidate') {
      invalidateTask(confirmAction.task.id);
    } else {
      deleteTask(confirmAction.task.id);
    }
    setConfirmAction(null);
  };

  const filteredTasks = tasks
    .filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatTaskId(t.id).includes(searchTerm.replace(/\D/g, ''));
      const matchesStatus =
        statusFilter === 'all' || t.status === statusFilter;
      const taskPlatform = normalizePlatform(t.platform);
      const matchesPlatform =
        platformFilter.length === 0 ||
        platformFilter.includes(taskPlatform);
      return matchesSearch && matchesStatus && matchesPlatform;
    })
    .sort((a, b) => b.showOrder - a.showOrder);
  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedTasks = filteredTasks.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div style={{ padding: '24px' }}>
      {/* Table Card */}
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--elevation-sm)',
          overflow: 'hidden',
        }}
      >
        {/* Filter Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 20px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--muted)',
          }}
        >
          {/* Search Input */}
          <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--muted-foreground)',
                pointerEvents: 'none',
              }}
            />
            <input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="请输入任务名称"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                paddingLeft: '36px',
                paddingRight: '12px',
                paddingTop: '8px',
                paddingBottom: '8px',
                fontSize: 'var(--text-base)',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                color: 'var(--foreground)',
                outline: 'none',
              }}
            />
          </div>

          {/* Status Filter */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as 'all' | Task['status']);
                setCurrentPage(1);
              }}
              style={{
                appearance: 'none',
                paddingLeft: '10px',
                paddingRight: '36px',
                paddingTop: '8px',
                paddingBottom: '8px',
                fontSize: 'var(--text-base)',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                color: 'transparent',
                outline: 'none',
                cursor: 'pointer',
                minWidth: '200px',
              }}
            >
              <option value="all">全部</option>
              <option value="upcoming">未开始</option>
              <option value="active">进行中</option>
              <option value="expired">已失效</option>
              <option value="inactive">已结束</option>
            </select>
            <span
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 'var(--text-base)',
                color: 'var(--card-foreground)',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              任务状态：
              <span style={{ color: statusFilter === 'all' ? 'var(--muted-foreground)' : 'var(--foreground)' }}>
                {statusFilter === 'all'
                  ? '请选择'
                  : STATUS_META[statusFilter].label}
              </span>
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: 'var(--muted-foreground)',
              }}
            >
              <path
                d="M2.5 4.5L6 8L9.5 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Platform Multi Select */}
          <div
            ref={platformDropdownRef}
            style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
          >
            <button
              type="button"
              onClick={() => setIsPlatformDropdownOpen((open) => !open)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                paddingLeft: '10px',
                paddingRight: '10px',
                paddingTop: '8px',
                paddingBottom: '8px',
                fontSize: 'var(--text-base)',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                color: 'var(--card-foreground)',
                cursor: 'pointer',
                minWidth: '220px',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ whiteSpace: 'nowrap' }}>
                所属平台：
                <span
                  style={{
                    color:
                      platformFilter.length === 0
                        ? 'var(--muted-foreground)'
                        : 'var(--foreground)',
                  }}
                >
                  {platformFilter.length === 0 ? (
                    '请选择'
                  ) : platformFilter.length === 1 ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}>
                      <PlatformBadge platform={platformFilter[0]} size={12} />
                    </span>
                  ) : (
                    `已选 ${platformFilter.length} 项`
                  )}
                </span>
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                style={{
                  pointerEvents: 'none',
                  color: 'var(--muted-foreground)',
                  transform: isPlatformDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.15s',
                }}
              >
                <path
                  d="M2.5 4.5L6 8L9.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {isPlatformDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  minWidth: '220px',
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  boxShadow: 'var(--elevation-md)',
                  padding: '6px',
                  zIndex: 20,
                }}
              >
                {PLATFORM_OPTIONS.map((option) => {
                  const checked = platformFilter.includes(option.value);
                  return (
                    <label
                      key={option.value}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 8px',
                        borderRadius: 'var(--radius)',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setPlatformFilter((current) => {
                            setCurrentPage(1);
                            return checked
                              ? current.filter((value) => value !== option.value)
                              : [...current, option.value];
                          })
                        }
                      />
                      <PlatformBadge platform={option.value} size={12} />
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Reset */}
          {(searchTerm || statusFilter !== 'all' || platformFilter.length > 0) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPlatformFilter([]);
                setCurrentPage(1);
              }}
              style={{
                padding: '8px 14px',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontSize: 'var(--text-base)',
                color: 'var(--muted-foreground)',
                whiteSpace: 'nowrap',
              }}
            >
              重置
            </button>
          )}

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Create Button */}
          <Link
            to="/backend/tasks/create"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: 'var(--primary)',
              color: 'var(--primary-foreground)',
              borderRadius: 'var(--radius)',
              textDecoration: 'none',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-weight-medium)',
              boxShadow: '0 2px 8px rgba(36,116,255,0.25)',
              transition: 'opacity 0.15s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <Plus size={15} strokeWidth={2.5} />
            创建任务
          </Link>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: '1530px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--muted)' }}>
                {[
                  { key: 'taskName', label: '任务名称', minWidth: 280 },
                  { key: 'participants', label: '参与人数', minWidth: 110 },
                  { key: 'submissions', label: '内容提交数', minWidth: 120 },
                  {
                    key: 'sync',
                    minWidth: 180,
                    label: (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        同步至活动中心
                        <span
                          style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '999px',
                            border: '1px solid rgba(148,163,184,0.9)',
                            color: 'rgba(148,163,184,1)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            fontWeight: 600,
                            lineHeight: 1,
                          }}
                        >
                          ?
                        </span>
                      </span>
                    ),
                  },
                  { key: 'platform', label: '参与平台', minWidth: 140 },
                  { key: 'status', label: '任务状态', minWidth: 140 },
                  { key: 'date', label: '任务时间', minWidth: 170 },
                  { key: 'actions', label: '操作', minWidth: 340 },
                ].map((col) => (
                    <th
                      key={col.key}
                      style={{
                        padding: '10px 20px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--foreground)',
                        borderBottom: '1px solid var(--border)',
                        whiteSpace: 'nowrap',
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase',
                        minWidth: `${col.minWidth}px`,
                        width: `${col.minWidth}px`,
                        ...(col.key === 'actions'
                          ? {
                              position: 'sticky',
                              right: 0,
                              zIndex: 6,
                              background: 'var(--muted)',
                              borderLeft: '1px solid var(--border)',
                              boxShadow: '-8px 0 12px -10px rgba(15,23,42,0.18)',
                            }
                          : {}),
                      }}
                    >
                      {col.label}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {pagedTasks.map((task, rowIndex) => {
                const isSynced = syncedTaskIds.includes(task.id);
                return (
                <tr
                  key={task.id}
                  style={{
                    borderBottom:
                      rowIndex < pagedTasks.length - 1
                        ? '1px solid var(--border)'
                        : 'none',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = 'var(--muted)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = 'transparent')
                  }
                >
                  {/* Task Name */}
                  <td style={{ padding: '14px 20px', minWidth: '280px' }}>
                    <div
                      style={{
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--foreground)',
                        marginBottom: '5px',
                      }}
                    >
                      {task.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
                      任务ID：{formatTaskId(task.id)}
                    </div>
                  </td>

                  <td style={{ padding: '14px 20px', minWidth: '110px' }}>
                    <span style={{ fontSize: 'var(--text-base)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>
                      {task.participants.toLocaleString()}
                    </span>
                  </td>

                  <td style={{ padding: '14px 20px', minWidth: '120px' }}>
                    <span style={{ fontSize: 'var(--text-base)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>
                      {task.submissions.toLocaleString()}
                    </span>
                  </td>

                  {/* Sync to Activity Center */}
                  <td style={{ padding: '14px 20px', minWidth: '180px', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-base)', color: 'var(--card-foreground)' }}>
                        <span
                          style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            background: isSynced ? 'rgba(82,196,26,1)' : 'rgba(191,191,191,1)',
                            display: 'inline-block',
                          }}
                        />
                        {isSynced ? '已同步' : '未同步'}
                      </span>
                      {!isSynced && (
                        <button
                          type="button"
                          onClick={() => syncToActivityCenter(task.id)}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            padding: 0,
                            color: 'rgba(36,116,255,1)',
                            fontSize: 'var(--text-base)',
                            fontWeight: 'var(--font-weight-medium)',
                            cursor: 'pointer',
                          }}
                        >
                          同步
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Platform */}
                  <td style={{ padding: '14px 20px', minWidth: '140px' }}>
                    <PlatformBadge platform={task.platform} size={13} />
                  </td>

                  {/* Status */}
                  <td style={{ padding: '14px 20px', minWidth: '140px' }}>
                    <StatusBadge status={task.status} />
                  </td>

                  {/* Date */}
                  <td style={{ padding: '14px 20px', minWidth: '170px' }}>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--card-foreground)',
                        lineHeight: '1.6',
                      }}
                    >
                      <div>{task.startDate}</div>
                      <div>→ {task.endDate}</div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td
                    style={{
                      padding: '14px 20px',
                      minWidth: '340px',
                      whiteSpace: 'nowrap',
                      position: 'sticky',
                      right: 0,
                      zIndex: 5,
                      background: 'var(--card)',
                      borderLeft: '1px solid var(--border)',
                      boxShadow: '-8px 0 12px -10px rgba(15,23,42,0.18)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                      <TaskTextBtn
                        label="编辑"
                        color="rgba(36,116,255,1)"
                        onClick={() => navigate(`/backend/tasks/edit/${task.id}`)}
                      />
                      <ActionDivider />
                      <TaskTextBtn
                        label="数据"
                        color="rgba(36,116,255,1)"
                        onClick={() => navigate(`/backend/tasks/${task.id}/data`)}
                      />
                      <ActionDivider />
                      <TaskTextBtn
                        label="推广"
                        color="rgba(36,116,255,1)"
                        onClick={() => {}}
                      />
                      <ActionDivider />
                      <TaskTextBtn
                        label="复制"
                        color="rgba(36,116,255,1)"
                        onClick={() => copyTask(task)}
                      />
                      <ActionDivider />
                      <TaskTextBtn
                        label="失效"
                        color={task.status === 'active' ? 'rgba(36,116,255,1)' : 'var(--muted-foreground)'}
                        onClick={task.status === 'active' ? () => setConfirmAction({ type: 'invalidate', task }) : undefined}
                        disabled={task.status !== 'active'}
                      />
                      <ActionDivider />
                      <TaskTextBtn
                        label="删除"
                        color="var(--destructive)"
                        onClick={() => setConfirmAction({ type: 'delete', task })}
                      />
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
            共 {filteredTasks.length} 条记录
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={safePage === 1}
              style={{
                height: '28px',
                padding: '0 8px',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                background: 'transparent',
                color: safePage === 1 ? 'var(--muted-foreground)' : 'var(--card-foreground)',
                cursor: safePage === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              上一页
            </button>
            {pageNumbers.map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setCurrentPage(p)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius)',
                  fontSize: '12px',
                  border: p === safePage ? '1px solid var(--primary)' : '1px solid var(--border)',
                  background: p === safePage ? 'var(--primary)' : 'transparent',
                  color: p === safePage ? 'var(--primary-foreground)' : 'var(--card-foreground)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={safePage === totalPages}
              style={{
                height: '28px',
                padding: '0 8px',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                background: 'transparent',
                color: safePage === totalPages ? 'var(--muted-foreground)' : 'var(--card-foreground)',
                cursor: safePage === totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              下一页
            </button>
          </div>
        </div>
      </div>

      {confirmAction && (
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
          onClick={() => setConfirmAction(null)}
        >
          <div
            style={{
              width: 'min(92vw, 420px)',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              boxShadow: '0 22px 46px rgba(15,23,42,0.22)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)', background: 'var(--muted)' }}>
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)' }}>
                {confirmAction.type === 'invalidate' ? '确认失效任务' : '确认删除任务'}
              </div>
            </div>
            <div style={{ padding: '16px 18px', fontSize: '14px', color: 'var(--card-foreground)', lineHeight: 1.7 }}>
              {confirmAction.type === 'invalidate'
                ? `确认将「${confirmAction.task.name}」设为失效吗？`
                : `确认删除「${confirmAction.task.name}」吗？删除后不可恢复。`}
            </div>
            <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border)', background: 'var(--card)', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                style={{
                  height: '32px',
                  padding: '0 14px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                  color: 'var(--foreground)',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                style={{
                  height: '32px',
                  padding: '0 14px',
                  borderRadius: '6px',
                  border: 'none',
                  background: confirmAction.type === 'delete' ? 'rgba(255,77,79,1)' : 'rgba(36,116,255,1)',
                  color: '#fff',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                {confirmAction.type === 'invalidate' ? '确认失效' : '确认删除'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskTextBtn({
  label,
  color,
  onClick,
  disabled,
}: {
  label: string;
  color: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        background: 'transparent',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: color,
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-weight-medium)',
        opacity: disabled ? 0.65 : 1,
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

function ActionDivider() {
  return (
    <div
      style={{
        width: '1px',
        height: '16px',
        background: 'var(--muted)',
      }}
    />
  );
}
