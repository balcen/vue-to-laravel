<template>
  <v-app>
    <!-- <v-toolbar
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
          to="/upload
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
    </v-toolbar> -->

    <v-content id="content">
      <v-snackbar
        v-model="is_visible"
        :color="messageType"
        top
      >
        <span v-text="currentMessage" />
        <v-btn
          dark
          text
          @click="is_visible=false"
        >
          Close
        </v-btn>
      </v-snackbar>

      <transition name="fade">
        <router-view
          :key="$route.fullPath"
        ></router-view>
      </transition>
    </v-content>
  </v-app>
</template>

<script>
import {
  mapState, mapGetters, mapActions, mapMutations,
} from 'vuex';

export default {
  name: 'App',
  data() {
    return {
      bager: true,
      is_visible: false,
      currentMessage: null,
      messageType: null,
    };
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'auth/isLoggedIn',
    }),
    ...mapState({
      messageLine: (state) => state.messageLine,
    }),
  },
  watch: {
    messageLine: {
      handler() {
        if (!this.is_visible) {
          this.shiftMessage();
        } else if (this.messageLine.length) {
          this.is_visible = false;
          setTimeout(() => {
            this.shiftMessage();
          }, 300);
        }
      },
      immediate: true,
    },
  },
  created() {
    // this.axios.interceptors.response.use((res) => {
    //   var token = res.headers.authorization
    //   if (token) {
    //     this.refreshAction()
    //   }
    //   return res
    // }, function(err) {
    //   return new Promise(function() {
    //     if (err.response.status === 401 && err.response.config
    //     && err.response.config.__isRetryReqeust) {
    //       this.logoutAction()
    //     }
    //     throw err
    //   })
    // })
    this.checkAuth();
  },
  methods: {
    ...mapActions({
      // logoutAction: 'auth/logout',
      refreshAuth: 'auth/refresh',
      checkAuth: 'auth/check',
    }),
    ...mapMutations({
      shiftStoreMessage: 'shiftMessage',
    }),
    // logout() {
    //   this.logoutAction()
    //     .then(() => {
    //       this.$router.push({name: 'root'})
    //     })
    // },
    shiftMessage() {
      const newMessage = this.messageLine[0];
      if (newMessage) {
        this.currentMessage = newMessage.content;
        this.messageType = newMessage.type;
        this.is_visible = true;
        this.shiftStoreMessage();
      }
    },
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Noto+Sans+TC:400,500,700&display=swap');

html {
  overflow-y: auto !important;
}

body {
  font-family: 'Roboto', 'Noto Sans TC';
}

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
</style>
