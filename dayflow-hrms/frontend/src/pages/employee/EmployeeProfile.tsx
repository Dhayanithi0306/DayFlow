import React, { useEffect, useState } from 'react';
import { employeeService } from '../../services/employeeService';
import { Employee } from '../../types';
import { useToast } from '../../context/ToastContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { Tabs } from '../../components/common/Tabs';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { LoadingState } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';
import {
  User,
  ShieldCheck,
  Building2,
  MapPin,
  Edit,
  FileText,
  CreditCard,
  Briefcase,
  Lock,
  Phone,
} from 'lucide-react';

export const EmployeeProfile: React.FC = () => {
  const { showToast } = useToast();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('general');
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // Edit form state
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>('');

  const fetchProfile = async () => {
    try {
      const res = await employeeService.getSelfProfile();
      if (res.success && res.data?.employee) {
        const emp = res.data.employee;
        setEmployee(emp);
        setPhone(emp.phone || '');
        setAddress(emp.address || '');
        setCity(emp.city || '');
        setState(emp.state || '');
        setPostalCode(emp.postalCode || '');
        setCountry(emp.country || '');
        setProfilePictureUrl(emp.profilePictureUrl || '');
      }
    } catch (err) {
      console.error('Error fetching employee self profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateContactInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await employeeService.updateSelfProfile({
        phone,
        address,
        city,
        state,
        postalCode,
        country,
        profilePictureUrl,
      });

      if (res.success && res.data?.employee) {
        setEmployee(res.data.employee);
        showToast('Profile updated successfully.', 'success');
        setEditModalOpen(false);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading profile information..." />;
  }

  if (!employee) {
    return <EmptyState title="Employee profile not found" description="Unable to load employee details." />;
  }

  const displayName = `${employee.firstName} ${employee.lastName}`;
  const departmentName = (employee as any).department?.name || 'Department';
  const managerName = (employee as any).manager
    ? `${(employee as any).manager.firstName} ${(employee as any).manager.lastName}`
    : 'None Assigned';
  const privateInfo = (employee as any).privateInfo;
  const documents = (employee as any).documents || [];
  const salaryStructure = (employee as any).salaryStructures?.[0];

  const tabList = [
    { id: 'general', label: 'General Info', icon: <User size={16} /> },
    { id: 'private', label: 'Private Information', icon: <ShieldCheck size={16} /> },
    { id: 'job', label: 'Job Details', icon: <Briefcase size={16} /> },
    { id: 'documents', label: 'Documents', icon: <FileText size={16} />, badge: documents.length },
    { id: 'salary', label: 'Salary Overview', icon: <CreditCard size={16} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Employee Profile"
        subtitle="View and update your contact information."
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setEditModalOpen(true)}
            icon={<Edit size={16} />}
          >
            Edit Contact Details
          </Button>
        }
      />

      {/* Header Profile Card */}
      <Card className="bg-white border border-slate-200">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <Avatar name={displayName} src={employee.profilePictureUrl} size="xl" className="ring-4 ring-indigo-50" />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-bold text-slate-900">{displayName}</h2>
                <Badge variant="success" size="sm">
                  {employee.employmentStatus}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 font-medium">{employee.designation}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 pt-2 font-mono">
                <span className="flex items-center gap-1.5">
                  <Badge variant="primary" size="sm">ID</Badge>
                  {employee.employeeId}
                </span>
                <span className="flex items-center gap-1">
                  <Building2 size={14} className="text-indigo-600" />
                  {departmentName}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} className="text-sky-600" />
                  {employee.location || 'Main Office'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1.5 min-w-[220px]">
            <p className="font-semibold text-slate-800">Reporting Line:</p>
            <p><span className="text-slate-400">Manager:</span> <span className="font-medium text-slate-900">{managerName}</span></p>
            <p><span className="text-slate-400">Joining Date:</span> <span className="font-medium font-mono text-slate-900">{new Date(employee.joiningDate).toLocaleDateString()}</span></p>
          </div>
        </div>
      </Card>

      {/* Tabs Bar */}
      <Tabs tabs={tabList} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Panels */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Personal & Contact Information">
            <dl className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-400">Full Name</dt>
                <dd className="font-semibold text-slate-900">{displayName}</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-400">Email Address</dt>
                <dd className="font-semibold text-slate-900">{(employee as any).user?.email || 'N/A'}</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-400">Phone Number</dt>
                <dd className="font-semibold text-slate-900">{employee.phone || 'Not set'}</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-400">Gender</dt>
                <dd className="font-semibold text-slate-900">{employee.gender || 'Not specified'}</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-400">Date of Birth</dt>
                <dd className="font-semibold text-slate-900 font-mono">
                  {employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString() : 'Not specified'}
                </dd>
              </div>
            </dl>
          </Card>

          <Card title="Address Details">
            <dl className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-400">Address</dt>
                <dd className="font-semibold text-slate-900">{employee.address || 'Not specified'}</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-400">City</dt>
                <dd className="font-semibold text-slate-900">{employee.city || 'Not specified'}</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-400">State / Province</dt>
                <dd className="font-semibold text-slate-900">{employee.state || 'Not specified'}</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-400">Postal Code</dt>
                <dd className="font-semibold text-slate-900 font-mono">{employee.postalCode || 'Not specified'}</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-400">Country</dt>
                <dd className="font-semibold text-slate-900">{employee.country || 'Not specified'}</dd>
              </div>
            </dl>
          </Card>
        </div>
      )}

      {activeTab === 'private' && (
        <Card title="Private Information">
          <dl className="divide-y divide-slate-100 text-xs max-w-2xl">
            <div className="py-2.5 flex justify-between">
              <dt className="text-slate-400">Nationality</dt>
              <dd className="font-semibold text-slate-900">{privateInfo?.nationality || 'Not specified'}</dd>
            </div>
            <div className="py-2.5 flex justify-between">
              <dt className="text-slate-400">Marital Status</dt>
              <dd className="font-semibold text-slate-900">{privateInfo?.maritalStatus || 'Not specified'}</dd>
            </div>
            <div className="py-2.5 flex justify-between">
              <dt className="text-slate-400">Personal Email</dt>
              <dd className="font-semibold text-slate-900">{privateInfo?.personalEmail || 'Not specified'}</dd>
            </div>
            <div className="py-2.5 flex justify-between">
              <dt className="text-slate-400">Emergency Contact Name</dt>
              <dd className="font-semibold text-slate-900">{privateInfo?.emergencyContactName || 'Not specified'}</dd>
            </div>
            <div className="py-2.5 flex justify-between">
              <dt className="text-slate-400">Emergency Contact Phone</dt>
              <dd className="font-semibold text-slate-900">{privateInfo?.emergencyContactPhone || 'Not specified'}</dd>
            </div>
          </dl>
        </Card>
      )}

      {activeTab === 'job' && (
        <Card title="Job & Employment Specifications">
          <dl className="divide-y divide-slate-100 text-xs max-w-2xl">
            <div className="py-2.5 flex justify-between">
              <dt className="text-slate-400">Employee ID</dt>
              <dd className="font-semibold font-mono text-indigo-700">{employee.employeeId}</dd>
            </div>
            <div className="py-2.5 flex justify-between">
              <dt className="text-slate-400">Department</dt>
              <dd className="font-semibold text-slate-900">{departmentName}</dd>
            </div>
            <div className="py-2.5 flex justify-between">
              <dt className="text-slate-400">Designation</dt>
              <dd className="font-semibold text-slate-900">{employee.designation}</dd>
            </div>
            <div className="py-2.5 flex justify-between">
              <dt className="text-slate-400">Manager</dt>
              <dd className="font-semibold text-slate-900">{managerName}</dd>
            </div>
            <div className="py-2.5 flex justify-between">
              <dt className="text-slate-400">Joining Date</dt>
              <dd className="font-semibold font-mono text-slate-900">{new Date(employee.joiningDate).toLocaleDateString()}</dd>
            </div>
            <div className="py-2.5 flex justify-between">
              <dt className="text-slate-400">Employment Status</dt>
              <dd><Badge variant="success" size="sm">{employee.employmentStatus}</Badge></dd>
            </div>
          </dl>
        </Card>
      )}

      {activeTab === 'documents' && (
        <Card title="Employee Documents">
          {documents.length === 0 ? (
            <EmptyState title="No documents uploaded" description="Your uploaded HR documents will appear here." />
          ) : (
            <div className="space-y-3">
              {documents.map((doc: any) => (
                <div key={doc.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-indigo-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">{doc.fileName}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-mono">{doc.documentType}</p>
                    </div>
                  </div>
                  <Badge variant="neutral" size="sm">Uploaded</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'salary' && (
        <Card title="Salary Structure (Read-Only)">
          {!salaryStructure ? (
            <EmptyState title="No active salary structure" description="Salary structure details will appear once assigned by HR." />
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                <Lock size={16} className="shrink-0" />
                <span>Salary information is read-only for employee accounts. Contact HR for queries.</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Basic Salary</span>
                  <span className="text-sm font-bold font-mono text-slate-900">₹{Number(salaryStructure.basicSalary).toLocaleString()}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">HRA</span>
                  <span className="text-sm font-bold font-mono text-slate-900">₹{Number(salaryStructure.hra).toLocaleString()}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Standard Allowance</span>
                  <span className="text-sm font-bold font-mono text-slate-900">₹{Number(salaryStructure.standardAllowance).toLocaleString()}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">PF Deduction</span>
                  <span className="text-sm font-bold font-mono text-rose-600">₹{Number(salaryStructure.providentFund).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Contact & Address Details"
        description="Update your phone number and address specifications."
        maxWidth="lg"
      >
        <form onSubmit={handleUpdateContactInfo} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              startIcon={<Phone size={16} />}
            />
            <Input
              label="Profile Picture URL"
              value={profilePictureUrl}
              onChange={(e) => setProfilePictureUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <Input
            label="Street Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Corporate Blvd"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} placeholder="San Francisco" />
            <Input label="State" value={state} onChange={(e) => setState(e.target.value)} placeholder="California" />
            <Input label="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="94105" />
            <Input label="Country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="United States" />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
            <strong className="text-slate-700">Note:</strong> Employee ID, Email, Department, Designation, Manager, and Employment Status are restricted and can only be modified by HR Administrators.
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" size="sm" type="button" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={saving}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
