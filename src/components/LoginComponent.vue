<template>
  <v-container fill-height>
    <v-row justify="center" align="center">
      <v-col cols="6">
        <v-card flat>
          <v-card-title>
            <v-row justify="center">
              <h1>LOGIN</h1>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-row wrap justify="center">
                <v-col cols="8">
                  <v-text-field
                    label="用戶名稱"
                    v-model="user.name"
                  ></v-text-field>
                </v-col>
                <v-col cols="8" class="mt-2">
                  <v-text-field
                    type="password"
                    label="密碼"
                    v-model="user.password"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-row justify="center" align="center" class="d-flex flex-column">
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
              <v-col class="pt-0" cols="auto">
                <router-link :to="{name: 'register'}">註冊帳號</router-link>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>

<script>
export default {
  data() {
    return {
      user: {
        name: '',
        password: ''
      },
      message: '',
      loading: false,
    }
  },
  mounted() {
    // 彈出訊息
    const query = this.$route.query
    if(query.status && query.flashMessage) {
      this.flash(query.flashMessage, query.status, {timeout: 3000})
    }
  },
  methods: {
    login() {
      // this.loading = true;

      // this.$auth.login({
      //   params: {
      //     name: this.user.name,
      //     password: this.user.password
      //   },
      //   success: function(res) {
      //     console.log(res);
      //     this.loading = false;
      //   },
      //   error: function() {
      //     this.message = '用戶名稱密碼不正確';
      //     this.loading = false;
      //   },
      //   rememberMe: true,
      //   redirect: '/index',
      //   fetchUser: true
      // });
      const name = this.user.name
      const password = this.user.password

      this.loading = true

      // actions 必須透過 dispatch 來調用
      this.$store.dispatch('login', {name, password})
      .then(() => this.$router.push('/index'))
      .catch(err => console.log(err))
    }
  }
}
</script>