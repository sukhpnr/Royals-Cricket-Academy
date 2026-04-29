import { Layout } from "@/components/layout";
import { useParams, Link } from "wouter";
import { useGetRegistration, useGetReceiptsByRegistration, getGetRegistrationQueryKey, getGetReceiptsByRegistrationQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Printer, Download, ArrowLeft, Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Receipt() {
  const params = useParams();
  const id = params.registrationId ? parseInt(params.registrationId) : 0;

  const { data: reg, isLoading: regLoading } = useGetRegistration(id, {
    query: { enabled: !!id, queryKey: getGetRegistrationQueryKey(id) }
  });

  const { data: receipts, isLoading: receiptsLoading } = useGetReceiptsByRegistration(id, {
    query: { enabled: !!id, queryKey: getGetReceiptsByRegistrationQueryKey(id) }
  });

  const handlePrint = () => {
    window.print();
  };

  const latestReceipt = receipts?.[0]; // Assuming newest first or just need the first for display

  if (regLoading || receiptsLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-8 max-w-3xl">
          <Skeleton className="h-[600px] w-full rounded-xl" />
        </div>
      </Layout>
    );
  }

  if (!reg) {
    return (
      <Layout>
        <div className="container mx-auto p-8 text-center">
          <h2 className="text-2xl font-bold">Registration Not Found</h2>
          <Link href="/">
            <Button className="mt-4">Back to Home</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const displayCategory = {
    junior: "Junior U-14",
    senior: "Senior U-19",
    elite: "Elite Open"
  }[reg.category] || reg.category;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl flex-1 print:p-0 print:m-0 print:max-w-full">
        <div className="flex justify-between items-center mb-6 no-print">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft size={16} /> Back to Registration
            </Button>
          </Link>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2" onClick={handlePrint}>
              <Download size={16} /> Download
            </Button>
            <Button className="gap-2" onClick={handlePrint}>
              <Printer size={16} /> Print Receipt
            </Button>
          </div>
        </div>

        {/* Receipt Paper */}
        <div className="bg-white p-8 md:p-12 shadow-xl border rounded-sm relative overflow-hidden print:shadow-none print:border-none print:p-0">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-30deg]">
            <Trophy size={400} />
          </div>

          {/* Header */}
          <div className="border-b-2 border-primary pb-6 mb-8 flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary text-white p-4 rounded-lg">
                <Trophy size={40} />
              </div>
              <div>
                <h1 className="font-serif text-3xl font-bold text-primary">Royals Cricket Academy</h1>
                <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mt-1">Excellence in Sports</p>
                <p className="text-xs text-muted-foreground mt-1">123 Stadium Road, Sports Complex<br/>Contact: +91 98765 43210 | info@royalscricket.com</p>
              </div>
            </div>
            <div className="text-center md:text-right border-4 border-secondary/20 p-3 rounded text-secondary font-bold text-xl tracking-widest uppercase rotate-[-2deg] bg-white z-10">
              OFFICIAL RECEIPT
            </div>
          </div>

          <div className="flex justify-between mb-8 text-sm">
            <div className="space-y-1">
              <p><span className="text-muted-foreground font-medium w-24 inline-block">Receipt No:</span> <span className="font-mono font-bold text-base">{latestReceipt?.receiptNumber || reg.receiptNumber}</span></p>
              <p><span className="text-muted-foreground font-medium w-24 inline-block">Date:</span> <span className="font-mono">{formatDate(latestReceipt?.issuedAt || reg.registeredAt)}</span></p>
            </div>
            <div className="space-y-1 text-right">
              <p><span className="text-muted-foreground font-medium mr-2">Reg ID:</span> <span className="font-mono">{reg.id.toString().padStart(4, '0')}</span></p>
              <p><span className="text-muted-foreground font-medium mr-2">Payment Mode:</span> <span className="font-semibold uppercase">{latestReceipt?.paymentMode || reg.paymentMode}</span></p>
            </div>
          </div>

          {/* Student Details */}
          <div className="mb-8">
            <h3 className="bg-muted px-4 py-2 font-bold text-sm uppercase tracking-wider text-primary mb-4 rounded-sm">Student Information</h3>
            <div className="grid grid-cols-2 gap-y-4 px-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1 text-xs uppercase tracking-wider">Student Name</p>
                <p className="font-semibold text-base">{reg.studentName}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1 text-xs uppercase tracking-wider">Parent/Guardian</p>
                <p className="font-medium">{reg.parentName}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1 text-xs uppercase tracking-wider">Category</p>
                <p className="font-medium">{displayCategory}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1 text-xs uppercase tracking-wider">Batch Timing</p>
                <p className="font-medium">{reg.batchTiming}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1 text-xs uppercase tracking-wider">Contact</p>
                <p className="font-medium">{reg.phone}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1 text-xs uppercase tracking-wider">Status</p>
                <p className="font-medium uppercase tracking-wider text-green-600">{reg.status}</p>
              </div>
            </div>
          </div>

          {/* Fee Details */}
          <div className="mb-12">
            <h3 className="bg-muted px-4 py-2 font-bold text-sm uppercase tracking-wider text-primary mb-4 rounded-sm">Payment Details</h3>
            <table className="w-full text-sm">
              <thead className="border-b border-muted-foreground/20">
                <tr className="text-left text-muted-foreground">
                  <th className="py-3 px-4 font-medium uppercase tracking-wider">Description</th>
                  <th className="py-3 px-4 text-right font-medium uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted-foreground/10">
                {receipts && receipts.length > 0 ? (
                  receipts.map((r) => (
                    <tr key={r.id}>
                      <td className="py-4 px-4 font-medium">
                        {r.feeType === 'registration' ? 'Registration Fee' : 
                         r.feeType === 'monthly' ? `Monthly Coaching Fee ${r.month ? `(${r.month})` : ''}` : 
                         'Other Fee'}
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-medium">{formatCurrency(r.amount)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-4 px-4 font-medium">Registration Fee</td>
                    <td className="py-4 px-4 text-right font-mono font-medium">{formatCurrency(reg.registrationFee)}</td>
                  </tr>
                )}
              </tbody>
              <tfoot className="border-t-2 border-primary/20 bg-muted/20">
                <tr>
                  <td className="py-4 px-4 font-bold text-right">TOTAL PAID</td>
                  <td className="py-4 px-4 text-right font-mono font-bold text-lg text-primary">
                    {formatCurrency(receipts?.reduce((sum, r) => sum + r.amount, 0) || reg.registrationFee)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer / Signatures */}
          <div className="grid grid-cols-2 gap-8 mt-24 text-center text-sm">
            <div>
              <div className="border-t border-muted-foreground/30 w-48 mx-auto pt-2">
                <p className="font-semibold">Parent / Student Signature</p>
              </div>
            </div>
            <div>
              <div className="border-t border-muted-foreground/30 w-48 mx-auto pt-2">
                <p className="font-semibold text-primary">Authorized Signatory</p>
                <p className="text-xs text-muted-foreground">Royals Cricket Academy</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center text-xs text-muted-foreground border-t pt-4">
            <p>This is a computer generated receipt and does not require a physical stamp.</p>
            <p>Fees once paid are non-refundable and non-transferable.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
