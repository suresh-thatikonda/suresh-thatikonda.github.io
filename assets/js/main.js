!(function($) {
  "use strict";
  var sectionTimer;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sections = Array.from(document.querySelectorAll('body > section'));
  function setMenu(open, restoreFocus) {
    $('body').toggleClass('mobile-nav-active', open);
    $('.mobile-nav-toggle').attr('aria-expanded', String(open));
    $('.mobile-nav-toggle i').toggleClass('icofont-close', open).toggleClass('icofont-navigation-menu', !open);
    $('.mobile-nav-overly').toggle(open);
    $('.mobile-nav').attr('aria-hidden', String(!open)).prop('inert', !open);
    if (restoreFocus) $('.mobile-nav-toggle').trigger('focus');
  }
  function resolveTarget(hash) {
    var id;
    try { id = decodeURIComponent((hash || '#header').slice(1)); } catch (_) { return null; }
    var target = document.getElementById(id);
    return target && (id === 'header' || sections.indexOf(target) !== -1) ? target : null;
  }
  function showSection(target, focus) {
    clearTimeout(sectionTimer);
    setMenu(false, false);
    var home = target.id === 'header';
    var delayed = !home && !$('#header').hasClass('header-top') && !reducedMotion;
    $('#header').toggleClass('header-top', !home);
    $('.nav-menu a, .mobile-nav a').each(function() {
      var active = this.hash === '#' + target.id;
      $(this).closest('li').toggleClass('active', active);
      if (active) this.setAttribute('aria-current', 'page');
      else this.removeAttribute('aria-current');
    });
    sections.forEach(function(section) {
      section.classList.remove('section-show');
      section.inert = true;
      section.setAttribute('aria-hidden', 'true');
    });
    function reveal() {
      if (!home) {
        target.classList.add('section-show');
        target.inert = false;
        target.setAttribute('aria-hidden', 'false');
      }
      if (focus) {
        var destination = home ? document.querySelector('#header h1 a') : target;
        if (!home) destination.setAttribute('tabindex', '-1');
        destination.focus({preventScroll: true});
      }
    }
    if (delayed) sectionTimer = setTimeout(reveal, 350);
    else reveal();
    window.scrollTo({top: 0, behavior: reducedMotion ? 'auto' : 'smooth'});
  }
  if ($('.nav-menu').length) {
    var mobile = $('.nav-menu').clone().prop({class: 'mobile-nav d-lg-none', id: 'mobile-navigation'});
    mobile.attr('aria-label', 'Mobile navigation');
    $('body').append(mobile);
    $('body').prepend('<button type="button" class="mobile-nav-toggle d-lg-none" aria-label="Toggle navigation" aria-controls="mobile-navigation" aria-expanded="false"><i class="icofont-navigation-menu" aria-hidden="true"></i></button>');
    $('body').append('<div class="mobile-nav-overly" aria-hidden="true"></div>');
    setMenu(false, false);
    $(document).on('click', '.mobile-nav-toggle', function() {
      var open = !$('body').hasClass('mobile-nav-active');
      setMenu(open, false);
      if (open) $('.mobile-nav a').first().trigger('focus');
    });
    $(document).on('click', function(event) {
      if (!$(event.target).closest('.mobile-nav, .mobile-nav-toggle').length) {
        setMenu(false, $(event.target).hasClass('mobile-nav-overly'));
      }
    });
    $(document).on('keydown', function(event) {
      if (event.key === 'Escape' && $('body').hasClass('mobile-nav-active')) setMenu(false, true);
    });
    window.addEventListener('resize', function() {
      if (window.matchMedia('(min-width: 992px)').matches) setMenu(false, false);
    });
  }
  $(document).on('click', '.nav-menu a, .mobile-nav a', function(event) {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button > 0) return;
    if (location.pathname !== this.pathname || location.hostname !== this.hostname) return;
    var target = resolveTarget(this.hash);
    if (!target) return;
    event.preventDefault();
    if (location.hash !== this.hash) history.pushState(null, '', this.hash);
    showSection(target, true);
  });
  function restoreSection() { showSection(resolveTarget(location.hash) || document.getElementById('header'), false); }
  window.addEventListener('popstate', restoreSection);
  window.addEventListener('hashchange', restoreSection);
  restoreSection();
  if (!reducedMotion) $('[data-toggle="counter-up"]').counterUp({delay: 10, time: 1000});
  $('.skills-content').waypoint(function() {
    $('.progress .progress-bar').each(function() {
      $(this).css('width', $(this).attr('aria-valuenow') + '%');
    });
  }, {offset: '80%'});
})(jQuery);
