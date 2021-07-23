<template>
  <div>
    <el-card shadow="always" :body-style="{ padding: '0' }">
      <el-table :data="data">
        <div slot="empty" style="color: grey">Hah, kosong</div>

        <el-table-column
          prop="createdAt"
          width="140px"
          label="Waktu"
          key="Waktu"
          sortable="custom"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          width="140px"
          label="Status"
          key="Status"
          sortable="custom"
        >
          <template slot-scope="scope">
            <el-tag size="medium" :type="getType(scope.row.status)">{{
              scope.row.status
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          v-for="title in titles"
          :prop="title.prop"
          :width="title.width"
          :label="title.label"
          :key="title.label"
          sortable="custom"
        >
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  fetch() {
    this.$axios.get('/api/attendance/all').then((response) => {
      this.data = response.data
    })
  },
  data() {
    return {
      data: [],
      titles: [
        { prop: 'userName', label: 'Nama' },
        { prop: 'description', label: 'Deskripsi' },
      ],
    }
  },
  methods: {
    getType(status) {
      return status === 'Terlambat' ? 'danger' : 'success'
    },
  },
}
</script>

<style>
</style>