var Nightmare = require('nightmare');
var firebase = require("firebase");

firebase.initializeApp({
  databaseURL: "https://shield-5ec91.firebaseio.com/",
  serviceAccount: "ShieldSA.json"
});

var ref = firebase.database().ref('Sites');

var urls = [];
var selectors = [];

ref.orderByKey().on("value", function(snapshot) {
	snapshot.forEach(function(data) {
		data.forEach(function(pages) {
			urls.push(pages.child('url').val());
			pages.forEach(function(sel){
				var subSelectors = [];
				sel.forEach(function(numbers){
					subSelectors.push(numbers.child('selector').val());
				});
				if(subSelectors[0] != null){
					selectors.push(subSelectors);
				}
			});
		});
	});
	callAccess();
});

function callAccess(){
	for(var count = 0; count < urls.length; count++){
		Access(count);
	}
}

function Access(index){
	var nightmare = Nightmare({show:false});
	nightmare
		.goto(urls[index])
		.evaluate(function(selector){
			var temp = [];
			for(var count = 0; count < selector.length; count++){
				var subTemp = [];
				subTemp.push(document.URL);
				subTemp.push(selector[count]);
				if(document.querySelector(selector[count]) != null){
					subTemp.push(true);
				} else {
					subTemp.push(false);
				}
				temp.push(subTemp);
			}
			return temp;
		}, selectors[index])
		
		.then(function(result){
			console.log('\n');
			for(var count2 = 0; count2 < result.length; count2++){
				
				if(result[count2][2] != false){
					console.log('Seletor ' + result[count2][1] + ' encontrado em ' + result[count2][0]);
				} else {
					console.log('Seletor ' + result[count2][1] + ' não encontrado em ' + result[count2][0]);
				}
			}
		})
		.catch(function (error) {
			console.error('Search failed:', error);
		});
}

