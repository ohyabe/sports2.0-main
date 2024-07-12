<template>
  <div class="content">
    <a-table :columns="columns" :data-source="data" row-key="id" bordered>
      比賽公告
    </a-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        { title: '序號', dataIndex: 'id', key: 'id' },
        { title: '標題', dataIndex: 'title', key: 'title' },
        { title: '日期', dataIndex: 'date', key: 'date' },
        { title: '資料建立者', dataIndex: 'author', key: 'author' },
      ],
      data: [
        { id: 1, title: '國立新竹高級工業職業學校新興科技發展推廣中心辦理「2024新興科技機器人競賽」', date: '2024-06-28', author: '圖書館' },
        { id: 2, title: '國立虎尾高級農工職業學校新興科技發展推廣中心辦理「113年全國高級中等學校新興科技示範創新應用專題競賽」', date: '2024-06-27', author: '圖書館' },
        { id: 3, title: '第五屆蘭文學獎', date: '2024-06-25', author: '圖書館' },
        { id: 4, title: '台中家商承辦「我思故我在 - SDGs全國高中高職創意企劃書事賽』，請惠予子協力並鼓勵貴校學生踴躍報名參加', date: '2024-06-24', author: '圖書館' },
        { id: 5, title: '國立公共事務學院理事會「2024永續未來共創會」', date: '2024-06-18', author: '圖書館' },
        { id: 6, title: '南洋大學理學院辦理「2024春季高級職業訓練一日會』宣導會', date: '2024-06-18', author: '圖書館'},
        { id: 7, title: '海青高級商業職業學校「新興科技技術發展推廣中心」辦理2024全國VR活動', date: '2024-06-14', author: '圖書館' },
      ],
    };
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.content {
  height: 100dvh;
  padding: 3.5% 3.5%;
  background-color: #f0f0f0;
}

a-table {
  margin: 16px;
}

a-icon {
  margin-right: 8px;
}
</style>
