'use strict'

// oppretter applikasjonen, og injecter ng og ngRoute.
var posApp  = angular.module("posApp", [
    'ngRoute',
    'ng', 
    'posControllers',
    'posServices'
]);

// setter opp routes til applikasjonen. controller er optional
posApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: "pages/main.html",
            controller: "mainController"
        }).
//        when('/stats', {
//            templateUrl: "/pages/stats.html",
//            controller: 'statsController'
//        }).
        otherwise({
            redirectTo: '/'
        });
    }]);
