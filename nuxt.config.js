const pkg = require('./package');

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.HOST || 'localhost',
  PORT: process.env.PORT || 3000,
  PORT_API: process.env.PORT_API || 3001
};
env.API_URL = process.env.API_URL || `http://localhost:${env.PORT_API}`;

const isDev = env.NODE_ENV === 'development';

const config = {

  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },


  css: [
    'element-ui/lib/theme-chalk/index.css'
  ],


  plugins: [
    '@/plugins/element-ui'
  ],


  components: true,


  buildModules: [

    '@nuxt/typescript-build',
  ],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/auth'
  ],

  axios: {},
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  serverMiddleware: [
    '~/api/index.js'
  ],
  telemetry: false,
  env,

  build: {
    transpile: [/^element-ui/],
  },

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: 'login', method: 'post', propertyName: 'data.token' },
          user: { url: 'profile', method: 'get', propertyName: 'data' },
          logout: false
        }
      }
    }
  }

};

if (isDev) {
  config.axios.baseURL = `http://${env.HOST}:${env.PORT_API}`;
} else {
  config.axios.baseURL = env.API_URL;
}
config.env = env;
module.exports = config;
