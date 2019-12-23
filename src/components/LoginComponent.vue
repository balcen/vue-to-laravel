<template>
  <v-container fill-height>
    <v-row 
      justify="center" 
      align="center"
    >
      <v-col cols="6">
        <v-card flat>
          <h1 class="pt-5 display-2 text-center blue--text text--darken-4">
            LOGIN
          </h1>
          <v-card-text>
            <v-form ref="form">
              <v-row 
                wrap 
                justify="center"
              >
                <v-col cols="6">
                  <v-text-field
                    ref="name"
                    v-model="user.name"
                    :rules="[rules.required]"
                    label="用戶名稱"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row 
                wrap
                justify="center"
              >
                <v-col 
                  cols="6" 
                  class="mt-2"
                >
                  <v-text-field
                    ref="password"
                    v-model="user.password"
                    :rules="[rules.required]"
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
                <router-link 
                  class="body-2"
                  :to="{name: 'register'}"
                >
                  註冊帳號
                </router-link>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {
      user: {
        name: '',
        password: ''
      },
      message: '',
      loading: false,
      loginError: false,
      loginErrorMessage: '',
      rules: {
        required : v => !!v || "Required"
      }
    }
  },
  mounted() {
  },
  methods: {
    ...mapMutations({
      upFlash: 'pushMessage'
    }),
    ...mapActions({
      loginAction: 'auth/login'
    }),
    login() {
      const name = this.user.name
      const password = this.user.password

      if (!this.$refs.form.validate()) return 
      
      this.loading = true
      // actions 必須透過 dispatch 來調用
      this.loginAction({name, password})
        .then(() => {
          this.upFlash({type: 'success', content: '成功登入'})
          this.$router.push('/index')
        })
        .catch(err => {
          if (err.response.status === 401) {
            this.upFlash({type: 'error', content: '帳號密碼錯誤'})
            this.user.password = ''
            this.loginError = true
          } else {
            this.upFlash({type: 'error', content: '發生錯誤，請重新登入'})
          }
          this.loading = false
        })
      
    }
  }
}
</script>

<style>
.v-card__actions a {
  text-decoration: none;
}
</style>