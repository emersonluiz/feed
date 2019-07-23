function jsonGET(arquivo){
	
	arquivo += (arquivo.indexOf("?") != -1)?"&cacheDate="+new Date():"?cacheDate="+new Date();
	if (window.XMLHttpRequest) {
		var lerXML=new XMLHttpRequest();
	}else {
		var lerXML = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	lerXML.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 401) {
		   redirect();
		}
	};

	lerXML.open("GET",arquivo,false);
    //lerXML.setRequestHeader("Authorization","Bearer " + token);
    
    //lerXML.setRequestHeader('Access-Control-Allow-Origin', '*');
    ///lerXML.setRequestHeader('Content-Type', 'application/xml');


	lerXML.send();

	var xmlDoc = lerXML.responseText;

	return xmlDoc;
}

let rss = ["agronegocio", "economia"];
cotation();

let i = 0;
let json = load(i);
i++;

let time = 30000;
let index = 0;
index = noticias(index);

let intervalo = window.setInterval(function() {
	index = noticias(index);
}, time);

function cotation() {
	let a = jsonGET("/cotacao");
	let cot = JSON.parse(a);

	document.getElementById("cotation").innerHTML = "<h3>Dólar Comercial: R$ " + cot.USD.ask + 
													"&nbsp;&nbsp;&nbsp;&nbsp; Euro: R$ " + cot.EUR.ask + 
													"&nbsp;&nbsp;&nbsp;&nbsp; Peso Argentino: R$ " + cot.ARS.ask + 
													"&nbsp;&nbsp;&nbsp;&nbsp; Bitcoin: R$ " + cot.BTC.ask + "</h3>";
}

function load(ind) {
	let a = jsonGET("/noticias/"+rss[ind]);
	return JSON.parse(a);
}

function noticias(index) {

	if((json.length-1) < index) {
		index = 0;
		json = load(i);
		cotation();
		if(i == 1) {
			i = 0;
		} else {
			i++;
		}
	}

	let url = "";
	if(json[index] && json[index].image != null) {
		document.body.style.backgroundImage = "url('" + json[index].image +"')";
		document.body.style.backgroundPosition = "center top";
		document.body.style.backgroundSize = "100% auto";
		document.body.style.backgroundRepeat = "no-repeat";
	} else {
		document.body.style.background = "#6495ED";
	}
	console.log(json[index])
	if(json[index]) {

		if(json[index].description != "") {
			document.getElementById("legend").innerHTML = "<h1 style='color: #FFF; font-size: 40px'>"+json[index].title+"</h1>"+
														  "<h2 style='color: #FFF; font-size: 28px' class='desH2'>"+json[index].description+"</h2>";
		}
		return ++index;
        }
}
