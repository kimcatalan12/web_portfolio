$(document).ready(function () {
    
  const date = new Date().getFullYear();

  $("#date").text(date + " KIM CATALAN. ALL RIGHTS RESERVED.");
  
  function toggleScrollSpy() {
    var windowWidth = $(window).width();
    var scrollElement = $('[data-bs-spy="scroll"]');
    var navLinks = $('#navbarheading a'); // Adjust selector to match your nav links
  
    if (windowWidth > 768) {
      scrollElement.scrollspy('refresh'); // Enable Scrollspy if under 768px
    } else {
      scrollElement.scrollspy('dispose'); // Disable Scrollspy if over 768px
      navLinks.removeClass('active'); // Remove 'active' class from nav links
    }
  }
  
  // Run on page load and on window resize
  $(document).ready(toggleScrollSpy);
  $(window).resize(toggleScrollSpy);
});

