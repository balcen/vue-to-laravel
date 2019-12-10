<template>
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="clients"
    :options.sync="options"
    :server-items-length="totalItems"
    :footer-props="footerProps"
    :loading="loading"
    show-select
    class="elevation-1"
  > 
    <template v-slot:top>
      <v-dialog
        v-model="dialog"
        max-width="800px"
        persistent
      >
        <v-card>
          <v-card-title>
            <span class="headline" v-text="formTitle" />
          </v-card-title>
          <v-form 
            v-model="valid" 
            ref="form" 
            lazy-validation
          >
            <v-card-text>
              <v-container grid-list-md>
                <v-row wrap>
                  <v-col 
                    cols="12" 
                    sm="6" 
                    md="4"
                  >
                    <v-text-field 
                      v-model="editItem.c_tax_id" 
                      :rules="[rules.required]" 
                      label="客戶統編" 
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col 
                    cols="12" 
                    sm="6" 
                    md="4"
                  >
                    <v-text-field 
                      v-model="editItem.c_name" 
                      :rules="[rules.required]" 
                      label="客戶名稱" 
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col 
                    cols="12" 
                    sm="6" 
                    md="4"
                  >
                    <v-text-field 
                      v-model="editItem.c_type" 
                      :rules="[rules.required]" 
                      label="客戶類型" 
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col 
                    cols="12" 
                    sm="6" 
                    md="4"
                  >
                    <v-text-field 
                      v-model="editItem.c_contact" 
                      :rules="[rules.required]" 
                      label="聯絡人" 
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col 
                    cols="12" 
                    sm="6" 
                    md="4"
                  >
                    <v-text-field 
                      v-model="editItem.c_phone" 
                      :rules="[rules.required]" 
                      label="聯絡電話" 
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col 
                    cols="12" 
                    sm="6" 
                    md="4"
                  >
                    <v-text-field 
                      v-model="editItem.c_mail" 
                      :rules="[rules.required, rules.email]" 
                      label="電子信箱" 
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn 
                color="blue darken-1" 
                text 
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn 
                :disabled="!valid"
                color="blue darken-1" 
                text
                @click="save" 
               >
                Save
               </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon 
        small
        class="mr-2"
        @click="editedItem(item)"
      >
        edit
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        delete
      </v-icon>
    </template>
    
    <template v-slot:no-data>
      <v-alert type="error" class="text-left my-3">
        抱歉，這裡沒有任何資料 :(
      </v-alert>
    </template>
  </v-data-table>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  props: ['dialog'],
  data () {
    return {
      selected: [],
      url: '',
      valid: true,
      totalItems: 0,
      noDataAlert: false,
      options: {},
      footerProps: {
        'items-per-page-options': [10, 25, 50, 100, 200, 500]
      },
      clients: [],
      loading: true,
      headers: [
        {
          text: '客戶統編',
          value: 'c_tax_id',
          align: 'left',
          sortable: false
        },
        { text: '客戶名稱', value: 'c_name', sortable: false, align: "center" },
        { text: '客戶類型', value: 'c_type', sortable: false, align: "center" },
        { text: '聯絡人', value: 'c_contact', sortable: false, align: "center" },
        { text: '聯絡電話', value: 'c_phone', sortable: false, align: "center" },
        { text: '電子信箱', value: 'c_mail', sortable: false, align: "center" },
        { text: 'Actions', value: 'action', sortable: false, width: "1%", align: "center" }
      ],
      editIndex: -1,
      editItem: {
        'c_tax_id': '',
        'c_name': '',
        'c_type': '',
        'c_contact': '',
        'c_phone': '',
        'c_mail': ''
      },
      defaultItem: {
        'c_tax_id': '',
        'c_name': '',
        'c_type': '',
        'c_contact': '',
        'c_phone': '',
        'c_mail': ''
      },
      rules: {
        required: value => !!value || 'Required',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail";
        }
      }
    };
  },
  computed: {
    ...mapState({
      q: store => store.filter.q,
      filter: store => store.filter.search
    }),
    filterIsEmpty: function () {
      return this.$store.getters['filter/filterIsEmpty']
    },
    formTitle: function() {
      return this.editIndex === -1 ? 'New Item' : 'Edit Item';
    },
  },
  watch: {
    selected: function () {
      // this.$emit('update:selected', this.selected);
      this.$emit('setSelected', this.selected)
      this.$emit('getDataType', 'clients');
    },
    options: {
      async handler () {
        this.url = `?page=${this.options.page}&itemsPerPage=${this.options.itemsPerPage}`
        if (this.$route.query.id) {
          this.url += `&id=${this.$route.query.id}`
        }
        this.loading = true
        let result
        if (this.q || this.filterIsEmpty) {
          await this.getSearch()
            .then(data => result = data)
        } else {
          if (this.$route.query.id) {
            await this.show()
              .then(data => result = data)
          } else {
            await this.getDataFromApi()
              .then(data => result = data)
              .catch(error => this.upFlash({type: 'error', content: error.message}))
          }

          if (result) {
            this.clients = result.data
            this.totalItems = result.total
          }
          
          this.loading = false
        }
      },
      deep: true
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    ...mapMutations({
      upFlash: 'pushMessage'
    }),
    ...mapActions({
      search: 'filter/search'
    }),
    getDataFromApi() {
      return new Promise((resolve, reject) => {
        this.axios.get(`clients${this.url}`)
          .then(res => resolve(res.data))
          .catch(error => reject(error))
      })
    },
    editedItem (item) {
      this.editIndex = this.clients.indexOf(item)
      this.editItem = Object.assign({}, this.clients[this.editIndex])
      this.$emit('toggleDialog', true)
    },
    deleteItem (item) {
      const index = this.clients.indexOf(item)
      this.loading = true
      confirm('確定刪除這筆資料？') && this.axios.delete(`clients/${item.id}`, item.id).then(() => {
        this.clients.splice(index,1)
        this.upFlash({type: 'success', content: '成功刪除一筆資料'})
        this.loading = false
      }).catch(error => {
        this.upFlash({type: 'error', content: error.message})
        this.loading = false
      })
    },
    close() {
      this.$emit('toggleDialog', false);
      setTimeout(() => {
        this.editItem = Object.assign({}, this.defaultItem)
        this.editIndex = -1
        this.reset()
        this.loading = false
      },300);
    },
    save() {
      let index = this.editIndex;
      let item = this.editItem;
      if(!this.$refs.form.validate()) return;
      if (index !== -1) {
        this.axios.put(`clients/${item.id}`, item).then(() => {
          Object.assign(this.clients[index], item)
          this.upFlash({type: 'success', content: '成功修改一筆資料'})
          this.$store.commit('update')
        }).catch(error => {
          this.upFlash({type: 'error', content: error.message})
        })
      } else if (index === -1) {
        this.axios.post('clients', item).then(() => {
          this.clients.push(item)
          this.upFlash({type: 'success', content: '成功新增一筆資料'})
        }).catch(error => {
          this.upFlash({type: 'error', content: error.message})
        });
      }
      this.close();
    },
    deleteArray () {
      this.clients = this.clients.filter((el) => !this.selected.includes(el));
    },
    reset() {
      this.$refs.form.reset()
    },
    getSearch() {
      return this.search({type: 'clients', page: this.url})
    },
    show() {
      return new Promise((resolve) => {
        this.axios.get(`clients/${this.$route.query.id}${this.url}`)
          .then(res => resolve(res.data))
      })
    },
    dataAssign() {
      if (this.options.page !== 1) {
        this.options.page = 1
      } else {
        this.loading = true
        this.getSearch('clients')
          .then(res => {
            this.clients = res.data
            this.totalItems = res.total
            this.loading = false
          })
          .catch(err => {
            this.upFlash({type: 'error', content: err.message})
            this.loading = false
          })
      }
    }
  }
}
</script>
