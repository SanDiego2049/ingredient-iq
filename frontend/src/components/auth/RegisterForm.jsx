import { useState } from 'react'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import Button from '@/components/ui/Button'
import { signUp, signInWithGoogle } from '@/services/authService'

function RegisterForm({ onSuccess, onSwitchToLogin }) {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await signUp(email, password, displayName)
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError(null)
    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <p
          role="alert"
          className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2"
        >
          {error}
        </p>
      )}

      <div className="flex flex-col gap-1">
        <label
          htmlFor="register-name"
          className="text-sm font-medium text-gray-700"
        >
          Display Name
        </label>
        <div className="relative">
          <User
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            id="register-name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            placeholder="Your name"
            className="w-full rounded-xl border border-gray-200 py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="register-email"
          className="text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <div className="relative">
          <Mail
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full rounded-xl border border-gray-200 py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="register-password"
          className="text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="relative">
          <Lock
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            id="register-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            minLength={6}
            className="w-full rounded-xl border border-gray-200 py-2 pl-9 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <Button type="submit" disabled={loading} fullWidth>
        {loading ? 'Creating account...' : 'Create Account'}
      </Button>

      <div className="relative flex items-center gap-2">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <Button
        type="button"
        variant="secondary"
        onClick={handleGoogle}
        fullWidth
      >
        Continue with Google
      </Button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-green-600 font-medium hover:underline"
        >
          Sign in
        </button>
      </p>
      <p className="text-center text-xs text-gray-400">
        By creating an account you agree to our{' '}
        <a href="/terms" className="text-green-600 hover:underline">
          Terms and Conditions
        </a>{' '}
        and{' '}
        <a href="/privacy" className="text-green-600 hover:underline">
          Privacy Policy
        </a>
      </p>
    </form>
  )
}

export default RegisterForm
