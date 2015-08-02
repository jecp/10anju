'use strict';

// Orders controller
angular.module('orders').controller('OrdersController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Orders',
	function($scope, $http, $stateParams, $location, Authentication, Orders) {
		$scope.authentication = Authentication;

		// Create new Order
		$scope.create = function() {
			// Create new Order object
			var date = new Date();
			var created_day = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
			console.log(window.user.username);
			var orderName = created_day + '-' + window.user.username + '-' + '的订单';
			
			var goodsObj = new Array();
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

		$scope.submit = function () {
			var date = new Date();
			var created_day = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
			var orderName = created_day + '-' + window.user.username + '-' + '的订单';

			var order = new Orders ({
				name: orderName,
				number: Date.now(),
				day: created_day,
				cart:this.cart._id,
				detail: this.cart.detail,
				total: this.cart.total
			});
			console.log(order);

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

		$scope.buy = function() {

			//Create new Order object
			var date = new Date();
			var created_day = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
			var orderName = created_day + '-' + window.user.username + '-' + '的订单';

			var order = new Orders ({
				name: orderName,
				number: Date.now(),
				day: created_day,
				goods:this.good._id,
				price: this.good.price,
				amount: 1,
				spec: this.good.spec,
				total: this.good.price
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

		// pay
		$scope.pay = function (){
			alert('支付接口调试中');
		};

		// Remove existing Order
		$scope.del = function(order) {
			var order_ = this.order;
			if ( order_ ) { 
				order_.$remove();

				for (var i in $scope.orders) {
					if ($scope.orders [i] === order_) {
						$scope.orders.splice(i, 1);
					}
				}
			} else {
				$scope.order_.$remove(function() {
					$location.path('orders');
				});
			}
		};

		// Remove existing Cart.goods
		$scope.delOrder = function(cart) {
			var order_good = this.item;
			$scope.amount = this.item.amount;

			$http.post('/orders_goods_delete', {order:$scope.order,goodId:order_good.goods,total:order_good.price*order_good.amount}).success(function (response){
				$scope.success = true;
				$scope.order = response;
				$location.path('orders' + response._id);
			}).error(function (response){
				$scope.error = response.message;
			});
		};

		// modify good.amount in order
		$scope.changeAmount = function (goodId){
			var order_good = this.item.goods;
			$scope.amount = this.item.amount;
			$scope.total += (order_good.price*$scope.amount);

			$http.post('/orders_goods', {order:$scope.order,order_amount:$scope.amount,goodId:order_good._id,total:$scope.total}).success(function (response){
				$scope.success = true;
				$location.path('orders' + response._id);
			}).error(function (response){
				$scope.error = response.message;
			});
		};
	}
]);
