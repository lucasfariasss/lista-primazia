import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { UserProfile } from "@/types/sgfc"

interface MainLayoutProps {
  children: React.ReactNode;
  user?: UserProfile;
}

export function MainLayout({ children, user }: MainLayoutProps) {
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-gradient-light">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 bg-white border-b border-border flex items-center px-6 shadow-card-medical">
            <SidebarTrigger />
            
            <div className="flex-1" />
            
            {/* User info */}
            {user && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </header>

          {/* Main content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}