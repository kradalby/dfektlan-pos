'use strict';

/* Services */

var posServices = angular.module('posServices', ['ngResource']);
var APIURL = "http://beta.dfektlan.no/pos/api/v1/";
var APIUSER = "kradalby";
var APIKEY = "daa3d71d9fae3cf16e627f19ad091a73c5586e37";

posServices.factory('Item', ['$resource',
  function($resource){
    return $resource(APIURL + 'item/?username=' + APIUSER + '&api_key=' + APIKEY + '&format=json', {}, {
      query: {method:'GET', isArray:true}
    });
  }]);

