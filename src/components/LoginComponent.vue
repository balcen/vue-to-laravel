<template>
  <v-container
    fluid
    class="back-full fill-height"
    :style="{
      backgroundImage: 'url(~@/assets/photo-1487017159836-4e23ece2e4cf.jpg)'
    }"
  >
    <v-row
      justify="center"
      align="center"
    >
      <v-col cols="auto">
        <!-- <h1 class="pt-5 display-2 text-center blue--text text--darken-4">
          LOGIN
        </h1> -->
        <v-card flat>
          <h1 class="pt-4 text-center">登入</h1>
          <v-card-text
            class="pb-0 px-6"
          >
            <v-form ref="form">
              <v-row
                wrap
                justify="center"
              >
                <v-col
                  class="auth-text-field"
                >
                  <v-text-field
                    outlined
                    hide-details
                    ref="name"
                    v-model="user.name"
                    label="用戶名稱"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row
                wrap
                justify="center"
              >
                <v-col
                  class="auth-text-field"
                >
                  <v-text-field
                    outlined
                    hide-details
                    ref="password"
                    v-model="user.password"
                    type="password"
                    label="密碼"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-row
              justify="center"
              align="center"
              class="d-flex flex-column"
            >
              <v-col cols="auto">
                <v-btn
                  color="primary"
                  @click="login"
                  :loading="loading"
                  large
                >
                  登入
                </v-btn>
              </v-col>
              <v-col
                class="pt-0"
                cols="auto"
              >
                <!-- <router-link
                  class="body-2"
                  :to="{name: 'register'}"
                >
                  註冊帳號
                </router-link> -->
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';

export default {
  data() {
    return {
      user: {
        name: '',
        password: '',
      },
      message: '',
      loading: false,
      loginError: false,
      loginErrorMessage: '',
    };
  },
  methods: {
    ...mapMutations({
      upFlash: 'pushMessage',
    }),
    ...mapActions({
      loginAction: 'auth/login',
    }),
    login() {
      const { name, password } = this.user;

      if (!this.$refs.form.validate()) return;
      this.loading = true;
      // actions 必須透過 dispatch 來調用
      this.loginAction({ name, password })
        .then(() => {
          this.upFlash({ type: 'success', content: '成功登入' });
          this.$router.push('/index');
        })
        .catch((err) => {
          if (typeof (err.response.status) !== 'undefined' && err.response.status === 401) {
            this.upFlash({ type: 'error', content: '帳號密碼錯誤' });
            this.user.password = '';
            this.loginError = true;
          } else {
            this.upFlash({ type: 'error', content: '發生錯誤，請重新登入' });
          }
          this.loading = false;
        });
    },
  },
};
</script>

<style>
.v-card__actions a {
  text-decoration: none;
}

.back-full {
  background-position: center;
  background-size: cover;
}

.auth-text-field {
  width: 272px;
}
</style>
