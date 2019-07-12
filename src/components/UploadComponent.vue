<template>
  <div>
    <md-content>
      <h1 class="text-xs-center mt-3 md-display-3">FILE UPLOAD</h1>
      <v-layout align-content-center justify-center class="mt-3">
        <v-flex xs8>
          <v-form
            lazy-validation
          >
            <v-container fill-height class="pt-5">
              <v-layout row wrap align-center justify-center>
                <v-flex xs3>
                  <md-field>
                      <md-file v-model="upload" name="upload" @md-change="onChanged" placeholder="點擊上傳" />
                  </md-field>
                </v-flex>
                <template v-if="dataType" name="upload-button">
                  <v-flex xs2 transition="scale-transition">
                    <v-select
                      v-model="selectType"
                      :items="fileType"
                      item-text="state"
                      item-value="abbr"
                      label="檔案類型"
                      single-line
                    >
                    </v-select>
                  </v-flex>
                  <v-flex shrink>
                    <v-btn color="info" @click="fileUpload">確認上傳</v-btn>
                  </v-flex>
                  <v-flex shrink transition="scale-transition">
                    總共{{ dataLength }}筆資料
                  </v-flex>
                </template>
              </v-layout>
            </v-container>
          </v-form>
        </v-flex>
      </v-layout>
    </md-content>
  </div>
</template>

<script>
export default {
    data () {
        return {
            dataType: '',
            upload: null,
            dataLength: 0,
            selectType: null,
            formData: null,
            fileType: [
                { state: 'Clients', abbr: 'clients' },
                { state: 'Products', abbr: 'products' },
                { state: 'Orders', abbr: 'orders' },
                { state: 'Bills', abbr: 'bills' }
            ]
        }
    },
    watch: {
        dataType: function (str) {
            this.selectType = str;
        }
    },
    counted: {

    },
    methods: {
        onChanged (fileList) {
            let formData = new FormData();
            formData.append('file', fileList[0]);
            this.formData = formData;
            // 傳給backend取得資料
            let uri = 'http://172.16.110.7:8888/api/upload';
            this.axios.post(uri, formData).then(response => {
                this.dataType = response.data.type;
                this.dataLength = response.data.length;
            }).catch (error => {
                // eslint-disable-next-line no-console
                console.log(error.message);
            })
        },
        fileUpload () {
            if (this.formData) {
                this.formData.append('abbr', this.dataType);
                let uri = `http://172.16.110.7:8888/api/${this.dataType}/upload`
                this.axios.post(uri, this.formData).then(response => {
                    this.$router.push({name: `${this.dataType}`})
                }).catch(error => {
                    // eslint-disable-next-line no-console
                    console.log(error.message);
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
</style>
