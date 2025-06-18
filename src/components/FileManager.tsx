import React, { useState } from 'react';
import { 
  FolderOpen, 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  Play, 
  Eye,
  Search,
  Filter
} from 'lucide-react';

interface CNCFile {
  id: number;
  name: string;
  type: 'gcode' | 'setup' | 'log';
  size: number;
  modified: Date;
  description?: string;
}

const FileManager: React.FC = () => {
  const [files, setFiles] = useState<CNCFile[]>([
    {
      id: 1,
      name: 'bracket_v2.nc',
      type: 'gcode',
      size: 12450,
      modified: new Date('2024-01-15'),
      description: 'Aluminum bracket - final version'
    },
    {
      id: 2,
      name: 'housing.nc',
      type: 'gcode',
      size: 8920,
      modified: new Date('2024-01-14'),
      description: 'Plastic housing part'
    },
    {
      id: 3,
      name: 'setup_001.json',
      type: 'setup',
      size: 1250,
      modified: new Date('2024-01-13'),
      description: 'Tool setup configuration'
    },
    {
      id: 4,
      name: 'machine_log.txt',
      type: 'log',
      size: 5680,
      modified: new Date('2024-01-12'),
      description: 'Machine operation log'
    },
    {
      id: 5,
      name: 'test_cut.nc',
      type: 'gcode',
      size: 2340,
      modified: new Date('2024-01-11'),
      description: 'Test cutting program'
    }
  ]);

  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'gcode' | 'setup' | 'log'>('all');

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || file.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleFileSelect = (fileId: number, isSelected: boolean) => {
    if (isSelected) {
      setSelectedFiles([...selectedFiles, fileId]);
    } else {
      setSelectedFiles(selectedFiles.filter(id => id !== fileId));
    }
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.nc,.gcode,.json,.txt';
    input.onchange = (e) => {
      const fileList = (e.target as HTMLInputElement).files;
      if (fileList) {
        Array.from(fileList).forEach((file) => {
          const newFile: CNCFile = {
            id: Math.max(...files.map(f => f.id)) + 1,
            name: file.name,
            type: file.name.endsWith('.nc') || file.name.endsWith('.gcode') ? 'gcode' : 
                  file.name.endsWith('.json') ? 'setup' : 'log',
            size: file.size,
            modified: new Date(),
            description: 'Uploaded file'
          };
          setFiles(prev => [...prev, newFile]);
        });
      }
    };
    input.click();
  };

  const handleDeleteFiles = () => {
    setFiles(files.filter(file => !selectedFiles.includes(file.id)));
    setSelectedFiles([]);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'gcode':
        return <FileText className="w-5 h-5 text-blue-400" />;
      case 'setup':
        return <FileText className="w-5 h-5 text-green-400" />;
      case 'log':
        return <FileText className="w-5 h-5 text-yellow-400" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <FolderOpen className="w-5 h-5 mr-2 text-blue-400" />
            File Manager
          </h2>
          
          <div className="flex space-x-2">
            <button
              onClick={handleFileUpload}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </button>
            
            {selectedFiles.length > 0 && (
              <button
                onClick={handleDeleteFiles}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete ({selectedFiles.length})</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Search and Filter */}
        <div className="flex space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as typeof filterType)}
              className="pl-10 pr-8 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none appearance-none"
            >
              <option value="all">All Files</option>
              <option value="gcode">G-Code</option>
              <option value="setup">Setup</option>
              <option value="log">Logs</option>
            </select>
          </div>
        </div>
        
        {/* File Statistics */}
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="bg-gray-900 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-400">{files.filter(f => f.type === 'gcode').length}</div>
            <div className="text-sm text-gray-400">G-Code Files</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-400">{files.filter(f => f.type === 'setup').length}</div>
            <div className="text-sm text-gray-400">Setup Files</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-3">
            <div className="text-2xl font-bold text-yellow-400">{files.filter(f => f.type === 'log').length}</div>
            <div className="text-sm text-gray-400">Log Files</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-3">
            <div className="text-2xl font-bold text-purple-400">
              {formatFileSize(files.reduce((total, file) => total + file.size, 0))}
            </div>
            <div className="text-sm text-gray-400">Total Size</div>
          </div>
        </div>
      </div>

      {/* File List */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-2 w-12">
                  <input
                    type="checkbox"
                    checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFiles(filteredFiles.map(f => f.id));
                      } else {
                        setSelectedFiles([]);
                      }
                    }}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Size</th>
                <th className="text-left py-3 px-4">Modified</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file) => (
                <tr key={file.id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                  <td className="py-3 px-2">
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.id)}
                      onChange={(e) => handleFileSelect(file.id, e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file.type)}
                      <div>
                        <div className="font-medium">{file.name}</div>
                        {file.description && (
                          <div className="text-sm text-gray-400">{file.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      file.type === 'gcode' ? 'bg-blue-600' :
                      file.type === 'setup' ? 'bg-green-600' :
                      'bg-yellow-600'
                    }`}>
                      {file.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-sm">{formatFileSize(file.size)}</td>
                  <td className="py-3 px-4 text-sm text-gray-400">{formatDate(file.modified)}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      {file.type === 'gcode' && (
                        <button className="p-1 text-green-400 hover:bg-gray-600 rounded transition-colors">
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-1 text-blue-400 hover:bg-gray-600 rounded transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:bg-gray-600 rounded transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredFiles.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No files found matching your criteria
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileManager;