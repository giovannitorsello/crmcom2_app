
const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') },
      { path: '/Login', component: () => import('pages/Login.vue') },      
    ],
  },
  {  
    path: '/AdminHome',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      { path: '/AdminHome', component: () => import('pages/AdminHome.vue') },            
    ]
  },
  {  
    path: '/Customer',
    component: () => import('layouts/CustomerLayout.vue'),
    children: [      
      { path: '/Customer', component: () => import('pages/Customer.vue') }, 
      { path: '/Contract', component: () => import('pages/Contract.vue') },
      { path: '/ServiceContract', component: () => import('pages/ServiceContract.vue') },
      { path: '/DeviceCustomer', component: () => import('pages/DeviceCustomer.vue') },
      { path: '/MonitorDevicesCustomer', component: () => import('pages/MonitorDeviceCustomer.vue') },
      { path: '/MonitorDevicesBackbone', component: () => import('pages/MonitorDeviceBackbone.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
