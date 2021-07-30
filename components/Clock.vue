<template>
  <el-row class="clock" v-if="hourtime != ''">
    <el-col :span="8">
      <div class="clock__hours">
        <span v-text="hours">00</span>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="clock__minutes" v-text="minutes">00</div
    ></el-col>
    <el-col :span="8">
      <div class="clock__seconds" v-text="seconds">00</div
    ></el-col>
  </el-row>
</template>

<script>
import { SECOND, HOUR, getHourTime, getZeroPad } from '@/utils/filters'
export default {
  data() {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
      hourtime: '',
    }
  },
  mounted() {
    const timer = window.setTimeout(this.updateDateTime, SECOND)
    this.$on('hook:destroyed', () => window.clearTimeout(timer))
  },
  methods: {
    updateDateTime() {
      const now = new Date()
      this.hours = now.getHours()
      this.minutes = getZeroPad(now.getMinutes())
      this.seconds = getZeroPad(now.getSeconds())
      this.hourtime = getHourTime(this.hours)
      this.hours = getZeroPad(this.hours % HOUR || HOUR)
      this.$options.timer = window.setTimeout(this.updateDateTime, SECOND)
    },
  },
}
</script>

<style scoped>
.clock {
  background: #fff;
  border: 0.3rem solid #fff;
  border-radius: 0.5rem;
  display: inline-block;
  margin-bottom: 1em;
}
.clock__hours,
.clock__minutes,
.clock__seconds {
  display: inline-block;
  color: linear-gradient(to bottom, #202c38 50%, #21528b 50%);
  font-family: 'Nunito', sans-serif;
  font-size: 8rem;
  font-weight: 300;
  padding: 0.5rem 1rem;
  text-align: center;
  width: 100%;
  position: relative;
}
.clock__hourtime {
  font-size: 1rem;
  position: absolute;
  top: 2px;
  left: 8px;
}
</style>