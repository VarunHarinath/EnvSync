import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

export default function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Delete Resource", 
  description = "This action cannot be undone.",
  requiredText,
  confirmLabel = "Delete",
  isLoading = false
}) {
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setUserInput('');
    }
  }, [isOpen]);

  const isConfirmed = userInput === requiredText;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm} 
            disabled={!isConfirmed || isLoading}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-start gap-4 p-3 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 text-sm">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p>{description}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm">
            To confirm deletion, please type <span className="font-bold underline">{requiredText}</span> in the box below.
          </p>
          <Input
            placeholder={requiredText}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="border-destructive/30 focus-visible:ring-destructive"
            autoFocus
          />
        </div>
      </div>
    </Modal>
  );
}
