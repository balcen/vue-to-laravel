<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    offset-y
  >
    <template v-slot:activator="{ on }">
      <v-btn
        :disabled="url === 'clients'"
        text
        icon
        v-on="on"
      >
        <v-icon>mdi-filter-variant</v-icon>
      </v-btn>
    </template>
    <v-card
      max-width="250"
    >

      <v-card-text 
        v-if="url === 'products'"
        class="pb-0" 
      >
        <p class="body-1 mb-0">產品價格</p>
        <v-row justify="space-around">
          <v-col 
            class="ma-0 pb-0" 
            cols="5"
          >
            <v-text-field
              v-model="minPrice"
              placeholder="最低價格"
              type="number"
              dense
            ></v-text-field>
          </v-col>
          <v-icon small>mdi-tilde</v-icon>
          <v-col 
            class="ma-0 pb-0" 
            cols="5"
          >
            <v-text-field
              v-model="maxPrice"
              placeholder="最高價格"
              type="number"
              dense
            >
            </v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text v-if="url === 'orders'">
        <p class="body-1 mb-0">產品價格</p>
        <v-row>
          <v-col class="ma-0 pb-0">
            <v-text-field
              v-model="minPrice"
              placeholder="最小價格"
              dense
            ></v-text-field>
          </v-col>
          <v-icon small>mdi-tilde</v-icon>
          <v-col class="ma-0 pb-0">
            <v-text-field
              v-model="maxPrice"
              placeholder="最大價格"
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <p class="body-1 mb-0">購買數量</p>
        <v-row>
          <v-col class="ma-0 pb-0">
            <v-text-field
              v-model="minAmount"
              placeholder="最小數量"
              dense
            ></v-text-field>
          </v-col>
          <v-icon small>mdi-tilde</v-icon>
          <v-col class="ma-0 pb-0">
            <v-text-field
              v-model="maxAmount"
              placeholder="最大數量"
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <p class="body-1 mb-0">訂單日期</p>
        <v-row>
          <v-col class="ma-0 pb-0">
            <v-menu
              v-model="menu1"
              :close-on-content-click="false"
              transition="scale-transition"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="earlierDate"
                  persistent-hint
                  readonly
                  dense
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker 
                v-model="earlierDate" 
                no-title 
                :max="laterDate"
                @input="menu1=false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-icon small>mdi-tilde</v-icon>
          <v-col class="ma-0 pb-0">
            <v-menu
              v-model="menu2"
              :close-on-content-click="false"
              transition="scale-transition"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="laterDate"
                  persistent-hint
                  readonly
                  dense
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker 
                v-model="laterDate" 
                no-title 
                :min="earlierDate"
                @input="menu2=false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
      </v-card-text>
      
      <v-card-text v-if="url === 'invoices'">
        <p class="body-1 mb-0">產品價格</p>
        <v-row>
          <v-col class="ma-0 pb-0">
            <v-text-field
              v-model="minPrice"
              placeholder="最小價格"
              dense
            ></v-text-field>
          </v-col>
          <v-icon small>mdi-tilde</v-icon>
          <v-col class="ma-0 pb-0">
            <v-text-field
              v-model="maxPrice"
              placeholder="最大價格"
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <p class="body-1 mb-0">購買數量</p>
        <v-row>
          <v-col class="ma-0 pb-0">
            <v-text-field
              v-model="minAmount"
              placeholder="最小數量"
              dense
            ></v-text-field>
          </v-col>
          <v-icon small>mdi-tilde</v-icon>
          <v-col class="ma-0 pb-0">
            <v-text-field
              v-model="maxAmount"
              placeholder="最大數量"
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <p class="body-1 mb-0">發票日</p>
        <v-row>
          <v-col class="ma-0 pb-0">
            <v-menu
              v-model="menu1"
              :close-on-content-click="false"
              transition="scale-transition"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="earlierDate"
                  persistent-hint
                  readonly
                  dense
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker 
                v-model="earlierDate" 
                no-title 
                :max="laterDate"
                @input="menu1 = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-icon small>mdi-tilde</v-icon>
          <v-col class="ma-0 pb-0">
            <v-menu
              v-model="menu2"
              :close-on-content-click="false"
              transition="scale-transition"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="laterDate"
                  persistent-hint
                  readonly
                  dense
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker 
                v-model="laterDate" 
                no-title 
                :min="earlierDate"
                @input="menu2 = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <p class="body-1 mb-0">發票到期日</p>
        <v-row>
          <v-col class="ma-0 pb-0">
            <v-menu
              v-model="menu3"
              :close-on-content-click="false"
              transition="scale-transition"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="earlierExpDate"
                  persistent-hint
                  readonly
                  dense
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker 
                v-model="earlierExpDate" 
                no-title 
                :max="laterExpDate"
                @input="menu3 = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-icon small>mdi-tilde</v-icon>
          <v-col class="ma-0 pb-0">
            <v-menu
              v-model="menu4"
              :close-on-content-click="false"
              transition="scale-transition"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="laterExpDate"
                  persistent-hint
                  readonly
                  dense
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker 
                v-model="laterExpDate" 
                no-title 
                :min="earlierExpDate"
                @input="menu4=false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-btn
          text
          color="primary"
          @click="menuSearch"
        >
          搜尋
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
export default {
  data () {
    return {
      menu: false,
      menu1: false,
      menu2: false,
      menu3: false,
      menu4: false,
      url: '',
    }
  },
  computed: {
    minPrice: {
      get () {
        return this.$store.state.filter.search.minPrice
      },
      set (val) {
        this.$store.commit('filter/setMinPrice', val)
      }
    },
    maxPrice: {
      get () {
        return this.$store.state.filter.search.maxPrice
      },
      set (val) {
        this.$store.commit('filter/setMaxPrice', val)
      }
    },
    minAmount: {
      get () {
        return this.$store.state.filter.search.minAmount
      },
      set (val) {
        this.$store.commmit('filter/setMinAmount', val)
      }
    },
    maxAmount: {
      get () {
        return this.$store.state.filter.search.maxAmount
      },
      set (val) {
        this.$store.commit('filter/setMaxAmount', val)
      }
    },
    earlierDate: {
      get() {
        return this.$store.state.filter.search.earlierDate
      },
      set (date) {
        this.$store.commit('filter/setEarlierDate', date)
      }
    },
    laterDate: {
      get () {
        return this.$store.state.filter.search.laterDate
      },
      set (date) {
        this.$store.commit('filter/setLaterDate', date)
      }
    },
    earlierExpDate: {
      get () {
        return this.$store.state.filter.search.earlierExpDate
      },
      set (date) {
        this.$store.commit('filter/earlierExpDate', date)
      }
    },
    laterExpDate: {
      get () {
        return this.$store.state.filter.search.laterExpDate
      },
      set (date) {
        this.$store.commit('filter/setLaterExpDate', date)
      }
    },
    filterIsEmpty () {
      return this.$store.getters['filter/filterIsEmpty']
    }
  },
  created () {
    this.url = this.$route.name
  },
  methods: {
    ...mapMutations({
      setSearch: 'filter/setSearch'
    }),
    ...mapActions({
      getSearch: 'filter/search'
    }),
    menuSearch () {
      this.$emit('searchAll')
    }
  }
}
</script>

<style>
/* 取消 input type number spinner */
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
</style>