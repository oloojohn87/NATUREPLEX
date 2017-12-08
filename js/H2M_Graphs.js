       
    function drawKnob(component, gauge_color, max_data, value_data,label_data,icon_name, use_fa, show_label){
      if (use_fa == 1)  {   
            component.append( "<p id='GraphIcon"+component.attr('id')+"' style='width: 100%; position: absolute; top: 25%; font-family: Lato; font-size: 20px; color: rgba(34, 174, 255, 0.53); text-align:center;'><i class='fa fa-signal fa-2x'></i></p>" );}
        else{
            var size_icon = component.height() / 4;
            component.append( "<p id='GraphIcon"+component.attr('id')+"' style='width: 100%; position: absolute; top: 20%; font-family: Lato; font-size: 20px; color: rgba(34, 174, 255, 0.53); text-align:center;'><img src='images/icons/"+icon_name+".png' style='width: "+size_icon+"px; opacity: 0.5;'/></p>" );}
      if (show_label == 1) 
      {
          component.append( "<p id='GraphData"+component.attr('id')+"' style='width: 100%; position: absolute; top: 45%; font-family: Lato; font-size: 38px; color: #9b9b9b; text-align:center;'>"+value_data+"</p>" );
          component.append( "<p id='GraphLabel"+component.attr('id')+"' style='width: 100%; position: absolute; top: 60%; font-family: Lato; font-size: 18px; color: #bbbbbb; text-align:center;'>"+label_data+"</p>" );
      }else{
          component.append( "<p id='GraphData"+component.attr('id')+"' style='width: 100%; position: absolute; top: 45%; font-family: Lato; font-size: 45px; color: #9b9b9b; text-align:center;'>"+value_data+"</p>" );
      }
      component.append( "<canvas id='myCanvas"+component.attr('id')+"'></canvas>" );
    
      jQuery('#GraphIcon'+component.attr('id')).fitText();
      if (show_label == 1) 
      {
        jQuery('#GraphData'+component.attr('id')).fitText(0.6);
        jQuery('#GraphLabel'+component.attr('id')).fitText(1.0);
      }else{
        jQuery('#GraphData'+component.attr('id')).fitText(0.5);
       } 
      var maxGraph = max_data;
      var actualValue = value_data;    
        
      var canvas = document.getElementById('myCanvas'+component.attr('id'));
      fitToContainer(canvas);
      var context = canvas.getContext('2d');
      var x = canvas.width / 2;
      var y = canvas.height / 2;
      var radius = x - (0.25 * x);
      var startAngle = 0.6 * Math.PI;
      var endAngle = 2.40 * Math.PI;
     
      var gap = Math.PI / 6;    
      var totalArc = (2 * Math.PI) - (2 * gap);
      var startAngle = ((1/2) * Math.PI)+gap;
      var endAngle = ((5/2) * Math.PI)-gap;
      var counterClockwise = false;

      context.beginPath();
      context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
      context.lineWidth = (x/10) + 2;
      context.lineCap = 'round';

      // line color
      context.strokeStyle = '#d3d3d3';
      context.stroke();

      context.beginPath();
      context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
      context.lineWidth = (x/10);
      context.lineCap = 'round';

      // line color
      context.strokeStyle = '#ececec';
      context.stroke();
    
       
        
      endAngle = 0.80 * Math.PI;
      endAngle = ((1/2) * Math.PI)+ gap + (actualValue * totalArc / maxGraph);
        
      context.beginPath();
      context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
      context.lineWidth = (x/10) + 2;
      context.lineCap = 'round';

      // line color
      context.strokeStyle = gauge_color;
      context.stroke();
}
            
    function fitToContainer(canvas){
      canvas.style.width ='100%';
      canvas.style.height='100%';
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
}
        
   