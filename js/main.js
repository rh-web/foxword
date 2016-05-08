/**
* Main app JS functions
*
* @author: Radek Hiess
* @link: http://rh-web.cz
*
*/

console.info("App start");
console.log(navigator.userAgent);

/**
 * alphabet for declareLetters function
 * @type {array}
 */
var alphabet = [];

/**
 * array of levels
 * @type {array}
 */
var levels = [];

/**
 * array of corssed letters in crossword
 * @type {array}
 */
var crossedLetters = [];

/**
 * array {word, orientation} with word and its orientation
 * @type {array}
 */
var wordOrientation = [];

/**
 * array of unique random numbers from randomInt()
 * @type {array}
 */
var uniqueRandoms = [];

/**
 * number of game which was chosen
 * @type {int}
 */
var gameLevel;

/**
 * language of game which was chosen
 * @type {String}
 */
var gameLang;

/**
* id of temporary next letter in grid
* @type {String}
*/
var tmpNextId;

/* ################################################################################## */

/**
* Unique random numbers generator
* Source: Stack Overflow - http://stackoverflow.com/a/19351899
*
* @author jfriend00 - http://stackoverflow.com/users/816620/jfriend00
* @method randomInt
* @param {int} start - start number
* @param {int} end - end number
* @return {int} val - random unique number
*/
function randomInt(start, end) {
    // refill the array if needed
    if (!uniqueRandoms.length) {
        for (var i = start; i <= end; i++) {
            uniqueRandoms.push(i);
        }
    }
    var index = Math.floor(Math.random() * uniqueRandoms.length);
    var val = uniqueRandoms[index];
    // now remove that value from the array
    uniqueRandoms.splice(index, 1);
    return val;
}; /* randomInt() */

/* ################################################################################## */

/**
* Load from storage number of coins and display it
*
* @method displayCoins
*/
function displayCoins() {
  asyncStorage.getItem('coins', function(coins) {
    console.log('coins:', coins);
    if(coins === null) {
      /* default value */
      $('.coins').text('0');
    } else {
      /* stored value */
      $('.coins').text(coins);
    }
  });
}; /* displayCoins() */

/* ################################################################################## */

/**
* Help1 - reveal random letter in .active grid
*
* @method helpShowLetter
*/
function helpShowLetter() {
  var len = $(".active").length;
  var ran = randomInt(0,len-1);
  console.log(len + ";  " + ran);
  var helpRevealedLetter = $(".active").slice(ran,ran+1);
  helpRevealedLetter = helpRevealedLetter[0];
  console.log(helpRevealedLetter);
  console.log($(helpRevealedLetter).hasClass("doneWord"));
  if ( $(helpRevealedLetter).hasClass("doneWord") === false ) {
    console.log("it is false so decrement");
    $(helpRevealedLetter).text( $(helpRevealedLetter).attr("letter") )
    $(helpRevealedLetter).addClass("doneWord");

    helpRevealedLetter = $(helpRevealedLetter).attr("id");
    console.log(helpRevealedLetter);
    return helpRevealedLetter;

  } else {
    console.log("it is true and recursive");
    var j = $(".active.doneWord").length;
    console.log(j);
    console.log(len-1);
    if(j<len-1) {
      helpShowLetter();
    }
  }
}

/* ################################################################################## */

/**
* Write letters to the grid
*
* @method writeToGrid
*/
Word.prototype.writeToGrid = function(doneWordsInLevel) {
	/* wordArr,row,col,orient */

console.log("wordArr.name:   "+this.name);
console.log(doneWordsInLevel);

  var isDone = false;
  console.log(doneWordsInLevel[gameLang].doneWords.indexOf(this.name));
  if(doneWordsInLevel[gameLang].doneWords.indexOf(this.name) > -1) {
    isDone = true;
  }
  console.log(isDone);

	if(this.orient=="horizontal") {
		this.col--;
		for(var i=2;i<this.wordArr.length;i++){
			this.col++;

      if(isDone){
        $( "#g"+this.row+this.col ).text( this.wordArr[i] );  /*   <------ write letter to grid */
        $( "#g"+this.row+this.col ).addClass("doneWord");
      }

			$( "#g"+this.row+this.col ).attr("letter",this.wordArr[i]);
			//$( "#g"+row+col ).attr("horizontalorder",i-2);
			$( "#g"+this.row+this.col ).addClass("visible"); /* default: visible */
			$( "#g"+this.row+this.col ).addClass("empty");
			$( "#g"+this.row+this.col ).attr("horizontal",this.name);
		}
	}

	if(this.orient=="vertical") {
		this.row--;
		for(var i=2;i<this.wordArr.length;i++){
			this.row++;

      if(isDone){
        $( "#g"+this.row+this.col ).text( this.wordArr[i] );  /*   <------ write letter to grid */
        $( "#g"+this.row+this.col ).addClass("doneWord");
      }

			$( "#g"+this.row+this.col ).attr("letter",this.wordArr[i]);
			//$( "#g"+row+col ).attr("verticalorder",i-2);
			$( "#g"+this.row+this.col ).addClass("visible"); /* default: visible */
			$( "#g"+this.row+this.col ).addClass("empty");
			$( "#g"+this.row+this.col ).attr("vertical",this.name);
		}
	}
}; // writeToGrid()

/* ################################################################################## */

/**
* Declare letters to bottom offer
*
* @method declareLetters
*/
Word.prototype.declareLetters = function() {

console.log(this.declaredLetters);

	/* naplnime random pismeny */
	for(var i=1;i<13;i++){
		this.declaredLetters[i][0] = alphabet.alphabet[ randomInt(0,alphabet.alphabet.length-1) ];
    this.declaredLetters[i][1] = "random";
	}

	uniqueRandoms = []; /* reset */

	/* naplnime pismeny slova */
	for(var i=2;i<this.wordArr.length;i++){
		var j=randomInt(1,12);
		this.declaredLetters[j][0] = this.wordArr[i];
    this.declaredLetters[j][1] = "right";
	}
	uniqueRandoms = []; /* reset */

	console.log("declaredLetters[] :  ");
	console.log(this.declaredLetters);
}; // declareLetters()

/* ################################################################################## */

/**
* Write declared letters to bottom offer
*
* @method writeLettersToBottom
*/
Word.prototype.writeLettersToBottom = function() {

	$(".letter").removeClass("hidden random right helped-letter");

	for(var i=1;i<13;i++){
		$( "#l"+i ).text( this.declaredLetters[i][0] );
    $( "#l"+i ).addClass( this.declaredLetters[i][1] );
	}

}; // writeLettersToBottom()

/* ################################################################################## */

/**
* Tap to grid-letter and active the word
*
* @method activateWord
* @param {array} wordOrientation - array {word, oriention}
*/
Level.prototype.activateWord = function(wordOrientation) {
	console.log(".active click activateWord" );

	/* reset all active */
	$(".active").removeClass("active highlight");
	$(".doneLetter").removeClass("doneLetter");
	$(".full:not(.secondDoneWord)").text("\xA0");
	$(".full").removeClass("full").addClass("empty");
  // $(".letter").addClass("hidden");

	if(this.word0.name == wordOrientation[1]) {
		/* word0 */
		$('div[' + wordOrientation[0] + '="' + wordOrientation[1] + '"]').addClass('active');

		/* set picture */
		$('.preview-pic img').attr('src','img/pics/' + this.word0.wordArr[0] );
		$('.fimg').attr('src','img/pics/' + this.word0.wordArr[0] );

		$("#fimg").attr("title", this.word0.wordArr[1] );
		if($("#fimg").attr("title")!="") $(".imgtitle").text($("#fimg").attr("title"));

    /* write letters to bottom offer */
    $(".letter").addClass("hidden");
    console.log(this.doneWordsInLevel[gameLang].doneWords.indexOf(this.word0.name));
    if(this.doneWordsInLevel[gameLang].doneWords.indexOf(this.word0.name) === -1) {
      console.log("doneWordsInLevel.indexOf == false");
      this.word0.writeLettersToBottom();
    }


	} else if(this.word1.name == wordOrientation[1]) {
		/* word1 */
		$('div[' + wordOrientation[0] + '="' + wordOrientation[1] + '"]').addClass('active');

		/* set picture */
		$('.preview-pic img').attr('src','img/pics/' + this.word1.wordArr[0] );
		$('.fimg').attr('src','img/pics/' + this.word1.wordArr[0] );

		$("#fimg").attr("title", this.word1.wordArr[1] );
		if($("#fimg").attr("title")!="") $(".imgtitle").text($("#fimg").attr("title"));

		/* write letters to bottom offer */
    $(".letter").addClass("hidden");
    console.log(this.doneWordsInLevel[gameLang].doneWords.indexOf(this.word1.name));
    if(this.doneWordsInLevel[gameLang].doneWords.indexOf(this.word1.name) === -1) {
      console.log("doneWordsInLevel.indexOf == false");
      this.word1.writeLettersToBottom();
    }
	} else if(this.word2.name == wordOrientation[1]) {
		/* word2 */
		$('div[' + wordOrientation[0] + '="' + wordOrientation[1] + '"]').addClass('active');

		/* set picture */
		$('.preview-pic img').attr('src','img/pics/' + this.word2.wordArr[0] );
		$('.fimg').attr('src','img/pics/' + this.word2.wordArr[0] );

		$("#fimg").attr("title", this.word2.wordArr[1] );
		if($("#fimg").attr("title")!="") $(".imgtitle").text($("#fimg").attr("title"));

    /* write letters to bottom offer */
    $(".letter").addClass("hidden");
    console.log(this.doneWordsInLevel[gameLang].doneWords.indexOf(this.word2.name));
    if(this.doneWordsInLevel[gameLang].doneWords.indexOf(this.word2.name) === -1) {
      console.log("doneWordsInLevel.indexOf == false");
      this.word2.writeLettersToBottom();
    }
	}

  /* highlight first letter */
  $( ".empty.active:first" ).addClass("highlight");

}; // activateWord()

/* ################################################################################## */




/**
* Tap on a letter in bottom offer
*
* @method clickOnBottomOffer
* @param {array} wordOrientation - array {word, oriention}
* @param {String} selectedLetter - letter which was clicked
* @param {String} selectedLetterId - id of letter which was clicked
*/
Level.prototype.clickOnBottomOffer = function(wordOrientation, selectedLetter, selectedLetterId) {

  console.log("tmpNextId** " + tmpNextId);
  var tmpFirstId;
	var tmpLastId = $( ".active:last" ).attr('id');
	var rightWord = "";
	var tmpWord;

  if(tmpNextId == tmpLastId) {
    tmpWord += $("#"+tmpNextId).text();
  }
  if ($( "#"+tmpNextId ).hasClass("doneWord") || $( "#"+tmpNextId ).hasClass("secondDoneWord")) {
    if(tmpNextId != tmpLastId) {
      tmpNextId++;
      this.clickOnBottomOffer(wordOrientation, selectedLetter, selectedLetterId);
    }
  }

	/////////////////////

	/* do  rightWord uloží správné slovo */
	if(this.word0.name == wordOrientation[1]) {
		for(var i=2;i<this.word0.wordArr.length;i++){
			rightWord=rightWord + this.word0.wordArr[i];
		}
	} else if(this.word1.name == wordOrientation[1]) {
		for(var i=2;i<this.word1.wordArr.length;i++){
			rightWord=rightWord + this.word1.wordArr[i];
		}
	} else if(this.word2.name == wordOrientation[1]) {
		for(var i=2;i<this.word2.wordArr.length;i++){
			rightWord=rightWord + this.word2.wordArr[i];
		}
	}

	console.log("rightWord:  " + rightWord);

		///////////////////////

    // highlight next letter
    if ($( ".empty.active:eq(1)" ).hasClass("doneWord") || $( ".empty.active:eq(1)" ).hasClass("secondDoneWord")) {
      $( ".empty.active:eq(2)" ).addClass("highlight");
    } else {
      $( ".empty.active:eq(1)" ).addClass("highlight");
    }

    /* find id of cell in grid and write letter into it  */
		if(  $( ".empty.active:first" ).hasClass("doneLetter")  ) {
			if(wordOrientation[0]=="horizontal"){
				tmpFirstId = $( ".empty.active:first" ).attr('id');
				$( "#"+tmpFirstId ).removeClass("doneLetter empty").addClass("full secondDoneWord");

				tmpFirstId = tmpFirstId.substring(1, 3);
				tmpFirstId = parseInt(tmpFirstId);
				tmpFirstId = tmpFirstId+1;
        tmpNextId = tmpFirstId+2;
				tmpFirstId ="g"+tmpFirstId;

			} else {
				tmpFirstId = $( ".empty.active:first" ).attr('id');
				$( "#"+tmpFirstId ).removeClass("doneLetter empty").addClass("full secondDoneWord");
				var i      = tmpFirstId.substring(1, 2);
				i          = parseInt(i);
				i++;
        tmpNextId = i+2;
				tmpFirstId ="g"+i+tmpFirstId.substring(2, 3);
			}
		} else {
      tmpFirstId = $( ".empty.active:first" ).attr('id');
      tmpNextId = $( ".empty.active:eq(1)" ).attr("id");
		}

		$( "#"+selectedLetterId).addClass("hidden");

		// var helpActive=$(".active").attr("letter");
		console.log("selectedLetter- " + selectedLetter);
		console.log("tmpFirstId- " + tmpFirstId);
		console.log("tmpLastId- " + tmpLastId);
		console.log("rightWord- " + rightWord);
    console.log("tmpNextId- " + tmpNextId);

		/* naplnění písmenem */
		if( $("#"+tmpFirstId).hasClass("doneWord") || $("#"+tmpFirstId).hasClass("secondDoneWord") ) {
			tmpWord = $(".full").text();
			tmpWord += $("#"+tmpFirstId).text();
			$( "#"+tmpFirstId ).removeClass("doneWord").addClass("doneLetter");

			console.log("...");
			console.log(tmpWord);

		} else if( $("#"+tmpFirstId).hasClass("doneLetter") ) {
			tmpWord = $(".full").text();
			tmpWord += $("#"+tmpFirstId).text();
			$( "#"+tmpFirstId ).removeClass("doneLetter empty").addClass("full");

		} else {
			$( "#"+tmpFirstId ).text(selectedLetter);
			$( "#"+tmpFirstId ).removeClass("empty").addClass("full");
			if( $("#"+tmpFirstId).is("[vertical]") && $("#"+tmpFirstId).is("[horizontal]") ) {
				crossedLetters.push(tmpFirstId);
			}
			tmpWord = $(".full").text();

			console.log("tmpWord::  " + tmpWord);
		}

		console.log("crossedLetters array: " + crossedLetters);

    $( "#"+tmpFirstId ).removeClass("highlight");

		if(tmpFirstId==tmpLastId){
			if(tmpWord==rightWord) { /* if is successfuly matched */

				console.info("RIGHT WORD");

		    /* vibrace */
        if ('vibrate' in navigator) {
          window.navigator.vibrate([80, 70, 80]);
          console.log("Vibration are OK");
        } else {
           console.error("Vibration not supported");
        }

				/* save the word to doneWordsInLevel */
        if(this.word0.name == wordOrientation[1]) {
          this.doneWordsInLevel[gameLang].doneWords.push(this.word0.name);
        } else if(this.word1.name == wordOrientation[1]) {
          this.doneWordsInLevel[gameLang].doneWords.push(this.word1.name);
        } else if(this.word2.name == wordOrientation[1]) {
          this.doneWordsInLevel[gameLang].doneWords.push(this.word2.name);
        }

				console.log("vlozeno do doneWords");
				console.log(this.doneWordsInLevel);

        /* save to asyncStorage */
        asyncStorage.setItem('doneWordsInLevel', this.doneWordsInLevel, function() {
          console.log('doneWordsInLevel stored');
        });

        /* hide bottom offer */
        $( ".letter").addClass("hidden");

        $(".full").removeClass("full").addClass("doneWord");
				for(var i=0;i<crossedLetters.length;i++){
					$("#"+crossedLetters[i]).addClass("empty");
				}

        /* show message */
        $('.right-word-msg').fadeIn('fast').delay(1500).fadeOut('fast');

        /* add coins and save */
        asyncStorage.getItem('coins', function(coins) {

          /* 3 coins reward per 1 word */
          coins = coins + 3;
          $('.coins').text(coins);

          asyncStorage.setItem('coins', coins, function() {
            console.log('coins stored');
          });
        });

				/* if all three words are right completed load next level  */
        if(this.doneWordsInLevel[gameLang].doneWords.length == 3) {
					console.info("LOAD NEXT LEVEL");

          // console.log(savedGames);

          /* vibrace */
          if ('vibrate' in navigator) {
            window.navigator.vibrate(600);
            console.log("Vibration are OK");
          } else {
             console.error("Vibration not supported");
          }

          /* show message */
          $('.done-level-msg').fadeIn('fast').delay(2000).fadeOut('fast');

          /* increment and save saved-games */
          asyncStorage.getItem('saved-games', function(savedGames) {
            if(savedGames !== null) {
              console.log(savedGames);
              // console.log(savedGames[gameLang].lvl);
              savedGames[gameLang].lvl = parseInt(savedGames[gameLang].lvl) + 1;

              asyncStorage.setItem('saved-games', savedGames, function() {
                console.log('saved-games stored');
              });
            }
          });

          /* if it is last level show page #complete-game */
					if (this.currentLevel == levels.length - 1) {

						console.info("YOU WIN THE GAME");

						/* reset */
						crossedLetters = [];
            this.doneWordsInLevel[gameLang].doneWords = [];

            /* reset doneWordsInLevel */
						asyncStorage.getItem('doneWordsInLevel', function(doneWordsInLevel) {
				      if(doneWordsInLevel!==null) {
				        console.log(doneWordsInLevel);
				        doneWordsInLevel[gameLang].doneWords = [];
				        console.log(doneWordsInLevel);

				        /* save to asyncStorage */
				        asyncStorage.setItem('doneWordsInLevel', doneWordsInLevel, function() {
				          console.log('doneWordsInLevel reseted');
				        });
				      }
				    });

            /* reset helpRemovedWord */
            asyncStorage.removeItem('helpRemovedWord', function(value) {
              console.log("helpRemovedWord removed");
            });

            /* reset helpShownLetters */
            asyncStorage.removeItem('helpShownLetters', function(value) {
              console.log("helpShownLetters removed");
            });

            $.mobile.navigate( "#complete-game" );

					 } else {
					 	/* if it is not last level load next level */

						/* reset */
						$(".grid-letter").each(function() {
						  $(this).removeClass("visible active empty doneWord secondDoneWord doneLetter");
						  $(this).removeAttr("vertical horizontal letter");
						  $(this).text("\xA0");
						});

						/* reset */
						crossedLetters = [];
						console.log(this.doneWordsInLevel);
            this.doneWordsInLevel[gameLang].doneWords = [];

            /* reset doneWordsInLevel */
						asyncStorage.getItem('doneWordsInLevel', function(doneWordsInLevel) {
				      if(doneWordsInLevel!==null) {
				        console.log(doneWordsInLevel);
				        doneWordsInLevel[gameLang].doneWords = [];
				        console.log(doneWordsInLevel);

				        /* save to asyncStorage */
				        asyncStorage.setItem('doneWordsInLevel', doneWordsInLevel, function() {
				          console.log('doneWordsInLevel reseted');
				        });
				      }
				    });

            /* reset helpRemovedWord */
            asyncStorage.removeItem('helpRemovedWord', function(value) {
              console.log("helpRemovedWord removed");
            });

            /* reset helpShownLetters */
            asyncStorage.removeItem('helpShownLetters', function(value) {
              console.log("helpShownLetters removed");
            });

            this.currentLevel = parseInt(this.currentLevel) + 1;

						console.log("currentLevel:  " +this.currentLevel);
            console.log("wordOrientation pole::  "  + wordOrientation);
            console.log("--------");

						this.loadLevel();

  					console.log("level.loadLevel() called ----");
            console.log("currentLevel:  " +this.currentLevel);
					 }
				}

			} else {
				console.info("WRONG WORD");

				/* blink .grid-letter.active red */
        $('.grid-letter.active').queue(function(){
        	$('.grid-letter.active').css('border-color','#FC0808');
        	setTimeout(function(){
        		$('.grid-letter.active').removeAttr('style');
        	},200);
        	$('.grid-letter.active').dequeue();
        });


				/* reset */
				crossedLetters = [];

        $(".grid-letter").removeClass("highlight");

				$(".full:not(.secondDoneWord, .doneWord)").text("\xA0");  // "\xA0"  = mezera
				$( ".full").removeClass("full").addClass("empty");
				$(".doneLetter").removeClass("doneLetter");
				$(".letter").removeClass("hidden");

        /* highlight first letter */
        $( ".empty.active:first" ).addClass("highlight");

			}
		}

}; // clickOnBottomOffer()


/* ################################################################################## */

/**
* Load level
*
* @method loadLevel
*/
Level.prototype.loadLevel = function() {

  console.log("loading level...");
  
  this.word0.name = levels[this.currentLevel].wrd0.name;
  this.word0.wordArr = levels[this.currentLevel].wrd0.wrd;
	this.word0.row = levels[this.currentLevel].wrd0.row;
	this.word0.col = levels[this.currentLevel].wrd0.col;
	this.word0.orient = levels[this.currentLevel].wrd0.orient;


	console.log("objekt slova:");
	console.log(this.word0);

  this.word1.name = levels[this.currentLevel].wrd1.name;
  this.word1.wordArr = levels[this.currentLevel].wrd1.wrd;
	this.word1.row = levels[this.currentLevel].wrd1.row;
	this.word1.col = levels[this.currentLevel].wrd1.col;
	this.word1.orient = levels[this.currentLevel].wrd1.orient;

	console.log("objekt slova:");
	console.log(this.word1);

  this.word2.name = levels[this.currentLevel].wrd2.name;
  this.word2.wordArr = levels[this.currentLevel].wrd2.wrd;
	this.word2.row = levels[this.currentLevel].wrd2.row;
	this.word2.col = levels[this.currentLevel].wrd2.col;
	this.word2.orient = levels[this.currentLevel].wrd2.orient;

	console.log("objekt slova:");
	console.log(this.word2);

  console.log(this.doneWordsInLevel);

  this.word0.writeToGrid(this.doneWordsInLevel);
  this.word0.declareLetters();


  this.word1.writeToGrid(this.doneWordsInLevel);
  this.word1.declareLetters();


	this.word2.writeToGrid(this.doneWordsInLevel);
	this.word2.declareLetters();

  wordOrientation[0] = this.word0.orient;
  wordOrientation[1] = this.word0.name;
  console.log("wordOrientation:  "+ wordOrientation);
  this.activateWord(wordOrientation);

  /* get helpRemovedWord */
  asyncStorage.getItem('helpRemovedWord', function(value) {
    if(value!==null) {
      helpRemovedWord = value;
      /* if help 2 was used hide letters */
      if(helpRemovedWord.indexOf(wordOrientation[1]) > -1) {
        $(".letter.random").addClass("helped-letter");
      }
    }
    // console.log(helpRemovedWord);
  });

  /* get helpShownLetters */
  asyncStorage.getItem('helpShownLetters', function(value) {
    if(value!==null) {
      helpShownLetters = value;
      console.log(helpShownLetters);
      if(helpShownLetters[0] == gameLang) {
        for (var i=1; i< helpShownLetters.length; i++) {
          console.log("#"+helpShownLetters[i]);
          var lett = $("#"+helpShownLetters[i]).attr("letter");
          console.log(lett);
          $("#"+helpShownLetters[i]).text(lett);
          $("#"+helpShownLetters[i]).addClass("doneWord");
        }
      }
    }
  });

  /* write level number */
	$(".level-num").text( parseInt(this.currentLevel)+1 );

}; // loadLevel()


////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////


$(document).ready(function() {
	console.log("document.ready  ==========");

  /* set defaultni values */
  gameLevel = 0;
  gameLang = "cs";

}); /* document.ready */


/* ----------------------------------- */


$(document).on( "pagebeforeshow", "#home", function () {

  console.log("#home pagebeforeshow  ==========");

  /* get saved-games */
  asyncStorage.getItem('saved-games', function(savedGames) {
    $("#index-menu").empty();
    if(savedGames !== null) {
      console.log(savedGames);
      /* display li buttons in #home */
      for ( var prop in savedGames ) {
          $("#index-menu").append('<li><a href="#play" class="playbutton ui-link ui-btn ui-btn-a ui-shadow ui-corner-all" role="button" data-role="button" data-theme="a" data-game-lvl="' + savedGames[prop].lvl + '" data-game-lang="' + prop + '">' + savedGames[prop].desc + '</a></li>');
      }
    }
    $("#index-menu").append('<li><a role="button" class="ui-link ui-btn ui-btn-a ui-shadow ui-corner-all" href="#new-game" data-role="button" data-theme="a">New Game</a></li>');
  });

  /* display player-name */
  asyncStorage.getItem('player-name', function(value) {
    console.log('player-name:', value);
    if(value !== null) {
      $('.player-name').text(value);
    }
  });

  /* display avatar */
  asyncStorage.getItem('player-photo', function(value) {
    if(value !== null) {
      value = window.URL.createObjectURL(value);
      console.log('player-photo:', value);
      if(value !== null) {
        $('.avatar').attr('src', value);
      }
      window.URL.revokeObjectURL(value); /* release object */
    }
  });

  /* display coins */
  displayCoins();

}); /* document.pageinit #home */


/* ----------------------------------- */

/*
  PASS OF LVL AND LANG BETWEEN PAGES
*/
$(document).on('click', '.playbutton', function() {
  // store some data
  console.log( $(this).attr("data-game-lang") + ";" + $(this).attr("data-game-lvl") );

  console.log("gameLevel:  " + gameLevel);
  console.log("gameLang:  " + gameLang);

  gameLevel = $(this).attr("data-game-lvl");
  gameLang = $(this).attr("data-game-lang");

  console.log("gameLevel:  " + gameLevel);
  console.log("gameLang:  " + gameLang);

  if(gameLevel == 0) {
    /* save new game to store */

    var gameDesc = $(this).text();
    asyncStorage.getItem('saved-games', function(savedGames) {
      if(savedGames!==null) {
        var newGame = {lvl:0,desc:gameDesc};
        savedGames[gameLang] = newGame;
        console.log(savedGames);

        asyncStorage.setItem('saved-games', savedGames, function() {
          console.log('saved-games stored');
        });
      } else {
      	/* create new game */
        var newGame = JSON.parse('{"'+gameLang+'":{"lvl": 0,"desc": "'+gameDesc+'"}}');
        asyncStorage.setItem('saved-games', newGame, function() {
          console.log('saved-games stored');
        });
      }
    });
  }

  //Change page
  $.mobile.changePage("#play");

}); /* document.onclick .playbutton */


/* ----------------------------------- */


$(document).on('pagebeforeshow', '#play', function(){

  console.log("#play pagebeforeshow  ==========");

  // reset
  $(".grid-letter").each(function() {
	  $(this).removeClass("visible active empty doneWord secondDoneWord doneLetter");
	  $(this).removeAttr("vertical horizontal letter");
	  $(this).text("\xA0");
	});
  $(".letter").addClass("hidden");
  $(".grid-letter").removeClass("highlight");
  /* reset */
  crossedLetters = [];

  // level 0 declaration
  var level = new Level(gameLevel);
  var helpRemovedWord = [];

  /* load alphabet from file */
  $.ajaxSetup({ mimeType: "text/plain" });
  $.getJSON( "./json/alphabet/" + gameLang + ".json").done(function(data) {
      console.log("soubor ./json/alphabet/"+gameLang+".json byl nacten");
      alphabet = data;
      console.log("abeceda: ");
      console.log(alphabet);
  }).fail(function(jqxhr, textStatus, error) {
      var err = textStatus + ", " + error;
      console.error("chyba pri nacitani "+gameLang+".json: "+err);
    });


  /* load levels from file and call loadLevel() */
  $.ajaxSetup({ mimeType: "text/plain" });
  $.getJSON( "./json/levels/" + gameLang + ".json", function(data) {

    /* reset */
    levels = [];

    $.each(data, function(key, val) {
      levels.push(val);
    });
    console.log(levels);
  }).done(function(data) {
      console.log("soubor ./json/levels/"+gameLang+".json byl nacten");

      /* get doneWordsInLevel */
      asyncStorage.getItem('doneWordsInLevel', function(doneWordsInLevel) {
        console.log(doneWordsInLevel);

        if(doneWordsInLevel!==null) {
          if(doneWordsInLevel[gameLang] === undefined) {
          	doneWordsInLevel[gameLang] = {};
          	doneWordsInLevel[gameLang].doneWords = [];
          }
          console.log(doneWordsInLevel);
          level.doneWordsInLevel = doneWordsInLevel;
        } else {
        	level.doneWordsInLevel[gameLang] = {};
          level.doneWordsInLevel[gameLang].doneWords = [];
        }

        level.loadLevel();

      });

      console.log("currentLevel: "+level.currentLevel);
      console.log("level.loadLevel() called  ----");
    }).fail(function(jqxhr, textStatus, error) {
        var err = textStatus + ", " + error;
        console.error("chyba pri nacitani "+gameLang+".json: "+err);
      });

  console.log("wordOrientation pole::  ");
  console.log(wordOrientation);
  console.log("--------");

  /* get helpRemovedWord */
  asyncStorage.getItem('helpRemovedWord', function(value) {
    if(value!==null) {
      helpRemovedWord = value;
    }
    console.log(helpRemovedWord);
  });

  /* display coins */
  displayCoins();

  /*
      TAP ON GRID-LETTER AND ACTIVATE IT
  */
  $(document).off('click', '.visible').on('click', '.visible',function(e) {
    /* zjistíme, o jaké slovo se jedná */
    console.log(".visible.click()");

    if( $(this).is("[vertical]") ) {
      wordOrientation[0] = "vertical";
      wordOrientation[1] = $(this).attr( "vertical" );
    } else if( $(this).is("[horizontal]") ) {
      wordOrientation[0] = "horizontal";
      wordOrientation[1] = $(this).attr( "horizontal" );
    } else {
      wordOrientation = null;
    }
    console.log("wordOrientation pole::  "  + wordOrientation);

    level.activateWord(wordOrientation);

    /* if help 2 was used hide letters */
    console.log(helpRemovedWord);
    console.log(helpRemovedWord.indexOf(wordOrientation[1]));
    console.log(wordOrientation[1]);
    if(helpRemovedWord.indexOf(wordOrientation[1]) > -1) {
      $( ".letter.random").addClass("helped-letter");
    }

  }); /* document.onclick .visible */


/* ----------------------------------- */

  /*
      TAP ON A LETTER IN BOTTOM OFFER
  */
  $(document).off('click', '.letter').on('click', '.letter',function(e) {
    var selectedLetter = $(this).text();
    var selectedLetterId = $(this).attr("id");  //attr("id");
    console.log("selectedLetter:  "  + selectedLetter);
    console.log("selectedLetterId:  "  + selectedLetterId);

    level.clickOnBottomOffer(wordOrientation, selectedLetter, selectedLetterId);

    // level.word0.logni();
  }); /* document.onclick .letter */

/* ----------------------------------- */

  /*
    HELP 1 - SHOW RANDOM LETTER
  */
  $(document).off('click', '#help1-btn').on('click', '#help1-btn',function(e) {
    console.log("help1 clicked");

    /* price for 1 word is 20 coins */
    var COST = 20;

    /* subtract coins and save it */
    asyncStorage.getItem('coins', function(coins) {
      console.log(coins-COST);

      if( (coins-COST)>=0 ) {
        var helpRevealedLetter;
        if(helpRevealedLetter = helpShowLetter() ){
          var helpShownLetters = [];

          /* add to helpShownLetters */
          asyncStorage.getItem('helpShownLetters', function(value) {
            if(value!==null) {
              helpShownLetters = value;
              helpShownLetters.push(helpRevealedLetter);
            } else {
              helpShownLetters.push(gameLang);
              helpShownLetters.push(helpRevealedLetter);
            }
            console.log(helpShownLetters);

            /* save to asyncStorage */
            asyncStorage.setItem('helpShownLetters', helpShownLetters, function() {
              console.log('helpShownLetters stored');

              coins = coins - COST;
              $('.coins').text(coins);
              asyncStorage.setItem('coins', coins, function() {
                console.log('coins stored  -20');

                /* zobrazí zprávu o odečtení coins */
                $( "#pop-help" ).popup( "close" );
                $('.helpRemovedWord-msg').fadeIn('fast').delay(1000).fadeOut('fast');
              });
            });
          });

        }  // if helpRevealedLetter = helpShownLetters()
      } else {
        /* show message */
        $('.lack-coins-msg').fadeIn('fast').delay(1500).fadeOut('fast');
      }
    });

  }); /* document.onclick #help1-btn */

/* ----------------------------------- */

  /*
    HELP 2 - REMOVE UNNECESSARY RANDOM LETTERS FROM BOTTOM OFFER
  */
  $(document).off('click', '#help2-btn').on('click', '#help2-btn',function(e) {
    console.log("help2 clicked");

    /* price for 1 word is 20 coins */
    var COST = 20;
    helpRemovedWord = [];

    /* subtract coins and save it */
    asyncStorage.getItem('coins', function(coins) {
      console.log(coins-COST);

      if( (coins-COST)>=0 ) {

        /* add to helpRemovedWord */
        asyncStorage.getItem('helpRemovedWord', function(value) {
          if(value!==null) {
            helpRemovedWord = value;
            helpRemovedWord.push(wordOrientation[1]);
          } else {
            helpRemovedWord.push(wordOrientation[1]);
          }
          console.log(helpRemovedWord);

          /* save to asyncStorage */
          asyncStorage.setItem('helpRemovedWord', helpRemovedWord, function() {
            console.log('helpRemovedWord stored');

            $( ".letter.random").addClass("helped-letter");
            coins = coins - COST;
            $('.coins').text(coins);

            asyncStorage.setItem('coins', coins, function() {
              console.log('coins stored  -20');

              /* zobrazí zprávu o odečtení coins */
              $( "#pop-help" ).popup( "close" );
              $('.helpRemovedWord-msg').fadeIn('fast').delay(1000).fadeOut('fast');
            });

          });
        });
      } else {
        /* show message */
        $('.lack-coins-msg').fadeIn('fast').delay(1500).fadeOut('fast');
      }
    });

  }); /* document.onclick #help2-btn */

}); /* document.pageshow #play */


/* ----------------------------------- */


$(document).on( "pagebeforeshow", "#settings", function () {

  console.log("#settings pagebeforeshow  ==========");

  var savedGames = null;

  /* display coins */
  displayCoins();

  /* display player-name */
  asyncStorage.getItem('player-name', function(value) {
    console.log('player-name:', value);
    if(value !== null) {
      $("#input-player-name").val(value);
    }
  });

  /* display avatar */
  asyncStorage.getItem('player-photo', function(value) {
    if(value !== null) {
      value = window.URL.createObjectURL(value);
      console.log('player-photo:');
      console.log(value);
      if(value !== null) {
        $('.player-photo').attr('src', value);
      }
      window.URL.revokeObjectURL(value); /* release object */
    }
  });

  /* get and display saved-games */
  asyncStorage.getItem('saved-games', function(savedGames) {
    $("#your-games").empty();
    if(savedGames===null) {
      // $("#your-games").append('<a role="button" class="ui-link ui-btn ui-btn-a ui-shadow ui-corner-all" href="#new-game" data-role="button" data-theme="a">Nová hra</a>');
      $("#your-games").append('You don\'t have any open game.');
    } else {
      console.log(savedGames);
      for ( var prop in savedGames ) {
        if(parseInt(savedGames[prop].lvl) == 0 || savedGames[prop].lvl === undefined ) {
          $("#your-games").append('<div class="grid-row"><div class="grid-col"><span class="settings-game-lang">' + savedGames[prop].desc + '</span> - level <span class="settings-game-lvl">' + parseInt(savedGames[prop].lvl + 1) + '</span></div><div class="grid-col"><button type="button" name="reset-button" id="reset-button" class="reset-button ui-btn ui-shadow ui-corner-all" data-game-lang="' + prop + '" disabled>Reset</button></div></div>');
          // $("#reset-button").prop("disabled", true);
        } else {
          $("#your-games").append('<div class="grid-row"><div class="grid-col"><span class="settings-game-lang">' + savedGames[prop].desc + '</span> - level <span class="settings-game-lvl">' + parseInt(savedGames[prop].lvl + 1) + '</span></div><div class="grid-col"><button type="button" name="reset-button" id="reset-button" class="reset-button ui-btn ui-shadow ui-corner-all" data-game-lang="' + prop + '">Reset</button></div></div>');
        }
      }
    }
  });

  $(document).off('click', '#reset-button').on('click', '#reset-button',function(e) {

    if (confirm("Do you really want to reset this game?") == true) {
      console.log("#reset-button.click()");
      console.log(savedGames);

      var resetGame = $(this).attr("data-game-lang");
      console.log(resetGame);

      asyncStorage.getItem('saved-games', function(savedGames) {
        if(savedGames !== null) {
          /* reset number of levels */
          savedGames[resetGame].lvl = 0;
          console.log(savedGames);

          asyncStorage.setItem('saved-games', savedGames, function() {
            $(".settings-game-lvl").text("1");
            $("#reset-button").prop("disabled", true);
            console.log('saved-games reseted');
          });
        }
      });
      // level.doneWordsInLevel[resetGame] = {};
      // level.doneWordsInLevel[resetGame].doneWords = [];

      /* reset doneWordsInLevel */
  		asyncStorage.getItem('doneWordsInLevel', function(doneWordsInLevel) {
        if(doneWordsInLevel!==null) {
          doneWordsInLevel[resetGame].doneWords = [];
          console.log(doneWordsInLevel);

          /* save to asyncStorage */
          asyncStorage.setItem('doneWordsInLevel', doneWordsInLevel, function() {
            console.log('doneWordsInLevel reseted');
          });
        }
      });

      /* get helpShownLetters */
      asyncStorage.getItem('helpShownLetters', function(value) {
        if(value!==null) {
          helpShownLetters = value;
          if(helpShownLetters[0] == resetGame) {
            /* reset helpShownLetters */
            asyncStorage.removeItem('helpShownLetters', function(value) {
              console.log("helpShownLetters removed");
            });
          }
        }
      });
    } /* if confirm */
  }); /* document.onclick #reset-button */


  $(document).off('click', '#tick-btn').on('click', '#tick-btn',function(e) {

    console.log("#tick-btn.click()");

    var playerName = $("#input-player-name").val();
    console.log(playerName);
    if(playerName !== "") {
      asyncStorage.setItem('player-name', playerName, function() {
        console.log('player-name stored');
        /* zobrazí zprávu že bylo uloženo */
        $('.name-saved-msg').fadeIn('fast').delay(1000).fadeOut('fast');
      });
    }
  }); /* document.onclick #tick-btn */



}); /* document.pagebeforeshow #settings */

/* ----------------------------------- */

$(document).on( "pagebeforeshow", "#new-game", function () {

  console.log("#new-game pagebeforeshow  ==========");

  asyncStorage.getItem('saved-games', function(savedGames) {
    if(savedGames !== null) {
      /* hide li buttons of saved games */
      for ( var prop in savedGames ) {
          $('#new-game [data-game-lang="' + prop + '"]').hide();
      }
    }
  });
}); /* document.pagebeforeshow #new-game */

/* ----------------------------------- */

$(document).on( "pageshow", "#complete-game", function () {

  console.log("#complete-game pageshow  ==========");

  /* display coins */
  displayCoins();

  asyncStorage.getItem('saved-games', function(savedGames) {
    if(savedGames!==null) {
      /* reset number of levels */
      savedGames[gameLang].lvl = 0;
      console.log(savedGames);

      asyncStorage.setItem('saved-games', savedGames, function() {
        console.log('saved-games reseted');
      });
    }
  });

}); /* document.pageshow #complete-game */
