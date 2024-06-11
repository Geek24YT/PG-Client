// src/App.js

import React, { useState } from 'react';
import CreateDatabase from './components/CreateDatabase';
import ShowTables from './components/ShowTables';
import ExecuteQuery from './components/ExecuteQuery';
import { Button } from './components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from './components/ui/textarea';
import AddExistingDatabase from './components/AddExistingDatabase';
import DeleteDatabase from './components/ResetDatabase';
import ResetDatabase from './components/ResetDatabase';

const App = () => {

  const [dbName, setDbName] = useState(() => {
    // Check if the database name exists in local storage
    const storedDbName = localStorage.getItem('dbName');
    // If the database name exists, return it; otherwise, return an empty string
    return storedDbName ? storedDbName : '';
  });

  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  return (
    <div>
      <div className="p-10 m-10 ">
      <Card >
        <CardHeader>
          <CardTitle><span className='text-blue-500'>PG Client</span> {`${dbName && '- '} ${dbName}`}</CardTitle>
          <AddExistingDatabase setDbName={setDbName} setAlert={setAlert} />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-1 text-center">
          <CreateDatabase onCreate={setDbName} setAlert={setAlert} />
          {dbName && <ShowTables dbName={dbName} setAlert={setAlert}/>}
          {dbName && <ResetDatabase dbName={dbName} setAlert={setAlert}/>}
          </div>
        </CardContent>
        <CardFooter>
          <div className='grid grid-cols-1 w-full mt-10'>
          {dbName && <ExecuteQuery setAlert={setAlert}  dbName={dbName} />}
          </div>     
        </CardFooter>
      </Card>

      <div className='mt-10'> 
      {alert.show && (
        <Alert style={{ borderColor: alert.type === 'success' ? 'green' : 'red' }}>
          <AlertTitle>{alert.type === 'success' ? 'Success!' : 'Error!'}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}
      </div>
      </div> 
    </div>
  );
};

export default App;
