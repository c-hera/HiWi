'use strict';
//Variablen fuer die VPN-Eingabe
var VPN = '00';
var korrekteVPN = 0;
//Variablen fuer Seitenwahl
var random = 0.0;	//Hilfsvariable [o,1[
var Seite = 0;	//Seite=0 -> linke Seite, Seite=1 -> rechte Seite
var rightside = false;
var leftside = false;
var choice = 0;
//Score
var score = 0;
var scoretime = 0;
var starttime = 0;
var endtime = 0;
var wahl = 'richtige';
var rightchoice = 0;
var scoreheight = 0;
var handicap = 0;
//positions
var anzahl = 25;
var positions = [2*anzahl];
var i = 0;
var j = 0;
var width = 30;
var height = 30;
//GoOnbutton
var weiter = true;
var showGoOn =true;
//Screen
var screenheight = 0;
var screenwidth = 0;
//Schwierigkeitsgrad
var schwierigkeit = 0;
//Runde
var roundstart = 0;
var round = 0;				//Zaehlervariable für aktuelle Runde
var roundlength = 60;
var newround = 1;			//Gibt an,ob neue Runde gestartet werden soll
var game = 1;				//Zaehlervariable für Anzahl der Spiele pro Runde
var gameplayed = true;
//Matrix mit den Ergebnissen jeder Runde
var lastscore = [];
var lastfivescore = 0;
//
var reducesoretwo = false;
var reducesorethree = false;
var reducesorefour = false;

//Ausslesen der Bildschirmgroesse
Screen();

//Funktionen

//GoON
function GoOn(){
	//Pruefen, ob neue Runde gestartet werden soll
	if(weiter){
			
	//Seite bestimmen
	Seitebestimmen();

	//GoOnbutton und Score-Anzeige verbergen
	var d = document.getElementById('GoOnbutton');
	d.style.zIndex = 1;
	var d = document.getElementById('scoreanzeige');
	d.style.zIndex = 1;
	
	var d = document.getElementById('gruenerBalken');
	d.style.zIndex = 8;
	var d = document.getElementById('gruenerBalken2');
	d.style.zIndex = 9;
	var d = document.getElementById('gruenerBalken3');
	d.style.zIndex = 1;
	var d = document.getElementById('handicap');
	d.style.zIndex = 11;
	
	var d = document.getElementById('gruenerBalken3');
	d.style.height = scoreheight + "%";
	
	//Kreise platzieren
	PlaceCircles();
	
	//starttime in Sekunden
	var date = new Date();
	starttime = date.getHours() *3600 + date.getMinutes() *60 + date.getSeconds();
	//
  	/*
	reducesoretwo = false;
	reducseorethree = false;
	reducseorefour = false;
	*/
	//ein erneutes Ausführen verhindern
	weiter = false;
	}
	if(newround == 1){
		newround = 0;
		rightchoice = 0;
		score = 0;
		//Merke Startzeit
		var date = new Date();
		roundstart = date.getHours() *3600 + date.getMinutes() *60 + date.getSeconds(); 
			
		//Bestimme Schwierigkeitsgrad
		schwierigkeit = 0;
		/*
		var radios = document.getElementsByName('playmode2');

		for (var i = 0, length = radios.length; i < length; i++) {
			if (radios[i].checked) {
	
				schwierigkeit = i;
			
				break;
			}
		}
		*/
		//Bestimmen der Groesse der Distractor-Kreise entsprechend Playmode und Bildschirmgroesse
		SetPlaymode();
	}
}
//
//LeftSide
function turnleftsidegrey(){
	var d = document.getElementById('leftside1');
	d.style.zIndex = 1;
	var d = document.getElementById('leftside2');
	d.style.zIndex = 2;
	var d = document.getElementById('rightside1');
	d.style.zIndex = 2;
	var d = document.getElementById('rightside2');
	d.style.zIndex = 1;
	//
	leftside = true;
	rightside = false;
}
//
//RightSide
function turnrightsidegrey(){
	var d = document.getElementById('leftside1');
	d.style.zIndex = 2;
	var d = document.getElementById('leftside2');
	d.style.zIndex = 1;
	var d = document.getElementById('rightside1');
	d.style.zIndex = 1;
	var d = document.getElementById('rightside2');
	d.style.zIndex = 2;
	//
	rightside = true;
	leftside = false;
}
//
//ShowGoOnButton
function ShowGoOnButton(){
	
	if(showGoOn){	
	var d = document.getElementById('leftside1');
	d.style.zIndex = 2;
	var d = document.getElementById('leftside2');
	d.style.zIndex = 1;
	var d = document.getElementById('rightside1');
	d.style.zIndex = 2;
	var d = document.getElementById('rightside2');
	d.style.zIndex = 1;
	var d = document.getElementById('GoOnbutton');
	d.style.zIndex = 30;
	var d = document.getElementById('scoreanzeige');
	d.style.zIndex = 20;
	
	showGoOn = false;			//erneutes Ausführen verhindern
	}
}
//
//Pruefen, ob richtige Wahl
function Choice(){
	if((Seite==0 && leftside)||(Seite==1 && rightside)){
		choice = 1;
		wahl = 'Richtige';
	}
	else{
		choice = 0;
		wahl = 'Falsche';
	}
}
//
//Seite bestimmen
function Seitebestimmen(){
random = Math.random();
Seite = Math.round(random);
}
//
//Score berechnen
function Score(){
	
	Choice();
	var date = new Date();
	endtime = date.getHours() *3600 + date.getMinutes() *60 + date.getSeconds();
	scoretime = endtime - starttime;
 
	//Handicap
	if(scoretime < 9 && choice == 1){
		handicap = Math.round(scoretime) - 2;
	}
	else{
		handicap = 6;
	}
	
	score += handicap;
	rightchoice += choice;

	lastscore[game] = handicap;

	var k = 0;
	var t = 0;
	for(k=game; k>game-5; k--){
		if(k>0){
		lastfivescore += lastscore[k];
		t++;
		}
	}
	//berechne hoehe des Score
	scoreheight = 80 - ((lastfivescore/t) + 2) * 10;
	//Setze Hoehe des Scorebalkens
	var d = document.getElementById('gruenerBalken2');
	d.style.height = scoreheight + '%';
	//Setze Hoehe des Motivationsbalkens
	var d = document.getElementById('gruenerBalken3');
	d.style.height = scoreheight + '%';
	lastfivescore = 0;
	
	//Ergebnis speichern
	//SaveResult();	
}
//
//Place Circles
function PlaceCircles(){
	
	//Bestimmung der Positionen der Kreise auf der linken Seite
	GetLeftPosition();
	
	//Platzieren der Kreise	
	  var d = document.getElementById('L1');
	  d.style.position = "absolute";
	  d.style.left = positions[0]+'%';
	  d.style.top = positions[1]+'%';

	  
	  var d = document.getElementById('L2');
	  d.style.position = "absolute";
	  d.style.left = positions[2]+'%';
	  d.style.top = positions[3]+'%';
	  
	  var d = document.getElementById('L3');
	  d.style.position = "absolute";
	  d.style.left = positions[4]+'%';
	  d.style.top = positions[5]+'%';
	  
	  var d = document.getElementById('L4');
	  d.style.position = "absolute";
	  d.style.left = positions[6]+'%';
	  d.style.top = positions[7]+'%';
		
	  var d = document.getElementById('L5');
	  d.style.position = "absolute";
	  d.style.left = positions[8]+'%';
	  d.style.top = positions[9]+'%';
	  
	  var d = document.getElementById('L6');
	  d.style.position = "absolute";
	  d.style.left = positions[10]+'%';
	  d.style.top = positions[11]+'%';
	  
	  var d = document.getElementById('L7');
	  d.style.position = "absolute";
	  d.style.left = positions[12]+'%';
	  d.style.top = positions[13]+'%';
	  
	  var d = document.getElementById('L8');
	  d.style.position = "absolute";
	  d.style.left = positions[14]+'%';
	  d.style.top = positions[15]+'%';
	  
	  var d = document.getElementById('L9');
	  d.style.position = "absolute";
	  d.style.left = positions[16]+'%';
	  d.style.top = positions[17]+'%';
	  
	  var d = document.getElementById('L10');
	  d.style.position = "absolute";
	  d.style.left = positions[18]+'%';
	  d.style.top = positions[19]+'%';
	  
	  var d = document.getElementById('L11');
	  d.style.position = "absolute";
	  d.style.left = positions[20]+'%';
	  d.style.top = positions[21]+'%';
	  
	  var d = document.getElementById('L12');
	  d.style.position = "absolute";
	  d.style.left = positions[22]+'%';
	  d.style.top = positions[23]+'%';
	  
	  var d = document.getElementById('L13');
	  d.style.position = "absolute";
	  d.style.left = positions[24]+'%';
	  d.style.top = positions[25]+'%';
	  
	  var d = document.getElementById('L14');
	  d.style.position = "absolute";
	  d.style.left = positions[26]+'%';
	  d.style.top = positions[27]+'%';
	  
	  var d = document.getElementById('L15');
	  d.style.position = "absolute";
	  d.style.left = positions[28]+'%';
	  d.style.top = positions[29]+'%';
	  
	  var d = document.getElementById('L16');
	  d.style.position = "absolute";
	  d.style.left = positions[30]+'%';
	  d.style.top = positions[31]+'%';
		
	  var d = document.getElementById('L17');
	  d.style.position = "absolute";
	  d.style.left = positions[32]+'%';
	  d.style.top = positions[33]+'%';
	  
	  var d = document.getElementById('L18');
	  d.style.position = "absolute";
	  d.style.left = positions[34]+'%';
	  d.style.top = positions[35]+'%';
	  
	  var d = document.getElementById('L19');
	  d.style.position = "absolute";
	  d.style.left = positions[36]+'%';
	  d.style.top = positions[37]+'%';
	  
	  var d = document.getElementById('L20');
	  d.style.position = "absolute";
	  d.style.left = positions[38]+'%';
	  d.style.top = positions[39]+'%';
	  
	  var d = document.getElementById('L21');
	  d.style.position = "absolute";
	  d.style.left = positions[40]+'%';
	  d.style.top = positions[41]+'%';
	  
	  var d = document.getElementById('L22');
	  d.style.position = "absolute";
	  d.style.left = positions[42]+'%';
	  d.style.top = positions[43]+'%';
	  
	  var d = document.getElementById('L23');
	  d.style.position = "absolute";
	  d.style.left = positions[44]+'%';
	  d.style.top = positions[45]+'%';
	  
	  var d = document.getElementById('L24');
	  d.style.position = "absolute";
	  d.style.left = positions[46]+'%';
	  d.style.top = positions[47]+'%';
	  
	  var d = document.getElementById('L25');
	  d.style.position = "absolute";
	  d.style.left = positions[48]+'%';
	  d.style.top = positions[49]+'%';
	  
	  var d = document.getElementById('LTarget');
	  d.style.position = "absolute";
	  d.style.left = positions[50]+'%';
	  d.style.top = positions[51] +'%';
	
	//Bestimmung der Positionen der Kreise auf der rechten Seite
	GetRightPosition();
	
	//Platzieren der Kreise	
	  var d = document.getElementById('R1');
	  d.style.position = "absolute";
	  d.style.right = positions[0]+'%';
	  d.style.top = positions[1]+'%';
	  
	  var d = document.getElementById('R2');
	  d.style.position = "absolute";
	  d.style.right = positions[2]+'%';
	  d.style.top = positions[3]+'%';
	  
	  var d = document.getElementById('R3');
	  d.style.position = "absolute";
	  d.style.right = positions[4]+'%';
	  d.style.top = positions[5]+'%';
	  
	  var d = document.getElementById('R4');
	  d.style.position = "absolute";
	  d.style.right = positions[6]+'%';
	  d.style.top = positions[7]+'%';
	
	  var d = document.getElementById('R5');
	  d.style.position = "absolute";
	  d.style.right = positions[8]+'%';
	  d.style.top = positions[9]+'%';
	  
	  var d = document.getElementById('R6');
	  d.style.position = "absolute";
	  d.style.right = positions[10]+'%';
	  d.style.top = positions[11]+'%';
	  
	  var d = document.getElementById('R7');
	  d.style.position = "absolute";
	  d.style.right = positions[12]+'%';
	  d.style.top = positions[13]+'%';
	  
	  var d = document.getElementById('R8');
	  d.style.position = "absolute";
	  d.style.right = positions[14]+'%';
	  d.style.top = positions[15]+'%';
	  
	  var d = document.getElementById('R9');
	  d.style.position = "absolute";
	  d.style.right = positions[16]+'%';
	  d.style.top = positions[17]+'%';
	  
	  var d = document.getElementById('R10');
	  d.style.position = "absolute";
	  d.style.right = positions[18]+'%';
	  d.style.top = positions[19]+'%';
	  
	  var d = document.getElementById('R11');
	  d.style.position = "absolute";
	  d.style.right = positions[20]+'%';
	  d.style.top = positions[21]+'%';
	  
	  var d = document.getElementById('R12');
	  d.style.position = "absolute";
	  d.style.right = positions[22]+'%';
	  d.style.top = positions[23]+'%';
	  
	  var d = document.getElementById('R13');
	  d.style.position = "absolute";
	  d.style.right = positions[24]+'%';
	  d.style.top = positions[25]+'%';
	  
	  var d = document.getElementById('R14');
	  d.style.position = "absolute";
	  d.style.right = positions[26]+'%';
	  d.style.top = positions[27]+'%';
	  
	  var d = document.getElementById('R15');
	  d.style.position = "absolute";
	  d.style.right = positions[28]+'%';
	  d.style.top = positions[29]+'%';
	  
	  var d = document.getElementById('R16');
	  d.style.position = "absolute";
	  d.style.right = positions[30]+'%';
	  d.style.top = positions[31]+'%';
		
	  var d = document.getElementById('R17');
	  d.style.position = "absolute";
	  d.style.right = positions[32]+'%';
	  d.style.top = positions[33]+'%';
	  
	  var d = document.getElementById('R18');
	  d.style.position = "absolute";
	  d.style.right = positions[34]+'%';
	  d.style.top = positions[35]+'%';
	  
	  var d = document.getElementById('R19');
	  d.style.position = "absolute";
	  d.style.right = positions[36]+'%';
	  d.style.top = positions[37]+'%';
	  
	  var d = document.getElementById('R20');
	  d.style.position = "absolute";
	  d.style.right = positions[38]+'%';
	  d.style.top = positions[39]+'%';
	  
	  var d = document.getElementById('R21');
	  d.style.position = "absolute";
	  d.style.right = positions[40]+'%';
	  d.style.top = positions[41]+'%';
	  
	  var d = document.getElementById('R22');
	  d.style.position = "absolute";
	  d.style.right = positions[42]+'%';
	  d.style.top = positions[43]+'%';
	  
	  var d = document.getElementById('R23');
	  d.style.position = "absolute";
	  d.style.right = positions[44]+'%';
	  d.style.top = positions[45]+'%';
	  
	  var d = document.getElementById('R24');
	  d.style.position = "absolute";
	  d.style.right = positions[46]+'%';
	  d.style.top = positions[47]+'%';
	  
	  var d = document.getElementById('R25');
	  d.style.position = "absolute";
	  d.style.right = positions[48]+'%';
	  d.style.top = positions[49]+'%';
	 
	  var d = document.getElementById('RTarget');
	  d.style.position = "absolute";
	  d.style.right = positions[50] +'%';
	  d.style.top = positions[51] +'%';
	  
	//Setze Target
	Target();
}
//
//Bildschirmgroesse bestimmen
function Screen(){
	screenwidth = screen.width;
	screenheight = screen.height;
}
//
//Positionen der linken Kreise berechnen
function GetLeftPosition(){
	
	while(i < (2*anzahl + 2)){
	
	//Bestimmen der Position
	positions[i] = Math.random() * 43 + 4;
	positions[i+1] = Math.random() * 95;
	
	
		//Pruefen, ob Position zulaessig
		for(j=0; j < i; j+=2){
			
			if((Math.sqrt(Math.pow((positions[i] - positions[j]),2) + Math.pow((positions[i+1] - positions[j+1]),2))) > (5)){
				
			}
			
			else{
				i-=2;
				break;
			}
		}
		i+=2;
	}
	//zuruecksaetzen von i
	i = 0;
}
//
//Positionen der rechten Kreise berechnen
function GetRightPosition(){
	
	while(i < (2*anzahl + 2)){
	
	//Bestimmen der Position
	positions[i] = Math.random() * 47;
	positions[i+1] = Math.random() * 95;
	
	
		//Pruefen, ob Position zulaessig
		for(j=0; j < i; j+=2){
			
			if((Math.sqrt(Math.pow((positions[i] - positions[j]),2) + Math.pow((positions[i+1] - positions[j+1]),2))) > (5)){
				
			}
			
			else{
				i-=2;
				break;
			}
		}
		i+=2;
	}
	//zuruecksaetzen von i
	i = 0;
}
//
//Target
function Target(){
	
	if (Seite == 0){
	//Linke Seite ist aktiv
	//Target auf rechter Seite wird deaktiviert (Sichtbarkeit=0)
	var d = document.getElementById('RTarget');
	d.style.opacity = 0;
	
	//Target auf linker Seite wird aktiviert (Sichtbarkeit=1)
	var d = document.getElementById('LTarget');
	d.style.opacity = 1;
	}
	else{
	//Rechte Seite ist aktiv
	//Target auf linker Seite wird deaktiviert (Sichtbarkeit=0)
	var d = document.getElementById('LTarget');
	d.style.opacity = 0;
	
	//Target auf rechter Seite wird aktiviert (Sichtbarkeit=1)
	var d = document.getElementById('RTarget');
	d.style.opacity = 1;
	}
}
//
//EndInput
function EndInput(){
	var d = document.getElementById('Input');
	d.style.zIndex = 1;
	
	//Bestimmen der Groesse der Target-Kreise in Abhaengigkeit zur Bildschirmgroesse
	SetSizeTarget();
	
	weiter = true;
	ShowGoOnButton();
}
//
//Setze Playmode
function SetPlaymode(){
	
		if(schwierigkeit==0){
		
		width = (17/1366)*100;
		height = (17/768)*100;
		
		var d = document.getElementById('L1');
		d.style.width = width + '%';
		d.style.height = height +'%';
		
		var d = document.getElementById('L2');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L3');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L4');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L5');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L6');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L7');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L8');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L9');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L10');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L11');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L12');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L13');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L14');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L15');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L16');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L17');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L18');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L19');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L20');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L21');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L22');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L23');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L24');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L25');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		
		var d = document.getElementById('R1');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R2');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R3');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R4');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R5');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R6');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R7');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R8');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R9');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R10');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R11');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R12');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R13');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R14');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R15');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R16');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R17');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R18');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R19');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R20');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R21');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R22');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R23');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R24');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R25');
		d.style.width = width + '%';
		d.style.height = height + '%';
	}
	
	if(schwierigkeit==1){
		
		width = (20/1366)*100;
		height = (20/768)*100;
		
		var d = document.getElementById('L1');
		d.style.width = width + '%';
		d.style.height = height +'%';
		
		var d = document.getElementById('L2');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L3');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L4');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L5');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L6');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L7');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L8');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L9');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L10');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L11');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L12');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L13');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L14');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L15');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L16');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L17');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L18');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L19');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L20');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L21');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L22');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L23');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L24');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L25');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		
		var d = document.getElementById('R1');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R2');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R3');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R4');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R5');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R6');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R7');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R8');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R9');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R10');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R11');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R12');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R13');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R14');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R15');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R16');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R17');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R18');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R19');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R20');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R21');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R22');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R23');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R24');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R25');
		d.style.width = width + '%';
		d.style.height = height + '%';
	}
	
	if(schwierigkeit==2){
		
		width = (22/1366)*100;
		height = (22/768)*100;
		
		var d = document.getElementById('L1');
		d.style.width = width + '%';
		d.style.height = height +'%';
		
		var d = document.getElementById('L2');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L3');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L4');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L5');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L6');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L7');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L8');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L9');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L10');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L11');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L12');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L13');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L14');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L15');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L16');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L17');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L18');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L19');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L20');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L21');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L22');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L23');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L24');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('L25');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		
		var d = document.getElementById('R1');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R2');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R3');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R4');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R5');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R6');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R7');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R8');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R9');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R10');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R11');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R12');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R13');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R14');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R15');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R16');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R17');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R18');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R19');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R20');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R21');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R22');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R23');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R24');
		d.style.width = width + '%';
		d.style.height = height + '%';
		
		var d = document.getElementById('R25');
		d.style.width = width + '%';
		d.style.height = height + '%';
	}
}
//
//Speichert das Ergebnis jeder Runde in einer Matrix
function SaveResult(){
	
	var result0 = [];
	var result1 = [];
	var result2 = [];
	
	result0[round] = choice;		//richtige Wahl?
	result1[round] = scoretime;		//wie lange?
	result2[round] = score;			//neuer Score
	

}
//
//Bestimmen der Groesse der Target-Kreise in Abhaengigkeit zur Bildschirmgroesse
function SetSizeTarget(){
	
		width = (25/1366)*100;
		height = (25/768)*100;
		
		var d = document.getElementById('LTarget');
		d.style.width = width + '%';
		d.style.height = height +'%';
		
		var d = document.getElementById('RTarget');
		d.style.width = width + '%';
		d.style.height = height +'%';
}
//
//
function ShowScore(){
		
	var d = document.getElementById('leftside1');
	d.style.zIndex = 2;
	var d = document.getElementById('leftside2');
	d.style.zIndex = 1;
	var d = document.getElementById('rightside1');
	d.style.zIndex = 2;
	var d = document.getElementById('rightside2');
	d.style.zIndex = 1;
	var d = document.getElementById('GoOnbutton');
	d.style.zIndex = 1;
	var d = document.getElementById('scoreanzeige');
	d.style.zIndex = 30;
	
	var rightchoicepercent = 100 * rightchoice/game;
	var scorehandicap = Math.round(score/game);
	rightchoicepercent = Math.round(rightchoicepercent);
	document.getElementById('scoreanzeige').innerHTML = "<br><br><br><br><br><br><br><br>You chose " + rightchoicepercent + "% the right side. <br> Handicap: " + scorehandicap;
	score = 0;
	newround = 1;
	weiter = true;
	showGoOn = true;
	var d = document.getElementById('gruenerBalken2');
	d.style.height = scoreheight + "%";
}
//
//
function NextGame(){
	
	gameplayed = false;
	var date = new Date();
	var time = date.getHours() *3600 + date.getMinutes() *60 + date.getSeconds(); 
	
	Score();
	
	var d = document.getElementById('leftside1');
	d.style.zIndex = 2;
	var d = document.getElementById('leftside2');
	d.style.zIndex = 1;
	var d = document.getElementById('rightside1');
	d.style.zIndex = 2;
	var d = document.getElementById('rightside2');
	d.style.zIndex = 1;
	
	if(time - roundstart > roundlength){
		weiter = false;
		ShowScore();
		game = 1;
	}
	else{
		weiter = true;
		game++;
		GoOn();
		//gameplayed = true;
	}
}
//
//Scoreleiste 
function ReduceScore1(){
	
	var date = new Date();
	var time = date.getHours() *3600 + date.getMinutes() *60 + date.getSeconds();
			var dzwei = document.getElementById('gruenerBalken2');
			var ddrei = document.getElementById('gruenerBalken3');
			
	if(time - starttime >= 10){

			//Scorebalken ausblenden
			dzwei.style.zIndex = 1;
			//Motivationsbalken einblenden und Transition starten
			ddrei.style.zIndex = 10;
			ddrei.style.height = 0.5 * scoreheight + '%';

			//
			/*
			lastscore[game] = 6;
			
			var k = 0;
			var t = 0;
			for(k=game; k>game-5; k--){
				if(k>0){
				lastfivescore += lastscore[k];
				t++;
				}
			}
			game++;
			*/
			//berechne hoehe des Score
			scoreheight = 80 - ((lastfivescore/t) + 2) * 10;
			//Setze Hoehe des Scorebalkens
			var d = document.getElementById('gruenerBalken2');
			d.style.height = scoreheight + '%';
	}
}

function ReduceScore2(){
	
	var date = new Date();
	var time = date.getHours() *3600 + date.getMinutes() *60 + date.getSeconds();
	var dzwei = document.getElementById('gruenerBalken2');
	var ddrei = document.getElementById('gruenerBalken3');
	
	if(time - starttime >= 20){
		
		ddrei.style.height = 0 + '%';		
		
	}
}

function ReduceScore3(){
	
	var date = new Date();
	var time = date.getHours() *3600 + date.getMinutes() *60 + date.getSeconds();
			var dzwei = document.getElementById('gruenerBalken2');
			var ddrei = document.getElementById('gruenerBalken3');
	
	if(time - starttime >= 24){
		
		//Scorebalken ausblenden
		dzwei.style.zIndex = 1;
		//Motivationsbalken einblenden und Transition starten
		ddrei.style.zIndex = 10;
		ddrei.style.height = scoreheight * 0.25 + '%';
		
		reducesorefour = true;
		
		var k = 0;
		for(k=game; k>game-5; k--){
			if(k>0){
			lastscore[k] = scoreheight * 0.5;
			}
		}
	}
}

function ReduceScore4(){
	
	var date = new Date();
	var time = date.getHours() *3600 + date.getMinutes() *60 + date.getSeconds();
			var dzwei = document.getElementById('gruenerBalken2');
			var ddrei = document.getElementById('gruenerBalken3');
			
	if(time - starttime >= 32){
		//Scorebalken ausblenden

		dzwei.style.zIndex = 1;
		//Motivationsbalken einblenden und Transition starten
		ddrei.style.zIndex = 10;
		ddrei.style.height = 0 + '%';
		var k = 0;
		for(k=game; k>game-5; k--){
			if(k>0){
			lastscore[k] = scoreheight * 0.25;
			}
		} 
	}
}