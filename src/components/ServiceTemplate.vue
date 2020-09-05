<template>
  <div id="serviceTemplate">
    <div class="card o-hidden border-0 shadow-lg my-5">
      <div class="card-body p-0">
        <!-- Nested Row within Card Body -->
        <div class="row">
          <!--div class="col-lg-5 d-none d-lg-block bg-register-image"></div-->
          <div class="col">
            <div class="p-2">
              <div class="text-center">
                <h1 class="h4 text-gray-900 mb-4">Configurazione Modelli di Servizio</h1>
              </div>

              <b-button-toolbar
                key-nav
                aria-label="Userss toolbar"
                style="backgroud-color: transparent;"
              >
                <b-button
                  v-on:click="newServiceTemplate()"
                  class="btn-primary"
                  style="border: none"
                >
                  <img
                    src="/img/actions/new.png"
                    alt="crea nuovo"
                    style="width: 64px; height: 64px;"
                  />
                </b-button>
                <b-button
                  v-on:click="saveServiceTemplate()"
                  class="btn-primary"
                  style="border: none"
                >
                  <img src="/img/actions/save.png" alt="salva" style="width: 64px; height: 64px;" />
                </b-button>
                <b-button
                  v-on:click="deleteServiceTemplate()"
                  class="btn-primary"
                  style="border: none"
                >
                  <img
                    src="/img/actions/delete.png"
                    alt="elimina"
                    style="width: 64px; height: 64px;"
                  />
                </b-button>

                <b-button v-on:click="exit()" class="btn-primary" style="border: none">
                  <img src="/img/actions/exit.png" alt="esci" style="width: 64px; height: 64px;" />
                </b-button>
              </b-button-toolbar>

              <form id="formObj" class="user">
                <div class="form-group row">
                  <div class="col">
                    <input
                      id="description"
                      name="description"
                      v-model="selectedServiceTemplate.description"
                      title="Descrizione estesa del servizio"
                      type="text"
                      class="form-control form-control-user"
                    />
                  </div>
                  <div class="col">
                    <input
                      id="code"
                      name="code"
                      v-model="selectedServiceTemplate.code"
                      title="Codice identificativo servizio"
                      type="text"
                      class="form-control form-control-user"
                    />
                  </div>
                </div>
                <div class="form-group row">
                  <div class="col">
                    <input
                      id="unit"
                      name="unit"
                      v-model="selectedServiceTemplate.unit"
                      title="Unità di vendita"
                      maxlength="16"
                      type="text"
                      class="form-control form-control-user"
                    />
                  </div>
                  <div class="col">
                    <input
                      id="billingPeriod"
                      name="billingPeriod"
                      v-model="selectedServiceTemplate.billingPeriod"
                      title="Periodo di fatturazione in giorni"
                      maxlength="13"
                      type="text"
                      class="form-control form-control-user"
                    />
                  </div>
                  <div class="col">
                    <input
                      id="price"
                      name="price"
                      v-model="selectedServiceTemplate.price"
                      title="Prezzo per unità di vendita"
                      maxlength="6"
                      type="text"
                      class="form-control form-control-user"
                    />
                  </div>
                  <div class="col">
                    <input
                      id="vat"
                      name="vat"
                      v-model="selectedServiceTemplate.vat"
                      title="Percentuale IVA"
                      maxlength="6"
                      type="text"
                      class="form-control form-control-user"
                    />
                  </div>
                </div>
                <div class="form-group row">
                  <div class="col">
                    <label for="dayinvoicereminder">Giorni avviso fattura in scadenza</label>
                    <input
                      id="dayinvoicereminder"
                      name="dayinvoicereminder"
                      v-model="selectedServiceTemplate.dayinvoicereminder"
                      title="Giorni precedenti alla scadenza della fattura per invio avviso di pagamento"
                      type="text"
                      class="form-control form-control-user"
                    />
                  </div>
                  <div class="col">
                    <label for="dayforexpirationwarning">Giorni di attesa avviso fattura scaduta</label>
                    <input
                      id="dayforexpirationwarning"
                      name="dayforexpirationwarning"
                      v-model="selectedServiceTemplate.dayforexpirationwarning"
                      title="Giorni successivi alla scadenza della fattura per invio avviso disattivazione"
                      type="text"
                      class="form-control form-control-user"
                    />
                  </div>
                  <div class="col">
                    <label for="dayforexpirationwarning">Giorni di attesa disattivazione servizio</label>
                    <input
                      id="nopaydaysbeforedeactivation"
                      name="nopaydaysbeforedeactivation"
                      v-model="selectedServiceTemplate.nopaydaysbeforedeactivation"
                      title="Giorni di attesa per disattivazione in caso di mancato pagamento"
                      type="text"
                      class="form-control form-control-user"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-------------------Data table sample ------------------>
    <!-- DataTales Example -->
    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Modelli di Servizio</h6>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table id="example" class="table table-bordered" width="100%" cellspacing="0">
            <thead>
              <tr>
                <th>Azioni</th>
                <th>Descrizione</th>
                <th>Codice</th>
                <th>Unità</th>
                <th>Prezzo</th>
                <th>Periodo Fatturazione</th>
                <th>Data creazione</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="srvTemplate in serviceTemplates"
                v-bind:key="srvTemplate.id"
                v-bind:class="srvTemplate.state"
              >
                <td>
                  <img
                    src="/img/actions/open.png"
                    alt="seleziona"
                    style="width: 32px; height: 32px; fill:greenyellow;"
                    v-on:click="selectServiceTemplate(srvTemplate)"
                  />
                  <img
                    src="/img/actions/unlocked.png"
                    alt="attiva"
                    style="width: 32px; height: 32px; xfill:green;"
                    v-on:click="activateServiceTemplate(srvTemplate)"
                  />
                  <img
                    src="/img/actions/locked.png"
                    alt="disattiva"
                    style="width: 32px; height: 32px; xfill:red;"
                    v-on:click="suspendServiceTemplate(srvTemplate)"
                  />
                  <img
                    src="/img/actions/delete.png"
                    alt="elimina"
                    style="width: 32px; height: 32px; xfill: gray;"
                    v-on:click="deleteServiceTemplate(srvTemplate)"
                  />
                </td>
                <td>{{srvTemplate.description}}</td>
                <td>{{srvTemplate.code}}</td>
                <td>{{srvTemplate.unit}}</td>
                <td>{{srvTemplate.price}}</td>
                <td>{{srvTemplate.billingperiod}}</td>
                <td>{{srvTemplate.createdAt}}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th>Azioni</th>
                <th>Descrizione</th>
                <th>Codice</th>
                <th>Unità</th>
                <th>Prezzo</th>
                <th>Periodo Fatturazione</th>
                <th>Data creazione</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import Vue from 'vue'
import { mapState } from 'vuex'

export default {  
  data() {
      return {
        selectedServiceTemplate: {},
        serviceTemplates: {}
      }
  },
  methods: {
    getServiceTemplateData: function() {
        console.log("Selected service template");
        console.log(this.selectedServiceTemplate); 
        this.getAllServiceTemplates();
    },
    getAllServiceTemplates: function() {
        this.axios.post(this.$formatUrl('/adminarea/serviceTemplate/getall'), {})
            .then(response => {                             
                  if (response.data.status === "OK") {                  
                      this.serviceTemplates = response.data.serviceTemplates;                                                
                      this.makeToast(response.data.msg);                       
                  }                                     
              })
              .catch(error => {                              
                  console.log(error);
              });
    },
    newServiceTemplate: function (){
      this.selectedServiceTemplate.id=null;
      this.saveServiceTemplate();
    },
    saveServiceTemplate: function (){
        let relUrl="";
        if((!this.selectedServiceTemplate.id) || (this.selectedServiceTemplate.id==="")) {
          relUrl='/adminarea/serviceTemplate/insert'; 
          this.selectedServiceTemplate.state="active"; //New services starts active
        }
        else relUrl='/adminarea/serviceTemplate/update'
        this.axios.post(this.$formatUrl(relUrl), {serviceTemplate: this.selectedServiceTemplate})
            .then(response => {                
                  if (response.data.status === "OK") {                  
                      this.selectedServiceTemplate = response.data.serviceTemplate; 
                      this.$store.commit("changeServiceTemplate",this.selectedServiceTemplate);                       
                      if(relUrl==='/adminarea/serviceTemplate/insert') this.serviceTemplates.push(this.selectedServiceTemplate);
                  }                                     
                  this.makeToast(response.data.msg);
              })
              .catch(error => {                              
                  console.log(error);
              });
    },
    selectServiceTemplate: function (srv) {      
      this.selectedServiceTemplate=srv;
      this.$store.commit("changeServiceTemplate",this.selectedServiceTemplate);        
    },
    deleteServiceTemplate: function (srv) {
      const isConfirmed = confirm("Confermi la cancellazione?");
      if(isConfirmed) {
      const parent=this.$parent;
      this.axios.post(this.$formatUrl('/adminarea/serviceTemplate/delete'), {serviceTemplate: srv})
          .then(response => {                
                if (response.data.status === "OK") {
                    this.serviceTemplates.forEach((element, index, array) => {
                      if(element.id===srv.id)  this.serviceTemplates.splice(index,1); 
                    });              
                    this.selectedServiceTemplate = {};                        
                    this.makeToast(response.data.msg);                              
                }                                     
            })
            .catch(error => {                              
                console.log(error);
            });
        }
    },
    activateServiceTemplate: function(srv) {
      srv.state="active";
      this.axios.post(this.$formatUrl('/adminarea/serviceTemplate/update'), {serviceTemplate: srv})
        .then(response => {                
              if (response.data.status === "OK") {                  
                  this.selectedServiceTemplate = response.data.serviceTemplate;                      
                  this.makeToast(response.data.msg);                   
              }                                     
          })
          .catch(error => {                              
              console.log(error);
          });
    },
    suspendServiceTemplate: function(srv) {
      srv.state="suspended";
      this.axios.post(this.$formatUrl('/adminarea/serviceTemplate/update'), {serviceTemplate: srv})
        .then(response => {                
              if (response.data.status === "OK") {                  
                  this.selectedServiceTemplate = response.data.serviceTemplate;                      
                  this.makeToast(response.data.msg);                  
              }                                     
          })
          .catch(error => {                              
              console.log(error);
          });
    },
    exit: function() {
      this.$parent.$emit("selectedCustomer");
    },
    makeToast(string, append = false) {        
      this.$bvToast.toast(string, {
        title: 'info',
        autoHideDelay: 2000,
        solid: true,
        variant: "info",
        toaster: 'b-toaster-bottom-full',
      })
    }
  },
  computed: mapState({
    serviceTemplate: 'serviceTemplate',      
    }),
    created() {
      this.getServiceTemplateData();
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