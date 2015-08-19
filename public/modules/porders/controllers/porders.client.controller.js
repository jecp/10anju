'use strict';

// Porders controller
angular.module('porders').controller('PordersController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Porders',
	function($scope, $http, $stateParams, $location, Authentication, Porders) {
		$scope.authentication = Authentication;

		// Create new Porder
		$scope.create = function() {
			// Create new Porder object
			var total = this.goods.price * this.goods.amount;
			var porder = new Porders ({
				name: this.name,
				goods:this.goods,
				total:total,
				bz:this.bz
			});

			// Redirect after save
			porder.$save(function(response) {
				$location.path('porders/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Porder
		$scope.remove = function(porder) {
			if ( porder ) { 
				porder.$remove();

				for (var i in $scope.porders) {
					if ($scope.porders [i] === porder) {
						$scope.porders.splice(i, 1);
					}
				}
			} else {
				$scope.porder.$remove(function() {
					$location.path('porders');
				});
			}
		};

		// Update existing Porder
		$scope.update = function() {
			var porder = $scope.porder;

			porder.$update(function() {
				$location.path('porders/' + porder._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Porders
		$scope.find = function() {
			$scope.porders = Porders.query();
		};

		// Admin list of Porders
		$scope.list = function() {
			$http.get('/porders/admin/list').success(function (response){
				$scope.porders = response;
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		// Find existing Porder
		$scope.findOne = function() {
			$scope.porder = Porders.get({ 
				porderId: $stateParams.porderId
			});
		};
	}
]);
