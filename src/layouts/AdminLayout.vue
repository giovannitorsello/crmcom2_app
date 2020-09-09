<template>
  <q-layout view="hHh lpR lFf">
    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title>CrmCom2 (Amministratore)</q-toolbar-title>
      </q-toolbar>
    </q-header>

   <q-drawer v-model="left" side="left" overlay behavior="mobile" bordered>
      <LeftMenu/>      
    </q-drawer>


 <!--q-list bordered separator>
        <q-item clickable v-ripple to="/AdminDashboard">
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
      </q-list-->
    <q-page-container>
          <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import LeftMenu from "../components/LeftMenu.vue"

export default {
  data() {
    return {
      left: false
    };
  },
  created() {
    this.$router.push("/AdminDashboard");
  },
  components: {
    LeftMenu
  }
};
</script>