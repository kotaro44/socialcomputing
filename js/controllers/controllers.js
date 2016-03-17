'use strict';

/* Controllers */
var Controllers = angular.module('socialcomputing.controllers', []);

Controllers.controller('homeCtrl', ['$scope','$http',function($scope,$http) {

}]);

Controllers.controller('appCtrl', ['$scope','$http','Apps',function($scope,$http,Apps) {
	$scope.Apps = Apps;
	$scope.appId = window.location.href.split('?')[1];

	setTimeout(function(){
		if( $scope.appId ){
			$scope.appId = parseInt($scope.appId.split('=')[1]);
			$scope.app = $scope.Apps.apps.filter(function( app ){
				return app.id == $scope.appId;
			})[0];
			if( !$scope.app ){
				window.location = '#/';
			}
			$scope.$digest();
		}
	},50);

	$scope.download = function(){
		var toastText = 'Thank you!, we Will Notify you once your app is ready!';
		Materialize.toast($('<span><br>' + toastText + '<br><br></span>'), 4000);
		window.location = "#/app";
	};

	$scope.reject = function(){
		var toastText = 'Thank you for reporting this app!';
		Materialize.toast($('<span><br>' + toastText + '<br><br></span>'), 4000);
		window.location = "#/app";
	};
}]);
