!function (a) {
  "function" == typeof define && define.amd ? define(["jquery", "moment"], a) : a(jQuery, moment);
}(function (a, b) {
  function c(a, b, c, e) {
    var f = "";switch (c) {case "s":
        return e ? "muutaman sekunnin" : "muutama sekunti";case "m":
        return e ? "minuutin" : "minuutti";case "mm":
        f = e ? "minuutin" : "minuuttia";break;case "h":
        return e ? "tunnin" : "tunti";case "hh":
        f = e ? "tunnin" : "tuntia";break;case "d":
        return e ? "päivän" : "päivä";case "dd":
        f = e ? "päivän" : "päivää";break;case "M":
        return e ? "kuukauden" : "kuukausi";case "MM":
        f = e ? "kuukauden" : "kuukautta";break;case "y":
        return e ? "vuoden" : "vuosi";case "yy":
        f = e ? "vuoden" : "vuotta";}return f = d(a, e) + " " + f;
  }function d(a, b) {
    return 10 > a ? b ? f[a] : e[a] : a;
  }var e = "nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän".split(" "),
      f = ["nolla", "yhden", "kahden", "kolmen", "neljän", "viiden", "kuuden", e[7], e[8], e[9]];(b.defineLocale || b.lang).call(b, "fi", { months: "tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu".split("_"), monthsShort: "tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu".split("_"), weekdays: "sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai".split("_"), weekdaysShort: "su_ma_ti_ke_to_pe_la".split("_"), weekdaysMin: "su_ma_ti_ke_to_pe_la".split("_"), longDateFormat: { LT: "HH.mm", LTS: "HH.mm.ss", L: "DD.MM.YYYY", LL: "Do MMMM[ta] YYYY", LLL: "Do MMMM[ta] YYYY, [klo] LT", LLLL: "dddd, Do MMMM[ta] YYYY, [klo] LT", l: "D.M.YYYY", ll: "Do MMM YYYY", lll: "Do MMM YYYY, [klo] LT", llll: "ddd, Do MMM YYYY, [klo] LT" }, calendar: { sameDay: "[tänään] [klo] LT", nextDay: "[huomenna] [klo] LT", nextWeek: "dddd [klo] LT", lastDay: "[eilen] [klo] LT", lastWeek: "[viime] dddd[na] [klo] LT", sameElse: "L" }, relativeTime: { future: "%s päästä", past: "%s sitten", s: c, m: c, mm: c, h: c, hh: c, d: c, dd: c, M: c, MM: c, y: c, yy: c }, ordinalParse: /\d{1,2}\./, ordinal: "%d.", week: { dow: 1, doy: 4 } }), a.fullCalendar.datepickerLang("fi", "fi", { closeText: "Sulje", prevText: "&#xAB;Edellinen", nextText: "Seuraava&#xBB;", currentText: "Tänään", monthNames: ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu", "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"], monthNamesShort: ["Tammi", "Helmi", "Maalis", "Huhti", "Touko", "Kesä", "Heinä", "Elo", "Syys", "Loka", "Marras", "Joulu"], dayNamesShort: ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"], dayNames: ["Sunnuntai", "Maanantai", "Tiistai", "Keskiviikko", "Torstai", "Perjantai", "Lauantai"], dayNamesMin: ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"], weekHeader: "Vk", dateFormat: "d.m.yy", firstDay: 1, isRTL: !1, showMonthAfterYear: !1, yearSuffix: "" }), a.fullCalendar.lang("fi", { buttonText: { month: "Kuukausi", week: "Viikko", day: "Päivä", list: "Tapahtumat" }, allDayText: "Koko päivä", eventLimitText: "lisää" });
});