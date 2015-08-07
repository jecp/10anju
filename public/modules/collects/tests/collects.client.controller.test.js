'use strict';

(function() {
	// Collects Controller Spec
	describe('Collects Controller Tests', function() {
		// Initialize global variables
		var CollectsController,
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

			// Initialize the Collects controller.
			CollectsController = $controller('CollectsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Collect object fetched from XHR', inject(function(Collects) {
			// Create sample Collect using the Collects service
			var sampleCollect = new Collects({
				name: 'New Collect'
			});

			// Create a sample Collects array that includes the new Collect
			var sampleCollects = [sampleCollect];

			// Set GET response
			$httpBackend.expectGET('collects').respond(sampleCollects);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.collects).toEqualData(sampleCollects);
		}));

		it('$scope.findOne() should create an array with one Collect object fetched from XHR using a collectId URL parameter', inject(function(Collects) {
			// Define a sample Collect object
			var sampleCollect = new Collects({
				name: 'New Collect'
			});

			// Set the URL parameter
			$stateParams.collectId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/collects\/([0-9a-fA-F]{24})$/).respond(sampleCollect);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.collect).toEqualData(sampleCollect);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Collects) {
			// Create a sample Collect object
			var sampleCollectPostData = new Collects({
				name: 'New Collect'
			});

			// Create a sample Collect response
			var sampleCollectResponse = new Collects({
				_id: '525cf20451979dea2c000001',
				name: 'New Collect'
			});

			// Fixture mock form input values
			scope.name = 'New Collect';

			// Set POST response
			$httpBackend.expectPOST('collects', sampleCollectPostData).respond(sampleCollectResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Collect was created
			expect($location.path()).toBe('/collects/' + sampleCollectResponse._id);
		}));

		it('$scope.update() should update a valid Collect', inject(function(Collects) {
			// Define a sample Collect put data
			var sampleCollectPutData = new Collects({
				_id: '525cf20451979dea2c000001',
				name: 'New Collect'
			});

			// Mock Collect in scope
			scope.collect = sampleCollectPutData;

			// Set PUT response
			$httpBackend.expectPUT(/collects\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/collects/' + sampleCollectPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid collectId and remove the Collect from the scope', inject(function(Collects) {
			// Create new Collect object
			var sampleCollect = new Collects({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Collects array and include the Collect
			scope.collects = [sampleCollect];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/collects\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCollect);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.collects.length).toBe(0);
		}));
	});
}());