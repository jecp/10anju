'use strict';

(function() {
	// Porders Controller Spec
	describe('Porders Controller Tests', function() {
		// Initialize global variables
		var PordersController,
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

			// Initialize the Porders controller.
			PordersController = $controller('PordersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Porder object fetched from XHR', inject(function(Porders) {
			// Create sample Porder using the Porders service
			var samplePorder = new Porders({
				name: 'New Porder'
			});

			// Create a sample Porders array that includes the new Porder
			var samplePorders = [samplePorder];

			// Set GET response
			$httpBackend.expectGET('porders').respond(samplePorders);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.porders).toEqualData(samplePorders);
		}));

		it('$scope.findOne() should create an array with one Porder object fetched from XHR using a porderId URL parameter', inject(function(Porders) {
			// Define a sample Porder object
			var samplePorder = new Porders({
				name: 'New Porder'
			});

			// Set the URL parameter
			$stateParams.porderId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/porders\/([0-9a-fA-F]{24})$/).respond(samplePorder);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.porder).toEqualData(samplePorder);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Porders) {
			// Create a sample Porder object
			var samplePorderPostData = new Porders({
				name: 'New Porder'
			});

			// Create a sample Porder response
			var samplePorderResponse = new Porders({
				_id: '525cf20451979dea2c000001',
				name: 'New Porder'
			});

			// Fixture mock form input values
			scope.name = 'New Porder';

			// Set POST response
			$httpBackend.expectPOST('porders', samplePorderPostData).respond(samplePorderResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Porder was created
			expect($location.path()).toBe('/porders/' + samplePorderResponse._id);
		}));

		it('$scope.update() should update a valid Porder', inject(function(Porders) {
			// Define a sample Porder put data
			var samplePorderPutData = new Porders({
				_id: '525cf20451979dea2c000001',
				name: 'New Porder'
			});

			// Mock Porder in scope
			scope.porder = samplePorderPutData;

			// Set PUT response
			$httpBackend.expectPUT(/porders\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/porders/' + samplePorderPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid porderId and remove the Porder from the scope', inject(function(Porders) {
			// Create new Porder object
			var samplePorder = new Porders({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Porders array and include the Porder
			scope.porders = [samplePorder];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/porders\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePorder);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.porders.length).toBe(0);
		}));
	});
}());