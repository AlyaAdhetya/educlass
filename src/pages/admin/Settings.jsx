import React from 'react';
import { useDataStore } from '../../store/dataStore';
import { Settings, Save, Globe, Shield, Bell, Database } from 'lucide-react';

export default function AdminSettings() {
  const { systemSettings, updateSystemSettings } = useDataStore();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Platform Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Configure global application preferences and maintenance modes.</p>
        </div>
        
        <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-xs">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* SIDEBAR NAVIGATION (3 Cols) */}
        <div className="lg:col-span-3 space-y-2">
          <button className="w-full text-left px-4 py-3 bg-indigo-50 text-indigo-700 font-bold rounded-xl flex items-center gap-3">
            <Globe className="w-4 h-4" /> General
          </button>
          <button className="w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-50 font-bold rounded-xl transition-colors flex items-center gap-3">
            <Shield className="w-4 h-4 text-slate-400" /> Security
          </button>
          <button className="w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-50 font-bold rounded-xl transition-colors flex items-center gap-3">
            <Bell className="w-4 h-4 text-slate-400" /> Notifications
          </button>
          <button className="w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-50 font-bold rounded-xl transition-colors flex items-center gap-3">
            <Database className="w-4 h-4 text-slate-400" /> Data Backup
          </button>
        </div>

        {/* SETTINGS FORM (9 Cols) */}
        <div className="lg:col-span-9 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 space-y-6">
            
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-slate-900">General Settings</h2>
              <p className="text-xs text-slate-500 mt-1">Basic information and configuration for the learning platform.</p>
            </div>

            <div className="space-y-4 max-w-2xl">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Platform Name</label>
                <input 
                  type="text" 
                  defaultValue={systemSettings.platformName}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Academic Year / Semester</label>
                <input 
                  type="text" 
                  defaultValue={systemSettings.semester}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in mt-0.5">
                    <input 
                      type="checkbox" 
                      defaultChecked={systemSettings.maintenanceMode}
                      className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"
                      style={{ right: systemSettings.maintenanceMode ? '0' : '1.25rem', borderColor: systemSettings.maintenanceMode ? '#6366f1' : '#cbd5e1' }}
                    />
                    <div className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${systemSettings.maintenanceMode ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Maintenance Mode</p>
                    <p className="text-xs text-slate-500">When enabled, students will not be able to access the platform. Only administrators can log in.</p>
                  </div>
                </label>
              </div>

              <div>
                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in mt-0.5">
                    <input 
                      type="checkbox" 
                      defaultChecked={systemSettings.allowRegistration}
                      className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"
                      style={{ right: systemSettings.allowRegistration ? '0' : '1.25rem', borderColor: systemSettings.allowRegistration ? '#6366f1' : '#cbd5e1' }}
                    />
                    <div className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${systemSettings.allowRegistration ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Allow Registration</p>
                    <p className="text-xs text-slate-500">Enable or disable new student registrations from the login page.</p>
                  </div>
                </label>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
