'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/goods/views/index-goods.client.view.html'
		})
		.state('help',{
			url: '/help',
			templateUrl: 'modules/core/views/help.client.view.html'
		})
		.state('protocal',{
			url: '/protocal',
			templateUrl: 'modules/core/views/protocal.client.view.html'
		})
		.state('member-rights',{
			url: '/member-rights',
			templateUrl: 'modules/core/views/member-rights.client.view.html'
		})
		.state('results',{
			url: '/results',
			templateUrl: 'modules/core/views/results.client.view.html'
		})
		.state('demo',{
			url: '/demo',
			templateUrl: 'modules/goods/views/demo.client.view.html'
		});
	}
]);
