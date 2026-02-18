/**
 * Vue Router Configuration for SIPM Standards
 */

export const routes = [
  {
    path: '/',
    name: 'standards',
    component: () => import('@/views/StandardsView.vue'),
    children: [
      {
        path: '',
        name: 'standards-index',
        redirect: '/foundation'
      },
      {
        path: 'foundation',
        name: 'foundation',
        component: () => import('@/views/standards/FoundationView.vue')
      },
      {
        path: 'quality',
        name: 'quality',
        component: () => import('@/views/standards/QualityView.vue')
      },
      {
        path: 'science',
        name: 'science',
        component: () => import('@/views/standards/ScienceView.vue')
      },
      {
        path: 'governance',
        name: 'governance',
        component: () => import('@/views/standards/GovernanceView.vue')
      }
    ]
  },

  // Individual standard pages
  {
    path: '/:id',
    name: 'standard-view',
    component: () => import('@/views/standards/StandardView.vue')
  },

  // 404
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue')
  }
]

export default routes
