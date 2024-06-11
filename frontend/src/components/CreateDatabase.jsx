// src/components/CreateDatabase.js

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


const CreateDatabase = ({ onCreate, setAlert }) => {
  const [dbName, setDbName] = useState('');
  const [isOpen, setIsOpen] = useState(false);  // Add state to control dialog visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5001/create-database', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dbName }),
    });
    const data = await response.json();
    if (response.ok) {
      onCreate(dbName);
      localStorage.setItem('dbName', dbName);
      setDbName('');
      setIsOpen(false);  // Close the dialog
      showAlert('success', 'Database created successfully!');
    } else {
      setIsOpen(false);  // Close the dialog
      showAlert('error', data.error || 'Failed to create database');
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
        <DialogTrigger> <Button onClick={() => setIsOpen(true)}>Create Database</Button></DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Please Enter Database Name</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
            <Input 
             type="text"
             value={dbName}
             onChange={(e) => setDbName(e.target.value)}
             placeholder="Enter database name"
             required
             className="mb-10 mt-10"
             />
            <Button type="submit" className="bg-blue-700 active:bg-blue-900 hover:bg-blue-900">Create</Button>
            </form>
            
        </DialogContent>
        </Dialog>
    </>
   
  );
};

export default CreateDatabase;
