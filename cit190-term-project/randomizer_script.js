// gobals
var unshuffled = [];
var shuffled = [];
var inputBox = document.getElementById("inputBox");
var numberOfGroups;
var numberPerGroup;

// 'Add name' event listener
$(function() {
    $('#submitButton').on('click', function() {
        $('#textArea').append($('#inputBox').val(), "\n");
        unshuffled.push(inputBox.value);
        $('#inputBox').val("");
     });
});

// event listener for "Number of groups" select element
document.getElementById("numberOfGroups").addEventListener('change', function() {
    if (this.value === 'notSelected') {
        numberOfGroups = undefined;
    }
    else {
        numberOfGroups = this.value;
    }
}, false);

// event listener for "Number per group" select element
document.getElementById("numberPerGroup").addEventListener('change', function() {
    if (this.value === 'notSelected') {
        numberPerGroup = undefined;
    }
    else {
        numberPerGroup = this.value;
    }
}, false);


$(function() {
    $('#randomizeButton').on('click', shuffle);
});


function shuffle() {
    // add the contents of the text area to the "to be shuffled" array
    var textAreaQuery = document.getElementById("textArea").value;
    textAreaQuery = textAreaQuery.split(/\u000a/);
    var spliceLocation = textAreaQuery.length - 1;
    textAreaQuery.splice(spliceLocation, 1);
    unshuffled = textAreaQuery;
    
    // Fisher-Yates shuffle
    if (numberOfGroups === undefined || numberPerGroup === undefined) {
        return;
    }
    var counter = unshuffled.length;
    while (counter > 0) {
        var randomNumber = Math.floor(Math.random() * counter);
        shuffled.push(unshuffled[randomNumber]);
        unshuffled.splice(randomNumber, 1);
        counter--;
    }
    
    // output the names to the "output" div
    output();

    // reset the shuffled array in case the user wants to re-shuffle the current input
    shuffled = [];
}

function output() {
    // this keeps track of the progress through the shuffled array
    var c = 0;
    document.getElementById("output").textContent = "";
    // The function creates a new div for each group and adds the names to the 
    // separate divs. I decided to dynamically generate the divs for each group separately 
    // since it makes handling remainders easier than inserting them into a common div
    // (which would have likely involved having to craft a clever regex. Instead, I 
    // can do the job with nested for loops.). 

    // create the div and the group header
    for (i=0; i<numberOfGroups; i++) {
        var position = document.getElementById("output");
        var newDiv = document.createElement('div');
        var groupIdNo = i+1;
        newDiv.setAttribute('id','group'+ groupIdNo);
        var groupHeaderNode = document.createTextNode("Group " + groupIdNo);
        newDiv.append(groupHeaderNode);
        $(newDiv).append("<br><br>");
        // populate the div with names        
        for (j = 0; j < numberPerGroup; j++) {
            var groupTextNode = document.createTextNode("");
            groupTextNode.nodeValue += shuffled[c];
            newDiv.append(groupTextNode);
            $(newDiv).append("<br>");
            c++;
        }
        position.appendChild(newDiv);
        $('#output').append("<br>");
    }
    // handling remainders
    var remaining = shuffled.length - c;
    if (shuffled.length % (numberOfGroups*numberPerGroup) !== 0) {
        // if the user checked "evenly distribute remainders"
        if ($('#evenlyDistributeButton').is(':checked')) {
            var j=1;
            for (i=0; i<remaining; i++) {
                var modifiedGroup = document.getElementById("group"+j);
                var additionalName = document.createTextNode("");
                additionalName.nodeValue = shuffled[c];
                modifiedGroup.append(additionalName);
                j++;
                c++;
            }
        }
        // if the user checked "add the remainders to their own group"
        else {
            newDiv = document.createElement('div');
            groupIdNo = Number(numberOfGroups) + 1;
            groupHeaderNode = document.createTextNode("Group " + groupIdNo);
            newDiv.append(groupHeaderNode);
            $(newDiv).append('<br><br>');
            for (i=0; i<remaining; i++) {
                var additionalName = document.createTextNode("");
                additionalName.nodeValue = shuffled[c];
                newDiv.append(additionalName);
                $(newDiv).append('<br>');
                c++;
            }
            position.appendChild(newDiv);
        }
    }
}


