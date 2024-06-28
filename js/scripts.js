 //Thank you to Dennis Snellenberg (https://dennissnellenberg.com/) for large parts of this code 
 
 gsap.registerPlugin(ScrollTrigger, CustomEase)
  CustomEase.create("custom-ease", ".9, .1, .1, .9");

  let scroll;
  let transitionOffset = 1000;

  initPageTransitions();

  function initLoader() {
    let tl = gsap.timeline();

    tl.call(function () {
      pageTransitionOutHome();
      scroll.start();
    }, null, .1);

  }

  function pageTransitionIn() {
    let tl = gsap.timeline();
    tl.set(".page-transition .transition-overlay", {
      yPercent: "0%",
      top: "auto",
      bottom: "0",
    });
    tl.to(".quickbar", {
      duration: .7,
      ease: "custom-ease",
      y: "-100%",
      autoAlpha: 0,
    });
    tl.to(".page-transition .transition-overlay:nth-of-type(3)", {
      duration: .7,
      height: "100%",
      ease: "custom-ease",
    }, 0);

    tl.to(".page-transition .transition-overlay:nth-of-type(2)", {
      duration: .7,
      height: "100%",
      ease: "custom-ease",
    }, 0.1);
    tl.to(".page-transition .transition-overlay:nth-of-type(1)", {
      duration: .7,
      height: "100%",
      ease: "custom-ease",
    }, 0.2);
    tl.call(function () {
      scroll.stop();
    }, null, 0);
  }

  function pageTransitionOut() {
    let tl = gsap.timeline();
    tl.call(function () {
      scroll.start();
    }, null, 0);

    tl.set(".quickbar", {
      y: "100%",
      autoAlpha: 0,
    });

    tl.set(".page-transition .transition-overlay", {
      yPercent: "100%",
      top: "0",
      bottom: "auto",
    });

    tl.to(".page-transition .transition-overlay:nth-of-type(1)", {
      duration: .7,
      height: "0%",
      ease: "custom-ease",
    });

    tl.to(".page-transition .transition-overlay:nth-of-type(2)", {
      duration: .7,
      height: "0%",
      ease: "custom-ease",
    }, 0.1);
    tl.to(".page-transition .transition-overlay:nth-of-type(3)", {
      duration: .7,
      height: "0%",
      ease: "custom-ease",
    }, 0.2);
    tl.to(".quickbar", {
      duration: 1,
      y: "0%",
      ease: "Expo.EaseOut",
      autoAlpha: 1,
    }, 0.4);
  }

  function pageTransitionOutHome() {
    let tl = gsap.timeline();
    tl.call(function () {
      scroll.start();
    }, null, 0);

    tl.set(".quickbar", {
      y: "100%",
      autoAlpha: 0,
    });

    tl.set(".page-transition .transition-overlay", {
      yPercent: "100%",
      top: "0",
      bottom: "auto",
    });

    tl.to(".page-transition .transition-overlay:nth-of-type(1)", {
      duration: .7,
      height: "0%",
      ease: "custom-ease",
    });

    tl.to(".page-transition .transition-overlay:nth-of-type(2)", {
      duration: .7,
      height: "0%",
      ease: "custom-ease",
    }, 0.1);
    tl.to(".page-transition .transition-overlay:nth-of-type(3)", {
      duration: .7,
      height: "0%",
      ease: "custom-ease",
    }, 0.2);
    tl.to(".quickbar", {
      duration: 1,
      y: "0%",
      ease: "Expo.EaseOut",
      autoAlpha: 1,
    }, 0.4);
    tl.from("header .header-bg", {
      duration: 2.2,
      scale: "1.1",
      ease: "custom-ease",
    }, 0);
  }



  function initPageTransitions() {

    history.scrollRestoration = "manual";


    barba.hooks.beforeLeave(() => {
      document.querySelector('html').classList.add('is-trans');
    });
    barba.hooks.after(() => {
      document.querySelector('html').classList.remove('is-trans');
    });

    barba.hooks.afterEnter(() => {
      // Scrollen Sie zum Seitenanfang, wenn keine interne Verlinkung vorliegt
      window.scrollTo(0, 0);
      ScrollTrigger.refresh();

      const htmlElement = document.querySelector('html');
      if (htmlElement.classList.contains('open-navi')) {
        htmlElement.classList.remove('open-navi');
      }



      // Überprüfen, ob die neue URL einen internen Link enthält
      if (window.location.hash) {
        const targetId = window.location.hash.substring(1); // Ziel-ID extrahieren
        const targetElement = document.getElementById(targetId); // Ziel-Element abrufen
        if (targetElement) {
          targetElement.scrollIntoView({
            block: 'start',
          });
          console.log(`Scrolling to anchor ${targetId}`);

          // Überprüfen, ob das Ziel-Element das Attribut [data-trans-id] enthält
          if (targetElement.hasAttribute('data-trans-id')) {
            const offset = window.innerHeight * 0.75; // 75vh Offset
            window.scrollBy(0, offset);
            console.log(`Scrolling 75vh down from the top of [data-trans-id] section`);
          }

          // Aktualisieren von LazyLoad und ScrollTrigger
          return; // Beenden Sie die Funktion, wenn das Scrollen zum Ankerziel erfolgt ist
        }
      }


    });



    barba.init({
      prevent: ({
        el
      }) => {
        return el.tagName === 'A' && el.getAttribute('href').startsWith('#');
      },
      sync: true,
      debug: true,
      timeout: 7000,
      transitions: [{
        name: 'home',
        from: {

        },
        to: {
           namespace: ['home']
        },
        once(data) {
          initSmoothScroll(data.next.container);
          initScript();
          initLoader();
        },
        async leave(data) {
          pageTransitionIn(data.current);
          await delay(transitionOffset);
          scroll.destroy();
          data.current.container.remove();
        },
        async enter(data) {
          pageTransitionOutHome(data.next);
        },
        async beforeEnter(data) {
          ScrollTrigger.getAll().forEach(t => t.kill());
          initSmoothScroll(data.next.container);
          initScript();

        }
      },
      {
          name: 'default',
          once(data) {
            initSmoothScroll(data.next.container);
            initScript();
            initLoader();
          },
          async leave(data) {
            pageTransitionIn(data.current);
            await delay(transitionOffset);
            scroll.destroy();
            data.current.container.remove();
          },
          async enter(data) {
            pageTransitionOut(data.next);
          },
          async beforeEnter(data) {
            ScrollTrigger.getAll().forEach(t => t.kill());
            initSmoothScroll(data.next.container);
            initScript();

          }
        },
        {
          name: 'self',
          async leave(data) {
            pageTransitionIn(data.current);
            await delay(transitionOffset);
            scroll.destroy();
            data.current.container.remove();
          },
          async enter(data) {
            pageTransitionOut(data.next);
          },
          async beforeEnter(data) {
            ScrollTrigger.getAll().forEach(t => t.kill());
            initSmoothScroll(data.next.container);
            initScript();
          }
        },
      ]
    });


    function initSmoothScroll(container) {

      initLenis();

      function raf(time) {
        scroll.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      ScrollTrigger.refresh();
    }



  }


  function initLenis() {
    scroll = new Lenis({
      duration: 1.2,
    })

    scroll.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      scroll.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
      });
    });


    // Textarea-Element auswählen
    const textarea = document.querySelector('textarea');

    // Überprüfen, ob ein Textarea-Element vorhanden ist
    if (textarea) {
      // Event-Listener hinzufügen, der bei Änderungen im Textarea aufgerufen wird
      textarea.addEventListener('input', function () {
        // Überprüfen, ob das Scrollen notwendig ist
        if (textarea.scrollHeight > textarea.clientHeight) {
          // Scrollbalken vorhanden, data-lenis-prevent hinzufügen
          textarea.setAttribute('data-lenis-prevent', '');
        } else {
          // Kein Scrollbalken vorhanden, data-lenis-prevent entfernen (falls vorhanden)
          textarea.removeAttribute('data-lenis-prevent');
        }
      });
    }

  }

  function delay(n) {
    n = n || 2000;
    return new Promise((done) => {
      setTimeout(() => {
        done();
      }, n);
    });
  }


  /**
   * Fire all scripts on page load
   */
  function initScript() {
    addOnScreen();
    lazyLoadImagesAndRefreshScrollTrigger();
    initScrollTriggerParallaxScroll();
    initializeGSAPAnimations();
    marquee();
    naviToggle();
    // checkDeviceOrientation();
    scrollDirection();
    htmlFixed();
  }

function marquee() {
  $('[data-marquee-target]').each(function () {

    let marquee = $(this);

    let marqueeItemsWidth = marquee.find(".marquee-content").width();
    let marqueeSpeed = marquee.attr('data-marquee-speed') * (marqueeItemsWidth / $(window)
      .width());

    // Duplicate .marquee-content
    if (marquee.attr('data-marquee-duplicate') == "3") {
      // Custom function to clone / append 3x
      for (var i = 0; i < 3; i++) {
        var clonedMarqueeContent = marquee.find(".marquee-content").clone();
        marquee.find(".marquee-scroll").append(clonedMarqueeContent);
      }
    } else {
      var clonedMarqueeContent = marquee.find(".marquee-content").clone();
      marquee.find(".marquee-scroll").append(clonedMarqueeContent);
    }

    // Speed up Marquee on Tablet & Mobile
    if ($(window).width() <= 540) {
      marqueeSpeed = marqueeSpeed * 0.25;
    } else if ($(window).width() <= 1024) {
      marqueeSpeed = marqueeSpeed * 0.5;
    }

    let marqueeDirection;
    if (marquee.attr('data-marquee-direction') == 'right') {
      marqueeDirection = -1;
    } else {
      marqueeDirection = 1;
    }

    let marqueeContent = gsap.to(marquee.find('.marquee-content'), {
      xPercent: -100,
      repeat: -1,
      duration: marqueeSpeed,
      ease: "linear",
      paused: true
    }).totalProgress(0.5);

    gsap.set(marquee.find(".marquee-content"), { xPercent: 50 });

    ScrollTrigger.create({
      trigger: marquee,
      start: "top bottom",
      end: "bottom top",
      onUpdate(self) {
        if (self.direction !== marqueeDirection) {
          marqueeDirection *= -1;
          if (marquee.attr('data-marquee-direction') == 'right') {
            gsap.to([marqueeContent], {
              timeScale: (marqueeDirection * -1),
              overwrite: true
            });
          } else {
            gsap.to([marqueeContent], { timeScale: marqueeDirection, overwrite: true });
          }
        }
        self.direction === -1 ? marquee.attr('data-marquee-status', 'normal') : marquee
          .attr('data-marquee-status', 'inverted');
      },
      onEnter: () => marqueeContent.play(),
 
    });

    // Extra speed on scroll
    marquee.each(function () {

      let triggerElement = $(this);
      let targetElement = $(this).find('.marquee-scroll');
      let marqueeScrollSpeed = $(this).attr('data-marquee-scroll-speed');

      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: $(this),
          start: "0% 100%",
          end: "100% 0%",
          scrub: 0
        }
      });

      if (triggerElement.attr('data-marquee-direction') == 'left') {
        tl.fromTo(targetElement, {
          x: marqueeScrollSpeed + "vw",
        }, {
          x: marqueeScrollSpeed * -1 + "vw",
          ease: "none"
        });
      }

      if (triggerElement.attr('data-marquee-direction') == 'right') {
        tl.fromTo(targetElement, {
          x: marqueeScrollSpeed * -1 + "vw",
        }, {
          x: marqueeScrollSpeed + "vw",
          ease: "none"
        });
      }
    });
  });
}

/**
* GSAP Scrolltrigger Parallax Scroll
*/
function initScrollTriggerParallaxScroll() {


        if(document.querySelector('[data-parallax-strength]')) {
           $('[data-parallax-strength]').each(function () {
              
              let tl;
              let triggerElement = $(this);
              let targetElement = $(this).find('[data-parallax-target]');
              let triggerElementID = $(this).attr('data-parallax-trigger');
              let targetElementParallax = ($(this).attr('data-parallax-strength') * 20);
              let heightElementParallax = ($(this).attr('data-parallax-height') * 20);
              $(this).css("--parallax-strength", " " + targetElementParallax + "%");
              $(this).css("--parallax-height", " " + heightElementParallax + "%");

              
              // Check if [data-parallax-trigger="#header"] exists
              if ($(triggerElementID).length !== 0) {
                 triggerElement = $(document).find(triggerElementID);
              }
              
              tl = gsap.timeline({
                 scrollTrigger: {
                    trigger: triggerElement,
                    start: "0% 100%",
                    end: "100% 0%",
                    scrub: true,
                    markers: false
                 }
              });

              tl.set(targetElement, {
                 rotate: 0.001,
              });

              // if ($(this).attr('data-parallax-position') == 'top') {}

              tl.fromTo(targetElement, {
                 yPercent: (targetElementParallax * -0.5)
              }, {
                 yPercent: (targetElementParallax * 0.5),
                 ease: "none"
              });

           });
        }
     
}



  function lazyLoadImagesAndRefreshScrollTrigger() {
    
    var lazyLoadInstance = new LazyLoad({
      threshhold: 100,
      callback_loaded: function (element) {
        ScrollTrigger.refresh();
      }
    });
  }


  function addOnScreen() {
    function addOnScreenClass() {
      const elementsWithFade = document.querySelectorAll('[data-lazy-animation]');
      elementsWithFade.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (
          rect.bottom > 50 && // Änderung hier: Prüfe, ob das Element mindestens 50px unterhalb des Viewports liegt
          rect.right > 0 &&
          rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
          rect.top < (window.innerHeight || document.documentElement.clientHeight)
        ) {
          element.classList.add('on-screen');
        }
      });
  
      const lazyTriggers = document.querySelectorAll('[data-lazy-trigger]');
      lazyTriggers.forEach(trigger => {
        const targetSelector = trigger.getAttribute('data-lazy-trigger');
        if (targetSelector) {
          const targetElement = document.querySelector(targetSelector);
          if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            if (
              rect.bottom > 50 && // Änderung hier: Prüfe, ob das Element mindestens 50px unterhalb des Viewports liegt
              rect.right > 0 &&
              rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
              rect.top < (window.innerHeight || document.documentElement.clientHeight)
            ) {
              trigger.classList.add('on-screen');
            }
          }
        }
      });
    }
  

      window.addEventListener('scroll', addOnScreenClass);
      const observer = new MutationObserver(function () {
        addOnScreenClass();
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
  }
  

  // function initializeJarallaxScrolling() {
  //   jarallax(document.querySelectorAll('.jarallax'), {
  //     speed: 0.6,
  //   });
  // }



  function scrollDirection() {
    const bodyElement = document.body;

    function ScrollDir(elm) {
      let lastScrollTop = 0;

      document.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
          elm.classList.remove('scrolling-up');
          elm.classList.add('scrolling-down');
        } else if (scrollTop < lastScrollTop) {
          elm.classList.remove('scrolling-down');
          elm.classList.add('scrolling-up');
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      });
    }
    ScrollDir(bodyElement);
  }

  function naviToggle() {
    const naviToggleElements = document.querySelectorAll('[data-toggle-nav]');
    naviToggleElements.forEach(function (naviToggleElement) {
      naviToggleElement.addEventListener("click", function () {
        var naviElement = document.querySelector('html');
        naviElement.classList.toggle("open-navi");
        setTimeout(function () {
          naviElement.classList.add("is-transitioning");
          setTimeout(function () {
            naviElement.classList.remove("is-transitioning");
          }, 800);
        });
      });
    });
  }
  function htmlFixed() {
    var e = document.documentElement.scrollTop,
      d = document.querySelector("html");
    50 < e && d.classList.add("fixed"),
      window.addEventListener("scroll", function (e) {
        var t = document.documentElement.scrollTop;
        document.querySelector("html").classList.contains("edge") && (t = document.querySelector("html").scrollTop),
          50 < t ? d.classList.add("fixed") : d.classList.remove("fixed")
      })
  }

  function initializeGSAPAnimations() {

    // GSAP Start

    //GSAP Mobile Start
    ScrollTrigger.matchMedia({
      ///GSAP  Mobile START

      "(max-width: 760px)": function () {


       
      },
      ///GSAP  Mobile END

      ///GSAP  Desktop
      "(min-width: 760px)": function () {

      },
      ///GSAP  Desktop END

      // GSAP All
      "all": function () {

        gsap.timeline({
            scrollTrigger: {
              trigger: ".index-header",
              start: "top top",
              end: "bottom top",
              scrub: true ,
            }
          })
          .to('.index-header .claim', {
            y: "75%",
          });
          gsap.timeline({
            scrollTrigger: {
              trigger: ".sec-1",
              start: "top bottom",
              end: "center top",
              scrub: true,
            }
          })
          .from('.sec-1 .wenn-ct ', {
            x: "-5%",
          },0)
          .from('.sec-1 .wenn-ct span:nth-of-type(2)', {
            paddingLeft: 0,
          },0)
          .from('.sec-1 .wenn-ct span:nth-of-type(3)', {
            paddingLeft: 0,
          }, 0)
          .from('.sec-1 .gradient-ct.blue', {
            x: "50%",
            y: "-50%",
            scale: "1.1",
          }, 0)
          .from('.sec-1 .gradient-ct.pink', {
            x: "75%",
            y: "-25%",
            scale: "1.1",
          }, 0);
          gsap.timeline({
            scrollTrigger: {
              trigger: ".sec-2-scroll-wrap",
              start: "top bottom",
              end: "bottom bottom",
              scrub: true,
            }
          })
          .from('.sec-2-scroll-wrap .name', {
            y: "20%",
            scale: "0.9",
            rotateX: "-90deg",
  
          })
          .to('.sec-2-scroll-wrap .name', {
            letterSpacing: "0em",
          }, 0)
          .from('.sec-2-scroll-wrap .bg-imgs-ct', {
            scale: 1.4,
          }, 0)
          .to('.sec-2', {
            pointerEvents: "auto",
          }, 0);
  
          gsap.timeline({
            scrollTrigger: {
              trigger: ".sec-2-scroll-wrap",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            }
          })
          .to('.sec-2-scroll-wrap .imgs-row.first', {
            y: "-20%",
          }, 0)
          .to('.sec-2-scroll-wrap .imgs-row.second', {
            y: "20%",
          }, 0)
          .to('.sec-2-scroll-wrap .imgs-row.third', {
            y: "-20%",
          }, 0);
      }
      // GSAP All END

    });
  }


  // function checkDeviceOrientation() {
  //   // Code to check device orientation...
  //   function checkOrientation() {
  //     const body = document.querySelector("body");
  //     if (window.matchMedia("(orientation: portrait)").matches) {
  //       body.classList.remove("landscape");
  //       body.classList.add("portrait");
  //     } else {
  //       body.classList.remove("portrait");
  //       body.classList.add("landscape");
  //     }
  //   }

  //   // Event-Listener für Änderungen der Bildschirmausrichtung
  //   window.addEventListener("orientationchange", checkOrientation);

  //   // Event-Listener für Änderungen der Fenstergröße
  //   window.addEventListener("resize", checkOrientation);

  //   // Überprüfen der Bildschirmausrichtung beim Laden der Seite
  //   checkOrientation();
  // }
  