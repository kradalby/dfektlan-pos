'use strict';

/* Controllers */

var posControllers = angular.module('posControllers', []);

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

posControllers.controller('mainController', ['$scope', 'Item',
  function($scope, Item) {
    $scope.world = 'Online';
    $scope.items = Item.query();
    $scope.cart = new Array();
    $scope.addToCart = function(element) {
        $scope.cart.push(element);
    };
    $scope.removeFromCart = function(index) {
        $scope.cart.remove(index);
    };
  }]);

