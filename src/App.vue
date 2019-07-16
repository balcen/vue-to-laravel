<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title to="/upload" class="headline text-uppercase">
        <span class="red--text text--darken-1">TSCL</span>
        <span class="font-weight-light">TRUST-SEARCH</span>
      </v-toolbar-title>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn to="/upload" flat>UPLOAD</v-btn>
        <v-btn to="/index/clients" flat>DATA</v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn icon><v-icon>person</v-icon></v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <v-container class="pt-0" fluid>
        <v-alert
          :value="alert"
          :type="alertType"
          transition="scale-transition"
          dismissible
        >
          {{ alertValue }}
        </v-alert>
        <router-view
          :key="$route.fullPath"
          @getAlert="getAlert"
        ></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>


<script>
export default {
  name: 'App',
  data () {
    return {
      alert: false,
      alertType: '',
      alertValue: ''
    }
  },
  method: {
    getAlert: function (alert) {
      this.alert = true;
      this.alertType = alert.type;
      this.alertValue = alert.value;
    }
  }
}
</script>
