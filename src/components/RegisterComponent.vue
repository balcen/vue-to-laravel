<template>
  <v-container fill-height>
    <v-row 
      justify="center" 
      align="center"
    >
      <v-col cols="6">
        <v-card flat>
          <h1 class="pt-5 display-2 text-center blue--text text--darken-4">
            Register
          </h1>
          <v-card-text>
            <v-form 
              ref="form" 
              v-model="valid" 
              lazy-validation
            >
              <v-row 
                justify="center"
                wrap 
              >
                <v-col cols="6">
                  <v-text-field 
                    v-model="name" 
                    :rules="[rules.required]"
                    :error="error && message.name"
                    :messages="error && message.name ? message.name : ''" 
                    label="用戶名稱"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row 
                wrap
                justify="center"
              >
                <v-col cols="6">
                  <v-text-field
                    :append-icon="show ? 'visibility' : 'visibility_off'"
                    :rules="[rules.required, rules.min]" 
                    :type="show ? 'text' : 'password'"
                    v-model="password" 
                    label="密碼"
                    @click:append="show = !show"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row
                wrap
                justify="center"
              >
                <v-col cols="6">
                  <v-text-field
                    :append-icon="show ? 'visibility' : 'visibility_off'" 
                    :rules="[rules.required, rules.password]" 
                    :type="show ? 'text' : 'password'"
                    label="再次輸入密碼"
                    @click:append="show2 = !show"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row
                wrap
                justify="center"
              >
                <v-col cols="6">
                  <v-text-field 
                    v-model="email" 
                    :rules="[rules.required, rules.email]" 
                    :error="error && message.email"
                    :messages="error && message.email ? message.email : ''"
                    label="電子信箱"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-row 
              class="d-flex flex-column" 
              align="center" 
              justify="center"
            >
              <v-col cols="auto">
                <v-btn  
                  color="primary" 
                  @click="register" 
                  :loading="loading"
                  large
                >
                  註冊
                </v-btn>
              </v-col>
              <v-col 
                class="pt-0"
                cols="auto"
              >
                <router-link 
                  class="body-2" 
                  :to="{name: 'login'}"
                >
                  已有帳號
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
import { mapActions, mapMutations } from 'vuex'
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
    ...mapMutations({
      upFlsh: 'pushMessage'
    }),
    ...mapActions({
      registerAction: 'auth/register'
    }),
    register() {
      if(!this.$refs.form.validate()) return

      const user = {
        name: this.name, 
        email: this.email,
        password: this.password
      }

      this.registerAction(user)
        .then(() => this.$router.push('/'))
        .catch(err => {
          this.$router.push('/')
          this.upFlash({type: 'error', content: `註冊失敗 ${err}`})
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