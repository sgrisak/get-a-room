document.addEventListener("DOMContentLoaded", function () {
  // Get time elements
  const windowView = document.querySelector(".window-view");
  const windowShadow = document.querySelector(".window-shadow");
  const timeDisplay = document.getElementById("time-display");
  const leftWall = document.querySelector(".left-wall");
  const rightWall = document.querySelector(".right-wall");
  const floor = document.querySelector(".floor");

  // Setup clock hour marks
  const hourMarks = document.querySelector(".hour-marks");
  for (let i = 0; i < 12; i++) {
    const mark = document.createElement("div");
    mark.className = "hour-mark";
    mark.style.transform = `rotate(${i * 30}deg)`;
    hourMarks.appendChild(mark);
  }

  // Update clock
  function updateClock() {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours() % 12;

    // Calculate rotation angles
    const secondsAngle = seconds * 6; // 6 degrees per second
    const minutesAngle = minutes * 6 + seconds * 0.1; // 6 degrees per minute + small adjustment for seconds
    const hoursAngle = hours * 30 + minutes * 0.5; // 30 degrees per hour + adjustment for minutes

    // Apply rotations
    document.querySelector(
      ".second-hand"
    ).style.transform = `rotate(${secondsAngle}deg)`;
    document.querySelector(
      ".minute-hand"
    ).style.transform = `rotate(${minutesAngle}deg)`;
    document.querySelector(
      ".hour-hand"
    ).style.transform = `rotate(${hoursAngle}deg)`;
  }

  // Update time and visuals
  function updateTimeVisuals() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // Format time display
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? "0" + minutes : minutes;
    timeDisplay.textContent = `Local time: ${displayHours}:${displayMinutes} ${ampm}`;

    // Set colors and shadows based on time
    let skyColor, shadowOpacity, shadowX, shadowY, shadowWidth, shadowHeight;
    let roomBrightness = 1;

    // Early morning (before sunrise)
    if (hours >= 0 && hours < 6) {
      skyColor = `rgb(${5 + hours * 3}, ${5 + hours * 3}, ${30 + hours * 5})`;
      shadowOpacity = 0.05;
      shadowX = "100px";
      shadowY = "90px";
      shadowWidth = "300px";
      shadowHeight = "450px";
      roomBrightness = 0.7;
    }
    // Morning (sunrise)
    else if (hours >= 6 && hours < 10) {
      const progress = (hours - 6) / 4;
      const r = Math.floor(130 + progress * 125);
      const g = Math.floor(130 + progress * 125);
      const b = Math.floor(200 + progress * 55);
      skyColor = `rgb(${r}, ${g}, ${b})`;
      shadowOpacity = 0.1 + progress * 0.2;
      const shadowYPos = 90 + progress * 270;
      shadowX = "100px";
      shadowY = `${shadowYPos}px`;
      shadowWidth = "300px";
      shadowHeight = `${Math.max(60, 240 - progress * 180)}px`;
      roomBrightness = 0.8 + progress * 0.2;
    }
    // Daytime
    else if (hours >= 10 && hours < 16) {
      skyColor = "rgb(135, 206, 235)";
      shadowOpacity = 0.3;
      shadowX = "100px";
      shadowY = "360px";
      shadowWidth = "300px";
      shadowHeight = "90px";
      roomBrightness = 1;
    }
    // Afternoon/Evening
    else if (hours >= 16 && hours < 19) {
      const progress = (hours - 16) / 3;
      const r = Math.floor(135 + progress * 120);
      const g = Math.floor(206 - progress * 150);
      const b = Math.floor(235 - progress * 175);
      skyColor = `rgb(${r}, ${g}, ${b})`;
      shadowOpacity = 0.3 - progress * 0.1;
      const shadowYPos = 360 - progress * 90;
      shadowX = "100px";
      shadowY = `${shadowYPos}px`;
      shadowWidth = "300px";
      shadowHeight = `${90 + progress * 240}px`;
      roomBrightness = 1 - progress * 0.2;
    }
    // Night
    else {
      // Adjusted to ensure proper night sky color after 7pm
      skyColor = `rgb(15, 15, 40)`;
      shadowOpacity = 0.05;
      shadowX = "100px";
      shadowY = "90px";
      shadowWidth = "300px";
      shadowHeight = "450px";
      roomBrightness = 0.7;
    }

    // Apply changes
    windowView.style.backgroundColor = skyColor;
    windowShadow.style.opacity = shadowOpacity;
    windowShadow.style.left = shadowX;
    windowShadow.style.top = shadowY;
    windowShadow.style.width = shadowWidth;
    windowShadow.style.height = shadowHeight;
    windowShadow.style.background = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0))`;

    // Adjust room brightness
    leftWall.style.filter = `brightness(${roomBrightness})`;
    rightWall.style.filter = `brightness(${roomBrightness})`;
    floor.style.filter = `brightness(${roomBrightness})`;

    // Add stars at night
    if (hours >= 19 || hours < 6) {
      addStars();
    } else {
      removeStars();
    }

    // Update clock
    updateClock();
  }

  function addStars() {
    if (!document.querySelector(".stars")) {
      const starsContainer = document.createElement("div");
      starsContainer.className = "stars";

      // Create stars
      for (let i = 0; i < 40; i++) {
        const star = document.createElement("div");
        star.className = "star";
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.opacity = Math.random() * 0.8 + 0.2;

        // Set random star size (1-3px)
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        // Twinkling animation
        const animationDuration = 2 + Math.random() * 3;
        star.style.animation = `twinkle ${animationDuration}s infinite alternate`;

        starsContainer.appendChild(star);
      }

      document.querySelector(".room-container").appendChild(starsContainer);
    }
  }

  function removeStars() {
    const stars = document.querySelector(".stars");
    if (stars) {
      stars.remove();
    }
  }

  // Initial update
  updateTimeVisuals();

  // Update clock every second
  setInterval(updateClock, 1000);

  // Update lighting every minute
  setInterval(updateTimeVisuals, 60000);
});
