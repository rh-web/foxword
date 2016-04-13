/**
*
* @author: Radek Hiess
* @link: http://rh-web.cz
*
*/
/**
 * The class Word represents a word of a level
 *
 * @class Word
 * @constructor
 */
var Word = function () {
  this.name = "";
	this.wordArr = [];
	this.row = 0;
	this.col = 0;
	this.orient = "";
	this.declaredLetters = [[],[],[],[],[],[],[],[],[],[],[],[],[]];
};

/**
 * array with info about word
 * @property wordArr
 * @type {array}
 */
Word.prototype.wordArr = null;

/**
 * array of letters declared for the word
 * @property declaredLetters
 * @type {array}
 */
Word.prototype.declaredLetters = null;
