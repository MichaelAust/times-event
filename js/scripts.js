 //Thank you to Dennis Snellenberg (https://dennissnellenberg.com/) for large parts of this code 

 gsap.registerPlugin(ScrollTrigger, CustomEase);
 gsap.registerPlugin(MotionPathPlugin);
 CustomEase.create("custom-ease", ".9, .1, .1, .9");

 let scroll;
 let transitionOffset = 1000;

 initPageTransitions();

 function initLoader() {
   let tl = gsap.timeline();
   tl.set(".logo-sec", {
     opacity: 0,
   });
   tl.set(".logo-sec .img-mark .triangle:first-of-type", {
     y: "-20%",
   });
   tl.set(".logo-sec .img-mark .triangle:last-of-type", {
     y: "20%",
   });
   tl.set(".logo-sec .name", {
    letterSpacing: "0em",
  });
   tl.to(".logo-sec", {
     opacity: 1,
     duration: 2.5,
     ease: "custom-ease"
   });
   tl.to(".logo-sec .img-mark .triangle:first-of-type", {
     y: "0%",
     duration: 2.5,
     ease: "custom-ease"
   }, 0);
   tl.to(".logo-sec .img-mark .triangle:last-of-type", {
     y: "0%",
     duration: 2.5,
     ease: "custom-ease"
   }, 0);
   tl.to(".logo-sec .name", {
     letterSpacing: "-0.04em",
     duration: 2.5,
     ease: "custom-ease"

   },0);
   tl.to(".logo-sec", {
    autoAlpha: 0,
    duration: .4,
  });

  tl.call(function () {
    scroll.stop();
  }, null, 2.5);
   tl.call(function () {
     pageTransitionOut();
   }, null, 2.5);

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
   tl.to(".page-transition .transition-overlay:nth-of-type(2)", {
     duration: .7,
     height: "100%",
     ease: "custom-ease",
   }, 0);
   tl.to(".page-transition .transition-overlay:nth-of-type(1)", {
     duration: .7,
     height: "100%",
     ease: "custom-ease",
   }, 0.1);

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
   
   tl.to(".page-transition", {
    duration: .7,
    height: "0%",
    ease: "custom-ease",
  }, 0.1);
   tl.to(".quickbar", {
     duration: 1,
     y: "0%",
     ease: "custom-ease",
     autoAlpha: 1,
   }, 0.1);

  if(document.querySelector('.fade-in')) {
    tl.fromTo(".fade-in", {
       y: "60%",
    }, {
      y: "0%",
      duration: 2,
       ease: "expo.EaseOut",
    }, "<");
  };
  if(document.querySelector('.sub-claim')) {
    tl.fromTo(".sub-claim span", {
       y: "100%",
       opacity: 0,
    }, {
      y: "0%",
      opacity: 1,
      duration: 2,
      ease: "Expo.easeOut",
      stagger: 0.03,
    }, 0.4);
  }

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
     duration: 1.25,
   })

   scroll.on('scroll', ScrollTrigger.update);

   gsap.ticker.add((time) => {
     scroll.raf(time * 1000);
   });

   gsap.ticker.lagSmoothing(0);

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
   scrollDirection();
   htmlFixed();
   initScrollToAnchorLenis();
   initSwiper();
   followCursor();
   clipboardCopy();
   orientationCheck();
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

     gsap.set(marquee.find(".marquee-content"), {
       xPercent: 50
     });

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
             gsap.to([marqueeContent], {
               timeScale: marqueeDirection,
               overwrite: true
             });
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


   if (document.querySelector('[data-parallax-strength]')) {
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
     threshhold: 200,
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


       const gebiet1 = document.querySelector(".gebiet-ct:nth-of-type(1)");
       const gebiet2 = document.querySelector(".gebiet-ct:nth-of-type(2)");
       const gebiet3 = document.querySelector(".gebiet-ct:nth-of-type(3)");
       const gebiet4 = document.querySelector(".gebiet-ct:nth-of-type(4)");
       const gebiet5 = document.querySelector(".gebiet-ct:nth-of-type(5)");
       const gebiet6 = document.querySelector(".gebiet-ct:nth-of-type(6)");

       const tl = gsap.timeline({
         defaults: {
           ease: "none"
         }
       });
       gsap.set(gebiet1, {
         motionPath: {
           path: "#motionPath",
           align: "#motionPath",
           alignOrigin: [0.5, 0.5],
           autoRotate: true,
           start: 0,
           end: 1,
         }
       });

       gsap.set(gebiet2, {
         motionPath: {
           path: "#motionPath",
           align: "#motionPath",
           alignOrigin: [0.5, 0.5],
           autoRotate: true,
           start: 0,
           end: 1,
         }
       });

       gsap.set(gebiet3, {
         motionPath: {
           path: "#motionPath",
           align: "#motionPath",
           alignOrigin: [0.5, 0.5],
           autoRotate: true,
           start: 0,
           end: 1,
         }
       });

       gsap.set(gebiet4, {
         motionPath: {
           path: "#motionPath",
           align: "#motionPath",
           alignOrigin: [0.5, 0.5],
           autoRotate: true,
           start: 0,
           end: 1,
         }
       });

       gsap.set(gebiet5, {
         motionPath: {
           path: "#motionPath",
           align: "#motionPath",
           alignOrigin: [0.5, 0.5],
           autoRotate: true,
           start: 0,
           end: 1,
         }
       });

       gsap.set(gebiet6, {
         motionPath: {
           path: "#motionPath",
           align: "#motionPath",
           alignOrigin: [0.5, 0.5],
           autoRotate: true,
           start: 0,
           end: 1,
         }
       });

       tl.to(gebiet1, {
           motionPath: {
             path: "#motionPath",
             align: "#motionPath",
             alignOrigin: [0.5, 0.5],
             autoRotate: true,
             start: 1,
             end: 0,
           },
           immediateRender: true,
         }, 0)
         .to(gebiet2, {
           motionPath: {
             path: "#motionPath",
             align: "#motionPath",
             alignOrigin: [0.5, 0.5],
             autoRotate: true,
             start: 1,
             end: 0,
           },
           immediateRender: true,
         }, 0.166)
         .to(gebiet3, {
           motionPath: {
             path: "#motionPath",
             align: "#motionPath",
             alignOrigin: [0.5, 0.5],
             autoRotate: true,
             start: 1,
             end: 0,
           },
           immediateRender: true,
         }, .333)
         .to(gebiet4, {
           motionPath: {
             path: "#motionPath",
             align: "#motionPath",
             alignOrigin: [0.5, 0.5],
             autoRotate: true,
             start: 1,
             end: 0,
           },
           immediateRender: true,
         }, .5)
         .to(gebiet5, {
           motionPath: {
             path: "#motionPath",
             align: "#motionPath",
             alignOrigin: [0.5, 0.5],
             autoRotate: true,
             start: 1,
             end: 0,
           },
           immediateRender: true,
         }, .666)
         .to(gebiet6, {
           motionPath: {
             path: "#motionPath",
             align: "#motionPath",
             alignOrigin: [0.5, 0.5],
             autoRotate: true,
             start: 1,
             end: 0,
           },
           immediateRender: true,
         }, .833);

       ScrollTrigger.create({
         trigger: ".sec-4-scroll-wrap",
         start: "top 30%",
         end: "bottom 70%",
         scrub: true,
         animation: tl,
       });


       gsap.timeline({
           scrollTrigger: {
             trigger: ".sec-5-scroll-wrap",
             start: "top bottom",
             end: "top center",
             scrub: true
           }
         })
         .to('.sec-5 .lines-ct', {
           width: "40.98rem",
           autoAlpha: 1,
         });


       gsap.timeline({
           scrollTrigger: {
             trigger: ".sec-5-scroll-wrap",
             start: "top+=75% center",
             end: "bottom center",
             scrub: true
           }
         })
         .to('.sec-5 .lines-ct', {
           autoAlpha: 0,
           y: "-10vh"
         });

       ///USP Lines Mobile Start
       gsap.timeline({
           scrollTrigger: {
             trigger: ".sec-5-scroll-wrap",
             start: "top center",
             end: "top+=27.5% center",
             scrub: true,

           }
         })
         .from('.usp-ct.one span', {
           opacity: 0,
           y: "17rem",
           stagger: 0.05,
         })
         .to('.usp-ct.one span', {
           opacity: 0,
           y: "-17rem",
           stagger: 0.05,
         })
         .from('.sec-5 .lines-ct .line.one .line-inner', {
           width: 0,
         }, 0);

       gsap.timeline({
           scrollTrigger: {
             trigger: ".sec-5-scroll-wrap",
             start: "top+=25% center",
             end: "top+=52.5% center",
             scrub: true,
           }
         })
         .from('.usp-ct.two span', {
           opacity: 0,
           y: "17rem",
           stagger: 0.05,
         })
         .to('.usp-ct.two span', {
           opacity: 0,
           y: "-17rem",
           stagger: 0.05,
         })
         .from('.sec-5 .lines-ct .line.two .line-inner', {
           width: 0,
         }, 0);

       gsap.timeline({
           scrollTrigger: {
             trigger: ".sec-5-scroll-wrap",
             start: "top+=50% center",
             end: "top+=77.5% center",
             scrub: true,
           }
         })
         .from('.usp-ct.three span', {
           opacity: 0,
           y: "17rem",
           stagger: 0.05, // Versatz zwischen den threen der einzelnen Elemente
         })
         .to('.usp-ct.three span', {
           opacity: 0,
           y: "-17rem",
           stagger: 0.05,
         })
         .from('.sec-5 .lines-ct .line.three .line-inner', {
           width: 0,
         }, 0);

       gsap.timeline({
           scrollTrigger: {
             trigger: ".sec-5-scroll-wrap",
             start: "top+=72.5% center",
             end: "bottom center",
             scrub: true,
           }
         })
         .from('.usp-ct.four span', {
           opacity: 0,
           y: "17rem",
           stagger: 0.05, // Versatz zwischen den fourn der einzelnen Elemente
         })
         .to('.usp-ct.four span', {
           opacity: 0,
           y: "-17rem",
           stagger: 0.05,
         })
         .from('.sec-5 .lines-ct .line.four .line-inner', {
           width: 0,
         }, 0);
       ///USP Lines Mobile End

       gsap.timeline({
           scrollTrigger: {
             trigger: ".sec-5-scroll-wrap",
             start: "top top",
             end: "bottom top",
             scrub: 2,
           }
         })
         .to('.sec-5 .gradient-ct.blue', {
           left: "50%",
           top: "35%",

         })
         .to('.sec-5 .gradient-ct.blue', {
           left: "-15%",
           top: "30%",
         })
         .to('.sec-5 .gradient-ct.pink', {
           left: "25%",
           top: "50%",

         }, 0)
         .to('.sec-5 .gradient-ct.pink', {
           left: "-10%",
           top: "50%",
         })

     },
     ///GSAP  Mobile END

     ///GSAP  Desktop
     "(min-width: 760px)": function () {

       const gebiet1 = document.querySelector(".gebiet-ct:nth-of-type(1)");
       const gebiet2 = document.querySelector(".gebiet-ct:nth-of-type(2)");
       const gebiet3 = document.querySelector(".gebiet-ct:nth-of-type(3)");
       const gebiet4 = document.querySelector(".gebiet-ct:nth-of-type(4)");
       const gebiet5 = document.querySelector(".gebiet-ct:nth-of-type(5)");
       const gebiet6 = document.querySelector(".gebiet-ct:nth-of-type(6)");

       const tl = gsap.timeline({
         defaults: {
           ease: "none"
         }
       });
       gsap.set(gebiet1, {
         motionPath: {
           path: "#motionPath",
           align: "#motionPath",
           alignOrigin: [0.5, 0.5],
           autoRotate: true,
           start: 0,
           end: 1,
         }
       });

       gsap.set(gebiet2, {
         motionPath: {
           path: "#motionPath",
           align: "#motionPath",
           alignOrigin: [0.5, 0.5],
           autoRotate: true,
           start: 0,
           end: 1,
         }
       });

       gsap.set(gebiet3, {
         motionPath: {
           path: "#motionPath",
           align: "#motionPath",
           alignOrigin: [0.5, 0.5],
           autoRotate: true,
           start: 0,
           end: 1,
         }
       });

       gsap.set(gebiet4, {
         motionPath: {
           path: "#motionPath",
           align: "#motionPath",
           alignOrigin: [0.5, 0.5],
           autoRotate: true,
           start: 0,
           end: 1,
         }
       });

       gsap.set(gebiet5, {
         motionPath: {
           path: "#motionPath",
           align: "#motionPath",
           alignOrigin: [0.5, 0.5],
           autoRotate: true,
           start: 0,
           end: 1,
         }
       });

       gsap.set(gebiet6, {
         motionPath: {
           path: "#motionPath",
           align: "#motionPath",
           alignOrigin: [0.5, 0.5],
           autoRotate: true,
           start: 0,
           end: 1,
         }
       });

       tl.to(gebiet1, {
           motionPath: {
             path: "#motionPath",
             align: "#motionPath",
             alignOrigin: [0.5, 0.5],
             autoRotate: true,
             start: 1,
             end: 0,
           },
           immediateRender: true,
         }, 0)
         .to(gebiet2, {
           motionPath: {
             path: "#motionPath",
             align: "#motionPath",
             alignOrigin: [0.5, 0.5],
             autoRotate: true,
             start: 1,
             end: 0,
           },
           immediateRender: true,
         }, 0.05)
         .to(gebiet3, {
           motionPath: {
             path: "#motionPath",
             align: "#motionPath",
             alignOrigin: [0.5, 0.5],
             autoRotate: true,
             start: 1,
             end: 0,
           },
           immediateRender: true,
         }, 0.1)
         .to(gebiet4, {
           motionPath: {
             path: "#motionPath",
             align: "#motionPath",
             alignOrigin: [0.5, 0.5],
             autoRotate: true,
             start: 1,
             end: 0,
           },
           immediateRender: true,
         }, 0.15)
         .to(gebiet5, {
           motionPath: {
             path: "#motionPath",
             align: "#motionPath",
             alignOrigin: [0.5, 0.5],
             autoRotate: true,
             start: 1,
             end: 0,
           },
           immediateRender: true,
         }, .2)
         .to(gebiet6, {
           motionPath: {
             path: "#motionPath",
             align: "#motionPath",
             alignOrigin: [0.5, 0.5],
             autoRotate: true,
             start: 1,
             end: 0,
           },
           immediateRender: true,
         }, .25);

       ScrollTrigger.create({
         trigger: ".sec-4-scroll-wrap",
         start: "top bottom+=40%",
         end: "bottom top-=40%",
         scrub: true,
         animation: tl,
       });

       gsap.timeline({
           scrollTrigger: {
             trigger: ".sec-5-scroll-wrap",
             start: "top center",
             end: "top top",
             scrub: true
           }
         })
         .to('.sec-5 .lines-ct', {
           height: "12.76rem",
           autoAlpha: 1,
         });

       gsap.timeline({
           scrollTrigger: {
             trigger: ".sec-5-scroll-wrap",
             start: "bottom bottom",
             end: "bottom center",
             scrub: .5,
           }
         })
         .to('.sec-5 .lines-ct', {
           autoAlpha: 0,
           scaleY: "0",
         });
       ///USP Lines Desktop Start
       gsap.timeline({
           scrollTrigger: {
             trigger: ".sec-5-scroll-wrap",
             start: "top center",
             end: "top+=27.5% center",
             scrub: true,

           }
         })
         .from('.usp-ct.one span', {
           opacity: 0,
           y: "6rem",
           stagger: 0.05,
         })
         .to('.usp-ct.one span', {
           opacity: 0,
           y: "-6rem",
           stagger: 0.05,
         })
         .from('.sec-5 .lines-ct .line.one .line-inner', {
           scaleY: 0,
         }, 0);

       gsap.timeline({
           scrollTrigger: {
             trigger: ".sec-5-scroll-wrap",
             start: "top+=25% center",
             end: "top+=52.5% center",
             scrub: true,
           }
         })
         .from('.usp-ct.two span', {
           opacity: 0,
           y: "6rem",
           stagger: 0.05,
         })
         .to('.usp-ct.two span', {
           opacity: 0,
           y: "-6rem",
           stagger: 0.05,
         })
         .from('.sec-5 .lines-ct .line.two .line-inner', {
           height: 0,
         }, 0);

       gsap.timeline({
           scrollTrigger: {
             trigger: ".sec-5-scroll-wrap",
             start: "top+=50% center",
             end: "top+=77.5% center",
             scrub: true,
           }
         })
         .from('.usp-ct.three span', {
           opacity: 0,
           y: "6rem",
           stagger: 0.05, // Versatz zwischen den threen der einzelnen Elemente
         })
         .to('.usp-ct.three span', {
           opacity: 0,
           y: "-6rem",
           stagger: 0.05,
         })
         .from('.sec-5 .lines-ct .line.three .line-inner', {
           height: 0,
         }, 0);

       gsap.timeline({
           scrollTrigger: {
             trigger: ".sec-5-scroll-wrap",
             start: "top+=72.5% center",
             end: "bottom center",
             scrub: true,
           }
         })
         .from('.usp-ct.four span', {
           opacity: 0,
           y: "6rem",
           stagger: 0.05, // Versatz zwischen den fourn der einzelnen Elemente
         })
         .to('.usp-ct.four span', {
           opacity: 0,
           y: "-6rem",
           stagger: 0.05,
         })
         .from('.sec-5 .lines-ct .line.four .line-inner', {
           height: 0,
         }, 0);
       ///USP Lines Desktop End
       gsap.timeline({
           scrollTrigger: {
             trigger: ".sec-5-scroll-wrap",
             start: "top top",
             end: "bottom top",
             scrub: 2,
           }
         })
         .to('.sec-5 .gradient-ct.blue', {
           left: "55%",
           top: "10%",
         })
         .to('.sec-5 .gradient-ct.pink', {
           left: "40%",
           top: "35%",

         }, 0)

     },
     ///GSAP  Desktop END

     // GSAP All
     "all": function () {

       ///Show fixed-elements when scrolling to avoid lazyloading images 
       const stickySections = document.querySelectorAll('.fixed-sec');
       stickySections.forEach(sticky => {
           gsap.timeline({
               scrollTrigger: {
                 trigger: ".fixed-sec",
                 start: "top bottom",
               }
             })
             .to('.fixed-sec', {
               position: "fixed",
               duration: 0,
             });
         }),

         gsap.timeline({
           scrollTrigger: {
             trigger: ".index-header",
             start: "top top",
             end: "bottom top",
             scrub: true,
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
             scrub: 0.1,
           }
         })
         .from('.sec-1 .wenn-ct ', {
           x: "-5%",
         }, 0)
         .from('.sec-1 .wenn-ct span:nth-of-type(2)', {
           paddingLeft: 0,
         }, 0)
         .from('.sec-1 .wenn-ct span:nth-of-type(3)', {
           paddingLeft: 0,
         }, 0)
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

       gsap.from(".multi-line-headline span", {
         y: "100%",
         opacity: 0,
         duration: 1.8,
         ease: "Expo.easeOut",
         stagger: 0.1,
         scrollTrigger: {
           trigger: ".multi-line-headline",
           start: () => 'top ' + window.innerHeight * 0.9,
           toggleActions: "play none none reverse",
         }
       });
       gsap.from(".serif-text-ct span", {
         y: "100%",
         opacity: 0,
         duration: 1.5,
         ease: "Expo.easeOut",
         stagger: 0.015,
         scrollTrigger: {
           trigger: ".serif-text-ct",
           start: () => 'top ' + window.innerHeight * 0.9,

           toggleActions: "play none none reverse",
         }
       });

       gsap.from(".einsatzgebiete-title", {
         scale: ".8",
         opacity: .5,
         duration: 3,
         ease: "Expo.easeOut",
         scrollTrigger: {
           trigger: ".einsatzgebiete-title",
           start: "top bottom",
           toggleActions: "play none none reverse",
         }
       });
       gsap.timeline({
         scrollTrigger: {
           trigger: ".sec-4-scroll-wrap",
           start: "top center",
           end: "top top",
           scrub: 1,
         }
       })

       gsap.timeline({
           scrollTrigger: {
             trigger: ".sec-4-scroll-wrap",
             start: "top bottom",
             end: "bottom bottom",
             scrub: true,
           }
         })
         .from('.sec-4-scroll-wrap .bg picture', {
           scale: "1.4",
         });
       gsap.timeline({
           scrollTrigger: {
             trigger: ".sec-4-scroll-wrap",
             start: "bottom bottom",
             end: "bottom top",
             scrub: true,
           }
         })
         .to('.sec-4-scroll-wrap .bg', {
           y: "40%",
         })
         .to('.sec-4-scroll-wrap .einsatzgebiete-title', {
           y: "25vh",
           opacity: 0,
         }, 0);

       gsap.timeline({
           scrollTrigger: {
             trigger: ".sec-5-inner",
             start: "top bottom",
             end: "top top",
             scrub: true,
           }
         })
         .from('.sec-5 .gradients-wrapper', {
           autoAlpha: "0",
           pointerEvents: "none",
           scale: "0",
           y: "-100%",
         });

       gsap.timeline({
           scrollTrigger: {
             trigger: ".sec-5-scroll-wrap",
             start: "bottom bottom",
             end: "bottom top",
             scrub: true,
           }
         })
         .to('.sec-5 .gradients-wrapper', {
           autoAlpha: "0",
           pointerEvents: "none",
           scale: "0",
         });

       gsap.timeline({
           scrollTrigger: {
             trigger: ".sec-5",
             start: "center center",
             toggleActions: "play none none reverse",
           }
         })
         .to('.footer', {
           zIndex: "1",
         });


       gsap.timeline({
           scrollTrigger: {
             trigger: ".sec-6 h3",
             start: () => 'top ' + window.innerHeight * 0.9,
             toggleActions: "play none none reverse",
           }
         })
         .from('.sec-6 h3 span:first-of-type', {
           x: "5%",
           opacity: 0,
           duration: 2,
           ease: "Expo.easeOut",
         })
         .from('.sec-6 h3 span:last-of-type', {
           paddingLeft: "0",
           opacity: 0,
           duration: 2,
           ease: "Expo.easeOut",
         }, 0);

       gsap.from(".sec-6 .reviewsSwiperDesktopCt", {
         y: "25%",
         opacity: 0,
         duration: 2,
         ease: "Expo.easeOut",
         scrollTrigger: {
           trigger: ".sec-6 .reviewsSwiperDesktopCt",
           start: "top bottom",
           toggleActions: "play none none reverse",
         }
       });

       gsap.timeline({
           scrollTrigger: {
             trigger: ".sec-6",
             start: "bottom bottom",
             end: "bottom top",
             scrub: true,
           }
         })
         // .from('.footer', {
         //   y: "25%"
         // })
         .from('.footer .bg', {
           scale: "1.3"
         }, 0);


       gsap.timeline({
           scrollTrigger: {
             trigger: ".sec-6",
             start: "bottom center",
             toggleActions: "play none none reverse",
           }
         })
         .from('.footer .footer-links-ct .phone .circle', {
           scale: "0",
           opacity: 0,
           duration: 2,
           ease: "Expo.easeOut",
         }, 0)
         .from('.footer .footer-links-ct .phone .name span', {
           y: "100%",
           duration: 2,
           ease: "Expo.easeOut",
         }, 0)

         .from('.footer .footer-links-ct .mail .circle', {
           scale: "0",
           opacity: 0,
           duration: 2,
           ease: "Expo.easeOut",
         }, 0)
         .from('.footer .footer-links-ct .mail .name span', {
           y: "-100%",
           duration: 2,
           ease: "Expo.easeOut",
         }, 0);



     },
     // GSAP All END
    });
 }

 function initScrollToAnchorLenis() {
   $("[data-anchor-target]").click(function () {
     let targetScrollToAnchorLenis = $(this).attr('data-anchor-target');
     scroll.scrollTo(targetScrollToAnchorLenis, {
       duration: 1.2,
     });
   });
 }


 function initSwiper() {
   if (window.innerWidth < 760) {
     const swiper = new Swiper('.swiper.reviewsSwiperMobile', {
       loop: true,
       autoHeight: true,
       speed: 400,
       slidesPerView: 1,
       watchSlidesProgress: true,
       a11y: {
         prevSlideMessage: 'Previous slide',
         nextSlideMessage: 'Next slide',
       },
       navigation: {
         nextEl: '.swiper-button-next',
         prevEl: '.swiper-button-prev',
       },
       scrollbar: {
         el: '.swiper-scrollbar',
       },
     });
     let isTouched = false;

     swiper.on('touchStart', function () {
       isTouched = true;
     });

     swiper.on('slideChange', function () {
       if (isTouched) {
         swiper.el.classList.add('touched');
         isTouched = false; // Reset the flag
       }
     });

   } else {
     const swiper = new Swiper('.swiper.reviewsSwiperDesktop', {
       loop: true,
       autoHeight: true,
       speed: 700,
       allowTouchMove: false,
       slidesPerView: 1,
       initialSlide: 1,
       effect: 'fade',
       fadeEffect: {
         crossFade: true
       },
       a11y: {
         prevSlideMessage: 'Previous slide',
         nextSlideMessage: 'Next slide',
       },
       navigation: {
         nextEl: '.swiper-button-next',
         prevEl: '.swiper-button-prev',
       },
     });

     const galleryThumbs = new Swiper('.swiper.imgSwiper', {
       slidesPerView: 2,
       speed: 700,
       loop: true,
       navigation: {
         nextEl: '.swiper-button-next',
         prevEl: '.swiper-button-prev',
       },
     });
   }
 }


 function followCursor() {
   // Überprüfe, ob das erforderliche HTML-Element vorhanden ist
   const cursorFollow = document.querySelector(".cursor-follow");
   if (!cursorFollow) return; // Beende die Funktion, wenn das Element nicht gefunden wurde

   if (window.innerWidth > 759) {
     const span = cursorFollow.querySelector("span");
     let posX = 0;
     let posY = 0;
     let mouseX = 0;
     let mouseY = 0;

     const delay = 0.12;

     function followCursor() {
       const distX = mouseX - posX;
       const distY = mouseY - posY;
       posX += distX * delay;
       posY += distY * delay;

       cursorFollow.style.left = posX + "px";
       cursorFollow.style.top = posY + "px";

       requestAnimationFrame(followCursor);
     }

     document.addEventListener("mousemove", function (e) {
       mouseX = e.clientX;
       mouseY = e.clientY;
     });

     followCursor();

     const elementsToShowCursor = document.querySelectorAll("[data-show-cursor]");
     elementsToShowCursor.forEach(element => {
       element.addEventListener("mouseover", function () {
         cursorFollow.style.transition = "transform 0.3s";
         cursorFollow.style.transform = "scale(1)";
         // Event Listener für mousedown und mouseup hinzufügen
         document.addEventListener("mousedown", mouseDownHandler);
         document.addEventListener("mouseup", mouseUpHandler);
       });
       element.addEventListener("mouseleave", function () {
         cursorFollow.style.transition = "transform 0.3s";
         cursorFollow.style.transform = "scale(0)";
         // Event Listener für mousedown und mouseup entfernen
         document.removeEventListener("mousedown", mouseDownHandler);
         document.removeEventListener("mouseup", mouseUpHandler);
       });
     });

     const elementsCursorLeft = document.querySelectorAll("[data-cursor-left]");
     elementsCursorLeft.forEach(element => {
       element.addEventListener("mouseover", function () {
         cursorFollow.classList.add("cursor-left");
       });
       element.addEventListener("mouseleave", function () {
         cursorFollow.classList.remove("cursor-left");
       });
     });

     const elementsCursorRight = document.querySelectorAll("[data-cursor-right]");
     elementsCursorRight.forEach(element => {
       element.addEventListener("mouseover", function () {
         cursorFollow.classList.add("cursor-right");
       });
       element.addEventListener("mouseleave", function () {
         cursorFollow.classList.remove("cursor-right");
       });
     });

     function mouseDownHandler() {
       cursorFollow.classList.add("pressed", "pressed-animation");
       setTimeout(() => {
         cursorFollow.classList.remove("pressed-animation");
       }, 700); // Dauer der Animation in ms
     }

     function mouseUpHandler() {
       cursorFollow.classList.remove("pressed");
     }
   }
 }

 function clipboardCopy() {
   function copyToClipboard(content, classReceiverElement) {
     const tempTextarea = document.createElement('textarea');
     tempTextarea.value = content;
     document.body.appendChild(tempTextarea);
     tempTextarea.select();
     document.execCommand('copy');
     document.body.removeChild(tempTextarea);

     // Füge die Klasse 'copy-success' zum classReceiverElement hinzu
     classReceiverElement.classList.add('copy-success');

     // Entferne die Klasse nach 5 Sekunden wieder
     setTimeout(() => {
       classReceiverElement.classList.remove('copy-success');
     }, 7000);
   }

   const clipboardElements = document.querySelectorAll("[data-clipboard]");

   clipboardElements.forEach(element => {
     function handleEvent() {
       const content = element.getAttribute("data-clipboard-content");
       const classReceiverElement = element.closest("[data-class-receiver]");

       if (content && classReceiverElement) {
         // Kopiere den Inhalt in die Zwischenablage
         copyToClipboard(content, classReceiverElement);

         // Entferne die Klasse 'copy-success' von allen anderen data-class-receiver Elementen
         clipboardElements.forEach(el => {
           const otherClassReceiverElement = el.closest("[data-class-receiver]");
           if (el !== element && otherClassReceiverElement && otherClassReceiverElement.classList.contains('copy-success')) {
             otherClassReceiverElement.classList.remove('copy-success');
           }
         });
       }
     }

     element.addEventListener("click", handleEvent);
     element.addEventListener("touchend", handleEvent);
   });
 }

 function orientationCheck() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /iphone|ipod|android.+mobile/.test(userAgent);
    const isTablet = !isMobile && /ipad|android/.test(userAgent);
    const isLandscape = window.innerWidth > window.innerHeight;
    const isPortrait = window.innerHeight > window.innerWidth;

    const htmlElement = document.documentElement;

    if ((isMobile && isLandscape) || (isTablet && isPortrait)) {
      htmlElement.classList.add('please-rotate');
    } else {
      htmlElement.classList.remove('please-rotate');
    }
  
 }


 (function() {
  function reloadOnResize() {
    window.location.reload();
  }

  window.addEventListener('orientationchange', reloadOnResize);

  // Optional: Ein Timer, um zu verhindern, dass zu häufig neu geladen wird
  let resizeTimeout;
  window.addEventListener('orientationchange', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(reloadOnResize, 500);
  });
})();