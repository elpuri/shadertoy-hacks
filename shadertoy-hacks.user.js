// ==UserScript==
// @name         Shadertoy-hacks
// @namespace    http://juhaturunen.com
// @version      0.1
// @description  Small hacks to make shadertoy.com even more awesome
// @author       Juha Turunen
// @match        https://www.shadertoy.com/view/*
// @match        https://www.shadertoy.com/new
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var isMyShader = document.getElementById("published") !== null;
    var altHandlers = {};
    var ctrlHandlers = {};

    function extractShader() {
        var forkedShader = { 
            title: isMyShader ? document.getElementById("shaderTitle").value : document.getElementById("shaderTitle").innerText,
            tags: isMyShader ? document.getElementById("shaderTags").value : extractTags(document.querySelectorAll("#shaderTags a")),
            description: isMyShader ? document.getElementById("shaderDescription").value : document.getElementById("shaderDescription").innerText,
            passes: [] };

        gShaderToy.mEffect.mPasses.forEach(function(pass) {
            forkedShader.passes.push({
                sourceCode: pass.mSource,
                inputs: extractInputs(pass.mInputs),
                name: pass.mName
            });
        });

        window.sessionStorage.setItem("forkedShader", JSON.stringify(forkedShader));
        window.location.href = "https://shadertoy.com/new#fork";

        function extractTags(tags) {
            var tagString = "";
            tags.forEach(function(tag) {
                tagString = tagString.length > 0 ? tagString + ", " + tag.innerText : tag.innerText;
            });
            return tagString; 
        }

        function extractInputs(inputs) {
            var r = [];
            for (var i = 0; i < 4; i++) {
                if (inputs[i] !== null) {
                    var info = inputs[i].mInfo;
                    r[i] = { type: info.mType,
                            sampler: info.mSampler,
                            id: info.mID,
                            source: info.mSrc};
                } else {
                    r[i] = null;
                }
            }
            return r;
        }
    }


    function applyExtractedShader(shader) {
        var passInfos = [{ name: "Buf A", id: 0, type: "buffer" },
                         { name: "Buf B", id: 1, type: "buffer" },
                         { name: "Buf C", id: 2, type: "buffer" },
                         { name: "Buf D", id: 3, type: "buffer" },
                         { name: "Sound", id: null, type: "sound"  }];

        function applyInputs(inputs) {
            for (var i = 0; i < 4; i++) {
                if (inputs[i] !== null) {
                    var input = inputs[i];
                    gShaderToy.SetTexture(i, {
                        mType: input.type, 
                        mID: input.id,
                        mSrc: input.source,
                        mSampler: input.sampler}); 
                }
            }
        }

        // Find the main shader and deal with it first since the tab is open by default
        shader.passes.some(function(pass) {
            if (pass.name === "Image") {
                gShaderToy.mPass[0].mDocs.setValue(pass.sourceCode);
                applyInputs(pass.inputs);
                return true;
            }
            return false;
        });

        shader.passes.forEach(function(pass) {
            if (pass.name === "Image") 
                return;
            var passInfo;
            for (var i = 0; i < passInfos.length; i++) {
                if (passInfos[i].name == pass.name) {
                    passInfo = passInfos[i];
                    break;
                }
            }
            if (passInfo === undefined) {
                alert("Unknown pass type " + pass.name);
                return;
            }
            gShaderToy.AddPass(passInfo.type, passInfo.name, passInfo.id);
            gShaderToy.mPass[gShaderToy.mPass.length - 1].mDocs.setValue(pass.sourceCode);
            applyInputs(pass.inputs);
        });

        document.getElementById("shaderTags").value = shader.tags;
        document.getElementById("shaderDescription").value = "Forked from " + shader.title + " (" + document.referrer + ")\n\n" + shader.description;
    }


    // The "shaderButtons" div exists only in the viewer mode
    var shaderButtons = document.getElementById("shaderButtons");
    if (shaderButtons) {
        var forkButton = document.createElement("input");
        forkButton.className = "formButton";
        forkButton.value = "Fork";
        forkButton.addEventListener("click", extractShader);
        shaderButtons.appendChild(forkButton);
    }

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

        if (window.location.href.endsWith("#fork")) {
            var forkedShader = JSON.parse(window.sessionStorage.getItem("forkedShader"));
            applyExtractedShader(forkedShader);	
        }
    });
})();
