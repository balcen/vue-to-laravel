<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title to="/upload" class="headline text-uppercase">
        <span class="red--text text--darken-1">TSCL</span>
        <span class="font-weight-light">TRUST-SEARCH</span>
      </v-toolbar-title>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn to="/upload" flat :active-class="'red--text text--darken-1'">UPLOAD</v-btn>
        <v-btn to="/index/" flat :active-class="'red--text text--darken-1'">DATA</v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn icon><v-icon>person</v-icon></v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <v-container class="pt-0" fluid>
        <flash-message class="customMessage ma-2"></flash-message>
        <router-view
          :key="$route.fullPath"
        ></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<style>
.customMessage {
  transition: all 0.5s ease-in-out;
}

.customMessage .success {
  background-color: #dff0d8 !important;
}

.customMessage .error {
  background-color: #f2dede !important;
}

.customMessage .warning {
  background-color: #fcf8e3 !important;
}

.customMessage .info {
  background-color: #f2f5fe !important;
}

/* 取消 btn 的 active 背景色
.v-btn--active:before, .v-btn:hover:before, .v-btn:focus:before {
    background-color: transparent !important;
} */
</style>

<script>
export default {
  name: 'App',
  data () {
    return {
    }
  }
}
</script>
