/**
 * Created by JCLG on 8/28/2015.
 */

//Create the fomat for the note date
function getDateFormat(){
    var regex = /([\S\s]+\d\d:\d\d)/;
    var date = ""+new Date();
    return date.match(regex)[0];
}

//Methods to work with the note form
function clearNoteForm(){
    var newTitleNoteWindow = dataManager.getElementById('newTitleNoteWindow');
    var newMessageNoteWindow = dataManager.getElementById('newMessageNoteWindow');
    var errorMessage = dataManager.getElementById('errorMessage');
    newTitleNoteWindow.value = "";
    newMessageNoteWindow.value = "";
    errorMessage.style.visibility = "hidden";
}

function hideNoteForm(){
    var newNoteWindow = dataManager.getElementById('newNoteWindow');
    newNoteWindow.style.display = "none";
}

function validateForm(){
    var newTitleNoteWindow = dataManager.getElementById('newTitleNoteWindow').value;
    var newMessageNoteWindow = dataManager.getElementById('newMessageNoteWindow').value;
    var regex = /^\s+/;
    if( (newTitleNoteWindow && newMessageNoteWindow ) && (!(regex.test(newTitleNoteWindow))) && (!regex.test(newMessageNoteWindow)) ){
        return true;
    }
    else{
        var errorMessage = dataManager.getElementById('errorMessage');
        errorMessage.style.visibility = "visible";
        return false
    }
}

function showNoteForm(){
    var newNoteWindow = dataManager.getElementById('newNoteWindow');
    newNoteWindow.style.display = "block";
}

//Function to identify if an element has a specific class
function validateElement(element, type){
    if((element) && (element.getAttribute('class'))){
        if((element.getAttribute('class').lastIndexOf(type))> -1 ){
            return true;
        } else{
            return false;
        }
    }else{
        return false;
    }
}

//Function to remove a specific class from en element
function removeClass(element, classToRemove){
    if(validateElement(element, classToRemove)){
        var currentClass = element.getAttribute('class');
        var resultingClass = currentClass.replace(new RegExp("\\s"+classToRemove),"");
        return resultingClass;
    }else{
        return element.getAttribute('class');
    }
}


//Function to validate the coordinates X,Y against the board
function validateBoundaries(x,y, element){
    //Size of the board
    var maxWidth = dataManager.maxWidth;
    var maxHeight = dataManager.maxHeight;

    //Identifies if is a note
    if(validateElement(element, "stickyNote")){
        var elementWidth = 200;
        var elementCalculatedY = 100;
        var rangeOnSides = 20;
    }
    //Identifies if is the recycle
    else if (validateElement(element, "recycleBin")){
        var elementWidth = 100;
        var elementCalculatedY = 100;
        var rangeOnSides = 10;
    }
    //If is one of those 2 options and X-Y are different than 0
    if((elementWidth)&&(x != 0 && y != 0)){
        if(((x-elementWidth) > 0) && ((x+elementWidth) < maxWidth)){
            element.style.left = (x-(elementWidth/2)) + "px";
        }else if((x-elementWidth) < 0){
            element.style.left = rangeOnSides + "px";
        }else if((x+elementWidth) > maxWidth){
            element.style.left = (maxWidth-(elementWidth+rangeOnSides)) + "px";
        }

        if(((y) > elementCalculatedY) && ((y+elementCalculatedY) < maxHeight)){
            element.style.top = y-elementCalculatedY + "px";
        }else if(y < elementCalculatedY){
            element.style.top = rangeOnSides + "px";
        }else if((y+(elementCalculatedY*2)) > maxHeight){
            element.style.top = (maxHeight-(elementWidth+rangeOnSides)) + "px";
        }
    }
}

