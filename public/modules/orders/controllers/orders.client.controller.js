'use strict';

// Orders controller
angular.module('orders').controller('OrdersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Orders',
	function($scope, $stateParams, $location, Authentication, Orders) {
		$scope.authentication = Authentication;

		// Create new Order
		$scope.create = function() {
			// Create new Order object
			console.log(this.carts);
			var date = new Date();
			var created_day = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
			var orderName = window.user._id + created_day + '的订单';
			
			var goodsObj = new Array();
			console.log(goodsObj);
			for (var i=0; i < this.carts.length; i++){
				goodsObj.push(this.carts[i]);
				console.log(goodsObj);
			}
			var order = new Orders ({
				name: orderName,
				total: this.carts.length,
				checkout: this.carts.checkout,
				goods:goodsObj
			});

			// Redirect after save
			order.$save(function(response) {
				$location.path('orders/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.total = '';
				$scope.checkout = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Order
		$scope.remove = function(order) {
			if ( order ) { 
				order.$remove();

				for (var i in $scope.orders) {
					if ($scope.orders [i] === order) {
						$scope.orders.splice(i, 1);
					}
				}
			} else {
				$scope.order.$remove(function() {
					$location.path('orders');
				});
			}
		};

		// Update existing Order
		$scope.update = function() {
			var order = $scope.order;

			order.$update(function() {
				$location.path('orders/' + order._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Orders
		$scope.find = function() {
			$scope.orders = Orders.query();
		};

		// Find existing Order
		$scope.findOne = function() {
			$scope.order = Orders.get({ 
				orderId: $stateParams.orderId
			});
		};
	}
]);
