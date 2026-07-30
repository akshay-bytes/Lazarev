gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", function () {
  // 1. Initialize Lenis
  const lenis = new Lenis({
    lerp: 0.05,
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // 2. Loading Animation
  loadingAnimation();

  // 3. Navigation Animation
  navAnimation();

  // 4. Hover Effects Consolidated
  initHoverEffects();

  // 5. Video Play Effects Consolidated
  initVideoEffects();

  // 6. Scroll Animations
  initScrollAnimations();

  // 7. Form Animation
  formAnimation();

  // 8. Copy Button
  initCopyButton();

  // 9. Button 3D Hover
  initButtonHover();
});

function loadingAnimation() {
  var tl = gsap.timeline();
  if (!document.querySelector("#page1")) return;

  // Initial page scale animation
  tl.fromTo(
    "#page1",
    { scaleX: 0.7, scaleY: 0, borderRadius: "1vw", transform: "translateY(30%)", opacity: 0 },
    { scaleX: 0.7, scaleY: 0.05, duration: 0.5, ease: "easeOut", opacity: 1 }
  );

  // Final page scale animation
  tl.to("#page1", { scaleX: 1, scaleY: 1, duration: 2, ease: "expo.out", borderRadius: 0, transform: "translateY(0%)" });

  // Show elements with stagger and transform
  tl.fromTo(
    ["#head h1 span", "#para"],
    { display: "inline-block", y: 100, opacity: 0 },
    { y: 0, opacity: 1, stagger: { amount: 1.2 }, duration: 2, ease: "expo.out" },
    "-=1.7"
  );

  // Show navigation with opacity animation
  tl.fromTo(
    "nav",
    { opacity: 0 },
    { opacity: 1, duration: 1.5, ease: "power4.out" },
    "-=2.5"
  );
}

function navAnimation() {
  var navbar = document.querySelector("#navbar");
  var navRight = document.querySelector("#nav-center #center-right");
  var navItems = document.querySelectorAll("#nav-center #center-right h4");
  var navCenter = document.querySelector("#nav-center");

  if (!navbar || !navRight || !navItems.length || !navCenter) return;

  var initialNavHeight = "13.8vh";
  var initialPaddingTop = "6vh";
  var initialPaddingBottom = "6vh";

  ScrollTrigger.create({
    start: "top -1", // Trigger after scrolling down 1px
    onEnter: () => {
      gsap.to(navbar, { height: "8.5vh", duration: 0.5, delay: 0.2 });
      gsap.to(navCenter, { paddingTop: "3vh", paddingBottom: "3vh", duration: 0.5, delay: 0.2 });
    },
    onLeaveBack: () => {
      gsap.to(navbar, { height: initialNavHeight, duration: 0.8, ease: "power4.out" });
      gsap.to(navCenter, { paddingTop: initialPaddingTop, paddingBottom: initialPaddingBottom, duration: 0.8, ease: "power4.out" });
    }
  });

  var enterTl, leaveTl;
  var isHovering = false;

  navItems.forEach(function (nav) {
    nav.addEventListener("mouseenter", function () {
      if (isHovering) return;
      isHovering = true;
      if (leaveTl && leaveTl.isActive()) leaveTl.kill();

      enterTl = gsap.timeline();
      enterTl
        .to(".cover", { height: "25.5vh", duration: 0.001, ease: "power4.in" })
        .to("#nav-center #center-right .nav-elem h5", { display: "block", duration: 0.01 })
        .to("#nav-center #center-right .nav-elem h5 span", { display: "block", duration: 0.1, delay: 0, opacity: 1 })
        .from("#nav-center #center-right .nav-elem h5 span", { y: 20, duration: 0.4, stagger: { amount: 0.6 } });
    });
  });

  navRight.addEventListener("mouseleave", function () {
    if (enterTl && enterTl.isActive()) enterTl.kill();

    leaveTl = gsap.timeline();
    leaveTl
      .to("#nav-center h5 span", { opacity: 1, y: 20, duration: 0.1, stagger: { amount: 0.1 } })
      .to("#nav-center h5 span", { display: "none", duration: 0.2 })
      .to("#nav-center #center-right .nav-elem h5", { display: "none", duration: 0 })
      .to(".cover", { height: 0, duration: 0.001, delay: -0.3, ease: "power4.in" })
      .set("#nav-center span", { display: "none", opacity: 0, y: 0 })
      .eventCallback("onComplete", function () {
        isHovering = false;
      });
  });
}

function initHoverEffects() {
  function createHover(containerSelector, cursorSelector, xOffset = 0, yOffset = 0) {
    var containers = document.querySelectorAll(containerSelector);
    containers.forEach(function (container) {
      var cursor = container.querySelector(cursorSelector);
      if (!cursor) return;

      // Prevent the custom cursor from intercepting mouse events, which causes hover bugs
      gsap.set(cursor, { pointerEvents: "none" });

      container.addEventListener("mouseenter", function () {
        gsap.to(cursor, { scale: 1, duration: 0.5, delay: 0.1 });
      });

      container.addEventListener("mouseleave", function () {
        gsap.to(cursor, { scale: 0, duration: 0.5 });
      });

      container.addEventListener("mousemove", function (dets) {
        var rect = container.getBoundingClientRect();
        gsap.to(cursor, {
          x: dets.clientX - rect.left - cursor.offsetWidth / 2 + xOffset,
          y: dets.clientY - rect.top - cursor.offsetHeight / 2 + yOffset,
          duration: 0.5,
        });
      });
    });
  }

  createHover(".list-item", "img");
  createHover("#page7 section .container .right-container", ".hover-circle");
  createHover(".cover-container", ".hov", 12, -150);
}

function initVideoEffects() {
  var videoTrigger = document.querySelector("#page3 .vid-play");
  var videoElement = document.querySelector("#page3 video");

  if (videoTrigger && videoElement) {
    videoTrigger.addEventListener("click", function () {
      videoElement.play();
      var tl = gsap.timeline();
      tl.set(videoElement, {
        display: "block", position: "fixed", top: 0, left: 0, right: 0,
        borderRadius: 0, zIndex: 999, opacity: 1
      });
      tl.fromTo(videoElement,
        { scaleX: 0.8, scaleY: 0, borderRadius: "1vw" },
        { scaleX: 0.8, scaleY: 0.2, duration: 0.7, ease: "easeInOut", borderRadius: 0 }
      );
      tl.to(videoElement, { scaleX: 1, scaleY: 1, duration: 0.5 });
    });

    videoElement.addEventListener("click", function () {
      videoElement.pause();
      gsap.to(videoElement, {
        scaleX: 0.9, scaleY: 0.9, opacity: 0, duration: 0.3,
        onComplete: function () {
          gsap.set(videoElement, { display: "none" });
        }
      });
    });
  }

  var hoverVideoContainers = document.querySelectorAll(".right-container, .case");
  hoverVideoContainers.forEach(function (container) {
    container.addEventListener("mouseenter", function () {
      var videoElement = container.querySelector("video");
      if (videoElement) {
        videoElement.style.display = "block";
        videoElement.currentTime = 0;
        videoElement.play();
      }
    });

    container.addEventListener("mouseleave", function () {
      var videoElement = container.querySelector("video");
      if (videoElement) {
        videoElement.style.display = "none";
        videoElement.pause();
      }
    });
  });
}

function initScrollAnimations() {
  if (document.querySelector(".bottom-c")) {
    gsap.from(".bottom-c .blocks .block .btn-setup", {
      x: 0,
      duration: 0.7,
      scrollTrigger: {
        trigger: ".bottom-c",
        scroller: "body",
        scrub: true,
        start: "top 80%",
      },
    });
  }

  if (document.querySelector("#page12 .section4 .container2")) {
    gsap.to("#page12 .section4 .container2 .left svg", {
      rotation: -180,
      duration: 5,
      scrollTrigger: {
        trigger: "#page12 .section4 .container2",
        scroller: "body",
        scrub: true,
        start: "top 80%",
        end: "bottom 20%",
      },
    });
  }

  if (document.querySelector("#page12 .section5")) {
    gsap.from("#page12 .section5 .img-container>img", {
      scale: 1.1,
      duration: 0.8,
      scrollTrigger: {
        trigger: "#page12 .section5",
        scroller: "body",
        scrub: true,
        start: "top 80%",
        end: "bottom 20%",
      },
    });
  }
}

function formAnimation() {
  const emailInput = document.getElementById("Email");
  const submitButton = document.querySelector(".submit-target");
  if (!emailInput || !submitButton) return;

  function updateButtonState() {
    if (emailInput.validity.valid) {
      submitButton.removeAttribute("disabled");
      submitButton.style.cursor = "pointer";
      submitButton.style.backgroundColor = "#666";
    } else {
      submitButton.setAttribute("disabled", "disabled");
      submitButton.style.cursor = "not-allowed";
      submitButton.style.backgroundColor = "#3d3d3d";
    }
  }

  emailInput.addEventListener("input", updateButtonState);
  emailInput.addEventListener("focus", updateButtonState);

  submitButton.addEventListener("mouseenter", function () {
    submitButton.style.cursor = submitButton.disabled ? "not-allowed" : "pointer";
  });

  submitButton.addEventListener("mouseleave", function () {
    submitButton.style.cursor = submitButton.disabled ? "not-allowed" : "pointer";
  });

  submitButton.setAttribute("disabled", "disabled");
}

function initCopyButton() {
  var copyButton = document.getElementById("copyButton");
  if (!copyButton) return;

  copyButton.addEventListener("click", function () {
    var button = this;
    var textElement = button.querySelector("#buttonText");
    if (!textElement) return;

    var textToCopy = textElement.textContent;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy).then(
        function () { showCopyFeedback(button); },
        function (err) { console.error("Failed to copy text: ", err); }
      );
    } else {
      var tempTextarea = document.createElement("textarea");
      tempTextarea.value = textToCopy;
      document.body.appendChild(tempTextarea);
      tempTextarea.select();
      try {
        document.execCommand("copy");
        showCopyFeedback(button);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      } finally {
        document.body.removeChild(tempTextarea);
      }
    }
  });
}

function showCopyFeedback(button) {
  var textElement = button.querySelector("#buttonText");
  if (!textElement) return;
  var originalText = textElement.textContent;
  textElement.textContent = "Copied!";
  setTimeout(function () {
    textElement.textContent = originalText;
  }, 1500);
}

function initButtonHover() {
  const buttons = document.querySelectorAll("button");

  buttons.forEach(btn => {
    const textContent = btn.textContent.trim().toLowerCase();
    if (!textContent.includes("see all case studies") && !textContent.includes("become a client")) {
      return;
    }

    let text = "Become A Client";
    if (textContent.includes("see all case studies")) text = "See All Case Studies";

    let textElem = btn.querySelector("h2, h4");
    let target;
    if (textElem) {
      target = textElem.cloneNode(false);
    } else {
      target = document.createElement("div");
    }

    const svg = btn.querySelector("svg");
    const svgHTML = svg ? svg.outerHTML : "";

    btn.innerHTML = "";

    target.style.position = "relative";
    target.style.display = "inline-flex";
    target.style.overflow = "hidden";
    target.style.margin = "0";
    target.style.padding = "0";
    target.style.color = "white";

    const topContainer = document.createElement("div");
    const bottomContainer = document.createElement("div");

    topContainer.style.display = "flex";
    topContainer.style.color = "inherit";
    bottomContainer.style.display = "flex";
    bottomContainer.style.position = "absolute";
    bottomContainer.style.left = "0";
    bottomContainer.style.top = "0";
    bottomContainer.style.color = "inherit";

    text.split("").forEach(char => {
      const topChar = document.createElement("span");
      topChar.innerHTML = char === " " ? "&nbsp;" : char;
      topChar.style.display = "inline-block";
      topChar.style.transformOrigin = "bottom center";
      topChar.style.color = "inherit";
      topContainer.appendChild(topChar);

      const botChar = document.createElement("span");
      botChar.innerHTML = char === " " ? "&nbsp;" : char;
      botChar.style.display = "inline-block";
      botChar.style.transformOrigin = "top center";
      botChar.style.color = "inherit";
      gsap.set(botChar, { opacity: 0, yPercent: 100, rotateX: 75 });
      bottomContainer.appendChild(botChar);
    });

    target.appendChild(topContainer);
    target.appendChild(bottomContainer);

    btn.appendChild(target);
    if (svgHTML) {
      btn.insertAdjacentHTML("beforeend", svgHTML);
    }

    btn.style.display = "flex";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";

    btn.addEventListener("mouseenter", () => {
      const topChars = topContainer.querySelectorAll("span");
      const botChars = bottomContainer.querySelectorAll("span");

      gsap.to(topChars, {
        yPercent: -100,
        rotateX: -75,
        opacity: 0,
        duration: 0.4,
        stagger: 0.015,
        ease: "power2.inOut",
        overwrite: "auto"
      });

      gsap.to(botChars, {
        yPercent: 0,
        rotateX: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.015,
        ease: "power2.inOut",
        overwrite: "auto"
      });
    });

    btn.addEventListener("mouseleave", () => {
      const topChars = topContainer.querySelectorAll("span");
      const botChars = bottomContainer.querySelectorAll("span");

      gsap.to(topChars, {
        yPercent: 0,
        rotateX: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.015,
        ease: "power2.inOut",
        overwrite: "auto"
      });

      gsap.to(botChars, {
        yPercent: 100,
        rotateX: 75,
        opacity: 0,
        duration: 0.4,
        stagger: 0.015,
        ease: "power2.inOut",
        overwrite: "auto"
      });
    });
  });
}
