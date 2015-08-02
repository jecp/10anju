'use strict';

// Ccenters controller
angular.module('ccenters').controller('CcentersController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Ccenters',
	function($scope, $http, $stateParams, $location, Authentication, Ccenters) {
		$scope.authentication = Authentication;

		// Create new Ccenter
		$scope.create = function() {
			// Create new Ccenter object
			var ccenter = new Ccenters ({
				name: this.name,
				province: this.province,
				city: this.city,
				district: this.district,
				street: this.street,
				detail: this.detail,
				lng: this.lng,
				lat: this.lat
			});

			// Redirect after save
			ccenter.$save(function(response) {
				$location.path('ccenters/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.province = '';
				$scope.city = '';
				$scope.district = '';
				$scope.street = '';
				$scope.detail = '';
				$scope.lng = '';
				$scope.lat = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Ccenter
		$scope.remove = function(ccenter) {
			if ( ccenter ) { 
				ccenter.$remove();

				for (var i in $scope.ccenters) {
					if ($scope.ccenters [i] === ccenter) {
						$scope.ccenters.splice(i, 1);
					}
				}
			} else {
				$scope.ccenter.$remove(function() {
					$location.path('ccenters');
				});
			}
		};

		// Update existing Ccenter
		$scope.update = function() {
			var ccenter = $scope.ccenter;

			ccenter.$update(function() {
				$location.path('ccenters/' + ccenter._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Ccenters
		$scope.find = function() {
			$scope.ccenters = Ccenters.query();
		};

		// Find existing Ccenter
		$scope.findOne = function() {
			$scope.ccenter = Ccenters.get({ 
				ccenterId: $stateParams.ccenterId
			});
		};

		// Find User's Ccenter
		$scope.findU = function() {
			$http.post('/my_ccenter').success(function (response){
				$scope.ccenter = response;
			}).error(function (response){
				$scope.error = response.message;
			});
		};

		// User Register
		$scope.register = function(ccenter) {
			// Create new Ccenter object
			var ccenterId = this.ccenter._id;
			console.log(ccenterId);

			ccenterId.$register(function (){
				console.log('server ,now!');
				$location.path('ccenters' + ccenterId);
			},function(errorResponse){
				$scope.error = errorResponse.data.message;
			});
		};
	}
]);
