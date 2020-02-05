<template>
  <v-toolbar 
    flat 
    dense 
    class="shrink"
  >
    <v-toolbar-title 
      to="/upload" 
      class="headline text-uppercase"
    >
      <span class="red--text text--darken-1">TSCL</span>
      <span class="font-weight-light">TRUST-SEARCH</span>
    </v-toolbar-title>
    <v-toolbar-items>
      <v-btn 
        text 
        to="/upload" 
        :active-class="'red--text text--darken-1'"
      >
        UPLOAD
      </v-btn>
      <v-btn 
        text 
        to="/index/" 
        :active-class="'red--text text--darken-1'"
      >
        DATA
      </v-btn>
    </v-toolbar-items>
    <v-spacer></v-spacer>
    <v-btn 
      v-if="!isLoggedIn" 
      to="/login" 
      :active-class="'red--text text--darken-1'"
      icon 
      text 
    >
      <v-icon>mdi-account</v-icon>
    </v-btn>
    <v-btn 
      v-if="isLoggedIn" 
      :active-class="'red--text text--darken-1'"
      to="/dashboard" 
      icon 
      text 
    >
      <v-icon>account_circle</v-icon>
    </v-btn>
    <v-btn 
      v-if="isLoggedIn" 
      :active-class="'red--text text--darken-1'"
      icon 
      text 
      @click="logout" 
    >
      <v-icon>logout</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      
    }
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'auth/isLoggedIn'
    })
  }
}
</script>