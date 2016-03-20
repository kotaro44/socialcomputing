'use strict';

/* Controllers */
var Controllers = angular.module('socialcomputing.controllers', []);

Controllers.controller('homeCtrl', ['$scope','$http',function($scope,$http) {

}]);

Controllers.controller('endCtrl', ['$scope','$http','Data',function($scope,$http,Data) {
	$scope.surveyType = 'Z';
	//sent and delete Data
	Data.Apps = [];
	Data.survey = [];
	Data.surveyA = [];
	Data.surveyB = [];
	Data.surveyC = [];
}]);

Controllers.controller('surveyHomeCtrl', ['$scope','$http',function($scope,$http) {
	$scope.surveyType = window.location.href.split('#')[1].split(/(survey)|(home)/)[3];
}]);

Controllers.controller('reviewCtrl', ['$scope','$http','Survey','Data',
	function($scope,$http,Survey,Data) {
	$scope.appId = window.location.href.split('?')[1];
	if( !$scope.appId )
		window.location = "#/app";
	$scope.appId = parseInt($scope.appId.split('=')[1]);

	$scope.app = Data.Apps.filter(function(a){
		return a.id == $scope.appId;
	})[0];

	if( !$scope.app )
		window.location = "#/app";

	$scope.survey = {
		questions: null,
		show: 0,
		submit: function(){
			var ans = $("input[name=q" + $scope.survey.show + "]:checked").attr('index');
			if( !ans ){
				Materialize.toast("Please select an answer",4000);
			}else{
				$scope.newSurvey.answers.push( ans );
				$scope.survey.show++;
				$("input:checked").attr('checked',null);
				if( $scope.survey.show >= $scope.survey.questions.length ){
					$scope.app.review = $scope.newSurvey.answers;
					window.location = "#/app";
				}
			}
		}
	};
	$scope.newSurvey = {
		"answers": []
	};

	$scope.check = function(){
		if( Survey.loading ){
			setTimeout($scope.check ,50);
		}else{
			$scope.survey.questions = Survey.review;
			$scope.$digest();
		}
	}
	setTimeout($scope.check ,50);
}]);

Controllers.controller('surveyCtrl', ['$scope','$http','Survey','Data',function($scope,$http,Survey,Data) {
	/*if( Data.Apps.length != 5 )
		window.location = '#/app';*/

	$scope.surveyType = window.location.href.split('#')[1].split('survey')[1];

	$scope.survey = {
		questions: null,
		show: 0,
		submit: function(){
			var cont = false;
			var ans = null;
			switch( $scope.survey.questions[$scope.survey.show].type ){
				case 0:
						ans = $("input[name=q" + $scope.survey.show + "]:checked").attr('index');
						if( ans )
							cont = true;
						else
							Materialize.toast("Please select an answer",4000);
					break;
				case 1:
						ans = $('input:checked').toArray().map(function( a ){
							return $(a).attr("index")
						});

						if( ans.length )
							cont = true;
						else 
							Materialize.toast("Please select at least one option",4000);
					break;
				case 2:
						ans = $('input:checked').toArray().map(function(a){
						   return $(a).attr("index")
						});

						if( ans.length == $scope.survey.questions[$scope.survey.show].answers.length )
							cont = true;
						else 
							Materialize.toast("Please choose a value for every Item",4000);
					break;
			}

			if( cont ){
				$scope.newSurvey.answers.push( ans );
				$scope.survey.show++;
				$("input:checked").attr('checked',null);
				if( $scope.survey.show >= $scope.survey.questions.length ){
					Data["survey" + $scope.surveyType] = $scope.newSurvey.answers;

					switch( $scope.surveyType ){
						case 'A':
								window.location.href = '#/surveyBhome';
							break;
						case 'B':
								window.location.href = '#/surveyChome';
							break;
						case 'C':
								window.location.href = '#/end';
							break;
					}
				}
			}
		}
	};

	$scope.newSurvey = {
		"answers": []
	};

	$scope.check = function(){
		if( Survey.loading ){
			setTimeout($scope.check ,50);
		}else{
			$scope.survey.questions = Survey["survey" + $scope.surveyType];
			$scope.$digest();
		}
	}
	setTimeout($scope.check ,50);
}]);

Controllers.controller('appCtrl', ['$scope','$http','Apps','Data',function($scope,$http,Apps,Data) {
	$scope.Apps = Apps;
	$scope.appId = window.location.href.split('?')[1];
	$scope.appsToDownload = 5;

	$scope.download = function(){
		$scope.newApp.downloaded = true;
		var toastText = 'Thank you!, we Will Notify you once your app is ready!';
		Materialize.toast($('<span><br>' + toastText + '<br><br></span>'), 4000);
		Data.Apps.push($scope.newApp);
		window.location = "#/review?id="+$scope.newApp.id;
	};

	$scope.reject = function(){
		var toastText = 'Thank you for reporting this app!';
		Materialize.toast($('<span><br>' + toastText + '<br><br></span>'), 4000);
		Data.Apps.push($scope.newApp);
		window.location = "#/review?id="+$scope.newApp.id;
	};

	$scope.check = function(){
		if( Apps.loading ){
			setTimeout($scope.check ,50);
		}else{
			if( $scope.appId ){
				$scope.appId = parseInt($scope.appId.split('=')[1]);
				$scope.app = $scope.Apps.apps.filter(function( app ){
					return app.id == $scope.appId;
				})[0];
				if( !$scope.app ){
					window.location = '#/';
				}
				$scope.$digest();
				$scope.newApp = {
					"id": $scope.app.id,
					"downloaded": false
				}
			}else{
				var val = ($scope.appsToDownload-Data.Apps.length);
				if( val <= 0 ){
					window.location = '#/surveyAhome';
				}else{
					Materialize.toast('Please select an App (' + 
						val + ' app' + (val==1?'':'s') + ' remaining)' , 4000);
				}
			}
		}
	}
	setTimeout($scope.check ,50);
}]);
