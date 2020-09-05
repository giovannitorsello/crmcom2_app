<template>
  <div id="user">
    <div class="card o-hidden border-0 shadow-lg my-5">
      <div class="card-body p-0">
        <!-- Nested Row within Card Body -->
        <div class="row">
          <!--div class="col-lg-5 d-none d-lg-block bg-register-image"></div-->
          <div class="col">
            <div class="p-2">
              <div class="text-center">
                <h1 class="h4 text-gray-900 mb-4">Gestione utenti sistema</h1>
              </div>

              <b-button-toolbar
                key-nav
                aria-label="Userss toolbar"
                style="backgroud-color: transparent;"
              >
                <b-button v-on:click="newUser()" class="btn-primary" style="border: none">
                  <img
                    src="/img/actions/new.png"
                    alt="crea nuovo"
                    style="width: 64px; height: 64px;"
                  />
                </b-button>
                <b-button v-on:click="saveUser()" class="btn-primary" style="border: none">
                  <img src="/img/actions/save.png" alt="salva" style="width: 64px; height: 64px;" />
                </b-button>
                <b-button v-on:click="deleteUser()" class="btn-primary" style="border: none">
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

              <form id="userForm" class="user">
                <div class="form-group row">
                  <div class="col">
                    <input
                      id="firstname"
                      placeholder="nome"
                      v-model="selectedUser.firstname"
                      type="text"
                      class="form-control form-control-user"
                      name="firstname"
                    />
                  </div>
                  <div class="col">
                    <input
                      id="lastname"
                      v-model="selectedUser.lastname"
                      placeholder="cognome"
                      type="text"
                      class="form-control form-control-user"
                      name="lastname"
                    />
                  </div>
                  <div class="col">
                    <input
                      id="codfis"
                      v-model="selectedUser.codfis"
                      placeholder="Codice fiscale"
                      maxlength="16"
                      type="text"
                      class="form-control form-control-user"
                      name="codfis"
                    />
                  </div>
                </div>
                <div class="form-group row">
                  <div class="col">
                    <input
                      id="email"
                      v-model="selectedUser.email"
                      placeholder="Email"
                      type="email"
                      class="form-control form-control-user"
                      name="email"
                    />
                  </div>
                  <div class="col">
                    <input
                      id="mobilephone"
                      v-model="selectedUser.mobilephone"
                      placeholder="telefono mobile"
                      maxlength="10"
                      type="text"
                      class="form-control form-control-user"
                      name="mobilephone"
                    />
                  </div>
                  <div class="col">
                    <input
                      id="address"
                      v-model="selectedUser.address"
                      placeholder="Indirizzo completo"
                      type="text"
                      class="form-control form-control-user"
                      name="address"
                    />
                  </div>
                </div>
                <div class="form-group row">
                  <div class="col">
                    <input
                      id="username"
                      v-model="selectedUser.username"
                      placeholder="Nome Utente"
                      type="text"
                      class="form-control form-control-user"
                      name="username"
                    />
                  </div>
                  <div class="col">
                    <input
                      id="password"
                      v-model="selectedUser.password"
                      placeholder="Password"
                      type="text"
                      class="form-control form-control-user"
                      name="password"
                    />
                  </div>
                  <div class="col">
                    <select
                      id="role"
                      v-model="selectedUser.role"
                      class="form-group form-control-user"
                      style="height: auto;"
                    >
                      <option class="form-control form-control-user" value="admin">Administrator</option>
                      <option class="form-control form-control-user" value="support">
                        Supporto
                        tecnico
                      </option>
                      <option
                        class="form-control form-control-user"
                        value="accounting"
                      >Supporto amministrativo</option>
                    </select>
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
        <h6 class="m-0 font-weight-bold text-primary">Elenco utenti</h6>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table id="tableListUsers" class="table table-bordered" width="100%" cellspacing="0">
            <thead>
              <tr>
                <th>Azioni</th>
                <th>Nome</th>
                <th>Cognome</th>
                <th>Nome Utente</th>
                <th>Telefono</th>
                <th>Email</th>
                <th>Data Creazione</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" v-bind:key="user.id" v-bind:class="user.state">
                <td>
                  <img
                    src="/img/actions/open.png"
                    alt="seleziona"
                    style="width: 32px; height: 32px; fill:greenyellow;"
                    v-on:click="selectUser(user)"
                  />
                  <img
                    src="/img/actions/unlocked.png"
                    alt="attiva"
                    style="width: 32px; height: 32px; xfill:green;"
                    v-on:click="activateUser(user)"
                  />
                  <img
                    src="/img/actions/locked.png"
                    alt="disattiva"
                    style="width: 32px; height: 32px; xfill:red;"
                    v-on:click="suspendUser(user)"
                  />
                  <img
                    src="/img/actions/delete.png"
                    alt="elimina"
                    style="width: 32px; height: 32px; xfill: gray;"
                    v-on:click="deleteUser(user)"
                  />
                </td>
                <td>{{user.firstname}}</td>
                <td>{{user.lastname}}</td>
                <td>{{user.username}}</td>
                <td>{{user.phone}}</td>
                <td>{{user.email}}</td>
                <td>{{user.createdAt}}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th>Azioni</th>
                <th>Nome</th>
                <th>Cognome</th>
                <th>Nome Utente</th>
                <th>Telefono</th>
                <th>Email</th>
                <th>Data Creazione</th>
              </tr>
            </tfoot>
            <tbody></tbody>
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
        selectedUser: {},
        users: {}
      }
    },
  methods: {
    newUser: function() {
        this.selectedUser={};        
    },
    selectUser: function(usr) {
        this.selectedUser=usr;        
    },
    saveUser: function () {
      let relUrl="";
      if((!this.selectedUser.id) || (this.selectedUser.id==="")) relUrl='/adminarea/user/insert'
      else relUrl='/adminarea/user/update'
      this.axios.post(this.$formatUrl(relUrl), {user: this.selectedUser})
          .then(response => {                
                if (response.data.status === "OK") {                  
                    this.selectedUser = response.data.user;                        
                    this.makeToast(response.data.msg);
                    
                    if(relUrl==='/adminarea/user/insert') this.users.push(this.selectedUser);
                }                                     
            })
            .catch(error => {                              
                console.log(error);
            });
    },
    deleteUser: function (usr) {
      const isConfirmed = confirm("Confermi la cancellazione?");
        if(isConfirmed) {
        this.axios.post(this.$formatUrl('/adminarea/user/delete'), {user: usr})
          .then(response => {                
                if (response.data.status === "OK") {
                    this.users.forEach((element, index, array) => {
                      if(element.id===usr.id)  this.users.splice(index,1); 
                    });              

                    this.selectedService = {};                        
                    this.makeToast(response.data.msg);                              
                }                                     
            })
            .catch(error => {                              
                console.log(error);
            });
        }
    },
    getUserData: function() {
        this.selectedUser=this.$store.state.user;      
        console.log("Selected user");
        console.log(this.selectedUser); 
        this.getAllUsers();
    },
    getAllUsers: function() {
        this.axios.post(this.$formatUrl('/adminarea/user/getall'), {})
            .then(response => {                             
                  if (response.data.status === "OK") {                  
                      this.users = response.data.users;                                                
                      this.makeToast(response.data.msg);                       
                  }                                     
              })
              .catch(error => {                              
                  console.log(error);
              });
    },
    activateUser: function(usr) {
      usr.state="active";
      this.axios.post(this.$formatUrl('/adminarea/user/update'), {user: usr})
        .then(response => {                
              if (response.data.status === "OK") {                  
                  this.selectedUser = response.data.user;                      
                  this.makeToast(response.data.msg);                   
              }                                     
          })
          .catch(error => {                              
              console.log(error);
          });
    },
    suspendUser: function(usr) {
      usr.state="suspended";
      this.axios.post(this.$formatUrl('/adminarea/user/update'), {user: usr})
        .then(response => {                
              if (response.data.status === "OK") {                  
                  this.selectedUser = response.data.user;                      
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
    user: 'user',      
    }),
    created() {
      this.getUserData();
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