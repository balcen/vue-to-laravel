<template>
    <div>
        <v-layout>
            <v-flex xs12>
                <v-data-table
                  :headers="headers"
                  :items="clients"
                  :loading="loading"
                  :pagination-async="pagination"
                  :total-items="totalBills"
                  class="elevation-1"
                >
                    <v-progress-linear v-slot:process color="blue" indeterminate></v-progress-linear>

                    <template v-slot:item="props">
                        <td>
                            <v-checkbox
                              v-model="props.selected"
                              primary
                              hide-details
                            ></v-checkbox>
                        </td>
                    </template>

                    <template v-slot:no-data>
                        <v-alert :value="true" :color="error" :icon="warning">
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
            seleted: [],
            totalBills: 0,
            pagination: {},
            headers: {},
            bills: [],
            loading: true
        }
    },
    methods: {
        getDataFromApi () {
            this.loading = true
            return new Promise((resolve, reject) => {
                const {sortBy, descending, page, rowsPerPage} = this.pagination

                let items = this.getBills
                const total = items.length

                items = items.sort((a,b) => {
                    const sortA = a[sortBy]
                    const sortB = b[sortBy]

                    if (descending) {
                        if (sortA < sortB) return 1
                        if (sortA > sortB) return -1
                    } else {
                        if (sortA < sortB) return -1
                        if (sortA > sortB) return 1
                    }
                })

                if (rowsPerPage > 0) {
                    items = items.slice((page-1) * rowsPerPage, page * rowsPerPage)
                }

                setTimeout (() => {
                    this.loading = false
                    resolve({
                        items,
                        total
                    })
                },1000)
            })
        }
    }
}
</script>
