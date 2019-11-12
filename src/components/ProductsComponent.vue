<template>
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="products"
    :options.sync="options"
    :server-items-length="totalItems"
    :footer-props="footerProps"
    :loading="loading"
    :search="search"
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
          <span class="headline">
            {{ formTitle }}
          </span>
        </v-card-title>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-text>
            <v-container grid-list-md>
              <v-row wrap>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field :rules="[rules.required]" v-model="editItem.p_type" label="產品類型" maxlength="30"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="editItem.p_image" label="產品圖片" readonly @click="upload"></v-text-field>
                  <input @change="change" type="file" ref="image" id="image" accept="image/*">
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field :rules="[rules.required]" v-model="editItem.p_name" label="產品名稱"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field :rules="[rules.required]" v-model="editItem.p_part_no" label="產品料號" maxlength="100"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field :rules="[rules.required]" v-model="editItem.p_spec" label="產品規格"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field type="number" :rules="[rules.required]" v-model="editItem.p_price" label="產品價格" maxlength="12"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field :rules="[rules.required]" v-model="editItem.p_currency" label="幣別" maxlength="10"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="editItem.p_size" label="產品尺寸" maxlegnth="50"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="editItem.p_weight" label="產品重量" maxlength="15"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="editItem.p_note" label="備註"></v-text-field>
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
#image {
  height: 0;
  width: 0;
  display: none;
}
</style>

<script>
export default {
  props: ['search', 'dialog', 'selected', 'message'],
  data () {
    return {
      valid: true,
      noDataAlert: false,
      error: '',
      options: {},
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
    formTitle: function () {
      return this.editIndex === -1 ? 'New Item' : 'Edit Item';
    },
    getUrl: function () {
      let root = '?'
      if (this.search.length > 0) {
        const search = encodeURI(this.search)
        root += `q=${search}&`
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
      this.$emit('update:selected', this.selected);
      this.$emit('getDataType', 'products');
    },
    options: {
      async handler() {
        this.loading = true
        let result
        if(this.search.length > 0) {
          await this.getSearch()
            .then(data => result = data)

        } else if (this.$route.query.id) {
          await this.show()
            .then(data => result = data)
        } else {
          await this.getDataFromApi()
            .then(data => result = data)
        }
        this.products = result.data
        this.totalItems = result.total
        this.loading = false
      },
      deep: true
    }
  },
  created () {
  },
  mounted() {
    console.log(this.$route.query.id)
    // this.loading = true
    // this.getDataFromApi()
    //   .then(data => {
    //     this.products = data.data
    //     this.totalItems = data.total
    //     this.loading = false
    //   })
  },
  methods: {
    getDataFromApi() {
      return new Promise((resolve) => {
        this.axios.get(`products${this.getUrl}`)
          .then(res => {
           return resolve(res.data)
          })
      })
    },
    editedItem (item) {
      this.editIndex = this.products.indexOf(item);
      this.editItem = Object.assign({}, item);
      this.$emit('toggleDialog', true);
    },
    deleteItem (item) {
      const index = this.products.indexOf(item);
      // let uri = `http://localhost:8888/api/products/${item.id}`
      confirm('確定刪除這筆資料？') && this.axios.delete(`products/${item.id}`, item.id).then(() => {
          this.products.splice(index, 1);
          this.flash('成功刪除一筆資料', 'success');
      }).catch(error => {
          this.flash(error.message, 'error');
      })
    },
    close () {
      this.$emit('toggleDialog', false);
      setTimeout(() => {
        this.editItem = Object.assign({}, this.defaultItem);
        this.editIndex = -1;
        this.$refs.form.reset()
      }, 300)
    },
    save () {
      // let formData = new FormData;
      // formData.append('item', JSON.stringify(this.editItem));
      // formData.append('image', this.image);
      let index = this.editIndex;
      // let item = {item: this.editItem, image: this.image};
      let item = this.editItem;
      if(!this.$refs.form.validate()) return;
      if (index !== -1) {
        this.axios.put(`products/${item.id}`, item).then(() => {
          Object.assign(this.products[index], item);
          this.flash('成功修改一筆資料', 'success');
        }).catch(error => {
          this.flash(error.message, 'error');
        })
      } else if(index === -1) {
        // let uri = 'http://localhost:8888/api/products';
        this.axios.post(`products`, item).then(() => {
          this.products.push(item);
          this.flash('成功新增一筆資料', 'success');
        }).catch(error => {
          this.flash(error.message, 'error');
        })
      }
      
      this.close();
    },
    deleteArray() {
      this.products = this.products.filter((el) => !this.selected.includes(el));
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
    useSearch() {
      this.loading = true
      this.getSearch()
        .then (data => {
          this.prodcuts = data.data
          this.totalItems = data.total
          this.loading = false
        })
    },
    getSearch() {
      return new Promise ((resolve) => {
        this.axios.get(`products/search${this.getUrl}`)
          .then (res => {
            resolve(res.data)
          })
      })
      
    },
    show() {
      return new Promise((resolve) => {
        this.axios.get(`products/${this.$route.query.id}${this.getUrl}`)
          .then(res => {
            resolve(res.data)
          })
      })
    }
  }
}
</script>
