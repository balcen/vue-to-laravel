<template>
  <v-container fill-height>
    <v-layout justify-center align-center>
      <v-flex xs6>
        <v-card flat>
          <v-card-title>
            <v-layout justify-center>
              <h1>Register</h1>
            </v-layout>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-layout wrap justify-center>
                <v-flex xs8>
                  <v-text-field 
                    v-model="name" 
                    :rules="[rules.required]"
                    :error="error && message.name"
                    :messages="error && message.name ? message.name : ''" 
                    label="用戶名稱"
                  ></v-text-field>
                </v-flex>
                <v-flex xs8>
                  <v-text-field
                    :append-icon="show ? 'visibility' : 'visibility_off'"
                    :rules="[rules.required, rules.min]" 
                    :type="show ? 'text' : 'password'"
                    v-model="password" 
                    label="密碼"
                    @click:append="show = !show"
                  ></v-text-field>
                </v-flex>
                <v-flex xs8>
                  <v-text-field
                    :append-icon="show ? 'visibility' : 'visibility_off'" 
                    :rules="[rules.required, rules.password]" 
                    :type="show ? 'text' : 'password'"
                    label="再次輸入密碼"
                    @click:append="show2 = !show"
                  ></v-text-field>
                </v-flex>
                <v-flex xs8>
                  <v-text-field 
                    v-model="email" 
                    :rules="[rules.required, rules.email]" 
                    :error="error && message.email"
                    :messages="error && message.email ? message.email : ''"
                    label="電子信箱"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-layout column align-center justify-center>
              <v-flex>
                <v-btn 
                  flat 
                  outline 
                  color="indigo" 
                  @click="register" 
                  :loading="loading"
                >
                  註冊
                </v-btn>
              </v-flex>
              <v-flex class="mt-1">
                <router-link :to="{name: 'login'}">已有帳號</router-link>
              </v-flex>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      show: false,
      show2: false,
      name: '',
      password: '',
      email:'',
      error: false,
      message: {},
      loading: false,
      rules: {
        required: v => !!v || "Required",
        min: v => v.length >= 8 || "最低字數不得低於8個字",
        password: v => v === this.password || "密碼不相符",
        email: v => {
          const pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
          return pattern.test(v) || "不符合email格式";
        }
      }
    }
  },
  methods: {
    register() {
      if(!this.$refs.form.validate()) return;
      // this.loading = true;

      // this.$auth.register({
      //   params: {
      //     name: this.name,
      //     email: this.email,
      //     password: this.password
      //   },
      //   success: function() {
      //     this.flash('註冊成功', 'success', {timeout: 3000});
      //     this.loading = false;
      //   },
      //   error: function(res) {
      //     this.loading = false;
      //     this.flash('註冊失敗', 'error');
      //     console.log(res);
      //     this.error = true;
      //     if(res) {
      //       // this.message =
      //     }
      //   },
      //   redirect: null
      // });
      // this.loading = false;

      const user = {
        name: this.name, 
        email: this.email,
        password: this.password
      }
      this.$store.dispatch('register', user)
      .then(() => this.$router.push('/'))
      .catch(err => console.log(err))
    }
  }
}
</script>
