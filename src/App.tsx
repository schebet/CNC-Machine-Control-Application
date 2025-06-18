import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Zap, 
  Settings, 
  FileText, 
  Wrench, 
  Activity,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  RotateCw,
  Home,
  Target,
  AlertTriangle,
  Wifi,
  WifiOff
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import GCodeEditor from './components/GCodeEditor';
import ToolpathViewer from './components/ToolpathViewer';
import JogControls from './components/JogControls';
import ToolManager from './components/ToolManager';
import FileManager from './components/FileManager';

type TabType = 'dashboard' | 'gcode' | 'toolpath' | 'jog' | 'tools' | 'files';

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

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [machineStatus, setMachineStatus] = useState<MachineStatus>({
    state: 'idle',
    position: { x: 0, y: 0, z: 0 },
    feedRate: 1500,
    spindleSpeed: 0,
    connected: true,
    currentLine: 0,
    totalLines: 0,
    progress: 0
  });

  const [emergencyStop, setEmergencyStop] = useState(false);

  const handleEmergencyStop = () => {
    setEmergencyStop(true);
    setMachineStatus(prev => ({ 
      ...prev, 
      state: 'alarm',
      spindleSpeed: 0
    }));
    setTimeout(() => setEmergencyStop(false), 3000);
  };

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: Activity },
    { id: 'gcode' as TabType, label: 'G-Code', icon: FileText },
    { id: 'toolpath' as TabType, label: 'Toolpath', icon: Target },
    { id: 'jog' as TabType, label: 'Manual', icon: ArrowUp },
    { id: 'tools' as TabType, label: 'Tools', icon: Wrench },
    { id: 'files' as TabType, label: 'Files', icon: Settings }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard machineStatus={machineStatus} setMachineStatus={setMachineStatus} />;
      case 'gcode':
        return <GCodeEditor machineStatus={machineStatus} setMachineStatus={setMachineStatus} />;
      case 'toolpath':
        return <ToolpathViewer machineStatus={machineStatus} />;
      case 'jog':
        return <JogControls machineStatus={machineStatus} setMachineStatus={setMachineStatus} />;
      case 'tools':
        return <ToolManager />;
      case 'files':
        return <FileManager />;
      default:
        return <Dashboard machineStatus={machineStatus} setMachineStatus={setMachineStatus} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Settings className="w-8 h-8 text-blue-400" />
              <h1 className="text-2xl font-bold">CNC Controller</h1>
            </div>
            <div className="flex items-center space-x-2">
              {machineStatus.connected ? (
                <Wifi className="w-5 h-5 text-green-400" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-400" />
              )}
              <span className="text-sm text-gray-400">
                {machineStatus.connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                machineStatus.state === 'running' ? 'bg-green-400' :
                machineStatus.state === 'paused' ? 'bg-yellow-400' :
                machineStatus.state === 'alarm' ? 'bg-red-400' :
                'bg-gray-400'
              }`} />
              <span className="text-sm font-medium capitalize">{machineStatus.state}</span>
            </div>

            {/* Emergency Stop */}
            <button
              onClick={handleEmergencyStop}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold border-2 border-red-500 transition-all duration-200 transform hover:scale-105"
              disabled={emergencyStop}
            >
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>E-STOP</span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-gray-800 border-b border-gray-700 px-6">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {renderTabContent()}
      </main>
    </div>
  );
}

export default App;