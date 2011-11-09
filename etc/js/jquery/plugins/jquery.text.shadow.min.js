// ----------------------------------------------------------------------------
// textShadow, JQuery plugin
// v 1.0
// ----------------------------------------------------------------------------
// Copyright (C) 2010 recens
// http://recens.ru/jquery/plugin_text_shadow.html
// ----------------------------------------------------------------------------
(function($){$.fn.textShadow=function(o){if(!o)return;var b=o.split(' '),x=parseInt(b[0]),y=parseInt(b[1]),blur=0,color='';if(b.length==3){color=b[2]}else{blur=parseInt(b[2]);color=b[3]}return $(this).each(function(){var a=$(this);a.css({position:'relative','z-index':0,zoom:1}).append('<span></span>').find('span').html(a.html()).css({width:a.width(),position:'absolute','z-index':-1,color:color,left:x-blur+'px',top:y-blur+'px','padding-left':a.css('padding-left'),'padding-top':a.css('padding-top')});if(blur)a.find('span').css('filter','progid:DXImageTransform.Microsoft.Blur(pixelradius='+blur+', enabled="true")')})}})(jQuery)