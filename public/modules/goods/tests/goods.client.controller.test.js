'use strict';

(function() {
	// Goods Controller Spec
	describe('Goods Controller Tests', function() {
		// Initialize global variables
		var GoodsController,
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

			// Initialize the Goods controller.
			GoodsController = $controller('GoodsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Good object fetched from XHR', inject(function(Goods) {
			// Create sample Good using the Goods service
			var sampleGood = new Goods({
				name: 'New Good'
			});

			// Create a sample Goods array that includes the new Good
			var sampleGoods = [sampleGood];

			// Set GET response
			$httpBackend.expectGET('goods').respond(sampleGoods);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.goods).toEqualData(sampleGoods);
		}));

		it('$scope.findOne() should create an array with one Good object fetched from XHR using a goodId URL parameter', inject(function(Goods) {
			// Define a sample Good object
			var sampleGood = new Goods({
				name: 'New Good'
			});

			// Set the URL parameter
			$stateParams.goodId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/goods\/([0-9a-fA-F]{24})$/).respond(sampleGood);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.good).toEqualData(sampleGood);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Goods) {
			// Create a sample Good object
			var sampleGoodPostData = new Goods({
				name: 'New Good'
			});

			// Create a sample Good response
			var sampleGoodResponse = new Goods({
				_id: '525cf20451979dea2c000001',
				name: 'New Good'
			});

			// Fixture mock form input values
			scope.name = 'New Good';

			// Set POST response
			$httpBackend.expectPOST('goods', sampleGoodPostData).respond(sampleGoodResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Good was created
			expect($location.path()).toBe('/goods/' + sampleGoodResponse._id);
		}));

		it('$scope.update() should update a valid Good', inject(function(Goods) {
			// Define a sample Good put data
			var sampleGoodPutData = new Goods({
				_id: '525cf20451979dea2c000001',
				name: 'New Good'
			});

			// Mock Good in scope
			scope.good = sampleGoodPutData;

			// Set PUT response
			$httpBackend.expectPUT(/goods\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/goods/' + sampleGoodPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid goodId and remove the Good from the scope', inject(function(Goods) {
			// Create new Good object
			var sampleGood = new Goods({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Goods array and include the Good
			scope.goods = [sampleGood];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/goods\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGood);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.goods.length).toBe(0);
		}));
	});
}());