import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$axios = axios
const host="crmcom2.wifinetcom.net"
//const host="localhost"
const port="18088"
const axiosInstance = axios.create({baseURL: 'http://'+host+':'+port});

export default ({ Vue }) => {
    Vue.prototype.$axios = axiosInstance;
}

export { axiosInstance }