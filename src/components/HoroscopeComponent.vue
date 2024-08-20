<template>
    <div class="horoscope" ref="horoscopeContainer">
      <div 
        class="horoscope_item" 
        v-for="n in 12" 
        :key="n" 
        :class="{ active: activeItem === n, hidden: activeItem && activeItem !== n }"
        @click="toggleItem(n)"
      >
        <div class="horoscope_img">
          <img :src="require(`@/assets/img/${n}.png`)" alt="img">
        </div>
        <div class="horoscope_name">{{ zodiacSigns[language][n - 1] }}</div>
        <div class="horoscope_dates">{{ zodiacDates[n - 1] }}</div>
        <div class="horoscope_description" v-if="activeItem === n">
          <div class="horoscope_description__close">
            <button class="close-button" @click="handleCloseClick">×</button>
          </div>
          <p>{{ zodiacDescription.horoscope }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Hammer from 'hammerjs';
  
  export default {
    name: 'HoroscopeComponent',
    props: {
      language: {
        type: String,
        required: true
      },
      fetchTranslations: {
        type: Function,
        required: true
      }
    },
    data() {
      return {
        activeItem: null,
        zodiacSigns: {
          'original': [
            'Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева', 'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'
          ],
          'translated': [
            'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
          ]
        },
        zodiacDates: [
          '21.03 - 19.04', '20.04 - 20.05', '21.05 - 20.06', '21.06 - 22.07', '23.07 - 22.08', 
          '23.08 - 22.09', '23.09 - 22.10', '23.10 - 21.11', '22.11 - 21.12', '22.12 - 19.01', 
          '20.01 - 18.02', '19.02 - 20.03'
        ],
        zodiacDescription: {}
      };
    },
    watch: {
      language: 'loadTranslations'
    },
    methods: {
      async toggleItem(n) {
        if (this.activeItem === n) {
          return;
        }
        this.activeItem = n;
        this.zodiacDescription = await this.fetchTranslations(this.zodiacSigns['translated'][n - 1].toLowerCase(), this.language);
      },
      handleCloseClick(event) {
        event.stopPropagation();
        if (window.Telegram && window.Telegram.WebApp) {
          window.Telegram.WebApp.close();
        }
        this.activeItem = null;
        this.zodiacDescription = {};
      },
      handleCloseSwiper() {
        if (window.Telegram && window.Telegram.WebApp) {
          window.Telegram.WebApp.close();
        }
        this.activeItem = null;
        this.zodiacDescription = {};
      },
      async loadTranslations() {
        if (this.activeItem !== null) {
          this.zodiacDescription = await this.fetchTranslations(this.zodiacSigns['translated'][this.activeItem - 1].toLowerCase(), this.language);
        }
      }
    },
    mounted() {
      const container = this.$refs.horoscopeContainer;
      const mc = new Hammer(container);
      mc.on('swiperight', this.handleCloseSwiper);
    }
  }
</script>
  
<style scoped>
.horoscope {
    max-width: 700px;
    width: 90%;
    margin: 40px auto 60px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3px;
    position: relative;
}

.language {
    width: 30px;
    position: fixed;
    top: 5px;
    left: 5px;
}

.language img {
    width: 100%;
}

.horoscope_item {
    color: white;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    overflow: hidden;
    cursor: pointer;
}

.horoscope_item.hidden {
    opacity: 0;
    pointer-events: none;
    height: 0;
    overflow: hidden;
}

.horoscope_item.active {
    grid-column: span 3;
    opacity: 1;
}

.horoscope_img {
    margin-top: 10%;
    width: 100%;
    text-align: center;
}

.horoscope_img img {
    width: 40%;
    transition: all 0.3s ease;
}

.horoscope_name {
    width: 100%;
    text-align: center;
    font-size: 12px;
    font-weight: bold;
}

.horoscope_dates {
    font-size: 9px;
}

.horoscope_item.active .horoscope_img img {
    width: 40%;
}

.horoscope_item.active .horoscope_name {
    font-size: 18px;
}

.horoscope_description {
    position: relative;
    font-size: 12px;
    width: 90%;
    margin: 10px auto 0;
    text-align: justify;
    text-indent: 10px;
}

.horoscope_description__close {
    position: fixed;
    top: 10px;
    right: 10px;
    border-radius: 50%;
}

.horoscope_description__close button {
    border-radius: 50%;
    border: 1px white solid;
    color: white;
    background: rgba(255, 255, 255, 0.406);
}
</style>
  