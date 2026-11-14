document.addEventListener("DOMContentLoaded",()=>{
  document.documentElement.classList.add("js-enabled");
  const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Loader
  const loader=document.getElementById("loader");
  window.addEventListener("load",()=>setTimeout(()=>loader?.classList.add("hide"),650));

  // Mobile menu
  const toggle=document.getElementById("menuToggle"),nav=document.getElementById("siteNav");
  const closeNav=()=>{nav?.classList.remove("open");toggle?.setAttribute("aria-expanded","false")};
  toggle?.addEventListener("click",()=>{
    const open=nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded",String(open));
  });
  nav?.querySelectorAll("a").forEach(a=>a.addEventListener("click",closeNav));

  // Partner names: duplicate the list once so the loop is seamless
  document.querySelectorAll(".marquee-track").forEach(track=>{
    const group=track.querySelector(".marquee-group");
    if(!group)return;
    const copy=group.cloneNode(true);
    copy.setAttribute("aria-hidden","true");
    track.appendChild(copy);
  });

  // Scroll reveal (removed again after it plays, so hover effects stay snappy)
  const items=[...document.querySelectorAll(
    ".section-head, .two-col > *, .why-head, .why-item, .banner-inner > *, .footer-grid > div, .hero-copy > *, .service-card, .step, .belief, [data-reveal]"
  )];
  items.forEach(el=>{
    const idx=[...el.parentElement.children].indexOf(el);
    el.style.transitionDelay=(Math.min(idx,6)*0.07)+"s";
    el.classList.add("reveal");
  });
  const finish=el=>setTimeout(()=>{el.classList.remove("reveal","in-view");el.style.transitionDelay=""},1300);
  if(!reduceMotion && "IntersectionObserver" in window){
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add("in-view","seen");
          finish(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.14,rootMargin:"0px 0px -40px 0px"});
    items.forEach(el=>observer.observe(el));
  }else{
    items.forEach(el=>el.classList.add("in-view","seen"));
  }

  // Gentle desktop parallax on the hero emblem
  const visual=document.querySelector(".hero-visual");
  if(visual && !reduceMotion && window.matchMedia("(pointer:fine)").matches && window.innerWidth>900){
    let raf=0;
    visual.style.transition="transform .25s ease-out";
    window.addEventListener("mousemove",e=>{
      cancelAnimationFrame(raf);
      raf=requestAnimationFrame(()=>{
        const x=(e.clientX/window.innerWidth-.5)*10;
        const y=(e.clientY/window.innerHeight-.5)*8;
        visual.style.transform=`translate3d(${x}px,${y}px,0)`;
      });
    },{passive:true});
  }


  // ---- Sticky header: always visible, shrinks + gains shadow on scroll, with a progress line
  const bar=document.querySelector(".header-bar");
  if(bar){
    const prog=document.createElement("div");prog.className="scroll-progress";bar.appendChild(prog);
    const onScroll=()=>{
      const max=document.documentElement.scrollHeight-innerHeight;
      bar.classList.toggle("scrolled",scrollY>12);
      prog.style.transform=`scaleX(${max>0?Math.min(scrollY/max,1):0})`;
    };
    onScroll();addEventListener("scroll",onScroll,{passive:true});addEventListener("resize",onScroll);
  }

  // ---- Highlight the nav link for the section on screen (home page)
  const spyLinks=[...document.querySelectorAll('nav a[href^="#"]:not(.nav-cta)')];
  if(spyLinks.length && "IntersectionObserver" in window){
    const spy=new IntersectionObserver(entries=>{
      entries.forEach(en=>{
        if(!en.isIntersecting)return;
        spyLinks.forEach(a=>a.getAttribute("href")==="#"+en.target.id?a.setAttribute("aria-current","true"):a.removeAttribute("aria-current"));
      });
    },{rootMargin:"-45% 0px -50% 0px"});
    document.querySelectorAll("#home, #services, #process, #why, #about").forEach(sec=>spy.observe(sec));
  }

  // ---- Headings: words rise into place
  const headings=[...document.querySelectorAll("h2")];
  headings.forEach(h=>{
    const words=h.textContent.trim().split(/\s+/);
    h.setAttribute("aria-label",words.join(" "));
    h.innerHTML=words.map((w,i)=>`<span class="w" aria-hidden="true"><span style="--i:${i}">${w}</span></span>`).join(" ");
  });
  if(!reduceMotion && "IntersectionObserver" in window){
    const hObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("words-in");hObs.unobserve(e.target)}}),{threshold:.3});
    headings.forEach(h=>hObs.observe(h));
  }else headings.forEach(h=>h.classList.add("words-in"));

  // ---- Pointer effects (desktop only)
  if(!reduceMotion && window.matchMedia("(pointer:fine)").matches){
    // spotlight that follows the cursor over the hero
    const top=document.querySelector(".top");
    top?.addEventListener("mousemove",e=>{
      const r=top.getBoundingClientRect();
      top.style.setProperty("--mx",(e.clientX-r.left)+"px");
      top.style.setProperty("--my",(e.clientY-r.top)+"px");
    },{passive:true});
    // 3D tilt + glow on service cards
    document.querySelectorAll(".service-card").forEach(card=>{
      card.addEventListener("mousemove",e=>{
        const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
        card.style.setProperty("--ry",((x-.5)*10).toFixed(2)+"deg");
        card.style.setProperty("--rx",((.5-y)*8).toFixed(2)+"deg");
        card.style.setProperty("--gx",(x*100)+"%");card.style.setProperty("--gy",(y*100)+"%");
      });
      card.addEventListener("mouseleave",()=>{card.style.setProperty("--rx","0deg");card.style.setProperty("--ry","0deg")});
    });
    // magnetic buttons
    document.querySelectorAll(".btn.filled, .nav-cta").forEach(btn=>{
      btn.addEventListener("mousemove",e=>{
        const r=btn.getBoundingClientRect();
        btn.style.translate=`${((e.clientX-r.left)/r.width-.5)*10}px ${((e.clientY-r.top)/r.height-.5)*8}px`;
      });
      btn.addEventListener("mouseleave",()=>{btn.style.translate=""});
    });
  }

  // "Let's talk" card — one shared dialog on every page
  const dialog=document.createElement("dialog");
  dialog.className="contact-dialog";
  dialog.setAttribute("aria-labelledby","dialogTitle");
  dialog.innerHTML=`
    <div class="dialog-card">
      <button type="button" class="dialog-close" aria-label="Close">&times;</button>
      <h2 id="dialogTitle">Tell us what you’re building.</h2>
      <p class="dialog-lead">Send the basics and Velora will receive your enquiry directly.</p>
      <form id="contactForm" class="contact-form" action="/send_email" method="post">
        <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
        <div class="form-grid">
          <label>Name<input name="fullName" required autocomplete="name" placeholder="Your name"></label>
          <label>Business / project<input name="businessName" autocomplete="organization" placeholder="Business or project name"></label>
          <label>Email<input type="email" name="email" required autocomplete="email" placeholder="you@example.com"></label>
          <label><span>Phone <small>(optional)</small></span><input type="tel" name="phone" autocomplete="tel" placeholder="+91 98765 43210"></label>
          <label class="full">Service<select name="service">
            <option>Strategy</option><option>Branding</option><option>Creative / Content</option><option>Digital Marketing</option><option>Website Development</option><option>Performance Marketing</option><option>SEO / Email</option><option>Multiple services</option>
          </select></label>
          <label class="full">Message<textarea name="message" rows="4" required placeholder="Tell us briefly about your project, goal or requirement..."></textarea></label>
        </div>
        <button class="btn filled submit-btn" type="submit"><span class="submit-text">Send enquiry</span><span class="submit-arrow">↗</span></button>
        <p class="form-note" id="formStatus">Your enquiry will be sent directly to the Velora email inbox.</p>
      </form>
    </div>`;
  document.body.appendChild(dialog);

  const form=dialog.querySelector("#contactForm"),status=dialog.querySelector("#formStatus");
  const button=form.querySelector(".submit-btn"),btnText=button.querySelector(".submit-text");
  const resetForm=()=>{
    button.disabled=false;btnText.textContent="Send enquiry";
    status.textContent="Your enquiry will be sent directly to the Velora email inbox.";
  };

  const openContact=service=>{
    if(service){
      const opt=[...form.elements.service.options].find(o=>o.text===service);
      if(opt)form.elements.service.value=opt.value;
    }
    if(!dialog.open)dialog.showModal();
    form.elements.fullName.focus();
  };

  document.addEventListener("click",e=>{
    const trigger=e.target.closest("[data-open-contact]");
    if(!trigger)return;
    e.preventDefault();
    closeNav();
    openContact(trigger.dataset.service);
  });
  dialog.querySelector(".dialog-close").addEventListener("click",()=>dialog.close());
  dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
  if(location.hash==="#contact")openContact();

  form.addEventListener("submit",()=>{
    button.disabled=true;
    btnText.textContent="Sending enquiry…";
    status.textContent="Sending securely to the Velora inbox…";
  });
  window.addEventListener("pageshow",e=>{if(e.persisted)resetForm()});
});
