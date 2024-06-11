
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
import { Input } from './ui/input';
import { PlusIcon } from '@heroicons/react/24/solid'



const AddExistingDatabase = ({ setDbName, setAlert }) => {
  const [isOpen, setIsOpen] = useState(false);  // Add state to control dialog visibility
  const [dName, setDName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        // Assuming dbName is a state or variable containing the database name
        if (!dName) {
          throw new Error('Database name is required');
        }
    
        // Save the database name to local storage
        localStorage.setItem('dbName', dName);
    
        // Call onCreate to notify the parent component or perform any additional actions
        setDbName(dName);
    
        // Clear the database name input
        setDName('');
    
        // Close the dialog
        setIsOpen(false);
    
        // Show success alert
        showAlert('success', 'Database is ready to use!');
      } catch (error) {
        // Close the dialog in case of an error
        setIsOpen(false);
    
        // Show error alert
        showAlert('error', error.message || 'Failed to use database!');
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
        <DialogTrigger>  <PlusIcon className="size-6 text-blue-500" onClick={() => setIsOpen(true)} /></DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Please Enter Database Name</DialogTitle>           
            </DialogHeader>
            <form onSubmit={handleSubmit}>
            <Input 
             type="text"
             value={dName}
             onChange={(e) => setDName(e.target.value)}
             placeholder="Enter database name"
             required
             className="mb-10 mt-10"
             />
            <Button type="submit" className="bg-green-700 active:bg-green-900 hover:bg-green-900">Save</Button>
            </form>
        </DialogContent>
        </Dialog>
    </>
   
  );
};

export default AddExistingDatabase;
