// src/components/ShowTables.js

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button';

const ShowTables = ({ dbName, setAlert }) => {
  const [tables, setTables] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchTables = async () => {
    const response = await fetch(`http://localhost:5001/tables?dbName=${dbName}`);
    const data = await response.json();
    if (response.ok) {
      setTables(data);
    } else {
      showAlert('error', data.error || 'Something Went Wrong!');
    }
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
    // Fetch tables when dialog is opened
    fetchTables();
  };


  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 5000); // Hide the alert after 3000 milliseconds
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger><Button onClick={handleDialogOpen}>Show All Tables</Button></DialogTrigger>
        <DialogContent  open={dialogOpen} onClose={() => setDialogOpen(false)}>
            <DialogHeader>
            <DialogTitle>Tables: </DialogTitle>
            <DialogDescription>
            <ul className='p-5'>
              
            {tables.length === 0 ? (<li>N/A</li>) : ( tables.map((table) => (<li key={table}>{table}</li>)))}
            </ul>
            </DialogDescription>
            </DialogHeader>
        </DialogContent>
        </Dialog>

    </div>
  );
};

export default ShowTables;
