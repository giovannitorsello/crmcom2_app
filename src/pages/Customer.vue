<template>
  <div id="customers">
    <h6>
      Gestione del cliente
      <strong>{{customerDescription}}</strong>
    </h6>
    <img src="/img/actions/new.png"     @click="newCustomer" style="width: 48px; height: 48px;" />
    <img src="/img/actions/save.png"    @click="saveCustomer" style="width: 48px; height: 48px;" />
    <img src="/img/actions/delete.png"  @click="deleteCustomer" style="width: 48px; height: 48px;" />
    <img src="/img/actions/exit.png"    @click="exit" style="width: 48px; height: 48px;" />


    <q-form ref="customerForm" class="q-gutter-md">
      <div class="row">
        <div class="col">
          <q-toggle label="Azienda" v-model="isCompany" />
        </div>
        <div class="col">
          <q-checkbox label="Da fatturare" v-model="selectedCustomer.businnessflag" />
        </div>
      </div>

      <div class="row">
        <div class="col">
          <q-input label="Nome" v-model="selectedCustomer.firstname" />
        </div>
        <div class="col">
          <q-input label="Cognome" v-model="selectedCustomer.lastname" />
        </div>
        <div class="col">
          <q-input label="Codice Fiscale" v-model="selectedCustomer.codfis" />
        </div>
      </div>

      <div class="row">
        <div class="col">
          <q-input label="Indirizzo" v-model="selectedCustomer.address" />
        </div>
        <div class="col">
          <q-input label="Cap" v-model="selectedCustomer.postalcode" />
        </div>
        <div class="col">
          <q-input label="Città" v-model="selectedCustomer.city" />
        </div>
        <div class="col">
          <q-input label="Stato" v-model="selectedCustomer.state" />
        </div>
      </div>

      <div id="companyFields" v-if="isCompany">
        <div class="row">
          <div class="col">
            <q-input label="Denominazione Azienda" v-model="selectedCustomer.company" />
          </div>
          <div class="col">
            <q-input label="Indirizzo Azienda" v-model="selectedCustomer.companyaddress" />
          </div>
          <div class="col">
            <q-input label="Telefono aziendale" v-model="selectedCustomer.companyphone" type="tel" />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <q-input label="Partita IVA" v-model="selectedCustomer.vatcode" />
          </div>
          <div class="col">
            <q-input label="Codice Univoco SDI" v-model="selectedCustomer.sdicode" />
          </div>
          <div class="col">
            <q-input label="Company PEC" v-model="selectedCustomer.companypec" type="email" />
          </div>
        </div>
      </div>

      <div class="row .offset-md-4">
        <div class="col">
          <q-input label="Email" v-model="selectedCustomer.email" type="email" />
        </div>
        <div class="col">
          <q-input label="Tel. Mobile" v-model="selectedCustomer.mobilephone" type="tel" />
        </div>
        <div class="col">
          <q-input label="Tel. Fisso" v-model="selectedCustomer.phone" type="tel" />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <q-input label="Nome Utente" v-model="selectedCustomer.username" />
        </div>
        <div class="row">
          <q-input
            label="Password"
            v-model="selectedCustomer.password"
            filled
            :type="isPwd ? 'password' : 'text'"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </div>
      </div>
    </q-form>

    <div v-if="contracts">
      <q-table
        title="Contratti"
        :data="contracts"
        :columns="columnsTableContracts"
        row-key="id"
        virtual-scroll
        :pagination.sync="pagination"
        :rows-per-page-options="[0]"
        @row-click="openContract"
      >
      <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width />
            <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props" v-bind:class="props.row.state">
            <q-td auto-width>
              <img
                src="/img/actions/open.png"
                style="width: 32px; height: 32px;"
                v-on:click="openContract(props.row)"
              />
              <img
                src="/img/actions/unlocked.png"
                style="width: 32px; height: 32px; xfill:green;"
                v-on:click="activateContract(props.row)"
              />
              <img
                src="/img/actions/locked.png"
                style="width: 32px; height: 32px; xfill:red;"
                v-on:click="suspendContract(props.row)"
              />
              <img
                src="/img/actions/delete.png"
                style="width: 32px; height: 32px; xfill: gray;"
                v-on:click="deleteContract(props.row)"
              />
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">{{ col.value }}</q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script lang="js">
import { mapState } from 'vuex'

export default {
  data() {
    return {
        isPwd: true,
        isCompany: false,        
        selectedCustomer: {},
        selectedContract: {},
        contracts: [],          
        contractClassStyleRow: "",
        pagination: {rowsPerPage: 0},
        columnsTableContracts: [
                  {name: "actions",     label: "Azioni"},
                  {name: "Stato",       label: "state",               field: row => row.state},                  
                  {name: "description", label: "Descrizione",         field: row => row.description,sortable: true},
                  {name: "address",     label: "Indirizzo",           field: row => row.address, sortable: true}, 
                  {name: "duration",    label: "Durata",              field: row => row.duration}, 
                  {name: "createdAt",   label: "Data inserimento",    field: row => row.createdAt}
                  ],
        columnsTableDevices: [
                  {name: "description", label: "Descrizione",    field: row => row.description,sortable: true},
                  {name: "ipv4",        label: "Ip",             field: row => row.address, sortable: true}, 
                  {name: "mac",         label: "Mac",            field: row => row.duration}, 
                  {name: "Stato",       label: "state",          field: row => row.state},                  
                  ],        
    }
  },
  methods: {      
      openContract: function (ctr) {
          this.$store.commit("changeContract", ctr);           
          this.$router.push("/Contract")
      },
      activateContract: function(ctr) {
        ctr.state="active";
        this.$axios.post('/adminarea/contract/update', {contract: ctr})
          .then(response => {                
                if (response.data.status === "OK") {                  
                    this.selectedContract = response.data.contract;  
                    this.$store.commit("changeContract", this.selectedContract);                                                       
                }                                     
            })
            .catch(error => {                              
                console.log(error);
            });
      },
      suspendContract: function(ctr) {
        ctr.state="suspended";
        this.$axios.post('/adminarea/contract/update', {contract: ctr})
          .then(response => {                
                if (response.data.status === "OK") {                  
                    this.selectedContract = response.data.contract;
                    this.$store.commit("changeContract", this.selectedContract);                                                       
                }                                     
            })
            .catch(error => {                              
                console.log(error);
            });
      },
      deleteContract: function(ctr) {
        const isConfirmed = confirm("Confermi la cancellazione?");
        if(isConfirmed) {console.log("Delete confirmed"); return "cancellato";}
        return "";
      },      
      getCustomerData: function () {
        if(this.$store.state.customer) {
          this.selectedCustomer=Object.assign({}, this.$store.state.customer);                     
          if(this.selectedCustomer.vatcode==="") this.isCompany = false; 
          else this.isCompany = true;
          console.log("Customer");
          console.log(this.selectedCustomer);            
          this.getCustomerContracts();          
        }
      },
      getCustomerContracts: function () {          
          const store=this.$store;
          this.showCustomerSearch=true;     
          this.$axios.post('/adminarea/contract/get_all_by_customer', {idCustomer: this.selectedCustomer.id})
          .then(response => {                
                if (response.data.status === "OK") {                  
                    this.contracts = response.data.contracts;                                       
                }                                     
            })
            .catch(error => {                              
                console.log(error);
            });
      },
      changeCustomerType: function () {                  
          if (this.isCompanyBtn.value === false) {
              this.selectedCustomer.vatcode = "";
              this.isCompanyBtn.value = true;              
              this.isCompanyBtn.caption = "<span><i class='fa fa-industry'></i> Azienda</span>";              
          }          
          else if (this.isCompanyBtn.value === true) {
              this.selectedCustomer.vatcode = "";
              this.isCompanyBtn.value = false;
              this.isCompanyBtn.caption = "<span><i class='fa fa-home'></i> Privato</span>";
          }
      },
      newCustomer: function() {
        this.selectedCustomer={};
        this.contracts = [];
        this.selectedContract={}
        this.$store.commit("changeCustomer",this.selectedCustomer);   
      },
      async saveCustomer() {   
        const valid = true;
        if(valid) {   
        this.$axios.post('/adminarea/customer/update', {customer: this.selectedCustomer})
          .then(response => {                
                if (response.data.status === "OK") {                  
                    this.selectedCustomer = response.data.customer;  
                    this.$store.commit("changeCustomer", this.selectedCustomer);      
                    this.makeToast(response.data.msg); 
                    this.getCustomerData();             
                    alert("Cliente inserito");
                }                                     
            })
            .catch(error => {                              
                console.log(error);
            });
        }
        else {
          alert("Dati errati controlla i campi inseriti");                    
        }
      },
      deleteCustomer: function() {
        const isConfirmed = confirm("Confermi la cancellazione?");
        if(isConfirmed) {
        this.$axios.post('/adminarea/customer/delete', {customer: this.selectedCustomer})
          .then(response => {                
                if (response.data.status === "OK") {                  
                    this.selectedCustomer = response.data.customer;  
                    this.$store.commit("changeCustomer", this.selectedCustomer);      
                    this.makeToast(response.data.msg); 
                    this.getCustomerData();             
                }                                     
            })
            .catch(error => {                              
                console.log(error);
            });
        }
      },
      exit: function() {
        this.$router.push("/AdminHome");
      },
      makeToast(string) {        
        this.$q.notify({color: 'green-4', textColor: 'white', icon: 'info', message: string});
      }   
  },
  mounted() {
    this.getCustomerData();      
  },
  computed: mapState({
    user: 'user',
    customer: 'customer',  
    customerDescription() {
      const customer=this.customer;
      
      if(customer.vatcode && customer.vatcode!=="")
        return customer.company;
      else if(customer.lastname && customer.firstname)
        return customer.lastname+" "+customer.firstname;
      else
        return "Ricerca o inserisci un nuovo cliente";
    }
    })
}
</script>

<style scoped>
.valid {
  border-color: rgb(0, 255, 0);
  background-color: rgb(0, 255, 0);
}

.invalid {
  border-color: rgb(255, 0, 0);
  background-color: rgb(255, 0, 0);
}
</style>