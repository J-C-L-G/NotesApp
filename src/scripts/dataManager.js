/**
 * Created by JCLG on 8/28/2015.
 */

//Central Storage for cache the elements and control the application data.
var dataManager = {
    elementBeingDragged : null,
    maxWidth : null,
    maxHeight : null,
    getElementById : function(id){
        if(!this.cache) {
            this.cache = {};
        }
            if(this.cache[id]){
                return this.cache[id];
            }else{
                return this.cache[id] = document.getElementById(id);
            }
    }
};

//Initialize Calculate the board boundary to stick the notes
function calculateBoard(){
    var boardWindow = dataManager.getElementById('boardWindow');
    var maxWidth = window.getComputedStyle(boardWindow)['width'];
    var maxHeight = window.getComputedStyle(boardWindow)['height'];
    dataManager.maxWidth = parseFloat(maxWidth.substr(0, maxWidth.length - 2));
    dataManager.maxHeight = parseFloat(maxHeight.substr(0, maxHeight.length - 2));
}

//function increaseBoard for every 10 notes
function increaseBoard(multBy){
    console.log(multBy);
    var body = document.getElementsByTagName('body')[0];
    var maxHeight = window.getComputedStyle(body)['height'];
    dataManager.maxHeight = parseFloat(maxHeight.substr(0, maxHeight.length - 2)) * multBy;
    body.style.height = dataManager.maxHeight + "px";
    calculateBoard();
}

function validatePagesAndIncreaseSize(numOfNotes){
    if(numOfNotes % 10 == 0){
        increaseBoard( (numOfNotes/10)+1);
    }
}


//Note Manager to work with the notes across the application
var noteManager = {
    numOfNotes : 0,
    generateNoteId : function(){return new Date().getTime()},
    createNote : function(){
        var noteId = this.generateNoteId();
        var newTitleNoteWindow = dataManager.getElementById('newTitleNoteWindow');
        var newMessageNoteWindow = dataManager.getElementById('newMessageNoteWindow');

        var labelTitle = document.createElement('h1');
        labelTitle.textContent = newTitleNoteWindow.value;
        var labelMessage = document.createElement('p');
        labelMessage.textContent = newMessageNoteWindow.value;

        var extraInfo = document.createElement('p');
        var newDate = getDateFormat();
        extraInfo.innerHTML = "<span id='created"+noteId+"'>Created: "+newDate+"</span><span id='mod"+noteId +"'>Modified : " + newDate + "</span>";
        extraInfo.setAttribute('class', 'extraInfo');
        extraInfo.setAttribute('id', "info"+noteId);
        extraInfo.setAttribute('contenteditable', "false");

        var note = document.createElement('note');
        note.setAttribute('class', 'stickyNote');
        note.setAttribute('id', noteId);
        note.setAttribute('draggable', "true");
        note.setAttribute('contenteditable', "true");
        note.appendChild(extraInfo);
        note.appendChild(labelTitle);
        note.appendChild(labelMessage);
        note.onblur = blur;

        //Increase the size of the board
        noteManager.numOfNotes++;
        validatePagesAndIncreaseSize(noteManager.numOfNotes);

        //manage the note inside the storage
        noteManager.addNoteToStorage(note);
        localStorageManager.writeData();
        return note;
    },
    addNoteToBoard : function(note){
        var boardWindow = dataManager.getElementById("boardWindow");
        boardWindow.appendChild(note);
    },
    addNoteToStorage : function(note){
        if(!this.notes){
            this.notes = {};
        }
        if(note.id){
            this.notes[note.id] = note.outerHTML;
            localStorageManager.writeData();
        }
    },
    deleteNoteFromStorage : function(note){
        delete this.notes[note.id];
        localStorageManager.writeData();
    },
    findNoteById : function(id){
        return this.notes[id];
    },
    getAllNotes : function(){
        return this.notes;
    }
};

//Note Manager to work with the notes across the application
var localStorageManager = {
    writeData : function(){
        localStorage.setItem('notes', JSON.stringify(noteManager.getAllNotes()));
    },
    readData : function(){
        return JSON.parse(localStorage.getItem('notes'));
    },
    createNotes : function(notes){
        var boardWindow = dataManager.getElementById('boardWindow');
        noteManager.notes = notes;
        for(var prop in notes){
            var parent = document.createElement('note');
            parent.innerHTML = notes[prop];
            var boardWindow = dataManager.getElementById('boardWindow');
            boardWindow.appendChild(parent);
            var note = parent.firstChild;
            note.onblur = blur;
            note.style.visibility = "visible";
            boardWindow.removeChild(parent);
            noteManager.addNoteToBoard(note);
            //Increase the size of the board
            noteManager.numOfNotes++;
            validatePagesAndIncreaseSize(noteManager.numOfNotes);
        }
    },
    buildUI : function(){
            var notes = this.readData();
            localStorageManager.createNotes(notes);
    },
    hideByFilter : function(filterContent){
        var allNotes = document.getElementsByTagName('note');
        for(var note = 0 ; note < allNotes.length ; note++){
                allNotes[note].style.visibility = "hidden";
                if(allNotes[note].innerHTML.lastIndexOf(filterContent) > -1){
                    allNotes[note].style.visibility = "visible";
                }
        }
    }
};