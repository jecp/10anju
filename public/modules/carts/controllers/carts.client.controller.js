'use strict';

// Carts controller
angular.module('carts').controller('CartsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Carts',
	function($scope, $stateParams, $location, Authentication, Carts) {
		$scope.authentication = Authentication;

		// Create new Cart
		$scope.create = function() {
			// Create new Cart object
			var date = new Date();
			var created_day = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
			var cart = new Carts ({
				name: this.good.name,
				number: Date.now(),
				day: created_day,
				goods:this.good._id,
				price: this.good.price,
				amount: this.good.amount,
				spec: this.good.spec,
				total: this.good.price
			});

			// Clear form fields
			$scope.name = '';
			$scope.goods = '';
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
			// var i = 0;
			// console.log(this.carts.);
			// console.log(this.carts[1]);
			// var totalFee;
			// for (i; i < $scope.carts.length; i++){
			// 	totalFee += $scope.carts[i].total;
			// 	console.log(this.carts[i].total);
			// }
			// console.log(totalFee);
			// $scope.totalFee = totalFee;
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
			if ( cart_ ) { 
				cart_.$remove();

				for (var i in $scope.carts) {
					if ($scope.carts [i] === cart_) {
						$scope.carts.splice(i, 1);
					}
				}
			} else {
				$scope.cart_.$remove(function() {
					$location.path('carts');
				});
			}
		};

		// My carts
		$scope.myCarts = function(){
			$scope.carts = Carts.myCarts({});
		};
	}
]);
