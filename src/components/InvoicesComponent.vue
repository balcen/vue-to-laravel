<template>
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="invoices"
    :search="search"
    :options.sync="options"
    :server-items-length="totalItems"
    :footer-props="footerProps"
    :loading="loading"
    show-select
    class="elevation-1"
  >
    <!--  Dialog  -->
    <template v-slot:top>
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
                <v-row wrap>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field :rules="[rules.required]" v-model="editItem.i_no" label="發票號碼" maxlength="30"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-menu
                      v-model="menu1"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
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
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-menu
                      v-model="menu2"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
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
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field :rules="[rules.required]" v-model="editItem.i_order_no" label="訂單號碼" maxlength="30"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field :rules="[rules.required]" v-model="editItem.i_seller_name" label="賣家名稱"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field :rules="[rules.required]" v-model="editItem.i_buyer_name" label="買家名稱"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field :rules="[rules.required]" v-model="editItem.i_product_name" label="產品名稱"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field :rules="[rules.required]" v-model="editItem.i_product_part_no" label="產品料號" maxlength="30"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editItem.i_product_spec" label="產品規格"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      type="number"
                      :rules="[rules.required]"
                      v-model="editItem.i_product_price"
                      maxlength="12"
                      label="產品價格"
                      @change="amount"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field :rules="[rules.required]" v-model="editItem.i_currency" label="幣別" maxlength="10"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field 
                      :rules="[rules.required]" 
                      v-model="editItem.i_quantity" 
                      label="採購數量"
                      @change="amount"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editItem.i_amount" label="採購金額"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editItem.i_note" label="付款條件"></v-text-field>
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

<style>
#actions {
  padding: 0 3px !important;
}
</style>

<script>
import { mapMutations } from 'vuex'
export default {
  props: ['search', 'dialog'],
  data () {
    return {
      selected: [],
      valid: true,
      menu1: false,
      menu2: false,
      noDataAlert: false,
      options: {},
      totalItems: 0,
      footerProps: {
        'items-per-page-options': [10, 25, 50, 100, 200, 500]
      },
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
  computed: {
    formTitle: function() {
      return this.editIndex === -1 ? 'New Item' : 'Edit Item'
    },
    getUrl: function() {
      let root = '?'
      if(this.search > 0) {
        const q = encodeURI(this.search)
        root += `q=${q}&`
      }
      const { sortBy, sortDesc, page, itemsPerPage } = this.options
      root += `page=${page}&itemsPerPage=${itemsPerPage}`
      if(!sortBy.length) {
        return root
      } else {
        return `${root}&sortBy=${sortBy}&sortDesc=${sortDesc[0] ? 'desc' : 'asc'}`
      }
    }
  },
  watch: {
    selected: function() {
      // this.$emit('update:selected', this.selected)
      this.$emit('setSelected', this.selected)
      this.$emit('getDataType', 'invoices')
    },
    options: {
      handler() {
        this.loading = true
        if(this.search.length === 0) {
          this.getDataFromApi()
            .then(data => {
              this.invoices = data.data
              this.totalItems = data.total
              this.loading = false
            })
        } else {
          this.getSearch()
            .then(data => {
              this.invoices = data.data
              this.totalItems = data.total
              this.loading = false
            })
        }
      }
    }
  },
  created () {
  },
  mounted() {
  },
  methods: {
    ...mapMutations({
      upFlash: 'updateFlash'
    }),
    getDataFromApi() {
      return new Promise((resolve) => {
        this.axios.get(`invoices${this.getUrl}`)
          .then(res => resolve(res.data))
      })
    },
    getInvoices () {
      this.axios.get('invoices').then(response => {
        this.invoices = response.data
        this.noDataAlert = true
        this.loading = false
      }).catch(error => {
        this.upFlash({type: 'errror', content: error.message})
      });
    },
    editedItem (item) {
      this.editIndex = this.invoices.indexOf(item)
      this.editItem = Object.assign({}, item)
      this.$emit('toggleDialog', true)
    },
    deleteItem (item) {
      const index = this.invoices.indexOf(item)
      confirm('確定刪除這筆資料？') && this.axios.delete(`invoices/${item.id}`, item.id).then(() => {
        this.invoices.splice(index, 1)
        this.upFlash({type: 'success', content: '成功刪除一筆資料'})
      }).catch(error => {
        this.upFlash({type: 'error', content: error.message})
      })
    },
    close () {
      this.$emit('toggleDialog', false)
      setTimeout(() => {
        this.editItem = Object.assign({}, this.defaultItem)
        this.editIndex = -1
        this.$refs.form.reset()
      }, 300)
    },
    save() {
      let index = this.editIndex
      let item = this.editItem
      if(!this.$refs.form.validate()) return

      if (index !== -1) {
        this.axios.put(`invoices/${item.id}`, item).then(() => {
          Object.assign(this.invoices[index], item)
          this.upFlash({type:'success', content: '成功修改一筆資料'})
        }).catch(error => {
          this.upFlash({type: 'error', content: error.message})
        })
      } else if(index === -1) {
        this.axios.post('invoices', item).then(() => {
          this.invoices.push(item)
          this.upFlash({type: 'success', content: '成功新增一筆資料'})
        }).catch(error => {
          this.upFlash({type: 'error', content: error.message})
        })
      }
      this.close()
    },
    deleteArray () {
      this.invoices = this.invoices.filter((el) => !this.selected.includes(el));
    },
    amount() {
      this.editItem.i_amount = Math.round(this.editItem.i_product_price * this.editItem.i_quantity * 1000) / 1000
    },
    useSearch() {
      this.loading = true
      this.getSearch()
        .then(data => {
          this.invoices = data.data
          this.totalItems = data.total
          this.loading = false
        })
    },
    getSearch() {
      return new Promise((resolve) => {
        this.axios.get(`invoices/search${this.getUrl}`)
          .then(res => resolve(res.data))
      })
    },
    show() {
      return new Promise((resolve) => {
        this.axios.get(`invoices/${this.$route.query.id}${this.getUrl}`)
          .then(res => resolve(res.data))
      })
    }
  }
}
</script>
