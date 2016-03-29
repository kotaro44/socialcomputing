'use strict';

window.getService = function(service){
	return angular.element('body').injector().get( service );
};


/* Services */
var Services = angular.module('socialcomputing.services', []);

Services.service("Apps",function($http){
	var Apps = { 
		loading: true 
	};
	$http.get('apps.json').then(function(res){
		Apps.apps = res.data.apps;    
		Apps.categories = res.data.categories;    
		delete Apps.loading;            
    });
	return Apps;
});

Services.service("Survey",function($http){
	var Survey = { 
		loading: true 
	};
	$http.get('survey.json').then(function(res){
		Survey.types = res.data.types;    
		Survey.review = res.data.review;   
		Survey.surveyA = res.data.surveyA;   
		Survey.surveyB = res.data.surveyB;   
		Survey.surveyC = res.data.surveyC;   
		delete Survey.loading;            
    });
	return Survey;
});

Services.service('Data',function($http){
	var Data = {
		"participant": {
			"name": ""
		},
		"type": 0,
		"apps": [],
		"surveyA": [],
		"surveyB": [],
		"surveyC": []
	};
	return Data;
});