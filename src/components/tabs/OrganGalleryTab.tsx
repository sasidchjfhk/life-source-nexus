
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

const OrganGalleryTab = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Organ Donation Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* Kidney */}
        <Card className="hover:shadow-lg transition-all">
          <div className="aspect-square bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-16 w-16 text-red-600">
              <path fill="currentColor" d="M12,2C7,2 4,6 4,9C4,13 6,15 8,15C9,15 10,14 10,13C10,12 9,11 8,11C7,11 6,12 6,14C6,15.8 7.2,18 12,18C16.8,18 18,15.8 18,14C18,12 17,11 16,11C15,11 14,12 14,13C14,14 15,15 16,15C18,15 20,13 20,9C20,6 17,2 12,2Z" />
            </svg>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold">Kidney</h3>
            <p className="text-sm text-muted-foreground">Most common transplant</p>
          </CardContent>
        </Card>
        
        {/* Liver */}
        <Card className="hover:shadow-lg transition-all">
          <div className="aspect-square bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-16 w-16 text-amber-600">
              <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
            </svg>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold">Liver</h3>
            <p className="text-sm text-muted-foreground">Second most needed organ</p>
          </CardContent>
        </Card>
        
        {/* Heart */}
        <Card className="hover:shadow-lg transition-all">
          <div className="aspect-square bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-900/30 dark:to-rose-800/30 flex items-center justify-center">
            <Heart className="h-16 w-16 text-rose-600" />
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold">Heart</h3>
            <p className="text-sm text-muted-foreground">Life-saving transplant</p>
          </CardContent>
        </Card>
        
        {/* Lungs */}
        <Card className="hover:shadow-lg transition-all">
          <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-16 w-16 text-blue-600">
              <path fill="currentColor" d="M15.5,15.38V8.62L18.88,5.24C19.5,6.33 20,7.5 20,9C20,11.53 18.39,14.19 15.5,15.38M14.5,11.88C14.5,10.5 13.5,8.5 12.5,8.5C11.5,8.5 10.5,10.5 10.5,11.88C10.5,13.25 11.5,15.25 12.5,15.25C13.5,15.25 14.5,13.25 14.5,11.88M8.5,15.38C5.61,14.19 4,11.53 4,9C4,7.5 4.5,6.33 5.12,5.24L8.5,8.62V15.38M21.25,4.25C22.5,6 23,7.5 23,9C23,13 19.5,16.5 15.5,17.5V20H13V16.88C12.84,16.91 12.67,16.94 12.5,16.94C12.33,16.94 12.16,16.91 12,16.88V20H9.5V17.5C5.5,16.5 2,13 2,9C2,7.5 2.5,6 3.75,4.25L7.62,8.12V15C8,16 9,18 10,18C10.47,18 12,16.8 12.5,15.75C13,16.8 14.53,18 15,18C16,18 17,16 17.38,15V8.12L21.25,4.25Z" />
            </svg>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold">Lungs</h3>
            <p className="text-sm text-muted-foreground">Essential respiratory organ</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrganGalleryTab;
