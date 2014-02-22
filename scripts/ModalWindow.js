var count = 1,
    openedModals = [],
    backdrop = document.createElement('div'),
    nonexistentMsg = 'Calling method of nonexistent modal. Check the modal constructor';

//prepare backdrop
backdrop.className = 'backdrop';
document.body.appendChild(backdrop);

/**
 * ModalWindow constructor, takes 2 mandatory parameters (title, body) and 1 optional (width)
 * if no width is passed, it is set to default value of 300px
 * @param title string
 * @param body  text/html
 * @param width integer
 * @constructor
 */
function ModalWindow(title, body, width) {
    if (typeof title === 'undefined' || typeof body === 'undefined') {
        alert('Creating Modal failed: One or more mandatory parameters are missing');
        return;
    }
    this.title = String(title);
    this.body = body;
    this.width = width || 300;
    this.buttons = [];

    this._id = count;
    this._titleElement = document.createElement('div');
    this._bodyElement = document.createElement('div');
    this._buttonsWrapperElement = document.createElement('div');
    this._callback = null;

    //assign css classes to elements
    this._titleElement.className = 'modal-title';
    this._bodyElement.className = 'modal-body';
    this._buttonsWrapperElement.className = 'modal-buttons';

    //feed elements
    this._titleElement.innerHTML = '<h3>' + this.title + '</h3>';
    this._bodyElement.innerHTML = this.body;

    count++;
}

ModalWindow.prototype = {
    addButton: function (label, value) {
        if (!this.exists()) {
            console.error(nonexistentMsg);
            return;
        }

        if (typeof label === 'undefined' || typeof value === 'undefined') {
            alert('Adding button failed: One or more mandatory parameters are missing');
        } else {
            this.buttons.push({
                label: label,
                value: value
            });
        }
        return this;    //chaining support
    },
    addCallback: function (fn) {
        if (!this.exists()) {
            console.error(nonexistentMsg);
            return;
        }

        if (typeof fn !== 'function') {
            alert('Adding Callback failed: callback is not of required type');
        } else {
            this._callback = fn;
        }
        return this;
    },
    show: function (left, top) {
        if (!this.exists()) {
            console.error(nonexistentMsg);
            return;
        }

        if (openedModals.indexOf(this._id) !== -1) {
            console.warn('Modal is already opened');
            return;
        }

        //prepare modal wrapper
        this._modalElement = document.createElement('div');
        this._modalElement.className = 'modal';
        this._modalElement.id = 'modal' + this._id;
        this._modalElement.style.width = this.width + 'px';

        if (typeof left !== 'undefined' && typeof top !== 'undefined') {
            this._modalElement.style.left = left;
            this._modalElement.style.top = top;
        } else {
            this._modalElement.className += ' modal-center';
        }

        this.constructModal();
        document.body.appendChild(this._modalElement);
        openedModals.push(this._id);
        checkIfBackdropNecessary();
    },
    hide: function () {
        if (!this.exists()) {
            console.error(nonexistentMsg);
            return;
        }

        var index = openedModals.indexOf(this._id);
        if (index !== -1) {
            openedModals.splice(index, 1);
            this.destroyModal();
            checkIfBackdropNecessary();
        }
    },
    constructModal: function () {
        if (!this.exists()) {
            console.error(nonexistentMsg);
            return;
        }

        this.constructButtons();
        this._modalElement.appendChild(this._titleElement);
        this._modalElement.appendChild(this._bodyElement);
        this._modalElement.appendChild(this._buttonsWrapperElement);
        this.addListeners();
    },
    constructButtons: function () {
        var i = 0, btn, len, buttons = '';

        if (!this.exists()) {
            console.error(nonexistentMsg);
            return;
        }

        if (this.buttons && !this.buttons.length) {
            this.addButton('OK', 1);
        }
        for (len = this.buttons.length; i < len, (btn = this.buttons[i]); i++) {
            buttons += '<a class="btn" id="' + btn.value + '">' + btn.label + '</a>';
        }
        this._buttonsWrapperElement.innerHTML = buttons;
    },
    addListeners: function () {
        if (!this.exists()) {
            console.error(nonexistentMsg);
            return;
        }

        var me = this;
        this.clickFn = function (e) {
            if (e && e.target && e.target.id && (e.target.className === 'btn')) {
                e.preventDefault();
                me.hide();
                me._callback && me._callback(e.target.id);
            }
        };
        this._buttonsWrapperElement.addEventListener('click', this.clickFn);
    },
    destroyModal: function () {
        if (!this.exists()) {
            console.error(nonexistentMsg);
            return;
        }

        document.body.removeChild(this._modalElement);
        this._buttonsWrapperElement.removeEventListener('click', this.clickFn);
    },
    exists: function () {
        return Boolean(this._id);
    }
};

// if there is any opened modal, show backdrop to keep other elements from interaction
// and block body element from scrolling
function checkIfBackdropNecessary() {
    if (openedModals && openedModals.length) {
        addClass.call(backdrop, 'shown');
        addClass.call(document.body, 'blocked');
    } else {
        removeClass.call(backdrop, 'shown');
        removeClass.call(document.body, 'blocked');
    }
}

// helper function for adding css classes to an element
function addClass(newClass) {
    var cssClasses = this.className.split(' ');
    if (cssClasses.indexOf(newClass) === -1) {
        cssClasses.push(newClass);
        this.className = cssClasses.join(' ');
    }
}

// helper function for removing css classes to an element
function removeClass(oldClass) {
    var cssClasses = this.className.split(' ');
    if (cssClasses.indexOf(oldClass) !== -1) {
        cssClasses.splice(cssClasses.indexOf(oldClass), 1);
        this.className = cssClasses.join(' ');
    }
}