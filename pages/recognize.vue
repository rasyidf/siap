<template>
  <el-row>
    <el-col
      v-if="isProgressActive"
      :span="24"
      :style="{
        display: 'flex',
        'flex-direction': 'column',
        'align-items': 'center',
      }"
    >
      <el-progress
        type="circle"
        :status="progressStatus"
        :percentage="progress"
      ></el-progress>
      <span>Loading</span>
    </el-col>
    <el-col v-if="!isProgressActive" :span="24">
      <el-card>
        <el-checkbox-group v-model="withOptions" multiple>
          <el-checkbox-button>
            <span>Detection</span>
          </el-checkbox-button>
          <el-checkbox-button>
            <span>Landmarks</span>
          </el-checkbox-button>
          <el-checkbox-button>
            <span>Recognition</span>
          </el-checkbox-button>
          <el-checkbox-button>
            <span>Emotion</span>
          </el-checkbox-button>
        </el-checkbox-group>
      </el-card>
      <el-card>
        <span>Desired FPS</span>
        <el-slider v-model="fps" :min="1" :max="60" :step="1" vertical="false">
        </el-slider>
        <p>
          <el-tag type="info" size="normal" effect="dark">
            Real FPS: {{ realFps }}
          </el-tag>
          <el-tag type="info" size="normal" effect="dark">
            Duration: {{ duration }} ms
          </el-tag>
        </p>
      </el-card>
    </el-col>
    <el-col :span="24">
      <video id="live-video" width="320" height="247" autoplay />
    </el-col>
    <el-col :span="24">
      <canvas id="live-canvas" width="320" height="247" />
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
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
      withOptions: [0, 1, 2, 3],
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
