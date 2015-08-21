'use strict';

// Orders controller
angular.module('orders').controller('OrdersController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Orders',
	function($scope, $http, $stateParams, $location, Authentication, Orders) {
		$scope.authentication = Authentication;

		// Create new Order
		$scope.create = function() {
			// Create new Order object
			var order;
			var date = new Date();
			var created_day = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
			var orderName = created_day + '-' + window.user.username + '-' + '的订单';
			
			console.log($location.url());

			if ($location.url() === '/orders/create'){
				order = new Orders ({
					name:this.name,
					goods:this.goods,
					spec:this.goods.spec,
					price:this.goods.price,
					amount:this.goods.amount,
					total:this.total
				});
			} else {

				var goodsObj = new Array();
				for (var i=0; i < this.carts.length; i++){
					goodsObj.push(this.carts[i]);
					console.log(goodsObj);
				}
				order = new Orders ({
					name: orderName,
					total: this.carts.length,
					checkout: this.carts.checkout,
					goods:goodsObj
				});
			}
			

			// Redirect after save
			order.$save(function(response) {
				$location.path('orders/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.total = '';
				$scope.checkout = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.submit = function () {
			var date = new Date();
			var created_day = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
			var orderName = created_day + '-' + window.user.username + '-' + '的订单';

			var order = new Orders ({
				name: orderName,
				number: Date.now(),
				day: created_day,
				cart:this.cart._id,
				detail: this.cart.detail,
				total: this.cart.total
			});
			
			// Redirect after save
			order.$save(function(response) {
				$location.path('orders/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.total = '';
				$scope.checkout = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.buy = function() {

			//Create new Order object
			var date = new Date();
			var created_day = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
			var orderName = created_day + '-' + window.user.username + '-' + '的订单';

			var order = new Orders ({
				name: orderName,
				number: Date.now(),
				day: created_day,
				goods:this.good._id,
				price: this.good.price,
				amount: 1,
				spec: this.good.spec,
				total: this.good.price
			});

			// Redirect after save
			order.$save(function(response) {
				$location.path('orders/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.total = '';
				$scope.checkout = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Order
		$scope.remove = function(order) {
			if ( order ) { 
				order.$remove();

				for (var i in $scope.orders) {
					if ($scope.orders [i] === order) {
						$scope.orders.splice(i, 1);
					}
				}
			} else {
				$scope.order.$remove(function() {
					$location.path('orders');
				});
			}
		};

		// Update existing Order
		$scope.update = function() {
			var order = $scope.order;

			order.$update(function() {
				$location.path('orders/' + order._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Orders
		$scope.find = function() {
			if($location.url() === '/orders/admin/list'){
				$scope.orders = Orders.query();
			}else{
				$scope.orders = Orders.query();
			}
		};

		// Admin list of Orders
		$scope.list = function() {
			$http.get('/orders/admin/list').success(function (response){
				$scope.orders = response;
			}).error(function(response){
				$scope.error = response.message;
			});
		};
		
		// Count of Orders
		$scope.Count = function() {
			$http.get('/orders/count').success(function (response){
				$scope.ordersCount = response;
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		// Update Order From admin list
		$scope.modify = function() {
			$http.post('/orders/admin/list', this.order).success(function (response){
				$scope.success = true;
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		// Find a list of Orders
		$scope.showBuyList = function() {
			if($location.url() === '/orders/admin/list'){
				$http.post('/order_buy_list').success(function (response){
					$scope.order_list = response;
					console.log(response);
				}).error(function (response){
					$scope.error = response.message;
				});
			}
		};

		// Find existing Order
		$scope.findOne = function() {
			$scope.order = Orders.get({ 
				orderId: $stateParams.orderId
			});
		};

		// QrCode 二维码
		var qrCode = {
		    //初始化属性
		    jsonData:{
		        content     : '',  //内容，可为utl,如html://www.baidu.com 或文字，图片信息之类的
		        logo        : '',  //二维码中间显示图片，   如:html://wwww.xxx.com/imgname.jpg
		        bgColor     : '',  //背景颜色，             格式 ：颜色代码            如fffaf0
		        fgColor     : '',  //前景颜色，即条纹颜色     格式 ：同上
		        gcColor     : '',  //渐变颜色,              格式 : 同上
		        ptColor     : '',  //定位点颜色(外框)        格式：同上
		        inptColor   : '',  //定位点颜色(内点)        格式：同上
		        eLevel      : '',  //纠错等级, 可用值:h\q\m\l  格式 : 单个字符         如 h
		        w           : '',  //宽度尺寸               格式：像素值              如  200
		        m           : ''   //外边距尺寸               格式：如上
		    },
		    //获取二维码图片
		    getQrcode:function(divId){
		        //javascript写法
		        var divElement = document.getElementById(divId),
		            imgHtml    = this.setImgHeml(this.jsonData);
		        divElement.innerHTML = imgHtml;
		        /* //jQuery写法
		        var imgHtml    = this.setImgHeml(this.jsonData);
		        $('#'+divId).append(imgHtml);*/
		    },
		    //构造图片
		    setImgHeml:function(jsonData){
		        var imgHtml = '<img src=http://qr.liantu.com/api.php?';
		        imgHtml += jsonData.content?'&text='+jsonData.content:'';
		        imgHtml += jsonData.logo?'&logo='+jsonData.logo:'';
		        imgHtml += jsonData.bgColor?'&bg='+jsonData.bgColor:'';
		        imgHtml += jsonData.fgColor?'&fg='+jsonData.fgColor:'';
		        imgHtml += jsonData.gcColor?'&gc='+jsonData.gcColor:'';
		        imgHtml += jsonData.ptColor?'&pg='+jsonData.ptColor:'';
		        imgHtml += jsonData.inptColor?'&inpt='+jsonData.inptColor:'';
		        imgHtml += jsonData.eLevel?'&el='+jsonData.eLevel:'';
		        imgHtml += jsonData.w?'&w='+jsonData.w:'';
		        imgHtml += jsonData.m?'&m='+jsonData.m:'';
		        imgHtml += '>';
		        return imgHtml;
		    }
		};

		// Remove existing Order
		$scope.del = function(order) {
			var order_ = this.order;
			if ( order_ ) { 
				order_.$remove();

				for (var i in $scope.orders) {
					if ($scope.orders [i] === order_) {
						$scope.orders.splice(i, 1);
					}
				}
			} else {
				$scope.order_.$remove(function() {
					$location.path('orders');
				});
			}
		};

		// Remove existing Cart.goods
		$scope.delOrder = function(cart) {
			var order_good = this.item;

			$http.post('/orders_goods_delete', {order:$scope.order,goodId:order_good,total:order_good.price*order_good.amount}).success(function (response){
				$scope.success = true;
				if (response === 'delete success'){
					$location.path('orders');
				}
				else{
					$scope.order.detail.splice(order_good,1);
					$scope.order.total = response.total;
					$location.path('orders/' + response._id);
				}
			}).error(function (response){
				$scope.error = response.message;
			});
		};

		// modify good.amount in order
		$scope.changeAmount = function (goodId){
			var order_good = this.item.goods;
			var _amount = this.item.amount;
			var _total = this.order.total + this.item.price*_amount;
			$http.post('/orders_goods', {order:$scope.order,order_amount:_amount,goodId:order_good._id,total:_total}).success(function (response){
				$scope.success = true;
				$scope.order.total = response.total;
				$location.path('orders/' + response._id);
			}).error(function (response){
				$scope.error = response.message;
			});
		};

		// pay to alipay
		$scope.pay = function(order){
			var _odetail = this.order;
			var _gdetail = this.order.detail;

			$http.post('/order_submit',{order_detail:_odetail,goodId:_gdetail,bz:$scope.bz}).success(function (response){
				window.open(response);
			}).error(function (response){
				$scope.error = response.message;
			});
		};
	}
]);
