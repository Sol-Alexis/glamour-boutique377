import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { User, Shield, Moon, Sun, Check, X, Eye, EyeOff, ArrowRight, Bell, BellOff } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const { user, updateUser, isDarkMode, toggleDarkMode } = useAuth();
  
  // Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(user?.name || "");
  const [message, setMessage] = useState("");
  
  // Security Visibility States
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Notification State
  const [notifsEnabled, setNotifsEnabled] = useState(true);

  const handleSaveName = () => {
    updateUser(tempName);
    setIsEditing(false);
    showStatus("Identity Updated");
  };

  const showStatus = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <Layout>
      <div className="settings-container animate-in fade-in duration-700">
        <h1 className="settings-title">Account Settings</h1>
        
        {message && <div className="toast-message">{message}</div>}

        <div className="settings-card">
          
          {/* IDENTITY SECTION */}
          <section className="settings-section">
            <div className="section-header">
              <User size={18} strokeWidth={1.5} />
              <h3>Identity</h3>
            </div>
            <div className="section-content">
              {isEditing ? (
                <div className="edit-group">
                  <input 
                    type="text" 
                    className="settings-input" 
                    value={tempName} 
                    onChange={(e) => setTempName(e.target.value)} 
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button className="icon-btn save" onClick={handleSaveName}><Check size={16}/></button>
                    <button className="icon-btn cancel" onClick={() => setIsEditing(false)}><X size={16}/></button>
                  </div>
                </div>
              ) : (
                <div className="display-group">
                  <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                    <div>
                      <p className="user-label">Full Name</p>
                      <p className="user-value">{user?.name || "Member"}</p>
                    </div>
                    <button className="text-link" onClick={() => setIsEditing(true)}>Modify</button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* PREFERENCES SECTION */}
          <section className="settings-section">
            <div className="section-header">
              <Sun size={18} strokeWidth={1.5} />
              <h3>Preferences</h3>
            </div>
            
            <div className="setting-row">
              <div className="flex items-center gap-3">
                {isDarkMode ? <Moon size={16}/> : <Sun size={16}/>}
                <span>Dark Mode</span>
              </div>
              <button className={`switch ${isDarkMode ? 'active' : ''}`} onClick={toggleDarkMode}>
                <div className="handle" />
              </button>
            </div>

            <div className="setting-row">
              <div className="flex items-center gap-3">
                {notifsEnabled ? <Bell size={16}/> : <BellOff size={16}/>}
                <span>Push Notifications</span>
              </div>
              <button className={`switch ${notifsEnabled ? 'active' : ''}`} onClick={() => setNotifsEnabled(!notifsEnabled)}>
                <div className="handle" />
              </button>
            </div>
          </section>

          {/* SECURITY SECTION */}
          <section className="settings-section">
            <div className="section-header">
              <Shield size={18} strokeWidth={1.5} />
              <h3>Security</h3>
            </div>
            
            <div className="password-flow space-y-4">
              <div className="luxury-input-group">
                <input 
                  type={showCurrent ? "text" : "password"} 
                  placeholder="Current Password" 
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)}>
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="luxury-input-group">
                <input 
                  type={showNew ? "text" : "password"} 
                  placeholder="New Password" 
                />
                <button type="button" onClick={() => setShowNew(!showNew)}>
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="luxury-input-group">
                <input 
                  type={showConfirm ? "text" : "password"} 
                  placeholder="Confirm New Password" 
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <button className="submit-password-btn group" onClick={() => showStatus("Security Updated")}>
                <span>Change Password</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
              </button>
            </div>
          </section>

        </div>
      </div>
    </Layout>
  );
};

export default Settings;