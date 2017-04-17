//
// globals
//
var $calcBox = $('#calcBox');
var calcBox = document.getElementById("calcBox");


//
// regular expressions
//

// here, "transcendental functions" are: exponentials, logarithms, and trigonometric 
// functions (the nomenclature is borrowed from the "Stewart's Calculus" series of textbooks)
// presently, the trigonometric functions produce results in radians 

//this one will not match (), and it will not match the transcendental functions
var parenRegex = /\(((?:\-?\d+(?:\.\d+)?|\-?\u03c0|\-?e)[\u2212+*/]{1})+(?:\-?\d+(?:\.\d+)?|\-?\u03c0|\-?e)\)/;

//transcendental functions use: lowercase letters, numbers, ^, _, and &#8730;

//potential transcendental function regex
var transcendentalRegex = /([a-z0-9^_\u23b7]+)\((?:\-?\d+(?:\.\d+|\-?\u03c0|\-?e)?[\u2212+*/]{1})*(?:\-?\d+(?:\.\d+)?|\-?\u03c0|\-?e)\)/;

//regexes for finding each operator separately (the script will evaluate the expression
//two operands at a time)
var multiplyRegex = /(\-?\d+(?:\.\d+)?|\-?\u03c0|\-?e)[*]{1}(\-?\d+(?:\.\d+)?|\-?\u03c0|\-?e)/;
var divideRegex = /(\-?\d+(?:\.\d+)?|\-?\u03c0|\-?e)[/]{1}(\-?\d+(?:\.\d+)?|\-?\u03c0|\-?e)/;
var addRegex = /(\-?\d+(?:\.\d+)?|\-?\u03c0|\-?e)[+]{1}(\-?\d+(?:\.\d+)?|\-?\u03c0|\-?e)/;
var subtractRegex = /(\-?\d+(?:\.\d+)?|\-?\u03c0|\-?e)[\u2212]{1}(\-?\d+(?:\.\d+)?|\-?\u03c0|\-?e)/;

//
// functions
//
function inputValue(thisValue) {
    $calcBox.val($calcBox.val() + thisValue);
}

function clearBox() {
    $calcBox.val("");
}

function piSymbolToNumber(piSymbol) {
    piNumber = piSymbol.replace(/\u03c0/,Math.PI);
    return piNumber;
}

function eSymbolToNumber(eSymbol) {
    eNumber = eSymbol.replace(/e/,Math.E);
    return eNumber;
}

// this is the "factory" method; all of the arithmetic is performed here
function equals() {
    

    var inLoop = true;
    var returnResult;
    // need a variable that contains the entire content of calcBox to determine
    // context
    var contents = calcBox.value;

    // loop for parentheses
    while (inLoop) {
        // determine if there are any parentheses in the supplied expression
        var result = parenRegex.exec(contents);
        if (result === null) {
            inLoop = false;
        }
        else {
            // search for *, /, +, - in parentheses, separately
            var multiplyResult = multiplyRegex.exec(result[0]);
            var divideResult = divideRegex.exec(result[0]);
            var addResult = addRegex.exec(result[0]);
            var subtractResult = subtractRegex.exec(result[0]);
            
            // arithmetic is done here
            if (multiplyResult !== null) {
                // need to substitute \u03c0 with Math.PI as the Number object will
                // not do this
                if (multiplyResult[1] === "\u03c0" || multiplyResult[1] === "-\u03c0") {
                    multiplyResult[1] = piSymbolToNumber(multiplyResult[1]);
                }
                if (multiplyResult[2] === "\u03c0" || multiplyResult[2] === "-\u03c0") {
                    multiplyResult[2] = piSymbolToNumber(multiplyResult[2]);
                }
                // need to substitute "e" with Math.E as the Number object will
                // not do this
                if (multiplyResult[1] === "e" || multiplyResult[1] === "-e") {
                    multiplyResult[1] = eSymbolToNumber(multiplyResult[1]);
                }
                if (multiplyResult[2] === "e" || multiplyResult[2] === "-e") {
                    multiplyResult[2] = eSymbolToNumber(multiplyResult[2]);
                }
                returnResult = Number(multiplyResult[1]) * Number(multiplyResult[2]);
                // replace original arguments with evaluated result
                contents = replaceExpression(contents, multiplyResult[0], returnResult);
                
            }
            else if (divideResult !== null) {
                // need to substitute \u03c0 with Math.PI as the Number object will
                // not do this
                if (divideResult[1] === "\u03c0" || divideResult[1] === "-\u03c0") {
                    divideResult[1] = piSymbolToNumber(divideResult[1]);
                }
                if (divideResult[2] === "\u03c0" || divideResult[2] === "-\u03c0") {
                    divideResult[2] = piSymbolToNumber(divideResult[2]);
                }
                // need to substitute "e" with Math.E as the Number object will
                // not do this
                if (divideResult[1] === "e" || divideResult[1] === "-e") {
                    divideResult[1] = eSymbolToNumber(divideResult[1]);
                }
                if (divideResult[2] === "e" || divideResult[2] === "-e") {
                    divideResult[2] = eSymbolToNumber(divideResult[2]);
                }
                returnResult = Number(divideResult[1]) / Number(divideResult[2]);
                // replace original arguments with evaluated result
                contents = replaceExpression(contents, divideResult[0], returnResult);
            }
            else if (addResult !== null) {
                // need to substitute \u03c0 with Math.PI as the Number object will
                // not do this
                if (addResult[1] === "\u03c0" || addResult[1] === "-\u03c0") {
                    addResult[1] = piSymbolToNumber(addResult[1]);
                }
                if (addResult[2] === "\u03c0" || addResult[2] === "-\u03c0") {
                    addResult[2] = piSymbolToNumber(addResult[2]);
                }
                // need to substitute "e" with Math.E as the Number object will
                // not do this
                if (addResult[1] === "e" || addResult[1] === "-e") {
                    addResult[1] = eSymbolToNumber(addResult[1]);
                }
                if (addResult[2] === "e" || addResult[2] === "-e") {
                    addResult[2] = eSymbolToNumber(addResult[2]);
                }
                returnResult = Number(addResult[1]) + Number(addResult[2]);
                // replace original arguments with evaluated result
                contents = replaceExpression(contents, addResult[0], returnResult);
            }
            else if (subtractResult !== null) {
                // need to substitute \u03c0 with Math.PI as the Number object will
                // not do this
                if (subtractResult[1] === "\u03c0" || subtractResult[1] === "-\u03c0") {
                    subtractResult[1] = piSymbolToNumber(subtractResult[1]);
                }
                if (subtractResult[2] === "\u03c0" || subtractResult[2] === "-\u03c0") {
                    subtractResult[2] = piSymbolToNumber(subtractResult[2]);
                }
                // need to substitute "e" with Math.E as the Number object will
                // not do this
                if (subtractResult[1] === "e" || subtractResult[1] === "-e") {
                    subtractResult[1] = eSymbolToNumber(subtractResult[1]);
                }
                if (subtractResult[2] === "e" || subtractResult[2] === "-e") {
                    subtractResult[2] = eSymbolToNumber(subtractResult[2]);
                }
                returnResult = Number(subtractResult[1]) - Number(subtractResult[2]);
                // replace original arguments with evaluated result
                contents = replaceExpression(contents, subtractResult[0], returnResult);
            }

            
        }
        
        
    } 
    // when I get to the +/- key, I should think about using \u2212 for subtraction
    // (binary minus) and \u002d for negation (unary minus) 

   //loop for transcendentals
    
    inLoop = true;
    while (inLoop) {
        // determine if there are any transcendental functions in the supplied expression
        var result = transcendentalRegex.exec(contents);
        if (result === null) {
            inLoop = false;
        }
        else {
            // search for the argument passed to the particular transcendental function
            var transcendentalExtractRegex = /\((\-?\d+(?:\.\d+)?|\-?\u03c0|\-?e)\)/;
            var transcendentalArgument = transcendentalExtractRegex.exec(result[0]);
            // for x^n and nth-root-of-x, search for the base or root suppplied in the
            // expression
            var baseOrRoot;
            var baseRegex = /(\-?\d+(?:\.\d+)?|\-?\u03c0|\-?e)[\u23b7^]/;
            var baseTest = baseRegex.exec(result[1]);
            if (baseTest !== null) {
                baseOrRoot = baseTest[1];
            }
            // remove the argument from the transcendental function so it will work in 
            // the switch statement that follows
            var transcendentalFunctionCallString = result[0].replace(transcendentalExtractRegex, "\(\)");
            var transcendentalResult;

            // need to substitute \u03c0 with Math.PI as the Number object will
            // not do this
            if (transcendentalArgument[1] === "\u03c0" || transcendentalArgument[1] === "-\u03c0") {
                transcendentalArgument[1] = piSymbolToNumber(transcendentalArgument[1]);
            }
            //substituting "e" with Math.E
            if (transcendentalArgument[1] === "e" || transcendentalArgument[1] === "-e") {
                transcendentalArgument[1] = eSymbolToNumber(transcendentalArgument[1]);
            }

            // need to substitute \u03c0 with Math.PI as the Number object will
            // not do this
            if (baseOrRoot === "\u03c0" || baseOrRoot === "-\u03c0") {
                baseOrRoot = piSymbolToNumber(baseOrRoot);
            }
            //substituting "e" with Math.E
            if (baseOrRoot === "e" || baseOrRoot === "-e") {
                baseOrRoot = eSymbolToNumber(baseOrRoot);
            }

            // arithmetic performed here
            switch(transcendentalFunctionCallString) {
                case 'sin()':
                    transcendentalResult = Math.sin(Number(transcendentalArgument[1]));
                    break;
                case 'cos()':
                    transcendentalResult = Math.cos(Number(transcendentalArgument[1]));
                    break;
                case 'tan()':
                    transcendentalResult = Math.tan(Number(transcendentalArgument[1]));
                    break;
                case 'arcsin()':
                    transcendentalResult = Math.asin(Number(transcendentalArgument[1]));
                    break;
                case 'arccos()':
                    transcendentalResult = Math.acos(Number(transcendentalArgument[1]));
                    break;
                case 'arctan()':
                    transcendentalResult = Math.atan(Number(transcendentalArgument[1]));
                    break;
                case 'e^()':
                    transcendentalResult = Math.exp(Number(transcendentalArgument[1]));
                    break;
                case 'ln()':
                    transcendentalResult = Math.log(Number(transcendentalArgument[1]));
                    break;
                case 'log_10()':
                    transcendentalResult = Math.log10(Number(transcendentalArgument[1]));
                    break;
                case 'log_2()':
                    transcendentalResult = Math.log2(Number(transcendentalArgument[1]));
                    break;
                case baseOrRoot + '^()':
                    transcendentalResult = Math.pow(Number(baseOrRoot), Number(transcendentalArgument[1]));
                    break;
                case baseOrRoot + '\u23b7()':
                    if (baseOrRoot === undefined) {
                        baseOrRoot = 2;
                    }
                    transcendentalResult = Math.pow(transcendentalArgument[1], 1/Number(baseOrRoot));
                    break;
                case '\u23b7()':
                    if (baseOrRoot === undefined) {
                        baseOrRoot = 2;
                    }
                    transcendentalResult = Math.pow(transcendentalArgument[1], 1/Number(baseOrRoot));
                    break;
            }
            // replace original arguments with evaluated result 
            contents = replaceExpression(contents, result[0], transcendentalResult); 
        }
    }
    

    // loop for *, /
    inLoop = true;
    while (inLoop) {
        // search for any * or / in the supplied expression
        var operationResult;
        var divideResult = divideRegex.exec(contents);
        var multiplyResult = multiplyRegex.exec(contents);
        if (divideResult === null && multiplyResult === null) {
            inLoop = false;
        }
        else {
            // this script evaluates multiplication first (although multiplication 
            // and division are of equal priority in both JS and the algebraic order
            // of operations)
            if (multiplyResult !== null) {
                // need to substitute \u03c0 with Math.PI as the Number object will
                // not do this
                if (multiplyResult[1] === "\u03c0" || multiplyResult[1] === "-\u03c0") {
                    multiplyResult[1] = piSymbolToNumber(multiplyResult[1]);
                }
                if (multiplyResult[2] === "\u03c0" || multiplyResult[2] === "-\u03c0") {
                    multiplyResult[2] = piSymbolToNumber(multiplyResult[2]);
                }
                // need to substitute "e" with Math.E as the Number object will
                // not do this
                if (multiplyResult[1] === "e" || multiplyResult[1] === "-e") {
                    multiplyResult[1] = eSymbolToNumber(multiplyResult[1]);
                }
                if (multiplyResult[2] === "e" || multiplyResult[2] === "-e") {
                    multiplyResult[2] = eSymbolToNumber(multiplyResult[2]);
                }
                operationResult = Number(multiplyResult[1]) * Number(multiplyResult[2]);
                // replace original arguments with evaluated result
                contents = replaceExpression(contents, multiplyResult[0], operationResult);
            }
            else if (divideResult !== null) {
                // need to substitute \u03c0 with Math.PI as the Number object will
                // not do this
                if (divideResult[1] === "\u03c0" || divideResult[1] === "-\u03c0") {
                    divideResult[1] = piSymbolToNumber(divideResult[1]);
                }
                if (divideResult[2] === "\u03c0" || divideResult[2] === "-\u03c0") {
                    divideResult[2] = piSymbolToNumber(divideResult[2]);
                }
                // need to substitute "e" with Math.E as the Number object will
                // not do this
                if (divideResult[1] === "e" || divideResult[1] === "-e") {
                    divideResult[1] = eSymbolToNumber(divideResult[1]);
                }
                if (divideResult[2] === "e" || divideResult[2] === "-e") {
                    divideResult[2] = eSymbolToNumber(divideResult[2]);
                }
                operationResult = Number(divideResult[1]) / Number(divideResult[2]);
                // replace original arguments with evaluated result
                contents = replaceExpression(contents, divideResult[0], operationResult);
            }
            
        }
    }    

    // loop for +, -
    inLoop = true;
    while (inLoop) {
        // search the supplied expression for any + or -
        var operationResult;
        var addResult = addRegex.exec(contents);
        var subtractResult = subtractRegex.exec(contents);
        if (addResult === null && subtractResult === null) {
            inLoop = false;
        }
        else {
            // this script evaluates addition first (although addition and  
            // subtraction are of equal priority in both JS and the algebraic order
            // of operations)
            if (addResult !== null) {
                // need to substitute \u03c0 with Math.PI as the Number object will
                // not do this
                if (addResult[1] === "\u03c0" || addResult[1] === "-\u03c0") {
                    addResult[1] = piSymbolToNumber(addResult[1]);
                }
                if (addResult[2] === "\u03c0" || addResult[2] === "-\u03c0") {
                    addResult[2] = piSymbolToNumber(addResult[2]);
                }
                // need to substitute "e" with Math.E as the Number object will
                // not do this
                if (addResult[1] === "e" || addResult[1] === "-e") {
                    addResult[1] = eSymbolToNumber(addResult[1]);
                }
                if (addResult[2] === "e" || addResult[2] === "-e") {
                    addResult[2] = eSymbolToNumber(addResult[2]);
                }
                operationResult = Number(addResult[1]) + Number(addResult[2]);
                // replace original arguments with evaluated result
                contents = replaceExpression(contents, addResult[0], operationResult);
            }
            else if (subtractResult !== null) {
                // need to substitute \u03c0 with Math.PI as the Number object will
                // not do this
                if (subtractResult[1] === "\u03c0" || subtractResult[1] === "-\u03c0") {
                    subtractResult[1] = piSymbolToNumber(subtractResult[1]);
                }
                if (subtractResult[2] === "\u03c0" || subtractResult[2] === "-\u03c0") {
                    subtractResult[2] = piSymbolToNumber(subtractResult[2]);
                }
                // need to substitute "e" with Math.E as the Number object will
                // not do this
                if (subtractResult[1] === "e" || subtractResult[1] === "-e") {
                    subtractResult[1] = eSymbolToNumber(subtractResult[1]);
                }
                if (subtractResult[2] === "e" || subtractResult[2] === "-e") {
                    subtractResult[2] = eSymbolToNumber(subtractResult[2]);
                }
                operationResult = Number(subtractResult[1]) - Number(subtractResult[2]);
                // replace original arguments with evaluated result
                contents = replaceExpression(contents, subtractResult[0], operationResult);
            }
            
        }
    }    
    // change the user input box to show the evaluated expression
    calcBox.value = contents;
}

// a much simpler search-and-replace function
function replaceExpression(userInput, target, replacement) {
    
    replacement = replacement.toString();
    
    var parenRemoveRegex = new RegExp("\\("+replacement+"\\)");
    var equalsParenRemoveRegex = new RegExp("(?:[^a-z0-9_^\u23b7]+|^)\\("+replacement+"\\)");
    
     userInput = userInput.replace(target, replacement);
     if (equalsParenRemoveRegex.test(userInput)) {
        userInput = userInput.replace(parenRemoveRegex, replacement);
     }
     

     return userInput;
}

//
// event listeners
//
$(function() {
    $('#7').on('click', function() {
        inputValue(7);
    });
});

$(function() {
    $('#8').on('click', function() {
        inputValue(8);
    });
});

$(function() {
    $('#9').on('click', function() {
        inputValue(9);
    });
});

$(function() {
    $('#divide').on('click', function() {
        inputValue("/");
    });
});

$(function() {
    $('#sin').on('click', function() {
        inputValue("sin(");
    });
});

$(function() {
    $('#cos').on('click', function() {
        inputValue("cos(");
    });
});

$(function() {
    $('#tan').on('click', function() {
        inputValue("tan(");
    });
});

$(function() {
    $('#e_n').on('click', function() {
        inputValue("e^(");
    });
});

$(function() {
    $('#4').on('click', function() {
        inputValue(4);
    });
});

$(function() {
    $('#5').on('click', function() {
        inputValue(5);
    });
});

$(function() {
    $('#6').on('click', function() {
        inputValue(6);
    });
});

$(function() {
    $('#multiply').on('click', function() {
        inputValue("*");
    });
});

$(function() {
    $('#arcsin').on('click', function() {
        inputValue("arcsin(");
    });
});

$(function() {
    $('#arccos').on('click', function() {
        inputValue("arccos(");
    });
});

$(function() {
    $('#arctan').on('click', function() {
        inputValue("arctan(");
    });
});

$(function() {
    $('#ln_n').on('click', function() {
        inputValue("ln(");
    });
});

$(function() {
    $('#1').on('click', function() {
        inputValue(1);
    });
});

$(function() {
    $('#2').on('click', function() {
        inputValue(2);
    });
});

$(function() {
    $('#3').on('click', function() {
        inputValue(3);
    });
});

$(function() {
    $('#subtract').on('click', function() {
        inputValue("\u2212");
    });
});

$(function() {
    $('#log_10_x').on('click', function() {
        inputValue("log_10(");
    });
});

$(function() {
    $('#log_2_x').on('click', function() {
        inputValue("log_2(");
    });
});

$(function() {
    $('#x_n').on('click', function() {
        inputValue("^(");
    });
});

$(function() {
    $('#nth_root_of_x').on('click', function() {
        inputValue("\u23b7(");
    });
});

$(function() {
    $('#clear').on('click', function() {
        clearBox();
    });
});

$(function() {
    $('#0').on('click', function() {
        inputValue(0);
    });
});

$(function() {
    $('#equals').on('click', function() {
        equals();
    });
});

$(function() {
    $('#add').on('click', function() {
        inputValue("+");
    });
});

$(function() {
    $('#leftParenthesis').on('click', function() {
        inputValue("(");
    });
});

$(function() {
    $('#rightParenthesis').on('click', function() {
        inputValue(")");
    });
});

$(function() {
    $('#pi').on('click', function() {
        inputValue("\u03c0");
    });
});

$(function() {
    $('#decimalPoint').on('click', function() {
        inputValue(".");
    });
});

$(function() {
    $('#changeSign').on('click', function() {
        inputValue("\u002d");
    });
});

$(function() {
    $('#e').on('click', function() {
        inputValue("e");
    });
});



