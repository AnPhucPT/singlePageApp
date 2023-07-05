import controller from './controllers/controller.js';
import service from './services/service.js';
const app = angular.module('app', ['ngRoute']);

// set up controller
for (const key in controller) {
    controller[key](app);
}

// setup service
for (const key in service) {
    service[key](app);
}

app.run(function ($rootScope, $http) {
    $http
        .get('http://localhost:8080/api/public/categories/exist')
        .then((res) => {
            $rootScope.categories = res.data;
        });

    $rootScope.initModal = (selector, options) => {
        const $targetEl = document.querySelector(selector);
        const modal = new Modal($targetEl, {
            ...defaultOptions,
            ...options,
        });
        return modal;
    };
});

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/pages/home.html',
            controller: 'homeController',
        })
        .when('/shop', {
            templateUrl: '/pages/shop.html',
            controller: 'shopController',
        })
        .when('/login', {
            templateUrl: '/pages/login.html',
            controller: 'loginController',
        })
        .when('/cart', {
            templateUrl: '/pages/cart.html',
            controller: 'cartController',
        })
        .otherwise({
            templateUrl: 'views/notFound.html',
        });
});

const defaultOptions = {
    placement: 'bottom-right',
    backdrop: 'dynamic',
    backdropClasses:
        'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
    closable: true,
};
export default app;
