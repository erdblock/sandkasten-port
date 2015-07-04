/* @flow */

var http = require("http")
var serverDestroy = require("server-destroy")
var is = require("is_js")

module.exports = function(){
	var app = {}
	app.config = {
		port: {
			label: 'Port',
			value: '',
			setValue: function(v){
				this.value = this.setter(v)
				app.reload()
			},
			setter: function(v){
				return parseInt(v)
			},
			type: 'text',
			isValid: function(v){
				if (is.not.number(parseInt(v))){
					return "value must be a number"
				} else if (parseInt(v) <= 1023){
					return "smaller than 1024"
				} else {
					return null
				}
			}
		}
	}

	app.title = "Port"
	app.status = { code: "danger", msg: "Not started yet." }

	app.setErdblock = function(e){
		app.erdblock = e
		app.reload()
	}

	app.reload = function(){
		if(app.server){
			app.close()
		}
		app.newServer()
	}

	app.close = function(){
		app.server.destroy()
		app.server.close()
	}

	app.newServer = function(){
		console.log("new server on " + app.config.port.value)
		app.server = http.createServer(app.erdblock)
		app.server.on("error", function(err){
			if(err.code === "EADDRINUSE"){
				app.status = { code: "danger", msg: "Port is already used." }
			} else {
				app.status = { code: "danger", msg: "Unknown Error" }
				console.log(err)
			}
		})
		app.server.on("listening", function(err){
			app.status = { code: "info", msg: "Started."}
		})

		app.server.listen(app.config.port.value)
		serverDestroy(app.server)
	}

	return app
}
