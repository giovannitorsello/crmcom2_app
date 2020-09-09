<template>
  <q-layout view="hHh lpR lFf">
    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title>CrmCom2 (Ufficio)</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="left" side="left" overlay behavior="mobile" bordered>
      <q-list bordered>
        <q-item clickable v-ripple to="/AdminHome">
          <q-item-section>Home</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/ViewData">
          <q-item-section>Ricerce</q-item-section>
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
          <q-item-section>Monitor Dispositivi Backbone</q-item-section>
        </q-item>
      </q-list>

      <q-btn flat color="primary" label="Logout" @click="logout" />
    </q-drawer>

    <q-page-container>
      <q-page padding>
        <router-view />
      </q-page>
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