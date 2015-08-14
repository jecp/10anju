'use strict';

// Carts controller
angular.module('carts').controller('CartsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Carts',
	function($scope, $http, $stateParams, $location, Authentication, Carts) {
		$scope.authentication = Authentication;

		// Create new Cart
		$scope.create = function() {
			// Create new Cart object
			var date = new Date();
			var created_day = date.getFullYear().toString() + (date.getMonth() + 1).toString() + date.getDate().toString();
			var cartName = created_day + '-' + window.user.username + '-' + '的购物篮';
			var cart = new Carts ({
				name: cartName,
				number: Date.now(),
				day: created_day,
				detail:{
					goods:this.good._id,
					amount: this.good.amount,
					price: this.good.price,
				},
				total: this.good.price
			});

			// Clear form fields
			$scope.name = '';
			$scope.good = '';
			$scope.number = '';
			$scope.price = '';
			$scope.amount = '';
			$scope.spec = '';
			$scope.total = '';

			// Redirect after save
			cart.$save(function(response) {
				$location.path('carts/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});	
		};

		// Remove existing Cart
		$scope.remove = function(cart) {
			if ( cart ) { 
				cart.$remove();

				for (var i in $scope.carts) {
					if ($scope.carts [i] === cart) {
						$scope.carts.splice(i, 1);
					}
				}
			} else {
				$scope.cart.$remove(function() {
					$location.path('carts');
				});
			}
		};

		// Update existing Cart
		$scope.update = function() {
			var cart = $scope.cart;

			cart.$update(function() {
				$location.path('carts/' + cart._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Carts
		$scope.find = function() {
			$scope.carts = Carts.query();
		};

		// Find existing Cart
		$scope.findOne = function() {
			$scope.cart = Carts.get({ 
				cartId: $stateParams.cartId
			});
		};

		// Remove existing Cart
		$scope.del = function(cart) {
			var cart_ = this.cart;
			var delgoods_ = this.delgoods;
			if ( cart_ ) { 
				cart_.$remove();

				for (var i in $scope.carts) {
					if ($scope.carts [i] === cart_) {
						$scope.carts.splice(i, 1);
					}
				}
			} else {
				console.log(2);
				$scope.cart_.$remove(function() {
					$location.path('carts');
				});
			}
		};

		// Remove existing Cart.goods
		$scope.delGoods = function(cart) {
			var cart_good = this.item;

			$http.post('/carts_goods_delete', {cart:$scope.cart,goodId:cart_good.goods,total:cart_good.price*cart_good.amount}).success(function (response){
				$scope.success = true;
				if (response === 'delete success'){
					$location.path('carts');
				}else{
					$scope.cart.detail.splice(cart_good,1);
					$location.path('carts/' + response._id);
				}
			}).error(function (response){
				$scope.error = response.message;
			});
		};

		// modify good.amount in cart
		$scope.changeAmount = function (goodId){
			var cart_good = this.item.goods,
				_amount = this.item.amount,
				_total;
				_total = (cart_good.price*_amount);

			$http.post('/carts_goods', {cart:$scope.cart,cart_amount:_amount,goodId:cart_good._id,total:_total}).success(function (response){
				$scope.success = true;
				$scope.cart.total = response.total;
				$location.path('carts/' + response._id);
			}).error(function (response){
				$scope.error = response.message;
			});
		};
	}
]);
