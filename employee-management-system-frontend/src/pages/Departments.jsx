import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, Building2 } from 'lucide-react';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import { ToastContainer, useToast } from '../components/common/Toast';
import { departmentApi } from '../api/departmentApi';

const EMPTY_FORM = { departmentName: '', location: '', budget: '' };

function DepartmentForm({ form, setForm, errors }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="label">Department Name *</label>
        <input
          className="input-field"
          placeholder="e.g. Engineering"
          value={form.departmentName}
          onChange={(e) => setForm({ ...form, departmentName: e.target.value })}
        />
        {errors?.departmentName && <p className="text-red-600 text-xs mt-1">{errors.departmentName}</p>}
      </div>
      <div>
        <label className="label">Location *</label>
        <input
          className="input-field"
          placeholder="e.g. Bangalore"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        {errors?.location && <p className="text-red-600 text-xs mt-1">{errors.location}</p>}
      </div>
      <div>
        <label className="label">Budget (₹) *</label>
        <input
          className="input-field"
          type="number"
          placeholder="e.g. 1000000"
          value={form.budget}
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
        />
        {errors?.budget && <p className="text-red-600 text-xs mt-1">{errors.budget}</p>}
      </div>
    </div>
  );
}

function validate(form) {
  const e = {};
  if (!form.departmentName.trim()) e.departmentName = 'Department name is required';
  if (!form.location.trim()) e.location = 'Location is required';
  if (!form.budget) e.budget = 'Budget is required';
  else if (Number(form.budget) <= 0) e.budget = 'Budget must be positive';
  return e;
}

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const toast = useToast();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await departmentApi.getAll();
      setDepartments(res.data);
    } catch {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = departments.filter((d) => {
    const q = search.toLowerCase();
    return !q || d.departmentName?.toLowerCase().includes(q) || d.location?.toLowerCase().includes(q);
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (dept) => {
    setEditingId(dept.departmentId);
    setForm({
      departmentName: dept.departmentName || '',
      location: dept.location || '',
      budget: dept.budget || '',
    });
    setErrors({});
    setModalOpen(true);
  };

  const handleSave = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const payload = { ...form, budget: Number(form.budget) };
      if (editingId) {
        await departmentApi.update(editingId, payload);
        toast.success('Department updated successfully');
      } else {
        await departmentApi.create(payload);
        toast.success('Department created successfully');
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
      await departmentApi.delete(deleteModal.departmentId);
      toast.success('Department deleted');
      setDeleteModal(null);
      loadData();
    } catch {
      toast.error('Failed to delete department');
    }
  };

  const columns = [
    {
      key: 'departmentName', label: 'Department Name',
      render: (v) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(249,115,22,0.08)' }}>
            <Building2 size={14} style={{ color: '#f97316' }} />
          </div>
          <span className="font-semibold" style={{ color: '#111111' }}>{v}</span>
        </div>
      )
    },
    { key: 'location', label: 'Location', render: (v) => <span style={{ color: 'rgba(17,17,17,0.55)' }}>{v}</span> },
    {
      key: 'budget', label: 'Budget',
      render: (v) => <span className="font-semibold" style={{ color: '#2563eb' }}>₹{v?.toLocaleString()}</span>
    },
  ];

  return (
    <div className="space-y-5">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(17,17,17,0.35)' }} />
          <input
            className="input-field pl-9"
            placeholder="Search departments…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <Plus size={16} />
          Add Department
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(229,62,62,0.1)' }}>
          <p className="text-sm" style={{ color: 'rgba(17,17,17,0.45)' }}>
            <span className="font-semibold" style={{ color: '#111111' }}>{filtered.length}</span> departments
          </p>
        </div>
        <Table
          columns={columns}
          data={filtered}
          loading={loading}
          emptyMessage="No departments found"
          actions={(row) => (
            <>
              <button className="btn-secondary py-1.5 px-3 text-xs" onClick={() => openEdit(row)}>
                <Pencil size={13} /> Edit
              </button>
              <button className="btn-danger py-1.5 px-3 text-xs" onClick={() => setDeleteModal(row)}>
                <Trash2 size={13} /> Delete
              </button>
            </>
          )}
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Department' : 'Add New Department'}
        size="sm"
      >
        <DepartmentForm form={form} setForm={setForm} errors={errors} />
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t" style={{ borderColor: 'rgba(229,62,62,0.1)' }}>
          <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : editingId ? 'Update Department' : 'Create Department'}
          </button>
        </div>
      </Modal>

      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Department" size="sm">
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(229,62,62,0.08)' }}>
            <Trash2 size={24} style={{ color: '#c53030' }} />
          </div>
          <p className="mb-1" style={{ color: 'rgba(17,17,17,0.8)' }}>Are you sure you want to delete</p>
          <p className="font-semibold" style={{ color: '#111111' }}>"{deleteModal?.departmentName}"?</p>
          <p className="text-xs mt-2" style={{ color: 'rgba(17,17,17,0.4)' }}>This action cannot be undone.</p>
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
