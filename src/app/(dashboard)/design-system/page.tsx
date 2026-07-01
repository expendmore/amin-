"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import DashboardShell from "@/components/navigation/DashboardShell";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import Divider from "@/components/ui/Divider";
import Tabs from "@/components/ui/Tabs";
import Accordion from "@/components/ui/Accordion";
import Progress from "@/components/ui/Progress";
import Skeleton from "@/components/ui/Skeleton";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Spinner from "@/components/ui/Spinner";
import OTPInput from "@/components/ui/OTPInput";
import ThemeSwitch from "@/components/ui/ThemeSwitch";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Pagination from "@/components/ui/Pagination";
import Popover from "@/components/ui/Popover";
import RightPanel from "@/components/ui/RightPanel";
import PageHeader from "@/components/ui/PageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/Drawer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { useToast } from "@/store/use-toast";
import {
  Sparkles,
  BarChart2,
  CheckCircle,
  Mail,
  Search,
  AlertCircle,
  Phone,
  FileText,
  Sliders,
  HelpCircle,
  Menu,
} from "lucide-react";

// Form validation schema using Zod
const sandboxSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Phone number must be at least 10 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type SandboxFormValues = z.infer<typeof sandboxSchema>;

export default function DesignSystemCatalogPage() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState("buttons");
  const [otpVal, setOtpVal] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  // Zod form initialization
  const form = useForm<SandboxFormValues>({
    resolver: zodResolver(sandboxSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = (data: SandboxFormValues) => {
    addToast("Form validated successfully! Check console for inputs.", "success");
    console.log("Validated Form Data: ", data);
  };

  const sampleAccordionItems = [
    {
      id: "item-1",
      title: "What is ExpendMore?",
      content:
        "ExpendMore is an enterprise-grade automation workspace integrating multiple LLM providers and WhatsApp cloud routing tools.",
    },
    {
      id: "item-2",
      title: "How do I trigger workflows?",
      content:
        "You can configure triggers in the Workflow Builder Studio based on inbound WhatsApp messages, webhooks, or scheduled cron routines.",
    },
  ];

  const sampleTableData = [
    { id: "WS-101", user: "Arjun Sharma", channel: "WhatsApp API", usage: "1,240 tokens", status: "Active" },
    { id: "WS-102", user: "Sarah Connor", channel: "Web Console", usage: "3,892 tokens", status: "Active" },
    { id: "WS-103", user: "David Miller", channel: "API Gateway", usage: "482 tokens", status: "Inactive" },
  ];

  const breadcrumbItems = [
    { label: "Home", href: "/dashboard" },
    { label: "Design System Workspace", href: "/design-system" },
    { label: "Active Showcase Catalog" },
  ];

  return (
    <DashboardShell>
      <div className="p-6 md:p-8 max-w-[1280px] mx-auto w-full flex flex-col gap-6 pb-24 md:pb-8">
        
        {/* Header Title */}
        <div className="border-b border-brand-border dark:border-border pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-navy dark:text-foreground">
              ExpendMore Design System
            </h2>
            <p className="text-sm text-on-surface-variant dark:text-foreground/70 mt-1 font-medium">
              Interactive showcase verifying Stitch visual tokens, responsive components, and core layout states.
            </p>
          </div>
          {/* Theme Switcher component */}
          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs font-semibold text-brand-navy dark:text-foreground/80">Theme:</span>
            <ThemeSwitch />
          </div>
        </div>

        {/* Breadcrumb test */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Catalog Navigation Tabs */}
        <Tabs
          tabs={[
            { id: "buttons", label: "Buttons & Badges", icon: <Sparkles className="h-3.5 w-3.5" /> },
            { id: "inputs", label: "Form Inputs", icon: <Mail className="h-3.5 w-3.5" /> },
            { id: "overlays", label: "Overlays & Dialogs", icon: <Sliders className="h-3.5 w-3.5" /> },
            { id: "data", label: "Data & Tables", icon: <BarChart2 className="h-3.5 w-3.5" /> },
            { id: "states", label: "System States", icon: <CheckCircle className="h-3.5 w-3.5" /> },
          ]}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id)}
          variant="pill"
          className="max-w-xl"
        />

        {/* Tab content wrappers */}
        <div className="mt-2 flex flex-col gap-8">
          
          {/* TAB A: Buttons & Badges */}
          {activeTab === "buttons" && (
            <div className="flex flex-col gap-6">
              
              {/* Button Variants Section */}
              <Card className="p-6 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-brand-navy dark:text-foreground border-b border-brand-border dark:border-border pb-2">Button Variants</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary Navy</Button>
                  <Button variant="secondary">Secondary Outline</Button>
                  <Button variant="outline">Border Outline</Button>
                  <Button variant="success">Success Green</Button>
                  <Button variant="ai" leftIcon={<Sparkles className="h-4 w-4" />}>AI Action</Button>
                  <Button variant="destructive">Destructive Red</Button>
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="link">Link Button</Button>
                </div>
              </Card>

              {/* Button Sizes & Loading */}
              <Card className="p-6 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-brand-navy dark:text-foreground border-b border-brand-border dark:border-border pb-2">Button Sizing & Tactile Press Scale</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="xs" variant="primary">XS Size</Button>
                  <Button size="sm" variant="primary">SM Size</Button>
                  <Button size="md" variant="primary">MD (Default)</Button>
                  <Button size="lg" variant="primary">LG Size</Button>
                  <Button size="xl" variant="primary">XL Size</Button>
                  <Button size="lg" isLoading variant="primary">Loading Spinner</Button>
                  <Button size="md" disabled variant="primary">Disabled State</Button>
                </div>
              </Card>

              {/* Icon Only Buttons */}
              <Card className="p-6 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-brand-navy dark:text-foreground border-b border-brand-border dark:border-border pb-2">Icon-Only Buttons (Square)</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="xs" isIconOnly variant="outline"><Sliders className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" isIconOnly variant="outline"><Sliders className="h-4 w-4" /></Button>
                  <Button size="md" isIconOnly variant="primary"><Sliders className="h-4 w-4" /></Button>
                  <Button size="lg" isIconOnly variant="success"><Sliders className="h-5 w-5" /></Button>
                  <Button size="xl" isIconOnly variant="ai"><Sliders className="h-6 w-6" /></Button>
                </div>
              </Card>

              {/* Badges Variants */}
              <Card className="p-6 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-brand-navy dark:text-foreground border-b border-brand-border dark:border-border pb-2">Pill Badges</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="danger">Danger</Badge>
                  <Badge variant="info">Info</Badge>
                  <Badge variant="ai">AI Badge</Badge>
                </div>
              </Card>
            </div>
          )}

          {/* TAB B: Form Inputs */}
          {activeTab === "inputs" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              
              {/* Input Types Showcase */}
              <Card className="p-6 flex flex-col gap-5">
                <h3 className="text-sm font-bold text-brand-navy dark:text-foreground border-b border-brand-border dark:border-border pb-2">Input Elements</h3>
                
                <Input type="text" label="Standard Text Input" placeholder="Type alphanumeric..." />
                
                <Input type="password" label="Password Input with Toggle" placeholder="••••••••" />
                
                <Input type="search" label="Standard Search Input" placeholder="Search resources..." />
                
                <Input type="search" isAi label="AI Smart Search" placeholder="Ask AI anything..." />

                <div className="grid grid-cols-2 gap-4">
                  <Input type="email" label="Email Field" placeholder="user@expendmore.ai" startIcon={<Mail className="h-4 w-4" />} />
                  <Input type="tel" label="Phone Field" placeholder="+1 (555) 000-0000" startIcon={<Phone className="h-4 w-4" />} />
                </div>

                <Textarea label="Textarea Component" placeholder="Enter multiline text comments..." />

                <div className="flex flex-col gap-1.5 items-center">
                  <label className="text-xs font-semibold text-brand-navy dark:text-foreground self-start">OTP Verification Code Input (6-digit)</label>
                  <OTPInput value={otpVal} onChange={setOtpVal} length={6} />
                </div>
              </Card>

              {/* Zod + React Hook Form Sandbox */}
              <Card className="p-6 flex flex-col gap-5">
                <h3 className="text-sm font-bold text-brand-navy dark:text-foreground border-b border-brand-border dark:border-border pb-2">Active Form Validation (Zod + Hook Form)</h3>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Arjun Sharma" {...field} />
                          </FormControl>
                          <FormDescription>Please provide your workspace user identifier.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="arjun@expendmore.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 9999988888" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Request Message</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Describe the workspace automated task..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2 justify-end pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => form.reset()}
                      >
                        Reset Form
                      </Button>
                      <Button type="submit" variant="success">
                        Validate & Submit
                      </Button>
                    </div>
                  </form>
                </Form>
              </Card>
            </div>
          )}

          {/* TAB C: Overlays & Dialogs */}
          {activeTab === "overlays" && (
            <div className="flex flex-col gap-6">
              
              {/* Overlay launchers grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Popovers & Dropdowns */}
                <Card className="p-6 flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-brand-navy dark:text-foreground border-b border-brand-border dark:border-border pb-2">Popover & Dropdown Triggers</h3>
                  
                  <div className="flex flex-wrap gap-4 items-center">
                    
                    {/* Reusable Popover */}
                    <Popover
                      trigger={<Button variant="outline">Open Popover Tool</Button>}
                      align="center"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 font-bold text-brand-navy dark:text-foreground text-sm">
                          <HelpCircle className="h-4.5 w-4.5 text-brand-sky" />
                          <span>AI Workspace Help</span>
                        </div>
                        <p className="text-xs text-on-surface-variant">
                          Clicking outside or tapping the <kbd className="bg-brand-slate px-1 border rounded text-[10px]">ESC</kbd> key closes this popover widget.
                        </p>
                      </div>
                    </Popover>

                    {/* Reusable DropdownMenu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="primary">Toggle Menu</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Workspace Commands</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => addToast("Opened document...", "info")}>
                          <FileText className="mr-2 h-4 w-4" />
                          <span>Open Document</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => addToast("Syncing database...", "info")}>
                          <Sliders className="mr-2 h-4 w-4" />
                          <span>Configure Sync</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => addToast("Archived account...", "warning")}>
                          <span>Archive Workspace</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                  </div>
                </Card>

                {/* Sliding Drawers */}
                <Card className="p-6 flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-brand-navy dark:text-foreground border-b border-brand-border dark:border-border pb-2">Accessible Sliding Drawers</h3>
                  
                  <div className="flex flex-wrap gap-3">
                    
                    {/* Drawer launcher */}
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button variant="secondary">Slide Drawer Right</Button>
                      </DrawerTrigger>
                      <DrawerContent side="right">
                        <DrawerHeader>
                          <DrawerTitle>System Configurations</DrawerTitle>
                          <DrawerDescription>Configure multi-provider tokens and WhatsApp webhook parameters.</DrawerDescription>
                        </DrawerHeader>
                        <div className="space-y-4 py-4">
                          <p className="text-xs md:text-sm text-on-surface-variant">
                            This panel is locked using Radix UI Dialog focus trapping. Tapping outside or the close icon releases scroll boundaries.
                          </p>
                          <Input label="Webhook URL" placeholder="https://api.expendmore.com/v1/webhook" />
                          <Input label="Secret Key" type="password" placeholder="••••••••••••••" />
                        </div>
                        <DrawerFooter>
                          <Button variant="outline" onClick={() => addToast("Settings cancelled", "info")}>Cancel</Button>
                          <Button variant="primary" onClick={() => addToast("Settings saved!", "success")}>Save Config</Button>
                        </DrawerFooter>
                      </DrawerContent>
                    </Drawer>

                    {/* Bottom drawer launcher */}
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button variant="outline">Slide Drawer Bottom</Button>
                      </DrawerTrigger>
                      <DrawerContent side="bottom">
                        <DrawerHeader>
                          <DrawerTitle>Automated Insights Summary</DrawerTitle>
                          <DrawerDescription>Summary of recent AI processing events.</DrawerDescription>
                        </DrawerHeader>
                        <div className="py-6 flex flex-col items-center justify-center gap-3">
                          <CheckCircle className="h-10 w-10 text-brand-green" />
                          <p className="text-sm text-brand-navy dark:text-foreground font-semibold">All pipelines are active with zero latency spikes detected.</p>
                        </div>
                      </DrawerContent>
                    </Drawer>

                    {/* Right Panel inspector launcher */}
                    <Button variant="ai" onClick={() => setIsInspectorOpen(true)}>Open Details Inspector</Button>

                  </div>
                </Card>
              </div>

              {/* Toast Launcher triggers */}
              <Card className="p-6 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-brand-navy dark:text-foreground border-b border-brand-border dark:border-border pb-2">Exit-Animated Toast Notifications</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" onClick={() => addToast("This is a standard info toast notice.", "info")}>
                    Info Toast
                  </Button>
                  <Button variant="success" onClick={() => addToast("Your dashboard pipeline was compiled safely.", "success")}>
                    Success Toast
                  </Button>
                  <Button variant="outline" className="border-amber-500 text-amber-500 hover:bg-amber-50" onClick={() => addToast("Alert: Daily credits usage exceeded 85%.", "warning")}>
                    Warning Toast
                  </Button>
                  <Button variant="destructive" onClick={() => addToast("Failed to establish webhook broker links.", "error")}>
                    Error Toast
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* TAB D: Data & Tables */}
          {activeTab === "data" && (
            <div className="flex flex-col gap-6">
              
              {/* Responsive custom horizontal Table */}
              <Card className="p-6 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-brand-navy dark:text-foreground border-b border-brand-border dark:border-border pb-2">Horizontal Separator Data Table</h3>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Instance Code</TableHead>
                      <TableHead>User Account</TableHead>
                      <TableHead>Channel Adapter</TableHead>
                      <TableHead>Compute Tokens</TableHead>
                      <TableHead className="text-right">Link Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleTableData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-mono text-xs">{row.id}</TableCell>
                        <TableCell className="font-semibold">{row.user}</TableCell>
                        <TableCell>{row.channel}</TableCell>
                        <TableCell>{row.usage}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={row.status === "Active" ? "success" : "secondary"}>
                            {row.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination component test */}
                <div className="mt-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={5}
                    onPageChange={(page) => {
                      setCurrentPage(page);
                      addToast(`Selected page: ${page}`, "info");
                    }}
                  />
                </div>
              </Card>
            </div>
          )}

          {/* TAB E: System States */}
          {activeTab === "states" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              {/* Skeletons & Spinners */}
              <Card className="p-6 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-brand-navy dark:text-foreground border-b border-brand-border dark:border-border pb-2">Spinner & Skeleton Indicators</h3>
                
                <div className="flex items-center gap-6 py-2">
                  <Spinner size="sm" variant="sky" />
                  <Spinner size="md" variant="navy" />
                  <Spinner size="lg" variant="green" />
                </div>
                
                <div className="flex flex-col gap-2 mt-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-2 w-5/6" />
                </div>
              </Card>

              {/* Alerts Banners */}
              <Card className="p-6 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-brand-navy dark:text-foreground border-b border-brand-border dark:border-border pb-2">Alert Banners</h3>
                <div className="flex flex-col gap-3">
                  <Alert variant="info" title="Information Notice" onClose={() => {}}>
                    System models integration validated. API latencies remain under 120ms.
                  </Alert>
                  <Alert variant="success" title="Workflow Action Success">
                    WhatsApp confirmation message triggered and pushed safely to client.
                  </Alert>
                  <Alert variant="warning" title="Quota Check Warning">
                    Usage tokens consumed reached 85% of total Pro tier daily allocations.
                  </Alert>
                  <Alert variant="error" title="Outbound Sync Failure">
                    Stripe checkout webhook integration failed with status error 500.
                  </Alert>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Slide-out details inspector */}
      <RightPanel
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        title="Automated Pipeline Details"
        subtitle="Diagnostic analysis logs from LLM gateway routes"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsInspectorOpen(false)}>Close</Button>
            <Button variant="success" size="sm" onClick={() => { addToast("Pipeline diagnostic re-run successfully!", "success"); setIsInspectorOpen(false); }}>Re-run Test</Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4 text-xs md:text-sm">
          <div className="flex flex-col gap-1 border-b border-brand-border dark:border-border/50 pb-3">
            <span className="font-bold text-brand-navy dark:text-foreground uppercase tracking-wider text-[10px]">API Router Gateway</span>
            <span className="font-mono text-on-surface-variant">https://api.expendmore.com/v1/chat</span>
          </div>
          <p className="leading-relaxed text-on-surface-variant/95">
            The multi-provider LLM coordinator lazily loads groq and deepseek adapters, fallback routing queries on timeout triggers. Latencies are recorded under 124ms.
          </p>
        </div>
      </RightPanel>
    </DashboardShell>
  );
}
