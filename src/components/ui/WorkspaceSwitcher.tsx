"use client";

import React, { useState, useEffect } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Check, Briefcase, User } from "lucide-react";
import { useToast } from "@/store/use-toast";
import { useAuth } from "@/components/providers/auth-provider";
import { useWorkspace } from "@/store/use-workspace";
import { switchWorkspace } from "@/app/actions/tenant";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase-client";

interface WorkspaceItem {
  id: string;
  name: string;
}

export function WorkspaceSwitcher({ isCollapsed }: { isCollapsed?: boolean }) {
  const { addToast } = useToast();
  const { user } = useAuth();
  
  const { 
    activeWorkspaceId, 
    setActiveWorkspaceId, 
    workspaces, 
    setWorkspaces 
  } = useWorkspace();

  const [activeWorkspaceName, setActiveWorkspaceName] = useState("Loading...");

  // Load user's workspaces from Firestore
  useEffect(() => {
    if (!user) return;

    async function loadWorkspaces() {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const workspaceIds: string[] = userData.workspaceIds || [];
          
          const loadedWorkspaces: WorkspaceItem[] = [];

          for (const wsId of workspaceIds) {
            const wsDocRef = doc(db, "workspaces", wsId);
            const wsDocSnap = await getDoc(wsDocRef);
            if (wsDocSnap.exists()) {
              const wsData = wsDocSnap.data();
              loadedWorkspaces.push({
                id: wsId,
                name: wsData.name || "Untitled Workspace",
              });
            }
          }

          setWorkspaces(loadedWorkspaces);

          // Determine initial active workspace
          const initialActiveId = activeWorkspaceId || userData.activeWorkspaceId || workspaceIds[0];
          if (initialActiveId) {
            setActiveWorkspaceId(initialActiveId);
            const activeWS = loadedWorkspaces.find(w => w.id === initialActiveId);
            if (activeWS) {
              setActiveWorkspaceName(activeWS.name);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load workspaces from Firestore:", err);
        setActiveWorkspaceName("Personal Workspace");
      }
    }

    loadWorkspaces();
  }, [user, activeWorkspaceId, setActiveWorkspaceId, setWorkspaces]);

  const handleSelect = async (ws: WorkspaceItem) => {
    setActiveWorkspaceId(ws.id);
    setActiveWorkspaceName(ws.name);

    try {
      const result = await switchWorkspace(ws.id);
      if (result.error) {
        addToast(result.error, "error");
      } else {
        addToast(`Switched workspace to: ${ws.name}`, "success");
      }
    } catch (err: any) {
      addToast("Failed to switch workspace.", "error");
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={`flex items-center justify-between w-full p-2 bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.06] rounded-xl text-left transition-all duration-150 focus:outline-none select-none ${
            isCollapsed ? "justify-center h-10 w-10 p-0" : ""
          }`}
          aria-label="Workspace Switcher Menu"
        >
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shrink-0">
              <Briefcase className="h-3.5 w-3.5" />
            </span>
            {!isCollapsed && (
              <span className="text-xs font-semibold text-slate-300 truncate max-w-[120px]">
                {activeWorkspaceName}
              </span>
            )}
          </div>
          {!isCollapsed && <ChevronDown className="h-4 w-4 text-slate-500 shrink-0 ml-2" />}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[200px] p-1 bg-slate-900 border border-white/[0.08] rounded-xl shadow-xl animate-zoom-in"
          sideOffset={8}
          align="start"
        >
          {workspaces.map((ws) => {
            const isSelected = activeWorkspaceId === ws.id;

            return (
              <DropdownMenu.Item
                key={ws.id}
                onClick={() => handleSelect(ws)}
                className="flex items-center justify-between px-3 py-2 text-xs rounded-lg hover:bg-white/[0.04] text-slate-200 focus:bg-white/[0.04] cursor-pointer focus:outline-none"
              >
                <div className="flex items-center gap-2 font-medium">
                  <Briefcase className="h-4 w-4 text-slate-500 shrink-0" />
                  <span>{ws.name}</span>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
export default WorkspaceSwitcher;
