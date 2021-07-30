<template>
  <el-row
    type="flex"
    class="row-bg"
    style="height: 100%"
    justify="center"
    align="middle"
  >
    <el-col>
      <el-row
        type="flex"
        class="row-bg"
        style="height: 100%"
        justify="center"
        align="middle"
      >
        <el-col :span="6">
          <el-card shadow="always" :body-style="{ padding: '0px' }">
            <el-row type="flex" align="middle">
              <el-col :span="6">
                <el-avatar
                  icon="el-icon-user-solid"
                  size="large"
                  shape="circle"
                  fit="fill"
                  style="margin: 20px"
                >
                  >
                </el-avatar>
              </el-col>
              <el-col :span="10">
                <h4>
                  {{
                    recognition._label !== 'undefined'
                      ? recognition._label
                      : 'Tidak terdeteksi'
                  }}
                </h4>
              </el-col>
              <el-col :span="8">
                <el-button type="success" size="default" @click="logAttendance"
                  >Catat</el-button
                >
              </el-col>
            </el-row>

            <el-col :span="24" hidden>
              <video id="live-video" width="320" height="247" autoplay />
            </el-col>
            <el-col :span="24">
              <canvas id="live-canvas" width="320" height="247" />
            </el-col>
          </el-card>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" align="middle">
        <p style="font-size: 11px; color: #999">
          Pastikan nama anda benar, dan tekan tombol 'Catat'
        </p>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      detectedName: '',
      interval: null,
      fps: 15,
      realFps: 0,
      step: 2,
      counter: 0,
      progress: 0,
      duration: 0,
      isProgressActive: true,
      progressStatus: 'info',
      recognition: '',
      withOptions: [0, 2],
    }
  },

  computed: {
    models() {
      return this.$store.state.model.list
    },
  },

  watch: {
    fps(newFps) {
      const videoDiv = document.getElementById('live-video')
      const canvasDiv = document.getElementById('live-canvas')
      const canvasCtx = canvasDiv.getContext('2d')
      this.start(videoDiv, canvasDiv, canvasCtx, newFps)
    },
  },

  async beforeMount() {
    const self = this
    await self.$store
      .dispatch('face/getAll')
      .then(() => self.$store.dispatch('face/getFaceMatcher'))
  },

  async mounted() {
    await this.recognize()
  },

  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval)
    }
    this.$store.dispatch('camera/stopCamera')
  },

  methods: {
    logAttendance() {
      this.$msgbox({
        title: 'Data Tersimpan',
        message: 'Anda sudah masuk, terimakasih',
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        center: true,
      })
        .then((action) => {
          this.$axios.$post('api/attendance/create', {
            status: 'Tepat Waktu',
            userId: 0,
            userName: this.recognition._label?? '',
          })
        })
        .catch(() => {})
    },
    start(videoDiv, canvasDiv, canvasCtx, fps) {
      const self = this
      if (self.interval) {
        clearInterval(self.interval)
      }
      self.interval = setInterval(async () => {
        const t0 = performance.now()
        canvasCtx.drawImage(videoDiv, 0, 0, 320, 247)
        const options = {
          detectionsEnabled: self.withOptions.find((o) => o === 0) === 0,
          landmarksEnabled: self.withOptions.find((o) => o === 1) === 1,
          descriptorsEnabled: self.withOptions.find((o) => o === 2) === 2,
          expressionsEnabled: self.withOptions.find((o) => o === 3) === 3,
        }
        const detections = await self.$store.dispatch(
          'face/getFaceDetections',
          { canvas: canvasDiv, options }
        )
        if (detections.length) {
          if (self.isProgressActive) {
            self.increaseProgress()
            self.progressStatus = 'success'
            self.isProgressActive = false
          }
          detections.forEach(async (detection) => {
            detection.recognition = await self.$store.dispatch(
              'face/recognize',
              {
                descriptor: detection.descriptor,
                options,
              }
            )
            this.recognition = detection.recognition || this.recognition
            self.$store.dispatch('face/draw', {
              canvasDiv,
              canvasCtx,
              detection,
              options,
            })
          })
        }
        const t1 = performance.now()
        self.duration = (t1 - t0).toFixed(2)
        self.realFps = (1000 / (t1 - t0)).toFixed(2)
      }, 1000 / fps)
    },
    async recognize() {
      const self = this
      self.increaseProgress()
      await self.$store.dispatch('camera/startCamera').then((stream) => {
        const videoDiv = document.getElementById('live-video')
        const canvasDiv = document.getElementById('live-canvas')
        const canvasCtx = canvasDiv.getContext('2d')
        videoDiv.srcObject = stream

        self.increaseProgress()
        self.progressStatus = 'success'
        self.start(videoDiv, canvasDiv, canvasCtx, self.fps)
      })
    },

    increaseProgress() {
      const self = this
      self.progress = (100 / self.step) * ++self.counter
    },
  },
}
</script>