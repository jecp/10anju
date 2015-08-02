'use strict';

(function() {
	// Ccenters Controller Spec
	describe('Ccenters Controller Tests', function() {
		// Initialize global variables
		var CcentersController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Ccenters controller.
			CcentersController = $controller('CcentersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Ccenter object fetched from XHR', inject(function(Ccenters) {
			// Create sample Ccenter using the Ccenters service
			var sampleCcenter = new Ccenters({
				name: 'New Ccenter'
			});

			// Create a sample Ccenters array that includes the new Ccenter
			var sampleCcenters = [sampleCcenter];

			// Set GET response
			$httpBackend.expectGET('ccenters').respond(sampleCcenters);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ccenters).toEqualData(sampleCcenters);
		}));

		it('$scope.findOne() should create an array with one Ccenter object fetched from XHR using a ccenterId URL parameter', inject(function(Ccenters) {
			// Define a sample Ccenter object
			var sampleCcenter = new Ccenters({
				name: 'New Ccenter'
			});

			// Set the URL parameter
			$stateParams.ccenterId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/ccenters\/([0-9a-fA-F]{24})$/).respond(sampleCcenter);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ccenter).toEqualData(sampleCcenter);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Ccenters) {
			// Create a sample Ccenter object
			var sampleCcenterPostData = new Ccenters({
				name: 'New Ccenter'
			});

			// Create a sample Ccenter response
			var sampleCcenterResponse = new Ccenters({
				_id: '525cf20451979dea2c000001',
				name: 'New Ccenter'
			});

			// Fixture mock form input values
			scope.name = 'New Ccenter';

			// Set POST response
			$httpBackend.expectPOST('ccenters', sampleCcenterPostData).respond(sampleCcenterResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Ccenter was created
			expect($location.path()).toBe('/ccenters/' + sampleCcenterResponse._id);
		}));

		it('$scope.update() should update a valid Ccenter', inject(function(Ccenters) {
			// Define a sample Ccenter put data
			var sampleCcenterPutData = new Ccenters({
				_id: '525cf20451979dea2c000001',
				name: 'New Ccenter'
			});

			// Mock Ccenter in scope
			scope.ccenter = sampleCcenterPutData;

			// Set PUT response
			$httpBackend.expectPUT(/ccenters\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/ccenters/' + sampleCcenterPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid ccenterId and remove the Ccenter from the scope', inject(function(Ccenters) {
			// Create new Ccenter object
			var sampleCcenter = new Ccenters({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Ccenters array and include the Ccenter
			scope.ccenters = [sampleCcenter];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/ccenters\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCcenter);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.ccenters.length).toBe(0);
		}));
	});
}());