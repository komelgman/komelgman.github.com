/**
 * Плагин jQuery для создания плавающего виджета с кнопками.
 * Рассчитан на использование на страницах с фиксированной шириной.
 * Виджет будет появляться слева или справа от основного содержимого страницы. 
 * 
 * Использование:
 * 1) подключите библиотеку jQuery и плагин (с помощью тегов <script>)
 * 2) создайте на странице тег <div> с кодом кнопки и присвойте ему уникальный id
 * Например,
 * <div id="twitter_widget"><script type="text/javascript" src="http://tweetmeme.com/i/scripts/button.js"></script></div>
 * Здесь кнопка создаётся сервисом Tweetmeme (http://tweetmeme.com/about/retweet_button),
 * вы можете использовать любой другой сервис или обычную картинку.
 * 3) подключите плагин
 * $('#twitter_widget').floating_panel();
 * 4) можно задавать следующие параметры
 * fromCenter - расстояние от середины страницы до левого края виджета
 * fromTop - расстояние от виджета до верхней границы видимой части страницы
 * minTop - расстояние от виджета до начала страницы
 * location - размещение виджета (left или right)
 * 
 * Используются параметры следующим образом
 * $('#twitter_widget').floating_panel({
 *          'fromCenter': 520,
 *          'fromTop': 50,
 *          'minTop': 200,
 *          'location': 'left'
 *      });
 *  
 *  Стаценко Владимир
 *  http://www.simplecoding.org/
 */
(function($) {
    $.fn.floating_panel = function(settings) {
        //значения по-умолчанию
        var config = {
            'fromCenter': 580,
            'fromTop': 50,
            'minTop': 200,
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
        
        function updateElement() {
            //расстояние от начала страницы до верха её видимой части
            var windowTop = curWindow.scrollTop();
            if (windowTop + config.fromTop < config.minTop) {
                //виджет нужно позиционировать абсолютно
                if ('absolute' != element.css('position')) {
                    element.css('position', 'absolute');
                    element.css({'top':config.minTop});
                }
            } else {
                //позиционируем виджет фиксированно
                //ie6 не поддерживает фиксированное позиционирование
                if ($.browser.msie && $.browser.version.substr(0,1)<7) {
                        element.css({'top': windowTop + config.fromTop + "px"});
                }
                else {
                    if ('fixed' != element.css('position')) {
                        element.css('position', 'fixed');
                        element.css({'top':config.fromTop});
                    }
                }
            }
        }
    };
})(jQuery);