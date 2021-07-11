<template>
  <el-container class="main-container" direction="horizontal">
    <el-container>
      <el-aside width="200px" style="background-color: #545c64">
        <Sidebar class="sidebar" />
      </el-aside>
      <el-container>
        <el-header class="main-header">
          <Navbar @change="isCollapsed($event)" />
        </el-header>
        <el-main class="main-item">
          <transition name="el-fade-in-linear">
            <Nuxt />
          </transition>
        </el-main>
        <el-footer class="main-footer">
          <div v-if="loading">Loading Models...</div>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      isCollapsed: false,
    }
  },
  computed: {
    loading() {
      return this.$store.state.face.loading
    },
  },
  async mounted() {
    const self = this
    await self.$store.dispatch('face/load')
  },
})
</script>


<style lang="scss">
html {
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
}
body {
  margin: 0;
  padding: 0;
}
.main-header {
  padding: 0;
}
.main-item {
  min-height: calc(100vh - 120px);
}
.sidebar .el-aside {
  z-index: 1000;
}
.main-footer {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #303133;
  text-align: center;
  color: white;
}
.main-container {
  background-color: #dbdbdb imp !important;
}
.el-main {
  padding: 8px;
}
</style>