'use strict';

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
