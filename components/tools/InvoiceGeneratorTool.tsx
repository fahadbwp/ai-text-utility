"use client";

import React, { useState } from "react";
import { ToolDefinition } from "@/data/toolsRegistry";
import { ToolShell } from "@/components/layouts/ToolShell";
import { jsPDF } from "jspdf";
import {
  Receipt,
  Download,
  Printer,
  Share2,
  Plus,
  Trash2,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Building2,
  User,
  Calendar,
  DollarSign,
} from "lucide-react";

interface InvoiceGeneratorToolProps {
  tool: ToolDefinition;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export const InvoiceGeneratorTool: React.FC<InvoiceGeneratorToolProps> = ({ tool }) => {
  // Business State
  const [businessName, setBusinessName] = useState("Alpha Tech & Retail Solutions");
  const [businessAddress, setBusinessAddress] = useState("123 Commercial Avenue, Suite 400");
  const [businessPhone, setBusinessPhone] = useState("+1 (555) 234-5678");
  const [businessEmail, setBusinessEmail] = useState("billing@alphatech.com");
  const [businessTaxId, setBusinessTaxId] = useState("TAX-987654321");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Client State
  const [clientName, setClientName] = useState("Acme Global Enterprises");
  const [clientAddress, setClientAddress] = useState("789 Business Blvd, New York, NY");
  const [clientPhone, setClientPhone] = useState("+1 (555) 987-6543");
  const [clientEmail, setClientEmail] = useState("accounts@acme.com");

  // Invoice Meta
  const [invoiceNumber, setInvoiceNumber] = useState("INV-2026-001");
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split("T")[0];
  });
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const [currencyCode, setCurrencyCode] = useState("USD");

  // Items
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", description: "Website Development & UI Design", quantity: 1, unitPrice: 1200 },
    { id: "2", description: "Cloud Infrastructure Setup & SSL", quantity: 1, unitPrice: 350 },
    { id: "3", description: "Monthly Technical Maintenance", quantity: 2, unitPrice: 150 },
  ]);

  // Adjustments
  const [discountPercent, setDiscountPercent] = useState<number>(5);
  const [taxPercent, setTaxPercent] = useState<number>(8);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [notes, setNotes] = useState("Thank you for your business! Please send payment within 14 days of invoice date.");
  const [bankDetails, setBankDetails] = useState("Bank: Chase Manhattan | Routing: 123456789 | Acct: 9876543210");

  const CURRENCIES = [
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
    { code: "GBP", symbol: "£" },
    { code: "PKR", symbol: "Rs" },
    { code: "INR", symbol: "₹" },
    { code: "AED", symbol: "د.إ" },
    { code: "CAD", symbol: "$" },
    { code: "AUD", symbol: "$" },
  ];

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxableAmount * taxPercent) / 100;
  const grandTotal = taxableAmount + taxAmount + shippingFee;

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        description: "New Item / Service",
        quantity: 1,
        unitPrice: 50,
      },
    ]);
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleDeleteItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoadSample = () => {
    setBusinessName("Karachi Electronics & General Store");
    setBusinessAddress("Shop 14, Main Commercial Market, Saddar");
    setBusinessPhone("+92 300 1234567");
    setBusinessEmail("contact@karachielectronics.pk");
    setBusinessTaxId("NTN-4892182-1");
    setClientName("Usman Tariq");
    setClientAddress("Flat 402, Block 5, Gulshan-e-Iqbal");
    setClientPhone("+92 321 7654321");
    setClientEmail("usman.tariq@gmail.com");
    setCurrencyCode("PKR");
    setCurrencySymbol("Rs");
    setInvoiceNumber("INV-8821");
    setDiscountPercent(10);
    setTaxPercent(0);
    setShippingFee(250);
    setItems([
      { id: "1", description: "Wireless Gaming Mouse RGB", quantity: 2, unitPrice: 3500 },
      { id: "2", description: "Mechanical Keyboard Blue Switch", quantity: 1, unitPrice: 8500 },
      { id: "3", description: "USB-C Fast Charging Cable 2M", quantity: 3, unitPrice: 800 },
    ]);
    setNotes("Warrenty claim requires presenting this original cash slip within 30 days.");
  };

  const handleReset = () => {
    setBusinessName("");
    setBusinessAddress("");
    setBusinessPhone("");
    setBusinessEmail("");
    setBusinessTaxId("");
    setClientName("");
    setClientAddress("");
    setClientPhone("");
    setClientEmail("");
    setItems([{ id: "1", description: "Sample Item", quantity: 1, unitPrice: 0 }]);
    setDiscountPercent(0);
    setTaxPercent(0);
    setShippingFee(0);
  };

  const generatePdf = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();

    // Use safe currency code for default Helvetica font to prevent Unicode glyph corruption
    const pdfCurrency = currencyCode === "INR" || currencyCode === "AED" ? currencyCode : currencySymbol;

    // Top Header Banner
    doc.setFillColor(30, 41, 59); // slate-800
    doc.rect(0, 0, pageWidth, 70, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 40, 45);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`#${invoiceNumber}`, pageWidth - 40, 35, { align: "right" });
    doc.text(`Date: ${invoiceDate}`, pageWidth - 40, 50, { align: "right" });

    // Business & Client Meta Details
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("FROM:", 40, 105);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(businessName || "Your Business Name", 40, 120);
    doc.text(businessAddress || "", 40, 133);
    doc.text(`Phone: ${businessPhone || "-"}`, 40, 146);
    doc.text(`Email: ${businessEmail || "-"}`, 40, 159);
    if (businessTaxId) doc.text(`Tax/NTN: ${businessTaxId}`, 40, 172);

    // Bill To
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("BILL TO:", 320, 105);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(clientName || "Client Name", 320, 120);
    doc.text(clientAddress || "", 320, 133);
    doc.text(`Phone: ${clientPhone || "-"}`, 320, 146);
    doc.text(`Email: ${clientEmail || "-"}`, 320, 159);
    doc.text(`Due Date: ${dueDate || "-"}`, 320, 172);

    // Table Header
    const tableTop = 205;
    doc.setFillColor(241, 245, 249); // slate-100
    doc.rect(40, tableTop, pageWidth - 80, 24, "F");

    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("ITEM / DESCRIPTION", 50, tableTop + 16);
    doc.text("QTY", 360, tableTop + 16, { align: "center" });
    doc.text(`PRICE (${pdfCurrency})`, 440, tableTop + 16, { align: "right" });
    doc.text(`TOTAL (${pdfCurrency})`, pageWidth - 50, tableTop + 16, { align: "right" });

    // Table Rows
    let currentY = tableTop + 24;
    doc.setFont("helvetica", "normal");

    items.forEach((item) => {
      currentY += 20;
      doc.text(item.description || "Item", 50, currentY);
      doc.text(item.quantity.toString(), 360, currentY, { align: "center" });
      doc.text(item.unitPrice.toLocaleString(), 440, currentY, { align: "right" });
      doc.text((item.quantity * item.unitPrice).toLocaleString(), pageWidth - 50, currentY, { align: "right" });

      // subtle separator line
      doc.setDrawColor(226, 232, 240);
      doc.line(40, currentY + 6, pageWidth - 40, currentY + 6);
    });

    // Summary Section
    const summaryTop = currentY + 30;
    const summaryX = pageWidth - 190;
    const valueX = pageWidth - 50;

    doc.setFontSize(9);
    doc.text("Subtotal:", summaryX, summaryTop);
    doc.text(`${pdfCurrency} ${subtotal.toLocaleString()}`, valueX, summaryTop, { align: "right" });

    if (discountPercent > 0) {
      doc.text(`Discount (${discountPercent}%):`, summaryX, summaryTop + 16);
      doc.text(`-${pdfCurrency} ${discountAmount.toLocaleString()}`, valueX, summaryTop + 16, { align: "right" });
    }

    if (taxPercent > 0) {
      doc.text(`Tax / VAT (${taxPercent}%):`, summaryX, summaryTop + 32);
      doc.text(`+${pdfCurrency} ${taxAmount.toLocaleString()}`, valueX, summaryTop + 32, { align: "right" });
    }

    if (shippingFee > 0) {
      doc.text("Shipping / Extra Fee:", summaryX, summaryTop + 48);
      doc.text(`+${pdfCurrency} ${shippingFee.toLocaleString()}`, valueX, summaryTop + 48, { align: "right" });
    }

    // Grand Total Box
    const totalBoxY = summaryTop + 65;
    doc.setFillColor(248, 250, 252);
    doc.rect(summaryX - 10, totalBoxY - 14, 160, 26, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text("Grand Total:", summaryX, totalBoxY + 3);
    doc.text(`${pdfCurrency} ${grandTotal.toLocaleString()}`, valueX, totalBoxY + 3, { align: "right" });

    // Notes and Terms
    if (notes || bankDetails) {
      const notesY = Math.max(summaryTop + 120, 680);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(71, 85, 105);
      doc.text("PAYMENT DETAILS & NOTES:", 40, notesY);
      doc.setFont("helvetica", "normal");
      if (bankDetails) doc.text(bankDetails, 40, notesY + 14);
      if (notes) doc.text(notes, 40, notesY + 28);
    }

    doc.save(`${invoiceNumber || "invoice"}.pdf`);
  };

  const handleWhatsAppShare = () => {
    const textSummary = `*INVOICE: ${invoiceNumber}*\nFrom: ${businessName}\nTo: ${clientName}\nDate: ${invoiceDate}\n\n*Items:*\n${items
      .map((i) => `• ${i.description} (x${i.quantity}) - ${currencySymbol}${i.unitPrice * i.quantity}`)
      .join("\n")}\n\n*Grand Total: ${currencySymbol}${grandTotal.toLocaleString()}*\n\n${notes}`;

    const url = `https://wa.me/?text=${encodeURIComponent(textSummary)}`;
    window.open(url, "_blank");
  };

  return (
    <ToolShell tool={tool}>
      <div className="w-full space-y-6">
        {/* Top Banner and Actions */}
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              Invoice & Slip Designer Options
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Customize billing items, tax, discounts, currency, and download PDF or print receipt.
            </p>
          </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleLoadSample}
            aria-label="Load sample invoice data"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700 cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Load Sample</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            aria-label="Reset invoice form"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-slate-500 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer"
            title="Clear Form"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Form */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-6">
        {/* Row 1: Business and Client Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100 dark:border-zinc-800">
          {/* Business Info (Seller) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-zinc-100">
              <Building2 className="w-4 h-4 text-violet-600" />
              <span>YOUR BUSINESS / SELLER DETAILS</span>
            </div>
            <div>
              <label htmlFor="business-name" className="text-[11px] text-slate-500 dark:text-zinc-400 block mb-1">
                Business / Shop Name
              </label>
              <input
                id="business-name"
                type="text"
                value={businessName}
                aria-label="Your Business or Shop Name"
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100"
              />
            </div>
            <div>
              <label htmlFor="business-address" className="text-[11px] text-slate-500 dark:text-zinc-400 block mb-1">
                Address & City
              </label>
              <input
                id="business-address"
                type="text"
                value={businessAddress}
                aria-label="Business Address and City"
                onChange={(e) => setBusinessAddress(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="business-phone" className="text-[11px] text-slate-500 dark:text-zinc-400 block mb-1">
                  Phone Number
                </label>
                <input
                  id="business-phone"
                  type="text"
                  value={businessPhone}
                  aria-label="Business Phone Number"
                  onChange={(e) => setBusinessPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100"
                />
              </div>
              <div>
                <label htmlFor="business-tax-id" className="text-[11px] text-slate-500 dark:text-zinc-400 block mb-1">
                  Tax / NTN / GST
                </label>
                <input
                  id="business-tax-id"
                  type="text"
                  value={businessTaxId}
                  aria-label="Tax, NTN, or GST ID"
                  onChange={(e) => setBusinessTaxId(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100"
                />
              </div>
            </div>
          </div>

          {/* Client Info (Buyer) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-zinc-100">
              <User className="w-4 h-4 text-violet-600" />
              <span>BILL TO / CLIENT DETAILS</span>
            </div>
            <div>
              <label htmlFor="client-name" className="text-[11px] text-slate-500 dark:text-zinc-400 block mb-1">
                Client / Customer Name
              </label>
              <input
                id="client-name"
                type="text"
                value={clientName}
                aria-label="Client or Customer Name"
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100"
              />
            </div>
            <div>
              <label htmlFor="client-address" className="text-[11px] text-slate-500 dark:text-zinc-400 block mb-1">
                Client Address
              </label>
              <input
                id="client-address"
                type="text"
                value={clientAddress}
                aria-label="Client Address"
                onChange={(e) => setClientAddress(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="client-phone" className="text-[11px] text-slate-500 dark:text-zinc-400 block mb-1">
                  Client Phone
                </label>
                <input
                  id="client-phone"
                  type="text"
                  value={clientPhone}
                  aria-label="Client Phone Number"
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100"
                />
              </div>
              <div>
                <label htmlFor="client-email" className="text-[11px] text-slate-500 dark:text-zinc-400 block mb-1">
                  Client Email
                </label>
                <input
                  id="client-email"
                  type="text"
                  value={clientEmail}
                  aria-label="Client Email Address"
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Invoice Meta & Currency Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800/80">
          <div>
            <label htmlFor="inv-num" className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 block mb-1">
              Invoice Number
            </label>
            <input
              id="inv-num"
              type="text"
              value={invoiceNumber}
              aria-label="Invoice Number"
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono"
            />
          </div>
          <div>
            <label htmlFor="inv-date" className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 block mb-1">
              Issue Date
            </label>
            <input
              id="inv-date"
              type="date"
              value={invoiceDate}
              aria-label="Invoice Issue Date"
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
            />
          </div>
          <div>
            <label htmlFor="inv-due" className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 block mb-1">
              Due Date
            </label>
            <input
              id="inv-due"
              type="date"
              value={dueDate}
              aria-label="Invoice Payment Due Date"
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
            />
          </div>
          <div>
            <label htmlFor="inv-curr" className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 block mb-1">
              Currency
            </label>
            <select
              id="inv-curr"
              value={currencyCode}
              aria-label="Invoice Currency Selector"
              onChange={(e) => {
                const code = e.target.value;
                setCurrencyCode(code);
                const found = CURRENCIES.find((c) => c.code === code);
                if (found) setCurrencySymbol(found.symbol);
              }}
              className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3: Line Items Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">
              LINE ITEMS & SERVICES
            </span>
            <button
              type="button"
              onClick={handleAddItem}
              aria-label="Add new item row to invoice"
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 hover:bg-violet-100 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-zinc-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-2.5 pl-3">Item Description</th>
                  <th className="p-2.5 w-20 text-center">Qty</th>
                  <th className="p-2.5 w-28 text-right">Unit Price</th>
                  <th className="p-2.5 w-28 text-right">Line Total</th>
                  <th className="p-2.5 w-12 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                {items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30">
                    <td className="p-2.5 pl-3">
                      <input
                        type="text"
                        value={item.description}
                        aria-label={item.description ? `Description for ${item.description}` : `Item description row ${index + 1}`}
                        onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                      />
                    </td>
                    <td className="p-2.5 text-center">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        aria-label={`Quantity row ${index + 1}`}
                        onChange={(e) =>
                          handleItemChange(item.id, "quantity", parseInt(e.target.value, 10) || 1)
                        }
                        className="w-16 px-1.5 py-1 text-xs text-center rounded border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                      />
                    </td>
                    <td className="p-2.5 text-right">
                      <input
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        aria-label={`Unit price row ${index + 1}`}
                        onChange={(e) =>
                          handleItemChange(item.id, "unitPrice", parseFloat(e.target.value) || 0)
                        }
                        className="w-24 px-1.5 py-1 text-xs text-right rounded border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                      />
                    </td>
                    <td className="p-2.5 text-right font-medium text-slate-900 dark:text-zinc-100 font-mono">
                      {currencySymbol} {(item.quantity * item.unitPrice).toLocaleString()}
                    </td>
                    <td className="p-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id)}
                        disabled={items.length <= 1}
                        aria-label={`Delete item row ${index + 1}`}
                        className="p-1 rounded text-slate-400 hover:text-red-500 disabled:opacity-30 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Row 4: Totals & Adjustments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-zinc-800">
          {/* Notes and Bank Details */}
          <div className="space-y-3">
            <div>
              <label htmlFor="inv-notes" className="text-[11px] font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                Payment Terms & Notes:
              </label>
              <textarea
                id="inv-notes"
                rows={2}
                value={notes}
                aria-label="Payment Terms and Client Notes"
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
              />
            </div>
            <div>
              <label htmlFor="inv-bank" className="text-[11px] font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                Bank / Wire / Payment Details:
              </label>
              <input
                id="inv-bank"
                type="text"
                value={bankDetails}
                aria-label="Bank, Wire, or Payment Details"
                onChange={(e) => setBankDetails(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-mono"
              />
            </div>
          </div>

          {/* Calculations Summary */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400">
              <span>Subtotal:</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-zinc-100">
                {currencySymbol} {subtotal.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 text-slate-600 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                Discount (%):
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercent}
                  aria-label="Discount percentage"
                  onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                  className="w-12 px-1 py-0.5 text-xs rounded border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-center"
                />
              </span>
              <span className="font-mono text-red-500">
                -{currencySymbol} {discountAmount.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 text-slate-600 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                Tax / VAT (%):
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={taxPercent}
                  aria-label="Tax or VAT percentage"
                  onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                  className="w-12 px-1 py-0.5 text-xs rounded border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-center"
                />
              </span>
              <span className="font-mono text-slate-700 dark:text-zinc-300">
                +{currencySymbol} {taxAmount.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 text-slate-600 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                Shipping / Fee:
                <input
                  type="number"
                  min="0"
                  value={shippingFee}
                  aria-label="Shipping or Extra Fee"
                  onChange={(e) => setShippingFee(parseFloat(e.target.value) || 0)}
                  className="w-16 px-1 py-0.5 text-xs rounded border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-center"
                />
              </span>
              <span className="font-mono text-slate-700 dark:text-zinc-300">
                +{currencySymbol} {shippingFee.toLocaleString()}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-sm font-bold text-slate-900 dark:text-zinc-100">
              <span>Grand Total:</span>
              <span className="text-base text-violet-600 dark:text-violet-400 font-mono">
                {currencySymbol} {grandTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Row 5: Action Export Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={handleWhatsAppShare}
            aria-label="Share invoice summary on WhatsApp"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share on WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            aria-label="Print physical receipt slip"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700 shadow-xs cursor-pointer transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt Slip</span>
          </button>

          <button
            type="button"
            onClick={generatePdf}
            aria-label="Download Invoice as PDF"
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-lg bg-violet-600 hover:bg-violet-700 text-white shadow-xs cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Invoice PDF</span>
          </button>
        </div>
      </div>
    </div>
  </ToolShell>
  );
};
