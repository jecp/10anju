'use strict';

// Visithistorys controller
angular.module('visithistorys').controller('VisithistorysController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Visithistorys',
	function($scope, $http, $stateParams, $location, Authentication, Visithistorys) {
		$scope.authentication = Authentication;

		// Create new Visithistory
		$scope.create = function() {
			// Create new Visithistory object
			var visithistory = new Visithistorys ({
				name: this.name
			});

			// Redirect after save
			visithistory.$save(function(response) {
				$location.path('visithistorys/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Visithistory
		$scope.remove = function(visithistory) {
			if ( visithistory ) { 
				visithistory.$remove();

				for (var i in $scope.visithistorys) {
					if ($scope.visithistorys [i] === visithistory) {
						$scope.visithistorys.splice(i, 1);
					}
				}
			} else {
				$scope.visithistory.$remove(function() {
					$location.path('visithistorys');
				});
			}
		};

		// Update existing Visithistory
		$scope.update = function() {
			var visithistory = $scope.visithistory;

			visithistory.$update(function() {
				$location.path('visithistorys/' + visithistory._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Visithistorys
		$scope.find = function() {
			$scope.visithistorys = Visithistorys.query();
		};

		// Admin list of Visithistorys
		$scope.list = function() {
			$http.get('/visithistorys/admin/list').success(function (response){
				$scope.visithistorys = response;
			}).error(function(response){
				$scope.error = response.message;
			});
		};
		
		// Update Visithistory From admin list
		$scope.modify = function() {
			$http.post('/visithistorys/admin/list', this.visithistory).success(function (response){
				$scope.success = true;
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		// vs_log 
		$scope.vs_log = function() {
			$http.get('/').success(function (response){
				// alert(response);
				// console.log(response);
				// console.log(response.connection.remoteAddress);
				// var ip = response.headers['x-forwarded-for'] || 
    //  					response.connection.remoteAddress || 
				// 	    response.socket.remoteAddress ||
				// 	    response.connection.socket.remoteAddress;
				// console.log(ip);
				// alert(ip);
			});
			// console.log(function getClientIp(req) {
			//         return req.headers['x-forwarded-for'] ||
			//         req.connection.remoteAddress ||
			//         req.socket.remoteAddress ||
			//         req.connection.socket.remoteAddress;
			//     });
			// console.log(document.location);
			// alert(document.location);
			$http.post('http://ip.taobao.com/service/getIpInfo2.php',{'Content-Type':'application/json'}).success(function (response){
				console.log(response.connection.remoteAddress);
				// areaObj = JSON.parse(body);
				// if (err){console.log(err);}
				// else if(areaObj.code === 1){
				// 	return;
				// } 
				// logObj.customCountry = areaObj.data.country;
				// logObj.customCountry_id = areaObj.data.country_id;
				// logObj.customArea = areaObj.data.area;
				// logObj.customArea_id = areaObj.data.area_id;
				// logObj.customRegion = areaObj.data.region;
				// logObj.customRegion_id = areaObj.data.region_id;
				// logObj.customCity = areaObj.data.city;
				// logObj.customCity_id = areaObj.data.city_id;
				// logObj.customIsp = areaObj.data.isp;
				// logObj.customIsp_id = areaObj.data.isp_id;

				// if (req.user && req.user !== 'undefined'){
				// 	Visithistory.findOne({user:req.user._id,originalUrl:req.originalUrl},function (err,visithistory){
				// 		if (err) {console.log(err);} 
				// 		else if (visithistory){
				// 			return;
				// 		}else{
				// 			logObj.save(function (err,visithistory) {
				// 				if (err) {console.log(err);}
				// 			});
				// 		}
				// 	});
				// } else{
				// 	Visithistory.findOne({sessionID:req.sessionID,originalUrl:req.originalUrl},function (err,visithistory){
				// 		if (err) {console.log(err);} 
				// 		else if (visithistory){
				// 			return;
				// 		} else{
				// 			logObj.save(function (err,visithistory) {
				// 				if (err) {console.log(err);}
				// 			});
				// 		}
				// 	});
				// }
			});

			// $http.post('/vs_log', ).success(function (response){

			// }).error(function (response){
			// 	$scope.error = response.message;
			// });
		};

		// Find existing Visithistory
		$scope.findOne = function() {
			$scope.visithistory = Visithistorys.get({ 
				visithistoryId: $stateParams.visithistoryId
			});
		};
	}
]);
