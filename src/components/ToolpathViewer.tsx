import React, { useState, useEffect } from 'react';
import { Eye, RotateCcw, ZoomIn, ZoomOut, Move3D, Layers, Play } from 'lucide-react';

interface MachineStatus {
  state: 'idle' | 'running' | 'paused' | 'alarm' | 'offline';
  position: { x: number; y: number; z: number };
  feedRate: number;
  spindleSpeed: number;
  connected: boolean;
  currentLine: number;
  totalLines: number;
  progress: number;
}

interface ToolpathViewerProps {
  machineStatus?: MachineStatus;
}

const ToolpathViewer: React.FC<ToolpathViewerProps> = ({ machineStatus }) => {
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [showGrid, setShowGrid] = useState(true);
  const [showToolpath, setShowToolpath] = useState(true);
  const [showMachinePosition, setShowMachinePosition] = useState(true);
  const [scale, setScale] = useState(2);
  const [offset, setOffset] = useState({ x: 200, y: 150 });

  // Convert machine coordinates to screen coordinates
  const machineToScreen = (x: number, y: number) => ({
    x: offset.x + (x * scale),
    y: offset.y - (y * scale) // Invert Y axis for screen coordinates
  });

  // Sample toolpath data - in a real application this would come from G-code parsing
  const toolpathSegments = [
    // Square pattern
    { from: { x: 10, y: 10 }, to: { x: 50, y: 10 }, type: 'feed' },
    { from: { x: 50, y: 10 }, to: { x: 50, y: 50 }, type: 'feed' },
    { from: { x: 50, y: 50 }, to: { x: 10, y: 50 }, type: 'feed' },
    { from: { x: 10, y: 50 }, to: { x: 10, y: 10 }, type: 'feed' },
    // Move to circle
    { from: { x: 10, y: 10 }, to: { x: 30, y: 30 }, type: 'rapid' },
    // Circle (approximated with segments)
    ...Array.from({ length: 16 }, (_, i) => {
      const angle1 = (i * Math.PI * 2) / 16;
      const angle2 = ((i + 1) * Math.PI * 2) / 16;
      return {
        from: { x: 30 + 10 * Math.cos(angle1), y: 30 + 10 * Math.sin(angle1) },
        to: { x: 30 + 10 * Math.cos(angle2), y: 30 + 10 * Math.sin(angle2) },
        type: 'feed' as const
      };
    })
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Viewer */}
      <div className="lg:col-span-3">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Eye className="w-5 h-5 mr-2 text-purple-400" />
              Toolpath Visualization
            </h2>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode(viewMode === '3d' ? '2d' : '3d')}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  viewMode === '3d'
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                <Move3D className="w-4 h-4" />
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setScale(Math.max(0.5, scale - 0.5))}
                  className="p-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-400 w-12 text-center">{scale}x</span>
                <button
                  onClick={() => setScale(Math.min(5, scale + 0.5))}
                  className="p-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Viewer Container */}
          <div className="bg-gray-900 rounded-lg h-96 relative overflow-hidden border border-gray-700">
            <svg className="w-full h-full" viewBox="0 0 400 300">
              {/* Grid Background */}
              {showGrid && (
                <g className="stroke-gray-700" strokeWidth="0.5" fill="none">
                  {Array.from({ length: 21 }, (_, i) => (
                    <g key={i}>
                      <line x1={i * 20} y1="0" x2={i * 20} y2="300" />
                      <line x1="0" y1={i * 15} x2="400" y2={i * 15} />
                    </g>
                  ))}
                </g>
              )}
              
              {/* Coordinate System */}
              <g className="stroke-white" strokeWidth="2">
                <line x1="50" y1="250" x2="100" y2="250" markerEnd="url(#arrowX)" />
                <line x1="50" y1="250" x2="50" y2="200" markerEnd="url(#arrowY)" />
                <text x="105" y="255" className="fill-white text-xs">X</text>
                <text x="45" y="195" className="fill-white text-xs">Y</text>
              </g>
              
              {/* Arrow Markers */}
              <defs>
                <marker id="arrowX" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" className="fill-white" />
                </marker>
                <marker id="arrowY" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" className="fill-white" />
                </marker>
              </defs>
              
              {/* Toolpath */}
              {showToolpath && (
                <g>
                  {toolpathSegments.map((segment, index) => {
                    const fromScreen = machineToScreen(segment.from.x, segment.from.y);
                    const toScreen = machineToScreen(segment.to.x, segment.to.y);
                    
                    return (
                      <line
                        key={index}
                        x1={fromScreen.x}
                        y1={fromScreen.y}
                        x2={toScreen.x}
                        y2={toScreen.y}
                        className={segment.type === 'rapid' ? 'stroke-yellow-400' : 'stroke-blue-400'}
                        strokeWidth={segment.type === 'rapid' ? '2' : '3'}
                        strokeDasharray={segment.type === 'rapid' ? '5,5' : 'none'}
                        fill="none"
                      />
                    );
                  })}
                  
                  {/* Start point */}
                  {toolpathSegments.length > 0 && (
                    <circle
                      cx={machineToScreen(toolpathSegments[0].from.x, toolpathSegments[0].from.y).x}
                      cy={machineToScreen(toolpathSegments[0].from.x, toolpathSegments[0].from.y).y}
                      r="4"
                      className="fill-green-400"
                    />
                  )}
                </g>
              )}
              
              {/* Machine Position */}
              {showMachinePosition && machineStatus && (
                <g>
                  <circle
                    cx={machineToScreen(machineStatus.position.x, machineStatus.position.y).x}
                    cy={machineToScreen(machineStatus.position.x, machineStatus.position.y).y}
                    r="6"
                    className={`${
                      machineStatus.state === 'running' ? 'fill-orange-400 animate-pulse' :
                      machineStatus.state === 'paused' ? 'fill-yellow-400' :
                      'fill-gray-400'
                    }`}
                  />
                  
                  {/* Position crosshairs */}
                  <g className="stroke-orange-400" strokeWidth="1">
                    <line
                      x1={machineToScreen(machineStatus.position.x, machineStatus.position.y).x - 10}
                      y1={machineToScreen(machineStatus.position.x, machineStatus.position.y).y}
                      x2={machineToScreen(machineStatus.position.x, machineStatus.position.y).x + 10}
                      y2={machineToScreen(machineStatus.position.x, machineStatus.position.y).y}
                    />
                    <line
                      x1={machineToScreen(machineStatus.position.x, machineStatus.position.y).x}
                      y1={machineToScreen(machineStatus.position.x, machineStatus.position.y).y - 10}
                      x2={machineToScreen(machineStatus.position.x, machineStatus.position.y).x}
                      y2={machineToScreen(machineStatus.position.x, machineStatus.position.y).y + 10}
                    />
                  </g>
                </g>
              )}
              
              {/* Work Boundaries */}
              <rect
                x={machineToScreen(0, 60).x}
                y={machineToScreen(60, 0).y}
                width={60 * scale}
                height={60 * scale}
                className="stroke-gray-500 fill-transparent"
                strokeWidth="2"
                strokeDasharray="3,3"
              />
            </svg>
            
            {/* Overlay Info */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 rounded px-3 py-2 text-sm">
              <div>Scale: {scale}:1</div>
              <div>View: {viewMode.toUpperCase()}</div>
              {machineStatus && (
                <div className={`${
                  machineStatus.state === 'running' ? 'text-green-400' :
                  machineStatus.state === 'paused' ? 'text-yellow-400' :
                  'text-gray-400'
                }`}>
                  ● {machineStatus.state.toUpperCase()}
                </div>
              )}
            </div>

            {/* Position Display */}
            {machineStatus && (
              <div className="absolute top-4 right-4 bg-black bg-opacity-50 rounded px-3 py-2 text-sm font-mono">
                <div>X: {machineStatus.position.x.toFixed(3)}</div>
                <div>Y: {machineStatus.position.y.toFixed(3)}</div>
                <div>Z: {machineStatus.position.z.toFixed(3)}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls Panel */}
      <div>
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Layers className="w-4 h-4 mr-2 text-blue-400" />
            Display Options
          </h3>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Show Grid</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={showToolpath}
                onChange={(e) => setShowToolpath(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Show Toolpath</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={showMachinePosition}
                onChange={(e) => setShowMachinePosition(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Show Machine Position</span>
            </label>
          </div>
        </div>

        {/* Toolpath Info */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-purple-400">Toolpath Info</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Length:</span>
              <span className="font-mono">247.2 mm</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Rapid Moves:</span>
              <span className="font-mono">28.3 mm</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Feed Moves:</span>
              <span className="font-mono">218.9 mm</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Min Z:</span>
              <span className="font-mono">-2.0 mm</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Max Z:</span>
              <span className="font-mono">10.0 mm</span>
            </div>

            {machineStatus && (
              <>
                <div className="border-t border-gray-700 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Progress:</span>
                    <span className="font-mono">{machineStatus.progress.toFixed(1)}%</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolpathViewer;