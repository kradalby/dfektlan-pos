'use strict';

posControllers.controller('statsController', ['$scope', 'Order',
  function($scope, Order) {

      $scope.orders = Order.query();

      $scope.totCash = 0;
      $scope.totCard = 0;
      $scope.totCrew = 0;

      $scope.dateTo = new Date();
      $scope.dateFrom = new Date().adjustDate(-7);

      $scope.setDateInterval = function(days) {
          $scope.dateFrom = new Date().adjustDate(-days);
          $scope.dateTo = new Date();

          //load shit
          $scope.calculateTotalsBasedOnInterval($scope.dateFrom, $scope.dateTo, $scope.orders);
          $scope.calculateAmountOfSoldProductsInterval($scope.dateFrom, $scope.dateTo, $scope.orders);

      }

      $scope.calculateTotals = function(orders) {

          $scope.totCash = calculateEarningsBasedOnPayments(orders, "kontant");
          $scope.totCard = calculateEarningsBasedOnPayments(orders, "kort");
          $scope.totCrew = calculateEarningsBasedOnPayments(orders, "crew");

      }

    $scope.calculateTotalsBasedOnInterval = function(dateFrom, dateTo, orders) {
        var intOrders = (getOrderInterval(dateFrom, dateTo, orders))
        $scope.calculateTotals(intOrders);
    }

    $scope.calculateAmountOfSoldProductsInterval = function(dateFrom, dateTo, orders) {
        var intOrders = (getOrderInterval(dateFrom, dateTo, orders))
        $scope.calculateAmountOfSoldProducts(intOrders);
    }

    function getOrderInterval(dateFrom, dateTo, orders) {
        var intOrders = []

        for (var i = 0; i < orders.length; i++) {
            var date = new Date(orders[i].date);

            if (dateFrom < date && date < dateTo) {
                intOrders.push(orders[i]);
            }
        }
        return intOrders;
    }

    function calculateEarningsBasedOnPayments(orders, payment){
        var amount = 0;

        for (var i = 0; i < orders.length; i++) {
            if (orders[i].paymentMethod === payment) {
                amount += calculateEarningsForOneOrder(orders[i]);
            }
        }
        return amount;
    }

    function calculateEarningsForOneOrder(order) {
        var amount = 0;

        for (var j = 0; j < order.items.length; j++) {
            var item = order.items[j];
            amount += (item.item.price * item.quantity);
        }
        return amount;
    }

      $scope.soldProducts = {}

      $scope.calculateAmountOfSoldProducts = function(orders) {
        var products = {}

        for (var i = 0; i < orders.length; i++) {
            for (var j = 0; j < orders[i].items.length; j++) {
                if (!(orders[i].items[j].item.name in products)) {
                    products[orders[i].items[j].item.name] = orders[i].items[j].quantity;
                } else {
                    products[orders[i].items[j].item.name] += orders[i].items[j].quantity;
                }
            }

        }
        $scope.soldProducts = products;
        return products;
    }


  }])
