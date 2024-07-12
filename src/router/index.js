import viewadmin from '@/components/Access/ViewAdmin.vue';
import viewstudent from '@/components/Access/ViewStudent.vue';
import viewteacher from '@/components/Access/ViewTeacher.vue';
import Certificate from '@/components/Performance/Certificate.vue';
import PerformanceInput from '@/components/Performance/PerformanceInput.vue';
import ScoreInput from '@/components/Performance/ScoreInput.vue';
import ViewPerformance from '@/components/Performance/ViewPerformance.vue';
import Signup from '@/components/RegistrationSystem/Signup.vue';
import Playerlist from '@/components/Sportsorder/PlayerList.vue';
import schedulechange from '@/components/Sportsorder/ScheduleChange.vue';
import { createRouter, createWebHistory } from 'vue-router';
import CompetitionProducer from '../components/Form/CompetitionProducer.vue';
import Formproducer from '../components/Form/FormProducer.vue';
import SingleElimination from '../components/Form/SingleElimination.vue';
import Login from '../components/Login.vue';
import Schedule from '../components/RegistrationSystem/Schedule.vue';
import ResetPassword from '../components/ResetPassword.vue';
import atheleteorder from '../components/Sportsorder/AtheleteOrder.vue';
import CertificatePage from '../components/Teacher/CertificatePage.vue';
import store from '../stores/appStore.js';
import AdminHome from '../views/AdminHome.vue';
import StudentHome from '../views/StudentHome.vue';
import TeacherHome from '../views/TeacherHome.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('../views/Contact.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/img',
    name: 'img',
    component: () => import('../components/Teacher/Img.vue')
  },
  {
    path: '/edit-photos',
    name: 'edit-photos',
    component: () => import('../components/Teacher/EditPhotos.vue')
  },
  {
    path: '/score',
    name: 'score',
    component: () => import('../views/ScoreInput.vue')
  },
  { path: '/student-home', component: StudentHome },
  { path: '/teacher-home', component: TeacherHome },
  { path: '/admin-home', component: AdminHome },
  {
    path: '/certificatepage',
    name: 'CertificatePage',
    component: CertificatePage,
    props: route => ({
      certificates: route.params.certificates
    })
  },
  {
    path: '/reset_password',
    name: 'ResetPassword',
    component: ResetPassword
  },
  {
    path: '/performanceinput',
    name: 'PerformanceInput',
    component: PerformanceInput
  },
  {
    path: '/viewperformance',
    name: 'viewperformance',
    component: ViewPerformance
  },
  {
    path: '/scoreinput',
    name: 'ScoreInput',
    component: ScoreInput
  },
  {
    path: '/formproducer',
    name: 'Formproducer',
    component: Formproducer
  },
  {
    path: '/SingleElimination',
    name: 'SingleElimination',
    component: SingleElimination
  },
  {
    path: '/CompetitionProducer',
    name: 'CompetitionProducer',
    component: CompetitionProducer
  },
  {
    path: '/Schedule',
    name: 'Schedule',
    component: Schedule
  },
  {
    path: '/Signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/playerlist',
    name: 'playerlist',
    component: Playerlist
  },
  {
    path: '/schedulechange',
    name: 'schedulechange',
    component: schedulechange
  },
  {
    path: '/atheleteorder',
    name: 'atheleteorder',
    component: atheleteorder
  },
  {
    path: '/viewstudent',
    name: 'viewstudent',
    component: viewstudent
  },
  {
    path: '/viewteacher',
    name: 'viewsteacher',
    component: viewteacher
  },
  {
    path: '/viewadmin',
    name: 'viewadmin',
    component: viewadmin
  },
  {
    path: '/certificate',
    name: 'Certificate',
    component: Certificate
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// 全局導航守衛
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.userType !== 'guest'; // 假設 'guest' 表示未登入

  if (to.name !== 'login' && to.name !== 'ResetPassword' && !isAuthenticated) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
