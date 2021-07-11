<template>
  <el-row>
    <el-col :span="24">
      <el-card
        shadow="always"
        :body-style="{ padding: '20px' }"
        style="margin: 4px"
      >
        <div slot="header">
          <span>Training</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-button color="primary" style="margin: 10px" @click="train()">
              Lakukan Training
            </el-button>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-progress
              v-if="isProgressActive"
              type="circle"
              :width="50"
              :status="progressStatus"
              :percentage="progress"
            ></el-progress>
            <span v-if="isProgressActive">Training...</span>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-col :span="18"> </el-col>
    <el-col v-for="user in users" :key="user.name">
      <nuxt-link :to="{ path: `/users/${user.name}` }">
        <el-card
          shadow="always"
          :body-style="{ padding: '20px' }"
          style="margin: 4px"
        >
          <div slot="header">
            <span>{{ user.name }}</span>
          </div>
          <div style="display: flex; flex-wrap: wrap">
            <div v-for="(photo, index) in user.photos" :key="photo">
              <el-avatar :src="photo" style="margin: 4px"> </el-avatar>
              <img hidden :id="user.name + index" :src="photo" />
            </div>
          </div>
        </el-card>
      </nuxt-link>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      step: 1,
      counter: 0,
      progress: 0,
      progressStatus: 'success',
      isProgressActive: false,
    }
  },

  async fetch({ store }) {
    const self = this
    await store
      .dispatch('user/getAll')
      .then((users) => {
        self.step += users.length
      })
      .catch((this.isProgressActive = true), (this.progressStatus = 'danger'))
  },
  computed: {
    users() {
      return this.$store.state.user.list
    },
  },

  methods: {
    async train() {
      const self = this
      self.resetProgress()
      let steps = 0
      self.users.map((user) => {
        user.photos.map((photo, index) => (steps = steps + 1))
      })

      self.step = steps
      const faces = []
      await Promise.all(
        self.users.map(async (user) => {
          const descriptors = []
          await Promise.all(
            user.photos.map(async (photo, index) => {
              const photoId = `${user.name}${index}`
              const img = document.getElementById(photoId)
              const options = {
                detectionsEnabled: true,
                landmarksEnabled: true,
                descriptorsEnabled: true,
                expressionsEnabled: false,
              }
              const detections = await self.$store.dispatch(
                'face/getFaceDetections',
                { canvas: img, options }
              )
              detections.forEach((d) => {
                descriptors.push({
                  path: photo,
                  descriptor: d.descriptor,
                })
              })
              self.increaseProgress()
            })
          )
          faces.push({
            user: user.name,
            descriptors,
          })
        })
      )

      await self.$store
        .dispatch('face/save', faces)
        .then(() => {
          self.increaseProgress()
          self.progressStatus = 'success'
          self.isProgressActive = false
        })
        .catch((e) => {
          self.isProgressActive = false
          self.progressStatus = 'danger'
          console.error(e)
        })
    },
    increaseProgress() {
      const self = this
      self.progress = (100 / self.step) * ++self.counter
    },
    resetProgress() {
      const self = this
      self.progress = self.counter = 0
      self.isProgressActive = true
      self.progressStatus = ''
    },
  },
}
</script>
