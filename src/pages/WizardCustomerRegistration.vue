<template>
  <div id="customers">
    <h5>Inserimento guidato cliente</h5>
    <h6 v-if="step==1">
      <b>Configurazione contratto:</b> Tipo di cliente privato o azienda?
    </h6>
    <h6 v-if="step==2">
      <b>Configurazione contratto:</b> Inserisci i dati del cliente
    </h6>
    <h6 v-if="step==3">
      <b>Configurazione contratto:</b> Indirizzo postale cliente (domicilio)
    </h6>
    <h6 v-if="step==4">
      <b>Configurazione contratto:</b> Contatti telefono ed email
    </h6>
    <h6 v-if="step==5">
      <b>Configurazione contratto:</b> Seleziona i servizi da attivare e l'indirizzo completo del contratto.
    </h6>
    <h6 v-if="step==6">
      <b>Configurazione contratto:</b> Documento di identità cliente
    </h6>
    <h6 v-if="step==7">
      <b>Configurazione contratto:</b>Codice fiscale cliente
    </h6>

    <div id="dataFormDiv" style="padding-bottom: 100px;">
      <ValidationObserver ref="formCustomer">
        <q-form ref="customerFrom" class="q-gutter-md">
          <!--Step 1 - scelta tipo cliente -->
          <div class="row" v-if="step==1">
            <div class="col-auto">
              <q-btn-toggle
                v-model="isCompany"
                toggle-color="primary"
                no-caps
                rounded
                unelevated
                :options="[{label: 'Privato', value: false},{label: 'Azienda', value: true},]"
              />
            </div>
          </div>

          <!--Step 2 - Intestatario contratto azienda/privato -->
          <div id="companyFields" v-if="(isCompany) && (step==2)">
            <div class="row">
              <div class="col">
                <ValidationProvider
                  name="Denominazone Azienda"
                  immediate
                  rules="required"
                  v-slot="{ errors }"
                >
                  <q-input label="Denominazione Azienda" v-model="selectedCustomer.company" />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider
                  name="Indirizzo Sede Azienda"
                  immediate
                  rules="required|address"
                  v-slot="{ errors }"
                >
                  <q-input label="Indirizzo Sede Azienda" v-model="selectedCustomer.companyaddress">
                    <a>Aiuto sulla compilazione</a>
                  </q-input>
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider
                  name="Telefono principale aziendale"
                  immediate
                  rules="required|phone"
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Telefono principale aziendale"
                    v-model="selectedCustomer.companyphone"
                    type="tel"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <ValidationProvider name="Partita IVA" rules="required|vatcode" v-slot="{ errors }">
                  <q-input label="Partita IVA" v-model="selectedCustomer.vatcode" />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider
                  name="Codice univoco SDI"
                  rules="required|alpha_num"
                  v-slot="{ errors }"
                >
                  <q-input label="Codice Univoco SDI" v-model="selectedCustomer.sdicode" />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider name="Email PEC" rules="required|email" v-slot="{ errors }">
                  <q-input label="Email PEC" v-model="selectedCustomer.companypec" type="email" />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
            </div>
          </div>

          <!--Step 2 - Intestatario contratto azienda/privato-->
          <h6 v-if="(isCompany) && (step==2)">Dati amministratore azienda (obbligatori)</h6>
          <h6 v-if="(!isCompany) && (step==2)">Dati intestatario contratto (obbligatori)</h6>
          <div class="row" v-if="step==2">
            <div class="col">
              <ValidationProvider
                name="Nome"
                immediate
                rules="required|alpha_spaces"
                v-slot="{ errors }"
              >
                <q-input label="Nome" v-model="selectedCustomer.firstname" />
                <span class="error">{{ errors[0] }}</span>
              </ValidationProvider>

              <ValidationProvider
                name="Cognome"
                immediate
                rules="required|alpha_spaces"
                v-slot="{ errors }"
              >
                <q-input label="Cognome" v-model="selectedCustomer.lastname" />
                <span class="error">{{ errors[0] }}</span>
              </ValidationProvider>

              <ValidationProvider
                name="Codice Fiscale"
                immediate
                rules="required|codfis"
                v-slot="{ errors }"
              >
                <q-input label="Codice Fiscale" v-model="selectedCustomer.codfis" />
                <span class="error">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
          </div>

          <!--Step 3 - Indirizzo erogazione servizio -->
          <div class="row" v-if="step==3">
            <div class="col">
              <ValidationProvider
                name="Indirizzo"
                immediate
                rules="required|address"
                v-slot="{ errors }"
              >
                <q-input label="Indirizzo" v-model="selectedCustomer.address" />
                <span class="error">{{ errors[0] }}</span>
              </ValidationProvider>

              <ValidationProvider
                name="CAP"
                immediate
                rules="required|alpha_num"
                v-slot="{ errors }"
              >
                <q-input label="CAP" v-model="selectedCustomer.postalcode" />
                <span class="error">{{ errors[0] }}</span>
              </ValidationProvider>

              <ValidationProvider name="Città" immediate rules="required|alpha" v-slot="{ errors }">
                <q-input label="Città" v-model="selectedCustomer.city" />
                <span class="error">{{ errors[0] }}</span>
              </ValidationProvider>

              <ValidationProvider name="Stato" immediate rules="required|alpha" v-slot="{ errors }">
                <q-input label="Stato" v-model="selectedCustomer.state" />
                <span class="error">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
          </div>

          <!--Step 4 - Contatti -->
          <div class="row" v-if="step==4">
            <div class="col">
              <ValidationProvider name="Email" immediate rules="required|email" v-slot="{ errors }">
                <q-input label="Email" v-model="selectedCustomer.email" type="email" />
                <span class="error">{{ errors[0] }}</span>
              </ValidationProvider>

              <ValidationProvider
                name="Tel. Mobile"
                immediate
                rules="required|phone"
                v-slot="{ errors }"
              >
                <q-input label="Tel. Mobile" v-model="selectedCustomer.mobilephone" type="tel" />
                <span class="error">{{ errors[0] }}</span>
              </ValidationProvider>

              <ValidationProvider
                name="Tel. Fisso"
                immediate
                rules="required|phone"
                v-slot="{ errors }"
              >
                <q-input label="Tel. Fisso" v-model="selectedCustomer.phone" type="tel" />
                <span class="error">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
          </div>

          <!--Step 5 - Configurazione contratto -->
          <div class="row" v-if="step==5">
            <q-table
              style="width: 100%"
              title="Servizi"
              :data="serviceTemplates"
              :columns="columnsTableServiceTemplates"
              row-key="id"
              :selected-rows-label="getSelectedServiceTemplate"
              selection="multiple"
              :selected.sync="selectedServicesTemplate"
            />

            <!--Step 5 - Configurazione contratto -->
            <div class="row" v-if="step==5" style="width: 100%">
              <div class="col">
                <ValidationProvider
                  name="Indirizzo esecuzione contratto"
                  immediate
                  rules="required|address"
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Indirizzo esecuzione contratto"
                    v-model="selectedContract.address"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>

                <div class="row" style="padding-top: 100px">
                  <div class="col">Importo iva esclusa: {{valueContract.price}}</div>
                  <div class="col">Importo iva: {{valueContract.vat}}</div>
                  <div class="col">Importo totale: {{valueContract.total}}</div>
                </div>
              </div>
            </div>
          </div>

          <!--Step 6 identity documents -->
          <div class="row" v-if="step==6" stype="with: 100%">
            <div class="col">
              <q-btn
                color="primary"
                style="width: 300px"
                label="Carta identità fronte"
                @click="captureCiFront"
              />

              <q-btn
                color="primary"
                style="width: 300px"
                label="Carta identità retro"
                @click="captureCiBack"
              />
            </div>
          </div>
          <div class="row" v-if="step==6" stype="with: 100%">
            <div class="col">
              <img :src="imageCiFront" style="width: 300px" />
              <img :src="imageCiBack" style="width: 300px" />
            </div>
          </div>

          <div class="row" v-if="step==7" stype="with: 100%">
            <div class="col">
              <q-btn
                color="primary"
                style="width: 300px"
                label="Codice fiscale fronte"
                @click="captureCfFront"
              />
              <q-btn
                color="primary"
                style="width: 300px"
                label="Codice fiscale retro"
                @click="captureCfBack"
              />
            </div>
          </div>
          <div class="row" v-if="step==6" stype="with: 100%">
            <div class="col">
              <img :src="imageCfFront" style="width: 300px" />
              <img :src="imageCfBack" style="width: 300px" />
            </div>
          </div>
        </q-form>
      </ValidationObserver>
    </div>
    <div id="buttons" class="barButtons">
      <q-btn class="bottomLeft" @click="prevStep">Indietro</q-btn>
      <q-btn class="bottomRight" @click="nextStep">Avanti</q-btn>
    </div>

    <q-dialog v-model="helpAddress" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-teal text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Istruzioni sulla compilazione dell'indirizzo</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p>
            Il formato è
            <b>[Frazione] Via o Piazza, numero, CAP, Città, Provincia</b>
          </p>
          <ul>
            <p>Dopo la virgola va un solo spazio. La virgola è attaccata alla parola precedente.</p>
            <p>Il numero richiede solo cifre alfa-numeriche, NON scrivere n. o N.</p>
            <p>La provincia richiede solo due caratteri maiuscoli senza parentesi</p>
          </ul>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="js">
import { mapState } from 'vuex'
import {Store} from '../store'
import { ValidationProvider, ValidationObserver, extend, localize } from 'vee-validate';
import validator from "./validator"
import { Plugins, CameraResultType } from '@capacitor/core'

const { Camera } = Plugins

export default {
  data() {
    return {
        step: 1,
        stepMax: 7,
        helpAddress: false,
        isCompany: false,
        serviceTemplates: {},        
        selectedCustomer: {},
        selectedContract: {},
        valueContract: {},     
        selectedServicesTemplate: [],
        columnsTableServiceTemplates: [
          { name: "actions", label: "Azioni" },
          {
            name: "description",
            label: "Descrizione",
            field: "description",
            sortable: true
          },
          {
            name: "code",
            label: "Codice",
            field: "code",          
            sortable: true
          },
          {
            name: "unit",
            label: "Unità",
            field: "unit",
            sortable: true
          },
          {
            name: "price",
            label: "Prezzo",
            field: "price",
            sortable: true
          },
          {
            name: "createdAt",
            label: "Data inserimento",
            field: "createdAt",
            sortable: true
          },
          {
            name: "updatedAt",
            label: "Aggiornato il",
            field: "updatedAt",
            sortable: true
          }
        ],
        imageCfFront: '',
        imageCfBack: '',
        imageCiFront: '',
        imageCiBack: ''
    }
  },
  methods: {      
      nextStep() {
        if(this.step<this.stepMax) this.step++;
      },
      prevStep() {
        if(this.step>=2) this.step--;
      },
      getAllServiceTemplates() {
        this.$axios.post('/adminarea/serviceTemplate/getall', {})
            .then(response => {                             
                  if (response.data.status === "OK") {                  
                      this.serviceTemplates = response.data.serviceTemplates; 
                      console.log(this.serviceTemplates);
                      this.makeToast(response.data.msg);                       
                  }                                     
              })
              .catch(error => {                              
                  console.log(error);
              });
      },
      getSelectedServiceTemplate() {
          if(this.selectedServicesTemplate.length) {
          var price=0, vat=0, total=0;
          this.selectedServicesTemplate.forEach((element, index, array) => {
            console.log(element)
            price+=element.price;
            vat+=(element.price*element.vat)/100;
            total=price+vat;
            
            if(index===this.selectedServicesTemplate-1) {
              this.valueContract={"price": price, "vat": vat, "total": total};
            }
          });      
        }
        this.valueContract={price: 0, vat: 0, total: 0};           
      },
      async captureCiFront () {
        const image = await Camera.getPhoto({width: 600, height: 350, quality: 100, allowEditing: true, resultType: CameraResultType.base64});
        this.imageCiFront = "data:image/png;base64, "+image.base64String;  
        this.$axios.post('/adminarea/upload_image', {imageName: "CiFront", imageData: image.base64String})
          .then(response => {                             
                if (response.data.status === "OK") {                                        
                    this.makeToast(response.data.msg);                       
                }                                     
            })
            .catch(error => {                              
                console.log(error);
            });        
      },
      async captureCiBack () {
        const image = await Camera.getPhoto({width: 600, height: 350, quality: 100, allowEditing: true, resultType: CameraResultType.base64});
        this.imageCiBack = "data:image/png;base64, "+image.base64String;    
      },
      async captureCfFront () {
        const image = await Camera.getPhoto({width: 600, height: 350, quality: 100, allowEditing: true, resultType: CameraResultType.base64});
        this.imageCfFront = "data:image/png;base64, "+image.base64String      
      },
      async captureCfBack () {
        const image = await Camera.getPhoto({width: 600, height: 350, quality: 100, allowEditing: true, resultType: CameraResultType.base64});
        this.imageCfBack = "data:image/png;base64, "+image.base64String;      
      }
  },
  mounted() {
    validator.setup(); 
    this.getAllServiceTemplates();    
  },
  computed: mapState({
    user: 'user',
    customer: 'customer',
    contract: 'contract',
    }),
    components: {
      ValidationProvider,
      ValidationObserver
    },
    beforeRouteEnter(to, from, next) {
    var currentUser = Store.state.user;
    console.log(currentUser);
    if ((currentUser.role === "admin")      || 
        (currentUser.role === "manager")    ||
        (currentUser.role === "technician") ||
        (currentUser.role === "installer")  ||
        (currentUser.role === "seller"))    next();
    else next("/Login");
  }
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

.error {
  color: rgb(127, 127, 0);
  background-color: yellow;
  font-style: italic;
}

.bottomLeft {
  position: absolute;
  bottom: 10px;
  left: 10px;
}

.bottomRight {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
.barButtons {
  padding-top: 50px;
  width: 100%;
}
</style>