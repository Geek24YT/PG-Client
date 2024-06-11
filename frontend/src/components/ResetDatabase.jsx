import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from './ui/button';

const ResetDatabase = ({dbName, setAlert }) => {
  const [isOpen, setIsOpen] = useState(false);  // Add state to control dialog visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5001/clear-database', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dbName }),
    });
    const data = await response.json();
    if (response.ok) {
      setIsOpen(false);  // Close the dialog
      showAlert('success', 'Database reset successfully!');
    } else {
      setIsOpen(false);  // Close the dialog
      showAlert('error', data.error || 'Failed to reset database');
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 5000); // Hide the alert after 3000 milliseconds
  };

  return (
    <>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger> <Button onClick={() => setIsOpen(true)}>Reset Database</Button></DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            </DialogHeader>

            <div className='text-center'>
            <form onSubmit={handleSubmit}>
            <Button type="submit" className="bg-red-700 active:bg-red-900 hover:bg-red-900">Reset Now</Button>
            </form>
            </div>
            
        </DialogContent>
        </Dialog>
    </>
   
  );
};

export default ResetDatabase;
