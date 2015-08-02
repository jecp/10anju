'use strict';

//Ccenters service used to communicate Ccenters REST endpoints
angular.module('ccenters').factory('Ccenters', ['$resource',
	function($resource) {
		return $resource('ccenters/:ccenterId', { ccenterId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);