'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $http, $stateParams, $location, Authentication, Articles) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var _content = $(".editormd-preview-container").html();
			var article = new Articles({
				title: this.title,
				subcat: this.subcat,
				content: _content
			});
			article.$save(function(response) {
				$location.path('articles/' + response._id);

				$scope.title = '';
				$scope.subcat = '';
				$scope.content = '';
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
			var _content = $(".editormd-preview-container").html();

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Fulledit existing Article
		$scope.fulledit = function() {
			var article = $scope.article;
			var _content = $(".editormd-preview-container").html()

			$http.post('/articles/fulledit', {article,_content}).success(function (response){
				$location.path('articles/' + response._id);
			}).error(function(response){
				$scope.error = response.message;
			});
		};	

		$scope.find = function() {
			$scope.articles = Articles.query();
		};

		// Admin list of Goods
		$scope.list = function() {
			$http.get('/articles/admin/list').success(function (response){
				$scope.articles = response;
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
		};
	}
]);
