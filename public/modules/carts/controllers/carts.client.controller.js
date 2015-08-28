'use strict';

// Carts controller
angular.module('carts').controller('CartsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Carts',
	function($scope, $http, $stateParams, $location, Authentication, Carts) {
		$scope.authentication = Authentication;
		
		if($location.path().search('admin')){
			if (!$scope.authentication.user) {
				$location.path('/');
			}
			else if($scope.authentication.user.roles.length < 2){
				$location.path('/');
			}
		}

		// Create new Cart
		$scope.create = function() {
			// Create new Cart object
			var date = new Date();
			var created_day = date.getFullYear().toString() + (date.getMonth() + 1).toString() + date.getDate().toString();
			var cartName = created_day + '-' + window.user.username + '-' + '的购物篮';
			console.log(this.good.for_free || this.good.free_try);
			var _price = (this.good.for_free || this.good.free_try) ? 0 : this.good.price;
			var cart = new Carts ({
				name: cartName,
				number: Date.now(),
				day: created_day,
				detail:{
					goods:this.good._id,
					amount: this.good.amount || 1,
					price: _price
				},
				total: this.good.amount*_price
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

		// Admin list of Carts
		$scope.list = function() {
			$http.get('/carts/admin/list').success(function (response){
				$scope.carts = response;
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		// Count of Carts
		$scope.Count = function() {
			$scope.cartsCount = $http.get('/carts/count').success(function (response){
				$scope.cartsCount = response;
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		// Find existing Cart
		$scope.findOne = function() {
			$scope.cart = Carts.get({ 
				cartId: $stateParams.cartId
			});
		};

		// // checked box
		// $scope.checkAll = function (){
		// 	// console.log(this.cart);
		// 	$scope.checkbox = true;
		// 	console.log(this.cart.detail);
		// 	// var arr = this.order.detail;
		// 	// $scope.$apply(function (){
		// 	// 	arr.forEach(function (err){
		// 	// 		arr.checked = true;
		// 	// 	});
		// 	// });
		// }

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
				_total = cart_good.price*_amount;

			var total_amount = 0;
			for (var i=0;i<this.cart.detail.length;i++){
				total_amount+=parseInt(this.cart.detail[i].amount);
			}

			$http.post('/carts_goods', {cart:$scope.cart,cart_amount:_amount,goodId:cart_good._id,total:_total,total_amount:total_amount}).success(function (response){
				$scope.success = true;
				$scope.cart.total_amount = total_amount;
				$scope.cart.total = response.total;
				$location.path('carts/' + response._id);
			}).error(function (response){
				$scope.error = response.message;
			});
		};
	}
]);
