<template>
  <v-data-table
    v-model="tableSelected"
    :headers="headers"
    :items="orders"
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
            <span
              class="headline"
              v-text="formTitle"
            />
          </v-card-title>
          <v-form
            v-model="valid"
            ref="form"
            lazy-validation
          >
            <v-card-text>
              <v-container grid-list-md>
                <v-row wrap>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      :rules="[rules.required]"
                      v-model="editItem.o_no"
                      label="訂單號碼"
                      maxlength="30"
                      counter="30"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
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
                      <v-date-picker
                        v-model="editItem.o_date"
                        @input="menu = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      :rules="[rules.required]"
                      v-model="editItem.o_seller_name"
                      label="賣家名稱"
                      maxlength="50"
                      counter="50"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      :rules="[rules.required]"
                      v-model="editItem.o_buyer_name"
                      label="買家名稱"
                      maxlength="50"
                      counter="50"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      :rules="[rules.required]"
                      v-model="editItem.o_product_name"
                      label="產品名稱"
                      maxlength="50"
                      counter="50"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      :rules="[rules.required]"
                      v-model="editItem.o_product_part_no"
                      label="產品料號"
                      maxlength="30"
                      counter="30"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editItem.o_product_spec"
                      label="產品規格"
                      maxlength="100"
                      counter="100"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      type="number"
                      v-model="editItem.o_product_price"
                      label="產品價格"
                      :rules="[rules.required]"
                      maxlength="17"
                      @change="amount"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      :rules="[rules.required]"
                      v-model="editItem.o_currency"
                      label="幣別"
                      maxlength="10"
                      counter="10"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      :rules="[rules.required]"
                      v-model="editItem.o_quantity"
                      label="採購數量"
                      maxlength="11"
                      @change="amount"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editItem.o_amount"
                      label="採購金額"
                      maxlength="20"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editItem.o_note"
                      label="付款條件"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                :disabled="!valid"
                color="blue darken-1"
                text
                @click="save"
              >
                Save
              </v-btn>
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
        @click.stop="tConfirmDialog({ b: true, m: false, id: item.id })"
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
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  props: ['dialog', 'selected'],
  data() {
    return {
      queryId: null,
      value: 123,
      valid: true,
      menu: false,
      noDataAlert: false,
      options: {},
      lastPage: 1,
      totalItems: 0,
      footerProps: {
        'items-per-page-options': [10, 25, 50, 100, 200, 500],
      },
      orders: [],
      loading: true,
      headers: [
        {
          text: '訂單號碼',
          value: 'o_no',
          align: 'left',
          sortable: false,
        },
        {
          text: '訂單日期', value: 'o_date', width: '7%', align: 'center',
        },
        {
          text: '賣方名稱', value: 'o_seller_name', sortable: false, width: '10%', align: 'center',
        },
        {
          text: '買方名稱', value: 'o_buyer_name', sortable: false, align: 'center',
        },
        {
          text: '產品名稱', value: 'o_product_name', sortable: false, align: 'center',
        },
        { text: '產品料號', value: 'o_product_part_no', sortable: false },
        {
          text: '產品規格', value: 'o_product_spec', sortable: false, align: 'center', width: '30%',
        },
        { text: '產品價格', value: 'o_product_price' },
        {
          text: '幣別', value: 'o_currency', sortable: false, width: '1%',
        },
        { text: '採購數量', value: 'o_quantity', width: '1%' },
        { text: '採購金額', value: 'o_amount', width: '1%' },
        { text: '付款條件', value: 'o_note', sortable: false },
        {
          text: 'Actions', value: 'action', sortable: false, width: '1%',
        },
      ],
      editIndex: -1,
      editItem: {
        o_no: '',
        o_date: '',
        o_seller_name: '',
        o_buyer_name: '',
        o_product_name: '',
        o_product_part_no: '',
        o_product_spec: '',
        o_product_price: '',
        o_currency: 'USD',
        o_quantity: '',
        o_amount: '',
        o_note: '',
      },
      default: {
        o_no: '',
        o_date: '',
        o_seller_name: '',
        o_buyer_name: '',
        o_product_name: '',
        o_product_part_no: '',
        o_product_spec: '',
        o_product_price: '',
        o_currency: 'USD',
        o_quantity: '',
        o_amount: '',
        o_note: '',
      },
      rules: {
        required: (v) => !!v || 'Required',
      },
    };
  },
  computed: {
    ...mapState({
      q: (state) => state.filter.q,
      filter: (state) => state.filter.search,
    }),
    tableSelected: {
      get() {
        return this.selected;
      },
      set(val) {
        this.$emit('update:selected', val);
      },
    },
    filterIsNotEmpty() {
      return this.$store.getters['filter/filterIsNotEmpty'];
    },
    formTitle() {
      return this.editIndex === -1 ? '新增資料' : '修改資料';
    },
  },
  watch: {
    options: {
      async handler() {
        this.loading = true;
        let result;
        if (this.q || this.filterIsNotEmpty || this.queryId) {
          await this.getSearch()
            .then((data) => {
              result = data;
            });
        } else {
          await this.getDataFromApi()
            .then((data) => {
              result = data;
            })
            .catch((error) => this.upFlash({ type: 'error', content: error.message }));
        }
        if (result) {
          this.lastPage = result.last_page;
          this.orders = result.data;
          this.totalItems = result.total;
        }

        this.loading = false;
      },
      deep: true,
    },
  },
  created() {
    if (this.$route.query.id) this.queryId = this.$route.query.id;
  },
  mounted() {
  },
  methods: {
    ...mapMutations({
      upFlash: 'pushMessage',
      tConfirmDialog: 'confirm/toggleDialog',
    }),
    ...mapActions({
      search: 'filter/search',
    }),
    getDataFromApi() {
      return new Promise((resolve, reject) => {
        this.axios.get('orders', { params: this.options })
          .then((res) => resolve(res.data))
          .catch((error) => reject(error));
      });
    },
    editedItem(item) {
      this.editIndex = this.orders.indexOf(item);
      this.editItem = { ...item };
      this.$emit('toggleDialog', true);
    },
    deleteItem() {
      const { id } = this.$store.state.confirm;
      this.loading = true;
      this.axios.delete(`orders/${id}`).then(() => {
        this.upFlash({ type: 'success', content: '成功刪除一筆資料' });
        this.getDataFromApi()
          .then((d) => {
            this.orders = d.data;
            this.totalItems = d.total;
            this.lastPage = d.last_page;
          });
      }).catch((error) => {
        this.upFlash({ type: 'error', content: error.message });
      }).finally(() => {
        this.loading = false;
      });
    },
    close() {
      this.$emit('toggleDialog', false);
      setTimeout(() => {
        this.editItem = { ...this.defaultItem };
        this.editIndex = -1;
        this.$refs.form.resetValidation();
      }, 300);
    },
    save() {
      if (!this.$refs.form.validate()) return;
      this.loading = true;
      const index = this.editIndex;
      const item = this.editItem;
      if (index !== -1) {
        this.axios.put(`orders/${item.id}`, item).then(() => {
          Object.assign(this.orders, item);
          this.upFlash({ type: 'success', content: '成功修改一筆資料' });
          this.loading = false;
        }).catch((error) => {
          this.upFlash({ type: 'error', content: error.message });
          this.loading = false;
        });
      } else if (index === -1) {
        this.axios.post('orders', item).then(() => {
          this.upFlash({ type: 'success', content: '成功新增一筆資料' });
          if (this.totalItems % this.options.itemsPerPage === 0) {
            this.options.page = this.lastPage + 1;
          } else if (this.options.page === this.lastPage) {
            this.orders.push(item);
          } else {
            this.options.page = this.lastPage;
          }
          this.loading = false;
        }).catch((error) => {
          this.upFlash({ type: 'error', content: error.message });
          this.loading = false;
        });
      }
      this.close();
    },
    deleteArray() {
      this.orders = this.orders.filter((el) => !this.selected.includes(el));
    },
    reset() {
      this.$refs.form.reset();
    },
    amount() {
      this.editItem.o_amount = Math.round(
        this.editItem.o_product_price * this.editItem.o_quantity * 1000,
      ) / 1000;
    },
    getSearch() {
      return this.search({ type: 'orders', page: this.options, id: this.queryId });
    },
    dataAssign() {
      if (this.options.page !== 1) {
        this.options.page = 1;
      } else {
        this.loading = true;
        this.getSearch()
          .then((res) => {
            this.orders = res.data;
            this.totalItems = res.total;
            this.loading = false;
          })
          .catch((err) => {
            this.upFlash({ type: 'error', content: err.message });
            this.loading = false;
          });
      }
    },
  },
};
</script>
