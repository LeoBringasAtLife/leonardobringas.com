    const allLinks   = document.querySelectorAll('[data-view]');
    const allViews   = document.querySelectorAll('.view');
    const navLinks   = document.querySelectorAll('.top nav .nav-link');
    const brandLink  = document.querySelector('.nav-brand');


    function showView(viewId) {
      allViews.forEach(v => v.classList.remove('active'));

 
      const target = document.getElementById('view-' + viewId);
      if (target) target.classList.add('active');


      navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.view === viewId);
      });


      window.scrollTo({ top: 0, behavior: 'smooth' });
      history.pushState({ view: viewId }, '', '#' + viewId);
    }


    allLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        showView(link.dataset.view);
      });
    });


    brandLink.addEventListener('click', e => {
      e.preventDefault();
      showView('home');
    });


    window.addEventListener('popstate', e => {
      const state = e.state && e.state.view ? e.state.view : 'home';
      showView(state);
    });


    (function init() {
      const hash = window.location.hash.replace('#', '');
      const validViews = ['home', 'article', 'about'];
      if (hash && validViews.includes(hash)) {
        showView(hash);
      } else {
        showView('home');
      }
    })();