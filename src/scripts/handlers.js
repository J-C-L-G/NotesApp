/**
 * Created by JCLG on 8/28/2015.
 */

//Utility function to attach handlers on new/old browsers
function addEventHandler(type, fn, elem){
    if (document.addEventListener) {
        elem.addEventListener(type, fn, false);
    }
    else if (document.attachEvent) {
        elem.attachEvent("on" + type, data.dispatcher);
    }
}
/*
 addEventHandler("click", clickHandler, body);
 addEventHandler("drag", drag, body);
 addEventHandler("dragend", dragEnd, body);
 addEventHandler("dragover", dragOver, body);
 addEventHandler("drop", drop, body);
 */


/***************************  Click Handler   *********************************/

function clickHandler(ev) {
    //To make the Note window appear when the user clicks on the create note button
    if (ev.target.id == 'createNote') {
        showNoteForm();
    }
    //To Hide the window but keep the note's data currently being written
    else if (ev.target.id == 'newNoteWindow') {
        hideNoteForm();
    }
    //To clear the note form if the user want to reset the note
    else if (ev.target.id == 'deleteNote') {
        clearNoteForm();
    }
    //To create a note from the information provided by the user
    else if (ev.target.id == 'addNote') {
        if(validateForm()){
            var note = noteManager.createNote();
            noteManager.addNoteToBoard(note);
            clearNoteForm();
            hideNoteForm();
        }
    }
    //To Recreate the UI in base of a search
    else if (ev.target.id == 'searchNote') {
        var searchInfo = dataManager.getElementById('searchInfo').value;
        localStorageManager.hideByFilter(searchInfo);
    }

}


/***************************  Drag & Drop    *********************************/
function dragStart(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    dataManager.elementBeingDragged = dataManager.getElementById(ev.target.id);
    dataManager.elementBeingDragged.style.opacity = '0';
    console.log(dataManager.elementBeingDragged);
    if(dataManager.elementBeingDragged) {
        validateBoundaries(ev.pageX, ev.pageY, dataManager.elementBeingDragged);
    }
    console.log("dragstart");
}

function dragOver(ev) {
    ev.preventDefault();
    if(dataManager.elementBeingDragged) {
        validateBoundaries(ev.pageX, ev.pageY, dataManager.elementBeingDragged);
    }
    console.log("dragover");
}

function dragEnd(ev) {
    if(dataManager.elementBeingDragged) {
        dataManager.elementBeingDragged.style.opacity = '1';
        validateBoundaries(ev.pageX, ev.pageY, dataManager.elementBeingDragged);
        if(validateElement(dataManager.elementBeingDragged,'stickyNote')) {
            noteManager.addNoteToStorage(dataManager.elementBeingDragged);
        }
    }
    console.log("dragover");
}

function drop(ev) {
    ev.preventDefault();
    dataManager.elementBeingDragged.style.opacity = '1';
    var dropContainer = dataManager.getElementById(ev.target.id);
    var boardWindow = dataManager.getElementById("boardWindow");
    if( (validateElement(dropContainer, "recycleBin")) && (validateElement(dataManager.elementBeingDragged,'stickyNote')) ){
        boardWindow.removeChild(dataManager.elementBeingDragged);
        noteManager.deleteNoteFromStorage(dataManager.elementBeingDragged);
        dataManager.elementBeingDragged.onblur = null;
        dataManager.elementBeingDragged = null;
    }
    console.log("drop");
}
/*************************** End Drag & Drop    *********************************/

    //keyUp event to save the element if is a note
    function keyUp(ev){
        var element = dataManager.getElementById(ev.target.id);
        if(validateElement(element,'stickyNote')){
            var modification = dataManager.getElementById("mod"+element.id);
            if(modification){
                modification.innerText = "Modified : " + getDateFormat();
            }
            noteManager.addNoteToStorage(element);
        }
        //console.log('keyup');
    }

//dblClick event to save the element if is a note
function dblClick(ev){
    var element = dataManager.getElementById(ev.target.id);
    if(validateElement(element,'stickyNote')){
        element.setAttribute('contenteditable', "true");
        var currentClass = element.getAttribute('class') + " editMode";
        element.setAttribute('class', currentClass);
    }
    //console.log('dblClick');
}

function blur(ev){
    var element = dataManager.getElementById(ev.target.id);
    if(validateElement(element,'stickyNote')){
        element.setAttribute('contenteditable', "false");
        element.setAttribute('class', removeClass(element,"editMode"));
        noteManager.addNoteToStorage(element);
    }
    //console.log('blur');
}

