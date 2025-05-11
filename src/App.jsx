import { useState } from 'react';
import './App.css';

const leftButtons = ['LSK1', 'LSK2', 'LSK3', 'LSK4', 'LSK5', 'LSK6'];
const rightButtons = ['RSK1', 'RSK2', 'RSK3', 'RSK4', 'RSK5', 'RSK6'];

const functionButtons = [
  ['DIR', 'PROG', 'PERF', 'INIT', 'DATA', ' '],
  ['F-PLN', 'RAD NAV', 'FUEL PRED', 'SEC F-PLN', 'ATC COMM', 'MCDU MENU']
];

const numpadButtons = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', '+/-']
];

const alphaButtons = [
  ['A', 'B', 'C', 'D', 'E'],
  ['F', 'G', 'H', 'I', 'J'],
  ['K', 'L', 'M', 'N', 'O'],
  ['P', 'Q', 'R', 'S', 'T'],
  ['U', 'V', 'W', 'X', 'Y'],
  ['Z', '/', 'SP', 'EX', 'CLR']
];

const extraButtons = [
  ['PORT', 'EXEC'],
  ['←', '→'],
  ['UP', 'DOWN']
];

const twoSideButtons = [['BRT'], ['DIM']];
const availableSIDs = ['+DKB9B', '+ETAS4B', '+GEBN7B'];

const App = () => {
  const [displayText, setDisplayText] = useState('');
  const [activePage, setActivePage] = useState('HOME');
  const [subPage, setSubPage] = useState(null);
  const [sidIndex, setSidIndex] = useState(0);
  const [tmpySelected, setTmpySelected] = useState(false);
  const [dataPage, setDataPage] = useState(1);

  const [initData, setInitData] = useState({
    fromTo: 'KIAD/KFSO', coRte: 'NONE', altnRte: 'NONE', fltNbr: '__________',
    lat: '33 57.0N', long: '118 25.8W', wind: 'TROPO', level: '36090', crzTemp: '__/___°'
  });

  const [fplnData, setFplnData] = useState({
    from: 'EDDS', to: 'EDDF', time: 'XP5120', alt: '1270', arrivalAlt: '354', runway: '25', sid: null
  });

  const [perfData, setPerfData] = useState({ V1: '__', VR: '__', V2: '__' });
  const [radNavData, setRadNavData] = useState({ vor1: '', crs1: '', vor2: '', crs2: '' });

  const handleButtonClick = (label) => {
    if (label === 'CLR') setDisplayText('');
    else if (label === 'INIT') { setActivePage('INIT'); setSubPage(null); }
    else if (label === 'F-PLN') { setActivePage('FPLN'); setSubPage(null); }
    else if (label === 'FUEL PRED') { setActivePage('FUEL'); setSubPage(null); }
    else if (label === 'PERF') { setActivePage('PERF'); setSubPage(null); }
    else if (label === 'RAD NAV') { setActivePage('RADNAV'); setSubPage(null); }
    else if (label === 'DATA') { setActivePage('DATA'); setSubPage(null); setDataPage(1); }
    else if (label === '←') setDataPage(p => Math.max(1, p - 1));
    else if (label === '→') setDataPage(p => Math.min(2, p + 1));
    else if (label === 'UP') setSidIndex(prev => (prev - 1 + availableSIDs.length) % availableSIDs.length);
    else if (label === 'DOWN') setSidIndex(prev => (prev + 1) % availableSIDs.length);
    else if (label === 'EXEC' && tmpySelected) {
      setFplnData(prev => ({ ...prev, sid: availableSIDs[sidIndex] }));
      setTmpySelected(false); setSubPage(null);
    } else setDisplayText(prev => (prev + ' ' + label).trim());
  };

  const handleLSKClick = (label) => {
    if (activePage === 'INIT') {
      const update = {
        LSK1: 'fromTo', LSK2: 'altnRte', LSK3: 'fltNbr',
        LSK4: 'lat', LSK5: 'long', LSK6: 'crzTemp'
      }[label];
      if (update) setInitData(prev => ({ ...prev, [update]: displayText }));
    } else if (activePage === 'PERF') {
      const update = { LSK1: 'V1', LSK2: 'VR', LSK3: 'V2' }[label];
      if (update) setPerfData(prev => ({ ...prev, [update]: displayText }));
    } else if (activePage === 'RADNAV') {
      const update = { LSK1: 'vor1', LSK2: 'crs1', LSK3: 'vor2', LSK4: 'crs2' }[label];
      if (update) setRadNavData(prev => ({ ...prev, [update]: displayText }));
    } else if (activePage === 'FPLN') {
      if (subPage === 'DEPARTURE' && label === 'LSK5') setTmpySelected(true);
      else if (label === 'LSK1') setSubPage('DEPARTURE');
    }
    setDisplayText('');
  };

  const renderDisplayContent = () => {
    if (activePage === 'INIT') return <div className="mcdu-init-screen">{Object.entries(initData).map(([k, v]) => <div className="init-row" key={k}><span>{k.toUpperCase()}</span><span style={{ marginLeft: 'auto' }}>{v}</span></div>)}<div className="scratchpad">Scratchpad: {displayText}</div></div>;
    if (activePage === 'PERF') return <div className="mcdu-init-screen"><div className="init-row">TAKE OFF RWY 25</div><div className="init-row">V1: {perfData.V1}</div><div className="init-row">VR: {perfData.VR}</div><div className="init-row">V2: {perfData.V2}</div><div className="scratchpad">Scratchpad: {displayText}</div></div>;
    if (activePage === 'RADNAV') return <div className="mcdu-init-screen"><div className="init-row">VOR1/FREQ: {radNavData.vor1}</div><div className="init-row">CRS1: {radNavData.crs1}</div><div className="init-row">VOR2/FREQ: {radNavData.vor2}</div><div className="init-row">CRS2: {radNavData.crs2}</div><div className="scratchpad">Scratchpad: {displayText}</div></div>;
    if (activePage === 'FPLN' && subPage === 'DEPARTURE') return <div className="mcdu-init-screen"><div className="init-row">DEPARTURE FROM {fplnData.from}</div><div className="init-row">RWY {fplnData.runway}   SID   TRANS</div><div className="init-row">SIDS AVAILABLE</div><div className="init-row">{availableSIDs[sidIndex]}</div><div className="init-row">TMPY     {tmpySelected ? 'INSERT*' : ''}</div><div className="scratchpad">Scratchpad: {displayText}</div></div>;
    if (activePage === 'FPLN') return <div className="mcdu-init-screen"><div className="init-row">FROM       {fplnData.time}</div><div className="init-row">{fplnData.from}     .../{fplnData.alt}</div><div className="init-row">---F-PLN DISCONTINUITY---</div><div className="init-row">{fplnData.to}     .../{fplnData.arrivalAlt}</div><div className="init-row">------ END OF F-PLN ------</div><div className="init-row">----- NO ALTN FPLN -----</div><div className="init-row">DEST  TIME DIST EFOB</div><div className="init-row">{fplnData.to}  90   53.2</div><div className="scratchpad">Scratchpad: {displayText}</div></div>;
    if (activePage === 'FUEL') return <div className="mcdu-init-screen"><div className="init-row">AT     {fplnData.to}</div><div className="init-row">GW/CG  FOB     4.3/FF+FQ</div><div className="init-row">CRZ TEMP/TROPO -5/36152</div><div className="init-row">FINAL TIME     2:50/030</div><div className="init-row">EXTRA TIME     0.3/00-3</div><div className="scratchpad">Scratchpad: {displayText}</div></div>;
    if (activePage === 'DATA') return <div className="mcdu-init-screen">{dataPage === 1 ? (<><div className="init-row">POSITION</div><div className="init-row">_IRS MONITOR</div><div className="init-row">GPS MONITOR</div><div className="init-row">A/C STATUS</div><div className="init-row">CLOSEST AIRPORTS</div></>) : (<><div className="init-row">&lt;WAYPOINTS</div><div className="init-row">&lt;NAVAIDS</div><div className="init-row">ACTIVE F-PLN</div><div className="init-row">&lt;WINDS</div><div className="init-row">PILOTS ROUTES&gt;</div></>)}<div className="scratchpad">Scratchpad: {displayText}</div></div>;
    return <div className="mcdu-screen">A320-200<br />MCDU READY<br /><br />Scratchpad: {displayText}</div>;
  };

  return (
    <div className="mcdu-container">
      <div className="mcdu-layout">
        <div className="mcdu-left mcdu-side">{leftButtons.map((label, i) => <button key={i} className="mcdu-lsk-button" onClick={() => handleLSKClick(label)}>{label}</button>)}</div>
        <div className="mcdu-center">
          <div className="mcdu-screen-area">{renderDisplayContent()}</div>
          <div className="mcdu-function-panel">
            <div className="mcdu-function-panel-left">{functionButtons.map((row, i) => <div key={i} className="mcdu-button-row">{row.map((label, j) => <button key={j} className="mcdu-function-button" onClick={() => handleButtonClick(label)}>{label}</button>)}</div>)}</div>
            <div className="mcdu-function-panel-right">{twoSideButtons.map((row, i) => <div key={i} className="mcdu-two-side-button">{row.map((label, j) => <button key={j} className="mcdu-two-side-button-1" onClick={() => handleButtonClick(label)}>{label}</button>)}</div>)}</div>
          </div>
          <div className="mcdu-below-panel">
            <div className="mcdu-below-left-panel">
              <div className="mcdu-extras">{extraButtons.map((row, i) => <div key={i} className="mcdu-extras-row">{row.map((label, j) => <button key={j} className={`mcdu-extra-button ${label === '⌫' ? 'mcdu-backspace-button' : ''}`} onClick={() => handleButtonClick(label)}>{label}</button>)}</div>)}</div>
              <div className="mcdu-numpad">{numpadButtons.map((row, i) => <div key={i} className="mcdu-button-row">{row.map((label, j) => <button key={j} className="mcdu-numpad-button" onClick={() => handleButtonClick(label)}>{label}</button>)}</div>)}</div>
            </div>
            <div className="mcdu-below-right-panel"><div className="mcdu-alpha">{alphaButtons.map((row, i) => <div key={i} className="mcdu-button-row">{row.map((label, j) => <button key={j} className="mcdu-alpha-button" onClick={() => handleButtonClick(label)}>{label}</button>)}</div>)}</div></div>
          </div>
        </div>
        <div className="mcdu-right mcdu-side">{rightButtons.map((label, i) => <button key={i} className="mcdu-rsk-button" onClick={() => handleButtonClick(label)}>{label}</button>)}</div>
      </div>
    </div>
  );
};

export default App;