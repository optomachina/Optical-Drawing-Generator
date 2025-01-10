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
            <h1 className="text-3xl font-bold text-gray-800">Lens Section Visualizer</h1>
          </div>
          <p className="text-gray-600">Create and visualize optical lens sections in real-time</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 bg-white rounded-xl shadow-lg p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Lens Parameters</h2>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-gray-700 text-sm">Diameter (mm)</span>
                  <input
                    type="number"
                    value={params.diameter}
                    onChange={(e) => updateParam('diameter', parseFloat(e.target.value))}
                    onWheel={(e) => handleWheel(e, 'diameter')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    min="0"
                    step="1"
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700 text-sm">Center Thickness (mm)</span>
                  <input
                    type="number"
                    value={params.centerThickness}
                    onChange={(e) => updateParam('centerThickness', parseFloat(e.target.value))}
                    onWheel={(e) => handleWheel(e, 'centerThickness')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    min="0"
                    step="1"
                  />
                </label>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Surface 1</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-gray-700 text-sm">Radius (mm)</span>
                      <input
                        type="text"
                        value={formatRadius(params.radius1, params.type1)}
                        onChange={(e) => updateParam('radius1', parseFloat(e.target.value))}
                        onWheel={(e) => handleWheel(e, 'radius1')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        disabled={params.type1 === 'PLANO'}
                      />
                    </label>
                    <label className="block">
                      <span className="text-gray-700 text-sm">Type</span>
                      <select
                        value={params.type1}
                        onChange={(e) => updateParam('type1', e.target.value as 'CX' | 'CV' | 'PLANO')}
                        onWheel={(e) => handleTypeWheel(e, 'type1')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        <option value="CV">CX (Convex)</option>
                        <option value="CX">CV (Concave)</option>
                        <option value="PLANO">∞ (Plano)</option>
                      </select>
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Surface 2</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-gray-700 text-sm">Radius (mm)</span>
                      <input
                        type="text"
                        value={formatRadius(params.radius2, params.type2)}
                        onChange={(e) => updateParam('radius2', parseFloat(e.target.value))}
                        onWheel={(e) => handleWheel(e, 'radius2')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        disabled={params.type2 === 'PLANO'}
                      />
                    </label>
                    <label className="block">
                      <span className="text-gray-700 text-sm">Type</span>
                      <select
                        value={params.type2}
                        onChange={(e) => updateParam('type2', e.target.value as 'CX' | 'CV' | 'PLANO')}
                        onWheel={(e) => handleTypeWheel(e, 'type2')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        <option value="CV">CX (Convex)</option>
                        <option value="CX">CV (Concave)</option>
                        <option value="PLANO">∞ (Plano)</option>
                      </select>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Visualization</h2>
            <div className="flex-1 bg-gray-50 rounded-lg p-4">
              <LensVisualizer params={params} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;