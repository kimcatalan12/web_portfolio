document.querySelectorAll('#nav-tab>[data-bs-toggle="tab"]').forEach(el => {
    el.addEventListener('shown.bs.tab', () => {
      const target = el.getAttribute('data-bs-target')
      const scrollElem = document.querySelector(`${target} [data-bs-spy="scroll"]`)
      bootstrap.ScrollSpy.getOrCreateInstance(scrollElem).refresh()
    })
})

$(document).ready(function () {
    
    const date = new Date().getFullYear();

    $("#date").text(date + " KIM CATALAN. ALL RIGHTS RESERVED.");
    
    $(window).on('scroll', function () {
        var scrollPos = $(document).scrollTop();
        var sections = ['#scrollspyHeading1', '#scrollspyHeading2', '#scrollspyHeading3', '#scrollspyHeading4', '#scrollspyHeading5'];
        var navbarLinks = $('#navbarheading a');
        
        sections.forEach(function(section, index) {
          var currSection = $(section);
          var sectionOffset = currSection.offset().top;
          
          if (scrollPos >= sectionOffset - 50 && scrollPos < sectionOffset + currSection.outerHeight()) {
            navbarLinks.removeClass('active');
            navbarLinks.eq(index).addClass('active');
          }
        });
      });
});

