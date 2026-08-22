import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_EMPLOYEE_PROFILE } from '../../data/mockProfile';
import type { EmployeeProfile } from '../../data/mockProfile';
import { 
  User, Mail, Phone, MapPin, Briefcase, Building2, 
  Calendar, FileText, Download, CheckCircle2,
  Camera, X, File, FileCode2, Edit3, Shield, Clock
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const EmployeeProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Local state to simulate updates
  const [profile, setProfile] = useState<EmployeeProfile>(MOCK_EMPLOYEE_PROFILE);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    phone: profile.phone,
    address: profile.address,
    profilePicture: profile.profilePicture
  });
  const [successMessage, setSuccessMessage] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  const getFileIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'PDF': return <FileText className="w-5 h-5 text-red-500" />;
      case 'JPG': case 'PNG': return <File className="w-5 h-5 text-blue-500" />;
      default: return <FileCode2 className="w-5 h-5 text-slate-500" />;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, profilePicture: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Validate
    if (!editForm.phone.trim() || !editForm.address.trim()) {
      alert('Phone and address are required.');
      return;
    }
    
    // Update local state
    setProfile(prev => ({
      ...prev,
      phone: editForm.phone,
      address: editForm.address,
      profilePicture: editForm.profilePicture
    }));
    
    setIsEditModalOpen(false);
    setSuccessMessage('Profile updated successfully.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Sync edit form with profile when modal opens
  const openModal = () => {
    setEditForm({
      phone: profile.phone,
      address: profile.address,
      profilePicture: profile.profilePicture
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg flex items-center shadow-sm">
          <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-600" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row justify-between sm:items-end -mt-12 sm:-mt-16 mb-4 sm:mb-0 gap-4">
            <div className="flex items-end space-x-5">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-white p-1 shadow-lg shrink-0 ring-4 ring-white">
                {profile.profilePicture ? (
                  <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="w-full h-full bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-4xl sm:text-5xl font-bold text-indigo-700">
                      {currentUser?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
              </div>
              <div className="pb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {currentUser?.name || `${profile.firstName} ${profile.lastName}`}
                </h1>
                <div className="flex items-center text-slate-500 mt-1">
                  <Briefcase className="w-4 h-4 mr-1.5" />
                  <span className="font-medium">{profile.designation}</span>
                  <span className="mx-2">•</span>
                  <span className="text-sm bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold border border-indigo-100">
                    {profile.id}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="pb-2">
              <Button onClick={openModal} className="w-full sm:w-auto shadow-sm">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Department</p>
              <p className="font-semibold text-slate-900">{profile.department}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {profile.status}
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
              <p className="font-medium text-slate-600 truncate">{currentUser?.email || profile.email}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</p>
              <p className="font-medium text-slate-600">{profile.phone}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Personal Information */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-slate-900">Personal Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center">
                    <User className="w-3 h-3 mr-1" /> Full Name
                  </p>
                  <p className="font-medium text-slate-900">{currentUser?.name || `${profile.firstName} ${profile.lastName}`}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center">
                    <Shield className="w-3 h-3 mr-1" /> Employee ID
                  </p>
                  <p className="font-medium text-slate-900">{profile.id}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center">
                    <Mail className="w-3 h-3 mr-1" /> Email Address
                  </p>
                  <p className="font-medium text-slate-900">{currentUser?.email || profile.email}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center">
                    <Phone className="w-3 h-3 mr-1" /> Phone Number
                  </p>
                  <p className="font-medium text-slate-900">{profile.phone}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" /> Address
                  </p>
                  <p className="font-medium text-slate-900">{profile.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Job Information */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="font-bold text-slate-900">Job Information</h2>
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md flex items-center">
                <Shield className="w-3 h-3 mr-1" /> Read Only
              </span>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center">
                    <Building2 className="w-3 h-3 mr-1" /> Department
                  </p>
                  <p className="font-medium text-slate-900">{profile.department}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center">
                    <Briefcase className="w-3 h-3 mr-1" /> Designation
                  </p>
                  <p className="font-medium text-slate-900">{profile.designation}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" /> Joining Date
                  </p>
                  <p className="font-medium text-slate-900">{profile.joiningDate}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> Employment Type
                  </p>
                  <p className="font-medium text-slate-900">{profile.employmentType}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center">
                    <User className="w-3 h-3 mr-1" /> Reporting Manager
                  </p>
                  <p className="font-medium text-slate-900">{profile.reportingManager}</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Salary Structure */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="font-bold text-slate-900">Salary Structure</h2>
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md flex items-center">
                <Shield className="w-3 h-3 mr-1" /> Read Only
              </span>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm font-medium text-slate-600">Basic Salary</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(profile.salary.basic, profile.salary.currency)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm font-medium text-slate-600">Allowances</span>
                  <span className="font-semibold text-emerald-600">+{formatCurrency(profile.salary.allowances, profile.salary.currency)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm font-medium text-slate-600">Deductions</span>
                  <span className="font-semibold text-red-600">-{formatCurrency(profile.salary.deductions, profile.salary.currency)}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-bold text-slate-900">Gross Salary</span>
                  <span className="font-bold text-slate-900">{formatCurrency(profile.salary.gross, profile.salary.currency)}</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100 flex justify-between items-center">
                <span className="font-bold text-indigo-900">Net Salary</span>
                <span className="text-lg font-black text-indigo-700">{formatCurrency(profile.salary.net, profile.salary.currency)}</span>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-slate-900">Documents</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {profile.documents.length > 0 ? (
                profile.documents.map(doc => (
                  <div key={doc.id} className="p-4 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                        {getFileIcon(doc.type)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{doc.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">Uploaded on {doc.uploadDate}</p>
                      </div>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500">
                  <FileText className="w-8 h-8 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm font-medium">No documents uploaded.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 sm:p-6">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-slate-900 text-lg">Edit Profile</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="space-y-6">
                
                {/* Profile Picture Upload */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Profile Picture</label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                      {editForm.profilePicture ? (
                        <img src={editForm.profilePicture} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-8 h-8 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        accept="image/jpeg,image/png,image/jpg" 
                        className="hidden"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()}
                        className="text-sm"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Change Photo
                      </Button>
                      <p className="text-xs text-slate-500 mt-2">JPG or PNG up to 5MB.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  {/* Non-editable fields for context */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Employee ID</label>
                      <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed">
                        {profile.id}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                      <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed truncate">
                        {currentUser?.email || profile.email}
                      </div>
                    </div>
                  </div>

                  <Input 
                    label="Phone Number" 
                    value={editForm.phone} 
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    placeholder="+1 (555) 000-0000"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
                    <textarea 
                      value={editForm.address}
                      onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-shadow resize-none"
                      placeholder="Enter your full address"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
