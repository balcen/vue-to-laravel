<template>
  <div>
    <NavigationMain></NavigationMain>
    <AlertConfirm :length="id.length" @allow="multipleDelete" @cancel="cancel"></AlertConfirm>
    <v-row
      dense
      no-gutters
      row
      no-wrap
    >
      <v-col cols="6">
        <v-tabs
          fixed-tabs
          color="red darken-1"
        >
          <v-tab
            to="/index/clients"
            text
          >
            CLIENT
          </v-tab>
          <v-tab
            to="/index/products"
            text
          >
            PRODUCT
          </v-tab>
          <v-tab
            to="/index/orders"
            text
          >
            ORDER
          </v-tab>
          <v-tab
            to="/index/invoices"
            text
          >
            INVOICE
          </v-tab>
        </v-tabs>
      </v-col>
      <v-spacer></v-spacer>
      <v-col
        cols="4"
        class="d-flex align-center"
      >
        <v-row
          no-gutters
          align="center"
          justify="end"
        >
          <!-- Search bar -->
          <v-col
            cols="6"
            class="mr-1 d-flex align-center"
          >
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
                <v-btn
                  text
                  icon
                  @click="searchAll"
                >
                  <v-icon>search</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col
            align-self="center"
            cols="auto"
          >
            <FilterMenuComponent @searchAll="searchAll" />
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
              @click.stop="tConfirmDialog(true)"
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
          :dialog="dialog"
          :selected.sync="selected"
          @toggleDialog="toggleDialog"
          @setSelected="setSelected"
        ></router-view>
      </v-col>
    </v-row>

    <transition name="fade">
      <v-btn
        v-show="fabBtn"
        fab
        fixed
        bottom
        right
        dark
        color="red darken-1"
        @click="toTop"
        v-scroll="onScroll"
      >
        <v-icon>mdi-chevron-up</v-icon>
      </v-btn>
    </transition>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import FilterMenuComponent from './menu/FilterMenuComponent';
import NavigationMain from './NavigationMain';
import AlertConfirm from './AlertConfirm';

export default {
  components: {
    FilterMenuComponent,
    NavigationMain,
    AlertConfirm,
  },
  data() {
    return {
      activeBtn: 1,
      color: '',
      dialog: false,
      selected: [],
      dataType: this.$route.name,
      fabBtn: false,
    };
  },
  computed: {
    confirmDialog: {
      get() {
        return this.$store.state.confirm.dialog;
      },
      set(bol) {
        this.$store.commit('confirm/toggleDialog', bol);
      },
    },
    search: {
      get() {
        return this.$store.state.filter.q;
      },
      set(value) {
        this.tConfirmDialog(value);
      },
    },
    selectedValue: () => (this.selected.length < 1),
    id() {
      return this.getColumn(this.selected, 'id');
    },
  },
  methods: {
    ...mapMutations({
      upFlash: 'pushMessage',
      tConfirmDialog: 'confirm/toggleDialog',
      tLoading: 'confirm/toggleLoading',
    }),
    toggleDialog(bol) {
      this.dialog = bol;
    },
    multipleDelete() {
      this.tLoading(true);
      // let uri = `https://calm-ocean-96461.herokuapp.com/api/${this.dataType}DeleteAll`;
      const idStr = this.id.join();
      this.axios.delete(`${this.dataType}/deleteAll`, { data: { ids: idStr } }).then(() => {
        this.upFlash({ type: 'success', content: `成功刪除${this.id.length}筆資料` });
        this.tLoading(false);
        this.$refs.table.deleteArray();
      }).catch((error) => {
        this.upFlash({ type: 'error', content: error.message });
        this.tLoading(false);
      });
    },
    // 取得array裡面的column
    getColumn(array, column) {
      // 取出Array裡面每一個元素的id，做成array
      return array.map((el) => el[column]);
    },
    searchAll() {
      this.$refs.table.dataAssign();
    },
    setSelected(sel) {
      this.selected = sel;
    },
    onScroll(e) {
      const top = e.target.scrollingElement.scrollTop;
      this.fabBtn = top > 20;
    },
    toTop() {
      this.$vuetify.goTo(0, { easing: 'easeInOutCubic' });
    },
    cancel() {
      this.selected = [];
    },
  },
};
</script>

<style>
.v-text-field.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo)
.v-text-field--outlined .v-input__append-inner {
  margin: auto;
  padding: 0;
}

.v-text-field--rounded > .v-input__control > .v-input__slot {
  padding-right: 12px !important;
}
</style>
