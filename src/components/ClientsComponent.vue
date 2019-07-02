<template>
  <div>
    <v-layout>
      <v-flex xs12>
        <v-data-table
          :headers="headers"
          :items="clients"
          :loading="loading"
          :pagination-sync="pagination"
          :total-items="totalClients"
          class="elevation-1"
        >
            <v-progress-linear v-slot:process color="blue" indeterminate></v-progress-linear>
            <template v-slot:item="props">
                <td>
                <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
                </td>
                <td>{{ props.item.c_no }}</td>
                <td class="text-xs-right">{{ props.item.c_name }}</td>
                <td class="text-xs-right">{{ props.item.c_class }}</td>
                <td class="text-xs-right">{{ props.item.c_contact }}</td>
                <td class="text-xs-right">{{ props.item.c_phone }}</td>
                <td class="text-xs-right">{{ props.item.c_email }}</td>
            </template>

            <template v-slot:no-data>
                <v-alert :value="true" color="error" icon="warning">
                    抱歉，這裡沒有任何資料 :(
                </v-alert>
            </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { Promise } from 'q';
export default {
  data() {
    return {
      selected:[],
      pagination: {},
      totalClients: 0,
      loading: true,
      clients: [],
      headers: []
    };
  },
  created() {

  },
  methods: {
    initalData() {},
    getDataFromApi() {
      this.loading = true;
      return new Promise((resolve, reject) => {
        const { sortBy, descending, page, rowsPerPage } = this.pagination;

        let items = this.getClients()
        const total = items.length

        if (this.pagination.sortBy) {
          // a 和 b 根據要 sortBy 的 key 來決定大小
          const sortA = a[sortBy]
          const sortB = b[sortBy]

          // descending 向下增加，所以 sortA < sortB ture
          if (descending) {
            if (sortA > sortB) return -1
            if (sortA < sortB) return 1
          } else {
            if (sortA > sortB) return 1
            if (sortA < sortB) return -1
          }
        }

        if (rowsPerPage > 0) {
          // slice 截取 start 不截 end
          // 需要 20 筆資料 取 0-20 因為 end 不會截取到
          items = items.slice((page-1) * rowsPerPage, page * rowsPerPage)
        }

        setTimeout (() => {
          this.loading = false
          resolve({
            items,
            total
          })
        },1000)
      })
    },
    getClients () {
      const uri = 'http://172.16.100.7:8888/clients'
      this.axios.get(uri).then(response => {
        this.clients = response.data.clients
        console.log('上傳成功')
      }).catch(error => {
        console.log('上傳失敗')
      })
    }
  }
};
</script>
