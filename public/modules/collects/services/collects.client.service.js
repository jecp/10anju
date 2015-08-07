'use strict';

//Collects service used to communicate Collects REST endpoints
angular.module('collects').factory('Collects', ['$resource',
	function($resource) {
		return $resource('collects/:collectId', { collectId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);