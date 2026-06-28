(function () {
  var storageKey = 'ana-theme';
  var toggleButton = document.getElementById('theme-toggle');
  var birthdayBanner = document.getElementById('birthday-banner');
  var birthdayBannerTrack = document.getElementById('birthday-banner-track');
  var birthdayAudio = null;
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

  function startAudioOnInteraction() {
    var audio = getBirthdayAudio();
    if (!audio) {
      return;
    }

    audio.play().catch(function () {
      // Ignore autoplay rejections; next interaction can retry.
    });
  }

  function bindAudioUnlock() {
    var events = ['click', 'touchstart', 'keydown'];
    events.forEach(function (eventName) {
      document.addEventListener(eventName, startAudioOnInteraction, { once: true });
    });
  }

  initTheme();
  setBirthdayBanner();
  bindAudioUnlock();
})();
