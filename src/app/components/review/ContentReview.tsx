import { useEffect, useState } from 'react';
import {
  ExternalLink,
  Bot,
  Check,
  X,
  CheckCircle,
  CheckCircle2,
  FileCheck2,
  Gift,
  Lightbulb,
  RefreshCw,
  ShieldCheck,
  Target,
  XCircle,
} from 'lucide-react';
import { PlatformBadge } from '../platform/PlatformBadge';

interface Submission {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userPhone: string;
  taskName: string;
  platform: string;
  contentUrl: string;
  contentTitle: string;
  contentPreview: string;
  publishTime: string; // YYYY-MM-DD HH:mm
  submitTime: string;
  status: 'pending' | 'approved' | 'rejected' | 'deleted';
  rejectReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  likes?: number;
  comments?: number;
  collections?: number;
}

const PLATFORM_BADGE: Record<string, { bg: string; color: string }> = {
  小红书: { bg: 'rgba(255, 56, 92, 0.1)', color: '#FF385C' },
  抖音: { bg: 'rgba(0, 0, 0, 0.07)', color: '#222' },
  '哔哩哔哩': { bg: 'rgba(0, 161, 214, 0.1)', color: '#00A1D6' },
};

function toYMD(dateTime: string) {
  return (dateTime || '').slice(0, 10);
}

function formatTaskId(taskId: string) {
  const digits = (taskId || '').replace(/\D/g, '');
  if (!digits) return taskId;
  return digits.padStart(8, '0');
}

function parseYMD(ymd: string) {
  if (!ymd || ymd.length !== 10) return null;
  const [y, m, d] = ymd.split('-').map((v) => parseInt(v, 10));
  if (!y || !m || !d) return null;
  const dt = new Date(y, m - 1, d);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

const STATUS_MAP = {
  pending: { label: '待审核', bg: 'rgba(250,173,20,0.1)', color: 'rgba(250,173,20,1)' },
  approved: { label: '已通过', bg: 'rgba(82,196,26,0.1)', color: 'rgba(82,196,26,1)' },
  rejected: { label: '已拒绝', bg: 'rgba(255,77,79,0.1)', color: 'rgba(255,77,79,1)' },
  deleted: { label: '已删除', bg: 'rgba(140,140,140,0.14)', color: 'rgba(89,89,89,1)' },
};

const AVATAR_COLORS = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
];

const REVIEWERS = ['王敏', '李晨', '赵琪', '周岩'] as const;

const PAGE_SIZE = 10;

function RejectModal({
  submission,
  onConfirm,
  onCancel,
}: {
  submission: Submission;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}) {
  const [reason, setReason] = useState('');

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
      onClick={onCancel}
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
                background: 'rgba(255,77,79,0.12)',
                color: 'rgba(255,77,79,1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <XCircle size={18} />
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
                拒绝内容审核
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
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
          <div
            style={{
              padding: '14px 16px',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(255,77,79,0.06)',
              border: '1px solid rgba(255,77,79,0.18)',
              color: 'rgba(153,27,27,1)',
              fontSize: '13px',
              lineHeight: '1.7',
              marginBottom: '10px',
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
            onClick={onCancel}
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
          <button
            type="button"
            onClick={() => reason.trim() && onConfirm(reason)}
            disabled={!reason.trim()}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius)',
              border: 'none',
              background: reason.trim() ? 'rgba(255,77,79,1)' : 'rgba(255,77,79,0.35)',
              cursor: reason.trim() ? 'pointer' : 'not-allowed',
              fontSize: 'var(--text-base)',
              color: 'white',
              fontWeight: 'var(--font-weight-medium)',
            }}
          >
            确认拒绝
          </button>
        </div>
      </div>
    </div>
  );
}

function ApproveModal({
  submission,
  onConfirm,
  onCancel,
}: {
  submission: Submission;
  onConfirm: () => void;
  onCancel: () => void;
}) {
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
      onClick={onCancel}
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
                background: 'rgba(82,196,26,0.12)',
                color: 'rgba(82,196,26,1)',
              }}
            >
              <CheckCircle size={18} />
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
                确认内容审核通过
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
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
            通过后，该内容将进入已通过状态。请确认内容与任务要求一致后再继续。
          </div>
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
            onClick={onCancel}
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
          <button
            type="button"
            onClick={onConfirm}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius)',
              border: 'none',
              background: 'rgba(82,196,26,1)',
              cursor: 'pointer',
              color: 'white',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-weight-medium)',
            }}
          >
            确认通过
          </button>
        </div>
      </div>
    </div>
  );
}

function RejectReasonModal({
  reason,
  onClose,
}: {
  reason: string;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--card)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
          width: '420px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          border: '1px solid var(--border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: '10px' }}>
          拒绝原因
        </div>
        <div
          style={{
            fontSize: 'var(--text-base)',
            color: 'var(--foreground)',
            lineHeight: '1.6',
            padding: '10px 12px',
            background: 'rgba(255,77,79,0.06)',
            border: '1px solid rgba(255,77,79,0.15)',
            borderRadius: 'var(--radius)',
            marginBottom: '14px',
          }}
        >
          {reason}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '7px 16px',
              background: 'var(--secondary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontSize: 'var(--text-base)',
              color: 'var(--secondary-foreground)',
            }}
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

function AiAutoReviewModal({
  enabled,
  onToggle,
  onClose,
}: {
  enabled: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1200,
        background: 'rgba(15,23,42,0.56)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '22px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 'min(1120px, 94vw)',
          maxHeight: '92vh',
          overflow: 'auto',
          borderRadius: '10px',
          background: '#f8fcfc',
          border: '1px solid rgba(207,226,226,0.96)',
          boxShadow: '0 28px 88px rgba(15,23,42,0.26)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭"
            style={{
              position: 'absolute',
              right: '16px',
              top: '16px',
              zIndex: 4,
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255,255,255,0.82)',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(15,23,42,0.08)',
            }}
          >
            <X size={16} />
          </button>

          <div
            style={{
              position: 'relative',
              minHeight: '222px',
              padding: '40px 42px 34px',
              overflow: 'hidden',
              background:
                'linear-gradient(105deg, rgba(248,253,252,1) 0%, rgba(241,251,250,1) 44%, rgba(232,249,248,1) 100%)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background:
                  'linear-gradient(120deg, transparent 0 35%, rgba(125,211,205,0.16) 35.2% 35.8%, transparent 36% 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '12px',
                width: '340px',
                height: '184px',
                transform: 'translateX(-32%)',
                pointerEvents: 'none',
              }}
            >
              <div style={{ position: 'absolute', left: '100px', top: '112px', width: '170px', height: '42px', borderRadius: '50%', background: 'rgba(52,211,201,0.18)', boxShadow: '0 0 34px rgba(45,212,191,0.32)' }} />
              <div style={{ position: 'absolute', left: '132px', top: '96px', width: '110px', height: '32px', borderRadius: '50%', border: '10px solid rgba(87,218,207,0.32)' }} />
              <div
                style={{
                  position: 'absolute',
                  left: '150px',
                  top: '38px',
                  width: '78px',
                  height: '72px',
                  borderRadius: '30px 30px 26px 26px',
                  background: 'linear-gradient(180deg, #eef8fb 0%, #d5edf2 100%)',
                  boxShadow: '0 16px 30px rgba(66,153,165,0.25)',
                }}
              >
                <div style={{ position: 'absolute', left: '12px', top: '27px', width: '54px', height: '32px', borderRadius: '14px', background: '#17303e' }} />
                <div style={{ position: 'absolute', left: '24px', top: '38px', width: '7px', height: '14px', borderRadius: '999px', background: '#3df5de', boxShadow: '0 0 10px #3df5de' }} />
                <div style={{ position: 'absolute', right: '24px', top: '38px', width: '7px', height: '14px', borderRadius: '999px', background: '#3df5de', boxShadow: '0 0 10px #3df5de' }} />
                <div style={{ position: 'absolute', left: '37px', top: '-12px', width: '5px', height: '18px', borderRadius: '999px', background: '#91e6df' }} />
                <div style={{ position: 'absolute', left: '34px', top: '-19px', width: '11px', height: '11px', borderRadius: '50%', background: '#8ee8e0', boxShadow: '0 0 12px rgba(45,212,191,0.7)' }} />
                <div style={{ position: 'absolute', left: '31px', bottom: '-15px', width: '28px', height: '20px', borderRadius: '0 0 16px 16px', background: '#56d4cf' }} />
              </div>
              <div style={{ position: 'absolute', left: '82px', top: '76px', width: '64px', height: '64px', clipPath: 'polygon(50% 0%, 90% 20%, 90% 70%, 50% 100%, 10% 70%, 10% 20%)', background: 'linear-gradient(145deg, #72dece, #48cbbb)', opacity: 0.76 }}>
                <CheckCircle2 size={22} color="white" style={{ position: 'absolute', left: '21px', top: '20px' }} />
              </div>
            </div>

            <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '24px', alignItems: 'center' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '92px minmax(0, 1fr)', gap: '24px', alignItems: 'center' }}>
                <div style={{ width: '76px', height: '76px', borderRadius: '10px', background: 'linear-gradient(180deg, #93ead5, #71dccb)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 28px rgba(20,184,166,0.18)' }}>
                  <Bot size={48} color="#106b74" strokeWidth={1.8} />
                </div>
                <div>
                  <div style={{ fontSize: '30px', lineHeight: 1.15, fontWeight: 800, color: '#152032', letterSpacing: '0.04em' }}>
                    AI 自动审核
                  </div>
                  <div style={{ marginTop: '16px', fontSize: '15px', color: '#526075', lineHeight: 1.7 }}>
                    为内容审核提供自动判定，降低人工审核压力
                  </div>
                  <div style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '9px', padding: '7px 12px', borderRadius: '4px', background: 'rgba(255,255,255,0.74)', boxShadow: '0 6px 18px rgba(15,23,42,0.06)', color: '#0f8f76', fontSize: '13px', fontWeight: 600 }}>
                    <ShieldCheck size={16} />
                    已为您智能过滤大量风险内容
                  </div>
                </div>
              </div>

              <div style={{ minHeight: '82px', borderRadius: '8px', background: 'rgba(255,255,255,0.96)', border: '1px solid rgba(220,231,232,0.9)', boxShadow: '0 10px 28px rgba(15,23,42,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
                  <span style={{ fontSize: '17px', fontWeight: 700, color: '#1e293b' }}>自动审核</span>
                  <span style={{ fontSize: '16px', color: enabled ? '#00a870' : '#94a3b8', fontWeight: 700 }}>
                    {enabled ? '已启用' : '已禁用'}
                  </span>
                </div>
                <button type="button" aria-label="切换 AI 自动审核" onClick={onToggle} style={{ width: '58px', height: '34px', borderRadius: '999px', border: 'none', background: enabled ? '#00a870' : '#cbd5e1', position: 'relative', cursor: 'pointer', boxShadow: enabled ? '0 8px 18px rgba(0,168,112,0.26)' : 'none', transition: 'background 0.16s ease' }}>
                  <span style={{ position: 'absolute', top: '5px', left: enabled ? '29px' : '5px', width: '24px', height: '24px', borderRadius: '50%', background: '#fff', boxShadow: '0 2px 6px rgba(15,23,42,0.18)', transition: 'left 0.16s ease' }} />
                </button>
              </div>
            </div>
          </div>

          <div style={{ padding: '26px 28px 28px' }}>
            <div style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 14px 36px rgba(15,23,42,0.08)', padding: '24px 26px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingBottom: '18px', borderBottom: '1px solid #edf1f4' }}>
                <span style={{ width: '46px', height: '46px', borderRadius: '50%', background: '#eefbf7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#0f9b7a' }}>
                  <Target size={23} />
                </span>
                <span style={{ fontSize: '21px', fontWeight: 800, color: '#1f2937' }}>功能价值</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(300px, 0.9fr)', gap: '26px', padding: '22px 20px 24px' }}>
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '90px minmax(0, 1fr)', gap: '16px', alignItems: 'center', padding: '4px 0 24px', borderBottom: '1px dashed #e1e8ed' }}>
                    <span style={{ width: '66px', height: '66px', borderRadius: '50%', background: '#eefbf7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#0f9b7a' }}>
                      <FileCheck2 size={30} />
                    </span>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#05956f', marginBottom: '8px' }}>智能判定，准确高效</div>
                      <div style={{ fontSize: '13px', color: '#526075', lineHeight: 1.85 }}>
                        AI 自动审核会基于内容标题、正文合规性、任务要求匹配度与风险特征进行自动判定，提升审核效率与通过时效。
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '90px minmax(0, 1fr)', gap: '16px', alignItems: 'center', padding: '18px 0 0' }}>
                    <span style={{ width: '66px', height: '66px', borderRadius: '50%', background: '#eefbf7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#0f9b7a' }}>
                      <RefreshCw size={30} />
                    </span>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#05956f', marginBottom: '8px' }}>新提交智能处理</div>
                      <div style={{ fontSize: '13px', color: '#526075', lineHeight: 1.85 }}>
                        开启后系统将自动对新提交内容执行审核，审核结果会同步到内容审核列表。
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ borderLeft: '1px solid #edf1f4', paddingLeft: '26px', display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '100%', minHeight: '118px', borderRadius: '10px', border: '1px solid rgba(249,180,99,0.42)', background: '#fffaf3', display: 'grid', gridTemplateColumns: '80px minmax(0,1fr)', alignItems: 'center', gap: '10px', padding: '18px', boxSizing: 'border-box' }}>
                    <span style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fff0d9', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#f28c28' }}>
                      <Gift size={31} />
                    </span>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#b8551f', marginBottom: '10px' }}>付费功能</div>
                      <div style={{ fontSize: '13px', color: '#b8551f', lineHeight: 1.75 }}>
                        AI 自动审核为增值服务，开通后方可正式生效。
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '70px minmax(0, 1fr)', alignItems: 'center', gap: '14px', padding: '14px 18px', borderRadius: '8px', border: '1px solid #dbeeed', background: '#f6fcfb' }}>
                <span style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#effbf8', border: '1px solid #dbeeed', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#0f9b7a' }}>
                  <Lightbulb size={25} />
                </span>
                <div>
                  <div style={{ fontSize: '13px', color: '#087b67', fontWeight: 800, marginBottom: '5px' }}>温馨提示</div>
                  <div style={{ fontSize: '13px', color: '#526075', lineHeight: 1.75 }}>
                    建议开启自动审核，系统将持续学习优化，助力更精准的风险识别与高效审核体验。
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContentReview() {
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [page, setPage] = useState(1);
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [approveTarget, setApproveTarget] = useState<string | null>(null);
  const [reasonViewText, setReasonViewText] = useState<string | null>(null);
  const [aiReviewOpen, setAiReviewOpen] = useState(false);
  const [aiReviewEnabled, setAiReviewEnabled] = useState(false);
  const [taskIdQuery, setTaskIdQuery] = useState('');
  const [userPhoneQuery, setUserPhoneQuery] = useState('');
  const [publishStart, setPublishStart] = useState(''); // YYYY-MM-DD
  const [publishEnd, setPublishEnd] = useState(''); // YYYY-MM-DD

  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: '1',
      taskId: 'T-1001',
      userId: 'user123',
      userName: '小红薯ABC',
      userAvatar: AVATAR_COLORS[0],
      userPhone: '13800001111',
      taskName: '春季新品种草计划',
      platform: '小红书',
      contentUrl: 'https://xiaohongshu.com/explore/xxxx',
      contentTitle: '春季必买！这款新品真的太好用了！',
      contentPreview: '姐妹们，今天分享一款春季新品，用完之后皮肤状态真的好了很多，强烈推荐大家试试...',
      publishTime: '2026-04-16 21:05',
      submitTime: '2026-04-17 14:30',
      status: 'pending',
      likes: 125,
      comments: 23,
      collections: 31,
    },
    {
      id: '2',
      taskId: 'T-1001',
      userId: 'user456',
      userName: '美妆达人Lisa',
      userAvatar: AVATAR_COLORS[1],
      userPhone: '13900002222',
      taskName: '春季新品种草计划',
      platform: '小红书',
      contentUrl: 'https://xiaohongshu.com/explore/yyyy',
      contentTitle: '#春季新品 #品牌名 开箱测评来了',
      contentPreview: '收到品牌寄来的新品，迫不及待开箱！质地轻薄，上脸特别贴合...',
      publishTime: '2026-04-16 18:40',
      submitTime: '2026-04-17 13:15',
      status: 'pending',
      likes: 89,
      comments: 15,
      collections: 22,
    },
    {
      id: '3',
      taskId: 'T-1002',
      userId: 'user789',
      userName: '种草机器丫丫',
      userAvatar: AVATAR_COLORS[2],
      userPhone: '13700003333',
      taskName: '会员日专属福利',
      platform: '抖音',
      contentUrl: 'https://douyin.com/video/zzzz',
      contentTitle: '会员日福利来了！超多好物一站式分享',
      contentPreview: '今天是会员日，品牌有超多福利等着大家，所有产品打折...',
      publishTime: '2026-04-17 09:12',
      submitTime: '2026-04-17 12:00',
      status: 'approved',
      likes: 456,
      comments: 78,
      collections: 96,
    },
    {
      id: '4',
      taskId: 'T-1001',
      userId: 'user101',
      userName: '路人甲',
      userAvatar: AVATAR_COLORS[3],
      userPhone: '13600004444',
      taskName: '春季新品种草计划',
      platform: '小红书',
      contentUrl: 'https://xiaohongshu.com/explore/aaaa',
      contentTitle: '随便发个笔记',
      contentPreview: '今天天气不错，出去玩了一圈...',
      publishTime: '2026-04-17 08:06',
      submitTime: '2026-04-17 10:30',
      status: 'rejected',
      rejectReason: '内容未包含必须话题标签',
    },
    {
      id: '5',
      taskId: 'T-1003',
      userId: 'user202',
      userName: '时尚博主小K',
      userAvatar: AVATAR_COLORS[0],
      userPhone: '13500005555',
      taskName: '哔哩哔哩开箱挑战赛',
      platform: '哔哩哔哩',
      contentUrl: 'https://bilibili.com/video/xxxxx',
      contentTitle: '【开箱】新品体验 真实感受分享',
      contentPreview: '大家好，今天带来这次新品挑战赛开箱视频，整体体验感非常棒...',
      publishTime: '2026-04-15 20:30',
      submitTime: '2026-04-17 09:45',
      status: 'pending',
      likes: 234,
      comments: 42,
      collections: 57,
    },
    {
      id: '6',
      taskId: 'T-1004',
      userId: 'user303',
      userName: '阿泽同学',
      userAvatar: AVATAR_COLORS[1],
      userPhone: '13400006666',
      taskName: '会员福利体验分享',
      platform: '抖音',
      contentUrl: 'https://douyin.com/video/deleted-demo',
      contentTitle: '试用记录：会员权益真实反馈',
      contentPreview: '这条内容因用户主动删除，系统已同步为删除状态，保留审核记录供查询。',
      publishTime: '2026-04-14 10:26',
      submitTime: '2026-04-14 11:02',
      status: 'deleted',
      likes: 0,
      comments: 0,
      collections: 0,
    },
    {
      id: '7',
      taskId: 'T-1005',
      userId: 'user404',
      userName: '护肤笔记Mia',
      userAvatar: AVATAR_COLORS[2],
      userPhone: '13300007777',
      taskName: '夏季防晒种草挑战',
      platform: '小红书',
      contentUrl: 'https://xiaohongshu.com/explore/bbbb',
      contentTitle: '夏天真的离不开这支防晒',
      contentPreview: '连续用了两周，通勤和户外都很稳，成膜快也不闷...',
      publishTime: '2026-04-18 09:18',
      submitTime: '2026-04-18 12:03',
      status: 'pending',
      likes: 168,
      comments: 34,
      collections: 40,
    },
    {
      id: '8',
      taskId: 'T-1005',
      userId: 'user505',
      userName: '吃喝玩乐阿宁',
      userAvatar: AVATAR_COLORS[3],
      userPhone: '13200008888',
      taskName: '夏季防晒种草挑战',
      platform: '抖音',
      contentUrl: 'https://douyin.com/video/tttt',
      contentTitle: '防晒实测，通勤党可以直接抄作业',
      contentPreview: '今天测了三款热门防晒，最后留下这支，户外半天也没怎么晒黑...',
      publishTime: '2026-04-18 10:05',
      submitTime: '2026-04-18 12:20',
      status: 'pending',
      likes: 312,
      comments: 62,
      collections: 88,
    },
    {
      id: '9',
      taskId: 'T-1006',
      userId: 'user606',
      userName: '数码博主Rex',
      userAvatar: AVATAR_COLORS[0],
      userPhone: '13100009999',
      taskName: '智能小家电体验官',
      platform: '哔哩哔哩',
      contentUrl: 'https://bilibili.com/video/yyyya',
      contentTitle: '一周实测：这台小家电值不值得买',
      contentPreview: '从清洁效率、噪音到使用体验，我把真实感受都整理在视频里了...',
      publishTime: '2026-04-18 20:45',
      submitTime: '2026-04-18 21:10',
      status: 'approved',
      likes: 542,
      comments: 93,
      collections: 110,
    },
    {
      id: '10',
      taskId: 'T-1006',
      userId: 'user707',
      userName: '生活方式Lulu',
      userAvatar: AVATAR_COLORS[1],
      userPhone: '13000001110',
      taskName: '智能小家电体验官',
      platform: '小红书',
      contentUrl: 'https://xiaohongshu.com/explore/cccc',
      contentTitle: '真实测评，家里小空间也能用',
      contentPreview: '收纳、清洁、噪音都做了对比，给想入手的朋友一个参考...',
      publishTime: '2026-04-18 17:50',
      submitTime: '2026-04-18 19:05',
      status: 'pending',
      likes: 76,
      comments: 19,
      collections: 25,
    },
    {
      id: '11',
      taskId: 'T-1007',
      userId: 'user808',
      userName: '假日摄影师',
      userAvatar: AVATAR_COLORS[2],
      userPhone: '13000002220',
      taskName: '旅行好物分享季',
      platform: '抖音',
      contentUrl: 'https://douyin.com/video/uuuu',
      contentTitle: '出门旅行这几样真的很实用',
      contentPreview: '轻量、便携、收纳友好，是这次旅行最想推荐给大家的几样...',
      publishTime: '2026-04-18 15:20',
      submitTime: '2026-04-18 16:40',
      status: 'pending',
      likes: 201,
      comments: 27,
      collections: 58,
    },
    {
      id: '12',
      taskId: 'T-1007',
      userId: 'user909',
      userName: '奶茶研究所',
      userAvatar: AVATAR_COLORS[3],
      userPhone: '13000003330',
      taskName: '旅行好物分享季',
      platform: '小红书',
      contentUrl: 'https://xiaohongshu.com/explore/dddd',
      contentTitle: '拍照、收纳两不误的旅行好物',
      contentPreview: '从出发前整理到旅途中使用，整体体验都很顺手...',
      publishTime: '2026-04-18 16:00',
      submitTime: '2026-04-18 18:15',
      status: 'pending',
      likes: 148,
      comments: 31,
      collections: 46,
    },
    {
      id: '13',
      taskId: 'T-1008',
      userId: 'user010',
      userName: '城市漫游者',
      userAvatar: AVATAR_COLORS[0],
      userPhone: '13000004440',
      taskName: '城市探店打卡计划',
      platform: '哔哩哔哩',
      contentUrl: 'https://bilibili.com/video/zzzza',
      contentTitle: '周末探店合集，真的不踩雷',
      contentPreview: '这次挑了三家口碑店铺，整体体验都挺不错...',
      publishTime: '2026-04-18 13:25',
      submitTime: '2026-04-18 14:00',
      status: 'rejected',
      rejectReason: '内容与任务无关',
    },
    {
      id: '14',
      taskId: 'T-1008',
      userId: 'user111',
      userName: '晚睡选手',
      userAvatar: AVATAR_COLORS[1],
      userPhone: '13000005550',
      taskName: '城市探店打卡计划',
      platform: '抖音',
      contentUrl: 'https://douyin.com/video/vvvv',
      contentTitle: '探店记录：一口气逛完三家',
      contentPreview: '拍了不少现场素材，最后选了一版最完整的分享...',
      publishTime: '2026-04-18 11:10',
      submitTime: '2026-04-18 12:22',
      status: 'pending',
      likes: 64,
      comments: 11,
      collections: 18,
    },
    {
      id: '15',
      taskId: 'T-1009',
      userId: 'user222',
      userName: '微醺日记',
      userAvatar: AVATAR_COLORS[2],
      userPhone: '13000006660',
      taskName: '新品试用反馈收集',
      platform: '小红书',
      contentUrl: 'https://xiaohongshu.com/explore/eeee',
      contentTitle: '新品试用两天后的真实反馈',
      contentPreview: '从包装、气味到使用感，我都尽量记录得比较细...',
      publishTime: '2026-04-18 09:40',
      submitTime: '2026-04-18 10:08',
      status: 'approved',
      likes: 89,
      comments: 16,
      collections: 21,
    },
    {
      id: '16',
      taskId: 'T-1009',
      userId: 'user333',
      userName: '海边的猫',
      userAvatar: AVATAR_COLORS[3],
      userPhone: '13000007770',
      taskName: '新品试用反馈收集',
      platform: '抖音',
      contentUrl: 'https://douyin.com/video/wwww',
      contentTitle: '分享一下这次试用的真实感受',
      contentPreview: '把好用和不好用的地方都说清楚了，方便大家参考...',
      publishTime: '2026-04-18 08:55',
      submitTime: '2026-04-18 09:30',
      status: 'deleted',
      likes: 0,
      comments: 0,
      collections: 0,
    },
  ]);

  const handleApprove = (id: string) => {
    setSubmissions((s) =>
      s.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'approved' as const,
              reviewedBy: REVIEWERS[(parseInt(id, 10) || 1) % REVIEWERS.length],
              reviewedAt: new Date().toLocaleString('zh-CN', { hour12: false }),
            }
          : item
      )
    );
  };

  const handleApproveConfirm = () => {
    if (!approveTarget) return;
    handleApprove(approveTarget);
    setApproveTarget(null);
  };

  const handleRejectConfirm = (reason: string) => {
    if (!rejectTarget) return;
    setSubmissions((s) =>
      s.map((item) =>
        item.id === rejectTarget
          ? {
              ...item,
              status: 'rejected' as const,
              rejectReason: reason,
              reviewedBy: REVIEWERS[(parseInt(item.id, 10) || 1) % REVIEWERS.length],
              reviewedAt: new Date().toLocaleString('zh-CN', { hour12: false }),
            }
          : item
      )
    );
    setRejectTarget(null);
  };

  const filteredSubmissions = submissions.filter((s) => {
    const matchesFilter = s.status === filter;

    const taskIdQ = taskIdQuery.trim().toLowerCase();
    const phoneQ = userPhoneQuery.trim().toLowerCase();

    const matchesTaskId =
      !taskIdQ || s.taskId.toLowerCase().includes(taskIdQ);
    const matchesPhone =
      !phoneQ || s.userPhone.toLowerCase().includes(phoneQ);

    const publishDate = parseYMD(toYMD(s.publishTime));
    const start = parseYMD(publishStart);
    const end = parseYMD(publishEnd);
    const matchesPublishRange =
      (!start && !end) ||
      (publishDate &&
        (!start || publishDate >= start) &&
        (!end || publishDate <= end));

    return (
      matchesFilter &&
      matchesTaskId &&
      matchesPhone &&
      matchesPublishRange
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredSubmissions.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedSubmissions = filteredSubmissions.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const stats = {
    pending: submissions.filter((s) => s.status === 'pending').length,
    approved: submissions.filter((s) => s.status === 'approved').length,
    rejected: submissions.filter((s) => s.status === 'rejected').length,
  };

  const filterTabs = [
    { value: 'pending' as const, label: '待审核', count: stats.pending },
    { value: 'approved' as const, label: '已通过', count: stats.approved },
    { value: 'rejected' as const, label: '已拒绝', count: stats.rejected },
  ];
  const showReviewerColumn = filter === 'approved' || filter === 'rejected';
  const approveSubmission = approveTarget
    ? submissions.find((item) => item.id === approveTarget) || null
    : null;
  const rejectSubmission = rejectTarget
    ? submissions.find((item) => item.id === rejectTarget) || null
    : null;

  return (
    <div style={{ padding: '24px' }}>
      {approveTarget && approveSubmission && (
        <ApproveModal
          submission={approveSubmission}
          onConfirm={handleApproveConfirm}
          onCancel={() => setApproveTarget(null)}
        />
      )}
      {reasonViewText && (
        <RejectReasonModal
          reason={reasonViewText}
          onClose={() => setReasonViewText(null)}
        />
      )}
      {rejectTarget && rejectSubmission && (
        <RejectModal
          submission={rejectSubmission}
          onConfirm={handleRejectConfirm}
          onCancel={() => setRejectTarget(null)}
        />
      )}
      {aiReviewOpen && (
        <AiAutoReviewModal
          enabled={aiReviewEnabled}
          onToggle={() => setAiReviewEnabled((current) => !current)}
          onClose={() => setAiReviewOpen(false)}
        />
      )}

      {/* Extra Filters (TaskList Style) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          padding: '14px 20px',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--muted)',
          marginBottom: '12px',
        }}
      >
        {/* Task ID */}
        <div style={{ position: 'relative' }}>
          <input
            value={taskIdQuery}
            onChange={(e) => {
              setTaskIdQuery(e.target.value);
              setPage(1);
            }}
            placeholder="请输入任务ID"
            style={{
              height: '34px',
              width: '190px',
              padding: '0 10px 0 76px',
              fontSize: 'var(--text-base)',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--foreground)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <span
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 'var(--text-base)',
              color: 'var(--muted-foreground)',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            所属任务：
          </span>
        </div>

        {/* Phone */}
        <div style={{ position: 'relative' }}>
          <input
            value={userPhoneQuery}
            onChange={(e) => {
              setUserPhoneQuery(e.target.value);
              setPage(1);
            }}
            placeholder="请输入"
            style={{
              height: '34px',
              width: '210px',
              padding: '0 10px 0 92px',
              fontSize: 'var(--text-base)',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--foreground)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <span
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 'var(--text-base)',
              color: 'var(--muted-foreground)',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            用户手机号：
          </span>
        </div>

        {/* Publish time range */}
        <div
          style={{
            height: '34px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '0 10px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            boxSizing: 'border-box',
          }}
        >
          <span style={{ fontSize: 'var(--text-base)', color: 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>发布时间：</span>
          <input
            type="date"
            value={publishStart}
            onChange={(e) => {
              setPublishStart(e.target.value);
              setPage(1);
            }}
            style={{
              height: '24px',
              border: 'none',
              background: 'transparent',
              fontSize: 'var(--text-base)',
              color: publishStart ? 'var(--foreground)' : 'var(--muted-foreground)',
              outline: 'none',
            }}
          />
          <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-base)' }}>~</span>
          <input
            type="date"
            value={publishEnd}
            onChange={(e) => {
              setPublishEnd(e.target.value);
              setPage(1);
            }}
            style={{
              height: '24px',
              border: 'none',
              background: 'transparent',
              fontSize: 'var(--text-base)',
              color: publishEnd ? 'var(--foreground)' : 'var(--muted-foreground)',
              outline: 'none',
            }}
          />
        </div>

        {(taskIdQuery || userPhoneQuery || publishStart || publishEnd) && (
          <button
            onClick={() => {
              setTaskIdQuery('');
              setUserPhoneQuery('');
              setPublishStart('');
              setPublishEnd('');
              setPage(1);
            }}
            style={{
              height: '34px',
              padding: '0 12px',
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontSize: 'var(--text-base)',
              color: 'var(--muted-foreground)',
              whiteSpace: 'nowrap',
            }}
          >
            清空筛选
          </button>
        )}

        <button
          type="button"
          onClick={() => setAiReviewOpen(true)}
          style={{
            marginLeft: 'auto',
            height: '34px',
            padding: '0 16px',
            border: 'none',
            borderRadius: 'var(--radius)',
            background: 'rgba(0,168,112,1)',
            color: '#fff',
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-weight-semibold)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            boxShadow: '0 8px 18px rgba(0,168,112,0.22)',
          }}
        >
          AI 自动审核
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 20px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          boxShadow: 'var(--elevation-sm)',
          gap: '16px',
        }}
      >
        {/* Filter Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '2px',
            background: 'var(--muted)',
            borderRadius: 'var(--radius)',
            padding: '3px',
          }}
        >
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setFilter(tab.value);
                setPage(1);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 14px',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontSize: 'var(--text-base)',
                fontWeight:
                  filter === tab.value
                    ? 'var(--font-weight-medium)'
                    : 'var(--font-weight-normal)',
                background:
                  filter === tab.value ? 'rgba(36,116,255,0.1)' : 'transparent',
                border:
                  filter === tab.value
                    ? '1px solid rgba(36,116,255,0.28)'
                    : '1px solid transparent',
                color:
                  filter === tab.value
                    ? 'var(--primary)'
                    : 'var(--card-foreground)',
                boxShadow: 'none',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
              <span
                style={{
                  fontSize: '11px',
                  background:
                    filter === tab.value
                      ? 'rgba(36,116,255,0.14)'
                      : 'transparent',
                  color:
                    filter === tab.value
                      ? 'var(--primary)'
                      : 'var(--card-foreground)',
                  padding: '1px 5px',
                  borderRadius: '100px',
                  minWidth: '18px',
                  textAlign: 'center',
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Submissions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredSubmissions.length > 0 && (
          <div
            style={{
              background: 'var(--muted)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
            }}
          >
            {[
              { label: '用户', minWidth: '140px' },
              { label: '内容标题', flex: 1 },
              { label: '提交时间', minWidth: '150px' },
              { label: '审核状态', minWidth: '96px' },
              { label: '平台', minWidth: '72px' },
              ...(showReviewerColumn ? [{ label: '审核人', minWidth: '180px' }] : []),
              { label: '操作', minWidth: '250px' },
            ].map((col) => (
              <div
                key={col.label}
                style={{
                  minWidth: col.minWidth,
                  flex: col.flex,
                  fontSize: '12px',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--foreground)',
                  whiteSpace: 'nowrap',
                }}
              >
                {col.label}
              </div>
            ))}
          </div>
        )}

        {filteredSubmissions.length === 0 ? (
          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '60px 24px',
              textAlign: 'center',
              boxShadow: 'var(--elevation-sm)',
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
            <div
              style={{
                fontSize: 'var(--text-h4)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--foreground)',
                marginBottom: '4px',
              }}
            >
              暂无符合条件的记录
            </div>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--muted-foreground)', margin: 0 }}>
              尝试切换筛选条件或清空搜索关键词
            </p>
          </div>
        ) : (
          pagedSubmissions.map((submission) => {
            const st = STATUS_MAP[submission.status];
            const avatarIndex = parseInt(submission.userId.replace('user', '')) % AVATAR_COLORS.length;

            return (
              <div
                key={submission.id}
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  boxShadow: 'var(--elevation-sm)',
                  transition: 'box-shadow 0.15s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow = 'var(--elevation-sm)')
                }
              >
                <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
                  {/* Avatar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, minWidth: '140px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: AVATAR_COLORS[avatarIndex],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '15px',
                        fontWeight: 'var(--font-weight-semibold)',
                        flexShrink: 0,
                      }}
                    >
                      {submission.userName.charAt(0)}
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--foreground)',
                        lineHeight: '1.3',
                      }}
                    >
                      {submission.userName}
                    </div>
                  </div>

                  {/* Main Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Top Row */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: submission.rejectReason ? '12px' : '0',
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 'var(--text-h4)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--foreground)',
                            marginBottom: '5px',
                            lineHeight: '1.4',
                          }}
                        >
                          {submission.contentTitle}
                        </div>
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '11px',
                            background: 'rgba(24,144,255,0.08)',
                            color: 'var(--accent)',
                            padding: '2px 8px',
                            borderRadius: 'var(--radius)',
                          }}
                        >
                          {formatTaskId(submission.taskId)}：{submission.taskName}
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Submit Time Column */}
                  <div
                    style={{
                      minWidth: '150px',
                      display: 'flex',
                      alignItems: 'center',
                      color: 'var(--muted-foreground)',
                      fontSize: '12px',
                      flexShrink: 0,
                    }}
                  >
                    {submission.submitTime}
                  </div>

                  {/* Status Column */}
                  <div
                    style={{
                      minWidth: '96px',
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 10px',
                        borderRadius: '100px',
                        fontSize: '12px',
                        fontWeight: 'var(--font-weight-medium)',
                        background: st.bg,
                        color: st.color,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          background: st.color,
                        }}
                      />
                      {st.label}
                    </span>
                  </div>

                  {/* Platform Column */}
                  <div
                    style={{
                      minWidth: '72px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                      gap: '6px',
                      flexShrink: 0,
                      marginLeft: '6px',
                    }}
                  >
                    <PlatformBadge platform={submission.platform} size={12} />
                  </div>

                  {showReviewerColumn && (
                    <div
                      style={{
                        minWidth: '180px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        gap: '2px',
                        color: 'var(--muted-foreground)',
                        fontSize: '12px',
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ color: 'var(--foreground)' }}>{submission.reviewedBy || '系统审核员'}</span>
                      <span>{submission.reviewedAt || submission.submitTime}</span>
                    </div>
                  )}

                  {/* Actions Column */}
                  <div
                    style={{
                      minWidth: '250px',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '8px',
                      flexWrap: 'wrap',
                      flexShrink: 0,
                      marginLeft: '6px',
                    }}
                  >
                    <a
                      href={submission.contentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px',
                        padding: '7px 12px',
                        background: 'var(--muted)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        textDecoration: 'none',
                        fontSize: '12px',
                        color: 'var(--foreground)',
                        fontWeight: 'var(--font-weight-medium)',
                        transition: 'background 0.15s',
                      }}
                    >
                      <ExternalLink size={13} />
                      查看内容
                    </a>

                    {submission.status === 'rejected' && submission.rejectReason && (
                      <button
                        type="button"
                        onClick={() => setReasonViewText(submission.rejectReason || '')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px',
                          padding: '7px 12px',
                          background: 'rgba(255,77,79,0.08)',
                          border: '1px solid rgba(255,77,79,0.3)',
                          borderRadius: 'var(--radius)',
                          cursor: 'pointer',
                          fontSize: '12px',
                          color: 'var(--destructive)',
                          fontWeight: 'var(--font-weight-medium)',
                        }}
                      >
                        查看原因
                      </button>
                    )}

                    {submission.status === 'pending' && (
                      <>
                        <button
                          onClick={() => setApproveTarget(submission.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px',
                            padding: '7px 12px',
                            background: 'rgba(82,196,26,1)',
                            border: 'none',
                            borderRadius: 'var(--radius)',
                            cursor: 'pointer',
                            fontSize: '12px',
                            color: 'white',
                            fontWeight: 'var(--font-weight-medium)',
                          }}
                        >
                          <Check size={13} strokeWidth={2.5} />
                          通过
                        </button>
                        <button
                          onClick={() => setRejectTarget(submission.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px',
                            padding: '7px 12px',
                            background: 'rgba(255,77,79,0.08)',
                            border: '1px solid rgba(255,77,79,0.3)',
                            borderRadius: 'var(--radius)',
                            cursor: 'pointer',
                            fontSize: '12px',
                            color: 'var(--destructive)',
                            fontWeight: 'var(--font-weight-medium)',
                          }}
                        >
                          <X size={13} strokeWidth={2.5} />
                          拒绝
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {filteredSubmissions.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              padding: '6px 2px 0',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
              共 {filteredSubmissions.length} 条，当前第 {safePage} / {totalPages} 页
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                style={{
                  height: '30px',
                  padding: '0 12px',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  background: safePage <= 1 ? 'var(--muted)' : 'var(--card)',
                  color: safePage <= 1 ? 'var(--muted-foreground)' : 'var(--foreground)',
                  cursor: safePage <= 1 ? 'not-allowed' : 'pointer',
                }}
              >
                上一页
              </button>
              <div
                style={{
                  height: '30px',
                  minWidth: '30px',
                  padding: '0 10px',
                  borderRadius: 'var(--radius)',
                  border: '1px solid rgba(36,116,255,0.25)',
                  background: 'rgba(36,116,255,0.08)',
                  color: 'var(--primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                {safePage}
              </div>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                style={{
                  height: '30px',
                  padding: '0 12px',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  background: safePage >= totalPages ? 'var(--muted)' : 'var(--card)',
                  color: safePage >= totalPages ? 'var(--muted-foreground)' : 'var(--foreground)',
                  cursor: safePage >= totalPages ? 'not-allowed' : 'pointer',
                }}
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
