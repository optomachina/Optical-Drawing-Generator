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
      updateParam(param, Math.max(0, currentValue + delta));
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Ruler className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Lens Drawing Generator</h1>
          </div>
          <p className="text-gray-600">in the ISO 10110 Format</p>
        </header>

        <div className="grid md:grid-cols-1 gap-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Visualization</h2>
            <div className="bg-gray-50 rounded-lg p-4 h-[50vh]">
              <LensVisualizer params={params} />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Lens Parameters</h2>
            
            <div className="grid grid-cols-3 gap-6">
              {/* Left Surface */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Left Surface</h3>
                <div className="space-y-2">
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
                    <span className="text-gray-700 text-sm">∅e MIN (mm)</span>
                    <input
                      type="number"
                      value={params.leftDiameter}
                      onChange={(e) => updateParam('leftDiameter', parseFloat(e.target.value))}
                      onWheel={(e) => handleWheel(e, 'leftDiameter')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      min="0"
                      step="0.001"
                    />
                  </div>
                  <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <span className="text-gray-700 text-sm">PROT. CHAMFER</span>
                    <input
                      type="number"
                      value={params.leftChamfer}
                      onChange={(e) => updateParam('leftChamfer', parseFloat(e.target.value))}
                      onWheel={(e) => handleWheel(e, 'leftChamfer')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <span className="text-gray-700 text-sm">⊚λ (µm)</span>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={params.leftWavelength}
                        onChange={(e) => updateParam('leftWavelength', parseFloat(e.target.value))}
                        onWheel={(e) => handleWheel(e, 'leftWavelength')}
                        className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        min="0"
                        step="0.1"
                      />
                      <input
                        type="text"
                        value={params.leftAR}
                        onChange={(e) => updateParam('leftAR', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <span className="text-gray-700 text-sm">3/</span>
                    <input
                      type="text"
                      value={params.leftBevel}
                      onChange={(e) => updateParam('leftBevel', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <span className="text-gray-700 text-sm">4/</span>
                    <input
                      type="text"
                      value="2'"
                      disabled
                      className="block w-full rounded-md border-gray-300 bg-gray-100 text-gray-500"
                    />
                  </div>
                  <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <span className="text-gray-700 text-sm">5/</span>
                    <input
                      type="text"
                      value="60/40"
                      disabled
                      className="block w-full rounded-md border-gray-300 bg-gray-100 text-gray-500"
                    />
                  </div>
                  <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <span className="text-gray-700 text-sm">6/</span>
                    <input
                      type="text"
                      value="N/A"
                      disabled
                      className="block w-full rounded-md border-gray-300 bg-gray-100 text-gray-500"
                    />
                  </div>
                </div>
              </div>

              {/* Material Properties */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Material</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <span className="text-gray-700 text-sm">GLASS</span>
                    <input
                      type="text"
                      value={params.glass}
                      onChange={(e) => updateParam('glass', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <span className="text-gray-700 text-sm">Nd</span>
                    <input
                      type="text"
                      value={params.nd}
                      onChange={(e) => updateParam('nd', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <span className="text-gray-700 text-sm">Vd</span>
                    <input
                      type="text"
                      value={params.vd}
                      onChange={(e) => updateParam('vd', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <span className="text-gray-700 text-sm">0/</span>
                    <input
                      type="text"
                      value={params.bubbles}
                      onChange={(e) => updateParam('bubbles', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <span className="text-gray-700 text-sm">1/</span>
                    <input
                      type="text"
                      value={params.inclusions}
                      onChange={(e) => updateParam('inclusions', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <span className="text-gray-700 text-sm">2/</span>
                    <input
                      type="text"
                      value={params.stress}
                      onChange={(e) => updateParam('stress', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <span className="text-gray-700 text-sm">∅ Diameter</span>
                    <input
                      type="number"
                      value={params.diameter}
                      onChange={(e) => updateParam('diameter', parseFloat(e.target.value))}
                      onWheel={(e) => handleWheel(e, 'diameter')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      min="0"
                      step="0.001"
                    />
                  </div>
                  <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <span className="text-gray-700 text-sm">Center Thick.</span>
                    <input
                      type="number"
                      value={params.centerThickness}
                      onChange={(e) => updateParam('centerThickness', parseFloat(e.target.value))}
                      onWheel={(e) => handleWheel(e, 'centerThickness')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>

              {/* Right Surface */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Right Surface</h3>
                <div className="space-y-2">
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
                    <span className="text-gray-700 text-sm">∅e MIN (mm)</span>
                    <input
                      type="number"
                      value={params.rightDiameter}
                      onChange={(e) => updateParam('rightDiameter', parseFloat(e.target.value))}
                      onWheel={(e) => handleWheel(e, 'rightDiameter')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      min="0"
                      step="0.001"
                    />
                  </div>
                  <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <span className="text-gray-700 text-sm">PROT. CHAMFER</span>
                    <input
                      type="number"
                      value={params.rightChamfer}
                      onChange={(e) => updateParam('rightChamfer', parseFloat(e.target.value))}
                      onWheel={(e) => handleWheel(e, 'rightChamfer')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <span className="text-gray-700 text-sm">⊚λ (µm)</span>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={params.rightWavelength}
                        onChange={(e) => updateParam('rightWavelength', parseFloat(e.target.value))}
                        onWheel={(e) => handleWheel(e, 'rightWavelength')}
                        className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        min="0"
                        step="0.1"
                      />
                      <input
                        type="text"
                        value={params.rightAR}
                        onChange={(e) => updateParam('rightAR', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <span className="text-gray-700 text-sm">3/</span>
                    <input
                      type="text"
                      value={params.rightBevel}
                      onChange={(e) => updateParam('rightBevel', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <span className="text-gray-700 text-sm">4/</span>
                    <input
                      type="text"
                      value="2'"
                      disabled
                      className="block w-full rounded-md border-gray-300 bg-gray-100 text-gray-500"
                    />
                  </div>
                  <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <span className="text-gray-700 text-sm">5/</span>
                    <input
                      type="text"
                      value="60/40"
                      disabled
                      className="block w-full rounded-md border-gray-300 bg-gray-100 text-gray-500"
                    />
                  </div>
                  <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <span className="text-gray-700 text-sm">6/</span>
                    <input
                      type="text"
                      value="N/A"
                      disabled
                      className="block w-full rounded-md border-gray-300 bg-gray-100 text-gray-500"
                    />
                  </div>
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