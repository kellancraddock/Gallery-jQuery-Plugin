**************************************
Gallery - jQuery plugin
Description: This plugin creates an animated, draggable gallery
Author: Kellan Craddock
Collaborator: Jessica Tsuji
Email: kellancraddock@gmail.com
**************************************

/**
* Gallery - A jQuery plugin
* Description: This plugin creates an animated, draggable gallery
* Author: Kellan Craddock
* Email: kellancraddock@gmail.com
*
* USEAGE
*
* Default:
* $('div').gallery();
*
* With params:
* $('div').gallery({items: 'li', itemsVisible: 3});
*
* Accessing the plugin after init
* $('div').data('gallery');
*
* Calling a method
* $('div').data('gallery').moveTo(5);
*
* Public Methods
* 
* $('div').data('gallery').autoRotate(param);
* The autoRotate method accepts a Boolean or String ('start' or 'stop').
* Will update the autoRotate setting for the gallery.
*/


v0.1 - Base plugin code

******
TO DO:
******

[x] Make height dynamically calculated
[x] Make width dynamically calculated
[x] Make margins calculated for width
[x] Make margins calculated for height