import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import InfoIcon from "@mui/icons-material/Info"
import { DeleteForeverTwoTone } from '@mui/icons-material';


function AdminPage(){
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
          field: 'fullName',
          headerName: 'Full name',
          width: 150,
          editable: true,
        },
        {
          field: 'title',
          headerName: 'Title',
          width: 150,
          editable: true,
        },

        {
            field: 'date',
            headerName: 'Date',
            width: 150,
            editable: true,
        },
        {
            field: 'time',
            headerName: 'Time',
            width: 150,
            editable: true,
        },
        {
            field: 'location',
            headerName: 'Location',
            width: 150,
            editable: true,
        },
        {
            field: 'media',
            headerName: 'Media',
            width: 100,
            editable: true,
        },
        {
            field: "actions",
            headerName: "Actions",
            sortable: false,
            width: 150,
            renderCell: (params) => (
              <div>
                <button
                  onClick={() => (params.row)}
                  style={{
                    cursor: "pointer",
                    marginRight: "5px",
                    backgroundColor: "hsl(60, 73%, 98%)",
                  }}
                >
                  <InfoIcon />
                </button>
                </div>
        )},
        {
            field: "delete",
            headerName: "Delete",
            sortable: false,
            width: 150,
            renderCell: (params) => (
              <div>
                <button
                  onClick={() => (params.row)}
                  style={{
                    cursor: "pointer",
                    marginRight: "5px",
                    backgroundColor: "hsl(60, 73%, 98%)",
                  }}
                >
                  <DeleteForeverTwoTone />
                </button>
                </div>
        )},
      ];
      
      const rows = [
        { id: 1, fullName: 'Jon', title: 'Cool Title', date: '2/22/24', time: '11:30 am', location: 'Minneapolis', media:'📷',},
        { id: 2, fullName: 'Cersei', title: 'Cool Title', date: '2/22/24', time: '11:30 am', location: 'Minneapolis', media:'📷' },
        { id: 3, fullName: 'Jaime', title: 'Cool Title', date: '2/22/24', time: '11:30 am', location: 'Minneapolis', media:'📷' },
        { id: 4, fullName: 'Arya', title: 'Cool Title', date: '2/22/24', time: '11:30 am', location: 'Minneapolis', media:'📷' },
        { id: 5, fullName: 'Daenerys', title: 'Cool Title', date: '2/22/24', time: '11:30 am', location: 'Minneapolis', media:'📷' },
  
      ];
    return(
        <div>
            <h2>This is the Admin view</h2>
        <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
      <Button>Make All Private</Button>
      <Button>Make All Public</Button>
      </div>
    )
}
export default AdminPage