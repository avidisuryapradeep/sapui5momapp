sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.accenture.mom.MOM.controller.Home", {
		onInit: function () {
//	this.displayPrinterFrg();
			//this.onRecordPressMain();
			this.fileName = "";
			this.isReqtedPermission = 0;
			this.noteContent="";
			try {
			  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
			  this.recognition = new SpeechRecognition();
			}
			catch(e) {
			  this.messageDisplay("Your Device is not supporing this feature");
			}
			this.recognition.continuous = true;
			this.recognition.onerror = $.proxy(function(event) {
			  if(event.error == 'no-speech') {
				this.getView().byId('idText').setText('No speech was detected. Try again.');  
			  };
			}, this);
			this.recognition.onresult = $.proxy(function(event) {

			  // event is a SpeechRecognitionEvent object.
			  // It holds all the lines we have captured so far. 
			  // We only need the current one.
			  var current = event.resultIndex;

			  // Get a transcript of what was said.
			  this.transcript = event.results[current][0].transcript;

			  // Add the current transcript to the contents of our Note.
			  // There is a weird bug on mobile, where everything is repeated twice.
			  // There is no official solution so far so we have to handle an edge case.
			  var mobileRepeatBug = (current == 1 && this.transcript == event.results[0][0].transcript);

			  if(!mobileRepeatBug) {
				this.noteContent += this.transcript;
				this.getView().byId('idTextArea').setValue(this.noteContent);
				//noteTextarea.val(noteContent);
			  }
			  this.getView().byId('idRecordBtn').firePress();
			}, this);
			this.recognition.onstart = $.proxy(function() { 
			  this.getView().byId('idText').setText('Voice recognition activated. Try speaking into the microphone.');
			}, this);

			this.recognition.onspeechend = $.proxy(function() {
			//	this.recognition.stop();
				this.getView().byId('idText').setText('You were quiet for a while so voice recognition turned itself off.');
			//	this.recognition.start();
			}, this);
		//	var url = "https://hanadbtrail1p2001686617trial.hanatrial.ondemand.com/App_OData/OData/cart.xsodata";
		var url = "https://hanadbtrail1p2001686617trial.hanatrial.ondemand.com/App_ODataV2/ODataV2/cart.xsodata";
			var oModel = new sap.ui.model.odata.ODataModel(url);
			oModel.read("/Product", {
 success: $.proxy(function (data) {
                       console.log(data);
                    }, this),
                    error: $.proxy(function (e) {
                        console.log(e);
                    }, this)
                });

		},
		onSettingPress: function(){
			this.displayPrinterFrg();
			//this.recognition.stop();
		},
		onRecordPress: function(){
			this.recognition.start();
		},
		
	});
});