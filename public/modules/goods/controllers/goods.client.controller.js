'use strict';

// Goods controller
angular.module('goods').controller('GoodsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Goods', 
	function($scope, $http, $stateParams, $location, Authentication, Goods) {
		$scope.authentication = Authentication;

		// Create new Good
		$scope.create = function() {
			// Create new Good object
			var good = new Goods ({
				name:this.name,
				category:this.category,
				subcat:this.subcat,
				// article:[{type:Schema.ObjectId,ref:'Article'}],
				title:this.title,
				summary:this.summary,
				spec:this.spec,
				price:this.price,
				weight:this.weight,
				origin:this.origin,
				delivery:this.delivery,
				detail:this.detail,
				main_img:this.main_img,
				img:this.img,
				stock:this.stock,
				wiki:this.wiki,
				suitable:this.suitable,
				sale:this.sale,
				feature:this.feature,				
				nutrition:this.nutrition,
				therapy:this.therapy,
				avoid: this.avoid,
				recipes: this.recipes,
				for_free: this.for_free,
				free_try: this.free_try
			});

			// Redirect after save
			good.$save(function(response) {
				$location.path('goods/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			// $scope.name = '';
			// $scope.subcat = '';
			// $scope.category = '';
			// $scope.title = '';
			// $scope.summary = '';
			// $scope.spec = '';
			// $scope.price = '';
			// $scope.weight = '';
			// $scope.origin = '';
			// $scope.delivery = '';
			// $scope.detail = '';
			// $scope.main_img = '';
			// $scope.img = '';
			// $scope.stock = '';
			// $scope.wiki = '';
			// $scope.suitable = '';
			// $scope.sale = '';
			// $scope.feature = '';
			// $scope.nutrition = '';
			// $scope.therapy = '';
			// $scope.avoid = '';
			// $scope.recipes = '';
		};

		// Remove existing Good
		$scope.remove = function(good) {
			if ( good ) { 
				good.$remove();

				for (var i in $scope.goods) {
					if ($scope.goods [i] === good) {
						$scope.goods.splice(i, 1);
					}
				}
			} else {
				$scope.good.$remove(function() {
					$location.path('goods');
				});
			}
		};

		// Update existing Good
		$scope.update = function() {
			var good = $scope.good;

			good.$update(function() {
				$location.path('goods/' + good._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Edit list Good
		$scope.edit = function() {
			var good = $scope.good;
			console.log($scope.good);
			console.log($scope.good.edit);

			good.$update(function() {
				$location.path('goods/' + good._id);
			}, function (errorResponse){
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Goods
		$scope.find = function() {
			$scope.goods = Goods.query();
		};

		// Find a list of Goods
		$scope.findByCategory = function() {
			$scope.goods = Goods.query({
				category: $scope.category
			});
		};

		// Find existing Good
		$scope.findOne = function() {
			$scope.good = Goods.get({ 
				goodId: $stateParams.goodId
			});
		};

		// Subcat
		$scope.listSubcat = function () {
			$scope.goods = Goods.query({ 
				subcat: $stateParams.subcat
			});
		};

		// like
		$scope.like = function (good) {
			var _good = $scope.good;

			$http.post('/goods_like', _good).success(function (response){
				$scope.like += 1;
				$scope.success = true;
				$location.path('goods/' + _good._id);
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		// search function
		$scope.search = function(keyword) {
			$http.post('/search', {keyword:this.keyword}).success(function (response){
				// $scope.success = true;
				$scope.results = response;
				console.log(response);
				// $location.path('/results');
			}).error(function (response){
				$scope.error = response.message;
			});
		};

		// Remove existing Good
		$scope.del = function(good) {
			var good_ = this.good;
			if ( good_ ) { 
				good_.$remove();

				for (var i in $scope.goods) {
					if ($scope.goods [i] === good_) {
						$scope.goods.splice(i, 1);
					}
				}
			} else {
				$scope.good_.$remove(function() {
					$location.path('goods');
				});
			}
		};
	}
]);

