$(document).on("click", '.button_close_notif', function (e) {
    var selected_notif = $(this).parent().attr("id2");
    var selected_row_id = $(this).parent().attr("id");
    dismiss_notification (selected_notif, selected_row_id,'main_notif_container');   
});
    
function dismiss_notification (selected_notif, selected_row_id, element)
{
    $("#"+selected_row_id).hide(1000);   
    $.post("dismiss_notification.php", {notification_id: selected_notif}, function(data, status)
    {
        console.log('Dismissal Post:  '+data);
        console.log('Status:  '+status);
        
        var num_notifications = parseInt($("#main_notification_baloon").html());
        num_notifications--;
        if (num_notifications > 0){
            $("#main_notification_baloon").css('display','inline');
            $("#main_notification_baloon").html(num_notifications);
        }else  $("#main_notification_baloon").css('display','none');

        
    });


}
    
function get_notifications (id_member, element, minimized)
{
    // generate content for notifications
    $.post("get_member_notifications.php", {pat_id: id_member}, function(data, status)
    {
        console.log('Data received from get_member_notifications.php :');
        console.log(data);
        var d = JSON.parse(data);
        
        var count = Object.keys(d).length;
        
        $("#"+element).empty();
        for (var i = 0; i < count; i++)
        {
            var patient = id_member;
            var doctor = d[i].Id_Doctor;
            var doctorb = d[i].Id_Doctorb;
            var type = d[i].Type;
            var timestamp = d[i].Timestamp;
            var notification_id = d[i].notification_id;
            var app = 0;
            if(d[i].hasOwnProperty('appointment'))
            {
                app = d[i].appointment;
            }
            $("#"+element).H2M_PHS_Notification({order: i, doctor: doctor, doctorb: doctorb, patient: patient, minimized: 2, type: type, timestamp: timestamp, notification_id: notification_id, minimized: minimized, appointment: app});
        }

        $("#"+element).slideDown();
        if (count>0){
            $("#main_notification_baloon").css('display','inline');
            $("#main_notification_baloon").html(count);
        }else  $("#main_notification_baloon").css('display','none');
        
    });

}
  
          
$.fn.H2M_PHS_Notification = function(dictionary) 
{
    var o = $(this[0]);
    //o.empty();
    var order = dictionary.order;
    var minimized = dictionary.minimized;
    var id_patient = dictionary.patient;
    var id_doctor = dictionary.doctor;
    var id_doctorb = dictionary.doctorb;
    var notif_type = dictionary.type;
    var timestamp = dictionary.timestamp;
    var notification_id = dictionary.notification_id;
    var appointment = 0;
    if(dictionary.hasOwnProperty('appointment'))
    {
        appointment = dictionary.appointment;
    }
    // Assign values for minimization
    if (minimized == 0)
    {
        var switcher = '';
    }
    else
    {
        var switcher = 'minimized';
    }
    
    //Load Styles
    o.append('    <style> \
@font-face { \
    font-family: Lato; \
    src: url(fonts/Lato-Regular.ttf); \
} \
.verticalcenter{  \
    position: relative;  \
    top: 50%;  \
    -webkit-transform: translateY(-50%);  \
    -o-transform: translateY(-50%);  \
    transform: translateY(-50%);  \
}    \
.notif_container{  \
    margin:10px; \
    width: calc(100% - 20px); \
    height:50px; \
    border:1px solid #cacaca; \
    border-radius:5px; \
    background-color:whitesmoke; \
    z-index:2;  \
    float:left;  \
    overflow:hidden;  \
}    \
.notif_container.minimized{  \
    height:30px; \
    margin:3px; \
    width: calc(100% - 9px); \
}    \
.button_close_notif{  \
    float:right; \
    width:40px; \
    height:40px; \
    margin:5px; \
    border-radius:20px; \
    background-color:#bebebe; \
    color:white; \
    font-size:16px; \
    text-align:center; \
    font-family:Arial, sans-serif;  \
}   \
.button_close_notif.minimized{  \
    width:25px; \
    height:25px; \
    margin:3px; \
}   \
.button_close_notif:hover{   \
    background-color:#adadad;  \
    border-color: grey; \
    cursor: pointer; \
}  \
.notif_container_left{  \
    float:left; \
    width:90%; \
    height:50px;  \
}  \
.notif_container_left.minimized{  \
    width:80%; \
}  \
.notif_container:hover{  \
    cursor:pointer;  \
    background-color: white;  \
}   \
.notif_container:hover .label_type {   \
    color:#56c1ff;    \
}  \
.notif_container:hover .notif_leftarea {   \
    background-color:#56c1ff;    \
} \
.notif_container:hover .icon_left {  \
    color:#1E8BCA;   \
}   \
.notif_label{   \
    float:left; \
    margin-left:20px; \
    width:90%;  \
    font-family:"Lato"; \
}  \
.notif_label.minimized{   \
    width:45%;  \
    margin-left: 10px;  \
}  \
.label_dr{   \
    font-size:16px; \
    color: black; \
    line-height:16px; \
    margin-top:5px;  \
}  \
.label_dr.minimized{   \
    width: 33%; \
}  \
.label_type{  \
    font-size:14px; \
    color: #22aeff; \
    line-height:14px; \
 }  \
.label_type.minimized{  \
    margin-top: 3px; \
    width: 62%; \
}  \
.label_error{  \
    font-size:14px; \
    color: #D84840; \
    line-height:14px; \
 }  \
.label_error.minimized{  \
    margin-top: 3px; \
    width: 62%; \
}  \
.label_time{  \
    font-size:10px; \
    color: #bcbcbc; \
    line-height:10px; \
 }  \
.label_time.minimized{  \
    width: 45%; \
 }  \
.notif_leftarea{  \
    float:left; \
    width:50px; \
    height: 50px; \
    border:0px; \
    border-radius:4px; \
    border-top-right-radius:0px; \
    border-bottom-right-radius:0px; \
    background-color:#22aeff; \
    z-index:1; \
 } \
.notif_leftarea.minimized{  \
    width:30px; \
    height:30px; \
 } \
.icon_left{ \
    color:white; \
    font-size:30px; \
    text-align:center; \
}  \
.icon_left.minimized{ \
    font-size:20px; \
}  \
</style> \
');
    var special_color = '';
    switch(notif_type) {
        case 'upload':
                var notif_icon = 'fa-cloud-upload';
                var notif_text = 'New Report Uploaded';
                break;
        case 'view':
                var notif_icon = 'fa-check-square-o';
                var notif_text = 'Report Viewed';
                break;
        case 'refer':
                var notif_icon = 'fa-share-alt';
                var doctor_nameb = '';
                $.ajax({ url: 'getDoctorName.php?IdDoctor='+id_doctorb, async: false, success: function(data) { doctor_nameb = data;}});  
                var notif_text = 'You have been referred to '+doctor_nameb;
                break;
        case 'edit':
                var notif_icon = 'fa-edit';
                var notif_text = 'Summary Edited';
                break;
        case 'message':
                var notif_icon = 'fa-envelope-o';
                var notif_text = 'Message';
                break;
        case 'send':
                var notif_icon = 'fa-paper-plane-o';
                var notif_text = 'Information Sent';
                special_color = '#54bc00';
                break;
        case 'request':
                var notif_icon = 'fa-clipboard';
                var notif_text = 'Information Requested';
                special_color = '#54bc00';
                break;
        case 'appointment':
                var notif_icon = 'fa-calendar-o';
                var appointment_data = null;
                $.ajax({ url: 'get_appointments.php?id='+appointment, async: false, success: function(data, status) 
                { 
                    appointment_data = JSON.parse(data);
                }}); 
                if(appointment_data.formatted_specific_time.length > 0)
                {
                    var notif_text = 'New Appointment: '+appointment_data.formatted_date+' at '+appointment_data.formatted_specific_time;
                }
                else
                {
                    var notif_text = 'New Appointment: '+appointment_data.formatted_date+' between '+appointment_data.formatted_start_time+' and '+appointment_data.formatted_end_time;
                }
                special_color = '#54bc00';
                break;
            case 'appointment_deleted':
                var notif_icon = 'fa-calendar-o';
                var appointment_data = null;
                $.ajax({ url: 'get_appointments.php?id='+appointment, async: false, success: function(data, status) 
                { 
                    appointment_data = JSON.parse(data);
                }}); 
                if(appointment_data.formatted_specific_time.length > 0)
                {
                    var notif_text = 'Appointment Canceled: '+appointment_data.formatted_date+' at '+appointment_data.formatted_specific_time;
                }
                else
                {
                    var notif_text = 'Appointment Canceled: '+appointment_data.formatted_date+' between '+appointment_data.formatted_start_time+' and '+appointment_data.formatted_end_time;
                }
                special_color = '#D84840';
                break;
        default:
                var notif_icon = 'fa-exclamation-circle';
                var notif_text = 'Notification';
    }
    //Load Content 
    var doctor_name = '';
    $.ajax({ url: 'getDoctorName.php?IdDoctor='+id_doctor, async: false, success: function(data) { doctor_name = data;}});    
    if (doctor_name < ' ') doctor_name = 'Unknown Doctor';
     
    var notification_time =  moment(new Date(timestamp)).fromNow();
    console.log ('timestamp: '+timestamp);
    
    var label_type = 'label_type';
    if(notif_type == 'appointment_deleted')
    {
        label_type = 'label_error';
    }
     
    o.append('<div class="notif_container '+switcher+'" id="'+order+'" id2="'+notification_id+'"> \
            <div class="notif_leftarea '+switcher+'" style="background:'+special_color+';"><div class="verticalcenter icon_left '+switcher+'"><i class="fa '+notif_icon+'"></i></div></div> \
            <div class="notif_container_left '+switcher+'"> \
                <div class="notif_label '+switcher+' label_dr'+' '+switcher+'">'+doctor_name+'</div> \
                <div class="notif_label '+switcher+' '+label_type+' '+switcher+'">'+notif_text+'</div> \
                <div class="notif_label '+switcher+' label_time'+' '+switcher+'">'+notification_time+'</div> \
            </div> \
            <div class="button_close_notif '+switcher+'" ><div class="verticalcenter">X</div></div>');

    
}

