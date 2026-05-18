import React, { useEffect, useState } from 'react'
import { Users, Trash2, Shield, Lock, CheckCircle, XCircle } from 'lucide-react'
import axios from 'axios'

export default function Admin() {
  const [users, setUsers] = useState([])
  const [pendingUsers, setPendingUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('approved')
  const token = localStorage.getItem('token')
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    loadUsers()
    loadPendingUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUsers(response.data)
    } catch (err) {
      setError('Failed to load users')
      console.error(err)
    }
  }

  const loadPendingUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/auth/pending-users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPendingUsers(response.data)
    } catch (err) {
      console.error('Failed to load pending users', err)
    } finally {
      setLoading(false)
    }
  }

  const approveUser = async (userId) => {
    try {
      await axios.post(
        `http://localhost:8000/api/auth/users/${userId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      loadUsers()
      loadPendingUsers()
      setError('')
    } catch (err) {
      setError('Failed to approve user')
    }
  }

  const rejectUser = async (userId) => {
    if (!window.confirm('Are you sure you want to reject this user?')) return

    try {
      await axios.post(
        `http://localhost:8000/api/auth/users/${userId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      loadUsers()
      loadPendingUsers()
      setError('')
    } catch (err) {
      setError('Failed to reject user')
    }
  }

  const updateRole = async (userId, newRole) => {
    try {
      await axios.post(
        `http://localhost:8000/api/auth/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      loadUsers()
    } catch (err) {
      setError('Failed to update role')
    }
  }

  const deactivateUser = async (userId) => {
    if (userId === currentUser.id) {
      setError('Cannot deactivate yourself')
      return
    }

    try {
      await axios.post(
        `http://localhost:8000/api/auth/users/${userId}/deactivate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      loadUsers()
    } catch (err) {
      setError('Failed to deactivate user')
    }
  }

  const activateUser = async (userId) => {
    try {
      await axios.post(
        `http://localhost:8000/api/auth/users/${userId}/activate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      loadUsers()
    } catch (err) {
      setError('Failed to activate user')
    }
  }

  const deleteUser = async (userId) => {
    if (userId === currentUser.id) {
      setError('Cannot delete yourself')
      return
    }

    if (!window.confirm('Are you sure you want to delete this user?')) return

    try {
      await axios.delete(
        `http://localhost:8000/api/auth/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      loadUsers()
    } catch (err) {
      setError('Failed to delete user')
    }
  }

  if (currentUser.role !== 'admin') {
    return (
      <div className="p-6">
        <div className="bg-red-900 bg-opacity-30 border border-red-700 rounded-lg p-6 text-center">
          <p className="text-red-400 font-semibold">Access Denied</p>
          <p className="text-red-300 text-sm mt-2">Only administrators can access this page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
        <p className="text-gray-400">Manage users and permissions</p>
      </div>

      {error && (
        <div className="bg-red-900 bg-opacity-30 border border-red-700 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 border-b border-dark-600">
        <button
          onClick={() => setActiveTab('approved')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'approved'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Approved Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'pending'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Pending Approval ({pendingUsers.length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading users...</p>
        </div>
      ) : (
        <>
          {/* Pending Users Tab */}
          {activeTab === 'pending' && (
            <div>
              {pendingUsers.length === 0 ? (
                <div className="bg-dark-700 border border-dark-600 rounded-lg p-8 text-center">
                  <p className="text-gray-400">No pending user approvals</p>
                </div>
              ) : (
                <div className="bg-dark-700 border border-dark-600 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-dark-800 border-b border-dark-600">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Username</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Full Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Registered</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-600">
                      {pendingUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-dark-600 transition-colors">
                          <td className="px-6 py-4 text-white font-medium">{user.username}</td>
                          <td className="px-6 py-4 text-gray-400 text-sm">{user.email}</td>
                          <td className="px-6 py-4 text-gray-400">{user.full_name || '-'}</td>
                          <td className="px-6 py-4 text-gray-400 text-sm">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 flex items-center gap-2">
                            <button
                              onClick={() => approveUser(user.id)}
                              className="p-2 hover:bg-green-900 hover:bg-opacity-30 rounded transition-colors text-green-400"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => rejectUser(user.id)}
                              className="p-2 hover:bg-red-900 hover:bg-opacity-30 rounded transition-colors text-red-400"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Approved Users Tab */}
          {activeTab === 'approved' && (
            <div className="bg-dark-700 border border-dark-600 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-dark-800 border-b border-dark-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Username</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Full Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-600">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-dark-600 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{user.username}</td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{user.email}</td>
                      <td className="px-6 py-4 text-gray-400">{user.full_name || '-'}</td>
                      <td className="px-6 py-4">
                        <select
                          value={user.role}
                          onChange={(e) => updateRole(user.id, e.target.value)}
                          disabled={user.id === currentUser.id}
                          className="bg-dark-800 border border-dark-600 rounded px-3 py-1 text-sm text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                        >
                          <option value="user">User</option>
                          <option value="operator">Operator</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.is_active
                            ? 'bg-green-900 bg-opacity-30 text-green-400'
                            : 'bg-red-900 bg-opacity-30 text-red-400'
                        }`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex items-center gap-2">
                        {user.id !== currentUser.id && (
                          <>
                            {user.is_active ? (
                              <button
                                onClick={() => deactivateUser(user.id)}
                                className="p-2 hover:bg-dark-600 rounded transition-colors text-yellow-400"
                                title="Deactivate"
                              >
                                <Lock className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => activateUser(user.id)}
                                className="p-2 hover:bg-dark-600 rounded transition-colors text-green-400"
                                title="Activate"
                              >
                                <Shield className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="p-2 hover:bg-dark-600 rounded transition-colors text-red-400"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
