window.onload=function(){
	SIMON.init();	
};

/*Data store*/
var sequence = (function() {
    var index = 0,
        data = [];
    return {
        next: function() {
            var element;
            if (!this.hasNext()) {
                return null;
            }
            element = data[index];
            index += 1;
            return element;
        },
        hasNext: function() {
            return index < data.length;
        },
        reset: function() {
            index = 0;
            return data[index];
        },
        add:function(itm){
				data.push(itm);       
        },
    	  getArray:function(){
 				return data;   	  
    	  }
    }
}());

/*main game 'class'*/
var SIMON = (function () {
		var txtWin = "You WON!!! :)";
		var txtLoss ="Game Over :(";
		var startButton = ".btn.start";
		var touchPadClassName = "touchpad";
		var usersTurn =false;
		var numSquares=4;
		var gameInProgress=false;
		var levelNames=['one','two','three','four','five','six','seven','eight','nine','ten'];
	
	function init() {
		wireUpStartButtonClick(startButton);
		wireUpGamePieceClicks();
	}

	function wireUpStartButtonClick(btn){
		document.querySelector(btn).onclick=function () { 
			gameOn();
			disableButton(btn);
		};
	}

	function gameOn() {
		if(!gameInProgress){
			gameInProgress =true;			
			generateSequence(3);
			startNewLevel();
		}
	}	
	
	function startNewLevel(){
			setUsersTurn(false);
			sequence.reset();
			displayLevel(levelNames);
			advanceLevel(levelNames);
			generateSequence(1);
			activateSquares(sequence.getArray());
	}
	
	function activateSquares(sequenceArray){
			var c = 0;
			var intvl = setInterval(function() {
				playSoundByName('beep');				
				flash(sequenceArray[c]);				
				c++;
				if (c >= sequenceArray.length) {
					clearInterval(intvl);
					setUsersTurn(true);
				}
			}, 1000);
	}

	function wireUpGamePieceClicks(){
		var sectors = document.querySelectorAll('.'+touchPadClassName);

		for(var i = 0; i < sectors.length; ++i) {
			sectors[i].addEventListener('click', function(event) {    
            addClickBehavior(event);  
			});
		}		
	}

	function addClickBehavior(event) {
			event.preventDefault();
			var target = (event.target) ? event.target : event.srcElement;  
			if(isUsersTurn()){							
				var expected = sequence.next();
				var actual = parseInt(target.getAttribute("data-sector"));			
				checkGameStatus(expected,actual);
			}		
	}	
	
	function checkGameStatus(expected,actual){
		if (!sequence.hasNext() && expected === actual) {
			if(levelNames[0] === 'ten')
			{
				notifyUser(txtWin);			
			}
			else{
				startNewLevel();
			}
		}
		else if (expected !== actual) {
			notifyUser(txtLoss);
		}
	}

	/*Helper Functions*/
	function generateSequence(quantity){
		for (var i = 1; i <= quantity; i++) {
				sequence.add(randomNumber(numSquares));
		}
	}
	
	function disableButton(btn){
			var buttn =document.querySelector(btn);
			buttn.className = buttn.className + " disabled";
	}

	function advanceLevel(levels){
		levels.shift();	
	}

	function displayLevel(levels){
		document.getElementById('level').innerHTML =levels[0];
	}

	function isUsersTurn(){
		return usersTurn;	
	}

	function setUsersTurn(tf){
		usersTurn = tf;
	}

	function notifyUser(txt){
		var container =document.getElementById('score');
		container.children[0].innerHTML = txt;
		container.className ="result";
	}	
	
	function playSoundByName(name){
		document.getElementById(name).play();
	}
	
	function randomNumber(interval){
     	return Math.floor((Math.random()*interval)+1);
	}
	
	function flash(touchpad){
		var e = getElementByDataAttr('data-sector','a',touchpad);
  		e.className = e.className + " glow";
		window.setTimeout(function() {
	 			e.className=touchPadClassName;
 		}, 200);
	}

	function getElementByDataAttr(attribute,tag,value)
	{
  		var allElements = document.getElementsByTagName(tag);
  		for(var i = 0, n = allElements.length; i < n; i++)
  		{
  			var vl =allElements[i].getAttribute(attribute);
    		if (parseInt(vl) === value)
    		{
    				return allElements[i];
    		}
  		}
	}

	return {
		init:init
	};
})();