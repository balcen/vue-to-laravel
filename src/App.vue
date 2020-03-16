<template>
  <v-app>
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
      <transition name="fade" mode="out-in">
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
    this.checkAuth();
  },
  methods: {
    ...mapActions({
      refreshAuth: 'auth/refresh',
      checkAuth: 'auth/check',
    }),
    ...mapMutations({
      shiftStoreMessage: 'shiftMessage',
    }),
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

html, body {
  font-family: Roboto, "Microsoft Yahei", 微軟正黑體, "Noto Sans TC";
}

#app {
  font-family: Roboto, "Microsoft Yahei", 微軟正黑體, "Noto Sans TC";
}

/* v-btn 加上 link 的底線 */
a:not(.md-button):hover {
    text-decoration: none !important;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
