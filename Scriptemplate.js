/**
 * Copyright (c) 2013 Robert Liota
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to use,
 * copy, modify, merge, publish, and distribute copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the following 
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * Adapted from The MIT License (MIT)
 * 
 */

var ScriptemplateEngine = function(){
	function appendClass(cls, node){
		if(node){
			if(node.className.length > 0){
				node.className = node.className+=(" "+cls);
			}else{
				node.className = cls;
			}
		}
	}
	
	function getData(dataPathArray){
		var data = dataSource;
		for(var accessor=0; accessor < dataPathArray.length; accessor++){
			data = data[dataPathArray[accessor]];
		}
		return data;
	}

	function getContext(startingContext, dataPathArray){
		var modifiedContextObj = startingContext;
		for(var i=0; i < dataPathArray.length; i++){
			if(dataPathArray[i] === "^"){
				modifiedContextObj = modifiedContextObj.parent;
			}else if(modifiedContextObj.data[dataPathArray[i]]){
				var newModifiedContextObj = {
					data: modifiedContextObj.data[dataPathArray[i]],
					key: dataPathArray[i],
					parent: modifiedContextObj
				};
				modifiedContextObj = newModifiedContextObj;
			}else if(dataPathArray[i]){
				var newModifiedContextObj = {
					data: {},
					key: "",
					parent: modifiedContextObj
				};
				modifiedContextObj = newModifiedContextObj;
			}
		}
		return modifiedContextObj;
	}

	function parseTextString(str, currentContext){
		var dataTags = str.match(/{.+?}/g);
		var transformedText = str;
		if(dataTags){
			var replacements = {};
			for(var i=0; i < dataTags.length; i++){ // for each data path
				replacements[dataTags[i]] = "";
				var dataPath = dataTags[i].replace(/[{}]/g, ''); //is a '.' delimited string describing the path of a data element we want to apply to the tag.
				dataAccessor = dataPath.split('.');
				if(dataAccessor.length > 0){
					if(dataAccessor[0] === "" || dataAccessor[0] === "^"){
						replacements[dataTags[i]] = getContext(currentContext, dataAccessor).data;
					}else{
						replacements[dataTags[i]] = getData(dataAccessor);
					}
				}
			}
			for(var tagSignature in replacements){
				var tagSignatureRegExp = new RegExp(tagSignature.replace(/\^/g, '\\^'), 'g');
				transformedText = transformedText.replace(tagSignatureRegExp, replacements[tagSignature]);
			}
		}
		return transformedText;
	}

	function buildTextNode(text, currentContext){
		var transformedText = "";
		if(typeof text == "function"){
			transformedText = text(currentContext, dataSource);
		}else if(typeof text == "string"){
			transformedText = parseTextString(text, currentContext);
		}
		if(transformedText){
			return document.createTextNode(transformedText);
		}
	}

	function buildNode(templateNode, currentContext){
		var node = null;
		
		if(templateNode.context){
			var newContextDataPath = templateNode.context.split('.');
			currentContext = getContext(currentContext, newContextDataPath);
		}
		
		if(templateNode.tag){
			node = document.createElement(templateNode.tag);
			if(templateNode.id){
				node.id = templateNode.id;
			}
			if(templateNode.text){
				node.appendChild(buildTextNode(templateNode.text, currentContext));
			}
		}else if(templateNode.text){
			node = buildTextNode(templateNode.text, currentContext);
		}
		
		if(templateNode.cls){
			var cls = templateNode.cls;
			if(typeof cls == "string"){
				appendClass(cls, node);
			}else if(typeof cls == "function"){
				appendClass(cls(currentContext, DataSource));
			}
		}
		
		var childTemplates = templateNode.children ? templateNode.children : [];
		var childNodes = [];
		for(var i=0; i<childTemplates.length; i++){
			var builtNodes = prebuildNodes(childTemplates[i], currentContext);
			for(var n=0; n<builtNodes.length; n++){
				childNodes.push(builtNodes[n]);
			}
		}
		for(var i=0; i<childNodes.length; i++){
			node.appendChild(childNodes[i]);
		}
		return node;
	}

	function prebuildNodes(templateNode, currentContext){
		var nodes = [];
		if(templateNode.repeatFor){
			var repeaterContextString = templateNode.repeatFor;
			var repeaterDataPath = repeaterContextString.split('.');
			var repeaterContext = getContext(currentContext, repeaterDataPath);
			if(typeof repeaterContext.data == "object"){
				for(var accessor in repeaterContext.data){
					var indexContext = {
						parent: currentContext,
						data: repeaterContext.data[accessor],
						key: accessor
					};
					nodes.push(buildNode(templateNode, indexContext));
				}
			}else{
				for(var accessor=0; accessor<repeaterContext.data.length; accessor++){
					var indexContext = {
						parent: currentContext,
						data: repeaterContext.data[accessor],
						key: accessor
					};
					nodes.push(buildNode(childTemplate, indexContext));
				}
			}
		}else{
			nodes.push(buildNode(templateNode, currentContext));
		}
		return nodes;
		
	}

	this.bind = function(template, dataSource){
		this.dataSource = dataSource;
		var nodes = [];
		var rootContext = {
			data: dataSource
		};
		if(typeof template == "array"){
			for(var i=0; i<template.length; i++){
				var builtNodes = prebuildNodes(template[i], rootContext);
				for(var n=0; n<builtNodes.length; n++){
					nodes.push(builtNodes[n]);
				}
			}
		}else{
			var builtNodes = prebuildNodes(template, rootContext);
			for(var n=0; n<builtNodes.length; n++){
				nodes.push(builtNodes[n]);
			}
		}
		return nodes;
	};
};