<template>
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="orders"
    :search="search"
    :options.sync="options"
    :footer-props="footerProps"
    :server-items-length="totalItems"
    :loading="loading"
    show-select
    class="elevation-1"
  >
    <template v-slot:top>
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
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-card-text>
              <v-container grid-list-md>
                <v-row wrap>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field :rules="[rules.required]" v-model="editItem.o_no" label="訂單號碼" maxlength="30"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-menu
                      v-model="menu"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="editItem.o_date"
                          prepend-icon="event"
                          label="訂單日期"
                          :rules="[rules.required]"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="editItem.o_date" @input="menu = false"></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field :rules="[rules.required]" v-model="editItem.o_seller_name" label="賣家名稱"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field :rules="[rules.required]" v-model="editItem.o_buyer_name" label="買家名稱"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field :rules="[rules.required]" v-model="editItem.o_product_name" label="產品名稱"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field :rules="[rules.required]" v-model="editItem.o_product_part_no" label="產品料號" maxlength="30"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editItem.o_product_spec" label="產品規格"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field 
                      type="number" 
                      v-model="editItem.o_product_price" 
                      label="產品價格" 
                      :rules="[rules.required]" 
                      maxlength="12"
                      @change="amount"  
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field :rules="[rules.required]" v-model="editItem.o_currency" label="幣別" maxlength="10"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field 
                      :rules="[rules.required]" 
                      v-model="editItem.o_quantity" 
                      label="採購數量"
                      @change="amount"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editItem.o_amount" label="採購金額"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editItem.o_note" label="付款條件"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save" :disabled="!valid">Save</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </template>

    <template v-slot:item.action="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editedItem(item)"
      >
        edit
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        delete
      </v-icon>
    </template>

    <template v-slot:no-data>
      <v-alert type="error" class="text-left my-3">
        抱歉，這裡沒有任何資料 :(
      </v-alert>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: ['search', 'dialog', 'selected'],
  data () {
    return {
      value: 123,
      valid: true,
      menu: false,
      noDataAlert: false,
      options: {},
      totalItems: 0,
      footerProps: {
        'items-per-page-options': [10, 25, 50, 100, 200, 500]
      },
      orders: [],
      loading: true,
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
        'o_currency': 'USD',
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
        'o_currency': 'USD',
        'o_quantity': '',
        'o_amount': '',
        'o_note': ''
      },
      rules: {
        required: v => !!v || 'Required'
      }
    }
  },
  computed: {
    formTitle() {
      return this.editIndex === -1 ? '新增資料' : '修改資料'
    },
    // amount: {
    //   get: function(){
    //     let sum = Math.round(this.editItem.o_product_price * this.editItem.o_quantity * 1000) / 1000
    //     return sum
    //   },
    //   // 如果手動修改amount就執行set賦值給o_amount
    //   set: function(newVal) {
    //     this.editItem.o_amount = newVal
    //   }
    // }
  },
  watch: {
    selected: function() {
      this.$emit('update:selected', this.selected)
      this.$emit('getDataType', 'orders')
    },
    options: {
      handler() {
        this.loading = true
        this.getDataFromApi()
          .then(data => {
            this.orders = data.data
            this.totalItems = data.total
            this.loading = false
          }) 
      },
      deep: true
    }
  },
  created() {
  },
  mounted() {
    this.loading = true
    this.getDataFromApi()
      .then(data => {
        this.orders = data.data
        this.totalItems = data.total
        this.loading = false
      })
  },
  methods: {
    getDataFromApi() {
      return new Promise((resolve, reject) => {
        const { sortBy, sortDesc, page, itemsPerPage } = this.options
        const url = `orders?page=${page}&itemsPerPage=${itemsPerPage}&sortBy=${sortBy}&sortDesc=${sortDesc}`
        this.axios.get(url)
          .then(res => {
            return resolve(res.data)
          })
      })
    },
    editedItem (item) {
      this.editIndex = this.orders.indexOf(item)
      this.editItem = Object.assign({}, item)
      this.$emit('toggleDialog', true)
    },
    deleteItem (item) {
      const index = this.orders.indexOf(item)
      confirm('確定刪除這筆資料？') && this.axios.delete(`orders/${item.id}`, item.id).then(() => {
        this.orders.splice(index, 1)
        this.flash('成功刪除一筆資料', 'success')
      }).catch(error => {
        this.flash(error.message, 'error')
      })
    },
    close () {
      this.$emit('toggleDialog', false)
      setTimeout(() => {
        this.editItem = Object.assign({}, this.defaultItem)
        this.editIndex = -1
        this.$refs.form.reset()
        this.loading = false
      },300)
    },
    save () {
      this.loading = true
      let index = this.editIndex
      let item = this.editItem
      if(!this.$refs.form.validate()) return
      if (index !== -1) {
        this.axios.put(`orders/${item.id}`, item).then(() => {
          Object.assign(this.orders[index], item)
          this.flash('成功修改一筆資料', 'success')
        }).catch(error => {
          this.flash(error.message, 'error')
        })
      } else if(index === -1) {
        this.axios.post('orders', item).then(() => {
          this.orders.push(item)
          this.flash('成功新增一筆資料', 'success')
        }).catch(error => {
          this.flash(error.message, 'error')
        })
      }
      this.close()
    },
    deleteArray () {
      this.orders = this.orders.filter((el) => !this.selected.includes(el))
    },
    amount() {
      this.editItem.o_amount = Math.round(this.editItem.o_product_price * this.editItem.o_quantity * 1000) / 1000
    }
  }
}
</script>
