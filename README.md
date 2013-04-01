is-calendar
===========

is-calendar is a very simple date picker for MooTools.

How to Use
----------

Snippet code HTML:

	#HTML
	
	<input type="text" id="cal">
	
	

Snippet code Javascript:

	#Javascript
	
	$('cal').makeCalendar();

	// call back function
    $('cal2').makeCalendar({
        onSelectDate: function(d){
            alert(d);
        }
    });

    // change default color
    $('cal3').makeCalendar({
        bg_color: 'black',
        date_color: 'white',
        week_color: 'orange',
        caption_color: 'white'
    });

