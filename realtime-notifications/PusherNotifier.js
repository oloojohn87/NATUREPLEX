function PusherNotifier(channel, options) {
  
  //options = options || {};
  
 /* options= {
				before_open: function(){
					alert('I am called before it opens');
				},
				// (function | optional) function called after it opens
				after_open: function(e){
					alert("I am called after it opens: \nI am passed the jQuery object for the created Gritter element...\n" + e);
				},
				// (function | optional) function called before it closes
				before_close: function(e, manual_close){
                    var manually = (manual_close) ? 'The "X" was clicked to close me!' : '';
					alert("I am called before it closes: I am passed the jQuery object for the Gritter element... \n" + manually);
				},
				// (function | optional) function called after it closes
				after_close: function(e, manual_close){
                    var manually = (manual_close) ? 'The "X" was clicked to close me!' : '';
					alert('I am called after it closes. ' + manually);
				}
  };*/
  
  this.settings = {
    eventName: 'notification',
    title: 'Notification',
    titleEventProperty: null, // if set the 'title' will not be used and the title will be taken from the event
    image: 'images/Icono_H2M.png',
    eventTextProperty: 'message',
    gritterOptions: {
	
			before_open: function(){
					
					var notify_num=parseInt($('#notificaton_num').text());
					notify_num=notify_num+1;
					//var notify_num=78;
					$('#notificaton_num').text(notify_num);
					$('#notificaton_num').show();
					$('#notification_triangle').show();
					
					
					setTimeout(function(){
						$('#newinbox').trigger('click');},1000);
				},
				after_open:function(){
					
					var currentURL = window.location.href;
					if(currentURL.indexOf("PatientNetwork") != -1)
					{
						setInterval(function(){$('#gritter-notice-wrapper').fadeOut("slow");},3000);
					}
				},
				
				
				// (function | optional) function called after it opens
				/*after_open: function(e){
					alert("I am called after it opens: \nI am passed the jQuery object for the created Gritter element...\n" + e);
				},
				// (function | optional) function called before it closes
				before_close: function(e, manual_close){
                    var manually = (manual_close) ? 'The "X" was clicked to close me!' : '';
					alert("I am called before it closes: I am passed the jQuery object for the Gritter element... \n" + manually);
				},*/
				// (function | optional) function called after it closes
				after_close: function(){
                   var notify_num=parseInt($('#notificaton_num').text());
				   if(notify_num){
						notify_num=notify_num-1;
						//alert(notify_num);
						if(!notify_num){
						$('#notificaton_num').text(0);
						$('#notificaton_num').hide();
						$('#notification_triangle').hide();
						}
					    $('#notificaton_num').text(notify_num);
					    $('#notificaton_num').show();
					    $('#notification_triangle').show();
					}else{
					$('#notificaton_num').text(0);
					$('#notificaton_num').hide();
					$('#notification_triangle').hide();
					}
					var currentURL = window.location.href;
					if(currentURL.indexOf("PatientNetwork") != -1)
					{
						//do nothing
						
						
					}
					else
					{
						window.location.reload(true);
					}
				}
	}
  };
  
  /*this.settings = {
  gritterOptions: options
  };*/
  //$.extend(this.settings, options);
  
  var self = this;
  channel.bind(this.settings.eventName, function(data){ self._handleNotification(data); });
};
PusherNotifier.prototype._handleNotification = function(data) {
  var gritterOptions = {
				title: (this.settings.titleEventProperty? data[this.settings.titleEventProperty] : this.settings.title),
				text: data[this.settings.eventTextProperty].replace(/\\/g, ''),
				image: this.settings.image,
				sticky: true,
				
  };
  
  $.extend(gritterOptions, this.settings.gritterOptions);
  
  $.gritter.add(gritterOptions);
};