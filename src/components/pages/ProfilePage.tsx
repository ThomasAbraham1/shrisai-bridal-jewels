import { useMember } from '@/integrations';
import { MemberProtectedRoute } from '@/components/ui/member-protected-route';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, User, Calendar, LogOut } from 'lucide-react';

function ProfilePageContent() {
  const { member, actions } = useMember();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-8">
              {/* Profile Photo */}
              <div className="flex-shrink-0">
                {member?.profile?.photo?.url ? (
                  <Image
                    src={member.profile.photo.url}
                    width={120}
                    height={120}
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                    alt={member?.profile?.nickname || 'Profile'}
                    originWidth={member.profile.photo.width || 200}
                    originHeight={member.profile.photo.height || 200}
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary">
                    <User className="w-16 h-16 text-primary" />
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-2">
                  {member?.profile?.nickname || member?.contact?.firstName || 'Member'}
                </h1>
                {member?.profile?.title && (
                  <p className="font-paragraph text-lg text-foreground/70 mb-4">
                    {member.profile.title}
                  </p>
                )}
                <p className="font-paragraph text-sm text-foreground/60">
                  Member since {member?._createdDate ? new Date(member._createdDate).toLocaleDateString() : 'Recently'}
                </p>
              </div>
            </div>

            {/* Profile Details */}
            <div className="border-t border-primary/10 pt-8">
              <h2 className="font-heading text-2xl text-foreground mb-6">Account Information</h2>
              
              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-paragraph text-sm text-foreground/60">Email Address</p>
                    <p className="font-paragraph text-base text-foreground">{member?.loginEmail || 'Not provided'}</p>
                    {member?.loginEmailVerified && (
                      <p className="font-paragraph text-xs text-green-600 mt-1">✓ Verified</p>
                    )}
                  </div>
                </div>

                {/* Name */}
                {(member?.contact?.firstName || member?.contact?.lastName) && (
                  <div className="flex items-start gap-4">
                    <User className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-paragraph text-sm text-foreground/60">Full Name</p>
                      <p className="font-paragraph text-base text-foreground">
                        {[member?.contact?.firstName, member?.contact?.lastName].filter(Boolean).join(' ')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Phone */}
                {member?.contact?.phones && member.contact.phones.length > 0 && (
                  <div className="flex items-start gap-4">
                    <User className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-paragraph text-sm text-foreground/60">Phone</p>
                      <p className="font-paragraph text-base text-foreground">{member.contact.phones[0]}</p>
                    </div>
                  </div>
                )}

                {/* Member Status */}
                <div className="flex items-start gap-4">
                  <User className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-paragraph text-sm text-foreground/60">Status</p>
                    <p className="font-paragraph text-base text-foreground capitalize">
                      {member?.status || 'Active'}
                    </p>
                  </div>
                </div>

                {/* Last Login */}
                {member?.lastLoginDate && (
                  <div className="flex items-start gap-4">
                    <Calendar className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-paragraph text-sm text-foreground/60">Last Login</p>
                      <p className="font-paragraph text-base text-foreground">
                        {new Date(member.lastLoginDate).toLocaleDateString()} at {new Date(member.lastLoginDate).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Logout Button */}
            <div className="border-t border-primary/10 pt-8 mt-8">
              <button
                onClick={actions.logout}
                className="flex items-center gap-2 px-6 py-3 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors font-paragraph font-bold uppercase text-sm tracking-wider"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <MemberProtectedRoute messageToSignIn="Sign in to view your profile">
      <ProfilePageContent />
    </MemberProtectedRoute>
  );
}
