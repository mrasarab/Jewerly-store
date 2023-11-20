
const checkBlackLetter = (string) => {
    const whiteList = "[^A-Za-z0-9-!@#$_. ]";
    var blackLetters = "";
    for (var i = 0; i < string.length; i++) {
      const result = string[i].match(whiteList);
      if (result) blackLetters += result[0];
    }
  
    function removeDuplicateCharacters(blackLetters) {
      return blackLetters
        .split("")
        .filter(function (item, pos, self) {
          return self.indexOf(item) == pos;
        })
        .join("");
    }
    
    return removeDuplicateCharacters(blackLetters);
  };

  module.exports = checkBlackLetter;