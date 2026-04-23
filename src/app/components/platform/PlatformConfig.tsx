import { useState } from 'react';
import {
  Plus,
  Edit2,
  X,
  Save,
  ToggleLeft,
  ToggleRight,
  Eye,
  ChevronRight,
  Bot,
  CheckCircle2,
  FileCheck2,
  Gift,
  Lightbulb,
  RefreshCw,
  ShieldCheck,
  Target,
} from 'lucide-react';
import { PlatformBadge } from './PlatformBadge';

/* ─── Types ────────────────────────────────────────────────────────────────── */

type FieldType = 'text' | 'number' | 'url' | 'select' | 'image' | 'textarea';

interface FieldOption {
  id: string;
  label: string;
}

interface FieldConfig {
  id: string;
  label: string;
  key: string;
  type: FieldType;
  required: boolean;
  placeholder: string;
  hint: string;
  options: FieldOption[];
  enabled: boolean;
  system: boolean;
}

interface PlatformData {
  id: string;
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
  enabled: boolean;
  minFollowers: number;
  minWorks: number;
  fields: FieldConfig[];
}

interface AiReviewConfig {
  enabled: boolean;
}

/* ─── Initial data ─────────────────────────────────────────────────────────── */

function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

const INITIAL_PLATFORMS: PlatformData[] = [
  {
    id: 'xiaohongshu',
    name: '小红书', emoji: '📕', color: '#FF385C', bgColor: 'rgba(255,56,92,0.08)',
    enabled: true, minFollowers: 1000, minWorks: 5,
    fields: [
      { id: 'f1', label: '账号昵称', key: 'accountName', type: 'text', required: true, placeholder: '请输入小红书账号昵称', hint: '与小红书实际昵称保持一致', options: [], enabled: true, system: true },
      { id: 'f2', label: '账号 ID', key: 'accountId', type: 'text', required: true, placeholder: '小红书个人主页中的账号ID', hint: '点击主页头像下方的 ID 复制', options: [], enabled: true, system: true },
      { id: 'f3', label: '主页链接', key: 'profileUrl', type: 'url', required: true, placeholder: 'https://www.xiaohongshu.com/user/profile/...', hint: '复制浏览器地址栏中的完整链接', options: [], enabled: true, system: true },
      { id: 'f5', label: '账号截图', key: 'screenshot', type: 'image', required: true, placeholder: '', hint: '上传账号主页截图，需清晰显示粉丝数', options: [], enabled: true, system: false },
    ],
  },
  {
    id: 'douyin',
    name: '抖音', emoji: '🎵', color: '#161823', bgColor: 'rgba(22,24,35,0.06)',
    enabled: true, minFollowers: 2000, minWorks: 10,
    fields: [
      { id: 'f1', label: '抖音号', key: 'douyinId', type: 'text', required: true, placeholder: '请输入抖音号（字母+数字）', hint: '在「我」页面→编辑资料中查看抖音号', options: [], enabled: true, system: true },
      { id: 'f2', label: '账号昵称', key: 'accountName', type: 'text', required: true, placeholder: '请输入抖音昵称', hint: '', options: [], enabled: true, system: true },
      { id: 'f3', label: '主页链接', key: 'profileUrl', type: 'url', required: true, placeholder: 'https://www.douyin.com/user/...', hint: '', options: [], enabled: true, system: true },
      { id: 'f5', label: '账号截图', key: 'screenshot', type: 'image', required: true, placeholder: '', hint: '上传账号主页截图，需清晰显示粉丝数', options: [], enabled: true, system: false },
    ],
  },
  {
    id: 'bilibili',
    name: '哔哩哔哩', emoji: '📺', color: '#00A1D6', bgColor: 'rgba(0,161,214,0.08)',
    enabled: true, minFollowers: 500, minWorks: 3,
    fields: [
      { id: 'f1', label: 'UID', key: 'uid', type: 'number', required: true, placeholder: '请输入哔哩哔哩 UID（纯数字）', hint: '在个人空间页面 URL 中查看', options: [], enabled: true, system: true },
      { id: 'f2', label: '用户名', key: 'accountName', type: 'text', required: true, placeholder: '请输入哔哩哔哩用户名', hint: '', options: [], enabled: true, system: true },
      { id: 'f3', label: '主页链接', key: 'profileUrl', type: 'url', required: true, placeholder: 'https://space.bilibili.com/...', hint: '', options: [], enabled: true, system: true },
      { id: 'f4', label: '账号截图', key: 'screenshot', type: 'image', required: false, placeholder: '', hint: '上传个人空间截图（可选）', options: [], enabled: true, system: false },
    ],
  },
  {
    id: 'weibo',
    name: '微博', emoji: '🐦', color: '#E6162D', bgColor: 'rgba(230,22,45,0.08)',
    enabled: true, minFollowers: 1000, minWorks: 5,
    fields: [
      { id: 'f1', label: '微博昵称', key: 'accountName', type: 'text', required: true, placeholder: '请输入微博昵称', hint: '与微博主页昵称保持一致', options: [], enabled: true, system: true },
      { id: 'f2', label: '微博UID', key: 'uid', type: 'text', required: true, placeholder: '请输入微博UID', hint: '可在微博个人主页链接中查看', options: [], enabled: true, system: true },
      { id: 'f3', label: '主页链接', key: 'profileUrl', type: 'url', required: true, placeholder: 'https://weibo.com/u/...', hint: '填写完整微博主页链接', options: [], enabled: true, system: true },
      { id: 'f4', label: '粉丝数量', key: 'followers', type: 'number', required: true, placeholder: '请填写当前粉丝数', hint: '填写整数，系统将进行门槛验证', options: [], enabled: true, system: true },
      { id: 'f5', label: '账号截图', key: 'screenshot', type: 'image', required: true, placeholder: '', hint: '上传微博主页截图，需清晰显示粉丝数', options: [], enabled: true, system: false },
    ],
  },
];

const INITIAL_AI_REVIEW_CONFIG: AiReviewConfig = {
  enabled: false,
};

/* ─── Constants ────────────────────────────────────────────────────────────── */

/* ─── Field Editor Modal ───────────────────────────────────────────────────── */

interface FieldEditorProps {
  field: FieldConfig | null;
  isNew: boolean;
  onSave: (field: FieldConfig) => void;
  onClose: () => void;
}

function FieldEditor({ field, isNew, onSave, onClose }: FieldEditorProps) {
  const blank: FieldConfig = {
    id: makeId(), label: '', key: '', type: 'text',
    required: false, placeholder: '', hint: '',
    options: [], enabled: true, system: false,
  };
  const [form, setForm] = useState<FieldConfig>(field ?? blank);
  const [newOption, setNewOption] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof FieldConfig>(k: K, v: FieldConfig[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const autoKey = (label: string) =>
    label.toLowerCase().replace(/\s+/g, '_').replace(/[^\w]/g, '');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.label.trim()) e.label = '请填写字段名称';
    if (form.type === 'select' && form.options.length === 0) e.options = '至少添加一个选项';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (validate()) onSave(form);
  };

  const addOption = () => {
    if (newOption.trim()) {
      set('options', [...form.options, { id: makeId(), label: newOption.trim() }]);
      setNewOption('');
    }
  };

  const removeOption = (id: string) =>
    set('options', form.options.filter((o) => o.id !== id));

  const inputStyle: React.CSSProperties = {
    width: '100%', height: '36px', padding: '0 10px',
    background: 'var(--input-background)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', fontSize: 'var(--text-base)',
    color: 'var(--foreground)', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: '12px', fontWeight: 'var(--font-weight-medium)',
    color: 'var(--foreground)', marginBottom: '5px', display: 'block',
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: 'var(--card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: '0 24px 64px rgba(0,0,0,0.18)', width: '100%', maxWidth: '520px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
            {isNew ? '添加字段' : '编辑字段'}
          </div>
          <button onClick={onClose} style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--muted)', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer', color: 'rgba(107,114,128,1)' }}>
            <X size={13} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '22px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Label */}
          <div>
            <label style={labelStyle}>
              字段名称 <span style={{ color: 'rgba(255,77,79,1)' }}>*</span>
            </label>
            <div
              style={{
                padding: '2px 0 0',
                color: 'var(--foreground)',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-semibold)',
                lineHeight: '1.5',
              }}
            >
              {form.label || '未命名字段'}
            </div>
            {errors.label && <div style={{ fontSize: '11px', color: 'rgba(255,77,79,1)', marginTop: '3px' }}>{errors.label}</div>}
          </div>

          {/* Placeholder */}
          {form.type !== 'image' && form.type !== 'select' && (
            <div>
              <label style={labelStyle}>占位提示文字</label>
              <input value={form.placeholder} onChange={(e) => set('placeholder', e.target.value)} placeholder="用户填写时看到的提示" style={inputStyle} />
            </div>
          )}

          {/* Hint */}
          <div>
            <label style={labelStyle}>帮助说明</label>
            <input value={form.hint} onChange={(e) => set('hint', e.target.value)} placeholder="显示在字段下方的补充说明（可选）" style={inputStyle} />
          </div>

          {/* Options for select */}
          {form.type === 'select' && (
            <div>
              <label style={labelStyle}>选项列表 <span style={{ color: 'rgba(255,77,79,1)' }}>*</span></label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
                {form.options.map((opt) => (
                  <div key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 10px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                    <span style={{ flex: 1, fontSize: 'var(--text-base)', color: 'var(--foreground)' }}>{opt.label}</span>
                    <button onClick={() => removeOption(opt.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(107,114,128,1)', padding: '0', display: 'flex' }}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {form.options.length === 0 && (
                  <div style={{ fontSize: '12px', color: 'rgba(107,114,128,1)', padding: '8px 0' }}>暂无选项，请添加</div>
                )}
              </div>
              {errors.options && <div style={{ fontSize: '11px', color: 'rgba(255,77,79,1)', marginBottom: '6px' }}>{errors.options}</div>}
              <div style={{ display: 'flex', gap: '6px' }}>
                <input value={newOption} onChange={(e) => setNewOption(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addOption()}
                  placeholder="输入选项名称后按 Enter 或点击添加"
                  style={{ ...inputStyle, flex: 1 }} />
                <button onClick={addOption} style={{ padding: '0 14px', height: '36px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--card)', fontSize: '12px', cursor: 'pointer', color: 'var(--foreground)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Plus size={13} />添加
                </button>
              </div>
            </div>
          )}

          {/* Required toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>必填字段</div>
              <div style={{ fontSize: '12px', color: 'rgba(107,114,128,1)', marginTop: '1px' }}>开启后用户必须填写此字段才能提交</div>
            </div>
            <button type="button" onClick={() => set('required', !form.required)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              {form.required
                ? <ToggleRight size={32} style={{ color: 'var(--primary)' }} />
                : <ToggleLeft  size={32} style={{ color: 'rgba(107,114,128,1)' }} />}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 22px', borderTop: '1px solid var(--border)', background: 'var(--muted)', display: 'flex', justifyContent: 'flex-end', gap: '8px', flexShrink: 0 }}>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--card)', fontSize: 'var(--text-base)', cursor: 'pointer', color: 'var(--foreground)' }}>
            取消
          </button>
          <button onClick={handleSave} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '8px 18px', borderRadius: 'var(--radius)', border: 'none', background: 'var(--primary)', fontSize: 'var(--text-base)', cursor: 'pointer', color: 'var(--primary-foreground)', fontWeight: 'var(--font-weight-medium)' }}>
            <Save size={13} />{isNew ? '添加字段' : '保存修改'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Form Preview ─────────────────────────────────────────────────────────── */

function FormPreview({ platform }: { platform: PlatformData }) {
  const pc = { color: platform.color, bg: platform.bgColor };

  const renderFieldPreview = (f: FieldConfig) => {
    const disabledStyle = f.enabled ? undefined : { opacity: 0.5, filter: 'saturate(0.85)' };

    return (
      <div
        key={f.id}
        style={{
          padding: '12px',
          borderRadius: '22px',
          background: f.enabled ? 'rgba(255,255,255,0.94)' : 'rgba(250,250,252,0.78)',
          border: '1px solid rgba(226,232,240,0.92)',
          boxShadow: '0 10px 24px rgba(15,23,42,0.06)',
          ...disabledStyle,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#1f2937', letterSpacing: '-0.01em' }}>{f.label}</span>
          {f.required && <span style={{ fontSize: '11px', color: '#ef4444', lineHeight: 1 }}>*</span>}
          {!f.enabled && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '2px 7px',
                borderRadius: '999px',
                background: 'rgba(229,231,235,0.95)',
                border: '1px solid rgba(209,213,219,0.9)',
                fontSize: '10px',
                color: '#6b7280',
                marginLeft: 'auto',
              }}
            >
              已关闭
            </span>
          )}
        </div>

        {f.type === 'text' && (
          <div
            style={{
              height: '42px',
              borderRadius: '14px',
              border: '1px solid rgba(226,232,240,0.95)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,250,252,0.98))',
              display: 'flex',
              alignItems: 'center',
              padding: '0 14px',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
            }}
          >
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>{f.placeholder || `请输入${f.label}`}</span>
          </div>
        )}

        {f.type === 'number' && (
          <div
            style={{
              height: '42px',
              borderRadius: '14px',
              border: '1px solid rgba(226,232,240,0.95)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,250,252,0.98))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 14px',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
            }}
          >
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>{f.placeholder || '请输入数字'}</span>
            <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 0.8, fontSize: '10px', color: '#c4c9d4' }}>
              <span>▴</span>
              <span style={{ marginTop: '-1px' }}>▾</span>
            </span>
          </div>
        )}

        {f.type === 'url' && (
          <div
            style={{
              height: '42px',
              borderRadius: '14px',
              border: '1px solid rgba(226,232,240,0.95)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,250,252,0.98))',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0 14px',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
            }}
          >
            <span style={{ fontSize: '12px' }}>🔗</span>
            <span style={{ fontSize: '12px', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.placeholder || 'https://'}</span>
          </div>
        )}

        {f.type === 'textarea' && (
          <div
            style={{
              minHeight: '74px',
              borderRadius: '16px',
              border: '1px solid rgba(226,232,240,0.95)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,250,252,0.98))',
              padding: '12px 14px',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
            }}
          >
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>{f.placeholder || `请输入${f.label}`}</span>
          </div>
        )}

        {f.type === 'select' && (
          <div
            style={{
              height: '42px',
              borderRadius: '14px',
              border: '1px solid rgba(226,232,240,0.95)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,250,252,0.98))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 14px',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
            }}
          >
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>请选择</span>
            <span style={{ fontSize: '12px', color: '#c4c9d4' }}>▾</span>
          </div>
        )}

        {f.type === 'image' && (
          <div
            style={{
              minHeight: '92px',
              borderRadius: '18px',
              border: '1.5px dashed rgba(203,213,225,0.95)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(248,250,252,0.96))',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '999px',
                background: 'rgba(59,130,246,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3b82f6',
                fontSize: '18px',
              }}
            >
              🖼
            </div>
            <span style={{ fontSize: '11px', color: '#6b7280' }}>点击或拖拽上传图片</span>
          </div>
        )}

        {f.hint && (
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px', lineHeight: 1.45 }}>
            {f.hint}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '6px 0 6px',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 'min(100%, 398px)',
          aspectRatio: '390 / 844',
          borderRadius: '40px',
          background: 'linear-gradient(180deg, #121926 0%, #0f1724 100%)',
          padding: '8px',
          boxShadow: '0 24px 48px rgba(15, 23, 42, 0.22)',
          overflow: 'visible',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '-2px',
            top: '104px',
            width: '4px',
            height: '108px',
            borderRadius: '999px',
            background: 'linear-gradient(180deg, #0f1724 0%, #1e293b 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '-2px',
            top: '228px',
            width: '4px',
            height: '74px',
            borderRadius: '999px',
            background: 'linear-gradient(180deg, #0f1724 0%, #1e293b 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '-2px',
            top: '136px',
            width: '4px',
            height: '90px',
            borderRadius: '999px',
            background: 'linear-gradient(180deg, #0f1724 0%, #1e293b 100%)',
          }}
        />

        <div
          style={{
            height: '100%',
            borderRadius: '33px',
            background: 'linear-gradient(180deg, #f6f8fc 0%, #edf1f7 100%)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              height: '32px',
              padding: '10px 18px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#0f172a',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '-0.01em',
            }}
          >
            <span>9:41</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0f172a' }}>
              <span style={{ fontSize: '10px' }}>◔</span>
              <span style={{ fontSize: '10px' }}>◔</span>
              <span style={{ fontSize: '10px' }}>▮▮▮</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '8px' }}>
            <div
              style={{
                width: '124px',
                height: '30px',
                borderRadius: '999px',
                background: '#1f2a44',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '17px',
                  top: '50%',
                  width: '9px',
                  height: '9px',
                  marginTop: '-4.5px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.12)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: '18px',
                  top: '50%',
                  width: '42px',
                  height: '5px',
                  marginTop: '-2.5px',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.14)',
                }}
              />
            </div>
          </div>

          <div
            style={{
              padding: '12px 18px 14px',
              borderBottom: '1px solid rgba(226,232,240,0.95)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.86), rgba(248,250,252,0.92))',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <PlatformBadge platform={platform.name} size={11} style={{ padding: '2px 8px 2px 3px', fontSize: '10px' }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
                  账号认证
                </div>
                <div style={{ marginTop: '4px', fontSize: '11px', color: '#64748b', lineHeight: 1.35 }}>
                  请填写以下信息完成账号绑定
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              overflow: 'auto',
              padding: '14px 14px 18px',
              background: 'linear-gradient(180deg, rgba(248,250,252,0.96), rgba(241,245,249,0.96))',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {platform.fields.map(renderFieldPreview)}
            </div>
          </div>

          <div
            style={{
              padding: '12px 16px 18px',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.94), rgba(249,250,251,0.98))',
              borderTop: '1px solid rgba(226,232,240,0.95)',
            }}
          >
            <div
              style={{
                height: '44px',
                borderRadius: '16px',
                background: `linear-gradient(180deg, ${platform.color}, color-mix(in oklab, ${platform.color} 84%, black 16%))`,
                boxShadow: `0 10px 22px ${platform.color}24`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'white', letterSpacing: '-0.01em' }}>
                提交认证申请
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <div style={{ width: '128px', height: '5px', borderRadius: '999px', background: 'rgba(15,23,42,0.14)' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────────────────────────── */

export function PlatformConfig() {
  const [platforms, setPlatforms] = useState<PlatformData[]>(
    INITIAL_PLATFORMS.filter((p) => p.id !== 'weibo')
  );
  const [activePlatformId, setActivePlatformId] = useState<string>('xiaohongshu');
  const [aiReviewConfig, setAiReviewConfig] = useState<AiReviewConfig>(INITIAL_AI_REVIEW_CONFIG);
  const [editingField, setEditingField] = useState<FieldConfig | null>(null);
  const [isNewField, setIsNewField] = useState(false);

  const platform = platforms.find((p) => p.id === activePlatformId) ?? null;
  const isAiReviewPanel = activePlatformId === 'ai-review';

  const updatePlatform = (updater: (p: PlatformData) => PlatformData) => {
    setPlatforms((prev) => prev.map((p) => p.id === activePlatformId ? updater(p) : p));
  };

  const togglePlatformEnabled = (platformId: string) => {
    setPlatforms((prev) =>
      prev.map((p) => (p.id === platformId ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const saveField = (field: FieldConfig) => {
    if (!platform) return;
    updatePlatform((p) => ({
      ...p,
      fields: isNewField
        ? [...p.fields, field]
        : p.fields.map((f) => f.id === field.id ? field : f),
    }));
    setEditingField(null);
  };

  return (
    <div style={{ padding: '24px', height: '100%', boxSizing: 'border-box' }}>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

        {/* ── Left: Platform list ── */}
        <div style={{ width: '220px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'var(--font-weight-semibold)', color: 'rgba(71,85,105,1)', padding: '0 4px' }}>
            平台列表
          </div>
          {platforms.map((p) => {
            const active = p.id === activePlatformId;
            return (
              <div
                key={p.id}
                onClick={() => setActivePlatformId(p.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  padding: '12px 12px',
                  borderRadius: '12px',
                  border: `1px solid ${active ? `${p.color}66` : 'rgba(203,213,225,0.92)'}`,
                  background: active ? p.bgColor : 'rgba(255,255,255,0.96)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  boxShadow: active ? `0 0 0 2px ${p.color}16, 0 8px 18px rgba(15,23,42,0.08)` : '0 3px 10px rgba(15,23,42,0.05)',
                  transition: 'all 0.16s ease',
                  boxSizing: 'border-box',
                  opacity: p.enabled ? 1 : 0.65,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <PlatformBadge platform={p.name} size={12} style={{ padding: '2px 8px 2px 3px', fontSize: '11px' }} />
                  </div>
                </div>
                <div
                  aria-hidden="true"
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '999px',
                    border: `1px solid ${active ? `${p.color}52` : 'rgba(203,213,225,0.95)'}`,
                    background: active ? 'rgba(255,255,255,0.72)' : 'rgba(248,250,252,0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <ChevronRight size={12} color={active ? p.color : 'rgba(148,163,184,1)'} />
                </div>
              </div>
            );
          })}
          <div
            onClick={() => setActivePlatformId('ai-review')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              padding: '12px 12px',
              borderRadius: '12px',
              border: `1px solid ${isAiReviewPanel ? 'rgba(16,185,129,0.45)' : 'rgba(203,213,225,0.92)'}`,
              background: isAiReviewPanel ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.96)',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              boxShadow: isAiReviewPanel ? '0 0 0 2px rgba(16,185,129,0.14), 0 8px 18px rgba(15,23,42,0.08)' : '0 3px 10px rgba(15,23,42,0.05)',
              transition: 'all 0.16s ease',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px' }}>🤖</span>
                <span style={{ fontSize: '12px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
                  AI 自动审核
                </span>
              </div>
              <div style={{ marginTop: '4px', fontSize: '11px', color: 'rgba(71,85,105,1)' }}>
                {aiReviewConfig.enabled ? '已开启' : '已关闭'} · 付费功能
              </div>
            </div>
            <div
              aria-hidden="true"
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '999px',
                border: `1px solid ${isAiReviewPanel ? 'rgba(16,185,129,0.42)' : 'rgba(203,213,225,0.95)'}`,
                background: isAiReviewPanel ? 'rgba(255,255,255,0.72)' : 'rgba(248,250,252,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ChevronRight size={12} color={isAiReviewPanel ? 'rgba(5,150,105,1)' : 'rgba(148,163,184,1)'} />
            </div>
          </div>
        </div>

        {/* ── Right: Config panel ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--elevation-sm)', overflow: 'hidden' }}>
            {isAiReviewPanel && (
              <div
                style={{
                  minHeight: '640px',
                  background: 'linear-gradient(180deg, #f7fbfb 0%, #fbfdfd 100%)',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    minHeight: '238px',
                    padding: '44px 24px 36px',
                    overflow: 'hidden',
                    borderBottom: '1px solid rgba(209,229,228,0.78)',
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
                      top: '18px',
                      width: '360px',
                      height: '190px',
                      transform: 'translateX(-32%)',
                      pointerEvents: 'none',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        left: '105px',
                        top: '112px',
                        width: '172px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'rgba(52,211,201,0.18)',
                        boxShadow: '0 0 34px rgba(45,212,191,0.32)',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: '138px',
                        top: '96px',
                        width: '110px',
                        height: '32px',
                        borderRadius: '50%',
                        border: '10px solid rgba(87,218,207,0.32)',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: '154px',
                        top: '38px',
                        width: '78px',
                        height: '72px',
                        borderRadius: '30px 30px 26px 26px',
                        background: 'linear-gradient(180deg, #eef8fb 0%, #d5edf2 100%)',
                        boxShadow: '0 16px 30px rgba(66,153,165,0.25)',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          left: '12px',
                          top: '27px',
                          width: '54px',
                          height: '32px',
                          borderRadius: '14px',
                          background: '#17303e',
                          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
                        }}
                      />
                      <div style={{ position: 'absolute', left: '24px', top: '38px', width: '7px', height: '14px', borderRadius: '999px', background: '#3df5de', boxShadow: '0 0 10px #3df5de' }} />
                      <div style={{ position: 'absolute', right: '24px', top: '38px', width: '7px', height: '14px', borderRadius: '999px', background: '#3df5de', boxShadow: '0 0 10px #3df5de' }} />
                      <div style={{ position: 'absolute', left: '37px', top: '-12px', width: '5px', height: '18px', borderRadius: '999px', background: '#91e6df' }} />
                      <div style={{ position: 'absolute', left: '34px', top: '-19px', width: '11px', height: '11px', borderRadius: '50%', background: '#8ee8e0', boxShadow: '0 0 12px rgba(45,212,191,0.7)' }} />
                      <div style={{ position: 'absolute', left: '31px', bottom: '-15px', width: '28px', height: '20px', borderRadius: '0 0 16px 16px', background: '#56d4cf' }} />
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        left: '88px',
                        top: '75px',
                        width: '64px',
                        height: '64px',
                        clipPath: 'polygon(50% 0%, 90% 20%, 90% 70%, 50% 100%, 10% 70%, 10% 20%)',
                        background: 'linear-gradient(145deg, #72dece, #48cbbb)',
                        opacity: 0.76,
                      }}
                    >
                      <CheckCircle2 size={22} color="white" style={{ position: 'absolute', left: '21px', top: '20px' }} />
                    </div>
                    <div style={{ position: 'absolute', right: '42px', top: '54px', width: '54px', height: '64px', borderRadius: '3px', background: 'rgba(246,239,197,0.68)', transform: 'skewY(12deg)' }} />
                    <div style={{ position: 'absolute', right: '62px', top: '86px', width: '58px', height: '52px', borderRadius: '3px', background: 'rgba(126,218,214,0.24)', transform: 'skewY(12deg)' }} />
                  </div>

                  <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '24px', alignItems: 'center' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '94px minmax(0, 1fr)', gap: '26px', alignItems: 'center' }}>
                      <div
                        style={{
                          width: '76px',
                          height: '76px',
                          borderRadius: '10px',
                          background: 'linear-gradient(180deg, #93ead5, #71dccb)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 12px 28px rgba(20,184,166,0.18)',
                        }}
                      >
                        <Bot size={48} color="#106b74" strokeWidth={1.8} />
                      </div>
                      <div>
                        <div style={{ fontSize: '30px', lineHeight: 1.15, fontWeight: 800, color: '#152032', letterSpacing: '0.04em' }}>
                          AI 自动审核
                        </div>
                        <div style={{ marginTop: '18px', fontSize: '15px', color: '#526075', lineHeight: 1.7 }}>
                          为三方账号申请提供自动判定，降低人工审核压力
                        </div>
                        <div
                          style={{
                            marginTop: '12px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '9px',
                            padding: '7px 12px',
                            borderRadius: '4px',
                            background: 'rgba(255,255,255,0.74)',
                            boxShadow: '0 6px 18px rgba(15,23,42,0.06)',
                            color: '#0f8f76',
                            fontSize: '13px',
                            fontWeight: 600,
                          }}
                        >
                          <ShieldCheck size={16} />
                          已为您智能过滤大量风险申请
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        minHeight: '82px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.96)',
                        border: '1px solid rgba(220,231,232,0.9)',
                        boxShadow: '0 10px 28px rgba(15,23,42,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 24px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '26px' }}>
                        <span style={{ fontSize: '17px', fontWeight: 700, color: '#1e293b' }}>自动审核</span>
                        <span style={{ fontSize: '16px', color: '#00a870', fontWeight: 700 }}>
                          {aiReviewConfig.enabled ? '已启用' : '已禁用'}
                        </span>
                      </div>
                      <button
                        type="button"
                        aria-label="切换 AI 自动审核"
                        onClick={() => setAiReviewConfig((prev) => ({ ...prev, enabled: !prev.enabled }))}
                        style={{
                          width: '58px',
                          height: '34px',
                          borderRadius: '999px',
                          border: 'none',
                          background: aiReviewConfig.enabled ? '#00a870' : '#cbd5e1',
                          position: 'relative',
                          cursor: 'pointer',
                          boxShadow: aiReviewConfig.enabled ? '0 8px 18px rgba(0,168,112,0.26)' : 'none',
                          transition: 'background 0.16s ease',
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            top: '5px',
                            left: aiReviewConfig.enabled ? '29px' : '5px',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: '#fff',
                            boxShadow: '0 2px 6px rgba(15,23,42,0.18)',
                            transition: 'left 0.16s ease',
                          }}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '32px 24px 28px' }}>
                  <div
                    style={{
                      background: '#fff',
                      borderRadius: '10px',
                      boxShadow: '0 14px 36px rgba(15,23,42,0.08)',
                      padding: '26px 28px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingBottom: '20px', borderBottom: '1px solid #edf1f4' }}>
                      <span
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '50%',
                          background: '#eefbf7',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#0f9b7a',
                        }}
                      >
                        <Target size={23} />
                      </span>
                      <span style={{ fontSize: '21px', fontWeight: 800, color: '#1f2937' }}>功能价值</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(320px, 0.9fr)', gap: '28px', padding: '22px 20px 26px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '96px minmax(0, 1fr)', gap: '18px', alignItems: 'center', padding: '6px 0 26px', borderBottom: '1px dashed #e1e8ed' }}>
                          <span
                            style={{
                              width: '68px',
                              height: '68px',
                              borderRadius: '50%',
                              background: '#eefbf7',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#0f9b7a',
                            }}
                          >
                            <FileCheck2 size={31} />
                          </span>
                          <div>
                            <div style={{ fontSize: '16px', fontWeight: 800, color: '#05956f', marginBottom: '8px' }}>智能判定，准确高效</div>
                            <div style={{ fontSize: '13px', color: '#526075', lineHeight: 1.85 }}>
                              AI 自动审核会基于账号资料一致性、主页有效性与风险特征进行自动判定，帮助你减少重复人工审核，提升审核效率与通过时效。
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '96px minmax(0, 1fr)', gap: '18px', alignItems: 'center', padding: '18px 0 0' }}>
                          <span
                            style={{
                              width: '68px',
                              height: '68px',
                              borderRadius: '50%',
                              background: '#eefbf7',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#0f9b7a',
                            }}
                          >
                            <RefreshCw size={31} />
                          </span>
                          <div>
                            <div style={{ fontSize: '16px', fontWeight: 800, color: '#05956f', marginBottom: '8px' }}>新提交智能处理</div>
                            <div style={{ fontSize: '13px', color: '#526075', lineHeight: 1.85 }}>
                              开启后系统将自动对新提交账号执行审核，审核结果会同步到账户审核列表。
                            </div>
                          </div>
                        </div>
                      </div>

                      <div style={{ borderLeft: '1px solid #edf1f4', paddingLeft: '28px', display: 'flex', alignItems: 'center' }}>
                        <div
                          style={{
                            width: '100%',
                            minHeight: '118px',
                            borderRadius: '10px',
                            border: '1px solid rgba(249,180,99,0.42)',
                            background: '#fffaf3',
                            display: 'grid',
                            gridTemplateColumns: '82px minmax(0,1fr)',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '18px',
                            boxSizing: 'border-box',
                          }}
                        >
                          <span
                            style={{
                              width: '64px',
                              height: '64px',
                              borderRadius: '50%',
                              background: '#fff0d9',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#f28c28',
                            }}
                          >
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

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '74px minmax(0, 1fr)',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '14px 18px',
                        borderRadius: '8px',
                        border: '1px solid #dbeeed',
                        background: '#f6fcfb',
                      }}
                    >
                      <span
                        style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '50%',
                          background: '#effbf8',
                          border: '1px solid #dbeeed',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#0f9b7a',
                        }}
                      >
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
            )}

            {!isAiReviewPanel && platform && (
              <>

            {/* Panel header */}
            <div style={{ padding: '18px 20px 4px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <PlatformBadge platform={platform.name} size={14} style={{ padding: '3px 10px 3px 3px', fontSize: '12px' }} />
                <div>
                  <div style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>认证配置</div>
                  <div style={{ fontSize: '12px', color: 'rgba(107,114,128,1)', marginTop: '2px' }}>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    background: 'var(--card)',
                  }}
                >
                  <span style={{ fontSize: '12px', color: 'rgba(107,114,128,1)' }}>平台开启状态</span>
                  <span
                    style={{
                      fontSize: '12px',
                      color: platform.enabled ? 'rgba(82,196,26,1)' : 'rgba(107,114,128,1)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}
                  >
                    {platform.enabled ? '已启用' : '已禁用'}
                  </span>
                  <button
                    type="button"
                    onClick={() => togglePlatformEnabled(platform.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
                  >
                    {platform.enabled
                      ? <ToggleRight size={24} style={{ color: 'rgba(82,196,26,1)' }} />
                      : <ToggleLeft size={24} style={{ color: 'rgba(107,114,128,1)' }} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Combined content */}
            <div
              style={{
                padding: '20px',
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.35fr) minmax(340px, 0.85fr)',
                gap: '20px',
                alignItems: 'start',
              }}
            >
              {/* Left: field config */}
              <div
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  background: 'var(--card)',
                }}
              >
                <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', background: 'var(--muted)' }}>
                  <div style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
                    字段配置
                  </div>
                  <div style={{ marginTop: '4px', fontSize: '12px', color: 'rgba(107,114,128,1)' }}>
                    左侧调整字段，右侧同步查看表单预览
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 64px 56px', alignItems: 'center', gap: '12px', padding: '12px 16px 8px', borderBottom: '1px solid var(--border)', marginBottom: '4px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>字段名称</div>
                    <div style={{ fontSize: '11px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'center' }}>必填</div>
                    <div style={{ fontSize: '11px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'center' }}>操作</div>
                  </div>

                  {platform.fields.map((field) => (
                    <div
                      key={field.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 64px 56px',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 16px',
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{field.label}</span>
                        </div>
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        {field.required
                          ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: 'rgba(255,77,79,1)', background: 'rgba(255,77,79,0.08)', border: '1px solid rgba(255,77,79,0.2)', borderRadius: '100px', padding: '2px 7px' }}><span>*</span>必填</span>
                          : <span style={{ fontSize: '11px', color: 'rgba(107,114,128,1)' }}>—</span>}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                        <button
                          onClick={() => { setEditingField(field); setIsNewField(false); }}
                          title="编辑"
                          style={{ width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer', color: 'var(--foreground)' }}
                        >
                          <Edit2 size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: preview */}
              <div
                style={{
                  border: 'none',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'visible',
                  background: 'transparent',
                  position: 'sticky',
                  top: '24px',
                }}
              >
                <div style={{ padding: '4px 0 12px', borderBottom: 'none', background: 'transparent' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
                  </div>
                </div>
                <div style={{ padding: '0' }}>
                  <div style={{ maxWidth: '420px', margin: '0 auto' }}>
                    <FormPreview platform={platform} />
                  </div>
                </div>
              </div>
            </div>

              </>
            )}
          </div>
        </div>
      </div>

      {/* Field editor modal */}
      {(editingField !== null || isNewField) && (
        <FieldEditor
          field={editingField}
          isNew={isNewField}
          onSave={saveField}
          onClose={() => { setEditingField(null); setIsNewField(false); }}
        />
      )}
    </div>
  );
}
