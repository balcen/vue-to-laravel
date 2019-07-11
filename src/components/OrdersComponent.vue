<template>
  <div>
    <v-layout>
      <v-flex xs12>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="orders"
          :search="search"
          :pagination.sync="pagination"
          select-all
          class="elevation-1"
        >
          <v-progress-linear v-slot:process color="blue" indeterminate></v-progress-linear>
          <template v-slot:items="props">
            <td>
              <v-checkbox
                v-model="props.selected"
                primary
                hide-details
              ></v-checkbox>
            </td>
            <td>{{ props.item.o_no }}</td>
            <td class="text-xs-right">{{ props.item.o_date }}</td>
            <td class="text-xs-right">{{ props.item.o_seller_name }}</td>
            <td class="text-xs-right">{{ props.item.o_buyer_name }}</td>
            <td class="text-xs-right">{{ props.item.o_product_name }}</td>
            <td class="text-xs-right">{{ props.item.o_product_part_no }}</td>
            <td class="text-xs-right">{{ props.item.o_product_spec }}</td>
            <td class="text-xs-right">{{ props.item.o_product_price }}</td>
            <td class="text-xs-right">{{ props.item.o_currency }}</td>
            <td class="text-xs-right">{{ props.item.o_quantity }}</td>
            <td class="text-xs-right">{{ props.item.o_amount }}</td>
            <td class="text-xs-right">{{ props.item.o_note }}</td>
            <td class="justify-center layout px-0">
              <v-icon
                small
                class="mr-2"
                @click="editItem(props.item)"
              >
                edit
              </v-icon>
              <v-icon
                small
                @click="deleteItem(props.item)"
              >
                delete
              </v-icon>
            </td>
          </template>
          <template v-slot:no-data>
            <v-alert :value="noDataAlert" color="error" icon="warning">
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
    props: ['search', 'dialog'],
    data () {
        return {
            noDataAlert: false,
            selected: [],
            pagination: { rowsPerPage: 25, sortBy: 'id' },
            orders: [],
            headers: [
                {
                    text: '訂單號碼',
                    value: 'o_no',
                    align: 'left',
                    sortable: false
                },
                { text:'訂單日期', value: 'o_date'},
                { text:'賣方名稱', value: 'o_seller_name', sortable: false},
                { text:'買方名稱', value: 'o_buyer_name', sortable: false},
                { text:'產品名稱', value: 'o_product_name', sortable: false},
                { text:'產品料號', value: 'o_product_part_no', sortable: false},
                { text:'規格', value: 'o_product_spec', sortable: false},
                { text:'產品價格', value: 'o_product_price'},
                { text:'幣別', value: 'o_currency', sortable: false},
                { text:'採購數量', value: 'o_quantity'},
                { text:'採購金額', value: 'o_amount'},
                { text:'付款條件', value: 'o_note', sortable: false},
                { text: 'Actions', value: 'action', sortable: false}
            ],
        }
    },
    created() {
        this.getOrders()
    },
    methods: {
        getOrders () {
            let uri = 'http://172.16.110.7:8888/api/orders'
            this.axios.get(uri).then(response => {
                this.orders = response.data
                this.noDataAlert = true;
            }).catch(error => {
                console.log(error.message)
            });
        },
        editItem (item) {

        },
        deleteItem (item) {
            const index = this.orders.indexOf(item);
            let uri = `http://172.16.110.7:8888/api/orders/${item.id}`;
            confirm('確定刪除這筆資料？') && this.axios.delete(uri, item.id).then(response => {
                this.orders.splice(index, 1);
            }).catch(error => {
                console.log(error.message);
            })
        }
    }
}
</script>
