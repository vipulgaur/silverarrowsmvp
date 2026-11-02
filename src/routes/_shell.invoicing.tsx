import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMe } from "@/lib/store";
import { generateInvoiceFromUnbilled, can } from "@/lib/logic";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Receipt,
  CreditCard,
  IndianRupee,
  Download,
  CheckCircle2,
  Clock,
  FileText,
  Layers,
  Wallet,
  Building2,
} from "lucide-react";

export const Route = createFileRoute("/_shell/invoicing")({
  component: InvoicingPage,
});

function formatInr(amount: number) {
  return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function InvoicingPage() {
  const { data, me, update, log } = useMe();
  const [activeTab, setActiveTab] = useState<"queue" | "invoices" | "customers" | "pricelists">("queue");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("all");
  const [topUpAmount, setTopUpAmount] = useState<string>("50000");

  const isBillingAdmin = can.manageInvoicing(me.role);

  const customers = useMemo(() => {
    const list = data.customers ?? [];
    if (isBillingAdmin) return list;
    return list.filter((c) => c.userId === me.id);
  }, [data.customers, me.id, isBillingAdmin]);

  const unbilledActivities = useMemo(() => {
    const all = (data.billingActivities ?? []).filter((b) => b.status === "unbilled");
    if (!isBillingAdmin) {
      const myCustomerIds = new Set(customers.map((c) => c.id));
      return all.filter((b) => myCustomerIds.has(b.customerId) || b.userId === me.id);
    }
    if (selectedCustomerId !== "all") {
      return all.filter((b) => b.customerId === selectedCustomerId);
    }
    return all;
  }, [data.billingActivities, me.id, isBillingAdmin, customers, selectedCustomerId]);

  const invoices = useMemo(() => {
    const all = data.invoices ?? [];
    if (!isBillingAdmin) {
      const myCustomerIds = new Set(customers.map((c) => c.id));
      return all.filter((inv) => myCustomerIds.has(inv.customerId) || inv.userId === me.id);
    }
    if (selectedCustomerId !== "all") {
      return all.filter((inv) => inv.customerId === selectedCustomerId);
    }
    return all;
  }, [data.invoices, me.id, isBillingAdmin, customers, selectedCustomerId]);

  const totalUnbilledInr = unbilledActivities.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalInvoicedInr = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalPaidInr = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.grandTotal, 0);

  const handleGenerateInvoice = (customerId: string) => {
    const res = generateInvoiceFromUnbilled(data, customerId, me);
    if (typeof res === "string") {
      toast.error(res);
      return;
    }
    update(() => res.data);
    log(
      "aci_invoice_generated",
      "invoice",
      `Generated GST Tax Invoice ${res.invoice.invoiceNumber} (INR ${res.invoice.grandTotal.toLocaleString("en-IN")})`,
      res.invoice.id,
    );
    toast.success(`GST Tax Invoice ${res.invoice.invoiceNumber} generated`);
    setActiveTab("invoices");
  };

  const handlePayInvoice = (invoiceId: string) => {
    const inv = (data.invoices ?? []).find((i) => i.id === invoiceId);
    if (!inv) return;
    const paidAt = new Date().toISOString();
    const stripeId = `pi_3FlightLogger_${Date.now().toString(36)}`;
    update((d) => ({
      ...d,
      invoices: (d.invoices ?? []).map((i) =>
        i.id === invoiceId
          ? {
              ...i,
              status: "paid" as const,
              paidAt,
              stripePaymentIntentId: stripeId,
            }
          : i,
      ),
      customers: (d.customers ?? []).map((c) =>
        c.id === inv.customerId
          ? {
              ...c,
              accountBalance: Math.round((c.accountBalance + inv.grandTotal) * 100) / 100,
            }
          : c,
      ),
    }));
    log(
      "aci_invoice_paid",
      "invoice",
      `Settled GST Invoice ${inv.invoiceNumber} via Stripe (${stripeId})`,
      invoiceId,
    );
    toast.success("Invoice marked as Paid & Retainer ledger reconciled");
  };

  const handleTopUpRetainer = (customerId: string) => {
    const amt = Number(topUpAmount);
    if (!Number.isFinite(amt) || amt <= 0) {
      toast.error("Enter a valid positive INR top-up amount");
      return;
    }
    update((d) => ({
      ...d,
      customers: (d.customers ?? []).map((c) =>
        c.id === customerId ? { ...c, accountBalance: c.accountBalance + amt } : c,
      ),
    }));
    log(
      "customer_retainer_topup",
      "invoice",
      `Credited ₹${amt.toLocaleString("en-IN")} retainer deposit to ${customerId}`,
      customerId,
    );
    toast.success(`Added ${formatInr(amt)} to student retainer balance`);
  };

  const handleDownloadInvoicePdf = (invoiceId: string) => {
    const inv = (data.invoices ?? []).find((i) => i.id === invoiceId);
    if (!inv) return;
    const cust = (data.customers ?? []).find((c) => c.id === inv.customerId);

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    doc.setFillColor(12, 19, 36);
    doc.rect(0, 0, 210, 36, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("SILVERARROWS AVIATION ACADEMY — TAX INVOICE", 14, 15);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("DGCA / EASA Approved ATO • GSTIN: 06AABCS1429B1Z5 • Automated Customer Invoicing (ACI)", 14, 22);
    doc.text(`Invoice #: ${inv.invoiceNumber}   |   Issued: ${inv.issueDate}   |   Due: ${inv.dueDate}`, 14, 29);

    doc.setTextColor(20, 30, 50);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`Billed To: ${cust?.billingName ?? inv.customerId}`, 14, 46);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
      `Customer GSTIN: ${cust?.gstin || "Unregistered / B2C"}   |   Place of Supply: ${cust?.stateCode ?? "07"} (${inv.igstTotal > 0 ? "Inter-State IGST" : "Intra-State CGST+SGST"})`,
      14,
      52,
    );
    doc.text(
      `Status: ${inv.status.toUpperCase()}${inv.stripePaymentIntentId ? ` (${inv.stripePaymentIntentId})` : ""}`,
      14,
      58,
    );

    autoTable(doc, {
      startY: 64,
      head: [["Description", "SAC Code", "Qty", "Unit Rate (INR)", "Taxable (INR)", "GST (INR)", "Total (INR)"]],
      body: inv.items.map((it) => [
        it.description,
        it.sacCode,
        it.quantity.toFixed(2),
        it.unitPrice.toLocaleString("en-IN"),
        it.subtotalAmount.toLocaleString("en-IN"),
        (it.cgstAmount + it.sgstAmount + it.igstAmount).toLocaleString("en-IN"),
        it.totalAmount.toLocaleString("en-IN"),
      ]),
      styles: { fontSize: 8, cellPadding: 2.5 },
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    });

    const finalY = ((doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY ?? 130) + 8;
    doc.setFont("helvetica", "bold");
    doc.text(`Taxable Subtotal: INR ${inv.subtotalAmount.toLocaleString("en-IN")}`, 120, finalY);
    doc.text(`CGST (9%): INR ${inv.cgstTotal.toLocaleString("en-IN")}`, 120, finalY + 6);
    doc.text(`SGST (9%): INR ${inv.sgstTotal.toLocaleString("en-IN")}`, 120, finalY + 12);
    doc.text(`IGST (18%): INR ${inv.igstTotal.toLocaleString("en-IN")}`, 120, finalY + 18);
    doc.setFontSize(11);
    doc.text(`Grand Total: INR ${inv.grandTotal.toLocaleString("en-IN")}`, 120, finalY + 26);

    doc.save(`${inv.invoiceNumber}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-300">
              FlightLogger ACI Engine
            </Badge>
            <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-300">
              Indian GST SAC 999293 / 996751
            </Badge>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            Automated Customer Invoicing (ACI) & Retainer Ledger
          </h1>
          <p className="text-sm text-muted-foreground">
            Post-flight atomic tach/block deltas automatically create unbilled line items, calculate CGST/SGST/IGST, and reconcile customer accounts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(["queue", "invoices", "customers", "pricelists"] as const).map((tab) => (
            <Button
              key={tab}
              size="sm"
              variant={activeTab === tab ? "default" : "outline"}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "queue" && "Unbilled Queue"}
              {tab === "invoices" && "GST Tax Invoices"}
              {tab === "customers" && "Customer Retainers"}
              {tab === "pricelists" && "Price Lists"}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Summary Strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Unbilled Flight Queue</span>
              <Clock className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-amber-300">{formatInr(totalUnbilledInr)}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              {unbilledActivities.length} atomic post-flight billing items
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Total GST Invoiced</span>
              <Receipt className="h-4 w-4 text-sky-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-sky-300">{formatInr(totalInvoicedInr)}</div>
            <div className="mt-1 text-xs text-muted-foreground">{invoices.length} GST invoices issued</div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Total Settled / Paid</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-emerald-300">{formatInr(totalPaidInr)}</div>
            <div className="mt-1 text-xs text-muted-foreground">Stripe & Retainer settlements</div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Active Customer Ledgers</span>
              <Wallet className="h-4 w-4 text-purple-400" />
            </div>
            <div className="mt-2 text-2xl font-bold">{customers.length}</div>
            <div className="mt-1 text-xs text-muted-foreground">SAC 999293 GST profiles</div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Filter */}
      {isBillingAdmin && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-card/40 p-3">
          <span className="text-xs font-medium text-muted-foreground">Filter Customer Account:</span>
          <Button
            size="sm"
            variant={selectedCustomerId === "all" ? "default" : "outline"}
            onClick={() => setSelectedCustomerId("all")}
          >
            All Customers ({customers.length})
          </Button>
          {customers.map((c) => (
            <Button
              key={c.id}
              size="sm"
              variant={selectedCustomerId === c.id ? "default" : "outline"}
              onClick={() => setSelectedCustomerId(c.id)}
            >
              {c.billingName}
            </Button>
          ))}
        </div>
      )}

      {activeTab === "queue" && (
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Unbilled Flight & Instruction Activities</CardTitle>
              <CardDescription>
                Automatically populated by <code className="text-xs">fn_register_flight</code> when an instructor signs off a flight.
              </CardDescription>
            </div>
            {isBillingAdmin && selectedCustomerId !== "all" && unbilledActivities.length > 0 && (
              <Button size="sm" onClick={() => handleGenerateInvoice(selectedCustomerId)}>
                <FileText className="mr-1.5 h-4 w-4" />
                Generate GST Invoice for Selected Customer
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {unbilledActivities.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
                No unbilled flight activities pending. Complete a post-flight CBTA debrief or select a customer with unbilled flights.
              </div>
            ) : (
              <div className="space-y-3">
                {unbilledActivities.map((act) => {
                  const cust = (data.customers ?? []).find((c) => c.id === act.customerId);
                  return (
                    <div
                      key={act.id}
                      className="flex flex-col justify-between gap-3 rounded-lg border border-border/60 bg-background/50 p-3.5 sm:flex-row sm:items-center"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">{act.description}</span>
                          <Badge variant="outline" className="text-[11px]">
                            SAC {act.sacCode}
                          </Badge>
                          <Badge variant="secondary" className="text-[11px]">
                            GST {act.gstRatePercent}%
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Customer: <span className="text-foreground">{cust?.billingName ?? act.customerId}</span> •{" "}
                          Qty: {act.quantity} {act.unit} × {formatInr(act.unitPrice)} • Tax:{" "}
                          {formatInr(act.cgstAmount + act.sgstAmount + act.igstAmount)}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-bold text-amber-300">{formatInr(act.totalAmount)}</div>
                          <div className="text-[11px] text-muted-foreground">
                            Taxable: {formatInr(act.subtotalAmount)}
                          </div>
                        </div>
                        {isBillingAdmin && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGenerateInvoice(act.customerId)}
                          >
                            Batch into Invoice
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "invoices" && (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Issued GST Tax Invoices</CardTitle>
            <CardDescription>
              Download official SAC-coded GST PDF invoices or settle balances via Stripe / Student Retainer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {invoices.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
                No GST invoices generated yet. Convert unbilled activities from the Unbilled Queue tab.
              </div>
            ) : (
              invoices.map((inv) => {
                const cust = (data.customers ?? []).find((c) => c.id === inv.customerId);
                return (
                  <div
                    key={inv.id}
                    className="flex flex-col justify-between gap-4 rounded-lg border border-border/60 bg-background/50 p-4 sm:flex-row sm:items-center"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm font-bold">{inv.invoiceNumber}</span>
                        <Badge
                          variant={inv.status === "paid" ? "default" : "outline"}
                          className={
                            inv.status === "paid"
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                              : "border-amber-500/40 text-amber-300"
                          }
                        >
                          {inv.status.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Issued {inv.issueDate} • Due {inv.dueDate}
                        </span>
                      </div>
                      <div className="text-sm font-medium">{cust?.billingName ?? inv.customerId}</div>
                      <div className="text-xs text-muted-foreground">
                        Taxable: {formatInr(inv.subtotalAmount)} | CGST: {formatInr(inv.cgstTotal)} | SGST:{" "}
                        {formatInr(inv.sgstTotal)} | IGST: {formatInr(inv.igstTotal)}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="mr-2 text-right">
                        <div className="text-base font-bold">{formatInr(inv.grandTotal)}</div>
                        <div className="text-[11px] text-muted-foreground">Grand Total (incl. GST)</div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleDownloadInvoicePdf(inv.id)}>
                        <Download className="mr-1.5 h-3.5 w-3.5" />
                        GST PDF
                      </Button>
                      {inv.status !== "paid" && (
                        <Button size="sm" onClick={() => handlePayInvoice(inv.id)}>
                          <CreditCard className="mr-1.5 h-3.5 w-3.5" />
                          Settle (Stripe / Retainer)
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "customers" && (
        <div className="grid gap-4 md:grid-cols-2">
          {customers.map((cust) => {
            const custUnbilled = (data.billingActivities ?? []).filter(
              (b) => b.customerId === cust.id && b.status === "unbilled",
            );
            return (
              <Card key={cust.id} className="border-border/60">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-sky-400" />
                        {cust.billingName}
                      </CardTitle>
                      <CardDescription>
                        {cust.customerNumber} • {cust.billingEmail}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">State Code: {cust.stateCode}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/40 p-3 text-xs">
                    <div>
                      <div className="text-muted-foreground">Retainer Balance</div>
                      <div className="mt-0.5 text-base font-bold text-emerald-400">
                        {formatInr(cust.accountBalance)}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Credit Limit</div>
                      <div className="mt-0.5 text-base font-semibold">
                        {formatInr(cust.creditLimit)}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Payment Terms</div>
                      <div className="mt-0.5 font-medium">{cust.paymentTermsDays} Days Net</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Unbilled Activities</div>
                      <div className="mt-0.5 font-medium">{custUnbilled.length} items</div>
                    </div>
                  </div>

                  {isBillingAdmin && (
                    <div className="flex items-end gap-2">
                      <div className="flex-1 space-y-1">
                        <Label className="text-xs">Top-Up Retainer Deposit (INR)</Label>
                        <Input
                          type="number"
                          value={topUpAmount}
                          onChange={(e) => setTopUpAmount(e.target.value)}
                          className="h-8 text-xs"
                        />
                      </div>
                      <Button size="sm" onClick={() => handleTopUpRetainer(cust.id)}>
                        <IndianRupee className="mr-1 h-3.5 w-3.5" />
                        Credit Retainer
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === "pricelists" && (
        <div className="space-y-4">
          {(data.priceLists ?? []).map((pl) => {
            const items = (data.priceListItems ?? []).filter((i) => i.priceListId === pl.id);
            return (
              <Card key={pl.id} className="border-border/60">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Layers className="h-4 w-4 text-amber-400" />
                        {pl.name}
                      </CardTitle>
                      <CardDescription>
                        Currency: {pl.currency} • Effective: {pl.effectiveFrom}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{items.length} Tariff Rules</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-lg border border-border/60 bg-background/50 p-3 text-xs"
                      >
                        <div className="flex items-center justify-between font-medium">
                          <span>{item.title}</span>
                          <Badge variant="secondary" className="text-[10px]">
                            {item.itemType.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="mt-2 text-base font-bold text-sky-300">
                          {formatInr(item.unitPrice)}
                        </div>
                        <div className="mt-1 text-muted-foreground">
                          SAC {item.sacCode} • GST {item.gstRatePercent}%
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
