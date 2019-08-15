<template>
  <v-container fill-height>
    <v-layout justify-center align-center>
      <v-flex>
        <v-card 
          class="mx-auto"
          max-width="380"
          outlined="true"
        >
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field :rules="[rules.required]" label="姓名"></v-text-field>
              <v-text-field :rules="[rules.required]" label="賬號"></v-text-field>
              <v-text-field
                :append-icon="show ? 'visibility' : 'visibility_off'"
                :rules="[rules.required, rules.min]" 
                :type="show ? 'text' : 'password'"
                v-model="password" 
                label="密碼"
                @click:append="show = !show"
              ></v-text-field>
              <v-text-field
                :append-icon="show ? 'visibility' : 'visibility_off'" 
                :rules="[rules.required, rules.password]" 
                :type="show ? 'text' : 'password'"
                label="再次輸入密碼"
                @click:append="show2 = !show"
              ></v-text-field>
              <v-text-field :rules="[rules.required, rules.email]" label="電子信箱"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-layout align-center justify-center>
              <v-btn flat outline color="indigo" @click="register">註冊</v-btn>
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
      password: '',
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
    }
  }
}
</script>
