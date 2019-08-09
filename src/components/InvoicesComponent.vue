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
          :loading="loading"
          :rows-per-page-items="rowsPerPage"
          select-all
          class="elevation-1"
        >
          <template v-slot:items="props">
            <td>
              <v-checkbox
                v-model="props.selected"
                primary
                hide-details
              ></v-checkbox>
            </td>
            <td>{{ props.item.i_no }}</td>
            <td class="text-xs-center">{{ props.item.i_date }}</td>
            <td class="text-xs-center">{{ props.item.i_mature }}</td>
            <td class="text-xs-right">{{ props.item.i_order_no }}</td>
            <td class="text-xs-center">{{ props.item.i_seller_name }}</td>
            <td class="text-xs-center">{{ props.item.i_buyer_name }}</td>
            <td class="text-xs-center">{{ props.item.i_product_name }}</td>
            <td class="text-xs-right">{{ props.item.i_product_part_no }}</td>
            <td class="text-xs-center">{{ props.item.i_product_spec }}</td>
            <td class="text-xs-right">{{ props.item.i_product_price }}</td>
            <td class="text-xs-center">{{ props.item.i_currency }}</td>
            <td class="text-xs-right">{{ props.item.i_quantity }}</td>
            <td class="text-xs-right">{{ props.item.i_amount }}</td>
            <td class="text-xs-right">{{ props.item.i_note }}</td>
            <td id="actions" class="justify-center layout">
              <v-btn icon small class="ma-0 editBtn">
                <v-icon
                  small
                  @click="editedItem(props.item)"
                >
                  edit
                </v-icon>
              </v-btn>
              <v-btn icon small class="ma-0 deleteBtn">
                <v-icon
                  small
                  @click="deleteItem(props.item)"
                >
                  delete
                </v-icon>
              </v-btn>
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
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field :rules="[rules.required]" v-model="editItem.i_no" label="發票號碼" maxlength="30"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-menu
                    v-model="menu1"
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
                        :rules="[rules.required]"
                        v-model="editItem.i_date"
                        prepend-icon="event"
                        label="發票日期"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="editItem.i_date" @input="menu1 = false"></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-menu
                    v-model="menu2"
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
                        :rules="[rules.required]"
                        v-model="editItem.i_mature"
                        prepend-icon="event"
                        label="發票到期日"
                        readonly
                        v-on="on"
                      >
                      </v-text-field>
                    </template>
                    <v-date-picker v-model="editItem.i_mature" @input="menu2 = false"></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field :rules="[rules.required]" v-model="editItem.i_order_no" label="訂單號碼" maxlength="30"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field :rules="[rules.required]" v-model="editItem.i_seller_name" label="賣家名稱"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field :rules="[rules.required]" v-model="editItem.i_buyer_name" label="買家名稱"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field :rules="[rules.required]" v-model="editItem.i_product_name" label="產品名稱"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field :rules="[rules.required]" v-model="editItem.i_product_part_no" label="產品料號" maxlength="30"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editItem.i_product_spec" label="產品規格"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field
                    type="number"
                    :rules="[rules.required]"
                    v-model="editItem.i_product_price"
                    maxlength="12"
                    label="產品價格"
                  >
                  </v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field :rules="[rules.required]" v-model="editItem.i_currency" label="幣別" maxlength="10"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field :rules="[rules.required]" v-model="editItem.i_quantity" label="採購數量"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="amount" label="採購金額" :value="sum"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editItem.i_note" label="付款條件"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click="save" :disabled="!valid">Save</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>

    </v-dialog>
  </div>
</template>

<style>
#actions {
  padding: 0 3px !important;
}
</style>

<script>
export default {
  props: ['search', 'dialog', 'selected'],
  data () {
    return {
      valid: true,
      rowsPerPage: [10,25,50,{"text":"$vuetify.dataIterator.rowsPerPageAll","value":-1}],
      menu1: false,
      menu2: false,
      noDataAlert: false,
      pagination: { rowsPerPage: 25, sortBy: 'id' },
      invoices: [],
      loading: true,
      headers: [
        {
          text: '發票號碼',
          value: 'i_no',
          align: 'left',
          sortable: false
        },
        { text: '發票日', value: 'i_date', width: "7%", align: "center" },
        { text: '發票到期日', value: 'i_mature', width: "7%", align: "center" },
        { text: '訂單號碼', value: 'i_order_no', sortable: false },
        { text: '賣方名稱', value: 'i_seller_name', sortable: false, align: "center" },
        { text: '買方名稱', value: 'i_buyer_name', sortable: false, align: "center" },
        { text: '產品名稱', value: 'i_product_name', sortable: false, align: "center" },
        { text: '產品料號', value: 'i_product_part_no', sortable: false },
        { text: '產品規格', value: 'i_product_spec', sortable: false, align: "center" },
        { text: '產品價格', value: 'i_product_price' },
        { text: '幣別', value: 'i_currency', sortable: false, width: "1%" },
        { text: '採購數量', value: 'i_quantity', width: "1%" },
        { text: '採購金額', value: 'i_amount', width: "1%" },
        { text: '付款條件', value: 'i_note', sortable: false },
        { text: 'Actions', value: 'action', sortable: false, width: "1%" }
      ],
      editIndex: -1,
      editItem: {
        'i_no': '',
        'i_date': '',
        'i_mature': '',
        'i_order_no': '',
        'i_seller_name': '',
        'i_buyer_name': '',
        'i_product_name': '',
        'i_product_part_no': '',
        'i_product_spec': '',
        'i_product_price': '',
        'i_currency': 'USD',
        'i_quantity': '',
        'i_amount': '',
        'i_note':''
      },
      default: {
        'i_no': '',
        'i_date': '',
        'i_mature': '',
        'i_order_no': '',
        'i_seller_name': '',
        'i_buyer_name': '',
        'i_product_name': '',
        'i_product_part_no': '',
        'i_product_spec': '',
        'i_product_price': '',
        'i_currency': 'USD',
        'i_quantity': '',
        'i_amount': '',
        'i_note':''
      },
      rules: {
        required: v => !!v || 'Required'
      }
    }
  },
  created () {
    this.getInvoices();
  },
  computed: {
    formTitle: function() {
      return this.editIndex === -1 ? 'New Item' : 'Edit Item';
    },
    amount: {
      get: function() {
        let sum = this.editItem.i_product_price * this.editItem.i_quantity;
        this.editItem.i_amount = sum;
        return sum;
      },
      set: function(newVal) {
        this.editItem.i_amount = newVal;
      }
    }
  },
  watch: {
    selected: function() {
      this.$emit('update:selected', this.selected);
      this.$emit('getDataType', 'invoices');
    },
    dialog() {
      this.$refs.form.reset();
    }
  },
  methods: {
    getInvoices () {
      let uri = 'https://calm-ocean-96461.herokuapp.com/api/invoices'
      this.axios.get(uri).then(response => {
        this.invoices = response.data;
        this.noDataAlert = true;
        this.loading = false;
      }).catch(error => {
        this.flash(error.message, 'error');
      });
    },
    editedItem (item) {
      this.editIndex = this.invoices.indexOf(item);
      this.editItem = Object.assign({}, item);
      this.$emit('toggleDialog', true);
    },
    deleteItem (item) {
      const index = this.invoices.indexOf(item);
      let uri = `https://calm-ocean-96461.herokuapp.com/api/invoices/${item.id}`;
      confirm('確定刪除這筆資料？') && this.axios.delete(uri, item.id).then(response => {
        this.invoices.splice(index, 1);
        this.flash('成功刪除一筆資料', 'success', { timeout: 3000 });
      }).catch(error => {
        this.flash(error.message, 'error');
      });
    },
    close () {
      this.$emit('toggleDialog', false);
      setTimeout(() => {
        this.editIndex = -1;
        this.editItem = Object.assign({}, this.defaultItem);
      }, 1000)
    },
    save() {
      if(this.$refs.form.validate) return;
      let index = this.editIndex;
      let item = this.editItem;

      if (index !== -1) {
        let uri = `https://calm-ocean-96461.herokuapp.com/api/invoices/${item.id}`;
        this.axios.put(uri, item).then(response => {
          Object.assign(this.invoices[index], item);
          this.flash('成功修改一筆資料', 'success', { timeout: 3000 });
        }).catch(error => {
          this.flash(error.message, 'error');
        })
      } else {
        let uri = 'https://calm-ocean-96461.herokuapp.com/api/invoices';
        this.axios.post(uri, item).then(response => {
          this.invoices.push(item);
          this.flash('成功新增一筆資料', 'success', { timeout: 3000 });
        }).catch(error => {
          this.flash(error.message, 'error');
        })
      }
    },
    deleteArray () {
      this.invoices = this.invoices.filter((el) => !this.selected.includes(el));
    }
  }
}
</script>
