import { useState } from "react"
import { 
  Activity,
  Users,
  Stethoscope,
  Calendar,
  User,
  BarChart3,
  FileText,
  Search,
  LogOut,
  Settings
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const mainItems = [
  { title: "Dashboard LEC", url: "/", icon: Activity },
  { title: "Lista de Espera Cirúrgica", url: "/lista-espera", icon: Calendar },
  { title: "Consulta Pública", url: "/consulta", icon: Search },
]

const catalogItems = [
  { title: "Pacientes", url: "/catalogo/pacientes", icon: Users },
  { title: "Especialidades", url: "/catalogo/especialidades", icon: Stethoscope },
  { title: "Procedimentos", url: "/catalogo/procedimentos", icon: Activity },
  { title: "Médicos", url: "/catalogo/medicos", icon: User },
]

// Temporariamente removido - será implementado futuramente
// const reportItems = [
//   { title: "Relatórios", url: "/relatorios", icon: BarChart3 },
//   { title: "Auditoria", url: "/auditoria", icon: FileText },
// ]

export function AppSidebar() {
  const { state, isMobile } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"

  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"

  return (
    <Sidebar 
      className={collapsed ? "w-14" : "w-60"} 
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-2">
          <Activity className="h-8 w-8 text-primary" />
          {!collapsed && (
            <div>
              <h2 className="font-bold text-lg text-primary">SGFC</h2>
              <p className="text-xs text-muted-foreground">HULW - Gestão Cirúrgica</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Menu Principal */}
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Catálogos */}
        <SidebarGroup>
          <SidebarGroupLabel>Catálogos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {catalogItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Relatórios - Temporariamente removido */}
        {/*
        <SidebarGroup>
          <SidebarGroupLabel>Relatórios</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {reportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        */}
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            {!collapsed && "Configurações"}
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Button variant="ghost" size="sm" className="w-full justify-start text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            {!collapsed && "Sair"}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}