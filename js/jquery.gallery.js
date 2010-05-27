/**
* Gallery - A jQuery plugin
* Description: This plugin creates an animated, draggable gallery using list items (li)
* Author: Kellan Craddock
* Email: kellancraddock@gmail.com
*/
(function($) {
	
	//Create plugin obj
	$.fn.gallery = function(options) {
		//Extend the default option obj
		$.fn.gallery.options = $.extend({}, $.fn.gallery.defaults, options);

		return this.each(function(i) {
			$.fn.gallery.init(this, i);
		});
	}
	
	//Set up default options
	$.fn.gallery.defaults = {
		itemsVisible: 3,
		itemOffset: 1,
		draggable: true
	}
	
	$.fn.gallery.init = function(gallery, i) {
		//Set up default states
		var galleryWidth = $('li', gallery).length * $('li', gallery).eq(0).outerWidth(true);
		var viewBoxWidth = $.fn.gallery.options.itemsVisible * $('li', gallery).eq(0).outerWidth(true);
		var class = 'galleryWrapper' + i;
	
		$(gallery).wrap('<div class="' + class + '" />').css({'width': galleryWidth});
		$('.' + class).css({'width': viewBoxWidth, 'overflow-x': 'hidden'});
		
		$('li', gallery).eq(0).addClass('active');
		
		//Bind default click to items
		$('li', gallery).bind('click', function() {
			$.fn.gallery.setItem($(this), gallery);
			return false;
		});
		
		if ($.fn.gallery.options.draggable) { $.fn.gallery.setDraggable(gallery); }
	}
	
	$.fn.gallery.setItem = function(element, gallery) {
		
		$('li', gallery).removeClass('active');

		element.addClass('active');
	
		//$(self.controls.updateText).text(element.children('a').attr('href').replace('#', ''));
		$.fn.gallery.slideLeft($.fn.gallery.options.itemOffset, gallery);
	}
	
	$.fn.gallery.setDraggable = function(gallery) {
		$('li', gallery).css('cursor', 'move') //Setup default states
		$(gallery).bind('mousedown', function(e) { //Bind mousedown to parent of items
			e.preventDefault();
			var initMousePos = e.pageX;
			var initGalleryMargin = 1 * $(gallery).css('marginLeft').replace('px', '');
			
			
			$(gallery).bind('mousemove', function(e) {
				var margin = e.pageX - initMousePos;
				$.fn.gallery.drag(initGalleryMargin, margin, gallery);
			});
			
			$('html').bind('mouseup', function() {
				$(gallery).unbind('mousemove');
			});
		});
	}
	
	$.fn.gallery.slideLeft = function(offset, gallery) {
		var items;
		var margin;
		var prevItems = $(' .active', gallery).prevAll('li').length;
		
		if (offset) {
			margin = (prevItems - offset) * $('li', gallery).eq(0).outerWidth(true);
		} else {
			margin = prevItems * $('li', gallery).eq(0).outerWidth(true);
		} if (margin > 0) {
			margin = '-' + Math.abs(margin) + 'px';
		} else {
			margin = '+' + Math.abs(margin) + 'px';
		}
			
		$(gallery).animate({
		    marginLeft: margin
		}, 500, function() {
		    // Animation complete.
		});
			
	}
	
	$.fn.gallery.drag = function(initGalleryMargin, margin, gallery) {
		//Move the gallery based on the mouse pos
		var newMargin;
		if (margin > 0) {
			newMargin = (initGalleryMargin + margin) + 'px';
		} else if ( initGalleryMargin >= 0 ) {
			newMargin = (initGalleryMargin + margin) + 'px';
		} else {
			newMargin = "-" + Math.abs(initGalleryMargin + margin) + 'px';
		}
		$(gallery).css('marginLeft', newMargin);
	}
		
	
})(jQuery);

/**
* Class Gallery requires a scope, and the items and custom items to be arranged: 'item'>'a', the 'a' requires a href of the text used to update the controls.
* @argument {type} description
* @constructor name
* @returns true
*/

/*
function Gallery() {
	var self = this;
	
	this.scope;
	this.root;
	this.items;
	this.itemsVisible;
	this.itemWidth;
	this.itemOffset;
	this.draggable;
	this.controls;
	
	this.construct = function(options) {
		//Set up public members
		self.scope = (options.scope != undefined && $(options.scope).length) ? options.scope : false;
    	self.root = (options.root != undefined) ? options.root : '.gallery';
    	self.items = (options.items != undefined) ? options.items : '.item';
    	self.itemsVisible = (options.itemsVisible != undefined) ? (options.itemsVisible - 1) : 5;
    	self.itemWidth = (options.itemWidth != undefined) ? options.itemWidth : 100;
    	self.itemOffset = (options.itemOffset != undefined) ? options.itemOffset : 0;
    	self.draggable = (options.draggable != undefined) ? options.draggable : true;
    	self.controls = (options.controls != undefined && $(options.controls.root).length) ? options.controls : false;
    	
    	if (self.controls) {
	    	self.controls.root = (options.controls.root != undefined && $(options.controls.root).length) ? options.controls.root : '#controls';
	    	self.controls.customItems = (options.controls.customItems != undefined && $(options.controls.customItems).length) ? options.controls.customItems : self.items;
	    	self.controls.forward = (options.controls.forward != undefined && $(options.controls.forward).length) ? options.controls.forward : '.forward';
	    	self.controls.back = (options.controls.back != undefined && $(options.controls.back).length) ? options.controls.back : '.back';
	    	self.controls.first = (options.controls.first != undefined && $(options.controls.first).length) ? options.controls.first : '.first';
	    	self.controls.last = (options.controls.last != undefined && $(options.controls.last).length) ? options.controls.last : '.last';
	    	self.controls.updateText = (options.controls.updateText != undefined && $(options.controls.updateText).length) ? options.controls.updateText : '';
    	}
    	
    	if (self.scope) {
    		//Set up default states
    		var rootWidth = $(self.root + ' ' + self.items, self.scope).length * $(self.root + ' ' + self.items, self.scope).eq(0).outerWidth(true);
    		
    		var scopeWidth = self.itemsVisible * $(self.root + ' ' + self.items, self.scope).eq(0).outerWidth(true);
 
    		$(self.root + ' ' + self.items, self.scope).eq(0).addClass('active');
    		$(self.root, self.scope).parent().css({'overflow-x': 'hidden'});
    		$(self.root, self.scope).css({'width': rootWidth});
    		$(self.scope).css({'width': scopeWidth});
    		
    		//Bind default click to items
    		$(self.root + ' ' + self.items, self.scope).bind('click', function() {
    			self.setItem($(this));
    			return false;
    		});
    		
    		if (self.draggable) {
    			//Setup default states
    			$(self.root, self.scope).css('cursor', 'move')
	    		//Bind mousedown to parent of items
	    		$(self.root, self.scope).bind('mousedown', function(e) {
	    			e.preventDefault();
	    			var initMousePos = e.pageX;
	    			var initGalleryMargin = 1 * $(self.root, self.scope).css('marginLeft').replace('px', '');
	    			
	    			$(self.root, self.scope).bind('mousemove', function(e) {
	    				var margin = e.pageX - initMousePos;
	    				self.dragGallery(initGalleryMargin, margin);
	    			});
	    			
					$('html').bind('mouseup', function() {
	    				$(self.root, self.scope).unbind('mousemove');
	    			});
	    		});
    		}
    		
    		//Check for controls
    		if (self.controls) {
    			//Update text area
    			$(self.controls.updateText).text($(self.controls.customItems).eq(0).children('a').attr('href').replace('#', ''));
    			
    			//Bind foward button
	    		$(self.controls.forward, self.controls.root).bind('click', function() {
	    			self.setActive('forward');
	    			return false;
	    		});
	    		//Bind back button
	    		$(self.controls.back, self.controls.root).bind('click', function() {
	    			self.setActive('back');
	    			return false;
	    		});
	    		//Bind first button
	    		$(self.controls.first, self.controls.root).bind('click', function() {
	    			self.setActive('first');
	    			return false;
	    		});
	    		//Bind last button
	    		$(self.controls.last, self.controls.root).bind('click', function() {
	    			self.setActive('last');
	    			return false;
	    		});
    		}
    	}
	}
	
	
	
	this.setActive = function(direction) {
		var next;
		if (direction == 'forward') {
			next = $(self.root + ' .active', self.scope).nextAll(self.controls.customItems).eq(0).addClass('active');
		} else if (direction == 'back') {
			next = $(self.root + ' .active', self.scope).prevAll(self.controls.customItems).eq(0).addClass('active');
		} else if (direction == 'first') {
			next = $(self.root + ' .active', self.scope).prevAll(self.items).last().addClass('active');
		} else if (direction == 'last') {
			next = $(self.root + ' .active', self.scope).nextAll(self.items).last().addClass('active');
		}
		if ($(next).length) {
			$(self.controls.customItems).removeClass('active');
			$(self.items).removeClass('active');
			next.addClass('active');
			$(self.controls.updateText).text(next.children('a').attr('href').replace('#', ''));
			if (direction == 'last') {
				self.slideLeft(self.itemsVisible);
			} else {
				self.slideLeft(false);
			}
		}
	}
	
	//Animate the gallery based on the left margin
	this.slideLeft = function(offset) {
		var items;
		var margin;
		items = $(self.root + ' .active', self.scope).prevAll(self.items).length;
		if (offset) {
			margin = (items - offset) * self.itemWidth;
		} else {
			margin = items * self.itemWidth;
		}
		if (margin > 0) {
			margin = '-' + Math.abs(margin) + 'px';
		} else {
			margin = '+' + Math.abs(margin) + 'px';
		}
		$(self.root).animate({
		    marginLeft: margin
		}, 500, function() {
		    // Animation complete.
		});
		
	}
	
	//Move the gallery based on the mouse pos
	this.dragGallery = function(initGalleryMargin, margin) {
		var newMargin;
		if (margin > 0) {
			newMargin = (initGalleryMargin + margin) + 'px';
		} else if ( initGalleryMargin >= 0 ) {
			newMargin = (initGalleryMargin + margin) + 'px';
		} else {
			newMargin = "-" + Math.abs(initGalleryMargin + margin) + 'px';
		}
		$(self.root, self.scope).css('marginLeft', newMargin);
	}
}
*/