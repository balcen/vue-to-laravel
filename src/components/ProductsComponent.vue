<template>
    <div>
        <v-layout overflow-auto>
            <v-flex xs12>
                <v-data-table
                  :headers="headers"
                  :items="products"
                  :pagination.sync="pagination"
                  select-all
                  class="elevation-1"
                >
                    <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
                    <template v-slot:items="props">
                        <td>
                            <v-checkbox
                              v-model="props.selected"
                              primary
                              hide-details
                            ></v-checkbox>
                        </td>
                        <td>{{ props.item.p_type }}</td>
                        <td class="text-xs-right">{{ props.item.p_image }}</td>
                        <td class="text-xs-right">{{ props.item.p_name }}</td>
                        <td class="text-xs-right">{{ props.item.p_part_no }}</td>
                        <td class="text-xs-right">{{ props.item.p_spec }}</td>
                        <td class="text-xs-right">{{ props.item.p_price }}</td>
                        <td class="text-xs-right">{{ props.item.p_currency }}</td>
                        <td class="text-xs-right">{{ props.item.p_size }}</td>
                        <td class="text-xs-right">{{ props.item.p_weight }}</td>
                        <td class="text-xs-right">{{ props.item.p_note }}</td>
                    </template>

                    <template v-slot:no-data>
                        <v-alert :value="true" color="error" icon="warning">
                            抱歉，這裡沒有任何資料 :(
                        </v-alert>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
export default {
    data () {
        return {
            pagination: { rowsPerPage: 25, sortBy: 'id' },
            selected: [],
            products: [],
            headers: [
                {
                    text: '產品類型',
                    value: 'p_type',
                    align: 'left',
                    sortable: false,
                },
                { text: '產品圖片', value: "p_image", sortable: false },
                { text: '產品名稱', value: "p_name", sortable: false },
                { text: '產品料號', value: "p_part_no", sortable: false },
                { text: '產品規格', value: "p_spec", sortable: false },
                { text: '產品價格', value: "p_price" },
                { text: '幣值', value: "p_currency", sortable: false },
                { text: '產品尺寸', value: "p_size", sortable: false },
                { text: '產品重量', value: "p_weight", sortable: false },
                { text: '備註', value: "p_note", sortable: false },
            ]
        }
    },
    created () {
        this.getProducts();
    },
    methods: {
        getProducts () {
            let uri = 'http://172.16.110.7:8888/api/products'
            this.axios.get(uri).then(response => {
                this.products = response.data;
                console.log(this.products);
            }).catch(error => {
                console.log(error.message)
            })
        }
    }
}
</script>
