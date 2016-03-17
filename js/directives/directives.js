'use strict';

/* Directives */
var Directives = angular.module('socialcomputing.directives', []);

Directives.directive("marketApps", [function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/market-apps.html',
        scope: {
        	name: "=",
            cid: "=",
        	apps: "="
        },
        link: function (scope, element, attributes) {

        },
        controller: ['$scope',function($scope){

        }]
    }
}]);

Directives.directive("appPreview", [function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/app-preview.html',
        scope: {
        	app: "="
        },
        link: function (scope, element, attributes) {
            scope.appClick = function(){
                window.location = '#/app?id=' + scope.app.id;
            };
        },
        controller: ['$scope',function($scope){

        }]
    }
}]);