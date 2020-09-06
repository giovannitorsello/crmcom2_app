<template>
  <div id="deviceBackbone">
    <h6>Gestione dispositivi backbone</h6>
    <h6>Sito selezionato {{selectedSiteBackbone.description}}</h6>
    <q-table
      title="Siti"
      :data="devicesBackbone"
      :columns="columnsTableDevices"
      row-key="id"
      :filter="deviceFilter"
      virtual-scroll
      :pagination="initialPagination"
      :rows-per-page-options="[0]"
      @row-click="openDevice"
      no-data-label="nessun risultato"
      no-results-label="nessun risultato"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="deviceFilter" placeholder="Ricerca">
          <q-icon slot="append" name="search" />
        </q-input>
      </template>

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
              v-on:click="openDevice(props.row)"
              style="width: 32px; height: 32px;"
            />
            <img
              src="/img/actions/delete.png"
              v-on:click="deleteDevice(props.row)"
              style="width: 32px; height: 32px; xfill: gray;"
            />
            <img
              src="/img/actions/eye.svg"
              style="width: 32px; height: 32px;"
              v-on:click="monitorDevice(props.row)"
            />
            <template v-if="(props.row.siteBackboneId===null) && selectedSiteBackbone && selectedSiteBackbone.id">
              <h6>Non associato ad alcun sito</h6>
              <img
                src="/img/actions/plugDevice.png"
                style="width: 32px; height: 32px;"
                v-on:click="plugDeviceinSite(props.row)"
              />
            </template>
            <template v-if="props.row.siteBackboneId!==null">
              <h6>Associato al sito: <strong>{{sitesBackbone[props.row.siteBackboneId].description}}</strong></h6>
              <img
                src="/img/actions/unplugDevice.png"
                style="width: 32px; height: 32px;"
                v-on:click="unplugDeviceinSite(props.row)"
              />
            </template>
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">{{ col.value }}</q-td>
        </q-tr>
      </template>
    </q-table>

    <img src="/img/actions/new.png" @click="newDevice" style="width: 48px; height: 48px;" />
    <img src="/img/actions/save.png" @click="saveDevice" style="width: 48px; height: 48px;" />
    <img src="/img/actions/delete.png" @click="deleteDevice" style="width: 48px; height: 48px;" />
    <img
      src="/img/actions/eye.svg"
      @click="monitorDevice"
      style="width: 48px; height: 48px;"
      v-bind:class="monitorClassBackground"
    />
    <img src="/img/actions/exit.png" @click="exit" style="width: 48px; height: 48px;" />

    <q-form ref="deviceBackboneForm" class="q-gutter-md">
      <div class="row">
        <div class="col">
          <q-input label="Descrizione" v-model="selectedDeviceBackbone.description" />
        </div>
        <div class="col">
          <q-input label="Tipo" v-model="selectedDeviceBackbone.type" />
        </div>
        <div class="col"></div>
        <div class="col">
          <q-input label="Produttore" v-model="selectedDeviceBackbone.vendor" />
        </div>
        <div class="col">
          <q-input label="Modello" v-model="selectedDeviceBackbone.model" />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <q-input label="MAC" v-model="selectedDeviceBackbone.mac" />
        </div>
        <div class="col">
          <q-input label="ipv4" v-model="selectedDeviceBackbone.ipv4" />
        </div>
        <div class="col">
          <q-input label="ipv6" v-model="selectedDeviceBackbone.ipv6" />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <q-input
            label="Note sul dispositivo"
            v-model="selectedDeviceBackbone.note"
            type="textarea"
            rows="5"
            cols="20"
          />
        </div>
      </div>
    </q-form>
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
      deviceFilter: "",
      initialPagination: {
        sortBy: "desc",
        descending: false,
        page: 2,
        rowsPerPage: 5
      },
      columnsTableDevices: [
        { name: "actions", label: "Azioni" },
        {
          name: "description",
          label: "Descrizione",
          field: row => row.description,
          sortable: true
        },
        {
          name: "address",
          label: "Indirizzo",
          field: row => {
            if (row.ipv6) return row.ipv6;
            else return row.ipv4;
          },
          sortable: true
        },
        {
          name: "type",
          label: "Tipo",
          field: row => row.type,
          sortable: true
        },
        {
          name: "vendor",
          label: "Produttore",
          field: row => row.vendor,
          sortable: true
        },
        {
          name: "model",
          label: "Modello",
          field: row => row.model,
          sortable: true
        },
        {
          name: "mac",
          label: "Mac",
          field: row => row.mac,
          sortable: true
        },
        {
          name: "note",
          label: "Note",
          field: row => row.note,
          sortable: true
        }
      ]
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
    this.selectedSiteBackbone = Object.assign({}, this.$store.state.siteBackbone);
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

    this.$axios
      .post("/adminarea/deviceBackbone/getSnmpParams", {
        ip: device.ipv4,
        oids: oidsReq
      })
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
    monitorDevice(dev) {
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
        this.$store.commit("changeDeviceBackbone", Object.assign({}, this.selectedDeviceBackbone));
        this.saveDevice();
      }
      else
        this.makeToast("Seleziona un sito prima di associare i dispositivi")
    },
    unplugDeviceinSite(dev) {
      if (dev && this.selectedSiteBackbone) {
        this.selectedDeviceBackbone = dev;
        this.selectedDeviceBackbone.siteBackboneId = null;
        this.$store.commit("changeDeviceBackbone", Object.assign({}, this.selectedDeviceBackbone));
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
      this.$axios
        .post("/adminarea/siteBackbone/getall", {})
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
      this.$axios
        .post("/adminarea/deviceBackbone/getall", {})
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
      this.$axios
        .post("/adminarea/deviceBackbone/insert", {
          deviceBackbone: this.selectedDeviceBackbone
        })
        .then(response => {
          if (response.data.status === "OK") {
            this.selectedDeviceBackbone = response.data.deviceBackbone;
            this.$store.commit("changeDeviceBackbone", Object.assign({}, this.selectedDeviceBackbone));
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
      this.$store.commit("changeDeviceBackbone", Object.assign({}, this.selectedDeviceBackbone));
      this.getSnmpParameters(dev);
    },
    saveDevice() {
      this.$axios
        .post("/adminarea/deviceBackbone/update", {
          deviceBackbone: this.selectedDeviceBackbone
        })
        .then(response => {
          if (response.data.status === "OK") {
            this.selectedDeviceBackbone = response.data.deviceBackbone;
            this.$store.commit("changeDeviceBackbone", Object.assign({}, this.selectedDeviceBackbone));
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
        this.$axios
          .post("/adminarea/deviceBackbone/delete", {
            deviceBackbone: dev
          })
          .then(response => {
            if (response.data.status === "OK") {
              this.selectedDeviceBackbone = response.data.deviceBackbone;
              this.$store.commit("changeDeviceBackbone", Object.assign({}, this.selectedDeviceBackbone));
              this.makeToast(response.data.msg);
              this.getAllDevicesBackbone();
            } else this.makeToast(response.data.msg, "danger");
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    makeToast(string) {
      this.$q.notify({
        color: "green-4",
        textColor: "white",
        icon: "info",
        message: string
      });
    },
    exit() {
      this.$router.push("/AdminHome");
    }
  },
  computed: {
    monitorClassBackground(dev) {
      return dev.state;
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