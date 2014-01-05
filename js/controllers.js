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

function dir(object) {
    var stuff = [];
    for (var s in object) {
        stuff.push(s);
    }
    stuff.sort();
    return stuff;
}


posControllers.controller('mainController', ['$scope', 'Item', 'Order', 'ItemQuantity', 'CrewMember',
  function($scope, Item, Order, ItemQuantity, CrewMember) {
    $scope.items = Item.query();
    $scope.crewMembers = CrewMember.query();

    
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

    
    
    /* Methods related to the order functionality */
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

        var jsonPost = '{"objects": [ ';
        for (var item in items) {
            jsonPost += '{ "item": "' + item + '", "order": "' + orderId + '", "quantity": ' + items[item] + '},';
        }
        jsonPost = jsonPost.substring(0, jsonPost.length - 1);
        jsonPost += ']}';


        return jsonPost;

    }

    $scope.handleCrewOrder = function(crewMembers, sum) {
        var rfid = prompt("Scan RFID kort");
        var id = "";
        var credit = 0;
        for (var i = 0; i < crewMembers.length; i++) {
            if (crewMembers[i].user.rfid == rfid) {
                id = crewMembers[i].id;
                credit = crewMembers[i].credit;
                break;
            }
        }
        
        // THIS WILL NOT CANCEL THE ORDER, FIX THIS
        if (credit >= sum) {
            credit -= sum;
            CrewMember.patchUser({userId:id}, '{"credit": ' + credit +'}');
        } else {
            alert("Det er ikke nok kreditt på denne kontoen");
        }

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
            Order.create('{"paymentMethod":"' + $scope.paymentMethod + '"}').$promise.then(function(data) {
                var order = data;
                var orderId = order.resource_uri
                
                if ($scope.paymentMethod === "crew") {
                    $scope.handleCrewOrder($scope.crewMembers, $scope.totalSum)
                }

                console.log(orderId);
                $scope.setPaymentMethod('');
                console.log($scope.cart);
                var jsonData = $scope.generateItemQuantity($scope.cart, orderId);
                console.log(jsonData);
                ItemQuantity.addItems(jsonData);
                $scope.cart.clear();
                $scope.totalSum = $scope.calculateTotalSum($scope.cart);
                
            }, function(error) {
                console.log(error);
            });

        }
    };


  }]);


posControllers.controller('statsController', ['$scope', 'Order',
  function($scope, Order) {

    $scope.orders = Order.query();
    
    $scope.totCash = 0;
    $scope.totCard = 0;
    $scope.totCrew = 0;

    $scope.calculateTotals = function(orders) {
        var cash = 0;
        var card = 0;
        var crew = 0;

        for (var i = 0; i < orders.length; i++) {
            if (orders[i].paymentMethod === "kontant") {
                for (var j = 0; j < orders[i].items.length; j++) {
                    var item = orders[i].items[j];
                    cash += item.item.price * item.quantity;
                }
            } else if (orders[i].paymentMethod === "kort") {
                for (var j = 0; j < orders[i].items.length; j++) {
                    var item = orders[i].items[j];
                    card += item.item.price * item.quantity;
                }
            } else if (orders[i].paymentMethod === "crew") {
                for (var j = 0; j < orders[i].items.length; j++) {
                    var item = orders[i].items[j];
                    crew += item.item.price * item.quantity;
                }
            }
        }
        $scope.totCash = cash;
        $scope.totCard = card;
        $scope.totCrew = crew;

    }
  }]);
