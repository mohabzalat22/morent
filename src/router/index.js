import { createRouter, createWebHistory  } from 'vue-router'; 
import HomePage from '../pages/HomePage.vue';
import CategoryPage from '../pages/CategoryPage.vue';
import DetailPage from '../pages/DetailPage.vue';
import PaymentPage from '../pages/PaymentPage.vue';
import LoginPage from '../pages/LoginPage.vue';
import RegisterPage from '../pages/RegisterPage.vue';
import ProfilePage from '../pages/ProfilePage.vue';




// nested routes
import BillinginfoView from '@/components/payment/BillinginfoView.vue';
import RentalinfoView from '@/components/payment/RentalinfoView.vue';
import PaymentMethodView from '@/components/payment/PaymentMethodView.vue';
import ConfirmationView from '@/components/payment/ConfirmationView.vue';
import NavbarView from '@/components/NavbarView.vue';
import FooterView from '@/components/FooterView.vue';
import { ref } from 'vue';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withXSRFToken = true;
axios.defaults.withCredentials = true;

const routes = [
    {
        path: '/login',
        name: LoginPage,
        component: LoginPage,
    },
    {
        path: '/register',
        name: RegisterPage,
        component: RegisterPage,
    },
    {
        path: '/profile',
        name: ProfilePage,
        component: ProfilePage,
    },
    {
        path: '/',
        name: HomePage,
        components: 
        {
            default: HomePage,
            NavbarView,
            FooterView
        },
    },
    {
        path: '/category',
        name: CategoryPage,
        components: {
            default: CategoryPage,
            NavbarView,
            FooterView
        },
    },
    {
        path: '/detail/:id',
        name: DetailPage,
        components: {
            default: DetailPage,
            NavbarView,
            FooterView
        },
    },
    {
        path: '/payment/:id',
        name: PaymentPage,
        components: {
            default: PaymentPage,
            NavbarView,
            FooterView
        },
        children:[
            { 
                path: '',
                component: BillinginfoView,
                alias:['step/1']
            },
            { 
                path: 'step/2',
                component: RentalinfoView
            },
            { 
                path: 'step/3',
                component: PaymentMethodView
            },
            { 
                path: 'step/4',
                component: ConfirmationView
            }
        ]
    },
];
const Auth = async (to, next)=>{
    const user = await axios.get('/api/user', {  
        validateStatus: function (status) {
        // Allow all status codes
            if(status == 200 || status == 401){
                return true;
            }
        }
    });

    console.log({'usercheck': user.data});

    if(user.status == 401){
        localStorage.setItem('auth',false);
    }
    else{
        localStorage.setItem('auth',true);
    }

    const isAuthenticated = localStorage.getItem('auth').toLowerCase() == 'true';

    console.log({'auth': isAuthenticated , 'status': user.status});
    
    console.log(isAuthenticated)
    
    if (!['/login', '/register'].includes(to.path) && !isAuthenticated)
    {
        next('/login');
    }
    else {
        next();
    }

}
const router = createRouter({
    history: createWebHistory (),
    routes
  });

//   Navigation guards

router.beforeEach((to, from, next) => {
    Auth(to, next);
});

export default router