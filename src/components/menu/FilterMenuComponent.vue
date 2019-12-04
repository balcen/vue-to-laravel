<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    offset-y
  >
    <template v-slot:activator="{ on }">
      <v-btn
        text
        icon
        v-on="on"
        :disabled="url === 'clients'"
      >
        <v-icon>mdi-filter-variant</v-icon>
      </v-btn>
    </template>
    <v-card
      max-width="250"
    >

      <v-card-text class="pb-0" v-if="url === 'products'">
        <p class="body-1 mb-0">產品價格</p>
        <v-row justify="space-around">
          <v-col class="ma-0 pb-0" cols="5">
            <v-text-field
              v-model="search.minPrice"
              placeholder="最低價格"
              type="number"
              dense
            ></v-text-field>
          </v-col>
          <v-icon small>mdi-tilde</v-icon>
          <v-col class="ma-0 pb-0" cols="5">
            <v-text-field
              v-model="search.maxPrice"
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
              v-model="search.minPrice"
              placeholder="最小價格"
              dense
            ></v-text-field>
          </v-col>
          <v-icon small>mdi-tilde</v-icon>
          <v-col class="ma-0 pb-0">
            <v-text-field
              v-model="search.maxPrice"
              placeholder="最大價格"
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <p class="body-1 mb-0">購買數量</p>
        <v-row>
          <v-col class="ma-0 pb-0">
            <v-text-field
              v-model="search.minAmount"
              placeholder="最小數量"
              dense
            ></v-text-field>
          </v-col>
          <v-icon small>mdi-tilde</v-icon>
          <v-col class="ma-0 pb-0">
            <v-text-field
              v-model="search.maxAmount"
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
                  v-model="search.date1"
                  persistent-hint
                  readonly
                  dense
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker 
                v-model="search.date1" 
                no-title 
                :max="search.date2"
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
                  v-model="search.date2"
                  persistent-hint
                  readonly
                  dense
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker 
                v-model="search.date2" 
                no-title 
                :min="search.date1"
                @input="menu2 = false"
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
              v-model="search.minPrice"
              placeholder="最小價格"
              dense
            ></v-text-field>
          </v-col>
          <v-icon small>mdi-tilde</v-icon>
          <v-col class="ma-0 pb-0">
            <v-text-field
              v-model="search.maxPrice"
              placeholder="最大價格"
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <p class="body-1 mb-0">購買數量</p>
        <v-row>
          <v-col class="ma-0 pb-0">
            <v-text-field
              v-model="search.minAmount"
              placeholder="最小數量"
              dense
            ></v-text-field>
          </v-col>
          <v-icon small>mdi-tilde</v-icon>
          <v-col class="ma-0 pb-0">
            <v-text-field
              v-model="search.maxAmount"
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
                  v-model="search.date1"
                  persistent-hint
                  readonly
                  dense
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker 
                v-model="search.date1" 
                no-title 
                :max="search.date2"
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
                  v-model="search.date2"
                  persistent-hint
                  readonly
                  dense
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker 
                v-model="search.date2" 
                no-title 
                :min="search.date1"
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
                  v-model="search.expireDate1"
                  persistent-hint
                  readonly
                  dense
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker 
                v-model="search.expireDate1" 
                no-title 
                :max="search.expireDate2"
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
                  v-model="search.expireDate2"
                  persistent-hint
                  readonly
                  dense
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker 
                v-model="search.expireDate2" 
                no-title 
                :min="search.expireDate1"
                @input="menu4 = false"
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
      search: {
        minPrice: null,
        maxPrice: null,
        minAmount: null,
        maxAmount: null,
        date1: null,
        date2: null,
        expireDate1: null,
        expireDate2: null,
      }
    }
  },
  created () {
    this.url = this.$route.name
  },
  methods: {
    ...mapMutations({
      setSearch: 'menu/setSearch'
    }),
    ...mapActions({
      getSearch: 'menu/search'
    }),
    menuSearch () {
      this.setSearch(this.search)
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