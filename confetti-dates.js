(function () {
  const celebrationUtils = window.CelebrationUtils;
  let confettiLoopStarted = false;

  function runConfetti() {
    if (confettiLoopStarted) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    confettiLoopStarted = true;

    const defaults = {
      zIndex: 9999
    };
    const minIntervalMs = 1200;
    const maxIntervalMs = 2800;

    function randomInt(min, max) {
      return Math.floor(randomInRange(min, max + 1));
    }

    function fire(opts) {
      confetti(Object.assign({}, defaults, opts, {
        particleCount: randomInt(20, 80)
      }));
    }

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    function randomOrigin() {
      return {
        x: randomInRange(0.15, 0.85),
        y: randomInRange(0.45, 0.8)
      };
    }

    const explosionSteps = [
      {
        delay: 0,
        opts: {
          startVelocity: 55
        }
      },
      {
        delay: 250,
        opts: {}
      },
      {
        delay: 500,
        opts: {
          decay: 0.91,
          scalar: 0.8
        }
      },
      {
        delay: 750,
        opts: {
          startVelocity: 25,
          decay: 0.92,
          scalar: 1.2
        }
      },
      {
        delay: 1000,
        opts: {
          startVelocity: 45
        }
      }
    ];

    function triggerExplosion() {
      explosionSteps.forEach(function (step) {
        setTimeout(function () {
          fire(Object.assign({}, step.opts, {
            origin: randomOrigin(),
            angle: randomInt(30, 120),
            spread: randomInt(20, 140)
          }));
        }, step.delay);
      });
    }

    function scheduleExplosionLoop() {
      triggerExplosion();
      const nextDelay = Math.floor(randomInRange(minIntervalMs, maxIntervalMs));
      setTimeout(scheduleExplosionLoop, nextDelay);
    }

    scheduleExplosionLoop();
  }

  window.startBirthdayConfetti = runConfetti;

  if (celebrationUtils && celebrationUtils.isCelebrationDate(new Date())) {
    runConfetti();
  }
})();
