import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InfoCardProps {
  title: string;
  value: string;
  color: string;
  icon: React.ReactNode;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, value, color, icon }) => (
  <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" style={{ backgroundColor: color }}>
      <CardTitle className="text-sm font-medium text-white">{title}</CardTitle>
      <div className="text-white">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold mt-2">{value}</div>
    </CardContent>
  </Card>
);