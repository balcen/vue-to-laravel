<template>
  <v-container>
    <v-layout justify-center align-center>
      <v-flex xs6>
        <v-card flat>
          <v-card-title>
            <v-layout justify-center>
              <h1 class="text-center">LOGIN</h1>
            </v-layout>
          </v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-layout wrap justify-center>
                <v-flex xs8>
                  <v-text-field
                    label="用戶"
                    v-model="user.name"
                  ></v-text-field>
                </v-flex>
                <v-flex xs8 class="mt-2">
                  <v-text-field
                    type="password"
                    label="密碼"
                    v-model="user.password"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-layout justify-center align-center wrap column>
              <v-flex>
                <v-btn 
                  flat 
                  outline 
                  color="primary" 
                  @click="login"
                  :loading="loading"
                >
                  登入
                </v-btn>  
              </v-flex>
              <v-flex class="mt-1" shrink>
                <router-link :to="{name: 'register'}">註冊帳號</router-link>
              </v-flex>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
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
  methods: {
    login() {
      this.loading = true;

      this.$auth.login({
        params: {
          name: this.user.name,
          password: this.user.password
        },
        success: function() {
          console.log(this.$auth.check());
          this.loading = false;
        },
        error: function() {
          this.message = '用戶名稱密碼不正確';
          this.loading = false;
        },
        rememberMe: true,
        redirect: '/index',
        fetchUser: true
      });
    }
  }
}
</script>