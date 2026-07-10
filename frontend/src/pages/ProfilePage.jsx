import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, LogOut, User, Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import Modal from '@/components/ui/Modal'
import { useAuthStore } from '@/store/authStore'
import { useAuth } from '@/hooks/useAuth'
import { signOut, deleteAccount } from '@/services/authService'
import { clearGuestScans } from '@/utils/localStorage'

function ProfilePage() {
  const navigate = useNavigate()
  const { user, session } = useAuthStore()
  const { loading } = useAuth()
  const [signingOut, setSigningOut] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await signOut()
      navigate('/')
    } catch (err) {
      console.error(err)
    } finally {
      setSigningOut(false)
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true)
    setDeleteError(null)
    try {
      await deleteAccount(session.access_token)
      await signOut()
      clearGuestScans()
      navigate('/')
    } catch (err) {
      setDeleteError(err.message)
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 bg-white border-b border-gray-100">
        <button
          onClick={() => navigate('/')}
          aria-label="Go back"
          className="text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="font-bold text-gray-800 text-lg">Profile</h1>
      </div>

      <div className="flex flex-col gap-4 px-4 py-6 max-w-lg mx-auto w-full">
        {/* User info */}
        <div className="flex items-center gap-4 rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
            <User size={24} className="text-green-600" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-800">
              {user?.user_metadata?.full_name ?? 'User'}
            </span>
            <span className="text-sm text-gray-400">{user?.email}</span>
          </div>
        </div>

        {/* Legal links */}
        <div className="flex gap-4 px-1">
          <a
            href="/privacy"
            className="text-xs text-gray-400 hover:text-green-600"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="text-xs text-gray-400 hover:text-green-600"
          >
            Terms and Conditions
          </a>
        </div>

        {/* Sign out */}
        <Button
          variant="secondary"
          onClick={handleSignOut}
          disabled={signingOut}
          fullWidth
        >
          <LogOut size={16} className="mr-2" aria-hidden="true" />
          {signingOut ? 'Signing out...' : 'Sign Out'}
        </Button>

        {/* Delete account */}
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
          <h3 className="font-medium text-red-700 mb-1">Danger Zone</h3>
          <p className="text-xs text-red-500 mb-3">
            Permanently delete your account and all scan history. This action
            cannot be undone.
          </p>
          {deleteError && (
            <p className="text-xs text-red-600 mb-3">{deleteError}</p>
          )}
          <Button
            variant="danger"
            onClick={() => setShowDeleteModal(true)}
            fullWidth
          >
            <Trash2 size={16} className="mr-2" aria-hidden="true" />
            Delete Account
          </Button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to permanently delete your account? This will
            delete all your scan history and cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              disabled={deleting}
              fullWidth
            >
              {deleting ? 'Deleting...' : 'Delete Forever'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ProfilePage
