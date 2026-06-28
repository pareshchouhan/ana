(function () {
  function getCelebrationInfo(now) {
    var month = now.getMonth();
    var day = now.getDate();

    if (month === 0 && day === 18) {
      return {
        isCelebrationDate: true,
        bannerMessage: 'Happy Birthday Paresh'
      };
    }

    if (month === 3 && day === 25) {
      return {
        isCelebrationDate: true,
        bannerMessage: 'Happy Birthday Anastasia'
      };
    }

    return {
      isCelebrationDate: false,
      bannerMessage: ''
    };
  }

  window.CelebrationUtils = {
    getCelebrationInfo: getCelebrationInfo,
    isCelebrationDate: function (now) {
      return getCelebrationInfo(now).isCelebrationDate;
    },
    getBannerMessage: function (now) {
      return getCelebrationInfo(now).bannerMessage;
    }
  };
})();
