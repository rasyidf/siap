<template>
  <div class="navbar">
    <div class="nav-left">
      <el-button type="text" size="large" :style="{margin : '10px'}" icon="el-icon-more"></el-button>
    </div>
    <div class="nav-right">
      <el-button type="primary" size="small">Login</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapsed: false,
    }
  },
  methods: {},
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