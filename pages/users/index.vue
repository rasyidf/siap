<template>
  <div>
    <el-row :gutter="12">
      <el-col :span="24">
        <div slot="header">
          <span>Tambah User</span>
        </div>
        <el-card shadow="always" :body-style="{ padding: '20px' }">
          <el-form
            label-position="left"
            label-width="150px"
            :model="formLabelAlign"
          >
            <el-form-item label="Nama Lengkap">
              <el-input v-model="name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button :disabled="!valid" type="primary" @click="register()">
                Tambahkan
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="24" style="margin-top: 8px">
        <el-card shadow="always" :body-style="{ padding: '0px' }">
          <div slot="header">
            <span>Daftar User</span>
          </div>
          <el-table :data="users" stripe style="width: 100%">
            <el-table-column prop="photo" label="Photo" width="180">
              <template slot-scope="scope">
                <el-avatar
                  :size="60"
                  :src="scope.row.photos[0]"
                  @error="errorHandler"
                >
                  <i class="el-icon-user-solid"></i>
                </el-avatar>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="Name"> </el-table-column>
            <el-table-column fixed="right" label="Aksi" width="220">
              <template slot-scope="scope">
                <el-button
                  @click="$router.push('/users/' + scope.row.name)"
                  type="primary"
                >
                  <i class="el-icon-plus"></i>
                </el-button>

                <el-button type="danger" @click="showDialog(scope.row.name)">
                  <i class="el-icon-delete"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      title="Warning!"
      :visible.sync="dialog"
      width="30%"
      :before-close="handleClose"
    >
      <span>Are you sure you want to delete this user</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideDialog()">Cancel</el-button>
        <el-button type="primary" @click="deleteUpload()">Okay</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      selectedUser: null,
      valid: true,
      name: null,
    }
  },
  fetch({ store }) {
    return store.dispatch('user/getAll')
  },

  computed: {
    users() {
      return this.$store.state.user.list
    },
  },

  methods: {
    register() {
      const self = this
      if (this.$refs.form.validate()) {
        return this.$store.dispatch('user/register', this.name).then(() => {
          return self.$router.push({ path: `/users/${self.name}` })
        })
      }
    },

    showDialog(name) {
      this.dialog = true
      this.selectedUser = name
    },

    hideDialog() {
      this.dialog = false
      this.selectedUser = null
    },

    async deleteUpload() {
      if (this.selectedUser) {
        await this.$store.dispatch('user/delete', this.selectedUser)
        this.selectedUser = null
        this.dialog = false
      }
    },
  },
}
</script>
