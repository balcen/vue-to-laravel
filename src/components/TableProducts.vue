<template>
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="products"
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
      max-width="800"
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
                    v-model="editItem.p_type" 
                    label="產品類型" 
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
                    v-model="editItem.p_image" 
                    label="產品圖片" 
                    readonly 
                    @click="upload"
                  ></v-text-field>
                  <input 
                    id="image" 
                    ref="image" 
                    type="file" 
                    accept="image/*"
                    @change="change" 
                  >
                </v-col>
                <v-col 
                  cols="12" 
                  sm="6" 
                  md="4"
                >
                  <v-text-field 
                    :rules="[rules.required]" 
                    v-model="editItem.p_name" 
                    label="產品名稱"
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
                    :rules="[rules.required]" 
                    v-model="editItem.p_part_no" 
                    label="產品料號" 
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
                    :rules="[rules.required]" 
                    v-model="editItem.p_spec" 
                    label="產品規格"
                  ></v-text-field>
                </v-col>
                <v-col 
                  cols="12"
                  sm="6" 
                  md="4"
                >
                  <v-text-field 
                    type="number" 
                    :rules="[rules.required]" 
                    v-model="editItem.p_price" 
                    label="產品價格" 
                    maxlength="17"
                  ></v-text-field>
                </v-col>
                <v-col 
                  cols="12" 
                  sm="6" 
                  md="4"
                >
                  <v-text-field 
                    :rules="[rules.required]" 
                    v-model="editItem.p_currency" 
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
                    v-model="editItem.p_size" 
                    label="產品尺寸" 
                    maxlegnth="50"
                    counter="50"
                  ></v-text-field>
                </v-col>
                <v-col 
                  cols="12" 
                  sm="6"
                  md="4"
                >
                  <v-text-field 
                    v-model="editItem.p_weight" 
                    label="產品重量" 
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
                    v-model="editItem.p_note" 
                    label="備註"
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
      @click="deleteItem(item)"
    >
      delete
    </v-icon>
  </template>

  <template v-slot:no-data>
      <v-alert 
        type="error" 
        class="text-left my-3"
      >
        抱歉，這裡沒有任何資料 :(
      </v-alert>
  </template>
  
  </v-data-table>
</template>

<style>
#image {
  height: 0;
  width: 0;
  display: none;
}
</style>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  props: ['dialog'],
  data () {
    return {
      selected: [],
      queryId: null,
      valid: true,
      noDataAlert: false,
      error: '',
      options: {},
      lastPage: 1,
      totalItems: 0,
      footerProps: {
        'items-per-page-options': [10, 25, 50, 100, 200, 500]
      },
      products: [],
      loading: true,
      headers: [
        {
          text: '產品類型',
          value: 'p_type',
          align: 'left',
          sortable: false,
        },
        { text: '產品圖片', value: "p_image", sortable: false },
        { text: '產品名稱', value: "p_name", sortable: false, align: "center" },
        { text: '產品料號', value: "p_part_no", sortable: false },
        { text: '產品規格', value: "p_spec", sortable: false, align: "center", width: "30%" },
        { text: '產品價格', value: "p_price", width: "1%" },
        { text: '幣值', value: "p_currency", sortable: false, width: "1%" },
        { text: '產品尺寸', value: "p_size", sortable: false },
        { text: '產品重量', value: "p_weight", sortable: false },
        { text: '備註', value: "p_note", sortable: false },
        { text: 'Actions', value: 'action', sortable: false, width: "1%" }
      ],
      image: null,
      editIndex: -1,
      editItem: {
        'p_type': '',
        'p_image': '',
        'p_name': '',
        'p_part_no': '',
        'p_spec': '',
        'p_price': '',
        'p_currency': 'USD',
        'p_size': '',
        'p_weight': '',
        'p_note': ''
      },
      defaultItem: {
        'p_type': '',
        'p_image': '',
        'p_name': '',
        'p_part_no': '',
        'p_spec': '',
        'p_price': '',
        'p_currency': 'USD',
        'p_size': '',
        'p_weight': '',
        'p_note': ''
      },
      rules: {
        required: v => !!v || 'Required'
      }
    }
  },
  computed: {
    ...mapState({
      q: state => state.filter.q,
      filter: state => state.filter.search
    }),
    filterIsNotEmpty: function () {
      return this.$store.getters['filter/filterIsNotEmpty']
    },
    formTitle: function () {
      return this.editIndex === -1 ? 'New Item' : 'Edit Item';
    },
  },
  watch: {
    selected: function() {
      // this.$emit('update:selected', this.selected)
      this.$emit('setSelected', this.selected)
      this.$emit('getDataType', 'products')
    },
    options: {
      async handler() {
        this.loading = true
        let result
        if(this.q || this.filterIsNotEmpty || this.queryId) {
          await this.getSearch()
            .then(data => result = data)

        } else {
          await this.getDataFromApi()
            .then(data => result = data)
            .catch(error => this.upFlash({type: 'error', content: error.message}))
        }

        if (result) {
          this.lastPage = result.last_page
          this.products = result.data
          this.totalItems = result.total
        }
        
        this.loading = false
      },
      deep: true
    }
  },
  created () {
    if (this.$route.query.id) this.queryId = this.$route.query.id
  },
  mounted() {
  },
  methods: {
    ...mapMutations({
      upFlash: 'pushMessage'
    }),
    ...mapActions({
      search: 'filter/search'
    }),
    getDataFromApi() {
      return new Promise((resolve, reject) => {
        this.axios.get('products', {params: this.options})
          .then(res => resolve(res.data))
          .catch(error => reject(error))
      })
    },
    editedItem (item) {
      this.editIndex = this.products.indexOf(item)
      this.editItem = Object.assign({}, item)
      this.$emit('toggleDialog', true);
    },
    deleteItem (item) {
      const index = this.products.indexOf(item)
      this.loading = true
      confirm('確定刪除這筆資料？') && this.axios.delete(`products/${item.id}`, item.id).then(() => {
          this.products.splice(index, 1)
          this.upFlash({type: 'success', content: '成功刪除一筆資料'})
          this.loading = false
      }).catch(error => {
          this.upFlash({type: 'error', content: error.message})
          this.loading = false
      })
    },
    close () {
      this.$emit('toggleDialog', false)
      setTimeout(() => {
        this.editItem = Object.assign({}, this.defaultItem);
        this.editIndex = -1;
        // this.reset()
        this.$$refs.form.resetValidation()
      }, 300)
    },
    save () {
      if(!this.$refs.form.validate()) return
      this.loading = true
      // let formData = new FormData;
      // formData.append('item', JSON.stringify(this.editItem));
      // formData.append('image', this.image);
      let index = this.editIndex
      // let item = {item: this.editItem, image: this.image};
      let item = this.editItem
      if (index !== -1) {
        this.axios.put(`products/${item.id}`, item).then(() => {
          Object.assign(this.products, item)
          this.upFlash({type: 'success', content: '成功修改一筆資料'})
          this.loading = false
        }).catch(error => {
          this.upFlash({type: 'error', content: error.message})
          this.loading = false
        })
      } else if(index === -1) {
        this.axios.post(`products`, item).then(() => {
          this.upFlash({type: 'success', content: '成功新增一筆資料'})
          if (this.totalItems % this.options.itemsPerPage === 0) {
            this.options.page = this.lastPage + 1
          } else if (this.options.page === this.lastPage){
            this.products.push(item)
          } else {
            this.options.page = this.lastPage
          }
          this.loading = false
        }).catch(error => {
          this.upFlash({type: 'error', content: error.message})
          this.loading = false
        })
      }
      this.close()
    },
    deleteArray() {
      this.products = this.products.filter((el) => !this.selected.includes(el));
    },
    reset() {
      this.$refs.form.reset()
    },
    // Image Upload Method
    upload() {
      this.$refs.image.click();
    },
    change(e) {
      this.image = e.target.files[0];
      this.editItem.p_image = e.target.files[0].name;
    },
    fileReset() {
      const input = this.$refs.image;
      input.type = 'text';
      input.type = 'file';
    },
    getSearch() {
      return this.search({type: 'products', page: this.options, id: this.queryId})
    },
    dataAssign() {
      if (this.options.page !== 1) {
        this.options.page = 1
      } else {
        this.loading = true
        this.getSearch()
          .then(res => {
            this.products = res.data
            this.totalItems = res.total
            this.loading = false
          })
          .catch(err => {
            this.upFlash({type: 'error', content: err.message})
            this.loading = false
          })
      }
    }
  }
}
</script>
