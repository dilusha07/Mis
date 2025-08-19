import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface CustomDeleteModelProps {
  onDelete: () => void;
  triggerLabel?: string | React.ReactNode;
  className?: string;
}

export const CustomDeleteModel = ({ onDelete, triggerLabel = "Delete", className }: CustomDeleteModelProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          className={className}
          variant="outline"
        >
          {typeof triggerLabel === 'string' ? (
            <>
              <Trash2 size={18} className="mr-2" />
              {triggerLabel}
            </>
          ) : (
            triggerLabel
          )}
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Confirmation</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this item? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
