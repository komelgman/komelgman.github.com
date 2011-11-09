
(function($) {
    $.fn.floating_panel = function(settings) {
        //значения по-умолчанию
        var config = {
            'hTop': 400,
            'dTop': 0,
            'hBot': 600,

            'fromCenter': 500,

            'location': 'left'
        };

        //если пользователь указал свои параметры, то используем их
        if (settings) $.extend(config, settings);

        var element = $(this);
        
        var curWindow = $(window);
        //рассчитываем смещение от левого края окна браузера
        if ('left' == config.location) {
            var elementLeft = curWindow.width() / 2 - config.fromCenter;
        }
        else {
            var elementLeft = curWindow.width() / 2 + config.fromCenter;
        }
        element.css({'left':elementLeft});
        updateElement();
        
        //изменяем положения виджета при прокрутке страницы 
        curWindow.scroll(function() {
            updateElement();
        });

        var curState = '';
        
        function updateElement() {
            //расстояние от начала страницы до верха её видимой части
            var wTop = curWindow.scrollTop(),
                wHeight = curWindow.height,
                bHeight = $(document).height(),
                eHeight = element.height();

            if (wTop + config.dTop + eHeight > bHeight - config.hBot) {
                //виджет нужно позиционировать абсолютно
                if (curState != 'onBot') {
                    element.css('position', 'absolute');
                    element.css({'top' : bHeight - config.hBot - eHeight});
                    curState = 'onBot';
                }
            } else if (wTop + config.dTop < config.hTop) {
                //виджет нужно позиционировать абсолютно
                if (curState != 'onTop') {
                    element.css('position', 'absolute');
                    element.css({'top':config.hTop});
                    curState = 'onTop';
                }
            } else {
                curState = 'onMid';
                //позиционируем виджет фиксированно
                //ie6 не поддерживает фиксированное позиционирование
                if ($.browser.msie && $.browser.version.substr(0,1)<7) {
                        element.css({'top': wTop + config.hTop + "px"});
                }
                else {
                    if ('fixed' != element.css('position')) {
                        element.css('position', 'fixed');
                        element.css({'top':config.dTop});
                    }
                }
            }
        }
    };
})(jQuery);