'use strict';

window.getService = function(service){
	return angular.element('body').injector().get( service );
};

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-75993405-1', 'auto');
ga('send', 'pageview');


/* Services */
var Services = angular.module('socialcomputing.services', []);

Services.service('Analytics',['$http',function($http){
	this.analyzePage = function( pagename ){
		ga('send', 'pageview' , pagename );
	};
}]);

Services.service("Apps",function($http){
	var Apps = { 
		loading: true 
	};
	$http.get('apps.json').then(function(res){
		Apps.apps = res.data.apps;
		Apps.categories = res.data.categories;
		/*while(res.data.apps.length){
			Apps.apps.push( res.data.apps.splice(
				Math.floor(Math.random()*res.data.apps.length),1)[0] );
		}
		while(res.data.categories.length){
			Apps.categories.push( res.data.categories.splice(
				Math.floor(Math.random()*res.data.categories.length),1)[0] ); 
		}*/
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