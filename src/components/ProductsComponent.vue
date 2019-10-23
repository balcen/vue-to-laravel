<template>
  <div>
    <v-layout overflow-auto>
      <v-flex xs12>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="products"
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
            <td>{{ props.item.p_type }}</td>
            <td class="text-xs-right">{{ props.item.p_image }}</td>
            <td class="text-xs-center">{{ props.item.p_name }}</td>
            <td class="text-xs-right">{{ props.item.p_part_no }}</td>
            <td class="text-xs-center">{{ props.item.p_spec }}</td>
            <td class="text-xs-right">{{ Math.round(props.item.p_price * 1000) / 1000 }}</td>
            <td class="text-xs-center">{{ props.item.p_currency }}</td>
            <td class="text-xs-right">{{ props.item.p_size }}</td>
            <td class="text-xs-right">{{ props.item.p_weight }}</td>
            <td class="text-xs-right">{{ props.item.p_note }}</td>
            <td id="actions" class="justify-center layout px-0">
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
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field :rules="[rules.required]" v-model="editItem.p_type" label="產品類型" maxlength="30"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editItem.p_image" label="產品圖片" readonly @click="upload"></v-text-field>
                  <input @change="change" type="file" ref="image" id="image" accept="image/*">
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field :rules="[rules.required]" v-model="editItem.p_name" label="產品名稱"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field :rules="[rules.required]" v-model="editItem.p_part_no" label="產品料號" maxlength="100"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field :rules="[rules.required]" v-model="editItem.p_spec" label="產品規格"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field type="number" :rules="[rules.required]" v-model="editItem.p_price" label="產品價格" maxlength="12"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field :rules="[rules.required]" v-model="editItem.p_currency" label="幣別" maxlength="10"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editItem.p_size" label="產品尺寸" maxlegnth="50"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editItem.p_weight" label="產品重量" maxlength="15"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editItem.p_note" label="備註"></v-text-field>
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
      rowsPerPage: [10,25,50,{"text":"$vuetify.dataIterator.rowsPerPageAll","value":-1}],
      noDataAlert: false,
      error: '',
      pagination: { rowsPerPage: 25, sortBy: 'id' },
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
  },
  watch: {
    selected: function() {
      this.$emit('update:selected', this.selected);
      this.$emit('getDataType', 'products');
    }
  },
  created () {
    this.getProducts();
  },
  methods: {
    getProducts () {
      this.axios.get('products', {crossDomain: true}).then(response => {
          this.products = response.data;
          this.noDataAlert = true;
          this.loading = false;
      }).catch(error => {
        this.flash(error.message, 'error');
      });
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
          this.flash('成功刪除一筆資料', 'success', { timeout: 3000 });
      }).catch(error => {
          this.flash(error.message, 'error');
      })
    },
    close () {
      this.$emit('toggleDialog', false);
      setTimeout(function() {
        this.$refs.form.reset()
        this.editItem = Object.assign({}, this.defaultItem);
        this.editIndex = -1;
      }, 3000)
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
          this.flash('成功修改一筆資料', 'success', { timeout: 3000 });
        }).catch(error => {
          this.flash(error.message, 'error');
        })
      } else if(index === -1) {
        // let uri = 'http://localhost:8888/api/products';
        this.axios.post(`products`, item).then(() => {
          this.products.push(item);
          this.flash('成功新增一筆資料', 'success', { timeout: 3000 });
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
    }
  }
}
</script>
