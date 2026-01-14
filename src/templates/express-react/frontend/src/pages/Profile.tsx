import { useAuth } from '../hooks/useAuth';

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Profile</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Account Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <div className="text-lg">{user.name || 'Not set'}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="text-lg">{user.email}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Member Since
              </label>
              <div className="text-lg">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Actions</h3>
          <div className="space-y-3">
            <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Edit Profile
            </button>
            <button className="w-full sm:w-auto px-4 py-2 ml-0 sm:ml-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

