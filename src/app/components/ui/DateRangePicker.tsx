import { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, parse, isValid } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Calendar } from 'lucide-react';

interface DateRangePickerProps {
  startDate: string;          // YYYY-MM-DD
  endDate: string;            // YYYY-MM-DD
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
  required?: boolean;
  label?: string;
}

function parseDate(s: string): Date | undefined {
  if (!s) return undefined;
  const d = parse(s, 'yyyy-MM-dd', new Date());
  return isValid(d) ? d : undefined;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  required,
  label = '活动时间',
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [activeField, setActiveField] = useState<'start' | 'end'>('start');
  const containerRef = useRef<HTMLDivElement>(null);

  const start = parseDate(startDate);
  const end   = parseDate(endDate);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleDayClick = (day: Date) => {
    const str = format(day, 'yyyy-MM-dd');
    if (activeField === 'start') {
      onStartChange(str);
      // if end is before new start, clear end
      if (end && day > end) onEndChange('');
      setActiveField('end');
    } else {
      if (start && day < start) {
        // swap
        onEndChange(startDate);
        onStartChange(str);
      } else {
        onEndChange(str);
      }
      setOpen(false);
      setActiveField('start');
    }
  };

  const openPicker = (field: 'start' | 'end') => {
    setActiveField(field);
    setOpen(true);
  };

  const inputBase: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '7px 10px 7px 12px',
    background: 'var(--input-background)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
    minWidth: '148px',
    gap: '8px',
    transition: 'border-color 0.15s',
    userSelect: 'none',
  };

  const inputActive: React.CSSProperties = {
    borderColor: 'var(--ring)',
    boxShadow: '0 0 0 2px rgba(36,116,255,0.12)',
  };

  // Determine which days are in the selected range
  const selected = start || end
    ? { from: start, to: end }
    : undefined;

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {/* ── Field row ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Start input */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => openPicker('start')}
          onKeyDown={(e) => e.key === 'Enter' && openPicker('start')}
          style={{
            ...inputBase,
            ...(open && activeField === 'start' ? inputActive : {}),
          }}
        >
          <span
            style={{
              fontSize: 'var(--text-base)',
              color: startDate ? 'var(--foreground)' : 'var(--muted-foreground)',
              flex: 1,
              whiteSpace: 'nowrap',
            }}
          >
            {startDate || '开始日期'}
          </span>
          <Calendar
            size={14}
            style={{
              color: open && activeField === 'start' ? 'var(--primary)' : 'var(--muted-foreground)',
              flexShrink: 0,
            }}
          />
        </div>

        {/* Separator */}
        <span style={{ fontSize: 'var(--text-base)', color: 'var(--muted-foreground)', flexShrink: 0 }}>
          -
        </span>

        {/* End input */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => openPicker('end')}
          onKeyDown={(e) => e.key === 'Enter' && openPicker('end')}
          style={{
            ...inputBase,
            ...(open && activeField === 'end' ? inputActive : {}),
          }}
        >
          <span
            style={{
              fontSize: 'var(--text-base)',
              color: endDate ? 'var(--foreground)' : 'var(--muted-foreground)',
              flex: 1,
              whiteSpace: 'nowrap',
            }}
          >
            {endDate || '结束日期'}
          </span>
          <Calendar
            size={14}
            style={{
              color: open && activeField === 'end' ? 'var(--primary)' : 'var(--muted-foreground)',
              flexShrink: 0,
            }}
          />
        </div>
      </div>

      {/* ── Calendar popover ── */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            zIndex: 100,
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            padding: '16px',
          }}
        >
          {/* Hint bar */}
          <div
            style={{
              fontSize: '12px',
              color: 'var(--muted-foreground)',
              marginBottom: '10px',
              padding: '6px 10px',
              background: 'var(--muted)',
              borderRadius: 'var(--radius)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Calendar size={12} style={{ color: 'var(--primary)' }} />
            {activeField === 'start' ? '请选择开始日期' : '请选择结束日期'}
            {startDate && activeField === 'end' && (
              <span style={{ color: 'var(--primary)', fontWeight: 'var(--font-weight-medium)' }}>
                &nbsp;（开始：{startDate}）
              </span>
            )}
          </div>

          <style>{`
            .rdp {
              --rdp-cell-size: 34px;
              --rdp-accent-color: rgba(36,116,255,1);
              --rdp-background-color: rgba(36,116,255,0.08);
              margin: 0;
              font-family: 'PingFang SC', -apple-system, sans-serif;
              font-size: 13px;
            }
            .rdp-months { display: flex; gap: 20px; }
            .rdp-caption { display: flex; align-items: center; justify-content: space-between; padding: 0 4px 10px; }
            .rdp-caption_label {
              font-size: 13px;
              font-weight: var(--font-weight-semibold);
              color: var(--foreground);
            }
            .rdp-nav { display: flex; gap: 4px; }
            .rdp-nav_button {
              width: 26px; height: 26px;
              border-radius: var(--radius);
              border: 1px solid var(--border);
              background: var(--card);
              cursor: pointer;
              display: flex; align-items: center; justify-content: center;
              color: var(--card-foreground);
            }
            .rdp-nav_button:hover { background: var(--muted); }
            .rdp-head_cell {
              font-size: 11px;
              font-weight: var(--font-weight-medium);
              color: var(--muted-foreground);
              width: var(--rdp-cell-size);
              text-align: center;
              padding-bottom: 6px;
            }
            .rdp-cell { padding: 1px; }
            .rdp-button {
              width: var(--rdp-cell-size);
              height: var(--rdp-cell-size);
              border-radius: var(--radius);
              border: none;
              background: transparent;
              cursor: pointer;
              font-size: 12px;
              color: var(--foreground);
              display: flex; align-items: center; justify-content: center;
            }
            .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
              background: var(--muted);
            }
            .rdp-day_selected .rdp-button,
            .rdp-button.rdp-day_selected {
              background: var(--primary) !important;
              color: var(--primary-foreground) !important;
              border-radius: var(--radius);
            }
            .rdp-day_range_start .rdp-button,
            .rdp-day_range_end .rdp-button {
              background: var(--primary) !important;
              color: var(--primary-foreground) !important;
            }
            .rdp-day_range_middle .rdp-button {
              background: rgba(36,116,255,0.1) !important;
              color: var(--primary) !important;
              border-radius: 0;
            }
            .rdp-day_range_start .rdp-button {
              border-radius: var(--radius) 0 0 var(--radius);
            }
            .rdp-day_range_end .rdp-button {
              border-radius: 0 var(--radius) var(--radius) 0;
            }
            .rdp-day_range_start.rdp-day_range_end .rdp-button {
              border-radius: var(--radius) !important;
            }
            .rdp-day_outside .rdp-button { color: var(--muted-foreground); opacity: 0.4; }
            .rdp-day_disabled .rdp-button { opacity: 0.3; cursor: not-allowed; }
            .rdp-day_today .rdp-button {
              border: 1px solid var(--primary);
              color: var(--primary);
              font-weight: var(--font-weight-semibold);
            }
            .rdp-day_today.rdp-day_selected .rdp-button,
            .rdp-day_today.rdp-day_range_start .rdp-button,
            .rdp-day_today.rdp-day_range_end .rdp-button {
              border: none;
            }
          `}</style>

          <DayPicker
            mode="range"
            selected={selected}
            onDayClick={handleDayClick}
            numberOfMonths={2}
            locale={zhCN}
            showOutsideDays
            defaultMonth={start ?? new Date()}
          />

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '12px',
              borderTop: '1px solid var(--border)',
              marginTop: '4px',
            }}
          >
            <button
              type="button"
              onClick={() => {
                onStartChange('');
                onEndChange('');
                setActiveField('start');
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                color: 'var(--muted-foreground)',
                padding: '0',
              }}
            >
              清除
            </button>
            <div style={{ fontSize: '12px', color: 'var(--card-foreground)' }}>
              {startDate && endDate
                ? `${startDate}  →  ${endDate}`
                : startDate
                ? `已选开始：${startDate}`
                : '请选择日期范围'}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={!startDate || !endDate}
              style={{
                padding: '5px 14px',
                background: startDate && endDate ? 'var(--primary)' : 'var(--muted)',
                color: startDate && endDate ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                border: 'none',
                borderRadius: 'var(--radius)',
                cursor: startDate && endDate ? 'pointer' : 'not-allowed',
                fontSize: '12px',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              确定
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
