<template>
  
  <div>
    
    <h1>參賽選手列表</h1>
    <table>
      <thead>
        <tr>
          <th>比賽項目</th>
          <th>學生名稱</th>
          <th>學生班級</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="participant in participants" :key="participant.id">
          <td>{{ participant.courseItem }}</td>
          <td>{{ participant.studentName }}</td>
          <td>{{ participant.studentClass }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  
</template>



<script>
import axios from 'axios';


export default {
data() {
  return {
    participants: [],
    
    courseItems: [],
    
  };
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
  
 
},

};
</script>



<style scoped>
/* 添加一些樣式來美化表格 */

table {
width: 100%;
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
</style>
