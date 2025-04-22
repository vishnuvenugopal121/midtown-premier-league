import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminPinDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ADMIN_PIN = "2255";

export function AdminPinDialog({ isOpen, onClose, onSuccess }: AdminPinDialogProps) {
  const [pin, setPin] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin === ADMIN_PIN) {
      onSuccess();
      onClose();
      toast({
        title: "Admin mode activated",
        description: "You now have access to admin features",
      });
    } else {
      toast({
        title: "Invalid PIN",
        description: "Please try again with the correct PIN",
        variant: "destructive",
      });
      setPin("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Enter Admin PIN
          </DialogTitle>
          <DialogDescription>
            Please enter the PIN to access admin mode
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Enter PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="text-center text-lg tracking-widest"
            maxLength={4}
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Verify
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}