<template>
  <div>
    <el-card shadow="always" :body-style="{ padding: '0' }">
      <el-table :data="data">
        <div slot="empty" style="color: grey">Hah, kosong</div>

        <el-table-column
          prop="date"
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
  data() {
    return {
      data: [
        { date: '2021/07/12 07:50', status: 'Tepat Waktu', desc: '-' },
        { date: '2021/07/11 07:43', status: 'Tepat Waktu', desc: '-' },
        { date: '2021/07/10 08:10', status: 'Terlambat', desc: '-' },
        { date: '2021/07/09 07:50', status: 'Tepat Waktu', desc: '-' },
        { date: '2021/07/08 07:50', status: 'Tepat Waktu', desc: '-' },
        { date: '2021/07/07 08:10', status: 'Terlambat', desc: '-' },
        { date: '2021/07/05 07:50', status: 'Tepat Waktu', desc: '-' },
        { date: '2021/07/04 08:10', status: 'Terlambat', desc: '-' },
        { date: '2021/07/03 07:50', status: 'Tepat Waktu', desc: '-' },
      ],
      titles: [{ prop: 'desc', label: 'Deskripsi' }],
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