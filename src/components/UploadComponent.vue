<template>
  <div class="pa-5 back">
    <!-- <md-content> -->
      <v-layout fill-height align-center wrap justify-center>
        <!-- <v-flex xs12>
          <h1 class="text-xs-center mt-3 md-display-3 font-weight-medium source-sans-pro">FILE UPLOAD</h1>
        </v-flex> -->
        <v-flex xs6>
          <v-container grid-list-sm fill-height>
            <v-layout row wrap align-center justify-center>
              <v-flex v-if="!dataType" xs6 class="pt-4">
                <v-btn large color="primary" @click="uploadBtn" block dark :loading="loading">
                  Click to Upload File
                </v-btn>

                <input type="file" id="upload" ref="upload" @change="changeFile" accept=".xlsx">
              </v-flex>

              <template v-if="dataType" name="upload-button" transition="fade-transition">
                <v-layout wrap justify-center>
                  <v-flex xs12 offset-xs1>
                    <v-btn icon outlined class="ml-5" @click="dataType=''">
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
    <!-- </md-content> -->
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
  computed: {
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
      this.axios.post('upload', formData).then(response => {
        this.dataType = response.data.type;
        // 如果有找到檔案類型
        if(this.dataType) {
          this.dataLength = response.data.length;
          this.fileName = e.target.files[0].name;
        // 如果沒有找到檔案類型
        }else {
          this.flash('檔案類型有誤，請確認檔案', 'warning', { timeout: 3000 });
          this.$refs.upload.value = '';
        }
          this.loading = false;
      }).catch(error => {
        this.flash(error.message, 'error');
        this.loading = false;
        this.$refs.upload.value = '';
      })
    },
    fileUpload () {
      this.loading = true;
      if (this.formData) {
        let uri = `https://calm-ocean-96461.herokuapp.com/api/${this.dataType}/upload`;
        this.axios.post(`${this.dataType}/upload`, this.formData).then(response => {
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

  .back {
    background-image: url(https://images.unsplash.com/photo-1464278533981-50106e6176b1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80);
    background-position: center;
    background-size: cover;
    height: 100%;
  }

</style>
