/**
* Gallery - A jQuery plugin
* Description: This plugin creates an animated, draggable gallery
* Author: Kellan Craddock
* Email: kellancraddock@gmail.com
*/

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
		//Defaults
		this.defaults = {
			items: 'li',
			itemsVisible: 3,
			itemsOffset: 0,
			clickable: true,
			draggable: true,
			slide: true,
			onItemSet: function() {}
		}
		
		//Extend the default options obj
		this.options = $.extend({}, self.defaults, options);
		
		//Init (construct) function
		this.init = function(element) {
			//Set up default states
			self.gallery = element;
			var galleryWidth = $(self.options.items, self.gallery).length * $(self.options.items, self.gallery).eq(0).outerWidth(true);
			var viewBoxWidth = self.options.itemsVisible * $(self.options.items, self.gallery).eq(0).outerWidth(true);
			var class = 'galleryWrapper';
		
			$(self.gallery).wrap('<div class="' + class + '" />').css({'width': galleryWidth});
			$(self.gallery).parent('.' + class).css({'width': viewBoxWidth, 'overflow-x': 'hidden'});
			
			$(self.options.items, self.gallery).eq(0).addClass('active');
			
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
		
		//moveTo method- resets the active item. Takes an object, number, or 'next' & 'back'
		this.moveTo = function(item) {
			var element;
			switch(typeof(item)){
				case 'object':
				  element = item;
				  break;
				case 'number':
				  element = $(self.options.items, self.gallery).eq((item - 1));
				  break;
				case 'string':
				  if (item == 'next') {
				  	element = ($('.active', self.gallery).next(self.options.items).length > 0) ? $('.active', self.gallery).next(self.options.items) : false;
				  } else if (item == 'back') {
				  	element = ($('.active', self.gallery).prev(self.options.items).length > 0) ? $('.active', self.gallery).prev(self.options.items) : false;
				  }
				  break;
				default:
				  return false;
			}
			
			//If there is no element available to move to, then return false
			if (!element) {return false}
			
			//onItemSet Callback
			self.options.onItemSet(element, self.gallery);
			//Remove all active classes in gallery
			$(self.options.items, self.gallery).removeClass('active');
			//Set active class on the new item
			element.addClass('active');
			
			//Check for option to slide gallery
			if (self.options.slide) {
				self.slideLeft(self.options.itemsOffset);
			} 
		}
		
		//slideLeft- slides to the currently active item
		this.slideLeft = function(offset) {
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
				
			$(self.gallery).animate({
			    marginLeft: margin
			}, 500, function() {
			    // Animation complete.
			});
				
		}
		
		//setDraggable- binds all dragging functionality
		this.setDraggable = function() {
			$(self.options.items, self.gallery).css('cursor', 'move'); //Setup default states
			$(self.gallery).bind('mousedown', function(e) { //Bind mousedown to parent of items
				e.preventDefault();
				var initMousePos = e.pageX;
				var initGalleryMargin = 1 * $(self.gallery).css('marginLeft').replace('px', '');
				
				
				$(self.gallery).bind('mousemove', function(e) {
					var margin = e.pageX - initMousePos;
					self.drag(initGalleryMargin, margin);
				});
				
				$('html').bind('mouseup', function() {
					$(self.gallery).unbind('mousemove');
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
		
		//Set the instance to the elements data
		element.data('gallery', this);
	
	}
	
})(jQuery);