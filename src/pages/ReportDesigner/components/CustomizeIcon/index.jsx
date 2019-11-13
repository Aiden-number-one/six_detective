import React from 'react';
import styles from './index.less';

function CustomizeIcon({ style, type, size, title, onClick }) {
  const newStyle = {};
  if (size && size === 'lg') {
    newStyle.width = '24px';
    newStyle.height = '24px';
  }
  switch (type) {
    case 'preview':
      newStyle.backgroundPosition = '-137px -129px';
      break;
    case 'pagingPreview':
      newStyle.backgroundPosition = '-453px -157px';
      break;
    case 'reportPreview':
      newStyle.backgroundPosition = '-453px -181px';
      break;
    case 'condition':
      newStyle.backgroundPosition = '-205px -163px';
      break;
    case 'paste':
      newStyle.backgroundPosition = '-8px -37px';
      break;
    case 'copy':
      newStyle.backgroundPosition = '-182px -10px';
      break;
    case 'cut':
      newStyle.backgroundPosition = '-159px -10px';
      break;
    case 'formatBrush':
      newStyle.backgroundPosition = '-41px -37px';
      break;
    case 'increaseFont':
      newStyle.backgroundPosition = '-313px -11px';
      break;
    case 'decreaseFont':
      newStyle.backgroundPosition = '-336px -11px';
      break;
    case 'boldFont':
      newStyle.backgroundPosition = '-202px -10px';
      break;
    case 'italicFont':
      newStyle.backgroundPosition = '-220px -10px';
      break;
    case 'underlineFont':
      newStyle.backgroundPosition = '-238px -9px';
      break;
    case 'noBorder':
      newStyle.backgroundPosition = '-261px -11px';
      break;
    case 'allBorder':
      newStyle.backgroundPosition = '-261px -158px';
      break;
    case 'outsideBorder':
      newStyle.backgroundPosition = '-261px -182px';
      break;
    case 'boldBorder':
      newStyle.backgroundPosition = '-261px -207px';
      break;
    case 'bottomBorder':
      newStyle.backgroundPosition = '-261px -35px';
      break;
    case 'topBorder':
      newStyle.backgroundPosition = '-261px -58px';
      break;
    case 'leftBorder':
      newStyle.backgroundPosition = '-261px -83px';
      break;
    case 'rightBorder':
      newStyle.backgroundPosition = '-261px -109px';
      break;
    case 'doubleBottomBorder':
      newStyle.backgroundPosition = '-261px -256px';
      break;
    case 'boldBottomBorder':
      newStyle.backgroundPosition = '-261px -304px';
      break;
    case 'topBottomBorder':
      newStyle.backgroundPosition = '-261px -231px';
      break;
    case 'topAndBoldBottomBorder':
      newStyle.backgroundPosition = '-261px -329px';
      break;
    case 'topAndDoubleBottomBorder':
      newStyle.backgroundPosition = '-261px -281px';
      break;
    case 'drawingBorder':
      newStyle.backgroundPosition = '-287px -11px';
      break;
    case 'drawingBorderNet':
      newStyle.backgroundPosition = '-287px -35px';
      break;
    case 'clearBorder':
      newStyle.backgroundPosition = '-287px -59px';
      break;
    case 'lineColor':
      newStyle.backgroundPosition = '-287px -84px';
      break;
    case 'lineStyle':
      newStyle.backgroundPosition = '-287px -109px';
      break;
    case 'filling':
      newStyle.backgroundPosition = '-379px -11px';
      break;
    case 'coloring':
      newStyle.backgroundPosition = '-357px -11px';
      break;
    case 'clear':
      newStyle.backgroundPosition = '-402px -11px';
      break;
    case 'clearAll':
      newStyle.backgroundPosition = '-452px -59px';
      break;
    case 'clearFormat':
      newStyle.backgroundPosition = '-452px -83px';
      break;
    case 'clearContent':
      newStyle.backgroundPosition = '-452px -108px';
      break;
    case 'clearMark':
      newStyle.backgroundPosition = '-452px -132px';
      break;
    case 'alignTop':
      newStyle.backgroundPosition = '-427px -108px';
      break;
    case 'alignMiddle':
      newStyle.backgroundPosition = '-427px -132px';
      break;
    case 'alignBottom':
      newStyle.backgroundPosition = '-427px -156px';
      break;
    case 'decreaseIndent':
      newStyle.backgroundPosition = '-427px -204px';
      break;
    case 'increaseIndent':
      newStyle.backgroundPosition = '-427px -228px';
      break;
    case 'alignLeft':
      newStyle.backgroundPosition = '-427px -11px';
      break;
    case 'alignCenter':
      newStyle.backgroundPosition = '-427px -35px';
      break;
    case 'alignRight':
      newStyle.backgroundPosition = '-427px -58px';
      break;
    case 'alignNormal':
      newStyle.backgroundPosition = '-427px -83px';
      break;
    case 'alignBoth':
      newStyle.backgroundPosition = '-427px -253px';
      break;
    case 'mergeAndCentered':
      newStyle.backgroundPosition = '-393px -254px';
      break;
    case 'autoLineBreak':
      newStyle.backgroundPosition = '-393px -278px';
      break;
    case 'currency':
      newStyle.backgroundPosition = '-366px -256px';
      break;
    case 'sum':
      newStyle.backgroundPosition = '-366px -256px';
      break;
    case 'avarage':
      newStyle.backgroundPosition = '-366px -256px';
      break;
    case 'count':
      newStyle.backgroundPosition = '-366px -256px';
      break;
    case 'max':
      newStyle.backgroundPosition = '-366px -256px';
      break;
    case 'min':
      newStyle.backgroundPosition = '-366px -256px';
      break;
    case 'otherFunction':
      newStyle.backgroundPosition = '-366px -256px';
      break;
    case 'percentage':
      newStyle.backgroundPosition = '-366px -303px';
      break;
    case 'formatMoney':
      newStyle.backgroundPosition = '-366px -327px';
      break;
    case 'increaseDecimal':
      newStyle.backgroundPosition = '-366px -353px';
      break;
    case 'decreaseDecimal':
      newStyle.backgroundPosition = '-366px -377px';
      break;
    case 'formatCell':
      newStyle.backgroundPosition = '-172px -36px';
      break;
    case 'autoFilter':
      newStyle.backgroundPosition = '-313px -181px';
      break;
    case 'clearFilter':
      newStyle.backgroundPosition = '-313px -205px';
      break;
    case 'sortUp':
      newStyle.backgroundPosition = '-313px -280px';
      break;
    case 'sortDown':
      newStyle.backgroundPosition = '-313px -303px';
      break;
    case 'rowsAndCols':
      newStyle.backgroundPosition = '-105px -67px';
      break;
    case 'lineHeight':
      newStyle.backgroundPosition = '-287px -134px';
      break;
    case 'colWidth':
      newStyle.backgroundPosition = '-287px -182px';
      break;
    case 'insertCell':
      newStyle.backgroundPosition = '-287px -256px';
      break;
    case 'delCell':
      newStyle.backgroundPosition = '-287px -280px';
      break;
    case 'hideOrShow':
      newStyle.backgroundPosition = '-287px -328px';
      break;
    case 'hyperlink':
      newStyle.backgroundPosition = '-340px -280px';
      break;
    case 'freeze':
      newStyle.backgroundPosition = '-340px -303px';
      break;
    case 'freezeFrame':
      newStyle.backgroundPosition = '-340px -303px';
      break;
    case 'freezeFirstRow':
      newStyle.backgroundPosition = '-340px -327px';
      break;
    case 'freezeFirstCol':
      newStyle.backgroundPosition = '-340px -354px';
      break;
    case 'images':
      newStyle.backgroundPosition = '-171px -70px';
      break;
    case 'charts':
      newStyle.backgroundPosition = '-206px -69px';
      break;
    case 'dataSet':
      newStyle.backgroundPosition = '-39px -163px';
      break;
    case 'dataConn':
      newStyle.backgroundPosition = '-72px -163px';
      break;
    case 'fx':
      newStyle.backgroundPosition = '-529px -58px';
      break;
    case 'subtotals':
      newStyle.backgroundPosition = '-137px -37px';
      break;
    case 'cellType':
      newStyle.backgroundPosition = '-72px -72px';
      break;
    case 'cellProps':
      newStyle.backgroundPosition = '-105px -70px';
      break;
    case 'conditionFormat':
      newStyle.backgroundPosition = '-138px -69px';
      break;
    case 'customAttr':
      newStyle.backgroundPosition = '-171px -69px';
      break;
    case 'hyperlinkLg':
      newStyle.backgroundPosition = '-205px -69px';
      break;
    case 'commoFunc':
      newStyle.backgroundPosition = '-171px -98px';
      break;
    case 'allFunc':
      newStyle.backgroundPosition = '-205px -98px';
      break;
    case 'financeFunc':
      newStyle.backgroundPosition = '-10px -130px';
      break;
    case 'logicFunc':
      newStyle.backgroundPosition = '-39px -130px';
      break;
    case 'textFunc':
      newStyle.backgroundPosition = '-72px -130px';
      break;
    case 'dateAndDateFunc':
      newStyle.backgroundPosition = '-106px -130px';
      break;
    case 'findAndReferFunc':
      newStyle.backgroundPosition = '-139px -130px';
      break;
    case 'mathAndTriFunc':
      newStyle.backgroundPosition = '-171px -130px';
      break;
    case 'otherFunc':
      newStyle.backgroundPosition = '-205px -130px';
      break;
    case 'addFolder':
      newStyle.backgroundPosition = '-10px -298px';
      break;
    case 'sort':
      newStyle.backgroundPosition = '-33px -297px';
      break;
    case 'refresh':
      newStyle.backgroundPosition = '-58px -297px';
      break;
    case 'folder':
      newStyle.backgroundPosition = '-82px -295px';
      break;
    case 'import':
      newStyle.backgroundPosition = '-105px -295px';
      break;
    case 'edit':
      newStyle.backgroundPosition = '-127px -295px';
      break;
    case 'del':
      newStyle.backgroundPosition = '-150px -295px';
      break;
    case 'add':
      newStyle.backgroundPosition = '-171px -297px';
      break;
    case 'previewSql':
      newStyle.backgroundPosition = '-192px -297px';
      break;
    case 'dataConnSmall':
      newStyle.backgroundPosition = '-215px -297px';
      break;
    case 'dataSetSmall':
      newStyle.backgroundPosition = '-10px -318px';
      break;
    case 'jin':
      newStyle.backgroundPosition = '-35px -318px';
      break;
    case 'chart1':
      newStyle.backgroundPosition = '-452px -10px';
      break;
    case 'chart2':
      newStyle.backgroundPosition = '-477px -10px';
      break;
    case 'chart3':
      newStyle.backgroundPosition = '-502px -10px';
      break;
    case 'chart4':
      newStyle.backgroundPosition = '-529px -10px';
      break;
    case 'chart5':
      newStyle.backgroundPosition = '-555px -10px';
      break;
    case 'chart6':
      newStyle.backgroundPosition = '-581px -10px';
      break;
    case 'chart7':
      newStyle.backgroundPosition = '-607px -10px';
      break;
    case 'chart8':
      newStyle.backgroundPosition = '-632px -10px';
      break;
    case 'texterea':
      newStyle.backgroundPosition = '-10px -100px';
      break;
    case 'formula':
      newStyle.backgroundPosition = '-39px -104px';
      break;
    case 'object':
      newStyle.backgroundPosition = '-530px -34px';
      break;
    case 'annex':
      newStyle.backgroundPosition = '-659px -10px';
      break;
    case 'stretch':
      newStyle.backgroundPosition = '-59px -323px';
      break;
    case 'monthlyReport':
      newStyle.backgroundPosition = '-81px -318px';
      break;
    case 'daily':
      newStyle.backgroundPosition = '-104px -318px';
      break;
    case 'text':
      newStyle.backgroundPosition = '-9px -448px';
      break;
    case 'label':
      newStyle.backgroundPosition = '-36px -448px';
      break;
    case 'btn':
      newStyle.backgroundPosition = '-64px -448px';
      break;
    case 'select':
      newStyle.backgroundPosition = '-91px -448px';
      break;
    case 'multiSelect':
      newStyle.backgroundPosition = '-118px -448px';
      break;
    case 'date':
      newStyle.backgroundPosition = '-144px -448px';
      break;
    case 'number':
      newStyle.backgroundPosition = '-172px -448px';
      break;
    case 'selectTree':
      newStyle.backgroundPosition = '-198px -448px';
      break;
    case 'radioGroup':
      newStyle.backgroundPosition = '-225px -448px';
      break;
    case 'checkboxGroup':
      newStyle.backgroundPosition = '-251px -448px';
      break;
    case 'textArea':
      newStyle.backgroundPosition = '-279px -448px';
      break;
    case 'password':
      newStyle.backgroundPosition = '-306px -448px';
      break;
    case 'checkbox':
      newStyle.backgroundPosition = '-333px -448px';
      break;
    case 'viewTree':
      newStyle.backgroundPosition = '-360px -448px';
      break;
    case 'preDefin':
      newStyle.backgroundPosition = '-396px -448px';
      break;
    default:
      newStyle.backgroundPosition = '-396px -448px';
  }
  return (
    <span
      onClick={onClick}
      className={styles.icon}
      style={{ ...newStyle, ...style }}
      title={title}
    />
  );
}

export default CustomizeIcon;
