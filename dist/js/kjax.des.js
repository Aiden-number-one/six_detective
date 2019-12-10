/*
 * @Description: kddes
 * @Author: mus
 * @Date: 2019-09-19 20:07:10
 * @LastEditTime: 2019-12-09 10:14:42
 * @LastEditors: mus
 * @Email: mus@szkingdom.com
 */
const kddes = {
  r: function(r, n, m, s) {
    (n && n != '') || (n = String.fromCharCode(0x6b, 0x69, 0x6e, 0x67, 0x64, 0x6f, 0x6d));
    var c,
      i,
      k,
      t,
      u,
      b,
      l = r.length,
      v = '';
    if (
      (null != n && '' != n && ((c = kddes.e(n)), (t = c.length)),
      null != m && '' != m && ((i = kddes.e(m)), (u = i.length)),
      null != s && '' != s && ((k = kddes.e(s)), (b = k.length)),
      l > 0)
    )
      if (4 > l) {
        var w,
          A = kddes.a(r);
        if (null != n && '' != n && null != m && '' != m && null != s && '' != s) {
          var y, g, j, h;
          for (y = A, g = 0; t > g; g++) y = kddes.o(y, c[g]);
          for (j = 0; u > j; j++) y = kddes.o(y, i[j]);
          for (h = 0; b > h; h++) y = kddes.o(y, k[h]);
          w = y;
        } else if (null != n && '' != n && null != m && '' != m) {
          var y, g, j;
          for (y = A, g = 0; t > g; g++) y = kddes.o(y, c[g]);
          for (j = 0; u > j; j++) y = kddes.o(y, i[j]);
          w = y;
        } else if (null != n && '' != n) {
          var y,
            g = 0;
          for (y = A, g = 0; t > g; g++) y = kddes.o(y, c[g]);
          w = y;
        }
        v = kddes.f(w);
      } else {
        var p = parseInt(l / 4),
          I = l % 4,
          d = 0;
        for (d = 0; p > d; d++) {
          var w,
            C = r.substring(4 * d + 0, 4 * d + 4),
            D = kddes.a(C);
          if (null != n && '' != n && null != m && '' != m && null != s && '' != s) {
            var y, g, j, h;
            for (y = D, g = 0; t > g; g++) y = kddes.o(y, c[g]);
            for (j = 0; u > j; j++) y = kddes.o(y, i[j]);
            for (h = 0; b > h; h++) y = kddes.o(y, k[h]);
            w = y;
          } else if (null != n && '' != n && null != m && '' != m) {
            var y, g, j;
            for (y = D, g = 0; t > g; g++) y = kddes.o(y, c[g]);
            for (j = 0; u > j; j++) y = kddes.o(y, i[j]);
            w = y;
          } else if (null != n && '' != n) {
            var y, g;
            for (y = D, g = 0; t > g; g++) y = kddes.o(y, c[g]);
            w = y;
          }
          v += kddes.f(w);
        }
        if (I > 0) {
          var w,
            B = r.substring(4 * p + 0, l),
            D = kddes.a(B);
          if (null != n && '' != n && null != m && '' != m && null != s && '' != s) {
            var y, g, j, h;
            for (y = D, g = 0; t > g; g++) y = kddes.o(y, c[g]);
            for (j = 0; u > j; j++) y = kddes.o(y, i[j]);
            for (h = 0; b > h; h++) y = kddes.o(y, k[h]);
            w = y;
          } else if (null != n && '' != n && null != m && '' != m) {
            var y, g, j;
            for (y = D, g = 0; t > g; g++) y = kddes.o(y, c[g]);
            for (j = 0; u > j; j++) y = kddes.o(y, i[j]);
            w = y;
          } else if (null != n && '' != n) {
            var y, g;
            for (y = D, g = 0; t > g; g++) y = kddes.o(y, c[g]);
            w = y;
          }
          v += kddes.f(w);
        }
      }
    return v;
  },
  e: function(r) {
    var e = new Array(),
      n = r.length,
      m = parseInt(n / 4),
      s = n % 4,
      f = 0;
    for (f = 0; m > f; f++) e[f] = kddes.a(r.substring(4 * f + 0, 4 * f + 4));
    return s > 0 && (e[f] = kddes.a(r.substring(4 * f + 0, n))), e;
  },
  a: function(r) {
    var e = r.length,
      a = new Array(64);
    if (4 > e) {
      var n = 0,
        m = 0,
        s = 0,
        f = 0;
      for (n = 0; e > n; n++) {
        var o = r.charCodeAt(n);
        for (m = 0; 16 > m; m++) {
          var c = 1,
            i = 0;
          for (i = 15; i > m; i--) c *= 2;
          a[16 * n + m] = parseInt(o / c) % 2;
        }
      }
      for (s = e; 4 > s; s++) {
        var o = 0;
        for (f = 0; 16 > f; f++) {
          var c = 1,
            i = 0;
          for (i = 15; i > f; i--) c *= 2;
          a[16 * s + f] = parseInt(o / c) % 2;
        }
      }
    } else
      for (n = 0; 4 > n; n++) {
        var o = r.charCodeAt(n);
        for (m = 0; 16 > m; m++) {
          var c = 1;
          for (i = 15; i > m; i--) c *= 2;
          a[16 * n + m] = parseInt(o / c) % 2;
        }
      }
    return a;
  },
  s: function(r) {
    var e;
    switch (r) {
      case '0000':
        e = '0';
        break;
      case '0001':
        e = '1';
        break;
      case '0010':
        e = '2';
        break;
      case '0011':
        e = '3';
        break;
      case '0100':
        e = '4';
        break;
      case '0101':
        e = '5';
        break;
      case '0110':
        e = '6';
        break;
      case '0111':
        e = '7';
        break;
      case '1000':
        e = '8';
        break;
      case '1001':
        e = '9';
        break;
      case '1010':
        e = 'A';
        break;
      case '1011':
        e = 'B';
        break;
      case '1100':
        e = 'C';
        break;
      case '1101':
        e = 'D';
        break;
      case '1110':
        e = 'E';
        break;
      case '1111':
        e = 'F';
    }
    return e;
  },
  f: function(r) {
    var e = '';
    for (i = 0; i < 16; i++) {
      var a = '';
      for (j = 0; j < 4; j++) a += r[4 * i + j];
      e += kddes.s(a);
    }
    return e;
  },
  o: function(r, e) {
    var a = kddes.A(e),
      n = kddes.c(r),
      m = new Array(32),
      s = new Array(32),
      f = new Array(32),
      o = 0,
      i = 0,
      k = 0,
      w = 0,
      y = 0;
    for (k = 0; 32 > k; k++) (m[k] = n[k]), (s[k] = n[32 + k]);
    for (o = 0; 16 > o; o++) {
      for (i = 0; 32 > i; i++) (f[i] = m[i]), (m[i] = s[i]);
      var g = new Array(48);
      for (w = 0; 48 > w; w++) g[w] = a[o][w];
      var j = kddes.u(kddes.l(kddes.b(kddes.u(kddes.t(s), g))), f);
      for (y = 0; 32 > y; y++) s[y] = j[y];
    }
    var h = new Array(64);
    for (o = 0; 32 > o; o++) (h[o] = s[o]), (h[32 + o] = m[o]);
    return kddes.v(h);
  },
  c: function(r) {
    var e = new Array(64);
    for (i = 0, m = 1, n = 0; i < 4; i++, m += 2, n += 2)
      for (j = 7, k = 0; j >= 0; j--, k++)
        (e[8 * i + k] = r[8 * j + m]), (e[8 * i + k + 32] = r[8 * j + n]);
    return e;
  },
  t: function(r) {
    var e = new Array(48);
    for (i = 0; i < 8; i++)
      (e[6 * i + 0] = 0 == i ? r[31] : r[4 * i - 1]),
        (e[6 * i + 1] = r[4 * i + 0]),
        (e[6 * i + 2] = r[4 * i + 1]),
        (e[6 * i + 3] = r[4 * i + 2]),
        (e[6 * i + 4] = r[4 * i + 3]),
        (e[6 * i + 5] = 7 == i ? r[0] : r[4 * i + 4]);
    return e;
  },
  u: function(r, e) {
    var a = new Array(r.length);
    for (i = 0; i < r.length; i++) a[i] = r[i] ^ e[i];
    return a;
  },
  b: function(r) {
    var e = new Array(32),
      a = '',
      n = [
        [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
        [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
        [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
        [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13],
      ],
      s = [
        [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
        [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
        [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
        [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9],
      ],
      f = [
        [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
        [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
        [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
        [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12],
      ],
      o = [
        [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
        [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
        [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
        [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14],
      ],
      c = [
        [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
        [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
        [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
        [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3],
      ],
      i = [
        [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
        [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
        [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
        [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13],
      ],
      k = [
        [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
        [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
        [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
        [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12],
      ],
      t = [
        [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
        [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
        [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
        [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11],
      ];
    for (m = 0; m < 8; m++) {
      var u = 0,
        b = 0;
      switch (
        ((u = 2 * r[6 * m + 0] + r[6 * m + 5]),
        (b = 2 * r[6 * m + 1] * 2 * 2 + 2 * r[6 * m + 2] * 2 + 2 * r[6 * m + 3] + r[6 * m + 4]),
        m)
      ) {
        case 0:
          a = kddes.w(n[u][b]);
          break;
        case 1:
          a = kddes.w(s[u][b]);
          break;
        case 2:
          a = kddes.w(f[u][b]);
          break;
        case 3:
          a = kddes.w(o[u][b]);
          break;
        case 4:
          a = kddes.w(c[u][b]);
          break;
        case 5:
          a = kddes.w(i[u][b]);
          break;
        case 6:
          a = kddes.w(k[u][b]);
          break;
        case 7:
          a = kddes.w(t[u][b]);
      }
      (e[4 * m + 0] = parseInt(a.substring(0, 1))),
        (e[4 * m + 1] = parseInt(a.substring(1, 2))),
        (e[4 * m + 2] = parseInt(a.substring(2, 3))),
        (e[4 * m + 3] = parseInt(a.substring(3, 4)));
    }
    return e;
  },
  l: function(r) {
    var e = new Array(32);
    return (
      (e[0] = r[15]),
      (e[1] = r[6]),
      (e[2] = r[19]),
      (e[3] = r[20]),
      (e[4] = r[28]),
      (e[5] = r[11]),
      (e[6] = r[27]),
      (e[7] = r[16]),
      (e[8] = r[0]),
      (e[9] = r[14]),
      (e[10] = r[22]),
      (e[11] = r[25]),
      (e[12] = r[4]),
      (e[13] = r[17]),
      (e[14] = r[30]),
      (e[15] = r[9]),
      (e[16] = r[1]),
      (e[17] = r[7]),
      (e[18] = r[23]),
      (e[19] = r[13]),
      (e[20] = r[31]),
      (e[21] = r[26]),
      (e[22] = r[2]),
      (e[23] = r[8]),
      (e[24] = r[18]),
      (e[25] = r[12]),
      (e[26] = r[29]),
      (e[27] = r[5]),
      (e[28] = r[21]),
      (e[29] = r[10]),
      (e[30] = r[3]),
      (e[31] = r[24]),
      e
    );
  },
  v: function(r) {
    var e = new Array(64);
    return (
      (e[0] = r[39]),
      (e[1] = r[7]),
      (e[2] = r[47]),
      (e[3] = r[15]),
      (e[4] = r[55]),
      (e[5] = r[23]),
      (e[6] = r[63]),
      (e[7] = r[31]),
      (e[8] = r[38]),
      (e[9] = r[6]),
      (e[10] = r[46]),
      (e[11] = r[14]),
      (e[12] = r[54]),
      (e[13] = r[22]),
      (e[14] = r[62]),
      (e[15] = r[30]),
      (e[16] = r[37]),
      (e[17] = r[5]),
      (e[18] = r[45]),
      (e[19] = r[13]),
      (e[20] = r[53]),
      (e[21] = r[21]),
      (e[22] = r[61]),
      (e[23] = r[29]),
      (e[24] = r[36]),
      (e[25] = r[4]),
      (e[26] = r[44]),
      (e[27] = r[12]),
      (e[28] = r[52]),
      (e[29] = r[20]),
      (e[30] = r[60]),
      (e[31] = r[28]),
      (e[32] = r[35]),
      (e[33] = r[3]),
      (e[34] = r[43]),
      (e[35] = r[11]),
      (e[36] = r[51]),
      (e[37] = r[19]),
      (e[38] = r[59]),
      (e[39] = r[27]),
      (e[40] = r[34]),
      (e[41] = r[2]),
      (e[42] = r[42]),
      (e[43] = r[10]),
      (e[44] = r[50]),
      (e[45] = r[18]),
      (e[46] = r[58]),
      (e[47] = r[26]),
      (e[48] = r[33]),
      (e[49] = r[1]),
      (e[50] = r[41]),
      (e[51] = r[9]),
      (e[52] = r[49]),
      (e[53] = r[17]),
      (e[54] = r[57]),
      (e[55] = r[25]),
      (e[56] = r[32]),
      (e[57] = r[0]),
      (e[58] = r[40]),
      (e[59] = r[8]),
      (e[60] = r[48]),
      (e[61] = r[16]),
      (e[62] = r[56]),
      (e[63] = r[24]),
      e
    );
  },
  w: function(r) {
    var e = '';
    switch (r) {
      case 0:
        e = '0000';
        break;
      case 1:
        e = '0001';
        break;
      case 2:
        e = '0010';
        break;
      case 3:
        e = '0011';
        break;
      case 4:
        e = '0100';
        break;
      case 5:
        e = '0101';
        break;
      case 6:
        e = '0110';
        break;
      case 7:
        e = '0111';
        break;
      case 8:
        e = '1000';
        break;
      case 9:
        e = '1001';
        break;
      case 10:
        e = '1010';
        break;
      case 11:
        e = '1011';
        break;
      case 12:
        e = '1100';
        break;
      case 13:
        e = '1101';
        break;
      case 14:
        e = '1110';
        break;
      case 15:
        e = '1111';
    }
    return e;
  },
  A: function(r) {
    var e = new Array(56),
      a = new Array();
    (a[0] = new Array()),
      (a[1] = new Array()),
      (a[2] = new Array()),
      (a[3] = new Array()),
      (a[4] = new Array()),
      (a[5] = new Array()),
      (a[6] = new Array()),
      (a[7] = new Array()),
      (a[8] = new Array()),
      (a[9] = new Array()),
      (a[10] = new Array()),
      (a[11] = new Array()),
      (a[12] = new Array()),
      (a[13] = new Array()),
      (a[14] = new Array()),
      (a[15] = new Array());
    var n = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];
    for (s = 0; 7 > s; s++) for (j = 0, k = 7; j < 8; j++, k--) e[8 * s + j] = r[8 * k + s];
    var s = 0;
    for (s = 0; 16 > s; s++) {
      var f = 0,
        o = 0;
      for (j = 0; j < n[s]; j++) {
        for (f = e[0], o = e[28], k = 0; k < 27; k++) (e[k] = e[k + 1]), (e[28 + k] = e[29 + k]);
        (e[27] = f), (e[55] = o);
      }
      var c = new Array(48);
      switch (
        ((c[0] = e[13]),
        (c[1] = e[16]),
        (c[2] = e[10]),
        (c[3] = e[23]),
        (c[4] = e[0]),
        (c[5] = e[4]),
        (c[6] = e[2]),
        (c[7] = e[27]),
        (c[8] = e[14]),
        (c[9] = e[5]),
        (c[10] = e[20]),
        (c[11] = e[9]),
        (c[12] = e[22]),
        (c[13] = e[18]),
        (c[14] = e[11]),
        (c[15] = e[3]),
        (c[16] = e[25]),
        (c[17] = e[7]),
        (c[18] = e[15]),
        (c[19] = e[6]),
        (c[20] = e[26]),
        (c[21] = e[19]),
        (c[22] = e[12]),
        (c[23] = e[1]),
        (c[24] = e[40]),
        (c[25] = e[51]),
        (c[26] = e[30]),
        (c[27] = e[36]),
        (c[28] = e[46]),
        (c[29] = e[54]),
        (c[30] = e[29]),
        (c[31] = e[39]),
        (c[32] = e[50]),
        (c[33] = e[44]),
        (c[34] = e[32]),
        (c[35] = e[47]),
        (c[36] = e[43]),
        (c[37] = e[48]),
        (c[38] = e[38]),
        (c[39] = e[55]),
        (c[40] = e[33]),
        (c[41] = e[52]),
        (c[42] = e[45]),
        (c[43] = e[41]),
        (c[44] = e[49]),
        (c[45] = e[35]),
        (c[46] = e[28]),
        (c[47] = e[31]),
        s)
      ) {
        case 0:
          for (m = 0; m < 48; m++) a[0][m] = c[m];
          break;
        case 1:
          for (m = 0; m < 48; m++) a[1][m] = c[m];
          break;
        case 2:
          for (m = 0; m < 48; m++) a[2][m] = c[m];
          break;
        case 3:
          for (m = 0; m < 48; m++) a[3][m] = c[m];
          break;
        case 4:
          for (m = 0; m < 48; m++) a[4][m] = c[m];
          break;
        case 5:
          for (m = 0; m < 48; m++) a[5][m] = c[m];
          break;
        case 6:
          for (m = 0; m < 48; m++) a[6][m] = c[m];
          break;
        case 7:
          for (m = 0; m < 48; m++) a[7][m] = c[m];
          break;
        case 8:
          for (m = 0; m < 48; m++) a[8][m] = c[m];
          break;
        case 9:
          for (m = 0; m < 48; m++) a[9][m] = c[m];
          break;
        case 10:
          for (m = 0; m < 48; m++) a[10][m] = c[m];
          break;
        case 11:
          for (m = 0; m < 48; m++) a[11][m] = c[m];
          break;
        case 12:
          for (m = 0; m < 48; m++) a[12][m] = c[m];
          break;
        case 13:
          for (m = 0; m < 48; m++) a[13][m] = c[m];
          break;
        case 14:
          for (m = 0; m < 48; m++) a[14][m] = c[m];
          break;
        case 15:
          for (m = 0; m < 48; m++) a[15][m] = c[m];
      }
    }
    return a;
  },

  getDes: function(e, a, n, m) {
    return kddes.r(e, a, n, m);
  },
};

window.kddes = kddes;
