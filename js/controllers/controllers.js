'use strict';

/* Controllers */
var Controllers = angular.module('socialcomputing.controllers', []);

window.appNumber = 6;

Controllers.controller('homeCtrl', ['$scope','$http','Data','Analytics',
	function($scope,$http,Data,Analytics) {
	$scope.inputs = {
		privacy_policy: false,
		name: ""
	};

	if( Data.participant.name )
		window.location = '#/app';
	else
		Analytics.analyzePage('new-participant');

	$scope.start = function(){
		Data.participant.name = $scope.inputs.name;
		Data.time = {
			s: new Date()
		};
		Data.type = Math.ceil(Math.random()*4);
		window.location = '#/app?id=0';
	};
}]);

Controllers.controller('endCtrl', ['$scope','$http','Data','Analytics',
	function($scope,$http,Data,Analytics) {
	$scope.surveyType = 'Z';

	if( !Data.surveyA.length || !Data.surveyB.length || !Data.surveyC.length || 
		!Data.participant.name || Data.apps.length!=window.appNumber ){
		Analytics.analyzePage('havent-finish');
		window.location = '#/surveyBhome';
	}else{
		Analytics.analyzePage('survey-complete');
		Data.apps = Data.apps.map(function(a){
			return a.review;
		});
		Data.time.t = (((new Date()).getTime() - Data.time.s.getTime())/1000)/60;
		Data.time.s = Data.time.s.toGMTString();

		console.log( JSON.stringify(Data) );

		//SEND AND DELETE DATA!!!!!!!!!!!!!!!!!!!!

		var url = 'https://script.google.com/macros/s/AKfycbxOfx7_kjCDYHXfYfVzoJDIsy0WOf-GJYMgOwWc0CW7P93g3ts/exec?data=' + JSON.stringify(Data);

		window.open(url);
	
		Data.participant = {
			name: ""
		};
		Data.type = 0;
		Data.apps = [];
		Data.surveyA = [];
		Data.surveyB = [];
		Data.surveyC = [];
		Data.time = {};
	}
}]);

Controllers.controller('surveyHomeCtrl', ['$scope','$http','Data','Analytics',
	function($scope,$http,Data,Analytics) {
	$scope.surveyType = window.location.href.split('#')[1].split(/(survey)|(home)/)[3];
	switch($scope.surveyType){
		case 'A': 
				if( Data.apps.length != window.appNumber )
					window.location = '#/app';
				else if( Data.surveyA.length )
					window.location = '#/surveyBhome';
				else {
					//Order apps by Id
					Data.apps = Data.apps.sort(function(a,b){
						return a.id - b.id;
					});
					console.log(Data);
					Analytics.analyzePage('survey-A-home');
				}
			break;
		case 'B': 
				if( !Data.surveyA.length )
					window.location = '#/surveyAhome';
				else if( Data.surveyB.length )
					window.location = '#/surveyChome';
				else
					Analytics.analyzePage('survey-B-home');
			break;
		case 'C': 
				if( !Data.surveyB.length )
					window.location = '#/surveyBhome';
				else
					Analytics.analyzePage('survey-C-home');
			break;
		default: 
			break;
	}
}]);

Controllers.controller('surveyCtrl', ['$scope','$http','Survey','Data','Analytics',
	function($scope,$http,Survey,Data,Analytics) {
	$scope.surveyType = window.location.href.split('#')[1].split('survey')[1];
	switch($scope.surveyType){
		case 'A': 
				if( Data.apps.length != window.appNumber )
					window.location = '#/app';
				else if( Data.surveyA.length )
					window.location = '#/surveyBhome';
				else
					Analytics.analyzePage('survey-A-starts');
			break;
		case 'B': 
				if( !Data.surveyA.length )
					window.location = '#/surveyAhome';
				else if( Data.surveyB.length )
					window.location = '#/surveyChome';
				else
					Analytics.analyzePage('survey-B-starts');
			break;
		case 'C': 
				if( !Data.surveyB.length )
					window.location = '#/surveyBhome';
				else
					Analytics.analyzePage('survey-C-starts');
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
				Analytics.analyzePage('survey-' + $scope.surveyType + '-q' + $scope.survey.show );
				$scope.newSurvey.answers.push( { 
					a: ans , 
					t: $scope.survey.questions[$scope.survey.show].type
				});
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

Controllers.controller('appCtrl', ['$scope','$http','Apps','Data','Survey','Analytics',
	function($scope,$http,Apps,Data,Survey,Analytics) {
	$scope.studyType = Data.type;
	$scope.Apps = Apps;
	$scope.appsToDownload = window.appNumber;
	$scope.appId = parseInt(window.location.href.match(/\#\/([0-9]*)/)[1]);

	$scope.check = function(){
		if( Apps.loading || Survey.loading ){
			setTimeout($scope.check ,50);
		}else{
			$scope.type = Math.floor(($scope.appId-1)%$scope.Apps.apps.length);
			$scope.appId = Math.floor(($scope.appId-1)/$scope.Apps.apps.length);
			$scope.app = $scope.Apps.apps[$scope.appId];

			$scope.$digest();
			setTimeout(function(){
				 $('ul.tabs').tabs();
				 setTimeout(function(){
					$(window).resize();
				 },50);
			},50)
		}
	};

	$scope.tabChanged = function(){
		console.log('hols');
	};

	if( !$scope.appId || $scope.appId > 16 ){
		window.location = '#/1';
	}else{
		setTimeout($scope.check ,50);	
	}
}]);