(function($, window, undefined){
    $.widget( "epilgrim.sessionTimeoutHandler", {
        options: {
            // default options
            title :                  'Session Timeout',
            message :                'Your session is about to expire.',
            keepAliveUrl :           'keepAlive.php',
            retrieveTimeLeftUrl :    'retrieveTimeLeft.php',
            redirUrl :               false,
            logoutUrl :              'logout.php',
            defaultSessionTime:       false,
            warnWhenLeft :            300000,
            checkTimeBeforeRedirect:  true,
            errorGettingSessionTimeLeft:  'There was an error retrieving session information from the server. Session could be timed out',
            modalId:                 'sessionTimeout-dialog',

            // callbacks
            logOutNow: function(event, data){
                window.location = data.plugin.options.logoutUrl;
            },
            redirectNow: function(event, data){
                window.location = data.plugin.options.redirUrl;
            },
            stayConnected: function(event, data){
                data.plugin.modal.dialog('close');
                data.plugin._trigger(
                    'getSessionTimeLeft',
                    null,
                    {
                        plugin: data.plugin,
                        updateSession: true,
                        callback: $.proxy(
                            function(time){
                                this.initializeTimers(time);
                            }, data.plugin)
                    }
                );
            },
            getSessionTimeLeft: function ( event, data ){
                var action = data.updateSession ? data.plugin.options.keepAliveUrl : data.plugin.options.retrieveTimeLeftUrl;
                var self = data.plugin;
                $.ajax({
                    context: self,
                    dataType: "json",
                    url: action,
                    success: function (time){
                        var timeLeft = time * 1000;
                        data.callback.call(self, timeLeft);
                        if(timeLeft > this.options.warnWhenLeft)//greater than 500ms close the popup
                        {
                            this.modal.dialog('close');
                        }
                    },
                    error: function(){
                        alert(self.options.errorGettingSessionTimeLeft);
                    }
                });
            }
        },
        // the constructor
        _create: function() {
            // Create timeout warning dialog
            this.dialogTimer = null;

            // timer for redirecting
            this.redirectTimer = null;

            if (this.options.redirUrl == false){
                this.options.redirUrl = this.options.logoutUrl;
            }

            this._createModal();

            this.initializeTimers(this.options.defaultSessionTime);
        },
        _createModal: function(){
            var self = this;
            this.modal = jQuery('<div/>', {
                id: this.options.modalId,
                title: this.options.title,
                text: this.options.message
            });
            this.modal.appendTo(this.element);

            this.modal.dialog({
                autoOpen: false,
                width: 400,
                modal: true,
                closeOnEscape: false,
                open: function(event, ui) { $(".ui-dialog-titlebar-close", this.modal).hide(); },
                buttons: {
                    // Button one - takes user to logout URL
                    "Log Out Now": function() {
                        self._trigger('logOutNow', null, { plugin: self });
                    },
                    // Button two - closes dialog and makes call to keep-alive URL
                    "Stay Connected": function() {
                        self._trigger('stayConnected', null, { plugin: self });
                    }
                }
            });
        },
        _destroy: function() {
            // remove generated elements
            this.modal.remove();

        },
        _dialogTimer: function(action, time ){
            switch(action) {
                case 'start':
                    this.dialogTimer = setTimeout($.proxy(this._dialogHandler, this), time);
                    break;
                case 'stop':
                    clearTimeout(this.dialogTimer);
                    break;
                case 'restart':
                    this._dialogTimer('stop');
                    this._dialogTimer('start', time);
                    break;
            }
        },
        _redirectTimer: function(action, time ){
            switch(action) {
                case 'start':
                    this.redirectTimer = setTimeout($.proxy(this._redirectHandler, this), time);
                    break;
                case 'stop':
                    clearTimeout(this.redirectTimer);
                    break;
                case 'restart':
                    this._redirectTimer('stop');
                    this._redirectTimer('start', time);
                    break;
            }
        },
        _dialogHandler: function(){
            this.modal.dialog('open');
        },
        _redirectHandler: function(){
            if (this.options.checkTimeBeforeRedirect){
                this._trigger('getSessionTimeLeft', null, {plugin: this, updateSession: false, callback: function(time){
                    if (time <= 0){
                        this._trigger('redirectNow', null, {plugin: this});
                    } else {
                        this.initializeTimers(time);
                    }
                }});
            } else {
                this._trigger('redirectNow', null, {plugin: this});
            }
        },
        _setTimers: function (time){
            var action;

            action = this.dialogTimer === null ? 'start' : 'restart';
            this._dialogTimer( action, (time - this.options.warnWhenLeft));

            action = this.redirTimer === null ? 'start' : 'restart';
            this._redirectTimer ( action, time);
        },
        initializeTimers: function (time){
            if ( time === false){
                // if no time variable was passed, get it from the server
                 this._trigger('getSessionTimeLeft', null, {plugin: this, updateSession: false, callback: this._setTimers});
            } else {
                // when time variable passed, set it
                this._setTimers(time);
            }
        }
    });
})(jQuery, window);
