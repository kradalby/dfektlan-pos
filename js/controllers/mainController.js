'use strict';


posControllers.controller('mainController', ['$scope', 'Item', 'Order', 'ItemQuantity', 'CrewMember', 'ItemGroup',
  function($scope, Item, Order, ItemQuantity, CrewMember, ItemGroup) {
    $scope.items = Item.query();
    
    /* Methods related to the group filter */
    $scope.itemGroups = ItemGroup.query();
    $scope.itemGroup = "";
    $scope.setItemGroup = function(groupResource) {
        $scope.itemGroup = groupResource;
    }

    
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

    //$scope.updateCrewMemberData = function() {
    //    $scope.crewMembers = CrewMember.query();
    //    console.log("Updated crew");
    //}
    
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


    
    $scope.handleCrewOrder = function(sum) {
        CrewMember.query().$promise.then(
        function(data) {
            var crewMembers = data;
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
                    
                } else {
                    alert('Ikke nok kredit');
                    return false;
                }

            } else {
                alert('Personen er ikke Crew');
                return false;
            }
            return true;
        },
        function(error) {
            console.log("error");
            return false;
        });
    }
    
    /* Methods related to the order functionality */
    $scope.paymentMethod = "";

    $scope.setPaymentMethod = function(method) {
        $scope.paymentMethod = method;
    };

    $scope.generateItemQuantity = function(cart, orderId) {
        var items = {};
        var totalCost = 0;

        for (var i = 0; i < cart.length; i++) {
            if (!items.hasOwnProperty(cart[i].resource_uri)) {
                items[cart[i].resource_uri] = 1;
                totalCost += cart[i].price;
            } else {
                items[cart[i].resource_uri] += 1;
                totalCost += cart[i].price;
            }
        }

        var jsonPost = '{"objects": [ ';
        for (var item in items) {
            jsonPost += '{ "item": "' + item + '", "order": "' + orderId + '", "quantity": ' + items[item] + ', "totalPrice": ' + totalCost + '},';
            console.log(jsonPost);
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
                
                // THERE IS A BUG HERE!
                if ($scope.paymentMethod === "crew") {
                    if (!($scope.handleCrewOrder($scope.totalSum))) {
                        //$scope.setPaymentMethod('');
                        //$scope.cart.clear();
                        //$scope.totalSum = $scope.calculateTotalSum($scope.cart);
                        console.log("herp");
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


