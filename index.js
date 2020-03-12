class Engine {
   constructor() {
      this.data = {};
      this.tvPicker = document.getElementById('tv-show');
      this.output = document.getElementById('output');

      this.fillData();

      this.buildDropDown();

      this.initializeEvents();
   }

   get watchedData() {
      return JSON.parse(localStorage.getItem('watched') || '{}');
   }

   set watchedData(data)  {
      localStorage.setItem('watched', JSON.stringify(data));
   }

   initializeEvents() {
      document.getElementById('btn-go').addEventListener('click', () => {
         this.getRandomShow();
      });

      document.getElementById('btn-watched').addEventListener('click', () => {
         this.setEpisodeWatched();
      })
   }

   setEpisodeWatched() {
      const episodeKey = this.output.getAttribute('data-episode-key');
      const show = this.output.getAttribute('data-show');

      if (episodeKey === null) {
         return;
      }

      let watchedData = this.watchedData;

      if (watchedData[show] === undefined) {
         watchedData[show] = [];
      }

      watchedData[show].push(episodeKey);

      this.watchedData = watchedData;
   }

   getRandomShow() {
      const currentShow = this.data[this.tvPicker.value];
      if (currentShow === undefined) {
         return;
      }

      const watchedEpisodes = this.watchedData[this.tvPicker.value] || [];

      const episodeList = currentShow.flatMap((val, index) => {
         let season = [];
         for (let i = 0; i < val; i++) {
            // This is to make filtering easier in the future for past watched episodes
            const key = `${index+1}-${i+1}`;
            if (watchedEpisodes.indexOf(key) === -1) {
               season.push(key);
            }
         }
         return season
      });

      if (episodeList.length === 0) {
         this.output.innerText = "No more episodes"
      }

      const index = getRandomInt(episodeList.length);
      let episodeKey = episodeList[index];

      this.output.setAttribute('data-episode-key', episodeKey);
      this.output.setAttribute('data-show', this.tvPicker.value);

      let episodeParts = episodeKey.split('-');
      this.output.innerText =
         `Season ${episodeParts[0]}, Episode ${episodeParts[1]} (${episodeList.length} episodes remaining)`;
   }

   fillData() {
      this.data = {
         "South Park": [13,18,17,17,14,17,15,14,14,14,14,14,14,14,14,14,10,10,10,10,10,10,10],
         "American Dad!": [7,16,19,16,20,18,19,18,19,20,3,15,22,22,22]
      }
   }

   buildDropDown() {
      for (let show in this.data) {
         let option = document.createElement('option');
         option.value = show;
         option.innerText = show;

         this.tvPicker.appendChild(option);
      }
   }
}

function getRandomInt(max) {
   return Math.floor(Math.random() * Math.floor(max));
}


