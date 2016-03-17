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

Services.service('Data',function($http){
	function new_Endpoint( url , post_data ){
		return {
			url: url,
			post_data: post_data,
			callback: function(){},
			callbackError: function(){},
			transform: function( data ){
				return data;
			},
			transformBefore: function( data ){
				return data;
			},
			success: function( callback ){
				this.callback = callback;
				return this;
			},
			error: function( callback ){
				this.callbackError = callback;
				return this;
			},
			_fakeResponse: function( data ){
				var _self = this;
				setTimeout(function(){
					_self.callback( _self.transform(data)  );
				},1000);
			},
			get: function(){
				var _self = this;
				$http.get(this.url).then(function( response ){
					_self.callback( _self.transform(response) );
				},function(w,t,f){
					_self.callbackError(w,t,f);
				})
			},
			post: function( data ){
				var _self = this;
				$http.post(this.url,data).then(function(){

				},function(){

				})
			},
			put: function( data ){
				var _self = this;
				$http.put( this.url , _self.transformBefore( data ) ).then(function( response ){
					_self.callback( _self.transform(response) );
				},function(w,t,f){
					_self.callbackError(w,t,f);
				})
			}
		};
	};

	var _fakeUSer = {
		"id": "10153733372723548",
		"name": "Carlos Sanchez",
		"interested_in": "female",
		"gender": "male",
		"height": 172,
		"weight": 80,
		"country": "Honduras",
		"likes": {
			"movies_liked": ["Dawn of the Dead","Star Wars"],
			"tvshows_liked": ["The Simpsons","Vikings"]
		}
	};

	var Data = {
		//first endpoint to get the user data
		sendUser: function( user ){
			var endpoint = new_Endpoint('/user/'+user.id);
			endpoint.transform = function( response ){
				response.data.likes = response.data.likes[0];
				return response;
			};
			endpoint.get();
			return endpoint;
		},
		getLikes: function(){
			var endpoint = new_Endpoint();
			endpoint._fakeResponse({
				"genders": ["male","female","other"], 
				"interested_in": ["male","female","other","all"], 
				"movies_liked": ["Titanic","Star Wars","Dawn of the Dead","Wall-E","Toy Story","Tropa de Elite"],
				"tvshows_liked": ["Lost","The Walking Dead","The Simpsons","Futurama","Pokemon","Family Guy","Vikings"],
				"countries": ["Honduras","United States","Guatemala","Nicaragua","El Salvador"]
			});
			return endpoint;
		},
		getMovies: function(){
			var endpoint = new_Endpoint('/movies');
			endpoint.get();
			return endpoint;
		},
		getTVShows: function(){
			var endpoint = new_Endpoint('/tv_shows');
			endpoint.get();
			return endpoint;
		},
		saveUser: function( id , profile ){
			var endpoint = new_Endpoint('/user/'+id);
			endpoint.put( profile );
			return endpoint;
		},
		getMatches: function( id  ){
			var endpoint = new_Endpoint();
			endpoint._fakeResponse({
				"matches": [{
					"id":'574890965'
				}]
			});
			return endpoint;
		},
		getSuggestions: function( id , filters ){
			var endpoint = new_Endpoint('/matches/' + id + '/USER_SUGGESTIONS');
			if( filters.gender )
				endpoint.put( filters )
			else
				endpoint.get();
			return endpoint;
		},
		like: function( userId , otherId , dislike ){
			var endpoint = new_Endpoint((dislike?'/remove_match/':'/add_match/') + userId );
			endpoint.put({
				"entity_id": otherId
			});
			return endpoint;
		},
		interest: function( userId , type , id , dislike ){
			var endpoint = new_Endpoint( (dislike?'/remove_like/':'/add_like/') + userId );
			endpoint.put({
				"entity_type": type=="tvshows_liked"?"tv_show":"movie",
				"entity_id": id
			});
			return endpoint;
		}
	};
	return Data; 
});