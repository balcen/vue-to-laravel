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
              v-model="product.minPrice"
              placeholder="最低價格"
              type="number"
              dense
            ></v-text-field>
          </v-col>
          <v-icon small>mdi-tilde</v-icon>
          <v-col class="ma-0 pb-0" cols="5">
            <v-text-field
              v-model="product.maxPrice"
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
              placeholder="最小價格"
              dense
            ></v-text-field>
          </v-col>
          <v-icon small>mdi-tilde</v-icon>
          <v-col class="ma-0 pb-0">
            <v-text-field
              placeholder="最大價格"
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <p class="body-1 mb-0">購買數量</p>
        <v-row>
          <v-col class="ma-0 pb-0">
            <v-text-field
              placeholder="最小數量"
              dense
            ></v-text-field>
          </v-col>
          <v-icon small>mdi-tilde</v-icon>
          <v-col class="ma-0 pb-0">
            <v-text-field
              placeholder="最大數量"
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <p class="body-1 mb-0">訂單日期</p>
        <v-row>
          <v-col class="ma-0 pb-0">
            <v-menu
              v-model="order.date.menu1"
              :close-on-content-click="false"
              transition="scale-transition"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="order.date.date1"
                  persistent-hint
                  readonly
                  dense
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker 
                v-model="order.date.date1" 
                no-title 
                :max="order.date.date2"
                @input="order.date.menu1 = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-icon small>mdi-tilde</v-icon>
          <v-col class="ma-0 pb-0">
            <v-menu
              v-model="order.date.menu2"
              :close-on-content-click="false"
              transition="scale-transition"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="order.date.date2"
                  persistent-hint
                  readonly
                  dense
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker 
                v-model="order.date.date2" 
                no-title 
                :min="order.date.date1"
                @input="order.date.menu2 = false"
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
              placeholder="最小價格"
              dense
            ></v-text-field>
          </v-col>
          <v-icon small>mdi-tilde</v-icon>
          <v-col class="ma-0 pb-0">
            <v-text-field
              placeholder="最大價格"
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <p class="body-1 mb-0">購買數量</p>
        <v-row>
          <v-col class="ma-0 pb-0">
            <v-text-field
              placeholder="最小數量"
              dense
            ></v-text-field>
          </v-col>
          <v-icon small>mdi-tilde</v-icon>
          <v-col class="ma-0 pb-0">
            <v-text-field
              placeholder="最大數量"
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <p class="body-1 mb-0">發票日</p>
        <v-row>
          <v-col class="ma-0 pb-0">
            <v-menu
              v-model="invoice.date.menu1"
              :close-on-content-click="false"
              transition="scale-transition"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="invoice.date.date1"
                  persistent-hint
                  readonly
                  dense
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker 
                v-model="invoice.date.date1" 
                no-title 
                :max="invoice.date.date2"
                @input="invoice.date.menu1 = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-icon small>mdi-tilde</v-icon>
          <v-col class="ma-0 pb-0">
            <v-menu
              v-model="invoice.date.menu2"
              :close-on-content-click="false"
              transition="scale-transition"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="invoice.date.date2"
                  persistent-hint
                  readonly
                  dense
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker 
                v-model="invoice.date.date2" 
                no-title 
                :min="invoice.date.date1"
                @input="invoice.date.menu2 = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <p class="body-1 mb-0">發票到期日</p>
        <v-row>
          <v-col class="ma-0 pb-0">
            <v-menu
              v-model="invoice.expireDate.menu1"
              :close-on-content-click="false"
              transition="scale-transition"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="invoice.expireDate.date1"
                  persistent-hint
                  readonly
                  dense
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker 
                v-model="invoice.expireDate.date1" 
                no-title 
                :max="invoice.expireDate.date2"
                @input="invoice.expireDate.menu1 = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-icon small>mdi-tilde</v-icon>
          <v-col class="ma-0 pb-0">
            <v-menu
              v-model="invoice.expireDate.menu2"
              :close-on-content-click="false"
              transition="scale-transition"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="invoice.expireDate.date2"
                  persistent-hint
                  readonly
                  dense
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker 
                v-model="invoice.expireDate.date2" 
                no-title 
                :min="invoice.expireDate.date1"
                @input="invoice.expireDate.menu2 = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-btn
          text
          color="primary"
        >
          搜尋
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  data () {
    return {
      menu: true,
      url: '',
      product: {
        minPrice: null,
        maxPrice: null
      },
      order: {
        date: {
          menu1: false,
          menu2: false,
          date1: null,
          date2: null
        }
      },
      invoice: {
        date: {
          menu1: false,
          menu2: false,
          date1: null,
          date2: null,
        },
        expireDate: {
          menu1: false,
          menu2: false,
          date1: null,
          date2: null,
        }
      }
    }
  },
  created () {
    this.url = this.$route.name
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