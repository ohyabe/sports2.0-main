<script setup>
import Footer from '@/views/Footer.vue';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import AdminHeader from './components/Header/AdminHeader.vue';
import Header from './components/Header/Header.vue';
import StudentHeader from './components/Header/StudentHeader.vue';
import TeacherHeader from './components/Header/TeacherHeader.vue';


const store = useStore();
const userType = computed(() => store.state.userType);
const router = useRouter();

const getHeaderComponent = () => {
  switch (userType.value) {
    case 'student':
      return StudentHeader;
    case 'teacher':
      return TeacherHeader;
    case 'admin':
      return AdminHeader;
    default:
      return Header;
  }
};

onMounted(() => {
  const publicPages = ['/', '/login', '/reset_password'];
  if (!publicPages.includes(router.currentRoute.value.path) && userType.value === 'guest') {
    router.push('/');
  }
});
</script>

<template>
  <div class="header">
    <component :is="getHeaderComponent()" />
  </div>
  <router-view />
  <Footer />
</template>

<style scoped>
.header {
  /* width: 100dvw; */
}

</style>
