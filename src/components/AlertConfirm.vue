<template>
  <v-dialog max-width="420px" v-model="dialog">
    <v-card>
      <v-card-text class="py-5 title">
        確定要刪除{{ length }}筆資料嗎？
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="allow" color="primary">確認</v-btn>
        <v-btn @click="cancel" text>取消</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['length'],
  data() {
    return {
    };
  },
  computed: {
    dialog: {
      get() {
        return this.$store.state.confirm.dialog;
      },
      set(bol) {
        this.$store.commit('confirm/toggleDialog', bol);
      },
    },
  },
  methods: {
    allow() {
      this.$emit('allow');
      this.dialog = false;
    },
    cancel() {
      this.$emit('cancel');
      this.dialog = false;
    },
  },
};
</script>
