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
	}).when('/surveyAhome', {
		templateUrl: 'partials/home.html',
		controller: 'surveyHomeCtrl'
	}).when('/surveyBhome', {
		templateUrl: 'partials/home.html',
		controller: 'surveyHomeCtrl'
	}).when('/surveyChome', {
		templateUrl: 'partials/home.html',
		controller: 'surveyHomeCtrl'
	}).when('/app', {
		templateUrl: 'partials/app.html',
		controller: 'appCtrl'
	}).when('/end', {
		templateUrl: 'partials/home.html',
		controller: 'endCtrl'
	}).when('/surveyA', {
		templateUrl: 'partials/survey.html',
		controller: 'surveyCtrl'
	}).when('/surveyB', {
		templateUrl: 'partials/survey.html',
		controller: 'surveyCtrl'
	}).when('/surveyC', {
		templateUrl: 'partials/survey.html',
		controller: 'surveyCtrl'
	}).otherwise({
		redirectTo: '/home'
	});
}]);