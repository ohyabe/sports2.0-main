<template>
  <div>
    <!-- 導覽列 -->
    <div class="navbar">
      <!-- 導覽連結容器 -->
      <div class="links">
        <!-- 動態生成導航連結 -->
        <template v-for="(link, index) in links" :key="link.path">
          <div class="nav-item" @mouseover="showSubMenu(index)" @mouseleave="hideSubMenu()">
            <RouterLink :to="link.path" :class="{ active: index === activeIndex }">
              {{ link.name }}
            </RouterLink>
            <!-- 下拉選單 -->
            <div v-if="index === activeSubMenuIndex" class="sub-menu">
              <RouterLink v-for="(subLink, subIndex) in link.subLinks" :key="subLink.path" :to="subLink.path" class="sub-menu-item" :class="{ active: subLink.path === route.path }">
                {{ subLink.name }}
              </RouterLink>
            </div>
          </div>
        </template>
      </div>
      <!-- 登入訊息 -->
      <div class="welcome-message">
        {{ userType }}管理員，你好~
        <button @click="handleLogout" style="background: #84C1FF;">登出</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import store from '../../stores/appStore.js'; // 引入 store

const router = useRouter();

const handleLogout = () => {
  store.dispatch('logout');
  router.push('/');
};

const route = useRoute();

const activeIndex = ref(0);
const activeSubMenuIndex = ref(-1);
const userType = store.state.userType;  // 讀取 userType

const links = [
{ name: '權限管理系統', path: '/', subLinks: [
      { name: '學生', path: '/viewstudent' },
      { name: '老師', path: '/viewteacher' },
      { name: '管理員', path: '/viewadmin' }
    ]},
  { name: '表單創建', path: '/', subLinks: [
      { name: '報名前賽程制定', path: '/formproducer' },
      { name: '單淘汰賽程表產生器', path: '/SingleElimination' },
      { name: '競賽田賽報名表產生器', path: '/CompetitionProducer' }
    ]},
  { name: '運動會報名系統', path: '/about', subLinks: [
      { name: '查看賽程', path: '/schedule' },
      { name: '報名系統', path: '/signup' }
    ]},
  { name: '運動會賽程總表', path: '/score', subLinks: [
      { name: '賽程表管理', path: '/schedulechange' },
      { name: '選手名單', path: '/playerlist' },
      { name: '查詢總表', path: '/atheleteorder' }
    ]},
  { name: '成績輸入計算系統', path: '/contact', subLinks: [
      { name: '輸入成績', path: '/performanceinput' },
      { name: '計算積分', path: '/scoreinput' },
      { name: '成績查詢', path: '/viewperformance' },
      { name: '獎狀下載', path: '/certificate' },
    ]},
  { name: '意見反應系統', path: '/contact' }
];

watch(route, () => {
  activeIndex.value = links.findIndex(link => link.path === route.path);
});

function showSubMenu(index) {
  activeSubMenuIndex.value = index;
}

function hideSubMenu() {
  activeSubMenuIndex.value = -1;
}
</script>

<style scoped>
/* 通用樣式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.content {
  height: 100dvh;
  padding: 5%;
  background-color: #f0f0f0;
}

/* 導覽列樣式 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: #ffffff;
  border-bottom: 1px solid #d9d9d9;
}

/* 歡迎訊息樣式 */
.welcome-message {
  font-size: 1.2em;
  font-weight: bold;
}

/* 導覽連結容器樣式 */
.links {
  display: flex;
  position: relative;
}

/* 導覽連結樣式 */
.nav-item {
  position: relative;
  margin-right: 20px;
}

.nav-item a {
  color: #000;
  text-decoration: none;
  padding: 10px 15px;
  display: block;
  position: relative;
}

.nav-item a:hover {
  background-color: #f0f0f0;
  border-radius: 4px;
}

.nav-item:hover .sub-menu {
  display: block;
}

/* 下拉選單樣式 */
.sub-menu {
  display: none;
  position: absolute;
  width: 100%;
  margin-top: 2.8%;
  top: 100%;
  left: 0;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 999;
  border-radius: 4px;
  overflow: hidden;
}

.sub-menu a {
  display: block;
  padding-top: 8px;
  padding-bottom: 8px;
  text-align: center;
  color: #000;
  text-decoration: none;
  transition: background-color 0.3s;
  position: relative;
}

.sub-menu a:hover {
  background-color: #f0f0f0;
}

/* 底線樣式 */
.links a::after, .sub-menu a::after {
  content: '';
  position: absolute;
  width: 100%;
  left: 50%;
  bottom: -2px;
  height: 2px;
  width: 0;
  background: #84C1FF;
  transition: width 0.3s ease, left 0.3s ease;
}

/* 當前活躍連結的底線樣式 */
.links a.active::after, .sub-menu a.active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  height: 2px;
  width: 100%;
  background: #84C1FF;
  transition: width 0.3s ease, left 0.3s ease;
}

/* 滑鼠懸停時底線樣式 */
.links a:hover::after, .sub-menu a:hover::after {
  width: 100%;
  left: 0;
}

.sub-menu a {
  animation-duration: 1s;
  animation-fill-mode: both;
}

@keyframes a {
  from {
    transform: translate3d(0, 100%, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}

a {
  animation-name: a;
}

.welcome-message {
  display: flex;
  width: 17%;
  justify-content: space-between;
  align-items: center;
}
button {
  display: inline-block;
  cursor: pointer;
  border: none;
  outline: none;
  border-radius: 10%;
  background-color: transparent;
  padding: 3%;
  font-size: 14px;
  font-weight: bold;
  color: #000;
  text-decoration: none;
  transition: color 0.3s;
  &:hover {
    color: #ffffff;
  }
}
</style>
