import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$axios = axios
const host="10.10.10.119"
const port="18088"
const axiosInstance = axios.create({baseURL: 'http://'+host+':'+port});

export default ({ Vue }) => {
    Vue.prototype.$axios = axiosInstance;
}

export { axiosInstance }