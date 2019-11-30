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
      class="pa-3"
    >
      <v-list-item v-if="url === 'products'">
        <v-list-item-title>
          產品價格
        </v-list-item-title>
        <v-input></v-input>
        <v-input></v-input>
      </v-list-item>

      <v-list-item v-if="url === 'orders'">
        產品價格 / 採購數量 / 訂單日期
      </v-list-item>

      <v-list-item v-if="url === 'invoices'">
        產品價格 / 採購數量 / 發票日 / 發票到期日
      </v-list-item>

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
      menu: false,
      url: ''
    }
  },
  created () {
    this.url = this.$route.name
  }
}
</script>