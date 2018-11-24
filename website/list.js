/*function getLine(var json){
	object = JSON.parse(json);
	return {Name: name, Country: country, Popularity: object.values[0][l'indice correct]};
}

function getList(){

}*/

/*function displayList(list){
	for(i = 0; i < list.length; i++){
		document.write("<tr><td>" + list[i].Name + "</td><td>" + list[i].Country + "</td><td>" + (list[i].Popularity * 100) + "%</td></tr>");
	}
}*/

/*var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        alert(this.responseText);
    }
};
xhttp.open("POST", "https://ibm-watson-ml.mybluemix.net/v3/wml_instances/e2ecdce4-3ff9-4766-94a8-4653ae42609b/published_models/e1d0f5f9-94b3-4c7d-8533-ee6be4a7f9b1/deployments/481846dc-75f3-4794-a584-d2cdbaf90eae", true);
xhttp.setRequestHeader("Content-type", "application/json");
xhttp.send('[{"danceability":0.443,"energy":0.804,"key":10,"loudness":-6.432,"mode":1,"speechiness":0.0406,"acousticness":0.0165,"instrumentalness":0.00000289,"liveness":0.181,"valence":0.438,"tempo":151.928,"duration_ms":223800,"time_signature":4},{"danceability":0.612,"energy":0.799,"key":10,"loudness":-4.603,"mode":1,"speechiness":0.0275,"acousticness":0.00898,"instrumentalness":0,"liveness":0.172,"valence":0.687,"tempo":125.976,"duration_ms":188253,"time_signature":4,"name":"Hurricane","artist":"Luke Combs","popularity":15}]');
response = xhttp.responseText;
document.getElementById("test").innerHTML = response;*/

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const btoa = require("btoa");
const wml_credentials = new Map();

// NOTE: you must manually construct wml_credentials hash map below using information retrieved
// from your IBM Cloud Watson Machine Learning Service instance

var wml_service_credentials_url = "https://us-south.ml.cloud.ibm.com";
var wml_service_credentials_username = "9902f999-68aa-4a50-b031-71398731f6a6";
var wml_service_credentials_password = "41ff1c2b-6a7e-4773-baef-3d983ec8e1a2";

wml_credentials.set("url", wml_service_credentials_url);
wml_credentials.set("username", wml_service_credentials_username);
wml_credentials.set("password", wml_service_credentials_password);

function apiGet(url, username, password, loadCallback, errorCallback){
	const oReq = new XMLHttpRequest();
	const tokenHeader = "Basic " + btoa((username + ":" + password));
	const tokenUrl = url + "/v3/identity/token";

	oReq.addEventListener("load", loadCallback);
	oReq.addEventListener("error", errorCallback);
	oReq.open("GET", tokenUrl);
	oReq.setRequestHeader("Authorization", tokenHeader);
	oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	oReq.send();
}

function apiPost(scoring_url, token, payload, loadCallback, errorCallback){
	const oReq = new XMLHttpRequest();
	oReq.addEventListener("load", loadCallback);
	oReq.addEventListener("error", errorCallback);
	oReq.open("POST", scoring_url);
	oReq.setRequestHeader("Accept", "application/json");
	oReq.setRequestHeader("Authorization", token);
	oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	oReq.send(payload);
}

apiGet(wml_credentials.get("url"),
	wml_credentials.get("username"),
	wml_credentials.get("password"),
	function (res) {
        let parsedGetResponse;
        try {
            parsedGetResponse = JSON.parse(this.responseText);
        } catch(ex) {
            // TODO: handle parsing exception
        }
        if (parsedGetResponse && parsedGetResponse.token) {
            const token = parsedGetResponse.token
            const wmlToken = "Bearer " + token;

            // NOTE: manually define and pass the array(s) of values to be scored in the next line
			const payload = '{"fields": ["danceability", "energy", "key", "loudness", "mode", "speechiness", "acousticness", "instrumentalness", "liveness", "valence", "tempo", "duration_ms", "time_signature", "name", "artist", "popularity"], "values": [[0.443, 0.804, 10, -6.432, 1, 0.0406, 0.0165, 0.00000289, 0.181, 0.438, 151.928, 223800, 4, "God has plan", "Drake", null]]}';
			const scoring_url = "https://us-south.ml.cloud.ibm.com/v3/wml_instances/e2ecdce4-3ff9-4766-94a8-4653ae42609b/deployments/481846dc-75f3-4794-a584-d2cdbaf90eae/online";

            apiPost(scoring_url, wmlToken, payload, function (resp) {
                let parsedPostResponse;
                try {
                    parsedPostResponse = JSON.parse(this.responseText);
                } catch (ex) {
                    // TODO: handle parsing exception
                }
                console.log("Scoring response");
                console.log(parsedPostResponse);
            }, function (error) {
                console.log(error);
            });
        } else {
            console.log("Failed to retrieve Bearer token");
        }
	}, function (err) {
		console.log(err);
	});



/*var list = [{Name : "Damso", Title : "Bruxelles vie", Popularity : 95}, {Name : "Eminem", Title : "Lose Yourself", Popularity : 97}];
for(i = 0; i < list.length; i++){
	document.write("<tr><td>" + list[i].Name + "</td><td>" + list[i].Title + "</td><td>" + (list[i].Popularity) + "%</td></tr>");
}*/