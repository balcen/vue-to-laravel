<template>
  <div class="pa-5 back">
    <v-container class="fill-height d-flex justify-center align-center">
      <v-row align="center" justify="center">
        <v-col cols="12" class="text-center">
          <p class="display-1 red--text text--darken-1">File Upload & Data Type Preview</p>
        </v-col>
        <v-col v-if="!dataType" cols="5">
          <v-hover v-slot:default="{ hover }">
            <v-card id="dropzone" color="rgba(255, 255, 255, 0.9)">
              <v-card-text class="d-flex flex-column align-center">
                <v-icon size="60px">save_alt</v-icon>
                <p class="body-1 mt-2">Select a file or drag here</p>
                <v-btn class="mt-3" color="red darken-1 white--text" @click="uploadBtn" :loading="loading">
                  Select
                </v-btn>
              </v-card-text>

              <input type="file" id="upload" ref="upload" @change="changeFile" accept=".xlsx">
            </v-card>
          </v-hover>
        </v-col>

        <!-- Check card -->
        <v-col v-if="dataType" cols="6">
          <template name="upload-button" transition="fade-transition">
            <v-card color="rgba(255, 255, 255, 0.9)"> 
              <v-card-head>
                <v-btn icon outlined class="ma-3" @click="dataType=''">
                  <v-icon class="mx-0 px-0">arrow_back</v-icon>
                </v-btn>
              </v-card-head> 
              <v-card-text>
                <v-row justify="center">
                  <v-col cols="8">
                    <v-text-field label="檔案名稱" v-model="fileName" readonly></v-text-field>
                  </v-col>
                  <v-col cols="8" class="mt-2">
                    <v-select
                      v-model="dataType"
                      :items="fileType"
                      item-text="state"
                      item-value="abbr"
                      label="檔案類型"
                    >
                    </v-select>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col cols="auto">
                    <span>總共<b>{{ dataLength }}</b>筆資料</span>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col cols="auto">
                    <v-btn color="info" @click="fileUpload" :loading="loading">確認上傳</v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dataType: '',
      upload: null,
      dataLength: 0,
      loading: false,
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
      this.axios.post('upload', formData).then(response => {
        this.dataType = response.data.type;
        // 如果有找到檔案類型
        if(this.dataType) {
          this.dataLength = response.data.length;
          this.fileName = e.target.files[0].name;
        // 如果沒有找到檔案類型
        }else {
          let col = response.data.col;
          this.flash(`檔案類型有誤，請確認檔案 colume: ${col}`, 'warning');
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
        this.axios.post(`${this.dataType}/upload`, this.formData)
          .then(() => {
            this.$router.push({ name: this.dataType })
            this.flash('上傳成功', 'success')
        }).catch(error => {
          this.flash(error.message, 'error')
          this.loading = false;
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

  #dropzone.v-card:hover {
    border: #E53935 2px !important;
  }
  
</style>
