/**
* Gallery - A jQuery plugin
* Description: This plugin creates an animated, draggable gallery using list items (li)
* Author: Kellan Craddock
* Email: kellancraddock@gmail.com
*/

//NOTES - add functionality to slide to a specific slide (number) then allow for a call back that fires on slide move.

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
			itemsOffset: 1,
			draggable: true,
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
			
			//Bind default click to items
			$(self.options.items, self.gallery).bind('click', function() {
				self.setItem($(this));
				return false;
			});
			
			if (self.options.draggable) { self.setDraggable(); }
		}
		
		//setItem method- resets the active item
		this.setItem = function(element) {
			//Check if 'element' is a number, string, or jquery object then find the correct item
			var element = (isNaN(element)) ? element : $(self.options.items, self.gallery).eq(element);
			//onItemSet Callback
			self.options.onItemSet(element, self.gallery);
		
			$(self.options.items, self.gallery).removeClass('active');
	
			element.addClass('active');
			
			//$(self.controls.updateText).text(element.children('a').attr('href').replace('#', ''));
			self.slideLeft(self.options.itemsOffset);
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
		
		//getActive - return the currently active gallery item
		this.getActive = function() {
			return $('.active', self.gallery);
		}
		
		//Set the instance to the elements data
		element.data('gallery', this);
	
	}
	
})(jQuery);