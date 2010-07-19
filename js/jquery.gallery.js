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