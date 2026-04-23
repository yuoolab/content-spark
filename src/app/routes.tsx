import { createBrowserRouter, redirect } from "react-router";
import { NavShell } from "./user-h5/shared";
import { TaskDetailPage, TaskListPage } from "./user-h5/pages/tasks";
import { AccountVerifyCenterPage, AccountVerifyPage } from "./user-h5/pages/account";
import { SubmitPage } from "./user-h5/pages/submit";
import { MessagesPage, NotFoundPage, RewardsPage, SubmissionDetailPage, SubmissionsPage } from "./user-h5/pages/interactions";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ShopLayout } from "./components/layout/ShopLayout";
import { InteractiveMarketing } from "./components/marketing/InteractiveMarketing";
import { TaskList as BackendTaskList } from "./components/tasks/TaskList";
import { TaskCreate } from "./components/tasks/TaskCreate";
import { ContentReview } from "./components/review/ContentReview";
import { DataDashboard } from "./components/dashboard/DataDashboard";
import { TaskDataDetail } from "./components/dashboard/TaskDataDetail";
import { AccountVerification } from "./components/verification/AccountVerification";
import { PlatformConfig } from "./components/platform/PlatformConfig";
import { MemberInfo } from "./components/members/MemberInfo";
import { MemberList } from "./components/members/MemberList";
import { MemberDetail } from "./components/members/MemberDetail";
import { MemberProfile } from "./components/members/MemberProfile";
import { ThirdPartyAccount } from "./components/members/ThirdPartyAccount";
import { MemberSystem } from "./components/members/MemberSystem";
import { MemberBenefits } from "./components/members/MemberBenefits";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: NavShell,
      children: [
        { index: true, loader: () => redirect("/tasks") },
        { path: "tasks", Component: TaskListPage },
        { path: "tasks/:id", Component: TaskDetailPage },
        { path: "account", Component: AccountVerifyCenterPage },
        { path: "account/verify", loader: () => redirect("/account") },
        { path: "account/verify/:platform", Component: AccountVerifyPage },
        { path: "submit", Component: SubmitPage },
        { path: "submissions", Component: SubmissionsPage },
        { path: "submissions/:id", Component: SubmissionDetailPage },
        { path: "rewards", Component: RewardsPage },
        { path: "messages", Component: MessagesPage },
        { path: "*", Component: NotFoundPage },
      ],
    },
    {
      path: "/backend",
      Component: ShopLayout,
      children: [
        { index: true, loader: () => redirect("/backend/dashboard") },
        { path: "interactive-marketing", Component: InteractiveMarketing },
        {
          path: "member/info",
          Component: MemberInfo,
          children: [
            { index: true, loader: () => redirect("third-party") },
            { path: "list", Component: MemberList },
            { path: "list/:memberId", Component: MemberDetail },
            { path: "profile", loader: () => redirect("/backend/member/info/third-party") },
            {
              path: "third-party",
              Component: ThirdPartyAccount,
              children: [
                { index: true, loader: () => redirect("verification") },
                { path: "verification", Component: AccountVerification },
                { path: "platform-config", Component: PlatformConfig },
              ],
            },
          ],
        },
        { path: "member/system", Component: MemberSystem },
        { path: "member/benefits", Component: MemberBenefits },
        {
          Component: DashboardLayout,
          children: [
            { path: "dashboard", Component: DataDashboard },
            { path: "tasks", Component: BackendTaskList },
            { path: "tasks/create", Component: TaskCreate },
            { path: "tasks/edit/:id", Component: TaskCreate },
            { path: "tasks/:id/data", Component: TaskDataDetail },
            { path: "review", Component: ContentReview },
            { path: "verification", loader: () => redirect("/backend/member/info/third-party/verification") },
            { path: "platform-config", loader: () => redirect("/backend/member/info/third-party/platform-config") },
          ],
        },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL }
);
