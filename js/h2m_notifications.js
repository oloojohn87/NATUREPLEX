var h2m_notifications_definitions = {
    NEWREF: {title: 'New Referral(s)', icon: 'icon-share-alt', color: '#54BC00'},
    REFCNG: {title: 'Referral Change(s)', icon: 'icon-share-alt', color: '#357800'},
    NEWMES: {title: 'New Message(s)', icon: 'icon-envelope-alt', color: '#FFC23B'},
    REPUPL: {title: 'Report Upload(s)', icon: 'icon-arrow-up', color: '#22AEFF'},
    SUMEDT: {title: 'Summary Edit(s)', icon: 'icon-pencil', color: '#6B02C0'},
    NEWPRB: {title: 'New Probe(s)', icon: 'icon-signal', color: '#C900B3'},
    PRBALR: {title: 'Probe Alert(s)', icon: 'icon-exclamation', color: '#89150B'},
    NEWAPP: {title: 'New Appointment(s)', icon: 'icon-calendar-empty', color: '#00C9AB'},
    APPUPD: {title: 'Appointment(s) Updated', icon: 'icon-calendar-empty', color: '#6781CD'},
    APPCNL: {title: 'Appointment(s) Canceled', icon: 'icon-calendar-empty', color: '#E12313'},
    REVREQ: {title: 'Review Request(s)', icon: 'icon-folder-open', color: '#555'},
    SNDREQ: {title: 'Send Request(s)', icon: 'icon-briefcase', color: '#000'},
    MEDALR: {title: 'Medication Alert(s)', icon: 'icon-bell', color: '#E67566'}
};

function h2m_notification_action(id, type, receiver, sender, is_receiver_doctor, is_sender_doctor, auxilary, scope)
{
    console.log('SCOPE: ' + scope);
    if(type == 'NEWREF' || type == 'REFCNG')
    {
        window.location.href = 'patientdetailMED-new.php?IdUsu='+auxilary;
    }
    else if(type == 'REPUPL' || type == 'SNDREQ')
    {
        if(is_receiver_doctor == 1)
        {
            //if(is_sender_doctor == 1) window.location.href = 'patientdetailMED-new.php?IdUsu='+auxilary;
            window.location.href = 'patientdetailMED-new.php?IdUsu='+sender;
        }
        else
        {
            window.location.href = 'patientdetailMED-new.php?IdUsu='+receiver;
        }
    }
    else if(type == 'SUMEDT')
    {
        if(is_receiver_doctor == 1)
        {
            window.location.href = 'patientdetailMED-new.php?IdUsu='+sender+'&OPENMODAL=1';
        }
        else
        {
            window.location.href = 'patientdetailMED-new.php?IdUsu='+receiver+'&OPENMODAL=1';
        }
    }
    else if(type == 'MEDALR')
    {
        if(is_receiver_doctor == 1)
        {
            window.location.href = 'patientdetailMED-new.php?IdUsu='+sender+'&OPENMEDMODAL=1';
        }
        else
        {
            window.location.href = 'patientdetailMED-new.php?IdUsu='+receiver+'&OPENMEDMODAL=1';
        }
    }
    else if(type == 'NEWMES')
    {
        if(is_receiver_doctor == 1)
        {
            if(is_sender_doctor == 1)
                window.location.href = 'Messages.php?isDoctors=1&id=' + auxilary;
            else
                window.location.href = 'Messages.php?isDoctors=0&id=' + auxilary;
        }
        else
        {
            if($("#personal_doctor_messages_button").length)
            {
                $("#personal_doctor_messages_button").trigger('click');
                console.log("div[data-id='"+auxilary+"']");
                setTimeout(function(){
                    $("div[data-id='"+auxilary+"']").children('button').eq(0).trigger('click');
                }, 1000);
            }
        }
    }
    else if(type == 'PRBALR')
    {
        window.location.href = 'PatientNetwork.php?LOADPATIENT='+sender;
    }
    /*else if (type == 'NEWAPP' && scope == 'CATAPULT')
    {
        if(is_receiver_doctor == 1)
            window.location.href = '../../../../catapult_telemedicine/catapult_telemed_med.php?doc_id=' + receiver + '&pat_id=' + sender;
        else
            window.location.href = '../../../../catapult_telemedicine/catapult_telemed_med.php?doc_id=' + sender + '&pat_id=' + receiver;
	}*/

}

$.fn.h2m_notifications = function(dictionary) 
{
    var o = $(this[0]);
    var o_id = o.attr('id');
    
    var type = dictionary.type;
    var user = 0;
    if(type == 'PAT')
        user = dictionary.patient;
    else
        user = dictionary.doctor;
    
    var scope = 'H2M';
    if(dictionary.hasOwnProperty('scope'))
    {
        scope = dictionary.scope;
    }
    o.data('scope', scope);
    
    $.post('load_notifications.php', {user: user, type: type}, function(data, status)
    {
        o.empty();
        o.html('<style> \
            .notification_button,.notification_expand_button{ \
                width: 15%; \
                height: 40px; \
                float: right; \
                outline: none; \
                border: 0px solid #FFF; \
                background-color: #BABABA; \
                color: #FFF; \
                font-size: 16px;\
            }\
            .notification_button:hover,.notification_expand_button:hover{\
                background-color:  #AAA; \
                cursor: pointer; \
            } \
            .notification_row,.notification_group{ \
                width: 98%; \
                height: 40px; \
                background-color: #FBFBFB; \
                border-radius: 5px; \
                border: 1px solid #E8E8E8; \
                margin: auto; \
                margin-bottom: 7px; \
                margin-top: 7px; \
                overflow: hidden; \
                font-family: Helvetica, sand-serif; \
            } \
            .notification_row_info,.notification_group_info{\
                background-color:  #FBFBFB; \
                cursor: default; \
            } \
            .notification_row_info:hover{\
                background-color:  #F7F7F7; \
                cursor: pointer; \
            } \
            #notifications a{ \
                color: inherit;\
                text-decoration: none;\
            }\
            .notification_box{ \
                width: 98%; \
                padding-top: 36px; \
                background-color: #FFF; \
                border-bottom-left-radius: 5px; \
                border-bottom-right-radius: 5px; \
                border: 1px solid #BBB; \
                margin: auto; \
                margin-bottom: 7px; \
                margin-top: -40px; \
                overflow: hidden; \
                font-family: Helvetica, sand-serif; \
                position: relative; \
                z-index: 1; \
             } \
        </style>');
        
        var notifications = {};
        var names = {};
        
        var info = JSON.parse(data);
        var res = info.notifications;
        var group = info.group;
        if(group == 0)
            groupBy = 'type';
        else if(group == 1)
            groupBy = 'user';
        for(var i = 0; i < res.length; i++)
        {
            var def = h2m_notifications_definitions[res[i].type];
            var html = '';
            var receiver = res[i].receiver;
            var sender= res[i].sender;
            var auxilary = 0;
            if(res[i].is_sender_doctor == 1)
                names[res[i].sender] = 'Dr. ' + res[i].doctor_sender;
            else
                names[res[i].sender] = res[i].user_sender;
            if(res[i].auxilary != null) {
                auxilary = res[i].auxilary;
                //CHECK THE APPUPD TIME AND THE CURRENT SYSTEM TIME TO DECIDE WHETHER RTO DELETE THE NOTIFICATION
                if(res[i].type == 'APPUPD') {
                    var auxDate = new Date(auxilary);
                    var d = new Date();
                    console.log('set time: '+auxDate);
                    console.log('current time: '+d);
                    if (auxDate <= d) {
                        $.post("dismissNotification.php", {id: res[i].id}, function() {});
                    }
                }
            }            
           
            if(res[i].type == 'NEWPRB'){
                html += '<div id="notification_'+(i + 1)+'" onclick="purchaseProbe();" class="notification_row">';
            }else{
                html += '<div id="notification_'+(i + 1)+'" class="notification_row">';
            }
            html += '<div id="notification_row_info_'+res[i].id+'_'+res[i].type+'_'+receiver+'_'+sender+'_'+res[i].is_receiver_doctor+'_'+res[i].is_sender_doctor+'_'+auxilary+'_'+scope+'" class="notification_row_info">';
            html += '<div style="width: 7%; height: 40px; background-color: '+def.color+'; color: #FFF; font-size: 22px; position: relative; text-align: center; margin-right: 1%; float: left;">';
            html += '<div style="width: 20px; height: 20px; padding-top: 8px; color: #FFF; text-align: center; margin: auto;">';
            html += '<i class="'+def.icon+'" style="margin-top: 10px;"></i>';
            html += '</div>';
            html += '</div>';
            html += '<div style="width: 68%; height: 40px; float: left; padding: 0px;">';
            html += '<div style="width: 100%; height: 22px; color: '+def.color+'; font-size: 16px; padding-top: 5px;">';
            html += res[i].message
            html += '</div>';
            html += '<div class="updated_label" style="width: 100%; height: 10px; color: #999; font-size: 10px; padding: 0px; margin-top: -6px;" lang="en">';
            html += moment(new Date(res[i].updated_timezone)).fromNow();
            html += '</div>';
            html += '</div>';
            html += '</div>';
            if(res[i].type != 'PRBALR' && res[i].type != 'APPUPD')
                html += '<button id="notificationsDismissButton_'+res[i].id+'_'+groupBy+'" class="notification_button"><span lang="en">Dismiss</span></button></div>';
            //o.append(html);

            if(groupBy == 'type')
            {
                if(!notifications.hasOwnProperty(res[i].type))
                {
                    notifications[res[i].type] = new Array(new Date(res[i].updated_timezone));
                    notifications[res[i].type].push(html);
                }
                else
                {
                    notifications[res[i].type].push(html);
                }
            }
            else if(groupBy == 'user')
            {
                if(!notifications.hasOwnProperty(res[i].sender))
                {
                    notifications[res[i].sender] = new Array(new Date(res[i].updated_timezone));
                    notifications[res[i].sender].push(html);
                }
                else
                {
                    notifications[res[i].sender].push(html);
                }
            }
        }
        
        for (var property in notifications) 
        {
            if (notifications.hasOwnProperty(property)) 
            {
                var def = null;
                if(groupBy == 'type')
                    def = h2m_notifications_definitions[property];
                var html = '';
                html += '<div id="'+property+'_row" class="notification_group" style="background-color: #F6F6F6; border: 1px solid #BBB; position: relative; z-index: 1;">';
                html += '<div class="notification_group_info">';
                if(groupBy == 'type')
                    html += '<div style="width: 7%; height: 40px; background-color: '+def.color+'; color: #FFF; font-size: 22px; position: relative; text-align: center; margin-right: 1%; float: left;">';
                else if(groupBy == 'user')
                {
                    var color = '#54BC00';
                    if(names[property].substr(0, 2) == 'Dr')
                        color = '#22AEFF';
                    html += '<div style="width: 7%; height: 40px; background-color: '+color+'; color: #FFF; font-size: 22px; position: relative; text-align: center; margin-right: 1%; float: left;">';
                }
                html += '<div style="width: 14px; height: 14px; border-radius: 14px; margin-left: 4px; margin-top: 3px; background-color: #FBFBFB; float: left; font-size: 10px; color: #777;">';
                html += '<div id="'+property+'_balloon" style="margin-top: -3px;">' + (notifications[property].length - 1) + '</div>';
                html += '</div>';
                html += '<div style="width: 20px; height: 20px; padding-top: 8px; color: #FFF; text-align: center; margin: auto;">';
                if(groupBy == 'type')
                    html += '<i class="'+def.icon+'" style="margin-top: 10px;"></i>';
                else if(groupBy == 'user')
                {
                    if(names[property].substr(0, 2) == 'Dr')
                        html += '<i class="icon-user-md" style="margin-top: 10px;"></i>';
                    else
                        html += '<i class="icon-user" style="margin-top: 10px;"></i>';
                }
                html += '</div>';
                html += '</div>';
                html += '<div style="width: 68%; height: 40px; float: left; padding: 0px;">';
                html += '<div style="width: 100%; height: 22px; color: #777; font-size: 16px; padding-top: 5px;">';
                if(groupBy == 'type')
                {
                    html += '<span lang="en">You have</span> <span id="'+property+'_count">' + (notifications[property].length - 1) + '</span>'; 
                    if(initial_language == "th") html += ' notificacion(es) de ';
                    html += ' <span style="color: '+def.color+'" lang="en">' + def.title + '</span>'; 
                    /*html += ' <span id="'+property+'_notification_label" lang="en">notification';
                    if(notifications[property].length - 1 > 1)
                        html += 's';
                    html += '</span>';*/
                }
                else if(groupBy == 'user')
                {
                    var color = '#54BC00';
                    if(names[property].substr(0, 2) == 'Dr')
                        color = '#22AEFF';
                    html += '<span lang="en">You have</span> <span id="'+property+'_count">' + (notifications[property].length - 1) + '</span>'; 
                    if(initial_language == "th") html += ' notificacion(es) de ';
                    /*html += ' <span id="'+property+'_notification_label" lang="en">notification';
                    if(notifications[property].length - 1 > 1)
                        html += 's';
                    html += '</span>';*/
                    html += ' from <span style="color:'+color+'" lang="en">' + names[property] + '</span>';
                }
                html += '</div>';
                html += '<div id="'+property+'_updated" style="width: 100%; height: 10px; color: #999; font-size: 10px; padding: 0px; margin-top: -6px;" lang="en">';
                html += moment(notifications[property][0]).fromNow();
                html += '</div>';
                html += '</div>';
                html += '</div>';
                html += '<button id="expand_'+property+'" data-on="0" class="notification_expand_button" style="background-color: #888; color: #FBFBFB;"><i class="icon-chevron-down"></i>&nbsp;&nbsp;<span lang="en">Expand</span></button></div>';
                o.append(html);
                
                html = '<div id="'+property+'" class="notification_box" style="display: none; position: relative; z-index: 0;">';
                for(var i = 1; i < notifications[property].length; i++)
                    html += notifications[property][i];
                html += '</div>';
                o.append(html);
            }
        }
    });
};

$(".notification_row_info").live('click', function()
{
    var info = $(this).attr("id").split('_');
    var id = info[3];
    var type = info[4];
    var receiver = info[5];
    var sender = info[6];   
    var is_receiver_doctor = info[7];
    var is_sender_doctor = info[8];
    var auxilary = info[9];
    var scope = info[10];
    
    var notification_row = $(this).parent();
    
    if(type != 'PRBALR' && type != 'APPUPD')
    {
        $.post("dismissNotification.php", {id: id}, function(data, status)
        {
            notification_row.slideUp(function()
            {
                notification_row.remove();
                h2m_notification_action(id, type, receiver, sender, is_receiver_doctor, is_sender_doctor, auxilary, scope);
            });
        });
    }
    else
    {
        if(type != 'APPUPD') {
            notification_row.slideUp(function()
            {
                notification_row.remove();
                h2m_notification_action(id, type, receiver, sender, is_receiver_doctor, is_sender_doctor, auxilary, scope);
            });
        }
    }
});

$('button[id^="notificationsDismissButton"]').live('click', function()
{
    var button = $(this).attr('id').split('_');
    var group = button[2];
    var notification_row = $(this).parent();
    var info = notification_row.children().eq(0).attr("id").split('_');
    var id = info[3];
    var type = info[4];
    var receiver = info[5];
    var sender = info[6];
    var auxilary = info[7];
    var is_receiver_doctor = info[8];
    var is_sender_doctor = info[9];
    
    var groupBy = type;
    if(group == 'user')
        groupBy = sender;
    
    console.log(type);
    $.post("dismissNotification.php", {id: id}, function(data, status)
    {
        notification_row.slideUp(function()
        {
            
            notification_row.remove();
            var update_value = $('#'+groupBy).children().length;
            if(update_value == 0)
            {
                $("#"+groupBy+'_row').slideUp();
                $("#"+groupBy).slideUp();
            }
            else
            {
                $("#"+groupBy+'_balloon').text(update_value);
                $("#"+groupBy+'_count').text(update_value);
                if(update_value == 1)
                    $("#"+groupBy+'_notification_label').text('notification');
                else
                    $("#"+groupBy+'_notification_label').text('notifications');

                var updated = $('#'+groupBy).children().eq(0).find('.updated_label').eq(0).text();
                $("#"+groupBy+'_updated').text(updated);
            }
        });
    });

});

$('.notification_expand_button').live('click', function()
{
    //console.log('hello');
    var id = $(this).attr('id').split('_')[1];
    if($(this).data('on') == 1)
    {
        var expand = 'Expand';
        if (initial_language == 'th') expand = 'Ampliar';
        $("#"+id).css('display', 'none');
        $(this).data('on', 0);
        $(this).html('<i class="icon-chevron-down"></i>&nbsp;&nbsp;<span lang="en">'+expand+'</span></button>');
        $(this).parent().css('border-bottom-left-radius', '5px');
        $(this).parent().css('border-bottom-right-radius', '5px');
    }
    else
    {
        var collapse = 'Collapse';
        if (initial_language == 'th') collapse = 'Cerrar';
        $("#"+id).css('display', 'block');
        $(this).data('on', 1);
        $(this).html('<i class="icon-chevron-up"></i>&nbsp;&nbsp;<span>'+collapse+'</span></button>');
        $(this).parent().css('border-bottom-left-radius', '0px');
        $(this).parent().css('border-bottom-right-radius', '0px');
    }

});

if(initial_language != 'en')
{
    $.get('jquery-lang-js-master/js/langpack/'+initial_language+'.json', function(data, status)
    {
        var json = data;
        $('*[lang^=\"en\"]').each(function()
        {
            $(this).attr('original_eng_text', $(this).text());
            if(json.token.hasOwnProperty($(this).text()))
            {
                $(this).text(json.token[$(this).text()]);
            }
            else if(json.token.hasOwnProperty($(this).html()))
            {
                $(this).html(json.token[$(this).html()]);
            }
            else if ($(this).prop('tagName') == 'INPUT' && $(this).prop('type') == 'submit' || $(this).prop('type') == 'button' && json.token.hasOwnProperty($(this).val()))
            {
                $(this).val(json.token[$(this).val()]);
            }
            else if ($(this).prop('tagName') == 'INPUT' && $(this).prop('type') == 'text' && json.token.hasOwnProperty($(this).attr('placeholder')))
                        {
                            $(this).attr('placeholder', (json.token[$(this).attr('placeholder')]));
                        }
        });
    });
}
