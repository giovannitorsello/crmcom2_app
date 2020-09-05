<template>
  <div id="siteBackbone">
    <b-container fluid>
      <b-row>
        <b-col>
          <d3-network
            :net-nodes="nodesSiteBackbone"
            :net-links="linksSiteBackbone"
            :options="optionsD3Component"
            :selection="selectionsD3Component"
            @node-click="onSiteClick"
          />
        </b-col>

        <!-- Search table -->
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
              <b-form-input v-model="filter" type="search" id="filterInput" placeholder="Ricerca"></b-form-input>
              <b-input-group-append>
                <b-button :disabled="!filter" @click="filter = ''">Cancella</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>

          <b-form-group
            label="Siti per pagina"
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
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="fill"
            size="sm"
            class="my-0"
          ></b-pagination>
          <!-- Main table element -->
          <b-table
            show-empty
            small
            stacked="md"
            :items="sitesBackbone"
            :fields="fields"
            :current-page="currentPage"
            :per-page="perPage"
            :filter="filter"
            :filterIncludedFields="filterOn"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :sort-direction="sortDirection"
            @filtered="onFiltered"
          >
            <template v-slot:cell(actions)="row">
              <img
                src="/img/actions/open.png"
                alt="apri"
                style="width: 32px; height: 32px;"
                v-on:click="openSiteBackbone(row.item)"
              />

              <img
                v-if="selectedSiteBackbone.id"
                src="/img/actions/link.png"
                alt="connetti"
                style="width: 32px; height: 32px; xfill: gray;"
                v-on:click="connectSiteBackbone(row.item)"
              />

              <img
                src="/img/actions/delete.png"
                alt="elimina"
                style="width: 32px; height: 32px; xfill: gray;"
                v-on:click="deleteSiteBackbone(row.item)"
              />
            </template>
          </b-table>

          <div class="row">
            <div class="col">
              <div class="p-2">
                <div class="text-center">
                  <h1 class="h4 text-gray-700 mb-4">
                    Parametri sito
                    <b>{{ selectedSiteBackbone.description }}</b>
                  </h1>
                </div>

                <b-button-toolbar
                  key-nav
                  aria-label="Customers toolbar"
                  style="backgroud-color: transparent;"
                >
                  <b-button v-on:click="newSiteBackbone()" class="btn-primary" style="border: none">
                    <img
                      src="/img/actions/new.png"
                      alt="crea nuovo"
                      style="width: 64px; height: 64px;"
                    />
                  </b-button>
                  <b-button
                    v-on:click="saveSiteBackbone()"
                    class="btn-primary"
                    style="border: none"
                  >
                    <img src="/img/actions/save.png" alt="salva" style="width: 64px; height: 64px;" />
                  </b-button>
                </b-button-toolbar>
                <form id="formObj">
                  <div class="form-group row">
                    <div class="col">
                      <div class="input-group-prepend">
                        <span class="input-group-text">Descrizione sito</span>
                      </div>
                      <input
                        id="description"
                        name="description"
                        v-model="selectedSiteBackbone.description"
                        placeholder="descrizione"
                        type="text"
                        class="form-control form-control-user"
                        title="descrizione"
                      />
                    </div>
                    <div class="col">
                      <div class="input-group-prepend">
                        <span class="input-group-text">Indirizzo</span>
                      </div>
                      <input
                        id="address"
                        name="address"
                        v-model="selectedSiteBackbone.address"
                        placeholder="Via/Piazza, CAP, Comune, Provincia"
                        type="text"
                        class="form-control form-control-user"
                        title="Indirizzo completo"
                      />
                    </div>
                  </div>

                  <div class="form-group row">
                    <div class="col">
                      <div class="input-group-prepend">
                        <span class="input-group-text">Latitudine</span>
                      </div>
                      <input
                        id="latitude"
                        name="latitude"
                        v-model="selectedSiteBackbone.latitude"
                        placeholder="latitude  (GG.decimal)"
                        type="text"
                        class="form-control form-control-user"
                        title="latitudine"
                      />
                    </div>
                    <div class="col">
                      <div class="input-group-prepend">
                        <span class="input-group-text">Longitudine</span>
                      </div>
                      <input
                        id="longitude"
                        name="longitude"
                        v-model="selectedSiteBackbone.longitude"
                        placeholder="longitudine (GG.decimal)"
                        type="text"
                        class="form-control form-control-user"
                        title="longitudine"
                      />
                    </div>
                  </div>

                  <div class="form-group row">
                    <div class="col">
                      <div class="input-group-prepend">
                        <span class="input-group-text">Note sul sito</span>
                      </div>
                      <textarea
                        id="note"
                        name="note"
                        v-model="selectedSiteBackbone.note"
                        rows="5"
                        cols="100"
                        placeholder="Note"
                        type="textarea"
                        class="form-control form-control-user"
                        aria-multiline="true"
                        title="note sito"
                      />
                    </div>
                  </div>
                </form>
                <hr class="separator" />
                <div v-if="isConnected">
                  <h1 class="h5 text-gray-900 mb-4">Siti connessi</h1>
                  <div
                    class="row"
                    v-for="site in selectedSiteBackbone.objData.connectedSites"
                    v-bind:key="site.id"
                  >
                    <div class="col">
                      <span>{{ site.description }}</span>
                    </div>
                    <div class="col">
                      <img
                        src="/img/actions/open.png"
                        alt="apri"
                        style="width: 32px; height: 32px;"
                        v-on:click="openSiteBackbone(site)"
                      />
                      <img
                        src="/img/actions/delete.png"
                        alt="elimina"
                        style="width: 32px; height: 32px; xfill: gray;"
                        v-on:click="disconnectSiteBackbone(site)"
                      />
                    </div>
                  </div>
                  <!--div id="siteiceParametersSections" v-if="selectedSiteBackbone.objData">
                          <div
                            v-for="(section, sectionName, indexSection) in objDataSection"
                            v-bind:key="indexSection"
                          >
                            <h1 class="h5 text-gray-900 mb-4">
                              <p align="left">{{ sectionName}}</p>
                            </h1>
                            <div class="row">
                              <div
                                v-for="(siteProperty,sitePropertyName, indexProperty) in section"
                                v-bind:key="indexProperty"
                              >
                                <div class="col">
                                  <label
                                    v-bind:for="sitePropertyName"
                                    class="form-control form-control-user"
                                  >{{sitePropertyName}}</label>
                                  <input
                                    class="form-control form-control-user"
                                    v-bind:id="sitePropertyName"
                                    v-model="selectedSiteBackbone.objData[sectionName][sitePropertyName]"
                                  />
                                </div>
                              </div>
                            </div>
                            <hr class="separator" />
                          </div>
                  </div-->
                </div>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>

    <!-- Site form -->
    <b-row></b-row>
  </div>
</template>

<script>
import D3Network from "vue-d3-network";

export default {
  components: {
    D3Network
  },
  data() {
    return {
      selectionsD3Component: { nodes: [], links: [] },
      optionsD3Component: {
        force: 3000,
        size: { w: 800, h: 1000 },
        nodeSize: 30,
        linkWidth: 4,
        fontSize: 12,
        nodeLabels: true,
        linkLabels: false,
        canvas: false
      },
      nodesSiteBackbone: [],
      linksSiteBackbone: [],
      selectedSiteBackbone: {},
      sitesBackbone: [],
      linksBackbone: {},
      objDataSection: {},
      objDataPrimitives: {},
      fields: [
        { key: "actions", label: "Azioni" },
        {
          key: "description",
          label: "Descrizione",
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "address",
          label: "Indirizzo",
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "longitude",
          label: "longitudine",
          sortable: true
        },
        {
          key: "latitude",
          label: "Latitudine",
          sortable: true
        },
        {
          key: "note",
          label: "Note",
          sortable: true
        }
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [5, 10, 50, 100],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterOn: [],
      infoModal: {
        id: "info-modal",
        title: "",
        content: ""
      }
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
    isConnected() {
      if (
        this.selectedSiteBackbone.objData &&
        this.selectedSiteBackbone.objData.connectedSites &&
        this.selectedSiteBackbone.objData.connectedSites.length > 0
      )
        return true;
      else return false;
    }
  },
  mounted() {
    this.getSiteBackboneData();
    this.getAllSitesBackbone();
    this.totalRows = this.sitesBackbone.length;
  },
  methods: {
    initD3Component() {
      this.nodesSiteBackbone = [];
      this.linksSiteBackbone = [];
      this.selectionsD3Component = { nodes: [], links: [] };
      if (this.sitesBackbone) {
        this.sitesBackbone.forEach(source => {
          let colorNode = "blue";
          if (source.id === this.selectedSiteBackbone.id) colorNode = "orange";
          this.nodesSiteBackbone.push({
            id: source.id,
            name: source.description,
            _color: colorNode
          });
          if (source.objData && source.objData.connectedSites) {
            const connSites = source.objData.connectedSites;
            if (connSites)
              connSites.forEach(dest => {
                let colorLink = "blue";
                if (
                  source.id === this.selectedSiteBackbone.id ||
                  dest.id === this.selectedSiteBackbone.id
                )
                  colorLink = "orange";
                this.linksSiteBackbone.push({
                  sid: source.id,
                  tid: dest.id,
                  _color: colorLink
                });
              });
          }
        });
      }
    },
    onSiteClick(event,site){      
      this.sitesBackbone.forEach(element => {
        if(element.id===site.id) this.openSiteBackbone(element);
      });
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    getAllSitesBackbone: function() {
      this.axios
        .post(this.$formatUrl("/adminarea/siteBackbone/getall"), {})
        .then(response => {
          if (response.data.status === "OK") {
            this.sitesBackbone = response.data.sitesBackbone;
            this.totalRows = this.sitesBackbone.length;
            this.makeToast(response.data.msg);
            this.initD3Component();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getSiteBackboneData: function() {
      this.selectedSiteBackbone = this.$store.state.siteBackbone;
      console.log("Selected site backbone");
      console.log(this.selectedSiteBackbone);
      //this.parseSiteBackboneObjData();
    },
    parseSiteBackboneObjData: function() {
      if (this.selectedSiteBackbone.objData)
        for (const sectionName in this.selectedSiteBackbone.objData) {
          if (
            typeof this.selectedSiteBackbone.objData[sectionName] === "object"
          ) {
            this.objDataSection[
              sectionName
            ] = this.selectedSiteBackbone.objData[sectionName];
          } else
            this.objDataPrimitives[
              sectionName
            ] = this.selectedSiteBackbone.objData[sectionName];
        }
    },
    disconnectSiteBackbone(site) {
      if (site && this.selectedSiteBackbone) {
        this.selectedSiteBackbone.objData.connectedSites.forEach(
          (element, index, array) => {
            if (element.id === site.id) {
              console.log(this.selectedSiteBackbone);
              this.selectedSiteBackbone.objData.connectedSites.splice(index, 1);
              this.$store.commit(
                "changeSiteBackbone",
                this.selectedSiteBackbone
              );
              this.saveSiteBackbone();
            }
          }
        );
      }
    },
    connectSiteBackbone(site) {
      if (this.selectedSiteBackbone && site) {
        if (!this.selectedSiteBackbone.objData)
          this.selectedSiteBackbone.objData = {};
        if (!this.selectedSiteBackbone.objData.connectedSites)
          this.selectedSiteBackbone.objData.connectedSites = [];
        if (this.selectedSiteBackbone.objData.connectedSites.length === 0) {
          this.selectedSiteBackbone.objData.connectedSites.push(site);
          this.saveSiteBackbone();
        } else {
          const bExist = this.selectedSiteBackbone.objData.connectedSites.some(
            elem => {
              elem.id === site.id;
            }
          );
          if (!bExist) {
            this.selectedSiteBackbone.objData.connectedSites.push(site);
            this.saveSiteBackbone();
          }
        }
      }
    },
    openSiteBackbone(site) {
      this.selectedSiteBackbone = site;
      this.$store.commit("changeSiteBackbone", this.selectedSiteBackbone);
      this.makeToast("Sito aperto per la modifica");
      this.initD3Component();
    },
    newSiteBackbone() {
      this.axios
        .post(this.$formatUrl("/adminarea/siteBackbone/insert"), {
          siteBackbone: this.selectedSiteBackbone
        })
        .then(response => {
          if (response.data.status === "OK") {
            this.selectedSiteBackbone = response.data.siteBackbone;
            this.$store.commit("changeSiteBackbone", this.selectedSiteBackbone);
            this.makeToast(response.data.msg);
            this.sitesBackbone = [this.selectedSiteBackbone];
          } else this.makeToast(response.data.msg, "danger");
        })
        .catch(error => {
          console.log(error);
        });
    },
    saveSiteBackbone: function() {
      this.axios
        .post(this.$formatUrl("/adminarea/siteBackbone/update"), {
          siteBackbone: this.selectedSiteBackbone
        })
        .then(response => {
          if (response.data.status === "OK") {
            this.selectedSiteBackbone = response.data.siteBackbone;
            this.$store.commit("changeSiteBackbone", this.selectedSiteBackbone);
            this.getAllSitesBackbone();
            this.makeToast(response.data.msg);
          } else this.makeToast(response.data.msg, "danger");
        })
        .catch(error => {
          console.log(error);
        });
    },
    deleteSiteBackbone: function(site) {
      const isConfirmed = confirm("Confermi la cancellazione?");
      if (isConfirmed) {
        this.axios
          .post(this.$formatUrl("/adminarea/siteBackbone/delete"), {
            siteBackbone: site
          })
          .then(response => {
            if (response.data.status === "OK") {
              this.selectedSiteBackbone = response.data.siteBackbone;
              this.$store.commit(
                "changeSiteBackbone",
                this.selectedSiteBackbone
              );
              this.makeToast(response.data.msg);
              this.getAllSitesBackbone();
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
        variant: type,
        toaster: "b-toaster-bottom-full"
      });
    }
  }
};
</script>

<style src="vue-d3-network/dist/vue-d3-network.css" scoped></style>