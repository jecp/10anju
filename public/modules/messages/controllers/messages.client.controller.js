'use strict';

// Messages controller
angular.module('messages').controller('MessagesController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Messages',
	function($scope, $http, $stateParams, $location, Authentication, Messages) {
		$scope.authentication = Authentication;
		if($location.path().search('admin') && !Authentication && $scope.authentication.user.roles.length < 2){
			$location.path('/');
		}

		// Create new Message
		$scope.create = function() {
			// Create new Message object
			var message = new Messages ({
				name: this.name
			});

			// Redirect after save
			message.$save(function(response) {
				$location.path('messages/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Message
		$scope.remove = function(message) {
			if ( message ) { 
				message.$remove();

				for (var i in $scope.messages) {
					if ($scope.messages [i] === message) {
						$scope.messages.splice(i, 1);
					}
				}
			} else {
				$scope.message.$remove(function() {
					$location.path('messages');
				});
			}
		};

		// Update existing Message
		$scope.update = function() {
			var message = $scope.message;

			message.$update(function() {
				$location.path('messages/' + message._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Messages
		$scope.find = function() {
			$scope.messages = Messages.query();
		};

		// Admin list of Messages
		$scope.list = function() {
			$http.get('/messages/admin/list').success(function (response){
				$scope.messages = response;
			}).error(function(response){
				$scope.error = response.message;
			});
		};
		
		// Update Message From admin list
		$scope.modify = function() {
			$http.post('/messages/admin/list', this.message).success(function (response){
				$scope.success = true;
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		// Find existing Message
		$scope.findOne = function() {
			$scope.message = Messages.get({ 
				messageId: $stateParams.messageId
			});
		};
	}
]);
