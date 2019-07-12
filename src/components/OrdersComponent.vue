<template>
  <div>
    <v-layout align-center overflow-auto>
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
            <td class="text-xs-center">{{ props.item.o_seller_name }}</td>
            <td class="text-xs-center">{{ props.item.o_buyer_name }}</td>
            <td class="text-xs-center">{{ props.item.o_product_name }}</td>
            <td class="text-xs-right">{{ props.item.o_product_part_no }}</td>
            <td class="text-xs-center">{{ props.item.o_product_spec }}</td>
            <td class="text-xs-right">{{ props.item.o_product_price }}</td>
            <td class="text-xs-center">{{ props.item.o_currency }}</td>
            <td class="text-xs-right">{{ props.item.o_quantity }}</td>
            <td class="text-xs-right">{{ props.item.o_amount }}</td>
            <td class="text-xs-right">{{ props.item.o_note }}</td>
            <td id="actions" class="justify-center layout px-0">
              <v-icon
                small
                class="mr-2"
                @click="editedItem(props.item)"
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

    <!--  Dialog  -->
    <v-dialog
      v-model="dialog"
      max-width="800px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">
            {{ formTitle }}
          </span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editItem.o_no" label="訂單號碼"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="editItem.o_date"
                      prepend-icon="event"
                      label="訂單日期"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="editItem.o_date" @input="menu = false"></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editItem.o_seller_name" label="賣家名稱"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editItem.o_buyer_name" label="買家名稱"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editItem.o_product_name" label="產品名稱"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editItem.o_product_part_no" label="產品料號"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editItem.o_product_spec" label="產品規格"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field
                  v-model="editItem.o_product_price"
                  label="產品價格"
                  counter="12"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editItem.o_currency" label="幣別"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editItem.o_quantity" label="採購數量"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editItem.o_amount" label="採購金額"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editItem.o_note" label="付款條件"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ['search', 'dialog', 'selected'],
  data () {
    return {
      menu: false,
      noDataAlert: false,
      pagination: { rowsPerPage: 25, sortBy: 'id' },
      orders: [],
      headers: [
        {
          text: '訂單號碼',
          value: 'o_no',
          align: 'left',
          sortable: false
        },
        { text:'訂單日期', value: 'o_date', width: "7%", align: "center" },
        { text:'賣方名稱', value: 'o_seller_name', sortable: false, width: "10%", align: "center" },
        { text:'買方名稱', value: 'o_buyer_name', sortable: false, align: "center" },
        { text:'產品名稱', value: 'o_product_name', sortable: false, align: "center" },
        { text:'產品料號', value: 'o_product_part_no', sortable: false },
        { text:'產品規格', value: 'o_product_spec', sortable: false, align: "center", width: "30%" },
        { text:'產品價格', value: 'o_product_price' },
        { text:'幣別', value: 'o_currency', sortable: false, width: "1%" },
        { text:'採購數量', value: 'o_quantity', width: "1%" },
        { text:'採購金額', value: 'o_amount', width: "1%" },
        { text:'付款條件', value: 'o_note', sortable: false },
        { text: 'Actions', value: 'action', sortable: false, width: "1%" }
      ],
      editIndex: -1,
      editItem: {
        'o_no': '',
        'o_date': '',
        'o_seller_name': '',
        'o_buyer_name': '',
        'o_product_name': '',
        'o_product_part_no': '',
        'o_product_spec': '',
        'o_product_price': '',
        'o_currency': '',
        'o_quantity': '',
        'o_amount': '',
        'o_note': ''
      },
      default: {
        'o_no': '',
        'o_date': '',
        'o_seller_name': '',
        'o_buyer_name': '',
        'o_product_name': '',
        'o_product_part_no': '',
        'o_product_spec': '',
        'o_product_price': '',
        'o_currency': '',
        'o_quantity': '',
        'o_amount': '',
        'o_note': ''
      }
    }
  },
  watch: {
    selected: function() {
      this.$emit('update:selected', this.selected);
      this.$emit('getDataType', 'orders');
    }
  },
  computed: {
    formTitle: function() {
      return this.editIndex === -1 ? 'New Item' : 'Edit Item';
    }
  },
  created() {
    this.getOrders()
  },
  methods: {
    getOrders () {
      let uri = 'http://172.16.110.7:8888/api/orders';
      this.axios.get(uri).then(response => {
        this.orders = response.data;
        this.noDataAlert = true;
      }).catch(error => {
        console.log(error.message);
      });
    },
    editedItem (item) {
      this.editIndex = this.orders.indexOf(item);
      this.editItem = Object.assign({}, item);
      this.$emit('toggleDialog', true);
    },
    deleteItem (item) {
      const index = this.orders.indexOf(item);
      let uri = `http://172.16.110.7:8888/api/orders/${item.id}`;
      confirm('確定刪除這筆資料？') && this.axios.delete(uri, item.id).then(response => {
        this.orders.splice(index, 1);
      }).catch(error => {
        console.log(error.message);
      })
    },
    close () {
      this.$emit('toggleDialog', false);
      setTimeout(() => {
        this.editItem = Object.assign({}, this.defaultItem);
        this.editIndex = -1;
      },1000)
    },
    save () {
      let index = this.editIndex;
      let item = this.editItem;
      if (index !== -1) {
        let uri = `http://172.16.110.7:8888/api/orders/${item.id}`;
        this.axios.put(uri, item).then(response => {
          this.$router.go();
        }).catch(error => {
          console.log(error.message);
        })
      } else {
        let uri = 'http://172.16.110.7:8888/api/orders';
        this.axios.post(uri, item).then(response => {
          this.$router.go();
        }).catch(error => {
          console.log(error.message);
        })
      }
      this.close();
    }
  }
}
</script>
