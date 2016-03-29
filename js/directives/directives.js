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
        controller: ['$scope','Data',function($scope,Data){
            $scope.Data = Data;
            $scope.available = function( app ){
                var found = Data.apps.filter(function(a){
                    return a.id == app.id;
                });
                return found.length==0;
            };

            $scope.haveApps = $scope.apps.filter(function(a){
                    return a.category==$scope.cid&&$scope.available(a);
            }).length;
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