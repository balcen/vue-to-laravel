<template>
  <v-app>
    <v-toolbar flat dense class="shrink">
      <v-toolbar-title to="/upload" class="headline text-uppercase">
        <span class="red--text text--darken-1">TSCL</span>
        <span class="font-weight-light">TRUST-SEARCH</span>
      </v-toolbar-title>
      <v-toolbar-items>
        <v-btn text to="/upload" :active-class="'red--text text--darken-1'">UPLOAD</v-btn>
        <v-btn text to="/index/" :active-class="'red--text text--darken-1'">DATA</v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-btn icon text v-if="!isLoggedIn" to="/login" :active-class="'red--text text--darken-1'"><v-icon>mdi-account</v-icon></v-btn>
      <v-btn icon text v-if="isLoggedIn" to="/dashboard" :active-class="'red--text text--darken-1'"><v-icon>account_circle</v-icon></v-btn>
      <v-btn icon text v-if="isLoggedIn" @click="logout" :active-class="'red--text text--darken-1'"><v-icon>logout</v-icon></v-btn>
    </v-toolbar>

    <v-content id="content">
      <div class="flash-content" v-if="flash.length">
        <v-alert v-for="(f, index) in flash"
          :key="index"
          :type="f.type"
          dismissible
          class="mx-0 customMessage" 
          min-width="500px"
        >
          {{ f.content }}
        </v-alert>
      </div>
      <!-- <flash-message text id="flashMessage" class="customMessage ma-2"></flash-message> -->
      <transition name="fade">
        <router-view
          :key="$route.fullPath"
        ></router-view>
      </transition>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'App',
  data () {
    return {
      bager: true,
    }
  },
  created: function() {
    this.axios.interceptors.response.use((res) => {
      var token = res.headers.authorization
      if (token) {
        this.refreshAction()
      }
      return res
    }, function(err) {
      return new Promise(function() {
        if (err.status === 401 && err.config && err.config.__isRetryReqeust) {
          this.logoutAction()
        }
        throw err
      })
    })
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'auth/isLoggedIn',
    }),
    flash: {
      get: function () {
        return this.$store.state.flash
      },
      set: function() {
      }
    }
  },
  methods: {
    ...mapActions({
      logoutAction: 'auth/logout',
      refreshAction: 'auth/refresh'
    }),
    logout() {
      this.logoutAction()
        .then(() => {
          this.$router.push({name: 'root'})
        })
    }
  }
}
</script>

<style>

html { overflow-y: auto !important }
/* v-btn 加上 link 的底線 */
a:not(.md-button):hover {
    text-decoration: none !important;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave {
  opacity: 0;
}

/* .customMessage {
  left: 50%;
  transform:translateX(-50%);
  z-index: 9999;
} */

.flash-content {
  position: fixed !important;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
}
/* 
#flashMessage .flash__message.success {
  background-color: #dff0d8 !important;
  border-color: #d6e9c6 !important;
} */

</style>

