$.fn.timebar = function(dictionary) 
{
    var o = $(this[0]) // It's your element
    
    // defaults
    o.data("type", 1);
    var d = new Array();
    for(var i = 0; i < 124; i++)
    {
        d.push(0);
    }
    o.data("data", d);
    o.data("clickFunction", null);
    o.data("mouseoverFunction", null);
    o.data("mouseoutFunction", null);
    o.data("hoverColor", "DCDCDC");
    o.data("colors", new Array("D3E3F6", "ABCEF6", "7BB4F6", "3d94f6", "0073F6", "0057BA", "00397A", "00244D", "001023", "000000"));
    o.data("interval", 1);
    
    
    if(typeof dictionary != undefined)
    {
        if(dictionary.hasOwnProperty("type"))
        {
            if(dictionary.type == 'week')
            {
                o.data("type", 2);
            }
            else if(dictionary.type == 'month')
            {
                o.data("type", 3);
            }
            else
            {
                o.data("type", 1);
            }
        }
        if(dictionary.hasOwnProperty("amountInterval"))
        {
            o.data("interval", dictionary.amountInterval);
        }
        if(dictionary.hasOwnProperty("colors"))
        {
            o.data("colors", dictionary.colors);
        }
        if(dictionary.hasOwnProperty("onClick"))
        {
            o.data("clickFunction", dictionary.onClick);
        }
        if(dictionary.hasOwnProperty("onMouseOver"))
        {
            o.data("mouseoverFunction", dictionary.onMouseOver);
        }
        if(dictionary.hasOwnProperty("onMouseOut"))
        {
            o.data("mouseoutFunction", dictionary.onMouseOut);
        }
        if(dictionary.hasOwnProperty("hoverColor"))
        {
            o.data("hoverColor", dictionary.hoverColor);
        }
    }
    
    o.timebar_load();
};

$.fn.timebarAdd = function(info) 
{
    var o = $(this[0]) // It's your element
    var start_info = info.start.split(" ");
    var end_info = info.end.split(" ");
    var start_date_info = '';
    var start_time_info = '';
    var end_date_info = '';
    var end_time_info = '';
    var increment = false;
    if(info.hasOwnProperty("increment"))
    {
        increment = info.increment;
    }
    if(start_info[0].length >= 2)
    {
        start_date_info = start_info[0].split("-");
        start_time_info = start_info[1].split(":");
    }
    else
    {
        start_time_info = start_info.split(":");
    }
    if(end_info[0].length >= 2)
    {
        end_date_info = end_info[0].split("-");
        end_time_info = end_info[1].split(":");
    }
    else
    {
        end_time_info = end_info.split(":");
    }
    
    var start_val = 0;
    var end_val = 0;
    
    if(o.data("type") == 1)
    {
        var start_val = (start_time_info[0] * 4) + Math.floor(start_time_info[1] / 15);
        var end_val = (end_time_info[0] * 4) + Math.floor(end_time_info[1] / 15);
    }
    else if(o.data("type") == 2)
    {
        var start_date = new Date(info.start);
        var start_weekday = start_date.getDay();
        var end_date = new Date(info.end);
        var end_weekday = end_date.getDay();
        var start_val = (start_weekday * 12) + Math.floor(start_time_info[0] / 2);
        var end_val = (end_weekday * 12) + Math.floor(end_time_info[0] / 2);
    }
    else
    {
        var start_val = ((start_date_info[2] - 1) * 4) + Math.floor(start_time_info[0] / 6);
        var end_val = ((end_date_info[2] - 1) * 4) + Math.floor(end_time_info[0] / 6);
    }
    
    var num = 1;
    if(info.hasOwnProperty("tag"))
    {
        num = info.tag;
    }
    
    for(var i = start_val; i < end_val; i++)
    {
        if(increment)
        {
            o.data("data")[i] += num;
        }
        else
        {
            o.data("data")[i] = num;
        }
    }
    o.timebar_load();
}

$.fn.timebarRemove = function(info) 
{
    var o = $(this[0]) // It's your element
    
    var start_info = info.start.split(" ");
    var end_info = info.end.split(" ");
    var start_date_info = '';
    var start_time_info = '';
    var end_date_info = '';
    var end_time_info = '';
    if(start_info[0].length >= 2)
    {
        start_date_info = start_info[0].split("-");
        start_time_info = start_info[1].split(":");
    }
    else
    {
        start_time_info = start_info.split(":");
    }
    if(end_info[0].length >= 2)
    {
        end_date_info = end_info[0].split("-");
        end_time_info = end_info[1].split(":");
    }
    else
    {
        end_time_info = end_info.split(":");
    }
    
    var start_val = 0;
    var end_val = 0;
    
    if(o.data("type") == 1)
    {
        var start_val = (start_time_info[0] * 4) + Math.floor(start_time_info[1] / 15);
        var end_val = (end_time_info[0] * 4) + Math.floor(end_time_info[1] / 15);
    }
    else if(o.data("type") == 2)
    {
        var start_date = new Date(info.start);
        var start_weekday = start_date.getDay();
        var end_date = new Date(info.end);
        var end_weekday = end_date.getDay();
        var start_val = (start_weekday * 12) + Math.floor(start_time_info[0] / 2);
        var end_val = (end_weekday * 12) + Math.floor(end_time_info[0] / 2);
    }
    else
    {
        var start_val = ((start_date_info[2] - 1) * 4) + Math.floor(start_time_info[0] / 6);
        var end_val = ((end_date_info[2] - 1) * 4) + Math.floor(end_time_info[0] / 6);
    }
    
    var num = -1;
    if(info.hasOwnProperty("tag"))
    {
        num = info.tag;
    }
    
    for(var i = start_val; i < end_val; i++)
    {
        if(num >= 0)
        {
            o.data("data")[i] -= num;
        }
        else
        {
            o.data("data")[i] = 0;
        }
        if(o.data("data")[i] < 0)
            o.data("data")[i] = 0;
    }
    o.timebar_load();
}



$.fn.timebarClear = function(start, finish, number) 
{
    var o = $(this[0]) // It's your element
    for(var i = 0; i < 124; i++)
    {
        o.data("data")[i] = 0;
    }
    o.timebar_load();
}

$.fn.timebar_load = function() 
{
    var o = $(this[0]) // It's your element
    
    var html = "";
    var aggregated = new Array();
    var cell_width = 32;
    var indicator_width = 8;
    var num_cells = 24;
    var label_margin = -10;
    var num_slots = 96;

    var today = new Date();
    
    if(o.data("type") == 2)
    {
        cell_width = 36;
        indicator_width = 9;
        num_cells = 21;
        num_slots = 84;
    }
    else if(o.data("type") == 3)
    {
        cell_width = 24;
        indicator_width = 6;
        num_cells = 31;
        label_margin = -3;
        num_slots = 124;
    }
    
    for(var i = 0; i < num_cells; i++)
    {
        var time_str = '';
        var time_str_1 = '';
        var time_str_2 = '';
        var time_str_3 = '';
        var time_str_4 = '';
        var time_str_5 = '';
        var day_val = '';
        if(o.data("type") == 1)
        {
            if(i == 0 || i == 12)
            {
                time_str += '12';
            }
            else if(i < 12)
            {
                time_str += i;
            }
            else
            {
                time_str += i - 12;
            }
            if(i < 12)
            {
                time_str += ' am';
            }
            else
            {
                time_str += ' pm';
            }
            
            var hour = i;
            if(hour < 10)
                hour = '0'+hour;
            var next_hour = i + 1;
            if(next_hour == 24)
                next_hour = 0;
            if(next_hour < 10)
                next_hour = '0'+next_hour;
            time_str_1 = hour+':00:00';
            time_str_2 = hour+':15:00';
            time_str_3 = hour+':30:00';
            time_str_4 = hour+':45:00';
            time_str_5 = next_hour+':00:00';
            day_val = 0;

        }
        else if(o.data("type") == 2)
        {
            if(i % 3 == 0)
            {
                var day = Math.floor(i / 3);
                time_str += '<span style="color: #888">';
                if(day == 0)
                {
                    time_str += 'Sun';
                }
                else if(day == 1)
                {
                    time_str += 'Mon';
                }
                else if(day == 2)
                {
                    time_str += 'Tues';
                }
                else if(day == 3)
                {
                    time_str += 'Wed';
                }
                else if(day == 4)
                {
                    time_str += 'Thurs';
                }
                else if(day == 5)
                {
                    time_str += 'Fri';
                }
                else if(day == 6)
                {
                    time_str += 'Sat';
                }
                time_str += '</span>';
                time_str_1 = '00:00:00';
                time_str_2 = '02:00:00';
                time_str_3 = '04:00:00';
                time_str_4 = '06:00:00';
                time_str_5 = '08:00:00';
            }
            else if(i % 3 == 1)
            {
                time_str += '8 am';
                time_str_1 = '08:00:00';
                time_str_2 = '10:00:00';
                time_str_3 = '12:00:00';
                time_str_4 = '14:00:00';
                time_str_5 = '16:00:00';
            }
            else
            {
                time_str += '4 pm';
                time_str_1 = '16:00:00';
                time_str_2 = '18:00:00';
                time_str_3 = '20:00:00';
                time_str_4 = '22:00:00';
                time_str_5 = '00:00:00';
            }
            day_val = Math.floor(i / 3);
        }
        else
        {
            time_str += i + 1;
            time_str_1 = '00:00:00';
            time_str_2 = '06:00:00';
            time_str_3 = '12:00:00';
            time_str_4 = '18:00:00';
            time_str_5 = '00:00:00';
            day_val = i + 1;
        }
        
        
        html += '<div class="timeCell" style="width: '+cell_width+'px;" >';
        html += '<div class="timeCellIndicator" style="width: '+cell_width+'px; ';
        if(i == 0)
        {
            html += 'border-top-left-radius: 3px; border-bottom-left-radius: 3px; -webkit-border-top-left-radius: 3px; -moz-border-top-left-radius: 3px;  -webkit-border-bottom-left-radius: 3px; -moz-border-bottom-left-radius: 3px;"';
        }
        else if(i == (num_cells - 1))
        {
            html += 'border-top-right-radius: 3px; border-bottom-right-radius: 3px; -webkit-border-top-right-radius: 3px; -moz-border-top-right-radius: 3px;  -webkit-border-bottom-right-radius: 3px; -moz-border-bottom-right-radius: 3px;"';
        }
        html += '">';
        if(o.data("data")[(i * 4)] >= 1)
        {
            var val = Math.floor(o.data("data")[(i * 4)] / o.data("interval"));
            if(val > o.data("colors").length)
            {
                val = o.data("colors").length;
            }
            html += '<div class="timeCellIndicatorOn" style="width: '+indicator_width+'px; background-color: #'+o.data("colors")[val - 1]+';" >';
            html += '<input type="hidden" value="'+time_str_1+'" />';
            html += '<input type="hidden" value="'+time_str_2+'" />';
            html += '<input type="hidden" value="'+day_val+'" />';
            html += '<input type="hidden" value="'+o.data("data")[(i * 4)]+'" />';
            html += '</div>';
        }
        else
        {
            html += '<div class="timeCellIndicatorOff" style="width: '+indicator_width+'px;">';
            html += '<input type="hidden" value="'+time_str_1+'" />';
            html += '<input type="hidden" value="'+time_str_2+'" />';
            html += '<input type="hidden" value="'+day_val+'" />';
            html += '<input type="hidden" value="0" />';
            html += '</div>';
        }
        if(o.data("data")[(i * 4) + 1] >= 1)
        {
            var val = Math.floor(o.data("data")[(i * 4) + 1] / o.data("interval"));
            if(val > o.data("colors").length)
            {
                val = o.data("colors").length;
            }
            html += '<div class="timeCellIndicatorOn" style="width: '+indicator_width+'px; background-color: #'+o.data("colors")[val - 1]+';">';
            html += '<input type="hidden" value="'+time_str_2+'" />';
            html += '<input type="hidden" value="'+time_str_3+'" />';
            html += '<input type="hidden" value="'+day_val+'" />';
            html += '<input type="hidden" value="'+o.data("data")[(i * 4) + 1]+'" />';
            html += '</div>';
        }
        else
        {
            html += '<div class="timeCellIndicatorOff" style="width: '+indicator_width+'px;">';
            html += '<input type="hidden" value="'+time_str_2+'" />';
            html += '<input type="hidden" value="'+time_str_3+'" />';
            html += '<input type="hidden" value="'+day_val+'" />';
            html += '<input type="hidden" value="0" />';
            html += '</div>';
        }
        if(o.data("data")[(i * 4) + 2] >= 1)
        {
            var val = Math.floor(o.data("data")[(i * 4) + 2] / o.data("interval"));
            if(val > o.data("colors").length)
            {
                val = o.data("colors").length;
            }
            html += '<div class="timeCellIndicatorOn" style="width: '+indicator_width+'px; background-color: #'+o.data("colors")[val - 1]+';">';
            html += '<input type="hidden" value="'+time_str_3+'" />';
            html += '<input type="hidden" value="'+time_str_4+'" />';
            html += '<input type="hidden" value="'+day_val+'" />';
            html += '<input type="hidden" value="'+o.data("data")[(i * 4) + 2]+'" />';
            html += '</div>';
        }
        else
        {
            html += '<div class="timeCellIndicatorOff" style="width: '+indicator_width+'px;">';
            html += '<input type="hidden" value="'+time_str_3+'" />';
            html += '<input type="hidden" value="'+time_str_4+'" />';
            html += '<input type="hidden" value="'+day_val+'" />';
            html += '<input type="hidden" value="0" />';
            html += '</div>';
        }
        if(o.data("data")[(i * 4) + 3] >= 1)
        {
            var val = Math.floor(o.data("data")[(i * 4) + 3] / o.data("interval"));
            if(val > o.data("colors").length)
            {
                val = o.data("colors").length;
            }
            html += '<div class="timeCellIndicatorOn" style="width: '+indicator_width+'px; background-color: #'+o.data("colors")[val - 1]+';">';
            html += '<input type="hidden" value="'+time_str_4+'" />';
            html += '<input type="hidden" value="'+time_str_5+'" />';
            html += '<input type="hidden" value="'+day_val+'" />';
            html += '<input type="hidden" value="'+o.data("data")[(i * 4) + 3]+'" />';
            html += '</div>';
        }
        else
        {
            html += '<div class="timeCellIndicatorOff" style="width: '+indicator_width+'px;">';
            html += '<input type="hidden" value="'+time_str_4+'" />';
            html += '<input type="hidden" value="'+time_str_5+'" />';
            html += '<input type="hidden" value="'+day_val+'" />';
            html += '<input type="hidden" value="0" />';
            html += '</div>';
        }
        html += '</div><span class="timeLabel" style="margin-left: '+label_margin+'px;">';
        html += time_str;
        html += '</span></div>';

    }
    html += '</div></div>';
    o.html(html);
    
    setTimeout(function()
    {
        if(typeof dictionary != undefined)
        {
            if(o.data("clickFunction") != null)
            {
                
                o.find('div.timeCellIndicatorOn').each(function(index)
                {
                    var dict = {day: $(this).children('input').eq(2).val(), start: $(this).children('input').eq(0).val(), end: $(this).children('input').eq(1).val(), tag: $(this).children('input').eq(3).val(), element: $(this)};
                    $(this).unbind('click');
                    var func = partial(o.data("clickFunction"), dict);
                    $(this).on('click', func);
                    $(this).css("cursor", "pointer");
                });
                
                o.find('div.timeCellIndicatorOff').each(function(index)
                {
                    var dict = {day: $(this).children('input').eq(2).val(), start: $(this).children('input').eq(0).val(), end: $(this).children('input').eq(1).val(), tag: $(this).children('input').eq(3).val(), element: $(this)};
                    $(this).unbind('click');
                    var func = partial(o.data("clickFunction"), dict);
                    $(this).on('click', func);
                    $(this).css("cursor", "pointer");
                });
            }
            
            
            if(o.data("mouseoverFunction") != null)
            {
                
                o.find('div.timeCellIndicatorOn').each(function(index)
                {
                    var dict = {day: $(this).children('input').eq(2).val(), start: $(this).children('input').eq(0).val(), end: $(this).children('input').eq(1).val(), tag: $(this).children('input').eq(3).val(), element: $(this)};
                    $(this).unbind('mouseover');
                    var func = partial(o.data("mouseoverFunction"), dict);
                    $(this).css("cursor", "pointer");
                    $(this).mouseover(func);
                });
                
                o.find('div.timeCellIndicatorOff').each(function(index)
                {
                    var dict = {day: $(this).children('input').eq(2).val(), start: $(this).children('input').eq(0).val(), end: $(this).children('input').eq(1).val(), tag: $(this).children('input').eq(3).val(), element: $(this)};
                    $(this).unbind('mouseover');
                    var func = partial(o.data("mouseoverFunction"), dict);
                    $(this).css("cursor", "pointer");
                    $(this).mouseover(function() 
                    {
                        $(this).css("background-color", o.data("hoverColor"));
                        func();
                    });
                });
            }
            else
            {
                o.find('div.timeCellIndicatorOff').each(function(index)
                {
                    $(this).mouseover(function() 
                    {
                        $(this).css("background-color", o.data("hoverColor"));
                    });
                });
            }
            
            if(o.data("mouseoutFunction") != null)
            {
                
                o.find('div.timeCellIndicatorOn').each(function(index)
                {
                    var dict = {day: $(this).children('input').eq(2).val(), start: $(this).children('input').eq(0).val(), end: $(this).children('input').eq(1).val(), tag: $(this).children('input').eq(3).val(), element: $(this)};
                    $(this).unbind('mouseout');
                    var func = partial(o.data("mouseoutFunction"), dict);
                    $(this).css("cursor", "pointer");
                    $(this).mouseout(function() 
                    {
                        func();
                    });
                });
                
                o.find('div.timeCellIndicatorOff').each(function(index)
                {
                    var dict = {day: $(this).children('input').eq(2).val(), start: $(this).children('input').eq(0).val(), end: $(this).children('input').eq(1).val(), tag: $(this).children('input').eq(3).val(), element: $(this)};
                    $(this).unbind('mouseout');
                    var func = partial(o.data("mouseoutFunction"), dict);
                    $(this).css("cursor", "pointer");
                    $(this).mouseout(function() 
                    {
                        $(this).css("background-color", "#FFF");
                        func();
                    });
                });
            }
            else
            {
                o.find('div.timeCellIndicatorOff').each(function(index)
                {
                    $(this).mouseout(function() 
                    {
                        $(this).css("background-color", "#FFF");
                    });
                });
            }
        }
    }, 1000);
};

// util

function partial(func /*, 0..n args */) 
{
    var args = Array.prototype.slice.call(arguments, 1);
    return function() 
    {
        var allArguments = args.concat(Array.prototype.slice.call(arguments));
        return func.apply(this, allArguments);
    };
}
