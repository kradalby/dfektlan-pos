'use strict'

// oppretter applikasjonen, og injecter ng og ngRoute.
var posApp  = angular.module("posApp", [
    'ngRoute',
    'ng', 
    'posControllers',
    'posServices'
]);

  /* CORS... */
  /* http://stackoverflow.com/questions/17289195/angularjs-post-data-to-external-rest-api */
posApp.config(function($httpProvider) {
    //Enable cross domain calls
    //$httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $httpProvider.defaults.headers.patch = {
        'Content-Type': 'application/json;charset=utf-8'
    };
    $httpProvider.defaults.headers.post = {
        "Content-Type": "application/json;charset=utf-8"
    };

    //Remove the header containing XMLHttpRequest used to identify ajax call 
    //that would prevent CORS from working
});

// setter opp routes til applikasjonen. controller er optional
posApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: "partials/main.html",
            controller: "mainController"
        }).
        when('/stats', {
            templateUrl: "partials/stats.html",
            controller: 'statsController'
        }).
        otherwise({
            redirectTo: '/'
        });
    }]);

