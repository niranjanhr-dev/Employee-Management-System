import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, Users } from 'lucide-react';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import { ToastContainer, useToast } from '../components/common/Toast';
import { projectApi } from '../api/projectApi';

const STATUS_OPTIONS = ['ACTIVE', 'COMPLETED', 'ON_HOLD', 'CANCELLED'];

const STATUS_BADGES = {
  ACTIVE: 'badge-active',
  COMPLETED: 'badge-completed',
  ON_HOLD: 'badge-pending',
  CANCELLED: 'badge-inactive',
};

const EMPTY_FORM = {
  projectName: '',
  clientName: '',
  startDate: '',
  endDate: '',
  status: 'ACTIVE',
};

function ProjectForm({ form, setForm, errors }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="label">Project Name *</label>
        <input
          className="input-field"
          placeholder="e.g. ERP System"
          value={form.projectName}
          onChange={(e) => setForm({ ...form, projectName: e.target.value })}
        />
        {errors?.projectName && <p className="text-red-600 text-xs mt-1">{errors.projectName}</p>}
      </div>
      <div>
        <label className="label">Client Name *</label>
        <input
          className="input-field"
          placeholder="e.g. Acme Corp"
          value={form.clientName}
          onChange={(e) => setForm({ ...form, clientName: e.target.value })}
        />
        {errors?.clientName && <p className="text-red-600 text-xs mt-1">{errors.clientName}</p>}
      </div>
      <div>
        <label className="label">Start Date *</label>
        <input
          className="input-field"
          type="date"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
        />
        {errors?.startDate && <p className="text-red-600 text-xs mt-1">{errors.startDate}</p>}
      </div>
      <div>
        <label className="label">End Date</label>
        <input
          className="input-field"
          type="date"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
        />
      </div>
      <div className="sm:col-span-2">
        <label className="label">Status *</label>
        <select
          className="input-field"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function validate(form) {
  const e = {};
  if (!form.projectName.trim()) e.projectName = 'Project name is required';
  if (!form.clientName.trim()) e.clientName = 'Client name is required';
  if (!form.startDate) e.startDate = 'Start date is required';
  if (!form.status) e.status = 'Status is required';
  return e;
}

function ProjectEmployeesModal({ projectId, onClose }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    projectApi.getEmployeesByProject(projectId)
      .then((res) => setEmployees(res.data))
      .catch(() => setEmployees([]))
      .finally(() => setLoading(false));
  }, [projectId]);

  return (
    <div>
      {loading ? (
        <p className="text-sm text-center py-8" style={{ color: 'rgba(17,17,17,0.45)' }}>Loading…</p>
      ) : employees.length === 0 ? (
        <p className="text-sm text-center py-8" style={{ color: 'rgba(17,17,17,0.35)' }}>No employees assigned to this project</p>
      ) : (
        <div className="space-y-2">
          {employees.map((emp) => (
            <div key={emp.employeeId} className="flex items-center gap-3 p-3 rounded-xl border" style={{ backgroundColor: '#fafafa', borderColor: 'rgba(229,62,62,0.12)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm" style={{ backgroundColor: 'rgba(229,62,62,0.08)', color: '#c53030' }}>
                {emp.employeeName?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#111111' }}>{emp.employeeName}</p>
                <p className="text-xs" style={{ color: 'rgba(17,17,17,0.45)' }}>{emp.designation}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-end mt-4">
        <button className="btn-secondary" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [empModal, setEmpModal] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const toast = useToast();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await projectApi.getAll();
      setProjects(res.data);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.projectName?.toLowerCase().includes(q) || p.clientName?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (proj) => {
    setEditingId(proj.projectId);
    setForm({
      projectName: proj.projectName || '',
      clientName: proj.clientName || '',
      startDate: proj.startDate || '',
      endDate: proj.endDate || '',
      status: proj.status || 'ACTIVE',
    });
    setErrors({});
    setModalOpen(true);
  };

  const handleSave = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      if (editingId) {
        await projectApi.update(editingId, form);
        toast.success('Project updated successfully');
      } else {
        await projectApi.create(form);
        toast.success('Project created successfully');
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await projectApi.delete(deleteModal.projectId);
      toast.success('Project deleted');
      setDeleteModal(null);
      loadData();
    } catch {
      toast.error('Failed to delete project');
    }
  };

  const columns = [
    { key: 'projectName', label: 'Project Name', render: (v) => <span className="font-semibold text-gray-900">{v}</span> },
    { key: 'clientName', label: 'Client', render: (v) => <span style={{ color: 'rgba(17,17,17,0.55)' }}>{v}</span> },
    { key: 'startDate', label: 'Start Date', render: (v) => <span style={{ color: 'rgba(17,17,17,0.45)' }}>{v}</span> },
    { key: 'endDate', label: 'End Date', render: (v) => <span style={{ color: 'rgba(17,17,17,0.45)' }}>{v || '—'}</span> },
    {
      key: 'status', label: 'Status',
      render: (v) => <span className={STATUS_BADGES[v] || 'badge'}>{v?.replace('_', ' ')}</span>
    },
  ];

  const allStatuses = ['ALL', ...STATUS_OPTIONS];

  return (
    <div className="space-y-5">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(17,17,17,0.35)' }} />
          <input
            className="input-field pl-9"
            placeholder="Search projects…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <Plus size={16} />
          Add Project
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {allStatuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border"
            style={statusFilter === s ? {
              background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
              boxShadow: '0 4px 12px rgba(229, 62, 62, 0.25)',
              color: '#ffffff',
              borderColor: '#e53e3e'
            } : {
              backgroundColor: '#ffffff',
              borderColor: 'rgba(229,62,62,0.15)',
              color: 'rgba(17,17,17,0.6)'
            }}
          >
            {s === 'ALL' ? 'All Projects' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(229,62,62,0.1)' }}>
          <p className="text-sm" style={{ color: 'rgba(17,17,17,0.45)' }}>
            <span className="font-semibold" style={{ color: '#111111' }}>{filtered.length}</span> projects
          </p>
        </div>
        <Table
          columns={columns}
          data={filtered}
          loading={loading}
          emptyMessage="No projects found"
          actions={(row) => (
            <>
              <button
                className="btn-secondary py-1.5 px-3 text-xs"
                onClick={() => setEmpModal(row.projectId)}
                title="View employees"
              >
                <Users size={13} />
              </button>
              <button className="btn-secondary py-1.5 px-3 text-xs" onClick={() => openEdit(row)}>
                <Pencil size={13} /> Edit
              </button>
              <button className="btn-danger py-1.5 px-3 text-xs" onClick={() => setDeleteModal(row)}>
                <Trash2 size={13} />
              </button>
            </>
          )}
        />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Project' : 'Add New Project'} size="md">
        <ProjectForm form={form} setForm={setForm} errors={errors} />
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t" style={{ borderColor: 'rgba(229,62,62,0.1)' }}>
          <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : editingId ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </Modal>

      <Modal isOpen={!!empModal} onClose={() => setEmpModal(null)} title="Project Employees" size="sm">
        <ProjectEmployeesModal projectId={empModal} onClose={() => setEmpModal(null)} />
      </Modal>

      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Project" size="sm">
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(229,62,62,0.08)' }}>
            <Trash2 size={24} style={{ color: '#c53030' }} />
          </div>
          <p className="mb-1" style={{ color: 'rgba(17,17,17,0.8)' }}>Delete project</p>
          <p className="font-semibold" style={{ color: '#111111' }}>"{deleteModal?.projectName}"?</p>
        </div>
        <div className="flex justify-center gap-3 mt-6">
          <button className="btn-secondary" onClick={() => setDeleteModal(null)}>Cancel</button>
          <button
            className="px-4 py-2 text-white rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
              boxShadow: '0 6px 18px rgba(229, 62, 62, 0.35)'
            }}
            onClick={handleDelete}
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
