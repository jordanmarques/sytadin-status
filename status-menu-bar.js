"use strict";

var log = require('electron-log');
const path = require('path')
const menubar = require('menubar')
const DOMParser = require('xmldom').DOMParser;
const http = require('http');

var mb = menubar()

mb.on('ready', () => {
	log.info('App is ready');
	fetchTraficJam()
	setInterval(() => {
		fetchTraficJam()
	}, 2000)
	
})

const fetchTraficJam = () => {
	log.info('Start fetch');

	http.get('http://www.sytadin.fr', (res) => {
		res.setEncoding('utf8');
  		let rawData = '';
		res.on('data', (chunk) => {rawData += chunk});
		res.on('end', () => extractTraficJam(rawData))
	})
	
}

const extractTraficJam = (body) => {
	log.info('extract');
	var parser = new DOMParser()
	var doc = parser.parseFromString(body, "text/html")
	var childs = doc.getElementById("cumul_bouchon").childNodes
	var jam = childs[3].getAttribute("alt")

	jam = jam.replace(" km", "")
	log.info('jam: ' + jam);

	displayTraficJam(jam)
}

const displayTraficJam = (jam) => {
	mb.tray.setTitle(jam + " Km")
}