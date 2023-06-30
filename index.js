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

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/views/site/home.html',
            controller: 'homeController',
        })
        .otherwise({
            templateUrl: 'views/notFound.html',
        });
});

export default app;
