<template>
  <div id="device">
    <h6>
      Gestione impostazioni generali
      <strong>{{ customerDescription }}</strong>
    </h6>
    <q-btn
      @click="generateCsvFiles"
      color="red"
      icon="mail"
      icon-right="send"
      label="Crea Csv file sul firewall"
    />
    <q-btn @click="reloadFirewallRules" color="green" icon="send" label="Ricarica regole di firewall" />
    <q-btn @click="reloadBandwidthRules" color="blue" icon="send" label="Ricarica regole di banda" />
  </div>
</template>

<script lang="js">
import { mapState } from 'vuex'
import {Store} from '../store'
//import { ValidationProvider, ValidationObserver, extend, localize } from 'vee-validate';
import validator from "./validator"
import companyassetsJson from '../config/companyassets.json'

export default {
  data() {
    return {
                       
    }
  },
  components: {
    //ValidationProvider,
    //ValidationObserver
  },
  methods: {
    generateCsvFiles: function() {
      this.$axios.post('/adminarea/firewall/generate/csv/files', {})
        .then((response) => {      
            this.makeToast(response.data.msg);                                              
          })
          .catch(error => {                              
              console.log(error);
          });
    },
    reloadFirewallRules: function() {
      this.$axios.post('/adminarea/firewall/reload/rules', {})
        .then((response) => {      
            this.makeToast(response.data.msg);                                              
          })
          .catch(error => {                              
              console.log(error);
          });
    },
    reloadBandwidthRules: function() {
      this.$axios.post('/adminarea/firewall/reload/bandwidth', {})
        .then((response) => {      
            this.makeToast(response.data.msg);                                              
          })
          .catch(error => {                              
              console.log(error);
          });
    },    
    makeToast(string) {        
        this.$q.notify({color: 'green-4', textColor: 'white', icon: 'info', message: string});
      }
    }, 
  computed: mapState({
    user: 'user', 
  }),
  mounted () {
           
  },
    beforeRouteEnter(to, from, next) {
    var currentUser = Store.state.user;
    console.log(currentUser);
    if ((currentUser.role === "admin"))  next();
    else next("/Login");
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

.monitored {
  background-color: rgb(255, 123, 0);
}
</style>