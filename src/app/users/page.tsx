'use client';

import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/modal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/lib/api';
import { User, isUserActive } from '@/types/user';
import { formatDate } from '@/lib/utils';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { Dropdown } from '@/components/ui/dropdown';

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordUser, setPasswordUser] = useState<User | null>(null);
  
  const queryClient = useQueryClient();
  
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: userApi.getAll,
  });

  const deleteUser = useMutation({
    mutationFn: userApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'SUPERADMIN':
        return 'danger';
      case 'ADMIN':
        return 'danger';
      case 'USER':
        return 'info';
      case 'COMPANY':
        return 'default';
      default:
        return 'default';
    }
  };

  // DataTable columns
  const columns: TableColumn<User>[] = [
    {
      name: 'User',
      selector: (row) => row.username,
      cell: (row) => (
        <div className="flex items-center gap-3 py-2">
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {(row.username)?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{row.username}</p>
            {/* <p className="text-xs text-gray-500 dark:text-gray-400">{row.email || 'N/A'}</p> */}
          </div>
        </div>
      ),
      // width: '250px',
      sortable: true,
    },
    {
      name: 'Role',
      selector: (row) => row.role_name || '',
      cell: (row) => (
        <Badge variant={getRoleBadgeVariant(row.role_name || '')} className="capitalize">
          {row.role_name || 'Unknown'}
        </Badge>
      ),
      // width: '120px',
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) => (isUserActive(row) ? 'Active' : 'Inactive'),
      cell: (row) => (
        <Badge variant={isUserActive(row) ? 'success' : 'default'}>
          {isUserActive(row) ? 'Active' : 'Inactive'}
        </Badge>
      ),
      // width: '100px',
    },
    {
      name: 'Active Until',
      selector: (row) => row.active_until?.toString() || '',
      cell: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {row.active_until ? new Date(row.active_until).toLocaleDateString() : 'Indefinite'}
        </span>
      ),
      // width: '130px',
      sortable: true,
    },
    {
      name: 'Created',
      selector: (row) => row.created_at?.toString() || '',
      cell: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {row.created_at ? new Date(row.created_at).toLocaleDateString() : 'N/A'}
        </span>
      ),
      // width: '120px',
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <Dropdown
          trigger={
            <button title='btnActions' className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 18a1 1 0 110-2 1 1 0 010 2zm0-7a1 1 0 110-2 1 1 0 010 2zm0-7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          }
          items={[
            {
              label: 'Edit',
              icon: <PencilIcon className="h-4 w-4" />,
              onClick: () => handleEditUser(row),
            },
            {
              label: 'Change Password',
              icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>,
              onClick: () => handleChangePassword(row),
            },
            {
              label: 'Delete',
              icon: <TrashIcon className="h-4 w-4" />,
              onClick: () => handleDeleteUser(row),
              danger: true,
            },
          ]}
        />
      ),
      // width: '100px',
    },
  ];

  const handleAddUser = () => {
    setEditingUser(null);
    setShowFormModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowFormModal(true);
  };

  const handleDeleteUser = (user: User) => {
    if (confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      deleteUser.mutate(user.id as string);
    }
  };

  const handleChangePassword = (user: User) => {
    setPasswordUser(user);
    setShowPasswordModal(true);
  };


  return (
    <div className="min-h-screen">
      <Header title="User Management" />

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Admins</p>
                  <p className="text-2xl font-bold text-red-600">
                    {users.filter((u) => u.role_name === 'SUPERADMIN').length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <span className="text-2xl">👑</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Operators</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {users.filter((u) => u.role_name === 'USER').length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <span className="text-2xl">⚙️</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
                  <p className="text-2xl font-bold text-green-600">
                    {users.filter((u) => isUserActive(u)).length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Input
            type="search"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
            className="w-64"
          />
          <Button className='bg-green-600 hover:bg-green-700 text-white' onClick={handleAddUser}>
            <PlusIcon className="h-5 w-5" />
            Add User
          </Button>
        </div>

        {/* Users table */}
        <Card>
          <div className="dark:bg-gray-800 rounded-lg">
            <DataTable
              columns={columns}
              data={filteredUsers}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[5, 10, 25, 50]}
              highlightOnHover
              pointerOnHover
              progressPending={isLoading}
              noDataComponent={<div className="p-12 text-center text-gray-500 dark:text-gray-400">No users found</div>}
              customStyles={{
                headRow: {
                  style: {
                    backgroundColor: '#f3f4f6',
                    color: '#6b7280',
                    fontSize: '14px',
                    fontWeight: '600',
                  },
                },
                rows: {
                  style: {
                    backgroundColor: '#ffffff',
                    color: '#1f2937',
                    borderColor: '#e5e7eb',
                    '&:hover': {
                      backgroundColor: '#f9fafb',
                    },
                  },
                  stripedStyle: {
                    backgroundColor: '#f9fafb',
                  },
                },
              }}
              theme="light"
            />
          </div>
        </Card>
      </div>

      {/* User Form Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title={editingUser ? 'Edit User' : 'Add New User'}
        size="lg"
      >
        <UserForm
          user={editingUser}
          onSubmit={() => {
            // After creating/updating, refresh list and close modal
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setShowFormModal(false);
          }}
          onCancel={() => setShowFormModal(false)}
        />
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title={`Change Password - ${passwordUser?.username}`}
        size="md"
      >
        {passwordUser && (
          <ChangePasswordForm
            userId={passwordUser.id as string}
            onSubmit={() => setShowPasswordModal(false)}
            onCancel={() => setShowPasswordModal(false)}
          />
        )}
      </Modal>
    </div>
  );
}

// User Form Component
interface UserFormProps {
  user?: User | null;
  onSubmit: () => void;
  onCancel: () => void;
}

function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const [username, setUsername] = useState(user?.username || '');
  // // // const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<string>(user?.role_id ? user.role_id.toString() : '2'); // Default to 'USER' role
  const [activeUntil, setActiveUntil] = useState<string>(
    user?.active_until ? new Date(user.active_until).toISOString().split('T')[0] : ''
  );
  const [error, setError] = useState<string>('');

  const queryClient = useQueryClient();

  const createUser = useMutation({
    mutationFn: (data: Partial<User>) => userApi.create(data),
    onSuccess: () => {
      setError('');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onSubmit();
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to create user. Please try again.';
      setError(errorMessage);
      console.error('Create user error:', err);
    },
  });

  const updateUser = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) => userApi.update(id as string, data),
    onSuccess: () => {
      setError('');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onSubmit();
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to update user. Please try again.';
      setError(errorMessage);
      console.error('Update user error:', err);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Partial<User> & { password?: string; role_id?: number; active_until?: string | null } = {
      username,
      // email,
      role_id: Number(role),
      active_until: activeUntil || null,
    };

    if (!user) {
      // include password for new user
      payload.password = password;
      createUser.mutate(payload as Partial<User>);
    } else {
      updateUser.mutate({ id: user.id as string, data: payload });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-sm">
          {error}
        </div>
      )}

      <Input label="Username" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
      {/* <Input label="Email" type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} /> */}
      {!user && (
        <Input label="Password" type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Role
        </label>
        <select
          title='Role'
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="1">SUPERADMIN</option>
          <option value="2">USER</option>
          <option value="3">COMPANY</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Active Until (Optional - leave empty for indefinite)
        </label>
        <Input
          type="date"
          value={activeUntil}
          onChange={(e) => setActiveUntil(e.target.value)}
          placeholder="Leave empty for indefinite access"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" disabled={createUser.isPending || updateUser.isPending}>
          {createUser.isPending || updateUser.isPending ? 'Saving...' : user ? 'Save Changes' : 'Create User'}
        </Button>
      </div>
    </form>
  );
}

// Change Password Form Component
interface ChangePasswordFormProps {
  userId: string;
  onSubmit: () => void;
  onCancel: () => void;
}

function ChangePasswordForm({ userId, onSubmit, onCancel }: ChangePasswordFormProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string>('');

  const queryClient = useQueryClient();

  const changePassword = useMutation({
    mutationFn: (password: string) => userApi.changePassword(userId, password),
    onSuccess: () => {
      setError('');
      setNewPassword('');
      setConfirmPassword('');
      onSubmit();
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to change password. Please try again.';
      setError(errorMessage);
      console.error('Change password error:', err);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    changePassword.mutate(newPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-sm">
          {error}
        </div>
      )}

      <Input
        label="New Password"
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" disabled={changePassword.isPending}>
          {changePassword.isPending ? 'Changing...' : 'Change Password'}
        </Button>
      </div>
    </form>
  );
}