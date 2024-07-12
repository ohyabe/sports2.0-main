<template>
  <div>
    <div class="tabs-container">
      <a-tabs v-model:activeKey="activeTab" centered>
        <a-tab-pane key="1" tab="計算項目積分">
          <div>
            <a-form layout="inline">
              <a-form-item label="賽事項目">
                <a-select v-model="selectedEvent" style="width: 200px" @change="handleEventChange">
                  <a-select-option v-for="event in events" :key="event.id" :value="event.id">
                    {{ event.id }} {{ event.name }} {{ event.group }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="年級">
                <a-select v-model="selectedGrade" style="width: 100px" @change="handleGradeChange">
                  <a-select-option value="高一">高一</a-select-option>
                  <a-select-option value="高二">高二</a-select-option>
                  <a-select-option value="高三">高三</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="年度">
                <a-select v-model="selectedYear" style="width: 100px" @change="handleYearChange">
                  <a-select-option :value="currentYear">{{ currentYear }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-button type="primary" @click="submitScores" style="margin-left: 10px;background-color: rgb(97 192 205);">送出積分</a-button>
            </a-form>

            <a-table :dataSource="scores" :columns="filteredColumns" rowKey="id" style="margin-top: 20px">
              <template #headerCell="{ column }">
                <template v-if="column.key === 'projectScore'">
                  <div>
                    {{ column.title }}
                    <a-button type="primary" @click="generateProjectScores" style="margin-left: 10px;background-color: rgb(97 192 205);">產生積分</a-button>
                  </div>
                </template>
                <template v-else>
                  {{ column.title }}
                </template>
              </template>
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'projectScore'">
                  <span>{{ record.projectScore }}</span>
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

        <a-tab-pane key="2" tab="計算班級總積分">
          <div>
            <a-form layout="inline">
              <a-form-item label="年級">
                <a-select v-model="selectedClassGrade" style="width: 100px" @change="handleClassGradeChange">
                  <a-select-option value="高一">高一</a-select-option>
                  <a-select-option value="高二">高二</a-select-option>
                  <a-select-option value="高三">高三</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="班級">
                <a-select v-model="selectedClass" style="width: 100px" @change="handleClassChange" placeholder="班級">
                  <a-select-option v-for="classOption in filteredClasses" :key="classOption" :value="classOption">
                    {{ classOption }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-button type="primary" @click="submitTotalScores" style="margin-left: 10px; background-color: rgb(97 192 205); border-color: rgb(97 192 205);">送出總積分</a-button>
            </a-form>

            <a-table :columns="totalScoreColumns" :dataSource="totalScores" rowKey="id" style="margin-top: 20px">
              <template #headerCell="{ column }">
                <template v-if="column.key === 'totalScore'">
                  <div>
                    {{ column.title }}
                    <a-button type="primary" @click="calculateTotalScores" style="margin-left: 10px; background-color: rgb(97 192 205); border-color: rgb(97 192 205);">計算總積分</a-button>
                  </div>
                </template>
                <template v-else>
                  {{ column.title }}
                </template>
              </template>
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'totalScore'">
                  <span>{{ record.totalScore }}</span>
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
  </div>
</template>

<script setup>
import { useScoreStore } from '@/stores/score';
import { storeToRefs } from 'pinia';
import Swal from 'sweetalert2'; // 確保這行正確
import { computed, ref, watch } from 'vue';

const activeTab = ref('1');

const scoreStore = useScoreStore();
const { events, scores, selectedEvent, selectedGrade } = storeToRefs(scoreStore);

const currentYear = new Date().getFullYear();
const selectedYear = ref(currentYear);
const selectedClassGrade = ref(null);
const selectedClass = ref(null);

const columns = ref([
  { title: '歷史成績', dataIndex: 'historicalPerformance', key: 'historicalPerformance' },
  { title: '賽程項目', dataIndex: 'courseItem', key: 'courseItem' },
  { title: '預決賽', dataIndex: 'preMatch', key: 'preMatch' },
  { title: '班級代碼', dataIndex: 'classes', key: 'classes' },
  { title: '姓名', dataIndex: 'studentName', key: 'studentName' },
  { title: '成績(時間)', dataIndex: 'projectPerformance', key: 'projectPerformance' },
  { title: '名次', dataIndex: 'rank', key: 'rank' },
  { title: '項目積分', dataIndex: 'projectScore', key: 'projectScore' },
]);

const filteredColumns = computed(() => {
  const eventId = selectedEvent.value;
  return columns.value.filter(column => {
    if (eventId >= 17 && eventId <= 19 && column.key === 'studentName') {
      return false;
    }
    return column.key !== 'group';
  });
});

watch([selectedEvent, selectedGrade, selectedYear], async () => {
  await generateScores();
});

const handleEventChange = async event => {
  selectedEvent.value = event;
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
  if (selectedEvent.value && selectedGrade.value && selectedYear.value) {
    await scoreStore.generateScores(selectedEvent.value, '決賽', selectedGrade.value);
  }
};

const generateProjectScores = () => {
  console.log('Button clicked for generating project scores...');
  scoreStore.generateProjectScores();
};

const submitScores = async () => {
  try {
    await scoreStore.submitScores();
    Swal.fire({
      title: "送出成功!",
      text: "已成功送出積分!",
      icon: "success"
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "送出失敗",
      text: "積分送出失敗!"
    });
  }
};

// TotalScore section
const classes = ref([]);
const totalScores = ref([]);
const totalScoreColumns = ref([
  { title: '歷史成績', dataIndex: 'historicalPerformance', key: 'historicalPerformance' },
  { title: '賽程項目', dataIndex: 'courseItem', key: 'courseItem' },
  { title: '預決賽', dataIndex: 'preMatch', key: 'preMatch' },
  { title: '班級代碼', dataIndex: 'classes', key: 'classes' },
  { title: '姓名', dataIndex: 'studentName', key: 'studentName' },
  { title: '成績(時間)', dataIndex: 'projectPerformance', key: 'projectPerformance' },
  { title: '名次', dataIndex: 'ranking', key: 'ranking' },
  { title: '項目積分', dataIndex: 'projectScore', key: 'projectScore' },
  { title: '計算總積分', dataIndex: 'totalScore', key: 'totalScore' }
]);

const filteredClasses = computed(() => {
  if (selectedClassGrade.value === '高一') {
    return ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116'];
  } else if (selectedClassGrade.value === '高二') {
    return ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216'];
  } else if (selectedClassGrade.value === '高三') {
    return ['301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316'];
  }
  return [];
});

watch(selectedClassGrade, () => {
  selectedClass.value = null;
});

const handleClassGradeChange = grade => {
  selectedClassGrade.value = grade;
};

const handleClassChange = async (value) => {
  console.log('Handling class change:', value);
  selectedClass.value = value;
  await fetchClassData(value);
};

const fetchClassData = async (classes) => {
  if (!classes) {
    console.error('Selected Class is null or undefined');
    return;
  }
  console.log('Fetching data for class:', classes);
  const response = await fetch(`http://localhost:8080/score/individualPerformances/classes/${classes}`);
  const data = await response.json();
  console.log('Fetched scores:', data);
  totalScores.value = data;
};

const calculateTotalScores = () => {
  // 計算總積分邏輯
  const totalScore = totalScores.value.reduce((sum, score) => sum + (score.projectScore || 0), 0);
  totalScores.value.forEach(score => {
    score.totalScore = totalScore;
  });
};

const submitTotalScores = async () => {
  try {
    const data = totalScores.value.map(score => ({
      academicYear: score.academicYear,
      id: score.id,
      historicalPerformance: score.historicalPerformance,
      itemId: score.itemId,
      courseItem: score.courseItem,
      preMatch: score.preMatch,
      classes: score.classes,
      studentName: score.studentName || '',
      projectPerformance: score.projectPerformance,
      breakRecord: score.breakRecord,
      ranking: score.rank,
      projectScore: score.projectScore,
      totalScore: score.totalScore
    }));

    const response = await fetch('http://localhost:8080/score/individualPerformances/batch', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      Swal.fire({
        title: "送出成功!",
        text: "已成功送出總積分!",
        icon: "success"
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "送出失敗",
        text: "總積分送出失敗!"
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "送出失敗",
      text: "總積分送出失敗!"
    });
  }
};
</script>

<style >
:where(.css-dev-only-do-not-override-19iuou).ant-table-wrapper {
  clear: both;
  margin: 50px;
  max-width: 100%;
}

:where(.css-dev-only-do-not-override-19iuou).ant-form {
  margin: 30px 60px;
}

.tabs-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

/* 逐行變色的樣式 */
.ant-table-tbody > tr:nth-child(odd) > td {
  background-color: #eaf4f9 !important; 
}

.ant-table-tbody > tr:nth-child(even) > td {
  background-color: #ffffff !important; 
}
</style>

