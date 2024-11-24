import { createRouter, createWebHistory } from 'vue-router'
import HomeVue from '@/pages/Home.vue'
import DashboardVue from '@/pages/Dashboard.vue'
import LoginVue from '@/pages/Login.vue'
import MarketPlaceVue from '@/pages/MarketPlace.vue'
import ForumVue from '@/pages/Forum.vue'
import EducationHubVue from '@/pages/EducationHub.vue'
import MyPurchases from '@/pages/MyPurchases.vue'
import PaymentSuccessVue from '@/pages/PaymentSuccess.vue'
import DashboardHomeVue from '@/pages/DashboardHome.vue'
import RegisterVue from '@/pages/Register.vue'
import Precisionfarming from '@/pages/PrecisionFarming.vue'
import DiscussionVue from '@/pages/Discussion.vue'
import ProductVue from '@/pages/Product.vue'
import ForecastVue from '@/pages/Forecast.vue'
import CourseVue from '@/pages/Course.vue'
import NewDiscussionsVue from '@/pages/NewDiscussion.vue'
import ProductFilterVue from '@/pages/ProductFilter.vue'
import CoursesFilterVue from '@/pages/CoursesFilter.vue'
import FarmerReportVue from '@/pages/FarmerReport.vue'
import PreferencesVue from '@/pages/Preferences.vue'
import AdminDashboardVue from '@/pages/Admin/AdminDashboard.vue'
import AdminDashboardHome from '@/pages/Admin/AdminDashboardHome.vue'
import Resource from '@/pages/Admin/Resource.vue'
import AdminLogin from '@/pages/Admin/Login.vue'
import ResourceDetail from '@/pages/Admin/ResourceDetails.vue'
import { Resources } from '../data/Resources'
import ResourceRender from '@/pages/Admin/ResourceRenderer.vue'
import Chat from '../pages/chat.vue'
import UpdateProfile from '../pages/UpdateProfile.vue'

const routes = [
    {
        path: '/',
        component: HomeVue
    },
    {
        path: '/dashboard/admin',
        component: AdminDashboardVue,
        children: [
            {
                path: '',
                name: 'dashboardDefault',
                component: AdminDashboardHome
            },
            // Dynamically generate routes for resources
            ...Resources.map(resource => ({

                path: `/dashboard/admin/${resource.name}`,
                name: resource.name,
                component: ResourceRender,
                props: route => ({
                    resource,
                    currentPage: parseInt(route.query.page) || 1,
                    itemsPerPage: parseInt(route.query.limit) || 5,
                    searchQuery: route.query.search || "",
                    sortBy: route.query.sortBy || "",
                    sortOrder: route.query.order || "asc",
                }),

            })),
            // Resource Detail Route
            ...Resources.map(resource => ({
                path: `/dashboard/admin/:resourceName/:id/:mode`,
                name: `${resource.name}Detail`,
                component: ResourceDetail
            }))

        ]

    },
    {
        path: '/dashboard/farmer',
        component: DashboardVue,
        children: [
            {
                path: '',
                component: DashboardHomeVue
            },
            {
                path: 'marketplace',
                component: MarketPlaceVue
            },
            {
                path: 'filtered-farm-inputs',
                name: 'FilteredFarmInputs',
                component: ProductFilterVue,
                props: (route) => ({ searchQuery: route.query.q }),
            },
            {
                path: 'filtered-courses',
                name: 'FilteredCourses',
                component: CoursesFilterVue,
                props: (route) => ({ searchQuery: route.query.q }),
            },
            {
                path: 'forecast',
                component: ForecastVue
            },
            {
                path: 'purchases',
                component: MyPurchases
            },
            {
                path: 'marketplace/:id',
                component: ProductVue
            },
            {
                path: 'precisionfarming',
                component: Precisionfarming
            },
            {
                path: 'preferences',
                component: PreferencesVue
            },
            {
                path: 'reports',
                component: FarmerReportVue
            },
            {
                path: 'forum',
                component: ForumVue
            },
            {
                path: 'forum/:id',
                component: DiscussionVue
            },
            {
                path: 'educationhub',
                component: EducationHubVue
            },
            {
                path: 'educationhub/:id',
                component: CourseVue
            },
            {
                path: 'forum/new-discussion',
                component: NewDiscussionsVue
            },
            {
                path:'chat',
                component:Chat
            },
            {
                path:'profile',
                component: UpdateProfile
            }
        ]
    },
    {
        path: '/payment-success',
        component: PaymentSuccessVue
    },
    {
        path: '/login',
        component: LoginVue
    },
    {
        path: '/login/admin',
        component: AdminLogin
    },
    {
        path: '/register',
        component: RegisterVue
    }


]


const router = createRouter({
    history: createWebHistory(),
    routes: routes,
    scrollBehavior: () => ({ top: 0 }),
    transition: {
      name: 'fade',
      mode: 'out-in',
      css: {
        transform: 'rotateY(360deg) rotateX(180deg) rotateZ(360deg) translate3d(0, 0, 0) scale(2)',
        transition: 'all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    }
    
    }
})

export default router
