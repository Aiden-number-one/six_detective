!function (a) {
  "function" == typeof define && define.amd ? define(["jquery", "moment"], a) : a(jQuery, moment);
}(function (a, b) {
  function c(a, b, c) {
    var d = a + " ";switch (c) {case "m":
        return b ? "ena minuta" : "eno minuto";case "mm":
        return d += 1 === a ? "minuta" : 2 === a ? "minuti" : 3 === a || 4 === a ? "minute" : "minut";case "h":
        return b ? "ena ura" : "eno uro";case "hh":
        return d += 1 === a ? "ura" : 2 === a ? "uri" : 3 === a || 4 === a ? "ure" : "ur";case "dd":
        return d += 1 === a ? "dan" : "dni";case "MM":
        return d += 1 === a ? "mesec" : 2 === a ? "meseca" : 3 === a || 4 === a ? "mesece" : "mesecev";case "yy":
        return d += 1 === a ? "leto" : 2 === a ? "leti" : 3 === a || 4 === a ? "leta" : "let";}
  }(b.defineLocale || b.lang).call(b, "sl", { months: "januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december".split("_"), monthsShort: "jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.".split("_"), weekdays: "nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota".split("_"), weekdaysShort: "ned._pon._tor._sre._čet._pet._sob.".split("_"), weekdaysMin: "ne_po_to_sr_če_pe_so".split("_"), longDateFormat: { LT: "H:mm", LTS: "LT:ss", L: "DD. MM. YYYY", LL: "D. MMMM YYYY", LLL: "D. MMMM YYYY LT", LLLL: "dddd, D. MMMM YYYY LT" }, calendar: { sameDay: "[danes ob] LT", nextDay: "[jutri ob] LT", nextWeek: function nextWeek() {
        switch (this.day()) {case 0:
            return "[v] [nedeljo] [ob] LT";case 3:
            return "[v] [sredo] [ob] LT";case 6:
            return "[v] [soboto] [ob] LT";case 1:case 2:case 4:case 5:
            return "[v] dddd [ob] LT";}
      }, lastDay: "[včeraj ob] LT", lastWeek: function lastWeek() {
        switch (this.day()) {case 0:case 3:case 6:
            return "[prejšnja] dddd [ob] LT";case 1:case 2:case 4:case 5:
            return "[prejšnji] dddd [ob] LT";}
      }, sameElse: "L" }, relativeTime: { future: "čez %s", past: "%s nazaj", s: "nekaj sekund", m: c, mm: c, h: c, hh: c, d: "en dan", dd: c, M: "en mesec", MM: c, y: "eno leto", yy: c }, ordinalParse: /\d{1,2}\./, ordinal: "%d.", week: { dow: 1, doy: 7 } }), a.fullCalendar.datepickerLang("sl", "sl", { closeText: "Zapri", prevText: "&#x3C;Prejšnji", nextText: "Naslednji&#x3E;", currentText: "Trenutni", monthNames: ["Januar", "Februar", "Marec", "April", "Maj", "Junij", "Julij", "Avgust", "September", "Oktober", "November", "December"], monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"], dayNames: ["Nedelja", "Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota"], dayNamesShort: ["Ned", "Pon", "Tor", "Sre", "Čet", "Pet", "Sob"], dayNamesMin: ["Ne", "Po", "To", "Sr", "Če", "Pe", "So"], weekHeader: "Teden", dateFormat: "dd.mm.yy", firstDay: 1, isRTL: !1, showMonthAfterYear: !1, yearSuffix: "" }), a.fullCalendar.lang("sl", { buttonText: { month: "Mesec", week: "Teden", day: "Dan", list: "Dnevni red" }, allDayText: "Ves dan", eventLimitText: "več" });
});