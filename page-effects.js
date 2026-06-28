(function () {
  var storageKey = 'ana-theme';
  var toggleButton = document.getElementById('theme-toggle');
  var birthdayBanner = document.getElementById('birthday-banner');
  var birthdayBannerTrack = document.getElementById('birthday-banner-track');
  var birthdayAudio = null;
  var birthdayAudioUnlockBound = false;
  var celebrationUtils = window.CelebrationUtils;

  function setTheme(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    if (toggleButton) {
      toggleButton.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    }
  }

  function setBirthdayBanner() {
    if (!birthdayBanner || !birthdayBannerTrack) {
      return;
    }

    var now = new Date();
    var message = celebrationUtils ? celebrationUtils.getBannerMessage(now) : '';

    if (!message) {
      birthdayBanner.hidden = true;
      return;
    }

    birthdayBanner.hidden = false;
    birthdayBannerTrack.textContent = (message + '  •  ').repeat(12);
  }

  function initTheme() {
    var savedTheme = null;
    try {
      savedTheme = localStorage.getItem(storageKey);
    } catch (err) {
      savedTheme = null;
    }

    if (savedTheme === 'dark') {
      setTheme(true);
    } else if (savedTheme === 'light') {
      setTheme(false);
    } else {
      setTheme(celebrationUtils ? celebrationUtils.isCelebrationDate(new Date()) : false);
    }

    if (toggleButton) {
      toggleButton.addEventListener('click', function () {
        var isDark = !document.body.classList.contains('dark-mode');
        setTheme(isDark);
        try {
          localStorage.setItem(storageKey, isDark ? 'dark' : 'light');
        } catch (err) {
          // Ignore storage errors in restricted browsing contexts.
        }
      });
    }
  }

  function getBirthdayAudio() {
    if (!birthdayAudio) {
      birthdayAudio = new Audio('hbd.mp3');
      birthdayAudio.loop = true;
      birthdayAudio.volume = 1;
      birthdayAudio.playbackRate = 0.9;
      birthdayAudio.preload = 'auto';
    }

    return birthdayAudio;
  }

  function playBirthdayAudio() {
    var audio = getBirthdayAudio();
    if (!audio) {
      return Promise.resolve();
    }

    return audio.play();
  }

  function bindAudioUnlock() {
    if (birthdayAudioUnlockBound) {
      return;
    }

    birthdayAudioUnlockBound = true;
    var events = ['click', 'touchstart', 'keydown'];
    events.forEach(function (eventName) {
      document.addEventListener(eventName, playBirthdayAudio, { once: true });
    });
  }

  function requestBirthdayAudioPlayback() {
    playBirthdayAudio().catch(function () {
      // Autoplay can be blocked; retry after first user interaction.
      bindAudioUnlock();
    });
  }

  function triggerBirthdayCelebration(options) {
    var celebrationOptions = options || {};
    var now = new Date();
    var defaultMessage = celebrationUtils ? celebrationUtils.getBannerMessage(now) : '';
    var message = celebrationOptions.message || defaultMessage || 'Happy Birthday';

    if (birthdayBanner && birthdayBannerTrack) {
      birthdayBanner.hidden = false;
      birthdayBannerTrack.textContent = (message + '  •  ').repeat(12);
    }

    setTheme(true);
    requestBirthdayAudioPlayback();
  }

  window.birthday = function (options) {
    triggerBirthdayCelebration(options);

    if (typeof window.startBirthdayConfetti === 'function') {
      window.startBirthdayConfetti();
    }
  };

  initTheme();
  setBirthdayBanner();

  if (celebrationUtils && celebrationUtils.isCelebrationDate(new Date())) {
    requestBirthdayAudioPlayback();
  }
})();
