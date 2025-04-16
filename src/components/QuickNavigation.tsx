
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const QuickNavigation = () => {
  return (
    <div className="bg-secondary/10 rounded-lg p-6 border border-border/50">
      <h3 className="text-xl font-bold mb-4 text-center">Quick Navigation</h3>
      <div className="flex flex-wrap gap-2 justify-center">
        <Button asChild variant="outline" size="sm">
          <Link to="/">Home</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/register">Register</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/donor-registration">Donor Registration</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/donor-dashboard">Donor Dashboard</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/hospital-dashboard">Hospital Dashboard</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/admin-dashboard">Admin Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default QuickNavigation;
