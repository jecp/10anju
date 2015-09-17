'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.refreshcapture = function(){
			var code_img=document.getElementById('authimg');
			console.log(code_img);
			$('authimg').html('abc');
			console.log($('authimg'));
			$http.get('/auth/img').success(function (response){
				console.log(response);
				code_img = response;
			});
			$("#xx").html("abc");
			code_img.setAttribute('src','/auth/img?'+Math.random());
		//加入随机数不然地址相同 
		}

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				if (response.message === '手机验证码发送成功！'){
					$scope.message = response.message;
				}else{
					// If successful we assign the response to the global user model
					$scope.authentication.user = response;

					// And redirect to the index page
					$location.path('/settings/profile');
				}				
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			if ($scope.credentials.agreement === true){
				$http.post('/auth/signin', $scope.credentials).success(function(response) {
					// If successful we assign the response to the global user model
					$scope.authentication.user = response;

					// And redirect to the index page
					$location.path('/settings/profile');
				}).error(function(response) {
					$scope.error = response.message;
				});
			}
			else{
				$location.path('/signin');
			}
		};

		$scope.auth = function() {
			if ($scope.credentials.agreement === true){
				$http.post('/auth/auth', $scope.credentials).success(function(response) {
					// If successful we assign the response to the global user model
					$scope.message = response;
				}).error(function(response) {
					$scope.error = response.message;
				});
			}
			else{
				$location.path('/signin');
			}
		};

		$scope.refreshAuthImg = function() {
			alert(1);
		};
	}
]);
