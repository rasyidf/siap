<template>
  <div class="container">
    <el-row :gutter="10">
      <el-col :span="18" :offset="0">
        <el-card shadow="always" :body-style="{ padding: '20px' }">
          <p>Selamat Datang</p>
        </el-card>
      </el-col>
      <el-col :span="6" :offset="0">
        <el-card shadow="always" :body-style="{ ...cardbody }">
          <h5 :style="{ margin: 0, 'margin-bottom': '10px' }">
            Jangan Lupa lakukan Presensi
          </h5>
          <el-button
            type="primary"
            size="default"
            style="margin-top: auto"
            @click="onClick()"
          >
            Catat Presensi
          </el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      cardbody: {
        'padding-x': '20px',
        height: '100px',
        display: 'flex',
        'justify-content': 'space-between',
        'flex-direction': 'column',
      },
    }
  },
  methods: {
    onClick: function () {
      this.$message({
        message: 'Belum Diimplementasikan',
        type: 'info',
        showClose: true,
        duration: 3000,
      });
      
    },
  },
})
</script>
