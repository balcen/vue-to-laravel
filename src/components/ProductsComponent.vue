<template>
    <div>
        <v-layout>
            <v-flex xs12>
                <v-data-table
                  :headers="headers"
                  :items="products"
                  :total-items="totalProducts"
                  :pagination-async="pagination"
                  :loading="loading"
                  class="elevation-1"
                >
                    <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
                    <template v-slot:item="props">
                        <td>
                            <v-checkbox
                              v-model="props.selected"
                              primary
                              hide-details
                            ></v-checkbox>
                        </td>
                        <td></td>
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
