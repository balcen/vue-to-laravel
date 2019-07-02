<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>TSCL</span>
        <span class="font-weight-light">TRUST-SEARCH</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-content>
      <Crud/>
    </v-content>
  </v-app>
</template>

<script>
import Crud from './components/Crud'

export default {
  name: 'App',
  components: {
    Crud
  },
  data () {
    return {
      //
    }
  }
}
</script>
