import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetStatsSummary, useGetRecentRegistrations } from "@workspace/api-client-react";
import { Users, UserCheck, IndianRupee, Activity, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { data: stats, isLoading: statsLoading } = useGetStatsSummary();
  const { data: recentRegs, isLoading: recentLoading } = useGetRecentRegistrations();

  const getCategoryBadge = (category: string) => {
    switch(category) {
      case 'junior': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Junior U-14</Badge>;
      case 'senior': return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Senior U-19</Badge>;
      case 'elite': return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Elite Open</Badge>;
      default: return <Badge>{category}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-serif font-bold text-foreground">Academy Dashboard</h2>
            <p className="text-muted-foreground mt-1">Overview of registrations and fee collection.</p>
          </div>
          <Button onClick={() => setLocation("/")} className="bg-secondary hover:bg-secondary/90 text-white shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> New Registration
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-sm border-t-4 border-t-primary">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Students</CardTitle>
              <Users className="h-5 w-5 text-primary/70" />
            </CardHeader>
            <CardContent>
              {statsLoading ? <Skeleton className="h-8 w-20" /> : (
                <div className="text-3xl font-bold font-mono">{stats?.totalStudents || 0}</div>
              )}
            </CardContent>
          </Card>
          <Card className="shadow-sm border-t-4 border-t-green-500">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Students</CardTitle>
              <UserCheck className="h-5 w-5 text-green-500/70" />
            </CardHeader>
            <CardContent>
              {statsLoading ? <Skeleton className="h-8 w-20" /> : (
                <div className="text-3xl font-bold font-mono">{stats?.activeStudents || 0}</div>
              )}
            </CardContent>
          </Card>
          <Card className="shadow-sm border-t-4 border-t-accent">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Fees Collected</CardTitle>
              <IndianRupee className="h-5 w-5 text-accent/70" />
            </CardHeader>
            <CardContent>
              {statsLoading ? <Skeleton className="h-8 w-20" /> : (
                <div className="text-3xl font-bold font-mono">₹{stats?.totalFeesCollected?.toLocaleString() || 0}</div>
              )}
            </CardContent>
          </Card>
          <Card className="shadow-sm border-t-4 border-t-blue-500">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">New This Month</CardTitle>
              <Activity className="h-5 w-5 text-blue-500/70" />
            </CardHeader>
            <CardContent>
              {statsLoading ? <Skeleton className="h-8 w-20" /> : (
                <div className="text-3xl font-bold font-mono">{stats?.thisMonthRegistrations || 0}</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-sm h-full">
              <CardHeader>
                <CardTitle>Recent Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                {recentLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Batch</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentRegs?.length ? recentRegs.map((reg) => (
                          <TableRow key={reg.id}>
                            <TableCell className="font-medium">{reg.studentName}</TableCell>
                            <TableCell>{getCategoryBadge(reg.category)}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{reg.batchTiming}</TableCell>
                            <TableCell className="text-right">
                              <Link href={`/receipt/${reg.id}`}>
                                <Button variant="ghost" size="sm">View Receipt</Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        )) : (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                              No registrations found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="shadow-sm h-full">
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <Skeleton className="h-48 w-full" />
                ) : (
                  <div className="space-y-6 mt-2">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">Junior U-14</span>
                        <span className="font-mono font-bold">{stats?.juniorCount || 0}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: `${stats?.totalStudents ? ((stats.juniorCount || 0) / stats.totalStudents) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">Senior U-19</span>
                        <span className="font-mono font-bold">{stats?.seniorCount || 0}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 rounded-full" 
                          style={{ width: `${stats?.totalStudents ? ((stats.seniorCount || 0) / stats.totalStudents) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">Elite Open</span>
                        <span className="font-mono font-bold">{stats?.eliteCount || 0}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500 rounded-full" 
                          style={{ width: `${stats?.totalStudents ? ((stats.eliteCount || 0) / stats.totalStudents) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
