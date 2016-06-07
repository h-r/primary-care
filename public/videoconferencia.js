var selfEasyrtcid = "";


function connect() {
    easyrtc.setVideoDims(640,480);
    easyrtc.easyApp("easyrtc.audioVideoSimple", "selfVideo", ["callerVideo"], loginSuccess, loginFailure);
    
 }


function performCall(otherEasyrtcid) {
    easyrtc.hangupAll();

    var successCB = function() {};
    var failureCB = function() {};
    easyrtc.call(otherEasyrtcid, successCB, failureCB);
}


function loginSuccess(easyrtcid) {
    selfEasyrtcid = easyrtcid;
    document.getElementById("token_propio").innerHTML=easyrtcid;
    prueba2();
}


function loginFailure(errorCode, message) {
    easyrtc.showError(errorCode, message);
}
//###################################

var prueba = function (id) {
var serverUrl = "/";
var createToken = function(id, callback) { 
    var req = new XMLHttpRequest();
    var url = serverUrl + 'token_easyrtc/';
   
    var body = {"id": id};

    req.onreadystatechange = function () {
      if (req.readyState === 4) {
        callback(req.responseText);
      }
    };

    req.open('POST', url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(body));
};

  createToken(id, function (response) {
    var token = response;
    console.log(token);
    if (token != ""){
    performCall(token);
	}
});

}

var prueba2 = function () {
	var id=document.getElementById("token_propio").innerHTML;
	prueba(id);
}  

window.onload = connect;
