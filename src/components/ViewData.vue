<template>
  <div id="ObjectsQueryAndExport">
    <div id="card-view-data" class="card o-hidden border-0 shadow-lg my-5">
      <div class="card-body p-0">
        <div class="p-2">
          <div class="text-center">
            <h1>Ricerche ed esportazione dati</h1>
            <h3 v-if="customer.id">Cliente selezionato: {{customerDescription}}</h3>
            <h3 v-if="contract.id">Contratto selezionato: {{contract.description}}</h3>
          </div>
          <ValidationObserver ref="validateObserver">
            <form id="formSearch" v-on:submit.prevent="search()">
              <div class="form-group row">
                <div class="col">
                  <ValidationProvider rules="required" v-slot="{ errors }">
                    <select
                      id="objType"
                      name="objType"
                      placeorder="Tipo di oggetto"
                      v-model="objType"
                      class="form-control form-control-user"
                      aria-label="Tipo di oggetto"
                    >
                      <option
                        v-for="type in objTypes"
                        v-bind:key="type.id"
                        v-bind:value="type"
                      >{{ type.description }}</option>
                    </select>
                    <span style="color: red;">{{ errors[0] }}</span>
                  </ValidationProvider>
                </div>
                <div class="col">
                  <ValidationProvider rules="required" v-slot="{ errors }">
                    <input
                      id="searchString"
                      v-model="txtSearch"
                      placeholder="testo di ricerca"
                      type="text"
                      class="form-control form-control-user"
                      title="Testo di ricerca"
                    />
                    <span style="color: red;">{{ errors[0] }}</span>
                  </ValidationProvider>
                </div>
              </div>
            </form>
          </ValidationObserver>
        </div>
      </div>
    </div>

    <!-- Main table element -->
    <b-table
      show-empty
      small
      stacked="md"
      :items="objectsFound"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      :filterIncludedFields="filterOn"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
    >
      <template v-slot:cell(actions)="row">
        <img
          title="Apri per la modifica"
          src="/img/actions/open.png"
          alt="apri"
          style="width: 32px; height: 32px;"
          v-on:click="openObject(row.item)"
        />
        <img
          title="Associa al contesto selzionato in precedenza"
          src="/img/actions/link.png"
          alt="apri"
          style="width: 32px; height: 32px;"
          v-on:click="connectObject(row.item)"
        />
      </template>

      <!--template v-slot:row-details="row">
        <b-card>
          <ul>
            <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
          </ul>
        </b-card>
      </template-->
    </b-table>
  </div>
</template>

<script lang="js">
import { mapState } from 'vuex'
import objTypesJson from '../config/queriesAndExportData.json'

export default {
  data() {
    return {
        objType: {},
        objTypes: objTypesJson,
        txtSearch: "",
        objectsFound: [],
        fields: ["id", "description"],
        totalRows: 1,
        currentPage: 1,
        perPage: 10,
        pageOptions: [5, 10, 50, 100],
        sortBy: "",
        sortDesc: false,
        sortDirection: "asc",
        filter: null,
        filterOn: []
    }
  },
  methods: {
    openObject(obj) {
        if(this.objType) {
            const uiComp=this.objType.UiComponent;            
            this.$store.commit("change"+uiComp,obj);
            this.$parent.$emit("selected"+uiComp);
        }
    },
    connectObject(obj) {
      console.log("Connect object");
        if(this.objType) {
        console.log(this.objType);
        if(this.objType.type==="deviceCustomer") 
        {
          if(this.contract) obj.contractId=this.contract.id;
          if(this.customer) obj.customerId=this.customer.id;
          console.log(obj);
          console.log(this.customer);
          console.log(this.contract);
        }


            const uiComp=this.objType.UiComponent;
            console.log("Got "+uiComp);
            console.log(obj);
            this.$store.commit("change"+uiComp,obj);
            this.$parent.$emit("selected"+uiComp);
        }
    },
    search() {        
        if(this.objType) {
        const urlRestService=this.objType.findByFieldUrl;        
        const searchObj={"type": this.objType.type, "fields": this.objType.searchFields, "value": this.txtSearch};
        this.axios.post(this.$formatUrl(urlRestService), {"searchObj": searchObj})
        .then(response => {                
                if (response.data.status === "OK") {                  
                    this.objectsFound = response.data.results;
                    this.fields=this.objType.searchFields.slice();
                    this.fields.push({ key: "actions", label: "Azioni" })                    
                    this.makeToast(response.data.msg);                   
                }                                     
            })
            .catch(error => {                              
                console.log(error);
            });      
        }
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
    user: 'user', 
    customer: 'customer',
    contract: 'contract',
    service: 'service',
    deviceCustomer:  'deviceCustomer',
    deviceBackbone:  'deviceBackbone',
    customerDescription() {
      const customer=this.customer;
      if(customer.vatcode && customer.vatcode!=="")
        return customer.company;
      else 
        return customer.lastname+" "+customer.firstname;
    }
  })
}
</script>

<style scoped>
</style>