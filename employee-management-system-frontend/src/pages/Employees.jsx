import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, Filter } from 'lucide-react';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import { ToastContainer, useToast } from '../components/common/Toast';
import { employeeApi } from '../api/employeeApi';
import { departmentApi } from '../api/departmentApi';
import { projectApi } from '../api/projectApi';

const EMPTY_FORM = {
  employeeName: '',
  email: '',
  mobileNumber: '',
  salary: '',
  designation: '',
  joiningDate: '',
  departmentId: '',
  projectIds: [],
};

function validate(form) {
  const e = {};
  if (!form.employeeName.trim()) e.employeeName = 'Name is required';
  if (!form.email.trim()) e.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
  if (!form.mobileNumber.trim()) e.mobileNumber = 'Mobile number is required';
  else if (!/^\d{10}$/.test(form.mobileNumber)) e.mobileNumber = 'Must be 10 digits';
  if (!form.salary) e.salary = 'Salary is required';
  else if (Number(form.salary) <= 0) e.salary = 'Salary must be positive';
  if (!form.designation.trim()) e.designation = 'Designation is required';
  if (!form.joiningDate) e.joiningDate = 'Joining date is required';
  if (!form.departmentId) e.departmentId = 'Department is required';
  return e;
}

function EmployeeForm({ form, setForm, departments, errors }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    projectApi.getAll().then((res) => setProjects(res.data)).catch(() => {});
  }, []);

  const toggleProject = (id) => {
    const numId = Number(id);
    setForm((prev) => ({
      ...prev,
      projectIds: prev.projectIds.includes(numId)
        ? prev.projectIds.filter((p) => p !== numId)
        : [...prev.projectIds, numId],
    }));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="label">Full Name *</label>
        <input className="input-field" placeholder="e.g. Ravi Kumar" value={form.employeeName}
          onChange={(e) => setForm({ ...form, employeeName: e.target.value })} />
        {errors?.employeeName && <p className="text-red-600 text-xs mt-1">{errors.employeeName}</p>}
      </div>
      <div>
        <label className="label">Email *</label>
        <input className="input-field" type="email" placeholder="e.g. ravi@company.com" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
        {errors?.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
      </div>
      <div>
        <label className="label">Mobile Number *</label>
        <input className="input-field" placeholder="10-digit mobile" value={form.mobileNumber}
          onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })} />
        {errors?.mobileNumber && <p className="text-red-600 text-xs mt-1">{errors.mobileNumber}</p>}
      </div>
      <div>
        <label className="label">Salary (₹) *</label>
        <input className="input-field" type="number" placeholder="e.g. 50000" value={form.salary}
          onChange={(e) => setForm({ ...form, salary: e.target.value })} />
        {errors?.salary && <p className="text-red-600 text-xs mt-1">{errors.salary}</p>}
      </div>
      <div>
        <label className="label">Designation *</label>
        <input className="input-field" placeholder="e.g. Software Engineer" value={form.designation}
          onChange={(e) => setForm({ ...form, designation: e.target.value })} />
        {errors?.designation && <p className="text-red-600 text-xs mt-1">{errors.designation}</p>}
      </div>
      <div>
        <label className="label">Joining Date *</label>
        <input className="input-field" type="date" value={form.joiningDate}
          onChange={(e) => setForm({ ...form, joiningDate: e.target.value })} />
        {errors?.joiningDate && <p className="text-red-600 text-xs mt-1">{errors.joiningDate}</p>}
      </div>
      <div className="sm:col-span-2">
        <label className="label">Department *</label>
        <select className="input-field" value={form.departmentId}
          onChange={(e) => setForm({ ...form, departmentId: e.target.value })}>
          <option value="">Select a department</option>
          {departments.map((d) => (
            <option key={d.departmentId} value={d.departmentId}>{d.departmentName}</option>
          ))}
        </select>
        {errors?.departmentId && <p className="text-red-600 text-xs mt-1">{errors.departmentId}</p>}
      </div>
      {projects.length > 0 && (
        <div className="sm:col-span-2">
          <label className="label">Assign to Projects</label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {projects.map((proj) => (
              <label
                key={proj.projectId}
                className="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors border"
                style={{
                  backgroundColor: '#fafafa',
                  borderColor: 'rgba(229,62,62,0.12)'
                }}
              >
                <input
                  type="checkbox"
                  checked={form.projectIds.includes(proj.projectId)}
                  onChange={() => toggleProject(proj.projectId)}
                  className="rounded accent-[#e53e3e]"
                />
                <span className="text-sm truncate" style={{ color: '#111111' }}>{proj.projectName}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ designation: '', minSalary: '', maxSalary: '', department: '' });
  const toast = useToast();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [empRes, deptRes] = await Promise.all([
        employeeApi.getAll(),
        departmentApi.getAll(),
      ]);
      setEmployees(empRes.data);
      setDepartments(deptRes.data);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const deptMap = departments.reduce((acc, d) => { acc[d.departmentId] = d.departmentName; return acc; }, {});

  const filtered = employees.filter((emp) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      emp.employeeName?.toLowerCase().includes(q) ||
      emp.email?.toLowerCase().includes(q) ||
      emp.designation?.toLowerCase().includes(q);

    const matchDesig = !filters.designation || emp.designation?.toLowerCase().includes(filters.designation.toLowerCase());
    const matchMin = !filters.minSalary || emp.salary >= Number(filters.minSalary);
    const matchMax = !filters.maxSalary || emp.salary <= Number(filters.maxSalary);
    const matchDept = !filters.department || deptMap[emp.departmentId]?.toLowerCase().includes(filters.department.toLowerCase());

    return matchSearch && matchDesig && matchMin && matchMax && matchDept;
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (emp) => {
    setEditingId(emp.employeeId);
    setForm({
      employeeName: emp.employeeName || '',
      email: emp.email || '',
      mobileNumber: emp.mobileNumber || '',
      salary: emp.salary || '',
      designation: emp.designation || '',
      joiningDate: emp.joiningDate || '',
      departmentId: emp.departmentId || '',
      projectIds: emp.projectIds || [],
    });
    setErrors({});
    setModalOpen(true);
  };

  const handleSave = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const payload = { ...form, salary: Number(form.salary), departmentId: Number(form.departmentId) };
      if (editingId) {
        await employeeApi.update(editingId, payload);
        toast.success('Employee updated successfully');
      } else {
        await employeeApi.create(payload);
        toast.success('Employee created successfully');
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
      await employeeApi.delete(deleteModal.employeeId);
      toast.success('Employee deleted');
      setDeleteModal(null);
      loadData();
    } catch {
      toast.error('Failed to delete employee');
    }
  };

  const columns = [
    { key: 'employeeName', label: 'Name', render: (v) => <span className="font-semibold text-gray-900">{v}</span> },
    { key: 'email', label: 'Email', render: (v) => <span style={{ color: 'rgba(17,17,17,0.55)' }}>{v}</span> },
    { key: 'mobileNumber', label: 'Mobile' },
    {
      key: 'designation', label: 'Designation',
      render: (v) => <span className="badge" style={{ backgroundColor: 'rgba(229,62,62,0.08)', color: '#c53030', border: '1px solid rgba(229,62,62,0.18)' }}>{v}</span>
    },
    {
      key: 'salary', label: 'Salary',
      render: (v) => <span className="font-semibold" style={{ color: '#2563eb' }}>₹{v?.toLocaleString()}</span>
    },
    {
      key: 'departmentId', label: 'Department',
      render: (v) => <span style={{ color: '#f97316' }}>{deptMap[v] || '—'}</span>
    },
    { key: 'joiningDate', label: 'Joined', render: (v) => <span style={{ color: 'rgba(17,17,17,0.45)' }}>{v}</span> },
  ];

  return (
    <div className="space-y-5">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(17,17,17,0.35)' }} />
            <input
              className="input-field pl-9"
              placeholder="Search employees…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className="btn-secondary gap-2"
            style={filterOpen ? { backgroundColor: 'rgba(229,62,62,0.1)', borderColor: 'rgba(229,62,62,0.25)', color: '#e53e3e' } : {}}
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter size={14} />
            Filters
          </button>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <Plus size={16} />
          Add Employee
        </button>
      </div>

      {/* Filter Panel */}
      {filterOpen && (
        <div className="glass-card p-4 animate-slide-in">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium" style={{ color: 'rgba(17,17,17,0.7)' }}>Filter Options</p>
            <button
              className="text-xs transition-colors"
              style={{ color: 'rgba(17,17,17,0.45)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#e53e3e'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(17,17,17,0.45)'}
              onClick={() => setFilters({ designation: '', minSalary: '', maxSalary: '', department: '' })}
            >
              Clear all
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="label">Designation</label>
              <input className="input-field" placeholder="e.g. Engineer" value={filters.designation}
                onChange={(e) => setFilters({ ...filters, designation: e.target.value })} />
            </div>
            <div>
              <label className="label">Min Salary</label>
              <input className="input-field" type="number" placeholder="0" value={filters.minSalary}
                onChange={(e) => setFilters({ ...filters, minSalary: e.target.value })} />
            </div>
            <div>
              <label className="label">Max Salary</label>
              <input className="input-field" type="number" placeholder="999999" value={filters.maxSalary}
                onChange={(e) => setFilters({ ...filters, maxSalary: e.target.value })} />
            </div>
            <div>
              <label className="label">Department</label>
              <input className="input-field" placeholder="e.g. Engineering" value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })} />
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(229,62,62,0.1)' }}>
          <p className="text-sm" style={{ color: 'rgba(17,17,17,0.45)' }}>
            Showing <span className="font-semibold" style={{ color: '#111111' }}>{filtered.length}</span> of {employees.length} employees
          </p>
        </div>
        <Table
          columns={columns}
          data={filtered}
          loading={loading}
          emptyMessage="No employees found"
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

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Employee' : 'Add New Employee'}
        size="lg"
      >
        <EmployeeForm form={form} setForm={setForm} departments={departments} errors={errors} />
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t" style={{ borderColor: 'rgba(229,62,62,0.1)' }}>
          <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : editingId ? 'Update Employee' : 'Create Employee'}
          </button>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Employee" size="sm">
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(229,62,62,0.08)' }}>
            <Trash2 size={24} style={{ color: '#c53030' }} />
          </div>
          <p className="mb-1" style={{ color: 'rgba(17,17,17,0.8)' }}>Are you sure you want to delete</p>
          <p className="font-semibold" style={{ color: '#111111' }}>"{deleteModal?.employeeName}"?</p>
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
