/*
---

script: is-calendar.js

description: 

license: MIT-style license

authors:
  - isfeng

requires:


provides: [isCalendar]
...

*/

var isCalendar = new Class
({

  	Implements: [Events, Options],

	element: null,
	
	options: {
		format: '%Y-%m-%d'
	},

	initialize: function(el, options)
	{
		this.element = document.id(el);
		this.setOptions(options);
		this.currentDate = new Date();
		this.element.addEvent('click', this.render.bind(this));
		this.element.set('value',this.currentDate.format(this.options.format));
	},
	
	render: function()
	{
		if(this.calendar)
			this.calendar.dispose();

		this.calendar = new Element('div' ,{'class': 'calendar'});
		//render title
		var caption = new Element('div' ,{'class': 'caption'});
		var previousLink = new Element('a', {'class': 'previous',html: '&lt;'});
		previousLink.inject(caption, 'bottom');
		previousLink.addEvent('click', this.previous.bind(this));
		
		var mon = this.currentDate.get('month') + 1;
		var calendarTitle = new Element('h4', { text: this.currentDate.format('%Y  %B')});
		calendarTitle.inject(caption, 'bottom');
		
		var nextLink = new Element('a', {'class': 'next', html: '&gt;'});
		nextLink.inject(caption, 'bottom');
		nextLink.addEvent('click', this.next.bind(this));
		
		caption.inject(this.calendar, 'bottom');
		
		//render week title
		var days = new Element('ul', {'class': 'days'});
		new Element('li',{text: 'Su'}).inject(days, 'bottom');
		new Element('li',{text: 'Mo'}).inject(days, 'bottom');
		new Element('li',{text: 'Tu'}).inject(days, 'bottom');
		new Element('li',{text: 'We'}).inject(days, 'bottom');
		new Element('li',{text: 'Th'}).inject(days, 'bottom');
		new Element('li',{text: 'Fr'}).inject(days, 'bottom');
		new Element('li',{text: 'Sa'}).inject(days, 'bottom');
		days.inject(this.calendar, 'bottom');
		
		//render dates
		var dates = new Element('ul', {'class': 'dates'});
		var lastDay =this.currentDate.getLastDayOfMonth();
		new Element('li',{text: '01', styles:{'margin-left': this.firstDayOfCurrentMonth()*30+'px'}}).inject(dates, 'bottom');
		for(i=2; i<=lastDay; i++)
		{
			if(i<10)
				litext = '0'+i;
			else
				litext = i;
			new Element('li',{text: litext}).inject(dates, 'bottom');
		}
		
		var lis = dates.getElements('li');
		lis.each(function(item, index){
			item.addEvent('click', function() {
				this.element.set('value', this.currentDate.format('%Y-%m-')+item.innerHTML);
				this.calendar.dispose();
			}.bind(this));
		}.bind(this));
		
		dates.inject(this.calendar, 'bottom');
		this.calendar.inject(this.element, 'after');
		this.calendar.position({
			relativeTo: this.element,
			position: 'topright',
		    edge: 'topleft'
		});
	},
	
	next: function()
	{
		this.currentDate = this.currentDate.increment('month', 1);
		this.render();
	},
	
	previous: function()
	{
		this.currentDate = this.currentDate.decrement('month', 1);
		this.render();
	},
	
	firstDayOfCurrentMonth: function()
	{
		var firstDate = this.currentDate.clone();
		firstDate.set('date', 1);
		return firstDate.getDay() % 7;
	}
});

Element.implement({

  makeCalendar: function(options){
    var calendar = new isCalendar(this);
    return calendar;
  }

});