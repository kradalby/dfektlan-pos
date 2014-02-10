'use strict';

posControllers.controller('statsController', ['$scope', 'Order',
  function($scope, Order) {

    $scope.orders = Order.query();

    $scope.totCash = 0;
    $scope.totCard = 0;
    $scope.totCrew = 0;

    $scope.calculateTotals = function(orders) {

//        for (var i = 0; i < orders.length; i++) {
//            if (orders[i].paymentMethod === "kontant") {
//                for (var j = 0; j < orders[i].items.length; j++) {
//                    var item = orders[i].items[j];
//                    cash += item.item.price * item.quantity;
//                }
//            } else if (orders[i].paymentMethod === "kort") {
//                for (var j = 0; j < orders[i].items.length; j++) {
//                    var item = orders[i].items[j];
//                    card += item.item.price * item.quantity;
//                }
//            } else if (orders[i].paymentMethod === "crew") {
//                for (var j = 0; j < orders[i].items.length; j++) {
//                    var item = orders[i].items[j];
//                    crew += item.item.price * item.quantity;
//                }
//            }
//        }

        $scope.totCash = calculateEarningsBasedOnPayments(orders, "kontant");
        $scope.totCard = calculateEarningsBasedOnPayments(orders, "kort");
        $scope.totCrew = calculateEarningsBasedOnPayments(orders, "crew");

    }

    function calculatePaymentEarningsBetween(dateFrom, dateTo, paymentMethod, orders) {
        var amount = 0;
        for (var i = 0; i < orders.length; i++) {
            if (orders[i].paymentMethod === paymentMethod) {

            }
        }

        return amount;
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
