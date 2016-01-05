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
		format: '%Y-%m-%d',
		bg_color: 'white',
		date_color: 'gray',
		week_color: 'orange',
		caption_color: 'black',
		position: 'topRight',
		onSelectDate: Class.empty,
		edge: 'topLeft',
		close_button: true,
    close_text: 'close'
	},

	initialize: function(el, options)
	{
		this.element = document.id(el);
		this.setOptions(options);
		this.currentDate = new Date();
		this.element.addEvent('click', this.render.bind(this,true));
		this.element.set('value',this.currentDate.format(this.options.format));
	},
	
	render: function(reveal)
	{
		if(this.calendar)
			this.calendar.dispose();

		this.calendar = new Element('div' ,{'class': 'calendar'}).setStyle('background-color',this.options.bg_color);

		//render title
		var caption = new Element('div' ,{'class': 'caption'}).setStyle('color',this.options.caption_color);
		var previousLink = new Element('a', {'class': 'previous',html: '&lt;'});
		if (this.options.close_button) {
			new Element('div', {'class':'close', 'html':this.options.close_text}).addEvent('click', function() { this.parentElement.parentElement.dispose(); }).inject(caption);
		}
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
		var week = new Element('ul', {'class': 'week'}).setStyle('color',this.options.week_color);
		new Element('li',{text: 'Su'}).inject(week, 'bottom');
		new Element('li',{text: 'Mo'}).inject(week, 'bottom');
		new Element('li',{text: 'Tu'}).inject(week, 'bottom');
		new Element('li',{text: 'We'}).inject(week, 'bottom');
		new Element('li',{text: 'Th'}).inject(week, 'bottom');
		new Element('li',{text: 'Fr'}).inject(week, 'bottom');
		new Element('li',{text: 'Sa'}).inject(week, 'bottom');
		week.inject(this.calendar, 'bottom');
		
		//render dates
		var dates = new Element('ul', {'class': 'dates'});
		var lastDay =this.currentDate.getLastDayOfMonth();
		new Element('li',{text: '01', styles:{'color': this.options.date_color, 'margin-left': this._firstDayOfCurrentMonth()*30+'px'}}).inject(dates, 'bottom');
		for(i=2; i<=lastDay; i++)
		{
			if(i<10)
				litext = '0'+i;
			else
				litext = i;
			new Element('li',{text: litext}).setStyle('color',this.options.date_color).inject(dates, 'bottom');
		}
		
		var lis = dates.getElements('li');
		lis.each(function(item, index){
			item.addEvent('click', function() {
				this.element.set('value', this.currentDate.format('%Y-%m-')+item.innerHTML);
				this.fireEvent('selectDate', this.element.get('value'));
				this.calendar.fade('out');
				this.calendar.set('tween',{
					onComplete: function(){
						this.calendar.dispose();
						this.postion = null;
					}.bind(this)
				}).fade('out');
			}.bind(this));
		}.bind(this));
		
		dates.inject(this.calendar, 'bottom');
		
		if(reveal)
			this.calendar.hide();

		this.calendar.inject(this.element, 'after');
	
		this.calendar.position({
			relativeTo: this.element,
			position: this.options.position,
			edge: this.options.edge
		});
		
		if(reveal)
			this.calendar.reveal();
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
	
	_firstDayOfCurrentMonth: function()
	{
		var firstDate = this.currentDate.clone();
		firstDate.set('date', 1);
		return firstDate.getDay() % 7;
	}
});

Element.implement({

  makeCalendar: function(options){
    var calendar = new isCalendar(this, options);
    return calendar;
  }

});
