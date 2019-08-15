<template>
  <div>
    <v-layout row no-wrap>
      <v-flex xs6>
        <v-tabs fixed-tabs>
          <v-tab to="/index/clients" flat color="teal">CLIENT</v-tab>
          <v-tab to="/index/products" flat color="teal">PRODUCT</v-tab>
          <v-tab to="/index/orders" flat color="teal">ORDER</v-tab>
          <v-tab to="/index/invoices" flat color="teal">INVOICE</v-tab>
        </v-tabs>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex xs3 class="pr-2">
        <v-text-field
          v-model="search"
          label="Search"
          append-icon="search"
          single-line
          hide-details
          class="pt-1"
        ></v-text-field>
      </v-flex>
      <v-flex shrink>
        <v-btn @click.stop="toggleDialog(true)" flat icon><v-icon>add</v-icon></v-btn>
        <v-btn flat icon color="red darken-1" @click="multipleDelete" :disabled="selectedValue"><v-icon>delete</v-icon></v-btn>
      </v-flex>
    </v-layout>
    <v-layout overflow-auto>
      <v-flex xs12>
        <router-view
          ref="table"
          :key="$route.fullPath"
          :search="search"
          :dialog="dialog"
          :selected.sync="selected"
          @toggleDialog="toggleDialog"
          @getDataType="getDataType"
        ></router-view>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeBtn: 1,
      search: '',
      color: '',
      dialog: false,
      selected: [],
      dataType: ''
    }
  },
  computed: {
    selectedValue: function() {
      return this.selected.length < 1;
    }
  },
  methods: {
    toggleDialog (bol) {
      this.dialog = bol;
    },
    multipleDelete () {
      let uri = `https://calm-ocean-96461.herokuapp.com/api/${this.dataType}DeleteAll`;
      let id = this.getColumn(this.selected, 'id');
      let num = id.length;
      let idStr = id.join();

      confirm(`確定刪除${num}筆資料？`) && this.axios.delete(uri, {data: { ids: idStr }}).then(response => {
        this.flash(`成功刪除${num}筆資料`, 'success', { timeout: 3000 });
        this.$refs.table.deleteArray();;
      }).catch(error => {
        this.flash(error.message, 'error');
      })
    },
    getDataType(type) {
      this.dataType = type;
    },
    // 取得array裡面的column
    getColumn (array, column) {
      return array.map((value, index) => {return value[column]});
    }
  }
}
</script>

<style>
  table.v-table tbody td:first-child, table.v-table tbody td:not(:first-child), table.v-table tbody th:first-child, table.v-table tbody th:not(:first-child), table.v-table thead td:first-child, table.v-table thead td:not(:first-child), table.v-table thead th:first-child, table.v-table thead th:not(:first-child) {
    padding: 0 10px
  }

  #actions {
    display: table-cell;
  }

  /* .v-btn.editBtn:hover{
    background-color: #FDD835;
    color: #FFFDE7;
  }
  .v-btn.deleteBtn:hover {
    background-color: #F44336;
    color: #FFEBEE;
  } */
</style>
