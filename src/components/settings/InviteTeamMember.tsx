import React, { useState } from 'react';
import { UserPlus, Copy, Check } from 'lucide-react';
import { useTeamStore } from '../../store/teamStore';

export const InviteTeamMember = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { generateInviteCode, loading, error } = useTeamStore();

  const handleGenerateCode = async () => {
    setIsGenerating(true);
    try {
      const code = await generateInviteCode();
      setInviteCode(code);
    } catch (err) {
      console.error('Error generating invite code:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (inviteCode) {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Invite Team Member</h3>
          <p className="mt-1 text-sm text-gray-500">
            Generate an invitation code to share with your team member
          </p>
        </div>
        {!inviteCode && (
          <button
            onClick={handleGenerateCode}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Generate Invite Code
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {inviteCode && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Invitation Code:</p>
                <p className="mt-1 text-2xl font-mono font-bold text-blue-600">{inviteCode}</p>
              </div>
              <button
                onClick={copyToClipboard}
                className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Share this code with your team member. They will need to enter this code when signing up
            to join your organization.
          </p>
          <div className="flex justify-end">
            <button
              onClick={() => setInviteCode(null)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Generate New Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
};