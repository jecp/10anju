'use strict';

// Categories controller
angular.module('categories').controller('CategoriesController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Categories',
	function($scope, $http, $stateParams, $location, Authentication, Categories) {
		$scope.authentication = Authentication;
		
		if($location.path().search('admin') > 0){
			if (!$scope.authentication.user) {
				$location.path('/');
			}
			else if($scope.authentication.user.roles.length < 2){
				$location.path('/');
			}
		}

		// Create new Category
		$scope.create = function() {
			// Create new Category object
			var category = new Categories ({
				name: this.name
			});

			// Redirect after save
			category.$save(function(response) {
				$location.path('categories/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Category
		$scope.remove = function(category) {
			if ( category ) { 
				category.$remove();

				for (var i in $scope.categories) {
					if ($scope.categories [i] === category) {
						$scope.categories.splice(i, 1);
					}
				}
			} else {
				$scope.category.$remove(function() {
					$location.path('categories');
				});
			}
		};

		// Update existing Category
		$scope.update = function() {
			var category = $scope.category;

			category.$update(function() {
				$location.path('categories/' + category._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Categories
		$scope.find = function() {
			var cateId = $stateParams.categoryId;

			if (cateId){
				$scope.categories = Categories.get({ 
					categoryId: $stateParams.categoryId
				});
			}			
			$scope.categories = Categories.query();
		};

		// Admin list of Categories
		$scope.list = function() {
			$http.get('/categories/admin/list').success(function (response){
				$scope.categories = response;
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		// Admin list Modify 
		$scope.modify = function(){
			$http.post('/categories/admin/list', this.cat).success(function (response){
				$scope.success = true;
			}).error(function (response){
				$scope.error = response.message;
			});
		};

		// Find existing Category
		$scope.findOne = function() {
			$scope.category = Categories.get({ 
				categoryId: $stateParams.categoryId
			});
		};

		$scope.findOneCat = function () {
			$scope.category = Categories.get({ 
				categoryId: this.cat._id
			});
		};

		// Find by subcat
		$scope.findBySubcat = function(){
			var subcat = $stateParams.subcat;
			$http.get('/catbysub/'+subcat).success(function (response){
				$scope.category = response;
			}).error(function (response){
				$scope.error = response.message;
			});
		};
	}
]);

