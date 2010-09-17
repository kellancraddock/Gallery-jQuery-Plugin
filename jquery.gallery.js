/**
* Gallery - A jQuery plugin
* Description: This plugin creates an animated, draggable gallery
* Author: Kellan Craddock
* Email: kellancraddock@gmail.com
*/

//TODO - make viewBoxWidth dynamic. Animate width on gallery move based on the items visible
// Make a remove item method that removes an item based on a number passed in, then make a onRemoveItem callback

(function($) {
	//Create plugin obj
	$.fn.gallery = function(options) {
		return this.each(function(i) {
			$.fn.gallery.createInstance($(this), options);
		});
	}
	
	//Acuire an instance of the plugin
	$.fn.gallery.createInstance = function(element, options) {
		if (element.data('gallery')) {
			if (options != undefined) {
				element.data('gallery').options = $.extend(true, {}, element.data('gallery').options, options);
				element.data('gallery').init(element);
			}
			//Existing Instance
			return element;
		} else {
			//New Instance
			var instance = new $.fn.gallery.instance(element, options);
			element.data('gallery').init(element, options);
			return element;
		}
	}

	//Instance
	$.fn.gallery.instance = function(element, options) {
		var self = this;
		this.gallery;
		this.viewBoxWidth;
		
		//Defaults
		this.defaults = {
			items: 'li',
			itemsVisible: 3,
			itemsOffset: 0,
			direction: 'horizontal',
			controls: false,
			clickable: true,
			draggable: true,
			animate: true,
			animationDuration: 500,
			animationEasing: 'swing',
			onMove: function() {},
			onItemRemove: function() {},
			onItemRemoved: function() {}
		}
		
		//Extend the default options obj
		this.options = $.extend(true, {}, self.defaults, options);
		
		//Init (construct) function
		this.init = function(element) {
			//Set up default states
			self.gallery = element;
			var galleryWidth = $(self.options.items, self.gallery).length * $(self.options.items, self.gallery).eq(0).outerWidth(true);
			var galleryHeight = $(self.options.items, self.gallery).length * $(self.options.items, self.gallery).eq(0).outerHeight(true);

			if(self.options.direction == 'horizontal') {
				//Set the view box width
				self.setViewBoxWidth();
			} else if(self.options.direction == 'vertical') {
				self.setViewBoxHeight();
			}
			
			var galleryClass = 'galleryWrapper';
			
			//Check to see if the gallery is already wrapped, else wrap it
			if($(self.gallery).parent('.' + galleryClass).length) {
				if(self.options.direction == 'horizontal') {
					$(self.gallery).css({'width': galleryWidth});
					$(self.gallery).parent('.' + galleryClass).css({'width': self.viewBoxWidth, 'overflow-x': 'hidden'});
				} else if(self.options.direction == 'vertical') {
					$(self.gallery).css({'height': galleryHeight});
					$(self.gallery).parent('.' + galleryClass).css({'height': self.viewBoxHeight, 'overflow-y': 'hidden'});
				}
			} else {
				if(self.options.direction == 'horizontal') {
					$(self.gallery).wrap('<div class="' + galleryClass + '" />').css({'width': galleryWidth});
					$(self.gallery).parent('.' + galleryClass).css({'width': self.viewBoxWidth, 'overflow-x': 'hidden'});
				} else if(self.options.direction == 'vertical') {
					$(self.gallery).wrap('<div class="' + galleryClass + '" />').css({'height': galleryHeight});
					$(self.gallery).parent('.' + galleryClass).css({'height': self.viewBoxHeight, 'overflow-y': 'hidden'});
				}
			}
			
			//Check for controls 
			if (self.options.controls) {
				$(self.options.controls.prev).unbind('click').bind('click', function() {
					self.moveTo('back');
					return false;
				});
				$(self.options.controls.next).unbind('click').bind('click', function() {
					self.moveTo('next');
					return false;
				});
			}
			
			//Check for ability to click on an item 
			if (self.options.clickable) {
				$(self.options.items, self.gallery).bind('click', function() {
					self.moveTo($(this));
					return false;
				});
			}
			//Check for ability to drag an item
			if (self.options.draggable) { self.setDraggable(); }
		}
		
		this.setViewBoxWidth = function() {
			switch(typeof(self.options.itemsVisible)){
				case 'number':
					self.viewBoxWidth = self.options.itemsVisible * $(self.options.items, self.gallery).eq(0).outerWidth(true) + (parseInt($(self.gallery).css('marginLeft')) + parseInt($(self.gallery).css('marginRight')) ) + (parseInt($(self.gallery).css('borderLeftWidth'), 10) + parseInt($(self.gallery).css('borderRightWidth'), 10) );
					break;
				case 'string':
					if (self.options.itemsVisible.toLowerCase() == 'all' || self.options.itemsVisible == '*') {
						self.viewBoxWidth = $(self.options.items, self.gallery).length * $(self.options.items, self.gallery).eq(0).outerWidth(true) + (parseInt($(self.gallery).css('marginLeft')) + parseInt($(self.gallery).css('marginRight')) ) + (parseInt($(self.gallery).css('borderLeftWidth'), 10) + parseInt($(self.gallery).css('borderRightWidth'), 10) );
					}
					break;
				default:
					return false;
			}
		}
		
		this.setViewBoxHeight = function() {
			switch(typeof(self.options.itemsVisible)){
				case 'number':
					self.viewBoxHeight = self.options.itemsVisible * $(self.options.items, self.gallery).eq(0).outerHeight(true) + (parseInt($(self.gallery).css('marginTop')) + parseInt($(self.gallery).css('marginBottom')) ) + (parseInt($(self.gallery).css('borderTopWidth'), 10) + parseInt($(self.gallery).css('borderBottomWidth'), 10) );
					break;
				case 'string':
					if (self.options.itemsVisible.toLowerCase() == 'all' || self.options.itemsVisible == '*') {
						self.viewBoxWidth = $(self.options.items, self.gallery).length * $(self.options.items, self.gallery).eq(0).outerHeight(true) + (parseInt($(self.gallery).css('marginTop')) + parseInt($(self.gallery).css('marginBottom')) ) + (parseInt($(self.gallery).css('borderTopWidth'), 10) + parseInt($(self.gallery).css('borderBottomWidth'), 10) );
					}
					break;
				default:
					return false;
			}
		}
		
		//moveTo method- resets the active item. Takes an object, number, or 'next' & 'back'
		this.moveTo = function(item, animate) {
			var animate = (animate == undefined) ? true : animate;
			//console.log(animate);
			var element;
			switch(typeof(item)){
				case 'object':
				  element = item;
				  break;
				case 'number':
				  element = $(self.options.items, self.gallery).eq((item - 1));
				  break;
				case 'string':
				  self.options.controls.count = (typeof(self.options.controls.count)=='number') ? self.options.controls.count : 1;
				  if (item == 'next') {	
				  	newIndex = $('.active', self.gallery).prevAll().andSelf().length + (self.options.controls.count-1);
				  	element = ($('.active', self.gallery).next(self.options.items).length > 0 && $(self.options.items, self.gallery).eq(newIndex).length > 0) ? $(self.options.items, self.gallery).eq(newIndex) : false;
				  } else if (item == 'back') {
				  	newIndex = $('.active', self.gallery).prevAll().andSelf().length - (self.options.controls.count+1);
				  	element = ($('.active', self.gallery).prev(self.options.items).length > 0) ? $(self.options.items, self.gallery).eq(newIndex) : false;
				  }
				  break;
				default:
				  return false;
			}
			
			//If there is no element available to move to, then return false
			if (!element) {return false}
			
			//onMove Callback
			self.options.onMove(element, self.gallery);
			//Remove all active classes in gallery
			$(self.options.items, self.gallery).removeClass('active');
			//Set active class on the new item
			element.addClass('active');
			
			//Check for option to animate gallery
			if (self.options.animate) {
				
				if(self.options.direction == 'horizontal') {
					self.slideLeft(self.options.itemsOffset, animate);
				} else if(self.options.direction == 'vertical') {
					self.slideDown(self.options.itemsOffset, animate);
				}
			}
			
			//Update the controls to enable and disable visually
			var controls = { prevCount: element.prevAll().length, nextCount: element.nextAll().length };
			self.updateControls(controls);
		}
		
		this.updateControls = function(controls) {

			if (controls.nextCount && controls.prevCount) {
				//there are both next and prev options
				$(self.options.controls.prev + ', ' + self.options.controls.next).removeClass('disabled');
			} else {
				$(self.options.controls.prev + ', ' + self.options.controls.next).removeClass('disabled');
				
				if( controls.nextCount == 0) {
					//no next, disable next
					$(self.options.controls.next).addClass('disabled');
				}
				if( controls.prevCount == 0) {
					//no prev, disable
					$(self.options.controls.prev).addClass('disabled');
				}
			}
		}
		
		//slideLeft- slides to the currently active item
		this.slideLeft = function(offset, animate) {
			var items;
			var margin;
			var prevItems = $(' .active', self.gallery).prevAll(self.options.items).length;
			
			if (offset) {
				margin = (prevItems - offset) * $(self.options.items, self.gallery).eq(0).outerWidth(true);
			} else {
				margin = prevItems * $(self.options.items, self.gallery).eq(0).outerWidth(true);
			} if (margin > 0) {
				margin = '-' + Math.abs(margin) + 'px';
			} else {
				margin = '+' + Math.abs(margin) + 'px';
			}
			
			//If set to animate
			if (animate) {	
				$(self.gallery).animate({
				    marginLeft: margin
				}, {
					duration: self.options.animationDuration,
					easing: self.options.animationEasing
				}, function() {
				    // Animation complete.
				});
			//Else simply set css margin left
			} else {
				$(self.gallery).css({marginLeft: margin});
			}
				
		}
		
		//slideLeft- slides to the currently active item
		this.slideDown = function(offset, animate) {
			var items;
			var margin;
			var prevItems = $(' .active', self.gallery).prevAll(self.options.items).length;
			
			if (offset) {
				margin = (prevItems - offset) * $(self.options.items, self.gallery).eq(0).outerHeight(true);
			} else {
				margin = prevItems * $(self.options.items, self.gallery).eq(0).outerHeight(true);
			} if (margin > 0) {
				margin = '-' + Math.abs(margin) + 'px';
			} else {
				margin = '+' + Math.abs(margin) + 'px';
			}
			
			//If set to animate
			if (animate) {	
				$(self.gallery).animate({
				    marginTop: margin
				}, {
					duration: self.options.animationDuration,
					easing: self.options.animationEasing
				}, function() {
				    // Animation complete.
				});
			//Else simply set css margin left
			} else {
				$(self.gallery).css({marginTop: margin});
			}
				
		}
		
		//setDraggable- binds all dragging functionality
		this.setDraggable = function() {
			 //Setup default states
			var defaultCursor = $(self.options.items, self.gallery).css('cursor');
			
			$(self.gallery).bind('mousedown', function(e) { //Bind mousedown to parent of items
				e.preventDefault();
				var initMousePos = e.pageX;
				var initGalleryMargin = 1 * $(self.gallery).css('marginLeft').replace('px', '');
				
				//Set the cursor				
				$(self.options.items, self.gallery).css('cursor', 'move');
				
				$(self.gallery).bind('mousemove', function(e) {
					var margin = e.pageX - initMousePos;
					self.drag(initGalleryMargin, margin);
				});
				
				$('html').bind('mouseup', function() {
					$(self.gallery).unbind('mousemove');
					$(self.options.items, self.gallery).css('cursor', defaultCursor);
				});
			});
		}
		
		//drag- starts drag functionality via css left margin
		this.drag = function(initGalleryMargin, margin) {
			//Move the gallery based on the mouse pos
			var newMargin;
			if (margin > 0) {
				newMargin = (initGalleryMargin + margin) + 'px';
			} else if ( initGalleryMargin >= 0 ) {
				newMargin = (initGalleryMargin + margin) + 'px';
			} else {
				newMargin = "-" + Math.abs(initGalleryMargin + margin) + 'px';
			}
			$(self.gallery).css('marginLeft', newMargin);
		}
		
		this.itemRemove = function(item, animate) {
			var element;
			var animate = (animate == undefined) ? true : false;
			switch(typeof(item)){
				case 'object':
				  element = item;
				  break;
				case 'number':
				  element = $(self.options.items, self.gallery).eq((item - 1));
				  break;
				default:
				  return false;
			}
			
			//Check for element
			if (!element) { return false; }
			
			//onItemRemove Callback
			self.options.onItemRemove(element, self.gallery);
			//Check for animation before removing
			if (animate) {
				element.addClass('removing').animate( { opacity: "0"}, 600).animate({width: "0"}, 600, function() {
					var location = element.prevAll('.show').length;
					$(this).remove();
					//Fire onItemRemoved callback 
					self.options.onItemRemoved(location, self.gallery)
				});
			} else {
				var location = element.prevAll('.show').length;
				element.addClass('removing').remove();
				//Fire onItemRemoved callback
				self.options.onItemRemoved(location, self.gallery);
			}
		}
		
		//Set the instance to the elements data
		element.data('gallery', this);
	
	}
	
})(jQuery);