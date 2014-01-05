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

    /* Methods related to Crew order functionality */
    $scope.crewMembers = CrewMember.query();

    $scope.updateCrewMemberData = function() {
        $scope.crewMembers = CrewMember.query();
    }
    
    $scope.isCrew = function(crewMembers, rfid) {
        for (var i = 0; i < crewMembers.length; i++) {
            if (crewMembers[i].user.rfid == rfid) {
                return true;
            }
        }    
        return false;
    }
    
    $scope.getCrewMemberCredit = function(crewMembers, rfid) {
        for (var i = 0; i < crewMembers.length; i++) {
            if (crewMembers[i].user.rfid == rfid) {
                return crewMembers[i].credit;
            }
        }
        return 0;
        
    }

    //This is not a good way to solve problem with outdated data
    $scope.setCrewMemberCredit = function(crewMembers, rfid, credit) {
        for (var i = 0; i < crewMembers.length; i++) {
            if (crewMembers[i].user.rfid == rfid) {
                crewMembers[i].credit = credit;
            }
        }
        
    }

    $scope.getCrewMemberId = function(crewMembers, rfid) {
        for (var i = 0; i < crewMembers.length; i++) {
            if (crewMembers[i].user.rfid == rfid) {
                return crewMembers[i].id;
            }
        }    
        return undefined;
    }

    $scope.hasSufficientFunds = function(credit, sum) {
        if (credit >= sum) {
            return true;
        } else {
            return false;
        }
    }



    $scope.handleCrewOrder = function(crewMembers, sum) {
        var rfid = prompt("Scan RFID kort");
        var id = "";
        var credit = 0;
        

        if ($scope.isCrew(crewMembers, rfid)) {
            credit = $scope.getCrewMemberCredit(crewMembers, rfid);
            id = $scope.getCrewMemberId(crewMembers, rfid);
            
            if ($scope.hasSufficientFunds(credit, sum)) {
                console.log(credit, sum);
                credit -= sum;
                console.log(credit);
                CrewMember.patchUser({userId: id},'{"credit": ' + credit +'}');
                $scope.setCrewMemberCredit(crewMembers, rfid, credit);
                
            } else {
                alert('Ikke nok kredit');
                return false;
            }

        } else {
            alert('Personen er ikke Crew');
            return false;
        }
        //This does not seem to work
        $scope.updateCrewMemberData();
        return true;
    }
    
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
                    if (!$scope.handleCrewOrder($scope.crewMembers, $scope.totalSum)) {
                        return false
                    }
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
