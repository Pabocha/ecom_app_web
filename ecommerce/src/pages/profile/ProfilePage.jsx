import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useProfileForm, usePasswordForm, useAddresses } from '@/features/profile/hooks/useProfile';
import ProfileSidebar from '@/features/profile/components/ProfileSidebar';
import ProfileInfoForm from '@/features/profile/components/ProfileInfoForm';
import ProfilePasswordForm from '@/features/profile/components/ProfilePasswordForm';
import ProfileAddresses from '@/features/profile/components/ProfileAddresses';
import ProfileReviews from '@/features/profile/components/ProfileReviews';
import ProfileCoupons from '@/features/profile/components/ProfileCoupons';
import ProfileRecentViews from '@/features/profile/components/ProfileRecentViews';
import TopBar from '@/components/shared/TopBar';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('infos');

  const profileForm = useProfileForm(user);
  const passwordForm = usePasswordForm();
  // MODIFICATION ICI — Hook adresses pour le tab addresses
  const addressData = useAddresses();

  const { editing, setEditing, form, updateMutation } = profileForm;

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setEditing(false);
    passwordForm.setChangingPassword(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      <TopBar />

      <div className="max-w-[1300px] mx-auto px-4 pt-5 grid grid-cols-[380px_1fr] gap-5">
        <ProfileSidebar
          user={user}
          editing={editing}
          onToggleEdit={() => setEditing(!editing)}
          onLogout={() => { logout(); navigate('/'); }}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        <div className="space-y-4">
          {activeTab === 'infos' && (
            <>
              <ProfileInfoForm
                form={form}
                editing={editing}
                updateMutation={updateMutation}
                onInfoSubmit={(data) => updateMutation.mutate(data)}
              />
              <ProfilePasswordForm passwordForm={passwordForm} />
            </>
          )}
          {/* MODIFICATION ICI — Tab adresses */}
          {activeTab === 'addresses' && (
            <ProfileAddresses
              addresses={addressData.addresses}
              isLoading={addressData.isLoading}
              addMutation={addressData.addMutation}
              updateMutation={addressData.updateMutation}
              deleteMutation={addressData.deleteMutation}
            />
          )}
          {activeTab === 'reviews' && <ProfileReviews />}
          {activeTab === 'coupons' && <ProfileCoupons />}
          {activeTab === 'recent' && <ProfileRecentViews />}
        </div>
      </div>
    </div>
  );
}
