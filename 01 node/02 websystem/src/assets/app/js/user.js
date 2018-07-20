var User = (function() {
  var modifyUserSidebar = $('#modify_user_sidebar');
  var modifyUserSidebarTabs = $('#modify_user_sidebar_tabs');
  var modifyUserSidebarFooter = $('#modify_user_sidebar_footer');
  var modifyUserSidebarClose = $('#modify_user_sidebar_close');
  var modifyUserSidebarClose2 = $('#modify_user_sidebar_close2');
  var btnModifySidebarCancle = $('#btn_modify_sidebar_cancle');
  var btnModifySidebarCancle2 = $('#btn_modify_sidebar_cancle2');
  var modifyUserSidebarToggle = $('#modify_user_sidebar_toggle');
  var modifyUserSidebarContent = modifyUserSidebar.find('.m-quick-sidebar__content');

  
  var addUserSidebar = $('#add_user_sidebar');
  var addUserSidebarTabs = $('#add_user_sidebar_tabs');
  var addUserSidebarFooter = $('#add_user_sidebar_footer');
  var addUserSidebarClose = $('#add_user_sidebar_close');
  var btnAddSidebarCancle = $('#btn_add_sidebar_cancle');
  var addUserSidebarToggle = $('#add_user_sidebar_toggle');
  var addUserSidebarContent = addUserSidebar.find('.m-quick-sidebar__content');

  var initFilter = function() {
    // init dropdown tabbable content
    var init = function() {
    //   var filterModify = $('#modify_user_sidebar_tab_check_password');
    //   var modifyHeight =
    //     mUtil.getViewPort().height - modifyUserSidebarTabs.outerHeight(true) - 60;
    // //     mUtil.getViewPort().height - modifyUserSidebarTabs.outerHeight(true) - modifyUserSidebarFooter.outerHeight(true) - 50;
    // //   // init settings scrollable content
    //   filterModify.css('height', height);
    //   mApp.initScroller(filterModify, {});
    };

    init();

    // reinit on window resize
    mUtil.addResizeHandler(init);
  };

  var initOffcanvasTabs = function() {
    initFilter();
  };

  var initOffcanvas = function() {

    /* modify user sidebar */
    /* modify user sidebar */
    /* modify user sidebar */
    modifyUserSidebar.mOffcanvas({
      class: 'm-quick-sidebar',
      overlay: true,
      close: modifyUserSidebarClose,
      toggle: modifyUserSidebarToggle
    });

    btnModifySidebarCancle.on('click', function() {
      modifyUserSidebarClose.trigger('click');
    });

    btnModifySidebarCancle2.on('click', function() {
      modifyUserSidebarClose.trigger('click');
    });

    modifyUserSidebarClose2.on('click', function() {
      modifyUserSidebarClose.trigger('click');
    });
    
    // run once on first time dropdown shown
    modifyUserSidebar.mOffcanvas().on('afterShow', function() {
      mApp.block(modifyUserSidebar);

      setTimeout(function() {
        mApp.unblock(modifyUserSidebar);

        modifyUserSidebarContent.removeClass('m--hide');

        initOffcanvasTabs();
      }, 1000);
    });

    modifyUserSidebar.mOffcanvas().on('afterHide', function() {
      modifyUserSidebarContent.addClass('m--hide');
    });


    /* add user sidebar */
    /* add user sidebar */
    /* add user sidebar */
    addUserSidebar.mOffcanvas({
      class: 'm-quick-sidebar',
      overlay: true,
      close: addUserSidebarClose,
      toggle: addUserSidebarToggle
    });

    btnAddSidebarCancle.on('click', function() {
      addUserSidebarClose.trigger('click');
    });

    // run once on first time dropdown shown
    addUserSidebar.mOffcanvas().on('afterShow', function() {
      mApp.block(addUserSidebar);

      setTimeout(function() {
        mApp.unblock(addUserSidebar);

        addUserSidebarContent.removeClass('m--hide');

        initOffcanvasTabs();
      }, 1000);
    });

    addUserSidebar.mOffcanvas().on('afterHide', function() {
      addUserSidebarContent.addClass('m--hide');
    });

  };

  return {
    init: function() {
      initOffcanvas();
    }
  };
})();

jQuery(document).ready(function() {
  User.init();
});
