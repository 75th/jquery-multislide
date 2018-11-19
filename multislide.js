(function($) {

	var methods = {
		init: function(params) {
			var settings = $.extend(
				{},
				{
					multislideID: 'multislide',
					showPager: false,
					showPicker: false,
					switcherInterval: false,
					transitionDuration: 1000,
					slideFindSelector: '> *'
				},
				params
			);

			$(this).data('multislide-settings', settings);

			$(this).addClass('multislide-' + settings.multislideID);

			$(this).each(function(i, slider) {
				var $slides = $(slider).find(settings.slideFindSelector);
				$(slider).data('$slides', $slides);

				$slides.addClass('multislide-slide');

				// Put the destroySlideshow listener before the early abort for 0 or 1 slides,
				// since we did some stuff above here already
				$(slider).on('destroySlideshow.multislideDefault', function() {
					$('.multislide-' + settings.multislideID).each(function(i, slider) {
						$(slider).removeClass('multislide multislide-' + settings.multislideID);
						$(slider).find('div.controls').remove();
						$(slider).data('multislide-settings', null);
						$(slider).data('$slides').removeClass('multislide-slide active almost-active almost-inactive').off('.multislideDefault');
						$(slider).data('$slides', null);
						$(slider).off('.multislideDefault');
					})
				});

				if($slides.length === 0) {
					$(this).trigger('destroySlideshow');
					return
				}

				if($slides.length === 1) {
					$(slider).addClass('multislide only-one-slide');
					return;
				}

				$(slider).addClass('multiple-slides');

				var $pickers = $();

				if(settings.showPager || settings.showPicker) {
					var controlsElement = '<div class="controls">';

					if(settings.showPager) {
						controlsElement += '<ul class="control-pager">';
						controlsElement +=     '<li class="pager-prev"><button>Previous slide</button></li>';
						controlsElement +=     '<li class="pager-next"><button>Next slide</button></a>';
						controlsElement += '</ul>';
					}

					if(settings.showPicker) {
						controlsElement += '<ul class="control-picker">';

						for(var i = 1; i <= $slides.length; i++) { // Goto function is 1-indexed
							controlsElement += '<li class="control-goto-' + i + '"><button>Go to slide ' + String(i) + '</button></li>';
						}

						controlsElement += '</ul>';
					}

					controlsElement += '</div>';
					controlsElement = $(controlsElement).get(0);

					$(slider).append(controlsElement);

					$pickers = $(controlsElement).find('.control-picker > li')

					$(controlsElement).find('.control-prev').on('click', function() {
						clearInterval(settings.switcherInterval);
						$(slider).trigger('prevSlide');
					});

					$(controlsElement).find('.control-next').on('click', function() {
						clearInterval(settings.switcherInterval);
						$(slider).trigger('nextSlide');
					})

					$pickers.each(function(i) {
						$(this).on('click', function() {
							clearInterval(settings.switcherInterval);
							$(this).parent().addClass('in-use')
							if(!$(this).hasClass('active')) {
								$(slider).trigger('gotoSlide', (i + 1));
							}
						});
					});
				} // If showing controls


				$slides.eq(0).addClass('active');
				$(slider).data('activeSlideIndex', 0);

				var numSlides = $slides.length;

				$(controlsElement).find('.control-picker > li').eq(0).addClass('active');

				$(this).addClass('multislide');

				// In all cases, "slideNumber" variables are 1-indexed, "slideIndex" variables are 0-indexed.
				$(this).on('gotoSlide.multislideDefault', function(e, newActiveSlideNumber) {
					// Euclidean modulo, so going to slide -1 goes to the last slide, etc.
					var newActiveSlideIndex = (((newActiveSlideNumber - 1) % numSlides) + numSlides) % numSlides;
					var oldActiveSlideIndex = $(slider).data('activeSlideIndex');

					$('.multislide-' + settings.multislideID).each(function(i, slider) {
						var $slides = $(slider).data('$slides');
						var $newActiveSlide = $slides.eq(newActiveSlideIndex);
						var $oldActiveSlide = $slides.filter('.active');

						if(!$newActiveSlide || $newActiveSlide === $oldActiveSlide) {
							return false;
						}

						var $olds = $oldActiveSlide.add($pickers.eq(oldActiveSlideIndex));
						var $news = $newActiveSlide.add($pickers.eq(newActiveSlideIndex));

						$(slider).trigger('beforeChange', slider, oldActiveSlideIndex, newActiveSlideIndex);
						$olds.trigger('slideDeactivateStart');
						$news.trigger('slideActivateStart');

						setTimeout(function() {
							$olds.trigger('slideDeactivateEnd');
							$news.trigger('slideActivateEnd');
							$(slider).data('activeSlideIndex', newActiveSlideIndex);
							$(slider).trigger('afterChange', slider, oldActiveSlideIndex, newActiveSlideIndex);
						}, settings.transitionDuration);
					});
				});

				$(this).on('nextSlide.multislideDefault', function() {
					$(this).trigger('gotoSlide', $(slider).data('activeSlideIndex') + 1 + 1);
				});

				$(this).on('prevSlide.multislideDefault', function() {
					$(this).trigger('gotoSlide', $(slider).data('activeSlideIndex') + 1 - 1);
				});

				var $slidesAndPickers = $slides.add($pickers);

				$slidesAndPickers.on('slideDeactivateStart.multislideDefault', function() {
					$(this).addClass('almost-inactive');
				});

				$slidesAndPickers.on('slideDeactivateEnd.multislideDefault', function() {
					$(this).removeClass('almost-inactive active');
				});

				$slidesAndPickers.on('slideActivateStart.multislideDefault', function() {
					$(this).addClass('pre-almost-active');

					this.getBoundingClientRect();

					$(this).addClass('almost-active');
					$(this).removeClass('pre-almost-active');
				});

				$slidesAndPickers.on('slideActivateEnd.multislideDefault', function() {
					$(this).removeClass('almost-active').addClass('active');
				});
			});
		},

		goto: function(targetSlideNumber) {
			$(this).trigger('gotoSlide', targetSlideNumber)
		},

		next: function() {
			$(this).trigger('nextSlide', targetSlideNumber)
		},

		prev: function() {
			$(this).trigger('prevSlide', targetSlideNumber)
		},

		destroy: function() {
			$(this).trigger('destroySlideshow');
		}
	};

	$.fn.multislide = function( method ) {
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist in multislide' );
		}
	};
})(jQuery);