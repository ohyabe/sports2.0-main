<template>
  <div class="tabs-container">
     <a-tabs defaultActiveKey="1" @change="handleTabChange" centered>
       <a-tab-pane key="1" tab="輸入成績與名次">
 <div class="container">
   <a-form layout="inline">
     <a-form-item label="賽事項目">
       <a-select v-model="selectedEvent" style="width: 200px" @change="handleEventChange">
         <a-select-option v-for="event in events" :key="event.id" :value="event.id">
           {{ event.id }} {{ event.name }} {{ event.group }}
         </a-select-option>
       </a-select>
     </a-form-item>
     <a-form-item label="類型">
       <a-select v-model="selectedType" style="width: 100px" @change="handleTypeChange">
         <a-select-option value="預賽">預賽</a-select-option>
         <a-select-option value="決賽">決賽</a-select-option>
       </a-select>
     </a-form-item>
     <a-form-item label="年級">
       <a-select v-model="selectedGrade" style="width: 100px" @change="handleGradeChange">
         <a-select-option value="高一">高一</a-select-option>
         <a-select-option value="高二">高二</a-select-option>
         <a-select-option value="高三">高三</a-select-option>
       </a-select>
     </a-form-item>
     <a-button type="primary" @click="submitScores" style="margin-left: 10px; background-color: rgb(97 192 205);">送出成績</a-button>
   </a-form>

   <a-table :dataSource="scores" :columns="filteredColumns" rowKey="id" style="margin-top: 20px">
     <template #headerCell="{ column }">
       <template v-if="column.key === 'rank'">
         <div>
           {{ column.title }}
           <a-button type="primary" @click="generateRanks" style="margin-left: 10px;background-color: rgb(97 192 205);">產生名次</a-button>
         </div>
       </template>
       <template v-else>
         {{ column.title }}
       </template>
     </template>
     <template #bodyCell="{ column, record }">
       <template v-if="column.key === 'projectPerformance'">
         <a-input v-model:value="record.projectPerformance" @change="e => handleChange(record.id, selectedEvent, 'projectPerformance', e.target.value)" />
       </template>
       <template v-else-if="column.key === 'rank'">
         <span>{{ record.rank }}</span>
       </template>
       <template v-else>
         {{ record[column.key] }}
       </template>
     </template>
   </a-table>
 </div>
</a-tab-pane>
</a-tabs>
</div>
</template>

<script setup>
import { useScoreStore } from '@/stores/score.js';
import { storeToRefs } from 'pinia';
import Swal from 'sweetalert2'; // 確保這行正確
import { computed, ref, watch } from 'vue';

const scoreStore = useScoreStore();
const { events, scores, selectedEvent, selectedType, selectedGrade } = storeToRefs(scoreStore);

const currentYear = new Date().getFullYear();
const selectedYear = ref(currentYear);

const columns = ref([
  { title: '歷史成績', dataIndex: 'historicalPerformance', key: 'historicalPerformance' },
  { title: '賽程項目', dataIndex: 'courseItem', key: 'courseItem' },
  { title: '預決賽', dataIndex: 'preMatch', key: 'preMatch' },
  { title: '班級代碼', dataIndex: 'classes', key: 'classes' },
  { title: '姓名', dataIndex: 'studentName', key: 'studentName' },
  { title: '成績', dataIndex: 'projectPerformance', key: 'projectPerformance' },
  { title: '名次', dataIndex: 'rank', key: 'rank' },
]);

const filteredColumns = computed(() => {
  const eventId = selectedEvent.value;
  return columns.value.filter(column => {
    if (eventId >= 17 && eventId <= 19 && column.key === 'studentName') {
      return false;
    }
    return true;
  });
});

watch([selectedEvent, selectedType, selectedGrade, selectedYear], async () => {
  await generateScores();
});

const handleEventChange = async event => {
  selectedEvent.value = event;
  await generateScores();
};

const handleTypeChange = async type => {
  selectedType.value = type;
  await generateScores();
};

const handleGradeChange = async grade => {
  selectedGrade.value = grade;
  await generateScores();
};

const handleYearChange = async year => {
  selectedYear.value = year;
  await generateScores();
};

const generateScores = async () => {
  if (selectedEvent.value && selectedType.value && selectedGrade.value && selectedYear.value) {
    await scoreStore.generateScores(selectedEvent.value, selectedType.value, selectedGrade.value);
  }
};

const generateRanks = () => {
  scoreStore.updateRanks();
};

const handleChange = (id, itemId, field, value) => {
  scoreStore.updateScore(id, itemId, field, value);
};

const submitScores = async () => {
  try {
    await scoreStore.submitScores();
    Swal.fire({
      title: "送出成功!",
      text: "已成功送出成績!",
      icon: "success"
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "送出失敗",
      text: "成績送出失敗!"
    });
  }
};
</script>


<style scoped>
.container {
 display: flex;
 flex-direction: column;
 align-items: center;
}
.tabs-container {
   display: flex;
   justify-content: center;
   margin-top: 20px;
   margin-bottom: 20px;
 }

:where(.css-dev-only-do-not-override-19iuou).ant-table-wrapper {
 clear: both;
 margin: 50px;
 max-width: 100%;
}

:where(.css-dev-only-do-not-override-19iuou).ant-form {
 margin: 30px 60px;
}
.ant-table-tbody > tr:nth-child(odd) > td {
  background-color: #eaf4f9 !important; 
}

.ant-table-tbody > tr:nth-child(even) > td {
  background-color: #ffffff !important; 
}
</style>
