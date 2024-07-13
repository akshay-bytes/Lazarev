document.addEventListener("DOMContentLoaded", function () {
  // Initialize Lenis after a delay
  setTimeout(function () {
    const lenis = new Lenis({
      // your lenis options
      lerp: 0.05,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }, 500);
});

function loadingAnimation() {
  var tl = gsap.timeline();

  // Initial page scale animation
  tl.fromTo(
    "#page1",
    {
      scaleX: 0.7,
      scaleY: 0,
      borderRadius: "1vw",
      transform: "translateY(30%)",
      opacity: 0,
    },
    {
      scaleX: 0.7,
      scaleY: 0.05,
      duration: 0.5,
      ease: "easeOut",
      opacity: 1,
    }
  );

  // Final page scale animation
  tl.to("#page1", {
    scaleX: 1,
    scaleY: 1,
    duration: 2,
    ease: "expo.out",
    borderRadius: 0,
    transform: "translateY(0%)",
  });

  // Show elements with stagger and transform
  tl.fromTo(
    ["#head h1 span", "#para"],
    {
      display: "inline-block",
      y: 100,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      stagger: {
        amount: 1.2,
      },
      duration: 2,
      ease: "expo.out",
    },
    "-=1.7" // Start this animation before the previous one ends
  );

  // Show navigation with opacity animation
  tl.fromTo(
    "nav",
    {
      opacity: 0,
    },
    {
      opacity: 1,
      duration: 1.5,
      ease: "power4.out",
    },
    "-=2.5" // Start this animation before the previous one ends
  );
}
document.addEventListener("DOMContentLoaded", loadingAnimation);

function navAnimation() {
  var navbar = document.querySelector("#navbar");
  var navRight = document.querySelector("#nav-center #center-right");
  var navItems = document.querySelectorAll("#nav-center #center-right h4");
  var navCenter = document.querySelector("#nav-center");

  if (!navbar || !navRight || !navItems.length || !navCenter) {
    console.error("One or more navigation elements are missing.");
    return;
  }

  // Navbar height adjust animation
  var initialNavHeight = navbar.offsetHeight;
  var initialPaddingTop = window.getComputedStyle(navCenter).paddingTop;
  var initialPaddingBottom = window.getComputedStyle(navCenter).paddingBottom;

  window.addEventListener("scroll", function () {
    if (window.scrollY > 0) {
      gsap.to(navbar, {
        height: "8.5vh",
        duration: 0.5,
        delay: 0.2,
      });
      gsap.to(navCenter, {
        paddingTop: "3vh",
        paddingBottom: "3vh",
        duration: 0.5,
        delay: 0.2,
      });
    } else {
      gsap.to(navbar, {
        height: initialNavHeight,
        duration: 0.8,
        ease: "power4.out",
      });
      gsap.to(navCenter, {
        paddingTop: initialPaddingTop,
        paddingBottom: initialPaddingBottom,
        duration: 0.8,
        ease: "power4.out",
      });
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
        .to(".cover", {
          height: "25.5vh",
          duration: 0.001,
          ease: "power4.in",
        })
        .to("#nav-center #center-right .nav-elem h5", {
          display: "block",
          duration: 0.01,
        })
        .to("#nav-center #center-right .nav-elem h5 span", {
          display: "block",
          duration: 0.1,
          delay: 0,
          opacity: 1,
        })
        .from("#nav-center #center-right .nav-elem h5 span", {
          y: 20,
          duration: 0.4,
          stagger: {
            amount: 0.6,
          },
        });
    });

    navRight.addEventListener("mouseleave", function () {
      if (enterTl && enterTl.isActive()) enterTl.kill();

      leaveTl = gsap.timeline();
      leaveTl
        .to("#nav-center h5 span", {
          opacity: 1,
          y: 20,
          duration: 0.1,
          stagger: {
            amount: 0.1,
          },
        })
        .to("#nav-center h5 span", {
          display: "none",
          duration: 0.2,
        })
        .to("#nav-center #center-right .nav-elem h5", {
          display: "none",
          duration: 0,
        })
        .to(".cover", {
          height: 0,
          duration: 0.001,
          delay: -0.3,
          ease: "power4.in",
        })
        .set("#nav-center span", {
          display: "none",
          opacity: 0,
          y: 0,
        })
        .eventCallback("onComplete", function () {
          isHovering = false;
        });
    });
  });
}
navAnimation();

// Create Hover Cursor on Image List
function cursorImageAnimation() {
  var list = document.querySelectorAll(".list-item");

  if (!list.length) {
    console.error("No list items found with the class .list-item.");
    return;
  }

  list.forEach(function (elem) {
    var targetElement = elem.querySelector("img");

    if (!targetElement) {
      console.error("No image found within the list item:", elem);
      return;
    }

    elem.addEventListener("mouseenter", function () {
      gsap.to(targetElement, {
        scale: 1,
        duration: 0.5,
      });
    });

    elem.addEventListener("mouseleave", function () {
      gsap.to(targetElement, {
        scale: 0,
        duration: 0.5,
      });
    });

    elem.addEventListener("mousemove", function (dets) {
      var rect = elem.getBoundingClientRect();
      gsap.to(targetElement, {
        x: dets.clientX - rect.left - targetElement.offsetWidth / 2,
        y: dets.clientY - rect.top - targetElement.offsetHeight / 2,
        duration: 0.5,
      });
    });
  });
}
cursorImageAnimation();

// Play Video on Hover
function videoPlayEffect() {
  document.addEventListener("DOMContentLoaded", function () {
    var videoTrigger = document.querySelector("#page3 .vid-play");
    var videoElement = document.querySelector("#page3 video");

    if (!videoTrigger || !videoElement) {
      console.error("Video trigger or video element not found.");
      return;
    }

    videoTrigger.addEventListener("click", function () {
      videoElement.play();
      var tl = gsap.timeline();
      tl.set(videoElement, {
        display: "block",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        borderRadius: 0,
        zIndex: 999,
        opacity: 1,
      });
      tl.fromTo(
        videoElement,
        {
          scaleX: 0.8,
          scaleY: 0,
          borderRadius: "1vw",
        },
        {
          scaleX: 0.8,
          scaleY: 0.2,
          duration: 0.7,
          ease: "easeInOut",
          borderRadius: 0,
        }
      );
      tl.to(videoElement, {
        scaleX: 1,
        scaleY: 1,
        duration: 0.5,
      });
    });

    videoElement.addEventListener("click", function () {
      videoElement.pause();
      var tl = gsap.timeline();
      tl.to(videoElement, {
        scaleX: 0.9,
        scaleY: 0.9,
        opacity: 0,
        duration: 0.3,
        onComplete: function () {
          gsap.set(videoElement, { display: "none" });
        },
      });
    });
  });
}
videoPlayEffect();

// Function to create hover cursor on Reels
function reelHoverEffect() {
  var containers = document.querySelectorAll(
    "#page7 section .container .right-container"
  );

  containers.forEach(function (container) {
    var reel = container.querySelector(".hover-circle");

    container.addEventListener("mouseenter", function () {
      gsap.to(reel, {
        delay: 0.1,
        scale: 1,
        duration: 0.5,
      });
    });

    container.addEventListener("mouseleave", function () {
      gsap.to(reel, {
        scale: 0,
        duration: 0.5,
      });
    });

    container.addEventListener("mousemove", function (dets) {
      var rect = container.getBoundingClientRect();
      gsap.to(reel, {
        x: dets.clientX - rect.left - reel.offsetWidth / 2,
        y: dets.clientY - rect.top - reel.offsetHeight / 2,
        duration: 0.5,
      });
    });
  });

  document.body.addEventListener("mouseleave", function () {
    containers.forEach(function (container) {
      var reel = container.querySelector(".hover-circle");
      gsap.to(reel, {
        scale: 0,
        duration: 0.2,
      });
    });
  });
}
reelHoverEffect();

// Function to Play Reels on Hover
function reelPlayEffect() {
  var containers = document.querySelectorAll(".right-container");

  containers.forEach(function (container) {
    container.addEventListener("mouseenter", function () {
      var videoElement = container.querySelector("video");
      if (videoElement) {
        videoElement.style.display = "block";
        videoElement.currentTime = 0; //use this to restart the video from start
        videoElement.play();
      }
    });

    container.addEventListener("mouseleave", function () {
      var videoElement = container.querySelector("video");
      if (videoElement) {
        videoElement.style.display = "none";
        // videoElement.load(); // or can use this to restart the video from start
      }
    });
  });
}
reelPlayEffect();

// Function to Play Case Studies Reels on Hover
function caseStudyreelPlayEffect() {
  var caseContainers = document.querySelectorAll(".case");

  caseContainers.forEach(function (caseContainer) {
    caseContainer.addEventListener("mouseenter", function () {
      var videoElement = caseContainer.querySelector("video");
      if (videoElement) {
        videoElement.currentTime = 0; // Restart the video from the beginning
        videoElement.play();
      }
    });

    caseContainer.addEventListener("mouseleave", function () {
      var videoElement = caseContainer.querySelector("video");
      if (videoElement) {
        // videoElement.load();
      }
    });
  });
}
caseStudyreelPlayEffect();

// Animation on Scroll

function onScrollAnimation() {
  gsap.registerPlugin(ScrollTrigger);
  gsap.from(".bottom-c .blocks .block .btn-setup", {
    x: 0,
    duration: 0.7,
    // stagger: {
    //   amount: 1,
    // },

    scrollTrigger: {
      trigger: ".bottom-c",
      // scroller: "#main",
      scroller: "body",
      // markers: true,
      scrub: true,
      start: "top 80%",
    },
  });
}
onScrollAnimation();

// Function to rotate on scroll
function onScrollRotate() {
  gsap.registerPlugin(ScrollTrigger);
  gsap.to("#page12 .section4 .container2 .left svg", {
    rotation: -180,
    duration: 5, // Duration of one full rotation
    scrollTrigger: {
      trigger: "#page12 .section4 .container2",
      // scroller: "#main",
      scroller: "body",
      // markers: true,
      scrub: true,
      start: "top 80%",
      end: "bottom 20%",
    },
  });
}
onScrollRotate();

// function to Scale on Scroll
function onScrollScale() {
  gsap.registerPlugin(ScrollTrigger);
  gsap.from("#page12 .section5 .img-container>img", {
    scale: 1.1,
    duration: 0.8, // Duration of one full rotation
    scrollTrigger: {
      trigger: "#page12 .section5",
      // scroller: "#main",
      scroller: "body",
      // markers: true,
      scrub: true,
      start: "top 80%",
      end: "bottom 20%",
    },
  });
}
onScrollScale();

function HoverEffect() {
  var containers = document.querySelectorAll(".cover-container");

  containers.forEach(function (container) {
    var reel = container.querySelector(".hov");

    container.addEventListener("mouseenter", function () {
      gsap.to(reel, {
        delay: 0.1,
        scale: 1,
        duration: 0.5,
      });
    });

    container.addEventListener("mouseleave", function () {
      gsap.to(reel, {
        scale: 0,
        duration: 0.5,
      });
    });

    container.addEventListener("mousemove", function (dets) {
      var rect = container.getBoundingClientRect();
      gsap.to(reel, {
        x: dets.clientX - rect.left - reel.offsetWidth / 2 + 12,
        y: dets.clientY - rect.top - reel.offsetHeight / 2 - 150,
        duration: 0.5,
      });
    });
  });

  document.body.addEventListener("mouseleave", function () {
    containers.forEach(function (container) {
      var reel = container.querySelector(".hov");
      gsap.to(reel, {
        scale: 0,
        duration: 0.2,
      });
    });
  });
}
HoverEffect();

// Morph Animation Code

function morphSvgAnimation() {
  const morphSvg = document.querySelector(".cover-container");
  const morphPathStart = document.getElementById("start-path");
  const morphPathEnd = document.getElementById("end-path");

  const startPath = morphPathStart.getAttribute("d");
  const endPath = morphPathEnd.getAttribute("d");

  morphSvg.addEventListener("mouseenter", function () {
    gsap.to(morphPathStart, {
      attr: {
        d: endPath,
        duration: 0.5,
        ease: "power4.inOut",
      },
    });
  });

  morphSvg.addEventListener("mouseleave", function () {
    gsap.to(morphPathStart, {
      attr: {
        d: startPath,
        duration: 0.5,
        ease: "power4.inOut",
      },
    });
  });
}
// morphSvgAnimation();

function formAnimation() {
  const emailInput = document.getElementById("Email");
  const submitButton = document.querySelector(".submit-target");
  const inputBaseline = document.querySelector(".input-baseline");

  // Function to update button state based on email validity
  function updateButtonState() {
    if (emailInput.validity.valid) {
      submitButton.removeAttribute("disabled");
      submitButton.style.cursor = "pointer"; // Ensure cursor style matches button state
      submitButton.style.backgroundColor = "#666"; // Ensure cursor style matches button state
    } else {
      submitButton.setAttribute("disabled", "disabled");
      submitButton.style.cursor = "not-allowed"; // Ensure cursor style matches button state
      submitButton.style.backgroundColor = "#3d3d3d"; // Ensure cursor style matches button state
    }
  }

  // Update button state on input in email field
  emailInput.addEventListener("input", updateButtonState);

  // Update button state on email field focus and blur
  emailInput.addEventListener("focus", function () {
    updateButtonState(); // Update button state on focus
  });

  // Update cursor style on button hover
  submitButton.addEventListener("mouseenter", function () {
    if (submitButton.disabled) {
      submitButton.style.cursor = "not-allowed";
    } else {
      submitButton.style.cursor = "pointer";
    }
  });

  submitButton.addEventListener("mouseleave", function () {
    if (submitButton.disabled) {
      submitButton.style.cursor = "not-allowed";
    } else {
      submitButton.style.cursor = "pointer";
    }
  });

  // Disable the button initially
  submitButton.setAttribute("disabled", "disabled");
}
formAnimation();

function copyText(button) {
  var textToCopy = button.querySelector("#buttonText").textContent;

  if (navigator.clipboard && window.isSecureContext) {
    // Use the modern Clipboard API
    navigator.clipboard.writeText(textToCopy).then(
      function () {
        console.log("Text copied to clipboard successfully!");
        // Optional: Show feedback to the user
        showCopyFeedback(button);
      },
      function (err) {
        console.error("Failed to copy text: ", err);
        // Optional: Show error feedback to the user
      }
    );
  } else {
    // Fallback to the old method if Clipboard API is not supported
    var tempTextarea = document.createElement("textarea");
    tempTextarea.value = textToCopy;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    try {
      document.execCommand("copy");
      console.log("Text copied to clipboard successfully!");
      // Optional: Show feedback to the user
      showCopyFeedback(button);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      // Optional: Show error feedback to the user
    } finally {
      document.body.removeChild(tempTextarea);
    }
  }
}

function showCopyFeedback(button) {
  // Optional: Show some feedback to the user after copying
  var originalText = button.querySelector("#buttonText").textContent;
  button.querySelector("#buttonText").textContent = "Copied!";
  setTimeout(function () {
    button.querySelector("#buttonText").textContent = originalText;
  }, 1500);
}

document.addEventListener("DOMContentLoaded", function () {
  var copyButton = document.getElementById("copyButton");
  if (copyButton) {
    copyButton.addEventListener("click", function () {
      copyText(this);
    });
  } else {
    console.error("No element with ID 'copyButton' found.");
  }
});
