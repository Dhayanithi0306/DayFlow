import React, { useState } from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { PageHeader } from '../common/PageHeader';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Tabs } from '../common/Tabs';
import { User, Phone, MapPin, Mail, Calendar, Briefcase, ShieldAlert, Edit2, FileText, Lock, DollarSign, Upload, Building } from 'lucide-react';

export const ProfileModule: React.FC = () => {
  const { currentUser, updateUserProfile, addToast } = useHRMS();
  const [activeTab, setActiveTab] = useState('resume');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit form state
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [emergencyName, setEmergencyName] = useState(currentUser?.emergencyContact?.name || '');
  const [emergencyRelation, setEmergencyRelation] = useState(currentUser?.emergencyContact?.relation || '');
  const [emergencyPhone, setEmergencyPhone] = useState(currentUser?.emergencyContact?.phone || '');

  // Password change state (Security Tab)
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const profileTabs = [
    { id: 'resume', label: 'Resume / Work Info', icon: <FileText className="h-4 w-4" /> },
    { id: 'private', label: 'Private Information', icon: <User className="h-4 w-4" /> },
    { id: 'payroll', label: 'Payroll & Salary Summary', icon: <DollarSign className="h-4 w-4" /> },
    { id: 'security', label: 'Security & Access', icon: <Lock className="h-4 w-4" /> },
  ];

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveLimitedProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      phone,
      address,
      avatar,
      emergencyContact: {
        name: emergencyName,
        relation: emergencyRelation,
        phone: emergencyPhone,
      },
    });
    setIsEditModalOpen(false);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      addToast('New passwords do not match.', 'error');
      return;
    }
    addToast('Password changed successfully!', 'success');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  const salary = currentUser?.salaryStructure || {
    basicSalary: 4500,
    hra: 1800,
    standardAllowance: 500,
    performanceBonus: 800,
    lta: 400,
    fixedAllowance: 600,
    pfDeduction: 540,
    taxDeduction: 260,
    netSalary: 7800,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Profile"
        subtitle="View your organizational details, private information, read-only payroll summary, and security settings."
        breadcrumbs={[{ label: 'Self Service' }, { label: 'Profile' }]}
        action={
          <Button variant="outline" onClick={() => setIsEditModalOpen(true)} icon={<Edit2 className="h-4 w-4" />}>
            Edit Limited Details
          </Button>
        }
      />

      {/* Header Profile Summary Card */}
      <Card>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="h-20 w-20 rounded-2xl object-cover ring-4 ring-indigo-50 shadow-md"
            />
            <div className="text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-extrabold text-slate-900">{currentUser?.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                  ID: {currentUser?.loginId || 'DAYSJ20230001'}
                </span>
              </div>
              <p className="text-xs font-semibold text-indigo-600">{currentUser?.designation}</p>
              <p className="text-xs text-slate-500">
                {currentUser?.department} • {currentUser?.companyName || 'Acme Global Inc.'}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 text-xs space-y-1 w-full md:w-auto">
            <div className="flex justify-between md:justify-start md:gap-4 text-slate-600">
              <span>Manager:</span>
              <span className="font-bold text-slate-900">{currentUser?.manager || 'Alex Morgan'}</span>
            </div>
            <div className="flex justify-between md:justify-start md:gap-4 text-slate-600">
              <span>Location:</span>
              <span className="font-bold text-slate-900">{currentUser?.location || 'San Francisco HQ'}</span>
            </div>
          </div>
        </div>

        {/* Navigation Section Tabs */}
        <div className="mt-6 border-t border-slate-100 pt-3">
          <Tabs tabs={profileTabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>
      </Card>

      {/* Tab Content Views */}
      {activeTab === 'resume' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
          <Card title="Work & Organizational Info">
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 text-indigo-500 shrink-0" />
                <div>
                  <span className="block text-slate-400 font-medium">Designation</span>
                  <span className="font-bold text-slate-900">{currentUser?.designation}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-indigo-500 shrink-0" />
                <div>
                  <span className="block text-slate-400 font-medium">Department</span>
                  <span className="font-bold text-slate-900">{currentUser?.department}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-indigo-500 shrink-0" />
                <div>
                  <span className="block text-slate-400 font-medium">Date of Joining</span>
                  <span className="font-bold text-slate-900">{currentUser?.joiningDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-indigo-500 shrink-0" />
                <div>
                  <span className="block text-slate-400 font-medium">Work Email</span>
                  <span className="font-bold text-slate-900">{currentUser?.email}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Contact & Emergency Info">
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-emerald-500 shrink-0" />
                <div>
                  <span className="block text-slate-400 font-medium">Phone Number</span>
                  <span className="font-bold text-slate-900">{currentUser?.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-emerald-500 shrink-0" />
                <div>
                  <span className="block text-slate-400 font-medium">Residential Address</span>
                  <span className="font-bold text-slate-900">{currentUser?.address}</span>
                </div>
              </div>

              {currentUser?.emergencyContact && (
                <div className="pt-3 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 text-xs mb-2 flex items-center gap-1.5 text-rose-600">
                    <ShieldAlert className="h-4 w-4" /> Emergency Contact
                  </h4>
                  <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100 space-y-1">
                    <p className="font-bold text-slate-900">
                      {currentUser.emergencyContact.name}{' '}
                      <span className="text-slate-500 font-normal">({currentUser.emergencyContact.relation})</span>
                    </p>
                    <p className="font-mono text-slate-700">{currentUser.emergencyContact.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'private' && (
        <Card title="Private Personal Information" className="animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Date of Birth</span>
              <p className="font-bold text-slate-900">{currentUser?.privateInfo?.dob || '1992-06-14'}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Gender</span>
              <p className="font-bold text-slate-900">{currentUser?.privateInfo?.gender || 'Female'}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Marital Status</span>
              <p className="font-bold text-slate-900">{currentUser?.privateInfo?.maritalStatus || 'Married'}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Nationality</span>
              <p className="font-bold text-slate-900">{currentUser?.privateInfo?.nationality || 'American'}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Passport / National ID</span>
              <p className="font-mono font-bold text-slate-900">{currentUser?.privateInfo?.passportNo || 'A98210492'}</p>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'payroll' && (
        <Card title="Salary Breakdown Summary (Read-Only)" className="animate-in fade-in">
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Monthly Net Pay</span>
                <div className="text-3xl font-extrabold text-emerald-400 mt-0.5">${salary.netSalary.toLocaleString()}</div>
              </div>
              <span className="px-3 py-1 bg-slate-800 rounded-xl border border-slate-700 text-slate-300 font-medium">
                Structure set by HR Admin
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2">
                <h4 className="font-bold text-emerald-900 border-b border-emerald-200 pb-1">Earnings Component</h4>
                <div className="flex justify-between text-slate-700">
                  <span>Basic Salary:</span>
                  <span className="font-bold">${salary.basicSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>House Rent Allowance (HRA):</span>
                  <span className="font-bold">${salary.hra.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Standard Allowance:</span>
                  <span className="font-bold">${salary.standardAllowance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Performance Bonus:</span>
                  <span className="font-bold">${salary.performanceBonus.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Leave Travel Allowance (LTA):</span>
                  <span className="font-bold">${salary.lta.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 space-y-2">
                <h4 className="font-bold text-rose-900 border-b border-rose-200 pb-1">Deductions Component</h4>
                <div className="flex justify-between text-slate-700">
                  <span>Provident Fund (PF):</span>
                  <span className="font-bold">${salary.pfDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Professional Tax:</span>
                  <span className="font-bold">${salary.taxDeduction.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'security' && (
        <Card title="Security & Access Settings" className="animate-in fade-in">
          <div className="space-y-6 text-xs max-w-md">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Your System Login ID</span>
              <p className="font-mono font-black text-indigo-700 text-base">{currentUser?.loginId}</p>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Change Permanent Password</h4>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <Button variant="primary" type="submit">
                Update Password
              </Button>
            </form>
          </div>
        </Card>
      )}

      {/* Edit Limited Info Modal (Phone, Address, Profile Picture) */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Limited Profile Details"
        subtitle="You may update your phone number, address, and avatar image."
      >
        <form onSubmit={handleSaveLimitedProfile} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Profile Avatar Image</label>
            <div className="flex items-center gap-3">
              <img src={avatar || currentUser?.avatar} alt="Preview" className="h-12 w-12 rounded-xl object-cover" />
              <label className="p-2 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 flex items-center gap-1.5 font-medium text-slate-700">
                <Upload className="h-4 w-4 text-indigo-500" /> Upload New Photo
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </label>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Residential Address</label>
            <textarea
              rows={2}
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h4 className="font-bold text-slate-900 mb-2">Emergency Contact</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1">Contact Name</label>
                <input
                  type="text"
                  required
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Relationship</label>
                <input
                  type="text"
                  required
                  value={emergencyRelation}
                  onChange={(e) => setEmergencyRelation(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-slate-600 mb-1">Emergency Phone</label>
              <input
                type="text"
                required
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="secondary" type="button" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
