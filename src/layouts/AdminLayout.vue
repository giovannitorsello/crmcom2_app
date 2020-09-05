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
      <q-btn flat color="primary" label="Logout" @click="logout" />
      <q-btn flat color="primary" label="Monitor Customer Devices" @click="monitorDevicesCustomer" />
      <q-btn flat color="primary" label="Monitor Backbone Devices" @click="monitorDevicesBackbone" />
    </q-drawer>

    <q-page-container>
          <router-view />
    </q-page-container>

    <q-footer reveal elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg" />
          </q-avatar>CrmCom2
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
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