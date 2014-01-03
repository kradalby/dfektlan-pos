'use strict';

/* Controllers */

var posControllers = angular.module('posControllers', []);


/* Proper remove function for arrays */
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

Array.prototype.clear = function() {
  while (this.length > 0) {
    this.pop();
  }
};

posControllers.controller('mainController', ['$scope', 'Item', 'Order',
  function($scope, Item, Order, ItemQuantity) {
    $scope.items = Item.query();


    
    /* Methods releated to the cart functionality */
    $scope.cart = new Array();
    $scope.totalSum = 0;

    $scope.addToCart = function(element) {
        $scope.cart.push(element);
        $scope.totalSum = $scope.calculateTotalSum($scope.cart);
    };

    $scope.removeFromCart = function(index) {
        $scope.cart.remove(index);
        $scope.totalSum = $scope.calculateTotalSum($scope.cart);
    };

    $scope.calculateTotalSum = function(cart) {
        var sum = 0;
        for (var i = 0; i < cart.length; i++)
        {
            sum += cart[i].price;
        }
        return sum;
    };

    
    
    /* Methos related to the order functionality */
    $scope.paymentMethod = "";

    $scope.setPaymentMethod = function(method) {
        $scope.paymentMethod = method;
    };

    $scope.generateItemQuantity = function(cart, orderId) {
        var items = {};

        for (var i = 0; i < cart.length; i++) {
            if (!items.hasOwnProperty(cart[i].resource_uri)) {
                items[cart[i].resource_uri] = 1;
            } else {
                items[cart[i].resource_uri] += 1;
            }
        }

        var jsonPost = '{objects: [ ';
        for (var item in items) {
            jsonPost += '{ "item": "' + item + '", "order": "' + orderId + '", "quantity": ' + items[item] + '}, ';
        }
        jsonPost += ']}';


        return jsonPost;

    }

    $scope.submitOrder = function() {
        if ($scope.cart.length == 0)
        {
            alert("Det er ikke valgt noen varer!");
        } else if ($scope.paymentMethod === "")
        {
            alert("Det er ikke valgt noen betalingsmetode!");
        } else 
        {
            var orderId = Order.create('{"paymentMethod":"' + $scope.paymentMethod + '"}');
            console.log(orderId);
            //$scope.setPaymentMethod('');
            //var jsonData = $scope.generateItemQuanitiy($scope.cart, orderId);
            //ItemQuantity.addItems(jsonData);
            //$scope.cart.clear();
        }
    };


  }]);

