import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import { useUiStore } from '@/store/uiStore'

function AuthModal() {
  const [mode, setMode] = useState('login')
  const { isAuthModalOpen, closeAuthModal } = useUiStore()

  function handleSuccess() {
    closeAuthModal()
  }

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      title={mode === 'login' ? 'Sign In' : 'Create Account'}
    >
      {mode === 'login' ? (
        <LoginForm
          onSuccess={handleSuccess}
          onSwitchToRegister={() => setMode('register')}
        />
      ) : (
        <RegisterForm
          onSuccess={handleSuccess}
          onSwitchToLogin={() => setMode('login')}
        />
      )}
    </Modal>
  )
}

export default AuthModal
