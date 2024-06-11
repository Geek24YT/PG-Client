// src/components/ExecuteQuery.js

import React, { useState } from 'react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const ExecuteQuery = ({ dbName, setAlert }) => {
  const [sql, setSql] = useState('');
  const [result, setResult] = useState(null);

  const sqlKeywords = [
    'SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'ON', 'GROUP', 'BY', 'ORDER', 'HAVING', 'UNION', 'ALL', 'DISTINCT', 'AS', 'INTO', 'VALUES', 'AND', 'OR', 'NOT', 'NULL', 'IS', 'IN', 'BETWEEN', 'LIKE', 'LIMIT', 'OFFSET', 'VARCHAR', 'INTEGER', 'CREATE', 'TABLE'
  ];

  const formatSql = (input) => {
    const regex = new RegExp(`\\b(${sqlKeywords.join('|')})\\b`, 'gi');
    return input.replace(regex, match => match.toUpperCase());
  };

  const handleChange = (e) => {
    const input = e.target.value;
    const formattedSql = formatSql(input);
    setSql(formattedSql);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5001/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql, dbName }),
    });
    const data = await response.json();
    if (response.ok) {
      setResult(data);
    } else {
      showAlert('error', data.error || 'Something Went Wrong!');
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 5000); // Hide the alert after 3000 milliseconds
  };

  // Function to render table dynamically
  const renderTable = () => {
    if (Array.isArray(result)) {
      const headers = Object.keys(result[0]);
      return (
        <Table className="mt-10">
          {/* <TableCaption>Table</TableCaption> */}
            <TableHeader>
              <TableRow>
                  {headers.map(header => (
                  <TableHead className="w-[100px]" key={header}><strong>{header}</strong></TableHead>
                  ))}
              </TableRow>
            </TableHeader>
      
            <TableBody>
              {result.map((row, index) => (
               <TableRow key={index}>
               {headers.map(header => (
                 <TableCell key={header}>{row[header]}</TableCell>
               ))}
             </TableRow>
              ))}
            </TableBody>
      </Table>
      );
    }
    return null;
  };

  const renderResult = () => {
    if (!result) return null;
  
    if (result) {
      if (Array.isArray(result)) {
        // Render table
        return renderTable();
      } else {
        // Render message
        return <pre>{result.message}</pre>;
      }
    }
    return null;
  };

  return (
    <form onSubmit={handleSubmit}>
      <Textarea className="text-xl"
       value={sql}
       onChange={handleChange}
       placeholder="Enter Query"
       required
       />

      <Button type="submit" className="w-40 mt-5 bg-blue-500 active:bg-blue-700 hover:bg-blue-700">Run</Button>

      {result && renderResult()}
    </form>
  );
};

export default ExecuteQuery;
