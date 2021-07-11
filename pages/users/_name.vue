<template>
  <el-row>
    <el-col :span="24">
      <h1>Photos: {{ user.name }}</h1>
      <el-dialog
        :visible.sync="dialog"
        max-width="320"
        width="30%"
        title="Warning!"
      >
        Are you sure you want to delete this photo

        <span slot="footer">
          <el-button flat @click="hideDialog()"> Batal </el-button>
          <el-button type="danger" flat @click="deleteUpload()">
            Hapus
          </el-button>
        </span>
      </el-dialog>

    </el-col>
    <el-col :span="24">
      <el-card shadow="always" :body-style="{ padding: '0px' }">
        <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
          <el-tab-pane label="Upload" name="first">
            <el-card>
              <form
                method="POST"
                class="form-documents"
                enctype="multipart/form-data"
              >
                Upload photos
                <el-upload
                  id="fileUpload"
                  type="file"
                  name="fileUpload"
                  class="avatar-uploader"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  @change="filesChange($event.target.name, $event.target.files)"
                >
                  <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </form>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="Camera" name="second">
            <el-card>
              <el-button
                v-if="isCameraStarted"
                color="secondary"
                @click="takePhoto"
              >
                Ambil Foto
              </el-button>
              <el-row>
                <el-col :span="12">
                  <video
                    v-if="isCameraStarted"
                    id="live-video"
                    width="320"
                    height="247"
                    autoplay
                  />
                </el-col>
                <el-col :span="12">
                  <canvas id="live-canvas" width="320" height="247" />
                </el-col>
              </el-row>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
    <el-col :span="24">
      <div style="display: flex; flex-wrap: wrap">
        <div
          v-for="(photo, index) in user.photos"
          :key="photo"
          style="margin: 4px"
        >
          <el-card
            body-style="padding: 0px; margin: 0px"
            style="
              width: 150px;
              height: 150px;
              align-items: center;
              margin-bottom: 8px;
            "
          >
            <el-avatar
              :size="150"
              fit="fill"
              :id="user.name + index"
              :src="photo"
              shape="square"
            />
          </el-card>
          <el-button
            size="small"
            round
            style="width: 100%"
            @click="showDialog(photo)"
          >
            <i class="el-icon-remove"></i>
          </el-button>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'first',
      dialog: false,
      multiple: true,
      selectedPhoto: null,
      imageUrl: '',
    }
  },

  fetch({ store }) {
    if (!store.getters['user/isFetched']) {
      return store.dispatch('user/getAll')
    }
  },
  computed: {
    user() {
      const userByName = this.$store.getters['user/userByName']
      return userByName(this.$route.params.name)
    },
    isCameraStarted() {
      return this.$store.getters['camera/isCameraStarted']
    },
  },

  beforeDestroy() {
    this.$store.dispatch('camera/stopCamera')
  },
  methods: {
    async tabClick(tab, event) {
      if (tab.name === 'second') {
        await this.$store.dispatch('camera/startCamera').then((stream) => {
          const videoDiv = document.getElementById('live-video')
          videoDiv.srcObject = stream
        })
      } else {
        await this.$store.dispatch('camera/stopCamera')
      }
    },
    showDialog(photo) {
      this.dialog = true
      this.selectedPhoto = photo
    },

    hideDialog() {
      this.dialog = false
      this.selectedPhoto = null
    },

    async deleteUpload() {
      if (this.selectedPhoto) {
        const comps = this.selectedPhoto.split('/')
        await this.$store.dispatch('user/deletePhoto', {
          user: this.user.name,
          file: comps[comps.length - 1],
        })
        this.selectedPhoto = null
        this.dialog = false
      }
    },
    filesChange(fieldName, fileList) {
      const self = this
      const formData = new FormData()
      formData.append('user', self.user.name)
      Array.from(Array(fileList.length).keys()).map((x) =>
        formData.append(fieldName, fileList[x], fileList[x].name)
      )
      return self.$store.dispatch('user/upload', formData).then((result) => {
        if (document) {
          document.getElementById('fileUpload').value = ''
        }
      })
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('Avatar picture must be JPG format!')
      }
      if (!isLt2M) {
        this.$message.error('Avatar picture size can not exceed 2MB!')
      }
      return isJPG && isLt2M
    },
    async takePhoto() {
      const video = document.getElementById('live-video')
      const canvas = document.getElementById('live-canvas')
      const canvasCtx = canvas.getContext('2d')
      canvasCtx.drawImage(video, 0, 0, 320, 247)
      const content = canvas.toDataURL('image/jpeg')
      await this.$store.dispatch('user/uploadBase64', {
        user: this.user.name,
        content,
      })
    },
  },
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
