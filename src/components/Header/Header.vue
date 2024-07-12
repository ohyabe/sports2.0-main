<template>
    <div>
      <!-- 導覽列 -->
      <div class="navbar">
        
        <!-- 導覽連結容器 -->
        <div class="links">
          
          <!-- 動態生成導航連結 -->
          <template v-for="(link, index) in links" :key="link.path">
            <div class="nav-item" @mouseover="showSubMenu(index)" @mouseleave="hideSubMenu()">
              <RouterLink 
                :to="link.path"
                :class="{ active: index === activeIndex }"
              >
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
        <!-- 登入按鈕 -->
        <RouterLink to="/login">
          <a-button type="primary" >登入</a-button>
        </RouterLink>
      </div>
      
  
      <!-- 內容區 -->
      <!-- <RouterView /> -->
  
      <!-- 頁腳 -->
      <!-- <a-layout-footer style="text-align: center; margin-top: 20px;">
        運動會管理系統 ©2024 Created by 9527
      </a-layout-footer> -->
    </div>
  
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
  
  const route = useRoute();
  
  const activeIndex = ref(0);
  const activeSubMenuIndex = ref(-1);
  
  const links = [
  { name: '最新消息', path: '/' },
    { name: '活動花絮', path: '/about' },
    { name: '圖片上傳', path: '/img' },
    { name: '圖片編輯', path: '/edit-photos' },
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
    background: hsl(197, 54%, 65%);
    border-bottom: 1px solid #d9d9d9;
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
    font-weight: bold;
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
    height: 5.1rem;
    /* margin-left: .23rem; */
  
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
    background: #083868;
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
    background: #083868;
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
  
  button {
    text-align: center;
    line-height: 14px;
    cursor: pointer;
    border: 1.5px solid white;
    outline: none;
    background: hsl(197, 54%, 65%);
    /* background-color: transparent; */
    padding: 20%;
    margin: 0;
    font-size: 14px;
    font-weight: bolder;
    color: #000;
    text-decoration: none;
    transition: color 0.3s;
    &:hover {
      background: hsl(197, 54%, 65%);
      font-weight: bolder;
      color: #fff;
    }

  
  }
  
  </style>
  