import React from 'react';
import { Ruler } from 'lucide-react';
import LensVisualizer from './components/LensVisualizer';
import { useLensParameters } from './hooks/useLensParameters';
import { formatRadius } from './utils/lensCalculations';

function App() {
  const { params, updateParam } = useLensParameters();

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
      <div className="h-full max-w-6xl mx-auto flex flex-col">
        <header className="py-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <Ruler className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-800">Lens Drawing Generator</h1>
          </div>
          <p className="text-gray-600 text-sm">in the ISO 10110 Format</p>
        </header>

        <div className="flex-1 grid md:grid-cols-1 gap-2 bg-[#f7f6f2] rounded-xl shadow-lg p-2 overflow-hidden">
          <div className="flex flex-col">
            <div className="bg-[#f7f6f2] rounded-lg p-2 h-[35vh]">
              <LensVisualizer params={params} updateParam={updateParam} />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="grid grid-cols-3 gap-0 border border-gray-300">
              {/* Column Headers */}
              <div className="border-b border-r border-gray-300 p-2 bg-gray-50 font-medium text-center">LEFT SURFACE</div>
              <div className="border-b border-r border-gray-300 p-2 bg-gray-50 font-medium text-center">MATERIAL</div>
              <div className="border-b border-gray-300 p-2 bg-gray-50 font-medium text-center">RIGHT SURFACE</div>

              {/* Column Contents */}
              <div className="border-r border-gray-300 p-4 space-y-3">
                {/* Left Surface Parameters */}
                <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                  <span className="text-gray-700 text-sm">R (mm)</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formatRadius(params.radius1, params.type1)}
                      onChange={(e) => updateParam('radius1', parseFloat(e.target.value))}
                      onWheel={(e) => handleWheel(e, 'radius1')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      disabled={params.type1 === 'PLANO'}
                    />
                    <select
                      value={params.type1}
                      onChange={(e) => updateParam('type1', e.target.value as 'CX' | 'CV' | 'PLANO')}
                      onWheel={(e) => handleTypeWheel(e, 'type1')}
                      className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="CV">CX</option>
                      <option value="CX">CV</option>
                      <option value="PLANO">∞</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                  <span className="text-gray-700 text-sm">∅e</span>
                  <input type="text" value={`${params.leftDiameter} MIN`} readOnly className="block w-full rounded-md border-gray-300 bg-gray-50" />
                </div>
                <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                  <span className="text-gray-700 text-sm">PROT. CHAMFER</span>
                  <input type="text" value={params.leftChamfer} className="block w-full rounded-md border-gray-300" />
                </div>
                <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                  <span className="text-gray-700 text-sm">⊚λ</span>
                  <input type="text" value={params.leftWavelength} className="block w-full rounded-md border-gray-300" />
                </div>
                <div className="grid grid-cols-[30px_1fr] items-start gap-2">
                  <span className="text-gray-700 text-sm">3/</span>
                  <div className="ml-[90px] space-y-2">
                    <input type="text" value="AR @0.500-0.600µm" className="block w-full rounded-md border-gray-300" />
                    <input type="text" value="BBAR AVG T < 99.7%" className="block w-full rounded-md border-gray-300" />
                  </div>
                </div>
                <div className="grid grid-cols-[30px_1fr] items-center gap-2">
                  <span className="text-gray-700 text-sm">4/</span>
                  <input type="text" value={params.leftBevel} className="ml-[90px] block w-[calc(100%-90px)] rounded-md border-gray-300" />
                </div>
                <div className="grid grid-cols-[30px_1fr] items-center gap-2">
                  <span className="text-gray-700 text-sm">5/</span>
                  <input type="text" value="60/40" className="ml-[90px] block w-[calc(100%-90px)] rounded-md border-gray-300" />
                </div>
                <div className="grid grid-cols-[30px_1fr] items-center gap-2">
                  <span className="text-gray-700 text-sm">6/</span>
                  <input type="text" value="N/A" className="ml-[90px] block w-[calc(100%-90px)] rounded-md border-gray-300" />
                </div>
              </div>

              <div className="border-r border-gray-300 p-4 space-y-3">
                {/* Material Parameters */}
                <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                  <span className="text-gray-700 text-sm">GLASS</span>
                  <input type="text" value={params.glass} className="block w-full rounded-md border-gray-300" />
                </div>
                <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                  <span className="text-gray-700 text-sm">Nd</span>
                  <input type="text" value={params.nd} className="block w-full rounded-md border-gray-300" />
                </div>
                <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                  <span className="text-gray-700 text-sm">Vd</span>
                  <input type="text" value={params.vd} className="block w-full rounded-md border-gray-300" />
                </div>
                <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                  <span className="text-gray-700 text-sm">0/</span>
                  <input type="text" value={params.bubbles} className="block w-full rounded-md border-gray-300" />
                </div>
                <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                  <span className="text-gray-700 text-sm">1/</span>
                  <input type="text" value={params.inclusions} className="block w-full rounded-md border-gray-300" />
                </div>
                <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                  <span className="text-gray-700 text-sm">2/</span>
                  <input type="text" value={params.stress} className="block w-full rounded-md border-gray-300" />
                </div>
              </div>

              <div className="p-4 space-y-3">
                {/* Right Surface Parameters - Mirror of Left Surface */}
                <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                  <span className="text-gray-700 text-sm">R (mm)</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formatRadius(params.radius2, params.type2)}
                      onChange={(e) => updateParam('radius2', parseFloat(e.target.value))}
                      onWheel={(e) => handleWheel(e, 'radius2')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      disabled={params.type2 === 'PLANO'}
                    />
                    <select
                      value={params.type2}
                      onChange={(e) => updateParam('type2', e.target.value as 'CX' | 'CV' | 'PLANO')}
                      onWheel={(e) => handleTypeWheel(e, 'type2')}
                      className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="CV">CX</option>
                      <option value="CX">CV</option>
                      <option value="PLANO">∞</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                  <span className="text-gray-700 text-sm">∅e</span>
                  <input type="text" value={`${params.rightDiameter} MIN`} readOnly className="block w-full rounded-md border-gray-300 bg-gray-50" />
                </div>
                <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                  <span className="text-gray-700 text-sm">PROT. CHAMFER</span>
                  <input type="text" value={params.rightChamfer} className="block w-full rounded-md border-gray-300" />
                </div>
                <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                  <span className="text-gray-700 text-sm">⊚λ</span>
                  <input type="text" value={params.rightWavelength} className="block w-full rounded-md border-gray-300" />
                </div>
                <div className="grid grid-cols-[30px_1fr] items-start gap-2">
                  <span className="text-gray-700 text-sm">3/</span>
                  <div className="ml-[90px] space-y-2">
                    <input type="text" value="AR @0.500-0.600µm" className="block w-full rounded-md border-gray-300" />
                    <input type="text" value="BBAR AVG T < 99.7%" className="block w-full rounded-md border-gray-300" />
                  </div>
                </div>
                <div className="grid grid-cols-[30px_1fr] items-center gap-2">
                  <span className="text-gray-700 text-sm">4/</span>
                  <input type="text" value={params.rightBevel} className="ml-[90px] block w-[calc(100%-90px)] rounded-md border-gray-300" />
                </div>
                <div className="grid grid-cols-[30px_1fr] items-center gap-2">
                  <span className="text-gray-700 text-sm">5/</span>
                  <input type="text" value="60/40" className="ml-[90px] block w-[calc(100%-90px)] rounded-md border-gray-300" />
                </div>
                <div className="grid grid-cols-[30px_1fr] items-center gap-2">
                  <span className="text-gray-700 text-sm">6/</span>
                  <input type="text" value="N/A" className="ml-[90px] block w-[calc(100%-90px)] rounded-md border-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;