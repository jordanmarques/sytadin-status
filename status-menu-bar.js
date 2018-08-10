
require("babel-polyfill")
var log = require('electron-log');
const path = require('path')
const menubar = require('menubar')
const fetch = require('electron-fetch').default
const DOMParser = require('xmldom').DOMParser;

var mb = menubar()

mb.on('ready', () => {
	log.info('App is ready');
	fetchTraficJam().then(displayTraficJam)
	setInterval(() => {
		fetchTraficJam().then(displayTraficJam)
	}, 60000)
	
})

const fetchTraficJam = () => {
	log.info('Start fetch');
	return fetch('http://www.sytadin.fr', {headers: {Accept: 'application/json'}})
		.then(toString)
    	.then(extractTraficJam)
}

const toString = (res) => {
	log.info('toString');
	return res.text()
}

const extractTraficJam = (body) => {
	log.info('extract');
	var parser = new DOMParser()
	var doc = parser.parseFromString(body, "text/html")
	var childs = doc.getElementById("cumul_bouchon").childNodes
	var jam = childs[3].getAttribute("alt")

	jam = jam.replace(" km", "")
	log.info('jam: ' + jam);

	return new Promise(resolve => resolve(jam))
}

const displayTraficJam = (jam) => {
	mb.tray.setTitle(jam + " Km")
}