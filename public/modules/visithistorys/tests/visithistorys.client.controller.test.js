'use strict';

(function() {
	// Visithistorys Controller Spec
	describe('Visithistorys Controller Tests', function() {
		// Initialize global variables
		var VisithistorysController,
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

			// Initialize the Visithistorys controller.
			VisithistorysController = $controller('VisithistorysController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Visithistory object fetched from XHR', inject(function(Visithistorys) {
			// Create sample Visithistory using the Visithistorys service
			var sampleVisithistory = new Visithistorys({
				name: 'New Visithistory'
			});

			// Create a sample Visithistorys array that includes the new Visithistory
			var sampleVisithistorys = [sampleVisithistory];

			// Set GET response
			$httpBackend.expectGET('visithistorys').respond(sampleVisithistorys);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.visithistorys).toEqualData(sampleVisithistorys);
		}));

		it('$scope.findOne() should create an array with one Visithistory object fetched from XHR using a visithistoryId URL parameter', inject(function(Visithistorys) {
			// Define a sample Visithistory object
			var sampleVisithistory = new Visithistorys({
				name: 'New Visithistory'
			});

			// Set the URL parameter
			$stateParams.visithistoryId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/visithistorys\/([0-9a-fA-F]{24})$/).respond(sampleVisithistory);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.visithistory).toEqualData(sampleVisithistory);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Visithistorys) {
			// Create a sample Visithistory object
			var sampleVisithistoryPostData = new Visithistorys({
				name: 'New Visithistory'
			});

			// Create a sample Visithistory response
			var sampleVisithistoryResponse = new Visithistorys({
				_id: '525cf20451979dea2c000001',
				name: 'New Visithistory'
			});

			// Fixture mock form input values
			scope.name = 'New Visithistory';

			// Set POST response
			$httpBackend.expectPOST('visithistorys', sampleVisithistoryPostData).respond(sampleVisithistoryResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Visithistory was created
			expect($location.path()).toBe('/visithistorys/' + sampleVisithistoryResponse._id);
		}));

		it('$scope.update() should update a valid Visithistory', inject(function(Visithistorys) {
			// Define a sample Visithistory put data
			var sampleVisithistoryPutData = new Visithistorys({
				_id: '525cf20451979dea2c000001',
				name: 'New Visithistory'
			});

			// Mock Visithistory in scope
			scope.visithistory = sampleVisithistoryPutData;

			// Set PUT response
			$httpBackend.expectPUT(/visithistorys\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/visithistorys/' + sampleVisithistoryPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid visithistoryId and remove the Visithistory from the scope', inject(function(Visithistorys) {
			// Create new Visithistory object
			var sampleVisithistory = new Visithistorys({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Visithistorys array and include the Visithistory
			scope.visithistorys = [sampleVisithistory];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/visithistorys\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleVisithistory);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.visithistorys.length).toBe(0);
		}));
	});
}());