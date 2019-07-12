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
          :key="$route.fullPath"
          :search="search"
          :dialog="dialog"
          @toggleDialog="toggleDialog"
          :selected.sync="selected"
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
      let uri = `http://172.16.110.7:8888/api/${this.dataType}DeleteAll`;
      let id = this.getColumn(this.selected, 'id');
      let idStr = id.join();
      console.log(idStr);
      this.axios.delete(uri, this.selected).then(response => {
        this.$router.go();
        console.log(response.data.result);
      }).catch(error => {
        console.log(error.message);
      })
    },
    getDataType(type) {
      this.dataType = type;
    },
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
</style>
