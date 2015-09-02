'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $http, $stateParams, $location, Authentication, Articles) {
		$scope.authentication = Authentication;
		
		if($location.path().search('admin') > 0){
			if (!$scope.authentication.user) {
				$location.path('/');
			}
			else if($scope.authentication.user.roles.length < 2){
				$location.path('/');
			}
		}
		
		$scope.create = function() {
			var article = new Articles({
				title: this.title,
				subcat: this.subcat,
				content:this.content
			});
			article.$save(function(response) {
				$location.path('articles/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};	

		$scope.find = function() {
			$scope.articles = Articles.query();
		};

		$scope.findNotice = function() {
			$scope.articles = Articles.query({
				subcat : '公告'
			});
		};

		// Admin list of Goods
		$scope.list = function() {
			$http.get('/articles/admin/list').success(function (response){
				$scope.articles = response;
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		// Admin list Modify 
		$scope.modify = function(){
			$http.post('/articles/admin/list', this.article).success(function (response){
				$scope.success = true;
			}).error(function (response){
				$scope.error = response.message;
			});
		};

		// Count of Articles
		$scope.Count = function() {
			$http.get('/articles/count').success(function (response){
				$scope.articlesCount = response;
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
		};

		// like
		$scope.like = function (article) {
			var _article = $scope.article;
			$http.post('/articles_like', _article).success(function (response){
				$scope.like += 1;
				$scope.success = true;
				$location.path('articles');
			}).error(function(response){
				$scope.error = response.message;
			});
		};
	}
]);
