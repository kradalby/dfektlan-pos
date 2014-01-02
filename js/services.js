'use strict';

/* Services */

var posServices = angular.module('posServices', ['ngResource']);
var APIURL = "http://192.168.1.125:8080/pos/api/v1/";
var APIUSER = "kradalby";
var APIKEY = "daa3d71d9fae3cf16e627f19ad091a73c5586e37";

var tastypieDataTransformer = function ($http) {
    return $http.defaults.transformResponse.concat([
        function (data, headersGetter) {
            var result = data.objects;
            result.meta = data.meta;
            return result;
        }
    ])
};

posServices.factory('Item', ['$resource', '$http',
  function($resource, $http){
    return $resource(APIURL + 'item/?username=' + APIUSER + '&api_key=' + APIKEY + '&format=jsonp' + '&limit=0', {}, {
        query: {
            method:'JSONP', 
            params:{callback: 'JSON_CALLBACK', format: 'jsonp'}, 
            transformResponse: tastypieDataTransformer($http),
            isArray: true
        }
    });
  }
]);

posServices.factory('Order', ['$resource', '$http',
  function($resource, $http){
    return $resource(APIURL + 'order/?username=' + APIUSER + '&api_key=' + APIKEY + '&format=jsonp' + '&limit=0', {}, {
        query: {
            method:'JSONP', 
            params:{callback: 'JSON_CALLBACK', format: 'jsonp'}, 
            transformResponse: tastypieDataTransformer($http),
            isArray: true
        }
    });
  }
]);


posServices.factory('ItemQuantity', ['$resource', '$http',
  function($resource, $http){
    return $resource(APIURL + 'itemquantity/?username=' + APIUSER + '&api_key=' + APIKEY + '&format=jsonp' + '&limit=0', {}, {
        query: {
            method:'JSONP', 
            params:{callback: 'JSON_CALLBACK', format: 'jsonp'}, 
            transformResponse: tastypieDataTransformer($http),
            isArray: true
        }
    });
  }
]);
