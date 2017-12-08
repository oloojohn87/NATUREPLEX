$.fn.H2MRange2 = function(dictionary) 
{
    var o = $(this[0]);
    o.data('data', []);
    o.data('min', 0);
    o.data('max', 10);
    o.data('width', 600);
    
    if(!$("#H2MRange2CSS").length)
    {
        $("head").append('<style id="H2MRange2CSS">.cell{ height: 13px; border-radius: 13px; background-color: #98DAFF; cursor: pointer; float: left; opacity: 0.0; } .range_cell{ height: 13px; border-radius: 13px; background-color: #22AEFF; cursor: pointer; float: left; }</style>');
    }
    
    function compare(a,b) 
    {
        if (a.start < b.start)
            return -1;
        if (a.start > b.start)
            return 1;
        return 0;
    }
    if(dictionary.hasOwnProperty('min'))
        o.data('min', dictionary['min']);
    if(dictionary.hasOwnProperty('max'))
        o.data('max', dictionary['max']);
    if(dictionary.hasOwnProperty('width'))
        o.data('width', dictionary['width']);
    if(dictionary.hasOwnProperty('data'))
    {
        var d = dictionary['data'];
        d.sort(compare);
        o.data('data', d);
    }
 
    
    var width = o.data('width') / (o.data('max') - o.data('min') + 1);
    
    o.append('<div></div>');
    o.append('<div style="width: 20px; height: 15px; padding-top: 3px; margin-top: 2px; background-color: #777; border-radius: 7px; color: #FFF; display: none; text-align: center; font-family: verdana, sans-serif; font-size: 9px;"><div style="background-color: #777; width: 6px; height: 6px; margin: auto; margin-top: -6px; margin-bottom: -3px; transform: rotate(45deg);"></div><span class="current_cell_value">3</span></div>');
    o.append('<div style="width: 100px; height: 45px; padding-top: 3px; margin-top: 2px; background-color: #777; border-radius: 7px; color: #FFF; display: none; text-align: center; font-family: verdana, sans-serif; font-size: 9px;"><div style="background-color: #777; width: 6px; height: 6px; margin: auto; margin-top: -6px; transform: rotate(45deg);"></div><div class="range_value" style="width: 80%; height: 20px; margin: auto; background-color: #EEE; border-radius: 5px; color: #555; font-size: 10px; margin-top: 4px; padding-top: 0px;">6 - 12</div><input type="text" class="current_range_cell_value" style="margin-top: 7px; width: 80%; outline: none; border: 0px solid #FFF; margin: auto; background-color: #777; color: #FFF; height: 13px; font-size: 13px; drop-shadow: 0px 0px 0px #333; " /></div>');
    
    var main = o.children().eq(0);
    var tooltip = o.children().eq(1);
    var title_tooltip = o.children().eq(2);
    
    main.css('width', o.data('width')+'px');
    main.css('height', '13px');
    main.css('border-radius', '13px');
    main.css('border', '1px solid #888');
    main.css('background-color', '#FFF');
    var data_count = 0;
    for(var i = o.data('min'); i <= o.data('max'); i++)
    {
        if(data_count < o.data('data').length)
        {
            if(o.data('data')[data_count].start == i)
            {
                main.append('<div class="range_cell" data-start="'+o.data('data')[data_count].start+'" data-length="'+((o.data('data')[data_count].end - o.data('data')[data_count].start) + 1)+'" data-position="'+data_count+'" style="width: '+(((o.data('data')[data_count].end - o.data('data')[data_count].start) + 1) * width)+'px;"></div>');
                i = o.data('data')[data_count].end;
                data_count++;
            }
            
            else
            {
                main.append('<div class="cell" data-index="'+i+'" style="width: '+width+'px"></div>');
            }
            
        }
        else
        {
            main.append('<div class="cell" data-index="'+i+'" style="width: '+width+'px"></div>');
        }
    }
    
    var isDragging = 0;
    var dragging_start = 0;
    var dragging_finish = 1;
    var dragging_prev = -1;
    var selected_range = 0;
    o.find('.range_cell').live('click', function()
    {
        var w = o.data('width') / (o.data('max') - o.data('min') + 1);
        for(var i = $(this).data('length') + $(this).data('start') - 1; i >= $(this).data('start'); i--)
        {
            $(this).after('<div class="cell" data-index="'+i+'" style="width: '+w+'px"></div>');
        }
        var pos = parseInt($(this).data('position'));
        console.log('POS: ' + pos);
        $(this).remove();
        o.find('.range_cell').each(function()
        {
            if(parseInt($(this).data('position')) > pos)
                $(this).data('position', parseInt($(this).data('position')) - 1);
        });
        o.data('data').splice(pos, 1);
        title_tooltip.css('display', 'none');
    });
    o.find('.range_cell').live('mouseenter', function()
    {
        title_tooltip.find('.current_range_cell_value').eq(0).val(o.data('data')[$(this).data('position')].title);
        selected_range = $(this).data('position');
        var w = o.data('width') / (o.data('max') - o.data('min') + 1);
        if($(this).data('length') > 1)
            title_tooltip.find('.range_value').text($(this).data('start') + ' - ' + (parseInt($(this).data('length')) + parseInt($(this).data('start') - 1)));
        else
            title_tooltip.find('.range_value').text($(this).data('start'));
        title_tooltip.css('display', 'block');
        title_tooltip.css('margin-left', (((parseInt($(this).data('start')) - o.data('min')) * w) + ((w * parseInt($(this).data('length'))) / 2.0) - 50).toString() + 'px');
    });
    title_tooltip.find('.current_range_cell_value').eq(0).on('keyup', function()
    {
        o.data('data')[ selected_range].title = $(this).val();
    });
        
        
    o.find('.cell').live('mousedown', function()
    {
        isDragging = 1;
        dragging_start = $(this).data('index');
        dragging_finish = $(this).data('index');
        dragging_prev = $(this).data('index');
    });
    o.find('.cell').live('mouseup', function()
    {
        var w = o.data('width') / (o.data('max') - o.data('min') + 1);
        isDragging = 0;
        main.find('.cell').each(function()
        {
            $(this).css('opacity', '0.0');
            $(this).css('border-radius', '13px');
        });
        var pos = 0;
        for(var i = 0; i < o.data('data').length; i++)
        {
            if(o.data('data')[i].start < dragging_start)
                pos = i + 1;
            else
                break;
        }
        o.find('.range_cell').each(function()
        {
            if(parseInt($(this).data('position')) >= pos)
                $(this).data('position', parseInt($(this).data('position')) + 1);
        });
        main.find('div[data-index="'+dragging_start+'"]').before('<div class="range_cell" data-start="'+dragging_start+'" data-length="'+((dragging_finish - dragging_start) + 1)+'" data-position="'+pos+'" style="width: '+(((dragging_finish - dragging_start) + 1) * w)+'px;"></div>');
        if(o.data('data').length > 0)
            o.data('data').splice(pos, 0, {start: dragging_start, end: dragging_finish, title: 'test'});
        else
            o.data('data')[0] = {start: dragging_start, end: dragging_finish, title: 'test'};
        for(var i = dragging_start; i <= dragging_finish; i++)
        {
            main.find('div[data-index="'+i+'"]').eq(0).remove();
        }
        tooltip.css('display', 'none');
        
    });
    o.find('.cell').live('mouseenter', function(event)
    {
        var w = o.data('width') / (o.data('max') - o.data('min') + 1);
        if(!isDragging)
        {
            $(this).css('opacity', '1.0');
        }
        else
        {
            if($(this).data('index') > dragging_finish)
                dragging_finish = $(this).data('index');
            else if($(this).data('index') < dragging_start)
                dragging_start = $(this).data('index');
            else if(dragging_prev < $(this).data('index'))
                dragging_start = $(this).data('index');
            else
                dragging_finish = $(this).data('index');
                
            dragging_prev = $(this).data('index');
            display_dragging();
        }
        title_tooltip.css('display', 'none');
        tooltip.find('.current_cell_value').eq(0).text($(this).data('index'));
        tooltip.css('margin-left', (((parseInt($(this).data('index')) - o.data('min')) * w) + (w / 2.0) - 10).toString() + 'px');
        tooltip.css('display', 'block');
    });
    o.find('.cell').live('mouseleave', function(event)
    {
        if(!isDragging)
        {
            $(this).css('opacity', '0.0');
        }
        tooltip.css('display', 'none');
    });
    o.bind('mouseleave', function(event)
    {
        isDragging = 0;
        main.find('.cell').each(function()
        {
            $(this).css('opacity', '0.0');
            $(this).css('border-radius', '13px');
        });
        tooltip.css('display', 'none');
    });
    
    function display_dragging()
    {
        main.find('.cell').each(function()
        {
            $(this).css('opacity', '0.0');
            $(this).css('border-radius', '0px');
        });
        main.find('div[data-index="'+dragging_start+'"]').css('border-top-left-radius', '13px');
        main.find('div[data-index="'+dragging_start+'"]').css('border-bottom-left-radius', '13px');
        main.find('div[data-index="'+dragging_finish+'"]').css('border-top-right-radius', '13px');
        main.find('div[data-index="'+dragging_finish+'"]').css('border-bottom-right-radius', '13px');
        for(var i = dragging_start; i <= dragging_finish; i++)
        {
            main.find('div[data-index="'+i+'"]').eq(0).css('opacity', '1.0');
        }
    }
}

$.fn.H2MRange2SetMin = function(min) 
{
    var o = $(this[0]);
    o.data('min', min);
    
    var main = o.children().eq(0);
    var tooltip = o.children().eq(1);
    var title_tooltip = o.children().eq(2);
    
    var width = o.data('width') / (o.data('max') - o.data('min') + 1);
    
    var data_count = 0;
    main.empty();
    for(var i = o.data('min'); i <= o.data('max'); i++)
    {
        if(data_count < o.data('data').length)
        {
            if(o.data('data')[data_count].start == i)
            {
                main.append('<div class="range_cell" data-start="'+o.data('data')[data_count].start+'" data-length="'+((o.data('data')[data_count].end - o.data('data')[data_count].start) + 1)+'" data-position="'+data_count+'" style="width: '+(((o.data('data')[data_count].end - o.data('data')[data_count].start) + 1) * width)+'px;"></div>');
                i = o.data('data')[data_count].end;
                data_count++;
            }
            
            else
            {
                main.append('<div class="cell" data-index="'+i+'" style="width: '+width+'px"></div>');
            }
            
        }
        else
        {
            main.append('<div class="cell" data-index="'+i+'" style="width: '+width+'px"></div>');
        }
    }
}

$.fn.H2MRange2SetMax = function(max) 
{
    var o = $(this[0]);
    o.data('max', max);
    
    var main = o.children().eq(0);
    var tooltip = o.children().eq(1);
    var title_tooltip = o.children().eq(2);
    
    var width = o.data('width') / (o.data('max') - o.data('min') + 1);
    
    var data_count = 0;
    main.empty();
    for(var i = o.data('min'); i <= o.data('max'); i++)
    {
        if(data_count < o.data('data').length)
        {
            if(o.data('data')[data_count].start == i)
            {
                main.append('<div class="range_cell" data-start="'+o.data('data')[data_count].start+'" data-length="'+((o.data('data')[data_count].end - o.data('data')[data_count].start) + 1)+'" data-position="'+data_count+'" style="width: '+(((o.data('data')[data_count].end - o.data('data')[data_count].start) + 1) * width)+'px;"></div>');
                i = o.data('data')[data_count].end;
                data_count++;
            }
            
            else
            {
                main.append('<div class="cell" data-index="'+i+'" style="width: '+width+'px"></div>');
            }
            
        }
        else
        {
            main.append('<div class="cell" data-index="'+i+'" style="width: '+width+'px"></div>');
        }
    }
}

$.fn.H2MRange2SetData = function(data) 
{
    var o = $(this[0]);
    o.data('data', data);
    
    var main = o.children().eq(0);
    var tooltip = o.children().eq(1);
    var title_tooltip = o.children().eq(2);
    
    var width = o.data('width') / (o.data('max') - o.data('min') + 1);
    
    var data_count = 0;
    main.empty();
    for(var i = o.data('min'); i <= o.data('max'); i++)
    {
        if(data_count < o.data('data').length)
        {
            if(o.data('data')[data_count].start == i)
            {
                main.append('<div class="range_cell" data-start="'+o.data('data')[data_count].start+'" data-length="'+((o.data('data')[data_count].end - o.data('data')[data_count].start) + 1)+'" data-position="'+data_count+'" style="width: '+(((o.data('data')[data_count].end - o.data('data')[data_count].start) + 1) * width)+'px;"></div>');
                i = o.data('data')[data_count].end;
                data_count++;
            }
            
            else
            {
                main.append('<div class="cell" data-index="'+i+'" style="width: '+width+'px"></div>');
            }
            
        }
        else
        {
            main.append('<div class="cell" data-index="'+i+'" style="width: '+width+'px"></div>');
        }
    }
}

$.fn.H2MRange2GetData = function() 
{
    var o = $(this[0]);
    return o.data('data');
}