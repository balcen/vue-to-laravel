<template>
  <div>
    <v-row dense no-gutters row no-wrap>
      <v-col cols="6">
        <v-tabs fixed-tabs color="red darken-1">
          <v-tab to="/index/clients" text>CLIENT</v-tab>
          <v-tab to="/index/products" text>PRODUCT</v-tab>
          <v-tab to="/index/orders" text>ORDER</v-tab>
          <v-tab to="/index/invoices" text>INVOICE</v-tab>
        </v-tabs>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="4">
        <v-row no-gutters align-content="center" justify="space-around">
          <v-col cols="10" class="pr-2">
            <v-text-field
              v-model="search"
              label="Search"
              append-icon="search"
              color="red draken-1"
              single-line
              hide-details
              class="pt-1"
              @keyup.enter="searchAll"
            ></v-text-field>
          </v-col>
          <v-col align-self="center" cols="auto">
            <v-btn 
              text 
              icon
              @click.stop="toggleDialog(true)" 
            >
              <v-icon>add</v-icon>
            </v-btn>
            <v-btn 
              text 
              icon 
              color="red darken-1" 
              @click="multipleDelete" 
              :disabled="selectedValue"
            >
              <v-icon>delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row no-gutters overflow-auto>
      <v-col cols="12">
        <router-view
          ref="table"
          :key="$route.fullPath"
          :search="search"
          :dialog="dialog"
          :selected.sync="selected"
          @toggleDialog="toggleDialog"
          @getDataType="getDataType"
        ></router-view>
      </v-col>
    </v-row>
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
      // let uri = `https://calm-ocean-96461.herokuapp.com/api/${this.dataType}DeleteAll`;
      let id = this.getColumn(this.selected, 'id');
      let num = id.length;
      let idStr = id.join();

      confirm(`確定刪除${num}筆資料？`) && this.axios.delete(`${this.dataType}DeleteAll`, {data: { ids: idStr }}).then(() => {
        this.flash(`成功刪除${num}筆資料`, 'success', { timeout: 3000 });
        this.$refs.table.deleteArray();
      }).catch(error => {
        this.flash(error.message, 'error');
      })
    },
    getDataType(type) {
      this.dataType = type;
    },
    // 取得array裡面的column
    getColumn (array, column) {
      // 取出Array裡面每一個元素的id，做成array
      return array.map((el) => {return el[column]})
    },
    searchAll() {
      this.$refs.table.useSearch()
    }
  }
}
</script>

<style>
</style>
