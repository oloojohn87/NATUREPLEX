$.fn.H2MRange = function(dictionary) 
{
    var o = $(this[0]);
    
    var width = dictionary.width;
    var data = null;
    var min_val = dictionary.min;
    var max_val = dictionary.max;
    
    var controlSize = 35;
    
    if(dictionary.hasOwnProperty('data'))
    {
        data = dictionary.data;
    }
    else
    {
        data = [{value: min, label: 'Range 1'}, {value: max, label: 'Range 2'}];
    }
    
    o.data('width', width);
    o.data('data', data);
    o.data('min', min_val);
    o.data('max', max_val);
    
    o.reload = function()
    {
        var width = o.data('width');
        
        o.empty();

        var container = document.getElementById(o.attr('id'));

        container.style.width = width+'px';
        container.style.height = '80px';

        container.innerHTML = '<div style="width: '+width+'px; height: 20px; margin: auto;"></div><div style="width: 120px; height: 25px; margin: auto; background-color: #888; border-radius: 5px; margin-top: 5px; display: none;"><i class="icon-remove" style="float: right; color: #FFF; font-size: 10px; margin-right: 3px; margin-top: 1px; cursor: pointer;"></i><input type="text" style="width: 100px; height: 20px; margin-top: 2px; margin-left: 5px; background-color: inherit; border: 0px solid #FFF; outline: none; color: #FFF; text-align: center; padding: 0px; border-radius: 0px; box-shadow: none;" value="test" /></div>';

        var label_editor_container = container.children[1];
        var label_close_button = container.children[1].children[0];
        var label_editor = container.children[1].children[1];

        if(o.data('stage') != null)
        {
            o.data('stage').removeChildren();
            o.data('stage', null);
        }
        o.data('stage', new Kinetic.Stage({container: container.children[0], width: o.data('width'), height: 30 }));
        
        if(o.data('layer') != null)
        {
            o.data('layer').removeChildren();
            o.data('layer', null);
        }
        o.data('layer', new Kinetic.Layer());

        o.data('rects', []);
        o.data('add_buttons',  []);
        o.data('delete_buttons', []);
        o.data('controls', []);
        o.data('labels', []);
        o.data('control_labels', []);
        o.data('texts', []);
        o.data('current_rect', 0);

        var initialWidth = o.data('width') - (controlSize * 2) - ((o.data('data').length - 2) * controlSize);

        var w = controlSize;
        
        o.data('texts').push(o.data('data')[0].label);
        for(var i = 1; i < o.data('data').length; i++)
        {
            o.data('texts').push(o.data('data')[i].label);

            var perc = ((o.data('data')[i].value - o.data('min')) / (o.data('max') - o.data('min')));
            if(i > 0)
                perc = ((o.data('data')[i].value - o.data('data')[i - 1].value) / (o.data('max') - o.data('min'))); 

            console.log('INITIAL WIDTH: ' + initialWidth);
            console.log('PERC: ' + perc);

            var rect = new Kinetic.Rect({
                x: w,
                y: 0,
                width: perc * initialWidth,
                height: 20,
                fill: "#F8F8F8",
                stroke: "#D8D8D8",
                strokeWidth: 1
            });
            rect.pos_ind = i;
            o.data('rects').push(rect);

            var text = new Kinetic.Text({
                x: rect.getX() + rect.getWidth() - 10,
                y: rect.getY() + 1,
                text: 'x',
                fontSize: 10,
                fontFamily: 'Helvetica, sans-serif',
                fill: '#FF0000',
                width: 10,
                padding: 0,
                align: 'center'
            });
            text.pos_ind = i;
            o.data('delete_buttons').push(text);

            var text2 = new Kinetic.Text({
                x: rect.getX() + rect.getWidth() - 10,
                y: rect.getY() + 9,
                text: '+',
                fontSize: 10,
                fontFamily: 'Helvetica, sans-serif',
                fill: '#666',
                width: 10,
                padding: 0,
                align: 'center'
            });
            text2.pos_ind = i;
            o.data('add_buttons').push(text2);

            w += (perc * initialWidth) + controlSize;
        }

        w = controlSize;
        var current_width = 0;
        for(var i = 1; i < o.data('data').length; i++)
        {
            w += o.data('rects')[i - 1].getWidth();
            current_width += o.data('rects')[i - 1].getWidth();
            var rect = new Kinetic.Rect({
                x: w,
                y: 0,
                width: controlSize,
                height: 20,
                fill: "#54BC00",
                stroke: "#54BC00",
                strokeWidth: 1
            });
            rect.pos_ind = i - 1;
            o.data('controls').push(rect);

            var text = new Kinetic.Text({
                x: rect.getX(),
                y: rect.getY(),
                text: Math.round((current_width / initialWidth) * (o.data('max') - o.data('min'))) + parseInt(o.data('min')),
                fontSize: 12,
                fontFamily: 'Helvetica, sans-serif',
                fill: '#FFF',
                width: rect.getWidth(),
                padding: 5,
                align: 'center'
            });
            text.pos_ind = i - 1;
            o.data('control_labels').push(text);

            w += controlSize;
        }
        
        var highlighter = new Kinetic.Rect({
            x: 0,
            y: 10,
            width: controlSize,
            height: 13,
            fill: "#222",
            stroke: "#222",
            strokeWidth: 1
        });
        
        o.data('layer').add(highlighter);

        var min = new Kinetic.Shape({
            drawFunc: function(canvas) {
                var context = canvas.getContext();
                var radius = 5;
                var pivot = controlSize - 15;
                context.beginPath();
                context.moveTo(controlSize, 0);
                context.lineTo(controlSize, pivot);
                context.lineTo(radius, pivot);
                context.quadraticCurveTo(0, pivot, 0, pivot - radius);
                context.lineTo(0, radius);
                context.quadraticCurveTo(0, 0, radius, 0);
                context.lineTo(controlSize, 0);
                context.closePath();
                // KineticJS specific context method
                canvas.fillStroke(this);
            },
            fill: "#54BC00",
            stroke: "#54BC00",
            strokeWidth: 1
        });

        var min_text = new Kinetic.Text({
            x: 0,
            y: 0,
            text: o.data('min'),
            fontSize: 12,
            fontFamily: 'Helvetica, sans-serif',
            fill: '#FFF',
            width: controlSize,
            padding: 5,
            align: 'center'
        });
        o.data('min_text', min_text);

        var max_x = width - controlSize;
        var max = new Kinetic.Shape({
            drawFunc: function(canvas) {
                var context = canvas.getContext();
                var radius = 5;
                var pivot = controlSize - 15;
                var x = max_x;
                context.beginPath();
                context.moveTo(x, 0);
                context.lineTo(x, pivot);
                context.lineTo(x + controlSize - radius, pivot);
                context.quadraticCurveTo(x + controlSize, pivot, x + controlSize, pivot - radius);
                context.lineTo(x + controlSize, radius);
                context.quadraticCurveTo(x + controlSize, 0, x + controlSize - radius, 0);
                context.lineTo(x, 0);
                context.closePath();
                // KineticJS specific context method
                canvas.fillStroke(this);
            },
            fill: "#54BC00",
            stroke: "#54BC00",
            strokeWidth: 1
        });

        var max_text = new Kinetic.Text({
            x: max_x,
            y: 0,
            text: o.data('max'),
            fontSize: 12,
            fontFamily: 'Helvetica, sans-serif',
            fill: '#FFF',
            width: 35,
            padding: 5,
            align: 'center'
        });
        o.data('max_text', max_text);


        for(var i = 0; i < o.data('rects').length; i++)
        {

            o.data('layer').add(o.data('rects')[i]);
            o.data('layer').add(o.data('add_buttons')[i]);
            o.data('layer').add(o.data('delete_buttons')[i]);

        }

        o.data('layer').add(min);
        o.data('layer').add(o.data('min_text'));
        o.data('layer').add(max);
        o.data('layer').add(o.data('max_text'));

        o.data('TN', null);
        o.data('last_x', 0);
        for(var i = 0; i < o.data('controls').length; i++)
        {
            o.data('layer').add(o.data('controls')[i]);
            o.data('layer').add(o.data('control_labels')[i]);

            o.data('control_labels')[i].on('mousedown', control_labels_mousedown);
            o.data('control_labels')[i].on('mouseup', control_labels_mouseup);
            o.data('control_labels')[i].on('mouseover', control_labels_mouseover);
            o.data('control_labels')[i].on('mouseout', control_labels_mouseout);
        }

        var arrow = new Kinetic.RegularPolygon({
            x: 50,
            y: 23,
            sides: 3,
            radius: 6,
            fill: '#888',
        });
        o.data('layer').add(arrow);
        arrow.hide();

        for(var i = 0; i < o.data('rects').length; i++)
        {
            o.data('rects')[i].on('mouseover', rect_mouseover);
            o.data('delete_buttons')[i].on('click', remove);
            o.data('add_buttons')[i].on('click', add);
        }

        o.data('stage').on('mousemove', function()
        {
            if(o.data('TN') != null)
            {
                var mousePos = o.data('stage').getMousePosition();
                var diff = mousePos.x - o.data('last_x');

                if((diff > 0 && o.data('rects')[o.data('rects').length - 1].getWidth() >= 10) || (diff < 0 && o.data('rects')[o.data('TN').pos_ind].getWidth() >= 10))
                {
                    o.data('rects')[o.data('TN').pos_ind].setWidth(o.data('rects')[o.data('TN').pos_ind].getWidth() + diff);
                    o.data('rects')[o.data('TN').pos_ind + 1].setWidth(o.data('rects')[o.data('TN').pos_ind + 1].getWidth() - diff);
                    o.data('rects')[o.data('TN').pos_ind + 1].setX(o.data('rects')[o.data('TN').pos_ind + 1].getX() + diff);
                    o.data('controls')[o.data('TN').pos_ind].setX(o.data('controls')[o.data('TN').pos_ind].getX() + diff);
                    o.data('control_labels')[o.data('TN').pos_ind].setX(o.data('control_labels')[o.data('TN').pos_ind].getX() + diff);

                    //for(var i = o.data('TN').pos_ind + 1; i < o.data('rects').length; i++)
                    //{
                    //    o.data('rects')[i].setX(o.data('rects')[i].getX() + diff);
                    //}
                    //for(var i = o.data('TN').pos_ind; i < o.data('controls').length; i++)
                    //{
                    //    o.data('controls')[i].setX(o.data('controls')[i].getX() + diff);
                    //    o.data('control_labels')[i].setX(o.data('control_labels')[i].getX() + diff);
                    //}
                    for(var i = 0; i < o.data('control_labels').length; i++)
                    {
                        var width = 0;
                        var totalWidth = 0;
                        for(var k = 0; k < o.data('rects').length; k++)
                        {
                            if(k <= i)
                                width += o.data('rects')[k].getWidth();
                            totalWidth += o.data('rects')[k].getWidth();
                        }
                        var val = Math.round((width / totalWidth)  * (o.data('max') - o.data('min'))) + parseInt(o.data('min'));
                        o.data('control_labels')[i].setText(val);
                    }
                    for(var i = 0 ; i < o.data('delete_buttons').length; i++)
                    {
                        o.data('add_buttons')[i].setX(o.data('rects')[i].getX() + o.data('rects')[i].getWidth() - 10);
                        o.data('delete_buttons')[i].setX(o.data('rects')[i].getX() + o.data('rects')[i].getWidth() - 10);
                    }
                    
                    if(o.data('current_rect') != 0)
                    {
                        var x = (o.data('rects')[o.data('current_rect') - 1].getX() + (o.data('rects')[o.data('current_rect') - 1].getWidth() / 2) - 60);
                        if(x < 0)
                            x = 0;
                        else if(x > (o.data('width') - 120))
                            x = (o.data('width') - 120);
                        arrow.setX(o.data('rects')[o.data('current_rect') - 1].getX() + (o.data('rects')[o.data('current_rect') - 1].getWidth() / 2.0));
                        label_editor_container.style.marginLeft = x+'px';
                        highlighter.setX(o.data('rects')[o.data('current_rect') - 1].getX());
                        highlighter.setWidth(o.data('rects')[o.data('current_rect') - 1].getWidth() + controlSize);
                    }
                    else
                    {
                        highlighter.setX(0);
                        highlighter.setWidth(controlSize);
                    }
                        

                    

                    o.data('last_x', mousePos.x);

                    o.data('layer').draw();
                }
            }
        });
        o.data('stage').on('mouseup', function()
        {
            o.data('TN', null);
        });

        label_editor.onkeyup = function(evt)
        {
            o.data('texts')[o.data('current_rect')] = label_editor.value;
        };

        label_close_button.onclick = function(evt)
        {
            arrow.hide();
            container.children[1].style.display = 'none';
            o.data('layer').draw();
        }
    
        function control_labels_mousedown(evt) 
        {
            o.data('TN', evt.targetNode);
            o.data('last_x', o.data('stage').getMousePosition().x);
        }
        function control_labels_mouseup() 
        {
            o.data('TN', null);
        }
        function control_labels_mouseover () 
        {
            document.body.style.cursor = 'pointer';
        }
        function control_labels_mouseout ()            
        {
            document.body.style.cursor = 'default';
        }
        
        function min_mouseover(evt)
        {
            arrow.setX(evt.targetNode.getX() + (evt.targetNode.getWidth() / 2));
            arrow.show();
            highlighter.show();
            highlighter.setX(0);
            highlighter.setWidth(evt.targetNode.getWidth());
            container.children[1].style.marginLeft = '0px';
            container.children[1].style.display = 'block';
            label_editor.value = o.data('texts')[0];
            o.data('current_rect',  0);
            o.data('layer').draw();
        }
        o.data('min_text').on('mouseover', min_mouseover);

        function rect_mouseover(evt)
        {
            arrow.setX(evt.targetNode.getX() + (evt.targetNode.getWidth() / 2));
            arrow.show();
            highlighter.show();
            highlighter.setX(evt.targetNode.getX());
            highlighter.setWidth(evt.targetNode.getWidth() + controlSize);
            var x = (evt.targetNode.getX() + (evt.targetNode.getWidth() / 2) - 60);
            if(x < 0)
                x = 0;
            else if(x > (o.data('width') - 120))
                x = (o.data('width') - 120);
            container.children[1].style.marginLeft = x+'px';
            container.children[1].style.display = 'block';
            label_editor.value = o.data('texts')[evt.targetNode.pos_ind];
            o.data('current_rect',  evt.targetNode.pos_ind);
            o.data('layer').draw();
            console.log('yo');
        }

        function add(evt)
        {
            var newWidth = controlSize + 30;
            var widthToRemove = Math.round(newWidth / o.data("rects").length);
            var i = evt.targetNode.pos_ind;

            for(var k = 0 ; k < o.data("rects").length; k++)
            {

                o.data("rects")[k].setWidth(o.data("rects")[k].getWidth() - widthToRemove);


            }

            o.data("texts").splice(i + 1, 0, "Range " + (o.data("rects").length + 2));

            var rect = new Kinetic.Rect({
                x: 35 + (185 * i),
                y: 0,
                width: 30,
                height: 20,
                fill: "#F8F8F8",
                stroke: "#D8D8D8",
                strokeWidth: 1
            });
            rect.pos_ind = i + 1;
            o.data("rects").splice(i, 0, rect);

            var text = new Kinetic.Text({
                x: rect.getX() + rect.getWidth() - 10,
                y: rect.getY() + 1,
                text: 'x',
                fontSize: 10,
                fontFamily: 'Helvetica, sans-serif',
                fill: '#FF0000',
                width: 10,
                padding: 0,
                align: 'center'
            });
            text.pos_ind = i + 1;
            o.data("delete_buttons").splice(i, 0, text);

            var text2 = new Kinetic.Text({
                x: rect.getX() + rect.getWidth() - 10,
                y: rect.getY() + 9,
                text: '+',
                fontSize: 10,
                fontFamily: 'Helvetica, sans-serif',
                fill: '#666',
                width: 10,
                padding: 0,
                align: 'center'
            });
            text2.pos_ind = i + 1;
            o.data("add_buttons").splice(i, 0, text2);

            var rect2 = new Kinetic.Rect({
                x: 35 + (i * 185) - 30,
                y: 0,
                width: 35,
                height: 20,
                fill: "#54BC00",
                stroke: "#54BC00",
                strokeWidth: 1
            });
            rect2.pos_ind = i;
            o.data("controls").splice(i, 0, rect2);

            var text3 = new Kinetic.Text({
                x: rect2.getX(),
                y: rect2.getY(),
                text: '25',
                fontSize: 12,
                fontFamily: 'Helvetica, sans-serif',
                fill: '#FFF',
                width: rect2.getWidth(),
                padding: 5,
                align: 'center'
            });
            text3.pos_ind = i;
            o.data("control_labels").splice(i, 0, text3);

            text3.on('mousedown', control_labels_mousedown);
            text3.on('mouseup', control_labels_mouseup);
            text3.on('mouseover', control_labels_mouseover);
            text3.on('mouseout', control_labels_mouseout);

            rect.on('mouseover', rect_mouseover);
            text.on('click', remove);
            text2.on('click', add);

            o.data('layer').add(rect);
            o.data('layer').add(text);
            o.data('layer').add(text2);
            o.data('layer').add(rect2);
            o.data('layer').add(text3);

            for(var k = i + 1; k < o.data("rects").length; k++)
            {
                o.data("rects")[k].pos_ind += 1;
                o.data("delete_buttons")[k].pos_ind += 1;
                o.data("add_buttons")[k].pos_ind += 1;
            }
            for(var k = i + 1; k < o.data("controls").length; k++)
            {
                o.data("controls")[k].pos_ind += 1;
                o.data("control_labels")[k].pos_ind += 1;
            }



            var w = 35;
            for(var k = 0 ; k < o.data("rects").length; k++)
            {

                o.data("rects")[k].setX(w);
                w += o.data("rects")[k].getWidth() + 35;
            }
            w = 35;
            for(var k = 0 ; k < o.data("controls").length; k++)
            {
                w += o.data("rects")[k].getWidth();
                o.data("controls")[k].setX(w);
                o.data("control_labels")[k].setX(w);
                w += 35;
            }

            o.data("rects")[o.data("rects").length - 1].setWidth(max_text.getX() - o.data("rects")[o.data("rects").length - 1].getX());

            for(var i = 0 ; i < o.data('delete_buttons').length; i++)
            {
                o.data("add_buttons")[i].setX(o.data("rects")[i].getX() + o.data("rects")[i].getWidth() - 10);
                o.data("delete_buttons")[i].setX(o.data("rects")[i].getX() + o.data("rects")[i].getWidth() - 10);
            }

            var total_width = 0;
            for(var i = 0; i < o.data('rects').length; i++)
            {
                total_width += o.data('rects')[i].getWidth();
            }
            var width = 0;
            for(var i = 0; i < o.data('control_labels').length; i++)
            {
                width += o.data('rects')[i].getWidth();
                var val = Math.round(((width / total_width) * (o.data('max') - o.data('min'))) + parseInt(o.data('min')));
                o.data('control_labels')[i].setText(val);
            }
            
            for(var p = 0; p < o.data('delete_buttons').length; p++)
            {
                o.data('delete_buttons')[p].show();
            }

            arrow.remove();
            o.data('layer').add(arrow);
            
            arrow.hide();
            container.children[1].style.display = 'none';
            highlighter.hide();

            o.data('layer').draw();
        }
        function remove(evt)
        {
            var i = evt.targetNode.pos_ind;

            if(i == 0)
            {
                o.data('rects')[i + 1].setX(o.data('rects')[i + 1].getX() - o.data('rects')[i].getWidth() - o.data('controls')[i].getWidth());
                o.data('rects')[i + 1].setWidth(o.data('rects')[i + 1].getWidth() + o.data('rects')[i].getWidth() + o.data('controls')[i].getWidth());
            }
            else if( i == o.data('rects').length - 1)
            {
                o.data('rects')[i - 1].setWidth(o.data('rects')[i - 1].getWidth() + o.data('rects')[i].getWidth() + o.data('controls')[i - 1].getWidth());
                o.data('delete_buttons')[i - 1].setX(o.data('rects')[i - 1].getX() + o.data('rects')[i - 1].getWidth() - 10);
                o.data('add_buttons')[i - 1].setX(o.data('rects')[i - 1].getX() + o.data('rects')[i - 1].getWidth() - 10);
            }
            else
            {
                o.data('control_labels')[i - 1].setText(o.data('control_labels')[i].getText());
                o.data('rects')[i - 1].setWidth(o.data('rects')[i - 1].getWidth() + o.data('rects')[i].getWidth() + o.data('controls')[i - 1].getWidth());
                o.data('controls')[i - 1].setX(o.data('rects')[i - 1].getX() + o.data('rects')[i - 1].getWidth());
                o.data('control_labels')[i - 1].setX(o.data('rects')[i - 1].getX() + o.data('rects')[i - 1].getWidth());
                o.data('delete_buttons')[i - 1].setX(o.data('rects')[i - 1].getX() + o.data('rects')[i - 1].getWidth() - 10);
                o.data('add_buttons')[i - 1].setX(o.data('rects')[i - 1].getX() + o.data('rects')[i - 1].getWidth() - 10);
            }

            for(var k = i + 1; k < o.data('rects').length; k++)
            {
                o.data('rects')[k].pos_ind -= 1;
                o.data('delete_buttons')[k].pos_ind -= 1;
                o.data('add_buttons')[k].pos_ind -= 1;
                if(k < o.data('controls').length)
                {
                    o.data('controls').pos_ind -= 1;
                    o.data('control_labels')[k].pos_ind -= 1;
                }
            }

            if(o.data('rects').length < 2)
            {
                for(var p = 0; p < o.data('delete_buttons').length; p++)
                {
                    o.data('delete_buttons')[p].hide();
                }
            }

            o.data('rects')[i].remove();
            o.data('delete_buttons')[i].remove();
            o.data('add_buttons')[i].remove();
            if(i - 1 < o.data('controls').length && i == o.data('rects').length - 1)
            {
                o.data('controls')[i - 1].remove();
                o.data('control_labels')[i - 1].remove();
            }
            else if(i < o.data('controls').length && i < o.data('rects').length - 1)
            {
                o.data('controls')[i].remove();
                o.data('control_labels')[i].remove();
            }

            arrow.hide();
            container.children[1].style.display = 'none';
            highlighter.hide();
            
            o.data('layer').draw();

            o.data('rects').splice(i, 1);
            o.data('delete_buttons').splice(i, 1);
            o.data('add_buttons').splice(i, 1);
            o.data('texts').splice(i, 1);
            if(i < o.data('controls').length)
            {
                o.data('controls').splice(i, 1);
                o.data('control_labels').splice(i, 1);
            }
        }
        
        if(o.data('rects').length < 2)
        {
            console.log(o.data('rects').length);
            for(var p = 0; p < o.data('delete_buttons').length; p++)
            {
                o.data('delete_buttons')[p].hide();
            }
        }

        o.data('stage').add(o.data('layer'));
    };
    o.reload();
    
    o.setMin = function(min) 
    {
        var max = o.data('max');
        o.data('min', min);
        o.data('min_text').setText(min);

        var total_width = 0;
        for(var i = 0; i < o.data('rects').length; i++)
        {
            total_width += o.data('rects')[i].getWidth();
        }
        var width = 0;
        for(var i = 0; i < o.data('control_labels').length; i++)
        {
            width += o.data('rects')[i].getWidth();
            var val = Math.round((width / total_width) * (max - min)) + parseInt(min);
            o.data('control_labels')[i].setText(val);
        }

        o.data('layer').draw();
    };
    
    o.setMax = function(max) 
    {
        var min = o.data('min');
        o.data('max', max);
        o.data('max_text').setText(max);

        var total_width = 0;
        for(var i = 0; i < o.data('rects').length; i++)
        {
            total_width += o.data('rects')[i].getWidth();
        }
        var width = 0;
        for(var i = 0; i < o.data('control_labels').length; i++)
        {
            width += o.data('rects')[i].getWidth();
            var val = Math.round((width / total_width) * (max - min)) + parseInt(min);
            o.data('control_labels')[i].setText(val);
        }

        o.data('layer').draw();
    };
    
    o.get = function() 
    {
        var min = o.data('min');
        var max = o.data('max');
        console.log("MIN: " + min);
        console.log("MAX: " + max);
        var result = [];

        var total_width = 0;
        for(var i = 0; i < o.data('rects').length; i++)
        {
            total_width += o.data('rects')[i].getWidth();
        }
        var width = 0;
        result.push({value: min, label: o.data('texts')[0]});
        for(var i = 0; i < o.data('control_labels').length; i++)
        {
            width += o.data('rects')[i].getWidth();
            var val = Math.round((width / total_width) * (max - min)) + parseInt(min);

            result.push({value: val, label: o.data('texts')[i + 1]});
        }

        return result;

    };
    
    o.setData = function(data)
    {
        if(data.length > 0)
            o.data('data', data);
        else
            o.data('data', [{value: o.data('min'), label: 'Range 1'}, {value: o.data('max'), label: 'Range 2'}]);
        o.reload();
    }
    
    return o;
    
};

/*
$.fn.H2MRangeSetMin = function(min) 
{
    var o = $(this[0]);
    var max = o.data('max');
    o.data('min', min);
    o.data('min_text').setText(min);
    
    var total_width = 0;
    for(var i = 0; i < o.data('rects').length; i++)
    {
        total_width += o.data('rects')[i].getWidth();
    }
    var width = 0;
    for(var i = 0; i < o.data('control_labels').length; i++)
    {
        width += o.data('rects')[i].getWidth();
        var val = Math.round((width / total_width) * (max - min)) + min;
        o.data('control_labels')[i].setText(val);
    }
    
    o.data('layer').draw();
};

$.fn.H2MRangeSetMax = function(max) 
{
    var o = $(this[0]);
    var min = o.data('min');
    o.data('max', max);
    o.data('max_text').setText(max);
    
    var total_width = 0;
    for(var i = 0; i < o.data('rects').length; i++)
    {
        total_width += o.data('rects')[i].getWidth();
    }
    var width = 0;
    for(var i = 0; i < o.data('control_labels').length; i++)
    {
        width += o.data('rects')[i].getWidth();
        var val = Math.round((width / total_width) * (max - min)) + min;
        o.data('control_labels')[i].setText(val);
    }
    
    o.data('layer').draw();
};

$.fn.H2MRangeGet = function() 
{
    var o = $(this[0]);
    var min = o.data('min');
    var max = o.data('max');
    var result = [];
    
    var total_width = 0;
    for(var i = 0; i < o.data('rects').length; i++)
    {
        total_width += o.data('rects')[i].getWidth();
    }
    var width = 0;
    for(var i = 0; i < o.data('control_labels').length; i++)
    {
        width += o.data('rects')[i].getWidth();
        var val = Math.round((width / total_width) * (max - min)) + min;
        
        result.push({value: val, label: o.data('texts')[i]});
    }
    
    result.push({value: max, label: o.data('texts')[o.data('texts').length - 1]});
    
    return result
    
};
*/