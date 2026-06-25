import { useState, useEffect } from 'react';
import { Users, Building2, FolderKanban, TrendingUp, DollarSign, Activity } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import StatCard from '../components/common/StatCard';
import { dashboardApi } from '../api/dashboardApi';
import { employeeApi } from '../api/employeeApi';
import { departmentApi } from '../api/departmentApi';

const COLORS = ['#e53e3e', '#f97316', '#f59e0b', '#2563eb', '#111111'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-4 py-3 text-sm" style={{ backgroundColor: '#fff8f8', border: '1px solid rgba(229,62,62,0.15)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <p className="mb-1" style={{ color: 'rgba(17,17,17,0.5)' }}>{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} style={{ color: p.color }} className="font-semibold">
            {p.name}: {typeof p.value === 'number' && p.value > 1000
              ? `₹${p.value.toLocaleString()}`
              : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, empRes, deptRes] = await Promise.allSettled([
          dashboardApi.getStats(),
          employeeApi.getAll(),
          departmentApi.getAll(),
        ]);
        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
        if (empRes.status === 'fulfilled') setEmployees(empRes.value.data);
        if (deptRes.status === 'fulfilled') setDepartments(deptRes.value.data);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Build chart data
  const deptSalaryData = departments.map((dept) => {
    const deptEmployees = employees.filter((e) => e.departmentId === dept.departmentId);
    const avgSalary = deptEmployees.length
      ? deptEmployees.reduce((s, e) => s + e.salary, 0) / deptEmployees.length
      : 0;
    return {
      name: dept.departmentName?.length > 10 ? dept.departmentName.slice(0, 10) + '…' : dept.departmentName,
      employees: deptEmployees.length,
      avgSalary: Math.round(avgSalary),
    };
  });

  const designationData = employees.reduce((acc, emp) => {
    const existing = acc.find((d) => d.name === emp.designation);
    if (existing) existing.value++;
    else acc.push({ name: emp.designation || 'Unknown', value: 1 });
    return acc;
  }, []);

  const recentEmployees = [...employees]
    .sort((a, b) => new Date(b.joiningDate) - new Date(a.joiningDate))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Employees"
          value={loading ? '…' : stats?.totalEmployees ?? employees.length}
          icon={Users}
          color="indigo"
          subtitle="Active workforce"
        />
        <StatCard
          title="Departments"
          value={loading ? '…' : stats?.totalDepartments ?? departments.length}
          icon={Building2}
          color="violet"
          subtitle="Across all locations"
        />
        <StatCard
          title="Projects"
          value={loading ? '…' : stats?.totalProjects ?? '—'}
          icon={FolderKanban}
          color="emerald"
          subtitle="Active & completed"
        />
        <StatCard
          title="Avg. Salary"
          value={loading ? '…' : stats?.averageSalary ? `₹${Math.round(stats.averageSalary).toLocaleString()}` : '—'}
          icon={DollarSign}
          color="amber"
          subtitle="Per employee"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Dept vs Employees */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity size={18} style={{ color: '#e53e3e' }} />
            <h2 className="section-title">Employees per Department</h2>
          </div>
          {deptSalaryData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-sm" style={{ color: 'rgba(17,17,17,0.3)' }}>
              No department data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deptSalaryData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(229,62,62,0.08)" />
                <XAxis dataKey="name" tick={{ fill: 'rgba(17,17,17,0.45)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(17,17,17,0.45)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="employees" name="Employees" fill="#e53e3e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart - Designations */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={18} style={{ color: '#f97316' }} />
            <h2 className="section-title">Employees by Designation</h2>
          </div>
          {designationData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-sm" style={{ color: 'rgba(17,17,17,0.3)' }}>
              No employee data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={designationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {designationData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => <span style={{ color: 'rgba(17,17,17,0.6)', fontSize: 12 }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Employees Table */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Users size={18} style={{ color: '#2563eb' }} />
          <h2 className="section-title">Recently Joined Employees</h2>
        </div>
        {recentEmployees.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: 'rgba(17,17,17,0.3)' }}>No employee records yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(229,62,62,0.1)' }}>
                  {['Name', 'Email', 'Designation', 'Salary', 'Joining Date'].map((h) => (
                    <th key={h} className="table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentEmployees.map((emp) => (
                  <tr key={emp.employeeId} className="table-row">
                    <td className="table-cell font-semibold" style={{ color: '#111111' }}>{emp.employeeName}</td>
                    <td className="table-cell" style={{ color: 'rgba(17,17,17,0.55)' }}>{emp.email}</td>
                    <td className="table-cell">
                      <span className="badge" style={{ backgroundColor: 'rgba(229,62,62,0.08)', color: '#c53030', border: '1px solid rgba(229,62,62,0.18)' }}>
                        {emp.designation}
                      </span>
                    </td>
                    <td className="table-cell font-semibold" style={{ color: '#2563eb' }}>
                      ₹{emp.salary?.toLocaleString()}
                    </td>
                    <td className="table-cell" style={{ color: 'rgba(17,17,17,0.45)' }}>{emp.joiningDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
