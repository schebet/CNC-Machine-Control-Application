import React, { useState } from 'react';
import { Wrench, Plus, Edit, Trash2, Save } from 'lucide-react';

interface Tool {
  id: number;
  name: string;
  diameter: number;
  length: number;
  type: 'end_mill' | 'drill' | 'tap' | 'face_mill';
  material: 'carbide' | 'hss' | 'ceramic';
  flutes: number;
  offsetX: number;
  offsetY: number;
  offsetZ: number;
}

const ToolManager: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([
    {
      id: 1,
      name: '6mm End Mill',
      diameter: 6.0,
      length: 50.0,
      type: 'end_mill',
      material: 'carbide',
      flutes: 2,
      offsetX: 0.0,
      offsetY: 0.0,
      offsetZ: -25.0
    },
    {
      id: 2,
      name: '3mm Drill',
      diameter: 3.0,
      length: 40.0,
      type: 'drill',
      material: 'hss',
      flutes: 2,
      offsetX: 0.0,
      offsetY: 0.0,
      offsetZ: -20.0
    },
    {
      id: 3,
      name: '12mm Face Mill',
      diameter: 12.0,
      length: 30.0,
      type: 'face_mill',
      material: 'carbide',
      flutes: 4,
      offsetX: 0.0,
      offsetY: 0.0,
      offsetZ: -15.0
    }
  ]);

  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const toolTypes = [
    { value: 'end_mill', label: 'End Mill' },
    { value: 'drill', label: 'Drill' },
    { value: 'tap', label: 'Tap' },
    { value: 'face_mill', label: 'Face Mill' }
  ];

  const materials = [
    { value: 'carbide', label: 'Carbide' },
    { value: 'hss', label: 'HSS' },
    { value: 'ceramic', label: 'Ceramic' }
  ];

  const handleAddTool = () => {
    const newTool: Tool = {
      id: Math.max(...tools.map(t => t.id)) + 1,
      name: 'New Tool',
      diameter: 6.0,
      length: 50.0,
      type: 'end_mill',
      material: 'carbide',
      flutes: 2,
      offsetX: 0.0,
      offsetY: 0.0,
      offsetZ: 0.0
    };
    setTools([...tools, newTool]);
    setEditingTool(newTool);
    setShowAddForm(false);
  };

  const handleSaveTool = (tool: Tool) => {
    setTools(tools.map(t => t.id === tool.id ? tool : t));
    setEditingTool(null);
  };

  const handleDeleteTool = (id: number) => {
    setTools(tools.filter(t => t.id !== id));
    if (selectedTool?.id === id) {
      setSelectedTool(null);
    }
  };

  const ToolForm: React.FC<{ tool: Tool; onSave: (tool: Tool) => void; onCancel: () => void }> = ({ tool, onSave, onCancel }) => {
    const [formData, setFormData] = useState(tool);

    return (
      <div className="bg-gray-900 rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Tool['type'] })}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            >
              {toolTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Diameter (mm)</label>
            <input
              type="number"
              step="0.1"
              value={formData.diameter}
              onChange={(e) => setFormData({ ...formData, diameter: Number(e.target.value) })}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Length (mm)</label>
            <input
              type="number"
              step="0.1"
              value={formData.length}
              onChange={(e) => setFormData({ ...formData, length: Number(e.target.value) })}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Material</label>
            <select
              value={formData.material}
              onChange={(e) => setFormData({ ...formData, material: e.target.value as Tool['material'] })}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            >
              {materials.map(material => (
                <option key={material.value} value={material.value}>{material.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Flutes</label>
            <input
              type="number"
              min="1"
              max="8"
              value={formData.flutes}
              onChange={(e) => setFormData({ ...formData, flutes: Number(e.target.value) })}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-3">Tool Offsets</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">X Offset</label>
              <input
                type="number"
                step="0.001"
                value={formData.offsetX}
                onChange={(e) => setFormData({ ...formData, offsetX: Number(e.target.value) })}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Y Offset</label>
              <input
                type="number"
                step="0.001"
                value={formData.offsetY}
                onChange={(e) => setFormData({ ...formData, offsetY: Number(e.target.value) })}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Z Offset</label>
              <input
                type="number"
                step="0.001"
                value={formData.offsetZ}
                onChange={(e) => setFormData({ ...formData, offsetZ: Number(e.target.value) })}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onSave(formData)}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Tool List */}
      <div className="lg:col-span-2">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <Wrench className="w-5 h-5 mr-2 text-blue-400" />
              Tool Library
            </h2>
            
            <button
              onClick={handleAddTool}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Tool</span>
            </button>
          </div>
          
          <div className="space-y-3">
            {tools.map((tool) => (
              <div key={tool.id} className="bg-gray-900 rounded-lg p-4">
                {editingTool?.id === tool.id ? (
                  <ToolForm
                    tool={editingTool}
                    onSave={handleSaveTool}
                    onCancel={() => setEditingTool(null)}
                  />
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-xl font-bold">T{tool.id}</span>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold">{tool.name}</h3>
                        <div className="text-sm text-gray-400">
                          {tool.type.replace('_', ' ')} • ⌀{tool.diameter}mm • {tool.material}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedTool(tool)}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          selectedTool?.id === tool.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        Select
                      </button>
                      
                      <button
                        onClick={() => setEditingTool(tool)}
                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteTool(tool.id)}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tool Details */}
      <div>
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Tool Details</h3>
          
          {selectedTool ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold">T{selectedTool.id}</span>
                </div>
                <h4 className="text-lg font-semibold">{selectedTool.name}</h4>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="capitalize">{selectedTool.type.replace('_', ' ')}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Diameter:</span>
                  <span className="font-mono">{selectedTool.diameter} mm</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Length:</span>
                  <span className="font-mono">{selectedTool.length} mm</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Material:</span>
                  <span className="capitalize">{selectedTool.material}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Flutes:</span>
                  <span>{selectedTool.flutes}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-4">
                <h5 className="font-semibold mb-2">Offsets</h5>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">X:</span>
                    <span className="font-mono">{selectedTool.offsetX.toFixed(3)} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Y:</span>
                    <span className="font-mono">{selectedTool.offsetY.toFixed(3)} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Z:</span>
                    <span className="font-mono">{selectedTool.offsetZ.toFixed(3)} mm</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              Select a tool to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolManager;