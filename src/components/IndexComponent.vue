<template>
    <div>
        <v-layout row no-wrap>
            <v-flex xs6>
                <v-tabs fixed-tabs>
                    <v-tab to="/index/clients" flat color="teal">CLIENT</v-tab>
                    <v-tab to="/index/products" flat color="teal">PRODUCT</v-tab>
                    <v-tab to="/index/orders" flat color="teal">ORDER</v-tab>
                    <v-tab to="/index/invoices" flat color="teal">INVOICE</v-tab>
                </v-tabs>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs3 class="pr-2">
                <v-text-field
                  v-model="search"
                  label="Search"
                  append-icon="search"
                  single-line
                  hide-details
                  class="pt-1"
                ></v-text-field>
            </v-flex>
            <v-flex shrink>
                <v-btn flat icon><v-icon>add</v-icon></v-btn>
                <v-btn :color="color" flat icon><v-icon>delete</v-icon></v-btn>
            </v-flex>
        </v-layout>
        <v-layout overflow-auto>
            <v-flex xs12>
                <router-view
                  :search="search"
                  @selectedChange="selectedChange"
                ></router-view>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
export default {
    data () {
        return {
            activeBtn: 1,
            search: '',
            color: ''
        }
    },
    computed: {

    },
    methods: {
        selectedChange (seleted) {

        }
    }
}
</script>
