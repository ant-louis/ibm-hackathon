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

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        alert(this.responseText);
    }
};
xhttp.open("POST", "Your Rest URL Here", true);
xhttp.setRequestHeader("Content-type", "application/json");
xhttp.send("Your JSON Data Here");

var list = [{Name : "Damso", Title : "Bruxelles vie", Popularity : 0.95}, {Name : "Eminem", Title : "Lose Yourself", Popularity : 0.97}];
for(i = 0; i < list.length; i++){
	document.write("<tr><td>" + list[i].Name + "</td><td>" + list[i].Title + "</td><td>" + (list[i].Popularity * 100) + "%</td></tr>");
}