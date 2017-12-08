  
var modal = (function(){
    var 
    method = {},
    $overlay,
    $modal,
    $header,
    $content,
    $footer,
    $close;

    // Append the HTML
    $overlay = $('<div id="overlay"></div>');
    $modal = $('<div id="modal"></div>');
    $header = $header = $('<div id="header"><input type="hidden" id="idpin"><span id="page_indicator">1 / 1</span><div id="delete_report"><img id="trashcan" alt="delete" src="../images/trashcan.png" width="20px" height="20px" /></div><div style="float:right;"><label lang="en" for="datepicker">Report Date</label> : <input type="date" id="datepicker"></div></div>');
    $content = $('<div id="content"></div>');
    $close = $('<a id="close" href="#">close</a>');

    $modal.hide();
    $overlay.hide();
    $modal.append($header, $content, $close);

    $(document).ready(function(){

        $('body').append($overlay, $modal);
        $(this).on('click', '#overlay', function() {
            modal.close();
        });
    });
    
    // Center the modal in the viewport
    method.center = function () {
        var top, left;

        top = Math.max($(window).height() - $modal.outerHeight(), 0) / 2;
        left = Math.max($(window).width() - $modal.outerWidth(), 0) / 2;

        $modal.css({
            top:top + $(window).scrollTop(), 
            left:left + $(window).scrollLeft()
        });
    };


    // Open the modal
    method.open = function (settings) {
        $('#datepicker').val('');
        $content.empty().append($header, settings.content, $footer);

        $modal.css({
            width: settings.width || 'auto', 
            height: settings.height || 'auto'
        });

        method.center();

        $(window).bind('resize.modal', method.center);

        $modal.show();
        $overlay.show();
    };


    // Close the modal
    method.close = function () {
        $modal.hide();
        $overlay.hide();
        $('#datepicker').val('');
        $('#idpin').val('');
        $content.empty();
        $(window).unbind('resize.modal');
    };
    
    $close.click(function(e){
        e.preventDefault();
        method.close();
    });

    return method;
}());


$(document).ready(function() {
    
    $(this).click(function(evt) {
        var target = $(evt.target);
        console.log(target);
    });
    
    $('.dropzone').on('click', '.thumbnail', function() {
        
        var dropzone, wrapper, arrows, container, reports, date_pos;
        dropzone = $(this).parents('.dropzone').clone().css({width: '750px', height: '850px', display: 'inline-block', padding: '0', border: 'none'});
        leftarrow = $('<div></div>').css({'margin-top':'340px'}).removeClass('arrow').attr('id', 'left-arrow');
        rightarrow = $('<div></div>').css({'margin-top':'340px'}).removeClass('arrow').attr('id','right-arrow');
        container = dropzone.find('.container').css({width: '600px', height: '790px', display: 'inline-block', 'margin-top': '30px'});
        reports = dropzone.find('.thumbnail').css({width: '580px', height: '780px', display: 'inline-block', 'background-size': 'cover'}).appendTo(container);
        dropzone.empty().append(leftarrow, container, rightarrow);

        reports.each(function() {
            if($(this).is(':first-child')) $(this).css('margin-left', '15px');
            else $(this).css('margin-left', '-595px');
        });
        modal.open({content: dropzone});
        data_pos = dropzone.data('pos');

        //INIT LOAD THE PAGE INDICATOR
        $('#page_indicator').text(data_pos + ' / ' + reports.length);
    });

    //UPDATE THE DATE WHEN DATE HAS BEEN CHANGED
    $(this).on('change', '#datepicker', function() {
        //$.post('update_date.php', {idpin: $('#header #idpin').val(), tipo: '', fecha: $(this).val(), user: ''}, function(data, status) {
            //update!!
        //});
    });

    //DELETE THE REPORT
    $(this).on('click', '#delete_report', function() {
        var packagestatus = '', idpin = $('#header #idpin').val();
        $.get('getReportStatus.php?IdPin='+idpin, function(data, status) {
            packagestatus = data;
        });
        if(packagestatus == 3) {
            var del = confirm("Are You sure you want to delete this report?");
            if(!del) return;
            $.post('deleteReports.php', {IdPin: idpin, state: packagestatus}, function(data, status) {
                swal('Report deleted', 'The report has been delete.', 'info');
            });
        }
    });


});