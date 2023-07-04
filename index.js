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
            controller: 'LoginController',
        })
        .otherwise({
            templateUrl: 'views/notFound.html',
        });
});
export default app;
