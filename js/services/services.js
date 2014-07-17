'use strict';

/* Services */

var posServices = angular.module('posServices', ['ngResource']);


var tastypieDataTransformer = function ($http) {
    return $http.defaults.transformResponse.concat([
        function (data, headersGetter) {
            var result = data.objects;
//            result.meta = data.meta;
            return result;
        }
    ])
};

var tastypieDataTransformSingle = function ($http) {
    return $http.defaults.transformResponse.concat([
        function (data, headersGetter) {
            var result = data;
            console.log(result.id);
            return result;
        }
    ])
};

posServices.factory('LanEvent', ['$resource', '$http',
  function($resource, $http){
    return $resource(APIURL + 'lanevent/?username=' + APIUSER + '&api_key=' + APIKEY + '&limit=0', {}, {
        query: {
            method:'GET', 
            params:{}, 
            transformResponse: tastypieDataTransformer($http),
            isArray: true
        }
    });
  }
]);

posServices.factory('Item', ['$resource', '$http',
  function($resource, $http){
    return $resource(APIURL + 'item/?username=' + APIUSER + '&api_key=' + APIKEY + '&limit=0', {}, {
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
    return $resource(APIURL + 'order/?username=' + APIUSER + '&api_key=' + APIKEY + '&limit=0', {}, {
        create: {
            method:'POST', 
            params:{}, 
            transformResponse: tastypieDataTransformSingle($http),
            //isArray: true
        },
        query: {
            method:'JSONP', 
            cache: false,
            params:{callback: 'JSON_CALLBACK', format: 'jsonp'}, 
            transformResponse: tastypieDataTransformer($http),
            isArray: true
        }
    });
  }
]);

posServices.factory('ItemQuantity', ['$resource', '$http',
  function($resource, $http){
    return $resource(APIURL + 'itemquantity/?username=' + APIUSER + '&api_key=' + APIKEY + '&limit=0', {}, {
        addItems: {
            method:'PATCH', 
            params:{}, 
            //transformResponse: tastypieDataTransformer($http),
            isArray: true
        }
    });
  }
]);




posServices.factory('CrewMember', ['$resource', '$http',
  function($resource, $http){
    return $resource(APIURL + 'crewmember/:userId/?username=' + APIUSER + '&api_key=' + APIKEY + '&limit=0' + '&format=json', {}, {
        query: {
            method:'GET', 
            params:{}, 
            cache: false,
            transformResponse: tastypieDataTransformer($http),
            isArray: true
        },
        patchUser: {
            method:'PATCH', 
            params:{userId:'@userId'}, 
            //transformResponse: tastypieDataTransformer($http),
            isArray: true
        }
    });
  }
]);


posServices.factory('ItemGroup', ['$resource', '$http',
  function($resource, $http){
    return $resource(APIURL + 'itemgroup/?username=' + APIUSER + '&api_key=' + APIKEY + '&limit=0', {}, {
        query: {
            method:'GET', 
            params:{}, 
            transformResponse: tastypieDataTransformer($http),
            isArray: true
        }
    });
  }
]);
