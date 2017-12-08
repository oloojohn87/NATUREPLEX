
$( document ).ready(function() {
    console.log( "loading header js ..." );
			$(".dropdown-toggle").dropdown();

	        var langType = $.cookie('lang');

            if(langType == 'th')
            {
                var language = 'th';
                $("#lang1").html("Espa&ntilde;ol <span class=\"caret addit_caret\"></span>");
            }
            else{
                var language = 'en';
                $("#lang1").html("English <span class=\"caret addit_caret\"></span>");
            }
});

function setToggle(name) {
	        if(name == 'de')
            {
                var language = 'th';
                $("#lang1").html("Espa&ntilde;ol <span class=\"caret addit_caret\"></span>");
            }
            else{
                var language = 'en';
                $("#lang1").html("English <span class=\"caret addit_caret\"></span>");
            }
}