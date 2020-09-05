<template>
  <div id="service">
    <h5>Sezione personalizzazione servizio</h5>
    <img src="/img/actions/new.png" @click="newService" style="width: 48px; height: 48px;" />
    <img src="/img/actions/save.png" @click="saveService" style="width: 48px; height: 48px;" />
    <img src="/img/actions/delete.png" @click="deleteService" style="width: 48px; height: 48px;" />
    <img src="/img/actions/exit.png" @click="exit" style="width: 48px; height: 48px;" />

    <q-form ref="contractForm" class="q-gutter-md">
      
      <div class="row">
        <div class="col">
          <q-input label="Descrizione" v-model="selectedService.service_description" />
        </div>
        <div class="col">
          <q-input label="Unità" v-model="selectedService.unit" />
        </div>
      </div>

      <div class="row">
        <div class="col">
          <q-input label="Prezzo" v-model="selectedService.price" />
        </div>
        <div class="col">
          <q-input label="IVA" v-model="selectedService.vat" />
        </div>
      </div>
      
      <div class="row">
        <div class="col">
          <q-input label="Intervallo fatturazione in giorni" v-model="selectedService.billingPeriod"/>
        </div>
        <div class="col">
          <q-input
            label="Giorni invio preavviso mancato pagamento"
            v-model="selectedService.nopaydaysbeforedeactivation"
          />
        </div>
        <div class="col">
          <q-input
            label="Giorni invio preavviso disattivazione"
            v-model="selectedService.dayforexpirationwarning"
        />
        </div>
      </div>
    </q-form>
  </div>
</template>

<script lang="js">
import { mapState } from 'vuex'

export default {
  data() {
    return {     
        selectedService: {},                       
    }
  },
  methods: {
      getServiceData: function() {
        this.selectedService=Object.assign({}, this.$store.state.service);             
        console.log("Selected service");
        console.log(this.selectedService);  
      },
      newService: function (){
        this.selectedService={};
        this.$store.commit("changeService", this.selectedService);      
      },
      saveService: function (){
        this.$axios.post('/adminarea/contractService/update', {service: this.selectedService})
            .then(response => {                
                  if (response.data.status === "OK") {                  
                      this.selectedService = response.data.service;  
                      this.$store.commit("changeService", this.selectedService);      
                      this.makeToast(response.data.msg);                       
                  }                                     
              })
              .catch(error => {                              
                  console.log(error);
              });
      },
      deleteService: function () {
        this.$axios.post('/adminarea/contractService/delete', {idContractService: this.selectedService.id})
            .then(response => {                
                  if (response.data.status === "OK") {                  
                      this.selectedService = {};  
                      this.$store.commit("changeService", this.selectedService);      
                      this.makeToast(response.data.msg);                              
                  }                                     
              })
              .catch(error => {                              
                  console.log(error);
              });
      },
      exit: function() {
        this.$router.push("/Contract");
      },
      makeToast(string) {        
        this.$q.notify({color: 'green-4', textColor: 'white', icon: 'info', message: string});
      }     
    }, 
  computed: mapState({
    user: 'user', 
    customer: 'customer',
    contract: 'contract',
    service: 'service',
  }),
  mounted () {
    this.getServiceData();       
  }
}
</script>

<style scoped>
.active {
  background-color: rgb(168, 243, 168);
}

.suspended {
  background-color: rgb(177, 171, 171);
}
</style>