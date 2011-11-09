(function($){
    var notice = {element: null, pnotify: null, message: null};

    $('input.error, textarea.error, select.error').live('focus blur', function() {
        if ($(this).hasClass('error-helper-ignore')) {
            return;
        }

        var message = $(this).next().text(), showMessage = true;

        if (notice.pnotify && (notice.pnotify.css('display') != 'none')) {
            if ( (notice.element != this) || (notice.message != message) ) {
                notice.pnotify.pnotify_remove();
            } else {
                showMessage = false;
            }
        }

        if (showMessage) {
            notice.element = this;
            notice.message = message;

            notice.pnotify = $.pnotify({
                pnotify_title : 'Ошибка валидации',
                pnotify_type : 'error',
                pnotify_history: false,
                pnotify_text : message
            });
        }
    });
})(jQuery);
