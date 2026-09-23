document.addEventListener("DOMContentLoaded",()=>{
  document.documentElement.classList.add("js-enabled");

  const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const loader=document.getElementById("loader");
  window.addEventListener("load",()=>setTimeout(()=>loader?.classList.add("hide"),650));

  const toggle=document.getElementById("menuToggle"),nav=document.getElementById("siteNav");
  toggle?.addEventListener("click",()=>{
    const open=nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded",String(open));
  });
  nav?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded","false");
  }));

  // Scroll-reveal: keeps the page lively without hiding content when JS is disabled.
  const revealItems=[
    ...document.querySelectorAll(".section-head, .two-col > *, .value-grid > *, .contact-grid > *, .banner-inner, .footer-brand, .footer-grid > div:not(.footer-brand), .hero-copy > *")
  ];
  revealItems.forEach(el=>el.classList.add("reveal"));

  const animatedGroups=[
    ...document.querySelectorAll(".service-card, .step, .value-list > div")
  ];

  if(!reduceMotion && "IntersectionObserver" in window){
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.14,rootMargin:"0px 0px -40px 0px"});
    [...revealItems,...animatedGroups].forEach(el=>observer.observe(el));
  }else{
    [...revealItems,...animatedGroups].forEach(el=>el.classList.add("in-view"));
  }

  // Gentle desktop parallax on the hero emblem; disabled on touch/reduced-motion.
  const visual=document.querySelector(".hero-visual");
  if(visual && !reduceMotion && window.matchMedia("(pointer:fine)").matches && window.innerWidth>900){
    let raf=0;
    window.addEventListener("mousemove",e=>{
      cancelAnimationFrame(raf);
      raf=requestAnimationFrame(()=>{
        const x=(e.clientX/window.innerWidth-.5)*10;
        const y=(e.clientY/window.innerHeight-.5)*8;
        visual.style.transform=`translate3d(${x}px,${y}px,0)`;
      });
    },{passive:true});
    window.addEventListener("mouseleave",()=>visual.style.transform="",{passive:true});
  }

  const form=document.getElementById("contactForm"),status=document.getElementById("formStatus");
  form?.addEventListener("submit",()=>{
    const button=form.querySelector(".submit-btn");
    button.disabled=true;
    button.querySelector(".submit-text").textContent="Sending enquiry…";
    status.textContent="Sending securely to the Velora inbox…";
  });
});
