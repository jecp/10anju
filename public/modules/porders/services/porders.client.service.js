'use strict';

//Porders service used to communicate Porders REST endpoints
angular.module('porders').factory('Porders', ['$resource',
	function($resource) {
		return $resource('porders/:porderId', { porderId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);