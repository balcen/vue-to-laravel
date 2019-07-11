<template>
  <div>
    <v-layout>
      <v-flex xs12>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="invoices"
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
            <td>{{ props.item.i_no }}</td>
            <td class="text-xs-right">{{ props.item.i_date }}</td>
            <td class="text-xs-right">{{ props.item.i_mature }}</td>
            <td class="text-xs-right">{{ props.item.i_order_no }}</td>
            <td class="text-xs-right">{{ props.item.i_seller_name }}</td>
            <td class="text-xs-right">{{ props.item.i_buyer_name }}</td>
            <td class="text-xs-right">{{ props.item.i_product_name }}</td>
            <td class="text-xs-right">{{ props.item.i_product_part_no }}</td>
            <td class="text-xs-right">{{ props.item.i_product_spec }}</td>
            <td class="text-xs-right">{{ props.item.i_product_price }}</td>
            <td class="text-xs-right">{{ props.item.i_currency }}</td>
            <td class="text-xs-right">{{ props.item.i_quantity }}</td>
            <td class="text-xs-right">{{ props.item.i_amount }}</td>
            <td class="text-xs-right">{{ props.item.i_note }}</td>
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
      invoices: [],
      headers: [
        {
          text: '發票號碼',
          value: 'i_no',
          align: 'left',
          sortable: false
        },
        { text: '發票日', value: 'i_date' },
        { text: '發票到期日', value: 'i_mature' },
        { text: '訂單號碼', value: 'i_order_no', sortable: false },
        { text: '賣方名稱', value: 'i_seller_name', sortable: false },
        { text: '買方名稱', value: 'i_buyer_name', sortable: false },
        { text: '產品名稱', value: 'i_product_name', sortable: false },
        { text: '產品料號', value: 'i_product_part_no', sortable: false },
        { text: '產品規格', value: 'i_product_spec', sortable: false },
        { text: '產品價格', value: 'i_product_price' },
        { text: '幣別', value: 'i_currency', sortable: false },
        { text: '採購數量', value: 'i_quantity' },
        { text: '採購金額', value: 'i_amount' },
        { text: '付款條件', value: 'i_note', sortable: false },
        { text: 'Actions', value: 'action', sortable: false }
      ],
    }
  },
  created () {
    this.getInvoices();
  },
  methods: {
    getInvoices () {
      let uri = 'http://172.16.110.7:8888/api/invoices'
      this.axios.get(uri).then(response => {
        this.invoices = response.data;
        this.noDataAlert = true;
      }).catch(error => {
        console.log(error.message)
      });
    },
    editItem (item) {

    },
    deleteItem (item) {
      const index = this.invoices.indexOf(item);
      let uri = `http://172.16.110.7:8888/api/invoices/${item.id}`;
      confirm('確定刪除這筆資料？') && this.axios.delete(uri, item.id).then(response => {
        this.invoices.splice(index, 1);
      }).catch(error => {
        console.log(error.message);
      });
    }
  }
}
</script>
