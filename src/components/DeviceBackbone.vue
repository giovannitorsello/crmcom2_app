<template>
  <div id="device">
    <b-container fluid>
      <b-row>
        <b-col lg="6" class="my-1">
          <b-form-group
            label="Filtro"
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
            label-for="filterInput"
            class="mb-0"
          >
            <b-input-group size="sm">
              <b-form-input v-model="filter" type="search" id="filterInput" placeholder="Cerca"></b-form-input>
              <b-input-group-append>
                <b-button :disabled="!filter" @click="filter = ''">Cancella</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>

        <b-col lg="6" class="my-1">
          <b-form-group
            label="Filtro solo su"
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
            description="Lascia deselezionato per filtrare tutti i dati"
            class="mb-0"
          >
            <b-form-checkbox-group v-model="filterOn" class="mt-1">
              <b-form-checkbox value="description">Description</b-form-checkbox>
              <b-form-checkbox value="ipv4">ipv4</b-form-checkbox>
              <b-form-checkbox value="ipv6">ipv4</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
        </b-col>

        <b-col sm="5" md="6" class="my-1">
          <b-form-group
            label="Dispositivi per pagina"
            label-cols-sm="6"
            label-cols-md="4"
            label-cols-lg="3"
            label-align-sm="right"
            label-size="sm"
            label-for="perPageSelect"
            class="mb-0"
          >
            <b-form-select v-model="perPage" id="perPageSelect" size="sm" :options="pageOptions"></b-form-select>
          </b-form-group>
        </b-col>

        <b-col sm="7" md="6" class="my-1">
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="fill"
            size="sm"
            class="my-0"
          ></b-pagination>
        </b-col>
      </b-row>

      <!-- Main table element -->
      <b-table
        show-empty
        small
        stacked="md"
        :items="devicesBackbone"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filter"
        :filterIncludedFields="filterOn"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :sort-direction="sortDirection"
        :tbody-tr-class="classRowTableDevices"
        @filtered="onFiltered"
      >
        <template v-slot:cell(actions)="row">
          <img
            src="/img/actions/open.png"
            alt="apri"
            style="width: 32px; height: 32px;"
            v-on:click="openDevice(row.item)"
          />

          <img
            src="/img/actions/delete.png"
            alt="elimina"
            style="width: 32px; height: 32px; xfill: gray;"
            v-on:click="deleteDevice(row.item)"
          />

          <img
            src="/img/actions/eye.svg"
            alt="Monitora"
            style="width: 32px; height: 32px;"
            v-on:click="monitoringDevice(row.item)"
            title="Attiva/disattiva monitoraggio dispositivo"
          />
        </template>

        <template v-slot:cell(site)="row">
          <template
            v-if="selectedSiteBackbone && selectedSiteBackbone.id && row.item.siteBackboneId===null"
          >
            <img
              src="/img/actions/plugDevice.png"
              alt="associa"
              style="width: 32px; height: 32px;"
              v-on:click="plugDeviceinSite(row.item)"
              title="associa al sito selezionato in precedenza"
            />
            <p>Non associato</p>
          </template>
          <template v-if="row.item.siteBackboneId!==null">
            <strong>{{sitesBackbone[row.item.siteBackboneId].description}}</strong>
            <img
              src="/img/actions/unplugDevice.png"
              alt="elimina associazione"
              style="width: 32px; height: 32px;"
              v-on:click="unplugDeviceinSite(row.item)"
              title="elimina associazione"
            />
          </template>
        </template>
      </b-table>

      <div class="card o-hidden border-0 shadow-lg my-5">
        <div class="card-body p-0">
          <!-- Nested Row within Card Body -->
          <div class="row">
            <!--div class="col-lg-5 d-none d-lg-block bg-register-image"></div-->
            <div class="col">
              <div class="p-2">
                <div class="text-center">
                  <h1 class="h4 text-gray-900 mb-4">
                    Sito selezionato
                    <b>{{selectedSiteBackbone.description}}</b>
                  </h1>
                </div>

                <b-button-toolbar
                  key-nav
                  aria-label="Customers toolbar"
                  style="backgroud-color: transparent;"
                >
                  <b-button v-on:click="newDevice()" class="btn-primary" style="border: none">
                    <img
                      src="/img/actions/new.png"
                      alt="crea nuovo"
                      style="width: 64px; height: 64px;"
                    />
                  </b-button>
                  <b-button v-on:click="saveDevice()" class="btn-primary" style="border: none">
                    <img src="/img/actions/save.png" alt="salva" style="width: 64px; height: 64px;" />
                  </b-button>
                </b-button-toolbar>
                <form id="formObj">
                  <div class="form-group row">
                    <div class="col">
                      <input
                        id="description"
                        name="description"
                        v-model="selectedDeviceBackbone.description"
                        placeholder="descrizione"
                        type="text"
                        class="form-control form-control-user"
                        title="descrizione"
                      />
                    </div>
                    <div class="col">
                      <input
                        id="type"
                        name="type"
                        v-model="selectedDeviceBackbone.type"
                        placeholder="tipo"
                        type="text"
                        class="form-control form-control-user"
                        title="tipologia"
                      />
                    </div>
                  </div>
                  <div class="form-group row">
                    <div class="col">
                      <input
                        id="vendor"
                        name="vendor"
                        v-model="selectedDeviceBackbone.vendor"
                        placeholder="produttore"
                        type="text"
                        class="form-control form-control-user"
                        title="produttore"
                      />
                    </div>
                    <div class="col">
                      <input
                        id="model"
                        name="model"
                        v-model="selectedDeviceBackbone.model"
                        placeholder="modello"
                        type="text"
                        class="form-control form-control-user"
                        title="modello"
                      />
                    </div>
                  </div>
                  <div class="form-group row">
                    <div class="col">
                      <input
                        id="mac"
                        name="mac"
                        v-model="selectedDeviceBackbone.mac"
                        placeholder="MAC"
                        type="text"
                        class="form-control form-control-user"
                        title="MAC-adress"
                      />
                    </div>
                    <div class="col">
                      <input
                        id="ipv4"
                        name="ipv4"
                        v-model="selectedDeviceBackbone.ipv4"
                        placeholder="ipv4"
                        type="text"
                        class="form-control form-control-user"
                        title="indirizzo ipv4"
                      />
                    </div>
                    <div class="col">
                      <input
                        id="ipv6"
                        name="ipv6"
                        placeholder="ipv6"
                        v-model="selectedDeviceBackbone.ipv6"
                        type="text"
                        class="form-control form-control-user"
                        title="indirizzo ipv6"
                      />
                    </div>
                  </div>
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text">Note dispositivo</span>
                    </div>
                    <input
                      id="note"
                      name="note"
                      v-model="selectedDeviceBackbone.note"
                      rows="5"
                      cols="100"
                      placeholder="Note"
                      type="textarea"
                      class="form-control form-control-user"
                      aria-multiline="true"
                      title="note dispositivo"
                    />
                  </div>
                </form>

                <hr class="separator" />
                <h1 class="h5 text-gray-900 mb-4">Sezioni specifiche</h1>
                <div id="deviceParametersSections" v-if="selectedDeviceBackbone.objData">
                  <div
                    v-for="(section, sectionName, indexSection) in objDataSection"
                    v-bind:key="indexSection"
                  >
                    <h1 class="h5 text-gray-900 mb-4">
                      <p align="left">{{ sectionName}}</p>
                    </h1>
                    <div class="row">
                      <div
                        v-for="(devProperty,devPropertyName, indexProperty) in section"
                        v-bind:key="indexProperty"
                      >
                        <div class="col">
                          <label
                            v-bind:for="devPropertyName"
                            class="form-control form-control-user"
                          >{{devPropertyName}}</label>
                          <input
                            class="form-control form-control-user"
                            v-bind:id="devPropertyName"
                            v-model="selectedDeviceBackbone.objData[sectionName][devPropertyName]"
                          />
                        </div>
                      </div>
                    </div>
                    <hr class="separator" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedSiteBackbone: {},
      selectedDeviceBackbone: {},
      sitesBackbone: {},
      devicesBackbone: [],
      objDataSection: {},
      objDataPrimitives: {},
      fields: [
        { key: "actions", label: "Azioni" },
        { key: "site", label: "Sito" },
        {
          key: "state",
          label: "Stato",
          sortable: true
        },
        {
          key: "description",
          label: "Descrizione",
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "ipv4",
          label: "ipv4",
          sortable: true
        },
        {
          key: "ipv6",
          label: "ipv6",
          sortable: true
        }
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 20, 50, 100],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterOn: []
    };
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key };
        });
    },
    siteDescription(dev) {
      return this.sitesBackbone[dev.siteBackboneId];
    }
  },
  mounted() {
    this.getAllSitesBackbone();
    this.getAllDevicesBackbone();
    this.totalRows = this.devicesBackbone.length;
    this.selectedSiteBackbone = this.$store.state.siteBackbone;
    if (this.selectedSiteBackbone == null) this.selectedSiteBackbone = {};
  },
  getSnmpParameters(device) {
    const oidsObjs = {
      txRate: "1.3.6.1.4.1.14988.1.1.1.1.1.2.1",
      rxRate: "1.3.6.1.4.1.14988.1.1.1.1.1.3.1",
      strength: "1.3.6.1.4.1.14988.1.1.1.1.1.4.1",
      ssid: "1.3.6.1.4.1.14988.1.1.1.1.1.5.1",
      frequency: "1.3.6.1.4.1.14988.1.1.1.1.1.7.1",
      band: "1.3.6.1.4.1.14988.1.1.1.1.1.8.1"
    };

    const oidsReq = [];
    for (const key in oidsObjs) {
      oidsReq.push(oidsObjs[key]);
    }

    this.axios
      .post(this.$formatUrl("/adminarea/deviceBackbone/getSnmpParams"), {ip: device.ipv4, oids: oidsReq})
      .then(response => {
        if (response.data.status === "OK") {
          this.snmpParameters = response.data.snmpParameters;          
          this.makeToast(response.data.msg);
          console.log(this.snmpParameters);
        }
      })
      .catch(error => {
        console.log(error);
      });
  },
  methods: {
    monitoringDevice(dev) {
      if (dev) {
        if (dev.state !== "monitored") dev.state = "monitored";
        else dev.state = "";
        this.selectedDeviceBackbone = dev;
        this.saveDevice();
      }
    },
    plugDeviceinSite(dev) {
      if (dev && this.selectedSiteBackbone) {
        this.selectedDeviceBackbone = dev;
        this.selectedDeviceBackbone.siteBackboneId = this.selectedSiteBackbone.id;
        this.$store.commit("changeDeviceBackbone", this.selectedDeviceBackbone);
        this.saveDevice();
      }
    },
    unplugDeviceinSite(dev) {
      if (dev && this.selectedSiteBackbone) {
        this.selectedDeviceBackbone = dev;
        this.selectedDeviceBackbone.siteBackboneId = null;
        this.$store.commit("changeDeviceBackbone", this.selectedDeviceBackbone);
        this.saveDevice();
      }
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    getAllSitesBackbone() {
      this.axios
        .post(this.$formatUrl("/adminarea/siteBackbone/getall"), {})
        .then(response => {
          if (response.data.status === "OK") {
            response.data.sitesBackbone.forEach(element => {
              this.sitesBackbone[element.id] = element;
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getAllDevicesBackbone() {
      this.axios
        .post(this.$formatUrl("/adminarea/deviceBackbone/getall"), {})
        .then(response => {
          if (response.data.status === "OK") {
            this.devicesBackbone = response.data.devicesBackbone;
            this.totalRows = this.devicesBackbone.length;
            this.makeToast(response.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getDeviceData() {
      this.selectedDeviceBackbone = this.$store.state.device;
      this.parseDeviceObjData();
    },
    parseDeviceObjData() {
      if (this.selectedDeviceBackbone.objData)
        for (const sectionName in this.selectedDeviceBackbone.objData) {
          if (
            typeof this.selectedDeviceBackbone.objData[sectionName] === "object"
          ) {
            this.objDataSection[
              sectionName
            ] = this.selectedDeviceBackbone.objData[sectionName];
          } else
            this.objDataPrimitives[
              sectionName
            ] = this.selectedDeviceBackbone.objData[sectionName];
        }
    },
    newDevice() {
      this.axios
        .post(this.$formatUrl("/adminarea/deviceBackbone/insert"), {
          deviceBackbone: this.selectedDeviceBackbone
        })
        .then(response => {
          if (response.data.status === "OK") {
            this.selectedDeviceBackbone = response.data.deviceBackbone;
            this.$store.commit(
              "changeDeviceBackbone",
              this.selectedDeviceBackbone
            );
            this.devicesBackbone = [this.selectedDeviceBackbone];
            this.makeToast(response.data.msg);
          } else this.makeToast(response.data.msg, "danger");
        })
        .catch(error => {
          console.log(error);
        });
    },
    openDevice(dev) {
      this.selectedDeviceBackbone = dev;
      this.$store.commit("changeDeviceBackbone", this.selectedDeviceBackbone);
      this.getSnmpParameters(dev);
    },
    saveDevice() {
      this.axios
        .post(this.$formatUrl("/adminarea/deviceBackbone/update"), {
          deviceBackbone: this.selectedDeviceBackbone
        })
        .then(response => {
          if (response.data.status === "OK") {
            this.selectedDeviceBackbone = response.data.deviceBackbone;
            this.$store.commit(
              "changeDeviceBackbone",
              this.selectedDeviceBackbone
            );
            this.makeToast(response.data.msg);
            this.getAllDevicesBackbone();
          } else this.makeToast(response.data.msg, "danger");
        })
        .catch(error => {
          console.log(error);
        });
    },
    deleteDevice(dev) {
      const isConfirmed = confirm("Confermi la cancellazione?");
      if (isConfirmed) {
        this.axios
          .post(this.$formatUrl("/adminarea/deviceBackbone/delete"), {
            deviceBackbone: dev
          })
          .then(response => {
            if (response.data.status === "OK") {
              this.selectedDeviceBackbone = response.data.deviceBackbone;
              this.$store.commit(
                "changeDeviceBackbone",
                this.selectedDeviceBackbone
              );
              this.makeToast(response.data.msg);
              this.getAllDevicesBackbone();
            } else this.makeToast(response.data.msg, "danger");
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    makeToast(string, type = "info", append = false) {
      this.$bvToast.toast(string, {
        title: "info",
        autoHideDelay: 2000,
        solid: true,
        variant: "info",
        toaster: "b-toaster-bottom-full"
      });
    },
    classRowTableDevices(dev) {
      if (dev && dev.state) {
        return dev.state;
      }
      return "";
    }
  }
};
</script>

<style>
.active {
  background-color: rgb(168, 243, 168);
}

.suspended {
  background-color: rgb(177, 171, 171);
}

.monitored {
  background-color: rgb(255, 115, 0);
}

.normal {
  background-color: rgb(0, 217, 255);
}
</style>