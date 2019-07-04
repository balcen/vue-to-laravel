<template>
  <div>
    <v-layout>
      <v-flex xs12>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="clients"
          :pagination.sync="pagination"
          select-all
          class="elevation-1"
        >
            <v-progress-linear v-slot:process color="blue" indeterminate></v-progress-linear>
            <template v-slot:items="props">
                <td>
                    <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
                </td>
                <td>{{ props.item.c_tax_id }}</td>
                <td class="text-xs-right">{{ props.item.c_name }}</td>
                <td class="text-xs-right">{{ props.item.c_type }}</td>
                <td class="text-xs-right">{{ props.item.c_contact }}</td>
                <td class="text-xs-right">{{ props.item.c_phone }}</td>
                <td class="text-xs-right">{{ props.item.c_mail }}</td>
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
export default {
    data() {
        return {
            selected: [],
            pagination: { rowsPerPage: 25 },
            clients: [],
            headers: [
                {
                    text: '客戶統編',
                    value: 'c_tax_id',
                    align: 'left',
                    sortable: false
                },
                { text: '客戶名稱', value: 'c_name', sortable: false },
                { text: '客戶類型', value: 'c_type', sortable: false },
                { text: '聯絡人', value: 'c_contact', sortable: false },
                { text: '聯絡電話', value: 'c_phone', sortable: false },
                { text: '電子信箱', value: 'c_mail', sortable: false },
            ]
        };
    },
    created() {
        this.getClients();
    },
    props: ['search'],
    methods: {
        getClients () {
            let uri = 'http://172.16.110.7:8888/api/clients'
            this.axios.get(uri).then(response => {
                this.clients = response.data;
            }).catch(error => {
                console.log(error.message);
            })
        }
    }
};
</script>
