/**
 * Angular MQTT service
 * ---------------------------
 *
 * Authored by  Vasco Santos
 *              santos.vasco10@gmail.com
 *              http://vasco-santos.github.io/
 */

var ngmqtt = angular.module('ngmqtt', []);

/*
Angular Provider ngmqtt
*/
ngmqtt.provider('ngmqtt', function () {

	var provider = {};

	provider.$get = function () {

		// Object countaing 
		var service = {};

		// MQTT Client
		var client = null;

		// Observer Pattern
		var observerCallbacksConnection = {};
		var observerCallbacksData = {};

		// Connected to broker
		var connected = false;


		// Observer Pattern callback invocation
		var notifyConnected = function () {
			angular.forEach(observerCallbacksConnection, function (value, key) {
				console.log("callback vaule: "+ value+" key: "+key)				
				value();
			})
		}

		var notifyMessage = function (topic, message) {
			angular.forEach(observerCallbacksData, function (value, key) {
				console.log("data vaule: "+ value+" key: "+key)				
				value(topic, message);
			})
		}

		// Methods provided: connect, listenConnection, listenMessage, Subscribe and Publish
		service.connect = function (mqtt_url, options) {

			if (client == null) {

				client = mqtt.connect(mqtt_url, options);
				client.on('connect', function () {
					connected = true;
					notifyConnected();
				});
				client.on('message', function (topic, message) {

					notifyMessage(topic, message);
				});
				client.on('close', function () {
					console.log("disconnected");
					client._reconnect();
				})
			}
		}

		service.listenConnection = function (source, cb) {

			if (connected) {
				cb();
			}
			else {
				observerCallbacksConnection[source] = cb;
			}
		}


		service.listenMessage = function (source, cb) {
			observerCallbacksData[source] = cb;
		}

		service.subscribe = function (topic) {
			listTopicActive.push(topic)
			client.subscribe(topic);
		}

		service.unSubscribe = function (source, topic) {
			delete	observerCallbacksConnection[source];
			delete	observerCallbacksData[source];
			client.unsubscribe(topic);
		}

		service.publish = function (topic, data) {
			client.publish(topic, data);
		}

		service.reconnect = function(){
			client._reconnect();
		}

		return service;
	};

	return provider;
});