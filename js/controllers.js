'use strict';

/* Controllers */

var posControllers = angular.module('posControllers', []);

posControllers.controller('mainController', ['$scope', 'Item',
  function($scope, Item) {
    //$scope.phones = Phone.query();
    $scope.world = 'Online';
    $scope.items = Item.query();
  }]);

