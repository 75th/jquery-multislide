# Multislide

jQuery plugin to set up synchronized sliders with custom CSS transitions. This plugin only handles class flipping; all transitions are written by you in CSS, based on the following classes this plugin manipulates:

- `.pre-almost-active` — A slide that is about to be active. This class is only on a slide for a split second, to set up its initial position *without* CSS transitions. A reflow is triggered immediately after this class is put on a slide.
- `.almost-active` — A slide that is about to be active. This class remains on the slide for the duration of the transition.
- `.active` — A slide that has completed the transition and is the current slide.
- `.almost-inactive` — A slide that is being transitioned away from. **This slide is still `.active`.**
- `.inactive` — All slides other than the currently active one.
- `.only-one-slide`, `.multiple-slides` — A slider container with one or multiple slides, respectively.

## Usage

```$('.your-slide-container-selector').multislide();```

## Options

### `multislideID`

*Default: `'multislide'`*

String identifier to link different sliders together.

### `showPager`

*Default: `false`*

Whether to add previous/next slide buttons to the controls.

### `showPicker`

*Default: `false`*

Whether to add buttons for each slide to the controls.

### `switcherInterval`

*Default: `false`*

The ID of any `window.setInterval` you might have created to advance the slides automatically. This interval will be cleared when any pager or picker control is interacted with.

### `transitionDuration`

*Default: `1000`*

Duration in milliseconds from the start to the end of every slide transition.

### `slideFindSelector`

*Default: `'> *'`*

Parameter to the jQuery `.find()` method called on the slider container, identifying which descendants are slides.

## Events

Changes to all linked sliders can be triggered by custom JavaScript events on the slider, *or* with actions passed to the jQuery `.multislide()` method.

Furthermore, individual slides receive more events which you can add listeners for, but probably shouldn't trigger manually; these do not have method equivalents.

All event handlers in the plugin use the `.multislideDefault` namespace, so you can remove some of these with jQuery's `.off()` method if you have the need.

### `nextSlide` and `prevSlide`

*Method equivalents: `.multislide('next')` and `.multislide('prev')`

## TODO

- Add default CSS that should be on most/all transitions (such as .pre-almost-active having no transition-duration).
- Add sample CSS for some basic transitions.
- Add the ability to involve any slides *between* the almost-inactive and almost-active slides in a transition.

Advance the slider forward or backward by one slide.

### `gotoSlide`

*Method equivalent: `.multislide('goto', targetSlideNumber)`*

Go to a specific slide number. *Slide numbers start with 1, not 0.*

### `destroySlideshow`

*Method equivalent: `.multislide('destroy')`

Destroy all slideshow functionality and return all involved elements to their original state.

### `slideActivateStart`, `slideActivateEnd`

Triggered on a slide when the transition to it begins and ends, respectively.

### `slideDeactivateStart`, `slideDeactivateEnd`

Triggered on a slide when the transition away from it begins and ends, respectively.
