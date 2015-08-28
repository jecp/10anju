'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$stateParams', '$location', 'Users', 'Authentication',
	function($scope, $http, $stateParams, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Count of Users
		$scope.Count = function() {
			$http.get('/users/count').success(function (response){
				$scope.usersCount = response.usersCount;
				$scope.fusersCount = response.fusersCount;
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		// Register in a ccenter
		$scope.register = function(ccenter){
			$http.post('/users_ccenter', {roomNum:$scope.ccenterDetails.roomNum,ccenter:this.ccenter}).success(function(response) {
				$scope.success = true;
				$scope.message = response.message;
				alert(response.message);
				$location.path('/settings/profile');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Change user profile
		$scope.changeUserProfile = function() {
			$scope.success = $scope.error = null;
			var user = new Users($scope.userProfile);

			user.$update(function(response) {
				$scope.success = true;
				Authentication.user = response;
			}, function(response) {
				$scope.error = response.data.message;
			});
		};

		// Change user password
		$scope.changeUserPassword = function(isValid) {

			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Find existing User
		$scope.findOne = function() {
			$scope.user = Users.get({ 
				userId: $stateParams.userId
			});
		};
	}
]);
