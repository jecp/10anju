'use strict';

// Orders controller
angular.module('orders').controller('OrdersController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Orders',
	function($scope, $http, $stateParams, $location, Authentication, Orders) {
		$scope.authentication = Authentication;
		
		if($location.path().search('admin') > 0){
			if (!$scope.authentication.user) {
				$location.path('/');
			}
			else if($scope.authentication.user.roles.length < 2){
				$location.path('/');
			}
		}

		// Create new Order
		$scope.create = function() {
			// Create new Order object
			var order;
			var date = new Date();
			var created_day = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
			var orderName = created_day + '-' + window.user.username + '-' + '的订单';
			var price = (this.good.for_free || this.good.free_try) ? 0 : this.good.price;
			console.log(price);
			var total = this.good.amount*price;
			
			if ($location.url() === '/orders/create'){
				order = new Orders ({
					name:this.name,
					goods:this.goods,
					spec:this.goods.spec,
					price:price,
					amount:this.goods.amount,
					total:total
				});
			} else {
				var goodsObj = [];
				for (var i=0; i < this.carts.length; i++){
					goodsObj.push(this.carts[i]);
					console.log(goodsObj);
				}
				order = new Orders ({
					name: orderName,
					total: this.carts.length,
					checkout: this.carts.checkout,
					goods:goodsObj
				});
			}
			

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
			var price = (this.good.for_free || this.good.free_try) ? 0 : this.good.price;

			var order = new Orders ({
				name: orderName,
				number: Date.now(),
				day: created_day,
				goods:this.good._id,
				price: price,
				amount: 1,
				total: price
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
			if($location.url() === '/orders/admin/list'){
				$scope.orders = Orders.query();
			}else{
				$scope.orders = Orders.query();
			}
		};

		// Admin list of Orders
		$scope.list = function() {
			$http.get('/orders/admin/list').success(function (response){
				$scope.orders = response;
			}).error(function(response){
				$scope.error = response.message;
			});
		};
		
		// Count of Orders
		$scope.Count = function() {
			$http.get('/orders/count').success(function (response){
				$scope.ordersCount = response;
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		// Update Order From admin list
		$scope.modify = function() {
			$http.post('/orders/admin/list', this.order).success(function (response){
				$scope.success = true;
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		// Find a list of Orders
		$scope.showBuyList = function() {
			if($location.url() === '/orders/admin/list'){
				$http.post('/order_buy_list').success(function (response){
					$scope.order_list = response;
					console.log(response);
				}).error(function (response){
					$scope.error = response.message;
				});
			}
		};

		// Find existing Order
		$scope.findOne = function() {
			$scope.order = Orders.get({ 
				orderId: $stateParams.orderId
			});
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

			$http.post('/orders_goods_delete', {order:$scope.order,goodId:order_good,total:order_good.price*order_good.amount}).success(function (response){
				$scope.success = true;
				if (response === 'delete success'){
					$location.path('orders');
				}
				else{
					$scope.order.detail.splice(order_good,1);
					$scope.order.total = response.total;
					$location.path('orders/' + response._id);
				}
			}).error(function (response){
				$scope.error = response.message;
			});
		};

		// modify good.amount in order
		$scope.changeAmount = function (goodId){
			var order_good = this.item.goods;
			var _amount = Math.abs(this.item.amount);
			var _total = this.order.total + this.item.price*_amount;
			var total_amount = 0;
			for (var i=0;i<this.order.detail.length;i++){
				total_amount+=parseInt(this.order.detail[i].amount);
			}
			$http.post('/orders_goods', {order:$scope.order,order_amount:_amount,goodId:order_good._id,total:_total,total_amount:total_amount}).success(function (response){
				$scope.success = true;
				$scope.order.total = response.total;
				$scope.order.total_amount = response.total_amount;
				$location.path('orders/' + response._id);
			}).error(function (response){
				$scope.error = response.message;
			});
		};

		// pay to alipay
		$scope.pay = function(order){
			var _odetail = this.order;
			var _gdetail = this.order.detail;

			$http.post('/order_submit',{order_detail:_odetail,goodId:_gdetail,bz:$scope.bz}).success(function (response){
				// $location.path(response);
				window.location.href = response;
				// window.open(response);
			}).error(function (response){
				$scope.error = response.message;
			});
		};
	}
]);
