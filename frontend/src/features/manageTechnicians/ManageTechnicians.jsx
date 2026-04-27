import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import TechnicianList from './components/TechnicianList';
import TechnicianSidebar from './components/TechnicianSidebar';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { MOCK_TECHNICIANS } from './utils/mockTechnicians';

export default function ManageTechnicians() {
  const [technicians, setTechnicians] = useState(MOCK_TECHNICIANS);
  const [search, setSearch] = useState('');
  const [zoneFilter, setZoneFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals state
  const [selectedTech, setSelectedTech] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [techToDelete, setTechToDelete] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Handlers
  const handleOpenAdd = () => {
    setSelectedTech(null);
    setIsSidebarOpen(true);
  };

  const handleOpenEdit = (tech) => {
    setSelectedTech(tech);
    setIsSidebarOpen(true);
  };

  const handleSaveTech = (data) => {
    if (selectedTech) {
      setTechnicians(prev => prev.map(t => t.id === selectedTech.id ? { ...t, ...data } : t));
    } else {
      const newTech = {
        ...data,
        id: `CT-${Math.floor(Math.random() * 900) + 100}`,
        skills: ['Por definir'], // Mock default
      };
      setTechnicians(prev => [newTech, ...prev]);
    }
  };

  const handleOpenDelete = (tech) => {
    setTechToDelete(tech);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = (id) => {
    setTechnicians(prev => prev.filter(t => t.id !== id));
  };

  // Filtered array
  const filteredData = technicians.filter(tech => {
    const matchSearch = tech.name.toLowerCase().includes(search.toLowerCase()) || tech.id.toLowerCase().includes(search.toLowerCase());
    const matchZone = zoneFilter ? tech.zone.includes(zoneFilter) : true;
    const matchStatus = statusFilter ? tech.status === statusFilter : true;
    return matchSearch && matchZone && matchStatus;
  });

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      
      {/* Header Container */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight mb-1" style={{ color: 'var(--md-primary-container)' }}>
            Gestión de Técnicos
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Administra el personal en campo, zonas y herramientas.
          </p>
        </div>
        
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white shadow-sm hover:opacity-90 transition-opacity active:scale-95"
          style={{ backgroundColor: 'var(--md-primary-container)' }}
        >
          <Plus size={18} />
          Nuevo Técnico
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-3 rounded-xl flex flex-wrap gap-4 items-center justify-between shadow-sm bg-white/60 border border-slate-200">
        <div className="flex items-center bg-white rounded-lg border border-slate-200 px-3 py-2 flex-1 min-w-[200px] sm:max-w-xs focus-within:border-[var(--md-primary-container)] transition-colors">
          <Search size={16} className="text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o ID..." 
            className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <select 
            className="flex-1 sm:w-auto bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-[var(--md-primary-container)]"
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
          >
            <option value="">Todas las Zonas</option>
            <option value="Norte">Norte</option>
            <option value="Sur">Sur</option>
            <option value="Oriente">Oriente</option>
            <option value="Occidente">Occidente</option>
          </select>
          <select 
            className="flex-1 sm:w-auto bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-[var(--md-primary-container)]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Cualquier Estado</option>
            <option value="en_campo">En Campo</option>
            <option value="activo">Activos</option>
            <option value="descanso">En Descanso</option>
            <option value="inactivo">Inactivos</option>
          </select>
        </div>
      </div>

      {/* Main List */}
      <TechnicianList 
        technicians={filteredData} 
        onEdit={handleOpenEdit} 
        onDelete={handleOpenDelete} 
      />

      {/* Sidebars and Modals */}
      <TechnicianSidebar 
        isOpen={isSidebarOpen} 
        technician={selectedTech} 
        onClose={() => setIsSidebarOpen(false)}
        onSave={handleSaveTech}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteOpen}
        technician={techToDelete}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

    </div>
  );
}
