(function (window) {

  var document = window.document;

  var selected_box = (function () {

    // NOTE: at this time, the sons must be defined in the correct order, better to have no more than 3 levels
    /**
     *
     * @type {{wrapper: {selector: string, class: string, child: *[]}}}
     * @private
     */
    var _boxInsider = {
      wrapper: {
        selector: 'div',
        class: 'selected-box',
        child: [
          {
            selector: 'div',
            class: 'selected-box-cover invisible',
            child: [
              {
                selector: 'i',
                class: 'icon-ok'
              }
            ]
          },

          {
            selector: 'span'
          }
        ]
      }
    };

    /**
     *
     * @type {{limit: number, preArea: Array}}
     * @private
     */
    var _config = {
      limit: 0,
      preArea: []
    };

    /**
     *
     * @type {Number} counterActive used to count how many boxes are active right now.
     */
    var counterActive = 0;

    /**
     *
     * @type {Object} box store a single box.
     */
    var box = null;
    //var box = $('<div class="selected-box"> <div class="selected-box-cover invisible"> <i class="icon-ok"></i> </div> <span></span> </div>');

    /**
     *
     * @type {Object} _selector stores the box's parent's element.
     * @private
     */
    var _selector = null;

    /**
     *
     * @type {String} retValue stores the value returned by the components after it's clicked last time. (not in use right now)
     */
    var retValue = null;

    /**
     *
     * @type {Array} retActiveValue stores all the active boxes' values right now.
     */
    var retActiveValue = [];

    /**
     *
     * @type {Object} curActive stores the current box which is clicked just now.
     */
    var curActive = null;


    /**
     * Create elements that constitute the component, given the structure _boxInsider which is used to
     * define the component presentational structure.
     *
     * @method __constructBoxRecursively
     * @param {Object} father is the father element.
     * @param {Object} prop is an array stores the children(embedded) elements of the father element.
     * @private
     */
    var _constructBoxRecursively = function (father, prop) {
      var i, _prop, temp;

      for (i = 0; i < prop.length; ++i) {

        if (prop[i].hasOwnProperty('selector')) {
          temp = document.createElement(prop[i].selector);
        }

        if (prop[i].hasOwnProperty('class')) {
          $(temp).addClass(prop[i].class);
        }

        $(temp).appendTo(father);

        if (prop[i].hasOwnProperty('child')) {
          _constructBoxRecursively($(temp), prop[i].child);
        }
      }

    };

    /**
     *
     * @method _constructBox
     **/
    var _constructBox = function () {

      var _box = null;

      if (_boxInsider.hasOwnProperty('wrapper')) {

        _box = document.createElement(_boxInsider['wrapper'].selector);

        if (_boxInsider['wrapper'].hasOwnProperty('class')) {
          $(_box).addClass(_boxInsider['wrapper'].class);
        }

        if (_boxInsider['wrapper'].hasOwnProperty('child')) {
          _constructBoxRecursively($(_box), _boxInsider['wrapper'].child);
        }

      }

      return $(_box);
    };


    // self invoke
    (function () {


    }());

    /**
     * Initialize this component, given the element of the father which
     * is going to wrap the component, and send to local object-wide
     * '_selector'.
     *
     * @method init
     * @param {Object} selector the selector of the father element.
     **/
    var _init = function (selector, config) {

      if (typeof (selector) !== 'undefined' && selector != null) {
        _selector = selector;
      }

      if (typeof (config) !== 'undefined' && config != null) {
        _config = config;
      }
    };

    /**
     * Create the component and draw it on the screen, given the name to
     * be displayed and the value to get.
     *
     * @method _generate
     * @param {String} name which is going to be displayed in the component.
     * @param {String} value which is store in the related component and is
     *                 used to returned its value on demand.
     * @private
     **/
    var _generate = function (name, value) {

      box = _constructBox();

      addEvents();

      if (name != null && value != null) {
        box.find('span').text(name);
        box.attr('value', value);
      } else {
        return;
      }

      var i;

      for (i = 0; i < _config.preArea.length; ++i) {
        if (value === _config.preArea[i]) {
          box.addClass('active');
          box.find('.selected-box-cover').removeClass('invisible');
          box.find('.selected-box-cover').addClass('visible');
          box.find('.selected-box-cover').width(box.width());
          //box.disabled = true;
          counterActive += 1;

        }
      }

      box.appendTo(_selector);

      refresh();
    };


    /**
     * Refresh is to update the state of every boxes, for instance, if the number of
     * selected boxes is greater than the pre-defined value, then the rest of the boxes
     *  would be disabled, counterActive is used to store the number.
     *
     * @method refresh
     */
    var refresh = function () {

      if (counterActive != null) {

        if (counterActive < _config.limit) {
          //alert('a');
          _selector.find('.selected-box').each(function () {

            if ($(this).hasClass('disabled')) {
              $(this).removeClass('disabled');
            }
          });
        } else {
          _selector.find('.selected-box').each(function () {

            if ($(this).hasClass('disabled') === false && $(this).hasClass('active') === false) {
              $(this).addClass('disabled');
            }
          });
        }
      }
    };


    /**
     * Append events to specific element.
     *
     * @method addEvents
     **/
    var addEvents = function () {

      var args = arguments;
      box.click(function () {

        if ($(this).hasClass('active') === false && $(this).hasClass('disabled') === false) {
          $(this).addClass('active');
          $(this).find('.selected-box-cover').removeClass('invisible');
          $(this).find('.selected-box-cover').addClass('visible');
          $(this).find('.selected-box-cover').width($(this).width());

          curActive = $(this);

          counterActive += 1;

          refresh();

        } else if ($(this).hasClass('disabled') === false) {
          $(this).removeClass('active');
          $(this).find('.selected-box-cover').removeClass('visible');
          $(this).find('.selected-box-cover').addClass('invisible');

          counterActive -= 1;

          refresh();

        }
      });
    };

    /**
     * Allow to add custom event attached to a specific action.
     *
     * @method Events
     * @param {String} type action type, like 'click', 'hover', 'mouseenter', 'mouseleave', ...
     * @param {Function} fn user defined callback function.
     * @constructor
     */
    var Events = function (type, fn) {

      switch (type) {

        case 'click':

          _selector.find('.selected-box').each(function () {
            $(this).click(function () {

              // NOTE: a little strange here!!!
              if ($(this).hasClass('active') !== false && $(this).hasClass('disabled') === false) {

                if (typeof (fn) === 'function') {

                  retValue = $(this).attr('value');

                  fn(retValue);
                }
              }
            });
          });

          break;
        /* No default case */
      }
    };

    /**
     *
     * @method getActiveValues
     * @returns {Array} retActiveValue stores the values of all active(selected) boxes
     */
    var getActiveValues = function () {
      _selector.find('.selected-box').each(function () {

        if ($(this).hasClass('active')) {
          retActiveValue.push($(this).attr('value'));
        }
      });

      return retActiveValue;
    };


    return {

      // methods
      init: _init,
      generate: _generate,
      getActiveValues: getActiveValues,
      event: Events,

      // values
      value: retValue
    };

  }());

  window.selected_box = selected_box;

}(window));

