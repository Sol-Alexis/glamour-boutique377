import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import './Auth.css';

// Import icons
import VisibleIcon from '../assets/visible.png';
import InvisibleIcon from '../assets/invisible.png';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Now expects (email, password)
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'password') {
      setErrors((prev) => ({
        ...prev,
        password: value.length < 6 ? 'Password must be at least 6 characters' : '',
      }));
    }

    if (name === 'confirmPassword') {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: value !== formData.password ? 'Passwords do not match' : '',
      }));
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address to receive a reset link.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Reset Link Sent',
      description: `We've sent a recovery email to ${formData.email}`,
    });

    setTimeout(() => {
      setIsForgotPassword(false);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validation
    const isMissingFields = isLogin 
      ? !formData.email || !formData.password 
      : !formData.email || !formData.password || !formData.firstName || !formData.lastName;

    if (isMissingFields) {
      toast({ title: 'Missing Information', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }

    if (!isLogin && errors.confirmPassword) {
      toast({ title: 'Check Passwords', description: 'Your passwords do not match.', variant: 'destructive' });
      return;
    }

    // 2. Logic for SIGN UP
    if (!isLogin) {
      const storedUsers = JSON.parse(localStorage.getItem('glamour_users') || '[]');
      
      // Check if user already exists
      if (storedUsers.some((u: any) => u.email === formData.email)) {
        toast({ title: 'Registration Failed', description: 'Email already exists.', variant: 'destructive' });
        return;
      }

      // Save new user to "Database"
      const newUser = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password, // Storing for future login checks
      };
      
      localStorage.setItem('glamour_users', JSON.stringify([...storedUsers, newUser]));
      
      // Automatically log them in after signup
      login(formData.email, formData.password);
      
      toast({ title: 'Account created!', description: 'Welcome to Glamour Boutique.' });
      setTimeout(() => { navigate('/'); }, 600);
    } 
    
    // 3. Logic for LOG IN
    else {
      const success = login(formData.email, formData.password);

      if (success) {
        toast({ title: 'Welcome back!', description: 'Successfully logged in.' });
        setTimeout(() => { navigate('/'); }, 600);
      } else {
        toast({
          title: 'Login Failed',
          description: 'Incorrect email or password. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <Layout>
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-heading">
            {isForgotPassword ? "Reset Password" : "Glamour Boutique"}
          </h1>

          {!isForgotPassword ? (
            <>
              <div className="auth-toggle">
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`auth-toggle-btn ${isLogin ? 'active' : ''}`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`auth-toggle-btn ${!isLogin ? 'active' : ''}`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="auth-form">
                {!isLogin && (
                  <div className="auth-field-grid">
                    <div className="auth-field">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="auth-input"
                      />
                    </div>
                    <div className="auth-field">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="auth-input"
                      />
                    </div>
                  </div>
                )}

                <div className="auth-field">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="auth-input"
                  />
                </div>

                <div className="auth-field">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative-container">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter Password"
                      className="auth-input pr-24"
                    />
                    <div className="auth-action-group">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="auth-eye-btn"
                      >
                        <img
                          src={showPassword ? VisibleIcon : InvisibleIcon}
                          alt="toggle"
                          className="auth-eye-icon-small"
                        />
                      </button>
                      <button type="submit" className="auth-input-arrow">
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                  {errors.password && <p className="error-text text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                {!isLogin && (
                  <div className="auth-field">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative-container">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Re-Enter Password"
                        className="auth-input pr-24"
                      />
                      <div className="auth-action-group">
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="auth-eye-btn"
                        >
                          <img
                            src={showConfirmPassword ? VisibleIcon : InvisibleIcon}
                            alt="toggle"
                            className="auth-eye-icon-small"
                          />
                        </button>
                        <button type="submit" className="auth-input-arrow">
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                    {errors.confirmPassword && <p className="error-text text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>
                )}

                <Button type="submit" variant="default" className="auth-button bg-black text-white hover:bg-gray-800 h-12 mt-4">
                  {isLogin ? 'Log In' : 'Create Account'}
                </Button>

                {isLogin && (
                  <div className="auth-forgot">
                    <button 
                      type="button" 
                      className="auth-link text-xs underline mt-2" 
                      onClick={() => setIsForgotPassword(true)}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </form>
            </>
          ) : (
            <form onSubmit={handleForgotPassword} className="auth-form">
              <p className="auth-description text-center text-gray-500 text-sm mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <div className="auth-field">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="auth-input"
                />
              </div>
              <Button type="submit" className="auth-button w-full bg-black text-white h-12 mt-4">
                Send Reset Link
              </Button>
              <div className="auth-forgot text-center mt-4">
                <button 
                  type="button" 
                  className="auth-link text-xs underline" 
                  onClick={() => setIsForgotPassword(false)}
                >
                  Back to Log In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Auth;