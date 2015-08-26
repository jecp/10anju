'use strict';

//Setting up route
angular.module('orders').config(['$stateProvider',
	function($stateProvider) {
		// Orders state routing
		$stateProvider.
		state('listOrders', {
			url: '/orders',
			templateUrl: 'modules/orders/views/list-orders.client.view.html'
		}).
		state('createOrder', {
			url: '/orders/create',
			templateUrl: 'modules/orders/views/create-order.client.view.html'
		}).
		state('viewOrder', {
			url: '/orders/:orderId',
			templateUrl: 'modules/orders/views/view-order.client.view.html'
		}).
		state('adminListOrders', {
			url:'/orders/admin/list',
			templateUrl: 'modules/orders/views/admin-list-orders.client.view.html'
		}).
		state('printOrder', {
			url: '/order_print/:orderId',
			templateUrl: 'modules/orders/views/print-order.client.view.html'
		});
	}
]);
