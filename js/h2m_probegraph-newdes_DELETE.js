$.fn.H2M_ProbeGraph = function(dictionary) 
{
    var o = $(this[0]);
    var sample_data = dictionary.data;
    var probe_alerts = dictionary.probe_alerts;
    var probe_id = dictionary.probe_id;
    var height = dictionary.height;
    //var canvas_height =height-50;
    var canvas_height =250;
    var width = dictionary.width;
    var data_values = dictionary.units;
    var unit = dictionary.question_unit;
    var title = dictionary.title;
    
    var min_days = dictionary.min_days;
    var max_days = dictionary.max_days;
    var start_value = dictionary.min_value;
    var end_value = dictionary.max_value;
    var scalemax = dictionary.max_scale;
   
    var circles = [];
    var guidelines = [];
    var tooltips = [];
    /*
    var min_days = 15;
    var max_days = 25;
    var start_value = 0;
    var end_value = 8;
    var scalemax = 10;
    */
    
    var container = document.getElementById(o.attr("id"));
    
    //alert (probe_id+'  '+o.attr("id"));

    container.innerHTML = '';
        
    container.style.width = width + 'px';
    container.style.height = height + 'px';
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

    var days_on = moment().diff(moment(sample_data[sample_data.length-1].date),'days');
    var progress = days_on * 200 / max_days;
    
    container.innerHTML = '\
        <div id="graph_upper_bar" style="width: '+width+'px; height: 35px; background-color: white; text-align: center; color: #FFF; font-size: '+probe_data_font_size+'px; font-family: Helvetica, sans-serif; padding-top: '+Math.floor((height * 0.15) * 0.1)+'px;">\
            <div id="probe_name" style="font-family:Lato; font-size:14px; color:#777; float:left; margin-left:10px; width:200px; text-align:left;">'+title+'</div>\
            <div id="probe_minigraph" style="width:200px; height:6px; background-color:white; margin-top:5px; float:left; margin-left:100px; border:1px solid #e6e5e5;">\
                <div id="probe_minigraph_inner" style="width:'+progress+'px; height:6px; background-color:#22aeff; margin-top:0px; float:left; margin-left:0px;"></div>\
            </div>\
            <div class="question_label" id="probe_question_label_'+probe_id+'" style="font-family:Lato; font-size:12px; color:#777; float:right; margin-right:10px;">Question 1 of 2: Body Temperature</div>\
            <div style=" float:left; width:100%;"></div>\
            <div id="probe_time" style="font-family:Lato; font-size:10px; color:#bebebe; float:left; margin-left:10px; margin-top:-8px;">Started '+moment(sample_data[sample_data.length-1].date).format('MMM D, YYYY')+' ('+days_on+' days ago)</div>\
        </div>\
        <div id="graph_main_content_'+probe_id+'" style="width: '+width+'px; height: '+canvas_height+'px"></div>\
        <div id="graph_bottom_bar" style="width: '+width+'px; height: 25px; background-color:#e0e0e0;">\
                    <input id="scaleToggle_'+probe_id+'" class="scaleToggle btn btn-default" type="button" value="Paths" style="margin-left:90px; width:65px; height: 20px; line-height: 10px; font-size:10px;">\
                    <input id="alertsToggle_'+probe_id+'" class="alertsToggle btn btn-default" type="button" value="Alerts" style="margin-left:20px; width:65px; height: 20px; line-height: 10px; font-size:10px;">\
        </div>';   
 
    
/*
            <link rel="stylesheet" href="css/toggle.css" />\
                <div style="width: 62px; height: 30px; margin-top: 2px;">\
                    <input id="pathToggle" class="h2m-small-toggle h2m-small-toggle-round" type="checkbox" />\
                    <label for="pathToggle" data-on="Yes" data-off="No" style="float: left;"></label>\
                    <div id="pathToggleLabel" style="color: #54BC00; float: right; width: 30px; height: 30px; font-size: 12px;\ text-align: right; margin-top: -1px;">On</div>\
                </div>\
                    <input id="scaleToggle_'+probe_id+'" class="scaleToggle btn btn-default" type="button" value="Paths" style="margin-left:90px; width:65px; height: 20px; line-height: 10px; font-size:10px;">\
                    <input id="alertsToggle_'+probe_id+'" class="alertsToggle btn btn-default" type="button" value="Alerts" style="margin-left:20px; width:65px; height: 20px; line-height: 10px; font-size:10px;">\
*/    
    
    // Assignment of var stage to the provided container
    
    
    var stage = new Konva.Stage({
        container: container.children[1],  //This is graph_main_content div
        width: dictionary.width,
        height: canvas_height
    });
    // Creation of Layer
    var layer = new Konva.Layer();
    var layeraxis = new Konva.Layer();
    var layerpaths = new Konva.Layer();
    var layerpatient = new Konva.Layer();
    var layertooltip = new Konva.Layer();
    // Layer added to stage
    stage.add(layer);
    stage.add(layeraxis);
    stage.add(layerpaths);
    stage.add(layerpatient);
    stage.add(layertooltip);
        
    var margin_left = 70;
    var margin_right = 20;
    var margin_top = 30;
    var margin_bottom = 25;
 
    var draw_width = width - margin_left - margin_right;
    var draw_height = canvas_height - margin_top - margin_bottom;
    
    var base_area = new Konva.Rect({
            x: margin_left,
            y: margin_top,
            width: draw_width,
            height: draw_height,
            opacity: 0.3,
            fill: '#f2f2f2',
        });
    var vertical_axis = new Konva.Line({
          points: [margin_left, (margin_top + draw_height), margin_left, (margin_top)],
          stroke: '#a3a3a2',
          strokeWidth: 1,
          opacity: 0.6,
          closed : false
    }); 
    var horizontal_axis = new Konva.Line({
          points: [margin_left, (margin_top + draw_height), (margin_left + draw_width), (margin_top + draw_height)],
          stroke: '#a3a3a2',
          strokeWidth: 1,
          opacity: 0.6,
          closed : false
    });    
    console.log('.........................................................');
    console.log('Scalemin: '+scalemin+'     Scalemax: '+scalemax+' StepAxis: '+step_axis);
    if (scalemin == null) scalemin = 0;
    if (scalemax == null) scalemax = 10;
    var step_axis = Math.round(((scalemax-scalemin) / 14));
    if (step_axis < 1) step_axis = 1;
    console.log('Scalemin: '+scalemin+'     Scalemax: '+scalemax+' StepAxis: '+step_axis);
    console.log('.........................................................');
    for (var p = parseInt(scalemin); p < parseInt(scalemax); p+=parseInt(step_axis))
    //for (var p = 0; p < (data_values.length - 1); p++)
    //for (var p = 0; p < scalemax; p++)

    {
        var v_axis_label_num = new Konva.Text({
          x: trans_x(0)-15,
          y: trans_y(p)-5-3,
          text: p,
          fontSize: 10,
          fontFamily: 'Lato',
          opacity: 0.4,    
          fill: 'black'
        });
        layer.add(v_axis_label_num);
        var v_axis_label_text = new Konva.Text({
          x: trans_x(0)-30-30,
          y: trans_y(p)-5-3,
          text: H2M_ProbeGraphLabel(p, data_values),
          fontSize: 10,
          fontFamily: 'Lato',
          opacity: 0.4,    
          fill: 'black'
        });
        layer.add(v_axis_label_text);
    }
    /*
    var triangle_scalemax_label = new Konva.Text({
      x: trans_x(0)-30,
      y: trans_y(scalemax)-5,
      text: scalemax,
      fontSize: 10,
      fontFamily: 'Lato',
      opacity: 0.8,    
      fill: 'black'
    });
    
    var triangle_endvalue_label = new Konva.Text({
      x: trans_x(0)-30-30,
      y: trans_y(end_value)-5,
      text: H2M_ProbeGraphLabel(end_value, data_values),
      fontSize: 10,
      fontFamily: 'Lato',
      opacity: 0.8,    
      fill: 'black'
    });
    */
    layer.add(base_area);
    layer.add(vertical_axis);
    layer.add(horizontal_axis);
    
   
    sample_data.sort(function(a, b)
    {
        if (a.date < b.date)
            return -1;
        if (a.date > b.date)
            return 1;
        return 0;
    });
    
    var dates_array = [];
    for(var i = 0; i < sample_data.length; i++)
    {
        dates_array.push(moment(sample_data[i].date, "YYYY-MM-DD hh:mm:ss"));
    }
    // SetUp normalized arrays for dates (dates_array) and coordinates (points_array)
    var main_diff = 0;
    var first_day = null;
    var last_day = null;
    if(dates_array.length > 0)
    {
        first_day = moment(dates_array[0].format('YYYY-MM-DD') + ' 00:00:00', "YYYY-MM-DD hh:mm:ss");
        last_day = moment(dates_array[dates_array.length - 1].format('YYYY-MM-DD') + ' 23:59:59', "YYYY-MM-DD hh:mm:ss");
        main_diff = last_day.diff(first_day, 'minutes');
        main_diff_days = last_day.diff(first_day, 'days');
    }
    
    /*
    var temporary_span = document.getElementById('temporary_span'+probe_id);
    temporary_span.style.fontSize = '14px';
    temporary_span.style.color = 'black';
    temporary_span.innerHTML = 'PROBE: '+probe_id+'    Main diff: '+main_diff_days+' days ('+main_diff+' minutes)';
    //temporary_span.innerHTML = 'PROBE: '+probe_id;
    */
    
    var x_axis = new Konva.Line({
      points: [margin_left, (margin_top +  draw_height), (margin_left + draw_width), (margin_top +  draw_height )],
      stroke: 'red',
      strokeWidth: 2,
      lineCap: 'round',
      lineJoin: 'round'
    });
    
    layeraxis.add(x_axis);

    var start_label = new Konva.Text({
      x: margin_left,
      y: (margin_top +  draw_height - 15),
      text: first_day.format('MMM D'),
      fontSize: 12,
      fontFamily: 'Lato',
      fill: 'black'
    });
    var end_label = new Konva.Text({
      x: (margin_left + draw_width - 50),
      y: (margin_top +  draw_height - 15),
      text: last_day.format('MMM D'),
      fontSize: 12,
      fontFamily: 'Lato',
      fill: 'black'
    }); 
    
    layeraxis.add(start_label);
    layeraxis.add(end_label);
    
    // Drawing of the Expected Path and Goal Areas
    
    var group_paths = new Konva.Group({
    });
    var group_alerts = new Konva.Group({
    });
    var group_animation = new Konva.Group({
    });
    
    var path_area = new Konva.Line({
      points: [trans_x(0), trans_y(start_value),trans_x(min_days), trans_y(end_value),trans_x(max_days), trans_y(end_value),trans_x(0), trans_y(start_value)],
      fill: '#cecece',
      stroke: '',
      strokeWidth: 0,
      opacity: 0.2,
      closed : true
    });
    group_paths.add(path_area);
    
    var upper_path = new Konva.Line({
      points: [trans_x(0), trans_y(start_value),trans_x(min_days), trans_y(end_value)],
      stroke: '#bababa',
      strokeWidth: 2,
      opacity: 0.2,
      lineCap: 'round',
      lineJoin: 'round'
    });
    group_paths.add(upper_path);
    
    var lower_path = new Konva.Line({
      points: [trans_x(0), trans_y(start_value),trans_x(max_days), trans_y(end_value)],
      stroke: '#bababa',
      strokeWidth: 2,
      opacity: 0.2,
      lineCap: 'round',
      lineJoin: 'round'
    });
    group_paths.add(lower_path);
    
    var path_area_width = trans_x(max_days) - trans_x(0);
    var path_area_height = Math.abs(trans_y(scalemax) - trans_y(0));
    var path_area_label = new Konva.Text({
      text: 'Predicted Path',
      fontSize: 12,
      fontFamily: 'Lato',
      opacity: 0.5,    
      fill: 'black'
    });
    group_paths.add(path_area_label);
    path_area_label.setX((trans_x(0) + (path_area_width/2)) - (path_area_label.getTextWidth()/2));
    path_area_label.setY (trans_y(0) - (path_area_height/2) - (path_area_label.getTextHeight()/2));

    
    var goal_area = new Konva.Line({
      points: [trans_x(min_days), trans_y(end_value),trans_x(max_days), trans_y(end_value),trans_x(max_days), trans_y(scalemax),trans_x(min_days), trans_y(scalemax)],
      fill: '#54bc00',
      stroke: '#1d4000',
      strokeWidth: 1,
      opacity: 0.05,
      closed : true
    });
    group_paths.add(goal_area);
    
    var goal_area_width = trans_x(max_days) - trans_x(min_days);
    var goal_area_height = Math.abs(trans_y(scalemax) - trans_y(end_value));
    var goal_area_label = new Konva.Text({
      text: 'GOAL AREA',
      fontSize: 12,
      fontFamily: 'Lato',
      opacity: 0.5,    
      fill: 'black'
    });
    group_paths.add(goal_area_label);
    goal_area_label.setX((trans_x(min_days) + (goal_area_width/2)) - (goal_area_label.getTextWidth()/2));
    goal_area_label.setY (trans_y(end_value) - (goal_area_height/2) - (goal_area_label.getTextHeight()/2));
     
    var fail_area = new Konva.Line({
      points: [trans_x(min_days), trans_y(end_value),trans_x(max_days), trans_y(end_value),trans_x(max_days), trans_y(0),trans_x(min_days), trans_y(0)],
      fill: '#bc7b00',
      stroke: '',
      strokeWidth: 0,
      opacity: 0.05,
      closed : true
    });
    group_paths.add(fail_area);
    
    var fail_area_width = trans_x(max_days) - trans_x(min_days);
    var fail_area_height = Math.abs(trans_y(end_value) - trans_y(0));
    var fail_area_label = new Konva.Text({
      text: 'FAIL AREA',
      fontSize: 12,
      fontFamily: 'Lato',
      opacity: 0.5,    
      fill: 'black'
    });
    group_paths.add(fail_area_label);
    fail_area_label.setX((trans_x(min_days) + (fail_area_width/2)) - (fail_area_label.getTextWidth()/2));
    fail_area_label.setY (trans_y(end_value) + (fail_area_height/2) - (fail_area_label.getTextHeight()/2));

    var overperform_area = new Konva.Line({
      points: [trans_x(0), trans_y(end_value),trans_x(min_days), trans_y(end_value),trans_x(min_days), trans_y(scalemax),trans_x(0), trans_y(scalemax)],
      fill: '#bc7b00',
      stroke: '',
      strokeWidth: 0,
      opacity: 0.05,
      closed : true
    });
    group_paths.add(overperform_area);
    
    var overperform_area_width = trans_x(min_days) - trans_x(0);
    var overperform_area_height = Math.abs(trans_y(scalemax) - trans_y(end_value));
    var overperform_area_label = new Konva.Text({
      text: 'Overperform AREA',
      fontSize: 12,
      fontFamily: 'Lato',
      opacity: 0.5,    
      fill: 'black'
    });
    group_paths.add(overperform_area_label);
    overperform_area_label.setX(trans_x(0) + (overperform_area_width/2) - (overperform_area_label.getTextWidth()/2));
    overperform_area_label.setY (trans_y(end_value) - (goal_area_height/2) - (goal_area_label.getTextHeight()/2));

    var triangle_min = new Konva.RegularPolygon({
      x: trans_x(min_days),
      y: trans_y(scalemax)-8,
      sides: 3,
      radius: 8,
      fill: '#22aeff',
      stroke: '',
      opacity: .7,
      strokeWidth: 0
    });
    var triangle_max = new Konva.RegularPolygon({
      x: trans_x(max_days),
      y: trans_y(scalemax)-8,
      sides: 3,
      radius: 8,
      fill: '#22aeff',
      stroke: '',
      opacity: .7,
      strokeWidth: 0
    });   
    triangle_min.rotate(180);
    triangle_max.rotate(180);
    group_paths.add(triangle_min);
    group_paths.add(triangle_max);
   
    var triangle_min_label = new Konva.Text({
      x: trans_x(min_days),
      y: trans_y(scalemax)-25,
      text: min_days+' Days',
      fontSize: 10,
      fontFamily: 'Lato',
      opacity: 0.5,    
      fill: 'black'
    });
    group_paths.add(triangle_min_label);
    triangle_min_label.setX (trans_x(min_days) - (triangle_min_label.getTextWidth()/2));

    var triangle_max_label = new Konva.Text({
      x: trans_x(max_days),
      y: trans_y(scalemax)-25,
      text: max_days+' Days',
      fontSize: 10,
      fontFamily: 'Lato',
      opacity: 0.5,    
      fill: 'black'
    });
    group_paths.add(triangle_max_label);
    triangle_max_label.setX (trans_x(max_days) - (triangle_max_label.getTextWidth()/2));
      
    var triangle_scalemax = new Konva.RegularPolygon({
      x: trans_x(0)-8,
      y: trans_y(scalemax),
      sides: 3,
      radius: 8,
      fill: '#54bc00',
      stroke: '',
      opacity: .5,
      strokeWidth: 0
    });   
    var triangle_endvalue = new Konva.RegularPolygon({
      x: trans_x(0)-8,
      y: trans_y(end_value),
      sides: 3,
      radius: 8,
      fill: '#54bc00',
      stroke: '',
      opacity: .5,
      strokeWidth: 0
    });   
    triangle_scalemax.rotate(90);
    triangle_endvalue.rotate(90);
    group_paths.add(triangle_scalemax);
    group_paths.add(triangle_endvalue);
    
    var triangle_scalemax_label = new Konva.Text({
      x: trans_x(0)-30,
      y: trans_y(scalemax)-5-3,
      text: scalemax,
      fontSize: 10,
      fontFamily: 'Lato',
      opacity: 0.8,    
      fill: 'black'
    });
    group_paths.add(triangle_scalemax_label);
    
    var triangle_endvalue_label = new Konva.Text({
      x: trans_x(0)-30-30,
      y: trans_y(end_value)-5-3,
      text: H2M_ProbeGraphLabel(end_value, data_values),
      fontSize: 10,
      fontFamily: 'Lato',
      opacity: 0.8,    
      fill: 'black'
    });
    group_paths.add(triangle_endvalue_label);
//    label.textContent = H2M_ProbeGraphLabel(sample_data[k].value, data_values);
    // Helper functions for coordinate translation
    function trans_x (val)
    {
        var res = 0;
        if (max_days != 0) res = (val * draw_width / max_days) + margin_left;
        return res;
    }
    function trans_y (val)
    {
        var res = 0;
        if (scalemax != 0) res = draw_height - (val * draw_height / scalemax) + margin_top;
        return res;
    }
    

    layerpaths.add(group_paths);
    
    // Render layers
    layer.draw();
    //layeraxis.draw();
    layerpaths.draw();
   
    var scale_on = 1;
    $('.scaleToggle').on('click', function(){
        var id = this.id;

        if (scale_on == 1) { 
            group_paths.hide();
            scale_on = 0;  
        }
        else { 
            group_paths.show();
            scale_on = 1; 
        }
        layerpaths.draw();   
    });
 
    
    var alerts_on = 1;
    $('.alertsToggle').on('click', function(){
        var id = this.id;
        if (alerts_on == 1) { 
            group_alerts.hide();
            alerts_on = 0;  
        }
        else { 
            group_alerts.show();
            alerts_on = 1; 
        }
        layerpatient.draw();   
    });
    
    
    // Draw the actual evolution line for this patient
    var num_points = sample_data.length;
    //var first_day = moment(sample_data[0].date);
    var first_day = moment(sample_data[0].date).subtract(1, 'days');
    var last_day = moment(sample_data[sample_data.length-1].date);
    var num_days = last_day.diff(first_day, 'days');
    //alert ('Points: '+num_points+'   Days:'+num_days);
    var actual_day = first_day;
    var prev_value = parseInt(sample_data[0].value);
    var prev_day = 0;
    var matching_item = 0;
    var data_present = 0;
    var last_plotted_day = 0;
    var last_plotted_value = 0;
    var previous_point_found = 0;
    for (var n = 0 ;  n < max_days ; n++){
        actual_day.add(1,'days');
        matching_item = 0;
        data_present = 0;
        for (var m = 0 ; m < num_points ; m ++)
        {
            var turn_day = moment(sample_data[m].date);
            if(data_present == 0 && actual_day.format('YYYY MM DD') == turn_day.format('YYYY MM DD'))
            {
                    data_present = 1;
                    matching_item = m;
            }
        }
        // This plots the main point and circle for each patient evolution step
        if (data_present != 0){
            var circle = new Konva.Circle({
                              x: trans_x(n),
                              y: trans_y(sample_data[matching_item].value) ,
                              radius: 4,
                              fill: 'white',
                              stroke: '#22aeff',
                              strokeWidth: 1
            });
            var point_guide_line = new Konva.Line({
                              points: [trans_x(n), trans_y(max_days), trans_x(n), trans_y(0)],
                              stroke: '#22aeff',
                              strokeWidth: 1,
                              opacity: 0.5,
                              dash: [3, 2],
                              closed : false
            });
            layerpatient.add(circle); 
            layerpatient.add(point_guide_line); 
            point_guide_line.setZIndex(8);
            point_guide_line.hide();
            circle.setZIndex(9);
            circles.push(circle);
            guidelines.push(point_guide_line);
            // Add a tooltip box for each point           
            var group_tooltip = new Konva.Group({
            });
            if (trans_y(sample_data[matching_item].value) > (margin_top + draw_height - 60)) {var swap_t = -40;} else {var swap_t = 0;}
            if (trans_x(n) > (margin_left + draw_width - 200)) {var swap_h = -120; var c_side = 80;} else {var swap_h = 0; var c_side = 0;}
            var tooltip_box = new Konva.Rect({
                    x: trans_x(n)+10+8+swap_h,
                    y: trans_y(sample_data[matching_item].value)-12+20+swap_t,
                    width: 80,
                    height: 23,
                    opacity: 1,
                    fill: 'white',
                    stroke: '#9f9f9f',
                    strokeWidth: .5
            });
            group_tooltip.add(tooltip_box);
            var tooltip_line = new Konva.Line({
                    points: [trans_x(n)+10+8+swap_h+c_side, trans_y(sample_data[matching_item].value)+20+swap_t, trans_x(n), trans_y(sample_data[matching_item].value)],
                    stroke: '#9f9f9f',
                    strokeWidth: 1,
                    opacity: 0.5,
                    closed : false
            });
            group_tooltip.add(tooltip_line);  
            var vallab = H2M_ProbeGraphLabel(sample_data[matching_item].value, data_values);
            var tooltip_box_value = new Konva.Text({
                    x: trans_x(n)+3+10+8+swap_h,
                    y: trans_y(sample_data[matching_item].value)+4-12+20+swap_t,
                    text: sample_data[matching_item].value+' '+vallab,
                    fontSize: 8,
                    fontStyle: 'bold',
                    fontFamily: 'Arial',
                    opacity: 1,    
                    fill: '#575757'
            });   
            group_tooltip.add(tooltip_box_value);
            var tooltip_box_date = new Konva.Text({
                    x: trans_x(n)+3+10+8+swap_h,
                    y: trans_y(sample_data[matching_item].value)+4+10-12+20+swap_t,
                    text: moment(sample_data[matching_item].date).format('MMM D,YYYY'),
                    fontSize: 8,
                    fontStyle: 'bold',
                    fontFamily: 'Arial',
                    opacity: 1,    
                    fill: '#807f7f'
            });   
            group_tooltip.add(tooltip_box_date);
            layertooltip.add(group_tooltip);
            group_tooltip.setZIndex(30);
            tooltip_line.setZIndex(4);
            group_tooltip.hide();
            tooltips.push(group_tooltip);
            
            if (n > 0){
                if (previous_point_found != 1) {
                    var point_line = new Konva.Line({
                              points: [trans_x(last_plotted_day), trans_y(last_plotted_value), trans_x(n), trans_y(sample_data[matching_item].value)],
                              stroke: '#22aeff',
                              strokeWidth: 2,
                              opacity: 0.8,
                              dash: [3, 1],
                              closed : false
                    });
                     var point_area = new Konva.Line({
                          points: [trans_x(last_plotted_day), trans_y(last_plotted_value), trans_x(n), trans_y(sample_data[matching_item].value), trans_x(n), trans_y(0),trans_x(last_plotted_day), trans_y(0) ],
                          fill: '#22aeff',
                          stroke: '',
                          strokeWidth: 0,
                          opacity: 0.04,
                          closed : true
                        });
                }else{
                    var point_line = new Konva.Line({
                              points: [trans_x(last_plotted_day), trans_y(last_plotted_value), trans_x(n), trans_y(sample_data[matching_item].value)],
                              stroke: '#22aeff',
                              strokeWidth: 2,
                              opacity: 0.8,
                              closed : false
                    });
                    var point_area = new Konva.Line({
                          points: [trans_x(last_plotted_day), trans_y(last_plotted_value), trans_x(n), trans_y(sample_data[matching_item].value), trans_x(n), trans_y(0),trans_x(last_plotted_day), trans_y(0) ],
                          fill: '#22aeff',
                          stroke: '',
                          strokeWidth: 0,
                          opacity: 0.1,
                          closed : true
                        });
                }
                layerpatient.add(point_line); 
                layerpatient.add(point_area); 
                point_line.setZIndex(2);
            }
            previous_point_found = 1;
            last_plotted_day = n;
            last_plotted_value = sample_data[matching_item].value;
        }else{
            previous_point_found = 0;
        }
         
        //prev_day = n; 
    }
    
    var triangle_firstday = new Konva.RegularPolygon({
      x: trans_x(0),
      y: trans_y(0)+5,
      sides: 3,
      radius: 6,
      fill: '#9d9d9d',
      stroke: '',
      opacity: .5,
      strokeWidth: 0
    });   
    layerpatient.add(triangle_firstday); 
    var triangle_today = new Konva.RegularPolygon({
      x: trans_x(num_days-1),
      y: trans_y(0)+5,
      sides: 3,
      radius: 6,
      fill: '#9d9d9d',
      stroke: '',
      opacity: .5,
      strokeWidth: 0
    });   
    layerpatient.add(triangle_today); 
   
    var triangle_firstday_label = new Konva.Text({
      x: trans_x(0),
      y: trans_y(0)+10,
      text: moment(sample_data[0].date).format('MMM D'),
      fontSize: 10,
      fontFamily: 'Lato',
      opacity: 0.8,    
      fill: 'black'
    });
    if (moment(sample_data[sample_data.length-1].date).diff(moment(sample_data[0].date),'days') > 2){
        layerpatient.add(triangle_firstday_label);
    }
    triangle_firstday_label.setX (trans_x(0) - (triangle_firstday_label.getTextWidth()/2));

    var triangle_lastday_label = new Konva.Text({
      x: trans_x(num_days+12),
      y: trans_y(0)+10,
      text: moment(sample_data[sample_data.length-1].date).format('MMM D'),
      fontSize: 10,
      fontFamily: 'Lato',
      opacity: 0.8,    
      fill: 'green'
    });
    layerpatient.add(triangle_lastday_label);
    triangle_lastday_label.setX (trans_x(num_days-1) - (triangle_lastday_label.getTextWidth()/2));
         
    // Probe Alerts    
    for(var n = 0; n < probe_alerts.length; n++)
    {
        var init_day = moment(sample_data[0].date);
        var this_day = moment(probe_alerts[n].date);
        var day_alert = this_day.diff(init_day, 'days');
        
        var this_value = find_item_day(probe_alerts[n].date);
        
        var alert_circle = new Konva.Circle({
              x: trans_x(day_alert),
              y: trans_y(sample_data[this_value].value),
              radius: 4,
              fill: 'red',
              stroke: '',
              opacity: .5,
              strokeWidth: 0
        });   
        var alert_line = new Konva.Line({
                  points: [trans_x(day_alert), trans_y(max_days), trans_x(day_alert), trans_y(0)],
                  stroke: '#ff5656',
                  strokeWidth: 1,
                  opacity: 0.8,
                  dash: [3, 2],
                  closed : false
        });
        group_animation.add(alert_line);
        var alert_circle_icon = new Konva.Text({
              x: trans_x(day_alert)-2,
              y: trans_y(sample_data[this_value].value)-7,
              text: '!',
              fontSize: 14,
              fontStyle: 'bold',
              fontFamily: 'Arial',
              opacity: 1,    
              fill: 'white'
        });   
        group_alerts.add(alert_circle);
        group_alerts.add(group_animation);
        //group_alerts.add(alert_circle_icon);
        alert_circle.setZIndex(18);
        alert_line.setZIndex(17); 
        alert_circle_icon.setZIndex(19);
        // animation test
        var step = 0;
        var anim = new Konva.Animation(function(frame) {
            var time = frame.time,
            timeDiff = frame.timeDiff,
            frameRate = frame.frameRate;
            // update stuff
            if (step < 1) step = step + 0.01;
            else step = 0;
            group_animation.opacity(step);
        }, layerpatient);
        anim.start();
        
    }
    layerpatient.add(group_alerts);
    
    layerpatient.draw();
    layertooltip.draw();
  
    
    // Events processing
    var lastIndex = -1;
    
    stage.on('mousemove', function() {
        var mousePos = stage.getPointerPosition();
        var index = H2M_ProbeGraphClosestPoint(mousePos.x, mousePos.y, circles);
        console.log(index);
        //circles[index].setAttr('radius', 10);
         
           if(index != lastIndex)
            {
                lastIndex = index;
                for(var k = 0; k < circles.length; k++)
                {
                    if(k == index)
                    {
                        guidelines[k].show();
                        tooltips[k].show();
                        circles[k].setAttr('radius', 6);
                        //var label = document.getElementById('value_label');
                        /*if(data_values.length > 1){
                            //label.innerHTML = H2M_ProbeGraphLabel(sample_data[k].value, data_values);
                        }else{
                            //label.textContent = 'set 2';
                            //var dateLabel = container.firstChild;
                            //dateLabel.innerHTML = dates_array[k].format('LLL')+'<br/>'+dates_array[k].fromNow();
                        }*/
                    }
                    else
                    {
                        guidelines[k].hide();
                        tooltips[k].hide();
                        circles[k].setAttr('radius', 4);
                    }
                }
                layerpatient.draw();
                layertooltip.draw();
            }
           
    });


function find_item_day(entry_date){
    var actual_day = moment (entry_date);
    var result = 0;
    for (var n = 0 ; n < num_points ; n ++){
        var moving_day = moment(sample_data[n].date);
        if(actual_day.format('YYYY MM DD') == moving_day.format('YYYY MM DD')){
            result = n;
        }
    }
    return (result);
}
   
    
    
    
}
// This is the closing of the main function







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


