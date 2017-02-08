var ps = (function($){
  var PhotoSwipe = window.PhotoSwipe,
    PhotoSwipeUI_Default = window.PhotoSwipeUI_Default;

  function parseThumbnailElements(gallery, el) {
    var elements = $(gallery).find('a[data-size]'),
      galleryItems = [],
      index;

    elements.each(function(i) {
      var $el = $(this);
        if($el.attr('data-type') == 'video'){
			galleryItems.push({
				type: 'video',
				html: '<div class="c-responsive-video-holder"><div class="c-responsive-video"><iframe width="420" height="315" data-src="https://www.youtube.com/embed/'+$el.attr('data-id')+'?autoplay=1"></iframe></div></div>'
			});
		}else{
			var size = $el.data('size').split('x'),
        		caption;
			if( $el.next().is('.wp-caption-text') ) {
				// image with caption
				caption = $el.next().text();
			} else if( $el.parent().next().is('.wp-caption-text') ) {
				// gallery icon with caption
				caption = $el.parent().next().text();
			} else {
				caption = $el.attr('title');
			}

			galleryItems.push({
				type: 'image',
				src: $el.attr('data-src'),
				w: parseInt(size[0], 10),
				h: parseInt(size[1], 10),
				title: caption,
				msrc: $el.find('img').attr('src'),
				el: $el
			});
		}
		if( el === $el.get(0) ) {
			index = i;
		}
    });
    return [galleryItems, parseInt(index, 10)];
  };

  function openPhotoSwipe( element, disableAnimation ) {
    var pswpElement = $('.pswp').get(0),
      galleryElement = $(element).parents('.gallery, .hentry, .main, body').first(),
      gallery,
      options,
      items, index;
    items = parseThumbnailElements(galleryElement, element);
    index = items[1];
    items = items[0];


    options = {
      index: index,
      getThumbBoundsFn: function(index) {
        var image = items[index].el;
        if(image){
        	image = image.find('img');
       		var offset = image.offset();
        	return {
        		x:offset.left,
        		y:offset.top,
        		w:image.width()
        	};
        }else{
        	return {
				showHideOpacity: true,
				showAnimationDuration:0,
        	};
        }
      },
      showHideOpacity: true,
      history: false
    };

    if(disableAnimation) {
      options.showAnimationDuration = 0;
    }

    // Pass data to PhotoSwipe and initialize it
    gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
	gallery.listen('beforeChange', function(e) {
		if(gallery.currItem.type == 'video'){
			var iframe = $('.c-responsive-video-holder').find('iframe');
			iframe.attr('src', iframe.data('src'));
		}else{
			var iframe = $('.c-responsive-video-holder').find('iframe').attr('src', '');
		}
	});
	gallery.listen('destroy', function() { $('.c-responsive-video-holder').remove(); });
    gallery.init();
  };

  return{
    open : openPhotoSwipe
  }
}(jQuery));
