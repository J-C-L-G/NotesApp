var Managers = require('./Managers'),
    Handlers = require('./Handlers');

        Handlers.addEventHandler("dragstart", Handlers.dragStart, document.body);
        Handlers.addEventHandler("dragover", Handlers.dragOver, document.body);
        Handlers.addEventHandler("dragend", Handlers.dragEnd, document.body);
        Handlers.addEventHandler("drop", Handlers.drop, document.body);
        Handlers.addEventHandler("click", Handlers.clickHandler, document.body);
        Handlers.addEventHandler("keyup", Handlers.keyUp, document.body);
        Handlers.addEventHandler("dblclick", Handlers.dblClick, document.body);
        Managers.calculateBoard();
        Managers.localStorageManager.buildUI();