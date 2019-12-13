<template>
  <div class="pa-5 back">
    <v-container class="fill-height d-flex justify-center align-center">
      <v-row 
        align="center" 
        justify="center"
      >
        <transition name="fade">
          <v-col 
            v-if="!dataType" 
            cols="5"
          >
            <p class="display-3 red--text text--darken-1 text-center">
              File Upload & Preview
            </p>
            <v-card 
              id="dropzone" 
              color="rgba(0, 0, 0, 0.2)"
              class="d-flex align-center justify-center"
              min-height="212px"
            >
              <v-card-text
                v-if="!loading"
                class="d-flex flex-column align-center"
                @drop="drop"
                @dragenter="dragenter"
                @dragover="dragover"
              >
                <v-icon size="60px">save_alt</v-icon>
                <p class="body-1 mt-2">Select a file or drag here</p>
                <v-btn
                  class="mt-3"
                  color="red darken-1 white--text"
                  @click="uploadBtn"
                  :loading="loading"
                >Select</v-btn>
              </v-card-text>
              <v-card-text v-if=loading>
                <transition name="fade">
                  <v-row justify="center">
                    <v-col cols="12">
                      <p class="subtitle-1 text-center font-regular">
                        File Scanning...
                      </p>
                    </v-col>
                    <v-col cols="6">
                      <v-progress-linear 
                        color="red accent-4"
                        height="12"
                        rounded
                        indeterminate 
                      ></v-progress-linear>
                    </v-col>
                  </v-row>
                </transition>
              </v-card-text>
              <input 
              id="upload" 
              ref="upload" 
              type="file" 
              accept=".xlsx" 
              @change="changeFile" 
              />
            </v-card>
          </v-col>
        </transition>

        <transition name="fade">
        <!-- Check card -->
          <v-col 
            v-if="dataType" 
            cols="5"
          >
            <template 
              name="upload-button" 
              transition="fade-transition"
            >
              <v-card color="rgba(255, 255, 255, 0.3)">
                <v-card-title>
                  <v-btn 
                    icon 
                    outlined 
                    class="ma-3"
                    @click="backToUpload"
                  >
                    <v-icon class="mx-0 px-0">arrow_back</v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <v-row justify="center">
                    <v-col cols="8">
                      <v-text-field 
                        v-model="fileName" 
                        label="檔案名稱" 
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col 
                      cols="8"
                      class="mt-2"
                    >
                      <v-select
                        v-model="dataType"
                        :items="fileType"
                        :rules="[rules.required]"
                        item-text="state"
                        item-value="abbr"
                        label="檔案類型"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row justify="center">
                    <v-col cols="auto">
                      <span>
                        總共<b v-text="dataLength" />筆資料
                      </span>
                    </v-col>
                  </v-row>
                  <v-row justify="center">
                    <v-col cols="auto">
                      <v-btn 
                        :loading="loading"
                        color="red darken-1 white--text"
                        @click="fileUpload" 
                      >確認上傳</v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </template>
          </v-col>
        </transition>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      uploadCard: true,
      selectCard: false,
      dataType: "",
      uploadFile: null,
      dataLength: 0,
      loading: false,
      formData: null,
      fileName: "",
      rules: {
        required: (v) => !!v || 'Required.'
      },
      fileType: [
        { state: "Clients", abbr: "clients" },
        { state: "Products", abbr: "products" },
        { state: "Orders", abbr: "orders" },
        { state: "Invoices", abbr: "invoices" }
      ]
    }
  },
  computed: {},
  methods: {
    ...mapMutations({
      upFlash: 'pushMessage'
    }),
    uploadBtn() {
      let uploadbtn = this.$refs.upload
      uploadbtn.click()
    },
    changeFile() {
      this.loading = true
      this.uploadFile = this.$refs.upload.files[0]
      let uploadForm = new FormData()
      uploadForm.append("file", this.uploadFile)
      this.formData = uploadForm
      this.axios
        .post("upload", uploadForm)
        .then(response => {
          this.dataType = response.data.type
          // 如果有找到檔案類型
          if (this.dataType) {
            this.dataLength = response.data.length
            this.fileName = this.uploadFile.name
            // 如果沒有找到檔案類型
          } else {
            let col = response.data.col
            this.upFlash({ type: 'warning', content: `檔案類型有誤，請確認檔案 colume: ${col}`})
            this.$refs.upload.value = ""
          }
          this.loading = false
        })
        .catch(error => {
          this.upFlash({ type: 'error', content: error.message })
          this.loading = false
          this.$refs.upload.value = ""
        })
    },
    // 確認檔案後上傳
    fileUpload() {
      this.loading = true
      if (this.formData) {
        this.axios
          .post(`${this.dataType}/upload`, this.formData)
          .then((res) => {
            // this.$router.push({ name: this.dataType, params: { id: res.data.id }})
            if (res.data.id) {
              this.$router.push({ name: this.dataType, query: {id: res.data.id}})
              this.upFlash({ type: 'success', content: '上傳成功' })
            } else {
              this.upFlash({type: 'error', content: res.data.errorInfo[2]})
              this.loading = false
            }
          })
          .catch(error => {
            this.upFlash({ type: 'error', content: error.message })
            this.loading = false
          })
      }
    },
    dragenter(e) {
      e.stopPropagation()
      e.preventDefault()
    },
    dragover(e) {
      e.stopPropagation()
      e.preventDefault()
    },
    drop(e) {
      e.stopPropagation()
      e.preventDefault()
      const dt = e.dataTransfer
      // 不允許多個 file 上傳
      if (dt.files.length > 1) return
      let file = dt.files[0]
      if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel"
      ) {
        this.$refs.upload.files = dt.files
        this.changeFile()
      }
    },
    backToUpload() {
      this.dataType = ''
      this.loading = false
    }
  }
}
</script>

<style>
.upload-button-enter-active,
.upload-button-leave-active {
  transition: opacity 0.5s;
}
.upload-button-enter, .upload-button-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
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
  border: #e53935 2px !important;
}

.fade-leave-active {
  transition: opacity 0s;
}

.fade-enter-active {
  transition: opacity 0.3s 0.2s;
}

.fade-enter,
.fade-leave {
  opacity: 0;
}

</style>
