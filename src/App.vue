<template>
  <div id="app">
    <div class="language" @click="selectLanguage">
      <img :src="require(`@/assets/img/${userLanguage}.png`)" alt="flag">
    </div>
    <HoroscopeComponent 
      :language="userLanguage" 
      :fetchTranslations="fetchTranslations" 
    />
  </div>
</template>

<script>
import HoroscopeComponent from './components/HoroscopeComponent.vue';

export default {
  name: 'App',
  components: {
    HoroscopeComponent
  },
  data() {
    return {
      userLanguage: 'translated',
    };
  },
  async created() {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();

      const lang = window.Telegram.WebApp.initDataUnsafe?.user?.language_code || window.Telegram.WebApp.initDataUnsafe?.locale;

      this.userLanguage = lang === 'ru' ? 'original' : 'translated';
    }
  },
  methods: {
    async fetchTranslations(sign, language) {
      try {
        const requestData = {
          sign: sign,
          language: language,
          period: 'today'
        };

        const response = await fetch(`https://poker247tech.ru/get_horoscope/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch translations');
        }

        return await response.json();

      } catch (error) {
        console.error('Failed to fetch translations:', error);
        return {};
      }
    },
    selectLanguage() {
      this.userLanguage = this.userLanguage === 'translated' ? 'original' : 'translated';
    }
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  text-align: center;
  width: 100%;
  background-image: url(@/assets/img/space.png);
  background-size: 150px 600px;
  background-repeat: repeat;
  animation: moveBackground 30s linear infinite;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  line-height: 1.6;
}

@keyframes moveBackground {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 150px 600px;
  }
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
</style>
