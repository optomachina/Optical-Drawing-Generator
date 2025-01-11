import React, { useState, useRef, useEffect } from 'react';
import { Ruler } from 'lucide-react';
import LensVisualizer from './components/LensVisualizer';
import { useLensParameters } from './hooks/useLensParameters';
import { formatRadius } from './utils/lensCalculations';

function App() {
  const { params, updateParam } = useLensParameters();
  const [resizing, setResizing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startX, setStartX] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [resizeType, setResizeType] = useState<'row' | 'col' | 'corner' | null>(null);
  const resizingRow = useRef<HTMLTableRowElement | null>(null);
  const resizingCol = useRef<HTMLTableColElement | null>(null);
  const resizingColIndex = useRef<number>(-1);
  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizing) return;
      
      if (resizeType === 'row' && resizingRow.current) {
        const deltaY = e.clientY - startY;
        const newHeight = Math.max(24, startHeight + deltaY);
        resizingRow.current.style.height = `${newHeight}px`;
      } else if (resizeType === 'col' && resizingCol.current) {
        const deltaX = e.clientX - startX;
        const newWidth = Math.max(30, startWidth - deltaX);
        resizingCol.current.style.width = `${newWidth}px`;
      } else if (resizeType === 'corner' && tableRef.current) {
        const deltaX = startX - e.clientX;
        const deltaY = e.clientY - startY;
        
        // Adjust column widths
        const cols = tableRef.current.getElementsByTagName('col');
        for (let i = 0; i < cols.length; i++) {
          const col = cols[i];
          const baseWidth = i === 1 ? 90 : 30;
          const scaleX = 1 + deltaX / 200;
          col.style.width = `${Math.max(30, baseWidth * scaleX)}px`;
        }

        // Adjust row heights
        const rows = tableRef.current.getElementsByTagName('tr');
        const scaleY = 1 + deltaY / 200;
        for (let row of rows) {
          row.style.height = `${Math.max(24, 24 * scaleY)}px`;
        }
      }
    };

    const handleMouseUp = () => {
      setResizing(false);
      setResizeType(null);
      resizingRow.current = null;
      resizingCol.current = null;
      resizingColIndex.current = -1;
    };

    if (resizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing, startY, startX, startHeight, startWidth, resizeType]);

  const handleResizeStart = (
    e: React.MouseEvent,
    element: HTMLTableRowElement | HTMLTableCellElement | HTMLDivElement,
    type: 'row' | 'col' | 'corner',
    colIndex?: number
  ) => {
    setResizing(true);
    setResizeType(type);
    if (type === 'row') {
      setStartY(e.clientY);
      setStartHeight(element.offsetHeight);
      resizingRow.current = element as HTMLTableRowElement;
    } else if (type === 'col' && colIndex !== undefined) {
      const table = (element as HTMLTableCellElement).closest('table');
      if (table) {
        const col = table.getElementsByTagName('col')[colIndex];
        if (col) {
          setStartX(e.clientX);
          setStartWidth(col.offsetWidth);
          resizingCol.current = col;
          resizingColIndex.current = colIndex;
        }
      }
    } else if (type === 'corner') {
      setStartX(e.clientX);
      setStartY(e.clientY);
    }
  };

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
    <div className="h-screen bg-[#f7f6f2] p-2">
      <div className="h-full max-w-6xl mx-auto flex flex-col relative">
        <header className="py-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-bold text-gray-800">Lens Drawing Generator</h1>
          </div>
          <p className="text-gray-600 text-sm">in the ISO 10110 Format</p>
        </header>

        <div className="flex-1 grid md:grid-cols-1 gap-2 revision-border bg-[#f7f6f2] p-2 overflow-hidden relative">
          <div className="absolute top-0 right-0 z-[9999]" style={{ margin: 0, padding: 0 }}>
            <div className="revision-border bg-[#f7f6f2] relative inline-block" style={{ marginTop: '-1px', marginRight: '-1px' }}>
              <table ref={tableRef} className={`border-collapse bg-[#f7f6f2] relative z-[9999] resize-table table-fixed ${resizing ? 'resizing' : ''}`} style={{ width: 'auto' }}>
                <colgroup>
                  <col style={{ width: '30px' }} />
                  <col style={{ width: '90px' }} />
                  <col style={{ width: '30px' }} />
                  <col style={{ width: '30px' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th colSpan={4} className="revision-cell text-center text-[10px] font-['Century_Gothic'] relative whitespace-nowrap">
                      REVISIONS
                      <div 
                        className="absolute bottom-0 left-0 w-full h-[4px] cursor-row-resize resize-handle"
                        onMouseDown={(e) => handleResizeStart(e, e.currentTarget.closest('tr')!, 'row')}
                      ></div>
                    </th>
                  </tr>
                  <tr>
                    <th className="revision-cell text-center text-[8px] font-['Century_Gothic'] relative whitespace-nowrap">
                      REV.
                      <div 
                        className="absolute bottom-0 left-0 w-full h-[4px] cursor-row-resize resize-handle"
                        onMouseDown={(e) => handleResizeStart(e, e.currentTarget.closest('tr')!, 'row')}
                      ></div>
                      <div 
                        className="absolute top-0 left-0 w-[4px] h-full cursor-col-resize resize-handle-vertical"
                        onMouseDown={(e) => handleResizeStart(e, e.currentTarget.closest('th')!, 'col', 0)}
                      ></div>
                    </th>
                    <th className="revision-cell text-center text-[8px] font-['Century_Gothic'] relative whitespace-nowrap">
                      DESCRIPTION
                      <div 
                        className="absolute bottom-0 left-0 w-full h-[4px] cursor-row-resize resize-handle"
                        onMouseDown={(e) => handleResizeStart(e, e.currentTarget.closest('tr')!, 'row')}
                      ></div>
                      <div 
                        className="absolute top-0 left-0 w-[4px] h-full cursor-col-resize resize-handle-vertical"
                        onMouseDown={(e) => handleResizeStart(e, e.currentTarget.closest('th')!, 'col', 1)}
                      ></div>
                    </th>
                    <th className="revision-cell text-center text-[8px] font-['Century_Gothic'] relative whitespace-nowrap">
                      DATE
                      <div 
                        className="absolute bottom-0 left-0 w-full h-[4px] cursor-row-resize resize-handle"
                        onMouseDown={(e) => handleResizeStart(e, e.currentTarget.closest('tr')!, 'row')}
                      ></div>
                      <div 
                        className="absolute top-0 left-0 w-[4px] h-full cursor-col-resize resize-handle-vertical"
                        onMouseDown={(e) => handleResizeStart(e, e.currentTarget.closest('th')!, 'col', 2)}
                      ></div>
                    </th>
                    <th className="revision-cell text-center text-[8px] font-['Century_Gothic'] relative whitespace-nowrap">
                      APPR.
                      <div 
                        className="absolute bottom-0 left-0 w-full h-[4px] cursor-row-resize resize-handle"
                        onMouseDown={(e) => handleResizeStart(e, e.currentTarget.closest('tr')!, 'row')}
                      ></div>
                      <div 
                        className="absolute top-0 left-0 w-[4px] h-full cursor-col-resize resize-handle-vertical"
                        onMouseDown={(e) => handleResizeStart(e, e.currentTarget.closest('th')!, 'col', 3)}
                      ></div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="revision-cell text-center text-[8px] font-['Century_Gothic'] relative whitespace-nowrap">
                      1
                      <div 
                        className="absolute bottom-0 left-0 w-full h-[4px] cursor-row-resize resize-handle"
                        onMouseDown={(e) => handleResizeStart(e, e.currentTarget.closest('tr')!, 'row')}
                      ></div>
                      <div 
                        className="absolute top-0 left-0 w-[4px] h-full cursor-col-resize resize-handle-vertical"
                        onMouseDown={(e) => handleResizeStart(e, e.currentTarget.closest('td')!, 'col', 0)}
                      ></div>
                    </td>
                    <td className="revision-cell text-center text-[8px] font-['Century_Gothic'] relative whitespace-nowrap">
                      PRE-RELEASED DRAFT
                      <div 
                        className="absolute bottom-0 left-0 w-full h-[4px] cursor-row-resize resize-handle"
                        onMouseDown={(e) => handleResizeStart(e, e.currentTarget.closest('tr')!, 'row')}
                      ></div>
                      <div 
                        className="absolute top-0 left-0 w-[4px] h-full cursor-col-resize resize-handle-vertical"
                        onMouseDown={(e) => handleResizeStart(e, e.currentTarget.closest('td')!, 'col', 1)}
                      ></div>
                    </td>
                    <td className="revision-cell text-center text-[8px] font-['Century_Gothic'] relative whitespace-nowrap">
                      {new Date().toLocaleDateString()}
                      <div 
                        className="absolute bottom-0 left-0 w-full h-[4px] cursor-row-resize resize-handle"
                        onMouseDown={(e) => handleResizeStart(e, e.currentTarget.closest('tr')!, 'row')}
                      ></div>
                      <div 
                        className="absolute top-0 left-0 w-[4px] h-full cursor-col-resize resize-handle-vertical"
                        onMouseDown={(e) => handleResizeStart(e, e.currentTarget.closest('td')!, 'col', 2)}
                      ></div>
                    </td>
                    <td className="revision-cell text-center text-[8px] font-['Century_Gothic'] relative whitespace-nowrap">
                      SIGN IN
                      <div 
                        className="absolute bottom-0 left-0 w-full h-[4px] cursor-row-resize resize-handle"
                        onMouseDown={(e) => handleResizeStart(e, e.currentTarget.closest('tr')!, 'row')}
                      ></div>
                      <div 
                        className="absolute top-0 left-0 w-[4px] h-full cursor-col-resize resize-handle-vertical"
                        onMouseDown={(e) => handleResizeStart(e, e.currentTarget.closest('td')!, 'col', 3)}
                      ></div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div 
                className="absolute bottom-0 left-0 w-[12px] h-[12px] cursor-nw-resize corner-resize-handle"
                onMouseDown={(e) => handleResizeStart(e, e.currentTarget, 'corner')}
              ></div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="bg-[#f7f6f2] p-2 h-[35vh]">
              <LensVisualizer params={params} updateParam={updateParam} />
            </div>
          </div>

          <div className="flex flex-col -ml-[1px]">
            <table className="w-full border-collapse border-0">
              <thead>
                <tr>
                  <th className="border-t border-l border-b border-black p-1 bg-[#f7f6f2] font-medium text-center text-sm">LEFT SURFACE</th>
                  <th className="border-t border-l border-b border-black p-1 bg-[#f7f6f2] font-medium text-center text-sm">MATERIAL</th>
                  <th className="border-t border-l border-r border-b border-black p-1 bg-[#f7f6f2] font-medium text-center text-sm">RIGHT SURFACE</th>
                </tr>
              </thead>
              <tbody>
                {/* R (mm) row */}
                <tr>
                  <td className="border-l border-b border-black p-0">
                    <div className="grid grid-cols-[30px_1fr_auto] items-center h-full">
                      <div className="h-full p-1 flex justify-center items-center">
                        <span className="text-sm">R</span>
                      </div>
                      <div className="border-r border-black p-1">
                        <input
                          type="text"
                          value={formatRadius(params.radius1, params.type1)}
                          onChange={(e) => updateParam('radius1', parseFloat(e.target.value))}
                          onWheel={(e) => handleWheel(e, 'radius1')}
                          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 bg-[#f7f6f2] text-sm"
                          disabled={params.type1 === 'PLANO'}
                        />
                      </div>
                      <div className="p-1 w-[80px] flex justify-center">
                        <select
                          value={params.type1}
                          onChange={(e) => updateParam('type1', e.target.value as 'CX' | 'CV' | 'PLANO')}
                          onWheel={(e) => handleTypeWheel(e, 'type1')}
                          className="appearance-none bg-[#f7f6f2] text-sm text-center w-16 cursor-pointer focus:outline-none border-none py-1"
                        >
                          <option value="CV">CX</option>
                          <option value="CX">CV</option>
                          <option value="PLANO">∞</option>
                        </select>
                      </div>
                    </div>
                  </td>
                  <td className="border-l border-b border-black p-0">
                    <div className="grid grid-cols-[1fr_1fr] items-center h-full">
                      <div className="border-r border-black h-full p-1 flex justify-end">
                        <span className="text-sm">GLASS</span>
                      </div>
                      <div className="p-1">
                        <input type="text" value={params.glass} className="block w-full rounded-md border-gray-300 bg-[#f7f6f2] text-sm" />
                      </div>
                    </div>
                  </td>
                  <td className="border-l border-r border-b border-black p-0">
                    <div className="grid grid-cols-[30px_1fr_auto] items-center h-full">
                      <div className="h-full p-1 flex justify-center items-center">
                        <span className="text-sm">R</span>
                      </div>
                      <div className="border-r border-black p-1">
                        <input
                          type="text"
                          value={formatRadius(params.radius2, params.type2)}
                          onChange={(e) => updateParam('radius2', parseFloat(e.target.value))}
                          onWheel={(e) => handleWheel(e, 'radius2')}
                          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 bg-[#f7f6f2] text-sm"
                          disabled={params.type2 === 'PLANO'}
                        />
                      </div>
                      <div className="p-1 w-[80px] flex justify-center">
                        <select
                          value={params.type2}
                          onChange={(e) => updateParam('type2', e.target.value as 'CX' | 'CV' | 'PLANO')}
                          onWheel={(e) => handleTypeWheel(e, 'type2')}
                          className="appearance-none bg-[#f7f6f2] text-sm text-center w-16 cursor-pointer focus:outline-none border-none py-1"
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
                <tr>
                  <td className="border-l border-b border-black p-0">
                    <div className="grid grid-cols-[30px_1fr] items-stretch h-full">
                      <div className="h-full p-1 flex justify-center">
                        <span className="text-sm">∅e</span>
                      </div>
                      <div className="p-1">
                        <input type="text" value={`${params.leftDiameter} MIN`} readOnly className="block w-full rounded-md border-gray-300 bg-[#f7f6f2] text-sm" />
                      </div>
                    </div>
                  </td>
                  <td className="border-l border-b border-black p-0">
                    <div className="grid grid-cols-[1fr_1fr] items-center h-full">
                      <div className="border-r border-black h-full p-1 flex justify-end">
                        <span className="text-sm">Nd</span>
                      </div>
                      <div className="p-1">
                        <div className="grid grid-cols-[1fr_auto] items-center">
                          <div className="border-r border-black pr-1">
                            <span>±</span>
                          </div>
                          <div className="pl-1">
                            <span>0.0005</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="border-l border-r border-b border-black p-0">
                    <div className="grid grid-cols-[30px_1fr] items-stretch h-full">
                      <div className="h-full p-1 flex justify-center">
                        <span className="text-sm">∅e</span>
                      </div>
                      <div className="p-1">
                        <input type="text" value={`${params.rightDiameter} MIN`} readOnly className="block w-full rounded-md border-gray-300 bg-[#f7f6f2] text-sm" />
                      </div>
                    </div>
                  </td>
                </tr>
                {/* PROT. CHAMFER row */}
                <tr>
                  <td className="border-l border-b border-black p-0">
                    <table className="w-full h-full border-collapse">
                      <tr>
                        <td className="w-[30px]">
                          <span className="text-sm whitespace-nowrap">&nbsp;</span>
                        </td>
                        <td className="border-r border-black">
                          <div className="flex items-center justify-end h-full">
                            <span className="text-sm pr-2">PROT. CHAMFER</span>
                          </div>
                        </td>
                        <td className="w-[80px]">
                          <div className="flex items-center justify-center h-full">
                            <input type="text" value="0.1-0.3" className="w-16 rounded-md border-gray-300 bg-[#f7f6f2] text-sm text-center" />
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td className="border-l border-b border-black p-0">
                    <div className="grid grid-cols-[1fr_1fr] items-center h-full">
                      <div className="border-r border-black h-full p-1 flex justify-end">
                        <span className="text-sm">Vd</span>
                      </div>
                      <div className="p-1">
                        <div className="grid grid-cols-[1fr_auto] items-center">
                          <div className="border-r border-black pr-1">
                            <span>±</span>
                          </div>
                          <div className="pl-1">
                            <span>0.5</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="border-l border-r border-b border-black p-0">
                    <table className="w-full h-full border-collapse">
                      <tr>
                        <td className="w-[30px]">
                          <span className="text-sm whitespace-nowrap">&nbsp;</span>
                        </td>
                        <td className="border-r border-black">
                          <div className="flex items-center justify-end h-full">
                            <span className="text-sm pr-2">PROT. CHAMFER</span>
                          </div>
                        </td>
                        <td className="w-[80px]">
                          <div className="flex items-center justify-center h-full">
                            <input type="text" value="0.1-0.3" className="w-16 rounded-md border-gray-300 bg-[#f7f6f2] text-sm text-center" />
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                {/* λ row */}
                <tr>
                  <td className="border-l border-b border-black p-0">
                    <div className="grid grid-cols-[30px_1fr] items-center h-full">
                      <div className="h-full p-1 flex justify-center">
                        <span className="text-sm">
                          <span className="inline-block w-5 h-5 border border-gray-700 rounded-full text-center leading-4 -ml-1">λ</span>
                        </span>
                      </div>
                      <div className="p-1">
                        <input type="text" value={params.leftWavelength} className="block w-full rounded-md border-gray-300 bg-[#f7f6f2] text-sm" />
                      </div>
                    </div>
                  </td>
                  <td className="border-l border-b border-black p-0">
                    <div className="grid grid-cols-[1fr_1fr] items-center h-full">
                      <div className="border-r border-black h-full p-1 flex justify-end">
                        <span className="text-sm">&nbsp;</span>
                      </div>
                      <div className="p-1">
                        <div className="block w-full h-6"></div>
                      </div>
                    </div>
                  </td>
                  <td className="border-l border-r border-b border-black p-0">
                    <div className="grid grid-cols-[30px_1fr] items-center h-full">
                      <div className="h-full p-1 flex justify-center">
                        <span className="text-sm">
                          <span className="inline-block w-5 h-5 border border-gray-700 rounded-full text-center leading-4 -ml-1">λ</span>
                        </span>
                      </div>
                      <div className="p-1">
                        <input type="text" value={params.rightWavelength} className="block w-full rounded-md border-gray-300 bg-[#f7f6f2] text-sm" />
                      </div>
                    </div>
                  </td>
                </tr>
                {/* 3/ row */}
                <tr>
                  <td className="border-l border-b border-black p-0">
                    <div className="grid grid-cols-[30px_1fr] items-stretch h-full">
                      <div className="h-full p-1 flex justify-center">
                        <span className="text-sm">3/</span>
                      </div>
                      <div className="p-1 space-y-1">
                        <input type="text" value="AR @0.500-0.600µm" className="block w-full rounded-md border-gray-300 bg-[#f7f6f2] text-sm" />
                        <input type="text" value="BBAR AVG T < 99.7%" className="block w-full rounded-md border-gray-300 bg-[#f7f6f2] text-sm" />
                      </div>
                    </div>
                  </td>
                  <td className="border-l border-b border-black p-0">
                    <div className="grid grid-cols-[1fr_1fr] items-center h-full">
                      <div className="border-r border-black h-full p-1 flex justify-end">
                        <span className="text-sm">0/</span>
                      </div>
                      <div className="p-1">
                        <div className="grid grid-cols-[1fr_auto] items-center">
                          <div className="border-r border-black pr-1">
                            <span></span>
                          </div>
                          <div className="pl-1">
                            <span>10</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="border-l border-r border-b border-black p-0">
                    <div className="grid grid-cols-[30px_1fr] items-stretch h-full">
                      <div className="h-full p-1 flex justify-center">
                        <span className="text-sm">3/</span>
                      </div>
                      <div className="p-1 space-y-1">
                        <input type="text" value="AR @0.500-0.600µm" className="block w-full rounded-md border-gray-300 bg-[#f7f6f2] text-sm" />
                        <input type="text" value="BBAR AVG T < 99.7%" className="block w-full rounded-md border-gray-300 bg-[#f7f6f2] text-sm" />
                      </div>
                    </div>
                  </td>
                </tr>
                {/* 4/ row */}
                <tr>
                  <td className="border-l border-b border-black p-0">
                    <div className="grid grid-cols-[30px_1fr] items-stretch h-full">
                      <div className="h-full p-1 flex justify-center">
                        <span className="text-sm">4/</span>
                      </div>
                      <div className="p-1">
                        <input type="text" value={params.leftBevel} className="block w-full rounded-md border-gray-300 bg-[#f7f6f2] text-sm" />
                      </div>
                    </div>
                  </td>
                  <td className="border-l border-b border-black p-0">
                    <div className="grid grid-cols-[1fr_1fr] items-center h-full">
                      <div className="border-r border-black h-full p-1 flex justify-end">
                        <span className="text-sm">1/</span>
                      </div>
                      <div className="p-1">
                        <input type="text" value={params.inclusions} className="block w-full rounded-md border-gray-300 bg-[#f7f6f2] text-sm" />
                      </div>
                    </div>
                  </td>
                  <td className="border-l border-r border-b border-black p-0">
                    <div className="grid grid-cols-[30px_1fr] items-stretch h-full">
                      <div className="h-full p-1 flex justify-center">
                        <span className="text-sm">4/</span>
                      </div>
                      <div className="p-1">
                        <input type="text" value={params.rightBevel} className="block w-full rounded-md border-gray-300 bg-[#f7f6f2] text-sm" />
                      </div>
                    </div>
                  </td>
                </tr>
                {/* 5/ row */}
                <tr>
                  <td className="border-l border-b border-black p-0">
                    <div className="grid grid-cols-[30px_1fr] items-stretch h-full">
                      <div className="h-full p-1 flex justify-center">
                        <span className="text-sm">5/</span>
                      </div>
                      <div className="p-1">
                        <input type="text" value="60/40" className="block w-full rounded-md border-gray-300 bg-[#f7f6f2] text-sm" />
                      </div>
                    </div>
                  </td>
                  <td className="border-l border-b border-black p-0">
                    <div className="grid grid-cols-[1fr_1fr] items-center h-full">
                      <div className="border-r border-black h-full p-1 flex justify-end">
                        <span className="text-sm">2/</span>
                      </div>
                      <div className="p-1">
                        <input type="text" value={params.stress} className="block w-full rounded-md border-gray-300 bg-[#f7f6f2] text-sm" />
                      </div>
                    </div>
                  </td>
                  <td className="border-l border-r border-b border-black p-0">
                    <div className="grid grid-cols-[30px_1fr] items-stretch h-full">
                      <div className="h-full p-1 flex justify-center">
                        <span className="text-sm">5/</span>
                      </div>
                      <div className="p-1">
                        <input type="text" value="60/40" className="block w-full rounded-md border-gray-300 bg-[#f7f6f2] text-sm" />
                      </div>
                    </div>
                  </td>
                </tr>
                {/* 6/ row */}
                <tr>
                  <td className="border-l border-b border-black p-0">
                    <div className="grid grid-cols-[30px_1fr] items-stretch h-full">
                      <div className="h-full p-1 flex justify-center">
                        <span className="text-sm">6/</span>
                      </div>
                      <div className="p-1">
                        <input type="text" value="N/A" className="block w-full rounded-md border-gray-300 bg-[#f7f6f2] text-sm" />
                      </div>
                    </div>
                  </td>
                  <td className="border-l border-b border-black p-2"></td>
                  <td className="border-l border-r border-b border-black p-0">
                    <div className="grid grid-cols-[30px_1fr] items-stretch h-full">
                      <div className="h-full p-1 flex justify-center">
                        <span className="text-sm">6/</span>
                      </div>
                      <div className="p-1">
                        <input type="text" value="N/A" className="block w-full rounded-md border-gray-300 bg-[#f7f6f2] text-sm" />
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