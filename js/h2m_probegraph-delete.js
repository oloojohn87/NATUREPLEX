$.fn.H2M_ProbeGraph = function(dictionary) 
{
    var o = $(this[0]);
    var sample_data = dictionary.data;
    var probe_id = dictionary.probe_id;
    var height = dictionary.height;
    var width = dictionary.width;
    var data_values = dictionary.units;
    var unit = dictionary.question_unit;
    var title = dictionary.title;
       
    var container = document.getElementById(o.attr("id"));
    
    container.innerHTML = '';
        
    container.style.width = width+'px';
    container.style.height = height+'px';
    container.style.backgroundColor = '#FEFEFE';
    container.style.borderRadius = '8px';
    container.style.border = '1px solid #E8E8E8';
    container.style.margin = 'auto';
    container.style.marginTop = '20px';
    container.style.overflow = 'hidden';

    var probe_data_font_size = 0;
    var probe_date_font_size = 0;
    if(height >= 275)
    {
        probe_data_font_size = (height / 16.0);
        probe_date_font_size = (height / 24.0);
    }
    else
    {
        probe_data_font_size = (height / 8.0);
        probe_date_font_size = (height / 14.0);
    }

    container.innerHTML = '<div style="width: '+width+'px; height: '+Math.ceil((height * 0.25) * 0.9)+'px; background-color: #888; text-align: center; color: #FFF; font-size: '+probe_data_font_size+'px; font-family: Helvetica, sans-serif; padding-top: '+Math.floor((height * 0.25) * 0.1)+'px;"><div></div><div style="font-size: '+probe_date_font_size+'px; margin-top: 10px;"></div><div></div>'+title+'  '+probe_id+'</div><div style="width: '+width+'px; height: '+height+'px"></div>';

    if(height < 275)
    {
        container.firstChild.children[0].style.float = 'left';
        container.firstChild.children[0].style.marginLeft = '10px';
        container.firstChild.children[0].style.marginTop = '2px';
        container.firstChild.children[0].style.fontSize = (probe_data_font_size - 8)+'px';
        container.firstChild.children[1].style.float = 'right';
        container.firstChild.children[1].style.marginTop = '0px';
        container.firstChild.children[1].style.textAlign = 'right';
        container.firstChild.children[1].style.marginRight = '10px';
        container.firstChild.children[2].style.margin = 'auto';
        container.firstChild.children[2].style.marginTop = '10px';
        container.firstChild.children[2].style.fontSize = (probe_data_font_size + 2)+'px';
    }
    
    var stage = new Kinetic.Stage({
        container: container.children[1],
        width: dictionary.width,
        height: (dictionary.height * 0.75)
    });

    var layer = new Kinetic.Layer();

    stage.add(layer);
    
    sample_data.sort(function(a, b)
    {
        if (a.date < b.date)
            return -1;
        if (a.date > b.date)
            return 1;
        return 0;
    });
    
    
    var container = document.getElementById(o.attr("id"));


    var points_array = [];
    var dates_array = [];
    var circles = [];
    var guide_lines = [];
    var date_labels = [];
    var date_borders = [];
    
    for(var i = 0; i < sample_data.length; i++)
    {
        dates_array.push(moment(sample_data[i].date, "YYYY-MM-DD hh:mm:ss"));
    }
    
    var main_diff = 0;
    var first_day = null;
    var last_day = null;
    if(dates_array.length > 0)
    {
        first_day = moment(dates_array[0].format('YYYY-MM-DD') + ' 00:00:00', "YYYY-MM-DD hh:mm:ss");
        last_day = moment(dates_array[dates_array.length - 1].format('YYYY-MM-DD') + ' 23:59:59', "YYYY-MM-DD hh:mm:ss");
        main_diff = last_day.diff(first_day, 'minutes');
    }
    if(sample_data.length == 1)
    {
        points_array.push(width / 2.0);
        points_array.push((height * 0.75) - ((height / 8.0) * sample_data[0].value));
    }
    else
    {
        for(var i = 0; i < dates_array.length; i++)
        {
            var this_diff = dates_array[i].diff(first_day, 'minutes');
            var perc = this_diff / main_diff;
            points_array.push(perc * width);
            points_array.push((height * 0.75) - ((height / 8.0) * sample_data[i].value));
        }
    }

    var labels_indexes = [];
    if(dates_array.length > 0)
    {
        var diff = last_day.diff(first_day, 'days') + 1;
        console.log('DIFF: ' + diff);
        
        if(diff >= 3 && dates_array.length % 2 == 0)
        {
            var interval_date = moment(dates_array[0]);
            labels_indexes = [{label: dates_array[0].format('MMM DD'), x: 0}, 
                              {label: moment(interval_date).add(Math.round(diff / 3.0), 'days').format('MMM DD'), x: (Math.round(diff / 3.0) / diff) * width - 25}, 
                              {label: moment(interval_date).add(Math.round((diff / 3.0) * 2.0), 'days').format('MMM DD'), x: (Math.round((diff / 3.0) * 2.0) / diff) * width - 25}, 
                              {label: moment(dates_array[dates_array.length - 1]).add(1, 'days').format('MMM DD'), x: width - 50}];
        }
        else if(diff == 2 || (diff >= 3 && dates_array.length % 2 == 1))
        {
            var interval_date = moment(dates_array[0]);
            labels_indexes = [{label: dates_array[0].format('MMM DD'), x: 0}, 
                              {label: interval_date.add(Math.round(diff / 2.0), 'days').format('MMM DD'), x: (Math.round(diff / 2.0) / diff) * width - 25}, 
                              {label: moment(dates_array[dates_array.length - 1]).add(1, 'days').format('MMM DD'), x: width - 50}];
        }
        else
        {
            labels_indexes = [{label: dates_array[0].format('MMM DD'), x: 0}, 
                              {label: moment(dates_array[dates_array.length - 1]).add(1, 'days').format('MMM DD'), x: width - 50}];
        }
 
    }

    for(var i = 0; i < points_array.length; i += 2)
    {
        var circle = new Kinetic.Circle({
            x: points_array[i],
            y: points_array[i + 1],
            radius: 5,
            fill: '#FFF',
            stroke: '#22AEFF',
            strokeWidth: 1
        });
        if(points_array.length == 2)
            circle.setFill('#22AEFF');
        circles.push(circle);

        

    }


    var lastIndex = -1;
    console.log('SAMPLE DATA LENGTH: ' + sample_data.length);
    if(sample_data.length > 0)
    {
        var days = dates_array[dates_array.length - 1].diff(first_day, 'days') + 1;
        var num_lines = days;
        var guide_line_width = width / days;
        for(var i = 0; i < num_lines; i++)
        {
            var x = i * guide_line_width;
            var guideLine = new Kinetic.Line({
                points: [x, 0, x, (height * 0.75) - 15],
                stroke: '#F2F2F2',
                strokeWidth: 2,
                lineJoin: 'round',
                dashArray: [5, 7]
            });
            guide_lines.push(guideLine);
        }

        for(var i = 0; i < labels_indexes.length; i++)
        {
            var text = new Kinetic.Text({
                x: labels_indexes[i].x,
                y: (height * 0.75) - 11,
                text: labels_indexes[i].label,
                fontSize: 10,
                fontFamily: 'Helvetica',
                fill: '#999',
                width: 50,
                padding: 0,
                align: 'center'
            });
            date_labels.push(text);
        }
        stage.on('mousemove', function() {
            var mousePos = stage.getMousePosition();
            var index = H2M_ProbeGraphClosestPoint(mousePos.x, mousePos.y, circles);
            if(index != lastIndex)
            {
                lastIndex = index;
                for(var k = 0; k < circles.length; k++)
                {
                    if(k == index)
                    {
                        circles[k].show();
                        //guide_lines[k].setStroke('#CCC');
                        var label = container.firstChild.children[0];
                        if(data_values.length > 1)
                            label.textContent = H2M_ProbeGraphLabel(sample_data[k].value, data_values);
                        else
                            label.textContent = sample_data[k].value+' '+unit;
                        var dateLabel = container.firstChild.children[1];
                        dateLabel.innerHTML = dates_array[k].format('LLL')+'<br/>'+dates_array[k].fromNow();
                    }
                    else
                    {
                        circles[k].hide();
                        //guide_lines[k].setStroke('#F2F2F2');
                    }
                }
                layer.draw();
            }
        });
        container.onmouseout = function()
        {
            // set last probe as active
            for(var k = 0; k < circles.length - 1; k++)
            {
                circles[k].hide();
                //guide_lines[k].setStroke('#F2F2F2');
            }
            circles[circles.length - 1].show();
            //guide_lines[guide_lines.length - 1].setStroke('#CCC');
            if(data_values.length > 1)
                container.firstChild.children[0].textContent = H2M_ProbeGraphLabel(sample_data[sample_data.length - 1].value, data_values);
            else
                container.firstChild.children[0].textContent = sample_data[sample_data.length - 1].value+' '+unit;
            container.firstChild.children[1].innerHTML = dates_array[dates_array.length - 1].format('LLL')+'<br/>'+dates_array[dates_array.length - 1].fromNow();
            layer.draw();
        }

        var x_axis = new Kinetic.Rect({
            x: 0,
            y: (height * 0.75) - 13,
            width: width + 50,
            height: 15,
            fill: '#FEFEFE',
            stroke: '#DDD',
            strokeWidth: 1,
        });
        layer.add(x_axis);
        var mainLine = null;
        if(points_array.length > 2)
        {
            mainLine = new Kinetic.Spline({
                tension: 0.2,
                points: points_array,
                stroke: '#22AEFF',
                strokeWidth: 2,
                lineCap: 'round',
                lineJoin: 'round'
            });

            
        }

        for(var i = 0; i < guide_lines.length; i++)
        {
            layer.add(guide_lines[i]);
        }
        if(points_array.length > 2)
        {
            layer.add(mainLine);
        }
        for(var i = 0; i < circles.length; i++)
        {
            layer.add(circles[i]);
            circles[i].hide();
        }
        for(var i = 0; i < date_labels.length; i++)
        {
            layer.add(date_labels[i]);
        }
        var arrow_left = new Kinetic.RegularPolygon({
            x: 6,
            y: (height * 0.75) - 6,
            sides: 3,
            radius: 3,
            fill: '#888',
            rotationDeg: 270
        });
        var arrow_right = new Kinetic.RegularPolygon({
            x: width - 6,
            y: (height * 0.75) - 6,
            sides: 3,
            radius: 3,
            fill: '#888',
            rotationDeg: 90
        });
        layer.add(arrow_left);
        layer.add(arrow_right);

        // set last probe as active

        circles[circles.length - 1].show();
        //guide_lines[guide_lines.length - 1].setStroke('#CCC');
        if(data_values.length > 1)
                container.firstChild.children[0].textContent = H2M_ProbeGraphLabel(sample_data[sample_data.length - 1].value, data_values);
            else
                container.firstChild.children[0].textContent = sample_data[sample_data.length - 1].value+' '+unit;
        container.firstChild.children[1].innerHTML = dates_array[dates_array.length - 1].format('LLL')+'<br/>'+dates_array[dates_array.length - 1].fromNow();
    }
    else
    {
        container.firstChild.children[0].textContent = 'No Probe Data';
    }


    layer.draw();
    
    
}

function H2M_ProbeGraphClosestPoint(x, y, circles)
{
    var current_index = -1;
    var last_position_x = -5000;
    var last_position_y = -5000;
    var current_distance = 10000;
    for(var k = 0; k < circles.length; k++)
    {
        var dist = Math.abs(circles[k].getX() - x);
        if(Math.abs(last_position_x - circles[k].getX()) < 5)
        {
            if(Math.abs(circles[k].getY() - y) < Math.abs(last_position_y - y))
            {
                current_distance = dist;
                current_index = k;
                last_position_x = circles[k].getX();
                last_position_y = circles[k].getY();
            }
        }
        else if(dist < current_distance)
        {
            current_distance = dist;
            current_index = k;
            last_position_x = circles[k].getX();
            last_position_y = circles[k].getY();
        }
    }
    return current_index;
}

function H2M_ProbeGraphLabel(val, units)
{
    var res = units[0].label;
    for(var k = 0; k < units.length; k++)
    {
        if(k == 0 && val <= units[k].value)
        {
            res = units[k].label;
        }
        else if(val <= units[k].value && val > units[k - 1].value)
        {
            res = units[k].label;
        }
        
    }
    return res;
}