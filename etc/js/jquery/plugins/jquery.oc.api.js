/**
 * Date: 05.05.11
 * Time: 12:05
 */


(function($){

    $.event.special.elementresize = {
        setup: function() {
            var self = this, $this = $(this), height = $this.height(), width = $this.width();

            $this.everyTime(100, 'elementresize-timer', function() {

                if (($this.height() != height) || ($this.width() != width)) {
                    height = $this.height();
                    width = $this.width();

                    jQuery.event.handle.call(self, {type:'elementresize'});
                }
            });
        },
        teardown: function() {
            $(this).stopTime('elementresize-timer');
        }
    };

})(jQuery);


(function($) {

    // my namespace
    $.oc = $.oc || {};

    // module api here
    $.extend($.oc, {
        api : {
            version: '0.1.0.0',

            defaults : {
                fatalErrorHandler : function(data) {$.ocError('Server Error!!!');},
                errorHandler : function(data) {$.ocError(data.response);}
            },
            post : function(url, params, options) {
                options = $.extend({}, $.oc.api.defaults, options || {});

                var request = $.post(url, params, function(data) {
                    if (false == data.error) {
                        if (options.successHandler)
                            options.successHandler(data);
                    } else {
                        if (options.errorHandler)
                            options.errorHandler(data);
                    }
                }, 'json');

                if (options.fatalErrorHandler)
                    request.fail(options.fatalErrorHandler);

                return request;
            },
            extract: function(form, elements) {
                var container = $(form);
                var results = {};

                for (var i in elements) {
                    var x = container.find(elements[i]);

                    $(x).each(function() {
                        var name = $(this).attr('name').split(/[\[\]]/);

                        if (name.length == 1) {
                            results[name[0]] = $(this).val();
                        } else {
                            var nv = {};
                            nv[name[1]] = $(this).val();
                            results[name[0]] = $.extend(results[name[0]], nv);
                        }
                    });
                }

                return results;
            },
            array_get: function(arr, key, def) {
                return arr.hasOwnProperty(key) ? arr[key] : def;
            },
            array_first : function(arr){
                for (var i in arr) {
                    if (arr.hasOwnProperty(i)) {
                        return {key: i, value: arr[i]};
                    }
                }
            },
            bool: function(x) {
                return !(x === false || x == 'false' || x == '' || x == 0 || x == '0' || x == null || x == undefined);
            },
            ellipse: function(str, n) {
                var res = str;
                if (str.length > n) {
                    res = str.substring(0, n - 3) + '...';
                }

                return res;
            }
        }
    });


    $.fn.outerHTML = function(s) {
        return (s)
            ? this.before(s).remove()
            : $("<p>").append(this.eq(0).clone()).html();
    };

    $.ocEllipse = $.oc.api.ellipse;

    $.ocAlert = function (text) {
        if ($['pnotify']) {
            $.pnotify({
                pnotify_title : 'Notice',
                pnotify_text : text,
                pnotify_history: false
            });
        } else {
            alert(text);
        }
    };

    $.ocError = function (text) {
        if ($['pnotify']) {
            $.pnotify({
                pnotify_title : 'Error',
                pnotify_text : text,
                pnotify_type : 'error',
                pnotify_history: false
            });
        } else {
            alert(text);
        }
    }


})(jQuery);