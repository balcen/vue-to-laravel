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
      max-width="800"
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
                <v-text-field v-model="editItem.p_type" label="產品類型"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editItem.p_image" label="產品圖片"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editItem.p_name" label="產品名稱"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editItem.p_part_no" label="產品料號"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editItem.p_spec" label="產品規格"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editItem.p_price" label="產品價格"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editItem.p_currency" label="幣別"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editItem.p_size" label="產品尺寸"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editItem.p_weight" label="產品重量"></v-text-field>
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
      editIndex: -1,
      editItem: {
        'p_type': '',
        'p_image': '',
        'p_name': '',
        'p_part_no': '',
        'p_spec': '',
        'p_price': '',
        'p_currency': '',
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
        'p_currency': '',
        'p_size': '',
        'p_weight': '',
        'p_note': ''
      }
    }
  },
  created () {
    this.getProducts();
  },
  computed: {
    formTitle: function () {
      return this.editIndex === -1 ? 'New Item' : 'Edit Item';
    }
  },
  watch: {
    selected: function() {
      this.$emit('update:selected', this.selected);
      this.$emit('getDataType', 'products');
    }
  },
  methods: {
    getProducts () {
      let uri = 'https://calm-ocean-96461.herokuapp.com/api/products';
      this.axios.get(uri, {crossDomain: true}).then(response => {
          this.products = response.data;
          this.noDataAlert = true;
          this.loading = false;
      }).catch(error => this.error = error.message);
    },
    editedItem (item) {
      this.editIndex = this.products.indexOf(item);
      this.editItem = Object.assign({}, item);
      this.$emit('toggleDialog', true);
    },
    deleteItem (item) {
      const index = this.products.indexOf(item);
      let uri = `https://calm-ocean-96461.herokuapp.com/api/products/${item.id}`;
      confirm('確定刪除這筆資料？') && this.axios.delete(uri, item.id).then(response => {
          this.products.splice(index, 1);
      }).catch(error => {
          console.log(error.message);
      })
    },
    close () {
      this.$emit('toggleDialog', false);
      setTimeout(() => {
        this.editItem = Object.assign({}, this.defaultItem);
        this.editIndex = -1;
      }, 1000)
    },
    save () {
      let index = this.editIndex;
      let item = this.editItem;
      if (index !== -1) {
        let uri = `https://calm-ocean-96461.herokuapp.com/api/products/${item.id}`;
        this.axios.put(uri, item).then(response => {
          this.$router.go();
        }).catch(error => {
          console.log(error.message);
        })
      } else {
        let uri = 'https://calm-ocean-96461.herokuapp.com/api/products';
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
