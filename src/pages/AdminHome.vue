<template>
  <div id="wrapper">
    <q-form ref="loginForm" @submit="fullTextSearch()" class="q-gutter-md">
      <q-input label="Ricerca cliente" v-model="textToSearch" />
    </q-form>

    <div v-if="showCustomerSearch">
      <q-table
        title="Clienti"
        :data="customers"
        :columns="columnsTableCustomers"
        row-key="id"
        virtual-scroll
        :pagination.sync="pagination"
        :rows-per-page-options="[0]"
        @row-click="selectCustomer"
      />
    </div>
  </div>
</template>

<script lang="js">
import { mapState } from 'vuex'

/*
import User from '../components/User.vue';
import Customer from '../components/Customer.vue'; 
import Contract from '../components/Contract.vue'; 
import Service from '../components/Service.vue';
import ServiceTemplate from '../components/ServiceTemplate.vue';
import DeviceCustomer from '../components/DeviceCustomer.vue';
import DeviceBackbone from '../components/DeviceBackbone.vue';
import SiteBackbone from '../components/SiteBackbone.vue';
import ViewData from '../components/ViewData.vue';
import MonitoringDeviceCustomer from '../components/MonitoringDeviceCustomer.vue';
import MonitoringDeviceBackbone from '../components/MonitoringDeviceBackbone.vue';
*/

export default {
  data() {
    return {  
        customers: [],
        textToSearch: "",        
        showCustomerSearch: false,
        pagination: {rowsPerPage: 0},
        columnsTableCustomers: [
                  {name: "firstname", label: "Nome",    field: row => row.firstname,sortable: true},
                  {name: "lastname", label: "Cognome",  field: row => row.lastname, sortable: true}, 
                  {name: "phone", label: "Telefono",    field: row => row.mobilephone}, 
                  {name: "email", label: "Email",       field: row => row.email}
                  ],

    
    
    }
  },
  components: {
    /*
      User,
      Customer,
      Contract,
      Service,
      ServiceTemplate,
      DeviceCustomer,
      DeviceBackbone,
      SiteBackbone,
      ViewData,
      MonitoringDeviceCustomer,
      MonitoringDeviceBackbone
      */
  },
  methods: {
      fullTextSearch: function () {                    
          const store=this.$store;
          this.selectedCustomer={}; 
          this.showCustomerSearch=true;             
          this.$axios.post('/adminarea/fulltextsearch', {textToSearch: this.textToSearch})
          .then(response => {                
                if (response.data.status === "OK") {
                    this.customers = response.data.results;
                    if(this.customers.length>0)
                      this.$q.notify({color: 'green-4', textColor: 'white', icon: 'cloud_done', message: 'Ricerca effettuata'});
                    else
                      this.$q.notify({color: 'green-4', textColor: 'white', icon: 'cloud_done', message: 'Nessun risultato'});
                }                                     
            })
            .catch(error => {
                this.makeToast('Nessun cliente'); 
                console.log(error);
            });
      },
      selectCustomer(evt, cst, index) {        
          const store=this.$store;
          this.showCustomerSearch=false;
          console.log("Select customer");
          console.log(cst);
          store.commit("changeCustomer", cst);
          this.$router.push("/Customer");          
      }      
  },
  computed: mapState({
    user: 'user',
    customer: 'customer',
    contract: 'contract',
    deviceCustomer: 'deviceCustomer',
    }),
  created() {      
  }
}
</script>