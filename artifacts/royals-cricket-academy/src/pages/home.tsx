import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateRegistration, useGenerateReceipt } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

const formSchema = z.object({
  studentName: z.string().min(2, "Name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  parentName: z.string().min(2, "Parent/Guardian name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().min(5, "Address is required"),
  category: z.enum(["junior", "senior", "elite"]),
  batchTiming: z.string().min(1, "Batch timing is required"),
  registrationFee: z.coerce.number().min(0),
  monthlyFee: z.coerce.number().min(0),
  paymentMode: z.enum(["cash", "upi", "bank_transfer", "cheque"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function Home() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const createRegistration = useCreateRegistration();
  const generateReceipt = useGenerateReceipt();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: "",
      dateOfBirth: "",
      gender: "",
      parentName: "",
      phone: "",
      email: "",
      address: "",
      category: "junior",
      batchTiming: "Morning 6-8am",
      registrationFee: 500,
      monthlyFee: 1500,
      paymentMode: "upi",
    },
  });

  const category = form.watch("category");

  useEffect(() => {
    let regFee = 500;
    let monFee = 1500;
    if (category === "senior") {
      regFee = 750;
      monFee = 2000;
    } else if (category === "elite") {
      regFee = 1000;
      monFee = 3000;
    }
    form.setValue("registrationFee", regFee);
    form.setValue("monthlyFee", monFee);
  }, [category, form]);

  const onSubmit = async (values: FormValues) => {
    createRegistration.mutate({
      data: {
        studentName: values.studentName,
        dateOfBirth: values.dateOfBirth,
        gender: values.gender,
        parentName: values.parentName,
        phone: values.phone,
        email: values.email || undefined,
        address: values.address,
        category: values.category,
        batchTiming: values.batchTiming,
        registrationFee: values.registrationFee,
        monthlyFee: values.monthlyFee,
        paymentMode: values.paymentMode
      }
    }, {
      onSuccess: (reg) => {
        toast({ title: "Registration Successful", description: "Generating fee receipt..." });
        
        generateReceipt.mutate({
          data: {
            registrationId: reg.id,
            feeType: "registration",
            amount: reg.registrationFee,
            paymentMode: values.paymentMode,
            paymentDate: new Date().toISOString().split('T')[0],
            notes: "Initial Registration Fee"
          }
        }, {
          onSuccess: () => {
            setLocation(`/receipt/${reg.id}`);
          },
          onError: () => {
            toast({ title: "Receipt Error", description: "Registration saved, but failed to generate receipt.", variant: "destructive" });
            setLocation("/dashboard");
          }
        });
      },
      onError: (err) => {
        toast({ title: "Registration Failed", description: err?.message || "Please check your input.", variant: "destructive" });
      }
    });
  };

  return (
    <Layout>
      <div className="bg-primary/5 py-12 flex-1">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-10 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">Player Registration Form</h2>
            <p className="text-muted-foreground text-lg">Join the legacy. Start your journey with Royals Cricket Academy.</p>
          </div>

          <Card className="shadow-lg border-t-4 border-t-secondary">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-xl">Admission Details</CardTitle>
              <CardDescription>Please fill all fields accurately. This information will be used for official academy records.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-secondary">Student Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="studentName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-secondary">Parent/Guardian Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="parentName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parent/Guardian Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Jane Doe" {...field} />
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
                              <Input placeholder="+91 9876543210" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address (Optional)</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="jane@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Residential Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Cricket Lane, Sport City" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-secondary">Academy Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="junior">Junior U-14</SelectItem>
                                <SelectItem value="senior">Senior U-19</SelectItem>
                                <SelectItem value="elite">Elite Open</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="batchTiming"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Batch Timing</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select timing" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Morning 6-8am">Morning 6-8am</SelectItem>
                                <SelectItem value="Evening 4-6pm">Evening 4-6pm</SelectItem>
                                <SelectItem value="Weekend 8-10am">Weekend 8-10am</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 bg-muted/30 p-4 rounded-lg border">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-secondary">Fee & Payment</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="registrationFee"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Registration Fee</FormLabel>
                            <FormControl>
                              <Input type="number" readOnly className="bg-muted font-mono font-medium" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="monthlyFee"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monthly Fee</FormLabel>
                            <FormControl>
                              <Input type="number" readOnly className="bg-muted font-mono font-medium" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="paymentMode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Mode</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select mode" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="upi">UPI</SelectItem>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                <SelectItem value="cheque">Cheque</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-white rounded-lg shadow-md"
                      disabled={createRegistration.isPending || generateReceipt.isPending}
                    >
                      {(createRegistration.isPending || generateReceipt.isPending) ? (
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing Registration...</>
                      ) : (
                        "Complete Registration & Generate Receipt"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
