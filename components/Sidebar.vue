<template>
  <div>
    <div class="sidebar-title">
      <nuxt-link to="/">
        <h1>SIAP</h1>
      </nuxt-link>
    </div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      style="height: 100%"
      @select="handleSelect"
    >
      <el-menu-item index="/">
        <i class="el-icon-menu"></i>
        <span>Beranda</span>
      </el-menu-item>
      <el-menu-item index="/history">
        <i class="el-icon-document"></i>
        <span>Riwayat</span>
      </el-menu-item>
      <el-menu-item index="/settings">
        <i class="el-icon-setting"></i>
        <span>Pengaturan</span>
      </el-menu-item>
      <el-submenu v-if="admin" index="/admin">
        <template slot="title">
          <i class="el-icon-setting"></i>
          Administrator</template
        >

        <el-menu-item index="/users">
          <span>Daftar</span>
        </el-menu-item>

        <el-menu-item index="/train">
          <span>Latih</span>
        </el-menu-item>

        <el-menu-item index="/recognize">
          <span>Uji</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '1',
    }
  },
  computed: {
    admin() {
      return this.$store.state.isLoggedIn
    },
  },
  methods: {
    handleSelect(index, keyPath) {
      this.$router.push({
        path: index,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.sidebar-title {
  h1 {
    color: white;
    width: 100%;
    text-align: center;
  }
}
</style>