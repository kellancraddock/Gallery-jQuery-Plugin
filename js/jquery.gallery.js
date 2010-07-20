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
		
		//Defaults
		this.defaults = {
			itemsVisible: 3,
			itemOffset: 1,
			draggable: true
		}
		
		//Extend the default options obj
		this.options = $.extend({}, self.defaults, options);
		
		//Init (construct) function
		this.init = function(element) {
			//Set up default states
			var gallery = element;
			var galleryWidth = $('li', gallery).length * $('li', gallery).eq(0).outerWidth(true);
			var viewBoxWidth = self.options.itemsVisible * $('li', gallery).eq(0).outerWidth(true);
			var class = 'galleryWrapper';
		
			$(gallery).wrap('<div class="' + class + '" />').css({'width': galleryWidth});
			$(gallery).parent('.' + class).css({'width': viewBoxWidth, 'overflow-x': 'hidden'});
			
			$('li', gallery).eq(0).addClass('active');
			
			//Bind default click to items
			$('li', gallery).bind('click', function() {
				self.setItem($(this), gallery);
				return false;
			});
			
			if (self.options.draggable) { self.setDraggable(gallery); }
		}
		
		//setItem method- resets the active item
		this.setItem = function(element, gallery) {
		
			$('li', gallery).removeClass('active');
	
			element.addClass('active');
		
			//$(self.controls.updateText).text(element.children('a').attr('href').replace('#', ''));
			self.slideLeft(self.options.itemOffset, gallery);
		}
		
		//slideLeft- slides to the currently active item
		this.slideLeft = function(offset, gallery) {
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
		
		//setDraggable- binds all dragging functionality
		this.setDraggable = function(gallery) {
			$('li', gallery).css('cursor', 'move'); //Setup default states
			$(gallery).bind('mousedown', function(e) { //Bind mousedown to parent of items
				e.preventDefault();
				var initMousePos = e.pageX;
				var initGalleryMargin = 1 * $(gallery).css('marginLeft').replace('px', '');
				
				
				$(gallery).bind('mousemove', function(e) {
					var margin = e.pageX - initMousePos;
					self.drag(initGalleryMargin, margin, gallery);
				});
				
				$('html').bind('mouseup', function() {
					$(gallery).unbind('mousemove');
				});
			});
		}
		
		//drag- starts drag functionality via css left margin
		this.drag = function(initGalleryMargin, margin, gallery) {
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
		
		//Set the instance to the elements data
		element.data('gallery', this);
	
	}
	
})(jQuery);