<template>
  
  <div class="main">
    <section>
      <div class="results">
          <h1>賽程表生成器</h1>
            <label for="participant-count">輸入參賽人數:</label>
            <input
              id="participant-count"
              type="number"
              v-model="participantCount"
              @change="handleParticipantCountChange"
              min="1"
              max="50"
            />
          <button @click="generateSchedule">生成賽程表</button>
      </div>


    <div v-if="groups.length > 0" class="schedule">

      <div class="area">
        <h2>賽程表</h2>
          <div class="group-container" ref="groupContainer">
            <div v-for="(group, index) in groups" :key="index" class="group">
              <h3>組 {{ index + 1 }}</h3>
                <svg :id="'svg-' + index" :width="100" :height="100" xmlns="http://www.w3.org/2000/svg">
                <polygon :points="generatePolygonPoints(group.length, 50, 50, 40)" stroke="black" fill="none" />
                </svg>
            </div>
          </div>
      </div>

        <div class="area2">
          <h2>決賽</h2>
            <svg ref="finalSvg" :width="100" :height="100" xmlns="http://www.w3.org/2000/svg">
              <polygon :points="generatePolygonPoints(finalists.length, 50, 50, 40)" stroke="black" fill="none" />
            </svg>
        </div>


  </div>
</section>
<section>
  <GeneratorView />
</section>
  </div>
<div class="download-button">
  <button @click="downloadAllImages" >下載所有圖片</button>
</div>


</template>

<script>
import GeneratorView from './GeneratorView.vue';
export default {
  components: {
    GeneratorView
  },
  data() {
    return {
      participantCount: 0, // 預設參賽人數，可以為空
      participants: [],
      groups: [],
      finalists: []
    };
  },
  methods: {
    handleParticipantCountChange() {
      this.participants = [];
      this.groups = [];
      this.finalists = [];
    },
    shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    },
    generateParticipants() {
      this.participants = [];
      const maxParticipants = Math.min(this.participantCount, 50);
      for (let i = 1; i <= maxParticipants; i++) {
        this.participants.push(`選手 ${i}`);
      }
    },
    generateGroups() {
      this.shuffle(this.participants);

      const participantCount = Math.min(this.participants.length, 50);
      let numberOfGroups;
      if (participantCount <= 19) {
        numberOfGroups = Math.ceil(participantCount / 6);
      } else if (participantCount <= 25) {
        numberOfGroups = 4;
      } else if (participantCount <= 30) {
        numberOfGroups = 5;
      } else if (participantCount <= 36) {
        numberOfGroups = 6; 
      } else if (participantCount <= 42) {
        numberOfGroups = 7; 
      } else if (participantCount <= 48) {
        numberOfGroups = 8; 
      } else {
        numberOfGroups = Math.ceil(participantCount / 5);
      }

      let groupSize = Math.floor(participantCount / numberOfGroups);
      let remainder = participantCount % numberOfGroups;

      let startIndex = 0;
      for (let i = 0; i < numberOfGroups; i++) {
        let endIndex = startIndex + groupSize + (remainder > 0 ? 1 : 0);
        this.groups.push(this.participants.slice(startIndex, endIndex));
        startIndex = endIndex;
        if (remainder > 0) remainder--;
      }
    },
    generateFinalists() {
      this.finalists = [];
      if (this.participantCount <= 30) {
        for (let group of this.groups) {
          this.finalists.push(group[0]);
        }
        let remainingFinalistsCount = this.groups.length;
        for (let i = this.groups.length; i < this.groups.length * 2; i++) {
          if (i < this.participants.length) {
            this.finalists.push(this.participants[i]);
          }
        }
      } else if (this.participantCount <= 48) {
        for (let group of this.groups) {
          this.finalists.push(group[0]);
        }
      }
    },
    generateSchedule() {
      if (this.participantCount > 50) {
        alert("參賽人數不能超過50人");
        return;
      }
      this.generateParticipants();
      this.generateGroups();
      this.generateFinalists();
    },
    generatePolygonPoints(sides, centerX, centerY, radius) {
      const points = [];
      for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        points.push(`${x},${y}`);
      }
      return points.join(" ");
    },
    svgToDataUrl(svgElement) {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);
      const base64 = btoa(svgString);
      return `data:image/svg+xml;base64,${base64}`;
    },
    async downloadAllImages() {
      const svgElements = this.$refs.groupContainer.querySelectorAll('svg');
      const finalSvg = this.$refs.finalSvg;

      const svgUrls = Array.from(svgElements).map(this.svgToDataUrl);
      svgUrls.push(this.svgToDataUrl(finalSvg));

      const images = await Promise.all(svgUrls.map(url => this.loadImage(url)));
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const totalHeight = images.reduce((sum, img) => sum + img.height, 0);
      const maxWidth = Math.max(...images.map(img => img.width));

      canvas.width = maxWidth;
      canvas.height = totalHeight;

      let yOffset = 0;
      images.forEach(img => {
        context.drawImage(img, 0, yOffset);
        yOffset += img.height;
      });

      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'schedule.jpg';
        link.click();
        URL.revokeObjectURL(url);
      });
    },
    loadImage(url) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
    }
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}


.main {
  display: flex;
  justify-content: space-between;

  padding: 5%;
  width: 70%;
  height: 100%;
  margin: 0 auto;
  text-align: center;
}


h1 {
  font-weight: bolder;
  font-size: 30px;
}

.results {
  /* margin-top: 15px; */
}
h2{
  font-weight: bolder;
}

h3{
  font-weight: bolder;
}

.area {
  /* width: 100%; */
  padding-top: 5%;
  padding-bottom: 5%;
  
}
button {
  border-radius: 5px;
  padding: .5rem;
  margin: 2rem;
  background-color: hsl(197, 54%, 65%);
  color: white;
  border: none;
  cursor: pointer;


}

button:hover {
  background-color: #0056b3;
}



.group-container {
  display: flex;
  flex-wrap: wrap;
  /* gap: 5%; */

  
}


.group {
  margin-bottom: 20px;
}

.schedule {
  display: grid;
  justify-content: center;
  align-content: center;
  margin: 0 auto;
  text-align: center;
}

.download-button {
  margin: 0 auto;
  text-align: center;

}
</style>
