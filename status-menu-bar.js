
const path = require('path')
const menubar = require('menubar')
const fetch = require('electron-fetch').default
const DOMParser = require('xmldom').DOMParser;

var mb = menubar()

mb.on('ready', () => {
  console.log('app is ready')

})

mb.on('show', () => {
	fetch('http://www.sytadin.fr')
		.then(toString)
    	.then(extractTraficJam)
    	.then(displayJam)
})

const extractTraficJam = (body) => {
	var parser = new DOMParser()
	var doc = parser.parseFromString(body, "text/html")
	var childs = doc.getElementById("cumul_bouchon").childNodes
	var jam = childs[3].getAttribute("alt")

	jam = jam.replace(" km", "")

	return new Promise(resolve => {
		resolve(jam)
	})
}

const toString = (res) => {
	return res.text()
}

const displayJam = (jam) => {
	console.log(jam)
}