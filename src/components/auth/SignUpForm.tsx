import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogIn, Mail, Lock, Building2, Key } from 'lucide-react';
import { GradientBackground } from './GradientBackground';

export const SignUpForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    companyName: '',
    inviteCode: ''
  });
  const { signUp, loading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password, companyName, inviteCode } = formData;
    await signUp(email, password, companyName, inviteCode);
  };

  return (
    <GradientBackground>
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="auth-card max-w-md w-full space-y-8 p-8">
          <div>
            <div className="flex justify-center">
              <LogIn className="h-12 w-12 text-indigo-400" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-300">
              Already have an account?{' '}
              <Link to="/signin" className="font-medium text-indigo-400 hover:text-indigo-300">
                Sign in
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-500/10 border border-red-500/20 p-4">
                <div className="text-sm text-red-400">{error}</div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="auth-input"
                    placeholder="Email address"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="auth-input"
                    placeholder="Password"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="inviteCode" className="sr-only">
                  Invitation Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="inviteCode"
                    type="text"
                    value={formData.inviteCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, inviteCode: e.target.value }))}
                    className="auth-input"
                    placeholder="Invitation Code (if joining an organization)"
                  />
                </div>
              </div>

              {!formData.inviteCode && (
                <div>
                  <label htmlFor="company" className="sr-only">
                    Company Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="company"
                      type="text"
                      required={!formData.inviteCode}
                      value={formData.companyName}
                      onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                      className="auth-input"
                      placeholder="Company Name (if creating new organization)"
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="auth-button"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </GradientBackground>
  );
};