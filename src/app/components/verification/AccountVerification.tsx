import { useState } from 'react';
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  X,
  ThumbsUp,
  ThumbsDown,
  User,
} from 'lucide-react';
import { PlatformBadge } from '../platform/PlatformBadge';

/* ─── Types ───────────────────────────────────────────────────────────────── */

type VerifyStatus = '待审核' | '已通过' | '已拒绝';
type Platform = '小红书' | '抖音' | '哔哩哔哩';

interface AccountRecord {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userAvatar: string;
  platform: Platform;
  accountHandle: string;
  accountName: string;
  screenshotUrl: string;
  profileUrl: string;
  followers: number;
  works: number;
  submittedAt: string;
  status: VerifyStatus;
  rejectReason?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  screenshotDesc: string;
}

/* ─── Mock data ───────────────────────────────────────────────────────────── */

const MOCK_RECORDS: AccountRecord[] = [
  {
    id: 'v001', userId: 'u1021', userName: '小鹿Elaine', userPhone: '138****1623', userAvatar: '🌸',
    platform: '小红书', accountHandle: '@elaine_diary', accountName: '小鹿Elaine日记',
    screenshotUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    profileUrl: 'https://www.xiaohongshu.com/user/profile/xxx1',
    followers: 12400, works: 86, submittedAt: '2026-04-19 10:22', status: '待审核',
    screenshotDesc: '已提交账号主页截图',
  },
  {
    id: 'v002', userId: 'u0988', userName: 'Tony的日常', userPhone: '139****8831', userAvatar: '🎵',
    platform: '抖音', accountHandle: '@tony_daily', accountName: 'Tony生活志',
    screenshotUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    profileUrl: 'https://www.douyin.com/user/xxx2',
    followers: 38700, works: 124, submittedAt: '2026-04-19 09:15', status: '待审核',
    screenshotDesc: '已提交账号主页截图',
  },
  {
    id: 'v003', userId: 'u0756', userName: 'Sophie甜酒', userPhone: '185****9036', userAvatar: '🦋',
    platform: '哔哩哔哩', accountHandle: 'UID: 2039821', accountName: 'Sophie的美妆间',
    screenshotUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    profileUrl: 'https://space.bilibili.com/xxx3',
    followers: 5600, works: 32, submittedAt: '2026-04-18 22:47', status: '已通过',
    reviewedAt: '2026-04-19 08:30', reviewedBy: '管理员',
    screenshotDesc: '已提交账号主页截图',
  },
  {
    id: 'v004', userId: 'u0634', userName: '懒癌晚期丸子', userPhone: '131****7408', userAvatar: '🌟',
    platform: '小红书', accountHandle: '@wanzi_lazy', accountName: '懒癌星球',
    screenshotUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80',
    profileUrl: 'https://www.xiaohongshu.com/user/profile/xxx4',
    followers: 9800, works: 67, submittedAt: '2026-04-18 20:11', status: '已通过',
    reviewedAt: '2026-04-19 09:05', reviewedBy: '管理员',
    screenshotDesc: '已提交账号主页截图',
  },
  {
    id: 'v005', userId: 'u0512', userName: '木木WOOD', userPhone: '132****6165', userAvatar: '🎧',
    platform: '抖音', accountHandle: '@mumu_wood', accountName: 'WOOD的测评日记',
    screenshotUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    profileUrl: 'https://www.douyin.com/user/xxx5',
    followers: 1200, works: 14, submittedAt: '2026-04-18 18:30', status: '已拒绝',
    rejectReason: '账号粉丝数不足 2000，暂不符合参与门槛',
    reviewedAt: '2026-04-19 10:00', reviewedBy: '管理员',
    screenshotDesc: '已提交账号主页截图',
  },
  {
    id: 'v006', userId: 'u1103', userName: '绿茶哦', userPhone: '137****9920', userAvatar: '🌿',
    platform: '小红书', accountHandle: '@lvcha_daily', accountName: '绿茶日记本',
    screenshotUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    profileUrl: 'https://www.xiaohongshu.com/user/profile/xxx6',
    followers: 24500, works: 143, submittedAt: '2026-04-18 16:55', status: '已通过',
    reviewedAt: '2026-04-18 20:10', reviewedBy: '管理员',
    screenshotDesc: '已提交账号主页截图',
  },
  {
    id: 'v007', userId: 'u0871', userName: 'Vivian爱生活', userPhone: '186****7841', userAvatar: '📺',
    platform: '哔哩哔哩', accountHandle: 'UID: 3841029', accountName: 'Vivian爱生活UP',
    screenshotUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80',
    profileUrl: 'https://space.bilibili.com/xxx7',
    followers: 3300, works: 21, submittedAt: '2026-04-18 14:20', status: '待审核',
    screenshotDesc: '已提交账号主页截图',
  },
  {
    id: 'v008', userId: 'u0345', userName: '大头爱摄影', userPhone: '189****2246', userAvatar: '🔥',
    platform: '抖音', accountHandle: '@datou_photo', accountName: '大头摄影日记',
    screenshotUrl: 'https://images.unsplash.com/photo-1475688621402-4257c394e67e?auto=format&fit=crop&w=600&q=80',
    profileUrl: 'https://www.douyin.com/user/xxx8',
    followers: 890, works: 9, submittedAt: '2026-04-17 22:05', status: '已拒绝',
    rejectReason: '提交的截图与填写的账号信息不符，请重新提交',
    reviewedAt: '2026-04-18 09:00', reviewedBy: '管理员',
    screenshotDesc: '已提交账号主页截图',
  },
  {
    id: 'v009', userId: 'u1234', userName: '可颂Croissant', userPhone: '130****4771', userAvatar: '🍀',
    platform: '小红书', accountHandle: '@croissant_life', accountName: '可颂的生活美学',
    screenshotUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    profileUrl: 'https://www.xiaohongshu.com/user/profile/xxx9',
    followers: 18200, works: 98, submittedAt: '2026-04-17 19:40', status: '已通过',
    reviewedAt: '2026-04-18 10:30', reviewedBy: '管理员',
    screenshotDesc: '已提交账号主页截图',
  },
  {
    id: 'v010', userId: 'u0678', userName: 'CeCe画画', userPhone: '156****6142', userAvatar: '🎨',
    platform: '哔哩哔哩', accountHandle: 'UID: 5920314', accountName: 'CeCe的画画间',
    screenshotUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    profileUrl: 'https://space.bilibili.com/xxx10',
    followers: 7100, works: 55, submittedAt: '2026-04-17 16:15', status: '待审核',
    screenshotDesc: '已提交账号主页截图',
  },
  {
    id: 'v011', userId: 'u2031', userName: '清风阿宁', userPhone: '133****1092', userAvatar: '🍃',
    platform: '小红书', accountHandle: '@qingfeng_ning', accountName: '清风阿宁的日常',
    screenshotUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
    profileUrl: 'https://www.xiaohongshu.com/user/profile/xxx11',
    followers: 22600, works: 172, submittedAt: '2026-04-17 14:20', status: '待审核',
    screenshotDesc: '已提交账号主页截图',
  },
  {
    id: 'v012', userId: 'u1782', userName: '米粒说好物', userPhone: '135****8821', userAvatar: '🌾',
    platform: '抖音', accountHandle: '@mili_goods', accountName: '米粒好物笔记',
    screenshotUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80',
    profileUrl: 'https://www.douyin.com/user/xxx12',
    followers: 45200, works: 280, submittedAt: '2026-04-17 12:58', status: '待审核',
    screenshotDesc: '已提交账号主页截图',
  },
  {
    id: 'v013', userId: 'u1543', userName: '阿南测评', userPhone: '136****7204', userAvatar: '🧪',
    platform: '哔哩哔哩', accountHandle: 'UID: 7842201', accountName: '阿南测评实验室',
    screenshotUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    profileUrl: 'https://space.bilibili.com/xxx13',
    followers: 9800, works: 88, submittedAt: '2026-04-17 11:34', status: '待审核',
    screenshotDesc: '已提交账号主页截图',
  },
  {
    id: 'v014', userId: 'u2430', userName: '小宇宙穿搭', userPhone: '138****4507', userAvatar: '🪐',
    platform: '小红书', accountHandle: '@xiaoyuzhou_fit', accountName: '小宇宙穿搭日记',
    screenshotUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80',
    profileUrl: 'https://www.xiaohongshu.com/user/profile/xxx14',
    followers: 14600, works: 104, submittedAt: '2026-04-17 10:12', status: '待审核',
    screenshotDesc: '已提交账号主页截图',
  },
  {
    id: 'v015', userId: 'u2667', userName: '阿福摄影', userPhone: '139****3368', userAvatar: '📷',
    platform: '抖音', accountHandle: '@afu_photo', accountName: '阿福摄影手记',
    screenshotUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80',
    profileUrl: 'https://www.douyin.com/user/xxx15',
    followers: 6100, works: 72, submittedAt: '2026-04-17 09:06', status: '待审核',
    screenshotDesc: '已提交账号主页截图',
  },
  {
    id: 'v016', userId: 'u0885', userName: '海盐芝士', userPhone: '131****9022', userAvatar: '🧂',
    platform: '小红书', accountHandle: '@haiyan_cheese', accountName: '海盐芝士小铺',
    screenshotUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    profileUrl: 'https://www.xiaohongshu.com/user/profile/xxx16',
    followers: 12100, works: 63, submittedAt: '2026-04-16 21:42', status: '已通过',
    reviewedAt: '2026-04-17 08:45', reviewedBy: '管理员',
    screenshotDesc: '已提交账号主页截图',
  },
  {
    id: 'v017', userId: 'u3046', userName: '胖虎爱测评', userPhone: '187****7641', userAvatar: '🐯',
    platform: '哔哩哔哩', accountHandle: 'UID: 3007722', accountName: '胖虎测评台',
    screenshotUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    profileUrl: 'https://space.bilibili.com/xxx17',
    followers: 430, works: 8, submittedAt: '2026-04-16 20:08', status: '已拒绝',
    rejectReason: '账号粉丝数不足 500，暂不符合参与门槛',
    reviewedAt: '2026-04-17 09:10', reviewedBy: '管理员',
    screenshotDesc: '已提交账号主页截图',
  },
  {
    id: 'v018', userId: 'u4011', userName: '苏打打', userPhone: '152****1189', userAvatar: '🥤',
    platform: '抖音', accountHandle: '@soda_daily', accountName: '苏打的日常',
    screenshotUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    profileUrl: 'https://www.douyin.com/user/xxx18',
    followers: 20300, works: 141, submittedAt: '2026-04-16 18:36', status: '待审核',
    screenshotDesc: '已提交账号主页截图',
  },
  {
    id: 'v019', userId: 'u4920', userName: 'Momo厨房', userPhone: '150****6324', userAvatar: '🍳',
    platform: '小红书', accountHandle: '@momo_kitchen', accountName: 'Momo厨房日记',
    screenshotUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    profileUrl: 'https://www.xiaohongshu.com/user/profile/xxx19',
    followers: 17200, works: 126, submittedAt: '2026-04-16 16:21', status: '待审核',
    screenshotDesc: '已提交账号主页截图',
  },
  {
    id: 'v020', userId: 'u5663', userName: '喵喵画室', userPhone: '155****4406', userAvatar: '🎨',
    platform: '哔哩哔哩', accountHandle: 'UID: 6491002', accountName: '喵喵画室',
    screenshotUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    profileUrl: 'https://space.bilibili.com/xxx20',
    followers: 6400, works: 61, submittedAt: '2026-04-16 14:09', status: '待审核',
    screenshotDesc: '已提交账号主页截图',
  },
];

/* ─── Config ──────────────────────────────────────────────────────────────── */

const PLATFORM_CONFIG: Record<Platform, { color: string; bgColor: string; emoji: string; minFollowers: number }> = {
  '小红书':  { color: '#FF385C', bgColor: 'rgba(255,56,92,0.08)',   emoji: '📕', minFollowers: 1000 },
  '抖音':    { color: '#161823', bgColor: 'rgba(22,24,35,0.06)',    emoji: '🎵', minFollowers: 2000 },
  '哔哩哔哩':{ color: '#00A1D6', bgColor: 'rgba(0,161,214,0.08)',   emoji: '📺', minFollowers: 500  },
};

const STATUS_CONFIG: Record<VerifyStatus, { color: string; bg: string; border: string; icon: React.ElementType }> = {
  '待审核': { color: 'rgba(250,173,20,1)',  bg: 'rgba(250,173,20,0.08)',  border: 'rgba(250,173,20,0.3)',  icon: Clock       },
  '已通过': { color: 'rgba(82,196,26,1)',   bg: 'rgba(82,196,26,0.08)',   border: 'rgba(82,196,26,0.3)',   icon: CheckCircle },
  '已拒绝': { color: 'rgba(255,77,79,1)',   bg: 'rgba(255,77,79,0.08)',   border: 'rgba(255,77,79,0.3)',   icon: XCircle     },
};

const PAGE_SIZE = 10;

function ScreenshotPreviewModal({
  url,
  title,
  onClose,
}: {
  url: string;
  title: string;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 120,
        background: 'rgba(0,0,0,0.72)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 'min(92vw, 960px)',
          maxHeight: '88vh',
          background: 'rgba(15,23,42,0.98)',
          borderRadius: '18px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            color: 'white',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: 600 }}>{title}</div>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '999px',
              border: 'none',
              background: 'rgba(255,255,255,0.12)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>
        <div
          style={{
            padding: '18px',
            overflow: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(2,6,23,0.92)',
          }}
        >
          <img
            src={url}
            alt={title}
            style={{
              maxWidth: '100%',
              maxHeight: 'calc(88vh - 90px)',
              objectFit: 'contain',
              borderRadius: '12px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ReviewDecisionModal({
  type,
  record,
  onClose,
  onApprove,
  onReject,
}: {
  type: 'approve' | 'reject';
  record: AccountRecord;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}) {
  const [reason, setReason] = useState('');

  const isApprove = type === 'approve';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 130,
        background: 'rgba(0,0,0,0.62)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 'min(92vw, 520px)',
          background: 'var(--card)',
          borderRadius: '20px',
          border: '1px solid var(--border)',
          boxShadow: '0 28px 90px rgba(0,0,0,0.35)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: '18px 22px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isApprove ? 'rgba(82,196,26,0.12)' : 'rgba(255,77,79,0.12)',
                color: isApprove ? 'rgba(82,196,26,1)' : 'rgba(255,77,79,1)',
              }}
            >
              {isApprove ? <CheckCircle size={18} /> : <XCircle size={18} />}
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
                {isApprove ? '确认审核通过' : '拒绝账号认证'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginTop: '2px' }}>
                {record.userName} · {record.platform} · {record.accountName}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '999px',
              border: 'none',
              background: 'var(--muted)',
              color: 'var(--muted-foreground)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={15} />
          </button>
        </div>

        <div style={{ padding: '22px' }}>
          {isApprove ? (
            <div
              style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(82,196,26,0.06)',
                border: '1px solid rgba(82,196,26,0.18)',
                color: 'rgba(22,101,52,1)',
                fontSize: '13px',
                lineHeight: '1.7',
              }}
            >
              通过后，该账号将进入已通过状态。请确认该账号信息、主页截图和主页链接无误后再继续。
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(255,77,79,0.06)',
                  border: '1px solid rgba(255,77,79,0.18)',
                  color: 'rgba(153,27,27,1)',
                  fontSize: '13px',
                  lineHeight: '1.7',
                }}
              >
                拒绝后，系统会把该原因展示给用户。请填写清晰、具体的拒绝说明。
              </div>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="请输入拒绝原因，该原因会展示给用户"
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  background: 'var(--input-background)',
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-base)',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          )}
        </div>

        <div
          style={{
            padding: '16px 22px',
            borderTop: '1px solid var(--border)',
            background: 'var(--muted)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              background: 'var(--card)',
              cursor: 'pointer',
              color: 'var(--foreground)',
              fontSize: 'var(--text-base)',
            }}
          >
            取消
          </button>
          {isApprove ? (
            <button
              type="button"
              onClick={() => {
                onApprove(record.id);
                onClose();
              }}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius)',
                border: 'none',
                background: 'rgba(82,196,26,1)',
                color: 'white',
                cursor: 'pointer',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              确认通过
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                const trimmed = reason.trim();
                if (!trimmed) return;
                onReject(record.id, trimmed);
                onClose();
              }}
              disabled={!reason.trim()}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius)',
                border: 'none',
                background: reason.trim() ? 'rgba(255,77,79,1)' : 'var(--muted)',
                color: reason.trim() ? 'white' : 'var(--muted-foreground)',
                cursor: reason.trim() ? 'pointer' : 'not-allowed',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-medium)',
                opacity: reason.trim() ? 1 : 0.65,
              }}
            >
              确认拒绝
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Helper ─────────────────────────────────────────────────────────────── */

function fmtFollowers(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}w`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

/* ─── Detail / Action Modal ──────────────────────────────────────────────── */

function ReviewModal({
  record,
  onClose,
  onPreviewScreenshot,
}: {
  record: AccountRecord;
  onClose: () => void;
  onPreviewScreenshot: (url: string, title: string) => void;
}) {
  const sc = STATUS_CONFIG[record.status];
  const StatusIcon = sc.icon;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.45)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '24px',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'var(--card)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
        width: '100%', maxWidth: '560px', overflow: 'hidden',
      }}>
        {/* Modal header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PlatformBadge platform={record.platform} size={13} style={{ padding: '2px 8px 2px 3px', fontSize: '11px' }} />
            <div>
              <div style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>账号认证详情</div>
              <div style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginTop: '1px' }}>申请编号 {record.id}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--muted)', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer', color: 'var(--muted-foreground)' }}>
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* User info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', background: 'var(--muted)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
              {record.userAvatar}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>{record.userName}</div>
              <div style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginTop: '2px' }}>用户ID：{record.userId}</div>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '100px', fontSize: '12px', color: sc.color, background: sc.bg, border: `1px solid ${sc.border}`, fontWeight: 'var(--font-weight-medium)' }}>
              <StatusIcon size={11} />
              {record.status}
            </span>
          </div>

          {/* Platform account details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>平台账号信息</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { label: '认证平台', value: <PlatformBadge platform={record.platform} size={13} /> },
                { label: '账号昵称', value: record.accountName },
                { label: '账号 ID / Handle', value: record.accountHandle },
                { label: '主页截图', value: <button type="button" onClick={() => onPreviewScreenshot(record.screenshotUrl, `${record.userName} 的主页截图`)} style={{ color: 'var(--primary)', textDecoration: 'none', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 'var(--text-base)' }}>查看截图</button> },
                { label: '主页链接', value: <a href={record.profileUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>查看链接</a> },
                { label: '提交时间', value: record.submittedAt },
              ].map((row) => (
                <div key={row.label} style={{ background: 'var(--muted)', borderRadius: 'var(--radius)', padding: '10px 12px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginBottom: '4px' }}>{row.label}</div>
                  <div style={{ fontSize: 'var(--text-base)', color: 'var(--foreground)' }}>{row.value}</div>
                </div>
              ))}
            </div>

            {/* Profile link */}
            <a href={record.profileUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--primary)', textDecoration: 'none' }}>
              <ExternalLink size={12} />
              查看主页链接
            </a>
          </div>

          {/* Reject reason if rejected */}
          {record.status === '已拒绝' && record.rejectReason && (
            <div style={{ padding: '12px', background: 'rgba(255,77,79,0.06)', border: '1px solid rgba(255,77,79,0.2)', borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: '12px', fontWeight: 'var(--font-weight-medium)', color: 'rgba(255,77,79,1)', marginBottom: '4px' }}>拒绝原因</div>
              <div style={{ fontSize: 'var(--text-base)', color: 'var(--foreground)' }}>{record.rejectReason}</div>
            </div>
          )}
          {record.status !== '待审核' && record.reviewedAt && (
            <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
              由 <strong style={{ color: 'var(--foreground)' }}>{record.reviewedBy}</strong> 于 {record.reviewedAt} 审核
            </div>
          )}
        </div>

        <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border)', background: 'var(--muted)', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '8px 20px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--card)', fontSize: 'var(--text-base)', cursor: 'pointer', color: 'var(--foreground)' }}>
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */

export function AccountVerification() {
  const [records, setRecords] = useState<AccountRecord[]>(MOCK_RECORDS);
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<VerifyStatus>('待审核');
  const [page, setPage] = useState(1);
  const [activeRecord, setActiveRecord] = useState<AccountRecord | null>(null);
  const [decisionTarget, setDecisionTarget] = useState<{ type: 'approve' | 'reject'; record: AccountRecord } | null>(null);
  const [previewScreenshot, setPreviewScreenshot] = useState<{ url: string; title: string } | null>(null);

  /* filter */
  const filtered = records.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = !search || r.userPhone.toLowerCase().includes(q);
    const matchPlatform = platformFilter === 'all' || r.platform === platformFilter;
    const matchStatus = r.status === statusFilter;
    return matchSearch && matchPlatform && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pagedRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const isReviewedTab = statusFilter !== '待审核';
  const tableHeaders = isReviewedTab
    ? ['申请用户', '平台', '账号信息', '主页截图', '主页链接', '提交时间', '审核状态', '审核人']
    : ['申请用户', '平台', '账号信息', '主页截图', '主页链接', '提交时间', '审核状态', '操作'];

  /* actions */
  const handleApprove = (id: string) => {
    setRecords((prev) => prev.map((r) => r.id === id
      ? { ...r, status: '已通过' as VerifyStatus, reviewedAt: '刚刚', reviewedBy: '管理员' }
      : r
    ));
  };
  const handleReject = (id: string, reason: string) => {
    setRecords((prev) => prev.map((r) => r.id === id
      ? { ...r, status: '已拒绝' as VerifyStatus, rejectReason: reason, reviewedAt: '刚刚', reviewedBy: '管理员' }
      : r
    ));
  };

  /* stats */
  const pending = records.filter((r) => r.status === '待审核').length;
  const passed  = records.filter((r) => r.status === '已通过').length;
  const failed  = records.filter((r) => r.status === '已拒绝').length;

  return (
    <div style={{ padding: '24px' }}>

      {/* ── Table card ── */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--elevation-sm)', overflow: 'hidden' }}>

        {/* Tab + search bar */}
        <div style={{ padding: '10px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', background: 'var(--card)' }}>
          <div
            style={{
              display: 'flex',
              gap: '2px',
              background: 'var(--muted)',
              borderRadius: 'var(--radius)',
              padding: '3px',
            }}
          >
            {([
              { key: '待审核', label: '待审核', count: pending },
              { key: '已通过', label: '已通过', count: passed  },
              { key: '已拒绝', label: '已拒绝', count: failed  },
            ] as const).map((tab) => {
              const active = statusFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => { setStatusFilter(tab.key as any); setPage(1); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '5px 14px',
                    borderRadius: 'var(--radius)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-base)',
                    fontWeight: active ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                    background: active ? 'rgba(36,116,255,0.1)' : 'transparent',
                    border: active ? '1px solid rgba(36,116,255,0.28)' : '1px solid transparent',
                    color: active ? 'var(--primary)' : 'var(--card-foreground)',
                    boxShadow: 'none',
                    transition: 'all 0.15s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tab.label}
                  <span
                    style={{
                      fontSize: '11px',
                      background: active ? 'rgba(36,116,255,0.14)' : 'transparent',
                      color: active ? 'var(--primary)' : 'var(--card-foreground)',
                      padding: '1px 5px',
                      borderRadius: '100px',
                      minWidth: '18px',
                      textAlign: 'center',
                    }}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ position: 'relative' }}>
              <select
                value={platformFilter}
                onChange={(e) => {
                  setPlatformFilter(e.target.value as Platform | 'all');
                  setPage(1);
                }}
                style={{
                  height: '32px',
                  padding: '0 28px 0 10px',
                  fontSize: '12px',
                  minWidth: '130px',
                  background: 'var(--input-background)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--foreground)',
                  outline: 'none',
                  appearance: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="all">全部</option>
                <option value="小红书">小红书</option>
                <option value="抖音">抖音</option>
                <option value="哔哩哔哩">哔哩哔哩</option>
              </select>
              <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)', pointerEvents: 'none', fontSize: '10px' }}>▼</span>
            </div>
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)', pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="输入手机号查询"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                style={{ height: '32px', paddingLeft: '28px', paddingRight: '10px', fontSize: '12px', width: '200px', background: 'var(--input-background)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--foreground)', outline: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-base)' }}>
            <thead>
              <tr style={{ background: 'var(--muted)' }}>
                {tableHeaders.map((h) => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagedRows.length === 0 ? (
                <tr>
                  <td colSpan={tableHeaders.length} style={{ textAlign: 'center', padding: '56px 0', color: 'var(--muted-foreground)', fontSize: 'var(--text-base)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <User size={32} style={{ opacity: 0.25 }} />
                      暂无符合条件的申请记录
                    </div>
                  </td>
                </tr>
              ) : (
                pagedRows.map((r, idx) => {
                  const sc = STATUS_CONFIG[r.status];
                  const isLast = idx === pagedRows.length - 1;

                  return (
                    <tr key={r.id}
                      style={{ borderBottom: isLast ? 'none' : '1px solid var(--border)', transition: 'background 0.1s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--muted)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* User */}
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--muted)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                            {r.userAvatar}
                          </div>
                          <div>
                            <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>{r.userName}</div>
                            <div style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginTop: '1px' }}>{r.userPhone}</div>
                          </div>
                        </div>
                      </td>

                      {/* Platform */}
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <PlatformBadge platform={r.platform} size={13} />
                      </td>

                      {/* Account info */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)', marginBottom: '2px' }}>{r.accountName}</div>
                        <div style={{ fontSize: '12px', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {r.accountHandle}
                        </div>
                      </td>

                      {/* Screenshot */}
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewScreenshot({ url: r.screenshotUrl, title: `${r.userName} 的主页截图` });
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0,
                            padding: 0,
                            border: 'none',
                            background: 'transparent',
                            cursor: 'zoom-in',
                          }}
                        >
                          <img
                            src={r.screenshotUrl}
                            alt={`${r.userName} 主页截图`}
                            style={{
                              width: '72px',
                              height: '48px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: '1px solid var(--border)',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                              display: 'block',
                            }}
                          />
                        </button>
                      </td>

                      {/* Profile link */}
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <a
                          href={r.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', textDecoration: 'none', fontSize: '12px' }}
                        >
                          <ExternalLink size={11} />
                          查看链接
                        </a>
                      </td>

                      {/* Submitted at */}
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', fontSize: '12px', color: 'var(--foreground)' }}>
                        {r.submittedAt}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: 'var(--font-weight-medium)', color: sc.color, background: sc.bg }}>
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: sc.color, flexShrink: 0 }} />
                          {r.status}
                        </span>
                      </td>

                      {isReviewedTab ? (
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <div style={{ fontSize: '12px', color: 'var(--foreground)', fontWeight: 'var(--font-weight-medium)' }}>
                            {r.reviewedBy || '—'}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginTop: '3px' }}>
                            {r.reviewedAt || '—'}
                          </div>
                        </td>
                      ) : (
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <button
                              onClick={() => setDecisionTarget({ type: 'approve', record: r })}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: 'var(--radius)', border: '1px solid rgba(82,196,26,0.35)', background: 'rgba(82,196,26,0.08)', fontSize: '12px', cursor: 'pointer', color: 'rgba(82,196,26,1)', fontWeight: 'var(--font-weight-medium)', transition: 'all 0.1s' }}
                            >
                              <ThumbsUp size={12} />
                              通过
                            </button>
                            <button
                              onClick={() => setDecisionTarget({ type: 'reject', record: r })}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: 'var(--radius)', border: '1px solid rgba(255,77,79,0.35)', background: 'rgba(255,77,79,0.06)', fontSize: '12px', cursor: 'pointer', color: 'rgba(255,77,79,1)', fontWeight: 'var(--font-weight-medium)', transition: 'all 0.1s' }}
                            >
                              <ThumbsDown size={12} />
                              拒绝
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
            第 {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length || 1)}–{Math.min(page * PAGE_SIZE, filtered.length)} 条，共 {filtered.length} 条
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--card)', color: page === 1 ? 'var(--muted-foreground)' : 'var(--foreground)', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}>
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => setPage(n)}
                style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${n === page ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 'var(--radius)', background: n === page ? 'var(--primary)' : 'var(--card)', color: n === page ? 'var(--primary-foreground)' : 'var(--foreground)', fontSize: '12px', cursor: 'pointer', fontWeight: n === page ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)' }}>
                {n}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--card)', color: page === totalPages ? 'var(--muted-foreground)' : 'var(--foreground)', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1 }}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Review modal */}
      {activeRecord && (
        <ReviewModal
          record={activeRecord}
          onClose={() => setActiveRecord(null)}
          onPreviewScreenshot={(url, title) => setPreviewScreenshot({ url, title })}
        />
      )}

      {decisionTarget && (
        <ReviewDecisionModal
          type={decisionTarget.type}
          record={decisionTarget.record}
          onClose={() => setDecisionTarget(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {previewScreenshot && (
        <ScreenshotPreviewModal
          url={previewScreenshot.url}
          title={previewScreenshot.title}
          onClose={() => setPreviewScreenshot(null)}
        />
      )}
    </div>
  );
}
