import * as React from "react"
import { GithubIcon, Home, Library, Plus, } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { t } = useTranslation();
    const location = useLocation();
    return (
        <Sidebar
            collapsible="icon"
            className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
            {...props}
        >
            <Sidebar
                collapsible="none"
                className="border-r pt-4"
            >
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent className="px-1.5 md:px-0">
                            <SidebarMenu className="gap-4 overflow-hidden">
                                <SidebarMenuItem className="mb-2">
                                    <Link className="flex items-center gap-2.5" to="/">
                                        <img className="h-8" src="/quizzz.png" alt="Logo" />
                                        <span className="font-semibold text-2xl leading-0.5">Quizzz</span>
                                    </Link>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton className="bg-primary hover:bg-primary/90" asChild>
                                        <Link to="/create">
                                            <Plus strokeWidth={3} />
                                            <span className="font-medium">{t("sidebar.create")}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem >
                                    <SidebarMenuButton asChild>
                                        <Link className={location.pathname === "/" ? "bg-neutral-800 border" : ""} to="/">
                                            <Home />
                                            <span className="font-medium">{t("sidebar.home")}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link className={location.pathname === "/library" ? "bg-neutral-800 border" : ""} to="/library">
                                            <Library />
                                            <span className="font-medium">{t("sidebar.library")}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter className="px-0">
                    <SidebarGroup >
                        <SidebarGroupContent className="px-1.5 md:px-0">
                            <SidebarMenu className="gap-4 justify-between">
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to="https://github.com/mukhammedali-akhmet/quizzz">
                                            <GithubIcon />
                                            <span className="font-medium">GitHub</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarFooter>
            </Sidebar>
            <SidebarRail />
        </Sidebar>
    )
}
