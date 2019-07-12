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
            <v-container fluid>
                    <router-view :key="$route.fullPath"></router-view>
            </v-container>
        </v-content>
    </v-app>
</template>


<script>
export default {
  name: 'App',
  data () {
    return {
      //
    }
  }
}
</script>
