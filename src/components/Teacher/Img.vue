<!-- 上傳照片頁面 -->
<template>
  <div class="container">
    <div class="form-group">
      <label for="albumName" class="col-sm-2 control-label">相簿名稱:</label>
      <div class="col-sm-10">
        <input type="text" v-model="albumName" id="albumName" placeholder="輸入相簿名稱">
      </div>
    </div>
    <div class="form-group">
      <label for="logoFile" class="col-sm-2 control-label">活動照片:</label>
      <div class="col-sm-10">
        <input type="hidden" name="img" id="photoUrl"/>
        <input type="file" name="logoFile" id="logoFile" multiple @change="setImg">
        <div v-for="(url, index) in previewUrls" :key="index" class="photo-container">
          <span><img :src="url" width="300" height="197"/></span>
          <button @click="removePreview(index)">刪除</button>
        </div>
        <button @click="publishPhotos" class="release">發佈</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      albumName: '',
      previewUrls: [],
      photoFiles: []
    };
  },
  methods: {
    setImg(event) {
      const fileInput = event.target;
      const files = Array.from(fileInput.files);
      
      for (let file of files) {
        if (!/\.(png|jpg|bmp|gif|PNG|JPG|BMP|GIF)$/.test(file.name)) {
          alert("類型必須是圖片(.png|jpg|bmp|gif|PNG|JPG|BMP|GIF)");
          return false;
        }
        this.photoFiles.push(file);
        const url = URL.createObjectURL(file);
        this.previewUrls.push(url);
      }
    },
    removePreview(index) {
      this.previewUrls.splice(index, 1);
      this.photoFiles.splice(index, 1);
    },
    async publishPhotos() {
      if (!this.albumName.trim()) {
        alert("請輸入相簿名稱");
        return;
      }

      const data = new FormData();
      data.append('albumName', this.albumName);
      for (let file of this.photoFiles) {
        data.append('files', file);
      }

      try {
        const response = await fetch("http://localhost:8080/business/uploadAlbum", {
          method: 'POST',
          body: data,
        });

        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }

        const ret = await response.json();

        if (ret.code === 0) {
          alert(ret.message);
          this.$router.push('/about');
        } else {
          alert(ret.message);
        }
      } catch (error) {
        console.error('Error:', error);
        alert("上傳失敗，請檢查網絡後重試");
      }
    }
  }
};
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  height: 100%;
  padding: 3% 3.5%;
  background-color: #f0f0f0;
}

.form-group {
  padding-top: 5%;
  
  text-align: center;
}
label{
  font-size: large;
  font-weight: bolder;
}

.photo-container {
  display: inline-block;
  margin: 10px;
  position: relative;
  
}

.photo-container button {
  position: absolute;
  top: 80%;
  right: 43%;
  background-color: hsl(197, 54%, 65%);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 5px;
}

.photo-container button:hover {
  background-color: hsl(197, 54%, 65%);
}

.release{
  background-color: hsl(197, 54%, 65%);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-content: center;
  justify-content: center;
  margin: 0 auto;


}
</style>
