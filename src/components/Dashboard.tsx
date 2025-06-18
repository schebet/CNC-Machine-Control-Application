import React from 'react';
import { Activity, Zap, RotateCcw, Gauge, Clock, Target } from 'lucide-react';

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

interface DashboardProps {
  machineStatus: MachineStatus;
  setMachineStatus: React.Dispatch<React.SetStateAction<MachineStatus>>;
}

const Dashboard: React.FC<DashboardProps> = ({ machineStatus, setMachineStatus }) => {
  const formatNumber = (num: number, decimals: number = 3) => {
    return num.toFixed(decimals);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Machine Position */}
      <div className="lg:col-span-2">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-400" />
              Machine Position
            </h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors">
                Work
              </button>
              <button className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-sm transition-colors">
                Machine
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {['X', 'Y', 'Z'].map((axis, index) => {
              const value = Object.values(machineStatus.position)[index];
              return (
                <div key={axis} className="bg-gray-900 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">{axis}</div>
                    <div className="text-3xl font-mono text-white mb-2">
                      {formatNumber(value)}
                    </div>
                    <div className="text-sm text-gray-400">mm</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Status Panel */}
      <div>
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-green-400" />
            Status
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">State:</span>
              <span className={`font-semibold capitalize ${
                machineStatus.state === 'running' ? 'text-green-400' :
                machineStatus.state === 'paused' ? 'text-yellow-400' :
                machineStatus.state === 'alarm' ? 'text-red-400' :
                'text-gray-400'
              }`}>
                {machineStatus.state}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Feed Rate:</span>
              <span className="font-mono">{machineStatus.feedRate} mm/min</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Spindle:</span>
              <span className="font-mono">{machineStatus.spindleSpeed} RPM</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Progress:</span>
              <span className="font-mono">{machineStatus.progress.toFixed(1)}%</span>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${machineStatus.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="lg:col-span-3">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-orange-400" />
            Machine Controls
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setMachineStatus(prev => ({ ...prev, state: 'running' }))}
              disabled={machineStatus.state === 'running'}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Start
            </button>
            
            <button
              onClick={() => setMachineStatus(prev => ({ ...prev, state: 'paused' }))}
              disabled={machineStatus.state !== 'running'}
              className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Pause
            </button>
            
            <button
              onClick={() => setMachineStatus(prev => ({ ...prev, state: 'idle', progress: 0, currentLine: 0 }))}
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Stop
            </button>
            
            <button
              onClick={() => setMachineStatus(prev => ({ 
                ...prev, 
                position: { x: 0, y: 0, z: 0 },
                state: 'idle'
              }))}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Home
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Charts */}
      <div className="lg:col-span-2">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Gauge className="w-5 h-5 mr-2 text-purple-400" />
            Performance Monitor
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-400 mb-2">Load</div>
                <div className="text-2xl font-bold">65%</div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-green-400 mb-2">Efficiency</div>
                <div className="text-2xl font-bold">87%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-400" />
            Recent Activity
          </h2>
          
          <div className="space-y-3">
            {[
              'Job completed: part_001.nc',
              'Tool change: T01 → T02',
              'Home sequence completed',
              'G-code loaded: bracket.nc'
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span className="text-gray-400">{activity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;