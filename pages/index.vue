<template>
  <div class="container" style="height: 100%">
    <el-row :gutter="10" style="height: 100%">
      <el-col
        :span="24"
        :offset="0"
        style="
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
        "
      >
        <el-card
          shadow="always"
          :body-style="{ ...cardbody }"
          style="min-width: 50%; height: 50%"
        >
          <h5 :style="{ margin: 0, 'margin-bottom': '10px' }">
            Jangan Lupa lakukan Presensi
          </h5>
          <clock />
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
import Clock from '~/components/Clock.vue'

export default Vue.extend({
  components: { Clock },
  data() {
    return {
      cardbody: {
        'padding-x': 'auto',
        height: '90%',
        display: 'flex',
        'justify-content': 'space-between',
        'flex-direction': 'column',
      },
    }
  },
  methods: {
    onClick: function () {
       this.$router.push('/attend')
    },
  },
})
</script>
