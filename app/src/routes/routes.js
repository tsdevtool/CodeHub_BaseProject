import React from "react";
import config from "../config/index";

const LoginPage = React.lazy(() => import("../container/Auth/Login"));
const RegisterPage = React.lazy(() => import("../container/Auth/Register"));
const ChangePasswordPage = React.lazy(() =>
  import("../container/Auth/ChangePassword")
);
const ResetPasswordPage = React.lazy(() =>
  import("../container/Auth/ResetPassword")
);
const MainHomePage = React.lazy(() =>
  import("../container/Home/pages/MainHome")
);
const ProfilePage = React.lazy(() => import("../container/Profile/Profile"));
const CodingPage = React.lazy(() =>
  import("../container/Workspace/Code_Editor/code_editor.jsx")
);
// const AIPage = React.lazy(() =>
// 	import('../container/Workspace/AI_chat/AI_chat.jsx'),
// );
const ForgotPasswordPage = React.lazy(() =>
  import("../container/Auth/ForgotPassword/ForgotPassword.jsx")
);

const IndexHomePage = React.lazy(() =>
  import("../container/Home/pages/IndexHome/IndexHome.jsx")
);

// const AdminDashboard = React.lazy(() => import("../container/Admin/Category/index.jsx"));
const AdminLecture = React.lazy(() =>
  import("../container/Admin/Admin_Lectures.jsx")
);

const ProblemPage = React.lazy(() =>
  import("../container/Home/pages/MainHome/ProblemsPage.jsx")
);

// const CoursePage = React.lazy(() =>
// 	import('../container/Home/pages/MainHome/CoursesPage.jsx'),
// );

const ProblemPageAdmin = React.lazy(() =>
  import("../container/Admin/Category/index.jsx")
);

const CoursePageAdmin = React.lazy(() =>
  import("../container/Admin/Admin_Lectures.jsx")
);

const ContactPage = React.lazy(() =>
  import("../container/Home/pages/MainHome/support.jsx")
);
// const Newcourses = React.lazy(() => {
//   import("../container/Home/pages/MainHome/");

const OtpPage = React.lazy(() =>
  import("../container/Auth/OTP-Verification/otp.jsx")
);

const CoursePage = React.lazy(() =>
  import("../components/Course/CourseList")
);

const CourseDetail = React.lazy(() =>
  import("../components/Course/CourseDetails")
);

const Lecture = React.lazy(() =>
  import("../components/Course/Lecture")
);

const SolveProblemPage = React.lazy(() =>
  import("../container/Workspace/Code_Editor/code_editor.jsx")
);

const CommunityPage = React.lazy(() =>
  import("../container/Community/main_feed.jsx")
);

const PlayGroundPage = React.lazy(() =>
  import("../container/playground/Playground.jsx")
);

const PostDetailPage = React.lazy(() =>
  import("../container/Community/PostDetail.jsx")
);

const MyPostsPage = React.lazy(() =>
  import("../container/Community/my_posts.jsx")
);

const publicRoute = [
  {
    path: config.routes.contactPage,
    component: ContactPage,
  },
  {
    path: config.routes.login,
    component: LoginPage,
  },
  {
    path: config.routes.register,
    component: RegisterPage,
  },
  {
    path: config.routes.resetPassword,
    component: ResetPasswordPage,
  },
  {
    path: config.routes.forgotPassword,
    component: ForgotPasswordPage,
  },
  {
    path: config.routes.indexHome,
    component: IndexHomePage,
  },
  {
    path: config.routes.otp,
    component: OtpPage,
  },
  {
    path: config.routes.communityPage,
    component: CommunityPage,
  },
  {
    path: config.routes.solveProblem,
    component: SolveProblemPage,
  },
  {
    path: config.routes.playgroundPage,
    component: PlayGroundPage,
  },
  {
    path: config.routes.detailPost,
    component: PostDetailPage,
  },
  {
    path: config.routes.myPosts,
    component: MyPostsPage,
  },
];

const protectedRoute = [
  {
    path: config.routes.coursePage,
    component: CoursePage,
  },
  {
    path: config.routes.courseDetail,
    component: CourseDetail,
  },
  {
    path: config.routes.lecture,
    component: Lecture,
  },
  {
    path: config.routes.problemPage,
    component: ProblemPage,
  },
  {
    path: config.routes.home,
    component: MainHomePage,
  },
  {
    path: config.routes.profile,
    component: ProfilePage,
  },
  {
    path: config.routes.coding,
    component: CodingPage,
  },
  {
    path: config.routes.changePassword,
    component: ChangePasswordPage,
  },
];

const adminRoute = [
  // {
  //   path: config.routes.admin.dashboard,
  //   component: AdminDashboard,
  // },
  {
    path: config.routes.admin.lecture,
    component: AdminLecture,
  },
  {
    path: config.routes.admin.problemPageAdmin,
    component: ProblemPageAdmin,
  },
  {
    path: config.routes.admin.coursePageAdmin,
    component: CoursePageAdmin,
  },
];

export { adminRoute, protectedRoute, publicRoute };
