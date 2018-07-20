var BlockMonitor = function () {
  var topbarAside = $('#m_detail_sidebar');
  var topbarAsideTabs = $('#m_detail_sidebar_tabs');
  var topbarAsideFooter = $('#m_detail_sidebar_footer');
  var topbarAsideClose = $('#m_detail_sidebar_close');
  var topbarAsideToggle = $('#m_detail_sidebar_toggle');
  var topbarAsideContent = topbarAside.find('.m-quick-sidebar__content');

  var initFilter = function () {
    // init dropdown tabbable content
    var init = function () {
      var filter = $('#m_detail_sidebar_tabs_blocklog_filter');
      var height =
        // mUtil.getViewPort().height - topbarAsideTabs.outerHeight(true) - 60;
        mUtil.getViewPort().height - topbarAsideTabs.outerHeight(true) - topbarAsideFooter.outerHeight(true) - 50;

      // init settings scrollable content
      filter.css('height', height);
      mApp.initScroller(filter, {});
    };

    init();

    // reinit on window resize
    mUtil.addResizeHandler(init);
  };

  var initOffcanvasTabs = function () {
    initFilter();
  };

  var initOffcanvas = function () {
    topbarAside.mOffcanvas({
      class: 'm-quick-sidebar',
      // overlay: false,
      overlay: true,
      close: topbarAsideClose,
      toggle: topbarAsideToggle
    });

    // run once on first time dropdown shown
    topbarAside.mOffcanvas().on('afterShow', function () {
      mApp.block(topbarAside);

      setTimeout(function () {
        mApp.unblock(topbarAside);

        topbarAsideContent.removeClass('m--hide');

        initOffcanvasTabs();
      }, 1000);
    });

    topbarAside.mOffcanvas().on('afterHide', function () {
      topbarAsideContent.addClass('m--hide');
    });
  };

  return {
    init: function () {
      initOffcanvas();
    }
  };
}();

jQuery(document).ready(function () {
  BlockMonitor.init();
});
