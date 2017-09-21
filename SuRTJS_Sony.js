'use strict';
//Variablen fuer die VPN-Eingabe
var VPN = '00';
var korrekteVPN = 0;
//Variablen fuer Seitenwahl
var random = 0.0; //Hilfsvariable [o,1[
var Seite = 0; //Seite=0 -> linke Seite, Seite=1 -> rechte Seite
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
var scoreheightOld = 0;
var handicap = 0;
//positions
var anzahl = 25;
var positions = [2 * anzahl];
var i = 0;
var j = 0;
var width = 30;
var height = 30;
//GoOnbutton
var weiter = true;
var showGoOn = true;
//Screen
var screenheight = 0;
var screenwidth = 0;
//Schwierigkeitsgrad
var schwierigkeit = 0;
//Runde
var roundstart = 0;
var round = 0; //Zaehlervariable für aktuelle Runde
var roundlength = 60;
var newround = 1; //Gibt an,ob neue Runde gestartet werden soll
var game = 1; //Zaehlervariable für Anzahl der Spiele pro Runde
var gameplayed = true;
//Matrix mit den Ergebnissen jeder Runde
var lastscore = [];
var lastfivescore = 0;
var lastThreeScores = 0;
//
var reducesoretwo = false;
var reducesorethree = false;
var reducesorefour = false;
//object and variables used to provide data for saving VPN performance
var testSubjectResult = {
    vpn: '00'
    , resultsChoice: []
    , resultsTime: []
    , resultsScore: []
    , resultsTimeProgression: []
    , resultsScoretimeExact: [], //interrupt defines start and end of game sequence, confines the results
    interrupt: []
};
//counts games, is used to find out, how many games have been played since last interruption/game start
var counterToInterruption = 0;
//these are used to collect the scoretime, choice, and score of a test subject
var subjectScoretime = [];
var subjectChoice = [];
var subjectScore = [];
var subjectTime = [];
var subjectScoretimeExact = [];
//defines, how many interruptions will happen during experiment. During last interruption, 
//javascript will save the data, therefore a value of 3 means 2 interruptions within the
//experiment and one interruption at the end for saving
var endOfExperiment = 5;
//checks, how many times the game has been interrupted so far
var iterationsBeforeEnd = 0;
//variable is set to 1, if interruption occure, to start new game in function nextGame()
var startNextGame = 0;
//moment in time, where the test subject presses "ok" on the input field and the game starts
var experimentStart = 0;
//get the Date and Time info, when experiment starts (user presses ok button)
var experimentDate = 0;
//get exact time the round started
var roundStartTime = 0;
//get exact duration of round
var scoretimeExact = 0;
//get exact duration of game vs. start of game
var timeExact = 0;
//object which contains all values which will be saved externally to txt or xls file in function interrupt
var combinedResults = {
    experimentStart: []
    , timeProgression: []
    , timeToScore: []
    , score: []
    , choice: []
    , interruptions: []
, }
var mistakecounter = 0;
//interrupts game and shows countdown, countdown length can be set in function displayCountdown,
var countDownDate = 0;
//gets executed, when player hits the interrupt button. shows a 6 sec countdown, where the player can return to the game (error prevention, if interrupt button was pressed unintentionally)
function interrupt() {
    countDownDate = Date.now() + 5000;
    document.getElementById("waitForCountdown").style.display = 'block';
    document.getElementById("continue").style.display = 'block';
    document.getElementById("continueParent").style.display = 'block';
    displayCountdown(1);
};
//stops the 6 sec countdown. If player clicked the interrupt button unintentionally, this function will end the countdown and player will return to the game
function stopFunction() {
    clearInterval(x);
    document.getElementById("waitForCountdown").style.display = 'none';
    document.getElementById("continue").style.display = 'none';
    document.getElementById("continueParent").style.display = 'none';
}
//second interruption (player cannot return to game anymore), coordinates of first and last game of this iteration are stored to .interrupt,
//if last iteration is ended, all necessary values will be stored to the txt file
function interruptGame() {
    document.getElementById("countdownTimer").style.display = 'block';
    countDownDate = Date.now() + 5000;
    //check, if score, scoretime, choice values are available
    if (counterToInterruption > 0) {
        //if it is the first time that values as stored in interrupt (basically it saves the coordinates of the first and last value of the game results until interruption, so it can be analysed in the text file)
        if (testSubjectResult.interrupt == 0) {
            testSubjectResult.interrupt[0] = 1;
            testSubjectResult.interrupt[1] = counterToInterruption;
        }
        else {
            //if it is the second, etc. time that values as stored in interrupt
            var lastInterruptValue = testSubjectResult.interrupt[testSubjectResult.interrupt.length - 1];
            testSubjectResult.interrupt.push(lastInterruptValue + 1);
            testSubjectResult.interrupt.push(counterToInterruption);
        }
        iterationsBeforeEnd++;
    }
    //check if all iterations have been played by the user (defined by interruptions within the experiment design)
    if (iterationsBeforeEnd < endOfExperiment) {
        displayCountdown();
    }
    else {
        //get rid of the undefined x 1 entry at position 0 in arrays
        clearInterval(x);
        var subjectChoiceNew = subjectChoice.slice(1, subjectChoice.length + 1);
        var subjectScoretimeNew = subjectScoretime.slice(1, subjectScore.length + 1);
        var subjectScoreNew = subjectScore.slice(1, subjectScore.length + 1);
        var subjectTimeNew = subjectTime.slice(1, subjectTime.length + 1);
        subjectScoretimeExact = subjectScoretimeExact.slice(1, subjectScoretimeExact.length + 1);
        //move results of choice, scoretime, score, time since start of SuRT to the testSubjectResult object
        //relic, this step is not really necessary anymore
        testSubjectResult.resultsChoice = subjectChoiceNew;
        testSubjectResult.resultsTime = subjectScoretimeNew;
        testSubjectResult.resultsScore = subjectScoreNew;
        testSubjectResult.resultsTimeProgression = subjectTimeNew;
        testSubjectResult.resultsScoretimeExact = subjectScoretimeExact;
        //arrange data, so it is displayed correctly in the txt filew
        var all = "";
        var row_width = 2;
        all += "number" + new Array(row_width).join('\t\t');
        all += "\n";
        all += "time" + new Array(row_width).join('\t\t');
        all += "\n";
        all += "ScoretimeExact" + new Array(row_width).join('\t');
        all += "\n";
        //all += "timeToScore" + new Array(row_width).join('\t');
        //all += "\n";
        all += "choice" + new Array(row_width).join('\t');
        all += "\n";
        // all += "score" + new Array(row_width).join('\t\t');
        //all += "\n";
        all += "interruption" + new Array(row_width).join('\t');
        all += "\n";
        all += experimentDate + new Array(row_width).join('\t');
        all += "\n";
        all += testSubjectResult.vpn + new Array(row_width).join('\t');
        all += "\r\n";
        for (var i = 0; i < testSubjectResult.resultsTime.length; i++) {
            all += (i + 1) + new Array(row_width).join('\t\t');
            all += "\n";
            var testForLength = testSubjectResult.resultsTimeProgression[i].toString().length;
            if (testForLength < 8) {
                all += testSubjectResult.resultsTimeProgression[i] + new Array(row_width).join('\t\t');
                all += "\n";
            }
            else {
                all += testSubjectResult.resultsTimeProgression[i] + new Array(row_width).join('\t');
                all += "\n";
            }
            all += testSubjectResult.resultsScoretimeExact[i] + new Array(row_width).join('\t\t');
            all += "\n";
            //all += testSubjectResult.resultsTime[i] + new Array(row_width).join('\t\t');
            //all += "\n";
            all += testSubjectResult.resultsChoice[i] + new Array(row_width).join('\t');
            all += "\n";
            //all += testSubjectResult.resultsScore[i] + new Array(row_width).join('\t\t');
            //all += "\n";
            if (typeof testSubjectResult.interrupt[i] != 'undefined') {
                all += testSubjectResult.interrupt[i] + new Array(row_width).join('\t');
            }
            all += "\r\n";
        }
        var allData = new Blob([all /*combinedResults.timeToScore, combinedResults.choice*/ ], {
            type: "text/plain;charset=utf-8"
        });
        //use saveAs to save data to txt/xls file
        var number = testSubjectResult.vpn.toString();
        saveAs(allData, "VPN" + number + "_results.txt")
            //UNCOMMENT HERE, IF DATA SHOULD BE STORED IN XLS FILE
            /*
            //fill object "combineResults" with values
            var row_width = 2;
            combinedResults.timeToScore = ["time"];
            combinedResults.timeToScore += "\n";
            for (var i = 0; i < testSubjectResult.resultsTime.length; i++) {
                //add spacing between numbers
                combinedResults.timeToScore += testSubjectResult.resultsTime[i] + new Array(row_width).join(" ");
                combinedResults.timeToScore += "\n";
            };

            combinedResults.choice += ["choice"];
            combinedResults.choice += "\n";
            for (var i = 0; i < testSubjectResult.resultsTime.length; i++) {
                combinedResults.choice += testSubjectResult.resultsChoice[i] + new Array(row_width).join(" ");
                combinedResults.choice += "\n";
            };

            combinedResults.score += ["score"];
            combinedResults.score += "\n";
            for (var i = 0; i < testSubjectResult.resultsChoice.length; i++) {
                combinedResults.score += testSubjectResult.resultsScore[i] + new Array(row_width).join(" ");
                combinedResults.score += "\n";
            };

            combinedResults.timeProgression += ["time_progression"];
            combinedResults.timeProgression += "\n";
            for (var i = 0; i < testSubjectResult.resultsTimeProgression.length; i++) {
                combinedResults.timeProgression += testSubjectResult.resultsTimeProgression[i] + new Array(row_width).join(" ");
                combinedResults.timeProgression += "\n";
            };

            combinedResults.interruptions += ["Interruptions (Row Information)"];
            combinedResults.interruptions += "\n";
            for (var i = 0; i < testSubjectResult.interrupt.length; i++) {
                combinedResults.interruptions += testSubjectResult.interrupt[i] + new Array(row_width).join(" ");
                combinedResults.interruptions += "\n";
            };

            combinedResults.experimentStart += ["Experiment_Starttime"];
            combinedResults.experimentStart += "\n";
            combinedResults.experimentStart += experimentDate;
            combinedResults.experimentStart += "\n";

            //save Data via "saveAs", unfortunately, values can only be stored in one column (if saved to excel)

            var allData = new Blob([combinedResults.experimentStart, combinedResults.timeProgression, combinedResults.timeToScore, combinedResults.score, combinedResults.choice, combinedResults.interruptions], {
                type: "text/plain;charset=utf-8"
            });

            //use saveAs to save data to txt/xls file
            var number = testSubjectResult.vpn.toString();
            saveAs(allData, "VPN" + number + "_results.xls");*/
    }
};
var x = 0;
var distance = 0;

function displayCountdown(firstIteration) {
    x = setInterval(refreshCountdown2, 1000);

    function refreshCountdown2() {
        var now = new Date().getTime();
        // Find the distance between now an the count down date
        distance = countDownDate - now;
        //var countDownDate = Date.now() + 5000;
        //var now = new Date().getTime();
        // Find the distance between now an the count down date
        //var distance = countDownDate - now;
        // Time calculations for days, hours, minutes and seconds
        if (distance < 0) {
            clearInterval(x);
            document.getElementById("waitForCountdown").style.display = 'none';
            document.getElementById("continue").style.display = 'none';
            document.getElementById("continueParent").style.display = 'none';
            document.getElementById("countdownTimer").style.display = 'none';
            if (firstIteration == 1) {
                firstIteration = 0;
                interruptGame(1);
            }
            else {
                game--;
                ShowScore();
            }
            //game counter needs to be reduced, as last game was not played if interruption has been selected by the user
        }
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        // Display the result in the element with id="demo"
        if (firstIteration == 1) {
            document.getElementById("waitForCountdown").innerHTML = minutes + "m " + seconds + "s until game will be interrupted permanently.";
        }
        else if (endOfExperiment == iterationsBeforeEnd) {
            document.getElementById("countdownTimer").innerHTML = "<br><br><br><br><br><br><br><br>End of game.Please stow away the tablet.";
        }
        else {
            document.getElementById("countdownTimer").innerHTML = "<br><br><br><br><br><br><br><br>" + minutes + "m " + seconds + "s until game starts again.";
        }
        // If the count down is finished, write some text
    }
};
//Ausslesen der Bildschirmgroesse
Screen();
//Funktionen
//GoON
function GoOn() {
    //Pruefen, ob neue Runde gestartet werden soll
    if (weiter) {
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
        starttime = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
        roundStartTime = Date.now();
        //
        /*
	reducesoretwo = false;
	reducseorethree = false;
	reducseorefour = false;
	*/
        //ein erneutes Ausführen verhindern
        weiter = false;
    }
    if (newround == 1) {
        newround = 0;
        rightchoice = 0;
        score = 0;
        //Merke Startzeit
        var date = new Date();
        roundstart = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
        roundStartTime = Date.now();
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
function turnleftsidegrey() {
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
function turnrightsidegrey() {
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
function ShowGoOnButton() {
    if (showGoOn) {
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
        showGoOn = false; //erneutes Ausführen verhindern
    }
}
//
//Pruefen, ob richtige Wahl
function Choice() {
    if ((Seite == 0 && leftside) || (Seite == 1 && rightside)) {
        choice = 1;
        wahl = 'Richtige';
    }
    else {
        choice = 0;
        wahl = 'Falsche';
    }
}
//
//Seite bestimmen
function Seitebestimmen() {
    random = Math.random();
    Seite = Math.round(random);
}
//
//Score berechnen
function Score() {
    Choice();
    var date = new Date();
    endtime = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
    var now = new Date().getTime();
    scoretime = endtime - starttime;
    scoretimeExact = (now - roundStartTime) / 1000;
    timeExact = (now - experimentStart) / 1000;
    //Handicap
    if (scoretime < 9 && choice == 1) {
        if (scoretime <= 1) {
            handicap = -1;
            score += handicap;
            rightchoice += choice;
            lastscore[game] = handicap;
        }
        else {
            //ATTENTION: Handicap calculation now has 2 as divisor. Therefore the effect oftime lag during selection is not as significant as before
            //BUT: Worst Case: (8-1)/2 = 3.5 -> Therefore, a gap exisits between worst handicap (correct selection) and handicap (incorrect selection)
            handicap = (Math.round(scoretime) - 1) / 2;
            score += handicap;
            rightchoice += choice;
            lastscore[game] = handicap;
        }
    }
    else {
        handicap = 6;
        score += handicap;
        rightchoice += choice;
        lastscore[game] = handicap;
    }
    var k = 0;
    var t = 0;
    for (k = game; k > game - 3; k--) {
        if (k > 0) {
            lastfivescore += lastscore[k];
            t++;
        }
    }
    //berechne hoehe des Score
    /*as the movement of the scale is not intuitively understandable by the test subject, the following measures were implemented:
     - if selection is wrong, the new scoreheight will be the scoreheight of the last game - 10
     - if scoreheight is smaller than 10, scoreheight is 0
     - if selection is correct again after a false selection and the new scoreheight is lower than the calculated scoreheight (-10...) 
        scoreheight shall be as high as the scoreheight of the last game, if issue continues and calculated scoreheight is still lower
        scoreheightOld is added +5 and set as scoreheight, this continues until the calculated scoreheight is higher than the scoreheightOld again*/
    if (handicap == 6 && scoreheight >= 10) {
        scoreheight = scoreheight - 10;
        scoreheightOld = scoreheight;
    }
    else if (handicap == 6 && scoreheight <= 10) {
        scoreheight = 0;
        scoreheightOld = scoreheight;
    }
    else {
        scoreheight = 80 - ((lastfivescore / t) + 1) * 10;
        if (scoreheight <= scoreheightOld) {
            scoreheight = scoreheightOld;
            scoreheightOld += 5;
        }
    }
    //Setze Hoehe des Scorebalkens
    var d = document.getElementById('gruenerBalken2');
    d.style.height = scoreheight + '%';
    //Setze Hoehe des Motivationsbalkens
    var d = document.getElementById('gruenerBalken3');
    d.style.height = scoreheight + '%';
    lastfivescore = 0;
    //Ergebnis speichern
    SaveResult(score, scoretime);
}
/*
function Score() {

    Choice();
    var date = new Date();
    endtime = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
    scoretime = endtime - starttime;

    //Handicap
    if (scoretime < 9 && choice == 1) {
        handicap = Math.round(scoretime) - 2;
    } else {
        handicap = 6;
    }

    score += handicap;
    rightchoice += choice;

    lastscore[game] = handicap;

    var k = 0;
    var t = 0;
    for (k = game; k > game - 5; k--) {
        if (k > 0) {
            lastfivescore += lastscore[k];
            t++;
        }
    }
    //berechne hoehe des Score
    scoreheight = 80 - ((lastfivescore / t) + 2) * 10;
    //Setze Hoehe des Scorebalkens
    var d = document.getElementById('gruenerBalken2');
    d.style.height = scoreheight + '%';
    //Setze Hoehe des Motivationsbalkens
    var d = document.getElementById('gruenerBalken3');
    d.style.height = scoreheight + '%';
    lastfivescore = 0;

    //Ergebnis speichern
    SaveResult(score, scoretime);
}
*/
//
//Place Circles
function PlaceCircles() {
    //Bestimmung der Positionen der Kreise auf der linken Seite
    GetLeftPosition();
    //Platzieren der Kreise	
    var d = document.getElementById('L1');
    d.style.position = "absolute";
    d.style.left = positions[0] + '%';
    d.style.top = positions[1] + '%';
    var d = document.getElementById('L2');
    d.style.position = "absolute";
    d.style.left = positions[2] + '%';
    d.style.top = positions[3] + '%';
    var d = document.getElementById('L3');
    d.style.position = "absolute";
    d.style.left = positions[4] + '%';
    d.style.top = positions[5] + '%';
    var d = document.getElementById('L4');
    d.style.position = "absolute";
    d.style.left = positions[6] + '%';
    d.style.top = positions[7] + '%';
    var d = document.getElementById('L5');
    d.style.position = "absolute";
    d.style.left = positions[8] + '%';
    d.style.top = positions[9] + '%';
    var d = document.getElementById('L6');
    d.style.position = "absolute";
    d.style.left = positions[10] + '%';
    d.style.top = positions[11] + '%';
    var d = document.getElementById('L7');
    d.style.position = "absolute";
    d.style.left = positions[12] + '%';
    d.style.top = positions[13] + '%';
    var d = document.getElementById('L8');
    d.style.position = "absolute";
    d.style.left = positions[14] + '%';
    d.style.top = positions[15] + '%';
    var d = document.getElementById('L9');
    d.style.position = "absolute";
    d.style.left = positions[16] + '%';
    d.style.top = positions[17] + '%';
    var d = document.getElementById('L10');
    d.style.position = "absolute";
    d.style.left = positions[18] + '%';
    d.style.top = positions[19] + '%';
    var d = document.getElementById('L11');
    d.style.position = "absolute";
    d.style.left = positions[20] + '%';
    d.style.top = positions[21] + '%';
    var d = document.getElementById('L12');
    d.style.position = "absolute";
    d.style.left = positions[22] + '%';
    d.style.top = positions[23] + '%';
    var d = document.getElementById('L13');
    d.style.position = "absolute";
    d.style.left = positions[24] + '%';
    d.style.top = positions[25] + '%';
    var d = document.getElementById('L14');
    d.style.position = "absolute";
    d.style.left = positions[26] + '%';
    d.style.top = positions[27] + '%';
    var d = document.getElementById('L15');
    d.style.position = "absolute";
    d.style.left = positions[28] + '%';
    d.style.top = positions[29] + '%';
    var d = document.getElementById('L16');
    d.style.position = "absolute";
    d.style.left = positions[30] + '%';
    d.style.top = positions[31] + '%';
    var d = document.getElementById('L17');
    d.style.position = "absolute";
    d.style.left = positions[32] + '%';
    d.style.top = positions[33] + '%';
    var d = document.getElementById('L18');
    d.style.position = "absolute";
    d.style.left = positions[34] + '%';
    d.style.top = positions[35] + '%';
    var d = document.getElementById('L19');
    d.style.position = "absolute";
    d.style.left = positions[36] + '%';
    d.style.top = positions[37] + '%';
    var d = document.getElementById('L20');
    d.style.position = "absolute";
    d.style.left = positions[38] + '%';
    d.style.top = positions[39] + '%';
    var d = document.getElementById('L21');
    d.style.position = "absolute";
    d.style.left = positions[40] + '%';
    d.style.top = positions[41] + '%';
    var d = document.getElementById('L22');
    d.style.position = "absolute";
    d.style.left = positions[42] + '%';
    d.style.top = positions[43] + '%';
    var d = document.getElementById('L23');
    d.style.position = "absolute";
    d.style.left = positions[44] + '%';
    d.style.top = positions[45] + '%';
    var d = document.getElementById('L24');
    d.style.position = "absolute";
    d.style.left = positions[46] + '%';
    d.style.top = positions[47] + '%';
    var d = document.getElementById('L25');
    d.style.position = "absolute";
    d.style.left = positions[48] + '%';
    d.style.top = positions[49] + '%';
    var d = document.getElementById('LTarget');
    d.style.position = "absolute";
    d.style.left = positions[50] + '%';
    d.style.top = positions[51] + '%';
    //Bestimmung der Positionen der Kreise auf der rechten Seite
    GetRightPosition();
    //Platzieren der Kreise	
    var d = document.getElementById('R1');
    d.style.position = "absolute";
    d.style.right = positions[0] + '%';
    d.style.top = positions[1] + '%';
    var d = document.getElementById('R2');
    d.style.position = "absolute";
    d.style.right = positions[2] + '%';
    d.style.top = positions[3] + '%';
    var d = document.getElementById('R3');
    d.style.position = "absolute";
    d.style.right = positions[4] + '%';
    d.style.top = positions[5] + '%';
    var d = document.getElementById('R4');
    d.style.position = "absolute";
    d.style.right = positions[6] + '%';
    d.style.top = positions[7] + '%';
    var d = document.getElementById('R5');
    d.style.position = "absolute";
    d.style.right = positions[8] + '%';
    d.style.top = positions[9] + '%';
    var d = document.getElementById('R6');
    d.style.position = "absolute";
    d.style.right = positions[10] + '%';
    d.style.top = positions[11] + '%';
    var d = document.getElementById('R7');
    d.style.position = "absolute";
    d.style.right = positions[12] + '%';
    d.style.top = positions[13] + '%';
    var d = document.getElementById('R8');
    d.style.position = "absolute";
    d.style.right = positions[14] + '%';
    d.style.top = positions[15] + '%';
    var d = document.getElementById('R9');
    d.style.position = "absolute";
    d.style.right = positions[16] + '%';
    d.style.top = positions[17] + '%';
    var d = document.getElementById('R10');
    d.style.position = "absolute";
    d.style.right = positions[18] + '%';
    d.style.top = positions[19] + '%';
    var d = document.getElementById('R11');
    d.style.position = "absolute";
    d.style.right = positions[20] + '%';
    d.style.top = positions[21] + '%';
    var d = document.getElementById('R12');
    d.style.position = "absolute";
    d.style.right = positions[22] + '%';
    d.style.top = positions[23] + '%';
    var d = document.getElementById('R13');
    d.style.position = "absolute";
    d.style.right = positions[24] + '%';
    d.style.top = positions[25] + '%';
    var d = document.getElementById('R14');
    d.style.position = "absolute";
    d.style.right = positions[26] + '%';
    d.style.top = positions[27] + '%';
    var d = document.getElementById('R15');
    d.style.position = "absolute";
    d.style.right = positions[28] + '%';
    d.style.top = positions[29] + '%';
    var d = document.getElementById('R16');
    d.style.position = "absolute";
    d.style.right = positions[30] + '%';
    d.style.top = positions[31] + '%';
    var d = document.getElementById('R17');
    d.style.position = "absolute";
    d.style.right = positions[32] + '%';
    d.style.top = positions[33] + '%';
    var d = document.getElementById('R18');
    d.style.position = "absolute";
    d.style.right = positions[34] + '%';
    d.style.top = positions[35] + '%';
    var d = document.getElementById('R19');
    d.style.position = "absolute";
    d.style.right = positions[36] + '%';
    d.style.top = positions[37] + '%';
    var d = document.getElementById('R20');
    d.style.position = "absolute";
    d.style.right = positions[38] + '%';
    d.style.top = positions[39] + '%';
    var d = document.getElementById('R21');
    d.style.position = "absolute";
    d.style.right = positions[40] + '%';
    d.style.top = positions[41] + '%';
    var d = document.getElementById('R22');
    d.style.position = "absolute";
    d.style.right = positions[42] + '%';
    d.style.top = positions[43] + '%';
    var d = document.getElementById('R23');
    d.style.position = "absolute";
    d.style.right = positions[44] + '%';
    d.style.top = positions[45] + '%';
    var d = document.getElementById('R24');
    d.style.position = "absolute";
    d.style.right = positions[46] + '%';
    d.style.top = positions[47] + '%';
    var d = document.getElementById('R25');
    d.style.position = "absolute";
    d.style.right = positions[48] + '%';
    d.style.top = positions[49] + '%';
    var d = document.getElementById('RTarget');
    d.style.position = "absolute";
    d.style.right = positions[50] + '%';
    d.style.top = positions[51] + '%';
    //Setze Target
    Target();
}
//
//Bildschirmgroesse bestimmen
function Screen() {
    screenwidth = screen.width;
    screenheight = screen.height;
}
//
//Positionen der linken Kreise berechnen
function GetLeftPosition() {
    while (i < (2 * anzahl + 2)) {
        //Bestimmen der Position
        positions[i] = Math.random() * 43 + 5;
        positions[i + 1] = Math.random() * 95;
        //Pruefen, ob Position zulaessig
        for (j = 0; j < i; j += 2) {
            if ((Math.sqrt(Math.pow((positions[i] - positions[j]), 2) + Math.pow((positions[i + 1] - positions[j + 1]), 2))) > (5)) {}
            else {
                i -= 2;
                break;
            }
        }
        i += 2;
    }
    //zuruecksaetzen von i
    i = 0;
}
//
//Positionen der rechten Kreise berechnen
function GetRightPosition() {
    while (i < (2 * anzahl + 2)) {
        //Bestimmen der Position
        positions[i] = Math.random() * 45;
        positions[i + 1] = Math.random() * 95;
        //Pruefen, ob Position zulaessig
        for (j = 0; j < i; j += 2) {
            if ((Math.sqrt(Math.pow((positions[i] - positions[j]), 2) + Math.pow((positions[i + 1] - positions[j + 1]), 2))) > (5)) {}
            else {
                i -= 2;
                break;
            }
        }
        i += 2;
    }
    //zuruecksaetzen von i
    i = 0;
}
//
//Target
function Target() {
    if (Seite == 0) {
        //Linke Seite ist aktiv
        //Target auf rechter Seite wird deaktiviert (Sichtbarkeit=0)
        var d = document.getElementById('RTarget');
        d.style.opacity = 0;
        //Target auf linker Seite wird aktiviert (Sichtbarkeit=1)
        var d = document.getElementById('LTarget');
        d.style.opacity = 1;
    }
    else {
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
function EndInput() {
    window.scrollTo(0, 1);
    var d = document.getElementById('Input');
    //get vpn number and store it to object
    var vpn = document.getElementById('vpnNumber').value;
    if (vpn != "") {
        testSubjectResult.vpn = vpn;
        //display yellow screen for synchronisation during experiment analyses
        setTimeout(function () {
            document.getElementById('synchroniser').style.display = 'block';
        }, 500);
        setTimeout(function () {
            document.getElementById('synchroniser').style.display = 'none';
        }, 2000);
        d.style.zIndex = 1;
        experimentStart = Date.now();
        experimentDate = Date();
        //Bestimmen der Groesse der Target-Kreise in Abhaengigkeit zur Bildschirmgroesse
        SetSizeTarget();
        weiter = true;
        ShowGoOnButton();
    }
    else {
        alert("Please enter VPN before proceeding!");
        location.reload();
    }
}
//
//Setze Playmode
function SetPlaymode() {
    if (schwierigkeit == 0) {
        width = (17 / 1366) * 100;
        height = (17 / 768) * 100;
        var d = document.getElementById('L1');
        d.style.width = width + '%';
        d.style.height = height + '%';
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
    if (schwierigkeit == 1) {
        width = (20 / 1366) * 100;
        height = (20 / 768) * 100;
        var d = document.getElementById('L1');
        d.style.width = width + '%';
        d.style.height = height + '%';
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
    if (schwierigkeit == 2) {
        width = (22 / 1366) * 100;
        height = (22 / 768) * 100;
        var d = document.getElementById('L1');
        d.style.width = width + '%';
        d.style.height = height + '%';
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
//r
//Speichert das Ergebnis jeder Runde in einer Matrix
function SaveResult(score, scoretime) {
    var result0 = [];
    var result1 = [];
    var result2 = [];
    result0[round] = choice; //richtige Wahl?
    result1[round] = scoretime; //wie lange?
    result2[round] = score; //neuer Score
    //console.log(result0);
    //console.log(result1);
    //console.log(result2);
}
//
//Bestimmen der Groesse der Target-Kreise in Abhaengigkeit zur Bildschirmgroesse
function SetSizeTarget() {
    width = (25 / 1366) * 100;
    height = (25 / 768) * 100;
    var d = document.getElementById('LTarget');
    d.style.width = width + '%';
    d.style.height = height + '%';
    var d = document.getElementById('RTarget');
    d.style.width = width + '%';
    d.style.height = height + '%';
}
//
//
function ShowScore() {
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
    var rightchoicepercent = 100 * rightchoice / game;
    var scorehandicap = Math.round(score / game);
    rightchoicepercent = Math.round(rightchoicepercent);
    //ATTENTION: Quick workaround as program tends to display percentage greater than 100. Need to check again. For the time being this 
    //method is used to not confuse the player.
    if (rightchoicepercent > 100) {
        rightchoicepercent = 100;
    }
    document.getElementById('scoreanzeige').innerHTML = "<br><br><br><br><br><br><br><br>" + rightchoicepercent + "% of the time, you chose correctly. <br> Handicap: " + scorehandicap;
    score = 0;
    newround = 1;
    weiter = true;
    showGoOn = true;
    var d = document.getElementById('gruenerBalken2');
    d.style.height = scoreheight + "%";
}
//
//
function NextGame() {
    gameplayed = false;
    var date = new Date();
    var time = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
    Score();
    var d = document.getElementById('leftside1');
    d.style.zIndex = 2;
    var d = document.getElementById('leftside2');
    d.style.zIndex = 1;
    var d = document.getElementById('rightside1');
    d.style.zIndex = 2;
    var d = document.getElementById('rightside2');
    d.style.zIndex = 1;
    if (time - roundstart > roundlength || startNextGame == 1) {
        if (startNextGame == 1) {
            game--;
        }
        startNextGame = 0;
        weiter = false;
        ShowScore();
        game = 1;
        counterToInterruption++;
        subjectScoretime[counterToInterruption] = scoretime;
        subjectChoice[counterToInterruption] = choice;
        subjectScore[counterToInterruption] = score;
        subjectTime[counterToInterruption] = timeExact;
        subjectScoretimeExact[counterToInterruption] = scoretimeExact;
        console.log(subjectTime);
    }
    else {
        weiter = true;
        game++;
        counterToInterruption++;
        subjectScoretime[counterToInterruption] = scoretime;
        subjectChoice[counterToInterruption] = choice;
        subjectScore[counterToInterruption] = score;
        subjectTime[counterToInterruption] = timeExact;
        subjectScoretimeExact[counterToInterruption] = scoretimeExact;
        console.log(subjectTime);
        GoOn();
        //gameplayed = true;
    }
}
//
//Scoreleiste 
function ReduceScore1() {
    var date = new Date();
    var time = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
    var dzwei = document.getElementById('gruenerBalken2');
    var ddrei = document.getElementById('gruenerBalken3');
    if (time - starttime >= 10) {
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
        scoreheight = 80 - ((lastfivescore / t) + 1) * 10;
        //Setze Hoehe des Scorebalkens
        var d = document.getElementById('gruenerBalken2');
        d.style.height = scoreheight + '%';
    }
}

function ReduceScore2() {
    var date = new Date();
    var time = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
    var dzwei = document.getElementById('gruenerBalken2');
    var ddrei = document.getElementById('gruenerBalken3');
    if (time - starttime >= 20) {
        ddrei.style.height = 0 + '%';
    }
}

function ReduceScore3() {
    var date = new Date();
    var time = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
    var dzwei = document.getElementById('gruenerBalken2');
    var ddrei = document.getElementById('gruenerBalken3');
    if (time - starttime >= 24) {
        //Scorebalken ausblenden
        dzwei.style.zIndex = 1;
        //Motivationsbalken einblenden und Transition starten
        ddrei.style.zIndex = 10;
        ddrei.style.height = scoreheight * 0.25 + '%';
        reducesorefour = true;
        var k = 0;
        for (k = game; k > game - 5; k--) {
            if (k > 0) {
                lastscore[k] = scoreheight * 0.5;
            }
        }
    }
}

function ReduceScore4() {
    var date = new Date();
    var time = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
    var dzwei = document.getElementById('gruenerBalken2');
    var ddrei = document.getElementById('gruenerBalken3');
    if (time - starttime >= 32) {
        //Scorebalken ausblenden
        dzwei.style.zIndex = 1;
        //Motivationsbalken einblenden und Transition starten
        ddrei.style.zIndex = 10;
        ddrei.style.height = 0 + '%';
        var k = 0;
        for (k = game; k > game - 5; k--) {
            if (k > 0) {
                lastscore[k] = scoreheight * 0.25;
            }
        }
    }
};
/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.3.2
 * 2016-06-16 18:25:19
 *
 * By Eli Grey, http://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */
/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */
/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
var saveAs = saveAs || (function (view) {
    "use strict";
    // IE <10 is explicitly unsupported
    if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
        return;
    }
    var doc = view.document
        // only get URL when necessary in case Blob.js hasn't overridden it yet
        
        , get_URL = function () {
            return view.URL || view.webkitURL || view;
        }
        , save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
        , can_use_save_link = "download" in save_link
        , click = function (node) {
            var event = new MouseEvent("click");
            node.dispatchEvent(event);
        }
        , is_safari = /constructor/i.test(view.HTMLElement) || view.safari
        , is_chrome_ios = /CriOS\/[\d]+/.test(navigator.userAgent)
        , throw_outside = function (ex) {
            (view.setImmediate || view.setTimeout)(function () {
                throw ex;
            }, 0);
        }
        , force_saveable_type = "application/octet-stream"
        // the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
        
        , arbitrary_revoke_timeout = 1000 * 40 // in ms
        
        , revoke = function (file) {
            var revoker = function () {
                if (typeof file === "string") { // file is an object URL
                    get_URL().revokeObjectURL(file);
                }
                else { // file is a File
                    file.remove();
                }
            };
            setTimeout(revoker, arbitrary_revoke_timeout);
        }
        , dispatch = function (filesaver, event_types, event) {
            event_types = [].concat(event_types);
            var i = event_types.length;
            while (i--) {
                var listener = filesaver["on" + event_types[i]];
                if (typeof listener === "function") {
                    try {
                        listener.call(filesaver, event || filesaver);
                    }
                    catch (ex) {
                        throw_outside(ex);
                    }
                }
            }
        }
        , auto_bom = function (blob) {
            // prepend BOM for UTF-8 XML and text/* types (including HTML)
            // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
            if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
                return new Blob([String.fromCharCode(0xFEFF), blob], {
                    type: blob.type
                });
            }
            return blob;
        }
        , FileSaver = function (blob, name, no_auto_bom) {
            if (!no_auto_bom) {
                blob = auto_bom(blob);
            }
            // First try a.download, then web filesystem, then object URLs
            var filesaver = this
                , type = blob.type
                , force = type === force_saveable_type
                , object_url, dispatch_all = function () {
                    dispatch(filesaver, "writestart progress write writeend".split(" "));
                }
                // on any filesys errors revert to saving with object URLs
                
                , fs_error = function () {
                    if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
                        // Safari doesn't allow downloading of blob urls
                        var reader = new FileReader();
                        reader.onloadend = function () {
                            var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
                            var popup = view.open(url, '_blank');
                            if (!popup) view.location.href = url;
                            url = undefined; // release reference before dispatching
                            filesaver.readyState = filesaver.DONE;
                            dispatch_all();
                        };
                        reader.readAsDataURL(blob);
                        filesaver.readyState = filesaver.INIT;
                        return;
                    }
                    // don't create more object URLs than needed
                    if (!object_url) {
                        object_url = get_URL().createObjectURL(blob);
                    }
                    if (force) {
                        view.location.href = object_url;
                    }
                    else {
                        var opened = view.open(object_url, "_blank");
                        if (!opened) {
                            // Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
                            view.location.href = object_url;
                        }
                    }
                    filesaver.readyState = filesaver.DONE;
                    dispatch_all();
                    revoke(object_url);
                };
            filesaver.readyState = filesaver.INIT;
            if (can_use_save_link) {
                object_url = get_URL().createObjectURL(blob);
                setTimeout(function () {
                    save_link.href = object_url;
                    save_link.download = name;
                    click(save_link);
                    dispatch_all();
                    revoke(object_url);
                    filesaver.readyState = filesaver.DONE;
                });
                return;
            }
            fs_error();
        }
        , FS_proto = FileSaver.prototype
        , saveAs = function (blob, name, no_auto_bom) {
            return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
        };
    // IE 10+ (native saveAs)
    if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
        return function (blob, name, no_auto_bom) {
            name = name || blob.name || "download";
            if (!no_auto_bom) {
                blob = auto_bom(blob);
            }
            return navigator.msSaveOrOpenBlob(blob, name);
        };
    }
    FS_proto.abort = function () {};
    FS_proto.readyState = FS_proto.INIT = 0;
    FS_proto.WRITING = 1;
    FS_proto.DONE = 2;
    FS_proto.error = FS_proto.onwritestart = FS_proto.onprogress = FS_proto.onwrite = FS_proto.onabort = FS_proto.onerror = FS_proto.onwriteend = null;
    return saveAs;
}(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this.content));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window
if (typeof module !== "undefined" && module.exports) {
    module.exports.saveAs = saveAs;
}
else if ((typeof define !== "undefined" && define !== null) && (define.amd !== null)) {
    define("FileSaver.js", function () {
        return saveAs;
    });
};