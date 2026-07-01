"use client";

import React, { useMemo, useState } from "react";
import { useMicrosoft365 } from "@/store/use-microsoft-365";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import {
  Folder,
  File,
  FileText,
  Image as ImageIcon,
  Video as VideoIcon,
  Search,
  Upload,
  Download,
  Star,
  ChevronRight,
  Trash2,
  HardDrive
} from "lucide-react";

export default function OneDrivePage() {
  const { addToast } = useToast();
  const {
    activeAccountId,
    accounts,
    onedriveFiles,
    onedriveFolders,
    uploadFile,
    deleteFile,
    toggleStarFile
  } = useMicrosoft365();

  const [activeTab, setActiveTab] = useState<"mydrive" | "shared">("mydrive");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFileId, setSelectedFileId] = useState<string | null>("od-file-1");

  // Upload simulation
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const activeAccObj = useMemo(() => {
    return accounts.find(a => a.id === activeAccountId) || null;
  }, [accounts, activeAccountId]);

  // Compute lists
  const currentFolders = useMemo(() => {
    const list = onedriveFolders[activeAccountId] || [];
    return list.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesParent = f.parentFolderId === selectedFolderId;
      return matchesSearch && matchesParent;
    });
  }, [onedriveFolders, activeAccountId, selectedFolderId, searchQuery]);

  const currentFiles = useMemo(() => {
    const list = onedriveFiles[activeAccountId] || [];
    return list.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
      let matchesTab = true;
      if (activeTab === "shared") matchesTab = f.isShared;
      const matchesParent = f.parentFolderId === selectedFolderId;
      return matchesSearch && matchesTab && matchesParent;
    });
  }, [onedriveFiles, activeAccountId, selectedFolderId, activeTab, searchQuery]);

  const activeFile = useMemo(() => {
    const list = onedriveFiles[activeAccountId] || [];
    return list.find(f => f.id === selectedFileId) || null;
  }, [onedriveFiles, activeAccountId, selectedFileId]);

  const currentFolderPath = useMemo(() => {
    if (!selectedFolderId) return [];
    const list = onedriveFolders[activeAccountId] || [];
    const path = [];
    let current = list.find(f => f.id === selectedFolderId);
    while (current) {
      path.unshift(current);
      current = list.find(f => f.id === current?.parentFolderId);
    }
    return path;
  }, [onedriveFolders, activeAccountId, selectedFolderId]);

  const handleSimulatedUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            uploadFile(
              `Uploaded Invoice_${Math.floor(1000 + Math.random()*9000)}.xlsx`,
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              "85 KB",
              selectedFolderId
            );
            addToast("Uploaded transaction spreadsheet row into OneDrive folder.", "success");
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const getFileIcon = (mime?: string) => {
    if (!mime) return <File className="h-5.5 w-5.5 text-slate-400" />;
    if (mime.includes("sheet")) return <FileText className="h-5.5 w-5.5 text-emerald-500" />;
    if (mime.includes("document")) return <FileText className="h-5.5 w-5.5 text-blue-500" />;
    if (mime.includes("presentation")) return <ImageIcon className="h-5.5 w-5.5 text-[#D83B01]" />;
    return <File className="h-5.5 w-5.5 text-slate-400" />;
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            OneDrive Explorer
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Browse files and directories tree, run simulated uploads, and download backup archives.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isUploading ? (
            <div className="flex items-center gap-3 px-4 py-2 border rounded-xl bg-white text-xs font-semibold text-brand-navy border-brand-border">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
              <span>Uploading {uploadProgress}%</span>
            </div>
          ) : (
            <Button
              variant="success"
              size="sm"
              onClick={handleSimulatedUpload}
              className="font-bold"
              leftIcon={<Upload className="h-4 w-4 text-white" />}
            >
              Upload OneDrive File
            </Button>
          )}
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-brand-border dark:border-zinc-800/80 gap-6">
        {(["mydrive", "shared"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSelectedFolderId(null);
              setSelectedFileId(null);
            }}
            className={`pb-3 text-xs font-bold capitalize select-none cursor-pointer border-b-2 transition-all duration-150 ${
              activeTab === tab
                ? "border-brand-navy text-brand-navy dark:text-foreground dark:border-white"
                : "border-transparent text-on-surface-variant/70 hover:text-brand-navy"
            }`}
          >
            {tab === "mydrive" ? "Files" : "Shared"}
          </button>
        ))}
      </div>

      {/* Breadcrumb Path navigation */}
      {activeTab === "mydrive" && (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant">
          <button
            onClick={() => setSelectedFolderId(null)}
            className="hover:text-brand-navy hover:underline cursor-pointer"
          >
            Root OneDrive
          </button>
          {currentFolderPath.map((folder) => (
            <React.Fragment key={folder.id}>
              <ChevronRight className="h-3.5 w-3.5 text-on-surface-variant/40 shrink-0" />
              <button
                onClick={() => setSelectedFolderId(folder.id)}
                className="hover:text-brand-navy hover:underline cursor-pointer"
              >
                {folder.name}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* OneDrive list view */}
        <Card className="lg:col-span-8 border-brand-border bg-white dark:bg-zinc-950 flex flex-col overflow-hidden">
          {/* Search bar */}
          <div className="p-3 border-b border-brand-border flex items-center gap-2">
            <Search className="h-4 w-4 text-on-surface-variant shrink-0" />
            <input
              type="text"
              placeholder="Search files and folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none text-xs focus:outline-none text-brand-navy dark:text-foreground font-semibold placeholder:text-on-surface-variant/50"
            />
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-brand-border dark:divide-zinc-800 max-h-[500px]">
            {/* Folders Section */}
            {activeTab === "mydrive" && currentFolders.length > 0 && (
              <div className="p-4 flex flex-col gap-2 text-left">
                <span className="text-[9px] font-bold text-on-surface-variant/50 uppercase tracking-wider block">
                  Folders
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentFolders.map((fld) => (
                    <div
                      key={fld.id}
                      onClick={() => setSelectedFolderId(fld.id)}
                      className="p-3 border border-brand-border hover:border-brand-navy/60 hover:bg-brand-slate/40 dark:border-zinc-800 dark:hover:bg-zinc-900/40 rounded-xl flex items-center gap-3 cursor-pointer transition-all text-left"
                    >
                      <Folder className="h-5 w-5 text-brand-sky shrink-0 fill-brand-sky/10" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                          {fld.name}
                        </span>
                        <span className="text-[10px] text-on-surface-variant/80 font-medium">
                          {fld.size}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Files List Section */}
            <div className="p-4 flex flex-col gap-2 text-left">
              <span className="text-[9px] font-bold text-on-surface-variant/50 uppercase tracking-wider block">
                Files
              </span>

              {currentFiles.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {currentFiles.map((file) => {
                    const isSelected = file.id === selectedFileId;
                    return (
                      <div
                        key={file.id}
                        onClick={() => setSelectedFileId(file.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition-all ${
                          isSelected
                            ? "border-brand-navy bg-brand-slate/60 dark:border-white dark:bg-zinc-900/60 shadow-sm"
                            : "border-brand-border dark:border-zinc-800 hover:border-brand-navy/40 bg-white dark:bg-zinc-950"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {getFileIcon(file.mimeType)}
                          <div className="flex flex-col min-w-0 text-left">
                            <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                              {file.name}
                            </span>
                            <span className="text-[10px] text-on-surface-variant/80 font-semibold">
                              Modified {new Date(file.lastModifiedDateTime).toLocaleDateString()} • {file.size}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {file.starred && (
                            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                          )}
                          {file.isShared && (
                            <span className="text-[9px] bg-slate-100 dark:bg-zinc-800 text-on-surface-variant px-1.5 py-0.5 rounded shrink-0 font-bold">
                              Shared
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <span className="text-xs text-on-surface-variant/80 text-center py-8 font-medium block">
                  No files found inside this folder path.
                </span>
              )}
            </div>
          </div>
        </Card>

        {/* Detailed preview panel */}
        <Card className="lg:col-span-4 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col justify-between gap-4 text-left">
          {activeFile ? (
            <div className="flex flex-col gap-4 h-full">
              <div className="flex flex-col gap-3 text-left">
                <div className="flex items-center gap-2 pb-2 border-b border-brand-border">
                  {getFileIcon(activeFile.mimeType)}
                  <h3 className="font-bold text-xs text-brand-navy dark:text-foreground line-clamp-2">
                    {activeFile.name}
                  </h3>
                </div>

                <div className="flex flex-col gap-2 text-[11px] font-semibold text-on-surface-variant">
                  <div className="flex justify-between">
                    <span>Creator</span>
                    <span className="text-brand-navy dark:text-foreground truncate max-w-[120px] font-bold">
                      {activeFile.createdBy}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Modified</span>
                    <span className="text-brand-navy dark:text-foreground font-bold">
                      {new Date(activeFile.lastModifiedDateTime).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>File Size</span>
                    <span className="text-brand-navy dark:text-foreground font-bold">
                      {activeFile.size}
                    </span>
                  </div>
                </div>
              </div>

              {activeFile.isShared && (
                <div className="flex flex-col gap-1.5 border-t border-brand-border pt-3 text-left">
                  <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider block">
                    Shared Access
                  </span>
                  <div className="flex flex-col gap-1">
                    {activeFile.sharedWithEmails.map((email, idx) => (
                      <span key={idx} className="text-[10px] text-brand-navy dark:text-foreground font-bold truncate">
                        • {email}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto border-t border-brand-border pt-4 flex gap-2.5">
                <a
                  href={activeFile.webUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1"
                >
                  <Button
                    variant="success"
                    size="sm"
                    className="w-full font-bold text-xs text-white"
                    leftIcon={<Download className="h-4 w-4 text-white" />}
                  >
                    Download File
                  </Button>
                </a>
                <button
                  onClick={() => toggleStarFile(activeFile.id)}
                  className="h-9 w-9 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-amber-500 cursor-pointer"
                >
                  <Star className={`h-4.5 w-4.5 ${activeFile.starred ? "text-amber-500 fill-amber-500" : ""}`} />
                </button>
                <button
                  onClick={() => {
                    deleteFile(activeFile.id);
                    addToast("File deleted", "warning");
                    setSelectedFileId(null);
                  }}
                  className="h-9 w-9 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-error cursor-pointer"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 gap-2 h-full">
              <HardDrive className="h-10 w-10 text-on-surface-variant/40" />
              <span className="text-xs text-on-surface-variant/80 font-semibold">
                Select a file to preview properties.
              </span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
