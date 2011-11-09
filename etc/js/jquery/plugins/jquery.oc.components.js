/**
 * Date: 16.05.11
 * Time: 12:34
 */
(function($) {

    // my namespace
    $.oc = $.oc || {};

    // module components here
    $.extend($.oc, {
        components : {
            defaults : {
                radioGroup : {
                    optionSelector : '.oc-option',
                    groupsSelector : '.oc-radio-group',
                    selectedClass  : 'selected'
                },
                checkBox : {
                    checkBoxSelector : '.oc-checkbox',
                    checkedClass : 'checked'
                },
                ocFilter : {
                    filterSelector: '.oc-filter',
                    appliedFilterClass : 'applied',
                    locale : {
                        dictionaryValue : 'Выбрано {0}',
                        dictionaryOneValue : '{0}',
                        dictionaryNoValue : 'Не имеет значения',
                        numberValue: 'От {0} до {1}',
                        numberNoValue : 'Все значения',
                        textValue: 'Искать: {0}',
                        textNoValue : 'Не имеет значения',
                        flagYes : 'Да',
                        flagNo : 'Нет',
                        flagIgnore : 'Не важно'
                    }
                }
            },
            // create radio buttons group
            ocRadioGroup : function( options ) {
                // in 1.3+ we can fix mistakes with the ready state
                if (this.length == 0) {
                    if (!$.isReady && this.selector) {
                        var s = this.selector, c = this.context;
                        $(function() {
                            $(s,c).ocRadioButton(options);
                        });
                    }
                    return this;
                }

                var settings = $.extend({}, $.oc.components.defaults.radioGroup, options),
                    groups = this.selector ? this : $(settings.groupsSelector);

                $(groups).each(function(index){
                    var group = $(this),
                        options = group.find(settings.optionSelector),
                        id = group.attr('item-id'),
                        name = group.attr('name'); // form element name


                    // check name of radio-group
                    if (name == undefined) {
                        alert('Error: radio-group must have name!');
                    }

                    // hidden input element represent value for standard form actions (serialization, send, etc)
                    group.append($('<input>', {'type':'hidden', 'name':name, 'class':'radio-group-value'}));
                    var input = group.children('.radio-group-value');

                    if (id != undefined) {
                        input.attr('id', id);
                    }

                    // change value function example:
                    //      $(selector).val(someVal).change();
                    // we need manually call change method
                    input.change(function() {
                        options
                            .removeClass(settings.selectedClass)
                            .each(function(){
                                if ($(this).attr('value') == input.val())
                                    $(this).addClass(settings.selectedClass);
                            });
                    });

                    // set the default value
                    input.val(group.attr('default')).change();

                    // clean group element
                    group.removeAttr('name');
                    group.removeAttr('default');

                    // option click handler
                    options.click (function() {
                        input.val($(this).attr('value')).change();
                    });
                });

                return this;
            },
            ocCheckBox : function( options ) {
                // in 1.3+ we can fix mistakes with the ready state
                if (this.length == 0) {
                    if (!$.isReady && this.selector) {
                        var s = this.selector, c = this.context;
                        $(function() {
                            $(s,c).ocCheckBox(options);
                        });
                    }
                    return this;
                }

                var settings = $.extend({}, $.oc.components.defaults.checkBox, options),
                    elements = this.selector ? this : $(settings.checkBoxSelector);

                $(elements).each(function() {
                    var element = $(this),
                        // form element name
                        element_name = element.attr('name'),
                        element_id = element.attr('item-id'),
                        state = function(state) { return !(('false' == state) || (false === state) || (0 == state) || ('0' == state));},
                        // render checkbox state
                        render = function(value){element[state(value) ? 'addClass' : 'removeClass'](settings.checkedClass)};

                    // check name of radio-group
                    if (element_name == undefined) {
                        alert('Error: check-box must have name!');
                    }

                    // hidden input element represent value for standard form actions (serialization, send, etc)
                    element.after($('<input>', {'type':'hidden', 'name':element_name, 'class':'check-box-value'}));
                    var input = element.next('.check-box-value');
                    if (element_id != undefined) {
                        input.attr('id', element_id);
                    }

                    // set the default value
                    input.val(element.attr('default'));
                    render(input.val());

                    // clean element
                    element.removeAttr('name');
                    element.removeAttr('default');
                    element.removeAttr('item-id');

                    // change value function example:
                    //      $(selector).val(someVal).change();
                    // we need manually call change method
                    input.change(function() {
                        render(input.val());
                        // create event
                        element.trigger('value-change', input.val());
                    });

                    element.click(function() {
                        input.val(state(input.val()) ? false : true).change();
                    });
                });

                return this;
            },
            ocFilter : function (options) {
                // in 1.3+ we can fix mistakes with the ready state
                if (this.length == 0) {
                    if (!$.isReady && this.selector) {
                        var s = this.selector, c = this.context;
                        $(function() {
                            $(s,c).ocFilter(options);
                        });
                    }
                    return this;
                }

                var settings = $.extend({}, $.oc.components.defaults.ocFilter, options),
                    elements = this.selector ? this : $(settings.filterSelector);
                
                $(elements).each(function() {
                    var container = $(this);

                    container.append($('<div>', {'class': 'shadowLeftTopRight'})).append($('<div>', {'class': 'shadowLeft'})).append($('<div>', {'class': 'shadowRight'}));

                    var inputValue = $('<input>', {'type':'hidden', 'class':'filter-value'}).appendTo(container),
                        btnOpen = $('<div>', { 'class':'ItemFilterButton'}).appendTo(container),
                        filterCaption = $('<span>', {'class': 'ItemFilterTitle', 'text':'<no caption>'}).appendTo(container),
                        filterValue = $('<span>', {'class': 'ItemFilterCondition', 'text': '<no value>'}).appendTo($('<div>', {'class' : 'ItemFilterConditionContainer'}).appendTo(container)),
                        formWrapper = $('<div>', {'style':'display: none;'}, {'class':'DropSelect'}).appendTo(container);

                    var form = $('<div>', {'class':'ItemFilterContainerDrop'}).appendTo(formWrapper);

                    form.append($('<div>', {'class': 'shadowLeft'})).append($('<div>', {'class': 'shadowRight'}));

                    var buttonsWrapper = $('<div>', {'class':'ItemFilterSelectButton'}).appendTo(formWrapper);

                    buttonsWrapper.append($('<div>', {'class': 'shadowLeft'})).append($('<div>', {'class': 'shadowRight'}));

                    var btnClear = $('<a>', {'href':'javascript:void(0);', 'class':'ClearCondition', 'text':'Очистить'}).appendTo(buttonsWrapper),
                        btnSave = $('<a>', {'href':'javascript:void(0);', 'class':'SaveCondition', 'text':'Сохранить'}).appendTo(buttonsWrapper);

                    buttonsWrapper.append($('<div>', {'class': 'shadowLeftBottomRight'}));

                    var filterParams = container.metadata({type:'attr', name:'data'}),
                        filterPanel = $('<div>', {'class': 'ItemFilterSelect'}),
                        filterGetValueAndUpdateState = function(){ alert('mock'); },
                        filterClear = function(){ alert('mock'); };

                    filterCaption.text(filterParams.caption);
                    inputValue.attr('name', filterParams.name);


                    // build filter
                    switch (filterParams.type) {
                        case '_dictionary':
                                var select = $('<select>', {'width': 220, 'height': 290, 'multiple': 'multiple'}).appendTo(filterPanel.appendTo(form)),
                                    selectOptions = filterParams.options;

                                // add select options
                                for (var idx in selectOptions) {
                                    var option = $('<option>', {'value': idx, 'text': selectOptions[idx]['value'], 'title':selectOptions[idx]['description']}).appendTo(select);

                                    if (('selected' in selectOptions[idx]) && selectOptions[idx]['selected']) {
                                        option.attr('selected', 'selected');
                                    }
                                }

                                // apply ui.multiselect
                                $(select).multiselect({showSelectedActions:false, removeAllEvent: 'multiselect-clear'});

                                filterGetValueAndUpdateState = function() {
                                    var result = '{}';

                                    if (select.val()) {
                                        if (1 == select.val().length) {
                                            var text = select.find('option:selected').text();
                                            filterValue.text($.format(settings.locale.dictionaryOneValue, text));
                                        } else {
                                            filterValue.text($.format(settings.locale.dictionaryValue, select.val().length));
                                        }


                                        inputValue.addClass(settings.appliedFilterClass);

                                        result = JSON.stringify({'selected':select.val()});
                                    } else {
                                        filterValue.text(settings.locale.dictionaryNoValue);
                                        inputValue.removeClass(settings.appliedFilterClass);
                                    }

                                    return result;
                                };

                                filterClear = function () {
                                    container.find('.ui-multiselect').trigger('multiselect-clear');
                                };
                            break;

                        case '_int' :
                        case '_float' :
                                var _parse, _step = 1;

                                if (filterParams.type == '_int') {
                                    _parse = parseInt;
                                    _step = 1;
                                } else if (filterParams.type == '_float') {
                                    _parse = parseFloat;
                                    _step = 0.5;
                                }

                                var min = _parse(filterParams.min),
                                    max = _parse(filterParams.max),
                                    valueMin = filterParams.valueMin || min,
                                    valueMax = filterParams.valueMax || max,

                                    minmaxWrapper = $('<div>', {'class':'ItemFilterSelectLinks'}).appendTo(filterPanel.appendTo(form)),
                                    inputMin = $('<input>', {'type':'text', 'style':'margin-bottom:5px;','value':valueMin}).appendTo(minmaxWrapper),
                                    inputMax = $('<input>', {'type':'text', 'value':valueMax}).appendTo(minmaxWrapper),
                                    rangeWrapper = $('<div>', {'style':'padding:5px 0px 5px 8px;width:200px;font-size:0.5em;'}).appendTo($('<div>', {'class': 'ItemFilterSelect'}).appendTo(form)),
                                    range = $('<div>').appendTo(rangeWrapper);

                                range.slider({
                                    range: true, min: min, max: max, step:_step,
                                    values: [ valueMin, valueMax ],
                                    slide: function( event, ui ) {
                                        inputMin.val(ui.values[ 0 ]);
                                        inputMax.val(ui.values[ 1 ]);
                                    },
                                    change: function (event, ui) {
                                        inputMin.val(ui.values[ 0 ]);
                                        inputMax.val(ui.values[ 1 ]);
                                    }
                                });

                                inputMin.change(function() {
                                    var _min = _parse(inputMin.val()), _max = _parse(inputMax.val());

                                    if (_min < min) {
                                        _min = min;
                                    } else if(_min > _max) {
                                        _min = _max;
                                    }

                                    inputMin.val(_min);
                                    range.slider('values', [_min, _max]);
                                });

                                inputMax.change(function() {
                                    var _min = _parse(inputMin.val()), _max = _parse(inputMax.val());

                                    if (_max > max) {
                                        _max = max;
                                    } else if(_max < _min) {
                                        _max = _min;
                                    }

                                    inputMax.val(_max);
                                    range.slider('values', [_min, _max]);
                                });

                                filterGetValueAndUpdateState = function() {
                                    var result = '{}';

                                    if ((inputMin.val() != min) || (inputMax.val() != max)) {
                                        filterValue.text($.format(settings.locale.numberValue, inputMin.val(), inputMax.val()));
                                        inputValue.addClass(settings.appliedFilterClass);

                                        result = JSON.stringify({'min':inputMin.val(), 'max':inputMax.val()});
                                    } else {
                                        filterValue.text(settings.locale.numberNoValue);
                                        inputValue.removeClass(settings.appliedFilterClass);
                                    }

                                    return result;
                                };

                                filterClear = function () {
                                    range.slider('values', [min, max]);
                                };
                            break;

                        case '_text' :
                                var valueText = filterParams.text || '',
                                    inputText = $('<input>', {'type':'text', 'value':valueText}).appendTo($('<div>', {'class':'ItemFilterSelectLinks'}).appendTo(filterPanel.appendTo(form)));

                                filterGetValueAndUpdateState = function() {
                                    var result = '{}';

                                    if (inputText.val()) {
                                        filterValue.text($.format(settings.locale.textValue, inputText.val()));
                                        inputValue.addClass(settings.appliedFilterClass);

                                        result = JSON.stringify({'text': $.base64Encode(inputText.val())});
                                    } else {
                                        filterValue.text(settings.locale.textNoValue);
                                        inputValue.removeClass(settings.appliedFilterClass);
                                    }

                                    return result;
                                };

                                filterClear = function () {
                                    inputText.val('');
                                };
                            break;

                        case '_bool' :
                                var valueFlag = (filterParams.flag == undefined) ? settings.locale.flagIgnore : ((filterParams.flag) ? settings.locale.flagYes: settings.locale.flagNo),
                                    radioGroup = $('<div>').appendTo($('<div>', {'class':'ItemFilterSelectLinks'}).appendTo(filterPanel.appendTo(form))),
                                    select = '<label class="radioinfo"><input name="__filter_value" class="radio" type="radio" value="{0}"/>{0}</label>';

                                radioGroup.append($.format(select, settings.locale.flagYes));
                                radioGroup.append($.format(select, settings.locale.flagNo));
                                radioGroup.append($.format(select, settings.locale.flagIgnore));
                                
                                radioGroup.find('input:radio[value="' + valueFlag + '"]').attr('checked', 'checked');

                                filterGetValueAndUpdateState = function() {
                                    var result = '{}', radioVal = radioGroup.find('input:radio[name="__filter_value"]:checked').val();

                                    if (radioVal != settings.locale.flagIgnore) {
                                        inputValue.addClass(settings.appliedFilterClass);

                                        result = JSON.stringify({'flag': (radioVal == settings.locale.flagYes)});
                                    } else {
                                        inputValue.removeClass(settings.appliedFilterClass);
                                    }

                                    filterValue.text(radioVal);

                                    return result;
                                };

                                filterClear = function () {
                                    radioGroup.find('input:radio[value="' + settings.locale.flagIgnore + '"]').attr('checked', 'checked');
                                };
                            break;

                        default:
                            alert('unknown filter type: ' + filterParams.type);
                    }

                    function filterUpdate(fireOnChangeEvent) {
                        var curVal = inputValue.val(), newVal = filterGetValueAndUpdateState();

                        if (curVal != newVal) {
                            inputValue.val(newVal);
                            
                            if (fireOnChangeEvent) {
                                inputValue.change();
                            }
                        }
                    }

                    // update filter value
                    filterUpdate(true);

                    container.bind('filter-silent-clear', function() {
                        filterClear();
                        filterUpdate(false);
                    });

                    container.bind('filter-clear', function() {
                        filterClear();
                        filterUpdate(true);
                    });

                    // close current open filter, if open other
                    container.bind('filter-before-open', function() {
                        if (container.hasClass('opened')) {
                            btnSave.trigger('click');
                        }
                    });

                    btnOpen.click(function() {
                        if (!container.hasClass('opened')) {
                            $(elements).trigger('filter-before-open');
                            container.addClass('opened');

                            $(elements).trigger('filter-open');
                            formWrapper.show();

                            form.find('.shadowLeft, .shadowRight').css('height', form.height());

                            $(elements).trigger('filter-after-open');
                        }
                    });

                    btnSave.click(function() {
                        $(elements).trigger('filter-before-close');
                        filterUpdate(true);

                        $(elements).trigger('filter-close');
                        formWrapper.hide();

                        container.removeClass('opened');
                        $(elements).trigger('filter-after-close');
                    });

                    btnClear.click(function(){
                        filterClear();
                        btnSave.trigger('click');
                    });
                });
            }
        }
    });

    // exports
    $.ocRadioGroup = $.fn.ocRadioGroup = $.oc.components.ocRadioGroup;
    $.ocCheckBox = $.fn.ocCheckBox = $.oc.components.ocCheckBox;
    $.ocFilter = $.fn.ocFilter = $.oc.components.ocFilter;
})(jQuery);