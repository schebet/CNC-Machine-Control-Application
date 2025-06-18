import React, { useState } from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  RotateCcw, 
  Home,
  Target,
  Zap
} from 'lucide-react';

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

interface JogControlsProps {
  machineStatus: MachineStatus;
  setMachineStatus: React.Dispatch<React.SetStateAction<MachineStatus>>;
}

const JogControls: React.FC<JogControlsProps> = ({ machineStatus, setMachineStatus }) => {
  const [jogDistance, setJogDistance] = useState(1.0);
  const [feedRate, setFeedRate] = useState(1000);
  const [spindleSpeed, setSpindleSpeed] = useState(12000);
  const [spindleRunning, setSpindleRunning] = useState(false);

  const jogDistances = [0.01, 0.1, 1.0, 10.0, 100.0];
  const feedRates = [100, 500, 1000, 2000, 5000];

  const handleJog = (axis: 'x' | 'y' | 'z', direction: 1 | -1) => {
    if (machineStatus.state !== 'idle') return;
    
    setMachineStatus(prev => ({
      ...prev,
      position: {
        ...prev.position,
        [axis]: prev.position[axis] + (jogDistance * direction)
      }
    }));
  };

  const handleHome = (axis?: 'x' | 'y' | 'z') => {
    if (machineStatus.state !== 'idle') return;
    
    if (axis) {
      setMachineStatus(prev => ({
        ...prev,
        position: {
          ...prev.position,
          [axis]: 0
        }
      }));
    } else {
      setMachineStatus(prev => ({
        ...prev,
        position: { x: 0, y: 0, z: 0 }
      }));
    }
  };

  const toggleSpindle = () => {
    setSpindleRunning(!spindleRunning);
    setMachineStatus(prev => ({
      ...prev,
      spindleSpeed: spindleRunning ? 0 : spindleSpeed
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* XY Jog Controls */}
      <div className="lg:col-span-2">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-400" />
            Manual Control
          </h2>
          
          <div className="grid grid-cols-2 gap-8">
            {/* XY Control */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-center">XY Movement</h3>
              <div className="relative w-48 h-48 mx-auto">
                {/* Background Circle */}
                <div className="absolute inset-0 bg-gray-900 rounded-full border-2 border-gray-600" />
                
                {/* Center Point */}
                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
                
                {/* Y+ Button */}
                <button
                  onClick={() => handleJog('y', 1)}
                  className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                  disabled={machineStatus.state !== 'idle'}
                >
                  <ArrowUp className="w-6 h-6" />
                </button>
                
                {/* Y- Button */}
                <button
                  onClick={() => handleJog('y', -1)}
                  className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                  disabled={machineStatus.state !== 'idle'}
                >
                  <ArrowDown className="w-6 h-6" />
                </button>
                
                {/* X- Button */}
                <button
                  onClick={() => handleJog('x', -1)}
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                  disabled={machineStatus.state !== 'idle'}
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                
                {/* X+ Button */}
                <button
                  onClick={() => handleJog('x', 1)}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                  disabled={machineStatus.state !== 'idle'}
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            {/* Z Control */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-center">Z Movement</h3>
              <div className="flex flex-col items-center space-y-4">
                <button
                  onClick={() => handleJog('z', 1)}
                  className="bg-green-600 hover:bg-green-700 w-16 h-16 rounded-lg flex items-center justify-center transition-colors text-xl font-bold"
                  disabled={machineStatus.state !== 'idle'}
                >
                  Z+
                </button>
                
                <div className="w-8 h-24 bg-gray-700 rounded-lg relative">
                  <div className="absolute bottom-0 left-0 right-0 bg-green-500 rounded-lg transition-all duration-300" 
                       style={{ height: `${Math.max(0, Math.min(100, (machineStatus.position.z + 50) * 2))}%` }} />
                </div>
                
                <button
                  onClick={() => handleJog('z', -1)}
                  className="bg-red-600 hover:bg-red-700 w-16 h-16 rounded-lg flex items-center justify-center transition-colors text-xl font-bold"
                  disabled={machineStatus.state !== 'idle'}
                >
                  Z-
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings and Controls */}
      <div>
        {/* Jog Settings */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Jog Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Distance (mm)</label>
              <div className="grid grid-cols-3 gap-1">
                {jogDistances.map((distance) => (
                  <button
                    key={distance}
                    onClick={() => setJogDistance(distance)}
                    className={`p-2 rounded text-sm transition-colors ${
                      jogDistance === distance
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    {distance}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Feed Rate (mm/min)</label>
              <div className="grid grid-cols-2 gap-1">
                {feedRates.map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setFeedRate(rate)}
                    className={`p-2 rounded text-sm transition-colors ${
                      feedRate === rate
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    {rate}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Home Controls */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Home className="w-4 h-4 mr-2 text-orange-400" />
            Homing
          </h3>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleHome('x')}
              className="bg-orange-600 hover:bg-orange-700 p-2 rounded transition-colors text-sm"
              disabled={machineStatus.state !== 'idle'}
            >
              Home X
            </button>
            <button
              onClick={() => handleHome('y')}
              className="bg-orange-600 hover:bg-orange-700 p-2 rounded transition-colors text-sm"
              disabled={machineStatus.state !== 'idle'}
            >
              Home Y
            </button>
            <button
              onClick={() => handleHome('z')}
              className="bg-orange-600 hover:bg-orange-700 p-2 rounded transition-colors text-sm"
              disabled={machineStatus.state !== 'idle'}
            >
              Home Z
            </button>
            <button
              onClick={() => handleHome()}
              className="bg-orange-600 hover:bg-orange-700 p-2 rounded transition-colors text-sm"
              disabled={machineStatus.state !== 'idle'}
            >
              Home All
            </button>
          </div>
        </div>

        {/* Spindle Control */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Zap className="w-4 h-4 mr-2 text-yellow-400" />
            Spindle Control
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Speed (RPM)</label>
              <input
                type="range"
                min="0"
                max="24000"
                step="1000"
                value={spindleSpeed}
                onChange={(e) => setSpindleSpeed(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center font-mono">{spindleSpeed}</div>
            </div>
            
            <button
              onClick={toggleSpindle}
              className={`w-full p-3 rounded-lg font-semibold transition-colors ${
                spindleRunning
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {spindleRunning ? 'Stop Spindle' : 'Start Spindle'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JogControls;