<template>
  <div>
    <md-content>
      <h1 class="text-xs-center mt-5 md-display-3">FILE UPLOAD</h1>
      <v-layout align-content-center justify-center class="mt-3">
        <v-flex xs6>
          <v-container grid-list-sm fill-height class="pt-0">
            <v-layout row wrap align-center justify-center>

              <v-flex v-if="!dataType" xs6 class="pt-4">
                <v-btn large color="primary" @click="uploadBtn" depressed block dark :loading="loading">
                  UPLOAD FILE
                  <span class="ml-1">
                    <v-icon>cloud_upload</v-icon>
                  </span>
                </v-btn>
                <input type="file" id="upload" ref="upload" @change="changeFile" accept=".xlsx">
              </v-flex>

              <template v-if="dataType" name="upload-button">
                <v-layout wrap justify-center>
                  <v-flex xs12 offset-xs1>
                    <v-btn icon outlined class="ml-5">
                      <v-icon class="mx-0 px-0">arrow_back</v-icon>
                    </v-btn>
                  </v-flex>
                  <v-flex xs4 class="mt-3">
                    <v-text-field label="檔案名稱" v-model="fileName" readonly></v-text-field>
                  </v-flex>
                  <v-flex xs4 class="mt-3">
                    <v-select
                      v-model="selectType"
                      :items="fileType"
                      item-text="state"
                      item-value="abbr"
                      label="檔案類型"
                    >
                    </v-select>
                  </v-flex>
                  <v-flex xs6 offset-xs3 class="mt-3">
                    <span>總共{{ dataLength }}筆資料</span>
                    <v-btn color="info" @click="fileUpload" :loading="loading">確認上傳</v-btn>
                  </v-flex>
                </v-layout>
              </template>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
    </md-content>
  </div>
</template>

<script>
import { setTimeout } from 'timers';
export default {
  data () {
    return {
      dataType: '',
      upload: null,
      dataLength: 0,
      loading: false,
      selectType: null,
      formData: null,
      fileName: '',
      fileType: [
        { state: 'Clients', abbr: 'clients' },
        { state: 'Products', abbr: 'products' },
        { state: 'Orders', abbr: 'orders' },
        { state: 'Invoices', abbr: 'invoices' }
      ]
    }
  },
  watch: {
    dataType: function (str) {
      this.selectType = str;
    }
  },
  created() {
  },
  methods: {
    uploadBtn () {
      let uploadbtn = this.$refs.upload;
      uploadbtn.click();
    },
    changeFile(e) {
      this.loading = true;
      let formData = new FormData();
      formData.append('file', e.target.files[0]);
      this.formData = formData;
      let uri = 'https://calm-ocean-96461.herokuapp.com/api/upload';
      this.axios.post(uri, formData).then(response => {
        this.dataType = response.data.type;
        this.dataLength = response.data.length;
        this.fileName = e.target.files[0].name;
        this.loading = false;
      }).catch(error => {
        this.flash(error.message, 'error');
      })
    },
    fileUpload () {
      this.loading = true;
      if (this.formData) {
        let uri = `https://calm-ocean-96461.herokuapp.com/api/${this.dataType}/upload`;
        this.axios.post(uri, this.formData).then(response => {
          this.$router.push({ name: this.dataType })
          this.flash('上傳成功', 'success')
        }).catch(error => {
          this.flash(error.message, 'error');
        })
      }
    }
  }
}
</script>

<style>
  .upload-button-enter-active, .upload-button-leave-active {
    transition: opacity .5s
  }
  .upload-button-enter, .upload-button-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0
  }

  #upload {
    width: 0;
    height: 0;
    visibility: hidden;
  }
</style>
