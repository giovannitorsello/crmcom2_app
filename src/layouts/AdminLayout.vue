<template>
  <q-layout view="hHh lpR lFf">
    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title>
          <q-avatar>           
          </q-avatar>CrmCom2
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="left" side="left" overlay behavior="mobile" bordered>
      
      <q-list bordered separator>
        <q-item clickable v-ripple to="/AdminHome">
          <q-item-section>Home</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/ViewData">
          <q-item-section>Ricerce</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/ServiceTemplate">
          <q-item-section>Modelli di Servizio</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/User">
          <q-item-section>Utenti</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/SiteBackbone">
          <q-item-section>Siti</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/DeviceBackbone">
          <q-item-section>Dispositivi del Backbone</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/MonitorDevicesCustomer">
          <q-item-section>Monitor Dispositivi Cliente</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/MonitorDevicesBackbone">
          <q-item-section>MonitorDevicesBackbone</q-item-section>
        </q-item>
      </q-list>
      
      
      <q-btn flat color="primary" label="Logout" @click="logout" />    
    </q-drawer>

    <q-page-container>
          <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      left: false
    };
  },
  methods: {
    users() {
      this.$router.push("/User");
    },
    monitorDevicesBackbone() {
       this.$router.push("/MonitorDevicesBackbone");
    },
    monitorDevicesCustomer() {
       this.$router.push("/MonitorDevicesCustomer");
    },
    logout() {
      const store = this.$store;
      const usr = this.$store.state.user;
      this.$axios
        .post("/adminarea/logout", { user: usr })
        .then(response => {
          store.commit("changeUser", {});
          this.$router.push("/Login");
        })
        .catch(error => {
          store.commit("changeUser", {});
          this.$router.push("/Login");
          console.log(error);
        });
    }
  }
};
</script>