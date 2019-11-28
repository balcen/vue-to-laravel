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
      <v-col cols="4" class="d-flex align-center">
        <v-row no-gutters align="center" justify="end">
          <!-- Search bar -->
          <v-col cols="6" class="mr-1 d-flex align-center">
            <v-text-field
              v-model="search"
              label="Search"
              color="red draken-1"
              single-line
              outlined
              hide-details
              rounded
              dense
              @keyup.enter="searchAll"
            >
              <template v-slot:append>
                <v-btn text icon @click="searchAll">
                  <v-icon>search</v-icon>
                </v-btn>
              </template>
            </v-text-field>
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
              class="mr-2"
              @click="multipleDelete" 
              :disabled="selected.length==0"
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
          @toggleDialog="toggleDialog"
          @getDataType="getDataType"
          @setSelected="setSelected"
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
      return this.selected.length < 1
    },
  },
  methods: {
    toggleDialog (bol) {
      this.dialog = bol
    },
    multipleDelete () {
      // let uri = `https://calm-ocean-96461.herokuapp.com/api/${this.dataType}DeleteAll`;
      let id = this.getColumn(this.selected, 'id')
      let num = id.length
      let idStr = id.join()

      confirm(`確定刪除${num}筆資料？`) && this.axios.delete(`${this.dataType}DeleteAll`, {data: { ids: idStr }}).then(() => {
        this.upFlash({ typa: 'success', content: `成功刪除${num}筆資料`})
        this.$refs.table.deleteArray()
      }).catch(error => {
        this.upFlash({type: 'error', content: error.message})
      })
    },
    getDataType(type) {
      this.dataType = type
    },
    // 取得array裡面的column
    getColumn (array, column) {
      // 取出Array裡面每一個元素的id，做成array
      return array.map((el) => {return el[column]})
    },
    searchAll() {
      this.$refs.table.getSearch()
        .then(data => this.$refs.table.dataAssign(data))
    },
    setSelected (sel) {
      this.selected = sel
    }
  }
}
</script>

<style>
.v-text-field.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-inner {
  margin: auto;
  padding: 0;
}

.v-text-field--rounded > .v-input__control > .v-input__slot {
  padding-right: 12px !important;
}
</style>
