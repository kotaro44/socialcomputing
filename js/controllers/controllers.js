'use strict';

/* Controllers */
var Controllers = angular.module('socialcomputing.controllers', []);

window.appNumber = 15;

Controllers.controller('homeCtrl', ['$scope','$http','Data',function($scope,$http,Data) {
	$scope.inputs = {
		privacy_policy: false,
		name: ""
	};

	if( Data.participant.name )
		window.location = '#/app';

	$scope.start = function(){
		Data.participant.name = $scope.inputs.name;
		Data.type = Math.ceil(Math.random()*4);
		window.location = '#/app?id=0'
	};
}]);

Controllers.controller('endCtrl', ['$scope','$http','Data',function($scope,$http,Data) {
	$scope.surveyType = 'Z';

	if( !Data.surveyA.length || !Data.surveyB.length || !Data.surveyC.length || 
		!Data.participant.name || Data.apps.length!=window.appNumber ){
		window.location = '#/surveyBhome';
	}else{
		//SEND AND DELETE DATA!!!!!!!!!!!!!!!!!!!!
		Data.participant = {
			name: ""
		};
		Data.type = 0;
		Data.apps = [];
		Data.surveyA = [];
		Data.surveyB = [];
		Data.surveyC = [];
	}
}]);

Controllers.controller('surveyHomeCtrl', ['$scope','$http','Data',function($scope,$http,Data) {
	$scope.surveyType = window.location.href.split('#')[1].split(/(survey)|(home)/)[3];
	switch($scope.surveyType){
		case 'A': 
				if( Data.apps.length != window.appNumber )
					window.location = '#/app';
				else if( Data.surveyA.length )
					window.location = '#/surveyBhome';
			break;
		case 'B': 
				if( !Data.surveyA.length )
					window.location = '#/surveyAhome';
				else if( Data.surveyB.length )
					window.location = '#/surveyChome';
			break;
		case 'C': 
				if( !Data.surveyB.length )
					window.location = '#/surveyBhome';
			break;
		default: 
			break;
	}
}]);

Controllers.controller('surveyCtrl', ['$scope','$http','Survey','Data',function($scope,$http,Survey,Data) {
	$scope.surveyType = window.location.href.split('#')[1].split('survey')[1];
	switch($scope.surveyType){
		case 'A': 
				if( Data.apps.length != window.appNumber )
					window.location = '#/app';
				else if( Data.surveyA.length )
					window.location = '#/surveyBhome';
			break;
		case 'B': 
				if( !Data.surveyA.length )
					window.location = '#/surveyAhome';
				else if( Data.surveyB.length )
					window.location = '#/surveyChome';
			break;
		case 'C': 
				if( !Data.surveyB.length )
					window.location = '#/surveyBhome';
			break;
		default: 
			break;
	}

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

Controllers.controller('appCtrl', ['$scope','$http','Apps','Data','Survey',function($scope,$http,Apps,Data,Survey) {
	$scope.studyType = Data.type;
	$scope.Apps = Apps;
	$scope.appsToDownload = window.appNumber;
	$scope.appId = window.location.href.split('?')[1];
	
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
					Data.apps.push($scope.app.review);

					$scope.appId++;
					if( parseInt($scope.appId) >= $scope.appsToDownload){
						window.location = "#/surveyAhome";
					}else{
						window.location = "#/app?id=" + $scope.appId;
					}
				}
			}
		}
	};

	$scope.check = function(){
		if( Apps.loading || Survey.loading ){
			setTimeout($scope.check ,50);
		}else{
			

			if( parseInt($scope.appId) != Data.apps.length )
				window.location = '#/app?id=' + Data.apps.length;

			$scope.survey.questions = Survey.review;
			$scope.app = $scope.Apps.apps.filter(function( app ){
				return app.id == $scope.appId;
			})[0];

			if( !$scope.app ){
				window.location = '#/';
			}
			$scope.newApp = {
				"id": $scope.app.id,
				"downloaded": false
			}
			$scope.newSurvey = {
				"answers": []
			};

			$scope.$digest();
			setTimeout(function(){
				 $('ul.tabs').tabs();
			},50)
		}
	};

	if( !$scope.appId ) 
		window.location = '#/app?id=' + Data.apps.length;
	else {
		$scope.appId = parseInt($scope.appId.split('=')[1]);
		if( parseInt($scope.appId) >= $scope.appsToDownload)
			window.location = "#/surveyAhome";

		if( !Data.participant.name ){
			window.location = '#/home';
		}else{
			setTimeout($scope.check ,50);
		}
	}
}]);