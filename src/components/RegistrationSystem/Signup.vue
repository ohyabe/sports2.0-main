<template>
  <div class="container">
    <div class="content">
      <h1>新增參賽選手</h1>
      <div>
        <label>比賽項目:</label>
        <ul>
          <li v-for="(item, index) in courseItems" :key="index" class="course-item">
            <span class="course-name">{{ item }}</span>
            <div class="input-block">
              <input type="text" v-model="form.participants[item].name" placeholder="輸入參賽選手名稱">
              <input type="text" v-model="commonClass" @input="syncClass" placeholder="輸入參賽選手班級">
            </div>
          </li>
        </ul>
      </div>
      <button @click="submitForm" class="submit-button">提交</button>
      <h1 class="participant-title">參賽選手列表</h1>
      <div class="table-container">
        <table class="participant-table">
          <thead>
            <tr>
              <th>比賽項目</th>
              <th>學生名稱</th>
              <th>學生班級</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="participant in paginatedParticipants" :key="participant.id">
              <td>{{ participant.courseItem }}</td>
              <td>{{ participant.studentName }}</td>
              <td>{{ participant.studentClass }}</td>
            </tr>
          </tbody>
        </table>
        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1">上一頁</button>
          <span>頁數 {{ currentPage }} / {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages">下一頁</button>
        </div>
      </div>
    </div>
    <div class="content">
      <h1 class="my-students-title">我的學生</h1>
      <div class="center-content">
        <div class="form-group">
          <label for="teacherName">教師名稱:</label>
          <input type="text" v-model="teacherName" id="teacherName">
        </div>
        <div class="form-group">
          <label for="teacherPassword">教師密碼:</label>
          <input type="password" v-model="teacherPassword" id="teacherPassword">
        </div>
        <div class="form-group">
          <label for="selectCourseItem">選擇比賽項目:</label>
          <select v-model="selectedCourseItem" id="selectCourseItem">
            <option v-for="(item, index) in courseItems" :key="index" :value="item">{{ item }}</option>
          </select>
        </div>
        <div class="form-group">
          <button @click="fetchStudents" class="fetch-button">查詢學生</button>
        </div>
      </div>
      <table v-if="students.length > 0">
        <thead>
          <tr>
            <th>學生名稱</th>
            <th>班級</th>
            <th>郵箱</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student.id" @click="fillStudentName(student.studentName)">
            <td>{{ student.studentName }}</td>
            <td>{{ student.cla }}</td>
            <td>{{ student.studentEmail }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { reactive } from 'vue';

export default {
  data() {
    return {
      participants: [],
      form: reactive({
        participants: {}
      }),
      courseItems: [],
      students: [],
      teacherName: '',
      teacherPassword: '',
      commonClass: '', // 追蹤共用班級值
      selectedCourseItem: '', // 追蹤選擇的比賽項目
      currentPage: 1,
      itemsPerPage: 10
    };
  },
  computed: {
    paginatedParticipants() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.participants.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.participants.length / this.itemsPerPage);
    }
  },
  created() {
    this.fetchParticipants();
    this.fetchCourseItems();
  },
  methods: {
    fetchParticipants() {
      axios.get('http://localhost:8080/participants')
        .then(response => {
          this.participants = response.data;
        })
        .catch(error => {
          console.error("獲取參賽選手數據時出錯!", error);
        });
    },
    fetchCourseItems() {
      axios.get('http://localhost:8080/participants/courseItems')
        .then(response => {
          this.courseItems = response.data;
          this.initializeFormParticipants();
          if (this.courseItems.length > 0) {
            this.selectedCourseItem = this.courseItems[0]; // 預設選中第一個比賽項目
          }
        })
        .catch(error => {
          console.error("獲取比賽項目數據時出錯!", error);
        });
    },
    initializeFormParticipants() {
      this.courseItems.forEach(item => {
        this.form.participants[item] = { name: '', class: '' };
      });
    },
    fetchStudents() {
      if (this.teacherName && this.teacherPassword) {
        axios.get(`http://localhost:8080/students/byClass`, {
          params: {
            teacherName: this.teacherName,
            teacherPassword: this.teacherPassword
          }
        })
        .then(response => {
          this.students = response.data;
          console.log(this.students);
        })
        .catch(error => {
          console.error("獲取學生數據時出錯!", error);
        });
      } else {
        alert('請輸入教師名稱和密碼');
      }
    },
    syncClass() {
      for (const item in this.form.participants) {
        this.form.participants[item].class = this.commonClass;
      }
    },
    submitForm() {
      const formData = [];
      for (const [courseItem, details] of Object.entries(this.form.participants)) {
        if (details.name && details.class) {
          formData.push({
            courseItem,
            studentName: details.name,
            studentClass: details.class
          });
        }
      }
      axios.post('http://localhost:8080/participants', formData)
        .then(response => {
          this.participants.push(...response.data);
          this.resetForm();
        })
        .catch(error => {
          console.error("提交表單時出錯!", error);
        });
    },
    resetForm() {
      this.form.participants = {};
      this.commonClass = '';
      if (this.courseItems.length > 0) {
        this.selectedCourseItem = this.courseItems[0]; // 重置時預設選中第一個比賽項目
      }
      this.initializeFormParticipants();
    },
    fillStudentName(studentName) {
      if (this.selectedCourseItem) {
        this.form.participants[this.selectedCourseItem].name = studentName;
      } else {
        alert('請選擇比賽項目');
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  },
  watch: {
    commonClass: 'syncClass'
  }
};
</script>

<style scoped>
/* 添加一些樣式來美化表格 */

button {
  background-color: rgb(97, 192, 205); /* 设置按钮背景颜色 */
  border: none; /* 取消外框 */
  box-shadow: none; /* 取消阴影 */
  color: white; /* 设置按钮文字颜色为白色 */
  padding: 10px 20px; /* 调整按钮内边距 */
  cursor: pointer; /* 鼠标悬停时显示手型指针 */
}

button:hover {
  background-color: rgb(77, 162, 175); /* 鼠标悬停时按钮颜色变化 */
}

button:disabled {
  background-color: rgb(200, 200, 200); /* 禁用状态下按钮颜色 */
  cursor: not-allowed; /* 禁用状态下鼠标显示禁止符号 */
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70%;
  margin: 20px auto;
}

.content {
  width: 100%;
  margin-bottom: 40px;
}

h1 {
  text-align: center;
}

.my-students-title {
  margin-top: 40px; /* 添加 margin-top 调整间距 */
}

.course-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  margin-left: 100px; /* 只調整這裡 */
}

.course-name {
  flex: 0 0 130px; /* 固定寬度，根據需要調整 */
}

.input-block {
  display: flex; /* 修改為橫向排列 */
  flex-direction: row; /* 確保輸入框平行排列 */
  width: 100%;
}

.input-block input {
  margin-bottom: 5px;
  width: 40%; /* 調整輸入框寬度為目前的一半 */
  margin-right: 10px; /* 增加右邊距離 */
}

button.submit-button {
  float: right; /* 將按鈕移到右邊 */
  margin-top: 10px; /* 增加上邊距，與其他內容保持距離 */
  margin-right: 150px; /* 調整此值以確保按鈕稍微向左移動 */
}

.participant-title {
  margin-top: 80px; /* 調整此值以確保標題有適當的上邊距 */
  text-align: center; /* 使標題居中 */
}

.table-container {
  overflow-x: auto;
  width: 70%; /* 調整表格容器的寬度 */
  margin: 0 auto; /* 使表格容器居中 */
}

table.participant-table {
  width: 100%; /* 調整表格的寬度以匹配容器 */
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
  text-align: left;
}

tbody tr {
  cursor: pointer;
}
tbody tr:hover {
  background-color: #f1f1f1;
}

.center-content {
  display: flex;
  flex-direction: column;
  align-items: center; /* 確保所有元素置中 */
  margin-top: 20px;
}

.form-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
}

.form-group label {
  margin-right: 5px; /* 調整這裡的值，使label與輸入框的間距更近 */
  width: 100px; /* 固定label的寬度，使所有label對齊 */
}

.form-group input,
.form-group select {
  width: 200px; /* 設置輸入框和下拉框的寬度 */
}

button.fetch-button {
  width: auto; /* 确保按钮宽度自适应内容 */
  padding: 5px 10px; /* 调整按钮内边距 */
  margin-top: 10px; /* 增加上邊距，與其他內容保持距離 */
  margin-left: 105px; /* 調整此值以確保按鈕向右移動 */
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 10px;
  padding: 5px 10px;
}
</style>