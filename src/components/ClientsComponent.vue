<template>
  <div>
    <v-layout>
      <v-flex xs12>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="clients"
          :item-key="id"
          :search="search"
          :pagination.sync="pagination"
          :loading="loading"
          select-all
          class="elevation-1"
        >
          <template v-slot:items="props">
            <td>
              <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
            </td>
            <td>{{ props.item.c_tax_id }}</td>
            <td class="text-xs-center">{{ props.item.c_name }}</td>
            <td class="text-xs-center">{{ props.item.c_type }}</td>
            <td class="text-xs-center">{{ props.item.c_contact }}</td>
            <td class="text-xs-center">{{ props.item.c_phone }}</td>
            <td class="text-xs-center">{{ props.item.c_mail }}</td>
            <td id="actions" class="justify-center layout px-0">
              <v-icon
                small
                class="mr-2"
                @click="editedItem(props.item)"
              >
                edit
              </v-icon>
              <v-icon
                small
                @click="deleteItem(props.item)"
              >
                delete
              </v-icon>
            </td>

          </template>
          <template v-slot:no-data>
            <v-alert :value="noDataAlert" color="error" icon="warning">
              抱歉，這裡沒有任何資料 :(
            </v-alert>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <v-dialog
      v-model="dialog"
      max-width="800px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">
            {{ formTitle }}
          </span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editItem.c_tax_id" label="客戶統編"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editItem.c_name" label="客戶名稱"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editItem.c_type" label="客戶類型"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editItem.c_contact" label="聯絡人"></v-text-field>
              </v-flex>
                <v-flex xs12 sm6 md4>
              <v-text-field v-model="editItem.c_phone" label="聯絡電話"></v-text-field>
                </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editItem.c_mail" label="電子信箱"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ['search', 'dialog', 'selected'],
  data () {
    return {
      noDataAlert: false,
      pagination: { rowsPerPage: 25 },
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
      }
    };
  },
  created() {
    this.getClients();
  },
  watch: {
    selected: function () {
      this.$emit('update:selected', this.selected);
      this.$emit('getDataType', 'clients');
    }
  },
  computed: {
    formTitle: function() {
      return this.editIndex === -1 ? 'New Item' : 'Edit Item';
    },

  },
  methods: {
    getClients () {
      let uri = 'http://172.16.110.7:8888/api/clients';
      this.axios.get(uri).then(response => {
        this.clients = response.data;
        this.noDataAlert = true;
        this.loading = false;
      }).catch(error => {
        console.log(error.message);
      })
    },
    editedItem (item) {
      this.editIndex = this.clients.indexOf(item);
      this.editItem = Object.assign({}, item);
      this.$emit('toggleDialog', true);
    },
    deleteItem (item) {
      const index = this.clients.indexOf(item);
      let uri = `http://172.16.110.7:8888/api/clients/${item.id}`;
      confirm('確定刪除這筆資料？') && this.axios.delete(uri, item.id).then(response => {
        this.clients.splice(index,1);
      }).catch(error => {
        console.log(error.message);
      })
    },
    close() {
      this.$emit('toggleDialog', false);
      setTimeout(()=>{
        this.editItem = Object.assign({}, this.defaultItem);
        this.editIndex = -1;
      },1000);
    },
    save() {
      let index = this.editIndex;
      let item = this.editItem;
      if (index !== -1) {
        let uri = `http://172.16.110.7:8888/api/clients/${item.id}`;
        this.axios.put(uri, item).then(response => {
          this.$router.go();
        }).catch(error => {
          console.log(error.message);
        })
      } else {
        let uri = 'http://172.16.110.7:8888/api/clients';
        this.axios.post(uri, item).then(response => {
          this.$router.go();
        }).catch(error => {
          console.log(error.message);
        });
      }

      this.close();
    }
  }
};
</script>
