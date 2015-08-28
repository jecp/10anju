'use strict';

// Goods controller
angular.module('goods').controller('GoodsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Goods', 
	function($scope, $http, $stateParams, $location, Authentication, Goods) {
		$scope.authentication = Authentication;
		
		if($location.path().search('admin')){
			if (!$scope.authentication.user) {
				$location.path('/');
			}
			else if($scope.authentication.user.roles.length < 2){
				$location.path('/');
			}
		};

		// Create new Good
		$scope.create = function() {
			// Create new Good object			
			var _main_img = this.main_img.split(':').length>1 ? this.main_img : 'http://7xjuxp.com1.z0.glb.clouddn.com/pic_jpg/'+this.main_img;
			var good = new Goods ({
				name:this.name,
				cate:$('.cat').html(),
				subcat:this.subcat,
				title:this.title,
				summary:this.summary,
				spec:this.spec,
				price:this.price,
				weight:this.weight,
				origin:this.origin,
				delivery:this.delivery,
				detail:this.detail,
				main_img:_main_img,
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
				var goodObj = this.good;
				$http.post('/goods/admin/delete',goodObj).success(function (response){
					for (var i in $scope.goods) {
						if ($scope.goods [i] === goodObj) {
							$scope.goods.splice(i, 1);
						}
					}
					$scope.success = true;
				}).error(function (response){
					$scope.error = response.message;
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
			if($location.path().search('edit')){
				if(!Authentication && Authentication.user.roles.length<2){
					alert('您没有权限！请检查！');
					$location.path('goods');
				}
				else {
					for (var i=0;i<Authentication.user.roles.length;i++){
						if(Authentication.user.roles[i]==='admin'){
							$http.get('/goods/edit',{params:{goodId:$stateParams.goodId}}).success(function (response){
								$scope.good = response;
							}).error(function(response){				
								$scope.error = response.message;
								$location.path('goods');
							});
						}
					}
				}
			}
		};

		// Find a list of Goods
		$scope.find = function() {
			$scope.goods = Goods.query();
		};

		// Admin list of Goods
		$scope.list = function() {
			$http.get('/goods/admin/list').success(function (response){
				$scope.goods = response;
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		// Count of Goods
		$scope.Count = function() {
			$http.get('/goods/count').success(function (response){
				$scope.goodsCount = response;
			}).error(function(response){
				$scope.error = response.message;
			});
		};
		
		// Update Good From admin list
		$scope.modify = function() {
			$http.post('/goods/admin/list', this.good).success(function (response){
				$location.path('goods/'+response._id);
				$scope.success = true;
			}).error(function(response){
				$scope.error = response.message;
			});
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

		// search function
		$scope.search = function(keyword) {
			$http.post('/search', {keyword:this.keyword}).success(function (response){
				// $scope.success = true;
				$scope.results = response;
				//$location.path('/results');
			}).error(function (response){
				$scope.error = response.message;
			});
		};

		// Remove existing Good
		// $scope.del = function() {
		// 	$http.get('/goods/admin/delete',{this.good._id}).success(function (response){
		// 		for (var i in $scope.goods) {
		// 			if ($scope.goods [i] === this.good) {
		// 				$scope.goods.splice(i, 1);
		// 			}
		// 		}
		// 		$scope.success = true;
		// 	}).error(function (response){
		// 		$scope.error = response.message;
		// 	});
		// };
	}
]);
