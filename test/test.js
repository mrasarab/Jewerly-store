var validator = require("validator");

// use for name, username, lastname ...check if the string contains only letters (a-zA-Z).
const result1 = validator.isAlpha("pooya");

// check if the string contains only letters and numbers (a-zA-Z0-9).
const result2 = validator.isAlphanumeric("pooya");

// contains(str, seed [, options]) check if the string contains the seed.

// isCreditCard(str [, options]) check if the string is a credit card number.

const result4 = validator.isCreditCard("3711 1111 1111 114");
// isEmail   isEmpty        isJSON         isJWT            isMobilePhone   isNumeric

const result5 = validator.isLength("pooya", { min: 4, max: 10 });
// isLength(str [, options])       options:{ min: 0, max: undefined }

// isStrongPassword(str [, options]) check if the string can be considered a strong password or not. Allows for custom requirements or scoring rules. If returnScore is true, then the function returns an integer score for the password rather than a boolean.
// Default options:
// { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 }

const checkForBlackLetters = require("../security/checkStrings");

if (checkForBlackLetters("poo>ya")) console.log("You cannot use these letters in username : " +  checkForBlackLetters("poo>ya"));