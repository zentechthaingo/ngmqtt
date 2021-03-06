/**
 * Angular Test Application for ngmqtt
 * ---------------------------
 *
 * Authored by  Vasco Santos
 *              santos.vasco10@gmail.com
 *              http://vasco-santos.github.io/
 */

/*
Create Angular Application
*/
var app = angular.module("testMQTT", ['ngmqtt']).run(function () {

	console.log("Angular application started");
});

/*
Test Controller 1
*/
app.controller('testController1', ['$scope', '$interval', 'ngmqtt', function ($scope, $interval, ngmqtt) {

	var options = {
		clientId: "test",
		protocolId: 'MQTT',
		protocolVersion: 4
	};
	ngmqtt.connect('wss://iot.eclipse.org:443/ws', options);
	//ngmqtt.subscribe('topic4test');

	ngmqtt.listenConnection("testController1", function () {
		console.log("connected");
		ngmqtt.subscribe('topic4test');

		var i = 0;
		$interval(function() {
			ngmqtt.publish('topic4test', i.toString());
			i++;
		}, 5000);
	});

	ngmqtt.listenMessage("testController1", function (topic, message) {
		console.log("message received (Controller 1)");
		console.log(topic + ": " + message);
	});


	$scope.un = function () {
		console.log("unSub");
		ngmqtt.unSubscribe('topic4test');
	}

	$scope.sub = function () {
		console.log("Sub");
		ngmqtt.subscribe('topic4test');
	}

	$scope.rec = function () {
		console.log("reconnect");
		ngmqtt.reconnect();
	}


}]);

/*
Test Controller 2
*/
app.controller('testController2', ['$scope', '$interval', 'ngmqtt', function ($scope, $interval, ngmqtt) {

	ngmqtt.listenConnection("testController2", function(){
		console.log("connected (Controller 2)");
		ngmqtt.subscribe('topic4test');
		var i = 0;
		$interval(function() {
			ngmqtt.publish('topic4test', i.toString());
			i++;
		}, 5000);
	});

	ngmqtt.listenMessage("testController2", function(topic, message){
		console.log("message received (Controller 2)");
		console.log(topic + ": " + message);
	});
}]);