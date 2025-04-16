
import { Card, CardContent } from "@/components/ui/card";
import { Hospital } from "lucide-react";

const HospitalsTab = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Partner Hospitals</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Hospital 1 */}
        <Card className="hover:shadow-lg transition-all">
          <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
            <Hospital className="h-16 w-16 text-blue-600" />
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold">City Medical Center</h3>
            <p className="text-sm text-muted-foreground mb-2">World-class transplant facility</p>
            <div className="flex justify-between text-sm">
              <span>New York, NY</span>
              <span className="text-green-600">Verified</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Hospital 2 */}
        <Card className="hover:shadow-lg transition-all">
          <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
            <Hospital className="h-16 w-16 text-blue-600" />
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold">St. John's Hospital</h3>
            <p className="text-sm text-muted-foreground mb-2">Specialized in kidney transplants</p>
            <div className="flex justify-between text-sm">
              <span>Chicago, IL</span>
              <span className="text-green-600">Verified</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Hospital 3 */}
        <Card className="hover:shadow-lg transition-all">
          <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
            <Hospital className="h-16 w-16 text-blue-600" />
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold">Mercy Health Clinic</h3>
            <p className="text-sm text-muted-foreground mb-2">Leading heart transplant center</p>
            <div className="flex justify-between text-sm">
              <span>Los Angeles, CA</span>
              <span className="text-green-600">Verified</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HospitalsTab;
