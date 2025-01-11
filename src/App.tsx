import React, { useState } from 'react';
import { Ruler } from 'lucide-react';
import LensVisualizer from './components/LensVisualizer';
import { useLensParameters } from './hooks/useLensParameters';
import { formatRadius } from './utils/lensCalculations';

function App() {
  const { params, updateParam } = useLensParameters();
  const [darkMode, setDarkMode] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  const handleWheel = (e: React.WheelEvent<HTMLInputElement>, param: keyof typeof params) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -1 : 1;
    const currentValue = params[param];
    if (typeof currentValue === 'number') {
      if (param === 'radius1' || param === 'radius2') {
        const surfaceType = param === 'radius1' ? params.type1 : params.type2;
        const absValue = Math.abs(currentValue);
        const minRadius = params.diameter / 2;
        if (absValue + delta >= minRadius) {
          const newValue = absValue + delta;
          updateParam(param, surfaceType === 'CX' ? newValue : -newValue);
        }
      } else if (param === 'diameter' || param === 'centerThickness') {
        updateParam(param, Math.max(0, Math.round(currentValue) + delta));
      } else {
      updateParam(param, Math.max(0, currentValue + delta));
      }
    }
  };

  const handleTypeWheel = (e: React.WheelEvent<HTMLSelectElement>, param: 'type1' | 'type2') => {
    e.preventDefault();
    const types = ['CV', 'CX', 'PLANO'] as const;
    const currentIndex = types.indexOf(params[param]);
    const delta = e.deltaY > 0 ? 1 : -1;
    const newIndex = (currentIndex + delta + types.length) % types.length;
    updateParam(param, types[newIndex]);
  };

  return (
    <div className={`h-screen ${darkMode ? 'bg-gray-900' : 'bg-[#f7f6f2]'} p-2`}>
      <div className="h-full max-w-6xl mx-auto flex flex-col relative">
        <button 
          onClick={() => setDarkMode(!darkMode)} 
          className="absolute top-2 left-2 p-2 rounded-full hover:bg-opacity-10 hover:bg-black dark:hover:bg-white"
        >
          {darkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
        <header className={`py-2 text-center ${darkMode ? 'text-white' : ''}`}>
          <div className="flex items-center justify-center gap-2">
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Lens Drawing Generator</h1>
          </div>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>in the ISO 10110 Format</p>
        </header>

        <div className={`flex-1 grid md:grid-cols-1 gap-2 revision-border ${darkMode ? 'bg-gray-900' : 'bg-[#f7f6f2]'} p-2 overflow-hidden relative`}>
          <div className="absolute top-0 right-0 z-[9999]" style={{ margin: 0, padding: 0 }}>
            <div className={`${darkMode ? 'bg-gray-900' : 'bg-[#f7f6f2]'} relative inline-block border-l border-b border-black`} style={{ marginTop: '-1px', marginRight: '-1px' }}>
              <table className={`border-collapse ${darkMode ? 'bg-gray-900 text-white' : 'bg-[#f7f6f2]'} relative z-[9999] w-auto`}>
                <colgroup>
                  <col className="w-auto min-w-[30px]" />
                  <col className="w-auto" />
                  <col className="w-auto min-w-[60px]" />
                  <col className="w-auto min-w-[40px]" />
                </colgroup>
                <thead>
                  <tr>
                    <th colSpan={4} className="revision-cell text-center text-[10px] font-['Century_Gothic'] whitespace-nowrap py-0.5 px-1">
                      REVISIONS
                    </th>
                  </tr>
                  <tr>
                    <th className="revision-cell text-center text-[8px] font-['Century_Gothic'] whitespace-nowrap py-0.5 px-1">
                      REV.
                    </th>
                    <th className="revision-cell text-center text-[8px] font-['Century_Gothic'] whitespace-nowrap py-0.5 px-1">
                      DESCRIPTION
                    </th>
                    <th className="revision-cell text-center text-[8px] font-['Century_Gothic'] whitespace-nowrap py-0.5 px-1">
                      DATE
                    </th>
                    <th className="revision-cell text-center text-[8px] font-['Century_Gothic'] whitespace-nowrap py-0.5 px-1">
                      APPR.
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="revision-cell text-center text-[8px] font-['Century_Gothic'] whitespace-nowrap py-0.5 px-1">
                      1
                    </td>
                    <td className="revision-cell text-center text-[8px] font-['Century_Gothic'] whitespace-nowrap py-0.5 px-1">
                      PRE-RELEASED DRAFT
                    </td>
                    <td className="revision-cell text-center text-[8px] font-['Century_Gothic'] whitespace-nowrap py-0.5 px-1">
                      {new Date().toLocaleDateString()}
                    </td>
                    <td className="revision-cell text-center text-[8px] font-['Century_Gothic'] whitespace-nowrap py-0.5 px-1">
                      SIGN IN
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col">
            <div className={`${darkMode ? 'bg-gray-900' : 'bg-[#f7f6f2]'} p-2 h-[35vh]`}>
              <LensVisualizer params={params} updateParam={updateParam} darkMode={darkMode} />
            </div>
              </div>

          <div className="flex flex-col -ml-[1px]">
            <table className="w-full border-collapse border-0">
              <thead>
                <tr>
                  <th className={`border-t border-l border-b border-black p-1 ${darkMode ? 'bg-gray-900 text-white' : 'bg-[#f7f6f2]'} font-medium text-center text-sm`}>LEFT SURFACE</th>
                  <th className={`border-t border-l border-b border-black p-1 ${darkMode ? 'bg-gray-900 text-white' : 'bg-[#f7f6f2]'} font-medium text-center text-sm`}>MATERIAL</th>
                  <th className={`border-t border-l border-r border-b border-black p-1 ${darkMode ? 'bg-gray-900 text-white' : 'bg-[#f7f6f2]'} font-medium text-center text-sm`}>RIGHT SURFACE</th>
                </tr>
              </thead>
              <tbody>
                {/* R (mm) row */}
                <tr>
                  <td className="border-l border-black p-0">
                    <div className={`grid grid-cols-[30px_1fr_auto] items-center h-full ${darkMode ? 'bg-gray-900' : 'bg-[#f7f6f2]'}`}>
                      <div className="h-full p-1 flex justify-center border-r border-black">
                        <span className={`text-sm ${darkMode ? 'text-white' : ''}`}>R</span>
                      </div>
                      <div className="border-r border-black border-b p-1">
                        <input
                          type="text"
                          value={formatRadius(params.radius1, params.type1)}
                          onChange={(e) => updateParam('radius1', parseFloat(e.target.value))}
                          onWheel={(e) => handleWheel(e, 'radius1')}
                          className={`block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${darkMode ? 'bg-gray-800 text-white' : 'bg-[#f7f6f2]'} text-sm`}
                          disabled={params.type1 === 'PLANO'}
                        />
                      </div>
                      <div className="p-1 w-[80px] flex justify-center border-b border-black">
                        <select
                          value={params.type1}
                          onChange={(e) => updateParam('type1', e.target.value as 'CX' | 'CV' | 'PLANO')}
                          onWheel={(e) => handleTypeWheel(e, 'type1')}
                          className={`appearance-none ${darkMode ? 'bg-gray-900 text-white' : 'bg-transparent'} text-sm text-center w-16 cursor-pointer focus:outline-none border-0 focus:ring-0 shadow-none focus:shadow-none hover:shadow-none active:shadow-none p-0 m-0`}
                        >
                          <option value="CV">CX</option>
                          <option value="CX">CV</option>
                          <option value="PLANO">∞</option>
                        </select>
                      </div>
                    </div>
                  </td>
                  <td className="border-l border-r border-b border-black p-0">
                    <div className={`grid grid-cols-[1fr_1fr] items-center h-full ${darkMode ? 'bg-gray-900' : 'bg-[#f7f6f2]'}`}>
                      <div className="border-r border-black h-full p-1 flex items-center justify-end">
                        <span className={`text-sm ${darkMode ? 'text-white' : ''}`}>GLASS</span>
                      </div>
                      <div className="p-1 flex items-center">
                        <input type="text" value={params.glass} className={`block w-full rounded-md border-gray-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-[#f7f6f2]'} text-sm`} />
                      </div>
                    </div>
                  </td>
                  <td className="border-l border-r border-black p-0">
                    <div className={`grid grid-cols-[30px_1fr_auto] items-center h-full ${darkMode ? 'bg-gray-900' : 'bg-[#f7f6f2]'}`}>
                      <div className="h-full p-1 flex justify-center border-r border-black">
                        <span className={`text-sm ${darkMode ? 'text-white' : ''}`}>R</span>
                      </div>
                      <div className="border-r border-black border-b p-1">
                        <input
                          type="text"
                          value={formatRadius(params.radius2, params.type2)}
                          onChange={(e) => updateParam('radius2', parseFloat(e.target.value))}
                          onWheel={(e) => handleWheel(e, 'radius2')}
                          className={`block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${darkMode ? 'bg-gray-800 text-white' : 'bg-[#f7f6f2]'} text-sm`}
                          disabled={params.type2 === 'PLANO'}
                        />
                      </div>
                      <div className="p-1 w-[80px] flex justify-center border-b border-black">
                        <select
                          value={params.type2}
                          onChange={(e) => updateParam('type2', e.target.value as 'CX' | 'CV' | 'PLANO')}
                          onWheel={(e) => handleTypeWheel(e, 'type2')}
                          className={`appearance-none ${darkMode ? 'bg-gray-900 text-white' : 'bg-transparent'} text-sm text-center w-16 cursor-pointer focus:outline-none border-0 focus:ring-0 shadow-none focus:shadow-none hover:shadow-none active:shadow-none p-0 m-0`}
                        >
                          <option value="CV">CX</option>
                          <option value="CX">CV</option>
                          <option value="PLANO">∞</option>
                        </select>
                      </div>
                    </div>
                  </td>
                </tr>
                {/* ∅e row */}
                <tr className="h-[36px]">
                  <td className="border-l border-b border-black p-0">
                    <div className="grid grid-cols-[30px_1fr] h-[36px]">
                      <div className="h-[36px] p-1 flex justify-center items-center border-r border-black">
                        <span className={`text-sm ${darkMode ? 'text-white' : ''}`}>∅e</span>
                      </div>
                      <div className="h-[36px] p-1 flex items-center">
                        <input type="text" value={`${params.leftDiameter} MIN`} readOnly className={`text-sm ${darkMode ? 'bg-gray-800 text-white' : 'bg-[#f7f6f2]'} w-full border-0 focus:ring-0`} />
                      </div>
                    </div>
                  </td>
                  <td className="border-l border-b border-black p-0">
                    <div className="grid grid-cols-[1fr_1fr] h-[36px]">
                      <div className="border-r border-black h-full p-1 flex items-center justify-end">
                        <span className={`text-sm ${darkMode ? 'text-white' : ''}`}>Nd</span>
                      </div>
                      <div className="p-1 flex items-center">
                        <span className={darkMode ? 'text-white' : ''}>±0.0005</span>
                      </div>
                    </div>
                  </td>
                  <td className="border-l border-r border-b border-black p-0">
                    <div className="grid grid-cols-[30px_1fr] h-[36px]">
                      <div className="h-[36px] p-1 flex justify-center items-center border-r border-black">
                        <span className={`text-sm ${darkMode ? 'text-white' : ''}`}>∅e</span>
                      </div>
                      <div className="h-[36px] p-1 flex items-center">
                        <input type="text" value={`${params.rightDiameter} MIN`} readOnly className={`text-sm ${darkMode ? 'bg-gray-800 text-white' : 'bg-[#f7f6f2]'} w-full border-0 focus:ring-0`} />
                      </div>
                    </div>
                  </td>
                </tr>
                {/* PROT. CHAMFER row */}
                <tr className="h-[36px]">
                  <td className="border-l border-b border-black p-0">
                    <div className="grid grid-cols-[30px_1fr_auto] h-[36px]">
                      <div className="h-[36px] p-1 flex justify-center">
                        <span className={`text-sm ${darkMode ? 'text-white' : ''}`}>&nbsp;</span>
                      </div>
                      <div className="h-[36px] border-r border-black p-1 flex items-center">
                        <span className={`text-sm pr-2 ${darkMode ? 'text-white' : ''}`}>PROT. CHAMFER</span>
                      </div>
                      <div className="h-[36px] p-1 w-[80px] flex items-center justify-center">
                        <input type="text" value="0.1-0.3" className={`w-16 text-center ${darkMode ? 'bg-gray-800 text-white' : 'bg-[#f7f6f2]'} text-sm`} />
                      </div>
                    </div>
                  </td>
                  <td className="border-l border-b border-black p-0">
                    <div className="grid grid-cols-[1fr_1fr] h-[36px]">
                      <div className="h-[36px] border-r border-black p-1 flex items-center justify-end">
                        <span className={`text-sm ${darkMode ? 'text-white' : ''}`}>Vd</span>
                      </div>
                      <div className="h-[36px] p-1 flex items-center">
                        <span className={darkMode ? 'text-white' : ''}>±0.5</span>
                      </div>
                    </div>
                  </td>
                  <td className="border-l border-r border-b border-black p-0">
                    <div className="grid grid-cols-[30px_1fr_auto] h-[36px]">
                      <div className="h-[36px] p-1 flex justify-center">
                        <span className={`text-sm ${darkMode ? 'text-white' : ''}`}>&nbsp;</span>
                      </div>
                      <div className="h-[36px] border-r border-black p-1 flex items-center">
                        <span className={`text-sm pr-2 ${darkMode ? 'text-white' : ''}`}>PROT. CHAMFER</span>
                      </div>
                      <div className="h-[36px] p-1 w-[80px] flex items-center justify-center">
                        <input type="text" value="0.1-0.3" className={`w-16 text-center ${darkMode ? 'bg-gray-800 text-white' : 'bg-[#f7f6f2]'} text-sm`} />
                      </div>
                    </div>
                  </td>
                </tr>
                {/* λ row */}
                <tr className="h-[36px]">
                  <td className="border-l border-b border-black p-0">
                    <div className="grid grid-cols-[30px_1fr] h-[36px]">
                      <div className="h-[36px] p-1 flex justify-center items-center border-r border-black">
                        <span className={`text-sm ${darkMode ? 'text-white' : ''}`}>
                          <span className="inline-block w-5 h-5 border border-gray-700 rounded-full text-center leading-4 -ml-1">λ</span>
                        </span>
                      </div>
                      <div className="h-[36px] p-1 flex items-center">
                        <input type="text" value={params.leftWavelength} className={`text-sm ${darkMode ? 'bg-gray-800 text-white' : 'bg-[#f7f6f2]'} w-full border-0 focus:ring-0`} />
                      </div>
                    </div>
                  </td>
                  <td className="border-l border-b border-black p-0">
                    <div className="grid grid-cols-[1fr_1fr] items-center h-full">
                      <div className="h-full p-1 flex justify-end">
                        <span className={`text-sm ${darkMode ? 'text-white' : ''}`}>&nbsp;</span>
                      </div>
                      <div className="p-1">
                        <div className="block w-full h-6"></div>
                      </div>
                    </div>
                  </td>
                  <td className="border-l border-r border-b border-black p-0">
                    <div className="grid grid-cols-[30px_1fr] h-[36px]">
                      <div className="h-[36px] p-1 flex justify-center items-center border-r border-black">
                        <span className={`text-sm ${darkMode ? 'text-white' : ''}`}>
                    <span className="inline-block w-5 h-5 border border-gray-700 rounded-full text-center leading-4 -ml-1">λ</span>
                  </span>
                      </div>
                      <div className="h-[36px] p-1 flex items-center">
                        <input type="text" value={params.rightWavelength} className={`text-sm ${darkMode ? 'bg-gray-800 text-white' : 'bg-[#f7f6f2]'} w-full border-0 focus:ring-0`} />
                      </div>
                    </div>
                  </td>
                </tr>
                {/* 3/ row */}
                <tr>
                  <td className="border-l border-b border-black p-0">
                    <div className="grid grid-cols-[30px_1fr] items-center h-full">
                      <div className="h-full p-1 flex justify-center border-r border-black">
                        <span className={`text-sm ${darkMode ? 'text-white' : ''}`}>3/</span>
                </div>
                      <div className="p-1 space-y-1">
                        <input type="text" value="AR @0.500-0.600µm" className={`block w-full rounded-md border-gray-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-[#f7f6f2]'} text-sm`} />
                        <input type="text" value="BBAR AVG T < 99.7%" className={`block w-full rounded-md border-gray-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-[#f7f6f2]'} text-sm`} />
                  </div>
                </div>
                  </td>
                  <td className="border-l border-b border-black p-0">
                    <div className="grid grid-cols-[1fr_1fr] items-center h-full">
                      <div className="border-r border-black h-full p-1 flex items-center justify-end">
                        <span className={`text-sm ${darkMode ? 'text-white' : ''}`}>0/</span>
                      </div>
                      <div className="p-1 flex items-center">
                        <div className="grid grid-cols-[1fr_auto] items-center h-full w-full">
                          <div className="border-r border-black h-full p-1 flex items-center justify-end">
                            <span className={darkMode ? 'text-white' : ''}></span>
                          </div>
                          <div className="p-1 flex items-center">
                            <span className={darkMode ? 'text-white' : ''}>10</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="border-l border-r border-b border-black p-0">
                    <div className="grid grid-cols-[30px_1fr] items-center h-full">
                      <div className="h-full p-1 flex justify-center border-r border-black">
                        <span className={`text-sm ${darkMode ? 'text-white' : ''}`}>3/</span>
                      </div>
                      <div className="p-1 space-y-1">
                        <input type="text" value="AR @0.500-0.600µm" className={`block w-full rounded-md border-gray-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-[#f7f6f2]'} text-sm`} />
                        <input type="text" value="BBAR AVG T < 99.7%" className={`block w-full rounded-md border-gray-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-[#f7f6f2]'} text-sm`} />
                      </div>
                    </div>
                  </td>
                </tr>
                {/* 4/ row */}
                <tr>
                  <td className="border-l border-b border-black p-0">
                    <div className="grid grid-cols-[30px_1fr] items-center h-full">
                      <div className="h-full p-1 flex justify-center border-r border-black">
                        <span className={`text-sm ${darkMode ? 'text-white' : ''}`}>4/</span>
                      </div>
                      <div className="p-1">
                        <input type="text" value={params.leftBevel} className={`block w-full rounded-md border-gray-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-[#f7f6f2]'} text-sm`} />
                      </div>
                    </div>
                  </td>
                  <td className="border-l border-b border-black p-0">
                    <div className="grid grid-cols-[1fr_1fr] items-center h-full">
                      <div className="border-r border-black h-full p-1 flex justify-end">
                        <span className={`text-sm ${darkMode ? 'text-white' : ''}`}>1/</span>
                      </div>
                      <div className="p-1">
                        <input type="text" value={params.inclusions} className={`block w-full rounded-md border-gray-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-[#f7f6f2]'} text-sm`} />
                      </div>
                    </div>
                  </td>
                  <td className="border-l border-r border-b border-black p-0">
                    <div className="grid grid-cols-[30px_1fr] items-center h-full">
                      <div className="h-full p-1 flex justify-center border-r border-black">
                        <span className={`text-sm ${darkMode ? 'text-white' : ''}`}>4/</span>
                      </div>
                      <div className="p-1">
                        <input type="text" value={params.rightBevel} className={`block w-full rounded-md border-gray-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-[#f7f6f2]'} text-sm`} />
                      </div>
                    </div>
                  </td>
                </tr>
                {/* 5/ row */}
                <tr>
                  <td className="border-l border-b border-black p-0">
                    <div className="grid grid-cols-[30px_1fr] items-center h-full">
                      <div className="h-full p-1 flex justify-center border-r border-black">
                        <span className={`text-sm ${darkMode ? 'text-white' : ''}`}>5/</span>
                      </div>
                      <div className="p-1">
                        <input type="text" value="60/40" className={`block w-full rounded-md border-gray-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-[#f7f6f2]'} text-sm`} />
                      </div>
                    </div>
                  </td>
                  <td className="border-l border-b border-black p-0">
                    <div className="grid grid-cols-[1fr_1fr] items-center h-full">
                      <div className="border-r border-black h-full p-1 flex justify-end">
                        <span className={`text-sm ${darkMode ? 'text-white' : ''}`}>2/</span>
                      </div>
                      <div className="p-1">
                        <input type="text" value={params.stress} className={`block w-full rounded-md border-gray-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-[#f7f6f2]'} text-sm`} />
                      </div>
                    </div>
                  </td>
                  <td className="border-l border-r border-b border-black p-0">
                    <div className="grid grid-cols-[30px_1fr] items-center h-full">
                      <div className="h-full p-1 flex justify-center border-r border-black">
                        <span className={`text-sm ${darkMode ? 'text-white' : ''}`}>5/</span>
                      </div>
                      <div className="p-1">
                        <input type="text" value="60/40" className={`block w-full rounded-md border-gray-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-[#f7f6f2]'} text-sm`} />
                      </div>
                    </div>
                  </td>
                </tr>
                {/* 6/ row */}
                <tr>
                  <td className="border-l border-b border-black p-0">
                    <div className="grid grid-cols-[30px_1fr] items-center h-full">
                      <div className="h-full p-1 flex justify-center border-r border-black">
                        <span className={`text-sm ${darkMode ? 'text-white' : ''}`}>6/</span>
                      </div>
                      <div className="p-1">
                        <input type="text" value="N/A" className={`block w-full rounded-md border-gray-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-[#f7f6f2]'} text-sm`} />
                      </div>
                    </div>
                  </td>
                  <td className="border-l border-b border-black p-2"></td>
                  <td className="border-l border-r border-b border-black p-0">
                    <div className="grid grid-cols-[30px_1fr] items-center h-full">
                      <div className="h-full p-1 flex justify-center border-r border-black">
                        <span className={`text-sm ${darkMode ? 'text-white' : ''}`}>6/</span>
                      </div>
                      <div className="p-1">
                        <input type="text" value="N/A" className={`block w-full rounded-md border-gray-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-[#f7f6f2]'} text-sm`} />
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;