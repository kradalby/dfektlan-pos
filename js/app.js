'use strict'

// oppretter applikasjonen, og injecter ng og ngRoute.
var app = angular.module("AngularKurs", ['ng', 'ngRoute']);

// setter opp routes til applikasjonen. controller er optional
app.config(function($routeProvider) {

    $routeProvider.when('/', {
        templateUrl: "pages/home.html",
        controller: "homeController"
    }).when('/login', {
        templateUrl: "/pages/login.html",
        controller: 'loginController'
    }).otherwise({
        redirectTo: '/'
    });
});
