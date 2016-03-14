'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('socialcomputing', [
  'socialcomputing.filters',
  'socialcomputing.services',
  'socialcomputing.directives',
  'socialcomputing.controllers',
  'ngRoute'
]);

app.config(['$routeProvider',function($routeProvider) {
	$routeProvider.when('/home', {
		templateUrl: 'partials/home.html',
		controller: 'homeCtrl'
	}).when('/app', {
		templateUrl: 'partials/app.html',
		controller: 'appCtrl'
	}).otherwise({
		redirectTo: '/home'
	});
}]);