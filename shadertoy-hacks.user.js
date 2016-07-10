// ==UserScript==
// @name         Shadertoy-hacks
// @namespace    http://juhaturunen.com
// @version      0.1
// @description  Small hacks to make shadertoy.com even more awesome
// @author       Juha Turunen
// @match        https://www.shadertoy.com/view/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

	
	var altHandlers = {};
	var ctrlHandlers = {};
	altHandlers.ArrowDown = function() {
		gShaderToy.resetTime();
	};
	
	ctrlHandlers.d = function() {
		gShaderToy.mCanvas.toBlob(function(imageBlob) {		
			var l = document.createElement("a");
			l.download = document.title + ".png";
			l.href = URL.createObjectURL(imageBlob);
			document.body.appendChild(l);
			l.click();
			// Firefox requires us to let the event loop spin once before getting rid of the link and the object URL
			window.setTimeout(function() {
				document.body.removeChild(l);
				window.URL.revokeObjectURL(l.href);
			}, 0);
		});
	};
	
    window.addEventListener("load", function() {
        window.addEventListener("keydown", function(event) {
			if (event.altKey && event.key in altHandlers)
				altHandlers[event.key]();
			else if (event.ctrlKey && event.key in ctrlHandlers)
				ctrlHandlers[event.key]();
        });
    });
})();