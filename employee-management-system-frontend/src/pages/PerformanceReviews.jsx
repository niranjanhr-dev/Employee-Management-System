import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, Star, Filter } from 'lucide-react';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import { ToastContainer, useToast } from '../components/common/Toast';
import { reviewApi } from '../api/reviewApi';
import { employeeApi } from '../api/employeeApi';

const EMPTY_FORM = {
  rating: '',
  comments: '',
  reviewDate: '',
  feedback: '',
  employeeId: '',
};

function StarRating({ value }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={s <= value ? 'text-amber-500 fill-amber-500' : ''}
          style={s > value ? { color: 'rgba(17,17,17,0.18)' } : {}}
        />
      ))}
      <span className="ml-1.5 text-xs font-semibold" style={{ color: 'rgba(17,17,17,0.45)' }}>{value}/5</span>
    </div>
  );
}

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform duration-100 hover:scale-110"
        >
          <Star
            size={24}
            className={(hover || value) >= s ? 'text-amber-500 fill-amber-500' : ''}
            style={(hover || value) < s ? { color: 'rgba(17,17,17,0.18)' } : {}}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewForm({ form, setForm, employees, errors }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="label">Employee *</label>
        <select
          className="input-field"
          value={form.employeeId}
          onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
        >
          <option value="">Select an employee</option>
          {employees.map((emp) => (
            <option key={emp.employeeId} value={emp.employeeId}>
              {emp.employeeName} — {emp.designation}
            </option>
          ))}
        </select>
        {errors?.employeeId && <p className="text-red-600 text-xs mt-1">{errors.employeeId}</p>}
      </div>
      <div>
        <label className="label">Rating *</label>
        <StarPicker value={Number(form.rating)} onChange={(v) => setForm({ ...form, rating: v })} />
        {errors?.rating && <p className="text-red-600 text-xs mt-1">{errors.rating}</p>}
      </div>
      <div>
        <label className="label">Review Date *</label>
        <input
          className="input-field"
          type="date"
          value={form.reviewDate}
          max={new Date().toISOString().split('T')[0]}
          onChange={(e) => setForm({ ...form, reviewDate: e.target.value })}
        />
        {errors?.reviewDate && <p className="text-red-600 text-xs mt-1">{errors.reviewDate}</p>}
      </div>
      <div>
        <label className="label">Comments *</label>
        <textarea
          className="input-field resize-none"
          rows={3}
          placeholder="Detailed review comments…"
          value={form.comments}
          onChange={(e) => setForm({ ...form, comments: e.target.value })}
        />
        {errors?.comments && <p className="text-red-600 text-xs mt-1">{errors.comments}</p>}
      </div>
      <div>
        <label className="label">Feedback</label>
        <input
          className="input-field"
          placeholder="e.g. Excellent, Good, Needs Improvement"
          value={form.feedback}
          onChange={(e) => setForm({ ...form, feedback: e.target.value })}
        />
      </div>
    </div>
  );
}

function validate(form) {
  const e = {};
  if (!form.employeeId) e.employeeId = 'Employee is required';
  if (!form.rating) e.rating = 'Rating is required';
  if (!form.reviewDate) e.reviewDate = 'Review date is required';
  if (!form.comments.trim()) e.comments = 'Comments are required';
  return e;
}

export default function PerformanceReviews() {
  const [reviews, setReviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ minRating: '', startDate: '', endDate: '' });
  const toast = useToast();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [revRes, empRes] = await Promise.all([
        reviewApi.getAll(),
        employeeApi.getAll(),
      ]);
      setReviews(revRes.data);
      setEmployees(empRes.data);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const empMap = employees.reduce((acc, e) => { acc[e.employeeId] = e; return acc; }, {});

  const filtered = reviews.filter((r) => {
    const emp = empMap[r.employeeId];
    const q = search.toLowerCase();
    const matchSearch = !q ||
      emp?.employeeName?.toLowerCase().includes(q) ||
      r.comments?.toLowerCase().includes(q) ||
      r.feedback?.toLowerCase().includes(q);

    const matchRating = !filters.minRating || r.rating >= Number(filters.minRating);
    const matchStart = !filters.startDate || r.reviewDate >= filters.startDate;
    const matchEnd = !filters.endDate || r.reviewDate <= filters.endDate;

    return matchSearch && matchRating && matchStart && matchEnd;
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (rev) => {
    setEditingId(rev.reviewId);
    setForm({
      rating: rev.rating || '',
      comments: rev.comments || '',
      reviewDate: rev.reviewDate || '',
      feedback: rev.feedback || '',
      employeeId: rev.employeeId || '',
    });
    setErrors({});
    setModalOpen(true);
  };

  const handleSave = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const payload = { ...form, rating: Number(form.rating), employeeId: Number(form.employeeId) };
      if (editingId) {
        await reviewApi.update(editingId, payload);
        toast.success('Review updated successfully');
      } else {
        await reviewApi.create(payload);
        toast.success('Review created successfully');
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
      await reviewApi.delete(deleteModal.reviewId);
      toast.success('Review deleted');
      setDeleteModal(null);
      loadData();
    } catch {
      toast.error('Failed to delete review');
    }
  };

  const columns = [
    {
      key: 'employeeId', label: 'Employee',
      render: (v) => {
        const emp = empMap[v];
        return emp ? (
          <div>
            <p className="font-semibold text-gray-900">{emp.employeeName}</p>
            <p className="text-xs" style={{ color: 'rgba(17,17,17,0.45)' }}>{emp.designation}</p>
          </div>
        ) : <span style={{ color: 'rgba(17,17,17,0.35)' }}>—</span>;
      }
    },
    {
      key: 'rating', label: 'Rating',
      render: (v) => <StarRating value={v} />
    },
    {
      key: 'reviewDate', label: 'Review Date',
      render: (v) => <span style={{ color: 'rgba(17,17,17,0.45)' }}>{v}</span>
    },
    {
      key: 'comments', label: 'Comments',
      render: (v) => (
        <span className="max-w-xs truncate block" style={{ color: 'rgba(17,17,17,0.55)' }} title={v}>{v}</span>
      )
    },
    {
      key: 'feedback', label: 'Feedback',
      render: (v) => (
        <span className={`badge ${Number(v) >= 4 || v?.toLowerCase().includes('excellent') || v?.toLowerCase().includes('good') ? 'badge-active' : 'badge-pending'}`}>
          {v?.length > 20 ? v.slice(0, 20) + '…' : v}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-5">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(17,17,17,0.35)' }} />
            <input
              className="input-field pl-9"
              placeholder="Search reviews…"
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
          Add Review
        </button>
      </div>

      {filterOpen && (
        <div className="glass-card p-4 animate-slide-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="label">Min Rating (1–5)</label>
              <input className="input-field" type="number" min="1" max="5" placeholder="1"
                value={filters.minRating} onChange={(e) => setFilters({ ...filters, minRating: e.target.value })} />
            </div>
            <div>
              <label className="label">From Date</label>
              <input className="input-field" type="date" value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
            </div>
            <div>
              <label className="label">To Date</label>
              <input className="input-field" type="date" value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <button
              className="text-xs transition-colors"
              style={{ color: 'rgba(17,17,17,0.45)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#e53e3e'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(17,17,17,0.45)'}
              onClick={() => setFilters({ minRating: '', startDate: '', endDate: '' })}
            >
              Clear filters
            </button>
          </div>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(229,62,62,0.1)' }}>
          <p className="text-sm" style={{ color: 'rgba(17,17,17,0.45)' }}>
            <span className="font-semibold" style={{ color: '#111111' }}>{filtered.length}</span> reviews
          </p>
        </div>
        <Table
          columns={columns}
          data={filtered}
          loading={loading}
          emptyMessage="No reviews found"
          actions={(row) => (
            <>
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
        title={editingId ? 'Edit Review' : 'Add Performance Review'} size="md">
        <ReviewForm form={form} setForm={setForm} employees={employees} errors={errors} />
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t" style={{ borderColor: 'rgba(229,62,62,0.1)' }}>
          <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : editingId ? 'Update Review' : 'Create Review'}
          </button>
        </div>
      </Modal>

      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Review" size="sm">
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(229,62,62,0.08)' }}>
            <Trash2 size={24} style={{ color: '#c53030' }} />
          </div>
          <p className="mb-1" style={{ color: 'rgba(17,17,17,0.8)' }}>Delete this performance review?</p>
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
