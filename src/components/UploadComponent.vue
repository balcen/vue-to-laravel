<template>
    <div>
        <md-content>
            <h1 class="text-xs-center mt-3 md-display-3">FILE UPLOAD</h1>
            <v-layout align-content-center justify-center class="mt-3">
                <v-flex xs8>
                    <v-form
                      lazy-validation
                    >
                        <v-container fill-height>
                            <v-layout row wrap align-center justify-center>
                                <v-flex xs4>
                                    <md-field>
                                        <md-file v-model="upload" @md-change="onChanged" placeholder="File Upload" />
                                    </md-field>
                                </v-flex>
                                <v-flex shrink>
                                    <v-btn color="info">上傳</v-btn>
                                </v-flex>
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
            upload: null,
            excel: [],
        }
    },
    created () {

    },
    methods: {
        onChanged (fileList) {
            // 傳給backend取得資料
            let uri = 'http://172.16.110.7:8888/api/upload'
            this.axios.post(uri, fileList[0]).then(response => {
                // this.excel = response.data;
                console.log('success');
            }).catch (error => {
                console.log(error.message);
            })
        }
    }
}
</script>
