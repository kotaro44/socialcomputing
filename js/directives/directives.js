'use strict';

/* Directives */
var Directives = angular.module('socialcomputing.directives', []);

Directives.directive("advdb", [function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/directive.html',
        link: function (scope, element, attributes) {

        },
        controller: ['$scope',function($scope){

        }]
    }
}]);