var fs = require('fs');
var app_amount = 6;
var json_file = '../survey.json';


var result = ["name","type"];
fs.readFile(json_file, 'utf8', function (err, data) {
  	var survey = JSON.parse(data);
  	for( var a  = 1 ; a <= app_amount ; a++ ){
	  	for( var i = 0 ; i < survey.review.length ; i++ ){
	  		result.push("app-" + a + "-q" + i );
	  	}
	}

	var survey_type = ['A','B','C'];
	for( var a  = 0 ; a < survey_type.length ; a++ ){
	  	for( var i = 0 ; i < survey['survey'+survey_type[a]].length ; i++ ){
	  		if( survey['survey'+survey_type[a]][i].type == 2 ){
	  			for( var opt = 0 ; opt < survey['survey'+survey_type[a]][i].answers.length ; opt++ )
		  			result.push("Q" + i + "(" + 
		  				survey['survey'+survey_type[a]][i].answers[opt].replace(/\,/g,";") + ")" );
	  		}else{
	  			result.push("Q" + i );
	  		}
	  	}
	}
	
	fs.writeFile("columns.csv", result , function(err) {
		if(err) {
			return console.log(err);
		}
		console.log("The file was saved!");
	}); 
});