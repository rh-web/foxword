/*
*
* @author: Radek Hiess
* @link: http://rh-web.cz
*
*/
/**
 * The class Level represents one level of a game
 *
 * @class Level
 * @constructor
 * @param {int} currentLevel - number of level which is loaded
 */
var Level = function (currentLevel) {
	this.currentLevel = currentLevel;
  this.doneWordsInLevel = {};
	this.word0 = new Word();
	this.word1 = new Word();
	this.word2 = new Word();
};

/**
 * array with info about word
 * @type {array}
 */
Level.prototype.wordArr = null;

/**
 * array of right completed words in level
 * @type {array}
 */
Level.prototype.doneWordsInLevel = null;
