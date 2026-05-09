import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router";
import type { CSSProperties } from "react";

type Annotation = {
  id: string;
  title: string;
  match: (pathname: string) => boolean;
  interactions: string[];
  logic: string[];
};

const annotations: Annotation[] = [
  {
    id: "h5-tasks",
    title: "H5 任务中心",
    match: (pathname) => pathname === "/tasks",
    interactions: [
      "点击状态筛选，切换全部、进行中、未开始、已结束任务。",
      "点击任务卡片，进入对应任务详情页面。",
      "点击我的任务悬浮按钮，查看历史提交记录。",
      "点击底部我的，进入三方账号认证中心。",
    ],
    logic: [
      "仅展示后台开启前台展示的任务。",
      "展示排序数值越大，列表位置越靠前。",
      "任务状态由开始时间和结束时间共同决定。",
      "卡片统计展示参与人数和提交量。",
    ],
  },
  {
    id: "h5-task-detail",
    title: "H5 任务详情",
    match: (pathname) => /^\/tasks\/[^/]+$/.test(pathname),
    interactions: [
      "点击任务说明，自动定位到参与步骤区域。",
      "进行中任务底部显示去提交内容按钮。",
      "未开始任务底部只显示订阅开始提醒。",
      "已结束任务底部显示查看名次并打开排行榜弹窗。",
    ],
    logic: [
      "平台要求只展示当前任务配置的单个平台。",
      "参与规则使用后台任务配置自动生成。",
      "奖励说明按后台奖励规格展示星云币、红包和赠品。",
      "任务结束后不允许继续提交内容。",
    ],
  },
  {
    id: "h5-submit",
    title: "H5 提交内容",
    match: (pathname) => pathname === "/submit",
    interactions: [
      "从任务详情进入后，来源任务自动带入。",
      "用户填写内容链接和内容摘要后提交审核。",
      "点击提交内容，触发链接格式和重复提交校验。",
      "返回按钮回到上一页面，不清空已填写内容。",
    ],
    logic: [
      "任务和平台由入口任务自动锁定。",
      "发布者账号和发布时间不需要用户填写。",
      "提交成功后生成待审核记录。",
      "同一链接不能重复提交到同一任务。",
    ],
  },
  {
    id: "h5-submissions",
    title: "H5 我的任务",
    match: (pathname) => pathname === "/submissions",
    interactions: [
      "点击顶部状态筛选，查看不同审核状态记录。",
      "点击提交卡片，跳转到关联任务详情。",
      "点击复制图标，复制用户提交的内容链接。",
      "点击拒绝原因，弹窗查看审核拒绝说明。",
    ],
    logic: [
      "前台不展示已删除状态。",
      "只有已通过记录展示奖励信息。",
      "星云币和抽奖机会不会同时展示。",
      "已拒绝记录在提交时间行展示拒绝原因入口。",
    ],
  },
  {
    id: "h5-submission-detail",
    title: "H5 提交详情",
    match: (pathname) => /^\/submissions\/[^/]+$/.test(pathname),
    interactions: [
      "点击顶部任务卡片，进入对应任务详情。",
      "点击复制图标，复制提交内容链接。",
      "奖励信息中的查看按钮仅作为展示入口。",
      "返回按钮回到上一访问页面。",
    ],
    logic: [
      "提交详情通过提交记录 id 查询。",
      "内容摘要展示发布时间、摘要和链接。",
      "已到账状态才展示赠品等奖励信息。",
      "页面不再展示平台标签和状态冗余信息。",
    ],
  },
  {
    id: "h5-account-center",
    title: "H5 认证中心",
    match: (pathname) => pathname === "/account",
    interactions: [
      "点击平台行，进入对应平台账号认证详情。",
      "未认证状态进入可填写认证表单。",
      "认证失败状态支持进入详情并重新认证。",
      "已认证和认证中状态进入后只可查看内容。",
    ],
    logic: [
      "每个平台独立维护认证状态。",
      "状态包含去认证、认证中、已认证和认证失败。",
      "平台名称前统一展示平台 logo。",
      "认证通过后账号可用于内容提交校验。",
    ],
  },
  {
    id: "h5-account-detail",
    title: "H5 账号认证详情",
    match: (pathname) => pathname.startsWith("/account/verify/"),
    interactions: [
      "未认证状态下可填写账号资料并提交。",
      "认证失败点击重新认证后恢复可编辑。",
      "认证中和已认证状态仅允许查看资料。",
      "提交认证后回到认证中心查看状态变化。",
    ],
    logic: [
      "页面标题根据平台动态显示。",
      "表单字段参考后台平台认证配置。",
      "失败原因保留给用户重新修改资料。",
      "只读状态下不会触发字段校验。",
    ],
  },
  {
    id: "h5-rewards",
    title: "H5 我的奖励",
    match: (pathname) => pathname === "/rewards",
    interactions: [
      "查看星云币、待到账和已到账奖励汇总。",
      "点击奖励记录，查看来源任务和到账说明。",
      "切换状态，筛选不同到账状态奖励。",
      "返回按钮回到上一页面。",
    ],
    logic: [
      "奖励通过提交记录关联来源任务。",
      "状态包含待到账、已到账和已失效。",
      "星云币替代原积分口径展示。",
      "到账时间由审核通过和发放规则决定。",
    ],
  },
  {
    id: "h5-messages",
    title: "H5 消息中心",
    match: (pathname) => pathname === "/messages",
    interactions: [
      "点击消息卡片，查看对应通知内容。",
      "点击全部已读，清除未读标记。",
      "点击关联消息，跳转到任务或提交记录。",
      "返回按钮回到上一页面。",
    ],
    logic: [
      "消息类型包含审核、奖励、账号和系统。",
      "审核动作会同步生成前台通知。",
      "订阅任务开始提醒后会生成开始通知。",
      "未读数量根据 read 字段实时计算。",
    ],
  },
  {
    id: "h5-not-found",
    title: "H5 异常页",
    match: (pathname) => !pathname.startsWith("/backend"),
    interactions: [
      "访问未知地址时展示页面不存在提示。",
      "点击返回任务中心，回到 H5 任务中心。",
      "点击浏览器返回，回到上一有效页面。",
      "关闭注释后可通过右下角按钮重新打开。",
    ],
    logic: [
      "通配路由兜底未匹配的 H5 地址。",
      "异常页避免用户停留在空白页面。",
      "返回目标统一指向任务中心。",
      "后台路由不使用该异常页注释。",
    ],
  },
  {
    id: "backend-dashboard",
    title: "后台 数据看板",
    match: (pathname) => pathname === "/backend/dashboard",
    interactions: [
      "点击日期筛选，切换看板统计范围。",
      "点击顶部任务管理，进入任务列表。",
      "点击顶部内容审核，进入审核列表。",
      "点击预览小程序，进入 H5 任务中心。",
    ],
    logic: [
      "看板聚合参与人数、提交量和平台分布。",
      "数据看板路径只高亮数据看板 Tab。",
      "会员管理菜单默认展开。",
      "后台和 H5 入口保持互相可达。",
    ],
  },
  {
    id: "backend-tasks",
    title: "后台 任务管理",
    match: (pathname) => pathname === "/backend/tasks",
    interactions: [
      "点击创建任务，进入任务创建页面。",
      "切换展示状态，控制任务是否出现在前台。",
      "点击排序笔图标，弹出设置排序浮层。",
      "点击数据，查看单个任务数据详情。",
    ],
    logic: [
      "展示排序数值越大越靠前。",
      "展示状态关闭后 H5 任务中心不展示。",
      "任务列表支持状态和关键字筛选。",
      "排序保存后列表即时刷新。",
    ],
  },
  {
    id: "backend-task-create",
    title: "后台 创建任务",
    match: (pathname) => pathname === "/backend/tasks/create",
    interactions: [
      "填写基础信息，配置任务名称、时间和平台。",
      "配置奖励规格，添加投稿奖励和达标奖励。",
      "设置展示状态和排序，控制前台展示效果。",
      "点击保存，返回任务管理列表。",
    ],
    logic: [
      "平台要求最终在 H5 中只展示一个平台。",
      "奖励规格支持星云币、红包、赠品和抽奖机会。",
      "提交上限用于生成前台参与规则。",
      "保存后的配置驱动 H5 任务详情展示。",
    ],
  },
  {
    id: "backend-task-edit",
    title: "后台 编辑任务",
    match: (pathname) => /^\/backend\/tasks\/edit\/[^/]+$/.test(pathname),
    interactions: [
      "进入编辑页后自动带入已有任务配置。",
      "修改基础信息后点击保存更新任务。",
      "修改展示排序后影响前台列表顺序。",
      "取消编辑返回任务管理列表。",
    ],
    logic: [
      "编辑页复用创建任务表单结构。",
      "任务 id 保持不变，只更新配置字段。",
      "奖励规格变更会影响后续提交奖励展示。",
      "已产生的数据记录不随表单编辑自动删除。",
    ],
  },
  {
    id: "backend-task-data",
    title: "后台 任务数据详情",
    match: (pathname) => /^\/backend\/tasks\/[^/]+\/data$/.test(pathname),
    interactions: [
      "点击返回，回到任务管理列表。",
      "切换数据区块，查看参与、审核和奖励数据。",
      "点击导出，输出任务数据明细。",
      "查看平台分布，对比不同平台表现。",
    ],
    logic: [
      "数据按当前任务 id 聚合。",
      "互动数据包含点赞、评论和收藏指标。",
      "奖励明细来自任务奖励配置和审核结果。",
      "审核通过率按提交状态统计。",
    ],
  },
  {
    id: "backend-review",
    title: "后台 内容审核",
    match: (pathname) => pathname === "/backend/review",
    interactions: [
      "切换待审核、已通过、已拒绝，过滤提交记录。",
      "输入任务或手机号，精准筛选内容。",
      "点击通过，确认后更新审核状态。",
      "点击拒绝，填写拒绝原因并同步前台。",
    ],
    logic: [
      "已删除状态不再作为审核筛选项。",
      "筛选项标题保留在输入框内部。",
      "拒绝原因会在 H5 我的任务中弹窗展示。",
      "审核状态驱动奖励是否展示。",
    ],
  },
  {
    id: "backend-account-review",
    title: "后台 账号认证审核",
    match: (pathname) => pathname === "/backend/member/info/third-party/verification",
    interactions: [
      "切换状态 Tab，查看不同认证队列。",
      "点击通过，认证账号可用于内容提交。",
      "点击拒绝，录入认证失败原因。",
      "搜索用户，定位对应认证记录。",
    ],
    logic: [
      "认证状态同步到 H5 认证中心。",
      "拒绝记录支持用户重新提交认证。",
      "平台 logo 与 H5 平台展示保持一致。",
      "认证通过后参与账号一致性校验。",
    ],
  },
  {
    id: "backend-platform-config",
    title: "后台 平台认证配置",
    match: (pathname) => pathname === "/backend/member/info/third-party/platform-config",
    interactions: [
      "切换平台，查看对应认证字段配置。",
      "编辑字段，修改标签、类型和必填规则。",
      "查看表单预览，确认用户端填写效果。",
      "点击保存，将配置应用到认证详情页。",
    ],
    logic: [
      "字段配置决定 H5 认证表单结构。",
      "平台启停控制是否允许前台认证。",
      "必填字段影响认证提交校验。",
      "表单预览与用户端认证详情样式对齐。",
    ],
  },
  {
    id: "backend-member-list",
    title: "后台 会员列表",
    match: (pathname) => pathname === "/backend/member/info/list",
    interactions: [
      "输入搜索条件，筛选会员记录。",
      "点击会员行，进入会员详情。",
      "切换三方账号菜单，进入认证管理。",
      "点击会员体系或权益，进入对应配置页面。",
    ],
    logic: [
      "会员管理菜单默认展开。",
      "会员列表按用户维度聚合资料。",
      "三方账号信息来自认证中心。",
      "会员详情按 memberId 查询。",
    ],
  },
  {
    id: "backend-member-detail",
    title: "后台 会员详情",
    match: (pathname) => /^\/backend\/member\/info\/list\/[^/]+$/.test(pathname),
    interactions: [
      "点击返回，回到会员列表。",
      "查看基础资料，了解会员身份信息。",
      "查看三方账号，判断账号绑定情况。",
      "查看权益记录，了解会员奖励承接情况。",
    ],
    logic: [
      "页面按 memberId 加载单个会员数据。",
      "账号数据与认证审核结果关联。",
      "内容激励提交记录可沉淀到会员画像。",
      "权益信息用于后续奖励运营。",
    ],
  },
  {
    id: "backend-member-system",
    title: "后台 会员体系",
    match: (pathname) => pathname === "/backend/member/system",
    interactions: [
      "编辑会员等级，配置等级名称和门槛。",
      "调整成长规则，影响会员分层逻辑。",
      "保存配置，更新会员体系规则。",
      "返回其他会员菜单，继续配置权益。",
    ],
    logic: [
      "会员体系服务用户分层运营。",
      "等级规则可与内容激励奖励联动。",
      "配置保存后供会员详情读取。",
      "该页不直接改变 H5 任务中心。",
    ],
  },
  {
    id: "backend-member-benefits",
    title: "后台 会员权益",
    match: (pathname) => pathname === "/backend/member/benefits",
    interactions: [
      "新增权益，配置权益名称和发放条件。",
      "编辑权益，更新前台可见说明。",
      "删除权益，二次确认后移除。",
      "启停权益，控制权益是否生效。",
    ],
    logic: [
      "权益数据承接会员运营场景。",
      "赠品和抽奖机会可作为权益扩展。",
      "权益启停控制是否进入展示。",
      "变更后影响会员中心相关配置。",
    ],
  },
  {
    id: "backend-marketing",
    title: "后台 互动营销入口",
    match: (pathname) => pathname === "/backend/interactive-marketing",
    interactions: [
      "点击内容激励入口，进入数据看板或任务管理。",
      "点击活动中心，查看营销活动承接入口。",
      "点击微社区，进入社区运营场景。",
      "点击导购商城，进入商城承接页面。",
    ],
    logic: [
      "经营工具承接内容激励之外的运营场景。",
      "活动中心可作为后续任务投放入口。",
      "微社区用于沉淀审核通过内容。",
      "导购商城与会员奖励发放关联。",
    ],
  },
];

function findAnnotation(pathname: string) {
  return annotations.find((item) => item.match(pathname));
}

function getInitialPosition(scope: "h5" | "backend" | "default") {
  if (typeof window === "undefined") return { x: 24, y: 96 };

  if (scope === "h5") {
    const panelWidth = 320;
    const phoneWidth = 520;
    const gap = 18;
    const phoneLeft = Math.max(0, (window.innerWidth - phoneWidth) / 2);
    const phoneRight = phoneLeft + phoneWidth;
    const rightSpace = window.innerWidth - phoneRight - gap;
    const leftSpace = phoneLeft - gap;

    if (rightSpace >= panelWidth) return { x: phoneRight + gap, y: 92 };
    if (leftSpace >= panelWidth) return { x: phoneLeft - panelWidth - gap, y: 92 };

    return { x: Math.max(12, window.innerWidth - panelWidth - 12), y: 92 };
  }

  return { x: Math.max(12, window.innerWidth - 338), y: 76 };
}

function HighlightedText({ text }: { text: string }) {
  const keywordPattern = /(H5|后台|任务详情|任务中心|认证中心|星云币|抽奖机会|未开始|进行中|已结束|已通过|已拒绝|待审核|展示状态|展示排序|前台|拒绝原因|奖励信息|一个平台|单个平台)/;
  const parts = text.split(keywordPattern);

  return (
    <>
      {parts.map((part, index) =>
        keywordPattern.test(part) ? (
          <em key={`${part}-${index}`} style={highlightStyle}>
            {part}
          </em>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        )
      )}
    </>
  );
}

const highlightStyle: CSSProperties = {
  fontStyle: "normal",
  background: "#fff3cd",
  color: "#b45309",
  padding: "1px 5px",
  borderRadius: 3,
  fontWeight: 700,
  fontSize: 12,
};

export function PageAnnotations({ scope = "default" }: { scope?: "h5" | "backend" | "default" }) {
  const location = useLocation();
  const annotation = useMemo(() => findAnnotation(location.pathname), [location.pathname]);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [closed, setClosed] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [position, setPosition] = useState(() => ({ x: 24, y: 96 }));

  useEffect(() => {
    setClosed(true);
    setMinimized(false);
    setPosition(getInitialPosition(scope));
  }, [annotation?.id, scope]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const header = panel.querySelector<HTMLElement>("[data-annotation-drag]");
    if (!header) return;

    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;

    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

    const moveTo = (clientX: number, clientY: number) => {
      const maxLeft = window.innerWidth - panel.offsetWidth - 8;
      const maxTop = window.innerHeight - panel.offsetHeight - 8;
      setPosition({
        x: clamp(startLeft + clientX - startX, 8, Math.max(8, maxLeft)),
        y: clamp(startTop + clientY - startY, 8, Math.max(8, maxTop)),
      });
    };

    const onMouseDown = (event: MouseEvent) => {
      if ((event.target as HTMLElement).closest("button")) return;
      dragging = true;
      startX = event.clientX;
      startY = event.clientY;
      startLeft = panel.offsetLeft;
      startTop = panel.offsetTop;
      event.preventDefault();
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!dragging) return;
      moveTo(event.clientX, event.clientY);
    };

    const onMouseUp = () => {
      dragging = false;
    };

    const onTouchStart = (event: TouchEvent) => {
      if ((event.target as HTMLElement).closest("button")) return;
      const touch = event.touches[0];
      dragging = true;
      startX = touch.clientX;
      startY = touch.clientY;
      startLeft = panel.offsetLeft;
      startTop = panel.offsetTop;
      event.preventDefault();
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!dragging) return;
      const touch = event.touches[0];
      moveTo(touch.clientX, touch.clientY);
    };

    header.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    header.addEventListener("touchstart", onTouchStart, { passive: false });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onMouseUp);

    return () => {
      header.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      header.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onMouseUp);
    };
  }, [annotation?.id, closed, minimized]);

  if (!annotation) return null;

  if (closed) {
    return (
      <button
        type="button"
        onClick={() => setClosed(false)}
        style={{
          position: "fixed",
          right: 18,
          top: 18,
          zIndex: 1000,
          height: 34,
          padding: "0 12px",
          borderRadius: 999,
          border: "1px solid rgba(37,99,235,0.22)",
          background: "rgba(255,255,255,0.96)",
          color: "#2563eb",
          fontSize: 12,
          fontWeight: 800,
          cursor: "pointer",
          boxShadow: "0 12px 30px rgba(15,23,42,0.16)",
          backdropFilter: "blur(14px)",
        }}
      >
        打开页面注释
      </button>
    );
  }

  return (
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        width: "min(320px, calc(100vw - 24px))",
        maxHeight: "min(68vh, 560px)",
        zIndex: 1000,
        borderRadius: 16,
        overflow: "hidden",
        background: "rgba(255,255,255,0.96)",
        border: "1px solid rgba(203,213,225,0.82)",
        boxShadow: "0 22px 60px rgba(15,23,42,0.18)",
        backdropFilter: "blur(18px)",
      }}
    >
      <div
        data-annotation-drag
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          padding: "11px 12px",
          background: "linear-gradient(135deg, rgba(248,250,252,0.98), rgba(239,246,255,0.98))",
          borderBottom: minimized ? "none" : "1px solid rgba(226,232,240,0.9)",
          cursor: "move",
          userSelect: "none",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#0f172a", lineHeight: 1.2 }}>{annotation.title}</div>
          <div style={{ marginTop: 2, fontSize: 11, color: "#64748b" }}>页面功能注释，可拖拽</div>
        </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <button type="button" onClick={() => setMinimized((value) => !value)} style={controlButtonStyle} aria-label="最小化注释">
            {minimized ? "+" : "—"}
          </button>
          <button type="button" onClick={() => setClosed(true)} style={controlButtonStyle} aria-label="关闭注释">
            ×
          </button>
        </div>
      </div>

      {!minimized && (
        <div style={{ padding: 14, overflowY: "auto", maxHeight: "calc(min(68vh, 560px) - 58px)" }}>
          <AnnotationSection title="交互说明" items={annotation.interactions} />
          <AnnotationSection title="逻辑说明" items={annotation.logic} logic />
        </div>
      )}
    </div>
  );
}

function AnnotationSection({ title, items, logic = false }: { title: string; items: string[]; logic?: boolean }) {
  return (
    <section style={{ marginBottom: logic ? 0 : 14 }}>
      <h4
        style={{
          margin: "0 0 8px",
          paddingBottom: 5,
          borderBottom: "2px solid #f1f5f9",
          color: logic ? "#2563eb" : "#475569",
          fontSize: 12,
          letterSpacing: 0.5,
          fontWeight: 900,
        }}
      >
        {title}
      </h4>
      <ul style={{ margin: 0, paddingLeft: 17, display: "grid", gap: 7 }}>
        {items.map((item) => (
          <li key={item} style={{ color: "#334155", fontSize: 12, lineHeight: 1.62 }}>
            <HighlightedText text={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

const controlButtonStyle: CSSProperties = {
  width: 25,
  height: 25,
  border: "1px solid rgba(203,213,225,0.9)",
  borderRadius: 8,
  background: "#fff",
  color: "#475569",
  fontSize: 14,
  fontWeight: 900,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: 1,
};
