<template>
  <div class="navbar">
    <div class="nav-left">
      <el-button
        type="text"
        size="large"
        :style="{ margin: '10px' }"
        icon="el-icon-more"
      ></el-button>
    </div>
    <div v-if="guest" class="nav-right">
      <el-button type="primary" size="small" @click="logIn()">Login</el-button>
    </div>
    <div v-else class="nav-right">
      <el-button type="primary" size="small" @click="logout()"
        >Log out</el-button
      >
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      isCollapsed: false,
    }
  },
  computed: {
    guest() {
      return !this.$store.state.isLoggedIn
    },
  },
  methods: {
    ...mapMutations({
      login: 'login',
      logout: 'logout',
    }),

    logIn() {
      this.$prompt('Anda harus mengisi password untuk login', 'Masuk', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Batal',
        inputPattern: /.+/,
        inputErrorMessage: 'Password tidak boleh kosong',
      })
        .then(({ value }) => {
          if (value === '' || value === null || value === undefined) {
            this.$message('Password tidak boleh kosong')
          }
          if (value === 'admin') {
            this.login(value)
          }
        })
        .catch(() => {
          this.$message('Terjadi kesalahan.')
        })
    },
  },
}
</script>
<style lang="scss" scoped>
.navbar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 60px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.11);
  width: 100%;
  .nav-right {
    display: flex;
    justify-content: flex-end;
    width: 20%;
    margin-left: auto;
    padding: 0.8em;
  }
}
</style>